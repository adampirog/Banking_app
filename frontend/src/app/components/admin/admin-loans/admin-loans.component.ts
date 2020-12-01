import { Component, OnInit } from '@angular/core';
import { Loan, LoanService, LoanStatus } from '@app/_services/loan/loan.service';

@Component({
  selector: 'app-admin-loans',
  templateUrl: './admin-loans.component.html',
  styleUrls: ['./admin-loans.component.css']
})
export class AdminLoansComponent implements OnInit {

  pendingLoans: Array<Loan> = [];
  rejectedLoans: Array<Loan> = [];
  openLoans: Array<Loan> = [];
  closedLoans: Array<Loan> = [];

  constructor(private loanService: LoanService) { }

  async ngOnInit(): Promise<void> {
    this.pendingLoans = await this.loanService.getLoans(LoanStatus.pending).toPromise();
    this.rejectedLoans = await this.loanService.getLoans(LoanStatus.rejected).toPromise();
    this.openLoans = await this.loanService.getLoans(LoanStatus.open).toPromise();
    this.closedLoans = await this.loanService.getLoans(LoanStatus.closed).toPromise();
  }
}
