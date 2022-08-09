import { Component, OnChanges, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Pipe, PipeTransform } from '@angular/core';

import { Scenarios } from '../../scenarios.model';
import { AdminService } from '../../admin.service';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { CreateScenarioComponent } from '../create-scenario/create-scenario.component';
import { MatSort } from '@angular/material/sort';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-list-scenarios',
  templateUrl: './list-scenarios.component.html',
  styleUrls: ['./list-scenarios.component.css']
})
export class ListScenariosComponent implements  OnInit, OnDestroy {
  scenarios: Scenarios[] = []
  isLoading = false;
  scoreCard: any;
  alertKeyword: string;
  userIsAuthenticated = false;
  private authStatusSub: Subscription;
  // totalPosts = 0;
  // postsPerPage = 2;
  // currentPage = 1;
  // pageSizeOptions = [1, 2, 5, 10];
  private scenarioSub: Subscription;

  @ViewChild(MatSort, {static:false}) sort: MatSort;
  @ViewChild(MatPaginator, {static:false}) paginator: MatPaginator;
  constructor(public adminService: AdminService, public dialog: MatDialog, private authService: AuthService) {
    this.scoreCard = [];

  }

  ngOnInit() {
    this.setAuthentication();
    this.getScenarios();

    //https://stackblitz.com/edit/table-like-mat-accordion-xzo8ng?file=app%2Fapp.component.ts
    // setTimeout(() => {
    //   this.userData.sort = this.sort
    //   this.userData.paginator =  this.paginator
    // })
  }
  
  // ngOnChanges() {
  //   this.getScenarios()
  // }


  setAuthentication(){
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe((isAuthenticated) => {
        this.userIsAuthenticated = isAuthenticated;
      });
  }

  getScenarios()
  {
    this.isLoading = true;
    this.adminService.getScenarios();
    this.scenarioSub = this.adminService.getScenariosUpdateListener().subscribe((scenarios:Scenarios[]) => {
      this.scenarios = scenarios;
      this.isLoading = false;
      this.scenarios.forEach(element => this.scoreCard.push(element.scoreCard));
    })
    
  }

  openDialog(scenario): void {
    console.log("What is the scenario ", scenario)
    const dialogRef = this.dialog.open(CreateScenarioComponent, {
      width: '75%',
      height: '85%',
      panelClass: 'my-panel',
      data: scenario,  
    })
    dialogRef.afterClosed().subscribe(result => {
      this.adminService.getScenarios();
    })
  

    // dialogRef.afterClosed().subscribe(result => {
    //   console.log('The dialog was closed');
    //   this.animal = result;
    // });
  }

  archiveScenario(scenarioId: string) {
    this.alertKeyword = "archive"
      this.confirmAlert(this.alertKeyword).then((result) => {
      if (result.isConfirmed) {
        this.successAlert(this.alertKeyword)
        this.adminService.archiveScenarios(scenarioId, this.scenarios).subscribe((result) => {
          this.getScenarios()
        })
      }
    })
  }

  cloneScenario(scenario) {
    this.alertKeyword = "clone"
    this.confirmAlert(this.alertKeyword).then((result) => {
      if (result.isConfirmed) {
        this.successAlert(this.alertKeyword);
        this.adminService.cloneScenario(scenario.id, scenario).subscribe((result) => {
          this.getScenarios()
        })
      }
    })
    console.log("scenarioId ", scenario.id)
    console.log("scenarios ", scenario)
  }


  confirmAlert(keyword) {
    let title, icon, confirmButtonColor, confirmButtonText;
    if(keyword == "archive") {
      title = "Are you sure you want to archive this Scenario ?";
      icon = "warning";
      confirmButtonColor = "#FA4A1E";
      confirmButtonText = "Archive!";
    }
    else if (keyword == "clone") {
      title = "Are you sure you want to clone this Scenario ?";
      icon = "question";
      confirmButtonColor = "#198C19";
      confirmButtonText = "Clone!"
    } 
    return Swal.fire({
      title: title,
      icon: icon,
      showCancelButton: true,
      confirmButtonColor: confirmButtonColor,
      cancelButtonColor: '#3F51B5',
      confirmButtonText: confirmButtonText
    })
  }

  successAlert(keyword) {
    let title, text;
    if(keyword == "archive") {
      title = "Archived!";
      text = "Scenario has been successfully archived.";
    }
    else if (keyword == "clone") {
      title = "Cloned!";
      text = "Scenario has been successfully cloned.";
    } 
    return Swal.fire({
      title:title,
      text:text,
      icon:'success',
      confirmButtonColor: '#3F51B5',
    })
  }

  // onChangedPage(pageData: PageEvent) {
  //   this.isLoading = true;
  //   this.currentPage = pageData.pageIndex + 1;
  //   this.postsPerPage = pageData.pageSize;
  //   this.postsService.getPosts(this.postsPerPage, this.currentPage);
  // }
  // archiveScenario(scenarioId: string) {
  //   Swal.fire({
  //   title: 'Are you sure you want to archive this user ?',
  //   icon: 'warning',
  //   showCancelButton: true,
  //   confirmButtonColor: '#FA4A1E',
  //   cancelButtonColor: '#3F51B5',
  //   confirmButtonText: 'Archive!'
  // }).then((result) => {
  //   if (result.isConfirmed) {
  //     Swal.fire({
  //       title:'Archived!',
  //       text:'User has been successfully archived.',
  //       icon:'success',
  //       confirmButtonColor: '#3F51B5',
  //     })
  //     // this.adminService.archiveScenarios(scenarioId)
  //     // this.getScenarios()
  //   }
  // })
  // this.adminService.archiveScenarios(scenarioId, this.scenarios)

  // }

  ngOnDestroy() {
    this.scenarioSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }
}
