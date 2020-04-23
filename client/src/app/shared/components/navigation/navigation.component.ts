import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/modules/core/services/auth.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css'],
})
export class NavigationComponent implements OnInit {
  constructor(private authService: AuthService) {}
  loggedUser: string;
  ngOnInit(): void {
    this.loggedUser = localStorage.getItem('username');
  }

  logout() {
    this.authService.logout().subscribe();
  }
}
