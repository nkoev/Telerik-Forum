import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  username = '';
  password = '';
  confirmPassword = '';

  constructor() {}

  ngOnInit(): void {}

  onSubmit() {
    console.log(this.username);
  }
}
