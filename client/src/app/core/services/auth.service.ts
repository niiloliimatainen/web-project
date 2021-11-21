import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Result } from '../models/result.model';
import { catchError, shareReplay, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Observable, of } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly userUrl = environment.user_url;
  private readonly imageUrl = environment.image_url;

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

  setImage(img: File) {
    var formData = new FormData();
    formData.append('image', img);
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

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_id');
  }

  isLoggedIn() {
    return localStorage.getItem('access_token') !== null;
  }

  private setToken(res: Result) {
    if (res.token) localStorage.setItem('access_token', res.token);
    if (res.userId) localStorage.setItem('user_id', res.userId);
  }
}
