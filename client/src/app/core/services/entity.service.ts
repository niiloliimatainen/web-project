import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Entity } from '../models/entity.model';
import { Result } from '../models/result.model';

@Injectable({
  providedIn: 'root',
})
// Service that handles all the endpoints related to entities
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

  createEntity(
    title: string,
    textContent: string,
    codeSnippet: string
  ): Observable<Result> {
    return this.http.post<Result>(
      `${this.entityUrl}`,
      { title: title, content: textContent, codeSnippet: codeSnippet },
      this.options
    );
  }

  vote(id: string, liked: boolean) {
    const body = { id: id, like: false, dislike: false };
    if (liked) body.like = true;
    else body.dislike = true;

    return this.http.post<Result>(`${this.entityUrl}/vote`, body, this.options);
  }

  updateEntity(entity: Entity): Observable<Result> {
    return this.http.put<Result>(
      `${this.entityUrl}/update/${entity._id}`,
      entity,
      this.options
    );
  }

  deleteEntity(id: string): Observable<Result> {
    return this.http.delete<Result>(
      `${this.entityUrl}/delete/${id}`,
      this.options
    );
  }
}
