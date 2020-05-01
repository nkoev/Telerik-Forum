import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ActivityDTO } from 'src/app/models/activity.dto';

@Component({
  selector: 'app-user-activity',
  templateUrl: './user-activity.component.html',
  styleUrls: ['./user-activity.component.css'],
})
export class UserActivityComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public userActivity: string,
    private dialogRef: MatDialogRef<UserActivityComponent>,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.router.events.subscribe(() => this.dialogRef.close());
  }

  getRoutes(word: string): string[] {
    // const regex = new RegExp(`^(?:\S+\s*\n?){1,${test}}`);
    const regEx = /posts\\?.*/g;
    const routes = regEx.exec(word)[0].split('/');
    return routes;
  }

  targetRouter(activity: any) {
    const routes = this.getRoutes(activity.targetURL);

    if (routes.length > 2) {
      this.router.navigate(['/' + routes[0], routes[1]],
        { queryParams: { comment: routes[3] } });
    } else {
      this.router.navigate(['/' + routes[0], routes[1]]);
    }

  }
}
