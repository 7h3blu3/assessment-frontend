import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AdminService } from '../../admin.service';
import { EditUsersComponent } from '../edit-users/edit-users.component';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Users } from '../../users.model';
import { TOUCH_BUFFER_MS } from '@angular/cdk/a11y/input-modality/input-modality-detector';

@Component({
  selector: 'app-list-users',
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.css']
})
export class ListUsersComponent implements OnInit {
  isLoading = false;

  userData = new MatTableDataSource()
  constructor(
    
    private adminService: AdminService, 
    private dialog:MatDialog, 
    ) { 
      // this.data = new Users().deserialize(data)
    }

  @ViewChild(MatSort, {static:false}) sort: MatSort;
  @ViewChild(MatPaginator, {static:false}) paginator: MatPaginator;

  displayedColumns: string [] = ["EMAIL", "USERTYPE", "LEVEL", "MISSION", "EDIT", "ARCHIVE"]

  ngOnInit(): void {
    this.getUsers()
  }

  getUsers() {
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

  // archiveUser() {
  //   this.adminService.archiveUsers(data).subscribe((result => {
      
  //   }))
  // }

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
