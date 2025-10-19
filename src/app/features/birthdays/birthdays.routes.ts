import { Routes } from '@angular/router';
import { UpcomingComponent } from './upcoming/upcoming.component';
import { TodayComponent } from './today/today.component';

export const BIRTHDAYS_ROUTES: Routes = [
  { path: 'upcoming', component: UpcomingComponent },
  { path: 'today', component: TodayComponent },
  { path: '', redirectTo: 'upcoming', pathMatch: 'full' },
];
