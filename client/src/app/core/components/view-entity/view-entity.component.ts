import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { BreakpointService } from '../../services/breakpoint.service';

@Component({
  selector: 'app-view-entity',
  templateUrl: './view-entity.component.html',
  styleUrls: ['./view-entity.component.scss'],
})
export class ViewEntityComponent {
  private routeSubscription: Subscription;
  isHandset$ = this.breakpointService.isHandset$;
  testi = [1, 2, 3];

  code: string = `openLogin() {
    if (this.isHandset) {
      this.dialogRef = this.dialog.open(LoginComponent, {
        width: '100%',
        height: '80%',
        maxWidth: '100%',
        maxHeight: '80%',
        panelClass: 'bottom-dialog',
        position: {
          bottom: '0',
          left: '0',
        },
      });
    } else {
      this.dialogRef = this.dialog.open(LoginComponent, {
        width: '35vw',
        minWidth: '300px',
        height: '50vh',
        minHeight: '500px',
      });
    }
  }
`;

  code2: string = `<div class="entity-container">
  <div class="entity-headers">
    <h2 class="entity-header">Testikysymys about tän pitunen liibalaaba</h2>
    <div class="entity-subheaders">
      <p>12.10.2021</p>
      <span class="spacer"></span>
      <p>Comments 8</p>
    </div>
  </div>
  <mat-divider></mat-divider>

  <p>
    Lorem ipsum dolor sit amet consectetur, adipisicing elit. Iusto nulla
    officiis velit, cumque, facere nobis nam hic dicta reprehenderit est qui
    omnis. Quas recusandae consectetur officia autem ratione nostrum non!
  </p>
  <div>
    <pre><code class="code-snippet" [highlight]="code"></code></pre>
  </div>
</div>`;

  constructor(
    private route: ActivatedRoute,
    private breakpointService: BreakpointService
  ) {
    this.routeSubscription = this.route.params.subscribe((params) => {
      console.log(params.id);
    });
  }

  ngOnDestroy() {
    this.routeSubscription.unsubscribe();
  }
}
