import { NgFor, NgIf } from '@angular/common';
import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { StoragesService } from '../services/storages.service';

@Component({
  selector: 'vex-upload-dialog',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDialogModule,
    MatOptionModule,
    NgFor,
    NgIf,
  ],
  templateUrl: './upload-dialog.component.html',
  styleUrl: './upload-dialog.component.scss'
})
export class UploadDialogComponent {
  uploadForm!: FormGroup;
  providers = ['aws', 'azure', 'gcp'];
  selectedFile: File | null = null;

  @ViewChild('fileInput') fileInput!: ElementRef;

  constructor(
    public dialogRef: MatDialogRef<UploadDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private storageService: StoragesService
  ) { }

  ngOnInit(): void {
    this.uploadForm = this.fb.group({
      provider: ['', Validators.required],
      file: [null, Validators.required]
    });
  }

  onFileSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.selectedFile = fileInput.files[0];
      this.uploadForm.patchValue({ file: this.selectedFile });
    }
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      this.selectedFile = event.dataTransfer.files[0];
      this.uploadForm.patchValue({ file: this.selectedFile });
      event.dataTransfer.clearData();
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  onUpload(): void {
    if (this.uploadForm.valid && this.selectedFile) {
      const formData = new FormData();
      formData.append('provider', this.uploadForm.get('provider')?.value);
      formData.append('file', this.selectedFile);
      formData.append('object_name', this.selectedFile.name);

      this.storageService.uploadFile(formData).subscribe(response => {
        console.log('Upload successful', response);
        this.dialogRef.close(response);
      }, error => {
        console.error('Upload failed', error);
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}