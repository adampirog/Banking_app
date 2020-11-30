import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DepositService, HistoryTransferRecord } from '@app/_services/deposit/deposit.service';

@Component({
  selector: 'app-deposit-history',
  templateUrl: './deposit-history.component.html',
  styleUrls: ['./deposit-history.component.css']
})
export class DepositHistoryComponent implements OnInit {

  clientId: number;
  outgoing: Array<HistoryTransferRecord> = [];
  incoming: Array<HistoryTransferRecord> = [];

  constructor(private depositService: DepositService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe({
      next: params => {
        this.clientId = +params.clientId;
        this.getTransactions(this.clientId);
      }
    });
  }
  getTransactions(clientId: number) {
    this.depositService.getOutgoingHistory(clientId).subscribe({
      next: result => {
        this.outgoing = result;
      },
      error: result => {
        console.log(result);
      }
    });
    this.depositService.getIncomingHistory(clientId).subscribe({
      next: result => {
        this.incoming = result;
      },
      error: result => {
        console.log(result);
      }
    });
  }
}
