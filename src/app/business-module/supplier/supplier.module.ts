import { NgModule } from '@angular/core';
import {SharedModule} from '../../shared-module/shared-module.module';
import {CoreModule} from '../../core-module/core-module.module';
import { RouterModule } from '@angular/router';
import {ROUTER_CONFIG} from './supplier.routes';
import {SupplierComponent} from './supplier.component';
import {SupplierManageComponent} from './supplier-manage/supplier-manage.component';
import {SupplierApiService} from './share/service/supplier-api.service';
import { AddSupplierComponent } from './supplier-manage/add-supplier/add-supplier.component';

@NgModule({
  declarations: [SupplierComponent, SupplierManageComponent, AddSupplierComponent],
  imports: [
    SharedModule,
    RouterModule.forChild(ROUTER_CONFIG),
    CoreModule
  ],
  providers: [SupplierApiService]
})
export class SupplierModule { }
