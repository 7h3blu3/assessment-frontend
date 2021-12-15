import { Component, OnInit, Inject } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service'; 
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Users } from '../../users.model';

@Component({
  selector: 'app-edit-users',
  templateUrl: './edit-users.component.html',
  styleUrls: ['./edit-users.component.css'],
})
export class EditUsersComponent implements OnInit {
  isLoading = false;
  storedMissions: any;
  selectedMission: any;
  storeData: any;
  userType = [{ name: 'User' }, { name: 'Reviewer' }, { name: 'Content Manager' },{ name: 'Admin' }];
  userLevel = [{ level: 'Proffesional' }, { level: 'Experienced' }, { level: '' }];
  userMission = []

  constructor(public authService: AuthService,
    @Inject(MAT_DIALOG_DATA) public data: Users,) {}

  ngOnInit(): void { 
    this.getSignUpData()
    this.storeData = this.data
    console.log("Even smorter ", this.data)
  }

  //If you want to share data with your dialog, you can use the data option to pass information to the dialog component.
  //https://material.angular.io/components/dialog/overview

  getSignUpData(){
    this.authService.getSignUpData().subscribe(missions => {
      this.storedMissions = missions
    })

  }
}
