import { Component, DestroyRef, inject, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Secret } from './interfaces/secret.model';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
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
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { VexPageLayoutContentDirective } from '@vex/components/vex-page-layout/vex-page-layout-content.directive';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { VexBreadcrumbsComponent } from '@vex/components/vex-breadcrumbs/vex-breadcrumbs.component';
import { VexPageLayoutHeaderDirective } from '@vex/components/vex-page-layout/vex-page-layout-header.directive';
import { VexPageLayoutComponent } from '@vex/components/vex-page-layout/vex-page-layout.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatInputModule } from '@angular/material/input';
import { Clipboard, ClipboardModule } from '@angular/cdk/clipboard';
import { KeyCreateUpdateComponent } from './vault-create-update/key-create-update.component';
import { VaultService } from './services/vault.service';
import { NotificationService } from 'src/app/core/shared/notification.service';
import { ConfirmDialogComponent } from 'src/app/core/shared/components/confirm-dialog/confirm-dialog.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'vex-vault',
  standalone: true,
  templateUrl: './vault.component.html',
  styleUrl: './vault.component.scss',
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
export class VaultComponent implements OnInit {
  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  layoutCtrl = new UntypedFormControl('boxed');
  subject$: ReplaySubject<Secret[]> = new ReplaySubject<Secret[]>(1);
  data$: Observable<Secret[]> = this.subject$.asObservable();
  secrets: Secret[] = [];
  @Input() columns: TableColumn<Secret>[] = [
    { label: 'Checkbox', property: 'checkbox', type: 'checkbox', visible: true },
    { label: 'Secret', property: 'key', type: 'text', visible: true, cssClasses: ['font-medium'] },
    { label: 'Value', property: 'value', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Actions', property: 'actions', type: 'button', visible: true },
  ];
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 20, 50];
  dataSource!: MatTableDataSource<Secret>;
  selection = new SelectionModel<Secret>(true, []);
  searchCtrl = new UntypedFormControl();
  loading = false;
  toggleVisibility: any = {}; // Object to keep track of visibility states

  @ViewChild(MatPaginator, { static: true }) paginator?: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort?: MatSort;

  constructor(
    private dialog: MatDialog,
    private clipboard: Clipboard,
    private vaultService: VaultService,
    private notificationService: NotificationService,
  ) { }

  get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }

  fetchSecrets(): void {
    this.loading = true;
    this.vaultService.getSecrets().subscribe(
      (data: { [key: string]: string }) => {
        this.secrets = Object.keys(data).map(key => new Secret({ id: key, key: key, value: data[key] }));
        this.dataSource.data = this.secrets;
        this.loading = false;
        this.subject$.next(this.secrets);
      },
      error => {
        console.error('Error fetching secrets', error);
        this.loading = false;
      }
    );
  }

  ngOnInit() {
    this.dataSource = new MatTableDataSource();
    this.fetchSecrets();

    // this.data$.pipe(filter<Secret[]>(Boolean)).subscribe((secrets) => {
    //   this.secrets = secrets;
    //   this.dataSource.data = secrets;
    // });

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

  storeSecret(secret: Secret): void {
    this.vaultService.storeSecret(secret).subscribe(
      () => {
        this.fetchSecrets();
        this.notificationService.showSuccess(`Secret ${secret.key} stored successfully`);
      },
      error => {
        console.error('Error storing secret', error);
        this.notificationService.showError(`Error storing secret`);
      }
    );
  }

  deleteSecret(key: string): void {
    this.vaultService.deleteSecret(key).subscribe(
      () => {
        this.fetchSecrets(); // Refresh secrets list after deletion
        this.notificationService.showSuccess(`Secret ${key} deleted successfully`);
      },
      error => {
        this.notificationService.showError(`Error deleting secret`);
        console.error('Error deleting secret', error);
      }
    );
  }

  createKey() {
    this.dialog.open(KeyCreateUpdateComponent, {
      width: '400px',
    }).afterClosed()
      .subscribe((secret: Secret) => {
        if (secret) {
          this.storeSecret(secret);
        }
      });
  }

  deleteKeys(keys: Secret[]) {
    keys.forEach((c) => this.deleteKey(c));
  }

  onFilterChange(value: string) {
    if (!this.dataSource) {
      return;
    }
    value = value.trim().toLowerCase();
    this.dataSource.filter = value;
  }

  toggleColumnVisibility(column: TableColumn<Secret>, event: Event) {
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
    this.isAllSelected() ? this.selection.clear() : this.dataSource.data.forEach(row => this.selection.select(row));
  }

  trackByProperty<T>(index: number, column: TableColumn<T>) {
    return column.property;
  }

  onLabelChange(change: MatSelectChange, row: Secret) {
    const index = this.secrets.findIndex((c) => c === row);
    this.subject$.next(this.secrets);
  }

  deleteKey(secret: Secret) {
    this.deleteSecret(secret.key);
  }

  copyToClipboard(value: string) {
    this.clipboard.copy(value);
  }

  formatDate(dateString: string): string {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: true
    };
    const date = new Date(dateString);
    const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date);
    const [datePart, timePart] = formattedDate.split(', ');
    const [month, day, year] = datePart.split('/');
    const [time, period] = timePart.split(' ');
    return `${year}-${month}-${day} ${time.toLowerCase()} ${period}`;
  }

  toggleSecretVisibility(keyId: string): void {
    this.toggleVisibility[keyId] = !this.toggleVisibility[keyId];
  }

  confirmAction(action: string, secret: any): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '250px',
      data: { message: `Are you sure you want to ${action} this secret?` }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (action === 'delete') {
          this.deleteKey(secret);
        }
      }
    });
  }
}
