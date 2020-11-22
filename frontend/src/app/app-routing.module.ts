import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DepositHistoryComponent } from './components/deposit-history/deposit-history.component';
import { DepositSummaryComponent } from './components/deposit-summary/deposit-summary.component';

import { LandPageComponent } from './components/land-page/land-page.component';
import { LoansComponent } from './components/loans/loans.component';
import { LoginComponent } from './components/login/login.component';
import { NewLoanComponent } from './components/new-loan/new-loan.component';
import { NewTransactionComponent } from './components/new-transaction/new-transaction.component';
import { RegisterComponent } from './components/register/register.component';
import { ClientAccessGuard } from './_helpers/auth.guard';

const routes: Routes = [
  {
    path: '', component: LandPageComponent, canActivate: [ClientAccessGuard],
    children: [
      { path: 'loans', component: LoansComponent },
      { path: 'loans/new', component: NewLoanComponent },
      { path: 'deposit', component: DepositSummaryComponent },
      { path: 'transactions', component: DepositHistoryComponent },
      { path: 'transactions/new', component: NewTransactionComponent }
    ]
  },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  { path: '**', redirectTo: 'deposit', canActivate: [ClientAccessGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
