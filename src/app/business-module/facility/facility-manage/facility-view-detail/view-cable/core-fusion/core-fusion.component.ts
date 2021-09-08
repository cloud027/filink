import {Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild} from '@angular/core';
import {PageModel} from '../../../../../../shared-module/model/page.model';
import {TableConfigModel} from '../../../../../../shared-module/model/table-config.model';
import {FormItem} from '../../../../../../shared-module/component/form/form-config';
import {ActivatedRoute, Router} from '@angular/router';
import {NzI18nService} from 'ng-zorro-antd';
import {FacilityService} from '../../../../../../core-module/api-service/facility/facility-manage';
import {FacilityLanguageInterface} from '../../../../../../../assets/i18n/facility/facility.language.interface';
import {InspectionLanguageInterface} from '../../../../../../../assets/i18n/inspection-task/inspection.language.interface';
import {MapService} from '../../../../../../core-module/api-service/index/map';
import {Result} from '../../../../../../shared-module/entity/result';
import {QueryConditionModel, SortCondition} from '../../../../../../shared-module/model/query-condition.model';
import {CommonUtil} from '../../../../../../shared-module/util/common-util';
import {TableComponent} from '../../../../../../shared-module/component/table/table.component';
import {FiLinkModalService} from '../../../../../../shared-module/service/filink-modal/filink-modal.service';
import {FormOperate} from '../../../../../../shared-module/component/form/form-operate.service';
import {cableBox, coreFusionColor, localCable, numberType, peerCable, selectionMode} from '../../../../share/const/core-end.config';
import {CoreApiService} from '../../../../share/service/core/core-api-service';
import {LanguageEnum} from '../../../../../../shared-module/enum/language.enum';
import {FacilityApiService} from '../../../../share/service/facility/facility-api.service';
import {DeviceTypeEnum} from '../../../../../../core-module/enum/facility/facility.enum';
import {CoreCableTypeEnum} from '../../../../share/enum/facility.enum';

const Operate = 'eq';

/**
 * 纤芯熔接组件
 */
@Component({
  selector: 'app-core-fusion',
  templateUrl: './core-fusion.component.html',
  styleUrls: ['./core-fusion.component.scss']
})
export class CoreFusionComponent implements OnInit {
  // 本端光缆段id
  @Input() public id: string;
  // 本端光缆段光缆芯数
  @Input() public num: number;
  // 本端光缆段名称
  @Input() public name: string;
  // 设施id
  @Input() public deviceId: string;
  // 设施名称
  @Input() public deviceName: string;
  // 查看纤芯熔接和配置模式切换
  @Input() public viewCoreFusion: boolean;
  // 光缆段终止节点id
  @Input() public endId: string;
  // 光缆段起始节点id
  @Input() public startId: string;
  // 光缆段终止节点类型
  @Input() public endDeviceType: string;
  // 光缆段起始节点类型
  @Input() public startDeviceType: string;
  // 光缆段终止节点名称
  @Input() public endNodeName: string;
  // 光缆段起始节点名称
  @Input() public startNodeName: string;
  // 熔纤弹框关闭
  @Output() close = new EventEmitter();
  // 国际化
  public language: FacilityLanguageInterface;
  public InspectionLanguage: InspectionLanguageInterface;
  // 光缆段列表分页
  public section_pageBean: PageModel = new PageModel();
  // 光缆段列表表格配置
  public section_tableConfig: TableConfigModel;
  // 光缆段列表分页条件
  public section_queryCondition: QueryConditionModel = new QueryConditionModel();
  // 表单数据存放
  public formColumn: FormItem[] = [];
  public formStatus: FormOperate;
  // 引入qunee画布
  public Q = window['Q'];
  public graph;
  // 是否打开纤芯熔接弹框
  isCoreVisible = true;
  // 纤芯熔接标题
  public coreCoreTitle: string;
  // 光缆段列表数据存放
  public section_dataSet = [];
  // 起始步骤第一步
  public currentSteps = 0;
  // 第一步标题
  public stepOneTitle: string;
  // 第二步标题
  public stepTwoTitle: string;
  // 第三步标题
  public stepThreeTitle: string;
  // 第三步内容上标题
  public stepThreeUpTitle: string;
  // 弹框打开默认显示第一步内容
  public stepOneContent = true;
  public stepTwoContent = false;
  public stepThreeContent = false;
  // 本端光缆段起始端数据
  public localCableStartList = [];
  // 本端光缆段尾端数据
  public localCableEndList = [];
  // 对端光缆段起始段数据
  public peerCableStartList = [];
  // 对端光缆段尾端数据
  public peerCableEndList = [];
  // 连线;
  public edgeList = [];
  // 点选和框选
  public mapBoxSelect = false;
  // 纤芯熔接默认点选模式
  public drawType: string = selectionMode.arrow;
  // 点选或框选
  public selectionMode;
  // 框选连线起始点数据
  public fromFrameEdgeList = [];
  // 框选连线结束点数据
  public toFrameEdgeList = [];
  // 光缆芯数筛选输入值
  public coreNumInputValue: string;
  // 光缆芯数筛选默认等于
  public coreNumSelectValue = Operate;
  // 本端光缆段纤芯数
  public localCoreNum: number;
  // 对端光缆段纤芯数
  public peerCoreNum: number;
  // 本端光缆段id
  public localCableId: string;
  // 对端光缆段id
  public peerCableId: string;
  // 本端光缆段名称
  public localCableName: string;
  // 对端光缆段名称
  public peerCableName: string;
  // 本端纤芯号
  public localCoreNo: string;
  // 对端纤芯号
  public peerCoreNo: string;
  // 保存熔纤参数
  public saveRequest = [];
  // 设施内本端已熔纤信息
  public usedCoreInDevice = [];
  // 设施内对端已熔纤信息
  public usedCoreOppositeInDevice = [];
  // 设施外本端已熔纤信息
  public usedCoreNotInDevice = [];
  // 设施外对端已熔纤信息
  public usedCoreOppositeNotInDevice = [];
  // 确定或结束按钮
  public determine: string;
  // 对端占用纤芯
  public usedCoreOpposite = [];
  // 本端占用纤芯
  public usedCore = [];
  // 本端和对端连线数据
  public isViewUsedData = [];
  // 显示删除连线按钮
  public showRightMenu = false;
  // 保存删除熔纤参数
  public isDeleteSaveRequest = [];
  // 删除连线事件
  public isDeleteGraph;
  // 删除连线数据
  public eventData;
  // 设施选择数据
  public selectData = [];
  // 光缆芯数
  @ViewChild('cableCoreNumTemp') public cableCoreNumTemp: TemplateRef<void>;
  // 光缆段列表
  @ViewChild('cableSegmentTable') public cableSegmentTable: TableComponent;
  // 单选按钮
  @ViewChild('radioTemp') public radioTemp: TemplateRef<void>;

  constructor(
    public $mapService: MapService,
    public $router: Router,
    public $activatedRoute: ActivatedRoute,
    public $nzI18n: NzI18nService,
    public $facilityService: FacilityService,
    public $facilityApiService: FacilityApiService,
    public $coreApiService: CoreApiService,
    public $modalService: FiLinkModalService,
    private $coreEndService: CoreApiService,
  ) {
  }

  public ngOnInit() {
    this.selectData = [];
    this.selectionMode = selectionMode;
    this.InspectionLanguage = this.$nzI18n.getLocaleData(LanguageEnum.inspection);
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.facility);
    this.initData();
    this.initColumn();
  }

  /**
   * 设施选择下拉框
   */
  public initColumn() {
    this.formColumn = [
      {
        label: this.language.facilityOrJointBox,
        key: 'deviceName',
        require: true,
        rule: [],
        type: 'select',
        selectInfo: {
          data: this.selectData,
          label: 'label',
          value: 'value',
        },
        modelChange: (controls, event, key, formOperate) => {
          this.deviceId = event;
        }
      },
    ];
  }

  /**
   * 关闭弹框
   */
  public handleCancel() {
    this.close.emit();
  }

  /**
   * 表单状态
   */
  public formInstance(event) {
    this.formStatus = event.instance;
    const deviceId = {
      deviceName: this.deviceId
    };
    this.formStatus.resetData(deviceId);
  }

  /**
   * 初始化加载数据
   */
  public initData() {
    // 通过后台获取设施(有无权限)
    const deviceList = [this.startId, this.endId];
    this.$facilityApiService.deviceIdCheckUserIfDeviceData(deviceList).subscribe((result: Result) => {
      if (result.data.length > 0) {
        result.data.forEach((item) => {
          this.selectData.push({label: item.deviceName, value: item.deviceId});
        });
      } else if (result.data.length === 0) {
        this.$modalService.info(this.language.temporaryAbsenceOfFacilityAuthorityOrFacilityAuthority);
      }
    });
    this.stepOneTitle = this.language.selectCoreFusion;
    this.stepTwoTitle = this.language.selectCableSegment;
    // 查看纤芯熔接
    if (this.viewCoreFusion === true) {
      this.coreCoreTitle = this.language.viewCoreFusion;
      this.stepThreeTitle = this.language.viewCoreFusion;
      this.determine = this.language.end;
      this.stepThreeUpTitle = this.language.stepThreeViewCoreFusion;
    } else {
      this.coreCoreTitle = this.language.coreFusion;
      this.stepThreeTitle = this.language.establishCoreFusion;
      this.stepThreeUpTitle = this.language.stepThreeConfigureTheCoreFusion;
      this.determine = this.language.handleOk;
    }
  }

  /**
   * 弹框上一步按钮
   */
  public pre(): void {
    this.currentSteps -= 1;
    this.changeContent();
  }

  /**
   * 弹框下一步按钮
   */
  public next(): void {
    if (this.deviceId) {
      this.currentSteps += 1;
      this.changeContent();
    } else {
      this.$modalService.info(`${this.language.pleaseSelectAFacility}`);
    }
  }

  /**
   * 弹框确定按钮
   */
  public  done(): void {
    if (this.viewCoreFusion === true) {
      this.handleCancel();
    } else {
      if (this.saveRequest.length === 0) {
        this.saveRequest = [{
          intermediateNodeDeviceId: this.deviceId,
          resource: this.localCableId,
          oppositeResource: this.peerCableId
        }];
        this.saveContent();
      } else {
        this.saveContent();
      }
    }
  }

  /**
   * 保存纤芯熔接
   */
  public saveContent(): void  {
    this.$coreApiService.saveTheCoreInformation(this.saveRequest).subscribe((result: Result) => {
      if (result.code === 0) {
        this.$modalService.success(result.msg);
        this.handleCancel();
      }
    });
  }


  /**
   * 纤芯熔接内容切换
   */
  public changeContent(): void {
    switch (this.currentSteps) {
      case 0: {
        this.stepOneContent = true;
        this.stepTwoContent = false;
        this.stepThreeContent = false;
        this.stepOneTitle = this.language.selectCoreFusion;
        this.stepTwoTitle = this.language.selectCableSegment;
        if (this.viewCoreFusion === true) {
          this.stepThreeTitle = this.language.viewCoreFusion;
        } else {
          this.stepThreeTitle = this.language.establishCoreFusion;
        }
        break;
      }
      case 1: {
        this.stepOneContent = false;
        this.stepTwoContent = true;
        this.stepThreeContent = false;
        this.stepOneTitle = this.language.selectFacilityOrConnectorBox;
        if (this.viewCoreFusion === true) {
          this.stepThreeTitle = this.language.viewCoreFusion;
        } else {
          this.stepThreeTitle = this.language.establishCoreFusion;
        }
        this.initSelectTableConfig();
        this.section_refreshData();
        break;
      }
      case 2: {
        this.stepOneContent = false;
        this.stepTwoContent = false;
        this.stepThreeContent = true;
        if (this.viewCoreFusion === true) {
          this.stepThreeTitle = this.language.viewCoreFusion;
        } else {
          this.stepThreeTitle = this.language.configuringCoreFusion;
        }
        if (this.peerCoreNum) {
          this.localCoreNum = this.num;
          this.localCableId = this.id;
          this.localCableName = this.name;
          const data = {
            resource: this.id,
            oppositeResource: this.peerCableId,
            intermediateNodeDeviceId: this.deviceId,
          };
          const resource = {
            resourceDeviceId: this.deviceId,
            oppositeResource: this.id,
          };
          const oppositeResource = {
            resourceDeviceId: this.deviceId,
            oppositeResource: this.peerCableId,
          };
          // 本端纤芯号连接数据存放
          this.usedCoreInDevice = [];
          // 对端纤芯号连接数据存放
          this.usedCoreOppositeInDevice = [];
          // 获取在设施熔纤信息
          this.getCoreFiberInDeviceInformation(data);
          // 获取设施内本端光缆段成端信息
          this.getPortCableCoreInformation(resource);
          // 获取设施内对端光缆段成端信息
          this.getPortCableCoreInformation(oppositeResource);
          // 获取不在设施熔纤信息
          this.getCoreFiberNotInDeviceInformation(data);
          // 获取其他设施对端成端信息
          this.getOneOtherFacilityInformation(resource);
          // 获取其他设施本端成端信息
          this.getTwoOtherFacilityInformation(oppositeResource);
          this.cableCanvas();
        } else {
          this.pre();
          this.$modalService.info(`${this.language.pleaseSelectOneCableSegments}`);
        }
        break;
      }
      default: {
        break;
      }
    }
  }

  /**
   * 选择的对端光缆段设置参数
   */
  public selectedCableChange(event, data): void  {
    this.peerCoreNum = data.coreNum;
    this.peerCableId = data.opticCableSectionId;
    this.peerCableName = data.opticCableSectionName;
  }

  /**
   *获取在设施熔纤信息
   */
  public getCoreFiberInDeviceInformation(data): void  {
    this.$coreApiService.getTheFuseInformation(data).subscribe((result: Result) => {
      // 存放本对端相连的数据
      const filterData = [];
      result.data.forEach(item => {
        if (item.resource === data.resource && item.oppositeResource === data.oppositeResource) {
          filterData.push(item);
        }
        if (item.oppositeResource === data.resource && item.resource === data.oppositeResource) {
          filterData.push(item);
        }
      });
      // 存放本对端相连的本端纤芯号
      this.usedCore = [];
      // 存放本对端连接的对端纤芯号
      this.usedCoreOpposite = [];
      this.isViewUsedData = filterData;
      filterData.forEach(item => {
        if (item.resource === data.resource) {
          this.usedCore.push(item.cableCoreNo);
        } else if (item.oppositeResource === data.resource) {
          this.usedCore.push(item.oppositeCableCoreNo);
        }
        if (item.resource === data.oppositeResource) {
          this.usedCoreOpposite.push(item.cableCoreNo);
        } else if (item.oppositeResource === data.oppositeResource) {
          this.usedCoreOpposite.push(item.oppositeCableCoreNo);
        }
      });
      result.data.forEach(item => {
        if (item.resource === data.resource) {
          this.usedCoreInDevice.push(item.cableCoreNo);
        } else if (item.oppositeResource === data.resource) {
          this.usedCoreInDevice.push(item.oppositeCableCoreNo);
        }
        if (item.resource === data.oppositeResource) {
          this.usedCoreOppositeInDevice.push(item.cableCoreNo);
        } else if (item.oppositeResource === data.oppositeResource) {
          this.usedCoreOppositeInDevice.push(item.oppositeCableCoreNo);
        }
      });
    });
  }

  /**
   *获取在设施内成端信息
   */
  public getPortCableCoreInformation(data): void  {
    this.$coreApiService.getTheCoreEndInitialization(data).subscribe((result: Result) => {
      result.data.forEach(item => {
        if (data.oppositeResource === this.id) {
          this.usedCoreInDevice.push(item.oppositeCableCoreNo);
        }
        if (data.oppositeResource === this.peerCableId) {
          this.usedCoreOppositeInDevice.push(item.oppositeCableCoreNo);
        }
      });
    });
  }

  /**
   * 获取其他设施对端成端信息
   */
  public getOneOtherFacilityInformation(data): void  {
    this.$coreEndService.getPortCableCoreInfoNotInDevice(data).subscribe((result: Result) => {
      if (result.data.length > numberType.zero) {
        result.data.forEach(item => {
          this.usedCoreNotInDevice.push(item.oppositeCableCoreNo);
        });
      }
    });
  }

  /**
   * 获取其他设施本端成端信息
   */
  public getTwoOtherFacilityInformation(data): void  {
    this.$coreEndService.getPortCableCoreInfoNotInDevice(data).subscribe((result: Result) => {
      if (result.data.length > numberType.zero) {
        result.data.forEach(item => {
          this.usedCoreOppositeNotInDevice.push(item.oppositeCableCoreNo);
        });
      }
    });
  }

  /**
   *获取不在设施熔纤信息
   */
  public getCoreFiberNotInDeviceInformation(data): void  {
    this.$coreApiService.queryCoreCoreInfoNotInDevice(data).subscribe((result: Result) => {
      // 本端纤芯号连接数据存放
      this.usedCoreNotInDevice = [];
      // 对端纤芯号连接数据存放
      this.usedCoreOppositeNotInDevice = [];
      result.data.forEach(item => {
        if (item.resource === data.resource) {
          this.usedCoreNotInDevice.push(item.cableCoreNo);
        } else if (item.oppositeResource === data.resource) {
          this.usedCoreNotInDevice.push(item.oppositeCableCoreNo);
        } else if (item.resource === data.oppositeResource) {
          this.usedCoreOppositeNotInDevice.push(item.cableCoreNo);
        } else if (item.oppositeResource === data.oppositeResource) {
          this.usedCoreOppositeNotInDevice.push(item.oppositeCableCoreNo);
        }
      });
    });
  }

  /**
   *获取光缆段信息列表
   */
  public section_refreshData(): void  {
    this.section_tableConfig.isLoading = true;
    this.section_queryCondition.bizCondition.deviceId = this.deviceId;
    this.$facilityApiService.getCableSegmentList(this.section_queryCondition).subscribe((result: Result) => {
      this.section_pageBean.Total = result.totalCount;
      this.section_tableConfig.isLoading = false;
      result.data.forEach(item => {
        if (this.id === item.opticCableSectionId) {
          item.disable = true;
        } else {
          item.disable = false;
        }
        item.startNodeDeviceType = CommonUtil.codeTranslate(DeviceTypeEnum, this.$nzI18n, item.startNodeDeviceType);
        item.terminationNodeDeviceType = CommonUtil.codeTranslate(DeviceTypeEnum, this.$nzI18n, item.terminationNodeDeviceType);
      });
      this.section_dataSet = result.data;
    }, () => {
      this.section_tableConfig.isLoading = false;
    });
  }

  /**
   *绘制纤芯熔接
   */
  public cableCanvas(): void  {
    setTimeout(() => {
      this.graph = new this.Q.Graph('pic-canvas');
      this.localCableEndList = [];
      this.peerCableStartList = [];
      this.saveRequest = [];
      this.graph.originAtCenter = false;
      this.graph.moveToCenter();
      // 所有节点不可拖动
      this.graph.isMovable = (item) => {
        return false;
      };
      // 设置全局属性
      this.graph.styles = {};
      this.graph.styles[this.Q.Styles.EDGE_COLOR] = coreFusionColor.cableFont;
      this.graph.styles[this.Q.Styles.ARROW_TO] = false;
      this.graph.styles[this.Q.Styles.EDGE_WIDTH] = 3;
      // 绘制本端光缆段的框
      const cableSegment = this.createText(null, this.localCableName, cableBox.localX, cableBox.Y,
        this.Q.Position.CENTER_TOP, cableBox.W, this.localCoreNum / cableBox.H * cableBox.Hc,
        cableBox.fontSize, coreFusionColor.cableFont, coreFusionColor.boxBackground);
      // 给每个图元点添加一个类型属性
      cableSegment.$type = CoreCableTypeEnum.localBox;
      // 绘制对端光缆段的框
      const cableSegmentTwo = this.createText(null, this.peerCableName, cableBox.peerX, cableBox.Y,
        this.Q.Position.CENTER_TOP, cableBox.W, this.peerCoreNum / cableBox.H * cableBox.Hc,
        cableBox.fontSize, coreFusionColor.cableFont, coreFusionColor.boxBackground);
      // 给每个图元点添加一个类型属性
      cableSegmentTwo.$type = CoreCableTypeEnum.peerBox;
      // 绘制本端光缆
      const cableOneStartGlist = [];
      cableOneStartGlist.length = this.localCoreNum;
      // 绘制本端光缆段里的光缆头
      for (let i = 0; i < cableOneStartGlist.length; i++) {
        const toName = this.createText(cableSegment, localCable.startN, localCable.startX,
          localCable.Y * i - localCable.Yc, null, localCable.W, localCable.H);
        // 给每个图元点添加一个唯一属性nameId
        toName.$nameId = i + localCable.num;
        // 给每个图元点添加一个类型属性
        toName.$type = CoreCableTypeEnum.localCableStart;
        this.localCableStartList.push(toName);
        toName.zIndex = localCable.zIndex;
        // 渲染不在设施内已经连过的纤芯
        for (let j = 0; j < this.usedCoreNotInDevice.length; j++) {
          if (this.usedCoreNotInDevice[j] === toName.$nameId + '') {
            toName.setStyle(this.Q.Styles.LABEL_BACKGROUND_COLOR, coreFusionColor.coreUsed);
          }
        }
      }
      // 绘制本端光缆段里的光缆尾
      const cableOneEndGlist = [];
      cableOneEndGlist.length = this.localCoreNum;
      for (let i = 0; i < cableOneEndGlist.length; i++) {
        const toName = this.createText(cableSegment, i + localCable.num + '', localCable.endX,
          localCable.Y * i - localCable.Yc, null, localCable.W, localCable.H);
        // 给每个图元点添加一个唯一属性nameId
        toName.$nameId = i + localCable.num;
        // 给每个图元点添加一个类型属性
        toName.$type = CoreCableTypeEnum.localCableEnd;
        toName.isUsed = true;
        this.localCableEndList.push(toName);
        toName.zIndex = localCable.zIndex;
        // 渲染在设施已经连过的纤芯
        for (let j = 0; j < this.usedCoreInDevice.length; j++) {
          if (this.usedCoreInDevice[j] === toName.$nameId + '') {
            toName.setStyle(this.Q.Styles.LABEL_BACKGROUND_COLOR, coreFusionColor.coreUsed);
            toName.isUsed = false;
          }
        }
      }
      // 绘制对端光缆
      const cableTwoStartGlist = [];
      cableTwoStartGlist.length = this.peerCoreNum;
      // 绘制对端光缆段里的光缆头
      for (let i = 0; i < cableTwoStartGlist.length; i++) {
        const toName = this.createText(cableSegmentTwo, peerCable.startN, peerCable.startX,
          peerCable.Y * i - peerCable.Yc, null, peerCable.W, peerCable.H);
        // 给每个图元点添加一个唯一属性nameId
        toName.$nameId = i + peerCable.num;
        // 给每个图元点添加一个类型属性
        toName.$type = CoreCableTypeEnum.peerCableStart;
        toName.isUsed = true;
        this.peerCableStartList.push(toName);
        toName.zIndex = peerCable.zIndex;
        // 渲染在设施已经连过的纤芯
        for (let j = 0; j < this.usedCoreOppositeInDevice.length; j++) {
          if (this.usedCoreOppositeInDevice[j] === toName.$nameId + '') {
            toName.setStyle(this.Q.Styles.LABEL_BACKGROUND_COLOR, coreFusionColor.coreUsed);
            toName.isUsed = false;
          }
        }
      }
      // 绘制对端里的光缆尾
      const cableTwoEndGlist = [];
      cableTwoEndGlist.length = this.peerCoreNum;
      for (let i = 0; i < cableTwoEndGlist.length; i++) {
        const toName = this.createText(cableSegmentTwo, i + peerCable.num + '', peerCable.endX,
          peerCable.Y * i - peerCable.Yc, null, peerCable.W, peerCable.H);
        // 给每个图元点添加一个唯一属性nameId
        toName.$nameId = i + peerCable.num;
        // 给每个图元点添加一个类型属性
        toName.$type = CoreCableTypeEnum.peerCableEnd;
        this.peerCableEndList.push(toName);
        toName.zIndex = peerCable.zIndex;
        // 渲染不在设施内已经连过的纤芯
        for (let j = 0; j < this.usedCoreOppositeNotInDevice.length; j++) {
          if (this.usedCoreOppositeNotInDevice[j] === toName.$nameId + '') {
            toName.setStyle(this.Q.Styles.LABEL_BACKGROUND_COLOR, coreFusionColor.coreUsed);
          }
        }
      }// 查看纤芯熔接的时候去除点选和框选功能
      if (this.viewCoreFusion === true) {
        this.viewCoreFiber();
      }
      if (this.viewCoreFusion === false) {
        this.viewCoreFiber();
        // 监听点击事件
        this.graph.onclick = (event) => {
          this.showRightMenu = false;
          // 遍历获取光缆段连线from
          if (event.getData() && event.getData().$type !== CoreCableTypeEnum.localBox && event.getData().$type !== CoreCableTypeEnum.peerBox) {
            if (event.getData()._host.$type === CoreCableTypeEnum.localBox && event.getData().isUsed === true) {
              for (let i = 0; i < cableOneEndGlist.length; i++) {
                if (event.getData().$nameId === this.localCableEndList[i].$nameId) {
                  this.edgeList.push(this.localCableEndList[i]);
                }
              }
            }
            // 遍历获取光缆段2连线to
            if (event.getData()._host.$type === CoreCableTypeEnum.peerBox && event.getData().isUsed === true) {
              for (let i = 0; i < cableTwoStartGlist.length; i++) {
                if (event.getData().$nameId === this.peerCableStartList[i].$nameId) {
                  this.edgeList.push(this.peerCableStartList[i]);
                }
              }
            }
          }
          // 同一种类型的图元不可连接
          if (this.edgeList.length >= 2 && this.edgeList[0].$type === this.edgeList[1].$type) {
            this.edgeList = [];
          } else if (this.edgeList.length >= 2) {
            this.createEdge(this.edgeList[0], this.edgeList[1], '');
            // 判断第一次点击选中的是光缆还是光缆2
            if (this.edgeList[0].$type === CoreCableTypeEnum.localCableEnd || this.edgeList[0].$type === CoreCableTypeEnum.localCableStart) {
              this.edgeList[1].setStyle(this.Q.Styles.LABEL_BACKGROUND_COLOR, coreFusionColor.coreUsedIn);
              this.edgeList[0].setStyle(this.Q.Styles.LABEL_BACKGROUND_COLOR, coreFusionColor.coreUsedIn);
            } else if (this.edgeList[0].$type === CoreCableTypeEnum.peerCableStart || this.edgeList[0].$type === CoreCableTypeEnum.peerCableEnd) {
              this.edgeList[0].setStyle(this.Q.Styles.LABEL_BACKGROUND_COLOR, coreFusionColor.coreUsedIn);
              this.edgeList[1].setStyle(this.Q.Styles.LABEL_BACKGROUND_COLOR, coreFusionColor.coreUsedIn);
            }
            this.edgeList = [];
          }
        }; // 鼠标右击删除连线事件
        const menu = new this.Q.PopupMenu();
        this.graph.popupmenu = menu;
        this.graph.popupmenu.getMenuItems = (graph, data, event) => {
          document.oncontextmenu = function () { // 阻止浏览器默认弹框
            return false;
          };
          if (data && data.$from) {
            this.showRightMenu = true;
            const menus = document.getElementById('right-menu');
            menus.style.left = event.layerX + 'px';
            menus.style.top = event.layerY + 'px';
            this.isDeleteGraph = graph;
            this.eventData = data;
          } else {
            this.showRightMenu = false;
          }
        }; // 监听框选事件
        this.graph.enddrag = (event) => {
          const data = this.graph.graphModel.selectionModel.datas;
          if (data && data.length > 1) {
            for (let i = 0; i < data.length; i++) {
              if (data[i].$type === CoreCableTypeEnum.localCableEnd && data[i].isUsed === true) {
                this.fromFrameEdgeList.push(data[i]);
              } else if (data[i].$type === CoreCableTypeEnum.peerCableStart && data[i].isUsed === true) {
                this.toFrameEdgeList.push(data[i]);
              }
            }
            if (this.fromFrameEdgeList.length >= 1 && this.toFrameEdgeList.length >= 1) {
              this.elementConnection(this.fromFrameEdgeList, this.toFrameEdgeList);
              this.fromFrameEdgeList = [];
              this.toFrameEdgeList = [];
            }
          }// 框选完成之后切换回单选模式
          this.graph.interactionMode = this.Q.Consts.INTERACTION_MODE_DEFAULT;
          this.drawType = selectionMode.arrow;
        };
      }
    }, 1000);
  }

  /**
   *光缆段信息列表分页
   */
  public  section_pageChange(event): void  {
    this.section_queryCondition.pageCondition.pageNum = event.pageIndex;
    this.section_queryCondition.pageCondition.pageSize = event.pageSize;
    this.section_refreshData();
  }

  /**
   *光缆段列表筛选
   */
  public section_handleSearch(event): void  {
    this.section_queryCondition.bizCondition = this.section_setBizCondition(event);
    if (this.coreNumInputValue || this.coreNumSelectValue) {
      this.section_queryCondition.bizCondition.coreNum = this.coreNumInputValue;
      this.section_queryCondition.bizCondition.coreNumOperate = this.coreNumSelectValue;
    }
    this.section_setPageCondition(event);
  }

  /**
   * 设置光缆段信息列表查询条件
   */
  public section_setPageCondition(event): void  {
    this.section_queryCondition.pageCondition.pageNum = 1;
  }

  /**
   * 光缆段信息列表筛选下拉
   */
  public section_setBizCondition(event)  {
    const _bizCondition = CommonUtil.deepClone(event);
    return _bizCondition;
  }

  /**
   * 框选图元之间连线
   */
  public elementConnection(fromArr, toArr): void  {
    let maxNum = 0;
    let minNum = 0;
    if (fromArr.length > toArr.length) {
      maxNum = fromArr.length;
      minNum = toArr.length;
    } else {
      maxNum = toArr.length;
      minNum = fromArr.length;
    }
    if (fromArr.length >= 2 && toArr.length >= 2) {
      for (let i = 0; i < maxNum; i++) {
        if (i < minNum) {
          this.createEdge(fromArr[i], toArr[i], '');
          // 判断第一次点击选中的是光缆1还是光缆2
          if ((fromArr[i].$type === CoreCableTypeEnum.localCableEnd || fromArr[i].$type === CoreCableTypeEnum.localCableStart)
            || (toArr[i].$type === CoreCableTypeEnum.peerCableStart || toArr[i].$type === CoreCableTypeEnum.peerCableEnd)) {
            toArr[i].setStyle(this.Q.Styles.LABEL_BACKGROUND_COLOR, coreFusionColor.coreUsedIn);
            fromArr[i].setStyle(this.Q.Styles.LABEL_BACKGROUND_COLOR, coreFusionColor.coreUsedIn);
          }
        } else {
          break;
        }
      }
      this.fromFrameEdgeList = [];
      this.toFrameEdgeList = [];
    }
  }

  /**
   * 删除连线
   */
  public  deleteLine(): void  {
    this.showRightMenu = false;
    this.isDeleteGraph.removeElement(this.eventData);
    this.eventData.$from.isUsed = true;
    this.eventData.$to.isUsed = true;
    this.eventData.$from.setStyle(this.Q.Styles.LABEL_BACKGROUND_COLOR, coreFusionColor.initCore);
    this.eventData.$to.setStyle(this.Q.Styles.LABEL_BACKGROUND_COLOR, coreFusionColor.initCore);
    // 删除的本端纤芯号存放
    let deleteCoreNo;
    if (this.eventData.$from.$type === CoreCableTypeEnum.localCableEnd && this.eventData.$to.$type === CoreCableTypeEnum.peerCableStart) {
      deleteCoreNo = this.eventData.$from.$nameId;
    } else if (this.eventData.$to.$type === CoreCableTypeEnum.localCableEnd && this.eventData.$from.$type === CoreCableTypeEnum.peerCableStart) {
      deleteCoreNo = this.eventData.$to.$nameId;
    }
    this.isDeleteSaveRequest = [];
    for (let i = 0; i < this.saveRequest.length; i++) {
      if (this.saveRequest[i].cableCoreNo !== deleteCoreNo) {
        this.isDeleteSaveRequest.push(this.saveRequest[i]);
      }
    }
    this.saveRequest = this.isDeleteSaveRequest;
  }

  /**
   *查看纤芯熔接连线 纤芯连线初始化进入状态
   */
  public  viewCoreFiber(): void  {
    const startEdge = [];
    const endEdge = [];
    // 本对端相连的纤芯号对比渲染连线
    for (let j = 0; j < this.isViewUsedData.length; j++) {
      this.localCableEndList.forEach(item => {
        if (this.usedCore[j] === item.$nameId + '') {
          startEdge.push(item);
        }
      });
      this.peerCableStartList.forEach(item => {
        if (this.usedCoreOpposite[j] === item.$nameId + '') {
          endEdge.push(item);
        }
      });
      this.createViewEdge(startEdge[j], endEdge[j], '');
      startEdge[j].isUsed = false;
      endEdge[j].isUsed = false;
      const everyLine = {
        intermediateNodeDeviceId: this.deviceId,
        resource: this.localCableId,
        cableCoreNo: startEdge[j].$nameId,
        oppositeResource: this.peerCableId,
        oppositeCableCoreNo: endEdge[j].$nameId,
        remark: ''
      };
      this.saveRequest.push(everyLine);
    }
  }

  /**
   * 切换选择模式(点选/框选)
   */
  public  chooseUtil(event): void  {
    this.drawType = event;
    if (this.drawType === selectionMode.arrow) {
      this.graph.interactionMode = this.Q.Consts.INTERACTION_MODE_DEFAULT;
      this.drawType = selectionMode.arrow;
    } else {
      this.drawType = selectionMode.rectangle;
      this.graph.interactionMode = this.Q.Consts.INTERACTION_MODE_SELECTION;
    }
  }

  /**
   * 连线
   */
  public  createEdge(from, to, text?): void {
    let edge;
    if (from.isUsed === true && to.isUsed === true) {
      edge = this.graph.createEdge(text, from, to);
      from.isUsed = false;
      to.isUsed = false;
      // 判断先点击的是本端还是对端
      if (from.$type === CoreCableTypeEnum.localCableEnd) {
        // 本端
        this.localCoreNo = from.$nameId;
      } else {
        // 对端
        this.peerCoreNo = from.$nameId;
      }
      if (to.$type === CoreCableTypeEnum.peerCableStart) {
        // 对端
        this.peerCoreNo = to.$nameId;
      } else {
        // 本端
        this.localCoreNo = to.$nameId;
      }
      const everyLine = {
        intermediateNodeDeviceId: this.deviceId,
        resource: this.localCableId,
        cableCoreNo: this.localCoreNo,
        oppositeResource: this.peerCableId,
        oppositeCableCoreNo: this.peerCoreNo,
        remark: ''
      };
      this.saveRequest.push(everyLine);
    }
    return edge;
  }

  /**
   * 画点
   */
  public createText(host, name?, x?, y?, anchorPosition?, w?, h?, fontSize?, fontColor?, backgroundColor?) {
    const text = this.graph.createText(name, x, y);
    // 节点为框或光缆段时可拖动, 其余子节点不可拖动
    name === this.localCableName || name === this.peerCableName ? text.movable = true : text.movable = false;
    text.setStyle(this.Q.Styles.LABEL_BORDER, 0.5);
    text.setStyle(this.Q.Styles.LABEL_PADDING, 5);
    text.setStyle(this.Q.Styles.LABEL_BORDER_STYLE, coreFusionColor.label);
    text.setStyle(this.Q.Styles.LABEL_RADIUS, 1);
    if (this.viewCoreFusion === true) {
      text.setStyle(this.Q.Styles.SELECTION_COLOR, coreFusionColor.initCore);
    }
    text.tooltipType = 'text';
    if (host) {
      text.host = text.parent = host;
      host.setStyle(this.Q.Styles.SELECTION_COLOR, coreFusionColor.initCore);
    }
    if (anchorPosition) {
      text.anchorPosition = anchorPosition;
      text.setStyle(this.Q.Styles.LABEL_ALIGN_POSITION, anchorPosition);
    }
    if (w && h) {
      text.setStyle(this.Q.Styles.LABEL_SIZE, new this.Q.Size(w, h));
    }
    text.setStyle(this.Q.Styles.LABEL_FONT_SIZE, fontSize || 14);
    text.setStyle(this.Q.Styles.LABEL_COLOR, fontColor || coreFusionColor.label);
    text.setStyle(this.Q.Styles.LABEL_BACKGROUND_COLOR, backgroundColor || coreFusionColor.initCore);
    text.test = Math.random();
    return text;
  }

  /**
   *初始化纤芯熔接要选择光缆段信息表单配置
   */
  public initSelectTableConfig(): void  {
    this.section_tableConfig = {
      isDraggable: true,
      isLoading: false,
      showSearchSwitch: true,
      noIndex: true,
      showSizeChanger: true,
      notShowPrint: true,
      topButtons: [],
      searchReturnType: 'object',
      scroll: {x: '1600px', y: '600px'},
      columnConfig: [
        {
          type: 'render', renderTemplate: this.radioTemp,
          fixedStyle: {fixedLeft: true, style: {left: '0px'}}, width: 62
        },
        { // 光缆段名称
          title: this.language.cableSegmentName,
          key: 'opticCableSectionName', width: 150,
          isShowSort: true, configurable: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        { // 纤芯数
          title: this.language.numberOfCores,
          key: 'coreNum', width: 150, isShowSort: true,
          configurable: true, searchable: true,
          searchConfig: {
            type: 'render',
            renderTemplate: this.cableCoreNumTemp,
          }
        },
        { // 起始设施类型
          title: this.language.startingFacilityType,
          key: 'startNodeDeviceType', width: 150,
          isShowSort: true, searchKey: 'startNodeDeviceTypes',
          configurable: true, searchable: true,
          searchConfig: {
            type: 'select', selectType: 'multiple', selectInfo:
              CommonUtil.codeTranslate(DeviceTypeEnum, this.$nzI18n, null), label: 'label', value: 'code'
          }
        },
        { // 终止设施类型
          title: this.language.terminationFacilityType,
          key: 'terminationNodeDeviceType', width: 150,
          isShowSort: true, configurable: true,
          searchKey: 'terminationNodeDeviceTypes',
          searchable: true,
          searchConfig: {
            type: 'select', selectType: 'multiple', selectInfo:
              CommonUtil.codeTranslate(DeviceTypeEnum, this.$nzI18n, null), label: 'label', value: 'code'
          }
        },
        { // 所在光缆名称
          title: this.language.nameOfTheCable, key: 'opticCableName', width: 150,
          fixedStyle: {fixedRight: true, style: {right: '0px'}},
          isShowSort: true, searchable: true,
          searchConfig: {type: 'operate'}
        },
      ],
      showPagination: true, bordered: false, showSearch: false,
      // 光缆段列表排序
      sort: (event: SortCondition) => {
        this.section_queryCondition.sortCondition.sortField = event.sortField;
        this.section_queryCondition.sortCondition.sortRule = event.sortRule;
        this.section_refreshData();
      },
      // 光缆段列表筛选
      handleSearch: (event) => {
        this.coreNumInputValue = event.coreNum;
        if (!event.coreNum) {
          this.coreNumInputValue = '';
          this.section_queryCondition.bizCondition.coreNum = '';
          this.coreNumSelectValue = Operate;
        }
        this.section_handleSearch(event);
        this.section_refreshData();
      }
    };
  }

  /**
   * 查看纤芯熔接连线
   */
  public createViewEdge(from, to, text?) {
    const edge = this.graph.createEdge(text, from, to);
    from.setStyle(this.Q.Styles.LABEL_BACKGROUND_COLOR, coreFusionColor.coreUsedIn);
    to.setStyle(this.Q.Styles.LABEL_BACKGROUND_COLOR, coreFusionColor.coreUsedIn);
    return edge;
  }
}




