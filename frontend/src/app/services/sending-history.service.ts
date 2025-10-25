import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { SendingHistory } from '../models/sending-history.model';

@Injectable({
  providedIn: 'root'
})
export class SendingHistoryService {
  constructor(private api: ApiService) {}

  // Get all sending history for the current user
  getSendingHistory(): Observable<SendingHistory[]> {
    return this.api.get<SendingHistory[]>('/sending-history');
  }
}
