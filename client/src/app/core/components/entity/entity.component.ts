import { Component, Input, OnInit } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { indicate } from 'src/app/shared/utils/indicator';
import { Entity } from '../../models/entity.model';
import { User } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-entity',
  templateUrl: './entity.component.html',
  styleUrls: ['./entity.component.scss'],
})
export class EntityComponent implements OnInit {
  @Input() entity!: Entity;

  loading$ = new Subject<boolean>();
  user: User = {} as User;
  private userSubscription: Subscription | undefined;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.userSubscription = this.authService
      .getUser(this.entity.user)
      .pipe(indicate(this.loading$))
      .subscribe((user) => {
        this.user = user;
      });
  }

  ngOnDestroy() {
    this.userSubscription?.unsubscribe();
  }
}
