import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { NgIf } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AuthentificationService } from '../authentification.service';
import { JwtHelperService, JWT_OPTIONS, JwtModule } from '@auth0/angular-jwt';

export function tokenGetter() {
  return localStorage.getItem('JWT_TOKEN');
}

@Component({
  selector: 'vex-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInUp400ms],
  standalone: true,
  providers: [
    { provide: JWT_OPTIONS, useValue: { tokenGetter: tokenGetter } },
    JwtHelperService
  ],
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    NgIf,
    MatButtonModule,
    MatTooltipModule,
    MatIconModule,
    MatCheckboxModule,
    RouterLink,
    MatSnackBarModule
  ]
})
export class LoginComponent {
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private cd = inject(ChangeDetectorRef);
  private snackbar = inject(MatSnackBar);
  private authentificationService = inject(AuthentificationService);

  form = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });

  inputType = 'password';
  visible = false;

  send() {
    if (this.form.valid) {
      const username = this.form.value.username!;
      const password = this.form.value.password!;

      this.authentificationService.login(username, password).subscribe({
        next: (data) => {
          if (this.authentificationService.isAuthenticated()) {
            this.snackbar.open('Welcome back', '', {
              duration: 2000
            });
            this.router.navigate(['/']);
          } else {
            this.displayErrorMessage();
          }
        },
        error: () => {
          this.displayErrorMessage();
        }
      });
    } else {
      this.displayErrorMessage();
    }
  }

  toggleVisibility() {
    this.visible = !this.visible;
    this.inputType = this.visible ? 'text' : 'password';
    this.cd.markForCheck();
  }

  private displayErrorMessage() {
    this.snackbar.open('Please check your details', '', {
      duration: 2000
    });
  }
}
