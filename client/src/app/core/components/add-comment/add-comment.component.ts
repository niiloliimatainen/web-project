import { Component, EventEmitter } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { Comment } from '../../models/comment.model';
import { CoreService } from '../../services/core.service';
import { EntityService } from '../../services/entity.service';

@Component({
  selector: 'app-add-comment',
  templateUrl: './add-comment.component.html',
  styleUrls: ['./add-comment.component.scss'],
})
export class AddCommentComponent {
  commentAdded = new EventEmitter<Comment>();
  newComment: string = '';
  private entityId!: string;
  private entitySubscription!: Subscription;
  constructor(
    private entityService: EntityService,
    private dialogRef: MatDialogRef<AddCommentComponent>,
    private coreService: CoreService
  ) {}

  addComment() {
    this.entityId = this.coreService.getActiveEntity();
    if (this.entityId) {
      this.entitySubscription = this.entityService
        .createComment(this.newComment, this.entityId)
        .subscribe((res) => {
          if (res) {
            this.commentAdded.emit(res);
            this.dialogRef.close();
          }
        });
    }
  }

  ngOnDestroy() {
    this.entitySubscription?.unsubscribe();
  }
}
