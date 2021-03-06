import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FormOperate} from '../../../../../shared-module/component/form/form-operate.service';
import { FaultLanguageInterface } from '../../../../../../assets/i18n/fault/fault-language.interface';
import {NzI18nService, NzTreeNode} from 'ng-zorro-antd';
import {FormItem} from '../../../../../shared-module/component/form/form-config';
import {TroubleCommonUtil} from '../../../share/util/trouble-common-util';
import {TreeSelectorConfigModel} from '../../../../../shared-module/model/tree-selector-config.model';
import {ActivatedRoute, Router} from '@angular/router';
import {FiLinkModalService} from '../../../../../shared-module/service/filink-modal/filink-modal.service';
import {SessionUtil} from '../../../../../shared-module/util/session-util';
import {TroubleService} from '../../../share/service';
import {ResultModel} from '../../../../../shared-module/model/result.model';
import {TROUBLE_FLOW} from '../../../share/const/trouble-process.const';
import {DepartModel} from '../../../share/model/depart.model';
import { AccountabilityUnitModel } from '../../../../../core-module/model/trouble/accountability-unit.model';
import {LanguageEnum} from '../../../../../shared-module/enum/language.enum';
import {OrderUserModel} from '../../../../../core-module/model/work-order/order-user.model';
import {AssignFormModel} from '../../../share/model/assign-form.model';
import {TroubleUtil} from '../../../../../core-module/business-util/trouble/trouble-util';
import {DesignateReasonEnum, IsShowUintEnum, DesignateTypeEnum} from '../../../share/enum/trouble.enum';
import {HandleStatusEnum} from '../../../../../core-module/enum/trouble/trouble-common.enum';
import {ResultCodeEnum} from '../../../../../shared-module/enum/result-code.enum';
import {RuleUtil} from '../../../../../shared-module/util/rule-util';
import {CommonLanguageInterface} from '../../../../../../assets/i18n/common/common.language.interface';
import {AreaDeviceParamModel} from '../../../../../core-module/model/work-order/area-device-param.model';
import {Result} from '../../../../../shared-module/entity/result';
import {UnitParamsModel} from '../../../../../core-module/model/unit-params.model';
import {TROUBLE_ASSIGN} from '../../../share/const/trouble-path.const';
import {TroubleForCommonService} from '../../../../../core-module/api-service/trouble';
import {UserForCommonUtil} from '../../../../../core-module/business-util/user/user-for-common.util';
import {FacilityForCommonService} from '../../../../../core-module/api-service/facility';
import {FacilityForCommonUtil} from '../../../../../core-module/business-util/facility/facility-for-common.util';
import {PageTypeEnum} from '../../../../../core-module/enum/alarm/alarm-page-type.enum';
import * as _ from 'lodash';
/**
 * ????????????
 */
@Component({
  selector: 'app-trouble-assign',
  templateUrl: './trouble-assign.component.html',
  styleUrls: ['./trouble-assign.component.scss'],
})
export class TroubleAssignComponent implements OnInit, OnDestroy {
  // ????????????
  @ViewChild('department') department: TemplateRef<any>;
  // ?????????
  @ViewChild('departNameTemp') departNameTemp: TemplateRef<any>;
  // ??????
  public pageTitle: string = '';
  // ?????????????????????
  public language: FaultLanguageInterface;
  // ???????????????
  public commonLanguage: CommonLanguageInterface;
  // ???????????????
  public formColumn: FormItem[] = [];
  // ????????????
  public formStatus: FormOperate;
  // ???????????????????????????
  public unitSelectorConfig: TreeSelectorConfigModel = new TreeSelectorConfigModel();
  // ??????????????????????????????
  public personSelectorConfig: TreeSelectorConfigModel = new TreeSelectorConfigModel();
  // ??????????????????
  public unitSelectVisible: boolean = false;
  // ????????????
  public assignDeptName: string = '';
  // ??????code
  private assignDeptCode: string = '';
  // ?????????????????????
  public isPersonVisible: boolean = false;
  // ?????????
  public assignUserName: string = '';
  // ??????????????????
  public isDisable: boolean = false;
  // ???????????????
  public isPersonDisable: boolean = true;
  public ifSpin: boolean = false;
  // ??????loading
  public sureLoading: boolean = false;
  // ??????code
  public areaCode: string;
  // ????????????/????????????
  public troubleRepulseReason: string;
  // ????????????????????????
  public isAssignShowUnit: string;
  // ??????????????????
  private areaNodes: NzTreeNode[] = [];
  // ??????id
  private troubleId: string;
  // ?????????????????????
  private isTroubleRepulse: boolean = false;
  private assignData: any = [];
  // ????????????
  private flowId: string;
  // ??????????????????
  public isSubmit: boolean = true;
  // ????????????
  private handleStatus: string;
  // ????????????id
  private instanceId: string;
  // ??????????????????
  private currentHandleProgress: string;
  // ????????????
  private userInfo: OrderUserModel;
  // ??????id
  private userId: string = '';
  // ????????????
  private assignType: string = '';
  // ????????????
  private assignReason: string = '';
  // ????????????
  private otherReason: string = '';
  // ?????????????????????
  private treeNodes: NzTreeNode[] = [];
  // ?????????????????????
  private selectorData: AccountabilityUnitModel = new AccountabilityUnitModel();
  // ??????????????????
  private selectorPersonData: AccountabilityUnitModel = new AccountabilityUnitModel();
  constructor(
    private $nzI18n: NzI18nService,
    private $router: Router,
    private $active: ActivatedRoute,
    private $troubleService: TroubleService,
    private $troubleCommonService: TroubleForCommonService,
    private $message: FiLinkModalService,
    private $ruleUtil: RuleUtil,
    private $modalService: FiLinkModalService,
    private $facilityForCommonService: FacilityForCommonService,
  ) {
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.fault);
    this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
  }

  /**
   * ?????????
   */
  public ngOnInit(): void {
    this.pageTitle = this.language.troubleDesignate;
    this.troubleRepulseReason = this.language.designateReason;
    this.$active.queryParams.subscribe(params => {
      this.troubleId = params.id;
      this.handleStatus = params.handleStatus;
      this.areaCode = params.areaCode;
      // ??????????????????
      this.isAssignShowUnit = params.isAssignShowUnit;
    });
    // ??????????????????
    if (SessionUtil.getToken()) {
      this.userInfo = SessionUtil.getUserInfo();
      this.userId = this.userInfo.id;
    }
    // ????????????????????????
    this.getTroubleInfo();
    this.initForm();
  }

  /**
   * ??????
   */
  public ngOnDestroy(): void {
    this.department = null;
    this.departNameTemp = null;
  }

  /**
   * ??????????????????
   */
  public getTroubleInfo(): void {
    this.ifSpin = true;
    const troubleIds = this.troubleId.split(',');
    // ??????????????????????????????????????????????????????????????????????????????????????????
      this.$troubleCommonService.queryTroubleDetail(troubleIds[0]).subscribe((res: Result) => {
        if (res.code === ResultCodeEnum.success) {
          const data = res.data;
          if (this.handleStatus === HandleStatusEnum.uncommit) {
            // ????????????????????????????????????  ??????5?????????8???????????????????????????
            this.getDepartment(this.flowId);
            // ?????????????????????????????????????????????????????????
            if (data.troubleSource !== PageTypeEnum.alarm && (this.isAssignShowUnit === IsShowUintEnum.yes)) {
              this.assignDeptName = data.deptName;
              this.assignDeptCode = data.deptCode;
              if (data.areaCode) {
                this.queryDeptList(data.areaCode).then(() => {
                  // ?????????????????????????????????
                  FacilityForCommonUtil.setUnitNodesStatus(this.areaNodes, data.deptId);
                });
              }
              this.getPerson([data.deptCode]);
              this.isPersonDisable = false;
              this.formStatus.resetControlData('assignDeptId', data.deptId);
            }
          } else {
            this.flowId = data.progessNodeId;
            this.instanceId = data.instanceId;
            this.currentHandleProgress = data.currentHandleProgress;
            this.getDepartment(this.flowId);
          }
        }
      }, (error) => {
        this.ifSpin = false;
        this.$message.error(error.msg);
      });
  }

  /**
   * ??????????????????????????????
   */
  public getDepartment(flowId: string): void {
    if (flowId === TROUBLE_FLOW.five || flowId === TROUBLE_FLOW.eight) {
      // ?????????????????????
       this.superiorUnit();
    } else {
      // ?????????????????????
      this.subordinateUnit();
    }
    this.ifSpin = false;
    this.assignData = this.getAssign(this.handleStatus, this.flowId);
    // ?????????????????????????????????????????????????????????
    this.formColumn.forEach(item => {
      if (item.key === 'assignType' ) {
        item.selectInfo.data = this.assignData.assignTypeList;
      }
      if (item.key === 'assignReason' ) {
        item.selectInfo.data = this.assignData.assignTypeList;
      }
    });
  }

  /**
   * ???????????????????????????
   */
  public superiorUnit(): void {
    // ?????????????????????????????????
    const params: UnitParamsModel = {
      userId: this.userId,
      areaCodes: this.areaCode.split(',')
    };
    this.$troubleService.getSuperiorDepartment(params).subscribe((data: ResultModel<NzTreeNode[]>) => {
      this.areaNodes = data.data || [];
      // ?????????????????????
      this.initAreaSelectorConfig();
    });
  }

  /**
   * ?????????????????????
   */
  public subordinateUnit(): void {
    this.queryDeptList(this.areaCode).then(() => {
      // ?????????????????????
      this.initAreaSelectorConfig();
    });
  }

  /**
   * ?????????????????????
   */
  public getDutyData(id: string): void {
    // ??????id
    this.$troubleService.queryDepartName(id).subscribe((res: ResultModel<DepartModel>) => {
      if (res.code === 0) {
        const data = res.data;
        if (data.deptChargeUser) {
          this.assignUserName = data.deptChargeUser;
        }
        this.formStatus.resetControlData('assignUserId', data.deptChargeUserId);
      }
    });
  }

  /**
   * ???????????????????????????
   */
  public getPerson(id: string[]): void {
    this.isPersonDisable = true;
    this.$troubleService.queryPerson(id).subscribe((res: ResultModel<NzTreeNode[]>) => {
      if (res.code === 0) {
        this.isPersonDisable = false;
          this.treeNodes = res.data || [];
          // ??????????????????
          this.initTreeSelectorConfig();
      }
    });
  }

  /**
   * ???????????????????????????????????????
   * @param flowId:???????????? handleStatus: ????????????
   */
  public getAssign(handleStatus: string, flowId: string) {
    // ????????????
    const assignData = TroubleCommonUtil.getDesignateType(this.$nzI18n);
    const assignReasonData = TroubleCommonUtil.getDesignateReason(this.$nzI18n);
    const assignList = {
      assignTypeList: [],
      assignReasonList: []
    };
    if (typeof assignData !== 'string') {
      // ??????????????????????????????????????????????????????
      assignList.assignTypeList = assignData.filter(item => {
        // ???????????????
        if (handleStatus === HandleStatusEnum.uncommit) {
          return item.code === DesignateTypeEnum.initial;
        } else if (handleStatus === HandleStatusEnum.processing) {
          // ???????????????
          switch (flowId) {
            case TROUBLE_FLOW.five:
              // ???????????????????????????5
              return item.code === DesignateTypeEnum.duty || item.code === DesignateTypeEnum.reportResponsibleLeaders ||
                item.code === DesignateTypeEnum.troubleRepulse;
            case TROUBLE_FLOW.seven:
              // ???????????????????????????7
              return item.code === DesignateTypeEnum.coordinateSuccessful || item.code === DesignateTypeEnum.coordinateFail;
            case TROUBLE_FLOW.eight:
              // ???????????????????????????8
              return item.code === DesignateTypeEnum.reportResponsibleLeaders || item.code === DesignateTypeEnum.troubleRepulse;
            default:
              return item.code === DesignateTypeEnum.coordinateSuccessful || item.code === DesignateTypeEnum.coordinateFailConstraint;
          }
        } else {
          return item.code !== DesignateTypeEnum.initial;
        }
      });
      if (typeof assignReasonData !== 'string') {
        if (this.isTroubleRepulse) {
          assignList.assignReasonList = assignReasonData.filter(item => item.code === DesignateReasonEnum.other);
        } else {
          assignList.assignReasonList = assignReasonData.filter(item => {
            if (handleStatus === HandleStatusEnum.uncommit) {
              return assignList.assignReasonList;
            } else {
              return item.code !== DesignateTypeEnum.initial;
            }
          });
        }
      }
    }
    return assignList;
  }

  /**
   * ?????????????????????
   */
  public showAreaSelectorModal(): void {
    this.unitSelectorConfig.treeNodes = this.areaNodes;
    this.unitSelectVisible = true;
  }

  /**
   * ??????
   */
  public initForm(): void {
    this.formColumn = [
      {
        // ????????????
        label: this.language.designateType,
        key: 'assignType',
        require: true,
        col: 20,
        type: 'select',
        selectInfo: {
          data: this.assignData.assignTypeList,
          label: 'label',
          value: 'code',
        },
        rule: [{required: true}],
        modelChange: (controls, event, key, formOperate) => {
          this.formStatus.group.controls['assignReason'].enable();
          this.isTroubleRepulse = event === DesignateTypeEnum.troubleRepulse;
          this.assignData = this.getAssign(this.handleStatus, this.flowId);
          this.setFormItemLabel(this.formColumn, 'assignReason');
          if (event === DesignateTypeEnum.initial) {
            this.isTroubleRepulse = false;
            this.isDisable = false;
            this.formColumn.forEach(item => {
              item.require = true;
            });
          } else if (event === DesignateTypeEnum.troubleRepulse) {
            this.isDisable = true;
            this.formStatus.resetControlData('assignReason', DesignateTypeEnum.troubleRepulse);
            this.formColumn.forEach(item => {
              if (item.key === 'assignDeptId' || item.key === 'assignUserId') {
                  item.require = false;
                  this.isPersonDisable = true;
              }
            });
            this.assignDeptName = this.userInfo['department'].deptName;
            this.assignDeptCode = this.userInfo['department'].deptCode;
            this.formStatus.resetControlData('assignDeptId', this.userInfo['department'].id);
            this.assignUserName = this.userInfo.userName;
            this.formStatus.resetControlData('assignUserId', this.userInfo.id);
          } else {
            this.isTroubleRepulse = false;
            this.isDisable = false;
            this.formStatus.resetControlData('assignReason', '');
            this.formColumn.forEach(item => {
                item.require = true;
            });
            this.assignDeptName = '';
            this.assignDeptCode = '';
            this.formStatus.resetControlData('assignDeptId', '');
            this.assignUserName = '';
            this.formStatus.resetControlData('assignUserId', '');
            this.isPersonDisable = false;
          }
          // ??????????????????????????????
          if (event === DesignateTypeEnum.coordinateFail) {
             this.superiorUnit();
          } else if (event === DesignateTypeEnum.coordinateSuccessful) {
            this.subordinateUnit();
          }
          this.assignType = event;
        }
      },
      {
        // ????????????
        label: this.language.responsibleUnit,
        key: 'assignDeptId',
        type: 'custom',
        require: true,
        rule: [],
        asyncRules: [],
        template: this.department
      },
      { // ?????????
        label: this.language.person,
        key: 'assignUserId',
        type: 'custom',
        require: true,
        rule: [],
        asyncRules: [],
        template: this.departNameTemp
      },
      { // ????????????
        label: this.language.designateReason,
        key: 'assignReason',
        require: true,
        disabled: true,
        col: 18,
        type: 'select',
        selectInfo: {
          data:  this.assignData.assignReasonList,
          label: 'label',
          value: 'code',
        },
        rule: [{required: true}],
        modelChange: (controls, event, key, formOperate) => {
          if (event === DesignateReasonEnum.other) {
              this.setFormItem(this.formColumn, 'otherReason', false);
          } else {
            this.setFormItem(this.formColumn, 'otherReason', true);
          }
          this.assignReason = event;
        }
      }, { // ??????
        label: this.language.otherReason, key: 'otherReason',
        type: 'input',
        require: true,
        col: 24,
        hidden: false,
        modelChange: (controls, $event, key, formOperate) => {
          this.otherReason = $event;
        },
        openChange: (a, b, c) => {
        },
        rule: [
          {required: true},
          this.$ruleUtil.getRemarkMaxLengthRule(),
          this.$ruleUtil.getNameRule()
        ],
        customRules: [this.$ruleUtil.getNameCustomRule()],
      }
    ];
    this.setFormItem(this.formColumn, 'otherReason', true);
  }

  /**
   * ??????????????????
   * param event
   */
  public unitSelectChange(event: DepartModel): void {
    this.assignUserName = '';
    this.selectorPersonData.parentId = null;
    if (event[0]) {
      UserForCommonUtil.setAreaNodesStatus(this.areaNodes, event[0].id);
      this.assignDeptName = event[0].deptName;
      this.assignDeptCode = event[0].deptCode;
      this.selectorData.parentId = event[0].id;
      this.formStatus.resetControlData('assignDeptId', event[0].id);
      // ???????????????
      this.getDutyData(this.selectorData.parentId);
      // ????????????????????????
      this.getPerson([this.assignDeptCode]);
    } else {
      UserForCommonUtil.setAreaNodesStatus(this.areaNodes, null);
      this.assignDeptName = '';
      this.assignDeptCode = '';
      this.selectorData.parentId = null;
      this.formStatus.resetControlData('assignDeptId', null);
    }
  }

  /**
   * ?????????????????????
   */
  public selectDataChange(event: DepartModel): void {
    if (event[0]) {
      UserForCommonUtil.setAreaNodesStatus(this.treeNodes, event[0].id);
      this.assignUserName = event[0].userName;
      this.selectorPersonData.parentId = event[0].id;
      this.formStatus.resetControlData('assignUserId', event[0].id);
    } else {
      UserForCommonUtil.setAreaNodesStatus(this.treeNodes, null);
      this.assignUserName = '';
      this.selectorPersonData.parentId = null;
      this.formStatus.resetControlData('assignUserId', null);
    }
  }

  /**
   * ??????
   */
  public submit(): void {
    let urlPath;
    this.sureLoading = true;
    const keepAssignData = _.assign({}, this.formStatus.getData());
    const assignData: AssignFormModel = keepAssignData;
    assignData.troubleId = this.troubleId;
    assignData.assignDeptName = this.assignDeptName;
    assignData.assignDeptCode = this.assignDeptCode;
    assignData.assignUserName = this.assignUserName;
    assignData.instanceId = this.instanceId;
    assignData.currentHandleProgress = this.currentHandleProgress;
    assignData.progessNodeId = this.flowId;
    if (assignData.assignReason === DesignateReasonEnum.other) {
      assignData.assignReason = assignData.otherReason;
    } else {
      assignData.assignReason = this.language.config[TroubleUtil.getColorName(assignData.assignReason, DesignateReasonEnum)];
    }
    const troubleIds =  this.troubleId.split(',');
   if (troubleIds.length > 1) {
     // ????????????
     urlPath = TROUBLE_ASSIGN.batch;
   } else {
     // ????????????
     urlPath = TROUBLE_ASSIGN.single;
   }
    this.$troubleService[urlPath](assignData).subscribe((res: ResultModel<string>) => {
      if (res.code === ResultCodeEnum.success) {
        this.sureLoading = false;
        this.$message.success(this.commonLanguage.assignSuccess);
        this.$router.navigate(['business/trouble/trouble-list']).then();
      } else {
        this.sureLoading = false;
        this.$message.error(res.msg);
      }
    }, error => {
      this.sureLoading = false;
    });
  }

  /**
   * ???????????????
   */
  public formInstance(event: { instance: FormOperate }): void {
    this.formStatus = event.instance;
    this.formStatus.group.valueChanges.subscribe((params) => {
      this.isSubmit = this.confirmButtonIsGray(params);
    });
  }

  /**
   * ??????
   */
  public cancel(): void {
    window.history.back();
  }

  /**
   * ????????????????????????
   */
  public confirmButtonIsGray(event: AssignFormModel): boolean {
    if (event.assignDeptId && event.assignType && event.assignUserId && event.assignReason) {
      event.otherReason = event.otherReason ? event.otherReason.trim() : null;
      if (event.assignReason !== DesignateReasonEnum.other ||
        (event.assignReason === DesignateReasonEnum.other && event.otherReason && event.otherReason.length <= 255)) {
        return false;
      }
    }
    return true;
  }

  /**
   * ?????????????????????????????????
   */
  public setFormItem(formList: FormItem[], key: string, type: boolean): void {
    if (formList && formList.length > 0) {
      formList.forEach(item => {
        if (item.key === key ) {
          item.hidden = type;
        }
      });
    }
  }

  /**
   * ?????????????????????????????????
   */
  public setFormItemLabel(formList: FormItem[], key: string): void {
    if (formList && formList.length > 0) {
      formList.forEach(item => {
        if (item.key === key ) {
          item.label = this.isTroubleRepulse ? this.language.repulseReason : this.language.designateReason;
          item.selectInfo.data = this.assignData.assignReasonList;
        }
      });
    }
  }

  /**
   * ??????????????????
   * param nodes
   */
  public showDutyNameSelectorModal(): void {
    if (this.assignDeptName === '') {
      this.isPersonVisible = false;
      this.personSelectorConfig.treeNodes = this.treeNodes;
      this.$modalService.info(this.language.pleaseSelectUnit);
    } else {
        this.personSelectorConfig.treeNodes = this.treeNodes;
        this.isPersonVisible = true;
    }
  }

  /**
   * ??????????????????????????????
   * param nodes
   */
  private initAreaSelectorConfig(): void {
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
  /**
   * ?????????????????????????????????
   */
  private initTreeSelectorConfig(): void {
    this.personSelectorConfig = {
      title: this.language.person,
      width: '500px',
      height: '300px',
      treeNodes: this.treeNodes,
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
            pIdKey: 'deptId',
            rootPid: null
          },
          key: {
            name: 'userName',
            children: 'childDepartmentList'
          },
        },
        view: {
          showIcon: false,
          showLine: false
        },
      },
      onlyLeaves: false,
    };
  }

  /**
   * ??????????????????
   */
  private queryDeptList(code: string): Promise<NzTreeNode[]> {
    return new Promise((resolve, reject) => {
      const param = new AreaDeviceParamModel();
      param.areaCodes = code.split(',');
      param.userId = this.userId;
      this.$facilityForCommonService.listDepartmentByAreaAndUserId(param).subscribe((result: ResultModel<NzTreeNode[]>) => {
        if (result.code === ResultCodeEnum.success) {
          const deptData = result.data || [];
          this.areaNodes = deptData;
          resolve(deptData);
        }
      });
    });
  }
}
