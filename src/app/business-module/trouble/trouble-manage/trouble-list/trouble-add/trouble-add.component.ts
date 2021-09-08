import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FormOperate} from '../../../../../shared-module/component/form/form-operate.service';
import {FaultLanguageInterface} from '../../../../../../assets/i18n/fault/fault-language.interface';
import {NzI18nService} from 'ng-zorro-antd';
import {ActivatedRoute, Router} from '@angular/router';
import {FormItem} from '../../../../../shared-module/component/form/form-config';
import {Observable} from 'rxjs';
import {FiLinkModalService} from '../../../../../shared-module/service/filink-modal/filink-modal.service';
import {ResultModel} from '../../../../../shared-module/model/result.model';
import {CommonUtil} from '../../../../../shared-module/util/common-util';
import {TreeSelectorConfigModel} from '../../../../../shared-module/model/tree-selector-config.model';
import {differenceInCalendarDays} from 'date-fns';
import {FacilityLanguageInterface} from '../../../../../../assets/i18n/facility/facility.language.interface';
import {TroubleService} from '../../../share/service';
import {TroubleModel} from '../../../../../core-module/model/trouble/trouble.model';
import {OperateTypeEnum} from '../../../../../shared-module/enum/page-operate-type.enum';
import {TroubleSourceEnum} from '../../../../../core-module/enum/trouble/trouble-common.enum';
import {SelectDeviceModel} from '../../../../../core-module/model/facility/select-device.model';
import {ResultCodeEnum} from '../../../../../shared-module/enum/result-code.enum';
import {LanguageEnum} from '../../../../../shared-module/enum/language.enum';
import {AccountabilityUnitModel} from '../../../../../core-module/model/trouble/accountability-unit.model';
import {FilterValueModel} from '../../../../../core-module/model/work-order/filter-value.model';
import {SelectModel} from '../../../../../shared-module/model/select.model';
import {DepartmentUnitModel} from '../../../../../core-module/model/work-order/department-unit.model';
import {TroubleAddFormModel} from '../../../share/model/trouble-add-form.model';
import {CommonLanguageInterface} from '../../../../../../assets/i18n/common/common.language.interface';
import {AlarmSelectorConfigModel, AlarmSelectorInitialValueModel} from '../../../../../shared-module/model/alarm-selector-config.model';
import {RuleUtil} from '../../../../../shared-module/util/rule-util';
import {AreaDeviceParamModel} from '../../../../../core-module/model/work-order/area-device-param.model';
import {SessionUtil} from '../../../../../shared-module/util/session-util';
import {FilterCondition} from '../../../../../shared-module/model/query-condition.model';
import {OperatorEnum} from '../../../../../shared-module/enum/operator.enum';
import {EquipmentModel} from '../../../../../core-module/model/equipment.model';
import {FacilityForCommonUtil} from '../../../../../core-module/business-util/facility/facility-for-common.util';
import {AlarmForCommonUtil} from '../../../../../core-module/business-util/alarm/alarm-for-common.util';
import {TroubleForCommonService} from '../../../../../core-module/api-service/trouble';
import {TroubleToolService} from '../../../../../core-module/api-service/trouble/trouble-tool.service';
import {TroubleUtil} from '../../../../../core-module/business-util/trouble/trouble-util';
import {AlarmSelectorConfigTypeEnum} from '../../../../../shared-module/enum/alarm-selector-config-type.enum';

/**
 * 故障新增和编辑
 */
@Component({
  selector: 'app-trouble-add',
  templateUrl: './trouble-add.component.html',
  styleUrls: ['./trouble-add.component.scss'],
})
export class TroubleAddComponent implements OnInit, OnDestroy {
  // 故障设施
  @ViewChild('facilityTemp') private facilityTemp;
  // 发生时间
  @ViewChild('happenDate') public happenDate: TemplateRef<any>;
  // 责任单位
  @ViewChild('department') private department;
  // 故障设备
  @ViewChild('getEquipmentTemp') private getEquipmentTemp;
  // 标题
  public pageTitle: string = '';
  // 单位名称
  public deptName: string = '';
  // 单位弹窗展示
  public unitSelectVisible: boolean = false;
  // 单位选择器配置信息
  public unitSelectorConfig: TreeSelectorConfigModel = new TreeSelectorConfigModel();
  public isLoading: boolean = false;
  // 接收发生时间的value
  public happenTime: string;
  // 表单项
  public formColumn: FormItem[] = [];
  // 告警国际化引用
  public language: FaultLanguageInterface;
  // 设施语言包
  public facilityLanguage: FacilityLanguageInterface;
  public commonLanguage: CommonLanguageInterface;
  // 遮罩层
  public ifSpin: boolean = false;
  // 故障设施
  public troubleFacilityConfig: AlarmSelectorConfigModel;
  // 过滤条件
  public filterValue: FilterValueModel;
  // 单位是否可点击
  public isUnit: boolean = true;
  // 告警来源
  public sourceType: string;
  // 设施可否点击
  public isFacility: boolean = false;
  // 表单校验
  public isDisabled: boolean;
  // 故障等级
  public troubleLevel: string;
  // 故障类型
  public troubleType: string;
  // 故障来源
  public troubleSource: string | SelectModel[];
  // 用户ID
  public userId: string;
  // 是否为故障
  public isTrouble: boolean = true;
  // 是否单选
  public isRadio: boolean = true;
  // 控制设备是否可点击
  public formItemDisable: boolean = true;
  // 故障设备
  public equipmentName: string;
  // 设备名称禁止修改
  public equipmentNameDisable: boolean = true;
  // 设备弹框展示
  public equipmentVisible: boolean = false;
  // 故障设备查询条件
  public equipmentFilter: FilterCondition[] = [];
  // 选择的设备
  public selectEquipments: EquipmentModel[] = [];
  // 设备id
  public equipmentIds: string[];
  // 单位选择节点
  private areaNodes: DepartmentUnitModel[] = [];
  // 故障类型
  private troubleTypeList: SelectModel[] = [];
  // 处理状态
  private handleStatus: string;
  // 表单操作
  private formStatus: FormOperate;
  // 勾选的设施
  private checkTroubleData: SelectDeviceModel = new SelectDeviceModel();
  // 单位code
  private deptCode: string = '';
  // 判断当前页新增还是修改
  private pageType = OperateTypeEnum.add;
  // 责任单位选择器
  private selectorData: AccountabilityUnitModel = new AccountabilityUnitModel();
  // 获取故障ID
  private troubleId: string;

  constructor(
    private $nzI18n: NzI18nService,
    private $troubleService: TroubleService,
    private $troubleCommonService: TroubleForCommonService,
    private $message: FiLinkModalService,
    private $router: Router,
    private $troubleToolService: TroubleToolService,
    private $active: ActivatedRoute,
    private $ruleUtil: RuleUtil,
  ) {
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.fault);
    this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
    this.facilityLanguage = this.$nzI18n.getLocaleData(LanguageEnum.facility);
  }

  /**
   * 初始化
   */
  public ngOnInit(): void {
    // 获取用户信息
    if (SessionUtil.getToken()) {
      this.userId = SessionUtil.getUserInfo().id;
    }
    this.$active.queryParams.subscribe(params => {
      this.troubleId = params.id;
      this.pageType = params.type;
      this.sourceType = params.sourceType;
      this.pageTitle = this.getPageTitle(this.pageType);
      // 故障类型
      this.getTroubleType();
      // 初始化故障设施
      this.initTroubleFacilityConfig();
      this.initUnitSelectorConfig();
    });
  }

  public ngOnDestroy(): void {
    this.facilityTemp = null;
    this.department = null;
  }

  /**
   * 获取数据回显
   */
  public getUpdateData(): void {
    if (this.pageType !== OperateTypeEnum.add) {
      this.$troubleCommonService.queryTroubleDetail(this.troubleId).subscribe((res: ResultModel<TroubleModel>) => {
        if (res.code === ResultCodeEnum.success) {
          if (res.data.deptName) {
            this.deptName = res.data.deptName;
          }
          this.handleStatus = res.data.handleStatus;
          this.deptCode = res.data.deptCode;
          this.formStatus.resetData(res.data);
          this.formStatus.resetControlData('happenDate', new Date(res.data.happenTime));
          // 故障设施回显
          this.checkTroubleData = {
            deviceName: res.data.deviceName,
            deviceId: res.data.deviceId,
            deviceType: res.data.deviceType,
            area: res.data.area,
            areaId: res.data.areaId,
            areaCode: res.data.areaCode,
          };
          this.formStatus.resetControlData('troubleFacility', this.checkTroubleData);
          // 初始化设备的查询条件
          this.equipmentFilter = [new FilterCondition(
            'deviceId', OperatorEnum.in, [res.data.deviceId])];
          // 故障设备回显
          if (res.data.equipment && res.data.equipment.length > 0) {
            this.equipmentName = res.data.equipment.map(item => item.equipmentName).join(',');
            this.equipmentIds = res.data.equipment.map(item => item.equipmentId);
            this.selectEquipments = res.data.equipment;
          }
          this.initTroubleFacilityConfig();
          // 告警转故障禁止表单操作项
          if (this.sourceType === TroubleSourceEnum.alarm) {
            this.formStatus.group.controls['troubleType'].disable();
            this.formStatus.group.controls['troubleLevel'].disable();
            this.formStatus.group.controls['troubleSource'].disable();
            this.equipmentNameDisable = true;
            this.isFacility = true;
            this.troubleLevel = res.data.troubleLevel;
            this.troubleType = res.data.troubleType;
            this.troubleSource = res.data.troubleSource;
          } else {
            this.equipmentNameDisable = false;
          }
          if (res.data.areaCode) {
            this.queryDeptList(res.data.areaCode).then(() => {
              // 递归设置单位的选择情况
              FacilityForCommonUtil.setUnitNodesStatus(this.areaNodes, res.data.deptId);
            });
          }
          this.isUnit = false;
        }
      }, (err) => {
        this.ifSpin = false;
        this.$message.error(err.msg);
      });
    }
    this.initColumn();
  }

  /**
   * 查询责任单位
   */
  private queryDeptList(code: string): Promise<DepartmentUnitModel[]> {
    return new Promise((resolve, reject) => {
      const param = new AreaDeviceParamModel();
      param.areaCodes = [code];
      param.userId = this.userId;
      this.$troubleCommonService.queryUnitListByArea(param).subscribe((result: ResultModel<DepartmentUnitModel[]>) => {
        if (result.code === ResultCodeEnum.success) {
          const deptData = result.data || [];
          this.areaNodes = deptData;
          resolve(deptData);
        }
      });
    });
  }

  /**
   * 获取页面类型(add/update)
   * param type
   * returns {string}
   */
  private getPageTitle(type: string): string {
    let title;
    switch (type) {
      case OperateTypeEnum.add:
        title = `${this.language.add} ${this.language.trouble}`;
        break;
      case OperateTypeEnum.update:
        title = `${this.language.trouble} ${this.language.update}`;
        break;
    }
    return title;
  }

  /**
   * 故障类型
   */
  public getTroubleType(): void {
    this.ifSpin = true;
    // 故障类型
    this.$troubleToolService.getTroubleTypeList().then((data: SelectModel[]) => {
      this.troubleTypeList = data;
      this.getUpdateData();
      this.ifSpin = false;
    });
  }

  /**
   * 过滤故障来源
   */
  public getSource(): SelectModel[] {
    const sourceList = TroubleUtil.translateTroubleSource(this.$nzI18n);
    let sourceData = [];
    if (typeof sourceList !== 'string') {
      if (this.sourceType === TroubleSourceEnum.alarm) {
        return sourceList;
      } else {
        sourceData = sourceList.filter(item => {
          return item.code !== TroubleSourceEnum.alarm;
        });
      }
    }
    return sourceData;
  }

  /**
   * 表单初始化
   */
  public initColumn(): void {
    this.formColumn = [
      {// 故障设施
        label: this.language.troubleFacility,
        key: 'troubleFacility',
        type: 'custom',
        require: true,
        rule: [],
        inputType: '',
        template: this.facilityTemp,
      },
      {// 故障设备
        label: this.language.troubleEquipment,
        key: 'equipment',
        type: 'custom',
        inputType: '',
        rule: [],
        template: this.getEquipmentTemp,
      },
      { // 故障描述
        label: this.language.troubleDescribe,
        key: 'troubleDescribe',
        type: 'input',
        require: true,
        rule: [
          {required: true},
          this.$ruleUtil.getRemarkMaxLengthRule()],
          customRules: [this.$ruleUtil.getNameCustomRule()],
      },
      {// 发生时间
        label: this.language.happenTime,
        key: 'happenDate',
        type: 'custom',
        require: true,
        template: this.happenDate,
        rule: [{required: true}],
        asyncRules: [{
          asyncRule: (control: any) => {
            return Observable.create(observer => {
              this.happenTime = control.value;
              if (this.happenTime) {
                observer.next(null);
                observer.complete();
              } else {
                observer.next({error: true, duplicated: true});
                observer.complete();
              }
            });
          },
        }],
      },
      { // 故障类型
        label: this.language.troubleType,
        key: 'troubleType',
        require: true,
        type: 'select',
        selectInfo: {
          data: this.troubleTypeList,
          label: 'label',
          value: 'code',
        },
        rule: [{required: true}],
      },
      { // 故障级别
        label: this.language.troubleLevel,
        key: 'troubleLevel',
        require: true,
        type: 'select',
        selectInfo: {
          data: AlarmForCommonUtil.translateAlarmLevel(this.$nzI18n),
          label: 'label',
          value: 'code',
        },
        rule: [{required: true}],
      },
      { // 故障来源
        label: this.language.troubleSource,
        key: 'troubleSource',
        require: true,
        type: 'select',
        selectInfo: {
          data: this.getSource(),
          label: 'label',
          value: 'code',
        },
        rule: [{required: true}],
      },
      { // 责任单位
        label: this.language.deptName,
        key: 'deptId',
        type: 'custom',
        template: this.department,
        require: true,
        rule: [{required: true}],
        asyncRules: []
      },
      {// 填报人
        label: this.language.reportUserName,
        key: 'reportUserName',
        type: 'input',
        rule: [
          {maxLength: 32},
        ],
      },
    ];
  }

  /**
   *  表单初始化
   */
  public formInstance(event: { instance: FormOperate }): void {
    this.formStatus = event.instance;
    this.formStatus.group.valueChanges.subscribe(() => {
      this.isDisabled = this.formStatus.getValid();
    });
  }

  /**
   *  起始日期不可选择小于当前日期
   */
  public disabledDate = (current: Date): boolean => {
    // 获取当前日期
    const today = new Date();
    return differenceInCalendarDays(current, today) > 0 || CommonUtil.checkTimeOver(current);
  }

  /**
   * 打开单位选择器
   */
  public showUnitSelectorModal(): void {
    this.unitSelectorConfig.treeNodes = this.areaNodes;
    this.unitSelectVisible = true;
  }

  /**
   * 单位选中结果
   * param event
   */
  public unitSelectChange(event: DepartmentUnitModel[]): void {
    if (event[0]) {
      FacilityForCommonUtil.setUnitNodesStatus(this.areaNodes, event[0].id);
      this.deptName = event[0].deptName;
      this.deptCode = event[0].deptCode;
      this.selectorData.parentId = event[0].id;
      this.formStatus.resetControlData('deptId', event[0].id);
    } else {
      FacilityForCommonUtil.setUnitNodesStatus(this.areaNodes, null);
      this.deptName = '';
      this.deptCode = '';
      this.selectorData.parentId = null;
      this.formStatus.resetControlData('deptId', null);
    }
  }

  /**
   * 故障设施
   */
  public initTroubleFacilityConfig(): void {
    this.troubleFacilityConfig = {
      initialValue: new AlarmSelectorInitialValueModel(this.checkTroubleData.deviceName,
        this.checkTroubleData.deviceId.length > 0 ? [this.checkTroubleData.deviceId] : []), // 默认值
      type: AlarmSelectorConfigTypeEnum.form,
      handledCheckedFun: (event: SelectDeviceModel) => {
        this.checkTroubleData = event;
        if (!event) {
          this.formStatus.resetControlData('troubleFacility', null);
          // 单位
          this.deptName = '';
          this.deptCode = '';
          this.selectorData.parentId = '';
          this.isUnit = true;
          this.formStatus.resetControlData('deptId', null);
          // 设备
          this.equipmentNameDisable = true;
          this.selectEquipments = [];
          this.equipmentName = '';
          this.equipmentIds = [];
          this.formStatus.resetControlData('equipment', null);
          this.isDisabled = false;
          return;
        }
        const facilityData = {
          deviceName: this.checkTroubleData.deviceName,
          deviceId: this.checkTroubleData.deviceId,
          deviceType: this.checkTroubleData.deviceType,
          areaId: this.checkTroubleData.areaId,
          area: this.checkTroubleData.area,
          areaCode: this.checkTroubleData.areaCode,
          deviceProductId: event.productId,
          deviceAreaId: event.areaId,
          deviceAreaCode: event.areaCode,
          projectId: event.projectId
        };
        this.formStatus.resetControlData('troubleFacility', facilityData);
        if (this.checkTroubleData.areaCode) {
          this.queryDeptList(this.checkTroubleData.areaCode).then();
          this.deptName = '';
          this.deptCode = '';
          this.selectorData.parentId = null;
          this.formStatus.resetControlData('deptId', null);
        }
        if (this.checkTroubleData.deviceId) {
          // 初始化设备的查询条件
          this.equipmentFilter = [new FilterCondition(
            'deviceId', OperatorEnum.in, [this.checkTroubleData.deviceId])];
          this.selectEquipments = [];
          this.equipmentName = '';
          this.equipmentNameDisable = false;
          this.isUnit = false;
        } else {
          this.equipmentNameDisable = true;
          this.isUnit = true;
        }
      }
    };
  }

  /**
   *新增故障
   */
  public submit(): void {
    this.isLoading = true;
    const troubleObj: TroubleAddFormModel = this.formStatus.getData();
    // 转换成后台要的数据类型
    if (troubleObj.troubleFacility) {
      troubleObj.deviceId = troubleObj.troubleFacility.deviceId;
      troubleObj.deviceName = troubleObj.troubleFacility.deviceName;
      troubleObj.deviceType = troubleObj.troubleFacility.deviceType;
      troubleObj.area = troubleObj.troubleFacility.area;
      troubleObj.areaId = troubleObj.troubleFacility.areaId;
      troubleObj.areaCode = troubleObj.troubleFacility.areaCode;
      troubleObj.deviceProductId = troubleObj.troubleFacility.deviceProductId ? troubleObj.troubleFacility.deviceProductId : '';
      troubleObj.deviceAreaId = troubleObj.areaId;
      troubleObj.deviceAreaCode = troubleObj.areaCode;
    }
    const equipment = this.selectEquipments.map(v => {
      return {
        equipmentProductId: v.equipmentProductId,
        equipmentAreaId: v.equipmentAreaId,
        equipmentAreaCode: v.equipmentAreaCode,
        equipmentId: v.equipmentId,
        equipmentType: v.equipmentType,
        equipmentName: v.equipmentName,
        equipmentModel: v.equipmentModel
      };
    });
    troubleObj.equipment = equipment;
    // 当故障来源是来自告警
    if (this.sourceType === TroubleSourceEnum.alarm) {
      troubleObj.troubleLevel = this.troubleLevel;
      troubleObj.troubleType = this.troubleType;
      troubleObj.troubleSource = this.troubleSource;
    }
    troubleObj.deptName = this.deptName;
    troubleObj.deptCode = this.deptCode;
    troubleObj.id = this.troubleId;
    // 处理发生时间
    if (troubleObj.happenDate) {
      troubleObj.happenTime = CommonUtil.sendBackEndTime(new Date(troubleObj.happenDate).getTime());
    }
    if (this.pageType === OperateTypeEnum.add) {
      // 新增
      this.$troubleService.addTrouble(troubleObj).subscribe((res: ResultModel<string>) => {
        if (res.code === ResultCodeEnum.success) {
          this.$message.success(this.commonLanguage.addSuccess);
          this.$router.navigate(['business/trouble/trouble-list']).then();
        } else {
          this.$message.error(res.msg);
          this.isLoading = false;
        }
      }, (err) => {
        this.$message.error(err.msg);
        this.isLoading = false;
      });
    } else {
      // 编辑
      troubleObj.handleStatus = this.handleStatus;
      troubleObj.deptCode = this.deptCode;
      this.$troubleService.updateTrouble(troubleObj).subscribe((res: ResultModel<string>) => {
        if (res.code === ResultCodeEnum.success) {
          this.$message.info(this.commonLanguage.updateSuccess);
          this.$router.navigate(['business/trouble/trouble-list']).then();
        } else {
          this.$message.info(res.msg);
        }
      }, () => {
        this.isLoading = false;
      });
    }
  }

  /**
   * 取消
   */
  public cancel(): void {
    window.history.back();
  }

  /**
   * 故障设备
   */
  onEquipmentDataChange(event: EquipmentModel[]): void {
    this.selectEquipments = [];
    event.forEach(v => {
      this.selectEquipments.push({
        equipmentName: v.equipmentName,
        equipmentId: v.equipmentId,
        equipmentType: v.equipmentType,
        equipmentProductId: v.productId,
        equipmentAreaId: v.areaId,
        equipmentAreaCode: v.areaCode,
        equipmentModel: v.equipmentModel
      });
    });
    this.equipmentName = event.map(item => item.equipmentName).join(',') || '';
    this.equipmentIds = event.map(row => row.equipmentId) || [];
    this.formStatus.resetControlData('equipment', this.selectEquipments);
  }

  /**
   * 初始化单位选择器配置
   * param nodes
   */
  private initUnitSelectorConfig(): void {
    this.unitSelectorConfig = {
      width: '500px',
      height: '300px',
      title: this.language.unitSelect,
      treeSetting: {
        check: {
          enable: true,
          chkStyle: 'radio',
          radioType: 'all',
        },
        data: {
          simpleData: {
            enable: true,
            idKey: 'id',
            pIdKey: 'deptFatherId',
            rootPid: null
          },
          key: {
            name: 'deptName',
            children: 'childDepartmentList'
          },
        },
        view: {
          showIcon: false,
          showLine: false
        }
      },
      treeNodes: this.areaNodes
    };
  }
}

