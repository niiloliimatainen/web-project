import { Component, OnInit } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { indicate } from 'src/app/shared/utils/indicator';
import { Entity } from '../../models/entity.model';
import { EntityService } from '../../services/entity.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  private entitySubscription: Subscription | undefined;
  loading$ = new Subject<boolean>();
  entityList: Entity[] = [] as Entity[];

  constructor(private entityService: EntityService) {
    this.entitySubscription = this.entityService
      .getEntities()
      .pipe(indicate(this.loading$))
      .subscribe((entities) => {
        this.entityList.push(...entities);
        console.log(entities);
      });
  }

  ngOnDestroy() {
    this.entitySubscription?.unsubscribe();
  }
}
