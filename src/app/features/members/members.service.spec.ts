import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MembersService } from './members.service';
import { Member } from '../../shared/models/member.model';
import { environment } from '../../../environments/environment';

describe('MembersService', () => {
  let service: MembersService;
  let httpMock: HttpTestingController;

  const mockMember: Member = {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    birthDate: '1990-05-15',
    country: 'USA',
    city: 'New York',
    tz: 'America/New_York',
    email: 'john@example.com',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MembersService],
    });
    service = TestBed.inject(MembersService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('list', () => {
    it('should fetch members with default sort', () => {
      const mockMembers = [mockMember];

      service.list().subscribe((members) => {
        expect(members).toEqual(mockMembers);
      });

      const req = httpMock.expectOne((request) => {
        return (
          request.url === `${environment.apiBaseUrl}/members` &&
          request.params.get('sort') === 'created'
        );
      });
      expect(req.request.method).toBe('GET');
      req.flush({ data: mockMembers });
    });

    it('should fetch members with upcoming sort', () => {
      const mockMembers = [mockMember];

      service.list('upcoming').subscribe((members) => {
        expect(members).toEqual(mockMembers);
      });

      const req = httpMock.expectOne((request) => {
        return (
          request.url === `${environment.apiBaseUrl}/members` &&
          request.params.get('sort') === 'upcoming'
        );
      });
      req.flush({ data: mockMembers });
    });

    it('should handle array response (not wrapped)', () => {
      const mockMembers = [mockMember];

      service.list().subscribe((members) => {
        expect(members).toEqual(mockMembers);
      });

      const req = httpMock.expectOne((request) => request.url.includes('/members'));
      req.flush(mockMembers);
    });
  });

  describe('get', () => {
    it('should fetch single member', () => {
      service.get(1).subscribe((member) => {
        expect(member).toEqual(mockMember);
      });

      const req = httpMock.expectOne(`${environment.apiBaseUrl}/members/1`);
      expect(req.request.method).toBe('GET');
      req.flush({ data: mockMember });
    });

    it('should handle non-wrapped response', () => {
      service.get(1).subscribe((member) => {
        expect(member).toEqual(mockMember);
      });

      const req = httpMock.expectOne(`${environment.apiBaseUrl}/members/1`);
      req.flush(mockMember);
    });
  });

  describe('create', () => {
    it('should create member', () => {
      const newMember: Member = { ...mockMember };
      delete newMember.id;

      service.create(newMember).subscribe((member) => {
        expect(member).toEqual(mockMember);
      });

      const req = httpMock.expectOne(`${environment.apiBaseUrl}/members`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newMember);
      req.flush({ data: mockMember });
    });
  });

  describe('update', () => {
    it('should update member', () => {
      const updatedMember: Member = { ...mockMember, firstName: 'Jane' };

      service.update(1, updatedMember).subscribe((member) => {
        expect(member.firstName).toBe('Jane');
      });

      const req = httpMock.expectOne(`${environment.apiBaseUrl}/members/1`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updatedMember);
      req.flush({ data: updatedMember });
    });
  });

  describe('remove', () => {
    it('should delete member', () => {
      service.remove(1).subscribe((response) => {
        expect(response).toBeTruthy();
      });

      const req = httpMock.expectOne(`${environment.apiBaseUrl}/members/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush({ message: 'Deleted' });
    });
  });
});
