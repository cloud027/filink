import {Routes} from '@angular/router';
import {TopologyComponent} from './topology.component';

export const ROUTER_CONFIG: Routes = [
  {
    path: '',
    component: TopologyComponent,
    data: {
      breadcrumb: [{label: 'topologyComponent'}]
    }
  },
  {
    path: 'topology/:type',
    component: TopologyComponent,
    data: {
      breadcrumb: [{label: 'topologyComponent'}]
    }
  },
];
