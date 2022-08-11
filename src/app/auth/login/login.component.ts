import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { HistoryLogService } from 'src/app/admin/history-log/history-log.service';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  constructor(public authService: AuthService, private router: Router, private historyLogSvc: HistoryLogService,) { }
  private authStatusSub: Subscription;
  userId: string;
  historyContent: string;
  isLoading = false;

  ngOnInit(): void {
    // this.userId = this.authService.getUserId();
    // console.log("this.userId ", this.userId)
    // this.setAuthentication();
  }

  // setAuthentication() {
  //   this.authStatusSub = this.authService.getAuthStatusListener().subscribe((authStatus) => {
  //     this.userId = this.authService.getUserId();
  //     });
  // }

  onLogin(form: NgForm) {
    console.log(form.value)
    if (form.invalid) {
      console.log("It is invalid")
      return;
    }
    this.authService.login(form.value.email, form.value.password);

    // this.userId = this.authService.getUserId();
    // console.log("this.userId ", this.userId)
    // this.historyContent = "User " + form.value.email + " has logged in!"
    // this.addHistoryLog(this.historyContent);

    // this.router.navigate(['/admin/list-users']);
  }

  addHistoryLog(historyContent){
    this.historyLogSvc.postHistoryLog(historyContent, this.userId).subscribe((response) => {
    }) 
  }

  ngOnDestroy() {
    // this.authStatusSub.unsubscribe()
  }
}
