import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { Clipboard } from '@angular/cdk/clipboard';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'vex-url-display-dialog',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatDialogModule,

  ],
  templateUrl: './url-display-dialog.component.html',
  styleUrl: './url-display-dialog.component.scss'
})
export class UrlDisplayDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<UrlDisplayDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { url: string },
    private clipboard: Clipboard
  ) { }


  copyUrl(): void {
    console.log(this.data);
    this.clipboard.copy(this.data.url);
    // Optionally show a message or toast notification
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}