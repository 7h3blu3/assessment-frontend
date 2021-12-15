import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { Scenarios } from '../../scenarios.model';
import { AdminService } from '../../admin.service';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { CreateScenarioComponent } from '../create-scenario/create-scenario.component';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-list-scenarios',
  templateUrl: './list-scenarios.component.html',
  styleUrls: ['./list-scenarios.component.css']
})
export class ListScenariosComponent implements OnInit, OnDestroy {
  scenarios: Scenarios[] = []
  private scenarioSub: Subscription;

  @ViewChild(MatSort, {static:false}) sort: MatSort;
  constructor(public adminService: AdminService, public dialog: MatDialog) {}

  ngOnInit() {
    this.adminService.getScenarios();
    this.scenarioSub = this.adminService.getScenariosUpdateListener().subscribe((scenarios:Scenarios[]) => {
      this.scenarios = scenarios;
      console.log(this.scenarios)
    })
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(CreateScenarioComponent, {

      width: '75%',
      height: '80%',
      panelClass: 'my-panel',
      data: {},
     
    });

    // dialogRef.afterClosed().subscribe(result => {
    //   console.log('The dialog was closed');
    //   this.animal = result;
    // });
  }

  ngOnDestroy() {
    this.scenarioSub.unsubscribe();
  }
}
