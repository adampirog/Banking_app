import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LoggedUserData, User, UserService } from '../user/user.service';

export interface Deposit {
  balance: number;
  id: string;
}

export interface HistoryTransferRecord {
  receiver: string;
  sender: string;
  transferDate: string;
  value: number;
}


@Injectable({
  providedIn: 'root'
})
export class DepositService {

  constructor(private http: HttpClient,
    private userService: UserService) { }

  getDeposit(): Observable<Deposit> {
    const user = this.userService.user;
    return this.http.get<Deposit>(`http://localhost:5000/client/deposit?clientId=${user.clientId}`).pipe(map(result => {
      console.log(result);
      return result;
    }));
  }

  getOutgoingHistory(): Observable<Array<HistoryTransferRecord>> {
    const user = this.userService.user;
    return this.http.get<Array<HistoryTransferRecord>>(`http://localhost:5000/client/deposit/outgoing?clientId=${user.clientId}`);
  }
  getIncomingHistory(): Observable<Array<HistoryTransferRecord>> {
    const user = this.userService.user;
    return this.http.get<Array<HistoryTransferRecord>>(`http://localhost:5000/client/deposit/incoming?clientId=${user.clientId}`);
  }
}
