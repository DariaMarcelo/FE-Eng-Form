import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from "../services/users.service";

export interface FrontendEngineerData {
  firstName: FormControl<string | null>;
  lastName: FormControl<string | null>;
  dateOfBirth: FormControl<Date | string | null>;
  framework: FormControl<string | null>;
  frameworkVersion: FormControl<string | null>;
  email: FormControl<string | null>;
  hobbies: FormControl<string | null>;
}

@Component({
  selector: 'app-frontend-engineer-form',
  templateUrl: './frontend-engineer-form.component.html',
  styleUrls: ['./frontend-engineer-form.component.css'],
})
export class FrontendEngineerFormComponent {
  frontendEngineerForm: FormGroup<FrontendEngineerData>;
  frameworkOptions = ['angular', 'react', 'vue'];
  frameworkVersions: string[] = [];
  showEmailAlreadyExists = false;

  constructor(private fb: FormBuilder, private userService: UserService) {
    this.frontendEngineerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      dateOfBirth: ['' as (Date | string), Validators.required],
      framework: [null as (string | null), Validators.required],
      frameworkVersion: [''],
      email: ['', [Validators.required, Validators.email]],
      hobbies: ['']
    });

    this.frontendEngineerForm.get('framework')?.valueChanges.subscribe((framework) => {
      this.frontendEngineerForm.get('frameworkVersion')?.setValue('');
      this.frameworkVersions = this.getFrameworkVersions(framework as string);
    });
  }

  getFrameworkVersions(framework: string): string[] {
    switch (framework) {
      case 'angular':
        return ['1.1.1', '1.2.1', '1.3.3'];
      case 'react':
        return ['2.1.2', '3.2.4', '4.3.1'];
      case 'vue':
        return ['3.3.1', '5.2.1', '5.1.3'];
      default:
        return [];
    }
  }

  async submitForm() {
    if (this.frontendEngineerForm.valid) {
      const formData = this.getFormattedDataToSend();
      console.log(formData);

      await this.checkUserExists()
      if (this.showEmailAlreadyExists) {
        return;
      }
      this.userService.addUser(formData).subscribe(response => {
      });
    }
  }

  private async checkUserExists() {
    return new Promise((res, rej) => {
      const email = this.frontendEngineerForm.get('email')?.value;
      if (!email) {
        return;
      }

      this.userService.checkEmailExists(email).subscribe(emailExists => {
        if (emailExists) {
          this.frontendEngineerForm.get('email')?.setErrors({emailExists: true});
          this.showEmailAlreadyExists = true;
          res(true)
        } else {
          this.frontendEngineerForm.get('email')?.setErrors(null);
          this.showEmailAlreadyExists = false;
          res(false)
        }
      });
    })
  }

  getFormattedDataToSend() {
    const data = {...this.frontendEngineerForm.value};
    const {dateOfBirth} = data;

    if (dateOfBirth instanceof Date) {
      data.dateOfBirth = `${dateOfBirth.getDate()}-${dateOfBirth.getMonth() + 1}-${dateOfBirth.getFullYear()}`;
    }

    return data;
  }
}
