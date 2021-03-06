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
 * ??????????????????/????????????
 */
@Component({
  selector: 'app-passageway-add',
  templateUrl: './passageway-add.component.html',
  styleUrls: ['./passageway-add.component.scss']
})
export class PassagewayAddComponent implements OnInit, OnDestroy {
  /**
   * ????????????
   */
  @ViewChild('selectEquipment') selectEquipment: TemplateRef<HTMLDocument>;
  /**
   * ??????????????????
   */
  @ViewChild('equipmentStatusTemp') equipmentStatusFilterTemp: TemplateRef<HTMLDocument>;
  /**
   * ????????????
   */
  @ViewChild('radioTemp') radioTemp: TemplateRef<HTMLDocument>;
  /**
   * ??????????????????
   */
  @ViewChild('facilityTemplate') deviceFilterTemplate: TemplateRef<HTMLDocument>;
  /**
   * ????????????????????????
   */
  public filterDeviceName: string = '';
  /**
   * ????????????
   */
  public filterValue: FilterCondition;
  /**
   * ?????????????????????
   */
  public facilityVisible: boolean = false;
  /**
   * ?????????????????????
   */
  public selectFacility: FacilityListModel[] = [];
  /**
   * ????????????
   */
  public language: ApplicationInterface;
  /**
   * ???????????????
   */
  public commonLanguage: CommonLanguageInterface;
  /**
   * ???????????????
   */
  public facilitiesLanguage: FacilityLanguageInterface;
  /**
   * ????????????????????????
   */
  public isLoading = false;
  /**
   * form????????????
   */
  public formColumn: FormItem[] = [];

  /**
   * ????????????
   */
  private formStatus: FormOperate;
  /**
   * ??????????????????????????????
   */
  private isHidden: boolean = true;
  /**
   * ????????????
   */
  private id: string;

  /**
   * ????????????
   */
  public dataSet: EquipmentListModel[] = [];
  /**
   * ??????????????????
   */
  public pageBean: PageModel = new PageModel();
  /**
   * ????????????
   */
  public tableConfig: TableConfigModel;
  /**
   * ??????????????????
   */
  private queryCondition: QueryConditionModel = new QueryConditionModel();
  /**
   * ???????????????
   */
  public isVisible: boolean = false;
  /**
   * ??????????????????
   */
  public equipmentStatusEnum = EquipmentStatusEnum;
  /**
   * ?????????????????????
   */
  public languageEnum = LanguageEnum;
  /**
   * ????????????ID
   */
  public equipmentId: string = '';
  /**
   * ??????????????????
   */
  public equipmentName: string;
  /**
   * ??????????????????
   */
  public equipmentData: EquipmentListModel;
  /**
   * ?????????????????????
   */
  public isDisabled: boolean = false;

  // ??????rtsp???onvif???????????????????????????
  public rtspArray = ['cameraIp', 'cameraPort', 'cameraAccount', 'cameraPassword'];
  public onvifArray = ['onvifStatus', 'onvifAddr', 'onvifIp', 'onvifAccount', 'onvifPassword', 'onvifPort'];

  /**
   * ????????????????????????
   */
  public onvifBtnStatus: boolean = true;

  /**
   * ??????????????????
   */
  public discoveryLoading: boolean = false;

  /**
   * ??????????????????
   */
  private discoveryData: string[] = [];
  // ??????ID
  private deviceId = 'deviceId';

  // ????????????
  public changeOff = true;

  /**
   * @param $applicationService ??????????????????
   * @param $activatedRoute ??????????????????
   * @param $nzI18n  ???????????????
   * @param $router  ????????????
   * @param $message  ??????????????????
   * @param $ruleUtil  ????????????
   * @param $asyncRuleUtil  ????????????
   * @param $securityService ??????????????????
   * @param $websocketService websocket??????
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
        // ??????????????????
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
        // ????????????
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
            console.log('??????????????????' + msg);
          } else {
            onvifColumn.type = 'input';
            this.$message.info(this.language.securityWorkbench.notFoundEquipment);
          }
        } else if (resKey.some(key => key === 'rtspUrl')) {
          this.formStatus.group.controls['rtspAddr'].setValue(msg.rtspUrl);
          // rtsp url
          console.log('rtsp??????' + msg);
        }
        this.discoveryLoading = false;
      }
    });
  }

  /**
   * ????????????ONVIF??????
   */
  public selectedOnvifIp = (control: FormGroup, value: string) => {
    if (value) {
      const {onvifAccount, onvifPassword, channelId, rtspAddr} = this.formStatus.group.controls;
      if ((!onvifAccount.value || !onvifPassword.value || !channelId.value) && !rtspAddr.value) {
        this.$message.warning(this.language.securityWorkbench.tip);
        this.formStatus.group.controls['onvifIp'].setValue('');
        return;
      }
      // ????????????
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
   * ?????????????????????
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
   * ????????????
   */
  ngOnDestroy(): void {
    this.selectEquipment = null;
    this.equipmentStatusFilterTemp = null;
    this.radioTemp = null;
    this.deviceFilterTemplate = null;
  }


  /**
   * ??????form????????????
   * @param event ??????
   */
  public formInstance(event: { instance: FormOperate }): void {
    this.formStatus = event.instance;
    this.formStatus.group.controls['videoRetentionDays'].reset(0);
    // ????????????
    this.formStatus.group.statusChanges.subscribe(() => {
      this.isDisabled = this.formStatus.getRealValid();
    });
  }

  /**
   * ????????????
   */
  private initColumn() {
    return this.formColumn = [
      // ????????????
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
      // ?????????
      {
        label: this.language.securityWorkbench.channelNumber,
        key: 'channelId',
        type: 'input',
        require: true,
        labelWidth: 160,
        rule: [{required: true}, {max: 65535}, {min: 1}],
        asyncRules: [this.$asyncRuleUtil.mustInt()]
      },
      // ????????????
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
      // ????????????
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
      // ?????????????????????
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
      // ????????????ONVIF??????
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
      // ???????????????ONVIF??????
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
      // ?????????ip
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
      // ???????????????
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
      // ??????????????????
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
      // ???????????????
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
      // ??????ONVIF IP
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
      // ??????ONVIF port
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
      // ?????? ONVIF ?????????
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
      // ?????? ONVIF ??????
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
      // ???????????????RTSP??????
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
      // ??????????????????
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
      // ????????????
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
   * ??????????????????????????????
   */
  public selectedCameraType(value): void {
    this.isHidden = value === CameraAccessTypeEnum.rtsp;
    // ?????????????????? ???????????????
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
   * ????????????ONVIF??????
   */
  public selectedOnvifStatus = (control: FormGroup, value: string) => {
    if (Number(value) && _.isEmpty(this.equipmentId)) {
      this.$message.warning('???????????????');
      this.formStatus.group.controls['onvifStatus'].reset('0');
      this.onvifBtnStatus = true;
    } else if (Number(value) && this.equipmentId) {
      this.onvifBtnStatus = false;
    } else {
      this.onvifBtnStatus = true;
    }
  }


  /**
   * ??????????????????????????????
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
   * ????????????
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
    // ???????????????ID??????????????????
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
   * ??????
   */
  public onCancel(): void {
    window.history.go(-1);
  }

  /**
   * ????????????????????????
   */
  private getEquipmentData(): void {
    this.tableConfig.isLoading = true;
    this.queryCondition.filterConditions.push(new FilterCondition('equipmentType', OperatorEnum.in, [EquipmentTypeEnum.camera]));
    this.$applicationService.equipmentListByPage(this.queryCondition)
    // todo EquipmentListModel ???share moudel ????????????
      .subscribe((result: ResultModel<any[]>) => {
        if (result.code === ResultCodeEnum.success) {
          this.tableConfig.isLoading = false;
          this.dataSet = result.data;
          this.pageBean.Total = result.totalCount;
          this.pageBean.pageIndex = result.pageNum;
          this.pageBean.pageSize = result.size;
          this.dataSet.forEach(item => {
            // ??????????????????
            const style = CommonUtil.getEquipmentStatusIconClass(item.equipmentStatus, 'list');
            item.statusIconClass = style.iconClass;
            item.statusColorClass = style.colorClass;
            // ???????????????????????????
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
   * ?????????????????????
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
        { // ??????
          title: this.language.frequentlyUsed.select,
          type: 'render',
          renderTemplate: this.radioTemp,
          fixedStyle: {
            fixedLeft: true,
            style: {left: '0px'}
          },
          width: 62
        },
        // ??????
        {
          type: 'serial-number', width: 62, title: this.language.frequentlyUsed.serialNumber,
          fixedStyle: {fixedLeft: true, style: {left: '62px'}}
        },
        { // ????????????
          title: this.facilitiesLanguage.deviceCode,
          key: 'equipmentCode',
          width: 150,
          isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        { // ??????
          title: this.facilitiesLanguage.name,
          key: 'equipmentName',
          width: 180,
          searchable: true,
          isShowSort: true,
          searchConfig: {type: 'input'}
        },
        { // ??????
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
        { //  ??????
          title: this.facilitiesLanguage.model,
          key: 'equipmentModel',
          width: 150,
          isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        { // ????????????
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
        { // ????????????
          title: this.facilitiesLanguage.mountPosition,
          key: 'mountPosition',
          searchable: true,
          width: 150,
          isShowSort: true,
          searchConfig: {type: 'input'}
        },
        { // ?????????
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
        // ?????????????????????????????????????????????ID??????????????????
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
   * ???????????????
   */
  public showModal(): void {
    this.isVisible = true;
    this.initTableConfig();
    this.getEquipmentData();
    this.equipmentId = this.formStatus.group.getRawValue().equipmentId;
  }

  /**
   * ????????????
   */
  public onEquipmentChange(event: string, data: EquipmentListModel): void {
    this.equipmentData = {...data};
  }


  /**
   * ???????????????
   */
  public onHandleTableOk(): void {
    this.isVisible = false;
    this.equipmentId = this.equipmentData.equipmentId;
    this.equipmentName = this.equipmentData.equipmentName;
    // ?????????ID???????????????
    this.formStatus.group.controls['equipmentId'].reset(this.equipmentId);
  }

  /**
   * ???????????????
   */
  public onHandleTableCancel(): void {
    this.isVisible = false;
    this.equipmentData = null;
  }

  /**
   * ????????????
   * @param event ????????????
   */
  public pageChange(event: PageModel): void {
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
    this.getEquipmentData();
  }

  /**
   * ?????????????????????????????????
   */
  public onShowFacility(filterValue: FilterCondition): void {
    this.filterValue = filterValue;
    if (!this.filterValue.filterValue) {
      this.filterValue.filterValue = [];
    }
    this.facilityVisible = true;
  }

  /**
   * ??????????????????
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
   * ????????????
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
