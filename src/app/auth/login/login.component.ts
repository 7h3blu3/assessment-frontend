import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  constructor(public authService: AuthService, private router: Router) { }
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
    console.log("This should be hashed ", form.value.password)
    this.authService.login(form.value.email, form.value.password);
    this.router.navigate(['/admin/list-users']);
  }

  ngOnDestroy() {
    // this.authStatusSub.unsubscribe()
  }
}
