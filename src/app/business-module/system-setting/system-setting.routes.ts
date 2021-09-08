import {Routes} from '@angular/router';
import {SystemSettingComponent} from './system-setting.component';
import {MemuManagementComponent} from './memu-management/memu-management.component';
import {MenuAddComponent} from './memu-management/menu-add/menu-add.component';
import {LogManagementComponent} from './log-management/log-management.component';
import {AgreementManagementComponent} from './agreement-management/agreement-management.component';
import {FacilityAgreementComponent} from './agreement-management/facility-agreement/facility-agreement.component';
import {SecurityPolicyComponent} from './security-policy/security-policy.component';
import {AccessControlComponent} from './security-policy/access-control/access-control.component';
import {IdSecurityPolicyComponent} from './security-policy/id-security-policy/id-security-policy.component';
import {SystemParameterComponent} from './system-parameter/system-parameter.component';
import {AboutComponent} from './about/about.component';
import {ConfigAgreementComponent} from './agreement-management/config-agreement/config-agreement.component';
import {LicenseComponent} from './license/license.component';
import {AlarmDumpPolicyComponent} from './alarm-dump-policy/alarm-dump-policy.component';
import { BackupSettingComponent } from './backup-setting/backup-setting.component';
import {ProtocolScriptAddComponent} from './agreement-management/facility-agreement/add/protocol-script-add.component';
import {LogInstructionComponent} from './log-instruction/log-instruction.component';


export const ROUTER_CONFIG: Routes = [
  {
    path: '',
    component: SystemSettingComponent,
    children: [
      {
        path: 'menu',
        data: {
          breadcrumb: [{label: 'systemSetting'}, {label: 'menuManagement', url: '/business/system/menu'}]
        },
        component: MemuManagementComponent
      },
      {
        path: 'menu-add',
        data: {
          breadcrumb: [{label: 'systemSetting'},
                       {label: 'menuManagement', url: '/business/system/menu'},
            {label: 'menuAdd'}]
        },
        component: MenuAddComponent
      },
      {
        path: 'menu-update/:id',
        data: {
          breadcrumb: [{label: 'systemSetting'},
            {label: 'menuManagement', url: '/business/system/menu'},
            {label: 'menuUpdate'}]
        },
        component: MenuAddComponent
      },
      {
        path: 'log',
        data: {
          breadcrumb: [
            {label: 'systemSetting'},
            {label: 'logManagement'},
            {label: 'operateLog', url: '/business/system/log'}]
        },
        component: LogManagementComponent
      },
      {
        path: 'log/security',
        data: {
          breadcrumb: [
            {label: 'systemSetting'},
            {label: 'logManagement'},
            {label: 'securityLog', url: '/business/system/log/security'}
          ]
        },
        component: LogManagementComponent
      },
      {
        path: 'log/system',
        data: {
          breadcrumb: [
            {label: 'systemSetting'},
            {label: 'logManagement'},
            {label: 'systemLog', url: '/business/system/log/system'}]
        },
        component: LogManagementComponent
      },
      {
        path: 'log/instruction',
        data: {
          breadcrumb: [
            {label: 'systemSetting'},
            {label: 'logManagement'},
            {label: 'instructionLog', url: '/business/system/log/instruction'}
          ]
        },
        component: LogInstructionComponent
      },
      {
        path: 'agreement',
        component: AgreementManagementComponent,
        children: [
          {
            path: 'facility',
            component: FacilityAgreementComponent,
            data: {
              breadcrumb: [{label: 'systemSetting'},
                           {label: 'agreementManagement'},
                           {label: 'accessProtocolManagement'}]
            },
          },
          {
            path: 'facility/:type',
            component: ProtocolScriptAddComponent,
            data: {
              breadcrumb: [{label: 'systemSetting'},
                {label: 'agreementManagement'},
                {label: 'accessProtocolManagement', url: '/business/system/agreement/facility'},
                {label: 'protocolScript'}
              ]
            },
          },
          {
            path: 'config/:configType',
            component: ConfigAgreementComponent,
            data: {
              breadcrumb: [{label: 'systemSetting'},
                {label: 'agreementManagement'}
              ]
            },
          }
        ]
      },
      {
        path: 'security-policy',
        component: SecurityPolicyComponent,
        children: [
          {
            path: 'access-control',
            component: AccessControlComponent,
            data: {
              breadcrumb: [{label: 'systemSetting'},
                {label: 'securityPolicy'}]
            },
          },
          {
            path: 'account',
            component: IdSecurityPolicyComponent,
            data: {
              breadcrumb: [{label: 'systemSetting'},
                {label: 'securityPolicy'}]
            },
          },
          {
            path: 'password',
            component: IdSecurityPolicyComponent,
            data: {
              breadcrumb: [{label: 'systemSetting'},
                {label: 'securityPolicy'}]
            },
          }
        ]
      },
      {
        path: 'system-parameter/:settingType',
        component: SystemParameterComponent,
        data: {
          breadcrumb: [{label: 'systemSetting'},
            {label: 'systemParameter'}]
        },
      },
      {
        path: 'about',
        component: AboutComponent,
        data: {
          breadcrumb: [{label: 'systemSetting'},
            {label: 'about'}]
        },
      },
      {
        path: 'license',
        component: LicenseComponent,
        data: {
          breadcrumb: [{label: 'systemSetting'},
            {label: 'license'}]
        },
      },
      {
        path: 'backup-setting',
        component: BackupSettingComponent,
        data: {
          breadcrumb: [{label: 'systemSetting'},
            {label: 'backupSetting'}]
        },
      },
      {   // 告警转储
        path: 'dump/alarm',
        data: {
          breadcrumb: [
            {label: 'systemSetting'},
            {label: 'dumpSetting'},
            {label: 'alarmDumpPolicy'}]
        },
        component: AlarmDumpPolicyComponent
      },
      {  // 系统日志转储
        path: 'dump/system-log',
        data: {
          breadcrumb: [
            {label: 'systemSetting'},
            {label: 'dumpSetting'},
            {label: 'systemLogDumpPolicy'}]
        },
        component: AlarmDumpPolicyComponent
      },
      {  // 设施日志转储
        path: 'dump/facility-log',
        data: {
          breadcrumb: [
            {label: 'systemSetting'},
            {label: 'dumpSetting'},
            {label: 'equipmentLogDumpPolicy'}]
        },
        component: AlarmDumpPolicyComponent
      },
      {  // 巡检工单转储
        path: 'dump/inspection',
        data: {
          breadcrumb: [
            {label: 'systemSetting'},
            {label: 'dumpSetting'},
            {label: 'inspectionDumpStrategy'}]
        },
        component: AlarmDumpPolicyComponent
      },
      {  //  销障工单转储
        path: 'dump/clear-barrier',
        data: {
          breadcrumb: [
            {label: 'systemSetting'},
            {label: 'dumpSetting'},
            {label: 'clearBarrierLogDumpStrategy'}]
        },
        component: AlarmDumpPolicyComponent
      },
      {  //  安装工单转储
        path: 'dump/installation',
        data: {
          breadcrumb: [
            {label: 'systemSetting'},
            {label: 'dumpSetting'},
            {label: 'installationDumpStrategy'}]
        },
        component: AlarmDumpPolicyComponent
      },
      {  //  告警确认工单转储
        path: 'dump/alarm-confirm',
        data: {
          breadcrumb: [
            {label: 'systemSetting'},
            {label: 'dumpSetting'},
            {label: 'alarmConfirmDumpStrategy'}]
        },
        component: AlarmDumpPolicyComponent
      },
      {  //  故障转储
        path: 'dump/trouble',
        data: {
          breadcrumb: [
            {label: 'systemSetting'},
            {label: 'dumpSetting'},
            {label: 'troubleDumpStrategy'}]
        },
        component: AlarmDumpPolicyComponent
      },
    ]
  },
];
