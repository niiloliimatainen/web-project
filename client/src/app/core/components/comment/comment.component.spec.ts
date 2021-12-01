import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { AuthService } from '../../services/auth.service';

import { CommentComponent } from './comment.component';

describe('CommentComponent', () => {
  let component: CommentComponent;
  let fixture: ComponentFixture<CommentComponent>;

  const authServiceSpy = jasmine.createSpyObj('AuthService', {
    isLoggedIn: false,
    logout: () => {
      return;
    },
    getUserId: 'id',
    getLoginEvent: of({}),
    isAdmin: false,
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CommentComponent],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        MatDialogModule,
        MatIconModule,
        MatListModule,
      ],
      providers: [{ provide: AuthService, useValue: authServiceSpy }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.comment = {
      _id: 'id',
      userId: 'id',
      username: 'testuser',
      entity: 'id',
      content: 'test comment',
      modified: '1.12.2021',
    };
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
