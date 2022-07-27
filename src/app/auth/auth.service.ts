import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { throwError as observableThrowError, Observable, Subject } from "rxjs";
import { map, catchError } from "rxjs/operators";

import { SignUp } from './auth-data.model';
import { Login } from './auth-data.model';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient, private router: Router) {}

  public handleError(error: Response | any) {
    let errMsg = ""
    if (error instanceof Response || error instanceof HttpErrorResponse) {
      switch (error.status) {
        case 0:
          errMsg = "No Response Received. Check your network connection.";
          break;
        case 404:
          errMsg = "404 not found, please contact the administrator";
          break;
        case 500:
          errMsg = "500 internal error, please contact the administrator";
          break;
        case 405:
          errMsg = "405 method not allowed";
          break;
        default:
          break;
      }
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    Swal.fire({
      title:"Failed authentication",
      icon: 'error',
      text: "Error message " + errMsg,
      allowOutsideClick: false,
      showConfirmButton: true,
      confirmButtonColor: 'blue'
    })
    return observableThrowError(errMsg);
  }

  login(email: string, password: string, ) {
    const authData: Login = { email: email, password: password };
    return this.http
      .post<{ userId: string; userType: string; message: string }>(
        'http://localhost:3000/login', authData).pipe(map(res => { return res }), catchError(this.handleError))
      .subscribe((response) => {
        console.log('Login response ' , response);
      });
  }

  createUser(email: string, password: string, mission: string) {
    const authData: SignUp = { email: email, password: password, mission:mission };
    var userData: any;
    return this.http
      .post('http://localhost:3000/signup', authData).pipe(map(res => { return res }), catchError(this.handleError))
      .subscribe((response) => {
        userData = response
        Swal.fire({
          title: "Welcome " + userData.result.email,
          text: "Comprehending awesomeness",
          allowOutsideClick: false,
          timer: 2000,
          timerProgressBar: true,

          didOpen: () => {
            Swal.showLoading()
          }
        })
        setTimeout(() => {
          this.router.navigate(['/admin/list-users']);
        }, 2000);
       
        console.log("Is the password hashed ", userData.result);
      });
  }

  getSignUpData(): Observable<any>{
    return this.http.get("http://localhost:3000/signup").pipe(map(res => { return res }), catchError(this.handleError))
  }


}
