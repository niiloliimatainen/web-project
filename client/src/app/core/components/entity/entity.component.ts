import { Component, Input } from '@angular/core';
import { Entity } from '../../models/entity.model';
import { AuthService } from '../../services/auth.service';
import { BreakpointService } from '../../services/breakpoint.service';
import { CoreService } from '../../services/core.service';

@Component({
  selector: 'app-entity',
  templateUrl: './entity.component.html',
  styleUrls: ['./entity.component.scss'],
})
export class EntityComponent {
  @Input() entity!: Entity;

  isHandset$ = this.breakpointService.isHandset$;

  constructor(
    public authService: AuthService,
    public coreService: CoreService,
    private breakpointService: BreakpointService
  ) {}
}
