import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { passwordsValidator } from 'src/app/modules/users/validators/match-passwords';
import { Router } from '@angular/router';
import { UsersDataService } from '../../services/users-data.service';
import { map } from 'rxjs/operators';
import { UserDTO } from 'src/app/models/user.dto';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  regForm: FormGroup;
  registeredUsernames: string[];
  errorMessage: string;
  successMessage: string;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private usersDataService: UsersDataService
  ) {}

  ngOnInit() {
    this.regForm = this.fb.group(
      {
        username: [
          null,
          [
            Validators.required,
            Validators.minLength(5),
            Validators.maxLength(20),
          ],
        ],
        password: [
          null,
          [
            Validators.required,
            Validators.minLength(5),
            Validators.maxLength(20),
          ],
        ],
        confirmPassword: [null, [Validators.required]],
      },
      { validators: [passwordsValidator] }
    );
    this.usersDataService
      .getAllUsers()
      .pipe(map((users: UserDTO[]) => users.map((user) => user.username)))
      .subscribe((users: string[]) => (this.registeredUsernames = users));
  }

  get username() {
    return this.regForm.get('username');
  }
  get password() {
    return this.regForm.get('password');
  }
  get confirmPassword() {
    return this.regForm.get('confirmPassword');
  }

  onSubmit(form: FormGroup) {
    const username = form.get('username').value;
    const password = form.get('password').value;
    this.successMessage = '';
    this.errorMessage = '';

    form.invalid
      ? (this.errorMessage = 'Please check if all the fields are correct')
      : this.registeredUsernames.includes(username)
      ? (this.errorMessage = 'Username already taken')
      : ((this.successMessage = 'You have registered Successfully'),
        this.registerUser(username, password));
  }

  private registerUser(username: string, password: string) {
    this.usersDataService.register(username, password).subscribe(
      () => {
        setTimeout(() => this.router.navigateByUrl('login'), 3000);
      },
      (err) => console.log(err)
    );
  }
}
