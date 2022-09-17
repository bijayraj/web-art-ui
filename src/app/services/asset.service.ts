import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ArtworkAsset } from '../models/artworkAsset';

@Injectable({
  providedIn: 'root'
})
export class AssetService {

  url = `${environment.apiUrl}/artwork-asset`;

  constructor(private router: Router,
    private http: HttpClient) { }




  uploadImage(blobData: any, name: string, ext: string, artworkId: number) {
    const formData = new FormData();
    formData.append('file', blobData, `myimage.${ext}`);
    formData.append('name', name);
    formData.append('artworkId', artworkId.toString());

    let url = `${environment.apiUrl}/artwork-asset`;

    return this.http.post(`${url}/image`, formData);
  }



  getImages(id = 1) {
    return this.http.get<ArtworkAsset[]>(`${this.url}/artwork/${id}`);
  }


  uploadImageFile(file: File) {
    const ext = file.name.split('.').pop();
    const formData = new FormData();
    formData.append('file', file, `myimage.${ext}`);
    formData.append('name', file.name);
    return this.http.post(`${this.url}/image`, formData);
  }

  deleteImage(id: number) {
    return this.http.delete(`${this.url}/artwork-asset/${id}`);
  }

  create(userData: any) {
    return this.http.post<any>(`${environment.apiUrl}/artwork-asset`, userData)
      .pipe(map(exhibit => exhibit));
  }

  edit(userData: any, id: number) {
    return this.http.put<any>(`${environment.apiUrl}/artwork-asset/${id}`, userData)
      .pipe(map(exhibit => exhibit));
  }

}
