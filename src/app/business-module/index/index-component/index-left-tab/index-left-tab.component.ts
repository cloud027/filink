import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {IndexLanguageInterface} from '../../../../../assets/i18n/index/index.language.interface';
import {NzI18nService} from 'ng-zorro-antd';
import {LanguageEnum} from '../../../../shared-module/enum/language.enum';
import {SessionUtil} from '../../../../shared-module/util/session-util';

/**
 * 首页左侧悬浮框tabList页面
 */

@Component({
  selector: 'app-index-left-tab',
  templateUrl: './index-left-tab.component.html',
  styleUrls: ['./index-left-tab.component.scss']
})
export class IndexLeftTabComponent implements OnInit {
  // 首页国际化
  public indexLanguage: IndexLanguageInterface;
  // 左侧tabList列表
  @Input() tabList: any[];
  // 当前选中的tab
  @Input() active: string;
  // 判断设施设备工单列表区域变量
  @Input() AreaType: string;
  // 切换tab
  @Output() tabChange = new EventEmitter<string>();

  // ---------运维数据-----------
  // 设施设备列表区域权限
  public deviceAreaTenantRole: boolean = false;
  // 工单列表区域权限
  public workOrderAreaTenantRole: boolean = false;
  // 设施类型权限
  public deviceTypeTenantRole: boolean = false;
  // 设备类型权限
  public equipmentTypeTenantRole: boolean = false;
  // 工单类型权限
  public workOrderTypeTenantRole: boolean = false;
  // 工单状态权限
  public workOrderStateTenantRole: boolean = false;
  // 分组权限
  public groupTenantRole: boolean = false;

  // ---------项目数据-----------
  // 项目
  public project: boolean = false;
  // 智慧杆型号
  public smartPoleModelProject: boolean = false;
  // 建设状态
  public constructionStatusProject: boolean = false;


  // ---------规划数据-----------
  // 规划
  public planning: boolean = false;
  // 智慧杆型号
  public smartPoleModelPlanning: boolean = false;
  // 建设状态
  public constructionStatusPlanning: boolean = false;


  constructor(private $nzI18n: NzI18nService) {
  }

  /**
   * 初始化
   */
  public ngOnInit(): void {
    this.indexLanguage = this.$nzI18n.getLocaleData(LanguageEnum.index);
    this.isTenantRole();
  }

  /**
   * 左边的tab切换
   * param key
   */
  public tabClick(key: string) {
    if (key === this.active) {
      return;
    }
    this.tabChange.emit(key);
  }

  /**
   * 判断租户权限
   */
  public isTenantRole(): void {
    // ---------运维数据-----------
    // 设施设备列表区域权限
    this.deviceAreaTenantRole = SessionUtil.checkHasTenantRole('1-1-1-1');
    // 设施类型权限
    this.deviceTypeTenantRole = SessionUtil.checkHasTenantRole('1-1-1-2');
    // 设备类型权限
    this.equipmentTypeTenantRole = SessionUtil.checkHasTenantRole('1-1-1-3');
    // 分组权限
    this.groupTenantRole = SessionUtil.checkHasTenantRole('1-1-1-4');
    // 工单列表区域权限
    this.workOrderAreaTenantRole = SessionUtil.checkHasTenantRole('1-1-3-1');
    // 工单类型权限
    this.workOrderTypeTenantRole = SessionUtil.checkHasTenantRole('1-1-3-2');
    // 工单状态权限
    this.workOrderStateTenantRole = SessionUtil.checkHasTenantRole('1-1-3-3');

    // ---------项目数据-----------
    // 项目
    this.project = SessionUtil.checkHasTenantRole('2-1-1');
    // 智慧杆型号
    this.smartPoleModelProject = SessionUtil.checkHasTenantRole('2-1-2');
    // 建设状态
    this.constructionStatusProject = SessionUtil.checkHasTenantRole('2-1-3');


    // ---------规划数据-----------
    // 规划
    this.planning = SessionUtil.checkHasTenantRole('3-1-1');
    // 智慧杆型号
    this.smartPoleModelPlanning = SessionUtil.checkHasTenantRole('3-1-2');
    // 建设状态
    this.constructionStatusPlanning = SessionUtil.checkHasTenantRole('3-1-3');


    // 设施设备列表区域权限
    if (!this.deviceAreaTenantRole && this.AreaType === 'deviceArea') {
      const newTabList = this.tabList.filter(item => item.key !== 'tabArea');
      this.tabList = newTabList;
    }
    // 工单列表区域权限
    if (!this.workOrderAreaTenantRole && this.AreaType === 'workOrderArea') {
      const newTabList = this.tabList.filter(item => item.key !== 'tabArea');
      this.tabList = newTabList;
    }
    // 设施类型权限
    if (!this.deviceTypeTenantRole) {
      const newTabList = this.tabList.filter(item => item.key !== 'facilityTypeTitle');
      this.tabList = newTabList;
    }
    // 设备类型权限
    if (!this.equipmentTypeTenantRole) {
      const newTabList = this.tabList.filter(item => item.key !== 'equipmentTypeTitle');
      this.tabList = newTabList;
    }
    // 工单类型权限
    if (!this.workOrderTypeTenantRole) {
      const newTabList = this.tabList.filter(item => item.key !== 'workOrderType');
      this.tabList = newTabList;
    }
    // 工单状态权限
    if (!this.workOrderStateTenantRole) {
      const newTabList = this.tabList.filter(item => item.key !== 'workOrderStatus');
      this.tabList = newTabList;
    }
    // 分组权限
    if (!this.groupTenantRole) {
      const newTabList = this.tabList.filter(item => item.key !== 'group');
      this.tabList = newTabList;
    }


    // 项目
    if (!this.project) {
      const newTabList = this.tabList.filter(item => item.key !== 'project');
      this.tabList = newTabList;
    }
    // 智慧杆型号
    if (!this.smartPoleModelProject) {
      const newTabList = this.tabList.filter(item => item.key !== 'smartPoleModelProject');
      this.tabList = newTabList;
    }
    // 建设状态
    if (!this.constructionStatusProject) {
      const newTabList = this.tabList.filter(item => item.key !== 'constructionStatusProject');
      this.tabList = newTabList;
    }


    // 项目
    if (!this.planning) {
      const newTabList = this.tabList.filter(item => item.key !== 'planning');
      this.tabList = newTabList;
    }
    // 智慧杆型号
    if (!this.smartPoleModelPlanning) {
      const newTabList = this.tabList.filter(item => item.key !== 'smartPoleModelPlanning');
      this.tabList = newTabList;
    }
    // 建设状态
    if (!this.constructionStatusPlanning) {
      const newTabList = this.tabList.filter(item => item.key !== 'constructionStatusPlanning');
      this.tabList = newTabList;
    }


  }
}
