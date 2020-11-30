import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { LoanRequest, LoanService } from '@app/_services/loan/loan.service';

@Component({
  selector: 'app-new-credit',
  templateUrl: './new-loan.component.html',
  styleUrls: ['./new-loan.component.css']
})
export class NewLoanComponent implements OnInit {

  clicked = false;

  constructor(private fb: FormBuilder,
    private loanService: LoanService,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute) { }

  newLoanForm = this.fb.group({
    interestRate: [{ value: 10, disabled: true }],
    purpose: ['', [Validators.required]],
    value: ['', Validators.required],
    installments: ['', Validators.required]
  });
  ngOnInit(): void {
  }

  post() {
    if (this.newLoanForm.valid) {
      const loanRequest: LoanRequest = {
        interestRate: this.newLoanForm.get('interestRate').value / 100,
        value: this.newLoanForm.get('value').value,
        installments: this.newLoanForm.get('installments').value,
        purpose: this.newLoanForm.get('purpose').value
      }
      this.clicked = true;
      this.loanService.newUserLoan(loanRequest).subscribe({
        next: value => {
          console.log(value);
          this.snackBar.open('Pomyślnie utworzono zlecenie! Poczekaj na akceptację przez pracownika',
            null, { duration: 3000 });
          setTimeout(() => {
            this.router.navigate(['../../loans'], { relativeTo: this.route });
          }, 3000);
        },
        error: value => {
          this.snackBar.open('Coś poszło nie tak! Skonsultuj się z Działem Obsługi Klienta',
            null, { duration: 3000 });
          this.clicked = false;
        }
      });
    }
    else {
      this.snackBar.open('Niepoprawnie wypełniłeś formularz', null, { duration: 3000 });
    }
  }

}
