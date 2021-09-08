import {NgModule} from '@angular/core';
import {SharedModule} from '../../shared-module/shared-module.module';
import {RouterModule} from '@angular/router';
import {AsyncRuleUtil} from '../../shared-module/util/async-rule-util';
import {ROUTER_CONFIG} from './tenant.routes';
import {TenantComponent} from './tenant.component';
import {CoreModule} from '../../core-module/core-module.module';
import {NgxEchartsModule} from 'ngx-echarts';
import {AdminConfigComponent} from './admin-config/admin-config.component';
import {SystemTenantComponent} from './system-tenant/system-tenant.component';
import {TenantDetailComponent} from './tenant-detail/tenant-detail.component';
import {ReceptionConfigComponent} from './reception-config/reception-config.component';
import {MenuConfigComponent} from './reception-config/menu-config/menu-config.component';
import {RoleConfigComponent} from './reception-config/role-config/role-config.component';
import {IndexConfigComponent} from './reception-config/index-config/index-config.component';
import {DeviceConfigComponent} from './reception-config/device-config/device-config.component';
import {AlarmConfigComponent} from './reception-config/alarm-config/alarm-config.component';
import {TenantMenuTreeComponent} from './reception-config/tenant-menu-tree/tenant-menu-tree.component';
import {TenantMenuTreeOperateService} from './share/sevice/menu-tree-operate.service';
import {UserUtilService} from './share/sevice/user-util.service';


@NgModule({
  declarations: [
    TenantComponent,
    AdminConfigComponent,
    SystemTenantComponent,
    TenantDetailComponent,
    ReceptionConfigComponent,
    MenuConfigComponent,
    RoleConfigComponent,
    IndexConfigComponent,
    DeviceConfigComponent,
    AlarmConfigComponent,
    TenantMenuTreeComponent
  ],
  imports: [
    SharedModule,
    RouterModule.forChild(ROUTER_CONFIG),
    NgxEchartsModule,
    CoreModule
  ],
  providers: [AsyncRuleUtil, TenantMenuTreeOperateService, UserUtilService]
})

export class TenantModule {
}
