import {NgModule} from '@angular/core';
import {SystemSettingComponent} from './system-setting.component';
import {MemuManagementComponent} from './memu-management/memu-management.component';
import {SharedModule} from '../../shared-module/shared-module.module';

import {RouterModule} from '@angular/router';
import {ROUTER_CONFIG} from './system-setting.routes';
import {ColumnConfigService} from './share/service/column-config.service';
import {MenuAddComponent} from './memu-management/menu-add/menu-add.component';
import {MenuTreeComponent} from './memu-management/menu-tree/menu-tree.component';
import {MenuTreeOperateService} from './share/service/menu-tree-operate.service';
import {LogManagementComponent} from './log-management/log-management.component';
import {FacilityAgreementComponent} from './agreement-management/facility-agreement/facility-agreement.component';
import {AgreementManagementComponent} from './agreement-management/agreement-management.component';
import {SecurityPolicyComponent} from './security-policy/security-policy.component';
import {AccessControlComponent} from './security-policy/access-control/access-control.component';
import {AccessControlDetialComponent} from './security-policy/access-control/access-control-detial/access-control-detial.component';
import {IdSecurityPolicyComponent} from './security-policy/id-security-policy/id-security-policy.component';
import {SystemParameterComponent} from './system-parameter/system-parameter.component';
import {AboutComponent} from './about/about.component';
import {ConfigAgreementComponent} from './agreement-management/config-agreement/config-agreement.component';
import {LicenseComponent} from './license/license.component';
import {FirstViewMenuComponent} from './memu-management/left-view-menu/first-view-menu/first-view-menu.component';
import {ThreeViewMenuComponent} from './memu-management/left-view-menu/three-menu/three-view-menu.component';
import {AlarmDumpPolicyComponent} from './alarm-dump-policy/alarm-dump-policy.component';
import {AsyncRuleUtil} from '../../shared-module/util/async-rule-util';
import {SystemParameterService} from './share/service';
import { BackupSettingComponent } from './backup-setting/backup-setting.component';
import {ProtocolScriptAddComponent} from './agreement-management/facility-agreement/add/protocol-script-add.component';
import { ProductListSelectorComponent } from './agreement-management/facility-agreement/product-list-selector/product-list-selector.component';
import {ProductForCommonService} from '../../core-module/api-service/product/product-for-common.service';
import { LogInstructionComponent } from './log-instruction/log-instruction.component';

@NgModule({
  declarations: [
    SystemSettingComponent,
    MemuManagementComponent,
    MenuAddComponent,
    MenuTreeComponent,
    LogManagementComponent,
    FacilityAgreementComponent,
    AgreementManagementComponent,
    SecurityPolicyComponent,
    AccessControlComponent,
    AccessControlDetialComponent,
    IdSecurityPolicyComponent,
    SystemParameterComponent,
    AboutComponent,
    ConfigAgreementComponent,
    LicenseComponent,
    FirstViewMenuComponent,
    ThreeViewMenuComponent,
    AlarmDumpPolicyComponent,
    BackupSettingComponent,
    ProtocolScriptAddComponent,
    ProductListSelectorComponent,
    LogInstructionComponent
  ],
  imports: [
    SharedModule,
    RouterModule.forChild(ROUTER_CONFIG)
  ],
  providers: [ColumnConfigService, MenuTreeOperateService, AsyncRuleUtil, SystemParameterService, ProductForCommonService],
})

export class SystemSettingModule {
}
