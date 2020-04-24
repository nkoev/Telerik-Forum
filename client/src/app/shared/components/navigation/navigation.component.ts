import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/modules/core/services/auth.service';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css'],
})
export class NavigationComponent implements OnInit {
  constructor(private authService: AuthService) {}
  isLoggedIn: boolean;
  loggedUser: User;

  ngOnInit(): void {
    this.authService.loggedUser$.subscribe((res) => (this.loggedUser = res));
    this.authService.isLoggedIn$.subscribe((res) => (this.isLoggedIn = res));
  }

  logout() {
    this.authService.logout().subscribe();
  }
}
