import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'vex-widget-assistant',
  templateUrl: './widget-assistant.component.html',
  styleUrls: ['./widget-assistant.component.scss'],
  standalone: true,
  imports: [MatIconModule, RouterModule]
})
export class WidgetAssistantComponent implements OnInit {
  username = "Mahrez";
  constructor() { }

  ngOnInit() { }
}
