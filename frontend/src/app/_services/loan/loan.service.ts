import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserService } from '../user/user.service';


export interface Loan {
  id: number;
  depositId: string;
  installments: number;
  installmentsPaid: number;
  interestRate: number;
  purpose: string;
  rateValue: number;
  status: string;
  value: number;
}

export interface LoanRequest {
  interestRate: number;
  purpose: string;
  value: number;
  installments: number;
}

@Injectable({
  providedIn: 'root'
})
export class LoanService {

  constructor(private userService: UserService,
    private http: HttpClient) { }

  getLoans(): Observable<Array<Loan>> {
    const user = this.userService.user;
    return this.http.get<Array<Loan>>(`http://localhost:5000/client/loans?clientId=${user.clientId}`);
  }

  newLoan(loan: LoanRequest) {
    const user = this.userService.user;
    return this.http.post(`http://localhost:5000/client/loans?clientId=${user.clientId}`, loan);
  }
}
