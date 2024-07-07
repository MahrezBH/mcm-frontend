import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'vex-generate-url-dialog',
  standalone: true,
  imports: [
    FormsModule,  // Add FormsModule here
    MatDialogModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule
  ],
  templateUrl: './generate-url-dialog.component.html',
  styleUrl: './generate-url-dialog.component.scss'
})
export class GenerateUrlDialogComponent {
  timeout = new FormControl('');

  preventNonNumeric(event: any): void {
    const input = event.target;
    input.value = input.value.replace(/\D/g, ''); // Remove non-digits
  }

  constructor(
    public dialogRef: MatDialogRef<GenerateUrlDialogComponent>
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
  generateUrl(): void {
    // Logic to generate URL based on 'timeout' or other parameters
    // const generatedUrl = `http://example.com?timeout=${this.timeout}`;
    this.dialogRef.close(this.timeout.value);  // Close the dialog and pass the URL back to the parent component
  }
}
