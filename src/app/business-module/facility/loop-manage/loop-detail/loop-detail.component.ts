import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {NzI18nService} from 'ng-zorro-antd';
import * as _ from 'lodash';
import {FormOperate} from '../../../../shared-module/component/form/form-operate.service';
import {FacilityApiService} from '../../share/service/facility/facility-api.service';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {LoopApiService} from '../../share/service/loop/loop-api.service';
import {FormItem} from '../../../../shared-module/component/form/form-config';
import {RuleUtil} from '../../../../shared-module/util/rule-util';
import {FilterCondition} from '../../../../shared-module/model/query-condition.model';
import {FacilityLanguageInterface} from '../../../../../assets/i18n/facility/facility.language.interface';
import {AssetManagementLanguageInterface} from '../../../../../assets/i18n/asset-manage/asset-management.language.interface';
import {ResultModel} from '../../../../shared-module/model/result.model';
import {SelectModel} from '../../../../shared-module/model/select.model';
import {LoopViewDetailModel} from '../../../../core-module/model/loop/loop-view-detail.model';
import {OperateTypeEnum} from '../../../../shared-module/enum/page-operate-type.enum';
import {ResultCodeEnum} from '../../../../shared-module/enum/result-code.enum';
import {OperatorEnum} from '../../../../shared-module/enum/operator.enum';
import {LanguageEnum} from '../../../../shared-module/enum/language.enum';
import {HISTORY_GO_STEP_CONST} from '../../share/const/facility-common.const';
import {CommonUtil} from '../../../../shared-module/util/common-util';
import {LoopTypeEnum} from '../../../../core-module/enum/loop/loop.enum';
import {EquipmentTypeEnum} from '../../../../core-module/enum/equipment/equipment.enum';
import {FacilityForCommonService} from '../../../../core-module/api-service/facility';
import {DeviceTypeEnum} from '../../../../core-module/enum/facility/facility.enum';
import {FacilityListModel} from '../../../../core-module/model/facility/facility-list.model';
import {EquipmentListModel} from '../../../../core-module/model/equipment/equipment-list.model';

/**
 * 回路新增、编辑组件
 */
@Component({
  selector: 'app-loop-detail',
  templateUrl: './loop-detail.component.html',
  styleUrls: ['./loop-detail.component.scss']
})

export class LoopDetailComponent implements OnInit, OnDestroy {
  // 控制对象模板
  @ViewChild('controlObjectTemp') private controlObjectTemp: TemplateRef<HTMLDocument>;
  // 所属配电箱模板
  @ViewChild('distributionBoxTemp') private distributionBoxTemp: TemplateRef<HTMLDocument>;
  // 关联设施模板
  @ViewChild('linkDeviceTemp') private linkDeviceTemp: TemplateRef<HTMLDocument>;
  // 设施语言包
  public language: FacilityLanguageInterface;
  // 资产语言包
  public assetLanguage: AssetManagementLanguageInterface;
  // 表单配置
  public formColumn: FormItem[] = [];
  // 表单状态
  public formStatus: FormOperate;
  // 配电箱查询条件
  public distributionBoxFilter: FilterCondition[] = [];
  // 关联设施智慧功能杆子查询条件
  public linkDeviceFilter: FilterCondition[] = [];
  //  控制对象下拉选
  public controlObjectValue: SelectModel[] = [];
  // 回路类型选择
  public loopTypeValue: SelectModel[] = [];
  // 页面是否加载
  public pageLoading: boolean = false;
  // 页面类型 新增修改
  public pageType: OperateTypeEnum;
  // 页面标题
  public pageTitle: string;
  // 是否加载
  public isLoading: boolean = false;
  // 所属配电箱弹框是否展开
  public distributionBoxVisible: boolean = false;
  // 所属配电箱名称
  public distributionBoxName: string;
  // 所属配电箱选中id
  public distributionBoxId: string;
  // 关联设施弹框是否显示
  public linkDeviceVisible: boolean = false;
  // 关联设施名称拼接
  public linkDeviceName: string;
  // 控制对象名称
  public controlObjectName: string = '';
  // 回路id
  public loopId: string;
  // 选中关联设施名称
  public selectLinkDeviceName: string;
  // 选中关联设施id集合
  public selectLinkDeviceIds: FacilityListModel[] = [];
  // 确定按钮的状态
  public isDisabled: boolean = true;
  // 回路详情数据
  public formData: LoopViewDetailModel = new LoopViewDetailModel();

  // 关联设施的
  public lineData = [];

  constructor(
    private $nzI18n: NzI18nService,
    private $ruleUtil: RuleUtil,
    private $active: ActivatedRoute,
    private $facilityApiService: FacilityApiService,
    private $message: FiLinkModalService,
    private $loopService: LoopApiService,
    private $facilityCommonService: FacilityForCommonService
  ) {
  }

  /**
   * 初始化
   */
  public ngOnInit(): void {
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.facility);
    this.assetLanguage = this.$nzI18n.getLocaleData(LanguageEnum.assets);
    // 新增、编辑标识
    this.pageType = this.$active.snapshot.params.type;
    // 新增、编辑标题获取
    this.pageTitle = this.getPageTitle(this.pageType);
    // 回路类型枚举翻译
    this.loopTypeValue = CommonUtil.codeTranslate(LoopTypeEnum, this.$nzI18n, null, LanguageEnum.facility) as SelectModel[];
    // 初始化表单
    this.initColumn();
    // 新增编辑初始化数据请求
    this.handleInit();
  }

  /**
   * 销毁组件事件
   */
  public ngOnDestroy(): void {
    this.controlObjectTemp = null;
    this.distributionBoxTemp = null;
    this.linkDeviceTemp = null;
  }

  /**
   *  选择所属配电箱列表弹框数据
   */
  public selectDataChange(event: FacilityListModel[]): void {
    if (!_.isEmpty(event)) {
      this.distributionBoxName = event[0].deviceName;
      this.distributionBoxId = event[0].deviceId;
      const deviceId = event[0].deviceId;
      this.formStatus.resetControlData('distributionBoxId', this.distributionBoxId);
      // 每次重新选择配电箱 清空控制对象
      this.formStatus.resetControlData('centralizedControlId', null);
      // 获取配电箱下挂载设备数据
      this.controlObjectByDevice(deviceId);
      // 校验回路编码是否重复
      this.onChangeControlObject();
    }
  }

  /**
   * 表格实例化
   */
  public formInstance(event: { instance: FormOperate }): void {
    this.formStatus = event.instance;
    // 校验表单
    event.instance.group.statusChanges.subscribe(() => {
      this.isDisabled = !event.instance.getValid();
    });
  }


  /**
   * 关联设施选中数据
   */
  public selectLinkDeviceData(event): void {
    // 每次选择先清空之前的
    this.linkDeviceName = '';
    const deviceIds = [];
    const selectLinkDeviceName = [];
    if (!event.lineData && event.length === 1) {
      deviceIds.push(event[0].deviceId);
      this.linkDeviceName = event[0].deviceName;
    } else {
      this.lineData = event.lineData || [];
      this.selectLinkDeviceIds = event.selectFacilityId;
      if (!_.isEmpty(event.selectFacilityId)) {
        event.selectFacilityId.forEach(item => {
          selectLinkDeviceName.push(item.deviceName);
          deviceIds.push(item.deviceId);
        });
        this.selectLinkDeviceName = selectLinkDeviceName.join(',');
        this.linkDeviceName = this.selectLinkDeviceName;

      }
    }
    this.formStatus.resetControlData('deviceIds', deviceIds);
  }


  /**
   * 新增或编辑
   */
  public addOrEditLoop(): void {
    this.pageLoading = true;
    const formValue = _.cloneDeep(this.formStatus.group.getRawValue());
    this.isLoading = true;
    let request;
    let msgTip;
    if (this.pageType === OperateTypeEnum.add) {
      // 回路关联的设施数组
      formValue.loopLineInfos = this.lineData;
      request = this.$loopService.addLoop(formValue);
      msgTip = this.assetLanguage.addLoopSucceededTip;
      // 修改操作
    } else {
      formValue.loopId = this.loopId;
      // 回路关联的设施数组
      formValue.loopLineInfos = this.lineData;
      request = this.$loopService.updateLoopById(formValue);
      msgTip = this.assetLanguage.editLoopSucceededTip;
    }
    // 新增修改请求
    request.subscribe((result: ResultModel<string>) => {
      if (result.code === ResultCodeEnum.success) {
        this.pageLoading = false;
        this.$message.success(msgTip);
        this.goBack();
      } else {
        this.pageLoading = false;
        this.$message.error(result.msg);
      }
    }, () => this.isLoading = false);
  }

  /**
   * 返回
   */
  public goBack(): void {
    window.history.go(HISTORY_GO_STEP_CONST);
  }

  /**
   * 选择对象触发
   */
  public onChangeControlObject(): void {
    this.formStatus.group.controls['loopCode'].markAsDirty();
    this.formStatus.group.controls['loopCode'].updateValueAndValidity();
  }

  /**
   * 配电箱设施挂载的设备集中控制器筛选
   */
  private controlObjectByDevice(deviceId: string): void {
    const paramId = {deviceId: deviceId};
    this.$loopService.queryEquipmentInfoList(paramId).subscribe((result: ResultModel<EquipmentListModel[]>) => {
      if (!_.isEmpty(result.data)) {
        // 筛选出挂载设备中的集中控制器
        this.controlObjectValue = [];
        result.data.forEach(item => {
          if (item.equipmentType === EquipmentTypeEnum.centralController) {
            this.controlObjectValue.push({label: item.equipmentName, code: item.equipmentId});
          }
        });
      }
    });
  }


  /**
   * 初始化表单配置
   */
  private initColumn(): void {
    this.formColumn = [
      { // 回路名称
        label: this.language.loopName,
        key: 'loopName',
        type: 'input',
        require: true,
        rule: [
          {required: true},
          RuleUtil.getNameMaxLengthRule(),
          this.$ruleUtil.getNameRule()
        ],
        customRules: [this.$ruleUtil.getNameCustomRule()],
        asyncRules: [this.$ruleUtil.getNameAsyncRule(value =>
            this.$loopService.queryLoopNameIsExist({loopId: this.loopId, loopName: value}),
          res => !res.data)
        ]
      },
      { // 回路编号
        label: this.assetLanguage.loopCode,
        key: 'loopCode',
        type: 'input',
        require: true,
        placeholder: this.language.pleaseEnter,
        rule: [
          {required: true},
          RuleUtil.getNameMaxLengthRule(),
          this.$ruleUtil.getLoopCode()
        ],
        asyncRules: [
          // 检验回路编号是否重复
          this.$ruleUtil.getNameAsyncRule(value =>
            this.$loopService.queryLoopCodeIsExist(
              {
                loopId: this.loopId,
                loopCode: value,
                distributionBoxId: this.formStatus.getData('distributionBoxId'),
                centralizedControlId: this.formStatus.getData('centralizedControlId')
              }), res => !res.data, this.assetLanguage.loopCodeTip)
        ]
      },
      { // 回路类型
        label: this.language.loopType,
        key: 'loopType',
        type: 'select',
        require: true,
        rule: [{required: true}],
        selectInfo: {
          data: CommonUtil.codeTranslate(LoopTypeEnum, this.$nzI18n, null, LanguageEnum.facility),
          label: 'label',
          value: 'code'
        },
        modelChange: (controls, $event, key, formOperate) => {
          this.handleDefined($event, formOperate);
        }
      },
      { // 自定义类型名称
        label: '',
        key: 'customizeLoopType',
        type: 'input',
        require: false,
        hidden: true,
        rule: [
          {required: true},
          RuleUtil.getNameMaxLengthRule(),
          this.$ruleUtil.getNameRule()
        ],
        customRules: [this.$ruleUtil.getNameCustomRule()],
      },
      { // 所属配电箱
        label: this.language.distributionBox,
        key: 'distributionBoxId',
        type: 'custom',
        template: this.distributionBoxTemp,
        require: true,
        rule: [{required: true}],
        asyncRules: [],
      },
      { // 关联设施
        label: this.language.setDevice,
        key: 'deviceIds',
        type: 'custom',
        template: this.linkDeviceTemp,
        rule: [],
        asyncRules: []
      },
      { // 控制对象下拉框
        label: this.language.controlledObject,
        key: 'centralizedControlId',
        type: 'custom',
        rule: [],
        template: this.controlObjectTemp,
      },
      { // 备注
        label: this.language.remarks,
        key: 'remark',
        type: 'textarea',
        placeholder: this.language.pleaseEnter,
        rule: [this.$ruleUtil.getRemarkMaxLengthRule()]
      },
    ];
  }

  /**
   * 回路类型自定义时增加输入框列
   */
  private handleDefined(typeCode: string, formOperate?: FormOperate): void {
    this.formColumn.forEach(v => {
      if (v.key === 'customizeLoopType') {
        v.hidden = typeCode !== LoopTypeEnum.customize;
        if (!v.hidden) {
          // 自定义输入框需显示
          v.rule = [
            {required: true},
            RuleUtil.getNameMaxLengthRule(),
            this.$ruleUtil.getNameRule()
          ];
          this.formStatus.addValidRule(v);
        } else {
          // 自定义输入框不显示
          this.formStatus.deleteValidRule(v);
          this.formStatus.resetControlData('customizeLoopType', null, {emitEvent: true});
        }
        this.formStatus.group.controls['customizeLoopType'].markAsDirty();
        this.formStatus.group.controls['customizeLoopType'].updateValueAndValidity();
      }
    });
  }

  /**
   * 表单初始数据处理
   */
  private handleInit(): void {
    // 初始化配电箱的查询条件
    this.distributionBoxFilter = [
      new FilterCondition('deviceType', OperatorEnum.in, [DeviceTypeEnum.distributionPanel])
    ];
    // 初始化关联设施（智慧功能杆子）的查询条件
    this.linkDeviceFilter = [
      new FilterCondition('deviceType', OperatorEnum.in, [DeviceTypeEnum.wisdom])];
    if (this.pageType !== OperateTypeEnum.add) {
      this.$active.queryParams.subscribe(params => {
        this.loopId = params.id;
        this.loopDetailView();
      });
    }
  }

  /***
   * 查看回路详情
   */
  private loopDetailView(): void {
    // 查询回路详情
    this.$facilityCommonService.queryLoopDetail({loopId: this.loopId}).subscribe((result: ResultModel<LoopViewDetailModel>) => {
      this.selectLinkDeviceIds = [];
      const linkDeviceName = [];
      if (result.code === ResultCodeEnum.success) {
        this.formData = result.data;
        // 回路关联的设施数组
        this.lineData = result.data.loopLineInfos;
        this.distributionBoxId = this.formData.distributionBoxId;
        // 根据所属配电箱筛选出控制对象下拉选项
        this.controlObjectByDevice(this.distributionBoxId);
        this.selectLinkDeviceIds = this.formData.loopDeviceRespList;
        this.formData.deviceIds = [];
        this.formData.loopDeviceRespList.forEach(item => {
          // 关联设施id集合
          linkDeviceName.push(item.deviceName);
          this.formData.deviceIds.push(item.deviceId);
        });
        // 关联设施名称拼接
        this.linkDeviceName = linkDeviceName.join(',');
        // 所属配电箱名称
        this.distributionBoxName = this.formData.distributionBoxName;
        // 控制对象名称
        this.controlObjectName = this.formData.centralizedControlName;
        this.formStatus.resetData(this.formData);
      }
    });
  }

  /**
   * 获取页面标题类型
   * param type
   * returns {string}
   */
  private getPageTitle(type: OperateTypeEnum): string {
    let title;
    switch (type) {
      case OperateTypeEnum.add:
        title = this.language.addLoop;
        break;
      case OperateTypeEnum.update:
        title = this.language.editLoop;
        break;
      default:
        title = '';
        break;
    }
    return title;
  }
}
