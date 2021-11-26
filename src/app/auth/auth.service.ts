import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { throwError as observableThrowError, Observable, Subject } from "rxjs";
import { map, catchError } from "rxjs/operators";

import { AuthData } from './auth-data.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient, private router: Router) {}

  public handleError(error: Response | any) {
    let errMsg: string;
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
    return observableThrowError(errMsg);
  }

  //** This is a post, must figure out how to make it work because I cannot check it in the browser as it is not get **/
  //** Also I do not think we need a GET **/

  login(email: string, password: string, mission: string) {
    console.log('Is this triggered');
    const authData: AuthData = { email: email, password: password, mission:mission };
    this.http
      .post<{ userId: string; userType: string; message: string }>(
        'http://localhost:3000/login',
        authData
      )
      .subscribe((response) => {
        console.log('There is no response ' + response);
      });
  }

  createUser(email: string, password: string, mission: string) {
    const authData: AuthData = { email: email, password: password, mission:mission };

    this.http
      .post('http://localhost:3000/signup', authData)
      .subscribe((response) => {
        console.log(response);
      });
  }

  getSignUpData(){
    this.http.get("http://localhost:3000/signup").pipe(map(res => { return res }), catchError(this.handleError));
  }


}
