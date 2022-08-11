import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AdminService } from '../../admin.service';
import { AuthService } from 'src/app/auth/auth.service';
import { Subscription } from 'rxjs';
import { HistoryLogService } from '../../history-log/history-log.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-archived-users',
  templateUrl: './archived-users.component.html',
  styleUrls: ['./archived-users.component.css']
})
export class ArchivedUsersComponent implements OnInit, OnDestroy {
  isLoading = false;
  users:any;
  alertKeyword: string;
  historyContent: string;
  userId: string;
  userIsAuthenticated = false;
  private authStatusSub: Subscription;
  
  userData = new MatTableDataSource()
  constructor(private adminService: AdminService, private dialog:MatDialog, private authService: AuthService, private historyLogSvc: HistoryLogService) { 
    this.users = [];
   }

  @ViewChild(MatSort, {static:false}) sort: MatSort;
  @ViewChild(MatPaginator, {static:false}) paginator: MatPaginator;

  displayedColumns: string [] = ["EMAIL", "USERTYPE", "LEVEL", "MISSION", "RESTORE", "DELETE"]

  ngOnInit(): void {
    this.userId = this.authService.getUserId();
    this.setAuthentication();
    this.getUsers()
  }

  getUsers() {
    this.isLoading = true;
    this.adminService.getArchivedUsers().subscribe(result => {
      this.users = result
      if(result) {

        this.userData = new MatTableDataSource(this.users)

        setTimeout(() => {
          this.userData.sort = this.sort
          this.userData.paginator =  this.paginator
        })
      }
      this.isLoading = false;
    })
  }

  restoreUser(userId: string) {
    this.alertKeyword = "restore"
    this.confirmAlert(this.alertKeyword).then((result) => {
      if (result.isConfirmed) {
          this.adminService.restoreUsers(userId).subscribe(result => {
          this.successAlert(this.alertKeyword, result.email)
          this.historyContent = "User " + result.email + " has been restored!"
          this.addHistoryLog(this.historyContent);
        })
      } 
      setTimeout(()=>{
        this.getUsers()
      }, 10)
    })
  }

  deleteUser(userId: string) {
    this.alertKeyword = "delete"
    this.confirmAlert(this.alertKeyword).then((result) => {
      if (result.isConfirmed) {
          this.adminService.deleteUser(userId).subscribe(result => {
          this.successAlert(this.alertKeyword, result.email)
          this.historyContent = "User " + result.email + " has been deleted!"
          this.addHistoryLog(this.historyContent);
        })
      }
    })
  }

  setAuthentication(){
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe((isAuthenticated) => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });
  }

  addHistoryLog(historyContent){
    this.historyLogSvc.postHistoryLog(historyContent, this.userId).subscribe((response) => {
    }) 
  }

  confirmAlert(keyword) {
    let title, icon, confirmButtonColor, confirmButtonText;
    if(keyword == "restore") {
      title = "Are you sure you want to restore this user ?";
      icon = "question";
      confirmButtonColor = "##198C19";
      confirmButtonText = "Restore!";
    }
    else if (keyword == "delete") {
      title = "Are you sure you want to delete this user ?";
      icon = "warning";
      confirmButtonColor = "#FA4A1E";
      confirmButtonText = "Delete!"
    } 
    return this.adminService.confirmAlert(title, icon, confirmButtonColor, confirmButtonText);
  }

  successAlert(keyword, user) {
    let title, html;
    if(keyword == "restore") {
      title = "Restored!";
      html = "User <strong>" + user +"</strong> has been restored!";
    }
    else if (keyword == "delete") {
      title = "Deleted!";
      html = "User <strong>" + user +"</strong> has been deleted!";
    } 
    return this.adminService.successAlert(title, html);
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
