import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Comment } from 'src/app/core/models/comment.model';
import { Entity } from 'src/app/core/models/entity.model';
import { BreakpointService } from 'src/app/core/services/breakpoint.service';
import { CommentService } from 'src/app/core/services/comment.service';
import { CoreService } from 'src/app/core/services/core.service';
import { EntityService } from 'src/app/core/services/entity.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-tool-menu',
  templateUrl: './tool-menu.component.html',
  styleUrls: ['./tool-menu.component.scss'],
})
export class ToolMenuComponent {
  @Input() entity: Entity | undefined;
  @Input() comment: Comment | undefined;

  @Output() deletedComment = new EventEmitter<Comment>();

  isHandset$ = this.breakpointService.isHandset$;

  constructor(
    private coreService: CoreService,
    private entityService: EntityService,
    private commentService: CommentService,
    private router: Router,
    private dialog: MatDialog,
    private breakpointService: BreakpointService
  ) {}

  edit() {
    if (this.entity) {
      this.coreService.openCreateEntity(true);
    } else if (this.comment) {
      this.coreService.openTakeInput(this.comment, 'comment', 'edit');
    }
  }

  // Delete comment or entity. If entity is deleted, navigate back to front page, if comment is deleted, emit deletedComment event to the parent component
  delete() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent);
    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        if (this.entity) {
          this.entityService.deleteEntity(this.entity._id).subscribe((res) => {
            if (res.success) this.router.navigate(['/']);
          });
        } else if (this.comment) {
          this.commentService
            .deleteComment(this.comment._id)
            .subscribe((res) => {
              if (res.success) this.deletedComment.emit(this.comment);
            });
        }
      }
    });
  }
}
