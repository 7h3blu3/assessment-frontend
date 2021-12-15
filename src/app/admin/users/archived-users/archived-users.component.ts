import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AdminService } from '../../admin.service';

@Component({
  selector: 'app-archived-users',
  templateUrl: './archived-users.component.html',
  styleUrls: ['./archived-users.component.css']
})
export class ArchivedUsersComponent implements OnInit {
  isLoading = false;

  userData = new MatTableDataSource()
  constructor(private adminService: AdminService, private dialog:MatDialog) { }

  @ViewChild(MatSort, {static:false}) sort: MatSort;
  @ViewChild(MatPaginator, {static:false}) paginator: MatPaginator;

  displayedColumns: string [] = ["EMAIL", "USERTYPE", "LEVEL", "MISSION", "ARCHIVE"
]

  ngOnInit(): void {
    this.getUsers()
  }

  getUsers() {
    this.isLoading = true;
    this.adminService.getArchivedUsers().subscribe(result => {
      const users = result
      if(result) {

        this.userData = new MatTableDataSource(users)

        setTimeout(() => {
          this.userData.sort = this.sort
          this.userData.paginator =  this.paginator
        })
      }
      this.isLoading = false;
    })
  }
}
