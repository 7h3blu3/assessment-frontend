import { LocationStrategy } from '@angular/common';
import { Component, OnInit, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { AdminService } from '../../admin.service';

@Component({
  selector: 'app-create-scenario',
  templateUrl: './create-scenario.component.html',
  styleUrls: ['./create-scenario.component.css']
})
export class CreateScenarioComponent implements OnInit {
  missions = [];
  types = ["Type1", "Type2", "Type3"]
  storeResult: any;
  selectedMission: any;
  viewType = false;
  isLoading = false;
  private missionSub: Subscription;
 

  constructor(public adminService: AdminService, private url:LocationStrategy, private authService: AuthService) { }

  ngOnInit(): void {
    this.adminService.getCreateScenarios();
    this.missionSub = this.adminService.getMissions().subscribe((missions => {
      // this.missions = missions
    }))

    // Setting viewType based on the url
    if(this.url.path()==="/admin/create-scenarios"){
      this.viewType = true
    }
    this.getSignUpData()
    
  }

  
  getSignUpData(){
    this.authService.getSignUpData().subscribe(result => {

      this.storeResult = result.store
      
    })
  }

}
