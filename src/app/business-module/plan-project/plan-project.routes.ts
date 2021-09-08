import {Routes} from '@angular/router';
import {PlanProjectComponent} from './plan-project.component';
import {PlanListComponent} from './plan-manage/plan-list/plan-list.component';
import {PlanDetailComponent} from './plan-manage/plan-detail/plan-detail.component';
import {PlanWisdomListComponent} from './plan-manage/plan-wisdom-list/plan-wisdom-list.component';
import {PlanWisdomDetailComponent} from './plan-manage/plan-wisdom-detail/plan-wisdom-detail.component';
import {PlanPointDetailComponent} from './plan-manage/plan-point-detail/plan-point-detail.component';

export const ROUTER_CONFIG: Routes = [
  {
    path: '',
    component: PlanProjectComponent,
    children: [
      { // 规划列表
        path: 'plan-list',
        component: PlanListComponent,
        data: {
          breadcrumb: [ {label: 'planManage'}, {label: 'planList'}]
        }
      },
      { // 规划详情
        path: 'plan-detail/:type',
        component: PlanDetailComponent,
        data: {
          breadcrumb: [{label: 'planManage'}, {label: 'planList', url: 'plan-list'}, {label: 'plan'}]
        }
      },
      { // 规划点位详情
        path: 'plan-point-detail/:type',
        component: PlanPointDetailComponent,
        data: {
          breadcrumb: [{label: 'planManage'}, {label: 'planList', url: 'plan-list'}, {label: 'planPoint'}]
        }
      },
      { // 智慧杆列表
        path: 'plan-wisdom-list',
        component: PlanWisdomListComponent,
        data: {
          breadcrumb: [{label: 'planManage'}, {label: 'planWisdomList'}]
        }
      },
      { // 智慧杆详情
        path: 'plan-wisdom-detail/:type',
        component: PlanWisdomDetailComponent,
        data: {
          breadcrumb: [ {label: 'planManage'}, {label: 'planWisdomList', url: 'plan-wisdom-list'}, {label: 'planWisdom'}]
        }
      },
    ]
  }
];
