import { Component, OnInit } from '@angular/core';
import { UsersDataService } from '../../services/users-data.service';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css'],
})
export class FileUploadComponent implements OnInit {
  constructor(private usersDataService: UsersDataService) {}

  ngOnInit(): void {}

  onFileSelected(event) {
    const file = event.target.files[0] as File;
    const fd = new FormData();
    fd.append('file', file, file.name);
    this.usersDataService.uploadAvatar(fd).subscribe((res) => console.log(res));
  }
}
