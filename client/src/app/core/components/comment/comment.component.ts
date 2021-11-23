import { Component, Input } from '@angular/core';
import { Comment } from '../../models/comment.model';
import { CoreService } from '../../services/core.service';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss'],
})
export class CommentComponent {
  @Input() comment!: Comment;

  constructor(public coreService: CoreService) {}
}
