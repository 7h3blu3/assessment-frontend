import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router'; 
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AdminService } from '../admin.service';
import { Scenarios } from '../scenarios.model';
import { Users } from '../users.model';
import { userScenarios } from '../userScenarios.model';
@Component({
  selector: 'app-submission-grade',
  templateUrl: './submission-grade.component.html',
  styleUrls: ['./submission-grade.component.css']
})
export class SubmissionGradeComponent implements OnInit {

  userId: any;
  scenarioId: any;
  isLoading = false;
  userResponse: any;
  gradeScore = ["25", "50", "75" , "100"]
  // data: any;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,private route: ActivatedRoute,private adminService: AdminService,) { 
    this.userId = this.route.snapshot.paramMap.get("userId")
    this.scenarioId = this.route.snapshot.paramMap.get("scenarioId")

    // this.data = new userScenarios().deserialize({
    //   scenarios: new Scenarios().deserialize({
    //    title: "",
    //   }),
    //   user:new Users().deserialize({
    //     finalGrade:
    //       {
    //         userResponse: '',
    //       }
        
    //   })
    // })
  }

  ngOnInit(): void {
    console.log("Show me the data ", this.data)
    
 
    this.getData()
     console.log(this.route.snapshot.paramMap) 
    console.log(this.userId, " userId")
    console.log(this.scenarioId, " scenarioId")
  }

  getData(){
    this.adminService.getSubmissionGrade(this.userId,this.scenarioId).subscribe(result => {
      console.log(result)

      this.data = new userScenarios().deserialize({
        scenarios: new Scenarios().deserialize(result.scenario),
        user:new Users().deserialize(result.user)
    })
    //Here we take the response so we can show it on the frontend
    result.user.submittedScenarios.forEach(element => {
          if(element.scenarioId == result.scenario._id){
            this.userResponse = element.userResponse
          }
      });
    })
  }

  finalGradeData(data){

    console.log("The data ", data)
    var finalGrade = {}
    finalGrade["scenarioDescription"] = this.data.scenarios.description
    finalGrade["userResponse"] = this.userResponse
    finalGrade["scenarioTitle"] = this.data.scenarios.title
    finalGrade["scenarioMission"] = this.data.scenarios.mission
    finalGrade["scenarioLevel"] = this.data.scenarios.level
    finalGrade["feedback"] = this.data.user.finalGrade.feedback

    console.log("Final grade", finalGrade)
    // passingGrade: Number,
    // total,
    // currentGrade: Number,
    // feedback: String

    return finalGrade;
  }

  gradeUser(data){

    var finalGradeData = this.finalGradeData(data)
    this.adminService.gradeUser(finalGradeData, this.userId, this.scenarioId).subscribe(result => {

    })
  }
}
