import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { provideAnimations } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { TodayComponent } from './today.component';
import { BirthdaysService } from '../birthdays.service';
import { UpcomingBirthday } from '../../../shared/models/birthday.model';

describe('TodayComponent', () => {
  let component: TodayComponent;
  let fixture: ComponentFixture<TodayComponent>;
  let birthdaysService: jest.Mocked<BirthdaysService>;

  const mockTodayBirthdays: UpcomingBirthday[] = [
    {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      birthDate: '1990-05-15',
      nextBirthdayDate: '2025-05-15',
      turnsAge: 35,
      daysUntil: 0,
      tz: 'America/New_York',
    },
  ];

  beforeEach(async () => {
    const birthdaysServiceMock = {
      upcoming: jest.fn(),
      today: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [TodayComponent, HttpClientTestingModule],
      providers: [
        { provide: BirthdaysService, useValue: birthdaysServiceMock },
        provideAnimations(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TodayComponent);
    component = fixture.componentInstance;
    birthdaysService = TestBed.inject(BirthdaysService) as jest.Mocked<BirthdaysService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load today\'s birthdays on init', () => {
    birthdaysService.today.mockReturnValue(of(mockTodayBirthdays));

    fixture.detectChanges();

    expect(birthdaysService.today).toHaveBeenCalled();
    expect(component.rows()).toEqual(mockTodayBirthdays);
  });

  it('should handle empty birthdays list', () => {
    birthdaysService.today.mockReturnValue(of([]));

    fixture.detectChanges();

    expect(component.rows()).toEqual([]);
  });

  it('should display birthday cards when data is loaded', () => {
    birthdaysService.today.mockReturnValue(of(mockTodayBirthdays));

    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const cards = compiled.querySelectorAll('mat-card');
    expect(cards.length).toBe(1);
  });

  it('should display highlight class for today\'s birthdays', () => {
    birthdaysService.today.mockReturnValue(of(mockTodayBirthdays));

    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const card = compiled.querySelector('mat-card');
    expect(card.classList.contains('highlight')).toBe(true);
  });

  it('should display empty message when no birthdays today', () => {
    birthdaysService.today.mockReturnValue(of([]));

    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const emptyMessage = compiled.querySelector('.empty');
    expect(emptyMessage).toBeTruthy();
    expect(emptyMessage.textContent).toContain('No birthdays today');
  });

  it('should display birthday emoji in subtitle', () => {
    birthdaysService.today.mockReturnValue(of(mockTodayBirthdays));

    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const subtitle = compiled.querySelector('mat-card-subtitle');
    expect(subtitle.textContent).toContain('🎉');
  });

  it('should call openAi with correct memberId', () => {
    birthdaysService.today.mockReturnValue(of(mockTodayBirthdays));
    fixture.detectChanges();

    const openAiSpy = jest.spyOn(component, 'openAi');
    component.openAi(1);

    expect(openAiSpy).toHaveBeenCalledWith(1);
  });
});
