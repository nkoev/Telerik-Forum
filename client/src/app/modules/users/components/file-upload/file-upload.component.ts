import { Component, OnInit } from '@angular/core';
import { UsersDataService } from '../../services/users-data.service';
import { SafeUrl } from '@angular/platform-browser';
import { FilesService } from 'src/app/shared/services/files.service';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css'],
})
export class FileUploadComponent implements OnInit {
  public avatar: SafeUrl;
  public imageLoading: boolean;

  constructor(
    private usersDataService: UsersDataService,
    private filesService: FilesService
  ) {}

  ngOnInit(): void {}

  onFileSelected(event) {
    const file = event.target.files[0];
    const fd = new FormData();
    fd.append('file', file, file.name);

    this.usersDataService.uploadAvatar(fd).subscribe((res: any) => {
      this.filesService.toDataUrl(res, this);
    });
  }
}
