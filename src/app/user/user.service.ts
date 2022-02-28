import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { throwError as observableThrowError, Observable, Subject } from "rxjs";
import { map, catchError } from "rxjs/operators";


import { User } from './user.model';
import Swal from 'sweetalert2';

@Injectable({ providedIn: 'root' })

export class UserService {
    private user: User[] = [];
    private userUpdated = new Subject<User[]>();
    constructor(private http: HttpClient, private router: Router){ }

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

    // getStartAssesment() {
    //     return this.http.get<User>("http://localhost:3000/start-assessment").pipe(map(res => { return res;}))
    // }


    // I think the upper one has a way to be used easier
    getStartAssesment() {
        this.http
          .get<{ message: string; user: User[] }>(
            'http://localhost:3000/start-assessment'
          )
          .subscribe((userData) => {
            this.user = userData.user;
            this.userUpdated.next([...this.user]);
          });
      }
    
      
      getUserUpdateListener() {
        return this.userUpdated.asObservable();
      }

      submitInput(data): Observable<any> {
        // Swal.fire({
        //   title: 'Saving your ' + data.title + ' scenario...',
        //   text: 'Please wait a few seconds.',
        //   allowOutsideClick: false,
        // });
        // Swal.showLoading();
        return this.http.post<any>('http://localhost:3000/assessment', data)
        .pipe(map(res => {
          console.log("Do we even get here")
          // Swal.fire({
          //   title: 'Scenario Saved.',
          //   icon: 'success',
          //   html: 'Scenario has been added to the database.',
          //   // html: 'Scenario <strong>' + data.title + '</strong> has been added to the database.',
          //   confirmButtonColor:'#3F51B5',
          //   allowOutsideClick: false,
          // });   
         return res
          }), catchError(this.handleError))
    }

      getUserSubmission(): Observable<any> {
        return this.http.get( 'http://localhost:3000/assessment').pipe(map(res => { return res }), catchError(this.handleError))
      }
}

