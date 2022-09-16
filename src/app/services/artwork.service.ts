import { HttpClient } from '@angular/common/http';
import { Injectable, SkipSelf } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ArtworkService {
  constructor(
    private router: Router,
    private http: HttpClient
  ) { }


  get(id: number) {
    return this.http.get<any>(`${environment.apiUrl}/artwork/${id}`);
  }

  create(userData:any) {
    return this.http.post<any>(`${environment.apiUrl}/artwork`, userData)
      .pipe(map(exhibit => exhibit));
  }

  getAll() {
    return this.http.get<any>(`${environment.apiUrl}/artwork`);
  }


  getAssets(id: number) {
    return this.http.get<any>(`${environment.apiUrl}/artwork-asset/artwork/${id}`);
  }

  delete(id:number){
    return this.http.delete<any>(`${environment.apiUrl}/artwork/${id}`);
  }


}
