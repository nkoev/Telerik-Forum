import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-user-friends',
  templateUrl: './user-friends.component.html',
  styleUrls: ['./user-friends.component.css'],
})
export class UserFriendsComponent implements OnInit {
  @Input()
  public friend;

  constructor() {}

  ngOnInit(): void {}
}
