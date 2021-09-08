import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {NzI18nService, NzModalService} from 'ng-zorro-antd';
import * as _ from 'lodash';
import {EquipmentApiService} from '../../../share/service/equipment/equipment-api.service';
import {ApplicationSystemForCommonService} from '../../../../../core-module/api-service/application-system';
import {FiLinkModalService} from '../../../../../shared-module/service/filink-modal/filink-modal.service';
import {FormOperate} from '../../../../../shared-module/component/form/form-operate.service';
import {FilterCondition} from '../../../../../shared-module/model/query-condition.model';
import {FormItem} from '../../../../../shared-module/component/form/form-config';
import {FacilityLanguageInterface} from '../../../../../../assets/i18n/facility/facility.language.interface';
import {AssetManagementLanguageInterface} from '../../../../../../assets/i18n/asset-manage/asset-management.language.interface';
import {ResultModel} from '../../../../../shared-module/model/result.model';
import {GatewayPortInfoModel} from '../../../share/model/gateway-port-info.model';
import {OperatorEnum} from '../../../../../shared-module/enum/operator.enum';
import {LanguageEnum} from '../../../../../shared-module/enum/language.enum';
import {ResultCodeEnum} from '../../../../../shared-module/enum/result-code.enum';
import {gatewayConfigImgUrlConst} from '../../../share/const/loop-const';
import {HISTORY_GO_STEP_CONST} from '../../../share/const/facility-common.const';
import {OperateTypeEnum} from '../../../../../shared-module/enum/page-operate-type.enum';
import {InstructSendRequestModel} from '../../../../../core-module/model/group/instruct-send-request.model';
import {EquipmentDetailComponent} from '../../equipment-detail/equipment-detail.component';
import {RuleUtil} from '../../../../../shared-module/util/rule-util';
import {CommonLanguageInterface} from '../../../../../../assets/i18n/common/common.language.interface';
import {ConfigResponseContentModel} from '../../../../../core-module/model/equipment/config-response-content.model';
import {EquipmentAddInfoModel} from '../../../../../core-module/model/equipment/equipment-add-info.model';
import {ConfigDetailRequestModel} from '../../../../../core-module/model/equipment/config-detail-request.model';
import {EquipmentStatusEnum, EquipmentTypeEnum, portTypeEnum} from '../../../../../core-module/enum/equipment/equipment.enum';
import {ControlInstructEnum} from '../../../../../core-module/enum/instruct/control-instruct.enum';
import {EquipmentListModel} from '../../../../../core-module/model/equipment/equipment-list.model';
import {SensorTypeEnum} from '../../../share/enum/equipment.enum';
import {CommonUtil} from '../../../../../shared-module/util/common-util';
import {SensorModel} from '../../../share/model/sensor.model';
import {IndexLanguageInterface} from '../../../../../../assets/i18n/index/index.language.interface';
import {IndexFacilityService} from '../../../../../core-module/api-service/index/facility';

/**
 * 网关配置组件
 */
@Component({
  selector: 'app-gateway-configuration',
  templateUrl: './gateway-configuration.component.html',
  styleUrls: ['./gateway-configuration.component.scss']
})
export class GatewayConfigurationComponent implements OnInit, OnDestroy {
  //  地图组件
  @ViewChild('addEquipment') public addEquipmentTemp: EquipmentDetailComponent;
  // 设施语言包
  public language: FacilityLanguageInterface;
  // 首页国际化
  public indexLanguage: IndexLanguageInterface;
  // 资产管理语言包
  public assetsLanguage: AssetManagementLanguageInterface;
  // 公共国际化
  public commonLanguage: CommonLanguageInterface;
  // 工具类
  public commonUtil = CommonUtil;
  // 设施类型枚举
  public indexEquipmentTypeEnum = EquipmentTypeEnum;
  // 设备状态枚举
  public equipmentStatusEnum = EquipmentStatusEnum;
  // 设施国际化
  public languageEnum = LanguageEnum;
  // 新增设备弹框是否显示
  public xcVisible: boolean = false;
  // 修改当前配置弹框是否显示
  public editXcVisible: boolean = false;
  // 显示新增设备底部按钮还是配置底部按钮
  public isAddOrConfig: boolean = true;
  // 点击未使用的端口出现按钮
  public addButtonPart: boolean = false;
  // 点击使用的端口出现按钮
  public editButtonPart: boolean = false;
  // 已有设备弹框显示
  public existEquipmentVisible: boolean = false;
  // 已有设备过滤条件
  public equipmentFilter: FilterCondition[] = [];
  // 网关id
  public gatewayId: string;
  // 网关名称
  public gatewayName: string;
  // 网关型号
  public gatewayModel: string;
  // 新增设备确定按钮状态
  public isLoading: boolean = false;
  // 是否显示网关拓扑图浮窗
  public isShow: boolean = false;
  // 是否显示网关拓扑图传感器浮窗
  public isShowSenor: boolean = false;
  // 是否显示有无该设备权限浮窗
  public noIsEquipmentCode: boolean = false;
  // 浮窗距离左边
  public left: number = 10;
  // 浮窗距离右边
  public top: number = 10;
  // 浮窗设备名称
  public floatWindowEquipmentName: string;
  // 浮窗设备类型
  public floatWindowEquipmentType: string;
  // 摄像头类型（球形枪型）
  public floatWindowEquipmentModelType: string;
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
  // 表单实例
  public formStatus: FormOperate;
  // 新增设备表单提交是否可以操作
  public addOkDisabled: boolean = true;
  // 设备配置提交是否可以操作
  public configOkDisabled: boolean[] = [true, true];
  // 点击端口序号
  public portNo: string;
  // 端口能连设备类型
  public portType;
  public portFlag: portTypeEnum;
  // 点击端口序号X坐标
  public portPositionX: number;
  // 点击端口序号Y坐标
  public portPositionY: number;
  // 和端口相连的设备id
  public usedEquipmentId: string;
  // 和端口相连的设备id
  public usedEquipmentName: string;
  // 和端口相连的设备类型
  public usedEquipmentType: EquipmentTypeEnum;
  // 是否可以点击新增设备tab页面
  public isShowAddTab: boolean = true;
  // 是否可以点击配置tab页面
  public isShowConfigTab: boolean = false;
  // 新增设备型号
  public addEquipmentModel: string;
  // 新增设备弹框每次打开初始页面
  public initTabNum: number;
  // 是否加载新增设备配置组件
  public isShowConfigContent: boolean = false;
  // 默认给设备位置
  public equipmentPosition: string;
  // 编辑节点名称弹框是否开启
  public editNodeNameXcVisible: boolean = false;
  // 编辑连线名称弹框是否开启
  public editLineNameXcVisible: boolean = false;
  // 编辑节点名称表单
  public editNodeNameFormColumn: FormItem[] = [];
  // 编辑连线名称表单
  public editLineNameFormColumn: FormItem[] = [];
  // 编辑节点名称表单状态
  public editNodeNameFormStatus: FormOperate;
  // 编辑连线名称表单状态
  public editLineNameFormStatus: FormOperate;
  // 新增设备表单配置
  public formColumn: FormItem[] = [];
  // 设备节点图片路径
  public imgUrl: string;
  // 设备节点是否移动过标识
  public isHadMove: boolean;
  // 已有设备组件是否加载
  public hasDevicePart: boolean = false;
  // 移动设备节点位置信息保存
  public saveMoveData: any[];
  // 网关信息请求参数
  public gatewayInfo;
  // 设备配置项内容
  public equipmentConfigContent: ConfigResponseContentModel[] = [];
  // 网关端口信息
  public gatewayPortInfo: any;
  // 设备配置表单value
  public equipmentConfigValue: ConfigResponseContentModel[] = [];
  // 菜单按钮
  public buttonMenu;
  // 引入qunee画布
  public Q = window['Q'];
  public graph;
  // 页面是否加载
  public pageLoading: boolean = false;
  // 设备配置详情参数
  public configValueParam: ConfigDetailRequestModel = new ConfigDetailRequestModel();
  // 判断时新增设备配置操作还是修改设备配置操作
  public differentConfig: boolean;
  // 打印定时器
  public stampTimer: any;
  // 节点名称
  public nodeName: string;
  // 连线名称
  public lineName: string;
  // 修改配置弹框弹框设备id
  public configEquipmentId: string;
  // 新增设备配置弹框设备id
  public centerControlId: string;
  // 当前表单序号,默认初始表单
  public currentIndex: number = 0;
  // 新增设备信息数据模型
  public saveAddEquipmentModel: EquipmentAddInfoModel = new EquipmentAddInfoModel();
  // 新增设备配置部分初始隐藏
  public isShowConfigPart: boolean = false;
  // 操作类型
  public operateType = OperateTypeEnum;
  // 传感器弹窗操作类型
  public currentOperateType: OperateTypeEnum;
  // 新增传感器弹窗显示
  public addSensorXcVisible: boolean = false;
  // 传感器表单配置
  public sensorFormColumn: FormItem[] = [];
  // 传感器类型
  public sensorTypeList: string | { label: string; code: any }[];
  // 传感器表单实例状态
  public sensorFormStatus: FormOperate;
  // 端口是否有传感器
  public isSenor: boolean = false;
  // 传感器详情
  public senSorInfo: SensorModel;
  public senSorWindowTitle: string;
  // 传感器Id
  public sensorId: string;
  // 传感器名称
  public senSorName: string;
  public openRemarks;
  // 显示类型
  public showType: string;
  // 设备详情信息集合
  public equipmentDetailsData = [];
  // 传感器详情信息集合
  public sensorDetailsData = [];
  // qunee设备节点对象集合
  quneeEquipmentData = [];
  // 已渲染过的设备iD集合
  isShowEquipmentData = [];

  constructor(
    private $nzI18n: NzI18nService,
    private $message: FiLinkModalService,
    public $activatedRoute: ActivatedRoute,
    private $applicationCommonService: ApplicationSystemForCommonService,
    private $equipmentAipService: EquipmentApiService,
    private $ruleUtil: RuleUtil,
    private modalService: NzModalService,
    private $indexService: IndexFacilityService
  ) {
    this.sensorTypeList = CommonUtil.codeTranslate(SensorTypeEnum, this.$nzI18n);
  }

  /**
   * 初始化
   */
  public ngOnInit(): void {
    // 国际化
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.facility);
    this.indexLanguage = this.$nzI18n.getLocaleData(LanguageEnum.index);
    // 资产国际化
    this.assetsLanguage = this.$nzI18n.getLocaleData(LanguageEnum.assets);
    // 公共国际化
    this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
    // qunee画布
    this.graph = new this.Q.Graph('gateway-canvas');
    // 跳转网关信息
    this.$activatedRoute.queryParams.subscribe(params => {
      this.gatewayId = params.id;
      this.gatewayName = params.name;
      this.gatewayModel = params.model;
    });
    this.gatewayInfo = {
      'equipmentId': this.gatewayId // 网关id
    };
    // 请求初始化网关配置信息
    this.initGateWay(this.gatewayInfo).then(() => {
      // 根据返回信息绘制网关配置界面
      this.drawNodeInfo();
    });
    // 菜单按钮
    this.buttonMenu = document.getElementById('buttonMenu');
    //  画布撑起来全屏
    document.getElementById('gateway-canvas').style.height = window.innerHeight - 300 + 'px';
    // 端口点击事件
    this.clickPort();
    // 鼠标拖拽设备节点事件
    this.mouseDragEvent();
    // 初始化传感器表单
    this.initColumn();
    // 显示类型
    this.showType = this.isSenor ? this.assetsLanguage.clearCurrentConfiguration : this.assetsLanguage.disconnectDeviceConnection;
  }

  /**
   * 组件销毁
   */
  public ngOnDestroy(): void {
    clearInterval(this.stampTimer);
    this.addEquipmentTemp = null;
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
            if (!_.isEmpty(result.data)) {
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
    const equipmentList = [];
    // const equipmentCanvasList = _.uniqBy(portInfo.equipmentPortLiveInfoRespList, 'endSourceId');
    // 因业务逻辑修改，所以不需要去重处理
    const equipmentCanvasList = portInfo.equipmentPortLiveInfoRespList;
    if (!_.isEmpty(portInfo.equipmentPortConfigInfoRespList)) {
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
    if (!_.isEmpty(equipmentCanvasList)) {
      const detailList = _.uniq(equipmentCanvasList.map(item => item.endSourceId));
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
              equipmentList.push({endId: item.endSourceId, node: equipmentNode});
              portList.forEach(_item => {
                if (item.portType + '-' + item.portNo === _item.hasEquipment) {
                  _item.portNode.$status = true;
                  this.createLine(_item.portNode, equipmentNode, item.lineName, 'line');
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
                      this.createLine(_item.portNode, nodeItem, item.lineName, 'line');
                      nodeItem['$portNo'] = _item.portMsg.portNo;
                    }
                  });
                }
              });
            }
          });
          equipmentList.forEach(item => {
            if (!item.node.$detail) {
              item.node.$noData = true;
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
   * 已有设备按钮点击事件
   */
  public existEquipment(): void {
    this.buttonMenu.style.display = 'none';
    this.hasDevicePart = true;
    // 点击端口能够相连的设备类型
    if (this.portFlag === portTypeEnum.communication) {
      this.equipmentFilter = [
        new FilterCondition('gatewayId', OperatorEnum.eq, true),
      ];
    } else {
      this.equipmentFilter = [
        new FilterCondition('powerControlId', OperatorEnum.eq, true),
      ];
    }
    // 打开已有设备列表弹框
    this.existEquipmentVisible = true;
  }


  /**
   * 新增设备按钮点击事件
   */
  public addEquipment(): void {
    this.buttonMenu.style.display = 'none';
    // 新增设备弹框初始新增设备tab页
    this.initTabNum = 0;
    // 显示设备新增按钮确定
    this.isAddOrConfig = true;
    // 打开新增设备弹框
    this.xcVisible = true;
    this.isShowConfigPart = false;
    // 初始新增设备确定按钮置灰
    this.addOkDisabled = true;
    // 配置信息tab新增设备前禁止点击
    this.isShowConfigTab = false;
  }

  /**
   * 新增传感器按钮点击事件
   */
  public addSensor(): void {
    this.senSorWindowTitle = this.assetsLanguage.addSensor;
    this.addSensorXcVisible = true;
    this.currentOperateType = OperateTypeEnum.add;
    this.senSorInfo = null;
    this.sensorFormStatus.resetData();
    // 刷新连接关系
    this.resetGraph();
  }

  /**
   * 修改传感器配置
   */
  public editSensorConfig() {
    this.senSorWindowTitle = this.language.editSensorInfo;
    this.currentOperateType = OperateTypeEnum.update;
    this.addSensorXcVisible = true;
    this.getSensorInfo();
  }

  /**
   * 获取传感器数据
   */
  public getSensorInfo() {
    const obj = {
      // 网关id
      gatewayId: this.gatewayId,
      // 传感器Id
      sensorId: this.sensorId,
      // 端口
      port: this.portNo
    };
    // 查询传感器数据
    this.$equipmentAipService.querySensorDetail(obj).subscribe((res: ResultModel<any>) => {
      if (res.code === ResultCodeEnum.success) {
        this.senSorInfo = res.data;
        console.log(this.senSorInfo, `sensor`);
        this.sensorFormStatus.resetData(this.senSorInfo);
        console.log(this.sensorFormStatus.getValid());
      } else {
        this.$message.error(res.msg);
      }
    });
  }

  /**
   * 保存传感器信息
   */
  public saveSensorInfo(): void {
    this.isLoading = true;
    // 组装传感器信息数据
    const sensorInfo = _.cloneDeep(this.sensorFormStatus.group.getRawValue());
    sensorInfo.port = this.portNo;
    sensorInfo.gatewayId = this.gatewayId;
    sensorInfo.gatewayName = this.gatewayName;
    sensorInfo.portType = this.portType;
    sensorInfo.portFlag = this.portFlag;
    let request;
    if (this.currentOperateType === OperateTypeEnum.add) {
      // 新增传感器
      request = this.$equipmentAipService.createSensor(sensorInfo);
    } else if (this.currentOperateType === OperateTypeEnum.update) {
      // 更新传感器信息
      sensorInfo.sensorId = this.senSorInfo.sensorId;
      request = this.$equipmentAipService.updateSensor(sensorInfo);
    }
    request.subscribe((res) => {
      if (res.code === ResultCodeEnum.success) {
        this.isLoading = false;
        this.addSensorXcVisible = false;
        this.$message.success(res.msg);
        // 刷新连接关系
        this.resetGraph();
      } else {
        this.isLoading = false;
        this.$message.error(res.msg);
      }
    }, () => {
      this.isLoading = false;
    });
  }

  /**
   * 修改当前配置按钮点击事件
   */
  public editConfig(): void {
    // 用于区分是新增时设备配置还是修改设备配置
    this.differentConfig = false;
    this.buttonMenu.style.display = 'none';
    const equipmentId = {equipmentId: this.usedEquipmentId};
    this.getPramsConfig(equipmentId);
  }

  /**
   * 获取参数配置项内容
   */
  public getPramsConfig(equipmentId: { equipmentId: string }): void {
    this.$equipmentAipService.getEquipmentConfigByModel(equipmentId).subscribe((result: ResultModel<ConfigResponseContentModel[]>) => {
      if (result.code === ResultCodeEnum.success) {
        this.equipmentConfigContent = result.data || [];
        // 判断是否有配置项 为空提示无配置项
        if (!_.isEmpty(this.equipmentConfigContent)) {
          this.configEquipmentId = this.usedEquipmentId;
          // 修改当前配置时，打开其弹框
          if (!this.differentConfig) {
            // 设备配置详情参数
            this.configValueParam.equipmentId = this.usedEquipmentId;
            this.configValueParam.equipmentType = this.usedEquipmentType;
            this.editXcVisible = true;
            // 新增修改当前配置时，加载配置信息
          } else {
            // 有设备配置项展示新增设备配置信息部分
            this.isShowConfigPart = true;
            this.centerControlId = this.usedEquipmentId;
            this.isShowConfigContent = true;
            // 到配置信息tab页
            this.initTabNum = 1;
            // 隐藏新增设备确定 显示配置信息确定按钮
            this.isAddOrConfig = false;
          }
        } else {
          if (!this.differentConfig) {
            this.$message.info(this.assetsLanguage.noEquipmentConfigTip);
          }
          // 无配置项关闭新增设备弹框
          this.xcVisible = false;
        }
      } else {
        this.$message.error(result.msg);
      }
    });
  }

  /**
   * 已有设备选中数据
   */
  public equipmentDataChange(event: EquipmentListModel[]): void {
    if (!_.isEmpty(event)) {
      // const hasDeviceParam = new GatewayDataRequestModel(event[0].equipmentId, event[0].equipmentType, event[0].equipmentModel);
      // 已有设备端口配置请求
      this.saveGatewayPortInfo(event[0]);
    }
  }

  /***
   * 端口配置保存
   */
  public saveGatewayPortInfo(hasDeviceParam): void {
    // 配置左边端口，初始化设备坐标位置
    if (this.portPositionX <= 0) {
      this.equipmentPosition = this.portPositionX - 200 + ',' + this.portPositionY;
    }
    // 配置右边端口，初始化设备坐标位置
    if (this.portPositionX > 0) {
      this.equipmentPosition = this.portPositionX + 200 + ',' + this.portPositionY;
    }

    this.gatewayPortInfo.equipmentPortLiveInfoRespList.forEach(item => {
      if (item.endSourceId === hasDeviceParam.equipmentId) {
        this.equipmentPosition = item.endSourcePosition;
      }
    });
    const reqObj = {
      'equipmentId': this.gatewayId, //  网关Id
      'portFlag': this.portFlag,  // 端口类型
      'portNo': this.portNo,     //  端口号
      'portPosition': this.portPositionX + ',' + this.portPositionY, // 端口定位
      'portType': this.portType, //  端口类型
      'endSourceId': hasDeviceParam.equipmentId,    // 新增的设备iD
      'endSourceObject': 'equipment', // 'equipment'
      'gatewayName': this.gatewayName, // 网关名称
      'endSourceType': hasDeviceParam.equipmentType, // '设备类型E001'
      'endSourceModel': hasDeviceParam.equipmentModel, // "设备型号"
      'endSourcePosition': this.equipmentPosition // 设备坐标
    };
    // hasDeviceParam = new GatewayDataRequestModel(hasDeviceParam.equipmentId, hasDeviceParam.equipmentType,
    //   hasDeviceParam.equipmentModel, this.gatewayId, this.portNo, this.gatewayName, this.equipmentPosition);
    this.$equipmentAipService.saveEquipmentPortLiveInfo(reqObj).subscribe((result: ResultModel<string>) => {
      if (result.code === ResultCodeEnum.success) {
        this.$message.success(this.commonLanguage.addSuccess);
        // 已有设备部分去掉
        this.hasDevicePart = false;
        this.resetGraph();
      } else {
        this.$message.error(result.msg);
      }
    });
  }

  /**
   * 提示是否确认清除当前配置
   */
  public clearConfigTip(showType): void {
    this.modalService.confirm({
      nzTitle: showType,
      nzContent: `${this.language.pleaseConfirm}${showType}?`,
      nzOkText: this.language.cancelText,
      nzOkType: 'danger',
      nzMaskClosable: false,
      nzOnOk: () => {
      },
      nzCancelText: this.language.okText,
      nzOnCancel: () => {
        this.confirmClearConfig();
      },
    });
  }

  /**
   * 确认清除当前配置按钮点击事件
   */
  public confirmClearConfig(): void {
    if (this.isSenor) {
      this.$equipmentAipService.deleteSensor({
        sensorId: this.sensorId,
        gatewayId: this.gatewayId,
        sensorName: this.senSorName
      }).subscribe((result: ResultModel<any>) => {
        if (result.code === ResultCodeEnum.success) {
          this.$message.success(result.msg);
          // 刷新画布数据
          this.resetGraph();
        } else {
          this.$message.error(result.msg);
        }
      });
    } else {
      // 按钮点击隐藏
      this.buttonMenu.style.display = 'none';
      const reqObj = {
        'equipmentId': this.gatewayId,
        'endSourceId': this.usedEquipmentId,
        'endSourceName': this.usedEquipmentName
      };
      this.$equipmentAipService.deleteEquipmentPortLiveInfo(reqObj).subscribe((result: ResultModel<string>) => {
        if (result.code === ResultCodeEnum.success) {
          this.$message.success(this.language.clearSuccess);
          // 刷新画布数据
          this.resetGraph();
        } else {
          this.$message.error(result.msg);
        }
      });
    }
  }


  /**
   *  新增设备弹框配置确定事件
   */
  public handleAddConfigOk(currentIndex: number): void {
    this.saveEquipmentConfig(this.equipmentConfigValue[currentIndex], this.equipmentConfigValue[currentIndex].commandId);
  }


  /**
   * 新增设备确定事件
   */
  public handleAddOk(): void {
    // 确定新增设备前 是没有加载配置组件
    this.isShowConfigContent = false;
    this.saveAddEquipmentModel.gatewayId = this.gatewayId;
    const formValue = _.cloneDeep(this.formStatus.group.getRawValue());
    Object.keys(this.saveAddEquipmentModel).forEach(v => {
      if (this.saveAddEquipmentModel[v]) {
        formValue[v] = this.saveAddEquipmentModel[v];
      }
    });
    this.saveAddEquipmentModel.equipmentControlType = formValue.equipmentControlType = EquipmentTypeEnum.gateway;
    formValue.installationDate = formValue.installationDate ? new Date(formValue.installationDate).getTime() : null;
    this.isShowAddTab = false;
    formValue.portNo = this.portNo;
    formValue.portType = this.portType;
    formValue.supplierId = this.addEquipmentTemp.supplierId;
    formValue.softwareVersion = this.addEquipmentTemp._selectedProduct.softwareVersion;
    formValue.hardwareVersion = this.addEquipmentTemp._selectedProduct.hardwareVersion;
    if (formValue.powerControlPortNo) {
      const list = formValue.powerControlPortNo.split(',');
      formValue.powerControlPortNo = list[1];
      formValue.powerControlPortType = list[0];
    }
    if (this.portFlag === 'electric') {
      console.log(this.addEquipmentTemp.gatewayPort);
      formValue.powerControlId = formValue.gatewayId;
      const _list = this.addEquipmentTemp.gatewayPort.split(',');
      formValue.portNo = _list[1];
      formValue.portType = _list[0];
    }
    this.$equipmentAipService.addEquipment(formValue).subscribe((result: ResultModel<string>) => {
      this.isLoading = false;
      if (result.code === ResultCodeEnum.success) {
        // 新增成功，给于是新增设备标识
        this.differentConfig = true;
        // 新增成功配置确定按钮出现
        this.isAddOrConfig = false;
        // 新增成功不能点击新增设备tab
        this.isShowAddTab = false;
        // 新增成功才能点击配置tab
        this.isShowConfigTab = true;
        // 新增成功返回的设备id
        this.usedEquipmentId = result.data;
        // 获取设备id进行图片上传
        this.addEquipmentTemp.uploadEquipmentPic(this.usedEquipmentId);
        // 刷新连接关系
        this.resetGraph();
        this.$message.success(this.assetsLanguage.addSuccess);
        // 新增设备成功获取对应设备的配置项
        this.getPramsConfig({equipmentId: result.data});
      } else {
        this.$message.error(result.msg);
      }
    }, () => this.isLoading = false);

  }


  /**
   *  获取设备配置表单输入值
   */
  public getConfigFormValue(event: ConfigResponseContentModel[]): void {
    this.equipmentConfigValue = event;

  }

  /**
   * 获取设备配置按钮状态
   */
  public getConfigButtonStatus(event: boolean[]): void {
    this.configOkDisabled = event;
  }


  /**
   * 获取填写新增设备表单数据
   */
  public getFormStatus(event: FormOperate): void {
    this.formStatus = event;
  }

  /**
   * 获取新增设备表单key额外参数
   */
  public getExtraRequest(event: EquipmentAddInfoModel): void {
    this.saveAddEquipmentModel = event;
  }

  /**
   * 新增设备表单数据是否可提交
   */
  public getFormDisabled(event: boolean): void {
    this.addOkDisabled = event;
  }


  /**
   *  保存页面设备坐标
   */
  public save(): void {
    if (!_.isEmpty(this.saveMoveData)) {
      this.$equipmentAipService.updateEquipmentPosition(this.saveMoveData).subscribe((result: ResultModel<string>) => {
        if (result.code === ResultCodeEnum.success) {
          this.$message.success(this.language.gatewayConfigSuccess);
          // 保存坐标位置 清空移动设备保存的数据
          this.saveMoveData = [];
          this.goBack();
        } else {
          this.$message.error(result.msg);
        }
      });
    } else {
      this.$message.info(this.language.gatewayConfigSuccess);
      this.goBack();
    }
  }

  /**
   * 返回上个页面
   */
  public goBack(): void {
    window.history.go(HISTORY_GO_STEP_CONST);
  }


  /**
   * 选中新增设备弹框tab切换事件
   */
  public changeTab(type: OperateTypeEnum): void {
    // 配置信息时，获取设备配置项
    if (type === OperateTypeEnum.config) {
      // 隐藏新增设备确定按钮
      this.isAddOrConfig = false;
      // 到配置信息tab页
      this.initTabNum = 1;
    } else {
      // 显示新增设备确定按钮
      this.isAddOrConfig = true;
    }
  }

  /**
   * 编辑节点名称
   */
  public saveEditNodeName(): void {
    const formValue = _.cloneDeep(this.editNodeNameFormStatus.group.getRawValue());
    const param = {
      'equipmentId': this.gatewayId,
      'endSourceId': this.usedEquipmentId,
      'nodeName': formValue.nodeName
    };
    this.$equipmentAipService.updateNodeName(param).subscribe((result: ResultModel<string>) => {
      if (result.code === ResultCodeEnum.success) {
        this.$message.success(this.language.remarkSuccess);
        this.resetGraph();
        this.editNodeNameXcVisible = false;
      } else {
        this.$message.error(result.msg);
      }
    });
  }


  /**
   * 编辑连线名称
   */
  public saveEditLineName(): void {
    const formValue = _.cloneDeep(this.editLineNameFormStatus.group.getRawValue());
    const param = {
      'equipmentId': this.gatewayId,
      'endSourceId': this.usedEquipmentId,
      'portNo': this.portNo,
      'lineName': formValue.lineName,
      'portType': this.portType
    };
    this.$equipmentAipService.updateLineName(param).subscribe((result: ResultModel<string>) => {
      if (result.code === ResultCodeEnum.success) {
        this.$message.success(this.language.remarkSuccess);
        this.resetGraph();
        this.editLineNameXcVisible = false;
      } else {
        this.$message.error(result.msg);
      }
    });
  }

  /**
   * 编辑节点名称表格实例化
   */
  public editNodeNameFormInstance(event: { instance: FormOperate }): void {
    this.editNodeNameFormStatus = event.instance;
  }


  /**
   * 编辑连线名称表格实例化
   */
  public editLineNameFormInstance(event: { instance: FormOperate }): void {
    this.editLineNameFormStatus = event.instance;
  }

  public formInstance(event: { instance: FormOperate }) {
    this.sensorFormStatus = event.instance;
    console.log(event.instance);
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
    doc.title = this.assetsLanguage.configGateway;
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
   *  获取当前标签页
   */
  public getCurrentTabIndex(event: number): void {
    this.currentIndex = event;
  }

  /**
   *  编辑连线名称初始化表单
   */
  private editLineNameInitForm(): void {
    this.editLineNameFormColumn = [
      { // 编辑连线名称
        label: this.assetsLanguage.enterNote,
        key: 'lineName',
        col: 24,
        type: 'textarea',
        initialValue: this.lineName,
        placeholder: this.language.pleaseEnter,
        rule: [this.$ruleUtil.getRemarkMaxLengthRule()]
      },
    ];
  }

  /**
   *  编辑节点名称初始化表单
   */
  private editNodeNameInitForm(): void {
    this.editNodeNameFormColumn = [
      { // 编辑连线名称
        label: this.assetsLanguage.enterNote,
        key: 'nodeName',
        col: 24,
        type: 'textarea',
        initialValue: this.nodeName,
        placeholder: this.language.pleaseEnter,
        rule: [this.$ruleUtil.getRemarkMaxLengthRule()]
      },
    ];
  }

  /**
   * 保存设备配配置
   */
  private saveEquipmentConfig(contentType: ConfigResponseContentModel, commandType: ControlInstructEnum): void {
    let formBody = {};
    contentType.configurations.forEach(item => {
      const formInstance = item.formInstance.instance;
      formBody = Object.assign(formBody, formInstance.group.getRawValue());
    });
    const formParam = new InstructSendRequestModel<{}>(commandType, [this.usedEquipmentId], formBody);
    this.$applicationCommonService.instructDistribute(formParam).subscribe((result: ResultModel<string>) => {
      if (result.code === ResultCodeEnum.success) {
        // 关闭新增设备弹框
        this.xcVisible = false;
        // 关闭修改配置弹框
        this.editXcVisible = false;
        this.$message.success(this.language.saveEquipmentConfigSuccess);
      } else {
        this.$message.error(result.msg);
      }
    });
  }

  /**
   * 画布交互操作重新绘制画布
   */
  private resetGraph(): void {
    // 清除画布
    this.graph.clear();
    // 保存的移动设备节点位置清空
    this.saveMoveData = [];
    this.editButtonPart = false;
    this.addButtonPart = false;
    // 网关配置信息
    this.initGateWay(this.gatewayInfo).then(() => {
      // 根据返回信息绘制网关配置界面
      this.drawNodeInfo();
    });
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
      case EquipmentTypeEnum.temperatureHumiditySensor:
        this.imgUrl = gatewayConfigImgUrlConst.temperatureHumiditySensor;
        break;
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
   * 连线方法
   */
  private createLine(equipmentNode, portNode, lineName, type) {
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
    return line;
  }

  /**
   * 端口点击按钮事件
   */
  private clickPort(): void {
    this.addButtonPart = false;
    this.graph.onclick = (evt) => {
      const getPortObj = evt.getData();
      console.log(getPortObj);
      // 点击类型为端口时，出现对应功能按钮
      if (getPortObj && getPortObj.$type && getPortObj.$type === 'port') {
        this.buttonMenu.style.display = 'block';
        this.buttonMenu.style.marginTop = evt.layerY + 'px';
        this.buttonMenu.style.marginLeft = evt.layerX + 'px';
        // 已经使用过的端口，判断是否为RS485类型端口，如果不是则不能再次连接
        if ((getPortObj.$status && getPortObj.$portType === 'RS485') || !getPortObj.$status) {
          // 点击未使用端口，只出现新增类别按钮组
          this.addButtonPart = true;
          this.editButtonPart = false;
          // 点击端口坐标位置
          this.portPositionX = getPortObj.x;
          this.portPositionY = getPortObj.y;
        }
        // 点击端口编号和与之能匹配的设备类型
        this.portNo = getPortObj.$portNo;
        this.portType = getPortObj.$portType;
        this.portFlag = getPortObj.$portFlag;
      } else {
        // 不是端口节点位置点击，按钮隐藏
        this.buttonMenu.style.display = 'none';
        this.editButtonPart = this.addButtonPart = false;
      }
      // 点击设备节点
      if (getPortObj && getPortObj.$type && getPortObj.$type === 'equipmentNode') {
        if (!getPortObj.$noData) {
          this.isSenor = getPortObj.$isSensor;
          // 显示类型
          this.showType = this.isSenor ? this.assetsLanguage.clearCurrentConfiguration : this.assetsLanguage.disconnectDeviceConnection;
          this.buttonMenu.style.display = 'block';
          this.buttonMenu.style.marginTop = evt.layerY + 'px';
          this.buttonMenu.style.marginLeft = evt.layerX + 'px';
          this.openRemarks = getPortObj;
          if (getPortObj.$isSensor) {
            this.sensorId = getPortObj.$endSourceId;
            this.senSorName = evt.getData().$detail.sensorName;
          }
          this.editButtonPart = true;
          this.addButtonPart = false;
          // 点击占用端口获取连接的设备id,设备型号,设备类型
          this.usedEquipmentId = getPortObj.$equipmentId;
          this.usedEquipmentName = getPortObj.$detail.equipmentName;
          this.addEquipmentModel = getPortObj.$equipmentModel;
          this.usedEquipmentType = getPortObj.$equipmentType;
          this.portNo = getPortObj.$portNo;
          this.portType = getPortObj.$portType;
          this.portFlag = getPortObj.$portFlag;
        }
      }
      // 点击连线
      if (getPortObj && getPortObj.$type && getPortObj.$type === 'line') {
        // 端口序号
        this.portNo = getPortObj.$from.$portNo;
        // 连接设备id
        this.usedEquipmentId = getPortObj.$to.$endSourceId;
        this.portType = getPortObj.$from.$portType;
        this.lineName = getPortObj.$name;
        // 连线名称表单
        this.editLineNameInitForm();
        // 打开连线名称弹框
        this.editLineNameXcVisible = true;
      }
    };
    // 鼠标移动事件
    this.graph.onmousemove = (evt) => {
      if (evt.getData() && evt.getData().$noData) {
        this.left = evt.layerX + 10;
        this.top = evt.layerY + 150;
        this.noIsEquipmentCode = true;
      } else if (evt.getData() && evt.getData().$detail && evt.getData().$detail.sensorId) {
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
        if (this.floatWindowEquipmentType === 'E005') {
          this.floatWindowEquipmentModelType = evt.getData().$detail.equipmentModelType;
        }
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
        this.noIsEquipmentCode = false;
        this.isShowSenor = false;
        this.isShow = false;
      }
    };
  }

  /**
   * 点击显示修改备注
   */
  openRemark() {
    this.portNo = this.openRemarks.$portNo;
    this.usedEquipmentId = this.openRemarks.$endSourceId;
    // 回显设备节点名称
    this.nodeName = this.openRemarks.$name;
    // 节点名称表单
    this.editNodeNameInitForm();
    // 打开节点名称弹框
    this.editNodeNameXcVisible = true;
  }

  /**
   * 拖拽设备节点获取设备坐标节点事件
   */
  private mouseDragEvent(): void {
    this.saveMoveData = [];
    this.graph.enddrag = (evt) => {
      const getEquipmentObj = evt.getData();
      if (getEquipmentObj && getEquipmentObj.$type === 'equipmentNode') {
        const equipmentPosition = getEquipmentObj.x + ',' + getEquipmentObj.y;
        const saveMoveItem = {
          'equipmentId': this.gatewayId,
          'endSourceId': getEquipmentObj.$endSourceId,
          'endSourcePosition': equipmentPosition
        };
        // 避免一个节点设备传入多次位置信息，以最后的一次坐标信息为准
        if (!_.isEmpty(this.saveMoveData)) {
          this.isHadMove = false;
          this.saveMoveData.forEach(item => {
            if (getEquipmentObj.$endSourceId === item.endSourceId && getEquipmentObj.$portNo === item.portNo && getEquipmentObj.$portType === item.portType) {
              this.isHadMove = true;
              item.equipmentPosition = equipmentPosition;
            }
          });
          if (!this.isHadMove) {
            this.saveMoveData.push(saveMoveItem);
          }
        } else {
          // 只移动一次设备位置信息的情况
          this.saveMoveData.push(saveMoveItem);
        }
      }
    };
  }

  /**
   * 初始化传感器表单
   */
  private initColumn() {
    this.sensorFormColumn = [
      {
        //  传感器名称
        label: this.language.name,
        key: 'sensorName',
        type: 'input',
        col: 24,
        require: true,
        rule: [{required: true}, {maxLength: 32},
          this.$ruleUtil.getNameRule()],
        customRules: [this.$ruleUtil.getNameCustomRule()],
        asyncRules: [
          this.$ruleUtil.getNameAsyncRule(value =>
            this.$equipmentAipService.querySensorNameIsExist(
              {port: this.portNo, sensorName: value, gatewayId: this.gatewayId}), res => {
            if (!res.data.existed) {
              return true;
            } else {
              if (this.senSorInfo && this.senSorInfo.sensorId === res.data.sensorId) {
                return true;
              } else if (!this.senSorInfo) {
                return false;
              }
            }
          })
        ],
      },
      {
        // 类型
        label: this.language.type,
        col: 24,
        key: 'sensorType',
        type: 'select',
        require: true,
        selectInfo: {
          data: this.sensorTypeList,
          label: 'label',
          value: 'code'
        },
        rule: [{required: true}],
      },
      {
        //  型号
        label: this.language.equipmentModel,
        key: 'sensorModel',
        type: 'input',
        col: 24,
        require: true,
        rule: [{required: true}, {maxLength: 32},
          this.$ruleUtil.getNameRule()],
        customRules: [this.$ruleUtil.getNameCustomRule()],
      },
    ];
  }

  /**
   * 获取设备Icon样式
   */
  public getEquipmentIconStyle(type?: string, cameraType?) {
    if (type === 'E005') {
      if (cameraType === '01') {
        return 'iconfont facility-icon fiLink-camera all-facility-color';
      } else {
        return 'iconfont facility-icon fiLink-shexiangtou-qiuji all-facility-color';
      }
    } else {
      return CommonUtil.getEquipmentIconClassName(type);
    }
  }
}
