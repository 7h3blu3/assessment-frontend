import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Scenarios } from './scenarios.model';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private missions = [];
  private scenarios: Scenarios[] = [];
  private scenariosUpdated = new Subject<Scenarios[]>();
  private missionsUpdated = new Subject();
  constructor(private http: HttpClient, private router: Router) {}

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
