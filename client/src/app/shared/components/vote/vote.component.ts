import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Entity } from 'src/app/core/models/entity.model';
import { AuthService } from 'src/app/core/services/auth.service';
import { CoreService } from 'src/app/core/services/core.service';
import { EntityService } from 'src/app/core/services/entity.service';

@Component({
  selector: 'app-vote',
  templateUrl: './vote.component.html',
  styleUrls: ['./vote.component.scss'],
})
export class VoteComponent implements OnInit, OnDestroy {
  @Input() entity!: Entity;

  hasLiked!: boolean;
  hasDisliked!: boolean;
  private entitySubscription: Subscription | undefined;
  private loginEventSubscription: Subscription | undefined;

  constructor(
    private coreService: CoreService,
    private authService: AuthService,
    private entityService: EntityService
  ) {}

  ngOnInit() {
    this.refreshLikes();

    this.loginEventSubscription = this.authService
      .getLoginEvent()
      .subscribe(() => {
        this.refreshLikes();
      });
  }

  vote(event: MouseEvent, liked: boolean) {
    event.stopPropagation();
    if (this.hasLiked || this.hasDisliked) return;
    else if (!this.authService.isLoggedIn())
      return this.coreService.openLogin();

    this.entitySubscription = this.entityService
      .vote(this.entity._id, liked)
      .subscribe((res) => {
        if (res.success) {
          if (liked) {
            this.hasLiked = true;
            this.entity.likes += 1;
          } else {
            this.hasDisliked = true;
            this.entity.dislikes += 1;
          }
        }
      });
  }

  private refreshLikes() {
    const userId = this.authService.getUserId();
    const liked = this.entity.likedUsers.findIndex((user) => user === userId);
    const disliked = this.entity.dislikedUsers.findIndex(
      (user) => user === userId
    );

    if (liked !== -1) this.hasLiked = true;
    else if (disliked !== -1) this.hasDisliked = true;
    else {
      this.hasLiked = false;
      this.hasDisliked = false;
    }
  }

  ngOnDestroy() {
    this.entitySubscription?.unsubscribe();
    this.loginEventSubscription?.unsubscribe();
  }
}
