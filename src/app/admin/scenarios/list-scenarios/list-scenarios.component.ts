import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Pipe, PipeTransform } from '@angular/core';

import { Scenarios } from '../../scenarios.model';
import { AdminService } from '../../admin.service';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { CreateScenarioComponent } from '../create-scenario/create-scenario.component';
import { MatSort } from '@angular/material/sort';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-scenarios',
  templateUrl: './list-scenarios.component.html',
  styleUrls: ['./list-scenarios.component.css']
})
export class ListScenariosComponent implements  OnInit, OnDestroy {
  scenarios: Scenarios[] = []
  easy = [
    {question: 'question2', weight: 40},
    {question: 'question3', weight: 40},
    {question: 'question4', weight: 20}
]
  isLoading = false;
  scoreCard: any;
  // totalPosts = 0;
  // postsPerPage = 2;
  // currentPage = 1;
  // pageSizeOptions = [1, 2, 5, 10];
  whatever: any;
  scoreQuestion: any;
  scoreWeight: any;
  private scenarioSub: Subscription;

  @ViewChild(MatSort, {static:false}) sort: MatSort;
  constructor(public adminService: AdminService, public dialog: MatDialog) {
    this.scoreCard = [];
    this.scoreQuestion = [];
    this.scoreWeight = [];
    this.whatever = [];
  }

  ngOnInit() {
    this.getScenarios()
  }
  
  getScenarios()
  {
    this.isLoading = true;
    this.adminService.getScenarios();
    this.scenarioSub = this.adminService.getScenariosUpdateListener().subscribe((scenarios:Scenarios[]) => {
      this.scenarios = scenarios;
      this.isLoading = false;

      
      var count = 0;
      this.scenarios.forEach(element => this.scoreCard.push(element.scoreCard));
      console.log("This is the scorecard ", this.scoreCard)

      console.log(this.scenarios)




      this.scoreCard.forEach(element => {
        console.log(count)
        this.whatever.push(element[count].question)
        count++;
        if(element[count])
        {
          
        }
       
        console.log("Whatever ", this.whatever)
        // console.log("this is the question", element[0].question)
        

        for (const key in element) {
          if (Object.prototype.hasOwnProperty.call(element, key)) {
            const thisThing = element[key];
            var dabe = thisThing.question
            // this.scoreQuestion.push(thisThing.question)
            // this.scoreWeight.push(thisThing.weight)
            
            console.log("Ne razbiram ", dabe)

          }
        }
      });
      // for (let index = 0; index < this.scoreCard.length; index++) {
      //   this.whatever.push(this.scoreCard[index]);
      //   console.log(this.whatever)
        
      // }
      // for (let j = 0; j < this.whatever.length; j++) {
      //   const elementk = this.whatever[j];
        // console.log(elementk)
      // }
      // console.log("THISTIN ", this.scoreWeight)
      // console.log("Whatever ", this.whatever)
      // this.whatever.forEach(ok => {
        // console.log(ok)
      // });
    })
    
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(CreateScenarioComponent, {

      width: '75%',
      height: '80%',
      panelClass: 'my-panel',
      data: {},
     
    });

    // dialogRef.afterClosed().subscribe(result => {
    //   console.log('The dialog was closed');
    //   this.animal = result;
    // });
  }

  archiveScenario(scenarioId: string) {
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
      // this.adminService.archiveScenarios(scenarioId)
      // this.getScenarios()
      this.adminService.archiveScenarios(scenarioId, this.scenarios).subscribe((result) => {
        console.log(result)
        
      })
    }
    setTimeout(()=>{
      this.getScenarios()
    }, 10)
     
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
  }
}
