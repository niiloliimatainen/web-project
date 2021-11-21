import { Component } from '@angular/core';
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

@Component({
  selector: 'app-view-entity',
  templateUrl: './view-entity.component.html',
  styleUrls: ['./view-entity.component.scss'],
})
export class ViewEntityComponent {
  private entitySubscription: Subscription | undefined;
  private routeSubscription: Subscription | undefined;
  private commentSubscription: Subscription | undefined;

  isHandset$ = this.breakpointService.isHandset$;
  loading$ = new Subject<boolean>();
  entity: Entity = {} as Entity;
  user: User = {} as User;
  comments: Comment[] = [] as Comment[];

  constructor(
    private breakpointService: BreakpointService,
    private route: ActivatedRoute,
    private entityService: EntityService,
    public coreService: CoreService
  ) {
    this.routeSubscription = this.route.params.subscribe((params) => {
      this.coreService.setActiveEntity(params.id);
      this.entitySubscription = this.entityService
        .getEntity(params.id)
        .pipe(
          indicate(this.loading$),
          switchMap((ent) => {
            this.entity = ent;
            return this.entityService.getComments(ent._id);
          })
        )
        .subscribe((comments) => {
          this.comments.push(...comments);
        });
    });

    this.commentSubscription = this.coreService
      .commentAdded()
      .subscribe((res) => this.comments.push(res));
  }

  updateComments(newComment: Comment) {
    this.comments.push(newComment);
  }

  ngOnDestroy() {
    this.entitySubscription?.unsubscribe();
    this.routeSubscription?.unsubscribe();
    this.commentSubscription?.unsubscribe();
  }
}
