import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from '../../shared-module/shared-module.module';
import {CoreModule} from '../../core-module/core-module.module';
import {RouterModule} from '@angular/router';
import {ROUTER_CONFIG} from './project-manage.route';
import {ProjectComponent} from './project.component';
import {ProductListSelectorComponent} from './components/product-list-selector/product-list-selector.component';
import {ChangePointModelComponent} from './project-detail/change-point-model/change-point-model.component';
import {PlanningPointComponent} from './project-detail/planning-point/planning-point.component';
import {ProjectBasicInfoComponent} from './project-detail/project-basic-info/project-basic-info.component';
import {ProjectListComponent} from './project-list/project-list.component';
import {ProjectWisdomDetailComponent} from './project-wisdom-detail/project-wisdom-detail.component';
import {ProjectWisdomListComponent} from './project-wisdom-list/project-wisdom-list.component';
import {PlanProjectApiService} from './share/service/plan-project.service';

@NgModule({
  declarations: [ProjectComponent, ProductListSelectorComponent, ChangePointModelComponent, PlanningPointComponent
  , ProjectBasicInfoComponent, ProjectListComponent, ProjectWisdomDetailComponent, ProjectWisdomListComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(ROUTER_CONFIG),
    CoreModule
  ],
  exports: [],
  providers: [PlanProjectApiService]
})
export class ProjectManageModule { }
