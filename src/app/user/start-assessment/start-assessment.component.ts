import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from '../user.model';
import { UserService } from '../user.service';

@Component({
  selector: 'app-start-assessment',
  templateUrl: './start-assessment.component.html',
  styleUrls: ['./start-assessment.component.css']
})
export class StartAssessmentComponent implements OnInit, OnDestroy {
  user: User[] = []
  private userSub: Subscription;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.userService.getStartAssesment();
    this.userSub = this.userService.getUserUpdateListener().subscribe((user:User[]) => {
      this.user = user;
      
    })
    console.log("What is in the user " + this.user)
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }

}
