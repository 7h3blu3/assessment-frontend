import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { ScenariosBackup } from '../../scenarios.model';
import { AdminService } from '../../admin.service';
import { Subscription } from 'rxjs';
import { MatSort } from '@angular/material/sort';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/auth/auth.service';
import { HistoryLogService } from '../../history-log/history-log.service';

@Component({
  selector: 'app-archived-scenarios',
  templateUrl: './archived-scenarios.component.html',
  styleUrls: ['./archived-scenarios.component.css']
})
export class ArchivedScenariosComponent implements OnInit, OnDestroy {
  userIsAuthenticated = false;
  private authStatusSub: Subscription;
  scenarios: ScenariosBackup[] = []
  alertKeyword: string;
  historyContent: string;
  userId: string;
  isLoading = false;
  private scenarioSub: Subscription;
  @ViewChild(MatSort, {static:false}) sort: MatSort;
  constructor(public adminService: AdminService, private authService: AuthService, private historyLogSvc: HistoryLogService) {}

  ngOnInit() {
    this.userId = this.authService.getUserId();
    this.getScenarios()
    this.setAuthentication();
  }


  // getScenarios()
  // {
  //   this.isLoading = true;
  //   this.adminService.getArchivedScenarios();
  //   this.scenarioSub = this.adminService.getScenariosBckpUpdateListener().subscribe((scenarios:ScenariosBackup[]) => {
  //     this.scenarios = scenarios;
  //     this.isLoading = false;
  //   })
  // }

  getScenarios()
  {
    this.isLoading = true;
    this.adminService.getArchivedScenarios().subscribe((scenarios:ScenariosBackup[]) => {
      this.scenarios = scenarios;
      this.isLoading = false;
    })
  }

  restoreScenario(scenarioId: string) {
    this.alertKeyword = "restore"
    this.confirmAlert(this.alertKeyword).then((result) => {
      if (result.isConfirmed) {
          this.adminService.restoreScenarios(scenarioId).subscribe(result => {
            console.log("result ", result)
          this.successAlert(this.alertKeyword, result.title)
          this.historyContent = "Scenario " + result.title + " - " + result.level + " - " + result.mission + " - " + result.type + " restored."
          this.addHistoryLog(this.historyContent);
        })
      } 
      setTimeout(()=>{
        this.getScenarios()
      }, 10)
    })

  }

  deleteScenario(scenarioId: string){
    this.alertKeyword = "delete"
    this.confirmAlert(this.alertKeyword).then((result) => {
      if (result.isConfirmed) {
          this.adminService.deleteScenario(scenarioId).subscribe(result => {
          this.successAlert(this.alertKeyword, result.title)
          this.historyContent = "Scenario " + result.title + " has been deleted!"
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
    this.historyLogSvc.postHistoryLog(historyContent, this.userId).subscribe((response) => {}) 
  }

  confirmAlert(keyword) {
    let title, icon, confirmButtonColor, confirmButtonText;
    if(keyword == "restore") {
      title = "Are you sure you want to restore this scenario ?";
      icon = "question";
      confirmButtonColor = "##198C19";
      confirmButtonText = "Restore!";
    }
    else if (keyword == "delete") {
      title = "Are you sure you want to delete this scenario ?";
      icon = "warning";
      confirmButtonColor = "#FA4A1E";
      confirmButtonText = "Delete!"
    } 
    return this.adminService.confirmAlert(title, icon, confirmButtonColor, confirmButtonText);
  }

  successAlert(keyword, scenarioTitle) {
    let title, html;
    if(keyword == "restore") {
      title = "Restored!";
      html = "Scenario <strong>" + scenarioTitle + "</strong> has been restored!";
    }
    else if (keyword == "delete") {
      title = "Deleted!";
      html = "Scenario <strong>" + scenarioTitle + "</strong> has been deleted!";
    } 
    return this.adminService.successAlert(title, html);
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
