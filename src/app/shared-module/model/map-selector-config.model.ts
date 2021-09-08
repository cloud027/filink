/**
 * Created by xiaoconghu on 2019/1/7.
 * 地图选择器配置
 */
import {ColumnConfig} from './table-config.model';

export class MapSelectorConfigModel {
  title: string;
  mapData: any;
  selectedColumn: ColumnConfig[];
  width: string;
  height: string;
  showSearchSwitch: boolean;
}
