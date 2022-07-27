import { Component, OnInit, Input, Inject, OnDestroy, OnChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { AdminService } from '../../admin.service';
import { Scenarios } from '../../scenarios.model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { LocationStrategy } from '@angular/common';

@Component({
  selector: 'app-create-scenario',
  templateUrl: './create-scenario.component.html',
  styleUrls: ['./create-scenario.component.css']
})
export class CreateScenarioComponent implements OnInit, OnDestroy {
  scenarios: Scenarios[] = []
  missions: any;
  types: any;
  levels: any;

  count: number;
  inputQuestion1: any;
  viewType = false;
  isLoading = false;
  private scenarioSub: Subscription;

 

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Scenarios, 
    public router: Router,
    public adminService: AdminService, 
    private url:LocationStrategy,
    public dialogRef: MatDialogRef<CreateScenarioComponent>) {
    this.missions = [];
    this.levels = [];
    this.types = [];
    this.count = 0;
    if(!data.id) {
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
    
   }
   

  ngOnInit(): void {
    this.getScenarios()
    this.getLevelMissionType()
    console.log("this.types ", this.types)
    console.log("This is the data on open ", this.data)

    if(this.url.path()==="/admin/create-scenarios"){
      this.viewType = true
    }

    if(this.data.scoreCard.question3 && this.data.scoreCard.question4 && this.data.scoreCard.question5) this.count = 3
    else if(this.data.scoreCard.question3 && this.data.scoreCard.question4) this.count = 2
    else if(this.data.scoreCard.question3) this.count = 1
  }

  getScenarios()  {
    this.adminService.getScenarios() 
    this.scenarioSub = this.adminService.getScenariosUpdateListener().subscribe((scenarios:Scenarios[]) => {
      this.scenarios = scenarios;
      this.isLoading = false;
    })
  }

  styleObject(): Object {
    if (this.viewType == true){
        return {"max-height":"200vh", "overflow": "hidden"}
    }
    return {"max-height":"80vh", "overflow": "auto"}
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
      if(this.data.scoreCard.weight3) this.data.grandTotal -= this.data.scoreCard.weight3
      delete this.data.scoreCard.question3
      delete this.data.scoreCard.weight3
    }
    
    else if(this.count == 2){
      this.count--
      if(this.data.scoreCard.weight4) this.data.grandTotal -= this.data.scoreCard.weight4
      delete this.data.scoreCard.question4
      delete this.data.scoreCard.weight4
    }
    else if(this.count == 3){
      this.count--
      if(this.data.scoreCard.weight5) this.data.grandTotal -= this.data.scoreCard.weight5
      delete this.data.scoreCard.question5
      delete this.data.scoreCard.weight5
    }
  }

  onUpdateSum() {
    if(!this.data.scoreCard.weight)this.data.scoreCard.weight = 0;
    if(!this.data.scoreCard.weight2)this.data.scoreCard.weight2 = 0;
    if(!this.data.scoreCard.weight3)this.data.scoreCard.weight3 = 0;
    if(!this.data.scoreCard.weight4)this.data.scoreCard.weight4 = 0;
    if(!this.data.scoreCard.weight5)this.data.scoreCard.weight5 = 0;
    this.data.grandTotal = this.data.scoreCard.weight + this.data.scoreCard.weight2 + this.data.scoreCard.weight3 + this.data.scoreCard.weight4 +this.data.scoreCard.weight5

    if(!this.data.scoreCard.question3)delete this.data.scoreCard.weight3
    if(!this.data.scoreCard.question4)delete this.data.scoreCard.weight4
    if(!this.data.scoreCard.question5)delete this.data.scoreCard.weight5
  }
  
  getScenarioUpdatedData() {
    var updatedData = {}

    updatedData["scenarioId"] = this.data.id 
    updatedData["mission"] = this.data.mission
    updatedData["level"] = this.data.level
    updatedData["type"] = this.data.type
    updatedData["title"] = this.data.title
    updatedData["description"] = this.data.description
    updatedData["passingGrade"] = this.data.passingGrade
    updatedData["time"] = this.data.time
    updatedData["logsUrl"] = this.data.logsUrl
    updatedData["scoreCard"] = this.data.scoreCard
    updatedData["grandTotal"] = this.data.grandTotal

    return updatedData
  }

  dialogSave(data){
    if(this.viewType) {
      this.adminService.createScenarioService(data).subscribe(result => {
      
        console.log("This is the createScenario data " , result)
      })
    } else {
      var updatedData = this.getScenarioUpdatedData()

      console.log("updated data ", updatedData)
      this.adminService.editScenario(updatedData).subscribe(result => {
      })
      this.dialogRef.close()
    }
  }

  getLevelMissionType(){
    this.adminService.getLevelMissionType().subscribe(result => {
      console.log(result)
      result.forEach(element => {
        if(element.level) this.levels.push(element.level)
      });
      result.forEach(element => {
        if(element.mission) this.missions.push(element.mission)
      });
      result.forEach(element => {
        if(element.type) this.types.push(element.type)
      });
    })
    
  }

  ngOnDestroy() {
    this.scenarioSub.unsubscribe();
  }
}
