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
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LandPageComponent } from './components/land-page/land-page.component';
import { DepositSummaryComponent } from './components/deposit-summary/deposit-summary.component';
import { LoginComponent } from './components/login/login.component';
import { LoansComponent } from './components/loans/loans.component';
import { TokenInterceptor } from './_helpers/auth-interceptor';
import { RegisterComponent } from './components/register/register.component';
import { DepositHistoryComponent } from './components/deposit-history/deposit-history.component';
import { NewTransactionComponent } from './components/new-transaction/new-transaction.component';
import { NewLoanComponent } from './components/new-loan/new-loan.component';



@NgModule({
  declarations: [
    AppComponent,
    ToolbarComponent,
    LandPageComponent,
    DepositSummaryComponent,
    LoginComponent,
    LoansComponent,
    RegisterComponent,
    DepositHistoryComponent,
    NewTransactionComponent,
    NewLoanComponent
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
