import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { throwError as observableThrowError, Observable, Subject } from "rxjs";
import { map, catchError } from "rxjs/operators";
import { environment } from 'src/environments/environment.prod';

import { SignUp } from './auth-data.model';
import { Login } from './auth-data.model';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticated = false;
  private token: any;
  private tokenTimer: any;
  private userId: any;
  private userType:any;
  private authStatusListener = new Subject<boolean>();
  alertsKeyword: string;
  constructor(private http: HttpClient, private router: Router) {}

  public handleError(error: Response | any) {
    let errMsg = ""
    if(error.error.message) {
      errMsg = error.error.message
    }
    else if (error instanceof Response || error instanceof HttpErrorResponse) {
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
      html: "<strong>" + errMsg +"</strong>",
      allowOutsideClick: false,
      showConfirmButton: true,
      confirmButtonColor: 'blue'
    })
    // this.authStatusListener.next(false)
    return observableThrowError(errMsg);
  }

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getUserId() {
    return this.userId;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  createUser(email: string, password: string, mission: string) {
    this.alertsKeyword = 'signup';
    this.loadingAlert(this.alertsKeyword, email)
    const authData: SignUp = { email: email, password: password, mission:mission };

    return this.http
      .post(environment.apiUrl + '/signup', authData).pipe(map(res => { return res }), catchError(this.handleError))
      .subscribe((response) => {
        this.successAlert(this.alertsKeyword, email);
        this.router.navigate(['/admin/list-users']);

      },error => {
        // this.authStatusListener.next(false)
        // this.router.navigate(['/signup']);
        // this.errorMessageAlert(error);
      });
  }

  login(email: string, password: string, ) {
    this.alertsKeyword = 'login';
    this.loadingAlert(this.alertsKeyword, email)
    const authData: Login = { email: email, password: password };

    return this.http
      .post<{ token: string, userId: string; expiresIn: number, userType: string; message: string }>(
        environment.apiUrl + '/login', authData).pipe(map(res => { return res }), catchError(this.handleError))
      .subscribe((response) => {
        Swal.close();
        console.log('Login response ' , response);
        const token = response.token;
        this.token = token;
        if (token) {
          const expiresInDuration = response.expiresIn;
          this.setAuthTimer(expiresInDuration)
          this.userType = response.userType
          localStorage.setItem("userType", this.userType)
          this.isAuthenticated = true;
          this.userId = response.userId;
          this.authStatusListener.next(true);
          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
          this.saveAuthData(token, expirationDate, this.userId)
          this.checkRole(this.userType);
        }
      },error => {
        // this.authStatusListener.next(false)
        // this.router.navigate(['/login']);
        // this.errorMessageAlert(error);
      });
  }

   //This is needed so we do not lose our authentication on refresh
  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
        return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
        this.token = authInformation.token;
        this.isAuthenticated = true;
        this.userId = authInformation.userId;
        this.setAuthTimer(expiresIn / 1000)
        this.authStatusListener.next(true);
    }
  }

  checkRole(userType) {
    if(userType == 'User')this.router.navigate(['/']);
    else if (userType == 'Reviewer')this.router.navigate(['/admin/user-submission']);
    else if (userType == 'Content Manager')this.router.navigate(['/admin/list-scenarios']);
    else if (userType == 'Admin')this.router.navigate(['/admin/list-users']);
    else {
        Swal.fire({
            title: 'An error has occurred',
            icon: 'error',
            html: 'No role has been assigned to this account, please reach out to administration',
            confirmButtonColor:'#3F51B5',
            allowOutsideClick: false,
        });  
    }
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.userId = null;
    this.router.navigate(['/login']);
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem("token", token);
    localStorage.setItem("expiration", expirationDate.toISOString())
    localStorage.setItem("userId", userId)
  }

  private clearAuthData() {
    localStorage.removeItem("token")
    localStorage.removeItem("expiration")
    localStorage.removeItem("userId")
    localStorage.removeItem("userType")
    
  }

  private setAuthTimer(duration: number) {
    console.log("setting timer: " + duration)
    this.tokenTimer = setTimeout(() => {
        this.logout();
        this.sessionExpiredAlert();
    }, duration * 1000);
  }

  private getAuthData() {
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expiration");
    const userId = localStorage.getItem("userId")
    const userType = localStorage.getItem("userType")
    if (!token || !expirationDate) {
      return;
    }
    return {
        token: token,
        expirationDate: new Date(expirationDate),
        userId: userId,
        userType: userType
    }
}

  getSignUpData(): Observable<any>{
    return this.http.get(environment.apiUrl +"/signup").pipe(map(res => { return res }), catchError(this.handleError))
  }

  // errorMessageAlert(error) {
  //   Swal.fire({
  //     title: 'An error has occurred',
  //     icon: 'error',
  //     html: 'Error message: <strong>' + error.error.message + '</strong>',
  //     confirmButtonColor:'#3F51B5',
  //     allowOutsideClick: false,
  //   });  
  // }

  loadingAlert(alertsKeyword, email) {
    let title, text;
    if(alertsKeyword === 'login') {
      title = 'Logging... ';
      text = 'Please wait a few seconds.'
    } else if (alertsKeyword === 'signup') { 
      title = 'Creating user ' + email;
      text = 'Please wait a few seconds.'
    };
    Swal.fire({
      title: title,
      text: text,
      allowOutsideClick: false,
    });
    Swal.showLoading();
  }

  sessionExpiredAlert() {
    Swal.fire({
      title: "Your session has expired",
      icon: 'info',
      html: "Please log in again to continue",
      confirmButtonColor:'#3F51B5',
      allowOutsideClick: false,
    });  
  }


  successAlert(alertsKeyword, email) {
    let title, html;
    if(alertsKeyword === 'login') {
      title = 'Welcome!';
      html = '';
    } else if (alertsKeyword === 'signup') {
      title = 'User created';
      html = 'User <strong>' + email + '</strong> was created.';
    }
    Swal.fire({
      title: title,
      icon: 'success',
      html: html,
      confirmButtonColor:'#3F51B5',
      allowOutsideClick: false,
    });  
  }
}
