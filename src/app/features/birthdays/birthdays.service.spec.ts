import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BirthdaysService } from './birthdays.service';
import { UpcomingBirthday } from '../../shared/models/birthday.model';
import { environment } from '../../../environments/environment';

describe('BirthdaysService', () => {
  let service: BirthdaysService;
  let httpMock: HttpTestingController;

  const mockBirthday: UpcomingBirthday = {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    birthDate: '1990-05-15',
    nextBirthdayDate: '2025-05-15',
    turnsAge: 35,
    daysUntil: 10,
    tz: 'America/New_York',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [BirthdaysService],
    });
    service = TestBed.inject(BirthdaysService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('upcoming', () => {
    it('should fetch upcoming birthdays with default days', () => {
      const mockBirthdays = [mockBirthday];

      service.upcoming().subscribe((birthdays) => {
        expect(birthdays).toEqual(mockBirthdays);
      });

      const req = httpMock.expectOne((request) => {
        return (
          request.url === `${environment.apiBaseUrl}/birthdays/upcoming` &&
          request.params.get('days') === '30'
        );
      });
      expect(req.request.method).toBe('GET');
      req.flush({ data: mockBirthdays });
    });

    it('should fetch upcoming birthdays with custom days', () => {
      const mockBirthdays = [mockBirthday];

      service.upcoming(60).subscribe((birthdays) => {
        expect(birthdays).toEqual(mockBirthdays);
      });

      const req = httpMock.expectOne((request) => {
        return (
          request.url === `${environment.apiBaseUrl}/birthdays/upcoming` &&
          request.params.get('days') === '60'
        );
      });
      req.flush({ data: mockBirthdays });
    });

    it('should handle array response (not wrapped)', () => {
      const mockBirthdays = [mockBirthday];

      service.upcoming().subscribe((birthdays) => {
        expect(birthdays).toEqual(mockBirthdays);
      });

      const req = httpMock.expectOne((request) => request.url.includes('/birthdays/upcoming'));
      req.flush(mockBirthdays);
    });

    it('should handle empty response', () => {
      service.upcoming().subscribe((birthdays) => {
        expect(birthdays).toEqual([]);
      });

      const req = httpMock.expectOne((request) => request.url.includes('/birthdays/upcoming'));
      req.flush({ data: [] });
    });
  });

  describe('today', () => {
    it('should fetch today\'s birthdays', () => {
      const todayBirthday = { ...mockBirthday, daysUntil: 0 };
      const mockBirthdays = [todayBirthday];

      service.today().subscribe((birthdays) => {
        expect(birthdays).toEqual(mockBirthdays);
        expect(birthdays[0].daysUntil).toBe(0);
      });

      const req = httpMock.expectOne(`${environment.apiBaseUrl}/birthdays/today`);
      expect(req.request.method).toBe('GET');
      req.flush({ data: mockBirthdays });
    });

    it('should handle array response (not wrapped)', () => {
      const mockBirthdays = [mockBirthday];

      service.today().subscribe((birthdays) => {
        expect(birthdays).toEqual(mockBirthdays);
      });

      const req = httpMock.expectOne(`${environment.apiBaseUrl}/birthdays/today`);
      req.flush(mockBirthdays);
    });

    it('should handle empty response when no birthdays today', () => {
      service.today().subscribe((birthdays) => {
        expect(birthdays).toEqual([]);
      });

      const req = httpMock.expectOne(`${environment.apiBaseUrl}/birthdays/today`);
      req.flush({ data: [] });
    });
  });
});
