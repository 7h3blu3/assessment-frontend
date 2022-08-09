import { Component, OnDestroy, OnInit, Inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Users } from 'src/app/admin/users.model';
import { UserService } from '../user.service';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-start-assessment',
  templateUrl: './start-assessment.component.html',
  styleUrls: ['./start-assessment.component.css']
})
export class StartAssessmentComponent implements OnInit, OnDestroy {
  user: any;
  private userSub: Subscription;

  userIsAuthenticated = false;
  private authStatusSub: Subscription;

  constructor(@Inject(MAT_DIALOG_DATA)public data: any,private userService: UserService, private authService: AuthService) {
   }

  ngOnInit(): void {
    this.setAuthentication();
    this.setUserData();
  }

  setUserData() {
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
      this.user = result
      this.data.finalGrade = this.user.finalGrade
    });

  }

 

  setAuthentication() {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe((isAuthenticated) => {
      this.userIsAuthenticated = isAuthenticated;
    });
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }

}
