import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { provideAnimations } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';
import { UpcomingComponent } from './upcoming.component';
import { BirthdaysService } from '../birthdays.service';
import { UpcomingBirthday } from '../../../shared/models/birthday.model';
import { signal } from '@angular/core';

describe('UpcomingComponent', () => {
  let component: UpcomingComponent;
  let fixture: ComponentFixture<UpcomingComponent>;
  let birthdaysService: jest.Mocked<BirthdaysService>;

  const mockBirthdays: UpcomingBirthday[] = [
    {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      birthDate: '1990-05-15',
      nextBirthdayDate: '2025-05-15',
      turnsAge: 35,
      daysUntil: 10,
      tz: 'America/New_York',
    },
    {
      id: 2,
      firstName: 'Jane',
      lastName: 'Smith',
      birthDate: '1992-06-20',
      nextBirthdayDate: '2025-06-20',
      turnsAge: 33,
      daysUntil: 25,
      tz: 'Europe/London',
    },
  ];

  beforeEach(async () => {
    const birthdaysServiceMock = {
      upcoming: jest.fn(),
      today: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [UpcomingComponent, HttpClientTestingModule],
      providers: [
        { provide: BirthdaysService, useValue: birthdaysServiceMock },
        provideAnimations(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UpcomingComponent);
    component = fixture.componentInstance;
    birthdaysService = TestBed.inject(BirthdaysService) as jest.Mocked<BirthdaysService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load upcoming birthdays on init', () => {
    birthdaysService.upcoming.mockReturnValue(of(mockBirthdays));

    fixture.detectChanges(); // triggers ngOnInit

    expect(birthdaysService.upcoming).toHaveBeenCalledWith(30);
    expect(component.rows()).toEqual(mockBirthdays);
  });

  it('should use default days value of 30', () => {
    birthdaysService.upcoming.mockReturnValue(of(mockBirthdays));

    fixture.detectChanges();

    expect(component.days).toBe(30);
    expect(birthdaysService.upcoming).toHaveBeenCalledWith(30);
  });

  it('should reload birthdays when days value changes', () => {
    birthdaysService.upcoming.mockReturnValue(of(mockBirthdays));
    fixture.detectChanges();

    component.days = 60;
    component.load();

    expect(birthdaysService.upcoming).toHaveBeenCalledWith(60);
  });

  it('should handle empty birthdays list', () => {
    birthdaysService.upcoming.mockReturnValue(of([]));

    fixture.detectChanges();

    expect(component.rows()).toEqual([]);
  });

  it('should display birthday cards when data is loaded', () => {
    birthdaysService.upcoming.mockReturnValue(of(mockBirthdays));

    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const cards = compiled.querySelectorAll('mat-card');
    expect(cards.length).toBe(2);
  });

  it('should display empty message when no birthdays', () => {
    birthdaysService.upcoming.mockReturnValue(of([]));

    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const emptyMessage = compiled.querySelector('.empty');
    expect(emptyMessage).toBeTruthy();
    expect(emptyMessage.textContent).toContain('No upcoming birthdays');
  });

  it('should call openAi with correct memberId', () => {
    birthdaysService.upcoming.mockReturnValue(of(mockBirthdays));
    fixture.detectChanges();

    const openAiSpy = jest.spyOn(component, 'openAi');
    component.openAi(1);

    expect(openAiSpy).toHaveBeenCalledWith(1);
  });

  it('should handle service errors gracefully', () => {
    birthdaysService.upcoming.mockReturnValue(throwError(() => new Error('API Error')));

    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
