import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Cluster } from '../interfaces/cluster.model';

@Injectable({
  providedIn: 'root'
})
export class ClustersService {

  private apiUrl = environment.apiUrl + '/docker';

  constructor(private http: HttpClient) { }

  getAllClusters(): Observable<Cluster[]> {
    return this.http.get<Cluster[]>(`${this.apiUrl}/clusters/`);
  }

  // deleteObject(provider: string, bucketName: string, objectName: string): Observable < any > {
  //   return this.http.post<any>(`${this.apiUrl}/delete-object/`, { provider, bucket_name: bucketName, object_name: objectName });
  // }
  createCluster(provider: string, image: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/cluster/deploy/`, {
      provider,
      image,
    });
  }
  deleteCluster(clusterName: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/clusters/${clusterName}/delete/`);
  }

  drainNode(clusterName: string, nodeName: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/clusters/node/drain/`, {
      cluster_name: clusterName,
      node_name: nodeName
    });
  }

  cordonNode(clusterName: string, nodeName: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/clusters/node/cordon/`, {
      cluster_name: clusterName,
      node_name: nodeName
    });
  }

  uncordonNode(clusterName: string, nodeName: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/clusters/node/uncordon/`, {
      cluster_name: clusterName,
      node_name: nodeName
    });
  }
}
