import { Routes } from '@angular/router';
import { MembersListComponent } from './members-list/members-list.component';
import { MemberFormComponent } from './member-form/member-form.component';

export const MEMBERS_ROUTES: Routes = [
  { path: '', component: MembersListComponent },
  { path: 'new', component: MemberFormComponent },
  { path: ':id/edit', component: MemberFormComponent },
];
