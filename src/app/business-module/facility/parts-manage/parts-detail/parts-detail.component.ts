import {Component, OnInit, ViewChild} from '@angular/core';
import {NzI18nService} from 'ng-zorro-antd';
import {PartsMgtApiService} from '../../share/service/parts/parts-api.service';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {UserForCommonService} from '../../../../core-module/api-service/user';
import {FacilityLanguageInterface} from '../../../../../assets/i18n/facility/facility.language.interface';
import {FormItem} from '../../../../shared-module/component/form/form-config';
import {FormOperate} from '../../../../shared-module/component/form/form-operate.service';
import {ActivatedRoute, Router} from '@angular/router';
import {TreeSelectorConfigModel} from '../../../../shared-module/model/tree-selector-config.model';
import {TreeSelectorComponent} from '../../../../shared-module/component/tree-selector/tree-selector.component';
import {RuleUtil} from '../../../../shared-module/util/rule-util';
import {FacilityForCommonUtil} from '../../../../core-module/business-util/facility/facility-for-common.util';
import {OperateTypeEnum} from '../../../../shared-module/enum/page-operate-type.enum';
import {LanguageEnum} from '../../../../shared-module/enum/language.enum';
import {ResultModel} from '../../../../shared-module/model/result.model';
import {ResultCodeEnum} from '../../../../shared-module/enum/result-code.enum';
import {PartsTypeEnum} from '../../share/enum/facility.enum';
import {CommonUtil} from '../../../../shared-module/util/common-util';
import {PartsInfoListModel} from '../../share/model/parts-info-list.model';
import {DepartmentUnitModel} from '../../../../core-module/model/work-order/department-unit.model';
import {SelectModel} from '../../../../shared-module/model/select.model';
import {UserListModel} from '../../../../core-module/model/user/user-list.model';


@Component({
  selector: 'app-parts-detail',
  templateUrl: './parts-detail.component.html',
  styleUrls: ['./parts-detail.component.scss']
})
export class PartsDetailsComponent implements OnInit {
  // 单位选择器模板
  @ViewChild('unitTreeSelector') private unitTreeSelector: TreeSelectorComponent;
  // 单位模板
  @ViewChild('department') private departmentTep;
  // 表单配置
  public formColumn: FormItem[] = [];
  // 表单状态
  public formStatus: FormOperate;
  // 设施语言包
  public language: FacilityLanguageInterface;
  // 区域选择器显示隐藏
  public areaSelectVisible: boolean = false;
  // 页面类型
  public pageType = OperateTypeEnum.add;
  // 页面标题
  public pageTitle: string;
  // 是否加载
  public isLoading: boolean = false;
  // 责任单位显示隐藏
  public isVisible: boolean = false;
  // 已选责任单位
  public selectUnitName: string = '';
  // 树选择器配置
  public treeSelectorConfig: TreeSelectorConfigModel;
  // 树设置 组件没有给类型
  public treeSetting: any;
  // 树数据
  public treeNodes: DepartmentUnitModel[] = [];
  // 责任人
  public resultPerson: SelectModel[] = [];
  // 配件id
  public partId: string = '';
  // 责任单位数据
  public ckkId: string[];
  // 按钮是否可操作
  public isDisabled: boolean = false;

  /**
   * 构造器
   */
  constructor(private $nzI18n: NzI18nService,
              private $active: ActivatedRoute,
              private $userService: UserForCommonService,
              private $partsService: PartsMgtApiService,
              private $message: FiLinkModalService,
              private $router: Router,
              private $ruleUtil: RuleUtil,
  ) {
  }

  /**
   * 初始化
   */
  public ngOnInit(): void {
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.facility);
    this.pageType = this.$active.snapshot.params.type;
    this.pageTitle = this.getPageTitle(this.pageType);
    this.initColumn();
    this.initTreeSelectorConfig();
    if (this.pageType !== OperateTypeEnum.add) {
      this.$active.queryParams.subscribe(params => {
        this.partId = params.partId;
        this.$partsService.queryPartsById(this.partId).subscribe((result: ResultModel<PartsInfoListModel>) => {
          this.ckkId = result.data.accountabilityUnit;
          this.selectUnitName = result.data.department;
          this.queryPersonList(result.data.accountabilityUnit);
          this.formStatus.resetData(result.data);
          this.queryDeptList().then(() => {
            FacilityForCommonUtil.setTreeNodesStatus(this.treeNodes, this.ckkId);
          });

        });
      });

    } else {
      this.queryDeptList();
    }
  }

  /**
   * 表单实例校验
   */
  public formInstance(event: { instance: FormOperate }): void {
    this.formStatus = event.instance;
    this.formStatus.group.controls['trustee'].disable();
    this.formStatus.group.statusChanges.subscribe(() => {
      this.isDisabled = (!this.formStatus.getValid()) || (!this.selectUnitName);
    });

  }

  /**
   * 打开责任单位选择器
   */
  public showModal(): void {
    this.treeSelectorConfig.treeNodes = this.treeNodes;
    this.isVisible = true;
  }

  /**
   * 责任单位选择结果
   * param event
   */

  public selectDataChange(event: DepartmentUnitModel[]): void {
    this.selectUnitName = '';
    const selectArr = event.map(item => {
      this.selectUnitName += `${item.deptName},`;
      return item.id;
    });
    this.selectUnitName = this.selectUnitName.substring(0, this.selectUnitName.length - 1);
    FacilityForCommonUtil.setTreeNodesStatus(this.treeNodes, selectArr);
    this.formStatus.resetControlData('accountabilityUnit', selectArr);
    this.queryPersonList(selectArr);
  }

  /**
   * 获取所有单位
   */
  public queryDeptList() {
    return new Promise((resolve, reject) => {
      this.$userService.queryAllDepartment().subscribe((result: ResultModel<DepartmentUnitModel[]>) => {
        this.treeNodes = result.data || [];
        resolve();
      });
    });
  }

  /**
   * 获取根据所属单位获取所属人
   */
  public queryPersonList(selectData: string[]): void {
    this.formColumn[3].selectInfo.data = [];
    this.formStatus.group.controls['trustee'].reset();
    this.formStatus.group.controls['trustee'].enable();
    this.$partsService.queryByDept({firstArrayParameter: selectData}).subscribe((result: ResultModel<UserListModel[]>) => {
      if (result.code === 0) {
        this.resultPerson = result.data.map(v => {
          return {
            label: v.userName,
            value: v.id,
            code: null,
          };
        });
        if (this.resultPerson.length === 0) {
          this.$message.warning(this.language.noDepositaryUnderResponsibleUnit);
        } else {
          this.formStatus.group.controls['trustee'].enable();
        }
        this.resultPerson = [...this.resultPerson];
        this.formColumn[3].selectInfo.data = this.resultPerson;
      } else {
        this.formColumn[3].selectInfo.data = [];
        this.formStatus.group.controls['trustee'].reset();
      }
    }, () => {
      this.formColumn[3].selectInfo.data = [];
      this.formStatus.group.controls['trustee'].reset();
    });
  }

  /**
   * 返回上一层
   */
  public goBack(): void {
    window.history.go(-1);
  }

  /**
   * 添加或修改配件
   */
  public addParts(): void {
    this.isLoading = true;
    let request;
    const data = this.formStatus.getData();
    if (this.pageType === OperateTypeEnum.add) {
      request =  this.$partsService.addParts(data);
    } else {
      data['partId'] = this.partId;
      request = this.$partsService.updatePartsById(data);
    }
    request.subscribe((result: ResultModel<string>) => {
      if (result.code === ResultCodeEnum.success) {
        this.isLoading = false;
        this.$message.success(result.msg);
        this.$router.navigate(['/business/facility/facility-parts']).then();
      } else {
        this.isLoading = false;
        this.$message.error(result.msg);
      }
    }, () => {
      this.isLoading = false;
    });
  }


  /**
   * 初始化树选择器配置
   */
  private initTreeSelectorConfig(): void {
    this.treeSetting = {
      check: {
        chkStyle: 'checkbox',
        enable: true,
        chkboxType: {'Y': '', 'N': ''},
      },
      data: {
        simpleData: {
          enable: true,
          pIdKey: 'deptFatherId',
          idKey: 'id',
          rootPid: null
        },
        key: {
          children: 'childDepartmentList',
          name: 'deptName'
        },
      },
      view: {
        showLine: false,
        showIcon: false
      }
    };
    this.treeSelectorConfig = {
      title: `${this.language.selectUnit}`,
      width: '1000px',
      height: '300px',
      onlyLeaves: false,
      treeSetting: this.treeSetting,
      treeNodes: this.treeNodes,
      selectedColumn: [
        {
          title: `${this.language.deptName}`, key: 'deptName', width: 100,
        },
        {
          title: `${this.language.deptLevel}`, key: 'deptLevel', width: 100,
        },
        {
          title: `${this.language.parentDept}`, key: 'parentDepartmentName', width: 100,
        }
      ]
    };
  }

  /**
   * 获取页面标题
   */
  private getPageTitle(type: OperateTypeEnum): string {
    let title;
    switch (type) {
      case OperateTypeEnum.add:
        title = this.language.addParts;
        break;
      case OperateTypeEnum.update:
        title = this.language.updateParts;
        break;
    }
    return title;
  }

  /**
   *  初始化表单字段
   */
  private initColumn(): void {
    this.formColumn = [
      {
        label: this.language.partName,
        key: 'partName',
        type: 'input',
        require: true,
        rule: [
          {required: true},
          RuleUtil.getNameMaxLengthRule(),
          this.$ruleUtil.getNameRule()
        ],
        customRules: [this.$ruleUtil.getNameCustomRule()],
        asyncRules: [
          this.$ruleUtil.getNameAsyncRule(value => this.$partsService.partNameIsExist(
            {partId: this.partId, partName: value}),
            res => res.code === 0)
        ]
      },
      {
        label: this.language.partsType,
        key: 'partType',
        type: 'select',
        selectInfo: {
          data: CommonUtil.codeTranslate(PartsTypeEnum, this.$nzI18n),
          label: 'label',
          value: 'code'
        },
        require: true,
        rule: [{required: true}], asyncRules: []
      },
      {
        label: this.language.department,
        key: 'accountabilityUnit',
        type: 'custom',
        require: true,
        rule: [],
        asyncRules: [],
        template: this.departmentTep
      },
      {
        label: this.language.person,
        key: 'trustee',
        type: 'select',
        selectInfo: {
          data: this.resultPerson,
          label: 'label',
          value: 'value'
        },
        require: true,
        rule: [{required: true}], asyncRules: []
      },
      {
        label: this.language.remarks,
        key: 'remark',
        type: 'input',
        width: 300,
        rule: [this.$ruleUtil.getRemarkMaxLengthRule(), this.$ruleUtil.getNameRule()],
        customRules: [this.$ruleUtil.getNameCustomRule()],
      }
    ];
  }
}
