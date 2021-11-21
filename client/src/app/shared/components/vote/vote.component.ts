import { Component, Input } from '@angular/core';
import { CoreService } from 'src/app/core/services/core.service';

@Component({
  selector: 'app-vote',
  templateUrl: './vote.component.html',
  styleUrls: ['./vote.component.scss'],
})
export class VoteComponent {
  @Input() likes: number = 0;
  @Input() dislikes: number = 0;

  constructor(public coreService: CoreService) {}
}
