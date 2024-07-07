import { NgIf } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'vex-cluster-dialog',
  standalone: true,
  imports: [
    FormsModule,  // Add FormsModule here
    MatDialogModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './cluster-dialog.component.html',
  styleUrl: './cluster-dialog.component.scss'
})
export class ClusterDialogComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ClusterDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form = this.fb.group({
      imageName: ['', Validators.required],
      numberOfNodes: [1, [Validators.required, Validators.min(1)]]
    });
  }

  submit() {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }

  close() {
    this.dialogRef.close();
  }
}
