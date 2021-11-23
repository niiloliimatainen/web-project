import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CoreService } from '../../services/core.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
})
export class NavigationComponent {
  userId: string | null;
  constructor(
    public authService: AuthService,
    public coreService: CoreService
  ) {
    this.userId = this.authService.getUserId();
  }
}
