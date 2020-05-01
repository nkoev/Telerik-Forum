import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

export interface BanDialogData {
  expiryDate: string;
  description: string;
}

@Component({
  selector: 'app-ban-dialog',
  templateUrl: './ban-dialog.component.html',
  styleUrls: ['./ban-dialog.component.css'],
})
export class BanDialogComponent implements OnInit {
  banForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<BanDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: BanDialogData,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.banForm = this.formBuilder.group({
      expiryDate: ['', [Validators.required]],
      description: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(1000),
        ],
      ],
    });
  }

  get expiryDate() {
    return this.banForm.get('expiryDate');
  }

  get description() {
    return this.banForm.get('description');
  }

  onSubmit(banForm: FormGroup) {
    if (banForm.valid) {
      this.dialogRef.close({
        expiryDate: this.expiryDate.value,
        description: this.description.value.trim(),
      });
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
