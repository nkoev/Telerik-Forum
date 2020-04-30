import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Injectable } from '@angular/core';

@Injectable()
export class FilesService {
  constructor(private sanitizer: DomSanitizer) {}

  toDataUrl(buffer, comp) {
    const reader = new FileReader();
    const blob = new Blob([new Uint8Array(buffer.data)]);
    reader.readAsDataURL(blob);

    reader.onload = () => {
      comp.avatar = this.sanitizer.bypassSecurityTrustUrl(
        reader.result as string
      );
    };
  }
}
