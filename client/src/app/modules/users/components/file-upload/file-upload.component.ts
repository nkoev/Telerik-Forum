import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { UsersDataService } from '../../services/users-data.service';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css'],
})
export class FileUploadComponent implements OnInit {
  @Output()
  public avatarLoaded = new EventEmitter<SafeUrl>();
  public avatar: SafeUrl;

  constructor(
    private usersDataService: UsersDataService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {}

  onFileSelected(event) {
    const file = event.target.files[0];
    const fd = new FormData();
    fd.append('file', file, file.name);

    this.usersDataService.uploadAvatar(fd).subscribe((res) => {
      this.toDataUrl(res);
    });
  }

  private toDataUrl(buffer) {
    const reader = new FileReader();
    const blob = new Blob([new Uint8Array(buffer.data)]);
    reader.readAsDataURL(blob);

    reader.onload = () => {
      this.avatarLoaded.emit(
        this.sanitizer.bypassSecurityTrustUrl(reader.result as string)
      );
    };
  }
}
