import {Component, Input, OnInit} from '@angular/core';
import { FaultLanguageInterface } from '../../../../../../../assets/i18n/fault/fault-language.interface';
import {NzI18nService} from 'ng-zorro-antd';
import {ResultModel} from '../../../../../../shared-module/model/result.model';
import {TroubleService} from '../../../../share/service';
import {ResultCodeEnum} from '../../../../../../shared-module/enum/result-code.enum';
import {FiLinkModalService} from '../../../../../../shared-module/service/filink-modal/filink-modal.service';
import {LanguageEnum} from '../../../../../../shared-module/enum/language.enum';
import {TroubleSourceEnum} from '../../../../../../core-module/enum/trouble/trouble-common.enum';
import {EquipmentTypeEnum} from '../../../../../../core-module/enum/equipment/equipment.enum';
import {TroubleModel} from '../../../../../../core-module/model/trouble/trouble.model';
import {DeviceFormModel} from '../../../../../../core-module/model/work-order/device-form.model';
declare const MAP_TYPE;
/**
 * 故障详情基本信息
 */
@Component({
  selector: 'app-fault-details',
  templateUrl: './fault-details.component.html',
  styleUrls: ['./fault-details.component.scss']
})
export class FaultDetailsComponent implements OnInit {
  // 故障信息
  @Input() troubleInfo: TroubleModel = new TroubleModel();
  // 告警国际化引用
  public language: FaultLanguageInterface;
  // 故障ID
  public troubleId: string;
  // 地图类型
  public mapType = MAP_TYPE;
  // 基础信息
  public baseInfo: { point?, positionBase: string, deviceType: string, deviceStatus: string };
  // 设施ID
  public deviceId: string = '';
  // 设备ID
  public toIndexEquipmentId: string = '';
  // 设备类型枚举
  public equipmentTypeEnum = EquipmentTypeEnum;
  // 国际化前缀枚举
  public languageEnum = LanguageEnum;
  // 设施信息
  private facilityInfo: DeviceFormModel = new DeviceFormModel();
  constructor(
    private $nzI18n: NzI18nService,
    private $troubleService: TroubleService,
    private $modalService: FiLinkModalService,
  ) {
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.fault);
  }

  /**
   * 初始化
   */
  public ngOnInit(): void {
    // 如果是来源是告警地图跳转到首页就是设备id
    if (this.troubleInfo.troubleSource === TroubleSourceEnum.alarm) {
      this.toIndexEquipmentId = this.troubleInfo.equipment[0].equipmentId;
    } else {
      this.toIndexEquipmentId = '';
    }
    this.deviceId = this.troubleInfo.deviceId;
    // 获取设施信息
    this.getFacilityInfo(this.troubleInfo.deviceId);
  }

  /**
   * 获取设施信息
   */
  public getFacilityInfo(id: string): void {
    this.$troubleService.queryFacilityInfo({deviceId: id}).subscribe((result: ResultModel<DeviceFormModel[]>) => {
      if (result.code === ResultCodeEnum.success) {
        this.facilityInfo = result.data[0];
        if (this.facilityInfo) {
          // 初始化缩略图基本信息
          this.baseInfo = {
            positionBase: this.facilityInfo.positionBase,
            deviceType: this.facilityInfo.deviceType,
            deviceStatus: this.facilityInfo.deviceStatus,
          };
        }
      } else if (result.code === 130204) {
        this.$modalService.error(result.msg);
        window.history.go(-1);
      }
    });
  }
}
