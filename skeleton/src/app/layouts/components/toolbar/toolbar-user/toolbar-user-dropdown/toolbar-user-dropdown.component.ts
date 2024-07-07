import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnInit
} from '@angular/core';
import { MenuItem } from '../interfaces/menu-item.interface';
import { trackById } from '@vex/utils/track-by';
import { VexPopoverRef } from '@vex/components/vex-popover/vex-popover-ref';
import { RouterLink } from '@angular/router';
import { MatRippleModule } from '@angular/material/core';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthentificationService } from 'src/app/pages/auth/authentification.service';

export interface OnlineStatus {
  id: 'online' | 'away' | 'dnd' | 'offline';
  label: string;
  icon: string;
  colorClass: string;
}

@Component({
  selector: 'vex-toolbar-user-dropdown',
  templateUrl: './toolbar-user-dropdown.component.html',
  styleUrls: ['./toolbar-user-dropdown.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatMenuModule,
    NgFor,
    MatRippleModule,
    RouterLink,
    NgClass,
    NgIf
  ]
})
export class ToolbarUserDropdownComponent implements OnInit {
  private authentificationService = inject(AuthentificationService);

  items: MenuItem[] = [
    {
      id: '1',
      icon: 'mat:account_circle',
      label: 'My Profile',
      description: 'Personal Information',
      colorClass: 'text-teal-600',
      route: '/apps/social'
    },
    {
      id: '2',
      icon: 'mat:move_to_inbox',
      label: 'My Inbox (Comming-soon)',
      description: 'Messages & Latest News',
      colorClass: 'text-primary-600',
      route: '/apps/chat'
    },
    {
      id: '3',
      icon: 'mat:list_alt',
      label: 'My Projects',
      description: 'Tasks & Active Projects',
      colorClass: 'text-amber-600',
      route: '/scrumboard'
    },
    {
      id: '4',
      icon: 'mat:table_chart',
      label: 'Billing Information  (Comming-soon)',
      description: 'Pricing & Current Plan',
      colorClass: 'text-purple-600',
      route: '/pages/pricing'
    }
  ];

  statuses: OnlineStatus[] = [
    {
      id: 'online',
      label: 'Online',
      icon: 'mat:check_circle',
      colorClass: 'text-green-600'
    },
    {
      id: 'away',
      label: 'Away',
      icon: 'mat:access_time',
      colorClass: 'text-orange-600'
    },
    {
      id: 'dnd',
      label: 'Do not disturb',
      icon: 'mat:do_not_disturb',
      colorClass: 'text-red-600'
    },
    {
      id: 'offline',
      label: 'Offline',
      icon: 'mat:offline_bolt',
      colorClass: 'text-gray-600'
    }
  ];

  activeStatus: OnlineStatus = this.statuses[0];

  trackById = trackById;
  username: string | null = null; // Define the username property
  constructor(
    private cd: ChangeDetectorRef,
    private popoverRef: VexPopoverRef<ToolbarUserDropdownComponent>
  ) { }

  ngOnInit() {
    this.username = this.getFromLocalStorage('username');
  }

  getFromLocalStorage(key: string): string | null {
    return localStorage.getItem(key);
  }

  setStatus(status: OnlineStatus) {
    this.activeStatus = status;
    this.cd.markForCheck();
  }

  close() {
    this.authentificationService.logout();
    this.popoverRef.close();
  }
}
