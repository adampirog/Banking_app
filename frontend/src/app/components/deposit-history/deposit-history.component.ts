import { Component, OnInit } from '@angular/core';
import { DepositService, HistoryTransferRecord } from '@app/_services/deposit/deposit.service';

@Component({
  selector: 'app-deposit-history',
  templateUrl: './deposit-history.component.html',
  styleUrls: ['./deposit-history.component.css']
})
export class DepositHistoryComponent implements OnInit {

  outgoing: Array<HistoryTransferRecord> = [];
  incoming: Array<HistoryTransferRecord> = [];
  constructor(private depositService: DepositService) { }

  ngOnInit(): void {
    this.depositService.getOutgoingHistory().subscribe({
      next: result => {
        this.outgoing = result;
      },
      error: result => {
        console.log(result);
      }
    });
    this.depositService.getIncomingHistory().subscribe({
      next: result => {
        this.incoming = result;
      },
      error: result => {
        console.log(result);
      }
    });
  }
}
