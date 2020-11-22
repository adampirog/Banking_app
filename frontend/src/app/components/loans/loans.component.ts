import { Component, OnInit } from '@angular/core';
import { LoanService, Loan } from '@app/_services/loan/loan.service';
import { UserService } from '@app/_services/user/user.service';

@Component({
  selector: 'app-loans',
  templateUrl: './loans.component.html',
  styleUrls: ['./loans.component.css']
})
export class LoansComponent implements OnInit {

  loans = new Array<Loan>();
  constructor(private loanService: LoanService,
    private userService: UserService) { }

  ngOnInit(): void {
    this.loanService.getLoans().subscribe({
      next: result => {
        this.loans = result.map(loan => {
          if (loan.status.toLowerCase() === 'pending') {
            loan.status = 'Oczekuje na akceptację';
          }
          if (loan.status.toLowerCase() === 'open') {
            loan.status = 'Aktywny';
          }
          return loan;
        });
      }
      , error: result => {
        this.loans = [];
      }
    });
  }

}
