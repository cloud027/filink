import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NzI18nService} from 'ng-zorro-antd';
import {Router} from '@angular/router';
import {FiLinkModalService} from '../../../service/filink-modal/filink-modal.service';
import {LanguageEnum} from '../../../enum/language.enum';
import {ObjectTypeEnum} from '../../../../core-module/enum/facility/object-type.enum';
import {ResultCodeEnum} from '../../../enum/result-code.enum';
import {EquipmentTypeEnum} from '../../../../core-module/enum/equipment/equipment.enum';
import {PictureListModel} from '../../../../core-module/model/picture/picture-list.model';
import {CommonUtil} from '../../../util/common-util';
import {DeviceTypeEnum} from '../../../../core-module/enum/facility/facility.enum';
import {SelectModel} from '../../../model/select.model';
import {ResultModel} from '../../../model/result.model';
import {FacilityForCommonService} from '../../../../core-module/api-service/facility';
import {PicResourceEnum} from '../../../../core-module/enum/picture/pic-resource.enum';
import {PicResourceStatusEnum} from '../../../../business-module/facility/share/enum/picture.enum';
import {FacilityLanguageInterface} from '../../../../../assets/i18n/facility/facility.language.interface';

/**
 * 图片详情组件
 */
@Component({
  selector: 'app-photo-info',
  templateUrl: './photo-info.component.html',
  styleUrls: ['./photo-info.component.scss']
})
export class PhotoInfoComponent implements OnInit {
  // 图片信息
  @Input() public picInfo: PictureListModel;
  // 图片背景色
  @Input() pColor: string = 'black';
  // 页面链接
  @Output() pageLink = new EventEmitter();
  // 国际化
  public language: FacilityLanguageInterface;
  // 设施选择
  public deviceList: SelectModel[] = [];
  // 设备类型枚举
  public equipmentTypeEnum = EquipmentTypeEnum;
  // 国际化语言枚举
  public languageEnum = LanguageEnum;
  // 设施类型
  public deviceTypeEnum = DeviceTypeEnum;
  // 图片来源
  public picResourceEnum = PicResourceEnum;
  // 对象类型枚举
  public objectTypeEnum = ObjectTypeEnum;
  constructor(private $nzI18n: NzI18nService,
              private $router: Router,
              private $message: FiLinkModalService,
              private $pictureApiService: FacilityForCommonService) {
    this.language = $nzI18n.getLocaleData(LanguageEnum.facility);
  }

  public ngOnInit(): void {
    // 设施类型查询列表
    this.deviceList =  CommonUtil.codeTranslate(DeviceTypeEnum, this.$nzI18n, null) as SelectModel[];
  }

  /**
   * 点击来源  页面跳转
   */
  public linkTo(): void {
    let funcName: string = null;
    if (this.picInfo.resource === PicResourceEnum.alarm) {
      funcName = 'queryIsStatus';
    } else if (this.picInfo.resource === PicResourceEnum.workOrder) {
      funcName = 'getProcessByProcId';
    }
    if (funcName) {
      // 更具来源id查询来源类型  跳转不同页面
      this.$pictureApiService[funcName](this.picInfo.resourceId).subscribe((result: ResultModel<{ status: PicResourceStatusEnum }>) => {
        if (result.code === 0 || result.code === ResultCodeEnum.success) {
          let url = '';
          switch (result.data && result.data.status) {
            case PicResourceStatusEnum.picStatusClearUnfinished:
              url = '/business/work-order/clear-barrier/unfinished-list';
              break;
            case PicResourceStatusEnum.picStatusClearHis:
              url = '/business/work-order/clear-barrier/history-list';
              break;
            case PicResourceStatusEnum.picStatusInspectionUnfinished:
              url = '/business/work-order/inspection/unfinished-list';
              break;
            case PicResourceStatusEnum.picStatusInspectionHis:
              url = '/business/work-order/inspection/finished-list';
              break;
            case PicResourceStatusEnum.picHistoryInstallOrder:
              url = '/business/work-order/installation/finished-list';
              break;
            case PicResourceStatusEnum.picHistoryAlarmOrder:
              url = '/business/work-order/alarm-confirm/finished-list';
              break;
            case PicResourceStatusEnum.picStatusCurrentAlarm:
              url = '/business/alarm/current-alarm';
              break;
            case PicResourceStatusEnum.picStatusHisAlarm:
              url = '/business/alarm/history-alarm';
              break;
            case PicResourceStatusEnum.picStatusDismantleUnfinished:
              // 未完工拆除工单列表
              url = '/business/work-order/dismantle-barrier/unfinished-list';
              break;
            case PicResourceStatusEnum.picStatusDismantleHis:
              // 历史拆除工单列表
              url = '/business/work-order/dismantle-barrier/history-list';
              break;
            default:
              break;
          }
          if (url) {
            this.$router.navigate([url], {
              queryParams: {
                id: this.picInfo.resourceId
              }
            }).then();
            this.pageLink.emit();
          }
        } else {
          this.$message.warning(result.msg);
        }
      });
    }
  }
}
