import {Routes} from '@angular/router';
import {StorageSynopsisComponent} from './storage-manage/storage-synopsis/storage-synopsis.component';
import {StorageComponent} from './storage.component';
import {WarehousingComponent} from './storage-manage/warehousing/warehousing.component';
import {AddWarehousingComponent} from './storage-manage/warehousing/add-warehousing/add-warehousing.component';
import {DeliveryComponent} from './storage-manage/delivery/delivery.component';
import {AddDeliveryComponent} from './storage-manage/delivery/add-delivery/add-delivery.component';
import {DeliveryOperateComponent} from './storage-manage/delivery/delivery-operate/delivery-operate.component';
import {ModifyDeliveryComponent} from './storage-manage/delivery/modify-delivery/modify-delivery.component';
export const ROUTER_CONFIG: Routes = [
  {
    path: '',
    component: StorageComponent,
    children: [
      {
        // 库存总览
        path: 'storage-synopsis',
        component: StorageSynopsisComponent,
        data: {
          breadcrumb: [{label: 'storageManage'}, {label: 'storageSynopsis'}]
        }
      },
      {
        // 物料入库
        path: 'warehousing',
        component: WarehousingComponent,
        data: {
          breadcrumb: [{label: 'storageManage'}, {label: 'warehousing'}]
        }
      },
      {
        // 新增或编辑物料入库
        path: 'warehousing/:type',
        component: AddWarehousingComponent,
        data: {
          breadcrumb: [{label: 'storageManage'}, {label: 'warehousing', url: 'warehousing'}, {label: 'warehousingMaterial'}]
        }
      },
      {
        // 物料出库
        path: 'delivery',
        component: DeliveryComponent,
        data: {
          breadcrumb: [{label: 'storageManage'}, {label: 'delivery'}]
        }
      },
      {
        // 新增物料出库
        path: 'delivery/add',
        component: AddDeliveryComponent,
        data: {
          breadcrumb: [{label: 'storageManage'}, {label: 'delivery', url: 'delivery'}, {label: 'addDeliveryMaterial'}]
        }
      },
      {
        // 编辑物料出库
        path: 'delivery/update',
        component: ModifyDeliveryComponent,
        data: {
          breadcrumb: [{label: 'storageManage'}, {label: 'delivery', url: 'delivery'}, {label: 'updateDeliveryMaterial'}]
        }
      },
      {
        // 提交出库信息
        path: 'submit-delivery',
        component: DeliveryOperateComponent,
        data: {
          breadcrumb: [{label: 'storageManage'}, {label: 'delivery', url: 'delivery'}, {label: 'deliveryOperate'}]
        }
      }
    ]
  }
];
