import {
  AfterViewInit,
  Component,
  DestroyRef,
  Inject,
  inject,
  Input,
  OnInit,
  PLATFORM_ID,
  ViewChild
} from '@angular/core';
import { Observable, of, ReplaySubject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Cluster } from './interfaces/cluster.model';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TableColumn } from '@vex/interfaces/table-column.interface';
// import { InstanceCreateUpdateComponent } from './key-create-update/key-create-update.component';
import { SelectionModel } from '@angular/cdk/collections';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { stagger40ms } from '@vex/animations/stagger.animation';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  UntypedFormControl
} from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { isPlatformServer, NgClass, NgFor, NgIf } from '@angular/common';
import { VexPageLayoutContentDirective } from '@vex/components/vex-page-layout/vex-page-layout-content.directive';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { VexBreadcrumbsComponent } from '@vex/components/vex-breadcrumbs/vex-breadcrumbs.component';
import { VexPageLayoutHeaderDirective } from '@vex/components/vex-page-layout/vex-page-layout-header.directive';
import { VexPageLayoutComponent } from '@vex/components/vex-page-layout/vex-page-layout.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatInputModule } from '@angular/material/input';
import { aioTableData, cloudProviderLabel } from 'src/static-data/aio-table-data';
import { Clipboard, ClipboardModule } from '@angular/cdk/clipboard';
// import { InstanceCreateUpdateComponent } from './instance-create-update/instance-create-update.component';
import { DomSanitizer } from '@angular/platform-browser';
// import { KeyCreateUpdateComponent } from './vault-create-update/key-create-update.component';
import { VaultTableData } from 'src/static-data/vault-table-data';
import { CLUSTERS_DATA } from 'src/static-data/cluster-table-data';
import { ClusterDialogComponent } from './cluster-dialog/cluster-dialog.component';
import { ClustersService } from './services/clusters.service';
import { NotificationService } from 'src/app/core/shared/notification.service';
import { SpinnerDialogComponent } from 'src/app/core/shared/components/spinner-dialog/spinner-dialog.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ConfirmDialogComponent } from 'src/app/core/shared/components/confirm-dialog/confirm-dialog.component';
import { Node } from './interfaces/cluster.model';
@Component({
  selector: 'vex-clusters',
  standalone: true,
  templateUrl: './clusters.component.html',
  styleUrl: './clusters.component.scss',
  animations: [fadeInUp400ms, stagger40ms],
  imports: [
    VexPageLayoutComponent,
    VexPageLayoutHeaderDirective,
    VexBreadcrumbsComponent,
    MatButtonToggleModule,
    ReactiveFormsModule,
    VexPageLayoutContentDirective,
    NgIf,
    MatButtonModule,
    MatTooltipModule,
    MatIconModule,
    MatMenuModule,
    MatTableModule,
    MatSortModule,
    MatCheckboxModule,
    NgFor,
    NgClass,
    MatPaginatorModule,
    FormsModule,
    MatDialogModule,
    MatInputModule,
    ClipboardModule,
    MatProgressSpinnerModule
  ],
})
export class ClustersComponent {
  layoutCtrl = new UntypedFormControl('boxed');
  displayedColumns: string[] = ['cluster_name', 'cluster_location', 'cluster_kubernetes_version', 'cluster_service_external_ip', 'cluster_actions'];
  nodeColumns: string[] = ['node_name', 'node_status', 'node_addresses', 'node_actions'];

  subject$: ReplaySubject<Cluster[]> = new ReplaySubject<Cluster[]>(1);
  data$: Observable<Cluster[]> = this.subject$.asObservable();
  clusters: Cluster[] = [];

  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 20, 50];
  dataSource!: MatTableDataSource<Cluster>;
  selection = new SelectionModel<Cluster>(true, []);
  searchCtrl = new UntypedFormControl();
  expandedCluster: Cluster | null = null;

  labels = cloudProviderLabel;
  toggleVisibility: any = {}; // Object to keep track of visibility states
  loading = false;
  @ViewChild(MatPaginator, { static: true }) paginator?: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort?: MatSort;

  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  constructor(
    private dialog: MatDialog,
    private clipboard: Clipboard,
    private clustersService: ClustersService,
    private notificationService: NotificationService
  ) { }

  getClusters() {
    this.loading = true;
    this.clustersService.getAllClusters().subscribe(clusters => {
      this.clusters = clusters;
      this.dataSource.data = this.flattenDataSource(clusters);
      this.loading = false;
    },
      error => {
        console.error('Error fetching instances', error);
        this.loading = false;
      }
    );
  }
  ngOnInit() {

    this.getClusters();

    this.dataSource = new MatTableDataSource();

    this.data$.pipe(filter<Cluster[]>(Boolean)).subscribe((clusters) => {
      this.clusters = clusters;
      this.dataSource.data = clusters;
      clusters.forEach(cluster => this.toggleVisibility[cluster.id] = false); // Initialize all as hidden
    });

  }

  ngAfterViewInit() {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }

    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
  }

  createCluster() {
    const dialogRef = this.dialog.open(ClusterDialogComponent, {
      width: '400px',
      data: {} // Pass any required data here
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const dialogRef = this.dialog.open(SpinnerDialogComponent, {
          width: '300px',
          data: {
            messages: [
              `Creating cluster, please wait...`,
              `Update the cluster packages...`,
              `Upgrade the cluster...`,
              `Configuring the cluster security...`,
              `Configuring the cluster ports...`,
              `Still working...`,
              `Almost done,..`
            ],
            finalMessage: 'Alright! cleaning...' // or 'Instance creation failed' based on your logic
          }
        });

        // Call the createCluster method from the service
        this.clustersService.createCluster(result.provider, result.imageName).subscribe(
          response => {
            dialogRef.close()
            console.log('Cluster created successfully', response);
            this.notificationService.showSuccess("Cluster created successfully")
            // Handle success (e.g., display a success message, refresh the list, etc.)
          },
          error => {
            dialogRef.close()
            console.error('Error creating cluster', error);
            this.notificationService.showError("Error creating cluster")

            // Handle error (e.g., display an error message)
          }
        );
      }
    });
  }


  copyToClipboard(value: string) {
    this.clipboard.copy(value);
    // this.snackBar.open('Copied to clipboard', 'Close', { duration: 2000 });
  }

  formatDate(dateString: string): string {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    };
    const date = new Date(dateString);
    const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date);

    const [datePart, timePart] = formattedDate.split(', ');
    const [month, day, year] = datePart.split('/');
    const [time, period] = timePart.split(' ');

    return `${year}-${month}-${day} ${time.toLowerCase()} ${period}`;
  }

  isNodeRow = (_index: number, row: any): boolean => row.isNode;

  toggleNodes(cluster: Cluster) {
    cluster.showNodes = !cluster.showNodes;
    this.dataSource.data = this.flattenDataSource(this.clusters);
    console.log(this.dataSource.data);

  }

  private flattenDataSource(clusters: Cluster[]): any[] {
    const flattenedData: any[] = [];
    clusters.forEach(cluster => {
      flattenedData.push(cluster);
      if (cluster.showNodes) {
        cluster.nodes.forEach(node => {
          flattenedData.push({ ...node, isNode: true, clusterName: cluster.name });
        });
      }
    });
    return flattenedData;
  }

  deleteCluster(clusterName: string): void {
    this.notificationService.showSuccess("Cluster deleted successfully")
    this.clustersService.deleteCluster(clusterName).subscribe(response => {
      this.getClusters();
      console.log('Cluster deleted successfully', response);
      // Handle success (e.g., display a success message, refresh the list, etc.)
    },
      error => {
        console.error('Error deleting cluster', error);
        this.notificationService.showError("Error deleting cluster")
      });
  }

  cordonNode(clusterName: string, nodeName: string): void {
    this.clustersService.cordonNode(clusterName, nodeName).subscribe(response => {
      console.log('Node cordoned successfully');
      this.notificationService.showSuccess("Node cordoned successfully")
    },
      error => {
        console.error('Error cordoning node', error);
        this.notificationService.showError("Error cordoning node")
      });
  }

  drainNode(clusterName: string, nodeName: string): void {
    this.clustersService.drainNode(clusterName, nodeName).subscribe(response => {
      console.log('Node drained successfully');
      this.notificationService.showSuccess("Node drained successfully")
    },
      error => {
        console.error('Error cordoning node', error);
        this.notificationService.showError("Error draining node")
      });
  }
  uncordonNode(clusterName: string, nodeName: string): void {
    this.clustersService.uncordonNode(clusterName, nodeName).subscribe(response => {
      console.log('Node uncordoned successfully');
      this.notificationService.showSuccess("Node uncordoned successfully")

    },
      error => {
        console.error('Error uncordoning node', error);
        this.notificationService.showError("Error uncordoning node")
      });
  }

  confirmAction(action: string, clusterName: string, nodeName: any): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '250px',
      data: { message: `Are you sure you want to ${action} this cluster?` }
    });

    dialogRef.afterClosed().subscribe(result => {

      if (result) {
        if (action === 'delete') {
          this.deleteCluster(clusterName);
        }
        else if (action === 'drain') {
          this.drainNode(clusterName, nodeName);

        }
        else if (action === 'uncordon') {
          this.uncordonNode(clusterName, nodeName);
        }
      }
    });
  }
}
