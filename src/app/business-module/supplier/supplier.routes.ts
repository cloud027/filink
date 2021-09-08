import {Routes} from '@angular/router';
import {SupplierComponent} from './supplier.component';
import {SupplierManageComponent} from './supplier-manage/supplier-manage.component';
import {AddSupplierComponent} from './supplier-manage/add-supplier/add-supplier.component';
export const ROUTER_CONFIG: Routes = [
  {
    path: '',
    component: SupplierComponent,
    children: [
      {
        // 供应商管理
        path: 'supplier-manage',
        component: SupplierManageComponent,
        data: {
          breadcrumb: [{label: 'supplierManage'}]
        }
      },
      {
        // 新增或编辑供应商
        path: 'supplier-manage/:type',
        component: AddSupplierComponent,
        data: {
          breadcrumb: [{label: 'supplierManage', url: 'supplier-manage'}, {label: 'supplier'}]
        }
      }
    ]
  }
];
