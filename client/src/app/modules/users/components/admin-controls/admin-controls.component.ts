import { Component, OnInit } from '@angular/core';
import {
  DialogComponent,
  DialogData,
} from 'src/app/shared/components/dialog/dialog.component';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-admin-controls',
  templateUrl: './admin-controls.component.html',
  styleUrls: ['./admin-controls.component.css'],
})
export class AdminControlsComponent implements OnInit {
  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {}

  deleteUser() {}

  openDialog(dialogData: DialogData): Observable<any> {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '40em',
      data: { action: dialogData.title, question: dialogData.question },
      backdropClass: 'backdropClass',
    });
    return dialogRef.afterClosed();
  }
}
