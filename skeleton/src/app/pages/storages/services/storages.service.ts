import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StoragesService {

  private apiUrl = environment.apiUrl + '/objects';

  constructor(private http: HttpClient) { }

  getAllObjects(providers: string = 'aws,azure,gcp'): Observable<any> {
    return this.http.get(`${this.apiUrl}/?providers=${providers}`);
  }

  deleteObject(provider: string, bucketName: string, objectName: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/delete-object/`, { provider, bucket_name: bucketName, object_name: objectName });
  }
  generatePresignedUrl(provider: string, bucket_name: string, object_name: string, expiration: number = 3600): Observable<any> {
    return this.http.post(`${this.apiUrl}/generate-presigned-url/`, {
      provider,
      bucket_name,
      object_name,
      expiration
    });
  }

  uploadFile(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/upload-file/`, formData);
  }
}
