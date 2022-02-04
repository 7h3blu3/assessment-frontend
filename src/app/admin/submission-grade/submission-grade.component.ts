import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'; 
import { AdminService } from '../admin.service';
import { Scenarios } from '../scenarios.model';
import { Users } from '../users.model';
import { userScenarios } from '../userScenarios.model';
@Component({
  selector: 'app-submission-grade',
  templateUrl: './submission-grade.component.html',
  styleUrls: ['./submission-grade.component.css']
})
export class SubmissionGradeComponent implements OnInit {

  userId: any;
  scenarioId: any;
  isLoading = false;
  data: any;
  constructor(private route: ActivatedRoute,private adminService: AdminService,) { 
    this.userId = this.route.snapshot.paramMap.get("userId")
    this.scenarioId = this.route.snapshot.paramMap.get("scenarioId")
  }

  ngOnInit(): void {

    
 
    this.getData()
     console.log(this.route.snapshot.paramMap) 
    console.log(this.userId, " userId")
    console.log(this.scenarioId, " scenarioId")
  }

  getData(){
    this.adminService.getSubmissionGrade(this.userId,this.scenarioId).subscribe(result => {
      console.log(result)

      this.data = new userScenarios().deserialize(
        {
      scenarios: new Scenarios().deserialize(result.scenario),
      user:new Users().deserialize(result.user)
    })
       

      console.log("This is the data ", this.data)
      console.log("This is the data ", this.data.scenarios.description)
    })
  }
}
