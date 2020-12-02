import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoanService, RepaymentRecord } from '@app/_services/loan/loan.service';

@Component({
  selector: 'app-loan-history',
  templateUrl: './loan-history.component.html',
  styleUrls: ['./loan-history.component.css']
})
export class LoanHistoryComponent implements OnInit {
  private loanId: number;

  repaymentRecords: Array<RepaymentRecord> = [];

  constructor(private loanService: LoanService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe({
      next: params => {
        this.loanId = +params.loanId;
        this.getTransactions(this.loanId);
      }
    });
  }

  private getTransactions(loanId: number) {
    this.loanService.getLoanHistory(loanId).subscribe({
      next: value => {
        this.repaymentRecords = value;
      },
      error: value => {
        console.log(value);
      }
    });
  }

}
