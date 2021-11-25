import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { Comment } from '../../models/comment.model';
import { AuthService } from '../../services/auth.service';
import { CoreService } from '../../services/core.service';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss'],
})
export class CommentComponent implements OnInit, OnDestroy {
  @Input() comment!: Comment;

  @Output() deletedComment = new EventEmitter<Comment>();

  createdByUser: boolean = false;
  private loginEventSubscription: Subscription | undefined;

  constructor(
    public coreService: CoreService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.updateUser();
    this.loginEventSubscription = this.authService
      .getLoginEvent()
      .subscribe(() => {
        this.updateUser();
      });
  }

  private updateUser() {
    if (this.authService.getUserId() === this.comment.userId) {
      this.createdByUser = true;
    } else {
      this.createdByUser = false;
    }
  }

  ngOnDestroy() {
    this.loginEventSubscription?.unsubscribe();
  }
}
