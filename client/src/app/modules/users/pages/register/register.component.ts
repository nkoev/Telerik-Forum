import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, NgForm, FormBuilder } from '@angular/forms';
import { passwordsValidator } from 'src/app/modules/users/shared/passwords.directive';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  constructor(private fb: FormBuilder) {}
  registerForm: FormGroup;
  invalid = false;

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
      this.invalid = false;
    }
  }
}
