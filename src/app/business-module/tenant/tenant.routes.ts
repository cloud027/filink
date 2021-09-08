import {Routes} from '@angular/router';
import {TenantComponent} from './tenant.component';
import {SystemTenantComponent} from './system-tenant/system-tenant.component';
import {TenantDetailComponent} from './tenant-detail/tenant-detail.component';
import {AdminConfigComponent} from './admin-config/admin-config.component';
import {ReceptionConfigComponent} from './reception-config/reception-config.component';


export const ROUTER_CONFIG: Routes = [
  {
    path: '',
    component: TenantComponent,
    children: [
      {
        path: 'tenant-list',
        component: SystemTenantComponent,
        data: {
          breadcrumb: [
            {label: 'tenantManagement'},
            {label: 'systemTenants'}
          ]
        }
      },
      {
        path: 'system-tenant/add',
        component: TenantDetailComponent,
        data: {
          breadcrumb: [
            {label: 'tenantManagement'},
            {label: 'systemTenants', url: 'tenant-list'},
            {label: 'tenantAdd'}
          ]
        }
      },
      {
        path: 'system-tenant/update',
        component: TenantDetailComponent,
        data: {
          breadcrumb: [
            {label: 'tenantManagement'},
            {label: 'systemTenants', url: 'tenant-list'},
            {label: 'tenantModify'}
          ]
        }
      },
      {
        path: 'tenant-admin-config/add',
        component: AdminConfigComponent,
        data: {
          breadcrumb: [
            {label: 'tenantManagement'},
            {label: 'systemTenants', url: 'tenant-list'},
            {label: 'tenantAdminAdd'}
          ]
        }
      },
      {
        path: 'tenant-admin-config/update',
        component: AdminConfigComponent,
        data: {
          breadcrumb: [
            {label: 'tenantManagement'},
            {label: 'systemTenants', url: 'tenant-list'},
            {label: 'tenantAdminModify'}
          ]
        }
      },
      {
        path: 'reception-config',
        component: ReceptionConfigComponent,
        data: {
          breadcrumb: [
            {label: 'tenantManagement'},
            {label: 'systemTenants', url: 'tenant-list'},
            {label: 'tenantReceptionConfig'}
          ]
        }
      },
    ]
  }
];
