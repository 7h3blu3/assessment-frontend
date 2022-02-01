import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Scenarios, ScenariosBackup } from './scenarios.model';
import { throwError as observableThrowError, Observable, Subject } from "rxjs";
import { map, catchError } from "rxjs/operators";

import Swal from 'sweetalert2';
import { UserId, Users } from './users.model';
import { usersBackup } from './usersBackup.model';
import { EmailValidator } from '@angular/forms';
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
              logsUrl:scenario.logsUrl
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

  archiveUsers(userId:string) {

    const userData: UserId = {id: userId};
    
        return this.http
        .post('http://localhost:3000/admin/archived-users/' + userId, userData).pipe(map(res => { return res }), catchError(this.handleError))
        .subscribe((response) => {
          const updatedUsers = this.users.filter(user => user.id !== userId)
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
  // archiveUsers(userId:string) {

  //   const userData: UserId = {id: userId};
  //   var isConfirmed = false;
  //   Swal.fire({
  //     title: 'Are you sure you want to archive this user ?',
  //     icon: 'warning',
  //     showCancelButton: true,
  //     confirmButtonColor: '#FA4A1E',
  //     cancelButtonColor: '#3F51B5',
  //     confirmButtonText: 'Archive!'
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       Swal.fire({
  //         title:'Archived!',
  //         text:'User has been successfully archived.',
  //         icon:'success',
  //         confirmButtonColor: '#3F51B5',
  //       })
  //       return this.http
  //       .post('http://localhost:3000/admin/archived-users/' + userId, userData).pipe(map(res => { return res }), catchError(this.handleError))
  //       .subscribe((response) => {
  //         isConfirmed = true;
  //         const updatedUsers = this.users.filter(user => user.id !== userId)
  //         this.users = updatedUsers
  //         console.log(updatedUsers)
  //         // this.updatedU
  //         console.log("this is the response ", response)
  //       })
  //     }
  //     return
  //   }) 
  // }

  // getUsers() {
  //    this.http
  //      .get<{users:any }>(
  //        "http://localhost:3000/admin/list-users"
  //      )
  //      .pipe(map((usersData)=> {
  //       return usersData.users.map(user => {
  //         return{
  //           id: user.id,
  //           email: user.email,
  //           userType: user.userType,
  //           assignedScenarios: user.assignedScenarios,
  //           submittedScenarios: user.submittedScenarios,
  //           finalGrade: user.finalGrade,
  //           alreadyAssigned: user.alreadyAssigned,
  //           assignedType3: user.assignedType3,
  //           mission: user.mission,
  //           level: user.level,
  //           time: user.time
  //         }
  //        })
  //      }))
  //      .subscribe((transformedUser) => {
  //     this.users = transformedUser;
  //     this.usersUpdated.next([...this.users]);
  //      }),catchError(this.handleError)
  //  }

 

  // getArchivedScenarios() {
  //   this.http
  //     .get<{ message: string; scenarios: any }>(
  //       'http://localhost:3000/admin/archived-scenarios'
  //     ).pipe(map((archivedScenariosData) => {
  //       const storeResult = { scenario:archivedScenariosData}
  //       console.log("This is in the map ", storeResult.scenario)
  //       return archivedScenariosData.map(Archivedscenario => {
  //         return{
  //             id: Archivedscenario._id,
  //             mission: Archivedscenario.mission,
  //             level: Archivedscenario.level,
  //             title: Archivedscenario.title,
  //             description: Archivedscenario.description,
  //             type: Archivedscenario.type,
  //             time: Archivedscenario.time,
  //             scoreCard: Archivedscenario.scoreCard,
  //             passingGrade: Archivedscenario.passingGrade,
  //             userId: Archivedscenario.userId,
  //         }
  //       })
  //     }))
  //     .subscribe((transformedScenarios) => {
  //       this.scenariosBckp = transformedScenarios;
  //       this.scenariosBckpUpdated.next([...this.scenariosBckp]);
  //     }),catchError(this.handleError)
  // }

  getArchivedScenarios(): Observable<any> {
    return this.http.get( 'http://localhost:3000/admin/archived-scenarios').pipe(map(res => { return res }), catchError(this.handleError))
  }
  
  // archiveScenarios(scenarioId:string) {

  //   // const userBackup: usersBackup = {id:scenarioId}

  //     var userBackup: any
  //       return this.http
  //       .post('http://localhost:3000/admin/archive-scenario/' + scenarioId, userBackup).pipe(map(res => { return res }), catchError(this.handleError))
  //       .subscribe((response) => {
  //         console.log("this is the response ", response)
  //         console.log(response)
  //         const updatedScenarios = this.scenarios.filter(scenario => scenario.id !== scenarioId)
  //         this.scenarios = updatedScenarios
  //         this.scenariosUpdated.next([...this.scenarios]);
         
  //   }) 
  // }

  archiveScenarios(scenarioId, data): Observable<any> {

        return this.http.post<any>('http://localhost:3000/admin/archive-scenario/' + scenarioId, data).pipe(map(res => { return res }), catchError(this.handleError))
  }

  // archiveScenarios(id:string, scenarios:Scenarios) {

  //   // const userBackup: usersBackup = {id:scenarioId}

  //     const scenario: Scenarios= {
  //       id: id,
  //       mission:scenarios.mission,
  //       level: scenarios.level,
  //       title: scenarios.title,
  //       description: scenarios.description,
  //       type: scenarios.type,
  //       time: scenarios.time,
  //       scoreCard: scenarios.scoreCard,
  //       passingGrade: scenarios.passingGrade,
  //       userId: scenarios.userId
  //     }

  //       return this.http
  //       .post('http://localhost:3000/admin/archive-scenario/' + id, scenario).pipe(map(res => { return res }), catchError(this.handleError))
  //       .subscribe((response) => {
  //         console.log("this is the response ", response)
  //         console.log(response)
  //         const updatedScenarios = this.scenarios.filter(scenario => scenario.id !== id)
  //         this.scenarios = updatedScenarios
  //         this.scenariosUpdated.next([...this.scenarios]);
         
  //   }) 
  // }

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
