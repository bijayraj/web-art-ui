import { HttpClient, HttpEventType } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { finalize, Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-file-upload',
  templateUrl: "file-upload.component.html",
  styleUrls: ["file-upload.component.scss"]
})
export class FileUploadComponent {

  @Input() requiredFileType!: string;
  @Output() uploadedEvent = new EventEmitter<string>();

  fileName = '';
  uploadProgress?: number;
  uploadSub!: Subscription;
  uploadedFileName = '';

  constructor(private http: HttpClient) { }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];

    if (file) {
      this.fileName = file.name;
      const formData = new FormData();
      formData.append("filename", file);

      const upload$ = this.http.post(`${environment.apiUrl}/upload`, formData, {
        reportProgress: true,
        observe: 'events'
      })
        .pipe(
          finalize(() => this.reset())
        );




      this.uploadSub = upload$.subscribe(event => {
        if (event.type == HttpEventType.UploadProgress) {
          this.uploadProgress = Math.round(100 * (event.loaded / (event.total || 0.00001)));
        }

        if (event.type == HttpEventType.Response) {
          this.uploadedFileName = (event.body as any).full_path;
          this.uploadedEvent.emit(this.uploadedFileName);
        }
      })
    }
  }

  cancelUpload() {
    this.uploadSub.unsubscribe();
    this.reset();
  }

  reset() {
    this.uploadProgress = null as any;
    this.uploadSub = null as any;
  }
}
