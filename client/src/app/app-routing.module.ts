import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './core/components/dashboard/dashboard.component';
import { NavigationComponent } from './core/components/navigation/navigation.component';
import { ViewEntityComponent } from './core/components/view-entity/view-entity.component';

const routes: Routes = [
  {
    path: '',
    component: NavigationComponent,
    children: [
      {
        path: '',
        component: DashboardComponent,
      },
      {
        path: ':id',
        component: ViewEntityComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
