import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';


export interface Account {
  balance: number;
  description: string;
  id: number;
}

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css']
})
export class AccountsComponent implements OnInit {

  accounts: Array<Account> = [];

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.http.get<Array<Account>>('http://localhost:5000/accounts').subscribe({
      next: res => {
        this.accounts = res;
      }
    });
  }
}
