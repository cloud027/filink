import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NzI18nService} from 'ng-zorro-antd';
import {Router} from '@angular/router';
import * as _ from 'lodash';
import {BusinessFacilityService} from '../../../../service/business-facility/business-facility.service';
import {FacilityForCommonService} from '../../../../../core-module/api-service/facility';
import {ImageViewService} from '../../../../service/picture-view/image-view.service';
import {FiLinkModalService} from '../../../../service/filink-modal/filink-modal.service';
import {FacilityLanguageInterface} from '../../../../../../assets/i18n/facility/facility.language.interface';
import {ResultModel} from '../../../../model/result.model';
import {ResultCodeEnum} from '../../../../enum/result-code.enum';
import {LanguageEnum} from '../../../../enum/language.enum';
import {PicResourceEnum} from '../../../../../core-module/enum/picture/pic-resource.enum';
import {NO_IMG} from '../../../../../core-module/const/common.const';
import {ObjectTypeEnum} from '../../../../../core-module/enum/facility/object-type.enum';
import {ThumbnailBaseInfoModel} from '../../../../../core-module/model/equipment/thumbnail-base-info.model';
import {ThumbnailComponent} from '../../thumbnail/thumbnail.component';
import {CommonUtil} from '../../../../util/common-util';
import {FacilityDetailInfoModel} from '../../../../../core-module/model/facility/facility-detail-info.model';
import {BusinessStatusEnum, CloudPlatFormEnum, EquipmentStatusEnum, EquipmentTypeEnum} from '../../../../../core-module/enum/equipment/equipment.enum';
import {PictureListModel} from '../../../../../core-module/model/picture/picture-list.model';
import {EquipmentAddInfoModel} from '../../../../../core-module/model/equipment/equipment-add-info.model';
import {QueryRealPicModel} from '../../../../../core-module/model/picture/query-real-pic.model';

declare const MAP_TYPE;

/**
 * 设备管理基本信息
 * created by PoHe
 */
@Component({
  selector: 'app-equipment-infrastructure',
  templateUrl: './equipment-infrastructure.component.html',
  styleUrls: ['./equipment-infrastructure.component.scss',
    '../equipment-view-detail-common.component.scss'],
})
export class EquipmentInfrastructureComponent implements OnInit, OnDestroy {
  /** 是否是环境监测调用组件 */
  @Input() isMonitorDeatilsFlag: boolean = false;
  // 传入设备id
  @Input()
  public equipmentId: string = '';
  //  地图组件
  @ViewChild('thumbnail') private thumbnail: ThumbnailComponent;
  // 设备管理国际化
  public language: FacilityLanguageInterface;
  // 无数据图标地址
  public equipmentPicUrl = NO_IMG;
  // 设备类型枚举
  public equipmentTypeEnum = EquipmentTypeEnum;
  // 设备状态枚举
  public equipmentStatusEnum = EquipmentStatusEnum;
  // 业务状态枚举
  public businessStatusEnum = BusinessStatusEnum;
  // 国际化前缀枚举
  public languageEnum = LanguageEnum;
  // 是否显示设备分组信息列表
  public showGroupInfo: boolean = false;
  //  应用策略信息
  public showPolicyInfo: boolean = false;
  // 是否显示分组信息应用信息按钮
  public showGroupAndPolicy: boolean = true;
  // 类型枚举
  public objectType = ObjectTypeEnum;
  // 设备详情
  public equipmentDetailInfo: EquipmentAddInfoModel = new EquipmentAddInfoModel();
  // 设施信息
  public deviceInfo: FacilityDetailInfoModel = new FacilityDetailInfoModel;
  // 缩略图基础数据
  public thumbnailData: ThumbnailBaseInfoModel = new ThumbnailBaseInfoModel();
  // 地图类型
  public mapType: string;
  //  判断是否为英文环境，英文环境超长字段给提示
  public isEn: boolean = false;
  // 实景图地址
  private equipmentPicList: PictureListModel[] = [];

  /**
   * 构造器
   */
  constructor(
    private $nzI18n: NzI18nService,
    private $imageViewService: ImageViewService,
    private $router: Router,
    private $message: FiLinkModalService,
    private $facilityForCommonService: FacilityForCommonService,
    private $businessService: BusinessFacilityService
  ) {
  }

  /**
   * 组件初始化
   */
  public ngOnInit() {
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.facility);
    this.mapType = MAP_TYPE;
    this.isEn = JSON.parse(localStorage.getItem('localLanguage')) === 'EN';
    this.getEquipmentPic();
    this.$businessService.eventEmit.subscribe(() => {
      //  查询实景图
      this.getEquipmentPic();
    });
    // 查询设备基础信息
    this.getEquipmentDetail();
  }

  /**
   * 销毁组件
   */
  public ngOnDestroy(): void {
    this.thumbnail = null;
  }

  /**
   *  点击图片事件
   */
  public onClickImage(): void {
    if (!_.isEmpty(this.equipmentPicList)) {
      this.$imageViewService.showPictureView(this.equipmentPicList);
    }
  }

  /**
   * 获取设备状态图标
   */
  public getEquipmentStatusIconClass(status: EquipmentStatusEnum): string {
    const statusIcon = 'icon-fiLink-l iconfont';
    const statusIconClass = CommonUtil.getEquipmentStatusIconClass(status);
    return `icon-fiLink-5 ${statusIcon} ${statusIconClass.iconClass}`;
  }

  /**
   * 设置业务状态的样式
   */
  public getBusinessStatusBg(status: BusinessStatusEnum): string {
    // return status === this.businessStatusEnum.lockEquipment ? 'eq-business-lock' : 'eq-business-free';
    return 'eq-business-free';
  }

  /**
   * 获取设备状态背景色
   */
  public getEquipmentStatusBg(status: EquipmentStatusEnum): string {
    const statusIconClass = CommonUtil.getEquipmentStatusIconClass(status);
    return statusIconClass.bgColor;
  }

  /**
   * 获取设备图标白色
   */
  public getEquipmentIconClass(data) {
    const facilityType = CommonUtil.getEquipmentTypeIcon(data) || 'all-facility';
    return `icon-fiLink-5 iconfont fiLink-${facilityType.slice(0, facilityType.lastIndexOf(' '))}`;
  }

  /**
   *  查询设备的实景图
   */
  private getEquipmentPic(): void {
    const queryBody = new QueryRealPicModel(this.equipmentId, ObjectTypeEnum.equipment, PicResourceEnum.realPic);
    this.$facilityForCommonService.getPicDetail([queryBody]).subscribe(
      (result: ResultModel<PictureListModel[]>) => {
        if (result.code === ResultCodeEnum.success) {
          this.equipmentPicList = result.data || [];
          if (!_.isEmpty(this.equipmentPicList)) {
            this.equipmentPicUrl = _.first(this.equipmentPicList).picUrlBase;
          }
        } else {
          this.$message.error(result.msg);
        }
      });
  }

  /**
   * 查询设备详细信息
   */
  private getEquipmentDetail(): void {
    const queryBody = {equipmentId: this.equipmentId};
    this.$facilityForCommonService.getEquipmentById(queryBody).subscribe(
      (result: ResultModel<EquipmentAddInfoModel[]>) => {
        if (result.code === ResultCodeEnum.success) {
          // 因为后台返回的是一个数组类型的数据，故此处获取第一个元素
          if (!_.isEmpty(result.data)) {
            this.equipmentDetailInfo = _.first(result.data);
          }
          // 所属网关端口数据拼接
          if (this.equipmentDetailInfo && this.equipmentDetailInfo.portType) {
            this.equipmentDetailInfo.portName = this.equipmentDetailInfo.portType + '-' + this.equipmentDetailInfo.portNo;
          } else {
            this.equipmentDetailInfo.portName = '';
          }
          // 电源控制端口数据拼接
          if (this.equipmentDetailInfo && this.equipmentDetailInfo.powerControlPortType) {
            this.equipmentDetailInfo.powerControlPortName = this.equipmentDetailInfo.powerControlPortType + '-' + this.equipmentDetailInfo.powerControlPortNo;
          } else {
            this.equipmentDetailInfo.powerControlPortName = '';
          }
          if (this.equipmentDetailInfo) {
            this.deviceInfo = this.equipmentDetailInfo.deviceInfo;
            if (this.equipmentDetailInfo.equipmentType === EquipmentTypeEnum.intelligentEntranceGuardLock) {
              this.showGroupAndPolicy = false;
            }
            this.thumbnailData.equipmentType = this.equipmentDetailInfo.equipmentType;
            this.thumbnailData.equipmentStatus = this.equipmentDetailInfo.equipmentStatus;
            this.thumbnailData.positionBase = this.equipmentDetailInfo.positionBase;
            this.thumbnail.initMap();
          }
          if (this.equipmentDetailInfo.cloudPlatform) {
            this.equipmentDetailInfo.cloudPlatformName = CommonUtil.codeTranslate(CloudPlatFormEnum, this.$nzI18n, this.equipmentDetailInfo.cloudPlatform, LanguageEnum.facility);
          } else {
            this.equipmentDetailInfo.cloudPlatformName = '';
          }
        }
      });
  }
}
