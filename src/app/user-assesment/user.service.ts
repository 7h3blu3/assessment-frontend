import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { User } from './user.model';


@Injectable({ providedIn: 'root' })

export class userService {
    
    constructor(private http: HttpClient, private router: Router){

        
    }

    getUserAssesment() {
        return this.http.get<User>("http://localhost:3000/start-assessment").pipe(map(res => { return res;}))
    }

}