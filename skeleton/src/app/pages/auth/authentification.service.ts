import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

export const JWT_NAME = 'token';

@Injectable({
  providedIn: 'root'
})
export class AuthentificationService {
  public jwtHelper: JwtHelperService = new JwtHelperService();
  constructor(private http: HttpClient) { }

  login(username: string, password: string) {
    return this.http.post<any>(`${environment.apiUrl}/auth/token/`, { username, password }).pipe(
      map((data) => {
        this.storeToken(data.access);
        this.storeUsername(data.username);
        return data;
      })
    );
  }

  logout() {
    this.removeToken();
    this.removeUsername();
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return token ? !this.jwtHelper.isTokenExpired(token) : false;
  }

  private storeToken(token: string): void {
    localStorage.setItem(JWT_NAME, token);
  }

  private getToken(): string | null {
    return localStorage.getItem(JWT_NAME);
  }

  private removeToken(): void {
    localStorage.removeItem(JWT_NAME);
  }

  private storeUsername(username: string): void {
    localStorage.setItem('username', username);
  }

  private getUsername(): string | null {
    return localStorage.getItem('username');
  }

  private removeUsername(): void {
    localStorage.removeItem('username');
  }
}
