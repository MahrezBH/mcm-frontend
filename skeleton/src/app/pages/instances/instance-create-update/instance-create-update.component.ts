import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef
} from '@angular/material/dialog';
import { Instance } from '../interfaces/instance.model';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { NgFor, NgIf } from '@angular/common';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { machineTypes, Provider, zones } from '../interfaces/machine-types';
import { BrowserModule } from '@angular/platform-browser';
import { InstanceService } from '../services/instance.service';
import { NotificationService } from 'src/app/core/shared/notification.service';

@Component({
  selector: 'vex-instance-create-update',
  templateUrl: './instance-create-update.component.html',
  styleUrls: ['./instance-create-update.component.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    NgIf,
    NgFor,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,

  ]
})
export class InstanceCreateUpdateComponent implements OnInit {
  static id = 100;

  form = this.fb.group({
    id: [InstanceCreateUpdateComponent.id++],
    name: [null],
    zone: ['us-east-1b'],
    machine_type: ['t2.micro'],
    provider: ['aws'],
    key_pair_name: [null]
  });
  mode: 'create' | 'update' = 'create';
  availableMachineTypes: string[] = [];
  availableZones: string[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public defaults: Instance | undefined,
    private dialogRef: MatDialogRef<InstanceCreateUpdateComponent>,
    private fb: FormBuilder,
    private instanceService: InstanceService,
    private notificationService: NotificationService
  ) {
    this.form.get('provider')?.valueChanges.subscribe((provider: string | null) => {
      if (provider) {
        const typedProvider = provider as Provider;
        this.updateMachineTypes(typedProvider);
        this.updateZones(typedProvider);
      } else {
        this.availableMachineTypes = [];
        this.availableZones = [];
        this.form.get('machine_type')?.setValue('');
        this.form.get('zone')?.setValue('');
      }
    });
  }

  ngOnInit() {
    if (this.defaults) {
      this.mode = 'update';
    } else {
      this.defaults = {} as Instance;
    }
    const initialProvider = this.form.get('provider')?.value as Provider | null;
    if (initialProvider) {
      this.updateMachineTypes(initialProvider);
      this.updateZones(initialProvider);
    }    // this.form.patchValue(this.defaults);
  }

  save() {
    if (this.mode === 'create') {
      this.createCustomer();
    } else if (this.mode === 'update') {
      this.updateCustomer();
    }
  }

  createCustomer() {
    const customer = this.form.value;

    // if (!customer.imageSrc) {
    //   customer.imageSrc = 'assets/img/avatars/1.jpg';
    // }
    if (this.form.valid) {
      console.log(this.form.value);

      let instance: Instance = this.form.value;
      this.instanceService.createInstance(instance).subscribe({
        next: (response) => {
          this.notificationService.showSuccess('Instance created successfully');
          console.log('Instance created successfully:', response);
        },
        error: (error) => {
          this.notificationService.showError('Error creating instance');
          console.error('Error creating instance:', error);
        }
      });
    }

    this.dialogRef.close(customer);
  }

  updateCustomer() {
    const customer = this.form.value;

    if (!this.defaults) {
      throw new Error(
        'Instance ID does not exist, this customer cannot be updated'
      );
    }

    // customer.id = this.defaults.id;

    this.dialogRef.close(customer);
  }

  isCreateMode() {
    return this.mode === 'create';
  }

  isUpdateMode() {
    return this.mode === 'update';
  }

  updateMachineTypes(provider: Provider): void {
    console.log("provider: ", provider);

    this.availableMachineTypes = machineTypes[provider] || [];
    this.form.get('machine_type')?.setValue('');
  }

  updateZones(provider: Provider): void {
    this.availableZones = zones[provider] || [];
    this.form.get('zone')?.setValue('');
  }
}
