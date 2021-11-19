import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { User } from './user.model';
import { Subject } from 'rxjs';


@Injectable({ providedIn: 'root' })

export class UserService {
    private user: User[] = [];
    private userUpdated = new Subject<User[]>();
    constructor(private http: HttpClient, private router: Router){

        
    }

    // getStartAssesment() {
    //     return this.http.get<User>("http://localhost:3000/start-assessment").pipe(map(res => { return res;}))
    // }


    // I think the upper one has a way to be used easier
    getStartAssesment() {
        this.http
          .get<{ message: string; user: User[] }>(
            'http://localhost:3000/start-assessment'
          )
          .subscribe((userData) => {
            this.user = userData.user;
            this.userUpdated.next([...this.user]);
          });
      }
    
      
      getUserUpdateListener() {
        return this.userUpdated.asObservable();
      }

      
}