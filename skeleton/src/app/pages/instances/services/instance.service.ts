import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Instance } from '../interfaces/instance.model';

@Injectable({
  providedIn: 'root'
})
export class InstanceService {

  private apiUrl = environment.apiUrl + '/instances/';

  constructor(private http: HttpClient) { }

  createInstance(instance: Instance): Observable<Instance> {
    return this.http.post<Instance>(this.apiUrl, instance);
  }

  getInstances(provider?: string): Observable<any> {
    let url = this.apiUrl;
    if (provider) {
      url += `?provider=${provider}`;
    }
    return this.http.get(url);
  }

  startInstance(instance: any): Observable<any> {
    return this.http.post(`${this.apiUrl}start/`, { instance });
  }

  stopInstance(instance: any): Observable<any> {
    return this.http.post(`${this.apiUrl}stop/`, { instance });
  }

  restartInstance(instance: any): Observable<any> {
    return this.http.post(`${this.apiUrl}restart/`, { instance });
  }

  terminateInstance(instance: any): Observable<any> {
    return this.http.post(`${this.apiUrl}terminate/`, { instance });
  }
}
