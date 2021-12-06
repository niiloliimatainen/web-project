import { Component, Renderer2, RendererFactory2 } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'client';
  private renderer: Renderer2;

  // Add theme to the body
  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
    // TODO: add support to multiple themes
    this.renderer.addClass(document.body, 'app-dark-theme');
  }
}
