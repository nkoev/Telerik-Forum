import { Component } from '@angular/core';
import { UsersDataService } from '../../services/users-data.service';
import { AuthService } from 'src/app/modules/core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  username = '';
  password = '';

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.authService.login(this.username, this.password).subscribe(
      () => this.router.navigateByUrl('home'),
      (err) => console.log(err)
    );
  }
}
