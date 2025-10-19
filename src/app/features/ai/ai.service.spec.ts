import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AiService } from './ai.service';
import { AiMessageRequest, AiMessageResponse } from '../../shared/models/ai.model';
import { environment } from '../../../environments/environment';

describe('AiService', () => {
  let service: AiService;
  let httpMock: HttpTestingController;

  const mockRequest: AiMessageRequest = {
    memberId: 1,
    tone: 'friendly',
    locale: 'en',
    sendEmail: false,
    dryRunEmail: true,
  };

  const mockResponse: AiMessageResponse = {
    message: 'Happy Birthday! 🎉',
    explanation: {
      model: 'mock-ai-v1.0',
      params: { tone: 'friendly', locale: 'en', temperature: 0.7, maxTokens: 150 },
      promptOrMethod: 'generateBirthdayMessage',
      rationale: 'Generated a friendly birthday message in en locale.',
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AiService],
    });
    service = TestBed.inject(AiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('generate with mock mode disabled', () => {
    beforeEach(() => {
      // Mock environment.mockMode to false
      (environment as any).mockMode = false;
    });

    it('should generate AI message via API', () => {
      service.generate(mockRequest).subscribe((response) => {
        expect(response).toEqual(mockResponse);
        expect(response.message).toContain('Happy Birthday');
        expect(response.explanation.model).toBe('mock-ai-v1.0');
      });

      const req = httpMock.expectOne(`${environment.apiBaseUrl}/ai/message`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockRequest);
      req.flush({ data: mockResponse });
    });

    it('should handle non-wrapped response', () => {
      service.generate(mockRequest).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${environment.apiBaseUrl}/ai/message`);
      req.flush(mockResponse);
    });

    it('should fallback to mock on API error', (done) => {
      service.generate(mockRequest).subscribe((response) => {
        expect(response.message).toBeTruthy();
        expect(response.explanation).toBeDefined();
        expect(response.explanation.model).toBe('mock-ai-v1.0');
        done();
      });

      const req = httpMock.expectOne(`${environment.apiBaseUrl}/ai/message`);
      req.error(new ProgressEvent('error'));
    });
  });

  describe('generate with mock mode enabled', () => {
    beforeEach(() => {
      (environment as any).mockMode = true;
    });

    it('should generate mock AI message without API call', (done) => {
      service.generate(mockRequest).subscribe((response) => {
        expect(response.message).toBeTruthy();
        expect(response.explanation).toBeDefined();
        expect(response.explanation.model).toBe('mock-ai-v1.0');
        expect(response.explanation.params.tone).toBe('friendly');
        expect(response.explanation.params.locale).toBe('en');
        done();
      });

      httpMock.expectNone(`${environment.apiBaseUrl}/ai/message`);
    });

    it('should generate formal tone message', (done) => {
      const formalRequest = { ...mockRequest, tone: 'formal' as const };

      service.generate(formalRequest).subscribe((response) => {
        expect(response.message).toBeTruthy();
        expect(response.explanation.params.tone).toBe('formal');
        done();
      });
    });

    it('should generate fun tone message', (done) => {
      const funRequest = { ...mockRequest, tone: 'fun' as const };

      service.generate(funRequest).subscribe((response) => {
        expect(response.message).toBeTruthy();
        expect(response.message).toMatch(/!/);
        expect(response.explanation.params.tone).toBe('fun');
        done();
      });
    });

    it('should generate short tone message', (done) => {
      const shortRequest = { ...mockRequest, tone: 'short' as const };

      service.generate(shortRequest).subscribe((response) => {
        expect(response.message).toBeTruthy();
        expect(response.explanation.params.tone).toBe('short');
        done();
      });
    });

    it('should support Romanian locale', (done) => {
      const roRequest = { ...mockRequest, locale: 'ro' };

      service.generate(roRequest).subscribe((response) => {
        expect(response.message).toContain('La mulți ani');
        expect(response.explanation.params.locale).toBe('ro');
        done();
      });
    });

    it('should support Italian locale', (done) => {
      const itRequest = { ...mockRequest, locale: 'it' };

      service.generate(itRequest).subscribe((response) => {
        expect(response.message).toContain('Buon Compleanno');
        expect(response.explanation.params.locale).toBe('it');
        done();
      });
    });

    it('should fallback to English for unsupported locale', (done) => {
      const unknownRequest = { ...mockRequest, locale: 'de' };

      service.generate(unknownRequest).subscribe((response) => {
        expect(response.message).toBeTruthy();
        expect(response.message.length).toBeGreaterThan(0);
        done();
      });
    });

    it('should include email sent info when sendEmail is true', (done) => {
      const emailRequest = { ...mockRequest, sendEmail: true, dryRunEmail: true };

      service.generate(emailRequest).subscribe((response) => {
        expect(response.sent).toBeDefined();
        expect(response.sent?.dryRun).toBe(true);
        expect(response.sent?.provider).toBe('mock-email-provider');
        done();
      });
    });

    it('should not include email sent info when sendEmail is false', (done) => {
      service.generate(mockRequest).subscribe((response) => {
        expect(response.sent).toBeUndefined();
        done();
      });
    });

    it('should have proper explanation rationale', (done) => {
      service.generate(mockRequest).subscribe((response) => {
        expect(response.explanation.rationale).toContain('Generated a friendly birthday message');
        expect(response.explanation.rationale).toContain('en locale');
        expect(response.explanation.promptOrMethod).toBe('generateBirthdayMessage');
        done();
      });
    });
  });
});
