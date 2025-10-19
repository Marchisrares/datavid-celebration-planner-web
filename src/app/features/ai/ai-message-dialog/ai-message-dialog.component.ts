import { Component, Inject, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AiService } from '../ai.service';
import { AiMessageResponse } from '../../../shared/models/ai.model';

@Component({
  selector: 'app-ai-message-dialog',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './ai-message-dialog.component.html',
  styleUrl: './ai-message-dialog.component.scss',
})
export class AiMessageDialogComponent {
  private fb = inject(FormBuilder);
  private aiService = inject(AiService);
  private dialogRef = inject(MatDialogRef<AiMessageDialogComponent>);

  loading = signal(false);
  resp = signal<AiMessageResponse | null>(null);

  form = this.fb.group({
    tone: ['friendly'],
    locale: [''],
    sendEmail: [false],
    dryRunEmail: [true],
  });

  constructor(@Inject(MAT_DIALOG_DATA) public data: { memberId: number }) {}

  generate() {
    this.loading.set(true);
    const payload = { memberId: this.data.memberId, ...this.form.value };

    this.aiService.generate(payload as any).subscribe({
      next: (r) => {
        this.resp.set(r);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  close() {
    this.dialogRef.close();
  }
}
