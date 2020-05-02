import { Component, OnInit, Input } from '@angular/core';
import { AvatarService } from '../../../core/services/avatar.service';
import { SafeUrl } from '@angular/platform-browser';
import { NotificatorService } from 'src/app/modules/core/services/notificator.service';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css'],
})
export class FileUploadComponent implements OnInit {
  @Input()
  public profileOwnerId: string;
  public avatar: string | SafeUrl;

  constructor(
    private avatarService: AvatarService,
    private notificator: NotificatorService
  ) {}

  ngOnInit(): void {}

  onFileSelected(event: any) {
    const file = event.target.files[0];
    const fd = new FormData();
    fd.append('file', file, file.name);

    this.avatarService
      .uploadAvatar(fd)
      .subscribe(() => this.notificator.success('Image uploaded'));
  }
}
