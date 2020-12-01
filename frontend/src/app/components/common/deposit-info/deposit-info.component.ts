import { Component, Input, OnInit } from '@angular/core';
import { Deposit } from '@app/_services/deposit/deposit.service';

@Component({
  selector: 'app-deposit-info',
  templateUrl: './deposit-info.component.html',
  styleUrls: ['./deposit-info.component.css']
})
export class DepositInfoComponent implements OnInit {

  @Input() deposit: Deposit;
  constructor() { }

  ngOnInit(): void {
  }

}
