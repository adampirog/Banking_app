import { Component, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Loan, LoanService } from '@app/_services/loan/loan.service';

@Component({
  selector: 'app-loans',
  templateUrl: './loans.component.html',
  styleUrls: ['./loans.component.css']
})
export class LoansComponent implements OnInit {

  @Input()
  loans: Array<Loan> = [];

  @Input()
  canDecide = false;

  constructor(private loanService: LoanService,
    private snackBar: MatSnackBar) { }

  ngOnInit(): void {
  }

  reject(loan: Loan) {
    this.loanService.rejectLoan(loan).subscribe({
      next: value => {
        this.loans = this.loans.filter(elem => elem !== loan);
        this.snackBar.open(`Odrzucono kredyt ${loan.purpose || 'bez nazwy'}`, null, { duration: 2000 });
      },
      error: e => {
        this.snackBar.open(`Coś poszło nie tak przy odrzucaniu kredytu ${loan.purpose || 'bez nazwy'}`, null, { duration: 2000 });
      }
    });
  }
  accept(loan: Loan) {
    this.loanService.acceptLoan(loan).subscribe({
      next: value => {
        this.loans = this.loans.filter(elem => elem !== loan);
        this.snackBar.open(`Zaakceptowano kredyt ${loan.purpose || 'bez nazwy'}`, null, { duration: 2000 });
      },
      error: e => {
        this.snackBar.open(`Coś poszło nie tak przy akceptacji kredytu ${loan.purpose || 'bez nazwy'}`, null, { duration: 2000 });
      }
    });
  }
}
