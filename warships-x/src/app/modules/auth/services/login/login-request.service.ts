import { Injectable } from '@angular/core';
import { ApiService } from '../../../common/models/api-service';

@Injectable({
  providedIn: 'root',
})
export class LoginRequestService extends ApiService<string> {
  constructor() {
    super('GET', '/api/user/1');
  }
}
