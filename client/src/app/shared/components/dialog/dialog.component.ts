import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';

export interface DialogData {
  title: string;
  question: string;
}

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css'],
})
export class DialogComponent implements OnInit {

  static openDialog(dialog: MatDialog, dialogData: DialogData): Observable<any> {
    const dialogRef = dialog.open(DialogComponent, {
      width: '40em',
      data: { action: dialogData.title, question: dialogData.question },
      backdropClass: 'backdropClass',
      panelClass: 'dialog',
    });

    return dialogRef.afterClosed();
  }

  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) { }

  ngOnInit(): void { }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
