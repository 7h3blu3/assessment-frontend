import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AdminService } from '../../admin.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-archived-users',
  templateUrl: './archived-users.component.html',
  styleUrls: ['./archived-users.component.css']
})
export class ArchivedUsersComponent implements OnInit {
  isLoading = false;
  users:any;

  userData = new MatTableDataSource()
  constructor(private adminService: AdminService, private dialog:MatDialog) { 
    this.users = [];
   }

  @ViewChild(MatSort, {static:false}) sort: MatSort;
  @ViewChild(MatPaginator, {static:false}) paginator: MatPaginator;

  displayedColumns: string [] = ["EMAIL", "USERTYPE", "LEVEL", "MISSION", "RESTORE"
]

  ngOnInit(): void {
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
    Swal.fire({
    title: 'Are you sure you want to restore this user ?',
    icon: 'info',
    showCancelButton: true,
    confirmButtonColor: 'green',
    cancelButtonColor: '#3F51B5',
    confirmButtonText: 'Restore!'
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        title:'Restored!',
        text:'User has been successfully restored!',
        icon:'success',
        confirmButtonColor: '#3F51B5',
      })
      //This is the actual code
      this.adminService.restoreUsers(userId)
    }
    setTimeout(()=>{
      this.getUsers()
    }, 10)
  })

    console.log("Show me the data ", userId)
  }

}
