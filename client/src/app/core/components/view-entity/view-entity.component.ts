import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { indicate } from 'src/app/shared/utils/indicator';
import { Entity } from '../../models/entity.model';
import { User } from '../../models/user.model';
import { Comment } from '../../models/comment.model';
import { AuthService } from '../../services/auth.service';
import { BreakpointService } from '../../services/breakpoint.service';
import { EntityService } from '../../services/entity.service';

@Component({
  selector: 'app-view-entity',
  templateUrl: './view-entity.component.html',
  styleUrls: ['./view-entity.component.scss'],
})
export class ViewEntityComponent {
  //   code: string = `openLogin() {
  //     if (this.isHandset) {
  //       this.dialogRef = this.dialog.open(LoginComponent, {
  //         width: '100%',
  //         height: '80%',
  //         maxWidth: '100%',
  //         maxHeight: '80%',
  //         panelClass: 'bottom-dialog',
  //         position: {
  //           bottom: '0',
  //           left: '0',
  //         },
  //       });
  //     } else {
  //       this.dialogRef = this.dialog.open(LoginComponent, {
  //         width: '35vw',
  //         minWidth: '300px',
  //         height: '50vh',
  //         minHeight: '500px',
  //       });
  //     }
  //   }
  // `;

  //   code2: string = `<div class="entity-container">
  //   <div class="entity-headers">
  //     <h2 class="entity-header">Testikysymys about tän pitunen liibalaaba</h2>
  //     <div class="entity-subheaders">
  //       <p>12.10.2021</p>
  //       <span class="spacer"></span>
  //       <p>Comments 8</p>
  //     </div>
  //   </div>
  //   <mat-divider></mat-divider>

  //   <p>
  //     Lorem ipsum dolor sit amet consectetur, adipisicing elit. Iusto nulla
  //     officiis velit, cumque, facere nobis nam hic dicta reprehenderit est qui
  //     omnis. Quas recusandae consectetur officia autem ratione nostrum non!
  //   </p>
  //   <div>
  //     <pre><code class="code-snippet" [highlight]="code"></code></pre>
  //   </div>
  // </div>`;

  private entitySubscription: Subscription | undefined;
  private routeSubscription: Subscription | undefined;

  isHandset$ = this.breakpointService.isHandset$;
  loading$ = new Subject<boolean>();
  entity: Entity = {} as Entity;
  user: User = {} as User;
  comments: Comment[] = [] as Comment[];

  constructor(
    private breakpointService: BreakpointService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private entityService: EntityService
  ) {
    this.routeSubscription = this.route.params.subscribe((params) => {
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
  }

  ngOnDestroy() {
    this.entitySubscription?.unsubscribe();
    this.routeSubscription?.unsubscribe();
  }
}
