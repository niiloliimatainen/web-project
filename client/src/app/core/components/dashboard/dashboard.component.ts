import { Component, OnDestroy } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { indicate } from 'src/app/shared/utils/indicator';
import { Entity } from '../../models/entity.model';
import { CoreService } from '../../services/core.service';
import { EntityService } from '../../services/entity.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnDestroy {
  private entitySubscription: Subscription | undefined;
  loading$ = new Subject<boolean>();
  entityList: Entity[] = [] as Entity[];

  constructor(
    private entityService: EntityService,
    public coreService: CoreService
  ) {
    // Get all entities that are created
    this.entitySubscription = this.entityService
      .getEntities()
      .pipe(indicate(this.loading$))
      .subscribe((entities) => {
        this.entityList.push(...entities);
      });
  }

  ngOnDestroy() {
    this.entitySubscription?.unsubscribe();
  }
}
