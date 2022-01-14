import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { Scenarios } from '../../scenarios.model';
import { AdminService } from '../../admin.service';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { CreateScenarioComponent } from '../create-scenario/create-scenario.component';
import { MatSort } from '@angular/material/sort';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-scenarios',
  templateUrl: './list-scenarios.component.html',
  styleUrls: ['./list-scenarios.component.css']
})
export class ListScenariosComponent implements OnInit, OnDestroy {
  scenarios: Scenarios[] = []
  isLoading = false;
  private scenarioSub: Subscription;

  @ViewChild(MatSort, {static:false}) sort: MatSort;
  constructor(public adminService: AdminService, public dialog: MatDialog) {}

  ngOnInit() {
    this.getScenarios()
  }
  
  getScenarios()
  {
    this.isLoading = true;
    this.adminService.getScenarios();
    this.scenarioSub = this.adminService.getScenariosUpdateListener().subscribe((scenarios:Scenarios[]) => {
      this.scenarios = scenarios;
      console.log("Does this get updated ", this.scenarios)
      this.isLoading = false;
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

  archiveScenario(scenarioId: string) {
    Swal.fire({
    title: 'Are you sure you want to archive this user ?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#FA4A1E',
    cancelButtonColor: '#3F51B5',
    confirmButtonText: 'Archive!'
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        title:'Archived!',
        text:'User has been successfully archived.',
        icon:'success',
        confirmButtonColor: '#3F51B5',
      })
      // this.adminService.archiveScenarios(scenarioId)
      // this.getScenarios()
    }
  })
  this.adminService.archiveScenarios(scenarioId)

  }

  ngOnDestroy() {
    this.scenarioSub.unsubscribe();
  }
}
