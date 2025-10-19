import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { BirthdaysService } from '../birthdays.service';
import { UpcomingBirthday } from '../../../shared/models/birthday.model';
import { AiMessageDialogComponent } from '../../ai/ai-message-dialog/ai-message-dialog.component';

@Component({
  selector: 'app-today',
  imports: [CommonModule, MatCardModule, MatButtonModule, MatDialogModule],
  templateUrl: './today.component.html',
  styleUrl: './today.component.scss',
})
export class TodayComponent implements OnInit {
  private birthdaysService = inject(BirthdaysService);
  private dialog = inject(MatDialog);

  rows = signal<UpcomingBirthday[]>([]);

  ngOnInit() {
    this.load();
  }

  load() {
    this.birthdaysService.today().subscribe((data) => this.rows.set(data));
  }

  openAi(memberId: number) {
    this.dialog.open(AiMessageDialogComponent, {
      data: { memberId },
      width: '600px',
    });
  }
}
