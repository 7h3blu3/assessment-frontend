import { Component, OnDestroy, OnInit, Inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Users } from 'src/app/admin/users.model';
import { UserService } from '../user.service';

@Component({
  selector: 'app-start-assessment',
  templateUrl: './start-assessment.component.html',
  styleUrls: ['./start-assessment.component.css']
})
export class StartAssessmentComponent implements OnInit {
  user: any;
  private userSub: Subscription;

  constructor(@Inject(MAT_DIALOG_DATA)public data: any,private userService: UserService) { }

  ngOnInit(): void {
    this.data = new Users().deserialize({
      finalGrade:
        {
          "scenarioDescription" : "",
          "userResponse" : "",
          "scenarioTitle" : "",
          "scenarioMission" : "",
          "scenarioLevel" : "",
          "passingGrade" : "",
          "status" : "",
          "currentGrade" : Number,
          "feedback" : "8"
        }
      
    })
    this.userService.getStartAssesment().subscribe(result => {
      console.log("This is the user ", result)
      this.user = result
      
      console.log("What is in the user ", this.user.finalGrade)
      this.data.finalGrade = this.user.finalGrade

      console.log(this.data.finalGrade)
    });

    
   

  }

}
