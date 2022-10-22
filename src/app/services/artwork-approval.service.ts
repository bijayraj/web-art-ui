import { HttpClient } from '@angular/common/http';
import { Injectable, SkipSelf } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ArtworkApprovalService {

  constructor(
    private router: Router,
    private http: HttpClient
  ) { }


  get(id: number) {
    return this.http.get<any>(`${environment.apiUrl}/artwork-approval/${id}`);
  }

  requestApproval(artworkId: number) {
    return this.http.post<any>(`${environment.apiUrl}/artwork-approval`, { ArtworkId: artworkId })
      .pipe(map(exhibit => exhibit));
  }

  getResolved() {
    return this.http.get<any>(`${environment.apiUrl}/artwork-approval/byresolution/1`);
  }

  getUnresolved() {
    return this.http.get<any>(`${environment.apiUrl}/artwork-approval/byresolution/0`);
  }

  getByArtworkId(id: number) {
    return this.http.get<any>(`${environment.apiUrl}/artwork-approval/artwork/${id}`);
  }

  approveReject(id: number, reject: boolean, comment: string) {
    let rejectId = 0;
    if (reject) {
      rejectId = 1;
    }
    return this.http.post<any>(`${environment.apiUrl}/artwork-approval/approve/${id}/${rejectId}`, { comment: comment })
      .pipe(map(exhibit => exhibit));

    // /approve/: id /: reject
  }

}
