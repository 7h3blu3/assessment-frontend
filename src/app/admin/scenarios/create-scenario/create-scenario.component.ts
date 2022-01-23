import { Component, OnInit, Input, Inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { AdminService } from '../../admin.service';
import { Scenarios } from '../../scenarios.model';
import { scoreCard } from '../../scenarios.model';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-scenario',
  templateUrl: './create-scenario.component.html',
  styleUrls: ['./create-scenario.component.css']
})
export class CreateScenarioComponent implements OnInit {
  scenarios: Scenarios[] = []
  missions: any;
  filteredMissions: any;
  types = ["Type1", "Type2", "Type3"];
  levels = ["Proffesional", "Experienced"];

  selectedMission: any;
  selectedLevel: any;
  selectedType: any;

  count: number;
  inputQuestion1: any;
  viewType = false;
  isLoading = false;
  private scenarioSub: Subscription;
 

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Scenarios, 
    @Inject(MAT_DIALOG_DATA) public scoreCard: scoreCard, 
    public router: Router,
    public adminService: AdminService, ) {
    this.missions = [];
    this.count = 0;
   }

  ngOnInit(): void {
    console.log("shoulb be empty ", this.data.title)
    this.adminService.getScenarios() 
    this.scenarioSub = this.adminService.getScenariosUpdateListener().subscribe((scenarios:Scenarios[]) => {
      this.scenarios = scenarios;
      this.isLoading = false;


      
      this.scenarios.forEach(element => {
        this.missions.push(element.mission)
      });
      this.filteredMissions = this.missions.filter((item, i, ar) => ar.indexOf(item) === i)
      console.log("Types ", this.types)
      console.log("Missions ", this.filteredMissions)
      console.log("Levels ", this.levels)
    })
  }

  counterUp() {
    if(this.count == 0)
    this.count++
    else if(this.count == 1)
    this.count++
    else if(this.count == 2)
    this.count++
    console.log("Count: ", this.count)
  }

  counterDown() {
    if(this.count == 1){
      this.count--
      delete this.scoreCard.question3
      delete this.scoreCard.weight3
    }
    
    else if(this.count == 2){
      this.count--
      delete this.scoreCard.question4
      delete this.scoreCard.weight4
    }
    else if(this.count == 3){
      this.count--
      delete this.scoreCard.question5
      delete this.scoreCard.weight5
    }
    
    console.log("Count: ", this.count)
  }

  createScenario(data){
      this.data.mission = this.selectedMission
      this.data.level = this.selectedLevel
      this.data.type = this.selectedType
      /** Here this is working but its soo wrong - I created brand new interface caled scoreCard in Scenarios
       I however keep the scoreCard property in the Scenarios interface and I then here set the value to match it ... */
      this.data.scoreCard = {
        question:this.scoreCard.question,
        weight:this.scoreCard.weight,
        question2:this.scoreCard.question2,
        weight2:this.scoreCard.weight2,
        question3:this.scoreCard.question3!,
        weight3:this.scoreCard.weight3!,
        question4:this.scoreCard.question4!,
        weight4:this.scoreCard.weight4!,
        question5:this.scoreCard.question5!,
        weight5:this.scoreCard.weight5!,
      }
      console.log(this.data.scoreCard.question)

    this.adminService.createScenarioService(data).subscribe(result => {
      
      console.log("This is the createScenario data " , result)
    })

    

  }
}
