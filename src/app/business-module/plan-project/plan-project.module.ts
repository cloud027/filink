import {SharedModule} from '../../shared-module/shared-module.module';
import {CoreModule} from '../../core-module/core-module.module';
import {ROUTER_CONFIG} from './plan-project.routes';
import {RouterModule} from '@angular/router';
import {PlanProjectComponent} from './plan-project.component';
import {NgModule} from '@angular/core';
import {PlanDetailComponent} from './plan-manage/plan-detail/plan-detail.component';
import {PlanListComponent} from './plan-manage/plan-list/plan-list.component';
import {PlanWisdomListComponent} from './plan-manage/plan-wisdom-list/plan-wisdom-list.component';
import {PlanWisdomDetailComponent} from './plan-manage/plan-wisdom-detail/plan-wisdom-detail.component';
import {PlanPointDetailComponent} from './plan-manage/plan-point-detail/plan-point-detail.component';
import {PlanApiService} from './share/service/plan-api.service';

@NgModule({
  declarations: [PlanProjectComponent, PlanListComponent, PlanDetailComponent,  PlanWisdomListComponent, PlanWisdomDetailComponent,
    PlanPointDetailComponent,
   ],
  imports: [
    SharedModule,
    RouterModule.forChild(ROUTER_CONFIG),
    CoreModule
  ],
  exports: [],
  providers: [PlanApiService]
})
export class PlanProjectModule {
}
