import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { Deposit } from '../deposit/deposit.service';

export interface LoginForm {
  email: string;
  password: string;
}

export interface User {
  id?: number;
  userType: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password?: string;
  deposit?: Deposit;
}

export enum Role {
  Admin = 'admin',
  Client = 'client'
}

export interface LoggedUserData {
  clientId: number;
  token: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  user: LoggedUserData;

  constructor(private http: HttpClient) {
    this.user = JSON.parse(localStorage.getItem('user'));
  }

  login(userForm: LoginForm): Observable<void> {
    return this.http.post('http://localhost:5000/user/login', userForm).pipe(map(user => {
      localStorage.setItem('user', JSON.stringify(user));
      this.user = user as LoggedUserData;
      return;
    }));
  }
  register(userForm: User): Observable<void> {
    return this.http.post('http://localhost:5000/user/register', userForm).pipe(map(user => {
      return;
    }));
  }

  logout(): Observable<void> {
    localStorage.removeItem('user');
    return of(null).pipe(delay(500));
  }

  getUsers(): Observable<Array<User>> {
    return this.http.get<Array<User>>('http://localhost:5000/users');
  }
}
