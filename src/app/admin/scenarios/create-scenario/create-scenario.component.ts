import { LocationStrategy } from '@angular/common';
import { Component, OnInit, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { AdminService } from '../../admin.service';
import { Scenarios } from '../../scenarios.model';

@Component({
  selector: 'app-create-scenario',
  templateUrl: './create-scenario.component.html',
  styleUrls: ['./create-scenario.component.css']
})
export class CreateScenarioComponent implements OnInit {
  scenarios: Scenarios[] = []
  missions: any;
  filteredMissions: any;
  types: any;
  filteredTypes: any;
  filteredLevels: any;
  level: any;

  selectedMission: any;
  selectedLevel: any;
  viewType = false;
  isLoading = false;
  private scenarioSub: Subscription;
 

  constructor(public adminService: AdminService, private url:LocationStrategy, private authService: AuthService) {
    this.missions = [];
    this.types = [];
    this.level = [];
   }

  ngOnInit(): void {

    this.adminService.getScenarios() 
    this.scenarioSub = this.adminService.getScenariosUpdateListener().subscribe((scenarios:Scenarios[]) => {
      this.scenarios = scenarios;
      this.isLoading = false;


      
      this.scenarios.forEach(element => {
        this.missions.push(element.mission)
        this.types.push(element.type)
        this.level.push(element.level)
      });
      this.filteredMissions = this.missions.filter((item, i, ar) => ar.indexOf(item) === i)
      this.filteredTypes = this.types.filter((item, i, ar) => ar.indexOf(item) === i)
      this.filteredLevels = this.level.filter((item, i, ar) => ar.indexOf(item) === i)

      console.log("Types ", this.filteredTypes)
      console.log("Missions ", this.filteredMissions)
      console.log("Levels ", this.filteredLevels)
    })
    
  }

}
