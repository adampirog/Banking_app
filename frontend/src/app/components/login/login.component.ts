import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService, LoginForm } from '@app/_services/user/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private fb: FormBuilder,
    // tslint:disable: align
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar) { }

  isLogin = true;
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  login() {
    console.log(this.loginForm);
    if (this.loginForm.invalid) {
      this.snackBar.open('Wypełnij poprawnie formularz', null, { duration: 5000 });
      return;
    }
    this.userService.login(this.loginForm.value as LoginForm).subscribe({
      next: value => {
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || 'deposit';
        this.router.navigate([returnUrl]);
      },
      error: error => {
        this.snackBar.open('Niepoprawne dane', null, { duration: 5000 });
      }
    }
    );
  }

  switchForm() {
    this.isLogin = !this.isLogin;
  }

  errors(ctrl: AbstractControl): string[] {
    return ctrl.errors ? Object.keys(ctrl.errors) : [];
  }

  ngOnInit(): void {
  }
}

