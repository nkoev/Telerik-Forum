import { RegisterComponent } from './register.component';
import { UsersDataService } from '../../services/users-data.service';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedModule } from 'src/app/shared/modules/shared.module';
import { of } from 'rxjs';
import { UserDTO } from 'src/app/models/user.dto';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

describe('RegisterComponent', () => {
  const user: UserDTO = {
    id: 'test id',
    username: 'test username',
    roles: ['test roles'],
    banStatus: false,
  };
  function updateForm(
    username: string,
    password: string,
    confirmPassword: string
  ) {
    component.regForm.controls.username.setValue(username);
    component.regForm.controls.password.setValue(password);
    component.regForm.controls.confirmPassword.setValue(confirmPassword);
  }
  let usersDataService: Partial<UsersDataService>;
  let fixture: ComponentFixture<RegisterComponent>;
  let component: RegisterComponent;
  let router: Router;

  beforeEach(() => {
    jest.clearAllMocks();

    usersDataService = {
      getAllUsers: jest.fn(() => of([user])),
      register: jest.fn(() => of(user)),
    };

    TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      imports: [
        RouterTestingModule.withRoutes([]),
        SharedModule,
        ReactiveFormsModule,
      ],
      providers: [
        { provide: UsersDataService, useValue: usersDataService },
        FormBuilder,
      ],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(RegisterComponent);
        component = fixture.componentInstance;
        router = TestBed.inject(Router);
      });
  });

  it('should be defined', () => {
    expect(component).toBeDefined();
  });

  describe('ngOnInit method', () => {
    it('should create form with null default values', () => {
      component.ngOnInit();

      expect(component.regForm).toBeTruthy();
      expect(component.regForm.value).toEqual({
        confirmPassword: null,
        username: null,
        password: null,
      });
    });

    it('should call UsersDataService getAllUsers method', () => {
      component.ngOnInit();

      expect(usersDataService.getAllUsers).toHaveBeenCalledTimes(1);
    });

    it('should assign the regesteredUsernames field with correct value', () => {
      component.ngOnInit();

      expect(component.registeredUsernames).toEqual(['test username']);
    });
  });

  describe('onSubmit method', () => {
    it('should assign errorMessage field if form is invalid', () => {
      component.ngOnInit();
      updateForm('aaaaa', 'bbbbb', 'c');
      component.onSubmit(component.regForm);

      expect(component.errorMessage).toBeTruthy();
    });

    it('should assign errorMessage field if username taken', () => {
      component.ngOnInit();
      updateForm('test username', 'bbbbb', 'bbbbb');
      component.onSubmit(component.regForm);

      expect(component.errorMessage).toBeTruthy();
    });

    it('should assign successMessage field if form is valid', () => {
      component.ngOnInit();
      updateForm('aaaaa', 'bbbbb', 'bbbbb');
      component.onSubmit(component.regForm);

      expect(component.successMessage).toBeTruthy();
    });

    it('should call UsersDataSrvice register method if form is valid', () => {
      component.ngOnInit();
      updateForm('aaaaa', 'bbbbb', 'bbbbb');
      component.onSubmit(component.regForm);

      expect(usersDataService.register).toHaveBeenCalledTimes(1);
    });

    it('should call UsersDataSrvice register with correct values', () => {
      component.ngOnInit();
      updateForm('aaaaa', 'bbbbb', 'bbbbb');
      component.onSubmit(component.regForm);

      expect(usersDataService.register).toHaveBeenCalledWith('aaaaa', 'bbbbb');
    });

    it('should navigate to /login if form is valid', () => {
      component.ngOnInit();
      updateForm('aaaaa', 'bbbbb', 'bbbbb');
      component.onSubmit(component.regForm);

      setTimeout(() => {
        expect(router.navigateByUrl).toHaveBeenCalledWith('login');
      }, 3001);
    });
  });
});
