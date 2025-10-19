import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { BirthdaysService } from '../birthdays.service';
import { UpcomingBirthday } from '../../../shared/models/birthday.model';
import { AiMessageDialogComponent } from '../../ai/ai-message-dialog/ai-message-dialog.component';

@Component({
  selector: 'app-upcoming',
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
  ],
  templateUrl: './upcoming.component.html',
  styleUrl: './upcoming.component.scss',
})
export class UpcomingComponent implements OnInit {
  private birthdaysService = inject(BirthdaysService);
  private dialog = inject(MatDialog);

  rows = signal<UpcomingBirthday[]>([]);
  days = 30;

  ngOnInit() {
    this.load();
  }

  load() {
    this.birthdaysService.upcoming(this.days).subscribe((data) => this.rows.set(data));
  }

  openAi(memberId: number) {
    this.dialog.open(AiMessageDialogComponent, {
      data: { memberId },
      width: '600px',
    });
  }
}
