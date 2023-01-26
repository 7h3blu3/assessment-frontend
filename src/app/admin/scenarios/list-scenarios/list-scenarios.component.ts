import { Component, OnChanges, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Pipe, PipeTransform } from '@angular/core';

import { Scenarios } from '../../scenarios.model';
import { AdminService } from '../../admin.service';
import { Observable, Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { CreateScenarioComponent } from '../create-scenario/create-scenario.component';
import { MatSort } from '@angular/material/sort';
import { AuthService } from 'src/app/auth/auth.service';
import { HistoryLogService } from '../../history-log/history-log.service';

import Swal from 'sweetalert2';
import { adminStoreService } from '../../admin.store.service';

@Component({
  selector: 'app-list-scenarios',
  templateUrl: './list-scenarios.component.html',
  styleUrls: ['./list-scenarios.component.css']
})
export class ListScenariosComponent implements OnInit {
  // scenarios: Scenarios[] = []
  scenarios$: Observable<Scenarios[]>;
  isLoading = false;
  scoreCard: any;
  userId: string;
  userIsAuthenticated = false;
  private authStatusSub: Subscription;
  private scenarioSub: Subscription;

  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  constructor(
    public adminService: AdminService,
    private adminStoreService: adminStoreService,
    private authService: AuthService) {
    this.scoreCard = [];

  }

  ngOnInit() {
    this.userId = this.authService.getUserId();
    this.setAuthentication();
    this.getScenarios();
  }

  setAuthentication() {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe((isAuthenticated) => {
      this.userIsAuthenticated = isAuthenticated;
      this.userId = this.authService.getUserId();
    });
  }

  getScenarios() {
    this.scenarios$ = this.adminStoreService.getScenarios();
    console.log("this.scenarios$ ", this.scenarios$)
  }

  // getScenarios()
  // {
  //   this.isLoading = true;
  //   this.adminService.getScenarios();
  //   this.scenarioSub = this.adminService.getScenariosUpdateListener().subscribe((scenarios:Scenarios[]) => {
  //     this.scenarios$ = scenarios;
  //     this.isLoading = false;
  //     this.scenarios$.forEach(element => this.scoreCard.push(element.scoreCard));
  //   })

  // }
}
