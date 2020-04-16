import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  username = '';
  password = '';

  constructor(private http: HttpClient) {}

  login() {
    const body = {
      username: this.username,
      password: this.password,
    };
    this.http.post('http://localhost:3000/session', body).subscribe(
      (res) => console.log(res),
      (err) => console.log(err)
    );
  }
}
