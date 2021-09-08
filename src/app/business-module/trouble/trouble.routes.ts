import { Routes } from '@angular/router';
import { TroubleComponent } from './trouble.component';
import { TroubleListComponent } from './trouble-manage/trouble-list/trouble-list.component';
import { TroubleDetailComponent } from './trouble-manage/trouble-list/trouble-detail/trouble-detail.component';
import { TroubleAddComponent } from './trouble-manage/trouble-list/trouble-add/trouble-add.component';
import { TroubleAssignComponent } from './trouble-manage/trouble-list/trouble-assign/trouble-assign.component';
import { TroubleFlowComponent } from './trouble-manage/trouble-list/trouble-flow/trouble-flow.component';

// ---------------------故障统计------------------------------------
import { TroubleStatisticComponent } from './trouble-statistic/trouble-statistic.component';
// ---------------------故障统计------------------------------------
export const ROUTER_CONFIG: Routes = [
  {
    path: '',
    component: TroubleComponent,
    data: {
      breadcrumb: [{ label: 'fault'}]
    },
    children: [
      {
        path: 'trouble-list',
        component: TroubleListComponent,
        data: {
          breadcrumb: [
            { label: 'fault'},
            { label: 'faultList' }]
        }
      },
      {
        path: 'trouble-list/trouble-detail',
        component: TroubleDetailComponent,
        data: {
          breadcrumb: [
            { label: 'fault'},
            { label: 'faultList', url: '/business/trouble/trouble-list'},
            { label: 'troubleDetail'}]
        }
      },
      {
        path: 'trouble-list/add',
        component: TroubleAddComponent,
        data: {
          breadcrumb: [
            { label: 'fault'},
            { label: 'faultList', url: '/business/trouble/trouble-list'},
            { label: 'addTrouble'}]
        }
      },
      {
        path: 'trouble-list/update',
        component: TroubleAddComponent,
        data: {
          breadcrumb: [
            { label: 'fault'},
            { label: 'faultList', url: '/business/trouble/trouble-list'},
            { label: 'troubleEdit'}]
        }
      },
      {
        path: 'trouble-list/assign',
        component: TroubleAssignComponent,
        data: {
          breadcrumb: [
            { label: 'fault'},
            { label: 'faultList', url: '/business/trouble/trouble-list'},
            { label: 'troubleAssign'}]
        }
      },
      {
        path: 'trouble-list/flow',
        component: TroubleFlowComponent,
        data: {
          breadcrumb: [
            { label: 'fault'},
            { label: 'faultList', url: '/business/trouble/trouble-list'},
            { label: 'troubleFlow'}]
        }
      },
      // 故障统计
      {
        path: 'trouble-statistic',
        component: TroubleStatisticComponent,
        data: {
          breadcrumb: [
            { label: 'fault'},
            { label: 'troubleStatistic'}
          ]
        }
      }
    ]
  }
];
