import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef
} from '@angular/material/dialog';
import { Secret } from '../interfaces/secret.model';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { NgIf } from '@angular/common';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'vex-key-create-update',
  templateUrl: './key-create-update.component.html',
  styleUrls: ['./key-create-update.component.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    NgIf,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule

  ]
})
export class KeyCreateUpdateComponent implements OnInit {
  static id = 100;

  form = this.fb.group({
    id: [KeyCreateUpdateComponent.id++],
    key: [this.defaults?.key || ''],
    value: [this.defaults?.value || ''],

    // imageSrc: this.defaults?.imageSrc,
    // firstName: [this.defaults?.firstName || ''],
    // lastName: [this.defaults?.lastName || ''],
    // street: this.defaults?.street || '',
    // city: this.defaults?.city || '',
    // zipcode: this.defaults?.zipcode || '',
    // phoneNumber: this.defaults?.phoneNumber || '',
    // notes: this.defaults?.notes || ''
  });
  mode: 'create' | 'update' = 'create';

  constructor(
    @Inject(MAT_DIALOG_DATA) public defaults: Secret | undefined,
    private dialogRef: MatDialogRef<KeyCreateUpdateComponent>,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    if (this.defaults) {
      this.mode = 'update';
    } else {
      this.defaults = {} as Secret;
    }

    // this.form.patchValue(this.defaults);
  }

  save() {
    if (this.mode === 'create') {
      this.createKey();
    } else if (this.mode === 'update') {
      this.updateKey();
    }
  }

  createKey() {
    const customer = this.form.value;

    // if (!customer.imageSrc) {
    //   customer.imageSrc = 'assets/img/avatars/1.jpg';
    // }

    this.dialogRef.close(customer);
  }

  updateKey() {
    const customer = this.form.value;

    if (!this.defaults) {
      throw new Error(
        'Secret ID does not exist, this customer cannot be updated'
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
}
