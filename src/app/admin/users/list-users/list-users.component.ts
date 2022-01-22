import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AdminService } from '../../admin.service';
import { EditUsersComponent } from '../edit-users/edit-users.component';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Users } from '../../users.model';

import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-list-users',
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.css']
})
export class ListUsersComponent implements OnInit {
  users: Users[] = []
  private userSub: Subscription;

  isLoading = false;

  userData = new MatTableDataSource()
  constructor( private adminService: AdminService, private dialog:MatDialog, ) {}

  @ViewChild(MatSort, {static:false}) sort: MatSort;
  @ViewChild(MatPaginator, {static:false}) paginator: MatPaginator;

  displayedColumns: string [] = ["EMAIL", "USERTYPE", "LEVEL", "MISSION", "EDIT", "ARCHIVE"]

  ngOnInit(): void {
    this.getUsers()
  }

  // getUsers() {
  //   this.isLoading = true;
  //   this.adminService.getUsers()
  //   this.userSub = this.adminService.getUsersUpdateListener().subscribe((users:Users[]) => {
  //     // const userResult = result
  //     this.users = users
  //     console.log("let me see ", this.users)
  //     // if(result) {

  //     //   this.userData = new MatTableDataSource(users)

  //     //   console.log("Are we in result ", result)
  //     //   setTimeout(() => {
  //     //     this.userData.sort = this.sort
  //     //     this.userData.paginator =  this.paginator
  //     //   })
  //     // }
  //     this.isLoading = false;
  //   })
  // }





  getUsers() {
    console.log("Does it get called")
    this.isLoading = true;
    this.adminService.getUsers().subscribe(result => {
      const users = result
      if(result) {

        this.userData = new MatTableDataSource(users)

        console.log("Are we in result ", result)
        setTimeout(() => {
          this.userData.sort = this.sort
          this.userData.paginator =  this.paginator
        })
      }
      this.isLoading = false;
    })
  }

  archiveUser(userId: string) {
      Swal.fire({
      title: 'Are you sure you want to archive this user ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#FA4A1E',
      cancelButtonColor: '#3F51B5',
      confirmButtonText: 'Archive!'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title:'Archived!',
          text:'User has been successfully archived.',
          icon:'success',
          confirmButtonColor: '#3F51B5',
        })
        this.adminService.archiveUsers(userId)
      }
      setTimeout(()=>{
        this.getUsers()
      }, 10)
    })
      console.log("Show me the data ", userId)

      
    }

  showUser(element) {
    console.log("Show me the element ", element)
    const dialogRef = this.dialog.open(EditUsersComponent, {

      width: '60%',
      height: '40%',
      panelClass: 'my-panel',
      data: element,
    });
    // dialogRef.afterClosed().subscribe(result => {
    //   console.log('The dialog was closed');
    //   this.animal = result;
    // });
  }
}
