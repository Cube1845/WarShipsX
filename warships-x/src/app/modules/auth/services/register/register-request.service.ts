import { Injectable } from '@angular/core';
import { ApiService } from '../../../common/models/api-service';
import { Result } from '../../../common/models/result';

@Injectable({
  providedIn: 'root',
})
export class RegisterRequestService extends ApiService<Result> {
  constructor() {
    super('POST', 'auth/register');
  }
}
