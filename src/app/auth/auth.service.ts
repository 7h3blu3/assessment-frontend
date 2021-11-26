import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

import { AuthData } from './auth-data.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient, private router: Router) {}

  //** This is a post, must figure out how to make it work because I cannot check it in the browser as it is not get **/
  //** Also I do not think we need a GET **/

  login(email: string, password: string) {
    console.log('Is this triggered');
    const authData: AuthData = { email: email, password: password };
    this.http
      .post<{ userId: string; userType: string; message: string }>(
        'http://localhost:3000/login',
        authData
      )
      .subscribe((response) => {
        console.log('There is no response ' + response);
      });
  }

  createUser(email: string, password: string) {
    const authData: AuthData = { email: email, password: password };

    this.http
      .post('http://localhost:3000/signup', authData)
      .subscribe((response) => {
        console.log(response);
      });
  }
}
