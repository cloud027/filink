import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {FilterCondition, QueryConditionModel} from '../../../../shared-module/model/query-condition.model';
import {OperatorEnum} from '../../../../shared-module/enum/operator.enum';
import {EquipmentListModel} from '../../../../core-module/model/equipment/equipment-list.model';
import {FacilityApiService} from '../../share/service/facility/facility-api.service';
import {ResultModel} from '../../../../shared-module/model/result.model';
import {RealPictureComponent} from '../../../../shared-module/component/real-picture/real-picture.component';
import {FormOperate} from '../../../../shared-module/component/form/form-operate.service';
import {RuleUtil} from '../../../../shared-module/util/rule-util';
import {ResultCodeEnum} from '../../../../shared-module/enum/result-code.enum';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {FacilityForCommonService} from '../../../../core-module/api-service/facility/facility-for-common.service';
import {EquipmentSensorModel} from '../../../../core-module/model/equipment/equipment-sensor.model';
import * as lodash from 'lodash';
import {FacilityLanguageInterface} from '../../../../../assets/i18n/facility/facility.language.interface';
import {LanguageEnum} from '../../../../shared-module/enum/language.enum';
import {NzI18nService} from 'ng-zorro-antd';
import {FormLanguageInterface} from '../../../../../assets/i18n/form/form.language.interface';
import {CommonUtil} from '../../../../shared-module/util/common-util';
import {DeviceStatusEnum, DeviceTypeEnum} from '../../../../core-module/enum/facility/facility.enum';
import {FacilityForCommonUtil} from '../../../../core-module/business-util/facility/facility-for-common.util';
import {EquipmentStatusEnum, EquipmentTypeEnum} from '../../../../core-module/enum/equipment/equipment.enum';
import {TableConfigModel} from '../../../../shared-module/model/table-config.model';
import {PageModel} from '../../../../shared-module/model/page.model';
import {ProductLanguageInterface} from '../../../../../assets/i18n/product/product.language.interface';
import {CommonLanguageInterface} from '../../../../../assets/i18n/common/common.language.interface';
import {ProductTypeEnum} from '../../../../core-module/enum/product/product.enum';
import {TableComponent} from '../../../../shared-module/component/table/table.component';
import {EquipmentAddInfoModel} from '../../../../core-module/model/equipment/equipment-add-info.model';
import {EquipmentApiService} from '../../share/service/equipment/equipment-api.service';
import {GatewayPortInfoModel} from '../../share/model/gateway-port-info.model';
import {SensorTypeEnum} from '../../share/enum/equipment.enum';
import {gatewayConfigImgUrlConst} from '../../share/const/loop-const';
import {AssetManagementLanguageInterface} from '../../../../../assets/i18n/asset-manage/asset-management.language.interface';
import {OperateTypeEnum} from '../../../../shared-module/enum/page-operate-type.enum';
import {EquipmentDetailComponent} from '../../equipment-manage/equipment-detail/equipment-detail.component';
import {IndexLanguageInterface} from '../../../../../assets/i18n/index/index.language.interface';
import {IndexFacilityService} from '../../../../core-module/api-service/index/facility';

declare const Print: any;

@Component({
  selector: 'app-wisdom-picture',
  templateUrl: './wisdom-picture.component.html',
  styleUrls: ['./wisdom-picture.component.scss']
})
export class WisdomPictureComponent implements OnInit {
  // 自动生成名称模板
  // @ViewChild('autoNameTemplate') private autoNameTemplate: TemplateRef<HTMLDocument>;
  // 设备类型模板
  // @ViewChild('productTemp') public productTemp: TemplateRef<HTMLDocument>;
  // 设备类型选择
  // @ViewChild('equipmentSelect') private equipmentSelect: TemplateRef<HTMLDocument>;
  @ViewChild('tableCom') public tableCom: TableComponent;
  @ViewChild('editPicture') editPicture: RealPictureComponent;
  @ViewChild('productPicture') productPicture: RealPictureComponent;
  @ViewChild('devicePicture') devicePicture: RealPictureComponent;
  // @ViewChild('radioTemp') private radioTemp: TemplateRef<HTMLDocument>;
  //  产品类型模版
  // @ViewChild('productTypeTemplate') public productTypeTemplate: TemplateRef<HTMLDocument>;
  @ViewChild('addEquipment') public addEquipmentTemp: EquipmentDetailComponent;
  // 设施语言包
  public language: FacilityLanguageInterface;
  // 表单语言包
  public formLanguage: FormLanguageInterface;
  // 产品管理国际化词条
  public productLanguage: ProductLanguageInterface;
  // 公共国际化
  public commonLanguage: CommonLanguageInterface;
  // 资产管理语言包
  public assetsLanguage: AssetManagementLanguageInterface;
  // 首页国际化
  public indexLanguage: IndexLanguageInterface;
  // 列表配置
  public tableConfig: TableConfigModel = new TableConfigModel();
  // 分页
  public pageBean: PageModel = new PageModel();
  // 查询参数对象集
  public queryCondition: QueryConditionModel = new QueryConditionModel();
  // 列表数据
  public _dataSet = [];
// 设施类型枚举
  public deviceTypeEnum = DeviceTypeEnum;
  // 产品类型枚举
  public productTypeEnum = ProductTypeEnum;
  // 设备类型枚举
  public equipmentTypeEnum = EquipmentTypeEnum;
  // 设施国际化
  public languageEnum = LanguageEnum;
  public supplierId;
  // 设施信息
  public bgColor;
  // 智慧杆槽位
  public mountPosition;
  // 设施Id
  public deviceId;
  // 打印定时器
  public stampTimer: any;
  // 是否开启编辑
  public isOpenUpData: boolean = false;
  // 是否显示上传信息
  public isShowBasicInformation: boolean = false;
  // 设备类型
  public equipmentType;
  // 已有设备弹框
  public existEquipmentVisible = false;
  // 已有设备过滤条件
  public equipmentFilter: FilterCondition[] = [];
  // 智慧杆是否处于编辑状态
  public isUpData: boolean = true;
  // 显示保存按钮
  public isSave: boolean = false;
  // 保存按钮是否可用
  public saveDisabled: boolean = false;
  // 表单状态
  public formStatus: FormOperate;
  // 设施信息
  public deviceInformationData;
  // 基础信息数据
  public basicInformationData = {
    name: null,
    assetsNo: null,
    model: null,
    status: null,
    type: null,
    time: null,
  };
  // 杆体基础信息
  shaftBasicInformationData;
  // 上传信息key
  uploadInformationKey = [];
  // 上传信息value
  uploadInformationValue;
  // 上传数据信息
  public uploadInformationData = {
    name: '名称01',
    assetsNo: '48513135464532131',
    model: 'XXX型号',
    status: '正常',
    type: '智慧多功能杆',
    time: '2020-04-20 13:56:23',
  };
  // 杆体信息数据
  public clubInformationData;
  // 设备类型
  public equipmentModel;
  // 性能结果集
  public performanceList: EquipmentSensorModel[] = [];
  // 引入qunee画布
  public Q = window['Q'];
  public graph;
  // 所选网关Id
  public gatewayId;
  // 所选网关Name
  public gatewayName;
  // 设备节点图片路径
  public imgUrl: string;
  // 网关拓扑图下拉选择器model
  public GatewaySelectModel: string;
  // 设施下所属网关数据
  public deviceGatewayData;
  // 网关端口信息
  public gatewayPortInfo: any;
  // 新增设备弹框是否显示
  public xcVisible: boolean = false;
  // 操作类型
  public operateType = OperateTypeEnum;
  // 端口能连设备类型
  public portType;
  // 点击端口序号
  public portNo: string;
  // 新增设备确定按钮状态
  public isLoading: boolean = false;
  // 新增设备表单提交是否可以操作
  public addOkDisabled: boolean = true;
  // 新增设备信息数据模型
  public saveAddEquipmentModel: EquipmentAddInfoModel = new EquipmentAddInfoModel();
  // 设备Id
  public equipmentId: string;
  // 是否显示网关拓扑图浮窗
  public isShow: boolean = false;
  // 是否显示网关拓扑图传感器浮窗
  public isShowSenor: boolean = false;
  // 浮窗距离左边
  public left: number = 10;
  // 浮窗距离右边
  public top: number = 10;
  // 工具类
  public commonUtil = CommonUtil;
  // 浮窗设备名称
  public floatWindowEquipmentName: string;
  // 浮窗设备类型
  public floatWindowEquipmentType: string;
  // 浮窗设备状态
  public floatWindowEquipmentStatus: string;
  // 浮窗设备型号
  public floatWindowEquipmentModel: string;
  // 浮窗资产编号
  public floatWindowEquipmentNo: string;
  // 浮窗安装时间
  public floatWindowEquipmentInstallationTime: string;
  // 传感器浮窗名称
  public floatWindowSenorName: string;
  // 传感器浮窗类型
  public floatWindowSenorType: any;
  // 传感器浮窗型号
  public floatWindowSenorModel: string;
  // 设施类型枚举
  public indexEquipmentTypeEnum = EquipmentTypeEnum;
  // 设施状态枚举
  public deviceStatusEnum = DeviceStatusEnum;
  // 设备状态枚举
  public equipmentStatusEnum = EquipmentStatusEnum;
  // 设备详情信息集合
  public equipmentDetailsData = [];
  // 传感器详情信息集合
  public sensorDetailsData = [];
  // 设施基础信息
  public deviceDetail;
  // qunee设备节点对象集合
  quneeEquipmentData = [];
  // 已渲染过的设备iD集合
  isShowEquipmentData = [];
  // 是否可以点击网关拓扑图
  public selectTabTwoDisabled: boolean = true;
  // 是否显示设备仓列表弹窗
  public isShowEquipmentListWindow: boolean = false;
  // 是否属于产品
  public isProduct: boolean;
  // 已选择的设备
  public syncEquipment = [];
  // 产品id
  public productId: string;
  // 产品智慧杆业务状态
  public productStatus: string;
  // 产品当前点击的点位
  public currentPointData;
  // 需要的画布高度
  public canvasHeight: number = window.innerHeight - 270;

  constructor(private $nzI18n: NzI18nService,
              private $ruleUtil: RuleUtil,
              private $active: ActivatedRoute,
              private $message: FiLinkModalService,
              private $facilityApiService: FacilityApiService,
              private $equipmentAipService: EquipmentApiService,
              private $facilityForCommonService: FacilityForCommonService,
              private $indexService: IndexFacilityService) {
  }

  ngOnInit() {
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.facility);
    this.formLanguage = this.$nzI18n.getLocaleData(LanguageEnum.form);
    this.productLanguage = this.$nzI18n.getLocaleData(LanguageEnum.product);
    this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
    this.assetsLanguage = this.$nzI18n.getLocaleData(LanguageEnum.assets);
    this.indexLanguage = this.$nzI18n.getLocaleData(LanguageEnum.index);
    this.$active.queryParams.subscribe(params => {
      console.log(params);
      this.deviceId = params.deviceId;
    });
    // 获取杆体信息
    this.getCluInformation();
    this.getGatewayInfo();
  }

  /**
   * 已有设备点击事件回传
   */
  public hasEquipment(e) {
    if (lodash.isEmpty(e.equipment)) {
      this.$message.error(this.language.assignType);
      return;
    }
    this.mountPosition = e.mountPosition;
    this.isProduct = e.isProduct;
    this.equipmentFilter = [
      new FilterCondition('equipmentType', OperatorEnum.in, e.equipment),
      new FilterCondition('deviceId', OperatorEnum.in, [this.deviceId]),
    ];
    if (!e.isProduct) {
      this.equipmentFilter.push(new FilterCondition('mountPosition', OperatorEnum.eq, false));
    }
    this.existEquipmentVisible = true;
  }

  /**
   * 已有设备弹窗选中的值变化
   * param event
   */
  public equipmentDataChange(event: EquipmentListModel[]): void {
    if (lodash.isEmpty(event)) {
      return;
    }
    if (this.isProduct) {
      // 属于同步产品操作
      const index = this.syncEquipment.findIndex(v => v.mountPosition === this.mountPosition);
      if (index > -1) {
        // 判断设备是否重复挂载
        const objIndex = this.syncEquipment.findIndex(v => v.equipmentId === event[0].equipmentId);
        if (objIndex > -1) {
          this.syncEquipment[objIndex].equipmentId = event[0].equipmentId;
          this.syncEquipment[objIndex].equipmentType = event[0].equipmentType;
          this.syncEquipment[objIndex].mountPosition = this.mountPosition;
        } else {
          this.syncEquipment[index].equipmentId = event[0].equipmentId;
          this.syncEquipment[index].equipmentType = event[0].equipmentType;
        }
      } else {
        // 判断设备是否重复挂载
        const objIndex = this.syncEquipment.findIndex(v => v.equipmentId === event[0].equipmentId);
        if (objIndex > -1) {
          this.syncEquipment[objIndex].equipmentId = event[0].equipmentId;
          this.syncEquipment[objIndex].equipmentType = event[0].equipmentType;
        } else {
          this.syncEquipment.push({
            equipmentId: event[0].equipmentId,
            equipmentType: event[0].equipmentType,
            mountPosition: this.mountPosition
          });
        }
      }
      this.productPicture.isShowClick = false;
      const imgData = this.productPicture.productImgData;
      const pointIndex = imgData.pointConfigList.findIndex(v => v.configSort === this.mountPosition);
      // const type = this.currentPointData.$equipmentType.join(',');
      const type = event[0].equipmentType;
      const pointData = imgData.productFileList.find(v => v.fileType === type);
      if (pointData) {
        // 判断该设备是否已经挂载其它位置，如果已挂载需清空已挂载
        // 1.找到已挂载位置
        const mounted = this.productPicture.productImgData.pointConfigList.findIndex(v => v.equipmentId === event[0].equipmentId);
        if (mounted > -1) {
          // 2.存在，清空已挂载
          this.productPicture.productImgData.pointConfigList[mounted].pointImage = null;
          this.productPicture.productImgData.pointConfigList[mounted].equipmentId = null;
        }
        // 3.当前点位将挂载设备id，图片
        this.productPicture.productImgData.pointConfigList[pointIndex].equipmentId = event[0].equipmentId;
        this.productPicture.productImgData.pointConfigList[pointIndex].pointImage = pointData.fileFullPath;
        this.$message.success(this.language.addSuccess);
        // 刷新图形
        this.productPicture.initWisdomPosition();
      }
    } else {
      // 已有设备端口配置请求
      console.log(event);
      const body = {
        'equipmentId': event[0].equipmentId,
        'equipmentType': event[0].equipmentType,
        'deviceId': this.deviceId,
        'mountPosition': this.mountPosition
      };
      // 正常设施操作
      this.$facilityApiService.updatePoleInfoByEquipment(body).subscribe((result: ResultModel<any>) => {
        if (result.code === ResultCodeEnum.success) {
          this.$message.success(this.language.addSuccess);
        } else {
          this.$message.error(this.language.addFailed);
        }
        this.editPicture.resetQ();
      });
    }
  }

  /**
   * 新增设备事件回传
   * param e
   */
  public addEquipment(e) {
    if (lodash.isEmpty(e.equipment)) {
      this.$message.error(this.language.assignType);
      return;
    }
    // 获取有权限的设备类型
    const getRoleEquipment = FacilityForCommonUtil.getRoleEquipmentType(this.$nzI18n).map(item => item.code);
    // 所选槽位
    // this.mountPosition = e.mountPosition;
    // 过滤没有有权限的设备类型
    this.equipmentType = e.equipment.map(item => {
      if (getRoleEquipment.includes(item)) {
        return {label: CommonUtil.codeTranslate(EquipmentTypeEnum, this.$nzI18n, item, LanguageEnum.facility), value: item};
      }
    });
    console.log(e.deviceDetail);
    this.deviceDetail = e.deviceDetail;
    this.deviceDetail['mountPosition'] = Number(e.mountPosition);
    this.xcVisible = true;
  }

  /**
   * 杆体示意图点击事件回传
   */
  public clickChange(evt) {
    // 属于同步产品
    if (this.isProduct || evt.$pointType) {
      this.currentPointData = evt;
      return;
    }
    if (!this.isOpenUpData) {
      if (evt && evt.$detail) {
        // 变化基础信息
        this.bgColor = CommonUtil.getEquipmentStatusIconClass(evt.$detail.equipmentStatus).bgColor;
        this.basicInformationData = {
          name: evt.$detail.equipmentName,
          assetsNo: evt.$detail.equipmentCode,
          model: evt.$detail.equipmentModel,
          status: CommonUtil.codeTranslate(EquipmentStatusEnum, this.$nzI18n, evt.$detail.equipmentStatus, LanguageEnum.facility),
          type: CommonUtil.codeTranslate(EquipmentTypeEnum, this.$nzI18n, evt.$detail.equipmentType, LanguageEnum.facility),
          time: evt.$detail.installationDate,
        };
        // 上传信息
        this.showUploadInfo(evt);
      } else {
        this.bgColor = CommonUtil.getDeviceStatusIconClass(this.deviceInformationData.deviceStatus).colorClass.replace('-c', '-bg');
        this.basicInformationData = this.shaftBasicInformationData;
        this.uploadInformationKey = [];
        this.isShowBasicInformation = false;
      }
    }
    if (evt.$detail && evt.$detail.equipmentId) {
      this.equipmentId = evt.$detail.equipmentId;
    }
  }

  /**
   * 产品杆型图无数据
   */
  public productInfoChange(v) {
    this.saveDisabled = v;
  }

  /**
   * 获取上传信息
   * param evt
   */
  public showUploadInfo(evt) {
    // 上传信息
    this.getSensor(evt).then(value => {
      this.getEquipmentDataByType(evt).then(_value => {
        if (this.uploadInformationKey && this.uploadInformationKey.length) {
          this.uploadInformationKey.forEach(item => {
            item.value = this.uploadInformationValue[item.id];
          });
          const list1 = lodash.take(this.uploadInformationKey, 4);
          const list2 = lodash.takeRight(this.uploadInformationKey, this.uploadInformationKey.length - 4);
          this.uploadInformationKey = [list1, list2];
          console.log(this.uploadInformationKey);
        } else {
          this.uploadInformationKey = [];
        }
        this.uploadInformationKey.length > 0 ? this.isShowBasicInformation = true : this.isShowBasicInformation = false;
      });
    });
  }

  /**
   * 获取上传信息key
   */
  public getSensor(evt) {
    return new Promise((resolve, reject) => {
      // 获取上传信息key
      this.$facilityForCommonService.getSensor({equipmentId: evt.$detail.equipmentId}).subscribe((result: ResultModel<any>) => {
        if (result.code === ResultCodeEnum.success) {
          console.log(result);
          this.uploadInformationKey = result.data;
          resolve(result);
        }
      });
    });
  }

  /**
   * 获取上传信息value
   */
  public getEquipmentDataByType(evt) {
    return new Promise((resolve, reject) => {
      // 获取上传信息value
      this.$equipmentAipService.getEquipmentDataByType({
        equipmentId: evt.$detail.equipmentId,
        equipmentType: evt.$detail.equipmentType
      }).subscribe((result: ResultModel<any>) => {
        if (result.code === ResultCodeEnum.success) {
          console.log(result.data.performanceData);
          const value = JSON.parse(result.data.performanceData);
          this.uploadInformationValue = value;
          resolve(result);
        }
      });
    });
  }

  /**
   * 编辑按钮点击事件
   */
  public upDataClick() {
    this.isUpData = false;
    this.isOpenUpData = true;
    this.editPicture.resetQ();
  }

  /**
   * 退出按钮点击事件
   */
  public closeClick() {
    this.isSave = false;
    this.isUpData = true;
    this.isOpenUpData = false;
    this.editPicture.resetQ();
  }

  /**
   * 根据杆体Id查询设施信息
   */
  public getCluInformation(): void {
    const body = {
      deviceId: this.deviceId
    };
    this.$facilityApiService.queryDeviceInfo(body).subscribe((result: ResultModel<any>) => {
      console.log(result);
      if (result.code === ResultCodeEnum.success) {
        this.deviceInformationData = result.data[0];
        this.productStatus = result.data[0].businessStatus;
        this.bgColor = CommonUtil.getDeviceStatusIconClass(result.data[0].deviceStatus).colorClass.replace('-c', '-bg');
        this.shaftBasicInformationData = {
          name: result.data[0].deviceName,
          assetsNo: result.data[0].deviceCode,
          model: result.data[0].deviceModel,
          status: CommonUtil.codeTranslate(DeviceStatusEnum, this.$nzI18n, result.data[0].deviceStatus),
          type: CommonUtil.codeTranslate(DeviceTypeEnum, this.$nzI18n, result.data[0].deviceType, LanguageEnum.index),
          time: result.data[0].installationDate,
        };
        this.basicInformationData = this.shaftBasicInformationData;
      } else {
        this.$message.error(result.msg);
      }
    });
  }

  /**
   * 杆体信息回传
   */
  public clubInformationChange(evt): void {
    this.productId = evt.productId;
    this.clubInformationData = evt;
  }

  /**
   * 杆体示意图标签选中回调函数
   */
  public selectTabOne(): void {
    this.editPicture.graph.clear();
    this.editPicture.initCanvas();
    this.editPicture.graph.zoomToOverview();
  }

  /**
   * 网关拓扑图标签选中回调函数
   */
  public selectTabTwo(): void {
    this.selectGatewayChange(this.deviceGatewayData[0].equipmentId);
    this.GatewaySelectModel = this.deviceGatewayData[0].equipmentId;
  }

  /**
   * 获取网关信息
   */
  public getGatewayInfo() {
    // 这里只查网关，所以设备类型写死
    this.$equipmentAipService.getEquipmentById({
      'deviceId': this.deviceId,
      'equipmentType': 'E001'
    }).subscribe((result: ResultModel<any>) => {
      if (result.code === ResultCodeEnum.success) {
        this.deviceGatewayData = result.data;
        // 默认显示第一个网关拓扑图
        if (result.data.length) {
          this.selectTabTwoDisabled = false;
        } else {
          this.selectTabTwoDisabled = true;
        }
      }
    });
  }

  /**
   * 网关select选择器change
   */
  public selectGatewayChange(evt): void {
    if (this.graph !== undefined) {
      this.graph.clear();
    }
    setTimeout(() => {
      this.gatewayId = evt;
      this.gatewayQuneeInit();
      this.deviceGatewayData.forEach(item => {
        if (item.equipmentId === evt) {
          this.gatewayName = item.equipmentName;
        }
      });
    }, 500);
  }

  /**
   * 网关qunee拓扑图初始化
   */
  public gatewayQuneeInit(): void {
    // qunee画布
    if (this.graph === undefined) {
      this.graph = new this.Q.Graph('gateway-canvas');
    }
    // 请求初始化网关配置信息
    this.initGateWay({
      'equipmentId': this.gatewayId // 网关id
    }).then(() => {
      // 根据返回信息绘制网关配置界面
      this.drawNodeInfo();
    });
    // 鼠标移动事件
    this.graph.onmousemove = (evt) => {
      if (evt.getData() && evt.getData().$detail && evt.getData().$detail.sensorId) {
        const a = evt.getData();
        console.log(a);
        // 浮窗设备名称
        this.floatWindowSenorName = evt.getData().$detail.sensorName;
        // 浮窗设备类型
        this.floatWindowSenorType = this.commonUtil.codeTranslate(SensorTypeEnum, this.$nzI18n, evt.getData().$detail.sensorType, this.languageEnum.facility);
        // 浮窗设备状态
        this.floatWindowSenorModel = evt.getData().$detail.sensorModel;
        this.isShowSenor = true;
        this.left = evt.layerX + 10;
        this.top = evt.layerY + 100;
      } else if (evt.getData() && evt.getData().$detail) {
        // 浮窗设备名称
        this.floatWindowEquipmentName = evt.getData().$detail.equipmentName;
        // 浮窗设备类型
        this.floatWindowEquipmentType = evt.getData().$detail.equipmentType;
        // 浮窗设备状态
        this.floatWindowEquipmentStatus = evt.getData().$detail.equipmentStatus;
        // 浮窗设备型号
        this.floatWindowEquipmentModel = evt.getData().$detail.equipmentModel;
        // 浮窗资产编号
        this.floatWindowEquipmentNo = evt.getData().$detail.equipmentCode;
        // 浮窗安装时间
        this.floatWindowEquipmentInstallationTime = evt.getData().$detail.installationDate;
        this.isShow = true;
        this.left = evt.layerX + 10;
        this.top = evt.layerY;
      } else {
        this.isShowSenor = false;
        this.isShow = false;
      }
    };
  }

  /**
   * 初始化绘制网关配置
   */
  public initGateWay(gatewayInfo): Promise<GatewayPortInfoModel[]> {
    this.gatewayPortInfo = [];
    return new Promise((resolve, reject) => {
      // 网关端口初始化信息
      this.$equipmentAipService.queryEquipmentPortInfoTopology(gatewayInfo).subscribe(
        (result: ResultModel<any>) => {
          if (result.code === ResultCodeEnum.success) {
            if (!lodash.isEmpty(result.data)) {
              // 初始化网关配置信息存放
              this.gatewayPortInfo = result.data;
            }
            resolve();
          } else {
            reject();
          }
        });
    });
  }

  /**
   * 初始化网关配置拓扑页面
   */
  public drawNodeInfo(): void {
    this.quneeEquipmentData = [];
    this.isShowEquipmentData = [];
    // 绘制网关端口框架
    this.onCreateNode('', 0, 0, 'gateway-frame',
      this.gatewayPortInfo.filePath, false, 120, 360);
    const portInfo = this.gatewayPortInfo;
    const portList = [];
    // 因业务逻辑修改，所以不需要去重处理
    const equipmentCanvasList = portInfo.equipmentPortLiveInfoRespList;
    if (!lodash.isEmpty(portInfo.equipmentPortConfigInfoRespList)) {
      portInfo.equipmentPortConfigInfoRespList.forEach(item => {
        const portPosition = item.portPosition.split(',');
        item.portPositionX = Number(portPosition[0]);
        item.portPositionY = Number(portPosition[1]);
        item.status = !!item.endSourceId;
        if (item.portType === 'LAN') {
          item.portW = 34;
          item.portH = 30;
        } else {
          item.portW = 16;
          item.portH = 7;
        }
        let portNode;
        portNode = this.onCreateNode(item.portName, item.portPositionX, item.portPositionY,
          'port', item.portImage, false, item.portW, item.portH, item.status, item.portNo, item.portType, item.portFlag, item.endSourceId, item.isSensor);
        portNode.setStyle(this.Q.Styles.LABEL_FONT_SIZE, 5);
        portList.push({hasEquipment: item.portType + '-' + item.portNo, portNode: portNode, portMsg: item});
      });
    }
    if (!lodash.isEmpty(equipmentCanvasList)) {
      const detailList = lodash.uniq(equipmentCanvasList.map(item => item.endSourceId));
      this.getSensorsDataList(detailList).then(_value => {
        this.getEquipmentsDataList(detailList).then(value => {
          this.equipmentDetailsData = this.sensorDetailsData.concat(this.equipmentDetailsData);
          equipmentCanvasList.forEach(item => {
            if (item.endSourcePosition) {
              const equipmentPosition = item.endSourcePosition.split(',');
              item.equipmentNodeX = Number(equipmentPosition[0]);
              item.equipmentNodeY = Number(equipmentPosition[1]);
            }
            // 根据设备类型放对应图片
            this.putImgChange(item.endSourceType);
            // 因后台返回数据设备与端口一一对应，导致设备有可能重复渲染，需做设备渲染去重
            if (!this.isShowEquipmentData.includes(item.endSourceId)) {
              const equipmentNode = this.onCreateNode(item.nodeName, item.equipmentNodeX, item.equipmentNodeY, 'equipmentNode'
                , this.imgUrl, true, 60, 60, false, item.portNo, item.portType, item.portFlag, item.endSourceId);
              equipmentNode['$isSensor'] = Object.values(SensorTypeEnum).includes(item.endSourceType);
              equipmentNode['$equipmentId'] = item.endSourceId;
              equipmentNode['$equipmentModel'] = item.endSourceModel;
              equipmentNode['$equipmentType'] = item.endSourceType;
              equipmentNode['$portName'] = item.portType + '-' + item.portNo;
              this.equipmentDetailsData.forEach(_item => {
                if (item.endSourceId === _item.equipmentId) {
                  equipmentNode.$detail = _item;
                }
                if (item.endSourceId === _item.sensorId) {
                  equipmentNode.$detail = _item;
                }
              });
              portList.forEach(_item => {
                if (item.portType + '-' + item.portNo === _item.hasEquipment) {
                  _item.portNode.$status = true;
                  this.createLine(_item.portNode, equipmentNode, _item.portMsg.lineName, 'line');
                  equipmentNode['$portNo'] = _item.portMsg.portNo;
                }
              });
              this.quneeEquipmentData.push(equipmentNode);
              this.isShowEquipmentData.push(equipmentNode.$equipmentId);
            } else {
              this.quneeEquipmentData.forEach(nodeItem => {
                if (nodeItem.$equipmentId === item.endSourceId) {
                  portList.forEach(_item => {
                    if (item.portType + '-' + item.portNo === _item.hasEquipment) {
                      this.createLine(_item.portNode, nodeItem, _item.portMsg.lineName, 'line');
                      nodeItem['$portNo'] = _item.portMsg.portNo;
                    }
                  });
                }
              });
            }
          });
        });
      });
    }
  }

  /**
   * 获取多个设备详细信息
   */
  public getEquipmentsDataList(list) {
    return new Promise(resolve => {
      this.$indexService.queryEquipmentInfoList(list).subscribe((equipmentResult: ResultModel<any>) => {
        if (equipmentResult.code === ResultCodeEnum.success) {
          this.equipmentDetailsData = equipmentResult.data;
          resolve(this.equipmentDetailsData);
        }
      });
    });
  }

  /**
   * 获取多个传感器详细信息
   */
  public getSensorsDataList(list) {
    return new Promise(resolve => {
      this.$equipmentAipService.querySensorInfoList(list).subscribe((result: ResultModel<any>) => {
        if (result.code === ResultCodeEnum.success) {
          this.sensorDetailsData = result.data;
          resolve(this.sensorDetailsData);
        }
      });
    });
  }

  /**
   * 节点放置方法
   * 此处返回any是因为qunee里面节点类型是不确定性
   */
  private onCreateNode(nodeName, nodeX, nodeY, type, image, move, w?, h?, status?, portNo?, portType?, portFlag?, endSourceId?, isSensor = false): any {
    const node = this.graph.createNode(nodeName, nodeX, nodeY);
    node.image = image;
    node.movable = move;
    node['$type'] = type;
    // 如果是端口号 字体大小
    if (type === 'port') {
      // 端口状态、端口序号、端口能连设备类型
      node['$status'] = status;
      node['$portNo'] = portNo;
      node['$portType'] = portType;
      node['$portFlag'] = portFlag;
      node['$endSourceId'] = endSourceId;
      node['$isSensor'] = isSensor;
      // 端口节点样式
      node.zIndex = 10;
      node.anchorPosition = this.Q.Position.MIDDLE;
      node.setStyle(this.Q.Styles.SELECTION_COLOR, '#f516d1');
      node.setStyle(this.Q.Styles.SELECTION_SHADOW_OFFSET_X, 2);
      node.setStyle(this.Q.Styles.SELECTION_SHADOW_OFFSET_Y, 2);
      node.setStyle(this.Q.Styles.LABEL_POSITION, this.Q.Position.CENTER_MIDDLE);
      node.setStyle(this.Q.Styles.LABEL_ANCHOR_POSITION, this.Q.Position.CENTER_MIDDLE);
      node.setStyle(this.Q.Styles.LABEL_COLOR, '#fff');
      node.setStyle(this.Q.Styles.LABEL_FONT_SIZE, 2);
    }
    if (type === 'equipmentNode') {
      node.size = {width: w, height: h};
      node['$portNo'] = portNo;
      node['$portType'] = portType;
      node['$portFlag'] = portFlag;
      node['$endSourceId'] = endSourceId;
      node.zIndex = 20;
    }
    return node;
  }

  /**
   * 根据设备类型选择放相关的图片  摄像头  单灯控制器  信息屏 广播 微气象仪
   */
  private putImgChange(type: EquipmentTypeEnum): void {
    switch (type) {
      // 摄像头
      case EquipmentTypeEnum.camera:
        this.imgUrl = gatewayConfigImgUrlConst.camera;
        break;
      // 单灯控制器
      case EquipmentTypeEnum.singleLightController:
        this.imgUrl = gatewayConfigImgUrlConst.singleController;
        break;
      // 信息屏
      case EquipmentTypeEnum.informationScreen:
        this.imgUrl = gatewayConfigImgUrlConst.screen;
        break;
      // 广播
      case EquipmentTypeEnum.broadcast:
        this.imgUrl = gatewayConfigImgUrlConst.broadcast;
        break;
      // 微气象仪
      case EquipmentTypeEnum.weatherInstrument:
        this.imgUrl = gatewayConfigImgUrlConst.weatherInstrument;
        break;
      // 门禁
      case EquipmentTypeEnum.gatePositionSwitch:
        this.imgUrl = gatewayConfigImgUrlConst.accessControl;
        break;
      // 水侵
      case EquipmentTypeEnum.floodingSensor:
        this.imgUrl = gatewayConfigImgUrlConst.waterInvasion;
        break;
      // 温湿度
      // case EquipmentTypeEnum.weatherInstrument:
      //   this.imgUrl = gatewayConfigImgUrlConst.weatherInstrument;
      //   break;
      // 烟雾
      case EquipmentTypeEnum.smokeSensor:
        this.imgUrl = gatewayConfigImgUrlConst.smoke;
        break;
      // 一键呼叫
      case EquipmentTypeEnum.oneButtonAlarm:
        this.imgUrl = gatewayConfigImgUrlConst.oneTouchCall;
        break;
      default:
        // 信息屏
        this.imgUrl = gatewayConfigImgUrlConst.screen;
        break;
    }
  }

  /**
   * 连线方法
   */
  private createLine(equipmentNode, portNode, lineName, type): void {
    const line = this.graph.createEdge(equipmentNode, portNode, lineName);
    line['$type'] = type;
    line.zIndex = 12;
    line.setStyle(this.Q.Styles.EDGE_COLOR, '#88AAEE');
    line.setStyle(this.Q.Styles.EDGE_WIDTH, 2);
    line.setStyle(this.Q.Styles.ARROW_TO, false);
    line.edgeType = this.Q.Consts.EDGE_TYPE_ORTHOGONAL;
    line.setStyle(this.Q.Styles.SELECTION_COLOR, '#f516d1');
    line.setStyle(this.Q.Styles.SELECTION_SHADOW_OFFSET_X, 2);
    line.setStyle(this.Q.Styles.SELECTION_SHADOW_OFFSET_Y, 2);
  }

  /**
   * 打印
   */
  public onStamp(): boolean {
    // 画布打印缩放级别和范围内容
    const imageInfo = this.graph.exportImage(1, this.graph.bounds);
    if (!imageInfo || !imageInfo.data) {
      return false;
    }
    const win = window.open();
    const doc = win.document;
    // 打印qunee相关样式
    doc.title = '配置网关';
    const img = doc.createElement('img');
    img.src = imageInfo.data;
    doc.body.style.textAlign = 'center';
    doc.body.style.margin = '50px  auto 0px';
    doc.body.appendChild(img);
    img.style.maxWidth = '100%';
    img.style.maxHeight = '100%';
    this.stampTimer = setTimeout(function () {
      win.focus();
      win.print();
      win.close();
    }, 100);
  }

  /**
   * 获取新增设备表单key额外参数
   */
  public getExtraRequest(event: EquipmentAddInfoModel): void {
    this.saveAddEquipmentModel = event;
  }

  /**
   * 获取填写新增设备表单数据
   */
  public getFormStatus(event: FormOperate): void {
    this.formStatus = event;
  }

  /**
   * 新增设备表单数据是否可提交
   */
  public getFormDisabled(event: boolean): void {
    this.addOkDisabled = event;
  }


  /**
   * 新增设备确定事件
   */
  public handleAddOk(): void {
    this.saveAddEquipmentModel.gatewayId = this.gatewayId;
    const formValue = lodash.cloneDeep(this.formStatus.group.getRawValue());
    Object.keys(this.saveAddEquipmentModel).forEach(v => {
      if (this.saveAddEquipmentModel[v]) {
        formValue[v] = this.saveAddEquipmentModel[v];
      }
    });
    this.saveAddEquipmentModel.equipmentControlType = formValue.equipmentControlType = EquipmentTypeEnum.gateway;
    formValue.installationDate = formValue.installationDate ? new Date(formValue.installationDate).getTime() : null;
    // formValue.portNo = this.portNo;
    // formValue.portType = this.portType;
    if (formValue.portNo) {
      const portList = formValue.portNo.split(',');
      formValue.portNo = portList[1];
      formValue.portType = portList[0];
    }
    // @ts-ignore
    formValue.supplierId = this.formStatus.supplierId;
    formValue.softwareVersion = this.addEquipmentTemp._selectedProduct.softwareVersion;
    formValue.hardwareVersion = this.addEquipmentTemp._selectedProduct.hardwareVersion;
    // 区分枪机或是球机
    formValue.equipmentModelType = this.addEquipmentTemp._selectedProduct.pattern;
    if (formValue.powerControlPortNo) {
      const list = formValue.powerControlPortNo.split(',');
      formValue.powerControlPortNo = list[1];
      formValue.powerControlPortType = list[0];
    }
    this.$equipmentAipService.addEquipment(formValue).subscribe((result: ResultModel<string>) => {
      this.isLoading = false;
      if (result.code === ResultCodeEnum.success) {
        // 新增成功返回的设备id
        this.equipmentId = result.data;
        // 获取设备id进行图片上传
        this.addEquipmentTemp.uploadEquipmentPic(this.equipmentId);
        // 刷新画布
        this.editPicture.resetQ();
        this.xcVisible = false;
        this.$message.success(this.assetsLanguage.addSuccess);
      } else {
        this.$message.error(this.assetsLanguage.addFailed);
      }
    }, () => this.isLoading = false);

  }

  /**
   * 获取设备Icon样式
   */
  public getEquipmentIconStyle(type?: string) {
    if (type === 'E005') {
      return 'iconfont facility-icon fiLink-camera-statistics all-facility-color';
    } else {
      return CommonUtil.getEquipmentIconClassName(type);
    }
  }

  /**
   * 打印多功能杆
   */
  public onPrint() {
    // 画布打印缩放级别和范围内容
    const imageInfo = this.editPicture.graph.exportImage(1, this.editPicture.graph.bounds);
    if (!imageInfo || !imageInfo.data) {
      return false;
    }
    // 打印qunee相关样式
    const imgBox = document.getElementById('img-box');
    const img = document.createElement('img');
    img.src = imageInfo.data;
    imgBox.appendChild(img);
    img.style.maxWidth = '90%';
    img.style.maxHeight = '90%';
    Print('#print-wrap', {
      importCSS: true,
      onStart: function () {
      },
      onEnd: function () {
        imgBox.removeChild(img);
      }
    });
  }

  /**
   * 导出图片
   */
  public onExport(): boolean {
    if (this.graph) {
      return FacilityForCommonUtil.onPrint(this.graph, this.commonLanguage);
    }
  }

  /**
   * 查看设备仓列表
   */
  public viewEquipmentWarehouseList() {
    this.isShowEquipmentListWindow = true;
  }

  /**
   * 设备仓列表设备点击事件回传
   * @param event 选中设备信息
   */
  public showEquipmentInfo(event) {
    // 关闭列表弹窗
    this.isShowEquipmentListWindow = false;
    this.bgColor = CommonUtil.getDeviceStatusIconClass(event.equipmentStatus).colorClass.replace('-c', '-bg');
    this.basicInformationData = {
      // 设备名称
      name: event.equipmentName,
      // 资产编码
      assetsNo: event.equipmentCode,
      // 设备型号
      model: event.equipmentModel,
      // 设备状态
      status: CommonUtil.codeTranslate(EquipmentStatusEnum, this.$nzI18n, event.equipmentStatus, LanguageEnum.facility),
      // 设备类型
      type: CommonUtil.codeTranslate(EquipmentTypeEnum, this.$nzI18n, event.equipmentType, LanguageEnum.facility),
      // 安装时间
      time: event.installationDate,
    };
    const evt = {
      '$detail': {
        equipmentId: event.equipmentId,
        equipmentType: event.equipmentType,
      }
    };
    // 设备上传信息
    this.showUploadInfo(evt);
  }

  /**
   * 同步产品
   */
  public syncProduct(): void {
    // this.productId = 'lobEEzKkXPGkAEHBzqX';
    this.isUpData = false;
    this.isOpenUpData = true;
    this.isSave = true;
  }

  /**
   * 保存
   */
  public saveSync(): void {
    const data = {
      deviceId: this.deviceId,
      deviceModel: this.deviceInformationData.deviceModel,
      supplierId: this.deviceInformationData.supplierId,
      supplierName: this.deviceInformationData.supplierName,
      productId: this.productId,
      equipmentParams: this.syncEquipment
    };
    this.$facilityApiService.saveSyncProduct(data).subscribe((result: ResultModel<string>) => {
      if (result.code === ResultCodeEnum.success) {
        this.$message.success(this.language.savaSuccess);
        this.closeClick();
      } else {
        this.$message.error(result.msg);
      }
    });
  }
}
