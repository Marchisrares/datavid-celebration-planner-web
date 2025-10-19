import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ApiService } from './api.service';
import { environment } from '../../../environments/environment';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiService],
    });
    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('get', () => {
    it('should make GET request with correct URL', () => {
      const testData = { data: 'test' };
      const path = '/test';

      service.get(path).subscribe((data) => {
        expect(data).toEqual(testData);
      });

      const req = httpMock.expectOne(`${environment.apiBaseUrl}${path}`);
      expect(req.request.method).toBe('GET');
      req.flush(testData);
    });

    it('should include query parameters', () => {
      const path = '/test';
      const params = { sort: 'created', limit: 10 };

      service.get(path, params).subscribe();

      const req = httpMock.expectOne((request) => {
        return (
          request.url === `${environment.apiBaseUrl}${path}` &&
          request.params.get('sort') === 'created' &&
          request.params.get('limit') === '10'
        );
      });
      expect(req.request.method).toBe('GET');
      req.flush({});
    });
  });

  describe('post', () => {
    it('should make POST request with body', () => {
      const testData = { name: 'test' };
      const responseData = { id: 1, ...testData };
      const path = '/test';

      service.post(path, testData).subscribe((data) => {
        expect(data).toEqual(responseData);
      });

      const req = httpMock.expectOne(`${environment.apiBaseUrl}${path}`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(testData);
      req.flush(responseData);
    });
  });

  describe('put', () => {
    it('should make PUT request with body', () => {
      const testData = { name: 'updated' };
      const responseData = { id: 1, ...testData };
      const path = '/test/1';

      service.put(path, testData).subscribe((data) => {
        expect(data).toEqual(responseData);
      });

      const req = httpMock.expectOne(`${environment.apiBaseUrl}${path}`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(testData);
      req.flush(responseData);
    });
  });

  describe('delete', () => {
    it('should make DELETE request', () => {
      const path = '/test/1';

      service.delete(path).subscribe((data) => {
        expect(data).toBeTruthy();
      });

      const req = httpMock.expectOne(`${environment.apiBaseUrl}${path}`);
      expect(req.request.method).toBe('DELETE');
      req.flush({ message: 'Deleted' });
    });
  });
});
