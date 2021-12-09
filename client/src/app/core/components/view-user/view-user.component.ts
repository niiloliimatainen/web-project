import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { indicate } from 'src/app/shared/utils/indicator';
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
  private userSubscription: Subscription | undefined;

  userLoggedIn: boolean = false;
  user: User = {} as User;
  isHandset$ = this.breakpointService.isHandset$;
  loading$ = new Subject<boolean>();

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    public coreService: CoreService,
    private breakpointService: BreakpointService
  ) {
    // Get user's id from url and get user's metadata from backend
    this.routeSubscription = this.route.params.subscribe((params) => {
      this.userSubscription = this.authService
        .getUser(params.id)
        .pipe(indicate(this.loading$))
        .subscribe((user) => {
          this.user = user;
          this.isUserLoggedIn();
        });
    });

    // Get loginEvents and update userLoggedIn flag after event occurs
    this.loginEventSubscription = this.authService
      .getLoginEvent()
      .subscribe(() => {
        this.isUserLoggedIn();
      });

    // Get bioModified events and update bio if event occurs
    this.bioModifiedSubscription = this.coreService
      .bioModified()
      .subscribe((res) => (this.user.bio = res));
  }

  // Set userLoggedIn flag
  private isUserLoggedIn() {
    if (this.authService.getUserId() === this.user._id)
      this.userLoggedIn = true;
    else this.userLoggedIn = false;
  }

  ngOnDestroy() {
    this.routeSubscription?.unsubscribe();
    this.loginEventSubscription?.unsubscribe();
    this.bioModifiedSubscription?.unsubscribe();
    this.userSubscription?.unsubscribe();
  }
}
