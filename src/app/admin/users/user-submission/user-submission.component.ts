import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AdminService } from '../../admin.service';

@Component({
  selector: 'app-user-submission',
  templateUrl: './user-submission.component.html',
  styleUrls: ['./user-submission.component.css']
})
export class UserSubmissionComponent implements OnInit {

  isLoading = false;

  userData = new MatTableDataSource()
  constructor(private adminService: AdminService, private dialog:MatDialog) { }

  @ViewChild(MatSort, {static:false}) sort: MatSort;
  @ViewChild(MatPaginator, {static:false}) paginator: MatPaginator;

  displayedColumns: string [] = ["EMAIL", "USERTYPE", "LEVEL", "MISSION", "EDIT", "ARCHIVE"]

  ngOnInit(): void {
    this.getUsers()
  }

  getUsers() {
    this.isLoading = true;
    this.adminService.getUserSubmission().subscribe(result => {
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

  openDialog(): void {
    // const dialogRef = this.dialog.open(EditUsersComponent, {

    //   width: '60%',
    //   height: '40%',
    //   panelClass: 'my-panel',
    //   data: {},
     
    // });

    // dialogRef.afterClosed().subscribe(result => {
    //   console.log('The dialog was closed');
    //   this.animal = result;
    // });
  }

}
