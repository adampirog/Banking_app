import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { User, UserService } from '@app/_services/user/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(private fb: FormBuilder,
    // tslint:disable: align
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar) { }

  registerForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    phone: ['', [Validators.required, Validators.pattern('[0-9]{9}')]]
  });

  ngOnInit(): void {
  }

  register() {
    if (this.registerForm.invalid) {
      return;
    }
    const user: User = {
      email: this.registerForm.value.email,
      firstName: this.registerForm.value.firstName,
      lastName: this.registerForm.value.lastName,
      phone: this.registerForm.value.phone,
      password: this.registerForm.value.password,
      role: 'Client'
    };

    this.userService.register(user).subscribe({
      next: value => {
        setTimeout(() => {
          this.router.navigate(['login']);
        }, 2000);
        this.snackBar.open('Registered sucessfully!', null, { duration: 2000 });

      },
      error: error => {
        this.snackBar.open(error.error.message, null, { duration: 5000 });
      }
    });
  }

}
