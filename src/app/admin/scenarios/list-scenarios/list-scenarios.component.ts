import { Component, OnDestroy, OnInit } from '@angular/core';

import { Scenarios } from '../../scenarios.model';
import { AdminService } from '../../admin.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-list-scenarios',
  templateUrl: './list-scenarios.component.html',
  styleUrls: ['./list-scenarios.component.css']
})
export class ListScenariosComponent implements OnInit, OnDestroy {
  scenarios: Scenarios[] = []
  private scenarioSub: Subscription;

  constructor(public adminService: AdminService) {
   }

  ngOnInit() {
    this.adminService.getScenarios();
    this.scenarioSub = this.adminService.getScenariosUpdateListener().subscribe((scenarios:Scenarios[]) => {
      this.scenarios = scenarios;
    })
  }

  ngOnDestroy() {
    this.scenarioSub.unsubscribe();
  }
}
