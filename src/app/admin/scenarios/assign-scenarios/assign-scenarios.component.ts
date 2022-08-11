import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { AdminService } from '../../admin.service';
import { HistoryLogService } from '../../history-log/history-log.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-assign-scenarios',
  templateUrl: './assign-scenarios.component.html',
  styleUrls: ['./assign-scenarios.component.css']
})
export class AssignScenariosComponent implements OnInit, OnDestroy {
  userIsAuthenticated = false;
  private authStatusSub: Subscription;
  isLoading = false;
  historyContent: string;
  userId: string;
  data: any;
  users: any;
  user: any;
  type3: any;
  storedType3: any;
  filteredUserType3s: any;
  selectedType3: any;
  selectedTitle: any;
  selectedUser: any;
  empty: any;

  constructor(public adminService: AdminService, private authService: AuthService, private historyLogSvc: HistoryLogService) {
    this.storedType3 = [];
   }

  ngOnInit(): void {
    this.userId = this.authService.getUserId();
    this.getAssignedScenarioView()
    this.setAuthentication();
  }

  getAssignedScenarioView() {
    this.adminService.getAssignedScenarios().subscribe(result =>{
      this.users = result.user
      this.type3 = result.type3
    })
  }

  assignScenario(){
    this.data = {
      user: this.selectedUser,
      scenarioId: this.selectedTitle._id
    }
      this.adminService.assignScenario(this.data).subscribe(result =>{
        this.getAssignedScenarioView()
        this.adminService.getScenarioById(this.data.scenarioId).subscribe(scenarioData => {
          this.historyContent = "Scenario " + scenarioData.title + " - " + scenarioData.level + " - " + scenarioData.mission + " - " + scenarioData.type + " was assigned to " + result.email + "."
          this.addHistoryLog(this.historyContent);
        })
        
      })
      this.selectedUser = ""
      this.selectedTitle= "" 
    }

    onUpdateUser(){
      this.selectedType3 = []
      this.storedType3 = []
      this.filteredUserType3s = []
      var filteredType3s = []
      this.empty = false;

      //Here we take the user
      this.users.forEach(element => {
        if(element.email == this.selectedUser) this.user = element
      });
  
      //Here we take the assigned type3s
      this.user.assignedType3.forEach(element => {
        if(element.scenarioType3Id) this.storedType3.push(element.scenarioType3Id)
      }); 

      //Here we filter them
      this.filteredUserType3s = this.storedType3.filter((item, i, ar) => ar.indexOf(item) === i)

      //Here we insert only non yet assigned scenarios to the user
      filteredType3s =  this.type3.filter(element => !this.filteredUserType3s.includes(element._id))
      this.selectedType3 = filteredType3s

      if(this.selectedType3.length==0) this.empty = true;
  }

  setAuthentication(){
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe((isAuthenticated) => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });
  }

  addHistoryLog(historyContent){
    this.historyLogSvc.postHistoryLog(historyContent, this.userId).subscribe((response) => {
    }) 
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
