import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { MembersService } from '../members.service';
import { atLeast18 } from '../../../shared/validators/age.validator';

@Component({
  selector: 'app-member-form',
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './member-form.component.html',
  styleUrl: './member-form.component.scss',
})
export class MemberFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private membersService = inject(MembersService);

  id?: number;

  form = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    birthDate: ['', [Validators.required, atLeast18]],
    country: ['', Validators.required],
    city: ['', Validators.required],
    tz: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
  });

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.id = +id;
      this.membersService.get(this.id).subscribe((m) => this.form.patchValue(m));
    }
  }

  save() {
    if (this.form.invalid) return;

    const payload = this.form.value as any;
    const req = this.id
      ? this.membersService.update(this.id, payload)
      : this.membersService.create(payload);

    req.subscribe(() => this.router.navigate(['/members']));
  }
}
