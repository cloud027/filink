import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {MessageNotificationComponent} from './message-notification.component';
import {ROUTER_CONFIG} from './message-notification.routes';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../../shared-module/shared-module.module';
import {MessageService} from './share/service/message.service';
@NgModule({
  declarations: [MessageNotificationComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(ROUTER_CONFIG),
    SharedModule
  ],
  providers: [MessageService]
})
export class MessageNotificationModule {
}
