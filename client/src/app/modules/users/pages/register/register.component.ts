import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { passwordsValidator } from 'src/app/modules/users/validators/match-passwords';
import { Router } from '@angular/router';
import { UsersDataService } from '../../services/users-data.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  invalid: boolean;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private registerService: UsersDataService
  ) {}

  ngOnInit() {
    this.registerForm = this.fb.group(
      {
        username: [null, [Validators.required, Validators.minLength(5)]],
        password: [null, [Validators.required, Validators.minLength(5)]],
        confirmPassword: null,
      },
      { validators: [passwordsValidator] }
    );
  }

  get username() {
    return this.registerForm.get('username');
  }
  get password() {
    return this.registerForm.get('password');
  }
  get confirmPassword() {
    return this.registerForm.get('confirmPassword');
  }

  onSubmit(form: FormGroup) {
    if (form.invalid) {
      this.invalid = true;
    } else {
      this.registerService
        .register(this.username.value, this.password.value)
        .subscribe(
          () => {
            this.invalid = false;
            setTimeout(() => this.router.navigateByUrl('login'), 3000);
          },
          (err) => console.log(err)
        );
    }
  }
}
