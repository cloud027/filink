import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {DateHelperService, NzI18nService} from 'ng-zorro-antd';
import * as _ from 'lodash';
import {FiLinkModalService} from '../../../../../shared-module/service/filink-modal/filink-modal.service';
import {FacilityApiService} from '../../../share/service/facility/facility-api.service';
import {BusinessFacilityService} from '../../../../../shared-module/service/business-facility/business-facility.service';
import {ImageViewService} from '../../../../../shared-module/service/picture-view/image-view.service';
import {FacilityService} from '../../../../../core-module/api-service/facility/facility-manage';
import {FacilityLanguageInterface} from '../../../../../../assets/i18n/facility/facility.language.interface';
import {ResultCodeEnum} from '../../../../../shared-module/enum/result-code.enum';
import {ResultModel} from '../../../../../shared-module/model/result.model';
import {LanguageEnum} from '../../../../../shared-module/enum/language.enum';
import {NO_IMG} from '../../../../../core-module/const/common.const';
import {BusinessStatusEnum} from '../../../../../core-module/enum/equipment/equipment.enum';
import {FilterCondition, QueryConditionModel, SortCondition} from '../../../../../shared-module/model/query-condition.model';
import {OperatorEnum} from '../../../../../shared-module/enum/operator.enum';
import {ObjectTypeEnum} from '../../../../../core-module/enum/facility/object-type.enum';
import {PicResourceEnum} from '../../../../../core-module/enum/picture/pic-resource.enum';
import {ThumbnailBaseInfoModel} from '../../../../../core-module/model/equipment/thumbnail-base-info.model';
import {FacilityDetailInfoModel} from '../../../../../core-module/model/facility/facility-detail-info.model';
import {DeployStatusEnum, DeviceTypeEnum, DeviceDetailStatusEnum} from '../../../../../core-module/enum/facility/facility.enum';
import {CommonUtil} from '../../../../../shared-module/util/common-util';
import {FacilityForCommonService} from '../../../../../core-module/api-service/facility';
import {QueryRecentlyPicModel} from '../../../../../core-module/model/picture/query-recently-pic.model';
import {PictureListModel} from '../../../../../core-module/model/picture/picture-list.model';
import {LoopListModel} from '../../../../../core-module/model/loop/loop-list.model';
import {PageModel} from '../../../../../shared-module/model/page.model';
import {TableConfigModel} from '../../../../../shared-module/model/table-config.model';
import {LoopStatusEnum, LoopTypeEnum} from '../../../../../core-module/enum/loop/loop.enum';
import {AssetManagementLanguageInterface} from '../../../../../../assets/i18n/asset-manage/asset-management.language.interface';

declare const MAP_TYPE;

/**
 * 设施详情基础信息组件
 */
@Component({
  selector: 'app-infrastructure-details',
  templateUrl: './infrastructure-details.component.html',
  styleUrls: ['./infrastructure-details.component.scss']
})
export class InfrastructureDetailsComponent implements OnInit, OnDestroy {
  // 设施id
  @Input()
  public deviceId: string;
  // 设施类型
  @Input()
  public deviceType: DeviceTypeEnum;
  // 设施信息
  public facilityInfo: FacilityDetailInfoModel = new FacilityDetailInfoModel();
  // 无数据图标地址
  public devicePicUrl = NO_IMG;
  // 设施语言包
  public language: FacilityLanguageInterface;
  // 资产语言包
  public assetLanguage: AssetManagementLanguageInterface;
  // 地图显示基本信息模型
  public baseInfo: ThumbnailBaseInfoModel;
  // 地图类型
  public mapType = MAP_TYPE;
  // 业务状态枚举
  public businessStatus = BusinessStatusEnum;
  // 是否显示分组
  public showGroupInfo = false;
  // 是否显示回路信息
  public showLoopInfo = false;
  // 是否隐藏回路分组按钮 是否显示部署状态字段 有电子锁业务的没有分组和回路 反之没有部署状态
  public hiddenLoopGroupButton: boolean = false;
  // 设施回路查询条件
  public filterConditions: FilterCondition[];
  // loading
  public loading = false;
  // 设施类型
  public deviceTypeEnum = DeviceTypeEnum;
  // 设施状态枚举
  public deviceStatusEnum = DeviceDetailStatusEnum;
  // 语言包枚举
  public languageEnum = LanguageEnum;
  // 轮询实例
  private loopTimer: number;
  // 设施图标列表
  private devicePicList: Array<PictureListModel>;
  // 列表数据
  public dataSet: LoopListModel[] = [];
  // 列表分页实体
  public pageBean: PageModel = new PageModel();
  // 列表配置
  public tableConfig: TableConfigModel;
  // 列表查询条件
  public queryCondition: QueryConditionModel = new QueryConditionModel();
  xcVisible = false;

  constructor(private $facilityService: FacilityService,
              private $facilityCommonService: FacilityForCommonService,
              private $modalService: FiLinkModalService,
              private $nzI18n: NzI18nService,
              private $dateHelper: DateHelperService,
              private $imageViewService: ImageViewService,
              private $facilityApiService: FacilityApiService,
              private $businessFacilityService: BusinessFacilityService) {
    this.assetLanguage = this.$nzI18n.getLocaleData(LanguageEnum.assets);
  }

  public ngOnInit(): void {
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.facility);
    // 有电子锁业务的没有分组和回路
    this.hiddenLoopGroupButton = this.deviceType === DeviceTypeEnum.well
      || this.deviceType === DeviceTypeEnum.opticalBox
      || this.deviceType === DeviceTypeEnum.outdoorCabinet;
    // 获取设施详情
    this.getFacilityInfo();
    // 查询实景图
    this.getDevicePic();
    // 初始化设施设备回路查询条件
    this.filterConditions = [new FilterCondition('deviceIds', OperatorEnum.in, [this.deviceId])];
    // 订阅上传图片基本操作,用于更新图片
    this.$businessFacilityService.eventEmit.subscribe(() => {
      this.getDevicePic();
    });
    this.initTableConfig();
  }

  /**
   * 组件销毁清除定时器
   */
  public ngOnDestroy(): void {
    if (this.loopTimer) {
      window.clearInterval(this.loopTimer);
    }
  }

  /**
   * 获取所有项目
   */
  public getProjectList(projectId: string): void {
    // this.$facilityApiService.getProjectList().subscribe((result: ResultModel<Array<Project>>) => {
    //   if (result.code === ResultCodeEnum.success && !_.isEmpty(result.data)) {
    //     // this.facilityInfo.projectName = _.find(result.data, (item: Project) => item.projectId === projectId).projectName;
    //   } else {
    //     this.$modalService.error(result.msg);
    //   }
    // });
  }

  /**
   * 获取设备信息
   */
  public getFacilityInfo(): void {
    this.loading = true;
    this.$facilityCommonService.queryDeviceById({deviceId: this.deviceId})
      .subscribe((result: ResultModel<FacilityDetailInfoModel[]>) => {
        if (result.code === ResultCodeEnum.success) {
          this.loading = false;
          if (!_.isEmpty(result.data)) {
            this.facilityInfo = result.data.pop();
          }
          // 处理更新时间
          this.facilityInfo.updateTime = Date.parse(this.facilityInfo.updateTime as string);
          // 初始化缩略图基本信息
          this.baseInfo = {
            positionBase: this.facilityInfo.positionBase,
            deviceType: this.facilityInfo.deviceType,
            deviceStatus: this.facilityInfo.deviceStatus,
            areaCode: this.facilityInfo.areaInfo.areaCode,
          };
          // 翻译设施状态
          if (this.facilityInfo.deviceStatus) {
            // 设施状态icon类名
            const statusStyle = CommonUtil.getDeviceAllStatusIconClass(this.facilityInfo.deviceStatus);
            this.facilityInfo.deviceStatusIconClass = statusStyle.iconClass;
            // 设施状态背景类名
            this.facilityInfo.deviceStatusColorClass = statusStyle.colorClass;
            // -c后缀class类名样式为color,更换为-bg为后缀的class类名,渲染背景色
            this.facilityInfo.deviceStatusColorClass = this.facilityInfo.deviceStatusColorClass
              .replace('-c', '-bg');
          }
          if (this.facilityInfo.deployStatus) {
            this.facilityInfo.deployStatusLabel = CommonUtil.codeTranslate(DeployStatusEnum, this.$nzI18n, this.facilityInfo.deployStatus, LanguageEnum.facility) as string;
            this.facilityInfo.deployStatusIconClass = CommonUtil.getDeployStatusIconClass(this.facilityInfo.deployStatus);
          }
          // 获取所有所属项目用于转换项目名称
          if (this.facilityInfo.projectId) {
            this.getProjectList(this.facilityInfo.projectId);
          }
        } else if (result.code === ResultCodeEnum.deviceExceptionCode) {
          this.$modalService.error(result.msg);
          window.history.go(-1);
        }
        // 开启定时器轮询
        if (!this.loopTimer) {
          this.loopTimer = window.setInterval(() => {
            this.getFacilityInfo();
          }, 60000);
        }
      }, () => {
        this.loading = false;
      });
  }

  /**
   * 点击图标
   */
  public clickImage(): void {
    if (this.devicePicList && this.devicePicList.length > 0) {
      this.$imageViewService.showPictureView(this.devicePicList);
    }
  }


  /**
   * 获取设施图片
   */
  private getDevicePic(): void {
    const body: QueryRecentlyPicModel = new QueryRecentlyPicModel(this.deviceId, '1', PicResourceEnum.realPic, null, ObjectTypeEnum.facility);
    this.$facilityCommonService.getPicDetailForNew(body).subscribe((result: ResultModel<PictureListModel[]>) => {
      if (result.code === ResultCodeEnum.success && result.data && result.data.length > 0) {
        this.devicePicList = result.data;
        this.devicePicUrl = result.data[0].picUrlBase;
      }
    });
  }

  /**
   * 初始化表格配置
   */
  private initTableConfig(): void {
    this.tableConfig = {
      outHeight: 108,
      isDraggable: true,
      noAutoHeight: true,
      showSearchSwitch: true,
      isLoading: true,
      notShowPrint: true,
      showSizeChanger: true,
      scroll: {x: '1804px', y: '400px'},
      showSearchExport: false,
      noIndex: false,
      columnConfig: [
        {type: 'select', fixedStyle: {fixedLeft: true, style: {left: '0px'}}, width: 62},
        { // 回路名称
          title: this.language.loopName,
          key: 'loopName',
          configurable: false,
          width: 150,
          searchable: true,
          isShowSort: true,
          searchConfig: {type: 'input'}
        },
        { // 回路编号
          title: this.assetLanguage.loopCode,
          key: 'loopCode',
          configurable: false,
          width: 150,
          searchable: true,
          isShowSort: true,
          searchConfig: {type: 'input'}
        },
        { // 回路类型
          title: this.assetLanguage.loopType,
          key: 'loopType',
          width: 150,
          searchable: true,
          isShowSort: true,
          searchConfig: {
            type: 'select', selectType: 'multiple',
            selectInfo: CommonUtil.codeTranslate(LoopTypeEnum, this.$nzI18n, null, LanguageEnum.facility),
            label: 'label',
            value: 'code'
          }
        },
        { // 回路状态
          title: this.assetLanguage.loopStatus,
          key: 'loopStatus',
          width: 150,
          searchable: true,
          isShowSort: true,
          searchConfig: {
            type: 'select',
            selectInfo: CommonUtil.codeTranslate(LoopStatusEnum, this.$nzI18n, null, LanguageEnum.facility),
            label: 'label',
            value: 'code'
          }
        },
        { // 控制对象
          title: this.language.controlledObject,
          key: 'centralizedControlName',
          width: 150,
          configurable: false,
          isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        { // 备注
          title: this.language.remarks,
          key: 'remark',
          width: 150,
          configurable: false,
          searchable: true,
          isShowSort: true,
          searchConfig: {type: 'input'}
        },
      ],
      showPagination: true,
      bordered: false,
      showSearch: false,
      topButtons: [],
      operation: [],
      leftBottomButtons: [],
      rightTopButtons: [],
      // 排序
      sort: (event: SortCondition) => {
        this.queryCondition.sortCondition.sortField = event.sortField;
        this.queryCondition.sortCondition.sortRule = event.sortRule;
        this.queryLoopList();
      },
      // 筛选
      handleSearch: (event: FilterCondition[]) => {
        this.queryCondition.pageCondition.pageNum = 1;
        this.queryCondition.filterConditions = event;
        this.queryLoopList();
      },
      // 选中数据获取
      handleSelect: (event: LoopListModel[]) => {
      },
    };
  }

  /**
   * 刷新回路列表
   */
  private queryLoopList(): void {
    this.tableConfig.isLoading = true;
    // 为了避免排序的时候遍历
    if (this.queryCondition.filterConditions[0] !== this.filterConditions[0]) {
      this.queryCondition.filterConditions = this.queryCondition.filterConditions.concat(this.filterConditions);
    }
    let request;
    if (!_.isEmpty(this.filterConditions)) {
      request = this.$facilityCommonService.loopListByPageByDeviceIds(this.queryCondition);
    } else {
      request = this.$facilityCommonService.queryLoopList(this.queryCondition);
    }
    request.subscribe((result: ResultModel<LoopListModel[]>) => {
      if (result.code === ResultCodeEnum.success) {
        this.tableConfig.isLoading = false;
        this.pageBean.Total = result.totalCount;
        this.pageBean.pageIndex = result.pageNum;
        this.pageBean.pageSize = result.size;
        this.dataSet = result.data || [];
        this.dataSet.forEach(item => {
          item.loopType = CommonUtil.codeTranslate(LoopTypeEnum, this.$nzI18n, item.loopType, LanguageEnum.facility);
          item.loopStatus = CommonUtil.codeTranslate(LoopStatusEnum, this.$nzI18n, item.loopStatus, LanguageEnum.facility);
        });
      } else {
        this.$modalService.error(result.msg);
      }
    }, () => {
      this.tableConfig.isLoading = false;
    });

  }

  /**
   * 表格分页
   */
  public pageChange(event: PageModel): void {
    this.queryCondition.pageCondition.pageSize = event.pageSize;
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryLoopList();
  }

  /**
   * 显示查看回路信息弹框
   */
  public showLoopInfoTable(): void {
    this.queryLoopList();
    this.xcVisible = true;
  }

  /**
   *
   */
  public handleOk(): void {
    this.xcVisible = false;
  }
}

