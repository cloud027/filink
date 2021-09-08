import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {NzI18nService} from 'ng-zorro-antd';
import * as _ from 'lodash';
import {FormItem} from '../../../../../shared-module/component/form/form-config';
import {FormOperate} from '../../../../../shared-module/component/form/form-operate.service';
import {ApplicationInterface} from '../../../../../../assets/i18n/application/application.interface';
import {LanguageEnum} from '../../../../../shared-module/enum/language.enum';
import {ResultModel} from '../../../../../shared-module/model/result.model';
import {ApplicationService} from '../../../share/service/application.service';
import {ActivatedRoute, Router} from '@angular/router';
import {PassagewayModel} from '../../../share/model/passageway.model';
import {PageModel} from '../../../../../shared-module/model/page.model';
import {TableConfigModel} from '../../../../../shared-module/model/table-config.model';
import {FilterCondition, QueryConditionModel, SortCondition} from '../../../../../shared-module/model/query-condition.model';
import {FiLinkModalService} from '../../../../../shared-module/service/filink-modal/filink-modal.service';
import {FacilityLanguageInterface} from '../../../../../../assets/i18n/facility/facility.language.interface';
import {getEquipmentState, getEquipmentTypeIcon} from '../../../share/util/application.util';
import {CommonUtil} from '../../../../../shared-module/util/common-util';
import {EquipmentListModel} from '../../../../../core-module/model/equipment/equipment-list.model';
import {AsyncRuleUtil} from '../../../../../shared-module/util/async-rule-util';
import {CommonLanguageInterface} from '../../../../../../assets/i18n/common/common.language.interface';
import {OperatorEnum} from '../../../../../shared-module/enum/operator.enum';
import {RuleUtil} from '../../../../../shared-module/util/rule-util';
import {FacilityListModel} from '../../../../../core-module/model/facility/facility-list.model';
import {CameraAccessTypeEnum} from '../../../share/enum/camera.enum';
import {EquipmentStatusEnum, EquipmentTypeEnum} from '../../../../../core-module/enum/equipment/equipment.enum';
import {ResultCodeEnum} from '../../../../../shared-module/enum/result-code.enum';
import {ApplicationSystemForCommonService} from '../../../../../core-module/api-service/application-system';
import {ControlInstructEnum} from '../../../../../core-module/enum/instruct/control-instruct.enum';
import {NativeWebsocketImplService} from 'src/app/core-module/websocket/native-websocket-impl.service';
import {FormGroup} from '@angular/forms';

/**
 * 通道配置新增/编辑页面
 */
@Component({
  selector: 'app-passageway-add',
  templateUrl: './passageway-add.component.html',
  styleUrls: ['./passageway-add.component.scss']
})
export class PassagewayAddComponent implements OnInit, OnDestroy {
  /**
   * 选择设备
   */
  @ViewChild('selectEquipment') selectEquipment: TemplateRef<HTMLDocument>;
  /**
   * 设备状态模版
   */
  @ViewChild('equipmentStatusTemp') equipmentStatusFilterTemp: TemplateRef<HTMLDocument>;
  /**
   * 单选按钮
   */
  @ViewChild('radioTemp') radioTemp: TemplateRef<HTMLDocument>;
  /**
   * 设施过滤模版
   */
  @ViewChild('facilityTemplate') deviceFilterTemplate: TemplateRef<HTMLDocument>;
  /**
   * 过滤框显示设施名
   */
  public filterDeviceName: string = '';
  /**
   * 设施过滤
   */
  public filterValue: FilterCondition;
  /**
   * 设施过滤选择器
   */
  public facilityVisible: boolean = false;
  /**
   * 已选择设施数据
   */
  public selectFacility: FacilityListModel[] = [];
  /**
   * 应用系统
   */
  public language: ApplicationInterface;
  /**
   * 公共国际化
   */
  public commonLanguage: CommonLanguageInterface;
  /**
   * 设施语言包
   */
  public facilitiesLanguage: FacilityLanguageInterface;
  /**
   * 列表初始加载图标
   */
  public isLoading = false;
  /**
   * form表单配置
   */
  public formColumn: FormItem[] = [];

  /**
   * 表单状态
   */
  private formStatus: FormOperate;
  /**
   * 表单中的字段是否隐藏
   */
  private isHidden: boolean = true;
  /**
   * 主键ＩＤ
   */
  private id: string;

  /**
   * 列表数据
   */
  public dataSet: EquipmentListModel[] = [];
  /**
   * 分页初始设置
   */
  public pageBean: PageModel = new PageModel();
  /**
   * 列表配置
   */
  public tableConfig: TableConfigModel;
  /**
   * 列表查询参数
   */
  private queryCondition: QueryConditionModel = new QueryConditionModel();
  /**
   * 设备模态框
   */
  public isVisible: boolean = false;
  /**
   * 设备状态枚举
   */
  public equipmentStatusEnum = EquipmentStatusEnum;
  /**
   * 国际化前缀枚举
   */
  public languageEnum = LanguageEnum;
  /**
   * 已选设备ID
   */
  public equipmentId: string = '';
  /**
   * 已选设备名字
   */
  public equipmentName: string;
  /**
   * 已选设备数据
   */
  public equipmentData: EquipmentListModel;
  /**
   * 确定按钮的状态
   */
  public isDisabled: boolean = false;

  // 声明rtsp和onvif需要处理的字段数组
  public rtspArray = ['cameraIp', 'cameraPort', 'cameraAccount', 'cameraPassword'];
  public onvifArray = ['onvifStatus', 'onvifAddr', 'onvifIp', 'onvifAccount', 'onvifPassword', 'onvifPort'];

  /**
   * 自动探测按钮状态
   */
  public onvifBtnStatus: boolean = true;

  /**
   * 自动探测状态
   */
  public discoveryLoading: boolean = false;

  /**
   * 自动发现数据
   */
  private discoveryData: string[] = [];
  // 设施ID
  private deviceId = 'deviceId';

  // 确认开关
  public changeOff = true;

  /**
   * @param $applicationService 后台接口服务
   * @param $activatedRoute 路由传参服务
   * @param $nzI18n  国际化服务
   * @param $router  路由服务
   * @param $message  信息提示服务
   * @param $ruleUtil  规则服务
   * @param $asyncRuleUtil  规则服务
   * @param $securityService 指令下发服务
   * @param $websocketService websocket服务
   */
  constructor(
    private $applicationService: ApplicationService,
    private $activatedRoute: ActivatedRoute,
    private $nzI18n: NzI18nService,
    private $router: Router,
    private $message: FiLinkModalService,
    private $ruleUtil: RuleUtil,
    private $asyncRuleUtil: AsyncRuleUtil,
    private $securityService: ApplicationSystemForCommonService,
    private $websocketService: NativeWebsocketImplService
  ) {
  }

  ngOnInit(): void {
    this.facilitiesLanguage = this.$nzI18n.getLocaleData(LanguageEnum.facility);
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.application);
    this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
    this.initColumn();
    this.$activatedRoute.queryParams.subscribe(params => {
      if (params.id) {
        // 为修改页面时
        this.id = params.id;
        this.onInitialization();
      } else {
        this.formColumn.find(item => item.key === 'onvifStatus').modelChange = this.selectedOnvifStatus;
      }
    });
    this.$websocketService.subscibeMessage.subscribe(res => {
      const data = JSON.parse(res.data);
      if (data.channelKey === 'equipmentId') {
        const msg = JSON.parse(data.msg);
        const resKey = Object.keys(msg);
        // 自動發現
        if (resKey.some(key => key === 'list')) {
          const onvifColumn = this.formColumn.find(key => key.key === 'onvifIp');
          if (!_.isEmpty(msg.list)) {
            this.discoveryData = msg.list;
            onvifColumn.type = 'select';
            const selectData = this.discoveryData.map(key => {
              return {label: key.split(':')[0], value: key.split(':')[0]};
            });
            onvifColumn.selectInfo = {data: selectData, label: 'label', value: 'value'};
            onvifColumn.modelChange = this.selectedOnvifIp;
            console.log('自动发现内容' + msg);
          } else {
            onvifColumn.type = 'input';
            this.$message.info(this.language.securityWorkbench.notFoundEquipment);
          }
        } else if (resKey.some(key => key === 'rtspUrl')) {
          this.formStatus.group.controls['rtspAddr'].setValue(msg.rtspUrl);
          // rtsp url
          console.log('rtsp地址' + msg);
        }
        this.discoveryLoading = false;
      }
    });
  }

  /**
   * 是否启用ONVIF探测
   */
  public selectedOnvifIp = (control: FormGroup, value: string) => {
    if (value) {
      const {onvifAccount, onvifPassword, channelId, rtspAddr} = this.formStatus.group.controls;
      if ((!onvifAccount.value || !onvifPassword.value || !channelId.value) && !rtspAddr.value) {
        this.$message.warning(this.language.securityWorkbench.tip);
        this.formStatus.group.controls['onvifIp'].setValue('');
        return;
      }
      // 端口带出
      const port = this.discoveryData.find(item => item.split(':')[0] === value).split(':')[1];
      this.formStatus.group.controls['onvifPort'].setValue(port);
      this.formStatus.group.controls['onvifAddr'].setValue(`http://${value}:${port}/onvif/device_service`);
      if (onvifAccount.value && onvifPassword.value && channelId.value) {
        this.discoveryLoading = true;
        const cameraType = this.formStatus.group.controls['cameraType'].value;
        const equipmentId = this.equipmentId;
        const parameter = {
          commandId: ControlInstructEnum.getRtspUrl,
          equipmentIds: [equipmentId],
          param: {
            channelList: [{
              equipmentId,
              cameraType,
              'onvifAccount': onvifAccount.value,
              'onvifPassword': onvifPassword.value,
              'onvifPort': port,
              'onvifIp': value,
              'channelId': channelId.value
            }]
          }
        };
        this.$securityService.instructDistribute(parameter).subscribe((result: ResultModel<PassagewayModel[]>) => {
          if (result.code !== ResultCodeEnum.success) {
            this.$message.error(result.msg);
          }
        });
      }
    }
  }

  /**
   * 编辑初始化接口
   */
  private onInitialization(): void {
    this.$applicationService.getChannelData(this.id)
      .subscribe((result: ResultModel<PassagewayModel>) => {
        if (result.code === ResultCodeEnum.success) {
          this.formStatus.resetData(result.data);
          this.formColumn.find(item => item.key === 'onvifStatus').modelChange = this.selectedOnvifStatus;
          if (result.data.onvifStatus === '1') {
            this.onvifBtnStatus = false;
          }
          this.equipmentId = result.data.equipmentId;
          this.equipmentName = result.data.equipmentName;
        } else {
          this.$message.error(result.msg);
        }
      });
  }

  /**
   * 页面销毁
   */
  ngOnDestroy(): void {
    this.selectEquipment = null;
    this.equipmentStatusFilterTemp = null;
    this.radioTemp = null;
    this.deviceFilterTemplate = null;
  }


  /**
   * 获取form表单对象
   * @param event 表单
   */
  public formInstance(event: { instance: FormOperate }): void {
    this.formStatus = event.instance;
    this.formStatus.group.controls['videoRetentionDays'].reset(0);
    // 校验表单
    this.formStatus.group.statusChanges.subscribe(() => {
      this.isDisabled = this.formStatus.getRealValid();
    });
  }

  /**
   * 表单配置
   */
  private initColumn() {
    return this.formColumn = [
      // 通道名称
      {
        label: this.language.securityWorkbench.channelName,
        key: 'channelName',
        type: 'input',
        require: true,
        disabled: false,
        labelWidth: 160,
        rule: [{required: true}, {maxLength: 255}],
        customRules: [this.$ruleUtil.getNameCustomRule()],
      },
      // 通道号
      {
        label: this.language.securityWorkbench.channelNumber,
        key: 'channelId',
        type: 'input',
        require: true,
        labelWidth: 160,
        rule: [{required: true}, {max: 65535}, {min: 1}],
        asyncRules: [this.$asyncRuleUtil.mustInt()]
      },
      // 选择设备
      {
        label: this.language.securityWorkbench.selectDevice,
        key: 'equipmentId',
        type: 'custom',
        require: true,
        disabled: false,
        labelWidth: 160,
        rule: [{required: true}],
        template: this.selectEquipment
      },
      // 是否启用
      {
        label: this.language.frequentlyUsed.isEnable,
        key: 'status',
        initialValue: '1',
        require: true,
        disabled: false,
        labelWidth: 160,
        type: 'radio',
        radioInfo: {
          data: [{
            label: this.language.frequentlyUsed.enable,
            value: '1'
          },
            {
              label: this.language.frequentlyUsed.disabled,
              value: '0'
            }],
          label: 'label',
          value: 'value'
        },
        rule: [{required: true}]
      },
      // 摄像机接入类型
      {
        label: this.language.securityWorkbench.cameraType,
        key: 'cameraType',
        initialValue: CameraAccessTypeEnum.rtsp,
        require: true,
        labelWidth: 160,
        rule: [{required: true}],
        type: 'radio',
        radioInfo: {
          data: [{
            label: CameraAccessTypeEnum.rtsp,
            value: CameraAccessTypeEnum.rtsp
          },
            {
              label: CameraAccessTypeEnum.onvif,
              value: CameraAccessTypeEnum.onvif
            }],
          label: 'label',
          value: 'value'
        },
        modelChange: (controls, value) => {
          this.selectedCameraType(value);
        }
      },
      // 是否启用ONVIF探测
      {
        label: this.language.securityWorkbench.onvifStatus,
        key: 'onvifStatus',
        require: true,
        disabled: false,
        labelWidth: 160,
        initialValue: '0',
        hidden: this.isHidden,
        type: 'radio',
        radioInfo: {
          data: [{
            label: this.language.frequentlyUsed.yes,
            value: '1'
          },
            {
              label: this.language.frequentlyUsed.no,
              value: '0'
            }],
          label: 'label',
          value: 'value'
        },
        rule: [{required: true}]
      },
      // 摄像机接入ONVIF地址
      {
        label: this.language.securityWorkbench.onvifAddr,
        key: 'onvifAddr',
        type: 'input',
        require: true,
        hidden: this.isHidden,
        labelWidth: 160,
        disabled: false,
        rule: [{required: true}, {maxLength: 200}],
        customRules: [this.$ruleUtil.getNameCustomRule()],
      },
      // 摄像机ip
      {
        label: this.language.securityWorkbench.cameraIp,
        key: 'cameraIp',
        type: 'input',
        labelWidth: 160,
        require: true,
        disabled: false,
        rule: [{required: true}],
        asyncRules: [this.$asyncRuleUtil.IPV4Reg()],
      },
      // 摄像机端口
      {
        label: this.language.securityWorkbench.cameraPort,
        key: 'cameraPort',
        type: 'input',
        labelWidth: 160,
        require: true,
        disabled: false,
        rule: [{required: true}, {max: 65535}, {min: 0}],
        asyncRules: [this.$asyncRuleUtil.mustInt()]
      },
      // 摄像机用户名
      {
        label: this.language.securityWorkbench.cameraAccount,
        key: 'cameraAccount',
        type: 'input',
        labelWidth: 160,
        require: true,
        disabled: false,
        rule: [{required: true}, {maxLength: 32}],
        customRules: [this.$ruleUtil.getNameCustomRule()],
      },
      // 摄像机密码
      {
        label: this.language.securityWorkbench.cameraPassword,
        key: 'cameraPassword',
        type: 'input',
        labelWidth: 160,
        require: true,
        disabled: false,
        rule: [{required: true}, {maxLength: 32}],
        customRules: [this.$ruleUtil.getNameCustomRule()],
      },
      // 探测ONVIF IP
      {
        label: this.language.securityWorkbench.onvifIp,
        disabled: false,
        key: 'onvifIp',
        type: 'input',
        labelWidth: 160,
        require: true,
        hidden: this.isHidden,
        rule: [{required: true}],
        customRules: [
          this.$ruleUtil.getIpV4Reg(),
        ]
      },
      // 探测ONVIF port
      {
        label: this.language.securityWorkbench.onvifPort,
        disabled: false,
        key: 'onvifPort',
        type: 'input',
        labelWidth: 160,
        require: true,
        hidden: this.isHidden,
        rule: [{required: true}]
      },
      // 探测 ONVIF 用户名
      {
        label: this.language.securityWorkbench.onvifAccount,
        disabled: false,
        key: 'onvifAccount',
        type: 'input',
        labelWidth: 160,
        require: true,
        hidden: this.isHidden,
        rule: [{required: true}, {minLength: 1}, {maxLength: 32}],
        customRules: [this.$ruleUtil.getNameCustomRule()],
      },
      // 探测 ONVIF 密码
      {
        label: this.language.securityWorkbench.onvifPassword,
        disabled: false,
        key: 'onvifPassword',
        type: 'input',
        labelWidth: 160,
        require: true,
        hidden: this.isHidden,
        rule: [{required: true}, {maxLength: 32}],
        customRules: [this.$ruleUtil.getNameCustomRule()],
      },
      // 摄像机接入RTSP地址
      {
        label: this.language.securityWorkbench.rtspAddr,
        key: 'rtspAddr',
        type: 'input',
        require: true,
        labelWidth: 160,
        disabled: false,
        rule: [{required: true}, {maxLength: 200}],
        customRules: [this.$ruleUtil.getNameCustomRule()],
      },
      // 录像保留天数
      {
        label: this.language.securityWorkbench.videoRetentionDays,
        key: 'videoRetentionDays',
        initialValue: 0,
        type: 'input',
        require: true,
        labelWidth: 160,
        disabled: false,
        rule: [{required: true}, {max: 90}],
        asyncRules: [this.$asyncRuleUtil.mustInt()]
      },
      // 其他设置
      {
        label: this.language.securityWorkbench.audioSwitch,
        disabled: false,
        key: 'audioSwitch',
        labelWidth: 160,
        type: 'radio',
        radioInfo: {
          data: [{
            label: this.language.frequentlyUsed.openVolume,
            value: '1'
          },
            {
              label: this.language.frequentlyUsed.closeVolume,
              value: '0'
            }],
          label: 'label',
          value: 'value'
        },
        rule: []
      },
    ];
  }

  /**
   * 是否启用单选改变事件
   */
  public selectedCameraType(value): void {
    this.isHidden = value === CameraAccessTypeEnum.rtsp;
    // 进行表单操作 屏蔽或显示
    this.setColumnHidden();
    const isRequired = !this.isHidden;
    ['onvifIp', 'onvifAccount', 'onvifPassword'].forEach(item => {
      const formItem = this.formColumn.find(_form => _form.key === item);
      if (formItem) {
        formItem.require = isRequired;
        if (isRequired) {
          if (formItem.key === 'onvifIp') {
            this.formStatus.group.controls[formItem.key].setValidators(this.formStatus.addRule([{required: true}], [this.$ruleUtil.getIpV4Reg()]));
          } else {
            this.formStatus.group.controls[formItem.key].setValidators(this.formStatus.addRule([{required: true}, {maxLength: 32}], [this.$ruleUtil.getNameCustomRule()]));
          }
        } else {
          this.formStatus.group.controls[formItem.key].clearValidators();
          if (formItem.key === 'onvifIp') {
            this.formStatus.group.controls[formItem.key].setValidators(this.formStatus.addRule([], [this.$ruleUtil.getIpV4Reg()]));
          } else {
            this.formStatus.group.controls[formItem.key].setValidators(this.formStatus.addRule([{maxLength: 32}]));
          }
        }
        Promise.resolve().then(() => {
          const itemValue = this.formStatus.group.getRawValue()[item];
          this.formStatus.group.controls[item].setValue(itemValue);
          this.formStatus.group.updateValueAndValidity();
        });
      }
    });
  }

  /**
   * 是否启用ONVIF探测
   */
  public selectedOnvifStatus = (control: FormGroup, value: string) => {
    if (Number(value) && _.isEmpty(this.equipmentId)) {
      this.$message.warning('请选择设备');
      this.formStatus.group.controls['onvifStatus'].reset('0');
      this.onvifBtnStatus = true;
    } else if (Number(value) && this.equipmentId) {
      this.onvifBtnStatus = false;
    } else {
      this.onvifBtnStatus = true;
    }
  }


  /**
   * 表单操作隐藏或者显示
   */
  private setColumnHidden(): void {
    this.formColumn.forEach(item => {
      if (this.rtspArray.includes(item.key)) {
        item.hidden = !this.isHidden;
      } else if (this.onvifArray.includes(item.key)) {
        item.hidden = this.isHidden;
      }
    });
    this.formStatus.group.controls['onvifStatus'].reset('0');
  }

  /**
   * 提交方法
   */
  public onConfirm(): void {
    if (!this.changeOff) {
      return;
    }
    const channelConfigurationParameter = this.formStatus.group.getRawValue();
    let isEdit = this.$applicationService.saveChannel(channelConfigurationParameter);
    if (channelConfigurationParameter.cameraType === CameraAccessTypeEnum.rtsp) {
      channelConfigurationParameter.onvifStatus = '';
    }
    // 如果有通道ID则为编辑页面
    if (this.id) {
      channelConfigurationParameter.id = this.id;
      isEdit = this.$applicationService.updateChannel(channelConfigurationParameter);
    }
    this.changeOff = false;
    isEdit.subscribe((result: ResultModel<PassagewayModel[]>) => {
      if (result.code === ResultCodeEnum.success) {
        this.changeOff = true;
        this.$router.navigate(
          [`business/application/security/workbench/passageway-information`]).then();
      } else {
        this.changeOff = true;
        this.$message.error(result.msg);
      }
    });
  }

  /**
   * 取消
   */
  public onCancel(): void {
    window.history.go(-1);
  }

  /**
   * 获取设备列表数据
   */
  private getEquipmentData(): void {
    this.tableConfig.isLoading = true;
    this.queryCondition.filterConditions.push(new FilterCondition('equipmentType', OperatorEnum.in, [EquipmentTypeEnum.camera]));
    this.$applicationService.equipmentListByPage(this.queryCondition)
    // todo EquipmentListModel 用share moudel 中的模型
      .subscribe((result: ResultModel<any[]>) => {
        if (result.code === ResultCodeEnum.success) {
          this.tableConfig.isLoading = false;
          this.dataSet = result.data;
          this.pageBean.Total = result.totalCount;
          this.pageBean.pageIndex = result.pageNum;
          this.pageBean.pageSize = result.size;
          this.dataSet.forEach(item => {
            // 设置状态样式
            const style = CommonUtil.getEquipmentStatusIconClass(item.equipmentStatus, 'list');
            item.statusIconClass = style.iconClass;
            item.statusColorClass = style.colorClass;
            // 获取设备类型的图标
            item.iconClass = getEquipmentTypeIcon(item);
            item.checked = false;
          });
        } else {
          this.$message.error(result.msg);
          this.tableConfig.isLoading = false;
        }
      }, () => {
        this.tableConfig.isLoading = false;
      });
  }

  /**
   * 初始化表格配置
   */
  private initTableConfig(): void {
    this.tableConfig = {
      isDraggable: true,
      isLoading: false,
      showSearchSwitch: true,
      showSizeChanger: true,
      keepSelected: true,
      scroll: {x: '1600px', y: '420px'},
      noIndex: true,
      noAutoHeight: true,
      notShowPrint: true,
      columnConfig: [
        { // 单选
          title: this.language.frequentlyUsed.select,
          type: 'render',
          renderTemplate: this.radioTemp,
          fixedStyle: {
            fixedLeft: true,
            style: {left: '0px'}
          },
          width: 62
        },
        // 序号
        {
          type: 'serial-number', width: 62, title: this.language.frequentlyUsed.serialNumber,
          fixedStyle: {fixedLeft: true, style: {left: '62px'}}
        },
        { // 资产编码
          title: this.facilitiesLanguage.deviceCode,
          key: 'equipmentCode',
          width: 150,
          isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        { // 名称
          title: this.facilitiesLanguage.name,
          key: 'equipmentName',
          width: 180,
          searchable: true,
          isShowSort: true,
          searchConfig: {type: 'input'}
        },
        { // 状态
          title: this.facilitiesLanguage.status,
          key: 'equipmentStatus',
          width: 150,
          type: 'render',
          renderTemplate: this.equipmentStatusFilterTemp,
          searchable: true,
          isShowSort: true,
          searchConfig: {
            type: 'select', selectType: 'multiple',
            selectInfo: getEquipmentState(this.$nzI18n).filter(v => v.code !== EquipmentStatusEnum.dismantled),
            label: 'label',
            value: 'code'
          }
        },
        { //  型号
          title: this.facilitiesLanguage.model,
          key: 'equipmentModel',
          width: 150,
          isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        { // 所属设施
          title: this.facilitiesLanguage.affiliatedDevice,
          key: 'deviceName',
          searchKey: 'deviceId',
          width: 150,
          searchable: true,
          isShowSort: true,
          searchConfig: {
            type: 'render',
            renderTemplate: this.deviceFilterTemplate
          },
        },
        { // 挂载位置
          title: this.facilitiesLanguage.mountPosition,
          key: 'mountPosition',
          searchable: true,
          width: 150,
          isShowSort: true,
          searchConfig: {type: 'input'}
        },
        { // 操作列
          title: this.language.frequentlyUsed.operate,
          searchable: true,
          searchConfig: {type: 'operate'},
          key: '', width: 180,
          fixedStyle: {fixedRight: true, style: {right: '0px'}}
        },
      ],
      showPagination: true,
      bordered: false,
      showSearch: false,
      searchReturnType: 'Array',
      topButtons: [],
      operation: [],
      leftBottomButtons: [],
      sort: (event: SortCondition) => {
        this.queryCondition.sortCondition.sortField = event.sortField;
        this.queryCondition.sortCondition.sortRule = event.sortRule;
        this.getEquipmentData();
      },
      handleSearch: (event: FilterCondition[]) => {
        let deviceIndex;
        event.forEach((row, index) => {
          if (row.filterField === this.deviceId) {
            deviceIndex = index;
          }
        });
        // 使用设施选择器的设施之后对设施ID过滤进行处理
        if (deviceIndex >= 0 && !_.isEmpty(event[deviceIndex].filterValue)) {
          event[deviceIndex].operator = OperatorEnum.in;
        } else {
          this.filterDeviceName = '';
          this.filterValue = null;
          event = event.filter(item => item.filterField !== this.deviceId);
          this.selectFacility = [];
        }
        this.queryCondition.pageCondition.pageNum = 1;
        this.queryCondition.filterConditions = event;
        this.getEquipmentData();
      }
    };
  }

  /**
   * 打开模态框
   */
  public showModal(): void {
    this.isVisible = true;
    this.initTableConfig();
    this.getEquipmentData();
    this.equipmentId = this.formStatus.group.getRawValue().equipmentId;
  }

  /**
   * 单选设备
   */
  public onEquipmentChange(event: string, data: EquipmentListModel): void {
    this.equipmentData = {...data};
  }


  /**
   * 模态框确认
   */
  public onHandleTableOk(): void {
    this.isVisible = false;
    this.equipmentId = this.equipmentData.equipmentId;
    this.equipmentName = this.equipmentData.equipmentName;
    // 将设备ID插入到列表
    this.formStatus.group.controls['equipmentId'].reset(this.equipmentId);
  }

  /**
   * 模态框确认
   */
  public onHandleTableCancel(): void {
    this.isVisible = false;
    this.equipmentData = null;
  }

  /**
   * 分页事件
   * @param event 分页对象
   */
  public pageChange(event: PageModel): void {
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
    this.getEquipmentData();
  }

  /**
   * 点击输入框弹出设施选择
   */
  public onShowFacility(filterValue: FilterCondition): void {
    this.filterValue = filterValue;
    if (!this.filterValue.filterValue) {
      this.filterValue.filterValue = [];
    }
    this.facilityVisible = true;
  }

  /**
   * 选择设施数据
   */
  public onFacilityChange(event: FacilityListModel[]): void {
    this.filterValue.filterValue = event.map(item => item.deviceId) || [];
    this.selectFacility = event || [];
    if (!_.isEmpty(event)) {
      this.filterDeviceName = event.map(item => item.deviceName).join(',');
    } else {
      this.filterDeviceName = '';
    }
  }

  /**
   * 自动发现
   */
  public discovery(): void {
    this.discoveryLoading = true;
    const cameraType = this.formStatus.group.controls['cameraType'].value;
    const equipmentId = this.equipmentId;
    const parameter = {
      commandId: ControlInstructEnum.discovery,
      equipmentIds: [equipmentId],
      param: {channelList: [{equipmentId, cameraType}]}
    };
    this.$securityService.instructDistribute(parameter).subscribe((result: ResultModel<PassagewayModel[]>) => {
      if (result.code !== ResultCodeEnum.success) {
        this.$message.error(result.msg);
      }
    });
  }

}
