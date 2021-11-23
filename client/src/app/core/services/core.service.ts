import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable, Subject, Subscription } from 'rxjs';
import { AddCommentComponent } from '../components/add-comment/add-comment.component';
import { LoginComponent } from '../components/login/login.component';
import { Comment } from '../models/comment.model';
import { AuthService } from './auth.service';
import { BreakpointService } from './breakpoint.service';
import { EntityService } from './entity.service';

@Injectable({
  providedIn: 'root',
})
export class CoreService {
  private breakpointSubscription: Subscription;
  private loginDialogRef: MatDialogRef<LoginComponent> | undefined;
  private commentDialogRef: MatDialogRef<AddCommentComponent> | undefined;
  private isHandset: boolean = false;
  private activeEntity: string = '';
  private newComment = new Subject<Comment>();

  constructor(
    private entityService: EntityService,
    private dialog: MatDialog,
    private authService: AuthService,
    private breakpointService: BreakpointService,
    private router: Router
  ) {
    this.breakpointSubscription = this.breakpointService.isHandset$.subscribe(
      (isHandsetPortrait) => {
        this.isHandset = isHandsetPortrait;
        this.loginDialogRef?.close();
        this.commentDialogRef?.close();
      }
    );
  }

  openCreateEntity() {
    if (!this.authService.isLoggedIn()) this.openLogin();
    else this.router.navigate(['/create']);
  }

  openAddComment() {
    if (!this.authService.isLoggedIn()) return this.openLogin();

    if (this.isHandset) {
      this.commentDialogRef = this.dialog.open(AddCommentComponent, {
        width: '80%',
        maxWidth: '80%',
      });
    } else {
      this.commentDialogRef = this.dialog.open(AddCommentComponent, {
        width: '50%',
        maxWidth: '480px',
      });
    }

    const dialogSub =
      this.commentDialogRef.componentInstance.commentAdded.subscribe((res) =>
        this.newComment.next(res)
      );
    this.commentDialogRef
      .afterClosed()
      .subscribe(() => dialogSub.unsubscribe());
  }

  openLogin() {
    if (this.isHandset) {
      this.loginDialogRef = this.dialog.open(LoginComponent, {
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
      this.loginDialogRef = this.dialog.open(LoginComponent, {
        width: '35vw',
        minWidth: '300px',
        height: '60vh',
        minHeight: '600px',
      });
    }
  }

  voteUp(event: MouseEvent) {
    event.stopPropagation();
    if (!this.authService.isLoggedIn()) return this.openLogin();

    console.log('later');
  }

  voteDown(event: MouseEvent) {
    event.stopPropagation();
    if (!this.authService.isLoggedIn()) return this.openLogin();

    console.log('later');
  }

  setActiveEntity(id: string) {
    this.activeEntity = id;
  }

  getActiveEntity(): string {
    return this.activeEntity;
  }

  commentAdded(): Observable<Comment> {
    return this.newComment.asObservable();
  }

  getUserImage(userId: string | null): string {
    if (userId) return `http://localhost:1234/api/image/${userId}`;
    else return '';
  }

  ngOnDestroy(): void {
    this.breakpointSubscription.unsubscribe();
  }
}
