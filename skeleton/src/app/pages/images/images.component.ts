import { AfterViewInit, Component, DestroyRef, Inject, inject, Input, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { Observable, of, ReplaySubject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TableColumn } from '@vex/interfaces/table-column.interface';
import { SelectionModel } from '@angular/cdk/collections';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { stagger40ms } from '@vex/animations/stagger.animation';
import { FormControl, FormsModule, ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
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
import { DockerImage } from './interfaces/docker-image.model';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ImagesService } from './services/images.service';
import { SpinnerDialogComponent } from 'src/app/core/shared/components/spinner-dialog/spinner-dialog.component';
import { NotificationService } from 'src/app/core/shared/notification.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'vex-images',
  standalone: true,
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
    HttpClientModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './images.component.html',
  styleUrls: ['./images.component.scss']
})
export class ImagesComponent implements OnInit, AfterViewInit {
  layoutCtrl = new UntypedFormControl('boxed');

  subject$: ReplaySubject<DockerImage[]> = new ReplaySubject<DockerImage[]>(1);
  data$: Observable<DockerImage[]> = this.subject$.asObservable();
  dockerImages: DockerImage[] = [];
  continuationToken: string | null = null;

  @Input()
  columns: TableColumn<DockerImage>[] = [
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
      label: 'URL',
      property: 'downloadUrl',
      type: 'text',
      visible: true,
      cssClasses: ['text-secondary', 'font-medium']
    },
    {
      label: 'Version',
      property: 'version',
      type: 'text',
      visible: true,
      cssClasses: ['text-secondary', 'font-medium']
    },
    {
      label: 'Last modified',
      property: 'lastModified',
      type: 'text',
      visible: false,
      cssClasses: ['text-secondary', 'font-medium']
    },
    { label: 'Actions', property: 'actions', type: 'button', visible: true },
  ];

  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 20, 50];
  dataSource!: MatTableDataSource<DockerImage>;
  selection = new SelectionModel<DockerImage>(true, []);
  searchCtrl = new UntypedFormControl();
  loading = false;

  @ViewChild(MatPaginator, { static: true }) paginator?: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort?: MatSort;

  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  constructor(
    private dialog: MatDialog,
    private clipboard: Clipboard,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private imagesService: ImagesService,
    @Inject(PLATFORM_ID) private platformId: string,
    private notificationService: NotificationService
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
    this.loadDockerImages();

    this.dataSource = new MatTableDataSource();

    this.data$.pipe(filter<DockerImage[]>(Boolean)).subscribe((dockerImages) => {
      this.dockerImages = dockerImages;
      this.dataSource.data = dockerImages;
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

  loadDockerImages(continuationToken?: string) {
    this.loading = true;
    this.imagesService.getDockerImages(continuationToken).subscribe((response: any) => {
      console.log(response);

      const images = response.data.items.map((item: any) => ({
        id: item.id,
        name: this.getDockerImageName(item.assets[0].downloadUrl),
        version: item.version,
        downloadUrl: item.assets[0].downloadUrl,
        lastModified: item.assets[0].lastModified
      }));

      this.dockerImages = [...images];
      this.subject$.next(this.dockerImages);

      this.continuationToken = response.data.continuationToken;
      this.loading = false;
    });
  }

  deleteInstances(dockerImages: DockerImage[]) {
    dockerImages.forEach((c) => this.deleteInstance(c));
  }

  onFilterChange(value: string) {
    if (!this.dataSource) {
      return;
    }
    value = value.trim();
    value = value.toLowerCase();
    this.dataSource.filter = value;
  }

  toggleColumnVisibility(column: TableColumn<DockerImage>, event: Event) {
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

  onLabelChange(change: MatSelectChange, row: DockerImage) {
    const index = this.dockerImages.findIndex((c) => c === row);
    this.subject$.next(this.dockerImages);
  }

  deleteInstance(image: DockerImage) {
    this.dockerImages.splice(
      this.dockerImages.findIndex(
        (existingImage) => existingImage.id === image.id
      ),
      1
    );
    this.selection.deselect(image);
    this.subject$.next(this.dockerImages);
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

  onPaginatorEvent(event: PageEvent) {
    if (this.continuationToken) {
      this.loadDockerImages(this.continuationToken);
    }
  }


  getDockerImageName(downloadUrl: string): string {
    const url = new URL(downloadUrl);
    const pathParts = url.pathname.split('/');
    const repository = pathParts[2];
    const imageName = pathParts[5];
    const version = pathParts[pathParts.length - 1];
    console.log();

    return `${url.hostname}:8082/${repository}/${imageName}:${version}`;
  }

  // instantiateImage(imageName: string, provider: string) {
  //   console.log("imageName: ", imageName);
  //   this.imagesService.instantiateDockerImage(provider, imageName).subscribe(response => {
  //     console.log('Instance created successfully:', response);
  //     // Add logic to handle the response if needed
  //   });
  // }
  instantiateImage(imageName: string, provider: string) {
    const dialogRef = this.dialog.open(SpinnerDialogComponent, {
      width: '300px',
      data: {
        messages: [
          `Creating instance on ${provider}, please wait...`,
          `Update the instance packages...`,
          `Upgrade the instance...`,
          `Configuring the instance security...`,
          `Configuring the instance ports...`,
          `Still working on ${provider}...`,
          `Install docker tool...`,
          `Almost done on ${provider}...`
        ],
        finalMessage: 'Alright! cleaning...' // or 'Instance creation failed' based on your logic
      }
    });



    this.imagesService.instantiateDockerImage(provider, imageName).subscribe(
      (response) => {
        console.log('Instance created successfully', response);
        dialogRef.close(); // Close the spinner dialog
        this.notificationService.showSuccess("Instance created successfully")
      },
      (error) => {
        console.error('Error creating instance', error);
        dialogRef.close(); // Close the spinner dialog
        this.notificationService.showError("Error creating instance")

      }
    );
  }
}
