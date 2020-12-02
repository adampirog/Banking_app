import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

// Angular material imports
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSnackBarModule } from '@angular/material/snack-bar';

// App imports
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { TokenInterceptor } from './_helpers/auth-interceptor';

import { RegisterComponent } from './components/common/register/register.component';
import { DepositHistoryComponent } from './components/common/deposit-history/deposit-history.component';
import { NewTransactionComponent } from './components/common/new-transaction/new-transaction.component';
import { LoginComponent } from './components/common/login/login.component';
import { LoansComponent } from './components/common/loans/loans.component';
import { DepositInfoComponent } from './components/common/deposit-info/deposit-info.component';

import { ToolbarComponent } from './components/client/toolbar/toolbar.component';
import { NewLoanComponent } from './components/client/new-loan/new-loan.component';
import { DepositSummaryComponent } from './components/client/deposit-summary/deposit-summary.component';
import { ClientPageComponent } from './components/client/client-page/client-page.component';
import { ClientLoansComponent } from './components/client/client-loans/client-loans.component';

import { AdminToolbarComponent } from './components/admin/admin-toolbar/admin-toolbar.component';
import { ClientListComponent } from './components/admin/client-list/client-list.component';
import { AdminPageComponent } from './components/admin/admin-page/admin-page.component';
import { AdminLoansComponent } from './components/admin/admin-loans/admin-loans.component';
import { AccountsComponent } from './components/admin/accounts/accounts.component';
import { LoanHistoryComponent } from './components/common/loan-history/loan-history.component';

@NgModule({
  declarations: [
    AppComponent,
    ToolbarComponent,
    ClientPageComponent,
    DepositSummaryComponent,
    LoginComponent,
    LoansComponent,
    RegisterComponent,
    DepositHistoryComponent,
    NewTransactionComponent,
    NewLoanComponent,
    ClientListComponent,
    DepositInfoComponent,
    AdminToolbarComponent,
    AdminPageComponent,
    AdminLoansComponent,
    ClientLoansComponent,
    AccountsComponent,
    LoanHistoryComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatMenuModule,
    HttpClientModule,
    MatCardModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatExpansionModule,
    MatSnackBarModule
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: TokenInterceptor,
    multi: true
  }
    // fakeBackendProvider
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
