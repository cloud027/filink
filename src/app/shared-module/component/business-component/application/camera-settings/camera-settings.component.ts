import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import * as _ from 'lodash';
import {ResultModel} from '../../../../model/result.model';
import {ClearWorkOrderModel} from '../../../../../business-module/index/shared/model/work-order-condition.model';
import {PresetModel} from '../../../../../business-module/application-system/share/model/preset.model';
import {LanguageEnum} from '../../../../enum/language.enum';
import {ApplicationInterface} from '../../../../../../assets/i18n/application/application.interface';
import {NzI18nService, NzModalService} from 'ng-zorro-antd';
import {CommonLanguageInterface} from '../../../../../../assets/i18n/common/common.language.interface';
import {FiLinkModalService} from '../../../../service/filink-modal/filink-modal.service';
import {SessionUtil} from '../../../../util/session-util';
import {ApplicationSystemForCommonService} from '../../../../../core-module/api-service/application-system';
import {ControlInstructEnum} from '../../../../../core-module/enum/instruct/control-instruct.enum';
import {CameraCodeEnum} from '../../../../../business-module/application-system/share/enum/camera-permission.enum';
import {ResultCodeEnum} from '../../../../enum/result-code.enum';


/**
 * 摄像头配置组件
 */
@Component({
  selector: 'app-camera-settings',
  templateUrl: './camera-settings.component.html',
  styleUrls: ['./camera-settings.component.scss']
})
export class CameraSettingsComponent implements OnInit, OnChanges {

  /**
   * 设备ID
   */
  @Input()
  private equipmentId: string;

  /**
   * 播放句柄
   */
  @Input()
  private lRealHandle: number;

  /**
   * 播放句柄
   */
  @Input()
  private channelId: string;

  /**
   * 特殊参数
   */
  @Input()
  public params: any = {};

  /**
   * 是否是工作台
   */
  @Input()
  private isWorkbench: boolean = true;

  /**
   * 预设位置列表
   */
  public presetList: PresetModel[] = [];
  /**
   * 国际化
   */
  public language: ApplicationInterface;
  /**
   * 公共国际化
   */
  public commonLanguage: CommonLanguageInterface;
  /**
   * 控制指令枚举
   */
  public controlInstructEnum = ControlInstructEnum;
  /**
   * 摄像头权限码枚举
   */
  public cameraCodeEnum = CameraCodeEnum;

  /**
   * @param $nzI18n  国际化服务
   * @param $message 提示信息服务
   * @param $securityService 后台服务
   * @param $modalService 提示框
   */
  constructor(
    private $nzI18n: NzI18nService,
    private $message: FiLinkModalService,
    private $securityService: ApplicationSystemForCommonService,
    private $modalService: NzModalService,
  ) {
  }

  ngOnInit() {
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.application);
    this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
    this.presetList = _.fill(Array(255), {state: false});
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.equipmentId && changes.equipmentId.currentValue) {
      this.onInGetPresetList();
    }
  }

  /**
   * 摄像头云台控制
   * @param value 传入的指令值
   * @param type 动作指令： START：开始  STOP：停止
   * direction 方向: TILT_UP:北； TILT_DOWN:南；PAN_LEFT：西；PAN_RIGHT：东；UP_LEFT：西北； UP_RIGHT：东北；DOWN_LEFT：西南；DOWN_RIGHT：东南；
   * zoom 焦距： ZOOM_IN：焦距变大(倍率变大) ZOOM_OUT：焦距变小(倍率变小)
   * focus 焦点： FOCUS_NEAR：焦点前调 FOCUS_FAR：焦点后调
   * diaphragm 光圈： IRIS_OPEN：光圈扩大 IRIS_CLOSE：光圈缩小
   */
  public onCloudControl(value: string, type: string): void {
    // 判断是否有权限
    if (!SessionUtil.checkHasRole(this.cameraCodeEnum.panTiltControl)) {
      // mousedown   mouseup  事件 这个事件会执行两次 只在mousedown会出弹窗
      if (type === 'START') {
        this.$message.warning(this.language.frequentlyUsed.notPermission);
      }
      return;
    }
    if (!this.equipmentId) {
      this.$message.warning(this.language.frequentlyUsed.noPlayableChannel);
      return;
    }
    if (this.isLRealHandle()) {
      return;
    }
    const cloudControlParameter = {
      commandId: this.controlInstructEnum.adjustCameraDirection,
      equipmentIds: [this.equipmentId],
      param: {
        channelList: [{
          channelId: this.channelId,
          equipmentId: this.equipmentId,
          direction: value,
          lRealHandle: this.lRealHandle,
          type: type,
          onvifAccount: this.params ? this.params.onvifAccount : null,
          onvifPassword: this.params ? this.params.onvifPassword : null,
          onvifIp: this.params ? this.params.onvifIp : null,
          onvifPort: this.params ? this.params.onvifPort : null,
          cameraType: this.params ? this.params.cameraType : null,
          onvifAddr: this.params ? this.params.onvifAddr : null,
          url: this.params.url,
        }]
      }
    };
    this.$securityService.instructDistribute(cloudControlParameter).subscribe((result: ResultModel<ClearWorkOrderModel[]>) => {
      /**
      if (result.code === ResultCodeEnum.success) {
      }
       */
    });
  }

  /**
   * 获取预设位置列表
   */
  public onInGetPresetList(presetId?: number): void {
    if (!this.equipmentId) {
      return;
    }
    // 如果沒有下标则进行重置
    if (!presetId) {
      this.presetList = _.fill(Array(255), {state: false});
    }
    this.$securityService.getPresetList(this.equipmentId)
      .subscribe((result: ResultModel<PresetModel[]>) => {
        if (result.code === ResultCodeEnum.success) {
          if (!_.isEmpty(result.data)) {
            // 是否有ID  有就局部刷新   没有就全部刷新
            if (!presetId) {
              // 不为空将所有状态置为true
              this.presetList = this.presetList.map((preset, index) => {
                result.data.forEach(item => {
                  if (index + 1 === item.presetId) {
                    preset = item;
                    preset.state = true;
                  }
                });
                return preset;
              });
            } else {
              // 根据ID想是否相等 则进行赋值
              let preset;
              result.data.forEach(item => {
                if (item.presetId === presetId) {
                  preset = item;
                }
              });
              // 如果preset有值  则表示上面有返回  是保存或者转到预置点 则赋值给相应的位置 且state为true
              if (preset) {
                // 相应的位置为ID-1   ID 是1开始
                this.presetList[presetId - 1] = preset;
                this.presetList[presetId - 1].state = true;
              } else {
                // 如果preset没有值  则表示上面没有返回  是删除 则只需要将state为false
                this.presetList[presetId - 1].state = false;
              }
            }
          } else {
            // 数组为空 则所有状态置为false
            this.presetList.forEach(item => {
              item.state = false;
            });
          }
        }
      });
  }

  /**
   * 预设位置操作
   * @param type 设置预置位：SET_PRESET_POSITION 清除预置位：DEL_PRESET_POSITION 转到预置位：GO_PRESET_POSITION
   * @param index 预置位下标
   * @param preset 预置位信息
   * @param state 当前的按钮状态，是否能点击
   */
  public onPresetOperation(type: string, index: number, preset, state?: boolean): void {
    if (!this.equipmentId) {
      this.$message.warning(this.language.frequentlyUsed.noPlayableChannel);
      return;
    }
    if (this.isLRealHandle()) {
      return;
    }
    // 当前预置位未false的状态是则该预置位则是不存在的 只有保存可以点击
    if (!state && type !== this.controlInstructEnum.setPresetPosition) {
      return;
    }
    const cloudControlParameter = {
      commandId: type,
      equipmentIds: [this.equipmentId],
      param: {
        channelList: [{
          lRealHandle: this.lRealHandle || 0,
          equipmentId: this.equipmentId,
          presetId: preset.presetId || index + 1,
          id: preset.id || null,
          onvifAccount: this.params ? this.params.onvifAccount : null,
          onvifPassword: this.params ? this.params.onvifPassword : null,
          onvifIp: this.params ? this.params.onvifIp : null,
          onvifPort: this.params ? this.params.onvifPort : null,
          cameraType: this.params ? this.params.cameraType : null,
          onvifAddr: this.params ? this.params.onvifAddr : null,
          channelId: this.channelId,
        }]
      }
    };
    this.$securityService.instructDistribute(cloudControlParameter).subscribe((result: ResultModel<ClearWorkOrderModel[]>) => {
      if (result.code === ResultCodeEnum.success) {
        this.onInGetPresetList(preset.presetId || index + 1);
      }
    });
  }

  /**
   * 判断是否有句柄
   */
  private isLRealHandle() {
    if (_.isEmpty(this.lRealHandle) && (this.params && this.params.cameraType === 'ONVIF' && _.isEmpty(this.params.path))) {
      if (this.isWorkbench) {
        this.$message.warning(this.language.frequentlyUsed.playingVideo);
      } else {
        this.$message.warning(this.language.frequentlyUsed.firstVideo);
      }
      return true;
    } else {
      return false;
    }
  }

  /**
   * 打开删除二次确认弹窗
   * @param type 设置预置位：SET_PRESET_POSITION 清除预置位：DEL_PRESET_POSITION 转到预置位：GO_PRESET_POSITION
   * @param index 预置位下标
   * @param preset 预置位信息
   * @param state 当前的按钮状态，是否能点击
   */
  public secondConfirmation(type: string, index: number, preset, state?: boolean): void {
    // 当前预置位未false的状态是则该预置位则是不存在的 只有保存可以点击
    if (!state) {
      return;
    }
    this.$modalService.warning({
      nzTitle: this.language.frequentlyUsed.tip, // 提示
      nzContent: this.language.frequentlyUsed.confirmDelete, // 是否确认删除
      nzCancelText: this.language.frequentlyUsed.cancel, // 取消
      nzOnOk: () => {
        this.onPresetOperation(type, index, preset, state);
      }
    });
  }
}
