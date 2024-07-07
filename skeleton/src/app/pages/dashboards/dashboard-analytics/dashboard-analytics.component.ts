import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { defaultChartOptions } from '@vex/utils/default-chart-options';
import {
  Order,
  tableSalesData
} from '../../../../static-data/table-sales-data';
import { TableColumn } from '@vex/interfaces/table-column.interface';
import { WidgetTableComponent } from '../components/widgets/widget-table/widget-table.component';
import { WidgetLargeChartComponent } from '../components/widgets/widget-large-chart/widget-large-chart.component';
import { WidgetQuickValueCenterComponent } from '../components/widgets/widget-quick-value-center/widget-quick-value-center.component';
import { WidgetLargeGoalChartComponent } from '../components/widgets/widget-large-goal-chart/widget-large-goal-chart.component';
import { WidgetQuickLineChartComponent } from '../components/widgets/widget-quick-line-chart/widget-quick-line-chart.component';
import { WidgetAssistantComponent } from '../components/widgets/widget-assistant/widget-assistant.component';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { VexBreadcrumbsComponent } from '@vex/components/vex-breadcrumbs/vex-breadcrumbs.component';
import { VexSecondaryToolbarComponent } from '@vex/components/vex-secondary-toolbar/vex-secondary-toolbar.component';
import { isPlatformServer } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'vex-dashboard-analytics',
  templateUrl: './dashboard-analytics.component.html',
  styleUrls: ['./dashboard-analytics.component.scss'],
  standalone: true,
  imports: [
    VexSecondaryToolbarComponent,
    VexBreadcrumbsComponent,
    MatButtonModule,
    MatIconModule,
    WidgetAssistantComponent,
    WidgetQuickLineChartComponent,
    WidgetLargeGoalChartComponent,
    WidgetQuickValueCenterComponent,
    WidgetLargeChartComponent,
    WidgetTableComponent
  ]
})
export class DashboardAnalyticsComponent {
  InstancesNumber: number = 5;
  ContainersNumber: number = 35;
  ClusterNumber: number = 5;
  ObjectsNumber: number = 55;

  tableColumns: TableColumn<Order>[] = [
    {
      label: '',
      property: 'status',
      type: 'badge'
    },
    {
      label: 'PRODUCT',
      property: 'name',
      type: 'text'
    },
    {
      label: '$ PRICE',
      property: 'price',
      type: 'text',
      cssClasses: ['font-medium']
    },
    {
      label: 'DATE',
      property: 'timestamp',
      type: 'text',
      cssClasses: ['text-secondary']
    }
  ];
  tableData = tableSalesData;

  series: ApexAxisChartSeries = [
    {
      name: 'Subscribers',
      data: [28, 40, 36, 0, 52, 38, 60, 55, 67, 33, 89, 44]
    }
  ];

  userSessionsSeries: ApexAxisChartSeries = [
    {
      name: 'Storage',
      data: [10, 50, 26, 50, 38, 60, 50, 25, 61, 80, 40, 60]
    },
    {
      name: 'Virtual Machines',
      data: [20, 55, 25, 45, 37, 65, 55, 20, 66, 85, 45, 65]
    },
    {
      name: 'Network Watcher',
      data: [30, 45, 28, 55, 33, 70, 45, 30, 70, 75, 50, 55]
    },
    {
      name: 'Bandwidth',
      data: [40, 60, 20, 60, 40, 75, 60, 35, 75, 90, 55, 70]
    }
  ];

  salesSeries: ApexAxisChartSeries = [
    {
      name: 'Instances',
      data: [28, 40, 36, 0, 52, 38, 60, 55, 99, 54, 38, 87]
    }
  ];

  pageViewsSeries: ApexAxisChartSeries = [
    {
      name: 'Bandwidth used',
      data: [405, 800, 200, 600, 105, 788, 600, 204]
    }
  ];

  uniqueUsersSeries: ApexAxisChartSeries = [
    {
      name: 'Bandwidth remaining',
      data: [356, 806, 600, 754, 432, 854, 555, 1004]
    }
  ];

  uniqueUsersOptions = defaultChartOptions({
    chart: {
      type: 'area',
      height: 100
    },
    colors: ['#ff9800']
  });

  constructor(
    private _matIconRegistry: MatIconRegistry, private _domSanitizer: DomSanitizer, @Inject(PLATFORM_ID) private platformId: string) {
    const clusterSvgUrl = 'assets/img/icons/cluster.svg';
    // domain and port for SSR in this example is static. Use i.e. environment files to use appropriate dev/prod domain:port
    const domain = (isPlatformServer(platformId)) ? 'http://localhost:4000/' : '';
    this._matIconRegistry.addSvgIcon('cluster', this._domSanitizer.bypassSecurityTrustResourceUrl(domain + clusterSvgUrl));

    // this.matIconRegistry.addSvgIcon(
    //   'aws',
    //   this.domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/aws.svg')
    // );
  }
}
