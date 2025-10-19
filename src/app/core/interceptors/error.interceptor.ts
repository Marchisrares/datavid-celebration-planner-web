import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const snack = inject(MatSnackBar);

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      const msg =
        err.error?.errors && Array.isArray(err.error.errors)
          ? err.error.errors.map((e: any) => e.message).join(' | ')
          : err.error?.message || err.message || 'Unexpected error';

      snack.open(msg, 'Dismiss', { duration: 5000 });
      return throwError(() => err);
    })
  );
};
