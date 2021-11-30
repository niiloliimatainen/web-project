import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Result } from '../models/result.model';
import { catchError, shareReplay, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Observable, of, Subject } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly userUrl = environment.user_url;
  private readonly imageUrl = environment.image_url;
  private loginEvent = new Subject();

  private options = {
    headers: new HttpHeaders({
      'content-type': 'application/json',
      accept: 'application/json',
    }),
  };

  constructor(private http: HttpClient) {}

  register(
    email: string,
    username: string,
    password: string
  ): Observable<Result> {
    return this.http
      .post<Result>(
        `${this.userUrl}/register/`,
        { email: email, username: username, password: password },
        this.options
      )
      .pipe(
        catchError((error) => {
          return of({ success: false, status: error.status });
        })
      );
  }

  setImage(img: File, userId: string) {
    var formData = new FormData();
    formData.append('image', img);
    formData.append('userId', userId);
    return this.http.post<Result>(`${this.imageUrl}`, formData);
  }

  login(username: string, password: string): Observable<Result> {
    return this.http
      .post<Result>(
        `${this.userUrl}/login/`,
        { username: username, password: password },
        this.options
      )
      .pipe(
        tap(this.setToken),
        shareReplay(),
        catchError((error) => {
          return of({ success: false, status: error.status });
        })
      );
  }

  getUser(id: string): Observable<User> {
    return this.http.get<User>(`${this.userUrl}/${id}`, this.options);
  }

  setUserBio(id: string, content: string): Observable<Result> {
    return this.http.put<Result>(
      `${this.userUrl}/${id}/bio`,
      { content: content },
      this.options
    );
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('admin');
    this.loginEvent.next(false);
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('access_token') !== null;
  }

  isAdmin(): boolean {
    const isAdmin = localStorage.getItem('admin');
    if (isAdmin === 'true') return true;
    else return false;
  }

  getUserId(): string | null {
    return localStorage.getItem('user_id');
  }

  setLoginEvent() {
    this.loginEvent.next();
  }

  getLoginEvent(): Observable<unknown> {
    return this.loginEvent.asObservable();
  }

  private setToken(res: Result) {
    if (res.token) localStorage.setItem('access_token', res.token);
    if (res.userId) localStorage.setItem('user_id', res.userId);

    if (res.admin) localStorage.setItem('admin', 'true');
    else localStorage.setItem('admin', 'false');
  }
}
