import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CommonLanguageInterface} from '../../../../../assets/i18n/common/common.language.interface';
import {NzI18nService, NzModalService} from 'ng-zorro-antd';
import * as _ from 'lodash';
import {ProgramListModel} from '../../../../core-module/model/group/program-list.model';
import {InstructSendParamModel} from '../../../../core-module/model/group/instruct-send-param.model';
import {LanguageEnum} from '../../../enum/language.enum';
import {FacilityLanguageInterface} from '../../../../../assets/i18n/facility/facility.language.interface';
import {BulkOperateTypeEnum} from '../../../enum/bulk-operate-type.enum';
import {SessionUtil} from '../../../util/session-util';
import {ControlInstructEnum} from '../../../../core-module/enum/instruct/control-instruct.enum';
import {EquipmentTypeEnum} from '../../../../core-module/enum/equipment/equipment.enum';
import {PermissionConst} from '../../../../core-module/const/facility/permission.const';
import {EquipmentControlInitValue} from '../../../../core-module/const/facility/facility.const';

@Component({
  selector: 'app-equipment-bulk-operations',
  templateUrl: './equipment-bulk-operations.component.html',
  styleUrls: ['./equipment-bulk-operations.component.scss']
})
export class EquipmentBulkOperationsComponent implements OnInit {
  // 弹框是否开启设置
  @Input()
  set xcVisible(params) {
    this.isXcVisible = params;
    this.xcVisibleChange.emit(this.isXcVisible);
  }

  @Input() commonDisableFlag: boolean = false;
  // 弹框title
  @Input() title: string = '';
  // 是否展示信息屏幕控制
  @Input() isHasScreen: boolean = true;
  // 是否展示广播控制
  @Input() isHasBroadcast: boolean = true;
  // 是否展示照明控制
  @Input() isHasLight: boolean = true;
  // 信息屏播放内容
  @Input() screenContent: string = '';
  // 广播内容
  @Input() broadcastContent: string = '';
  // 节目信息
  @Input() program: ProgramListModel;
  // 信息屏节目是否展示
  @Input() screenPlayShow: boolean = true;
  // 请求未完成遮罩加载状态
  @Input() isShowOver: boolean = false;
  // 设备类型数组
  @Input() equipmentTypeCodes: string[] = [];
  // 照明亮度变化
  @Output() lightChangeValue = new EventEmitter<number>();
  // 信息屏幕亮度变化
  @Output() screenLightChangeValue = new EventEmitter<number>();
  // 信息屏幕音量变化
  @Output() screenVolumeChangeValue = new EventEmitter<number>();
  // 广播音量辩护
  @Output() broadcastVolumeChangeValue = new EventEmitter<number>();
  // 公共操作开关、上下电状态
  @Output() commonSwitchValue = new EventEmitter<ControlInstructEnum>();
  // 弹框是否显示
  @Output() xcVisibleChange = new EventEmitter<boolean>();
  // 广播同步播放事件 screenPlay
  @Output() broadcastPlay = new EventEmitter<boolean>();
  // 信息屏同步播放事件
  @Output() screenPlay = new EventEmitter<[{programId: string}]>();
  // 摄像头操作事件
  @Output() cameraChangeValue = new EventEmitter<string>();
  // 公共模块国际化
  public commonLanguage: CommonLanguageInterface;
  // 设施语言包
  public language: FacilityLanguageInterface;
  // 批量操作权限码
  public batchOperatePermission = PermissionConst;
  // 弹框是否开启
  public isXcVisible: boolean = false;
  // 照明亮度初始值
  public lightValue: number = EquipmentControlInitValue.lightValue;
  // 信息屏亮度初始值
  public screenLightValue: number = EquipmentControlInitValue.screenLightValue;
  // 信息屏音量初始值
  public screenVolumeValue: number = EquipmentControlInitValue.screenVolumeValue;
  // 广播音量初始值
  public broadcastValue: number = EquipmentControlInitValue.broadcastValue;
  // 操作指令枚举
  public controlInstructEnum = ControlInstructEnum;
  // 按钮下发指令类别枚举
  public bulkOperateTypeEnum = BulkOperateTypeEnum;
  // 初始图标
  public initIcon: boolean = true;
  // 设备类型枚举
  public equipmentTypeEnum = EquipmentTypeEnum;
  public deviceDisableFlag: boolean = true;

  get xcVisible() {
    return this.isXcVisible;
  }


  constructor(
    private $nzI18n: NzI18nService,
    private $modalService: NzModalService,
  ) {
  }

  ngOnInit(): void {
    // 国际化
    this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.facility);
    this.equipmentTypeCodes.forEach(item => {
      if (item !== 'E030' && item !== 'E006') {
        // this.commonDisableFlag = false;
        this.commonDisableFlag = this.checkHasRole(PermissionConst.turnOn) ? true : false;
      } else {
        this.commonDisableFlag = true;
      }
    });
  }

  /**
   * 广播同步播放事件
   */
  public broadcastPlayChange(type: BulkOperateTypeEnum): void {
    this.isSureOperate(type, true);
  }

  /**
   * 信息屏同步播放事件 本次不包含此功能，后期会加上
   */
  public screenPlayChange(type: BulkOperateTypeEnum): void {
    const body = new InstructSendParamModel();
    body.lightnessNum = this.screenLightValue;
    body.volume = this.screenVolumeValue;
    const program = {programId: this.program.programId};
    body.program = [program];
    this.isSureOperate(type, body);
  }

  /**
   * 判断是否有操作权限
   */
  public checkHasRole(codes: string[]): boolean {
    if (_.isEmpty(codes)) {
      return true;
    }
    const userInfo = SessionUtil.getUserInfo();
    if (userInfo && userInfo.role && userInfo.role.permissionList) {
      const perCodeList = userInfo.role.permissionList.map(v => v.id) || [];
      const tempArr = _.intersection(codes, perCodeList);
      return _.isEmpty(tempArr);
    } else {
      return true;
    }
  }

  /**
   * 公共操作按钮触发事件
   */
  public commonSwitchChange(type: BulkOperateTypeEnum, ev: ControlInstructEnum): void {
    this.isSureOperate(type, ev);
  }

  /**
   * 照明控制亮度、信息屏幕亮度和音量、广播幕音量滑块触发事件
   */
  public slideChange(type: BulkOperateTypeEnum, ev: number): void {
    this.isSureOperate(type, ev);
  }

  /**
   * 关闭弹框
   */
  public handleCancel(): void {
    this.xcVisible = false;
  }

  /**
   * 对应操作回传事件
   *  此处数据类型有多种有的是数字有的是对象
   */
  public commandTypeClass(type: BulkOperateTypeEnum, event?): void {
    switch (type) {
      // 广播同步播放事件
      case BulkOperateTypeEnum.broadcastSynchronization:
        this.broadcastPlay.emit(true);
        break;
      // 信息屏幕同步播放事件
      case BulkOperateTypeEnum.screenSynchronization:
        this.screenPlay.emit(event);
        break;
      // 公共操作按钮时间
      case BulkOperateTypeEnum.commonOperate:
        this.commonSwitchValue.emit(event);
        break;
      // 照明控制亮度变化触发事件
      case BulkOperateTypeEnum.lightChange:
        this.lightChangeValue.emit(event);
        break;
      // 信息屏幕亮度变化触发事件
      case BulkOperateTypeEnum.screenLight:
        this.screenLightChangeValue.emit(event);
        break;
      // 信息屏幕音量变化触发事件
      case BulkOperateTypeEnum.screenVolume:
        this.screenVolumeChangeValue.emit(event);
        break;
      // 广播幕音量变化触发事件
      case BulkOperateTypeEnum.broadcastVolume:
        this.broadcastVolumeChangeValue.emit(event);
        break;
      default:
        break;
    }
  }

  /**
   * 确定操作弹框方法
   */
  private isSureOperate(type: BulkOperateTypeEnum, event): void {
    this.$modalService.confirm({
      nzTitle: this.language.prompt,
      nzContent: `<span>${this.language.commandIsHandleOk}</span>`,
      nzOkText: this.language.handleCancel,
      nzOkType: 'danger',
      nzMaskClosable: false,
      nzOnOk: () => {
        this.lightValue = this.screenLightValue = EquipmentControlInitValue.screenLightValue;
        this.screenVolumeValue = EquipmentControlInitValue.screenVolumeValue;
        this.broadcastValue = EquipmentControlInitValue.broadcastValue;
      },
      nzCancelText: this.language.handleOk,
      nzOnCancel: () => {
        this.commandTypeClass(type, event);
      }
    });
  }
}
