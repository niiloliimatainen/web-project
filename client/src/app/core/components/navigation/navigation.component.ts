import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../services/auth.service';
import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
})
export class NavigationComponent {
  constructor(private dialog: MatDialog, public authService: AuthService) {}

  openLogin() {
    this.dialog.open(LoginComponent, {
      width: '40vw',
      minWidth: '400px',
      height: '50vh',
      minHeight: '400px',
    });
  }
}
