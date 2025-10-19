import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from '../../core/services/api.service';
import { Member } from '../../shared/models/member.model';

@Injectable({ providedIn: 'root' })
export class MembersService {
  private api = inject(ApiService);

  list(sort: 'upcoming' | 'created' = 'created'): Observable<Member[]> {
    return this.api.get<any>('/members', { sort }).pipe(
      map((response) => (Array.isArray(response) ? response : response.data || []))
    );
  }

  get(id: number): Observable<Member> {
    return this.api.get<any>(`/members/${id}`).pipe(
      map((response) => response.data || response)
    );
  }

  create(m: Member): Observable<Member> {
    return this.api.post<any>('/members', m).pipe(
      map((response) => response.data || response)
    );
  }

  update(id: number, m: Member): Observable<Member> {
    return this.api.put<any>(`/members/${id}`, m).pipe(
      map((response) => response.data || response)
    );
  }

  remove(id: number) {
    return this.api.delete(`/members/${id}`);
  }
}
