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
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TableColumn } from '@vex/interfaces/table-column.interface';
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
import { Clipboard, ClipboardModule } from '@angular/cdk/clipboard';
import { DomSanitizer } from '@angular/platform-browser';
import { FileLabels, filesTableData } from 'src/static-data/files-table';
import { File } from './interfaces/file.model';
import { ConvertToMegabytesPipe } from '@vex/pipes/vex-size-converter/convert-to-megabytes.pipe';
import { GenerateUrlDialogComponent } from './generate-url-dialog/generate-url-dialog.component';
import { UrlDisplayDialogComponent } from './url-display-dialog/url-display-dialog.component';
import { StoragesService } from './services/storages.service';
import { ConfirmDialogComponent } from 'src/app/core/shared/components/confirm-dialog/confirm-dialog.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UploadDialogComponent } from './upload-dialog/upload-dialog.component';
import { NotificationService } from 'src/app/core/shared/notification.service';

@Component({
  selector: 'vex-storages',
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
    ConvertToMegabytesPipe,
    MatProgressSpinnerModule,
  ],
  templateUrl: './storages.component.html',
  styleUrls: ['./storages.component.scss']
})
export class StoragesComponent implements OnInit, AfterViewInit {
  layoutCtrl = new UntypedFormControl('boxed');

  subject$: ReplaySubject<File[]> = new ReplaySubject<File[]>(1);
  data$: Observable<File[]> = this.subject$.asObservable();
  files: File[] = [];

  @Input()
  columns: TableColumn<File>[] = [
    {
      label: 'Checkbox',
      property: 'checkbox',
      type: 'checkbox',
      visible: true
    },
    {
      label: 'ID',
      property: 'id',
      type: 'text',
      visible: false,
      cssClasses: ['font-medium']
    },
    {
      label: 'Name',
      property: 'name',
      type: 'text',
      visible: true,
      cssClasses: ['font-medium']
    },
    {
      label: 'Container/Bucket',
      property: 'bucket',
      type: 'text',
      visible: true,
      cssClasses: ['text-secondary', 'font-medium']
    },
    {
      label: 'Size',
      property: 'size',
      type: 'text',
      visible: true,
      cssClasses: ['text-secondary', 'font-medium']
    },
    {
      label: 'Last modified',
      property: 'last_modified',
      type: 'text',
      visible: false,
      cssClasses: ['text-secondary', 'font-medium']
    },
    {
      label: 'Created At',
      property: 'created_at',
      type: 'text',
      visible: false,
      cssClasses: ['text-secondary', 'font-medium']
    },
    { label: 'Labels', property: 'labels', type: 'button', visible: true },
    { label: 'Actions', property: 'actions', type: 'button', visible: true },
  ];

  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 20, 50];
  dataSource!: MatTableDataSource<File>;
  selection = new SelectionModel<File>(true, []);
  searchCtrl = new UntypedFormControl();

  labels = FileLabels;

  @ViewChild(MatPaginator, { static: true }) paginator?: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort?: MatSort;

  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  generatedUrl: string = "";
  loading = false;

  constructor(
    private dialog: MatDialog,
    private clipboard: Clipboard,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private storageService: StoragesService,
    private notificationService: NotificationService,
    @Inject(PLATFORM_ID) private platformId: string
  ) {
    const awsSvgUrl = 'assets/img/icons/aws.svg';
    const googleCloudSvgUrl = 'assets/img/icons/google-cloud.svg';
    const hetznerSvgUrl = 'assets/img/icons/hetzner.svg';
    const microsoftAzureSvgUrl = 'assets/img/icons/microsoft-azure.svg';
    const domain = (isPlatformServer(platformId)) ? 'http://localhost:4000/' : '';
    this.matIconRegistry.addSvgIcon('aws', this.domSanitizer.bypassSecurityTrustResourceUrl(domain + awsSvgUrl));
    this.matIconRegistry.addSvgIcon('google-cloud', this.domSanitizer.bypassSecurityTrustResourceUrl(domain + googleCloudSvgUrl));
    this.matIconRegistry.addSvgIcon('hetzner', this.domSanitizer.bypassSecurityTrustResourceUrl(domain + hetznerSvgUrl));
    this.matIconRegistry.addSvgIcon('microsoft-azure', this.domSanitizer.bypassSecurityTrustResourceUrl(domain + microsoftAzureSvgUrl));
  }

  get visibleColumns() {
    return this.columns
      .filter((column) => column.visible)
      .map((column) => column.property);
  }

  ngOnInit() {
    this.loadObjects();
    this.subject$.subscribe(files => {
      this.files = files;
      this.dataSource.data = files;
      console.log(files);
      this.loading = false;

    });

    this.dataSource = new MatTableDataSource();

    this.data$.pipe(filter<File[]>(Boolean)).subscribe((files) => {
      this.files = files;
      this.dataSource.data = files;
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

  loadObjects() {
    this.loading = true; // Set loading to true when fetching starts
    this.storageService.getAllObjects().subscribe((data: any) => {
      if (data.data) {
        this.subject$.next(data.data.map((file: { provider: string; }) => ({
          ...file,
          labels: [this.getFileLabel(file.provider)]
        })));
      }
    });
  }

  confirmAction(action: string, object: any): void {
    console.log("file: ", object);

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '250px',
      data: { message: `Are you sure you want to ${action} this object?` }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (action === 'delete') {
          this.deleteObject(object);
        }
      }
    });
  }

  getFileLabel(provider: string) {
    switch (provider) {
      case 'aws':
        return FileLabels[0];
      case 'azure':
        return FileLabels[1];
      case 'hetzner':
        return FileLabels[2];
      case 'gcp':
        return FileLabels[3];
      default:
        return {};
    }
  }

  deleteInstances(files: File[]) {
    files.forEach((c) => this.deleteObject(c));
  }

  deleteObject(file: File) {
    this.storageService.deleteObject(file.provider, file.bucket, file.name).subscribe(() => {
      this.files = this.files.filter((existingFile) => existingFile.id !== file.id);
      this.subject$.next(this.files);
      this.selection.deselect(file);
      this.notificationService.showSuccess(`${file.name} deleted successfully !`)
    });
  }

  onFilterChange(value: string) {
    if (!this.dataSource) {
      return;
    }
    value = value.trim().toLowerCase();
    this.dataSource.filter = value;
  }

  toggleColumnVisibility(column: TableColumn<File>, event: Event) {
    event.stopPropagation();
    event.stopImmediatePropagation();
    column.visible = !column.visible;
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach((row) => this.selection.select(row));
  }

  trackByProperty<T>(index: number, column: TableColumn<T>) {
    return column.property;
  }

  onLabelChange(change: MatSelectChange, row: File) {
    const index = this.files.findIndex((c) => c === row);
    this.subject$.next(this.files);
  }

  copyToClipboard(value: string) {
    this.clipboard.copy(value);
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

  openGenerateUrlDialog(file: File): void {
    const dialogRef = this.dialog.open(GenerateUrlDialogComponent, {
      width: '250px'
    });

    dialogRef.afterClosed().subscribe(timeout => {
      if (timeout) {
        this.storageService.generatePresignedUrl(file.provider, file.bucket, file.name, timeout).subscribe(
          (response: any) => {
            console.log(response);

            const url = response.data.url;  // Assuming the response contains the URL in a field called 'url'
            this.dialog.open(UrlDisplayDialogComponent, {
              width: '500px',
              data: { url: url }
            });
          },
          (error: any) => {
            console.error('Error generating presigned URL', error);
          }
        );
      }
    });
  }

  openUploadDialog(): void {
    const dialogRef = this.dialog.open(UploadDialogComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(result);
        this.loadObjects()
        // this.uploadFile(result.provider, result.file);
      }
    });
  }

}
