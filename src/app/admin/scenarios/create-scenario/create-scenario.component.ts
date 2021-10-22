import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AdminService } from '../../admin.service';

@Component({
  selector: 'app-create-scenario',
  templateUrl: './create-scenario.component.html',
  styleUrls: ['./create-scenario.component.css']
})
export class CreateScenarioComponent implements OnInit {
  missions = [];
  private missionSub: Subscription;
  constructor(public adminService: AdminService) { }

  ngOnInit(): void {
    this.adminService.getCreateScenarios();
    this.missionSub = this.adminService.getMissions().subscribe((missions => {
      // this.missions = missions
    }))
    console.log(this.missions)
  }

}
