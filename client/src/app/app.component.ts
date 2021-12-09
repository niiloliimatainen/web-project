import { Component, Renderer2, RendererFactory2 } from '@angular/core';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'client';
  private renderer: Renderer2;

  // Add theme to the body
  constructor(
    private rendererFactory: RendererFactory2,
    private authService: AuthService
  ) {
    this.renderer = this.rendererFactory.createRenderer(null, null);
    // TODO: add support to multiple themes
    this.renderer.addClass(document.body, 'app-dark-theme');
  }
}
