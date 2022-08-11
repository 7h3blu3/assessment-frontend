import { Component, OnInit, Inject, OnDestroy, HostListener  } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subscription, Observable } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { PendingChangesGuard } from 'src/app/pending-changes/guard';

import { UserService } from '../user.service';
import { userScenarios } from 'src/app/admin/userScenarios.model';
import { Scenarios } from 'src/app/admin/scenarios.model';
import { Users } from 'src/app/admin/users.model';
import Swal from 'sweetalert2';
import { HistoryLogService } from 'src/app/admin/history-log/history-log.service';

@Component({
  selector: 'app-assessment',
  templateUrl: './assessment.component.html',
  styleUrls: ['./assessment.component.css']
})
export class AssessmentComponent implements OnInit, OnDestroy {
  @HostListener('window:beforeunload')
  userEmail: string; scenarioTitle: string; scenarioLevel: string; scenarioMission: string; scenarioType: string; scenarioFinishdate: string;
  dataSubmited = false;
  historyContent: string;
  userId: string;
  timeLeft: number;
  interval;
  display;
  userIsAuthenticated = false;
  private authStatusSub: Subscription;
  isLoading = false;
  submittedData: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public userService: UserService, 
    private router: Router, 
    private authService: AuthService, 
    private historyLogSvc: HistoryLogService) { 
      this.submittedData = {};
      this.data = new userScenarios().deserialize({
      scenario: new Scenarios().deserialize({
       title: "",
       description: "",
      }),
      user:new Users().deserialize({
        submittedScenarios:
          {
            userResponse: '',
          }
      })
    })


  }

  canDeactivate(): Observable<boolean> | boolean {
    // insert logic to check if there are pending changes here;
    // returning true will navigate without confirmation
    // returning false will show a confirm dialog before navigating away
    if(!this.dataSubmited) {
       return false;
    }
    return true;
  }

  ngOnInit(): void {
    this.userId = this.authService.getUserId();
    this.setAuthentication();
    this.getAssessmentData()

    
  }

  getAssessmentData() {
    this.userService.getUserSubmission().subscribe(result => {
      console.log("result ", result)
      this.timeLeft = result.scenario.time
      this.data = result

    if (localStorage.getItem("assessmentExpiration") === null){
      this.setHistoryLogData(result);
      this.historyContent = "User " + result.user.email + " has started " + result.scenario.title + " - " + result.scenario.level + " - " 
    + result.scenario.mission + " - " + result.scenario.type + " at " + result.currentDate
    this.addHistoryLog(this.historyContent);
    }
    
    this.getCurrentTimeLeft();
    this.startTimer(this.timeLeft * 60);
    })
  }



  submittedScenariosData(data){
    var submittedData = {}
    submittedData["scenarioId"] = data.scenario._id;
    submittedData["userId"] = data.user._id;
    submittedData["scenarioTitle"] = data.scenario.title;
    submittedData["scenarioDescription"] = data.scenario.description;
    submittedData["userResponse"] = data.user.submittedScenarios.userResponse;
    submittedData["level"] = data.scenario.level;
    submittedData["mission"] = data.scenario.mission;

    return submittedData;
  }




  Submit(data){
    
    Swal.fire({
      title: 'Are you sure you want to submit your answers ?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: 'green',
      cancelButtonColor: '#3F51B5',
      confirmButtonText: 'Submit!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.dataSubmited = true;
        Swal.fire({
          title:'Submitted!',
          text:'Scenario has been successfully submitted!',
          icon:'success',
          confirmButtonColor: '#3F51B5',
        })
        var submittedData = this.submittedScenariosData(data)
        this.clearLocalStorageTimer();
        this.clearInterval();
        this.userService.submitInput(submittedData).subscribe(result  => {
          this.historyContent = "User " + this.userEmail + " has submitted " + this.scenarioTitle + " - " + this.scenarioLevel + " - " 
          + this.scenarioMission + " - " + this.scenarioType + " with finish date " + this.scenarioFinishdate
          this.addHistoryLog(this.historyContent);
        })
        this.router.navigate(['/']);
      }
    })
    
  }

  setAuthentication(){
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe((isAuthenticated) => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });
  }

  getCurrentTimeLeft() {
    let currentDate = new Date();
    let futureDate = new Date(currentDate.getTime() + this.timeLeft*60000);
    let expiryDate, currentMinutes, futureMinutes;
    currentMinutes = new Date().getTime() / (1000 * 60);

    if (localStorage.getItem("assessmentExpiration") === null){
      localStorage.setItem("assessmentExpiration", futureDate.toString())
      expiryDate = localStorage.getItem("assessmentExpiration");
    } else expiryDate = localStorage.getItem("assessmentExpiration")
    
    if (!expiryDate) return;
    else {
      futureMinutes = new Date(expiryDate).getTime() / (1000 * 60)
      this.timeLeft = futureMinutes - currentMinutes
      // console.log("this.timeLeft ", this.timeLeft)
    }  
  }

   startTimer(duration) {
    var start = Date.now(),
        diff,
        minutes,
        seconds;
    const timer = () => {
        // get the number of seconds that have elapsed since 
        // startTimer() was called
        diff = duration - (((Date.now() - start) / 1000) | 0);

        // does the same job as parseInt truncates the float
        minutes = (diff / 60) | 0;
        seconds = (diff % 60) | 0;

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        this.display = minutes + ":" + seconds; 
        // console.log("display ", this.display)
        if (diff <= 0) {
            // add one second so that the count down starts at the full duration
            // example 05:00 not 04:59
            start = Date.now() + 1000;
        }
    }
    // we don't want to wait a full second before the timer starts
    timer();
    this.interval = setInterval(timer, 1000);
}   

  clearInterval(){
    clearInterval(this.interval);
    console.log("Interval cleared!")
  }

  private clearLocalStorageTimer() {
    localStorage.removeItem("assessmentExpiration")
  }

  setHistoryLogData(result) {
      this.userEmail = result.user.email
      this.scenarioTitle = result.scenario.title
      this.scenarioLevel = result.scenario.level
      this.scenarioMission = result.scenario.mission
      this.scenarioType = result.scenario.type
      this.scenarioFinishdate = result.finishDate
  }

  addHistoryLog(historyContent){
    this.historyLogSvc.postHistoryLog(historyContent, this.userId).subscribe((response) => {
    }) 
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
