import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'birthdays/upcoming', pathMatch: 'full' },
  {
    path: 'members',
    loadChildren: () =>
      import('./features/members/members.routes').then((m) => m.MEMBERS_ROUTES),
  },
  {
    path: 'birthdays',
    loadChildren: () =>
      import('./features/birthdays/birthdays.routes').then((m) => m.BIRTHDAYS_ROUTES),
  },
  { path: '**', redirectTo: 'birthdays/upcoming' },
];
