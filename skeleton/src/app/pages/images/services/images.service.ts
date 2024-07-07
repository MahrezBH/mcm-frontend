import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ImagesService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getDockerImages(continuationToken?: string): Observable<any> {
    let params = new HttpParams();
    if (continuationToken) {
      params = params.append('continuationToken', continuationToken);
    }
    return this.http.get<any>(`${this.apiUrl}/configurations/components/`, { params });
  }


  instantiateDockerImage(provider: string, image: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/docker/deploy/`, {
      provider,
      image
    });
  }
}
