import {Routes} from '@angular/router';
import {ApplicationComponent} from './application.component';
import {LightingComponent} from './lighting/lighting.component';
import {ReleaseComponent} from './release/release.component';
import {SecurityComponent} from './security/security.component';
import {WorkbenchComponent} from './lighting/workbench/workbench.component';
import {EquipmentListComponent} from './lighting/equipment-list/equipment-list.component';
import {PolicyControlComponent} from './lighting/policy-control/policy-control.component';
import {ReleaseEquipmentListComponent} from './release/equipment-list/release-equipment-list.component';
import {ReleaseWorkbenchComponent} from './release/workbench/release-workbench.component';
import {ReleasePolicyControlComponent} from './release/policy-control/release-policy-control.component';
import {SecurityEquipmentListComponent} from './security/equipment-list/security-equipment-list.component';
import {SecurityWorkbenchComponent} from './security/workbench/security-workbench.component';
import {SecurityPolicyControlComponent} from './security/policy-control/security-policy-control.component';
import {ContentListComponent} from './release/content-list/content-list.component';
import {ContentExamineComponent} from './release/content-examine/content-examine.component';
import {ContentExamineDetailsComponent} from './release/content-examine/details/content-examine-details.component';
import {ReplayTheaterComponent} from './security/replay-theater/replay-theater.component';
import {LightingAddComponent} from './lighting/policy-control/add/lighting-add.component';
import {LightingDetailsComponent} from './lighting/policy-control/policy-details/lighting-details.component';
import {ReleaseAddComponent} from './release/policy-control/add/release-add.component';
import {ReleaseDetailsComponent} from './release/policy-control/details/release-details.component';
import {SecurityAddComponent} from './security/policy-control/add/security-add.component';
import {SecurityDetailsComponent} from './security/policy-control/details/security-details.component';
import {ReplayDetailsComponent} from './security/replay-theater/details/replay-details.component';
import {ContentListAddComponent} from './release/content-list/add/content-list-add.component';
import {StrategyManagementComponent} from './strategy-management/strategy-list/strategy-management.component';
import {StrategyManagementAddComponent} from './strategy-management/strategy-list/add/strategy-management-add.component';
import {StrategyComponent} from './strategy-management/strategy.component';
import {StrategyManageDetailsComponent} from './strategy-management/strategy-list/strategy-details/strategy-manage-details.component';
import {PassagewayInformationComponent} from './security/workbench/passageway-information/passageway-information.component';
import {EquipmentDetailsComponent} from './lighting/equipment-list/equipment/details/equipment-details.component';
import {LoopDetailsComponent} from './lighting/equipment-list/loop/details/loop-details.component';
import {GroupListDetailsComponent} from './lighting/equipment-list/group/details/group-list-details.component';
import {PassagewayAddComponent} from './security/workbench/passageway-add/passageway-add.component';
import {BasicsModelComponent} from './security/workbench/basics/basics-model.component';
import {ReleaseEquipmentDetailsComponent} from './release/equipment-list/release-equipment-details/release-equipment-details.component';
import {ReleaseGroupDetailsComponent} from './release/equipment-list/release-group-details/release-group-details.component';
import {SecurityEquipmentListDetailsComponent} from './security/equipment-list/details/security-equipment-list-details.component';
import {FacilityAuthorizationComponent} from './facility-authorization/facility-authorization.component';
import {UnifiedAuthorizationComponent} from './facility-authorization/unified-authorization/unified-authorization.component';
import {TemporaryAuthorizationComponent} from './facility-authorization/temporary-authorization/temporary-authorization.component';
import {UnifiedDetailsComponent} from './facility-authorization/unified-details/unified-details.component';
import {ReportAnalysisComponent} from './lighting/report-analysis/report-analysis.component';

import {BroadcastComponent} from './broadcast/broadcast.component';
import {BroadcastWorkbenchComponent} from './broadcast/workbench/broadcast-workbench.component';
import {BroadcastAddComponent} from './broadcast/policy-control/add/broadcast-add.component';
import {BroadcastDetailsComponent} from './broadcast/policy-control/details/broadcast-details.component';
import {BroadcastEquipmentDetailsComponent} from './broadcast/equipment-list/broadcast-equipment-details/broadcast-equipment-details.component';
import {BroadcastEquipmentListComponent} from './broadcast/equipment-list/broadcast-equipment-list.component';
import {BroadcastGroupDetailsComponent} from './broadcast/equipment-list/broadcast-group-details/broadcast-group-details.component';
import {BroadcastPolicyControlComponent} from './broadcast/policy-control/broadcast-policy-control.component';
import {BroadcastContentListComponent} from './broadcast/content-list/broadcast-content-list.component';
import {BroadcastContentListAddComponent} from './broadcast/content-list/add/broadcast-content-list-add.component';
import {BroadcastContentExamineComponent} from './broadcast/content-examine/broadcast-content-examine.component';
import {BroadcastContentExamineDetailsComponent} from './broadcast/content-examine/details/broadcast-content-examine-details.component';
import {HistoryAudioListComponent} from './broadcast/history-audio-list/history-audio-list.component';
import { CallComponent } from './call/call.component';
import { CallWorkbenchComponent } from './call/workbench/call-workbench.component';
import { CallEquipmentListComponent } from './call/equipment-list/call-equipment-list.component';
import { CallEquipmentDetailsComponent } from './call/equipment-list/call-equipment-details/call-equipment-details.component';
import {CallGroupDetailsComponent} from './call/equipment-list/call-group-details/call-group-details.component';
// start 环境监测
import { MonitorComponent } from './monitor/monitor.component';
import { MonitorWorkbenchComponent } from './monitor/workbench/monitor-workbench.component';
import { MonitorEquipmentListComponent } from './monitor/equipment-list/monitor-equipment-list.component';
import { MonitorEquipmentDetailsComponent } from './monitor/equipment-list/monitor-equipment-details/monitor-equipment-details.component';
// end 环境监测

export const ROUTER_CONFIG: Routes = [
  {
    path: '',
    component: ApplicationComponent,
    children: [
      {
        path: 'lighting',
        component: LightingComponent,
        data: {
          breadcrumb: [{label: 'application'}, {label: 'lighting'}]
        },
        children: [
          {
            path: 'workbench',
            component: WorkbenchComponent,
            data: {
              breadcrumb: [{label: 'application'}, {label: 'lighting'}, {label: 'workbench'}]
            },
          },
          {
            path: 'equipment-list',
            component: EquipmentListComponent,
            data: {
              breadcrumb: [{label: 'application'}, {label: 'lighting'}, {label: 'equipmentList'}]
            },
          },
          {
            path: 'equipment-list/policy-details',
            component: EquipmentDetailsComponent,
            data: {
              breadcrumb: [
                {label: 'application'},
                {label: 'lighting'},
                {label: 'equipmentList', url: '/business/application/lighting/equipment-list'},
                {label: 'equipmentDetail'}
              ]
            },
          },
          {
            path: 'equipment-list/group-policy-details',
            component: GroupListDetailsComponent,
            data: {
              breadcrumb: [
                {label: 'application'},
                {label: 'lighting'},
                {label: 'equipmentList', url: '/business/application/lighting/equipment-list'},
                {label: 'groupDetails'}
              ]
            },
          },
          {
            path: 'equipment-list/loop-policy-details',
            component: LoopDetailsComponent,
            data: {
              breadcrumb: [
                {label: 'application'},
                {label: 'lighting'},
                {label: 'equipmentList', url: '/business/application/lighting/equipment-list'},
                {label: 'loopDetail'}
              ]
            },
          },
          {
            path: 'policy-control',
            component: PolicyControlComponent,
            data: {
              breadcrumb: [{label: 'application'}, {label: 'lighting'}, {label: 'lightingStrategy'}]
            }
          },
          {
            path: 'policy-control/:type',
            component: LightingAddComponent,
            data: {
              breadcrumb: [
                {label: 'application'},
                {label: 'lighting'},
                {label: 'lightingStrategy', url: '/business/application/lighting/policy-control'},
                {label: 'policy'}
              ]
            },
          },
          {
            path: 'policy-details/:id',
            component: LightingDetailsComponent,
            data: {
              breadcrumb: [
                {label: 'application'},
                {label: 'lighting'},
                {label: 'lightingStrategy', url: '/business/application/lighting/policy-control'},
                {label: 'policyDetails'}
              ]
            },
          },
          {
            path: 'report-analysis',
            component: ReportAnalysisComponent,
            data: {
              breadcrumb: [
                {label: 'application'},
                {label: 'lighting'},
                {label: 'reportAnalysis', url: '/business/application/lighting/report-analysis'}
              ]
            }
          }
        ]
      },
      {
        path: 'release',
        component: ReleaseComponent,
        data: {
          breadcrumb: [{label: 'application'}, {label: 'release'}]
        },
        children: [
          {
            path: 'workbench',
            component: ReleaseWorkbenchComponent,
            data: {
              breadcrumb: [{label: 'application'}, {label: 'release'}, {label: 'workbench'}]
            },
          },
          {
            path: 'policy-control/:type',
            component: ReleaseAddComponent,
            data: {
              breadcrumb: [
                {label: 'application'},
                {label: 'release'},
                {label: 'releaseStrategy', url: '/business/application/release/policy-control'},
                {label: 'policy'}
              ]
            },
          },
          {
            path: 'policy-details/:id',
            component: ReleaseDetailsComponent,
            data: {
              breadcrumb: [
                {label: 'application'},
                {label: 'release'},
                {label: 'releaseStrategy', url: '/business/application/release/policy-control'},
                {label: 'policyDetails'}
              ]
            },
          },
          {
            path: 'equipment-list',
            component: ReleaseEquipmentListComponent,
            data: {
              breadcrumb: [{label: 'application'}, {label: 'release'}, {label: 'equipmentList'}]
            },
          },
          {
            path: 'equipment-list/policy-details',
            component: ReleaseEquipmentDetailsComponent,
            data: {
              breadcrumb: [
                {label: 'application'},
                {label: 'release'},
                {label: 'equipmentList', url: '/business/application/release/equipment-list'},
                {label: 'equipmentDetail'}
              ]
            },
          },
          {
            path: 'equipment-list/group-policy-details',
            component: ReleaseGroupDetailsComponent,
            data: {
              breadcrumb: [
                {label: 'application'},
                {label: 'release'},
                {label: 'equipmentList', url: '/business/application/release/equipment-list'},
                {label: 'groupDetails'}
              ]
            },
          },
          {
            path: 'policy-control',
            component: ReleasePolicyControlComponent,
            data: {
              breadcrumb: [{label: 'application'}, {label: 'release'}, {label: 'releaseStrategy'}]
            }
          },
          {
            path: 'content-list',
            component: ContentListComponent,
            data: {
              breadcrumb: [{label: 'application'}, {label: 'release'}, {label: 'contentList'}]
            },
          },
          {
            path: 'content-list/:type',
            component: ContentListAddComponent,
            data: {
              breadcrumb: [
                {label: 'application'},
                {label: 'release'},
                {label: 'contentList', url: '/business/application/release/content-list'},
                {label: 'content'}
              ]
            },
          },
          {
            path: 'content-examine',
            component: ContentExamineComponent,
            data: {
              breadcrumb: [{label: 'application'}, {label: 'release'}, {label: 'contentExamine'}]
            },
          },
          {
            path: 'content-examine/policy-details',
            component: ContentExamineDetailsComponent,
            data: {
              breadcrumb: [
                {label: 'application'},
                {label: 'release'},
                {label: 'contentExamine', url: '/business/application/release/content-examine'},
                {label: 'contentDetails'}
              ]
            },
          }
        ]
      },
      {
        path: 'security',
        component: SecurityComponent,
        data: {
          breadcrumb: [{label: 'application'}, {label: 'security'}]
        },
        children: [
          {
            path: 'workbench',
            component: SecurityWorkbenchComponent,
            data: {
              breadcrumb: [{label: 'application'}, {label: 'security'}, {label: 'workbench'}]
            },
          },
          {
            path: 'workbench/passageway-information',
            component: PassagewayInformationComponent,
            data: {
              breadcrumb: [
                {label: 'application'},
                {label: 'security'},
                {label: 'workbench', url: '/business/application/security/workbench'},
                {label: 'channelConfiguration'}
              ]
            },
          },
          {
            path: 'workbench/passageway-information/:type',
            component: PassagewayAddComponent,
            data: {
              breadcrumb: [
                {label: 'application'},
                {label: 'security'},
                {label: 'workbench', url: '/business/application/security/workbench'},
                {label: 'channelConfiguration', url: '/business/application/security/workbench/passageway-information'},
                {label: 'channelConfiguration'}
              ]
            },
          },
          {
            path: 'workbench/basics',
            component: BasicsModelComponent,
            data: {
              breadcrumb: [
                {label: 'application'},
                {label: 'security'},
                {label: 'workbench', url: '/business/application/security/workbench'},
                {label: 'basics'}
              ]
            },
          },
          {
            path: 'equipment-list',
            component: SecurityEquipmentListComponent,
            data: {
              breadcrumb: [{label: 'application'}, {label: 'security'}, {label: 'equipmentList'}]
            },
          },
          {
            path: 'equipment-list/policy-details',
            component: SecurityEquipmentListDetailsComponent,
            data: {
              breadcrumb: [
                {label: 'application'},
                {label: 'security'},
                {label: 'equipmentList', url: '/business/application/security/equipment-list'},
                {label: 'equipmentDetail'}
              ]
            },
          },
          {
            path: 'policy-control',
            component: SecurityPolicyControlComponent,
            data: {
              breadcrumb: [{label: 'application'}, {label: 'security'}, {label: 'policyControl'}]
            },
          },
          {
            path: 'policy-details/:id',
            component: SecurityDetailsComponent,
            data: {
              breadcrumb: [
                {label: 'application'},
                {label: 'security'},
                {label: 'policyControl', url: '/business/application/security/policy-control'},
                {label: 'policyDetails'}
              ]
            },
          },
          {
            path: 'policy-control/:type',
            component: SecurityAddComponent,
            data: {
              breadcrumb: [
                {label: 'application'},
                {label: 'security'},
                {label: 'policyControl', url: '/business/application/security/policy-control'},
                {label: 'policy'}
              ]
            },
          },
          {
            path: 'replay-theater',
            component: ReplayTheaterComponent,
            data: {
              breadcrumb: [{label: 'application'}, {label: 'security'}, {label: 'replayTheater'}]
            },
          },
          {
            path: 'replay-theater/policy-details',
            component: ReplayDetailsComponent,
            data: {
              breadcrumb: [
                {label: 'application'},
                {label: 'security'},
                {label: 'policyControl', url: '/business/application/security/replay-theater'},
                {label: 'policyDetails'}
              ]
            },
          },
        ]
      },
      {
        path: 'strategy',
        component: StrategyComponent,
        data: {
          breadcrumb: [{label: 'application'}, {label: 'strategy'}, {label: 'strategy'}]
        },
        children: [
          {
            path: 'list',
            component: StrategyManagementComponent,
            data: {
              breadcrumb: [
                {label: 'application'},
                {label: 'strategy', url: '/business/application/strategy/list'},
              ]
            },
          },
          {
            path: ':type',
            component: StrategyManagementAddComponent,
            data: {
              breadcrumb: [
                {label: 'application'},
                {label: 'strategy', url: '/business/application/strategy/list'},
                {label: 'policy'}
              ]
            },
          },
          {
            path: 'policy-details/:id',
            component: StrategyManageDetailsComponent,
            data: {
              breadcrumb: [
                {label: 'application'},
                {label: 'strategy', url: '/business/application/strategy/list'},
                {label: 'policyDetails'}
              ]
            },
          },
        ]
      },
      {
        path: 'facility-authorization',
        component: FacilityAuthorizationComponent,
        data: {
          breadcrumb: [{label: 'application'}, {label: 'smartAccessControl'}]
        },
        children: [
          {
            path: 'unified-authorization',
            component: UnifiedAuthorizationComponent,
            data: {
              breadcrumb: [{label: 'application'}, {label: 'smartAccessControl'}, {label: 'unifiedAuthorization'}]
            }
          },
          {
            path: 'temporary-authorization',
            component: TemporaryAuthorizationComponent,
            data: {
              breadcrumb: [
                {label: 'application'},
                {label: 'smartAccessControl'},
                {label: 'temporaryAuthorization'}]
            }
          },
          {
            path: 'unified-details/:type',
            component: UnifiedDetailsComponent,
            data: {
              breadcrumb: [
                {label: 'application'},
                {label: 'smartAccessControl'},
                {label: 'unifiedAuthorization', url: '/business/application/facility-authorization/unified-authorization'},
                {label: 'unifiedAuthorization'},
                ]
            }
          }
        ]
      },
      // 环境监测
      {
        path: 'monitor',
        component: MonitorComponent,
        data: {
          breadcrumb: [{label: 'application'}, {label: 'monitor'}]
        },
        children: [
          // 工作台
          {
            path: 'workbench',
            component: MonitorWorkbenchComponent,
            data: {
              breadcrumb: [{label: 'application'}, {label: 'monitor'}, {label: 'workbench'}]
            },
          },
          // 设备列表
          {
            path: 'equipment-list',
            component: MonitorEquipmentListComponent,
            data: {
              breadcrumb: [{label: 'application'}, {label: 'monitor'}, {label: 'equipmentList'}]
            },
          },
          // 设备详情
          {
            path: 'equipment-list/policy-details',
            component: MonitorEquipmentDetailsComponent,
            data: {
              breadcrumb: [
                {label: 'application'},
                {label: 'monitor'},
                {label: 'equipmentList', url: '/business/application/monitor/equipment-list'},
                {label: 'equipmentDetail'}
              ]
            },
          }
        ]
      },
      // 一键呼叫
      {
        path: 'call',
        component: CallComponent,
        data: {
          breadcrumb: [{label: 'application'}, {label: 'call'}]
        },
        children: [
          // ����̨
          {
            path: 'workbench',
            component: CallWorkbenchComponent,
            data: {
              breadcrumb: [{label: 'application'}, {label: 'call'}, {label: 'workbench'}]
            },
          },
          // �豸�б�
          {
            path: 'equipment-list',
            component: CallEquipmentListComponent,
            data: {
              breadcrumb: [{label: 'application'}, {label: 'call'}, {label: 'equipmentList'}]
            },
          },
          // �豸����
          {
            path: 'equipment-list/policy-details',
            component: CallEquipmentDetailsComponent,
            data: {
              breadcrumb: [
                {label: 'application'},
                {label: 'call'},
                {label: 'equipmentList', url: '/business/application/call/equipment-list'},
                {label: 'equipmentDetail'}
              ]
            },
          },
          // ��������
          {
            path: 'equipment-list/call-group-details',
            component: CallGroupDetailsComponent,
            data: {
              breadcrumb: [
                {label: 'application'},
                {label: 'call'},
                {label: 'equipmentList', url: '/business/application/call/equipment-list'},
                {label: 'groupDetails'}
              ]
            },
          }
        ]
      },
      // 广播发布
      {
        path: 'broadcast',
        component: BroadcastComponent,
        data: {
          breadcrumb: [{label: 'application'}, {label: 'broadcast'}]
        },
        children: [
          {
            path: 'workbench',
            component: BroadcastWorkbenchComponent,
            data: {
              breadcrumb: [{label: 'application'}, {label: 'broadcast'}, {label: 'workbench'}]
            },
          },
          {
            path: 'policy-control/:type',
            component: BroadcastAddComponent,
            data: {
              breadcrumb: [
                {label: 'application'},
                {label: 'broadcast'},
                {label: 'broadcastStrategy', url: '/business/application/broadcast/policy-control'},
                {label: 'policy'}
              ]
            },
          },
          {
            path: 'policy-details/:id',
            component: BroadcastDetailsComponent,
            data: {
              breadcrumb: [
                {label: 'application'},
                {label: 'broadcast'},
                {label: 'broadcastStrategy', url: '/business/application/broadcast/policy-control'},
                {label: 'policyDetails'}
              ]
            },
          },
          {
            path: 'equipment-list',
            component: BroadcastEquipmentListComponent,
            data: {
              breadcrumb: [{label: 'application'}, {label: 'broadcast'}, {label: 'equipmentList'}]
            },
          },
          {
            path: 'equipment-list/policy-details',
            component: BroadcastEquipmentDetailsComponent,
            data: {
              breadcrumb: [
                {label: 'application'},
                {label: 'broadcast'},
                {label: 'equipmentList', url: '/business/application/broadcast/equipment-list'},
                {label: 'equipmentDetail'}
              ]
            },
          },
          {
            path: 'equipment-list/group-policy-details',
            component: BroadcastGroupDetailsComponent,
            data: {
              breadcrumb: [
                {label: 'application'},
                {label: 'broadcast'},
                {label: 'equipmentList', url: '/business/application/broadcast/equipment-list'},
                {label: 'groupDetails'}
              ]
            },
          },
          {
            path: 'policy-control',
            component: BroadcastPolicyControlComponent,
            data: {
              breadcrumb: [{label: 'application'}, {label: 'broadcast'}, {label: 'broadcastStrategy'}]
            }
          },
          {
            path: 'broadcast-content-list',
            component: BroadcastContentListComponent,
            data: {
              breadcrumb: [{label: 'application'}, {label: 'broadcast'}, {label: 'contentList'}]
            },
          },
          {
            path: 'broadcast-content-list/:type',
            component: BroadcastContentListAddComponent,
            data: {
              breadcrumb: [
                {label: 'application'},
                {label: 'broadcast'},
                {label: 'contentList', url: '/business/application/broadcast/broadcast-content-list'},
                {label: 'content'}
              ]
            },
          },
          {
            path: 'broadcast-content-examine',
            component: BroadcastContentExamineComponent,
            data: {
              breadcrumb: [{label: 'application'}, {label: 'broadcast'}, {label: 'contentExamine'}]
            },
          },
          {
            path: 'broadcast-content-examine/policy-details',
            component: BroadcastContentExamineDetailsComponent,
            data: {
              breadcrumb: [
                {label: 'application'},
                {label: 'broadcast'},
                {label: 'contentExamine', url: '/business/application/broadcast/broadcast-content-examine'},
                {label: 'contentDetails'}
              ]
            },
          },
          {
            path: 'broadcast-sound-record',
            component: HistoryAudioListComponent,
            data: {
              breadcrumb: [{label: 'application'}, {label: 'broadcast'}, {label: 'historyAudioList'}]
            },
          },
        ]
      },
    ]
  }
];
