import { _DisposeViewRepeaterStrategy } from '@angular/cdk/collections';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DepositService } from '@app/_services/deposit/deposit.service';
import { User, UserService } from '@app/_services/user/user.service';

@Component({
  selector: 'app-admin',
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.css']
})
export class ClientListComponent implements OnInit {

  users: Array<User>;
  constructor(private userService: UserService,
    private depositService: DepositService,
    private snackBar: MatSnackBar) { }

  async ngOnInit(): Promise<void> {
    this.userService.getUsers().subscribe({
      next: async users => {
        this.users = users;
        users.forEach(user => {
          if (!user.deposit) {
            this.depositService.getDepositByClientId(user.id).toPromise().then(dep => {
              user.deposit = dep;
            }).catch(err => console.log(err));
          }
        });
      }
    });
  }

  createDeposit(user: User) {
    this.depositService.create(user.id).subscribe({
      next: value => {
        this.snackBar.open('Pomyślnie utworzono depozyt!', null, { duration: 3000 });
        this.depositService.getDepositByClientId(user.id).subscribe({
          next: deposit => {
            user.deposit = deposit;
          }
        });
      },
      error: value => {
        console.log(value);
      }
    })
  }
}
