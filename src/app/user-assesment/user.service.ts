import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';


@Injectable({ providedIn: 'root' })

export class userService {
    
    constructor(private http: HttpClient, private router: Router){

        
    }


}