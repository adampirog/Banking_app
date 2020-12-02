import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserService } from '../user/user.service';

export enum LoanStatus {
  open = 'open',
  closed = 'closed',
  rejected = 'rejected',
  pending = 'pending'
}

export interface Loan {
  id: number;
  depositId: string;
  installments: number;
  installmentsPaid: number;
  interestRate: number;
  purpose: string;
  rateValue: number;
  status: LoanStatus;
  value: number;
}

export interface LoanRequest {
  interestRate: number;
  purpose: string;
  value: number;
  installments: number;
}

export interface RepaymentRecord {
  id: number;
  amount: number;
  loanId: number;
  paymentDate: string;
}

@Injectable({
  providedIn: 'root'
})
export class LoanService {

  constructor(private userService: UserService,
    private http: HttpClient) { }

  /**
   * Get loans of currently logged user.
   */
  getUserLoans(): Observable<Array<Loan>> {
    const user = this.userService.user;
    return this.http.get<Array<Loan>>(`http://localhost:5000/client/loans?clientId=${user.clientId}`);
  }

  /** Create new loan request as logged user. */
  newUserLoan(loan: LoanRequest) {
    const user = this.userService.user;
    return this.newLoan(loan, user.clientId);
  }

  newLoan(loan: LoanRequest, clientId: number) {
    return this.http.post(`http://localhost:5000/client/loans?clientId=${clientId}`, loan);
  }

  getLoans(status: LoanStatus): Observable<Array<Loan>> {
    return this.http.get<Array<Loan>>(`http://localhost:5000/loans?status=${status}`);
  }

  acceptLoan(acceptedLoan: Loan) {
    const loan: Loan = { ...acceptedLoan };
    loan.status = LoanStatus.open;
    return this.updateLoan(loan);
  }

  getLoanHistory(loanId: number) {
    const user = this.userService.user;
    return this.http.get<Array<RepaymentRecord>>(`http://localhost:5000/client/loans/records?userId=${user.clientId}&loanId=${loanId}`);
  }

  rejectLoan(rejectedLoan: Loan) {
    const loan: Loan = { ...rejectedLoan };
    loan.status = LoanStatus.rejected;
    return this.updateLoan(loan);
  }
  updateLoan(loan: Loan) {
    return this.http.patch('http://localhost:5000/loans', loan);
  }

}
