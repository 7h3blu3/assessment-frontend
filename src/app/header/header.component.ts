import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  userIsAuthenticated = false;
  private authListenerSubs: Subscription;
  userType: any;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.setAuthentication();
    this.setUserType();

  }

  setAuthentication() {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListenerSubs = this.authService.getAuthStatusListener().subscribe((isAuthenticated) => {
        this.userIsAuthenticated = isAuthenticated;
        this.setUserType();

      });
      console.log("userIsAuthenticated ", this.userIsAuthenticated)
  }

  setUserType() {
    this.userType = localStorage.getItem("userType")
  }

  onLogout() {
    this.authService.logout();
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe()
  } 
}
