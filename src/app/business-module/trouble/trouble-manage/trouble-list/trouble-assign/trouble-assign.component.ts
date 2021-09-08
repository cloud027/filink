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
 * 故障指派
 */
@Component({
  selector: 'app-trouble-assign',
  templateUrl: './trouble-assign.component.html',
  styleUrls: ['./trouble-assign.component.scss'],
})
export class TroubleAssignComponent implements OnInit, OnDestroy {
  // 责任单位
  @ViewChild('department') department: TemplateRef<any>;
  // 责任人
  @ViewChild('departNameTemp') departNameTemp: TemplateRef<any>;
  // 标题
  public pageTitle: string = '';
  // 告警国际化引用
  public language: FaultLanguageInterface;
  // 公共国际化
  public commonLanguage: CommonLanguageInterface;
  // 表格初始化
  public formColumn: FormItem[] = [];
  // 表单操作
  public formStatus: FormOperate;
  // 单位选择器配置信息
  public unitSelectorConfig: TreeSelectorConfigModel = new TreeSelectorConfigModel();
  // 责任人选择器配置信息
  public personSelectorConfig: TreeSelectorConfigModel = new TreeSelectorConfigModel();
  // 单位弹窗展示
  public unitSelectVisible: boolean = false;
  // 单位名称
  public assignDeptName: string = '';
  // 单位code
  private assignDeptCode: string = '';
  // 责任人弹窗展示
  public isPersonVisible: boolean = false;
  // 责任人
  public assignUserName: string = '';
  // 责任单位可选
  public isDisable: boolean = false;
  // 责任人可选
  public isPersonDisable: boolean = true;
  public ifSpin: boolean = false;
  // 提交loading
  public sureLoading: boolean = false;
  // 区域code
  public areaCode: string;
  // 指派原因/驳回原因
  public troubleRepulseReason: string;
  // 是否展示责任单位
  public isAssignShowUnit: string;
  // 单位选择节点
  private areaNodes: NzTreeNode[] = [];
  // 详情id
  private troubleId: string;
  // 是否为故障驳回
  private isTroubleRepulse: boolean = false;
  private assignData: any = [];
  // 流程节点
  private flowId: string;
  // 确认按钮状态
  public isSubmit: boolean = true;
  // 故障状态
  private handleStatus: string;
  // 流程实例id
  private instanceId: string;
  // 流程节点名称
  private currentHandleProgress: string;
  // 用户信息
  private userInfo: OrderUserModel;
  // 用户id
  private userId: string = '';
  // 指派类型
  private assignType: string = '';
  // 指派原因
  private assignReason: string = '';
  // 其他原因
  private otherReason: string = '';
  // 责任人选择节点
  private treeNodes: NzTreeNode[] = [];
  // 责任单位选择器
  private selectorData: AccountabilityUnitModel = new AccountabilityUnitModel();
  // 责任人选择器
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
   * 初始化
   */
  public ngOnInit(): void {
    this.pageTitle = this.language.troubleDesignate;
    this.troubleRepulseReason = this.language.designateReason;
    this.$active.queryParams.subscribe(params => {
      this.troubleId = params.id;
      this.handleStatus = params.handleStatus;
      this.areaCode = params.areaCode;
      // 是否展示责任
      this.isAssignShowUnit = params.isAssignShowUnit;
    });
    // 获取用户信息
    if (SessionUtil.getToken()) {
      this.userInfo = SessionUtil.getUserInfo();
      this.userId = this.userInfo.id;
    }
    // 获取告警单条数据
    this.getTroubleInfo();
    this.initForm();
  }

  /**
   * 销毁
   */
  public ngOnDestroy(): void {
    this.department = null;
    this.departNameTemp = null;
  }

  /**
   * 查询单条数据
   */
  public getTroubleInfo(): void {
    this.ifSpin = true;
    const troubleIds = this.troubleId.split(',');
    // 单个指派且是未提交状态以及来源不是告警非告警回显责任单位信息
      this.$troubleCommonService.queryTroubleDetail(troubleIds[0]).subscribe((res: Result) => {
        if (res.code === ResultCodeEnum.success) {
          const data = res.data;
          if (this.handleStatus === HandleStatusEnum.uncommit) {
            // 根据流程节点获取责任单位  节点5和节点8获取同级及上级单位
            this.getDepartment(this.flowId);
            // 未提交并且来源不是告警回显责任单位数据
            if (data.troubleSource !== PageTypeEnum.alarm && (this.isAssignShowUnit === IsShowUintEnum.yes)) {
              this.assignDeptName = data.deptName;
              this.assignDeptCode = data.deptCode;
              if (data.areaCode) {
                this.queryDeptList(data.areaCode).then(() => {
                  // 递归设置单位的选择情况
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
   * 根据节点获取单位数据
   */
  public getDepartment(flowId: string): void {
    if (flowId === TROUBLE_FLOW.five || flowId === TROUBLE_FLOW.eight) {
      // 获取同级和上级
       this.superiorUnit();
    } else {
      // 获取同级和下级
      this.subordinateUnit();
    }
    this.ifSpin = false;
    this.assignData = this.getAssign(this.handleStatus, this.flowId);
    // 动态设置指派原因和指派类型下拉框的数据
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
   * 获取同级和上级单位
   */
  public superiorUnit(): void {
    // 获取同级单位和上级单位
    const params: UnitParamsModel = {
      userId: this.userId,
      areaCodes: this.areaCode.split(',')
    };
    this.$troubleService.getSuperiorDepartment(params).subscribe((data: ResultModel<NzTreeNode[]>) => {
      this.areaNodes = data.data || [];
      // 初始化责任单位
      this.initAreaSelectorConfig();
    });
  }

  /**
   * 获取同级和下级
   */
  public subordinateUnit(): void {
    this.queryDeptList(this.areaCode).then(() => {
      // 初始化责任单位
      this.initAreaSelectorConfig();
    });
  }

  /**
   * 获取责任人数据
   */
  public getDutyData(id: string): void {
    // 单位id
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
   * 获取单位下所有的人
   */
  public getPerson(id: string[]): void {
    this.isPersonDisable = true;
    this.$troubleService.queryPerson(id).subscribe((res: ResultModel<NzTreeNode[]>) => {
      if (res.code === 0) {
        this.isPersonDisable = false;
          this.treeNodes = res.data || [];
          // 初始化责任人
          this.initTreeSelectorConfig();
      }
    });
  }

  /**
   * 根据流程展示对应的指派类型
   * @param flowId:流程节点 handleStatus: 故障状态
   */
  public getAssign(handleStatus: string, flowId: string) {
    // 故障状态
    const assignData = TroubleCommonUtil.getDesignateType(this.$nzI18n);
    const assignReasonData = TroubleCommonUtil.getDesignateReason(this.$nzI18n);
    const assignList = {
      assignTypeList: [],
      assignReasonList: []
    };
    if (typeof assignData !== 'string') {
      // 根据不同的流程节点展示对应的指派类型
      assignList.assignTypeList = assignData.filter(item => {
        // 未提交状态
        if (handleStatus === HandleStatusEnum.uncommit) {
          return item.code === DesignateTypeEnum.initial;
        } else if (handleStatus === HandleStatusEnum.processing) {
          // 处理中状态
          switch (flowId) {
            case TROUBLE_FLOW.five:
              // 状态处理中且节点为5
              return item.code === DesignateTypeEnum.duty || item.code === DesignateTypeEnum.reportResponsibleLeaders ||
                item.code === DesignateTypeEnum.troubleRepulse;
            case TROUBLE_FLOW.seven:
              // 状态处理中且节点为7
              return item.code === DesignateTypeEnum.coordinateSuccessful || item.code === DesignateTypeEnum.coordinateFail;
            case TROUBLE_FLOW.eight:
              // 状态处理中且节点为8
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
   * 打开单位选择器
   */
  public showAreaSelectorModal(): void {
    this.unitSelectorConfig.treeNodes = this.areaNodes;
    this.unitSelectVisible = true;
  }

  /**
   * 指派
   */
  public initForm(): void {
    this.formColumn = [
      {
        // 指派类型
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
          // 故障类型控制责任单位
          if (event === DesignateTypeEnum.coordinateFail) {
             this.superiorUnit();
          } else if (event === DesignateTypeEnum.coordinateSuccessful) {
            this.subordinateUnit();
          }
          this.assignType = event;
        }
      },
      {
        // 责任单位
        label: this.language.responsibleUnit,
        key: 'assignDeptId',
        type: 'custom',
        require: true,
        rule: [],
        asyncRules: [],
        template: this.department
      },
      { // 责任人
        label: this.language.person,
        key: 'assignUserId',
        type: 'custom',
        require: true,
        rule: [],
        asyncRules: [],
        template: this.departNameTemp
      },
      { // 指派原因
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
      }, { // 其他
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
   * 单位选中结果
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
      // 获取责任人
      this.getDutyData(this.selectorData.parentId);
      // 获取单位下所有人
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
   * 责任人选中结果
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
   * 指派
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
     // 批量指派
     urlPath = TROUBLE_ASSIGN.batch;
   } else {
     // 单个指派
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
   * 表单初始化
   */
  public formInstance(event: { instance: FormOperate }): void {
    this.formStatus = event.instance;
    this.formStatus.group.valueChanges.subscribe((params) => {
      this.isSubmit = this.confirmButtonIsGray(params);
    });
  }

  /**
   * 取消
   */
  public cancel(): void {
    window.history.back();
  }

  /**
   * 表单提交按钮检查
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
   * 控制表单某个展示或隐藏
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
   * 控制表单某个展示或隐藏
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
   * 责任人选择框
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
   * 初始化单位选择器配置
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
   * 初始化责任人选择器配置
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
   * 查询责任单位
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
