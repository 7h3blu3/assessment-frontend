import { Component, OnInit,Inject, ViewChild } from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AdminService } from '../../admin.service';
import { SubmissionGradeComponent } from '../../submission-grade/submission-grade.component';
import { Users } from '../../users.model';


@Component({
  selector: 'app-user-submission',
  templateUrl: './user-submission.component.html',
  styleUrls: ['./user-submission.component.css']
})
export class UserSubmissionComponent implements OnInit {

  isLoading = false;
  submittedScenarios:any
  storeResult: any;
  userData = new MatTableDataSource()
  constructor(@Inject(MAT_DIALOG_DATA) public data: Users, private adminService: AdminService, private dialog:MatDialog) { 
    this.submittedScenarios = []
  }

  @ViewChild(MatSort, {static:false}) sort: MatSort;
  @ViewChild(MatPaginator, {static:false}) paginator: MatPaginator;

  displayedColumns: string [] = []
  displayedAdminColumns: string [] = ["DATETAKEN", "TITLE", "MISSION", "LEVEL", "OPERATION"]
  displayedReviewerColumns: string [] = ["DATETAKEN", "TITLE", "MISSION", "LEVEL", "OPERATION"]

  ngOnInit(): void {

    // When we have roles the columns should change depending on that
    // if(userType == "admin")
    //  this.displayedColumns = this.displayedAdminColumns
    //  else 
     this.displayedColumns = this.displayedReviewerColumns
    this.getUsers()
  }

  getUsers() {
    this.isLoading = true;
    this.adminService.getUserSubmission().subscribe(result => {
      
      this.storeResult = result.user

      console.log("What do I mean by this.storeResult ", this.storeResult)

      this.storeResult.forEach(element => {
        // element.submittedScenarios.forEach(submittedScenarios => {
        //   element.finalGrade.forEach(finalGrade => {
        //     if(submittedScenarios.scenarioId != finalGrade.scenarioId) this.submittedScenarios.push(...element.submittedScenarios)
        //   });
        // });
        
        this.submittedScenarios.push(...element.submittedScenarios)
      });
      console.log("what is the stored result ", this.submittedScenarios)
      if(result) {

        this.userData = new MatTableDataSource(this.submittedScenarios)

        console.log("Are we in result ", result)
        setTimeout(() => {
          this.userData.sort = this.sort
          this.userData.paginator =  this.paginator
        })
      }
      this.isLoading = false;
    })
  }

  openDialog(element): void {
    console.log("Show me the element ", element)
    const dialogRef = this.dialog.open(SubmissionGradeComponent, {

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
