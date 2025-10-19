import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { MembersListComponent } from './members-list.component';
import { MembersService } from '../members.service';
import { Member } from '../../../shared/models/member.model';

describe('MembersListComponent', () => {
  let component: MembersListComponent;
  let fixture: ComponentFixture<MembersListComponent>;
  let membersService: jest.Mocked<MembersService>;

  const mockMembers: Member[] = [
    {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      birthDate: '1990-05-15',
      country: 'USA',
      city: 'New York',
      tz: 'America/New_York',
      email: 'john@example.com',
    },
    {
      id: 2,
      firstName: 'Jane',
      lastName: 'Smith',
      birthDate: '1992-06-20',
      country: 'UK',
      city: 'London',
      tz: 'Europe/London',
      email: 'jane@example.com',
    },
  ];

  beforeEach(async () => {
    const membersServiceMock = {
      list: jest.fn(),
      get: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [MembersListComponent, HttpClientTestingModule],
      providers: [
        { provide: MembersService, useValue: membersServiceMock },
        provideAnimations(),
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MembersListComponent);
    component = fixture.componentInstance;
    membersService = TestBed.inject(MembersService) as jest.Mocked<MembersService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load members on init with default sort', () => {
    membersService.list.mockReturnValue(of(mockMembers));

    fixture.detectChanges();

    expect(membersService.list).toHaveBeenCalledWith('created');
    expect(component.rows()).toEqual(mockMembers);
  });

  it('should have correct table columns', () => {
    expect(component.cols).toEqual(['name', 'birth', 'location', 'actions']);
  });

  it('should change sort to upcoming', () => {
    membersService.list.mockReturnValue(of(mockMembers));
    fixture.detectChanges();

    component.sort = 'upcoming';
    component.load();

    expect(membersService.list).toHaveBeenCalledWith('upcoming');
  });

  it('should display table with correct number of rows', () => {
    membersService.list.mockReturnValue(of(mockMembers));

    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const rows = compiled.querySelectorAll('tr.mat-mdc-row');
    expect(rows.length).toBe(2);
  });

  it('should display member names correctly', () => {
    membersService.list.mockReturnValue(of(mockMembers));

    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const firstRow = compiled.querySelector('tr.mat-mdc-row');
    expect(firstRow.textContent).toContain('John Doe');
  });

  it('should handle empty members list', () => {
    membersService.list.mockReturnValue(of([]));

    fixture.detectChanges();

    expect(component.rows()).toEqual([]);
  });

  it('should have add member button', () => {
    membersService.list.mockReturnValue(of(mockMembers));

    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const addButton = compiled.querySelector('button[routerLink="/members/new"]');
    expect(addButton).toBeTruthy();
    expect(addButton.textContent).toContain('Add Member');
  });

  it('should have sort dropdown', () => {
    membersService.list.mockReturnValue(of(mockMembers));

    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const sortField = compiled.querySelector('mat-select');
    expect(sortField).toBeTruthy();
  });
});
