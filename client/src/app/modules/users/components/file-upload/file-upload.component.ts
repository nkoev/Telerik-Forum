import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { UsersDataService } from '../../services/users-data.service';
import { SafeUrl } from '@angular/platform-browser';
import { FileUploadService } from './file-upload.service';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css'],
})
export class FileUploadComponent implements OnInit {
  @Output()
  public avatarUploaded = new EventEmitter<SafeUrl>();
  @Input()
  public profileOwnerId: string;

  constructor(
    private usersDataService: UsersDataService,
    private fileUploadService: FileUploadService
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
          this.avatarUploaded.emit(avatarUrl);
          this.fileUploadService.emitData(avatarUrl);
        });
    });
  }
}
