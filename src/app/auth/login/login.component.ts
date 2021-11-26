import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(public authService: AuthService) { }
  private authStatusSub: Subscription;
  isLoading = false;

  ngOnInit(): void {
    // this.authStatusSub = this.authService
    //   .getAuthStatusListener()
    //   .subscribe((authStatus) => {
    //     this.isLoading = false;
    //   });
  }
  onLogin(form: NgForm) {
    console.log(form.value)
    if (form.invalid) {
      console.log("It is invalid")
      return;
    }
    this.isLoading = true;
    console.log("Actually valid")
    this.authService.login(form.value.email, form.value.password);
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe()
  }
}
