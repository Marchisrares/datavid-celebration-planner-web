import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';

import { MembersService } from '../members.service';
import { Member } from '../../../shared/models/member.model';

@Component({
  selector: 'app-members-list',
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatTableModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
  ],
  templateUrl: './members-list.component.html',
  styleUrl: './members-list.component.scss',
})
export class MembersListComponent implements OnInit {
  private membersService = inject(MembersService);

  cols = ['name', 'birth', 'location', 'actions'];
  rows = signal<Member[]>([]);
  sort: 'created' | 'upcoming' = 'created';

  ngOnInit() {
    this.load();
  }

  load() {
    this.membersService.list(this.sort).subscribe((data) => this.rows.set(data));
  }
}
