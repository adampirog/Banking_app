import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

export interface Transaction {
  sender: string;
  receiver: string;
  amount: number;
}

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  constructor(private http: HttpClient) { }

  post(transaction: Transaction) {
    return this.http.post('http://localhost:5000/transfer', transaction);
  }


}
