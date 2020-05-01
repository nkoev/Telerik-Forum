import { Component, OnInit } from '@angular/core';
import {
  DialogComponent,
  DialogData,
} from 'src/app/shared/components/dialog/dialog.component';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersDataService } from '../../services/users-data.service';
import {
  BanDialogData,
  BanDialogComponent,
} from '../ban-dialog/ban-dialog.component';
import { BanStatusDTO } from 'src/app/models/ban-status.dto';

@Component({
  selector: 'app-admin-controls',
  templateUrl: './admin-controls.component.html',
  styleUrls: ['./admin-controls.component.css'],
})
export class AdminControlsComponent implements OnInit {
  public profileOwnerId: string;
  constructor(
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private usersDataService: UsersDataService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.profileOwnerId = this.route.snapshot.params.userId;
  }

  deleteUser(userId: string) {
    const data: DialogData = {
      title: 'delete user',
      question: 'Are you sure you want to delete this user permanently?',
    };
    this.openConfirmDialog(data).subscribe((res) => {
      if (res) {
        this.usersDataService.deleteUser(userId).subscribe(() => {
          console.log('user deleted');
          this.router.navigate(['posts/all']);
        });
      }
    });
  }

  banUser(userId: string) {
    const data: BanDialogData = {
      expiryDate: 'Please select ban expiry date within 3 months',
      description: 'Please provide your reasons',
    };
    this.openBanDialog(data).subscribe((res) => {
      const body: BanStatusDTO = {
        isBanned: true,
        expires: res.expiryDate,
        description: res.description,
      };
      this.usersDataService.banUser(userId, body).subscribe(() => {
        console.log('user banned');
      });
    });
  }

  openConfirmDialog(dialogData: DialogData): Observable<any> {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '40em',
      data: { action: dialogData.title, question: dialogData.question },
      backdropClass: 'backdropClass',
    });
    return dialogRef.afterClosed();
  }

  openBanDialog(dialogData: BanDialogData): Observable<any> {
    const dialogRef = this.dialog.open(BanDialogComponent, {
      width: '40em',
      data: {
        expiryDate: dialogData.expiryDate,
        description: dialogData.description,
      },
      backdropClass: 'backdropClass',
    });
    return dialogRef.afterClosed();
  }
}
