import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { indicate } from 'src/app/shared/utils/indicator';
import { Entity } from '../../models/entity.model';
import { User } from '../../models/user.model';
import { Comment } from '../../models/comment.model';
import { BreakpointService } from '../../services/breakpoint.service';
import { EntityService } from '../../services/entity.service';
import { CoreService } from '../../services/core.service';
import { AuthService } from '../../services/auth.service';
import { CommentService } from '../../services/comment.service';

@Component({
  selector: 'app-view-entity',
  templateUrl: './view-entity.component.html',
  styleUrls: ['./view-entity.component.scss'],
})
export class ViewEntityComponent implements OnDestroy {
  private entitySubscription: Subscription | undefined;
  private routeSubscription: Subscription | undefined;
  private newCommentSubscription: Subscription | undefined;
  private commentModifiedSubscription: Subscription | undefined;
  private loginEventSubscription: Subscription | undefined;

  createdByUser: boolean = false;
  isHandset$ = this.breakpointService.isHandset$;
  loading$ = new Subject<boolean>();
  entity: Entity = {} as Entity;
  user: User = {} as User;
  comments: Comment[] = [] as Comment[];

  constructor(
    private breakpointService: BreakpointService,
    private route: ActivatedRoute,
    private entityService: EntityService,
    public coreService: CoreService,
    public authService: AuthService,
    private commentService: CommentService
  ) {
    // Subscribe to loginEvent observable and update user if changes occur
    this.loginEventSubscription = this.authService
      .getLoginEvent()
      .subscribe(() => {
        this.updateUser();
      });

    // Get entityId from url. After that, get entity by its id and use switchMap to get all the comments for the entity.
    // SwitchMap changes the entity request observable to comment request observable after the first request is done, so only one subscribe is needed.
    // Update also the active entity to the coreService
    this.routeSubscription = this.route.params.subscribe((params) => {
      this.entitySubscription = this.entityService
        .getEntity(params.id)
        .pipe(
          indicate(this.loading$),
          switchMap((ent) => {
            this.entity = ent;
            this.coreService.setActiveEntity(ent);
            this.updateUser();
            return this.commentService.getComments(ent._id);
          })
        )
        .subscribe((comments) => {
          this.comments.push(...comments);
        });
    });

    // Get new comments from newComment observable
    this.newCommentSubscription = this.coreService
      .commentAdded()
      .subscribe((res) => this.comments.push(res));

    // Get modified comments from modifiedComment observable
    this.commentModifiedSubscription = this.coreService
      .commentModified()
      .subscribe((res) => this.updateComments(res, false));
  }

  // If comment is modified, replace old comment with the modified comment. If comment is deleted, remove the comment
  updateComments(modifiedComment: Comment, deleted: boolean) {
    const index = this.comments.findIndex(
      (comment) => comment._id === modifiedComment._id
    );
    if (index !== -1) {
      if (deleted) this.comments.splice(index, 1);
      else this.comments[index] = modifiedComment;
    }
  }

  // Update createdByUser flag
  private updateUser() {
    if (this.authService.getUserId() === this.entity.userId) {
      this.createdByUser = true;
    } else {
      this.createdByUser = false;
    }
  }

  ngOnDestroy() {
    this.entitySubscription?.unsubscribe();
    this.routeSubscription?.unsubscribe();
    this.newCommentSubscription?.unsubscribe();
    this.loginEventSubscription?.unsubscribe();
    this.commentModifiedSubscription?.unsubscribe();
  }
}
