import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Scenarios } from './scenarios.model';
import { throwError as observableThrowError, Observable, Subject } from "rxjs";
import { map, catchError } from "rxjs/operators";

import Swal from 'sweetalert2';
@Injectable({ providedIn: 'root' })
export class AdminService {
  private missions = [];
  private scenarios: Scenarios[] = [];
  private scenariosUpdated = new Subject<Scenarios[]>();
  private missionsUpdated = new Subject();
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

  

  getUsers(): Observable<any>{
    return this.http.get("http://localhost:3000/admin/list-users").pipe(map(res => { return res }), catchError(this.handleError))
  }

  getArchivedUsers(): Observable<any>{
    return this.http.get("http://localhost:3000/admin/archived-users").pipe(map(res => { return res }), catchError(this.handleError))
  }

  archiveUsers(data) {

    var userData: any;
    return this.http
      .post('http://localhost:3000/admin/archived-users', data).pipe(map(res => { return res }), catchError(this.handleError))
      .subscribe((response) => {

      })
  }

  getScenarios() {
    this.http
      .get<{ message: string; scenarios: Scenarios[] }>(
        'http://localhost:3000/admin/list-scenarios'
      )
      .subscribe((scenariosData) => {
        this.scenarios = scenariosData.scenarios;
        this.scenariosUpdated.next([...this.scenarios]);
      });
  }

  getArchivedScenarios(): Observable<any> {
    return this.http.get( 'http://localhost:3000/admin/archived-scenarios').pipe(map(res => { return res }), catchError(this.handleError))
  }

  getAssignedScenarios(): Observable<any> {
    return this.http.get( 'http://localhost:3000/admin/assign-scenarios').pipe(map(res => { return res }), catchError(this.handleError))
  }

  getUserSubmission(): Observable<any> {
    return this.http.get( 'http://localhost:3000/admin/assign-scenarios').pipe(map(res => { return res }), catchError(this.handleError))
  }
  

  // getSignUpData(): Observable<any>{
  //   return this.http.get("http://localhost:3000/signup").pipe(map(res => { return res }), catchError(this.handleError))
  // }
  
  getScenariosUpdateListener() {
    return this.scenariosUpdated.asObservable();
  }

  getMissions() {
      return this.missionsUpdated.asObservable()
  }

  getCreateScenarios() {
    this.http.get<{ message: string; pageTitle: string; filteredMissions: [] }>(
      'http://localhost:3000/admin/create-scenarios'
    ).subscribe((filteredMissionsData) => {
        this.missions = filteredMissionsData.filteredMissions
        this.missionsUpdated.next([...this.missions])
    })
  }

  //.subscribe(
  // We can pass 3 arguments in the subscribe
  // 1. New data
  // 2. Errors
  // 3. When it completes
  // )
}
