import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { ExcelService } from 'src/services/excel.service';
import { HistoryLogService } from './history-log.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-history-log',
  templateUrl: './history-log.component.html',
  styleUrls: ['./history-log.component.css']
})
export class HistoryLogComponent implements OnInit, OnDestroy {
  userId: string;
  historyContent: string;
  userIsAuthenticated = false;
  isLoading = false;
  logData: any;
  alertKeyword: string;
  private authStatusSub: Subscription;

  historyLogData = new MatTableDataSource()
  @ViewChild(MatSort, {static:false}) sort: MatSort;
  @ViewChild(MatPaginator, {static:false}) paginator: MatPaginator;

  displayedColumns: string [] = ["Initiator", "timestamp", "Content"]

  constructor(private authService: AuthService, private historyLogSvc: HistoryLogService, private dialog:MatDialog, private excelService: ExcelService) { }

  ngOnInit(): void {
    this.userId = this.authService.getUserId();
    this.setAuthentication();
    this.getHistoryLogData();
  }

 
  getHistoryLogData() {
    this.isLoading = true;
    this.historyLogSvc.getHistoryLog().subscribe(result => {
      this.logData = result
      if(result) {

        this.historyLogData = new MatTableDataSource(this.logData)

        setTimeout(() => {
          this.historyLogData.sort = this.sort
          this.historyLogData.paginator =  this.paginator
        })
      }
      this.isLoading = false;
    })
  }

  setAuthentication() {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe((isAuthenticated) => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });
  }

  clearHistoryLog() {
    this.alertKeyword = "erase"
    this.historyLogSvc.confirmAlert(this.alertKeyword).then((result) => {
      if (result.isConfirmed) {
        this.historyLogSvc.successAlert(this.alertKeyword)
        this.excelService.exportExcelFile("History Log", this.logData);
        this.historyLogSvc.clearHistoryLog().subscribe();
        this.historyContent = "History log has been completely erased!"
        this.addHistoryLog(this.historyContent);
      }
    })
  }

  exportExcelFile(){
    this.alertKeyword = "export"
    this.historyLogSvc.confirmAlert(this.alertKeyword).then((result) => {
      if (result.isConfirmed) {
        this.historyLogSvc.successAlert(this.alertKeyword)
        this.excelService.exportExcelFile("History Log", this.logData);
        this.historyContent = "History log has been exported to excel file!"
        this.addHistoryLog(this.historyContent);
      }
    })
  }
  
  addHistoryLog(historyContent){
    this.historyLogSvc.postHistoryLog(historyContent, this.userId).subscribe((response) => {}) 
  }



  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}