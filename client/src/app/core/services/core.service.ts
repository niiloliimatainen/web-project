import { Injectable, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable, Subject, Subscription } from 'rxjs';
import { AddCommentComponent } from '../components/add-comment/add-comment.component';
import { LoginRegistrationComponent } from '../components/login-registration/login-registration.component';
import { Comment } from '../models/comment.model';
import { AuthService } from './auth.service';
import { BreakpointService } from './breakpoint.service';
import { Location } from '@angular/common';
import { Entity } from '../models/entity.model';

@Injectable({
  providedIn: 'root',
})
export class CoreService implements OnDestroy {
  private breakpointSubscription: Subscription;
  private loginDialogRef: MatDialogRef<LoginRegistrationComponent> | undefined;
  private commentDialogRef: MatDialogRef<AddCommentComponent> | undefined;
  private isHandset: boolean = false;
  private activeEntity: Entity = {} as Entity;
  private newComment = new Subject<Comment>();
  private modifiedComment = new Subject<Comment>();

  constructor(
    private dialog: MatDialog,
    private authService: AuthService,
    private breakpointService: BreakpointService,
    private router: Router,
    private location: Location
  ) {
    this.breakpointSubscription = this.breakpointService.isHandset$.subscribe(
      (isHandsetPortrait) => {
        this.isHandset = isHandsetPortrait;
        this.loginDialogRef?.close();
        this.commentDialogRef?.close();
      }
    );
  }

  openCreateEntity(editMode: boolean) {
    if (!this.authService.isLoggedIn()) return this.openLogin();
    if (editMode) this.router.navigate(['/edit']);
    else this.router.navigate(['/create']);
  }

  openAddComment(comment: Comment | null) {
    if (!this.authService.isLoggedIn()) return this.openLogin();

    if (this.isHandset) {
      this.commentDialogRef = this.dialog.open(AddCommentComponent, {
        width: '80%',
        maxWidth: '80%',
        data: comment,
      });
    } else {
      this.commentDialogRef = this.dialog.open(AddCommentComponent, {
        width: '480px',
        maxWidth: '480px',
        data: comment,
      });
    }

    const newCommentSub =
      this.commentDialogRef.componentInstance.commentAdded.subscribe((res) =>
        this.newComment.next(res)
      );

    const commentModifiedSub =
      this.commentDialogRef.componentInstance.commentModified.subscribe((res) =>
        this.modifiedComment.next(res)
      );

    this.commentDialogRef.afterClosed().subscribe(() => {
      newCommentSub.unsubscribe();
      commentModifiedSub.unsubscribe();
    });
  }

  openLogin() {
    if (this.isHandset) {
      this.loginDialogRef = this.dialog.open(LoginRegistrationComponent, {
        width: '100%',
        height: '80%',
        maxWidth: '100%',
        maxHeight: '80%',
        panelClass: 'bottom-dialog',
        position: {
          bottom: '0',
          left: '0',
        },
      });
    } else {
      this.loginDialogRef = this.dialog.open(LoginRegistrationComponent, {
        width: '370px',
        minWidth: '300px',
        height: '600px',
        minHeight: '600px',
      });
    }
  }

  setActiveEntity(entity: Entity) {
    this.activeEntity = entity;
  }

  getActiveEntity(): Entity {
    return this.activeEntity;
  }

  commentAdded(): Observable<Comment> {
    return this.newComment.asObservable();
  }

  commentModified(): Observable<Comment> {
    return this.modifiedComment.asObservable();
  }

  getUserImage(userId: string | null): string {
    if (userId) return `http://localhost:1234/api/image/${userId}`;
    else return '';
  }

  navigateBack() {
    this.location.back();
  }

  ngOnDestroy(): void {
    this.breakpointSubscription.unsubscribe();
  }
}
