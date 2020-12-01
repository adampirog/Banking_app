import { Component, OnInit } from '@angular/core';
import { DepositService } from '@app/_services/deposit/deposit.service';
import { Loan, LoanService } from '@app/_services/loan/loan.service';
import { UserService } from '@app/_services/user/user.service';

@Component({
  selector: 'app-client-loans',
  templateUrl: './client-loans.component.html',
  styleUrls: ['./client-loans.component.css']
})
export class ClientLoansComponent implements OnInit {
  loans: Array<Loan> = [];
  hasDeposit = false;

  constructor(private loanService: LoanService,
    private userService: UserService,
    private depositService: DepositService) { }

  ngOnInit(): void {
    const user = this.userService.user;
    this.loanService.getUserLoans().subscribe({
      next: result => {
        this.loans = result;
      }
      , error: result => {
        this.loans = [];
      }
    });
    this.depositService.getDepositByClientId(user.clientId).subscribe({
      next: value => {
        this.hasDeposit = true;
      }
    });
  }
}
