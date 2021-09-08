import {Routes} from '@angular/router';
import {DownloadComponent} from './download.component';

export const ROUTER_CONFIG: Routes = [
  {
    path: '',
    component: DownloadComponent,
    data: {
      breadcrumb: [{ label: 'exportManagement'}]
    }
  }
];
