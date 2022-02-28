import { Component, OnInit, Input, Inject, OnDestroy, OnChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { AdminService } from '../../admin.service';
import { Scenarios } from '../../scenarios.model';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-scenario',
  templateUrl: './create-scenario.component.html',
  styleUrls: ['./create-scenario.component.css']
})
export class CreateScenarioComponent implements OnInit, OnChanges,OnDestroy {
  scenarios: Scenarios[] = []
  missions: any;
  filteredMissions: any;
  types = ["Type1", "Type2", "Type3"];
  levels = ["Proffesional", "Experienced"];
  sumOf100: any;
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
    public router: Router,
    public adminService: AdminService, ) {
    this.missions = [];
    this.count = 0;
    this.data = new Scenarios().deserialize({
      scoreCard: {
        // question:"",
        // weight: "",
        // question2: "",
        // weight2: "",
        // question3: "",
        // weight3:"",
        // question4: "",
        // weight4:"",
        // question5: "",
        // weight5:"",
      }

    })
   }
   

  ngOnInit(): void {
    this.adminService.getScenarios() 
    this.scenarioSub = this.adminService.getScenariosUpdateListener().subscribe((scenarios:Scenarios[]) => {
      this.scenarios = scenarios;
      this.isLoading = false;

      // this.sumOf100 = 20;
      
      this.scenarios.forEach(element => {
        this.missions.push(element.mission)
      });
      this.filteredMissions = this.missions.filter((item, i, ar) => ar.indexOf(item) === i)

    })
  }

  ngOnChanges(){
  //  this.sumOf100 = this.data.scoreCard.weight2
  }

  counterUp() {
    if(this.count == 0)
    this.count++
    else if(this.count == 1)
    this.count++
    else if(this.count == 2)
    this.count++
  }

  counterDown() {
    if(this.count == 1){
      this.count--
      delete this.data.scoreCard.question3
      delete this.data.scoreCard.weight3
    }
    
    else if(this.count == 2){
      this.count--
      delete this.data.scoreCard.question4
      delete this.data.scoreCard.weight4
    }
    else if(this.count == 3){
      this.count--
      delete this.data.scoreCard.question5
      delete this.data.scoreCard.weight5
    }
  }
  onUpdateSum() {
    this.sumOf100 = this.data.scoreCard.weight
    if(this.data.scoreCard.weight && this.data.scoreCard.weight2 && this.data.scoreCard.weight3 
      && this.data.scoreCard.weight4 && this.data.scoreCard.weight5){
      this.sumOf100 = this.data.scoreCard.weight + this.data.scoreCard.weight2 + this.data.scoreCard.weight3 
      + this.data.scoreCard.weight4 + this.data.scoreCard.weight5 
    }
    else if (this.data.scoreCard.weight && this.data.scoreCard.weight2 && this.data.scoreCard.weight3 
      && this.data.scoreCard.weight4){
      this.sumOf100 = this.data.scoreCard.weight + this.data.scoreCard.weight2 + this.data.scoreCard.weight3 
      + this.data.scoreCard.weight4
    }
    else if(this.data.scoreCard.weight && this.data.scoreCard.weight2 && this.data.scoreCard.weight3 ){
      this.sumOf100 = this.data.scoreCard.weight + this.data.scoreCard.weight2 + this.data.scoreCard.weight3 
    }
    else if(this.data.scoreCard.weight && this.data.scoreCard.weight2){
      this.sumOf100 = this.data.scoreCard.weight + this.data.scoreCard.weight2
    }
  }
  createScenario(data){
      this.data.mission = this.selectedMission
      this.data.level = this.selectedLevel
      this.data.type = this.selectedType
      this.adminService.createScenarioService(data).subscribe(result => {
      
      console.log("This is the createScenario data " , result)
    })
    
  }

  ngOnDestroy() {
    this.scenarioSub.unsubscribe();
  }
}
