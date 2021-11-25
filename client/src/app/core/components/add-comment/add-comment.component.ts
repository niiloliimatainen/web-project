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
import { CommentService } from '../../services/comment.service';
import { CoreService } from '../../services/core.service';
import { EntityService } from '../../services/entity.service';

@Component({
  selector: 'app-add-comment',
  templateUrl: './add-comment.component.html',
  styleUrls: ['./add-comment.component.scss'],
})
export class AddCommentComponent implements OnInit, OnDestroy {
  commentAdded = new EventEmitter<Comment>();
  commentModified = new EventEmitter<Comment>();

  newComment: string = '';
  private entityId!: string;
  private entitySubscription!: Subscription;
  private commentSubscription!: Subscription;

  constructor(
    private entityService: EntityService,
    private dialogRef: MatDialogRef<AddCommentComponent>,
    private coreService: CoreService,
    private commentService: CommentService,
    @Inject(MAT_DIALOG_DATA) public editableComment: Comment | null
  ) {}

  ngOnInit() {
    if (this.editableComment) this.newComment = this.editableComment.content;
  }

  addComment() {
    this.entityId = this.coreService.getActiveEntity()._id;
    if (this.entityId) {
      this.commentSubscription = this.commentService
        .createComment(this.newComment, this.entityId)
        .subscribe((res) => {
          if (res) {
            this.commentAdded.emit(res);
            this.dialogRef.close();
          }
        });
    }
  }

  updateComment() {
    if (this.editableComment) {
      this.entityId = this.coreService.getActiveEntity()._id;
      if (this.entityId) {
        this.commentSubscription = this.commentService
          .updateComment(this.newComment, this.editableComment._id)
          .subscribe((res) => {
            if (res) {
              this.commentModified.emit(res);
              this.dialogRef.close();
            }
          });
      }
    }
  }

  ngOnDestroy() {
    this.entitySubscription?.unsubscribe();
    this.commentSubscription?.unsubscribe();
  }
}
