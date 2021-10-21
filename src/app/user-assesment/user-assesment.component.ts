import { Component, OnInit } from '@angular/core';
import { userService } from './user.service';
import { User } from './user.model';

@Component({
  selector: 'app-user-assesment',
  templateUrl: './user-assesment.component.html',
  styleUrls: ['./user-assesment.component.css']
})
export class UserAssesmentComponent implements OnInit {
user: User
  constructor(private usc: userService) { }

  ngOnInit(): void {
    console.log(this.usc.getUserAssesment())

    this.usc.getUserAssesment().subscribe(res => {
      this.user: {
        id: res._id
      }
    })
  }

}
