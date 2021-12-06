import {
  Component,
  EventEmitter,
  Inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { Comment } from '../../models/comment.model';
import { AuthService } from '../../services/auth.service';
import { CommentService } from '../../services/comment.service';
import { CoreService } from '../../services/core.service';

// This component works as a comment creator, comment editor, bio creator, and bio editor
@Component({
  selector: 'app-take-input',
  templateUrl: './take-input.component.html',
  styleUrls: ['./take-input.component.scss'],
})
export class TakeInputComponent implements OnInit, OnDestroy {
  commentAdded = new EventEmitter<Comment>();
  commentModified = new EventEmitter<Comment>();
  bioModified = new EventEmitter<string>();

  comment: Comment | undefined;
  bio: string | undefined;
  newInput: string = '';
  type: string = '';
  private entityId!: string;
  private userId!: string | null;
  private userSubscription!: Subscription;
  private commentSubscription!: Subscription;

  constructor(
    private authService: AuthService,
    private dialogRef: MatDialogRef<TakeInputComponent>,
    private coreService: CoreService,
    private commentService: CommentService,
    @Inject(MAT_DIALOG_DATA)
    public data: { editable: Comment | string; type: string; action: string }
  ) {}

  // Get data type and component mode from MAT_DIALOG_DATA
  ngOnInit() {
    this.type = this.data.type;
    if (this.data.action === 'edit') {
      if (this.data.type === 'comment') {
        this.comment = this.data.editable as Comment;
        this.newInput = this.comment.content;
      } else if (this.data.type === 'bio') {
        this.bio = this.data.editable as string;
        this.newInput = this.bio;
      }
    }
  }

  // Add new comment to entity, and emit commentAdded event
  addComment() {
    this.entityId = this.coreService.getActiveEntity()._id;
    if (this.entityId) {
      this.commentSubscription = this.commentService
        .createComment(this.newInput, this.entityId)
        .subscribe((res) => {
          if (res) {
            this.commentAdded.emit(res);
            this.dialogRef.close();
          }
        });
    }
  }

  // Update existing comment and emit commentModified event
  updateComment() {
    if (this.comment) {
      this.entityId = this.coreService.getActiveEntity()._id;
      if (this.entityId) {
        this.commentSubscription = this.commentService
          .updateComment(this.newInput, this.comment._id)
          .subscribe((res) => {
            if (res) {
              this.commentModified.emit(res);
              this.dialogRef.close();
            }
          });
      }
    }
  }

  // Set new or replace existing bio, and emit biomodified event
  setBio() {
    this.userId = this.authService.getUserId();
    if (this.userId) {
      this.userSubscription = this.authService
        .setUserBio(this.userId, this.newInput)
        .subscribe((res) => {
          if (res.success) {
            this.bioModified.emit(this.newInput);
            this.dialogRef.close();
          }
        });
    }
  }

  add() {
    if (this.data.type === 'comment') this.addComment();
    else this.setBio();
  }

  update() {
    if (this.data.type === 'comment') this.updateComment();
    else this.setBio();
  }

  ngOnDestroy() {
    this.userSubscription?.unsubscribe();
    this.commentSubscription?.unsubscribe();
  }
}
