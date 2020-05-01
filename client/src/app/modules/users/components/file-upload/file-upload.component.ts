import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { UsersDataService } from '../../services/users-data.service';
import { SafeUrl } from '@angular/platform-browser';
import { AvatarService } from '../../../core/services/avatar.service';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css'],
})
export class FileUploadComponent implements OnInit {
  @Input()
  public profileOwnerId: string;

  constructor(
    private usersDataService: UsersDataService,
    private avatarService: AvatarService
  ) {}

  ngOnInit(): void {}

  onFileSelected(event: any) {
    const file = event.target.files[0];
    const fd = new FormData();
    fd.append('file', file, file.name);

    this.usersDataService.uploadAvatar(fd).subscribe(() => {
      this.usersDataService
        .getAvatar(this.profileOwnerId)
        .subscribe((avatarUrl) => {
          this.avatarService.emitData(avatarUrl);
        });
    });
  }
}
