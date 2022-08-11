import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { throwError as observableThrowError, Observable, Subject } from "rxjs";
import { map, catchError } from "rxjs/operators";
import { Scenarios, ScenariosBackup } from './scenarios.model';
import { UserId, Users } from './users.model';
import { environment } from 'src/environments/environment.prod';

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
    return this.http.get(environment.apiUrl +"/admin/list-users")
    .pipe(map(res => 
      { 
        return res })
    , catchError(this.handleError))
  }


  getScenarios() {
    this.http
      .get<{ message: string; scenarios: any }>(
        environment.apiUrl + '/admin/list-scenarios'
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

  getScenarioById(scenarioId): Observable<any>{
    return this.http.get(environment.apiUrl +"/admin/scenario/"+ scenarioId).pipe(map(res => { return res }), catchError(this.handleError))
  }

  getScenariosUpdateListener() {
    return this.scenariosUpdated.asObservable();
  }

  getArchivedUsers(): Observable<any>{
    return this.http.get(environment.apiUrl +"/admin/archived-users").pipe(map(res => { return res }), catchError(this.handleError))
  }

  getLevelMissionType(): Observable<any>{
    return this.http.get(environment.apiUrl +"/admin/levelMissionType").pipe(map(res => { return res }), catchError(this.handleError))
  }

  archiveUsers(userId:string): Observable<any> {

    const userData: UserId = {id: userId};
    
        return this.http.post<any>(environment.apiUrl + '/admin/archived-users/' + userId, userData).pipe(map(res => { return res }), catchError(this.handleError))
    //     .subscribe((response) => {
    //       const updatedUsers = this.users.filter(user => user._id !== userId)
    //       this.users = updatedUsers
    //       console.log(updatedUsers)
    //       // this.updatedU
    //       console.log("this is the response ", response)
    // }) 
  }

  restoreUsers(userId:string): Observable<any> {

    const userData: UserId = {id: userId};
    
        return this.http.post(environment.apiUrl + '/admin/restore-users/' + userId, userData).pipe(map(res => { return res }), catchError(this.handleError))
  }

  deleteUser(userId:string): Observable<any> {
    return this.http.delete(environment.apiUrl + '/admin/delete-user/' + userId).pipe(map(res => { return res }), catchError(this.handleError))
  }

  assignScenario(data): Observable<any> {
    Swal.fire({
      title: 'Saving your ' + data.title + ' scenario...',
      text: 'Please wait a few seconds.',
      allowOutsideClick: false,
    });
    Swal.showLoading();
      return this.http.post<any>(environment.apiUrl + '/admin/assign-scenarios', data).pipe(map(res => { 
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
    return this.http.get<any>(environment.apiUrl + '/admin/archived-scenarios').pipe(map(res => { return res }), catchError(this.handleError))
  }

  archiveScenarios(scenarioId, data): Observable<any> {

        return this.http.post<any>(environment.apiUrl + '/admin/archive-scenario/' + scenarioId, data).pipe(map(res => { return res }), catchError(this.handleError))
  }

  cloneScenario(scenarioId, data): Observable<any> {

    return this.http.post<any>(environment.apiUrl + '/admin/clone-scenario/' + scenarioId, data).pipe(map(res => { return res }), catchError(this.handleError))
}

  restoreScenarios(scenarioId:string): Observable<any> {

    var userBackup: any
    
        return this.http.post<any>(environment.apiUrl + '/admin/restore-scenario/' + scenarioId, userBackup).pipe(map(res => { return res }), catchError(this.handleError))
  }
 
  deleteScenario(scenarioId:string): Observable<any> {
    return this.http.delete(environment.apiUrl + '/admin/delete-scenario/' + scenarioId).pipe(map(res => { return res }), catchError(this.handleError))
  }

  getAssignedScenarios(): Observable<any> {
    return this.http.get( environment.apiUrl + '/admin/assign-scenarios').pipe(map(res => { return res }), catchError(this.handleError))
  }

  getUserSubmission(): Observable<any> {
    return this.http.get( environment.apiUrl + '/admin/assign-scenarios').pipe(map(res => { return res }), catchError(this.handleError))
  }
  

  // getSignUpData(): Observable<any>{
  //   return this.http.get(environment.apiUrl +"/signup").pipe(map(res => { return res }), catchError(this.handleError))
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
    return this.http.post<any>(environment.apiUrl + '/admin/create-scenarios', data)
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

  return this.http.post<any>(environment.apiUrl + '/admin/edit-users', data)
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

  return this.http.post<any>(environment.apiUrl + '/admin/edit-scenarios', data)
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
  return this.http.post<any>(environment.apiUrl + '/admin/submission-grade/'  + userId + "/" + scenarioId, data)
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
  return this.http.get(environment.apiUrl +"/admin/submission-grade/" + userId + "/" + scenarioId).pipe(map(res => { return res }), catchError(this.handleError))
}

confirmAlert(title, icon, confirmButtonColor, confirmButtonText) {
  return Swal.fire({
    title: title,
    icon: icon,
    showCancelButton: true,
    confirmButtonColor: confirmButtonColor,
    cancelButtonColor: '#3F51B5',
    confirmButtonText: confirmButtonText
  })
}

successAlert(title, html) {
  return Swal.fire({
    title:title,
    html:html,
    icon:'success',
    confirmButtonColor: '#3F51B5',
  })
}

  // getCreateScenarios() {
  //   this.http.get<{ filteredMissions: [] }>(
  //     environment.apiUrl + '/admin/create-scenarios'
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
