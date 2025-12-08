import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://185.245.182.232:5000/api/auth';
  private tokenKey = 'jwt_token';

  constructor(private http: HttpClient, private afAuth: AngularFireAuth) {}
  async googleLogin() {
    const result = await this.afAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
    const token = await result.user?.getIdToken();
    localStorage.setItem(this.tokenKey, token || '');
    return result.user;
  }

  login(email: string, password: string): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap(res => {
        localStorage.setItem(this.tokenKey, res.token);
      })
    );
  }

  register(email: string, password: string): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/register`, { email, password });
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }
}
