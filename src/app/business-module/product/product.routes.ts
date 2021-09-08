import {ProductComponent} from './product.component';
import {Routes} from '@angular/router';
import {ProductListComponent} from './product-manage/product-list/product-list.component';
import {ProductDetailComponent} from './product-manage/product-detail/product-detail.component';
import {ProductViewDetailComponent} from './product-manage/product-view-detail/product-view-detail.component';
import {ProductTemplateComponent} from './product-manage/product-template/product-template.component';
import {ProductWisdomComponent} from './product-manage/product-wisdom/product-wisdom.component';
import {ProductGatewayComponent} from './product-manage/product-gateway/product-gateway.component';

export const ROUTER_CONFIG: Routes = [
  {
    path: '',
    component: ProductComponent,
    children: [
      { // 产品列表
        path: 'product-list',
        component: ProductListComponent,
        data: {
          breadcrumb: [{label: 'productManage'}, {label: 'productList'}]
        }
      },
      { // 新增或编辑产品信息
        path: 'product-detail/:type',
        component: ProductDetailComponent,
        data: {
          breadcrumb: [{label: 'productManage'}, {label: 'productList', url: 'product-list'}, {label: 'product'}]
        }
      },
      { // 新增或者上传杆型图
        path: 'product-wisdom/add',
        component: ProductWisdomComponent,
        data: {
          breadcrumb: [
            {label: 'productManage'},
            {label: 'productList', url: 'product-list'},
            /*{label: 'addProduct',  url: 'product-detail/add'},*/
            {label: 'addPoleImg'}]
        }
      },
      { // 编辑智慧杆
        path: 'product-wisdom/update',
        component: ProductWisdomComponent,
        data: {
          breadcrumb: [
            {label: 'productManage'},
            {label: 'productList', url: 'product-list'},
            /*{label: 'updateProduct',  url: 'product-detail/update', queryParamsHandling: 'preserve'},*/
            {label: 'updatePoleImg'}]
        }
      },
      { // 产品详情
        path: 'product-view-detail',
        component: ProductViewDetailComponent,
        data: {
          breadcrumb: [{label: 'productManage'}, {label: 'productList', url: 'product-list'}, {label: 'productViewDetail'}]
        }
      },
      { // 产品模版
        path: 'product-template',
        component: ProductTemplateComponent,
        data: {
          breadcrumb: [{label: 'productManage'}, {label: 'productList', url: 'product-list'}, {label: 'productTemplate'}]
        }
      },
      { // 上传网关图
        path: 'product-gateway/add',
        component: ProductGatewayComponent,
        data: {
          breadcrumb: [
            {label: 'productManage'},
            {label: 'productList', url: 'product-list'},
            /*{label: 'addProduct', url: 'product-detail/add'},*/
            {label: 'addGatewayImg'}]
        }
      },
      { // 编辑网关图
        path: 'product-gateway/update',
        component: ProductGatewayComponent,
        data: {
          breadcrumb: [
            {label: 'productManage'},
            {label: 'productList', url: 'product-list'},
            /*{label: 'updateProduct', url: 'product-detail/update', queryParamsHandling: 'preserve'},*/
            {label: 'updateGatewayImg'}]
        }
      },
    ]
  }
];
