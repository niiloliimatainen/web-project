import { Injectable, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable, Subject, Subscription } from 'rxjs';
import { TakeInputComponent } from '../components/take-input/take-input.component';
import { LoginRegistrationComponent } from '../components/login-registration/login-registration.component';
import { Comment } from '../models/comment.model';
import { AuthService } from './auth.service';
import { BreakpointService } from './breakpoint.service';
import { Location } from '@angular/common';
import { Entity } from '../models/entity.model';

@Injectable({
  providedIn: 'root',
})

// This service is used to handle all the core actions that are needed in multiple components
export class CoreService implements OnDestroy {
  private breakpointSubscription: Subscription;
  private loginDialogRef: MatDialogRef<LoginRegistrationComponent> | undefined;
  private commentDialogRef: MatDialogRef<TakeInputComponent> | undefined;
  private isHandset: boolean = false;
  private activeEntity: Entity = {} as Entity;
  private newComment = new Subject<Comment>();
  private modifiedComment = new Subject<Comment>();
  private modifiedBio = new Subject<string>();

  constructor(
    private dialog: MatDialog,
    private authService: AuthService,
    private breakpointService: BreakpointService,
    private router: Router,
    private location: Location
  ) {
    // Subscribe to isHandset observable. If breakpoint changes, close dialogs that a have different structure in desktop or mobile views
    this.breakpointSubscription = this.breakpointService.isHandset$.subscribe(
      (isHandsetPortrait) => {
        this.isHandset = isHandsetPortrait;
        this.loginDialogRef?.close();
        this.commentDialogRef?.close();
      }
    );
  }

  // Navigate to create entity view. URL determines on which mode the component will be
  openCreateEntity(editMode: boolean) {
    if (!this.authService.isLoggedIn()) return this.openLogin();
    if (editMode) this.router.navigate(['/edit']);
    else this.router.navigate(['/create']);
  }

  // Open takeInput dialog and inject data to it. Dialog has different size on mobile view
  openTakeInput(editable: Comment | string, type: string, action: string) {
    if (!this.authService.isLoggedIn()) return this.openLogin();

    if (this.isHandset) {
      this.commentDialogRef = this.dialog.open(TakeInputComponent, {
        width: '80%',
        maxWidth: '80%',
        data: { editable: editable, type: type, action: action },
      });
    } else {
      this.commentDialogRef = this.dialog.open(TakeInputComponent, {
        width: '480px',
        maxWidth: '480px',
        data: { editable: editable, type: type, action: action },
      });
    }

    // Subscribe to events that occur in takeInput dialog and emit them forward
    const newCommentSub =
      this.commentDialogRef.componentInstance.commentAdded.subscribe((res) =>
        this.newComment.next(res)
      );

    const commentModifiedSub =
      this.commentDialogRef.componentInstance.commentModified.subscribe((res) =>
        this.modifiedComment.next(res)
      );

    const bioModifiedSub =
      this.commentDialogRef.componentInstance.bioModified.subscribe((res) =>
        this.modifiedBio.next(res)
      );

    this.commentDialogRef.afterClosed().subscribe(() => {
      newCommentSub.unsubscribe();
      commentModifiedSub.unsubscribe();
      bioModifiedSub.unsubscribe();
    });
  }

  // Open login/registration component. In mobile views it comes from the bottom and takes 80% of the screen. In other screen sizes it is a static normal dialog
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

  bioModified(): Observable<string> {
    return this.modifiedBio.asObservable();
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
