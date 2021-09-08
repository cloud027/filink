import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NzI18nService, NzTreeNode} from 'ng-zorro-antd';
import * as _ from 'lodash';
import {OperateTypeEnum} from '../../../../../shared-module/enum/page-operate-type.enum';
import {CommonLanguageInterface} from '../../../../../../assets/i18n/common/common.language.interface';
import {ScheduleLanguageInterface} from '../../../../../../assets/i18n/schedule/schedule.language.interface';
import {FormItem} from '../../../../../shared-module/component/form/form-config';
import {FormOperate} from '../../../../../shared-module/component/form/form-operate.service';
import {FiLinkModalService} from '../../../../../shared-module/service/filink-modal/filink-modal.service';
import {RuleUtil} from '../../../../../shared-module/util/rule-util';
import {ScheduleApiService} from '../../../share/service/schedule-api.service';
import {LanguageEnum} from '../../../../../shared-module/enum/language.enum';
import {ResultCodeEnum} from '../../../../../shared-module/enum/result-code.enum';
import {DepartmentUnitModel} from 'src/app/core-module/model/work-order/department-unit.model';
import {UserForCommonUtil} from 'src/app/core-module/business-util/user/user-for-common.util';
import {ResultModel} from '../../../../../shared-module/model/result.model';
import {UserForCommonService} from '../../../../../core-module/api-service';
import {TreeSelectorConfigModel} from '../../../../../shared-module/model/tree-selector-config.model';
import {PersonInfoModel} from '../../../share/model/person-info.model';
import {JobStatusEnum} from '../../../share/enum/job-status.enum';
import {TableConfigModel} from '../../../../../shared-module/model/table-config.model';
import {PersonInfoConfig} from '../../../share/config/person-info-config';
import {TeamManageListModel} from '../../../share/model/team-manage-list.model';
import {SortCondition} from '../../../../../shared-module/model/query-condition.model';
import {TableSortConfig} from '../../../../../shared-module/enum/table-style-config.enum';

/**
 * 班组管理新增和编辑页面
 */
@Component({
  selector: 'app-team-management-detail',
  templateUrl: './team-management-detail.component.html',
  styleUrls: ['./team-management-detail.component.scss']
})
export class TeamManagementDetailComponent implements OnInit {
  // 新增编辑班组信息的表单中选择单位的模板
  @ViewChild('department') departmentTep;
  // 班组成员列表中在职状态模板
  @ViewChild('jobStatusTemp') jobStatusTemp;
  // 页面标题
  public pageTitle: string = '';
  // 页面类型
  public pageType: string = OperateTypeEnum.add;
  // 页面类型枚举
  public operateTypeEnum = OperateTypeEnum;
  // 公共国际化
  public commonLanguage: CommonLanguageInterface;
  // 国际化
  public scheduleLanguage: ScheduleLanguageInterface;
  // 表单配置
  public formColumn: FormItem[] = [];
  // 按钮loading
  public isLoading: boolean = false;
  // 按钮禁用
  public isDisabled: boolean = true;
  // 单位名称
  public deptName: string = '';
  // 选中的单位id
  public selectDeptId: string = '';
  // 控制单位列表弹框显示
  public areaSelectVisible: boolean = false;
  // 单位选择器配置
  public areaSelectorConfig = new TreeSelectorConfigModel();
  // 选择的班组成员列表数据
  public selectPersonDataSet: PersonInfoModel[] = [];
  // 选中的班组成员列表配置
  public selectTableConfig: TableConfigModel = new TableConfigModel();
  // 选择的班组成员id集合
  public selectTeamMemberIds: string[] = [];
  // 选择的班组成员id集合备份 用于编辑页面筛选删除了的成员
  public selectTeamMemberIdsBackup: string[] = [];
  // 在职状态枚举
  public jobStatusEnum = JobStatusEnum;
  // 是否展示选择班组成员的弹框
  public isShowPersonModal: boolean = false;
  // 表单操作实现类
  public formStatus: FormOperate;
  // 班组id
  public teamId: string = '';
  // 单位树数据
  private unitTreeNodes: any = [];

  constructor(public $nzI18n: NzI18nService,
              public $message: FiLinkModalService,
              private $router: Router,
              private $active: ActivatedRoute,
              private $ruleUtil: RuleUtil,
              private $scheduleService: ScheduleApiService,
              private $userForCommonService: UserForCommonService) {
  }

  /**
   * 初始化
   */
  public ngOnInit(): void {
    this.scheduleLanguage = this.$nzI18n.getLocaleData(LanguageEnum.schedule);
    this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
    this.getPage();
    this.initForm();
    this.initPersonSelectTable();
    // 初始化单位选择器配置
    this.initAreaSelectorConfig(this.unitTreeNodes);
  }

  /**
   * 获取表单实例对象
   */
  public formInit(event: { instance: FormOperate }): void {
    this.formStatus = event.instance;
    this.formStatus.group.statusChanges.subscribe(() => {
      this.isDisabled = !this.formStatus.getRealValid();
    });
  }

  /**
   * 提交
   */
  public submit(): void {
    // 获取表单数据
    const data = this.formStatus.group.getRawValue();
    data.personIdList = this.selectTeamMemberIds;
    data.id = this.teamId;
    this.isLoading = true;
    this.$scheduleService.saveMaintenanceTeamInfo(data).subscribe((res) => {
      this.isLoading = false;
      if (res.code === ResultCodeEnum.success) {
        const msgTip = this.teamId ? this.scheduleLanguage.updateTeamSuccess : this.scheduleLanguage.addTeamSuccess;
        this.$message.success(msgTip);
        this.goBack();
      } else {
        this.$message.error(res.msg);
      }
    }, () => this.isLoading = false);
  }

  /**
   * 跳转到列表
   */
  public goBack(): void {
    this.$router.navigate(['/business/schedule/team-management']).then();
  }

  /**
   * 选择班组成员确定事件
   */
  public handlePersonOk(members: PersonInfoModel[]): void {
    // 如果选择的人员是离职状态，则不能选择
    if (members.some(item => item.onJobStatus === JobStatusEnum.resign)) {
      this.$message.info(this.scheduleLanguage.selectTeamMemberResignTip);
      return;
    }
    const selectIds = members.map(item => item.id);
    // 将编辑页面选择的成员和本次选择的成员id比较，剔除编辑页面选择的成员id集合中存在的本次选择的id集合，则剩余本次选择后删除的人员id
    const delIds = _.difference(this.selectTeamMemberIdsBackup, selectIds);
    this.checkPersonHasScheduling(delIds, this.scheduleLanguage.selectTeamMemberTip).then(res => {
      this.selectPersonDataSet = members.map(item => {
        item.checked = false;
        return item;
      });
      this.selectTeamMemberIds = selectIds;
      this.isShowPersonModal = false;
    });
  }

  /**
   * 打开单位选择器
   */
  public showDeptSelectorModal(): void {
    this.areaSelectorConfig.treeNodes = this.unitTreeNodes;
    this.areaSelectVisible = true;
  }

  /**
   * 单位选中结果
   */
  public deptSelectChange(event: DepartmentUnitModel[]): void {
    if (event[0]) {
      UserForCommonUtil.setAreaNodesStatus(this.unitTreeNodes, event[0].id);
      // 重新选择单位后，下面的班组成员数据会被清空
      if (this.deptName !== event[0].deptName) {
          this.selectPersonDataSet = [];
      }
      this.selectDeptId = event[0].id;
      this.deptName = event[0].deptName;
      this.formStatus.resetControlData('deptCode', event[0].deptCode);
    } else {
      UserForCommonUtil.setAreaNodesStatus(this.unitTreeNodes, null);
      this.deptName = '';
      this.selectDeptId = '';
      this.formStatus.resetControlData('deptCode', null);
    }
  }

  /**
   * 获取单位数据信息
   */
  private queryUnitInfo(): void {
    this.$userForCommonService.queryTotalDept().subscribe((result: ResultModel<any>) => {
      this.unitTreeNodes = result.data || [];
      // 编辑时回显选择的单位
      if (this.formStatus.getData('deptCode')) {
        UserForCommonUtil.setAreaNodesStatus(this.unitTreeNodes, this.selectDeptId);
      }
      this.areaSelectorConfig.treeNodes = this.unitTreeNodes;
    });
  }

  /**
   * 删除选择的人员
   * param ids
   */
  private handleDeletePerson(ids: string[], isBatchDel: boolean): void {
    const msgTip = isBatchDel ? this.scheduleLanguage.batchDelTeamMemberTip : this.scheduleLanguage.singelDelTeamMemberTip;
    // 过滤出编辑页面删除的初始化时选择的人员 将这些人员进行是否排班的校验 其他不是编辑页面初始化选择的成员不需要做排班校验
    // 新增时 selectTeamMemberIdsBackup 为空，则checkIds也为空，新增时选择的成员也不需做排班校验
    const checkIds = this.selectTeamMemberIdsBackup.filter(id => ids.includes(id));
    this.checkPersonHasScheduling(checkIds, msgTip).then(res => {
      this.selectPersonDataSet = this.selectPersonDataSet.filter(item => !ids.includes(item.id));
      this.selectTeamMemberIds = this.selectPersonDataSet.map(item => item.id);
    });
  }

  /**
   * 判断要删除的成员是否在排班中
   */
  private checkPersonHasScheduling(ids: string[], msg: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
      if (ids && ids.length) {
        this.$scheduleService.checkScheduling(ids).subscribe(res => {
          if (res.code === ResultCodeEnum.success) {
            if (res.data) {
              this.$message.confirm(msg, () => resolve(ids));
            } else {
              resolve(ids);
            }
          } else {
            this.$message.error(res.msg);
          }
        });
      } else {
        resolve(ids);
      }
    });
  }

  /**
   * 初始化单位选择器配置
   */
  private initAreaSelectorConfig(nodes: NzTreeNode[]): void {
    this.areaSelectorConfig = {
      width: '500px',
      height: '300px',
      title: this.scheduleLanguage.unitSelect,
      treeSetting: {
        check: {
          enable: true,
          chkStyle: 'radio',
          radioType: 'all'
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
      treeNodes: nodes
    };
  }

  /**
   * 初始化已选择的班组成员列表信息
   */
  private initPersonSelectTable(): void {
    this.selectTableConfig = {
      isDraggable: true,
      isLoading: false,
      noAutoHeight: true,
      scroll: {x: '1200px', y: '400px'},
      noIndex: true,
      notShowPrint: true,
      columnConfig: PersonInfoConfig.personColumnConfig(this.commonLanguage, this.scheduleLanguage, this.jobStatusTemp),
      topButtons: [
        {
          // 新增
          text: this.scheduleLanguage.add,
          iconClassName: 'fiLink-add-no-circle',
          // permissionCode: '17-1-1',
          handle: () => {
            if (!this.deptName) {
              this.$message.info(this.scheduleLanguage.selectUnitFirst);
              return;
            }
            this.isShowPersonModal = true;
          }
        },
        {
          // 批量删除
          text: this.commonLanguage.deleteBtn,
          btnType: 'danger',
          needConfirm: true,
          canDisabled: true,
          // permissionCode: '17-1-3',
          className: 'table-top-delete-btn',
          iconClassName: 'fiLink-delete',
          handle: (data: PersonInfoModel[]) => {
            const delIds = data.map(item => item.id);
            this.handleDeletePerson(delIds, true);
          }
        }
      ],
      operation: [
        {
          // 单个删除
          text: this.commonLanguage.deleteBtn,
          className: 'fiLink-delete red-icon',
          // permissionCode: '17-1-3',
          btnType: 'danger',
          iconClassName: 'fiLink-delete',
          needConfirm: true,
          canDisabled: true,
          handle: (data: PersonInfoModel) => {
            this.handleDeletePerson([data.id], false);
          }
        },
      ],
      sort: (event: SortCondition) => {
        let temp = [];
        if (event && Object.keys(event).length) {
          temp = _.sortBy(this.selectPersonDataSet, event.sortField);
          if (event.sortRule === TableSortConfig.DESC) {
            temp.reverse();
          }
        } else {
          // 没有排序时就还原成之前的数组
          temp = this.selectPersonDataSet;
        }
        this.selectPersonDataSet = [...temp];
      }
    };
  }

  /**
   * 初始化表单
   */
  private initForm(): void {
    this.formColumn = [
      {
        // 单位
        label: this.scheduleLanguage.unit,
        key: 'deptCode',
        require: true,
        type: 'custom',
        rule: [{required: true}],
        template: this.departmentTep,
        width: 350
      },
      {
        // 班组名称
        label: this.scheduleLanguage.teamName,
        key: 'teamName',
        require: true,
        type: 'input',
        rule: [{required: true}, RuleUtil.getNameMinLengthRule(), RuleUtil.getNameMaxLengthRule(),
          RuleUtil.getAlarmNamePatternRule(this.commonLanguage.nameCodeMsg)
        ],
        customRules: [this.$ruleUtil.getNameCustomRule()],
        asyncRules: [
          // 调用接口异步校验名称唯一性
          this.$ruleUtil.getNameAsyncRule(value => this.$scheduleService.checkTeamName({teamName: value, id: this.teamId}),
            res => res.code === ResultCodeEnum.success && !res.data)
        ],
      },
      {
        // 备注
        label: this.scheduleLanguage.remark,
        key: 'remark',
        type: 'textarea',
        rule: [this.$ruleUtil.getRemarkMaxLengthRule()]
      }
    ];
  }

  /**
   * 获取页面显示
   */
  private getPage(): void {
    // 获取页面操作类型及标题
    this.pageType = this.$active.snapshot.params.type;
    this.pageTitle = this.pageType === OperateTypeEnum.update ? this.scheduleLanguage.updateTeam : this.scheduleLanguage.addTeam;
    if (this.pageType === OperateTypeEnum.update) {
      this.$active.queryParams.subscribe(params => {
        this.teamId = params.id;
        // 编辑数据回显
        // 编辑时需先获取到选择的单位id,然后调用单位查询接口，获取到所有的单位进行回显
        this.queryListTeamById();
      });
    } else {
      this.queryUnitInfo();
    }
  }

  /**
   * 编辑数据回显
   */
  private queryListTeamById(): void {
    // 通过id查询班次信息进行回显
    this.$scheduleService.queryListTeamById(this.teamId).subscribe((res: ResultModel<TeamManageListModel>) => {
      if (res.code === ResultCodeEnum.success) {
        if (res.data) {
          this.queryUnitInfo();
          this.formStatus.group.reset(res.data);
          this.deptName = res.data.deptName;
          this.selectDeptId = res.data.deptId;
          this.selectPersonDataSet = res.data.personInformationVOList;
          this.selectTeamMemberIds = this.selectPersonDataSet.map(item => item.id);
          this.selectTeamMemberIdsBackup = [...this.selectTeamMemberIds];
        }
      }
    });
  }
}
