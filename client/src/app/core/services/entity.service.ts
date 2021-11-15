import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Entity } from '../models/entity.model';
import { Comment } from '../models/comment.model';

@Injectable({
  providedIn: 'root',
})
export class EntityService {
  private readonly entityUrl = environment.entity_url;
  private options = {
    headers: new HttpHeaders({
      'content-type': 'application/json',
      accept: 'application/json',
    }),
  };

  constructor(private http: HttpClient) {}

  getEntities(): Observable<Entity[]> {
    return this.http.get<Entity[]>(`${this.entityUrl}/entities`, this.options);
  }

  getEntity(id: string): Observable<Entity> {
    return this.http.get<Entity>(`${this.entityUrl}/${id}`, this.options);
  }

  createEntity(entity: Entity): Observable<Entity[]> {
    return this.http.post<Entity[]>(`${this.entityUrl}`, entity, this.options);
  }

  getComments(id: string): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.entityUrl}/comments`, this.options);
  }

  createComment(comment: Comment): Observable<Comment> {
    return this.http.post<Comment>(
      `${this.entityUrl}/comment`,
      comment,
      this.options
    );
  }
}
