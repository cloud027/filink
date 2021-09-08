import {NzI18nService} from 'ng-zorro-antd';
import {FacilityName} from './facility-name';

/**
 * 操作(显示和隐藏)首页组件
 */
export class MapControl extends FacilityName {
  isExpandFacilityStatus: boolean = false; // 是否展开设施状态筛选组件
  // 点击后的模态框
  isShowFacilityPanel: boolean = false;         // 是否展开设施详情面板
  // 模拟鼠标移上去时的提示框
  isShowClustererFacilityTable: boolean = false;     // 是否显示聚合点设施详情
  isShowLeftComponents: boolean = true;      // 是否显示左侧筛选组件

  constructor(public $nzI18n: NzI18nService) {
    super($nzI18n);
  }

  /**
   * 显示左侧组件
   */
  showLeftComponents() {
    this.isShowLeftComponents = true;
  }

  /**
   * 隐藏左侧组件
   */
  hideLeftComponents() {
    this.isShowLeftComponents = false;
  }

  /**
   * 显示设施详情面板
   */
  showFacilityPanel() {
    this.isShowFacilityPanel = true;
  }

  /**
   * 隐藏设施详情面板
   */
  hideFacilityPanel() {
    this.isShowFacilityPanel = false;
  }

  /**
   * 点击展开显示聚合点设施详情
   */
  showClustererFacilityTable() {
    this.isShowClustererFacilityTable = true;
  }

  /**
   * 隐藏聚合点设施详情
   */
  hideClustererFacilityTable() {
    this.isShowClustererFacilityTable = false;
  }
}
