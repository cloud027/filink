import {Routes} from '@angular/router';
import {WorkOrderComponent} from './work-order.component';
import {InspectionWorkOrderComponent} from './inspection/inspection-work-order.component';
import {InspectionTaskComponent} from './inspection/task/inspection-task.component';
import {InspectionTaskDetailComponent} from './inspection/task-detail/inspection-task-detail.component';
import {UnfinishedInspectionWorkOrderComponent} from './inspection/unfinished';
import {InspectionWorkOrderDetailComponent} from './inspection/detail/inspection-work-order-detail.component';
import {FinishedInspectionWorkOrderComponent} from './inspection/finished/finished-inspection-work-order.component';
import {ClearBarrierWorkOrderComponent} from './clear-barrier/clear-barrier-work-order.component';
import {HistoryClearBarrierWorkOrderComponent} from './clear-barrier/history/history-clear-barrier-work-order.component';
import {UnfinishedClearBarrierWorkOrderComponent} from './clear-barrier/unfinished/unfinished-clear-barrier-work-order.component';
import {ClearBarrierWorkOrderDetailComponent} from './clear-barrier/detail/clear-barrier-work-order-detail.component';
import {InspectionTemplateComponent} from './templates/inspection-template/inspection-template.component';
import { InspectionTemplateDetailComponent } from './templates/template-detail/inspection-template-detail.component';
import {AlarmConfirmDetailComponent} from './alarm-confirm/alarm-confirm-detail/alarm-confirm-detail.component';
import {UnfinishedDetailClearBarrierWorkOrderComponent} from './clear-barrier/unfinished-detail/unfinished-detail-clear-barrier-work-order.component';
import { UnfinishedDetailInspectionWorkOrderComponent } from './inspection/unfinished-detail/unfinished-detail-inspection-work-order.component';
import { TemplatesComponent } from './templates/templates.component';
import {InstallationComponent} from './installation/installation.component';
import {UnfinishedInstallComponent} from './installation/unfinished-install/unfinished-install.component';
import {FinishedInstallComponent} from './installation/finished-install/finished-install.component';
import {AlarmConfirmComponent} from './alarm-confirm/alarm-confirm.component';
import {FinishedAlarmConfirmComponent} from './alarm-confirm/finished-alarm-confirm/finished-alarm-confirm.component';
import {UnfinishedAlarmConfirmComponent} from './alarm-confirm/unfinished-alarm-confirm/unfinished-alarm-confirm.component';
import {InstallDetailComponent} from './installation/install-detail/install-detail.component';
import {InstallOrderViewComponent} from './installation/install-order-view/install-order-view.component';
import {AlarmConfirmViewComponent} from './alarm-confirm/alarm-confirm-view/alarm-confirm-view.component';

// -----------------------------------------????????????---------------------------------
import { DismantleBarrierWorkOrderComponent } from './dismantle-barrier/dismantle-barrier-work-order.component';
import { UnfinishedDismantleBarrierWorkOrderComponent } from './dismantle-barrier/unfinished/unfinished-dismantle-barrier-work-order.component';
import { DismantleBarrierWorkOrderDetailComponent } from './dismantle-barrier/detail/dismantle-barrier-work-order-detail.component';
import { HistoryDismantleBarrierWorkOrderComponent } from './dismantle-barrier/history/history-dismantle-barrier-work-order.component';
import { UnfinishedDetailDismantleBarrierWorkOrderComponent } from './dismantle-barrier/unfinished-detail/unfinished-detail-dismantle-barrier-work-order.component';
// -----------------------------------------????????????---------------------------------

export const ROUTER_CONFIG: Routes = [
  {
    path: '',
    component: WorkOrderComponent,
    children: [
      {
        path: 'clear-barrier',
        component: ClearBarrierWorkOrderComponent,
        children: [
          {
            path: 'unfinished-list',
            component: UnfinishedClearBarrierWorkOrderComponent,
            data: {
              breadcrumb: [
                {label: 'workOrderManagement'},
                {label: 'clearBarrierWorkOrder'},
                {label: 'unfinishedClearBarrierWorkOrder'}
              ]
            },
          },
          {
            path: 'history-list',
            component: HistoryClearBarrierWorkOrderComponent,
            data: {
              breadcrumb: [
                {label: 'workOrderManagement'},
                {label: 'clearBarrierWorkOrder'},
                {label: 'historyClearBarrierWorkOrder'}
              ]
            }
          },
          {
            path: 'unfinished-detail/add',
            component: ClearBarrierWorkOrderDetailComponent,
            data: {
              breadcrumb: [
                {label: 'workOrderManagement'},
                {label: 'clearBarrierWorkOrder'},
                {label: 'unfinishedClearBarrierWorkOrder', url: '/business/work-order/clear-barrier/unfinished-list'},
                {label: 'addClearBarrierWorkOrder'}
              ]
            }
          },
          {
            path: 'unfinished-detail/view',
            component: UnfinishedDetailClearBarrierWorkOrderComponent,
            data: {
              breadcrumb: [
                {label: 'workOrderManagement'},
                {label: 'clearBarrierWorkOrder'},
                {label: 'unfinishedClearBarrierWorkOrder', url: '/business/work-order/clear-barrier/unfinished-list'},
                {label: 'viewClearBarrierWorkOrder'}
              ]
            }
          },
          {
            path: 'finished-detail/view',
            component: UnfinishedDetailClearBarrierWorkOrderComponent,
            data: {
              breadcrumb: [
                {label: 'workOrderManagement'},
                {label: 'clearBarrierWorkOrder'},
                {label: 'historyClearBarrierWorkOrder', url: '/business/work-order/clear-barrier/history-list'},
                {label: 'viewClearBarrierWorkOrder'}
              ]
            }
          },
          {
            path: 'unfinished-detail/update',
            component: ClearBarrierWorkOrderDetailComponent,
            data: {
              breadcrumb: [
                {label: 'workOrderManagement'},
                {label: 'clearBarrierWorkOrder'},
                {label: 'unfinishedClearBarrierWorkOrder', url: '/business/work-order/clear-barrier/unfinished-list'},
                {label: 'modifyClearBarrierWorkOrder'}
              ]
            }
          },
          {
            path: 'unfinished-detail/rebuild',
            component: ClearBarrierWorkOrderDetailComponent,
            data: {
              breadcrumb: [
                {label: 'workOrderManagement'},
                {label: 'clearBarrierWorkOrder'},
                {label: 'unfinishedClearBarrierWorkOrder', url: '/business/work-order/clear-barrier/unfinished-list'},
                {label: 'rebuild'}
              ]
            }
          },
        ]
      },
      {
        path: 'inspection',
        component: InspectionWorkOrderComponent,
        children: [
          {
            path: 'task-list',
            component: InspectionTaskComponent,
            data: {
              breadcrumb: [
                {label: 'workOrderManagement'},
                {label: 'inspectionWorkOrder'},
                {label: 'inspectionTask'},
              ]
            },
          },
          {
            path: 'task-detail/add',
            component: InspectionTaskDetailComponent,
            data: {
              breadcrumb: [
                {label: 'workOrderManagement'},
                {label: 'inspectionWorkOrder'},
                {label: 'inspectionTask', url: '/business/work-order/inspection/task-list'},
                {label: 'addInspectionTask'}
              ]
            }
          },
          {
            path: 'task-detail/update',
            component: InspectionTaskDetailComponent,
            data: {
              breadcrumb: [
                {label: 'workOrderManagement'},
                {label: 'inspectionWorkOrder'},
                {label: 'inspectionTask', url: '/business/work-order/inspection/task-list'},
                {label: 'updateInspectionTask'}
              ]
            }
          },
          {
            path: 'task-detail/view',
            component: InspectionTaskDetailComponent,
            data: {
              breadcrumb: [
                {label: 'workOrderManagement'},
                {label: 'inspectionWorkOrder'},
                {label: 'inspectionTask', url: '/business/work-order/inspection/task-list'},
                {label: 'viewInspectionTask'}
              ]
            }
          },
          {
            path: 'unfinished-list',
            component: UnfinishedInspectionWorkOrderComponent,
            data: {
              breadcrumb: [
                {label: 'workOrderManagement'},
                {label: 'inspectionWorkOrder'},
                {label: 'unfinishedInspectionWorkOrder'},
              ]
            },
          },
          {
            path: 'unfinished-detail/taskView',
            component: UnfinishedDetailInspectionWorkOrderComponent,
            data: {
              breadcrumb: [
                {label: 'workOrderManagement'},
                {label: 'inspectionWorkOrder'},
                {label: 'inspectionTask', url: '/business/work-order/inspection/task-list'},
                {label: 'inspectionDetail'}
              ]
            }
          },
          {
            path: 'unfinished-detail/unfinishedView',
            component: UnfinishedDetailInspectionWorkOrderComponent,
            data: {
              breadcrumb: [
                {label: 'workOrderManagement'},
                {label: 'inspectionWorkOrder'},
                {label: 'unfinishedInspectionWorkOrder', url: '/business/work-order/inspection/unfinished-list'},
                {label: 'unfinishedDetail'}
              ]
            }
          },
          {
            path: 'unfinished-detail/finishedView',
            component: UnfinishedDetailInspectionWorkOrderComponent,
            data: {
              breadcrumb: [
                {label: 'workOrderManagement'},
                {label: 'inspectionWorkOrder'},
                {label: 'finishedInspectionWorkOrder', url: '/business/work-order/inspection/finished-list'},
                {label: 'unfinishedDetail'}
              ]
            }
          },
          {  // ?????????????????????
            path: 'finished-detail/finished-inspectReport',
            component: UnfinishedDetailInspectionWorkOrderComponent,
            data: {
              breadcrumb: [
                {label: 'workOrderManagement'},
                {label: 'inspectionWorkOrder'},
                {label: 'finishedInspectionWorkOrder', url: '/business/work-order/inspection/finished-list'},
                {label: 'inspectReport'}
              ]
            }
          },
          {  // ?????????????????????
            path: 'unfinished-detail/unfinished-inspectReport',
            component: UnfinishedDetailInspectionWorkOrderComponent,
            data: {
              breadcrumb: [
                {label: 'workOrderManagement'},
                {label: 'inspectionWorkOrder'},
                {label: 'unfinishedInspectionWorkOrder', url: '/business/work-order/inspection/unfinished-list'},
                {label: 'inspectReport'}
              ]
            }
          },
          {
            path: 'unfinished-detail/add',
            component: InspectionWorkOrderDetailComponent,
            data: {
              breadcrumb: [
                {label: 'workOrderManagement'},
                {label: 'inspectionWorkOrder'},
                {label: 'unfinishedInspectionWorkOrder', url: '/business/work-order/inspection/unfinished-list'},
                {label: 'newInspectionWorkOrder'}
              ]
            }
          },
          {
            path: 'unfinished-detail/update',
            component: InspectionWorkOrderDetailComponent,
            data: {
              breadcrumb: [
                {label: 'workOrderManagement'},
                {label: 'inspectionWorkOrder'},
                {label: 'unfinishedInspectionWorkOrder', url: '/business/work-order/inspection/unfinished-list'},
                {label: 'updateInspectionWorkOrder'}
              ]
            }
          },
          {
            path: 'unfinished-detail/restUpdate',
            component: InspectionWorkOrderDetailComponent,
            data: {
              breadcrumb: [
                { label: 'workOrderManagement', url: '/business/work-order' },
                { label: 'inspectionWorkOrder', url: '/business/work-order/inspection' },
                { label: 'unfinishedInspectionWorkOrder', url: '/business/work-order/inspection/unfinished-list' },
                { label: 'rebuildInspectionWorkOrder' }
              ]
            }
          },
          {
            path: 'finished-list',
            component: FinishedInspectionWorkOrderComponent,
            data: {
              breadcrumb: [
                {label: 'workOrderManagement'},
                {label: 'inspectionWorkOrder'},
                {label: 'finishedInspectionWorkOrder'},
              ]
            }
          }
        ]
      },
      {
        path: 'inspection-template',
        component: TemplatesComponent,
        children: [
          {
            path: 'template-list',
            component: InspectionTemplateComponent,
            data: {
              breadcrumb: [
                {label: 'workOrderManagement'},
                {label: 'inspectionTemplate'}
              ]
            }
          },
          {
            path: 'template-detail/add',
            component: InspectionTemplateDetailComponent,
            data: {
              breadcrumb: [
                {label: 'workOrderManagement'},
                {label: 'inspectionTemplate', url: '/business/work-order/inspection-template/template-list'},
                {label: 'templateDetailAdd'}
              ]
            }
          },
          {
            path: 'template-detail/update',
            component: InspectionTemplateDetailComponent,
            data: {
              breadcrumb: [
                {label: 'workOrderManagement'},
                {label: 'inspectionTemplate', url: '/business/work-order/inspection-template/template-list'},
                {label: 'templateDetailUpdate'}
              ]
            }
          },
        ]
      },
      // ????????????
      {
        path: 'installation',
        component: InstallationComponent,
        children: [
          // ???????????????????????????
          {
            path: 'unfinished-list',
            component: UnfinishedInstallComponent,
            data: {
              breadcrumb: [
                {label: 'workOrderManagement'},
                {label: 'installWorkOrder'},
                {label: 'unfinishedInstallWorkOrder'},
              ]
            }
          },
          // ??????????????????
          {
            path: 'installed-detail/add',
            component: InstallDetailComponent,
            data: {
              breadcrumb: [
                {label: 'workOrderManagement'},
                {label: 'installWorkOrder'},
                {label: 'unfinishedInstallWorkOrder', url: '/business/work-order/installation/unfinished-list'},
                {label: 'addInstallWorkOrder'},
              ]
            }
          },
          // ?????????????????????
          {
            path: 'installed-detail/update',
            component: InstallDetailComponent,
            data: {
              breadcrumb: [
                {label: 'workOrderManagement'},
                {label: 'installWorkOrder'},
                {label: 'unfinishedInstallWorkOrder', url: '/business/work-order/installation/unfinished-list'},
                {label: 'editInstallWorkOrder'},
              ]
            }
          },
          // ?????????-???????????????????????????
          {
            path: 'unfinished-install/rebuild',
            component: InstallDetailComponent,
            data: {
              breadcrumb: [
                {label: 'workOrderManagement'},
                {label: 'installWorkOrder'},
                {label: 'unfinishedInstallWorkOrder', url: '/business/work-order/installation/unfinished-list'},
                {label: 'rebuildInstallWorkOrder'},
              ]
            }
          },
          // ??????-???????????????????????????
          {
            path: 'finished-install/rebuild',
            component: InstallDetailComponent,
            data: {
              breadcrumb: [
                {label: 'workOrderManagement'},
                {label: 'installWorkOrder'},
                {label: 'finishedInstallWorkOrder', url: '/business/work-order/installation/finished-list'},
                {label: 'rebuildInstallWorkOrder'},
              ]
            }
          },
          // ????????????????????????
          {
            path: 'finished-list',
            component: FinishedInstallComponent,
            data: {
              breadcrumb: [
                {label: 'workOrderManagement'},
                {label: 'installWorkOrder'},
                {label: 'finishedInstallWorkOrder'},
              ]
            }
          },
          {  // ???????????????
            path: 'unfinished-detail/view',
            component: InstallOrderViewComponent,
            data: {
              breadcrumb: [
                {label: 'workOrderManagement'},
                {label: 'installWorkOrder'},
                {label: 'unfinishedInstallWorkOrder', url: '/business/work-order/installation/unfinished-list'},
                {label: 'viewInstallWorkOrder'}
              ]
            }
          },
          {  // ????????????
            path: 'finished-detail/view',
            component: InstallOrderViewComponent,
            data: {
              breadcrumb: [
                {label: 'workOrderManagement'},
                {label: 'clearBarrierWorkOrder'},
                {label: 'finishedInstallWorkOrder', url: '/business/work-order/installation/finished-list'},
                {label: 'viewInstallWorkOrder'}
              ]
            }
          },
        ]
      },
      // ????????????
      {
        path: 'dismantle-barrier',
        component: DismantleBarrierWorkOrderComponent,
        children: [
          // ????????? ???????????? ??????
          {
            path: 'unfinished-list',
            component: UnfinishedDismantleBarrierWorkOrderComponent,
            data: {
              breadcrumb: [
                {label: 'workOrderManagement'},
                {label: 'DismantleBarrierWorkOrder'},
                {label: 'unfinishedDismantleBarrierWorkOrder'}
              ]
            },
          },
          // ????????? ???????????? ??????
          {
            path: 'unfinished-detail/add',
            component: DismantleBarrierWorkOrderDetailComponent,
            data: {
              breadcrumb: [
                {label: 'workOrderManagement'},
                {label: 'DismantleBarrierWorkOrder'},
                {label: 'unfinishedDismantleBarrierWorkOrder', url: '/business/work-order/dismantle-barrier/unfinished-list'},
                {label: 'addDismantleBarrierWorkOrder'}
              ]
            }
          },
          // ????????? ???????????? ??????
          {
            path: 'unfinished-detail/update',
            component: DismantleBarrierWorkOrderDetailComponent,
            data: {
              breadcrumb: [
                {label: 'workOrderManagement'},
                {label: 'DismantleBarrierWorkOrder'},
                {label: 'unfinishedDismantleBarrierWorkOrder', url: '/business/work-order/dismantle-barrier/unfinished-list'},
                {label: 'modifyDismantleBarrierWorkOrder'}
              ]
            }
          },
          // ????????? ???????????? ????????????
          {
            path: 'history-list',
            component: HistoryDismantleBarrierWorkOrderComponent,
            data: {
              breadcrumb: [
                {label: 'workOrderManagement'},
                {label: 'DismantleBarrierWorkOrder'},
                {label: 'historyDismantleBarrierWorkOrder'}
              ]
            }
          },
          {
            path: 'unfinished-detail/view',
            component: UnfinishedDetailDismantleBarrierWorkOrderComponent,
            data: {
              breadcrumb: [
                {label: 'workOrderManagement'},
                {label: 'DismantleBarrierWorkOrder'},
                {label: 'unfinishedDismantleBarrierWorkOrder', url: '/business/work-order/dismantle-barrier/unfinished-list'},
                {label: 'viewDismantleBarrierWorkOrder'}
              ]
            }
          },
          {
            path: 'finished-detail/view',
            component: UnfinishedDetailDismantleBarrierWorkOrderComponent,
            data: {
              breadcrumb: [
                {label: 'workOrderManagement'},
                {label: 'DismantleBarrierWorkOrder'},
                {label: 'historyDismantleBarrierWorkOrder', url: '/business/work-order/dismantle-barrier/history-list'},
                {label: 'viewDismantleBarrierWorkOrder'}
              ]
            }
          },
          {
            path: 'unfinished-detail/rebuild',
            component: DismantleBarrierWorkOrderDetailComponent,
            data: {
              breadcrumb: [
                {label: 'workOrderManagement'},
                {label: 'DismantleBarrierWorkOrder'},
                {label: 'unfinishedDismantleBarrierWorkOrder', url: '/business/work-order/dismantle-barrier/unfinished-list'},
                {label: 'rebuild'}
              ]
            }
          },
        ]
      },
      // ??????????????????
      {
        path: 'alarm-confirm',
        component: AlarmConfirmComponent,
        children: [
          // ???????????????????????????
          {
            path: 'unfinished-list',
            component: UnfinishedAlarmConfirmComponent,
            data: {
              breadcrumb: [
                {label: 'workOrderManagement'},
                {label: 'alarmConfirmWorkOrder'},
                {label: 'unfinishedAlarmConfirmWorkOrder'},
              ]
            },
          },
          {
            // ????????????????????????
            path: 'alarm-confirm-detail/add',
            component: AlarmConfirmDetailComponent,
            data: {
              breadcrumb: [
                {label: 'workOrderManagement'},
                {label: 'alarmConfirmWorkOrder'},
                {label: 'unfinishedAlarmConfirmWorkOrder', url: '/business/work-order/alarm-confirm/unfinished-list'},
                {label: 'addAlarmConfirmWorkOrder'},
              ]
            },
          },
          {
            // ????????????????????????
            path: 'alarm-confirm-detail',
            component: AlarmConfirmViewComponent,
            data: {
              breadcrumb: [
                {label: 'workOrderManagement'},
                {label: 'alarmConfirmWorkOrder'},
                {label: 'unfinishedAlarmConfirmWorkOrder', url: '/business/work-order/alarm-confirm/unfinished-list'},
                {label: 'alarmConfirmOrderDetail'},
              ]
            },
          },
          {
            // ????????????????????????
            path: 'alarm-confirm-detail/update',
            component: AlarmConfirmDetailComponent,
            data: {
              breadcrumb: [
                {label: 'workOrderManagement'},
                {label: 'alarmConfirmWorkOrder'},
                {label: 'unfinishedAlarmConfirmWorkOrder', url: '/business/work-order/alarm-confirm/unfinished-list'},
                {label: 'updateAlarmConfirmWorkOrder'},
              ]
            },
          },
          {
            // ?????????????????????????????????
            path: 'unfinished-list/rebuild',
            component: AlarmConfirmDetailComponent,
            data: {
              breadcrumb: [
                {label: 'workOrderManagement'},
                {label: 'alarmConfirmWorkOrder'},
                {label: 'unfinishedAlarmConfirmWorkOrder', url: '/business/work-order/alarm-confirm/unfinished-list'},
                {label: 'rebuildAlarmConfirmOrder'}
              ]
            }
          },
          {
            // ??????????????????????????????
            path: 'finished-list/rebuild',
            component: AlarmConfirmDetailComponent,
            data: {
              breadcrumb: [
                {label: 'workOrderManagement'},
                {label: 'alarmConfirmWorkOrder'},
                {label: 'finishedAlarmConfirmWorkOrder', url: '/business/work-order/alarm-confirm/finished-list'},
                {label: 'rebuildAlarmConfirmOrder'}
              ]
            }
          },
          // ????????????????????????
          {
            path: 'finished-list',
            component: FinishedAlarmConfirmComponent,
            data: {
              breadcrumb: [
                {label: 'workOrderManagement'},
                {label: 'alarmConfirmWorkOrder'},
                {label: 'finishedAlarmConfirmWorkOrder'},
              ]
            },
          },
          {
            // ??????????????????????????????
            path: 'history-alarm-confirm-detail',
            component: AlarmConfirmViewComponent,
            data: {
              breadcrumb: [
                {label: 'workOrderManagement'},
                {label: 'alarmConfirmWorkOrder'},
                {label: 'finishedAlarmConfirmWorkOrder', url: '/business/work-order/alarm-confirm/finished-list'},
                {label: 'historyAlarmConfirmOrderDetail'},
              ]
            },
          },
        ]
      }
    ]
  }
];

