import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { User } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';
import { BreakpointService } from '../../services/breakpoint.service';
import { CoreService } from '../../services/core.service';

@Component({
  selector: 'app-view-user',
  templateUrl: './view-user.component.html',
  styleUrls: ['./view-user.component.scss'],
})
export class ViewUserComponent implements OnDestroy {
  private routeSubscription: Subscription | undefined;
  private loginEventSubscription: Subscription | undefined;
  private bioModifiedSubscription: Subscription | undefined;

  userLoggedIn: boolean = false;
  user: User = {} as User;
  isHandset$ = this.breakpointService.isHandset$;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    public coreService: CoreService,
    private breakpointService: BreakpointService
  ) {
    this.routeSubscription = this.route.params
      .pipe(switchMap((params) => this.authService.getUser(params.id)))
      .subscribe((user) => {
        this.user = user;
        this.isUserLoggedIn();
      });

    this.loginEventSubscription = this.authService
      .getLoginEvent()
      .subscribe(() => {
        this.isUserLoggedIn();
      });

    this.bioModifiedSubscription = this.coreService
      .bioModified()
      .subscribe((res) => (this.user.bio = res));
  }

  private isUserLoggedIn() {
    if (this.authService.getUserId() === this.user._id)
      this.userLoggedIn = true;
    else this.userLoggedIn = false;
  }

  ngOnDestroy() {
    this.routeSubscription?.unsubscribe();
    this.loginEventSubscription?.unsubscribe();
    this.bioModifiedSubscription?.unsubscribe();
  }
}