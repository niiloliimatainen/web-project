import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Comment } from '../models/comment.model';
import { Result } from '../models/result.model';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  private readonly commentUrl = environment.comment_url;
  private options = {
    headers: new HttpHeaders({
      'content-type': 'application/json',
      accept: 'application/json',
    }),
  };

  constructor(private http: HttpClient) {}

  getComments(id: string): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.commentUrl}/${id}`, this.options);
  }

  createComment(content: string, entityId: string): Observable<Comment> {
    return this.http.post<Comment>(
      `${this.commentUrl}/${entityId}`,
      { content: content },
      this.options
    );
  }

  updateComment(content: string, commentId: string): Observable<Comment> {
    return this.http.put<Comment>(
      `${this.commentUrl}/update/${commentId}`,
      { content: content },
      this.options
    );
  }

  deleteComment(id: string): Observable<Result> {
    return this.http.delete<Result>(
      `${this.commentUrl}/delete/${id}`,
      this.options
    );
  }
}
