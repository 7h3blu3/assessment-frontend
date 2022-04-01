import { Component, OnInit, Inject } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service'; 
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserId, Users } from '../../users.model';
import { AdminService } from '../../admin.service';

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
  userType = [{ name: 'User' }, { name: 'Reviewer' }, { name: 'Content Manager' },{ name: 'Admin' },{ name: '' }];
  // level = [{ level: 'Proffesional' }, { level: 'Experienced' }, { level: '' }];
  level: any;
  userMission = []

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Users,
    public authService: AuthService,
    private adminService: AdminService,
    public dialogRef: MatDialogRef<EditUsersComponent>) {
    this.level = []
    this.storedMissions = [];
    }

  ngOnInit(): void { 
    this.getUserData()
    this.getLevelMissionType()
    this.storeData = this.data
    console.log("Even smorter ", this.data)
    console.log("Even smorter ", this.data.level)
    
  }

  //If you want to share data with your dialog, you can use the data option to pass information to the dialog component.
  //https://material.angular.io/components/dialog/overview


  getLevelMissionType(){
    this.adminService.getLevelMissionType().subscribe(result => {
      result.forEach(element => {
        if(element.level) this.level.push(element.level)
      });
      result.forEach(element => {
        if(element.mission) this.storedMissions.push(element.mission)
      });
      this.level.push("")
      this.storedMissions.push("")
    })
    
  }

  getUserData(){

    var updatedData ={}
    
    updatedData["userId"] = this.data._id 
    updatedData["userType"] = this.data.userType
    updatedData["level"] = this.data.level
    updatedData["mission"] = this.data.mission
    updatedData["email"] = this.data.email

    console.log("The user data ", updatedData)

    return updatedData
  }


  editUser(data){

    var userData =  this.getUserData()
    this.adminService.editUser(userData).subscribe(result => {
      console.log("This is the result from editing ", result)
    })
    this.dialogRef.close()
  }
}
