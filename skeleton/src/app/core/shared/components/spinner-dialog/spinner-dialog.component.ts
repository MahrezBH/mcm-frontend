import { Component, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'vex-spinner-dialog',
  standalone: true,
  imports: [
    MatProgressBarModule
  ],
  templateUrl: './spinner-dialog.component.html',
  styleUrl: './spinner-dialog.component.scss'
})
export class SpinnerDialogComponent implements OnDestroy {
  currentMessage: string | undefined;
  private messageSubscription!: Subscription;
  private messageIndex = 0;
  isComplete = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { messages: string[], finalMessage: string }) { }

  ngOnInit() {
    this.currentMessage = this.data.messages[this.messageIndex];
    this.messageSubscription = interval(4000).subscribe(() => {
      this.messageIndex++;
      if (this.messageIndex < this.data.messages.length) {
        this.currentMessage = this.data.messages[this.messageIndex];
      } else {
        this.messageSubscription.unsubscribe();
        // this.showFinalMessage();
      }
    });
  }

  ngOnDestroy() {
    if (this.messageSubscription) {
      this.messageSubscription.unsubscribe();
    }
  }

  // private showFinalMessage() {
  //   this.isComplete = true;
  //   this.currentMessage = this.data.finalMessage;
  // }
}