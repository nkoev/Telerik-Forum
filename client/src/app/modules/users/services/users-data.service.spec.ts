import { UsersDataService } from './users-data.service';
import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';

describe('UsersDataService', () => {
  let usersUrl: string;
  let httpMock: Partial<HttpClient>;
  let service: UsersDataService;

  beforeEach(() => {
    jest.clearAllMocks();

    usersUrl = 'http://localhost:3000/users';
    httpMock = {
      get: jest.fn(),
      put: jest.fn(),
      post: jest.fn(),
      delete: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        UsersDataService,
        { provide: HttpClient, useValue: httpMock },
      ],
    });

    service = TestBed.inject(UsersDataService);
  });

  describe('getAllUsers method', () => {
    it('should call HttpClient get method once with correct arguments', (done) => {
      jest.spyOn(httpMock, 'get').mockImplementation(() => of('getAllUsers'));

      service.getAllUsers().subscribe(() => {
        expect(httpMock.get).toHaveBeenCalledTimes(1);
        expect(httpMock.get).toHaveBeenCalledWith(usersUrl);
        done();
      });
    });
    it('should return the result from HttpClient get method', (done) => {
      jest.spyOn(httpMock, 'get').mockImplementation(() => of('getAllUsers'));

      service.getAllUsers().subscribe((res: any) => {
        expect(res).toEqual('getAllUsers');
        done();
      });
    });
  });

  describe('register method', () => {
    it('should call HttpClient post method once with correct arguments', (done) => {
      jest.spyOn(httpMock, 'post').mockImplementation(() => of('register'));

      service.register('username', 'password').subscribe(() => {
        expect(httpMock.post).toHaveBeenCalledTimes(1);
        expect(httpMock.post).toHaveBeenCalledWith(usersUrl, {
          username: 'username',
          password: 'password',
        });
        done();
      });
    });
    it('should return the result from HttpClient post method', (done) => {
      jest.spyOn(httpMock, 'post').mockImplementation(() => of('register'));

      service.register('username', 'password').subscribe((res: any) => {
        expect(res).toEqual('register');
        done();
      });
    });
  });

  describe('acceptFriendRequest method', () => {
    it('should call HttpClient put method once with correct arguments', (done) => {
      jest
        .spyOn(httpMock, 'put')
        .mockImplementation(() => of('acceptFriendRequest'));

      service.acceptFriendRequest('userId').subscribe(() => {
        expect(httpMock.put).toHaveBeenCalledTimes(1);
        expect(httpMock.put).toHaveBeenCalledWith(
          `${usersUrl}/friends/requests/userId`,
          {
            body: {},
          }
        );
        done();
      });
    });
    it('should return the result from HttpClient put method', (done) => {
      jest
        .spyOn(httpMock, 'put')
        .mockImplementation(() => of('acceptFriendRequest'));

      service.acceptFriendRequest('userId').subscribe((res: any) => {
        expect(res).toEqual('acceptFriendRequest');
        done();
      });
    });
  });

  describe('rejectFriendRequest method', () => {
    it('should call HttpClient delete method once with correct arguments', (done) => {
      jest
        .spyOn(httpMock, 'delete')
        .mockImplementation(() => of('rejectFriendRequest'));

      service.rejectFriendRequest('userId').subscribe(() => {
        expect(httpMock.delete).toHaveBeenCalledTimes(1);
        expect(httpMock.delete).toHaveBeenCalledWith(
          `${usersUrl}/friends/requests/userId`
        );
        done();
      });
    });
    it('should return the result from HttpClient delete method', (done) => {
      jest
        .spyOn(httpMock, 'delete')
        .mockImplementation(() => of('rejectFriendRequest'));

      service.rejectFriendRequest('userId').subscribe((res: any) => {
        expect(res).toEqual('rejectFriendRequest');
        done();
      });
    });
  });
});
