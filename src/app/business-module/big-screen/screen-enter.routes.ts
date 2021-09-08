import {Routes} from '@angular/router';

import {ScreenEnterComponent} from './screen-enter.component';

export const ROUTER_CONFIG: Routes = [
  {
    path: '',
    component: ScreenEnterComponent,
    data: {
      breadcrumb: [{ label: 'bigScreen'}]
    }
  }
];
