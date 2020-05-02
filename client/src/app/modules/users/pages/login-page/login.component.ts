import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/modules/core/services/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificatorService } from 'src/app/modules/core/services/notificator.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private notificator: NotificatorService
  ) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      username: [null, [Validators.required]],
      password: [null, [Validators.required]],
    });
  }

  get username() {
    return this.loginForm.get('username');
  }
  get password() {
    return this.loginForm.get('password');
  }

  login() {
    this.authService
      .login({ username: this.username.value, password: this.password.value })
      .subscribe(
        () => this.router.navigate(['posts']),
        () => this.notificator.error(`Wrong username or password!`)
      );
  }
}
