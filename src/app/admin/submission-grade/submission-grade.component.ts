import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'; 
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
  status = "Incomplete"
  userResponse: any;
  currentScore: any;
  currentScore2: any;
  currentScore3: any;
  currentScore4: any;
  currentScore5: any;
  updatedScore: any;
  updatedScore2: any;
  updatedScore3: any;
  updatedScore4: any;
  updatedScore5: any;
  finalScore = 0;
  finalScore2 = 0;
  finalScore3 = 0;
  finalScore4 = 0;
  finalScore5 = 0;
  sumOfValues: any;
  gradeScore = [25, 50, 75, 100]
  // data: any;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,private route: ActivatedRoute,private adminService: AdminService, private router: Router) { 
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
    finalGrade["passingGrade"] = this.data.scenarios.passingGrade
    finalGrade["status"] = this.status
    finalGrade["currentGrade"] = this.sumOfValues
    finalGrade["feedback"] = this.data.user.finalGrade.feedback

    console.log("Final grade", finalGrade)

    return finalGrade;
  }

  gradeUser(data){

    var finalGradeData = this.finalGradeData(data)
    this.adminService.gradeUser(finalGradeData, this.userId, this.scenarioId).subscribe(result => {

    })
    this.router.navigate(['/admin/user-submission']);
  }

  //Hello there wonderer, yes this is a mess but it is working :)
  onUpdateSum(weight) {
    
    console.log("This is the weight ", weight)
    
    if(weight == "weight"){
      this.updatedScore = this.currentScore / 100
      this.finalScore = this.data.scenarios.scoreCard.weight * this.updatedScore
      console.log("Final score 1 ", this.finalScore)
    } else if(weight == "weight2"){
      this.updatedScore2 = this.currentScore2 / 100
      this.finalScore2 = this.data.scenarios.scoreCard.weight2 * this.updatedScore2
      console.log("Final score 2 ", this.finalScore2)
    } else if(weight == "weight3"){
      this.updatedScore3 = this.currentScore3 / 100
      this.finalScore3 = this.data.scenarios.scoreCard.weight3 * this.updatedScore3
      console.log("Final score 3 ", this.finalScore3)
    } else if(weight == "weight4"){
      this.updatedScore4 = this.currentScore4 / 100
      this.finalScore4 = this.data.scenarios.scoreCard.weight4 * this.updatedScore4
      console.log("Final score 4 ", this.finalScore4)
    } else if(weight == "weight5"){
      this.updatedScore5 = this.currentScore5 / 100
      this.finalScore5 = this.data.scenarios.scoreCard.weight5 * this.updatedScore5
      console.log("Final score 5 ", this.finalScore5)
    }

    this.sumOfValues = this.finalScore + this.finalScore2 + this.finalScore3 + this.finalScore4 + this.finalScore5
 
    if(this.data.scenarios.passingGrade <= this.sumOfValues)
    this.status = "Complete"

    console.log("The sum of values ", this.sumOfValues)
  }
}
