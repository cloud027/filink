import { Component, OnInit, Input, Output, EventEmitter, ViewChild, OnDestroy } from '@angular/core';
import { NzI18nService, NzModalService } from 'ng-zorro-antd';

import { LanguageEnum } from '../../../../../shared-module/enum/language.enum';
import { WorkOrderLanguageInterface } from '../../../../../../assets/i18n/work-order/work-order.language.interface';

import { CommonLanguageInterface } from '../../../../../../assets/i18n/common/common.language.interface';

import { WarnTabComponent } from './coomponents/warn-tab/warn-tab.component';
import { TroubleTabComponent } from './coomponents/trouble-tab/trouble-tab.component';
import { DismantleWarnTroubleEnum } from '../../../share/enum/dismantle-barrier.config.enum';
@Component({
  selector: 'app-form-dismantle-type',
  templateUrl: './form-dismantle-type.component.html',
  styleUrls: ['./form-dismantle-type.component.scss'],
})
/** 选择 告警 故障 tab */
export class FormDismantleTypeComponent implements OnInit, OnDestroy {
  @ViewChild('warnTab') warnTab: WarnTabComponent;
  @ViewChild('troubleTab') troubleTab: TroubleTabComponent;
  @Input()
  set dismantleTypeVisible(params) {
    this._dismantleTypeVisible = params;
    this.dismantleTypeVisibleChange.emit(this._dismantleTypeVisible);
  }
  // 获取modal框显示状态
  get dismantleTypeVisible() {
    return this._dismantleTypeVisible;
  }

  /** 选中的数据回显 id */
  @Input() selectDataId: string;
      /** 选中的数据回显 name */
  @Input() selectDataName: string;

  /** 数据过滤的条件 */
  @Input() filterData;
  /** 选中的数据类型 */
  @Input() selectDataType: DismantleWarnTroubleEnum;

  // 显示隐藏变化
  @Output() public dismantleTypeVisibleChange = new EventEmitter<any>();
  // 选中的值变化
  @Output() public selectDataChange = new EventEmitter<any>();
  // 显示隐藏
  public _dismantleTypeVisible = false;
  // 选择的是故障还是告警
  WarnTroubleType:string = '1'
  /** 关联告警 关联故障 的类型 */
  DismantleWarnTroubleEnum = DismantleWarnTroubleEnum;

  language: WorkOrderLanguageInterface;
  // 首页语言包
  public commonLanguage: CommonLanguageInterface;
  constructor(public $nzI18n: NzI18nService, public $modal: NzModalService) {}

  ngOnInit() {
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.workOrder);
    this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
  }
  ngOnDestroy() {
    this.warnTab = null;
    this.troubleTab = null;
  }
  // -----------------------------告警-------------------------
  warnPageChange() {}
  // -----------------------------告警-------------------------

  // -----------------------------故障-------------------------
  troublePageChange() {}
  // -----------------------------故障-------------------------

  /** 用来判断是 告警表格的点击事件 还是 故障表格的点击事件 */
  radioClickChange(type: DismantleWarnTroubleEnum) {
    if (type === DismantleWarnTroubleEnum.warn) {
      this.troubleTab.clearSelectedData();
    } else if (type === DismantleWarnTroubleEnum.trouble) {
      this.warnTab.clearSelectedData();
    }
    this.WarnTroubleType = type
  }
  listTypeChange(type: DismantleWarnTroubleEnum){
    if (type === DismantleWarnTroubleEnum.warn) {
        this.WarnTroubleType = type
      } else if (type === DismantleWarnTroubleEnum.trouble) {
        this.WarnTroubleType = type
      }
  }


  /** 确认按钮 */
  Confirm() {
    let params = {
        refType: '',
        refId: '',
        refName: '',
      };
    if (this.WarnTroubleType === '1') {
    // 得到 告警选中的数据
        const getWarnSelectedData = this.warnTab.tranSelectedData();
        params.refType = DismantleWarnTroubleEnum.warn;
        params.refId = getWarnSelectedData.id;
        params.refName = getWarnSelectedData.alarmName;
    }else if(this.WarnTroubleType === '2'){
    // 得到 故障选中的数据
        const getTroubleSelectedData = this.troubleTab.tranSelectedData();
        params.refType = DismantleWarnTroubleEnum.trouble;
        params.refId = getTroubleSelectedData['id'];
        params.refName = getTroubleSelectedData['troubleCode'];
    }else { params = null; }
    this.selectDataChange.emit(params);
    this.dismantleTypeVisible = false;
  }

  clearSelectData() {
    // this._tableComponent.keepSelectedData.clear()
    // this._tableComponent.checkStatus()
    // this._selectedData = []
    // this.selectDevices = []
    // this.selectDeviceId = null
    // this.getRefreshData()
    this.selectDataId = null
    this.selectDataName = null
    // 调用子组件的方法
    this.warnTab.clearSelectedData();
    this.troubleTab.clearSelectedData();
  }
}
