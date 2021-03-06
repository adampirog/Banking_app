import { Component, Input, OnInit } from '@angular/core';
import { Deposit, DepositService } from '@app/_services/deposit/deposit.service';
import { UserService } from '@app/_services/user/user.service';

@Component({
  selector: 'app-deposit-summary',
  templateUrl: './deposit-summary.component.html',
  styleUrls: ['./deposit-summary.component.css']
})
export class DepositSummaryComponent implements OnInit {

  deposit: Deposit;

  constructor(private depositService: DepositService,
    private userService: UserService    
  ) { }

  ngOnInit(): void {
    const user = this.userService.user;
    this.depositService.getDepositByClientId(user.clientId).subscribe({
      next: result => {
        this.deposit = result;
      },
      error: result => {
        console.log(result);
      }
    });
  }
}
