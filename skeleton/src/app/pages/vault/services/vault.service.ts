import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Secret } from '../interfaces/secret.model';

@Injectable({
  providedIn: 'root'
})
export class VaultService {

  private apiUrl = environment.apiUrl + '/configurations';

  constructor(private http: HttpClient) { }

  getSecrets(): Observable<{ [key: string]: string }> {
    return this.http.get<{ [key: string]: string }>(`${this.apiUrl}/fetch_secret/`);
  }

  storeSecret(secret: Secret): Observable<any> {
    return this.http.post(`${this.apiUrl}/store_secret/`, {
      secret_data: {
        [secret.key]: secret.value
      }
    });
  }

  deleteSecret(key: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/remove_secret/`, { key });
  }
}
