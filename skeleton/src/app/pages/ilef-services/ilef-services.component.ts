import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { VexBreadcrumbsComponent } from '@vex/components/vex-breadcrumbs/vex-breadcrumbs.component';
import { VexSecondaryToolbarComponent } from '@vex/components/vex-secondary-toolbar/vex-secondary-toolbar.component';

@Component({
  selector: 'vex-ilef-services',
  standalone: true,
  imports: [
    VexSecondaryToolbarComponent,
    VexBreadcrumbsComponent,
    MatButtonModule,
    MatIconModule,], templateUrl: './ilef-services.component.html',
  styleUrl: './ilef-services.component.scss'
})
export class IlefServicesComponent {

}
