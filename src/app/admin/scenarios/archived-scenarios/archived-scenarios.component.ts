import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { ScenariosBackup } from '../../scenarios.model';
import { AdminService } from '../../admin.service';
import { Subscription } from 'rxjs';
import { MatSort } from '@angular/material/sort';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-archived-scenarios',
  templateUrl: './archived-scenarios.component.html',
  styleUrls: ['./archived-scenarios.component.css']
})
export class ArchivedScenariosComponent implements OnInit {
  scenarios: ScenariosBackup[] = []
  isLoading = false;
  private scenarioSub: Subscription;
  @ViewChild(MatSort, {static:false}) sort: MatSort;
  constructor(public adminService: AdminService) {}

  ngOnInit() {
    this.getScenarios()
  }


  // getScenarios()
  // {
  //   this.isLoading = true;
  //   this.adminService.getArchivedScenarios();
  //   this.scenarioSub = this.adminService.getScenariosBckpUpdateListener().subscribe((scenarios:ScenariosBackup[]) => {
  //     this.scenarios = scenarios;
  //     this.isLoading = false;
  //   })
  // }

  getScenarios()
  {
    this.isLoading = true;
    this.adminService.getArchivedScenarios().subscribe((scenarios:ScenariosBackup[]) => {
      this.scenarios = scenarios;
      this.isLoading = false;
    })
  }

  restoreScenario(scenarioId: string) {
    Swal.fire({
    title: 'Are you sure you want to restore this scenario ?',
    icon: 'info',
    showCancelButton: true,
    confirmButtonColor: 'green',
    cancelButtonColor: '#3F51B5',
    confirmButtonText: 'Restore!'
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        title:'Restored!',
        text:'Scenario has been successfully restored!',
        icon:'success',
        confirmButtonColor: '#3F51B5',
      })
      //This is the actual code
      this.adminService.restoreScenarios(scenarioId)
    }
    
  })

    console.log("Show me the data ", scenarioId)
  }
}
