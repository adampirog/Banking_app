import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { DepositService } from '@app/_services/deposit/deposit.service';
import { Transaction, TransactionService } from '@app/_services/transaction/transaction.service';

@Component({
  selector: 'app-new-transaction',
  templateUrl: './new-transaction.component.html',
  styleUrls: ['./new-transaction.component.css']
})
export class NewTransactionComponent implements OnInit {

  canPostTransaction = true;
  private sender: string;
  clicked = false;

  constructor(private fb: FormBuilder,
    private depositService: DepositService,
    private transactionService: TransactionService,
    private snackBar: MatSnackBar,
    private router: Router) { }

  transactionForm = this.fb.group({
    sender: [{ value: '', disabled: true }, [Validators.required]],
    receiver: ['', Validators.required],
    amount: ['', Validators.required]
  });

  ngOnInit(): void {
    this.depositService.getDeposit().subscribe({
      next: value => {
        this.canPostTransaction = true;
        this.transactionForm.controls['sender'].setValue(value.id);
        this.sender = value.id;
      },
      error: value => {
        this.canPostTransaction = false;
      }
    })
  }

  post() {
    if (this.transactionForm.valid) {
      this.clicked = true;
      const transaction: Transaction = {
        amount: this.transactionForm.get('amount').value,
        sender: this.sender,
        receiver: this.transactionForm.get('receiver').value
      };
      this.transactionService.post(transaction).subscribe({
        next: value => {
          setTimeout(() => {
            this.router.navigate(['transactions']);
          }, 3000);
          this.snackBar.open('Poprawnie utworzono przelew!', null, { duration: 3000 });
        }
        , error: value => {
          this.snackBar.open(value.error.message, null, { duration: 3000 });
        }
      });
    }
    else {
      this.snackBar.open('Proszę wypełnić poprawnie formularz.', null, { duration: 3000 });
    }

  }

}
