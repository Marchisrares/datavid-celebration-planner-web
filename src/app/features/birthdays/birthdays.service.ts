import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from '../../core/services/api.service';
import { UpcomingBirthday } from '../../shared/models/birthday.model';

@Injectable({ providedIn: 'root' })
export class BirthdaysService {
  private api = inject(ApiService);

  upcoming(days = 30): Observable<UpcomingBirthday[]> {
    return this.api.get<any>('/birthdays/upcoming', { days }).pipe(
      map((response) => (Array.isArray(response) ? response : response.data || []))
    );
  }

  today(): Observable<UpcomingBirthday[]> {
    return this.api.get<any>('/birthdays/today').pipe(
      map((response) => (Array.isArray(response) ? response : response.data || []))
    );
  }
}
