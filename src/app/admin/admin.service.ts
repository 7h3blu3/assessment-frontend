import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { throwError as observableThrowError, Observable, Subject } from "rxjs";
import { map, catchError } from "rxjs/operators";
import { Scenarios, ScenariosBackup } from './scenarios.model';
import { UserId, Users } from './users.model';

import Swal from 'sweetalert2';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private users: Users[] = [];
  private usersUpdated = new Subject<Users[]>();
  private missions = [];
  private scenarios: Scenarios[] = [];
  private scenariosUpdated = new Subject<Scenarios[]>();
  private scenariosBckp: ScenariosBackup[] = [];
  private scenariosBckpUpdated = new Subject<ScenariosBackup[]>();
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
    return this.http.get("http://localhost:3000/admin/list-users")
    .pipe(map(res => 
      { 
        return res })
    , catchError(this.handleError))
  }


  getScenarios() {
    this.http
      .get<{ message: string; scenarios: any }>(
        'http://localhost:3000/admin/list-scenarios'
      ).pipe(map((scenariosData) => 
      {
        return scenariosData.scenarios.map(scenario => {
          return{
              id: scenario._id,
              mission: scenario.mission,
              level: scenario.level,
              title: scenario.title,
              description: scenario.description,
              type: scenario.type,
              time: scenario.time,
              scoreCard: scenario.scoreCard,
              passingGrade: scenario.passingGrade,
              userId: scenario.userId,
              logsUrl:scenario.logsUrl,
              grandTotal: scenario.grandTotal
          }
        })
      }))
      .subscribe((transformedScenarios) => {
        this.scenarios = transformedScenarios;
        this.scenariosUpdated.next([...this.scenarios]);
      }),catchError(this.handleError)
  }

  getScenariosUpdateListener() {
    return this.scenariosUpdated.asObservable();
  }

  getArchivedUsers(): Observable<any>{
    return this.http.get("http://localhost:3000/admin/archived-users").pipe(map(res => { return res }), catchError(this.handleError))
  }

  getLevelMissionType(): Observable<any>{
    return this.http.get("http://localhost:3000/admin/levelMissionType").pipe(map(res => { return res }), catchError(this.handleError))
  }

  archiveUsers(userId:string) {

    const userData: UserId = {id: userId};
    
        return this.http
        .post('http://localhost:3000/admin/archived-users/' + userId, userData).pipe(map(res => { return res }), catchError(this.handleError))
        .subscribe((response) => {
          const updatedUsers = this.users.filter(user => user._id !== userId)
          this.users = updatedUsers
          console.log(updatedUsers)
          // this.updatedU
          console.log("this is the response ", response)
    }) 
  }

  restoreUsers(userId:string) {

    const userData: UserId = {id: userId};
    
        return this.http
        .post('http://localhost:3000/admin/restore-users/' + userId, userData).pipe(map(res => { return res }), catchError(this.handleError))
        .subscribe((response) => {
          
          console.log("this is the response ", response)
    }) 
  }

  assignScenario(data) {
    Swal.fire({
      title: 'Saving your ' + data.title + ' scenario...',
      text: 'Please wait a few seconds.',
      allowOutsideClick: false,
    });
    Swal.showLoading();
        return this.http
        .post('http://localhost:3000/admin/assign-scenarios', data).pipe(map(res => { 
          console.log("What is the data", data)
      Swal.fire({
        title: 'Scenario Assigned.',
        icon: 'success',
        html: 'Scenario has been assigned to <strong>' + data.user + '</strong>',
        confirmButtonColor:'#3F51B5',
        allowOutsideClick: false,
      });   
          return res 
        }), catchError(this.handleError))
  }
  
  getArchivedScenarios(): Observable<any> {
    return this.http.get( 'http://localhost:3000/admin/archived-scenarios').pipe(map(res => { return res }), catchError(this.handleError))
  }

  archiveScenarios(scenarioId, data): Observable<any> {

        return this.http.post<any>('http://localhost:3000/admin/archive-scenario/' + scenarioId, data).pipe(map(res => { return res }), catchError(this.handleError))
  }

  restoreScenarios(scenarioId:string) {

    var userBackup: any
    
        return this.http
        .post('http://localhost:3000/admin/restore-scenario/' + scenarioId, userBackup).pipe(map(res => { return res }), catchError(this.handleError))
        .subscribe((response) => {
          
          console.log("this is the response ", response)
    }) 
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
  
 

  getScenariosBckpUpdateListener() {
    return this.scenariosBckpUpdated.asObservable();
  }

  getUsersUpdateListener(){
    return this.usersUpdated.asObservable();
  }
  getMissions() {
      return this.missionsUpdated.asObservable()
  }

  createScenarioService(data): Observable<any> {
    Swal.fire({
      title: 'Saving your ' + data.title + ' scenario...',
      text: 'Please wait a few seconds.',
      allowOutsideClick: false,
    });
    Swal.showLoading();
    return this.http.post<any>('http://localhost:3000/admin/create-scenarios', data)
    .pipe(map(res => {
      console.log("Do we even get here")
      Swal.fire({
        title: 'Scenario Saved.',
        icon: 'success',
        html: 'Scenario has been added to the database.',
        // html: 'Scenario <strong>' + data.title + '</strong> has been added to the database.',
        confirmButtonColor:'#3F51B5',
        allowOutsideClick: false,
      });   
     return res
      }), catchError(this.handleError))
}



editUser(data): Observable<any> {
  Swal.fire({
    title: 'Editing user ' + data.email,
    text: 'Please wait a few seconds.',
    allowOutsideClick: false,
  });
  Swal.showLoading();

  return this.http.post<any>('http://localhost:3000/admin/edit-users', data)
  .pipe(map(res => {
    Swal.fire({
      title: 'User <strong>' + data.email + '</strong> has been Edited!',
      icon: 'success',
      // html: 'Scenario has been added to the database.',
      // html: 'Scenario <strong>' + data.title + '</strong> has been added to the database.',
      confirmButtonColor:'#3F51B5',
      allowOutsideClick: false,
    });   
   return res
    }), catchError(this.handleError))
}

editScenario(data): Observable<any> {
  Swal.fire({
    title: 'Editing Scenario ' + data.title,
    text: 'Please wait a few seconds.',
    allowOutsideClick: false,
  });
  Swal.showLoading();

  return this.http.post<any>('http://localhost:3000/admin/edit-scenarios', data)
  .pipe(map(res => {
    Swal.fire({
      title: 'Scenario <strong>' + data.title + '</strong> has been Edited!',
      icon: 'success',
      // html: 'Scenario has been added to the database.',
      // html: 'Scenario <strong>' + data.title + '</strong> has been added to the database.',
      confirmButtonColor:'#3F51B5',
      allowOutsideClick: false,
    });   
   return res
    }), catchError(this.handleError))
}

gradeUser(data, userId:any, scenarioId: any): Observable<any> {
  // Swal.fire({
  //   title: 'Saving your ' + data.title + ' scenario...',
  //   text: 'Please wait a few seconds.',
  //   allowOutsideClick: false,
  // });
  // Swal.showLoading();
  return this.http.post<any>('http://localhost:3000/admin/submission-grade/'  + userId + "/" + scenarioId, data)
  .pipe(map(res => {
    // console.log("Do we even get here")
    Swal.fire({
      title: 'Scenario Graded.',
      icon: 'success',
      html: 'Scenario has been graded successfully.',
      // html: 'Scenario <strong>' + data.title + '</strong> has been added to the database.',
      confirmButtonColor:'#3F51B5',
      allowOutsideClick: false,
    });   
   return res
    }), catchError(this.handleError))
}

getSubmissionGrade(userId:any, scenarioId: any): Observable<any>{
  return this.http.get("http://localhost:3000/admin/submission-grade/" + userId + "/" + scenarioId).pipe(map(res => { return res }), catchError(this.handleError))
}

  // getCreateScenarios() {
  //   this.http.get<{ filteredMissions: [] }>(
  //     'http://localhost:3000/admin/create-scenarios'
  //   ).subscribe((filteredMissionsData) => {
  //       this.missions = filteredMissionsData.filteredMissions
  //       this.missionsUpdated.next([...this.missions])
  //   })
  // }

  //.subscribe(
  // We can pass 3 arguments in the subscribe
  // 1. New data
  // 2. Errors
  // 3. When it completes
  // )
}
