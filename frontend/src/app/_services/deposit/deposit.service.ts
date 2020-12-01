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

  constructor(private http: HttpClient) { }

  getDepositByClientId(clientId: number): Observable<Deposit> {
    return this.http.get<Deposit>(`http://localhost:5000/client/deposit?clientId=${clientId}`).pipe(map(result => {
      console.log(result);
      return result;
    }));
  }

  getOutgoingHistory(clientId: number): Observable<Array<HistoryTransferRecord>> {
    return this.http.get<Array<HistoryTransferRecord>>(`http://localhost:5000/client/deposit/outgoing?clientId=${clientId}`);
  }

  getIncomingHistory(clientId: number): Observable<Array<HistoryTransferRecord>> {
    return this.http.get<Array<HistoryTransferRecord>>(`http://localhost:5000/client/deposit/incoming?clientId=${clientId}`);
  }
}
