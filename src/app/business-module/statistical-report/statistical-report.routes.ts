import {Routes} from '@angular/router';
import {StatisticalReportComponent} from './statistical-report.component';
import {OdnDeviceResourcesComponent} from './odn-device-resources/odn-device-resources.component';
import {DeviceStatisticalComponent} from './device-statistical/device-statistical.component';
import {AlarmTypeComponent} from './alarm-statistical/alarm-type/alarm-type.component';
import {TopNComponent} from './top-n/top-n.component';
import {AlarmDisposeComponent} from './alarm-statistical/alarm-dispose/alarm-dispose.component';
import {AlarmNameComponent} from './alarm-statistical/alarm-name/alarm-name.component';
import {AreaAlarmComponent} from './alarm-statistical/area-alarm/area-alarm.component';
import {AlarmIncrementComponent} from './alarm-statistical/alarm-increment/alarm-increment.component';

import { FacilityTypeComponent } from './work-order-statistical/inspection/facility-type/facility-type.component';
import { DismantleFacilityTypeComponent } from './work-order-statistical/dismantle/facility-type/facility-type.component';

import { StatusComponent } from './work-order-statistical/inspection/status/status.component';
import { DismantleStatusComponent } from './work-order-statistical/dismantle/status/status.component';

import { PercentComponent } from './work-order-statistical/inspection/percent/percent.component';
import { DismantlePercentComponent } from './work-order-statistical/dismantle/percent/percent.component';

import { IncrementComponent } from './work-order-statistical/inspection/increment/increment.component';
import { DismantleIncrementComponent } from './work-order-statistical/dismantle/increment/increment.component';

import { UnitComponent } from './work-order-statistical/inspection/unit/unit.component';
import { DismantleUnitComponent } from './work-order-statistical/dismantle/unit/unit.component';

import { DeviceTypeComponent } from './work-order-statistical/clear-barrier/device-type/device-type.component';
import { ClearBarrierStatusComponent } from './work-order-statistical/clear-barrier/clear-barrier-status/clear-barrier-status.component';
import { ProcessingComponent } from './work-order-statistical/clear-barrier/processing/processing.component';
import { FailureComponent } from './work-order-statistical/clear-barrier/failure/failure.component';
import { ClearBarrierRatioComponent } from './work-order-statistical/clear-barrier/clear-barrier-ratio/clear-barrier-ratio.component';
import { IncrementsComponent } from './work-order-statistical/clear-barrier/increments/increments.component';
import { ClearBarrierUnitComponent } from './work-order-statistical/clear-barrier/clear-barrier-unit/clear-barrier-unit.component';
import {OpticalCableComponent} from './optical-cable/optical-cable.component';
import { LogStatisticalComponent } from './log-statistical/log-statistical/log-statistical.component';
import { TemplateDetailsComponent } from './log-statistical/template-details/template-details.component';
import {OdnDeviceJumperComponent} from './odn-device-jumper/odn-device-jumper.component';

export const ROUTER_CONFIG: Routes = [
  {
    path: '',
    component: StatisticalReportComponent,
    children: [
      {
        path: 'odn-jump-fiber',
        component: OdnDeviceResourcesComponent,
        data: {
          breadcrumb: [
            {label: 'statisticalManagement'},
            {label: 'odnDeviceResources'},
            {label: 'jumpFiber'}
          ]
        }
      }, {
        path: 'odn-fused-fiber',
        component: OdnDeviceResourcesComponent,
        data: {
          breadcrumb: [
            {label: 'statisticalManagement'},
            {label: 'odnDeviceResources'},
            {label: 'fusedFiber'}
          ]
        }
      }, {
        path: 'odn-disc',
        component: OdnDeviceResourcesComponent,
        data: {
          breadcrumb: [
            {label: 'statisticalManagement'},
            {label: 'odnDeviceResources'},
            {label: 'disc'}
          ]
        }
      }, {
        path: 'odn-box',
        component: OdnDeviceResourcesComponent,
        data: {
          breadcrumb: [
            {label: 'statisticalManagement'},
            {label: 'odnDeviceResources'},
            {label: 'box'}
          ]
        }
      }, {
        path: 'device-statistical',
        component: DeviceStatisticalComponent,
        data: {
          breadcrumb: [
            {label: 'statisticalManagement'},
            {label: 'deviceStatistical'},
            {label: 'deviceNumber'}
          ]
        }
      },
      {
        path: 'device-status',
        component: DeviceStatisticalComponent,
        data: {
          breadcrumb: [
            {label: 'statisticalManagement'},
            {label: 'deviceStatistical'},
            {label: 'deviceStatus'}
          ]
        }
      }, {
        path: 'device-deploy',
        component: DeviceStatisticalComponent,
        data: {
          breadcrumb: [
            {label: 'statisticalManagement'},
            {label: 'deviceStatistical'},
            {label: 'deviceDeploy'}
          ]
        }
      },
      {
        path: 'device-sensor',
        component: DeviceStatisticalComponent,
        data: {
          breadcrumb: [
            {label: 'statisticalManagement'},
            {label: 'deviceStatistical'},
            {label: 'deviceSensor'}
          ]
        }
      },
      {
        path: 'alarm-statistical',
        // component: AlarmStatisticalComponent,
        data: {
          breadcrumb: [
            {label: 'reportManagement'},
            {label: 'odnDeviceResources'}
          ]
        },
        children: [
          {
            path: 'alarm-type',
            component: AlarmTypeComponent,
            data: {
              breadcrumb: [
                {label: 'statisticalManagement'},
                {label: 'alarmStatistical'},
                {label: 'alarmTypeStatistical'}
              ]
            },
          },
          {
            path: 'alarm-dispose',
            component: AlarmDisposeComponent,
            data: {
              breadcrumb: [
                {label: 'statisticalManagement'},
                {label: 'alarmStatistical'},
                {label: 'alarmDisposeStatistical'}
              ]
            },
          }, {
            path: 'alarm-name',
            component: AlarmNameComponent,
            data: {
              breadcrumb: [
                {label: 'statisticalManagement'},
                {label: 'alarmStatistical'},
                {label: 'alarmNameStatistical'}
              ]
            },
          }, {
            path: 'area-alarm',
            component: AreaAlarmComponent,
            data: {
              breadcrumb: [
                {label: 'statisticalManagement'},
                {label: 'alarmStatistical'},
                {label: 'areaAlarmRatioStatistical'}
              ]
            },
          }, {
            path: 'alarm-increment',
            component: AlarmIncrementComponent,
            data: {
              breadcrumb: [
                {label: 'statisticalManagement'},
                {label: 'alarmStatistical'},
                {label: 'alarmIncrementStatistical'}
              ]
            },
          }
        ]
      },
      {  // 巡检工单设施类型统计
        path: 'work-order-statistical/inspection/facility-type',
        component: FacilityTypeComponent,
        data: {
          titleName: 'inspectDeviceStatistic',
          breadcrumb: [
            {label: 'statisticalManagement'},
            {label: 'workOrderStatistical'},
            {label: 'deviceTypeStatisticsOfInspection'}
          ]
        }
      },
      {  // 拆除工单设施类型统计
        path: 'work-order-statistical/dismantle/facility-type',
        component: DismantleFacilityTypeComponent,
        data: {
          titleName: 'dismantleDeviceStatistic',
          breadcrumb: [
            {label: 'statisticalManagement'},
            {label: 'workOrderStatistical'},
            {label: 'deviceTypeStatisticsOfDismantle'}
          ]
        }
      },
      {  // 巡检工单状态统计
        path: 'work-order-statistical/inspection/status',
        component: StatusComponent,
        data: {
          isNeedEquipment: true,
          titleName: 'inspectStatusStatistic',
          breadcrumb: [
            {label: 'statisticalManagement'},
            {label: 'workOrderStatistical'},
            {label: 'statusStatisticsOfInspection'}
          ]
        }
      },
      {  // 拆除工单状态统计
        path: 'work-order-statistical/dismantle/status',
        component: DismantleStatusComponent,
        data: {
          isNeedEquipment: true,
          titleName: 'dismantleStatusStatistic',
          breadcrumb: [
            {label: 'statisticalManagement'},
            {label: 'workOrderStatistical'},
            {label: 'statusStatisticsOfDismantle'}
          ]
        }
      },
      { //  区域巡检工单比统计
        path: 'work-order-statistical/inspection/percent',
        component: PercentComponent,
        data: {
          isNeedRadioEquip: true,
          titleName: 'inspectAreaStatistic',
          breadcrumb: [
            {label: 'statisticalManagement'},
            {label: 'workOrderStatistical'},
            {label: 'areaRatioOfInspection'}
          ]
        }
      },
      { //  区域拆除工单比统计
        path: 'work-order-statistical/dismantle/percent',
        component: DismantlePercentComponent,
        data: {
          isNeedRadioEquip: true,
          titleName: 'dismantleAreaStatistic',
          breadcrumb: [
            {label: 'statisticalManagement'},
            {label: 'workOrderStatistical'},
            {label: 'areaRatioOfDismantle'}
          ]
        }
      },
      { //  巡检工单增量统计
        path: 'work-order-statistical/inspection/increment',
        component: IncrementComponent,
        data: {
          isNeedEquipment: true,
          titleName: 'inspectAddStatistic',
          breadcrumb: [
            {label: 'statisticalManagement'},
            {label: 'workOrderStatistical'},
            {label: 'incrementOfInspection'}
          ]
        }
      },
      { //  拆除工单增量统计
        path: 'work-order-statistical/dismantle/increment',
        component: DismantleIncrementComponent,
        data: {
          isNeedEquipment: true,
          titleName: 'dismantleAddStatistic',
          breadcrumb: [
            {label: 'statisticalManagement'},
            {label: 'workOrderStatistical'},
            {label: 'incrementOfDismantle'}
          ]
        }
      },
      { //  巡检工单责任单位统计
        path: 'work-order-statistical/inspection/unit',
        component: UnitComponent,
        data: {
          titleName: 'inspectDeptStatistic',
          breadcrumb: [
            {label: 'statisticalManagement'},
            {label: 'workOrderStatistical'},
            {label: 'unitOfInspection'}
          ]
        }
      },
      {  // 拆除工单责任单位统计
        path: 'work-order-statistical/dismantle/unit',
        component: DismantleUnitComponent,
        data: {
          titleName: 'dismantleDeptStatistic',
          breadcrumb: [
            {label: 'statisticalManagement'},
            {label: 'workOrderStatistical'},
            {label: 'unitOfDismantleU'}
          ]
        }
      },
      {  // 销障工单设施类型
        path: 'work-order-statistical/clear-barrier/device-type',
        component: DeviceTypeComponent,
        data: {
          titleName: 'clearDeviceStatistic',
          breadcrumb: [
            {label: 'statisticalManagement'},
            {label: 'workOrderStatistical'},
            {label: 'deviceTypeStatisticsOfClearBarrier'}
          ]
        }
      },
      {  // 销障工单状态
        path: 'work-order-statistical/clear-barrier/status',
        component: ClearBarrierStatusComponent,
        data: {
          isNeedEquipment: true,
          titleName: 'clearStatusStatistic',
          breadcrumb: [
            {label: 'statisticalManagement'},
            {label: 'workOrderStatistical'},
            {label: 'statusStatisticsOfClearBarrier'}
          ]
        }
      },
      {  // 销障工单处理方案
        path: 'work-order-statistical/clear-barrier/processing',
        component: ProcessingComponent,
        data: {
          isNeedEquipment: true,
          titleName: 'clearProcessingStatistic',
          breadcrumb: [
            {label: 'statisticalManagement'},
            {label: 'workOrderStatistical'},
            {label: 'processingSchemeStatistics'}
          ]
        }
      },
      {  // 销障工单故障原因
        path: 'work-order-statistical/clear-barrier/failure',
        component: FailureComponent,
        data: {
          isNeedEquipment: true,
          titleName: 'clearErrorStatistic',
          breadcrumb: [
            {label: 'statisticalManagement'},
            {label: 'workOrderStatistical'},
            {label: 'failureCauseStatistics'}
          ]
        }
      },
      {  // 区域销障工单比统计
        path: 'work-order-statistical/clear-barrier/percent',
        component: ClearBarrierRatioComponent,
        data: {
          isNeedRadioEquip: true,
          titleName: 'clearAreaStatistic',
          breadcrumb: [
            {label: 'statisticalManagement'},
            {label: 'workOrderStatistical'},
            {label: 'areaRatioOfClearBarrier'}
          ]
        }
      },
      {  // 销障工单增量统计
        path: 'work-order-statistical/clear-barrier/increment',
        component: IncrementsComponent,
        data: {
          isNeedEquipment: true,
          titleName: 'clearAddStatistic',
          breadcrumb: [
            {label: 'statisticalManagement'},
            {label: 'workOrderStatistical'},
            {label: 'incrementOfClearBarrier'}
          ]
        }
      },
      { // 销障工单责任单位统计
        path: 'work-order-statistical/clear-barrier/unit',
        component: ClearBarrierUnitComponent,
        data: {
          titleName: 'clearDeptStatistic',
          breadcrumb: [
            {label: 'statisticalManagement'},
            {label: 'workOrderStatistical'},
            {label: 'unitOfClearBarrier'}
          ]
        }
      }, {
        path: 'top-lock',
        component: TopNComponent,
        data: {
          breadcrumb: [
            {label: 'statisticalManagement'},
            {label: 'topN'},
            {label: 'topLock'}
          ]
        }
      }, {
        path: 'top-alarm',
        component: TopNComponent,
        data: {
          breadcrumb: [
            {label: 'statisticalManagement'},
            {label: 'topN'},
            {label: 'topAlarm'}
          ]
        }
      }, {
        path: 'top-work-order',
        component: TopNComponent,
        data: {
          isSelectEquipment: true,
          breadcrumb: [
            {label: 'statisticalManagement'},
            {label: 'topN'},
            {label: 'topWorkOrder'}
          ]
        }
      }, {
        path: 'top-trouble',
        component: TopNComponent,
        data: {
          isSelectEquipment: true,
          breadcrumb: [
            {label: 'statisticalManagement'},
            {label: 'topN'},
            {label: 'topTrouble'}
          ]
        }
      }, {
        path: 'top-sensor',
        component: TopNComponent,
        data: {
          breadcrumb: [
            {label: 'statisticalManagement'},
            {label: 'topN'},
            {label: 'topSensor'}
          ]
        }
      }, {
        path: 'top-port',
        component: TopNComponent,
        data: {
          breadcrumb: [
            {label: 'statisticalManagement'},
            {label: 'topN'},
            {label: 'topPort'}
          ]
        }
      }, {
        path: 'optical-cable',
        component: OpticalCableComponent,
        data: {
          breadcrumb: [
            {label: 'statisticalManagement'},
            {label: 'opticalCable'},
            {label: 'cableStatistical'}
          ]
        }
      }, {
        path: 'cable-segment',
        component: OpticalCableComponent,
        data: {
          breadcrumb: [
            {label: 'statisticalManagement'},
            {label: 'opticalCable'},
            {label: 'segment'}
          ]
        }
      }, {
        path: 'core-fiber',
        component: OpticalCableComponent,
        data: {
          breadcrumb: [
            {label: 'statisticalManagement'},
            {label: 'opticalCable'},
            {label: 'core'}
          ]
        }
      },
      {
        path: 'log-statistical',
        component: LogStatisticalComponent,
        data: {
          breadcrumb: [
            {label: 'statisticalManagement'},
            {label: 'logStatistical'}
          ]
        }
      },
      {
        path: 'log-statistical/template-details/:type',
        component: TemplateDetailsComponent,
        data: {
          breadcrumb: [
            {label: 'statisticalManagement'},
            {label: 'logStatistical'},
            {label: 'logStatisticalTemplate'}
          ]
        }
      },
      {
        path: 'odn-jump/inner',
        component: OdnDeviceJumperComponent,
        data: {
          breadcrumb: [
            {label: 'statisticalManagement'},
            {label: 'odnJump'},
            {label: 'innerJump'}
          ]
        }
      },
      {
        path: 'odn-jump/outer',
        component: OdnDeviceJumperComponent,
        data: {
          breadcrumb: [
            {label: 'statisticalManagement'},
            {label: 'odnJump'},
            {label: 'outJump'}
          ]
        }
      }
    ]
  }
];
