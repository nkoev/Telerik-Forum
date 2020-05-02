import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { UserDTO } from 'src/app/models/user.dto';

@Component({
  selector: 'app-votes',
  templateUrl: './votes.component.html',
  styleUrls: ['./votes.component.css']
})
export class VotesComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public votes: UserDTO[],
    private dialogRef: MatDialogRef<VotesComponent>,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.router.events.subscribe(() => this.dialogRef.close());
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
