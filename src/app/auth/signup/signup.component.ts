import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { fromEventPattern, Subscription } from 'rxjs';
import { AuthService } from '../auth.service';
import Swal from "sweetalert2"

interface Food {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {
  private authStatusSub: Subscription;
  selectedMission: any;
  isLoading = false;
  storedMissions: any;
  email: any;


  constructor(public authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    // this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
    //   authStatus => {
    //     this.isLoading = false;
    //   }
    // )
    this.getSignUpData()
   
  }

  getSignUpData(){
    this.authService.getSignUpData().subscribe(missions => {
      this.storedMissions = missions
      console.log("What are the stored missions ", this.storedMissions)
    })
  }

  onSignup(form: NgForm) {
    if(form.invalid)  {
      console.log("It is invalid")
      return;
    } 
    
    // this.isLoading = true;
    console.log("Should be the selected mission", this.selectedMission)
    this.authService.createUser(form.value.email, form.value.password, this.selectedMission)
    //   console.log(response)
    //   this.email = response
    //   console.log("What is in here ", this.email.result)
    // })
    // Swal.fire({
    //   title: "Welcome " + form.value.email,
    //   text: "Please wait a few moments",
      
    // })
    // Swal.showLoading()
    // this.router.navigate(['/']);
  }

  ngOnDestroy() {
    // this.authStatusSub.unsubscribe()
  }

}
