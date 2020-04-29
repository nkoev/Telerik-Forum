import { Component, OnInit } from '@angular/core';
import { UsersDataService } from '../../services/users-data.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css'],
})
export class FileUploadComponent implements OnInit {
  public avatar: any;
  public imageLoading: boolean;

  constructor(
    private usersDataService: UsersDataService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {}

  onFileSelected(event) {
    const file = event.target.files[0];
    const fd = new FormData();
    fd.append('file', file, file.name);

    this.usersDataService.uploadAvatar(fd).subscribe((res: any) => {
      const reader = new FileReader();
      const blob = new Blob([new Uint8Array(res.data)]);

      reader.readAsDataURL(blob);
      reader.onload = () => {
        this.avatar = this.sanitizer.bypassSecurityTrustUrl(
          reader.result as string
        );
      };
    });
  }
}
