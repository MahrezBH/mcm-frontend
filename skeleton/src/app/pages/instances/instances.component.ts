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
import { Instance } from './interfaces/instance.model';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TableColumn } from '@vex/interfaces/table-column.interface';
// import { InstanceCreateUpdateComponent } from './customer-create-update/customer-create-update.component';
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
import { InstanceCreateUpdateComponent } from './instance-create-update/instance-create-update.component';
import { DomSanitizer } from '@angular/platform-browser';
import { NotificationService } from 'src/app/core/shared/notification.service';
import { InstanceService } from './services/instance.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ConfirmDialogComponent } from '../../core/shared/components/confirm-dialog/confirm-dialog.component';


interface Column {
  property: string;
  label: string;
  type: string;
  visible: boolean;
  cssClasses?: string[];
}
@Component({
  selector: 'vex-aio-table',
  templateUrl: './instances.component.html',
  styleUrls: ['./instances.component.scss'],
  animations: [fadeInUp400ms, stagger40ms],
  standalone: true,
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
    MatProgressSpinnerModule,
  ],
})
export class InstancesComponent implements OnInit, AfterViewInit {
  layoutCtrl = new UntypedFormControl('boxed');

  /**
   * Simulating a service with HTTP that returns Observables
   * You probably want to remove this and do all requests in a service with HTTP
   */
  subject$: ReplaySubject<Instance[]> = new ReplaySubject<Instance[]>(1);
  data$: Observable<Instance[]> = this.subject$.asObservable();
  instances: Instance[] = [];

  // name: string;
  // status: string;
  // created_at: string;
  // zone: string;
  // machine_type: string;
  // network_ip: string;
  // external_ip: string;
  // provider: string;

  @Input()
  columns: TableColumn<Instance>[] = [
    {
      label: 'Checkbox',
      property: 'checkbox',
      type: 'checkbox',
      visible: true
    },
    // { label: 'Image', property: 'image', type: 'image', visible: true },
    {
      label: 'Name',
      property: 'name',
      type: 'text',
      visible: true,
      cssClasses: ['font-medium']
    },
    // {
    //   label: 'Machine type',
    //   property: 'machine_type',
    //   type: 'text',
    //   visible: true,
    //   cssClasses: ['text-secondary', 'font-medium']
    // },
    {
      label: 'Private IP',
      property: 'network_ip',
      type: 'text',
      visible: false,
      cssClasses: ['text-secondary', 'font-medium']
    },
    {
      label: 'Public IP',
      property: 'external_ip',
      type: 'text',
      visible: true,
      cssClasses: ['text-secondary', 'font-medium']
    },
    { label: 'Status', property: 'status', type: 'button', visible: true },
    { label: 'type', property: 'machine_type', type: 'button', visible: true },
    { label: 'Labels', property: 'labels', type: 'button', visible: true },
    { label: 'Actions', property: 'actions', type: 'button', visible: true },
    {
      label: 'Ceated At',
      property: 'created_at',
      type: 'text',
      visible: false,
      cssClasses: ['text-secondary', 'font-medium']
    },
  ];
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 20, 50];
  dataSource!: MatTableDataSource<Instance>;
  selection = new SelectionModel<Instance>(true, []);
  searchCtrl = new UntypedFormControl();

  labels = cloudProviderLabel;

  @ViewChild(MatPaginator, { static: true }) paginator?: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort?: MatSort;

  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  loading = false;

  awsInstanceTypes: string[] = [
    // General Purpose Instances
    't3.nano',
    't3.micro',
    't3.small',
    't3.medium',
    't3.large',
    't3.xlarge',
    't3.2xlarge',
    't2.nano',
    't2.micro',
    't2.small',
    't2.medium',
    't2.large',
    't2.xlarge',
    't2.2xlarge',
    'm6g.medium',
    // Add other instance types as needed
  ];


  constructor(
    private dialog: MatDialog,
    private clipboard: Clipboard,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private _matIconRegistry: MatIconRegistry, private _domSanitizer: DomSanitizer, @Inject(PLATFORM_ID) private platformId: string,
    private notificationService: NotificationService,
    private instanceService: InstanceService,
  ) {

    const awsSvgUrl = 'assets/img/icons/aws.svg';
    const googleCloudSvgUrl = 'assets/img/icons/google-cloud.svg';
    const hetznerSvgUrl = 'assets/img/icons/hetzner.svg';
    const microsoftAzureSvgUrl = 'assets/img/icons/microsoft-azure.svg';
    // domain and port for SSR in this example is static. Use i.e. environment files to use appropriate dev/prod domain:port
    const domain = (isPlatformServer(platformId)) ? 'http://localhost:4000/' : '';
    this._matIconRegistry.addSvgIcon('aws', this._domSanitizer.bypassSecurityTrustResourceUrl(domain + awsSvgUrl));
    this._matIconRegistry.addSvgIcon('google-cloud', this._domSanitizer.bypassSecurityTrustResourceUrl(domain + googleCloudSvgUrl));
    this._matIconRegistry.addSvgIcon('hetzner', this._domSanitizer.bypassSecurityTrustResourceUrl(domain + hetznerSvgUrl));
    this._matIconRegistry.addSvgIcon('microsoft-azure', this._domSanitizer.bypassSecurityTrustResourceUrl(domain + microsoftAzureSvgUrl));



    // this.matIconRegistry.addSvgIcon(
    //   'aws',
    //   this.domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/aws.svg')
    // );
  }
  get visibleColumns() {
    return this.columns
      .filter((column) => column.visible)
      .map((column) => column.property);
  }

  /**
   * Example on how to get data and pass it to the table - usually you would want a dedicated service with a HTTP request for this
   * We are simulating this request here.
   */
  // getData() {
  //   return of(this.instances.map((instance) => new Instance(instance)));
  // }

  ngOnInit() {
    this.fetchInstances();
    this.subject$.subscribe(instances => {
      this.instances = instances;
      this.dataSource.data = instances;
      this.loading = false; // Set loading to false when instances are loaded
      console.log(instances);

    });

    this.dataSource = new MatTableDataSource();

    this.data$.pipe(filter<Instance[]>(Boolean)).subscribe((instances) => {
      this.instances = instances;
      this.dataSource.data = instances;
    });

    this.searchCtrl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => this.onFilterChange(value));
  }

  ngAfterViewInit() {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }

    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
  }

  createInstance() {
    this.dialog
      .open(InstanceCreateUpdateComponent)
      .afterClosed()
      .subscribe((instance: Instance) => {
        /**
         * Instance is the updated customer (if the user pressed Save - otherwise it's null)
         */
        // if (instance) {
        //   /**
        //    * Here we are updating our local array.
        //    * You would probably make an HTTP request here.
        //    */
        //   this.instances.unshift(new Instance(instance));
        //   this.subject$.next(this.instances);
        // }
        this.notificationService.showSuccess('Instance created successfully');
      });
  }

  updateInstance(customer: Instance) {
    // this.dialog
    //   .open(InstanceCreateUpdateComponent, {
    //     data: customer
    //   })
    //   .afterClosed()
    //   .subscribe((updatedCustomer) => {
    //     /**
    //      * Instance is the updated customer (if the user pressed Save - otherwise it's null)
    //      */
    //     if (updatedCustomer) {
    //       /**
    //        * Here we are updating our local array.
    //        * You would probably make an HTTP request here.
    //        */
    //       const index = this.customers.findIndex(
    //         (existingCustomer) => existingCustomer.id === updatedCustomer.id
    //       );
    //       this.customers[index] = new Instance(updatedCustomer);
    //       this.subject$.next(this.customers);
    //     }
    //   });
  }


  deleteInstances(customers: Instance[]) {
    /**
     * Here we are updating our local array.
     * You would probably make an HTTP request here.
     */
    customers.forEach((c) => this.deleteInstance(c));
  }

  onFilterChange(value: string) {
    if (!this.dataSource) {
      return;
    }
    value = value.trim();
    value = value.toLowerCase();
    this.dataSource.filter = value;
  }

  toggleColumnVisibility(column: TableColumn<Instance>, event: Event) {
    event.stopPropagation();
    event.stopImmediatePropagation();
    column.visible = !column.visible;
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach((row) => this.selection.select(row));
  }

  trackByProperty<T>(index: number, column: TableColumn<T>) {
    return column.property;
  }

  onLabelChange(change: MatSelectChange, row: Instance) {
    const index = this.instances.findIndex((c) => c === row);
    this.instances[index].labels = change.value;
    this.subject$.next(this.instances);
  }

  deleteInstance(instance: Instance) {
    /**
     * Here we are updating our local array.
     * You would probably make an HTTP request here.
     */
    this.instances.splice(
      this.instances.findIndex(
        (existingInstance) => existingInstance.id === instance.id
      ),
      1
    );
    this.selection.deselect(instance);
    this.subject$.next(this.instances);
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

  fetchInstances(provider?: string): void {
    this.loading = true; // Set loading to true when fetching starts
    this.instanceService.getInstances(provider).subscribe(
      data => {
        const instances = data.data.map((instanceData: any) => {
          const instance = new Instance(instanceData);
          return {
            ...instance,
            status: this.mapStatus(instance.status ?? 'unknown'),
            machine_type: this.mapMachineType(instance.machine_type ?? 'unknown'),
            zone: this.mapZone(instance.zone ?? 'unknown'),
            labels: this.mapLabels(instance)
          };
        });
        this.subject$.next(instances);
      },
      error => {
        console.error('Error fetching instances', error);
        this.loading = false; // Set loading to false in case of error
      }
    );
  }

  mapStatus(status: string): any {
    const statusMapping: { [key: string]: any } = {
      'running': { text: 'Running', textClass: 'text-green-600', bgClass: 'bg-green-600/10' },
      'stopped': { text: 'Stopped', textClass: 'text-cyan-600', bgClass: 'bg-cyan-600/10' },
      'terminated': { text: 'Terminated', textClass: 'text-teal-600', bgClass: 'bg-teal-600/10' },
      'unknown': { text: 'Unknown', textClass: 'text-gray-600', bgClass: 'bg-gray-600/10' }
    };
    return statusMapping[status] || statusMapping['unknown'];
  }

  mapMachineType(machineType: string): any {
    const typeMapping: { [key: string]: any } = {
      't2.micro': { text: 't2.micro', textClass: 'text-green-600', bgClass: 'bg-green-600/10' },
      't3.nano': { text: 't3.nano', textClass: 'text-green-600', bgClass: 'bg-green-600/10' },
      't3.micro': { text: 't3.micro', textClass: 'text-green-600', bgClass: 'bg-green-600/10' },
      't3.small': { text: 't3.small', textClass: 'text-green-600', bgClass: 'bg-green-600/10' },
      't3.medium': { text: 't3.medium', textClass: 'text-green-600', bgClass: 'bg-green-600/10' },
      't3.large': { text: 't3.large', textClass: 'text-green-600', bgClass: 'bg-green-600/10' },
      't3.xlarge': { text: 't3.xlarge', textClass: 'text-green-600', bgClass: 'bg-green-600/10' },
      't3.2xlarge': { text: 't3.2xlarge', textClass: 'text-green-600', bgClass: 'bg-green-600/10' },
      'Standard_DS1_v2': { text: 'Standard_DS1_v2', textClass: 'text-cyan-600', bgClass: 'bg-cyan-600/10' },
      'Standard_DS2_v2': { text: 'Standard_DS2_v2', textClass: 'text-cyan-600', bgClass: 'bg-cyan-600/10' },
      'Standard_DS3_v2': { text: 'Standard_DS3_v2', textClass: 'text-cyan-600', bgClass: 'bg-cyan-600/10' },
      'n1-standard-1': { text: 'n1-standard-1', textClass: 'text-teal-600', bgClass: 'bg-teal-600/10' },
      'n1-standard-2': { text: 'n1-standard-2', textClass: 'text-teal-600', bgClass: 'bg-teal-600/10' },
      'n1-standard-4': { text: 'n1-standard-4', textClass: 'text-teal-600', bgClass: 'bg-teal-600/10' },
      'cpx31': { text: 'cpx31', textClass: 'text-teal-600', bgClass: 'bg-teal-600/10' },
      'cpx41': { text: 'cpx41', textClass: 'text-teal-600', bgClass: 'bg-teal-600/10' },
      'cpx51': { text: 'cpx51', textClass: 'text-teal-600', bgClass: 'bg-teal-600/10' },
      'unknown': { text: 'Unknown', textClass: 'text-gray-600', bgClass: 'bg-gray-600/10' }
    };
    return typeMapping[machineType] || typeMapping['unknown'];
  }

  mapZone(zone: string): any {
    const zoneMapping: { [key: string]: any } = {
      "us-east-1b": { text: 'us-east-1b', textClass: 'text-green-600', bgClass: 'bg-green-600/10' },
      "us-east-1c": { text: 'us-east-1c', textClass: 'text-green-600', bgClass: 'bg-green-600/10' },
      "us-west-2a": { text: 'us-west-2a', textClass: 'text-green-600', bgClass: 'bg-green-600/10' },
      "francecentral": { text: 'francecentral', textClass: 'text-purple-600', bgClass: 'bg-purple-600/10' },
      "westeurope": { text: 'westeurope', textClass: 'text-purple-600', bgClass: 'bg-purple-600/10' },
      'europe-west1-b': { text: 'europe-west1-b', textClass: 'text-teal-600', bgClass: 'bg-teal-600/10' },
      'us-central1-a': { text: 'us-central1-a', textClass: 'text-teal-600', bgClass: 'bg-teal-600/10' },
      'hel1-dc2': { text: 'hel1-dc2', textClass: 'text-cyan-600', bgClass: 'bg-cyan-600/10' },
      'nbg1-dc3': { text: 'nbg1-dc3', textClass: 'text-cyan-600', bgClass: 'bg-cyan-600/10' },
      'unknown': { text: 'Unknown', textClass: 'text-gray-600', bgClass: 'bg-gray-600/10' }
    };
    return zoneMapping[zone] || zoneMapping['unknown'];
  }

  mapLabels(instance: Instance): any[] {
    const providerMapping: { [key: string]: any } = {
      'aws': { text: 'AWS', textClass: 'text-green-600', bgClass: 'bg-green-600/10', icon: 'aws' },
      'azure': { text: 'Microsoft Azure', textClass: 'text-cyan-600', bgClass: 'bg-cyan-600/10', icon: 'microsoft-azure' },
      'hetzner': { text: 'Hetzner', textClass: 'text-teal-600', bgClass: 'bg-teal-600/10', icon: 'hetzner' },
      'gcp': { text: 'Google Cloud Provider', textClass: 'text-purple-600', bgClass: 'bg-purple-600/10', icon: 'google-cloud' },
      'unknown': { text: 'Unknown', textClass: 'text-gray-600', bgClass: 'bg-gray-600/10' }
    };
    const provider = instance.provider || 'unknown';
    return [providerMapping[provider] || providerMapping['unknown']];
  }

  confirmAction(action: string, instance: any): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '250px',
      data: { message: `Are you sure you want to ${action} this instance?` }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (action === 'stop') {
          this.stopInstance(instance);
        } else if (action === 'start') {
          this.startInstance(instance);
        } else if (action === 'restart') {
          this.restartInstance(instance);
        } else if (action === 'terminate') {
          this.terminateInstance(instance);
        }
      }
    });
  }

  startInstance(instance: any): void {
    this.instanceService.startInstance(instance).subscribe(() => {
      this.fetchInstances();  // Refresh the instance list
    });
  }

  stopInstance(instance: any): void {
    this.instanceService.stopInstance(instance).subscribe(() => {
      this.fetchInstances();  // Refresh the instance list
    });
  }

  restartInstance(instance: any): void {
    this.instanceService.restartInstance(instance).subscribe(() => {
      this.fetchInstances();  // Refresh the instance list
    });
  }

  terminateInstance(instance: any): void {
    this.instanceService.terminateInstance(instance).subscribe(() => {
      this.fetchInstances();  // Refresh the instance list
    });
  }
}
