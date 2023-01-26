import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { throwError as observableThrowError, Observable, Subject, BehaviorSubject, of } from "rxjs";
import { map, tap, catchError, concatMap, finalize, shareReplay } from "rxjs/operators";
import { Scenarios, ScenariosBackup } from './scenarios.model';
import { UserId, Users } from './users.model';
import { environment } from 'src/environments/environment.prod';

import Swal from 'sweetalert2';

@Injectable({ providedIn: 'root' })

export class adminStoreService {
    private loadingSubject = new BehaviorSubject<boolean>(false);

    loading$: Observable<boolean> = this.loadingSubject.asObservable();

    private subject = new BehaviorSubject<Scenarios[]>([]);

    scenarios$: Observable<Scenarios[]> = this.subject.asObservable();

    constructor(private http:HttpClient) {
        this.loadScenarios()
    }

    private loadScenarios(){
        const   loadScenarios$  = this.http.get<Scenarios[]>(environment.apiUrl + '/admin/list-scenarios').pipe(map(
            response => response['scenarios']
        ), 
        tap(scenarios => this.subject.next(scenarios)))
        // console.log("scenarios ",  this.scenarios$)

        // this.showLoeaderUntilCompleted(loadScenarios$).subscribe();
        loadScenarios$.subscribe(); 
    }

    getScenarios(): Observable<Scenarios[]> {
        return this.scenarios$.pipe(map(scenarios => { return scenarios}))
    }


    archiveScenario(scenarioId: string, changes: Partial<Scenarios>): Observable<any> {
        const scenarios = this.subject.getValue();
        console.log("scenarioId ", scenarioId)
        console.log("scenarios ", scenarios)
        console.log("scenarios ", scenarios[0]._id)
        console.log("scenarios ", scenarios[1]._id)
        
        const index = scenarios.findIndex(scenario => scenario._id == scenarioId);

        console.log("index ", index)
        if (index > -1) { // only splice array when item is found
            scenarios.splice(index, 1); // 2nd parameter means remove one item only
            console.log("Wait we actually spliced")
          }
        // const newScenarios: Scenarios[] = scenarios.slice(0);
        console.log("newScenarios ", scenarios)
        // newScenarios[index] = newScenario;

        this.subject.next(scenarios)

        return this.http.post(environment.apiUrl + '/admin/archive-scenario/' + scenarioId, changes)
            .pipe(
                shareReplay(), 
                catchError(this.handleError));
    }

    cloneScenario(scenarioId: string, changes: Partial<Scenarios>): Observable<any> {

        const scenarios = this.subject.getValue();
        console.log("scenarioId ", scenarioId)
        console.log("scenarios ", scenarios)


        const index = scenarios.findIndex(scenario => scenario._id == scenarioId);
        console.log("index ", index)
        if (index > -1) { // only splice array when item is found
            scenarios.push(scenarios[index]); // 2nd parameter means remove one item only
            console.log("scenarios[index] ", scenarios[index])
          }

        console.log("newScenarios ", scenarios)

        this.subject.next(scenarios)


        return this.http.post<any>(environment.apiUrl + '/admin/clone-scenario/' + scenarioId, changes).pipe(
            shareReplay(), 
            catchError(this.handleError));
    }
    
    /* This is the first example the above I have cleaned up
    archiveScenario(scenarioId: string, changes: Partial<Scenarios>): Observable<any> {
        const scenarios = this.subject.getValue();
        console.log("scenarioId ", scenarioId)
        console.log("scenarios ", scenarios)
        console.log("scenarios ", scenarios[0]._id)
        console.log("scenarios ", scenarios[1]._id)
        
        const index = scenarios.findIndex(scenario => scenario._id == scenarioId);

        // const newScenario: any = {
        //     ...scenarios[index],
        //     ...changes
        // };
        // console.log("newScenario ", newScenario)
        console.log("index ", index)
        if (index > -1) { // only splice array when item is found
            scenarios.splice(index, 1); // 2nd parameter means remove one item only
            console.log("Wait we actually spliced")
          }
        // const newScenarios: Scenarios[] = scenarios.slice(0);
        console.log("newScenarios ", scenarios)
        // newScenarios[index] = newScenario;

        this.subject.next(scenarios)

        return this.http.post(environment.apiUrl + '/admin/archive-scenario/' + scenarioId, changes)
            .pipe(shareReplay());
    } */

    // showLoeaderUntilCompleted<T>(obs$: Observable<T>): Observable<T>{
    //     return of(null)
    //     .pipe(
    //      tap(() => this.loadingOn()), 
    //          concatMap(() => obs$),
    //          finalize(() => this.loadingOff())
    //     )
    //  }
 
    //  loadingOn() {
    //      this.loadingSubject.next(true);
    //  }
 
    //  loadingOff() {
    //      this.loadingSubject.next(false);
    //  }

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
}