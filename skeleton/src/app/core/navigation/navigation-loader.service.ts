import { Injectable } from '@angular/core';
import { VexLayoutService } from '@vex/services/vex-layout.service';
import { NavigationItem } from './navigation-item.interface';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavigationLoaderService {
  private readonly _items: BehaviorSubject<NavigationItem[]> =
    new BehaviorSubject<NavigationItem[]>([]);

  get items$(): Observable<NavigationItem[]> {
    return this._items.asObservable();
  }

  constructor(private readonly layoutService: VexLayoutService) {
    this.loadNavigation();
  }

  loadNavigation(): void {
    this._items.next([
      {
        type: 'link',
        label: 'Dashboards',
        route: ''
      },
      {
        type: 'link',
        label: 'Instances',
        route: '/instances'
      },
      {
        type: 'link',
        label: 'Storages',
        route: '/storages'
      },
      {
        type: 'link',
        label: 'Clusters',
        route: '/clusters'
      },
      {
        type: 'link',
        label: 'Docker Images',
        route: '/docker-images'
      },
      {
        type: 'link',
        label: 'Vault',
        route: '/vault'
      },
      // {
      //   type: 'link',
      //   label: 'Ilef Services',
      //   route: '/ilef-services'
      // }

    ])
  }

}
