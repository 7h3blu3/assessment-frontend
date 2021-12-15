import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { Scenarios } from '../../scenarios.model';
import { AdminService } from '../../admin.service';
import { Subscription } from 'rxjs';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-archived-scenarios',
  templateUrl: './archived-scenarios.component.html',
  styleUrls: ['./archived-scenarios.component.css']
})
export class ArchivedScenariosComponent implements OnInit {
  scenarios: Scenarios[] = []
  isLoading = false;
  @ViewChild(MatSort, {static:false}) sort: MatSort;
  constructor(public adminService: AdminService) {}

  ngOnInit() {
    this.getScenarios()
    // this.adminService.getScenarios();
    // this.scenarioSub = this.adminService.getScenariosUpdateListener().subscribe((scenarios:Scenarios[]) => {
    //   this.scenarios = scenarios;

    // })
  }

  getScenarios() {
    this.isLoading = true;
    this.adminService.getArchivedScenarios().subscribe(result => {
      this.scenarios = result

      // if(result) {

      //   this.userData = new MatTableDataSource(users)

      //   console.log("Are we in result ", result)
      //   setTimeout(() => {
      //     this.userData.sort = this.sort
      //     this.userData.paginator =  this.paginator
      //   })
      // }
      this.isLoading = false;
    })
  }

}
