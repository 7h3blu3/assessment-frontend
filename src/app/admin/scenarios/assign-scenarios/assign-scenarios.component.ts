import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../admin.service';

@Component({
  selector: 'app-assign-scenarios',
  templateUrl: './assign-scenarios.component.html',
  styleUrls: ['./assign-scenarios.component.css']
})
export class AssignScenariosComponent implements OnInit {
  isLoading = false;
  users: any;
  selectedType3: any;
  selectedTitle: any;
  selectedUser: any;
  constructor(public adminService: AdminService) { }

  ngOnInit(): void {
    this.getAssignedScenarioView()
  }

  getAssignedScenarioView() {
    this.adminService.getAssignedScenarios().subscribe(result =>{
      this.users = result.user
      this.selectedType3 = result.type3
      // result.array.forEach(element => {
      //   console.log(element)
      // });

      console.log(result)

      // this.users.forEach(element => {
      //   console.log(element.email)

      //   if(element.email){
      //     console.log(element._id)
      //   }
      // });
      // console.log(this.selectedType3[0].title)
    })
  }

  assignScenario(){
    
    var data = {
      user: this.selectedUser,
      scenarioId: this.selectedTitle._id
    }
    console.log("This data ", data)
    this.adminService.assignScenario(data).subscribe(result =>{
      console.log("This is the data ", result)
    })
    this.selectedUser = ""
    this.selectedTitle= ""
  }

}
