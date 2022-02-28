import { Component, OnInit, Inject } from '@angular/core';
import { UserService } from '../user.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { userScenarios } from 'src/app/admin/userScenarios.model';
import { Scenarios } from 'src/app/admin/scenarios.model';
import { Users } from 'src/app/admin/users.model';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-assessment',
  templateUrl: './assessment.component.html',
  styleUrls: ['./assessment.component.css']
})
export class AssessmentComponent implements OnInit {
  isLoading = false;
  // data: any;
  submittedData: any;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,public userService: UserService, private router: Router) { 
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

  ngOnInit(): void {
    this.getAssessmentData()
  }

  getAssessmentData() {
    this.userService.getUserSubmission().subscribe(result => {
      console.log("Show some dataaa " , result)
      this.data = result
      console.log("Show me this data ", this.data.scenario.logsUrl)
    })
  }

  submittedScenariosData(data){
    console.log("What is the received data ", data)
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
    
    // Swal.fire({
    //   title: 'Are you sure you want to submit your answers ?',
    //   icon: 'question',
    //   showCancelButton: true,
    //   confirmButtonColor: 'green',
    //   cancelButtonColor: '#3F51B5',
    //   confirmButtonText: 'Submit!'
    // }).then((result) => {
      // if (result.isConfirmed) {
        Swal.fire({
          title:'Submitted!',
          text:'Scenario has been successfully submitted!',
          icon:'success',
          confirmButtonColor: '#3F51B5',
        })
        var submittedData = this.submittedScenariosData(data)
        console.log("Show me the submittedData ", submittedData)
        this.userService.submitInput(submittedData).subscribe(result  => {
          console.log("Ofcourse we have data bruv ", result)
          
        })
        this.router.navigate(['/']);
      // }
    // })
    
  }

}
