import {Routes} from '@angular/router';
import {ProjectComponent} from './project.component';
import {ProjectListComponent} from './project-list/project-list.component';
import {ProjectBasicInfoComponent} from './project-detail/project-basic-info/project-basic-info.component';
import {PlanningPointComponent} from './project-detail/planning-point/planning-point.component';
import {ProjectWisdomListComponent} from './project-wisdom-list/project-wisdom-list.component';
import {ProjectWisdomDetailComponent} from './project-wisdom-detail/project-wisdom-detail.component';

export const ROUTER_CONFIG: Routes = [
  {
    path: '',
    component: ProjectComponent,
    children: [
      { // 项目列表
        path: 'project-list',
        component: ProjectListComponent,
        data: {
          breadcrumb: [{label: 'projectManage'}, {label: 'projectList'}]
        }
      },
      { // 项目详情
        path: 'project-detail/:type',
        component: ProjectBasicInfoComponent,
        data: {
          breadcrumb: [{label: 'projectManage'}, {label: 'projectList', url: 'project-list'}, {label: 'project'}]
        }
      },
      { // 项目规划点位
        path: 'point-detail/:type',
        component: PlanningPointComponent,
        data: {
          breadcrumb: [{label: 'projectManage'}, {label: 'projectList', url: 'project-list'}, {label: 'projectPoint'}]
        }
      },
      { // 项目智慧杆列表
        path: 'project-wisdom-list',
        component: ProjectWisdomListComponent,
        data: {
          breadcrumb: [ {label: 'projectManage'}, {label: 'projectWisdomList'}]
        }
      },
      { // 项目智慧杆编辑
        path: 'project-wisdom-detail/:type',
        component: ProjectWisdomDetailComponent,
        data: {
          breadcrumb: [{label: 'projectManage'}, {label: 'projectWisdomList',  url: 'project-wisdom-list'}, {label: 'planWisdom'}]
        }
      },
    ]
  }
];
