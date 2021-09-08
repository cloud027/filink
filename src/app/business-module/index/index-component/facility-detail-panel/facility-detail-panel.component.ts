import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import {Router} from '@angular/router';
import {DateHelperService, NzI18nService, NzModalService} from 'ng-zorro-antd';
import * as lodash from 'lodash';
import {FacilityLanguageInterface} from '../../../../../assets/i18n/facility/facility.language.interface';
import {FacilityService} from '../../../../core-module/api-service';
import {ImageViewService} from '../../../../shared-module/service/picture-view/image-view.service';
import {SmartService} from '../../../../core-module/api-service/facility/smart/smart.service';
import {OdnDeviceService} from '../../../../core-module/api-service/statistical/odn-device';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {LockService} from '../../../../core-module/api-service/lock';
import {MapCoverageService} from '../../../../shared-module/service/index/map-coverage.service';
import {IndexFacilityService} from '../../../../core-module/api-service/index/facility';
import {MapService} from '../../../../core-module/api-service';
import {IndexApiService} from '../../service/index/index-api.service';
import {MapStoreService} from '../../../../core-module/store/map.store.service';
import {ResultModel} from '../../../../shared-module/model/result.model';
import {CommonUtil} from '../../../../shared-module/util/common-util';
import {FacilityName} from '../../util/facility-name';
import {FacilitiesDetailsModel} from '../../../../core-module/model/index/facilities-details.model';
import {ResultCodeEnum} from '../../../../shared-module/enum/result-code.enum';
import {DetailCode, IndexCoverageTypeEnum, IndexInstallNumEnum} from '../../shared/enum/index-enum';
import {NO_IMG} from '../../../../core-module/const/common.const';
import {RealPictureModel} from '../../../../core-module/model/picture/real-picture.model';
import {PicResultModel} from '../../shared/model/facilities-card.model';
import {CollectionService} from '../../../../shared-module/service/index/collection.service';
import {FacilityForCommonUtil} from '../../../../core-module/business-util/facility/facility-for-common.util';
import {
  BusinessStatusEnum,
  DeployStatusEnum,
  DeviceStatusEnum,
  DeviceTypeEnum,
  IsCollectedEnum
} from '../../../../core-module/enum/facility/facility.enum';
import {MapTypeEnum} from '../../../../core-module/enum/index/index.enum';
import {LanguageEnum} from '../../../../shared-module/enum/language.enum';
import {
  CameraTypeEnum,
  EquipmentStatusEnum,
  EquipmentTypeEnum,
  CallTypeEnum
} from '../../../../core-module/enum/equipment/equipment.enum';

/**
 * 设施详情组件
 */
@Component({
  selector: 'app-facility-detail-panel',
  templateUrl: './facility-detail-panel.component.html',
  styleUrls: ['./facility-detail-panel.component.scss']
})
export class FacilityDetailPanelComponent extends FacilityName implements OnInit, OnChanges, OnDestroy, AfterViewInit {
  // 设施id
  @Input() facilityId: string;
  // 是否显示实景图信息
  @Input() isShowBusinessPicture: boolean;
  // 权限code
  @Input() facilityPowerCode: string[] = [];
  // 设施详情回传
  @Output() facilityDetailEvent = new EventEmitter();
  // 权限码
  public powerCode = DetailCode;
  // 设施信息
  public facilityInfo: FacilitiesDetailsModel;
  // 设备设备状态
  public indexLayered = MapTypeEnum;
  // 当前地图分层类型
  public indexType = this.$mapCoverageService.showCoverage;
  // 监控信息下拉
  public controlOption: Array<FacilitiesDetailsModel> = [];
  // 安装数量和空闲数量模拟数据集
  public facilityInfoList: Array<{ facilityType: string, value: number }> = [];
  // 设备信息空闲数量数据
  public equipmentInfoList: Array<{ equipmentType: string, value: number }> = [];
  // 安装数量/空余数量枚举
  public installNumEnum = IndexInstallNumEnum;
  // 国际化
  public language: FacilityLanguageInterface;
  // 设施设备图层类型
  public coverageType: IndexCoverageTypeEnum;
  // 设备状态
  public businessStatus: BusinessStatusEnum;
  // 安装数量/空余数量tab选择状态
  public isHandleInstallNum: boolean = true;
  // 是否显示下拉框   有主控信息时显示下拉框
  public isShowSelect: boolean = false;
  // 是否收藏设施
  public isCollected: boolean = false;
  // 设施图片url
  public devicePicUrl = '';
  // 选中的设备类型
  public selectedType: string;
  // 选中的设备id
  public selectedControlId: string;
  // 设备Id
  public queryEquipmentId: string;
  // 设备类型
  public queryEquipmentType: string;
  // 轮询
  public timer: any;
  // 设施防御信息
  // 设施信息
  public deployInfo = {
    deployStatusLabel: '',
    deviceStatusBgColor: '',
    deployStatusIconClass: ''
  };
  // 安装数量信息返回为空样式
  public noFacilityInfoList: boolean = false;
  // 空闲数量信息返回为空样式
  public noEquipmentInfoList: boolean = false;

  constructor(public $nzI18n: NzI18nService,
              private $indexFacilityService: IndexFacilityService,
              private $mapCoverageService: MapCoverageService,
              private $collectionService: CollectionService,
              private $imageViewService: ImageViewService,
              private $odnDeviceService: OdnDeviceService,
              private $mapStoreService: MapStoreService,
              private $indexApiService: IndexApiService,
              private $facilityService: FacilityService,
              private $dateHelper: DateHelperService,
              private $message: FiLinkModalService,
              private $smartService: SmartService,
              private $lockService: LockService,
              private $mapService: MapService,
              private modal: NzModalService,
              private $modal: NzModalService,
              private $router: Router,
  ) {
    super($nzI18n);
  }

  /**
   * 页面初始化加载
   */
  public ngOnInit(): void {
    // 国际化
    this.language = this.$nzI18n.getLocaleData(MapTypeEnum.facility);
    // 页面初始化
    this.getAllData();
    // 详情卡点击关注或取消关注，我的关注列表刷新数据
    this.$collectionService.eventEmit.subscribe((value) => {
      if (value.typeChange) {
        // 页面刷新
        this.getAllData();
      }
    });
  }

  /**
   * 页面加载完成后
   */
  public ngAfterViewInit(): void {
    // 详情接口轮询
    this.timer = setInterval(() => {
      this.getAllData();
    }, 300000);
  }

  /**
   * changes监听
   */
  public ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes.facilityId && changes.facilityId.previousValue) {
      // 当设施id发生变化的时候，关闭定时器
      if (this.timer) {
        clearInterval(this.timer);
      }
      // 如果设施id为空
      if (!this.facilityId) {
        return;
      }
      // 获取详情
      this.getFacilityDetail(this.facilityId);
      // 默认为安装数量信息
      this.isHandleInstallNum = true;
      // 获取监控信息监控状态
      this.getEquipmentListByDeviceId(this.facilityId);
      // 获取设备信息空闲数量
      this.getEquipmentListFreeNumByDeviceId(this.facilityId);
      // 获取图片
      this.getDevicePic(this.facilityId);
    }
  }

  /**
   * 销毁指令
   */
  public ngOnDestroy(): void {
    // 清除定时
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  /**
   * 获取详情
   * param id
   */
  public getFacilityDetail(id: string): void {
    if (this.indexType === MapTypeEnum.facility) {
      this.$indexApiService.queryDeviceById(id).subscribe((result: ResultModel<FacilitiesDetailsModel>) => {
        if (result.code === ResultCodeEnum.success && result.data) {
          // 设施有部署状态
          const info = result.data;
          if (info.deviceStatus && info.deployStatus) {
            this.deployInfo.deployStatusLabel = CommonUtil.codeTranslate(DeployStatusEnum, this.$nzI18n, info.deployStatus, LanguageEnum.facility) as string;
            this.deployInfo.deviceStatusBgColor = CommonUtil.getDeviceStatusIconClass(info.deviceStatus).colorClass;
            this.deployInfo.deployStatusIconClass = CommonUtil.getDeployStatusIconClass(info.deployStatus);
          }
          this.convertInfo(result.data, MapTypeEnum.facility);
        } else {
          clearInterval(this.timer);
          this.$mapStoreService.deleteMarker(this.facilityId);
        }
      });
    }
    if (this.indexType === MapTypeEnum.equipment) {
      this.$indexApiService.queryHomeEquipmentInfoById(id).subscribe((result: ResultModel<FacilitiesDetailsModel>) => {
        if (result.code === ResultCodeEnum.success && result.data) {
          this.convertInfo(result.data, MapTypeEnum.equipment);
          // 查询监控状态数据
          this.getPerformData(id, this.facilityInfo.equipmentType);
        } else {
          clearInterval(this.timer);
          this.$mapStoreService.deleteMarker(this.facilityId);
        }
      });
    }
  }

  /**
   * 转换数据
   * param data
   */
  public convertInfo(data: FacilitiesDetailsModel, mapType: string): void {
    // 判断是设施还是设备
    const selectType = MapTypeEnum.facility === mapType;
    const type = selectType ? data.deviceType : data.equipmentType;
    const state = selectType ? data.deviceStatus : data.equipmentStatus;
    // 数据处理
    data.facilityTypeClassName = selectType ? CommonUtil.getFacilityIconClassName(type || null) :
      this.getEquipmentTypeIcon(data || null);
    data.facilityTypeName = CommonUtil.codeTranslate(DeviceTypeEnum, this.$nzI18n, type) as string;
    data.text = selectType ? CommonUtil.codeTranslate(DeviceStatusEnum, this.$nzI18n, state) as string
      : CommonUtil.codeTranslate(EquipmentStatusEnum, this.$nzI18n, state, LanguageEnum.facility) as string;
    data.bgColor = selectType ? CommonUtil.getDeviceStatusIconClass(state)
      .colorClass
      .replace('-c', '-bg') : CommonUtil.getEquipmentStatusIconClass(state).bgColor;
    data.facilityName = selectType ? data.deviceName : data.equipmentName;
    data.facilityCode = selectType ? data.deviceCode : data.equipmentCode;
    // 0 未收藏 1 已收藏
    this.isCollected = data.attentionStatus !== IsCollectedEnum.uncollected;
    this.facilityInfo = data;
    if (this.facilityInfo.businessStatus) {
      if (this.facilityInfo.businessStatus === BusinessStatusEnum.freed) {
        this.facilityInfo.businessStatus = this.indexLanguage.freed;
      }
      if (this.facilityInfo.businessStatus === BusinessStatusEnum.occupy) {
        this.facilityInfo.businessStatus = this.indexLanguage.occupyLock;
      }
    }
  }


  /**
   * 获取监控信息监控状态
   * param id
   */
  public getEquipmentListByDeviceId(id: string): void {
    // 查询监控信息
    if (this.indexType === MapTypeEnum.facility) {
      const body = {
        deviceIdList: [id],
        filterConditions: {
          area: this.$mapStoreService.areaSelectedResults ? this.$mapStoreService.areaSelectedResults : [],
          group: this.$mapStoreService.logicGroupList ? this.$mapStoreService.logicGroupList : []
        }
      };
      this.$indexApiService.queryEquipmentListByDeviceId(body).subscribe((result: ResultModel<FacilitiesDetailsModel[]>) => {
        if (result.code === ResultCodeEnum.success) {
          // 显示下拉
          this.isShowSelect = true;
          // 监控信息下拉框数据
          this.controlOption = result.data || [];
          // 默认选择第一条设备监控信息
          if (this.controlOption[0] && !this.selectedControlId) {
            this.selectedControlId = this.controlOption[0].equipmentId;
            this.selectedType = this.controlOption[0].equipmentType;
            this.changeControl(this.selectedControlId);
          }
          const facilityInfoList = [];
          if (result.data) {
            // 根据设备权重进行排序
            const data = FacilityForCommonUtil.equipmentSort(result.data);
            // 设备信息数据处理
            data.forEach(item => {
              facilityInfoList.push({
                // 摄像头类型区分
                facilityType: CommonUtil.getEquipmentTypeIcon(item),
                // 添加基础值0
                value: 0
              });
            });
          }
          // 数组中对象去重
          const list = lodash.uniqBy(facilityInfoList, 'facilityType');
          // 记录重复设备信息
          facilityInfoList.forEach((item, index) => {
            list.forEach(_item => {
              if (item.facilityType === _item.facilityType) {
                _item.value++;
              }
            });
          });
          this.facilityInfoList = list;
          if (!this.facilityInfoList.length) {
            this.noFacilityInfoList = true;
          } else {
            this.noFacilityInfoList = false;
          }
        }
      });
    }
  }

  /**
   * 获取设备信息空闲数量信息
   * param id
   */
  public getEquipmentListFreeNumByDeviceId(id: string): void {
    // 查询监控信息
    if (this.indexType === MapTypeEnum.facility) {
      const body = {
        deviceId: id,
        businessStatus: '1'
      };
      this.$indexApiService.queryEquipmentListFreeNumByDeviceId(body).subscribe((result: ResultModel<any>) => {
        if (result.code === ResultCodeEnum.success) {
          const equipmentInfoList = [];
          const data = [];
          if (result.data) {
            Object.keys(result.data).forEach(item => {
              const equipmentInfo = {
                equipmentType: item,
                value: result.data[item]
              };
              equipmentInfoList.push(equipmentInfo);
            });
            // 设备信息数据处理
            equipmentInfoList.forEach(item => {
              data.push({
                // 摄像头类型区分
                equipmentType: CommonUtil.getEquipmentTypeIcon(item),
                value: item.value
              });
            });
            this.equipmentInfoList = data;
            if (!this.equipmentInfoList.length) {
              this.noEquipmentInfoList = true;
            } else {
              this.noEquipmentInfoList = false;
            }
          }
        } else {
          this.noEquipmentInfoList = true;
          this.equipmentInfoList = [];
        }
      });
    }
  }

  /**
   * 获取监控信息监控状态
   * param id
   * param type
   */
  public getPerformData(id: string, type: string): void {
    this.queryEquipmentId = id;
    this.queryEquipmentType = type;
  }

  /**
   * 获取设施图片
   * param id
   */
  public getDevicePic(id: string): void {
    const body = new PicResultModel(id);
    body.objectType = this.coverageType;
    this.$indexApiService.getPicDetail([body]).subscribe((result: ResultModel<RealPictureModel[]>) => {
      if (result.code === ResultCodeEnum.success && result.data.length && this.facilityPowerCode.includes(this.powerCode.photo)) {
        this.devicePicUrl = result.data[0].picUrlBase;
      } else {
        // 显示无图片
        this.devicePicUrl = NO_IMG;
      }
    });
  }

  /**
   * 收藏或取消收藏
   */
  public collectionChange(): void {
    if (this.isCollected) {
      this.unCollect();
    } else {
      this.collect();
    }
  }

  /**
   * 取消关注
   */
  public unCollect(): void {
    let request;
    if (this.indexType === MapTypeEnum.facility) {
      request = this.$indexApiService.delCollectingDeviceById({deviceId: this.facilityId});
    } else {
      request = this.$indexApiService.delCollectingEquipmentById({equipmentId: this.facilityId});
    }
    request.subscribe((result: ResultModel<string>) => {
      if (result.code === ResultCodeEnum.success) {
        // 发射事件，刷新我的关注列表
        this.$collectionService.eventEmit.emit({type: this.indexType});
        this.$message.success(this.indexLanguage.unCollectSuccess);
        this.isCollected = false;
      } else {
        this.$message.error(result.msg);
      }
    }, () => {
      this.$message.warning(this.indexLanguage.networkTips);
    });
  }

  /**
   * 添加关注
   */
  public collect(): void {
    let request;
    if (this.indexType === MapTypeEnum.facility) {
      request = this.$indexApiService.addCollectingDeviceById({deviceId: this.facilityId});
    } else {
      request = this.$indexApiService.addCollectingEquipmentById({equipmentId: this.facilityId});
    }
    request.subscribe((result: ResultModel<string>) => {
      if (result.code === ResultCodeEnum.success) {
        // 发射事件，刷新我的关注列表
        this.$collectionService.eventEmit.emit({type: this.indexType});
        this.$message.success(this.indexLanguage.collectSuccess);
        this.isCollected = true;
      } else {
        this.$message.error(result.msg);
      }
    });
  }


  /**
   * 切换监控显示
   */
  public changeControl(event: string): void {
    if (event) {
      const type = this.controlOption.find(item => item.equipmentId === event).equipmentType;
      this.getPerformData(event, type);
    }
  }

  /**
   * 跳转至设施详情页面
   */
  public goToDeviceDetailById(): void {
    this.$router.navigate([`/business/facility/facility-detail-view`],
      {queryParams: {id: this.facilityId, deviceType: this.facilityInfo.deviceType}}).then();
  }

  /**
   * 跳转至设备详情页面
   */
  public goToEquipmentDetailById(): void {
    this.$router.navigate([`/business/facility/equipment-view-detail`],
      {
        queryParams: {
          equipmentId: this.facilityId,
        }
      }).then();
  }


  /**
   * 切换设备信息tab页
   */
  public tabClick(tabNum): void {
    this.isHandleInstallNum = tabNum === IndexInstallNumEnum.installNum;
  }

  /**
   * 设备摄像头球型枪型图标转换
   */
  public getEquipmentTypeIcon(data): string {
    // 设置设备类型的图标
    let iconClass = '';
    if (data.equipmentType === EquipmentTypeEnum.camera && data.modelType === CameraTypeEnum.bCamera) {
      // 摄像头球型
      iconClass = `iconfont facility-icon fiLink-shexiangtou-qiuji camera-color`;
    } else if (data.equipmentType === EquipmentTypeEnum.oneTouchCalling && data.modelType === CallTypeEnum.microphone ) {
      // 话筒
      iconClass = `iconfont facility-icon fiLink-filink-huatong-icon alarm-fast-color`;
    } else {
      iconClass = CommonUtil.getEquipmentIconClassName(data.equipmentType);
    }
    return iconClass;
  }

  /**
   *
   * 轮询设施详情
   */
  private getAllData(this): void {
    // 判断当前地图图层
    if (this.indexType === MapTypeEnum.facility) {
      this.coverageType = IndexCoverageTypeEnum.facility;
    } else {
      this.coverageType = IndexCoverageTypeEnum.device;
    }
    // 如果设施id为空
    if (!this.facilityId) {
      // 当设施id发生变化的时候，关闭定时器
      if (this.timer) {
        clearInterval(this.timer);
      }
      return;
    }
    // 获取详情
    this.getFacilityDetail(this.facilityId);
    // 获取监控信息监控状态
    this.getEquipmentListByDeviceId(this.facilityId);
    // 获取设备信息空闲数量
    this.getEquipmentListFreeNumByDeviceId(this.facilityId);
    // 获取图片
    this.getDevicePic(this.facilityId);
  }

}
