import { Component, OnInit, ViewChild, Inject, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AdminService } from '../../admin.service';
import { EditUsersComponent } from '../edit-users/edit-users.component';
import { Users } from '../../users.model';

import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { HistoryLogService } from '../../history-log/history-log.service';

@Component({
  selector: 'app-list-users',
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.css']
})
export class ListUsersComponent implements OnInit, OnDestroy {
  users: Users[] = []
  private userSub: Subscription;

  historyContent: string;
  userId: string;
  
  userIsAuthenticated = false;
  private authStatusSub: Subscription;

  isLoading = false;

  userData = new MatTableDataSource()
  constructor( private adminService: AdminService, private dialog:MatDialog, private authService: AuthService, private historyLogSvc: HistoryLogService) {}

  @ViewChild(MatSort, {static:false}) sort: MatSort;
  @ViewChild(MatPaginator, {static:false}) paginator: MatPaginator;

  displayedColumns: string [] = ["EMAIL", "USERTYPE", "LEVEL", "MISSION", "EDIT", "ARCHIVE"]

  ngOnInit(): void {
   
    this.getUsers()
    this.userId = this.authService.getUserId();

    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe((isAuthenticated) => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });

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
        this.confirmAlert('archive').then((result) => {
        if (result.isConfirmed) {
          this.adminService.archiveUsers(userId).subscribe(result => {
            this.successAlert('success', result.email);
            this.historyContent = "User " + result.email + " has been archived!"
            this.addHistoryLog(this.historyContent);
          })
        }
        setTimeout(()=>{
          this.getUsers()
        }, 10)
      })
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

  addHistoryLog(historyContent){
    this.historyLogSvc.postHistoryLog(historyContent, this.userId).subscribe((response) => {
    }) 
  }

  confirmAlert(keyword) {
    let title, icon, confirmButtonColor, confirmButtonText;
    if(keyword == "archive") {
      title = "Are you sure you want to archive this user ?";
      icon = "warning";
      confirmButtonColor = "#FA4A1E";
      confirmButtonText = "Archive!";
    }
    return this.adminService.confirmAlert(title, icon, confirmButtonColor, confirmButtonText);
  }

  successAlert(keyword, user) {
    let title, html;
    if(keyword == "success") {
      title = "Archived!";
      html = "User <strong>" + user +"</strong> has been archived!";
    }
    return this.adminService.successAlert(title, html);
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }

}


