import {NgModule} from '@angular/core';
import {SharedModule} from '../../shared-module/shared-module.module';
import {NgxEchartsModule} from 'ngx-echarts';
import {CoreModule} from '../../core-module/core-module.module';
import {ProductComponent} from './product.component';
import {ProductListComponent} from './product-manage/product-list/product-list.component';
import {RouterModule} from '@angular/router';
import {ROUTER_CONFIG} from './product.routes';
import {ProductDetailComponent} from './product-manage/product-detail/product-detail.component';
import {ProductApiService} from './share/service/product-api.service';
import {ProductWisdomPreviewComponent} from './product-manage/product-wisdom/wisdom-preview/product-wisdom-preview.component';
import {ProductViewDetailComponent} from './product-manage/product-view-detail/product-view-detail.component';
import {ProductEquipmentInformationComponent} from './product-manage/product-view-detail/product-equipment-information/product-equipment-information.component';
import {ProductInfrastructureDeviceComponent} from './product-manage/product-view-detail/product-infrastructure-device/product-infrastructure-device.component';
import {ProductTemplateComponent} from './product-manage/product-template/product-template.component';
import {ProductUploadWisdomComponent} from './product-manage/product-wisdom/upload-wisdom/product-upload-wisdom.component';
import {ProductWisdomComponent} from './product-manage/product-wisdom/product-wisdom.component';
import {ProductUpdateWisdomComponent} from './product-manage/product-wisdom/update-wisdom/product-update-wisdom.component';
import {ProductGatewayComponent} from './product-manage/product-gateway/product-gateway.component';
import {ProductGatewayUploadComponent} from './product-manage/product-gateway/product-gateway-upload/product-gateway-upload.component';
import {ProductGatewayUpdateComponent} from './product-manage/product-gateway/product-gateway-update/product-gateway-update.component';
import {ProductTypeTranslate} from './share/pipe/product-type-translate.pipe';
import {ProductIcon} from './share/pipe/product-type-icon.pipe';
import {ProductInfrastructureEquipmentComponent} from './product-manage/product-view-detail/product-infrastructure-equipment/product-infrastructure-equipment.component';
import { ProductFormTableComponent } from './product-manage/product-template/product-form-table/product-form-table.component';
import {DragDropModule} from '@angular/cdk/drag-drop';

@NgModule({
  declarations: [
    ProductComponent,
    ProductListComponent,
    ProductDetailComponent,
    ProductWisdomPreviewComponent,
    ProductViewDetailComponent,
    ProductEquipmentInformationComponent,
    ProductInfrastructureDeviceComponent,
    ProductTemplateComponent,
    ProductUploadWisdomComponent,
    ProductWisdomComponent,
    ProductUpdateWisdomComponent,
    ProductGatewayComponent,
    ProductGatewayUploadComponent,
    ProductGatewayUpdateComponent,
    ProductTypeTranslate,
    ProductInfrastructureEquipmentComponent,
    ProductIcon,
    ProductFormTableComponent,
  ],
  imports: [
    SharedModule,
    NgxEchartsModule,
    RouterModule.forChild(ROUTER_CONFIG),
    CoreModule,
    DragDropModule
  ],
  exports: [],
  providers: [ProductApiService]
})
export class ProductModule {
}
