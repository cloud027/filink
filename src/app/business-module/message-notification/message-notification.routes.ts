import {Routes} from '@angular/router';
import {MessageNotificationComponent} from './message-notification.component';

export const ROUTER_CONFIG: Routes = [
  {
    path: '',
    component: MessageNotificationComponent,
    data: {
      breadcrumb: [{ label: 'messageNotification'}]
    }
  }
];
