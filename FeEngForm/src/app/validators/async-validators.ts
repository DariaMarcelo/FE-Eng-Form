import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { debounceTime, Observable, of, map } from 'rxjs';
import { UserService } from '../services/users.service';

export class EmailValidator {
  static emailExists(userService: UserService): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      const email = control.value as string;
      if (!email) {
        return of(null);
      }

      return userService.checkEmailExists(email).pipe(
        debounceTime(1000),
        map((emailExists) => {
          return emailExists ? {showEmailAlreadyExists: true} : null;
        }),
      )
    };
  }
}
