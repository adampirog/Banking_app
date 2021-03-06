import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClientListComponent } from './components/admin/client-list/client-list.component';

import { ClientAccessGuard, AdminAccessGuard } from './_helpers/auth.guard';

import { LoginComponent } from './components/common/login/login.component';
import { RegisterComponent } from './components/common/register/register.component';
import { NewTransactionComponent } from './components/common/new-transaction/new-transaction.component';

import { DepositSummaryComponent } from './components/client/deposit-summary/deposit-summary.component';
import { ClientPageComponent } from './components/client/client-page/client-page.component';
import { NewLoanComponent } from './components/client/new-loan/new-loan.component';
import { AdminPageComponent } from './components/admin/admin-page/admin-page.component';
import { ClientLoansComponent } from './components/client/client-loans/client-loans.component';
import { AdminLoansComponent } from './components/admin/admin-loans/admin-loans.component';
import { DepositHistoryComponent } from './components/common/deposit-history/deposit-history.component';
import { AccountsComponent } from './components/admin/accounts/accounts.component';
import { LoanHistoryComponent } from './components/common/loan-history/loan-history.component';


const routes: Routes = [
  {
    path: 'client', component: ClientPageComponent, canActivate: [ClientAccessGuard],
    children: [
      { path: 'loans', component: ClientLoansComponent },
      { path: 'loans/new', component: NewLoanComponent },
      { path: 'loans/history/:loanId', component: LoanHistoryComponent },
      { path: 'deposit', component: DepositSummaryComponent },
      { path: 'transactions/new', component: NewTransactionComponent },
      { path: 'transactions/:clientId', component: DepositHistoryComponent }
    ]
  },
  {
    path: 'admin', component: AdminPageComponent, canActivate: [AdminAccessGuard], children: [
      { path: 'clients', component: ClientListComponent },
      { path: 'loans', component: AdminLoansComponent },
      { path: 'loans/history/:loanId', component: LoanHistoryComponent },
      { path: 'transactions/new', component: NewTransactionComponent },
      { path: 'transactions/:clientId', component: DepositHistoryComponent },
      { path: 'accounts', component: AccountsComponent }
    ]
  },
  { path: '', component: LoginComponent },
  { path: 'logout', redirectTo: 'login' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  { path: '**', redirectTo: 'login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
