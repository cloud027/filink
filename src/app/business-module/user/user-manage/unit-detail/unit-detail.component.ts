import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NzI18nService, NzTreeNode} from 'ng-zorro-antd';
import * as _ from 'lodash';
import {UserUtilService} from '../../share/service/user-util.service';
import {ResultModel} from '../../../../shared-module/model/result.model';
import {ResultCodeEnum} from '../../../../shared-module/enum/result-code.enum';
import {FormItem} from '../../../../shared-module/component/form/form-config';
import {FormOperate} from '../../../../shared-module/component/form/form-operate.service';
import {TreeSelectorConfigModel} from '../../../../shared-module/model/tree-selector-config.model';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {RuleUtil} from '../../../../shared-module/util/rule-util';
import {UnitLanguageInterface} from '../../../../../assets/i18n/unit/unit-language.interface';
import {UserService} from '../../share/service/user.service';
import {OperateTypeEnum} from '../../../../shared-module/enum/page-operate-type.enum';
import {LanguageEnum} from '../../../../shared-module/enum/language.enum';
import {DepartmentListModel} from '../../share/model/department-list.model';
import {UserListModel} from '../../../../core-module/model/user/user-list.model';

/**
 * 编辑单位模块
 */
@Component({
  selector: 'app-unit-detail',
  templateUrl: './unit-detail.component.html',
  styleUrls: ['./unit-detail.component.scss']
})
export class UnitDetailComponent implements OnInit {
  // 部门选择
  @ViewChild('department') private departmentTep;
  // 表单配置
  public formColumn: FormItem[] = [];
  // 表单实例对象
  public formStatus: FormOperate;
  // 单位国际化
  public language: UnitLanguageInterface;
  // 单位选择器配置
  public areaSelectorConfig = new TreeSelectorConfigModel();
  // 按钮loading
  public isLoading = false;
  // 页面类型
  public pageType = OperateTypeEnum.add;
  // 页面标题
  public pageTitle: string;
  // 编辑的单位id
  public unitId: string = '';
  // 所选单位信息
  public unitInfo: any = {};
  // 显示单位选择器
  public areaSelectVisible: boolean = false;
  // 所选单位名称
  public selectUnitName: string = '';
  // 选中结果
  public selectData = [];
  // 页面类型枚举
  public OperateTypeEnum = OperateTypeEnum;
  // 责任人名称
  public deptChargeUser: string;
  // 部门下责任人列表
  public deptChargeUserList: any = [];
  // 树数据
  private treeNodes: any = [];

  constructor(
    private $nzI18n: NzI18nService,
    private $userService: UserService,
    private $active: ActivatedRoute,
    private $router: Router,
    private $message: FiLinkModalService,
    private $userUtilService: UserUtilService,
    private $ruleUtil: RuleUtil
  ) {
  }

  public ngOnInit(): void {
    // 获取单位模块国际化语言
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.unit);
    // 初始化表单配置
    this.initColumn();
    // 获取页面类型
    this.pageType = this.$active.snapshot.params.type;
    this.pageTitle = this.getPageTitle(this.pageType);
    // 修改页面进行查询回显
    if (this.pageType !== OperateTypeEnum.add) {
      this.$active.queryParams.subscribe(params => {
        this.unitId = params.id;
        const unitId = this.unitId;
        this.getDept().then(() => {
          this.getUnitListById(unitId);
        });
      });
    } else {
      this.$userUtilService.getDept().then((data: NzTreeNode[]) => {
        this.treeNodes = data || [];
        // 初始化单位选择器配置
        this.initAreaSelectorConfig(data);
      });
    }
  }

  /**
   * 获取表单实例
   */
  public formInstance(event: { instance: FormOperate }): void {
    this.formStatus = event.instance;
  }

  /**
   * 打开单位选择器
   */
  public showDeptSelectorModal(): void {
    this.areaSelectorConfig.treeNodes = this.treeNodes;
    this.areaSelectVisible = true;
  }


  /**
   * 部门选中结果
   * param event
   */
  public deptSelectChange(event: DepartmentListModel[]): void {
    this.selectData = event;
    if (event[0]) {
      this.$userUtilService.setAreaNodesStatus(this.treeNodes, event[0].id, this.unitInfo.id);
      this.selectUnitName = event[0].deptName;
      this.unitInfo.deptFatherId = event[0].id; // 单位名称验证传递的参数
    } else {
      this.$userUtilService.setAreaNodesStatus(this.treeNodes, null, this.unitInfo.id);
      this.selectUnitName = '';
      this.unitInfo.deptLevel = 1;
      this.unitInfo.deptFatherId = null;
    }
  }

  /**
   * 取消返回列表页面
   */
  public goBack(): void {
    this.$router.navigate(['/business/user/unit-list']).then();
  }

  /**
   *新增、修改部门
   */
  public submit(): void {
    this.isLoading = true;
    const unitObj = this.formStatus.getData();
    unitObj.deptFatherId = this.unitInfo.deptFatherId;
    unitObj.deptChargeUser = this.deptChargeUser || null;
    if (this.pageType === OperateTypeEnum.add) {
      if (this.selectData.length === 1) {
        const level = Number(this.selectData[0].deptLevel) + 1;
        unitObj.deptLevel = String(level);
      } else {
        unitObj.deptLevel = '1';
      }
      this.$userService.verifyDeptInfo(unitObj).subscribe((result: ResultModel<DepartmentListModel[]>) => {
        this.isLoading = false;
        if (result.code === ResultCodeEnum.success) {
          if (result.data.length === 0) {
            this.$userService.addDept(unitObj).subscribe((res: ResultModel<string>) => {
              if (res.code === ResultCodeEnum.success) {
                this.$message.success(this.language.addUnitTips);
                this.$router.navigate(['/business/user/unit-list']).then();
              } else {
                this.$message.error(res.msg);
              }
            });
          } else if (result.data.length > 0) {
            this.$message.info(this.language.unitNameTips);
          }
        }
      });

    } else if (this.pageType === OperateTypeEnum.update) {
      if (this.selectData.length === 1) {
        const level = Number(this.selectData[0].deptLevel) + 1;
        unitObj.deptLevel = String(level);
      } else {
        unitObj.deptLevel = String(this.unitInfo.deptLevel);
      }
      unitObj.id = this.unitInfo.id;
      this.$userService.queryDeptInfoById(this.unitId).subscribe((result: ResultModel<DepartmentListModel>) => {
        if (result.code === ResultCodeEnum.success) {
          this.$userService.modifyDept(unitObj).subscribe((res: ResultModel<string>) => {
            this.isLoading = false;
            if (res.code === ResultCodeEnum.success) {
              this.$message.success(this.language.modifyUnitTips);
              this.$router.navigate(['/business/user/unit-list']).then();
            } else {
              this.$message.error(res['msg']);
            }
          });
        } else if (result.code === ResultCodeEnum.roleOrDeptNotExist) {
          this.isLoading = false;
          this.$message.info(this.language.deptExistTips);
          this.$router.navigate(['/business/user/unit-list']).then();
        }
      });
    }

  }

  /**
   * 获取部门列表信息
   */
  private getDept(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.$userUtilService.getDept().then((data: NzTreeNode[]) => {
        this.treeNodes = data || [];
        this.initAreaSelectorConfig(data);
        this.queryUsersByDeptId(this.unitId);
        resolve();
      });
    });
  }

  /**
   * 获取部门下所有责任人
   * @param deptId string
   */
  private queryUsersByDeptId(deptId: string): void {
    this.$userService.queryUsersByDeptId(deptId).subscribe((result: ResultModel<UserListModel[]>) => {
      if (result.code === ResultCodeEnum.success) {
        if (! _.isEmpty(result.data)) {
          this.deptChargeUserList = [];
          result.data.forEach(item => {
            this.deptChargeUserList.push({deptChargeUserId: item.id, deptChargeUser: item.userName, phoneNumber: item.phoneNumber});
          });
          this.formStatus.group.controls['deptChargeUserId'].enable();
          this.formStatus.getColumn('deptChargeUserId').item.selectInfo.data = this.deptChargeUserList;
        }
      }
    });
  }


  /**
   * 初始化表单配置
   */
  private initColumn(): void {
    this.formColumn = [
      {
        label: this.language.deptName,
        key: 'deptName',
        type: 'input',
        require: true,
        rule: [{required: true}, {maxLength: 32},
          this.$ruleUtil.getNameRule()],
        customRules: [this.$ruleUtil.getNameCustomRule()],
        asyncRules: [
          this.$ruleUtil.getNameAsyncRule(value => this.$userService.verifyDeptInfo(
            {deptName: value}),
            (res: ResultModel<DepartmentListModel[]>) => {
              return this.resultJudgment(res);
            })
        ],
      },
      {
        label: this.language.deptChargeUser,
        key: 'deptChargeUserId',
        type: 'select',
        initialValue: '',
        disabled: true,
        selectInfo: {
          data: [],
          label: 'deptChargeUser',
          value: 'deptChargeUserId'
        },
        require: false,
        allowClear: true,
        rule: [{minLength: 1}, {maxLength: 32}],
        modelChange: (controls, event) => {
          if (! _.isEmpty(this.deptChargeUserList)) {
            const deptChargeUserItem = this.deptChargeUserList.find(item => item.deptChargeUserId === event);
            this.formStatus.resetControlData('deptPhoneNum', deptChargeUserItem ? deptChargeUserItem.phoneNumber : null);
            this.deptChargeUser = deptChargeUserItem ? deptChargeUserItem.deptChargeUser : null;
          }
        }
      },
      {
        label: this.language.deptPhoneNum,
        key: 'deptPhoneNum',
        type: 'input',
        require: false,
        rule: [
          {pattern: /^[1][3,4,5,6,7,8,9][0-9]{9}$/, msg: this.language.phoneNumTips},
        ],
        customRules: [],
        asyncRules: [
          this.$ruleUtil.getNameAsyncRule(value => this.$userService.verifyDeptInfo({'deptPhoneNum': value}),
            (res: ResultModel<DepartmentListModel[]>)  => {
              return this.resultJudgment(res);
            }, this.language.phoneNumberTips2)
        ],
      },
      {
        label: this.language.address,
        key: 'address',
        type: 'input',
        require: false,
        rule: [{maxLength: 200}]
      },
      {
        label: this.language.deptFatherId,
        key: 'deptFatherId',
        type: 'custom',
        require: false,
        rule: [],
        asyncRules: [],
        template: this.departmentTep
      },
      {
        label: this.language.remark,
        key: 'remark',
        type: 'input',
        require: false,
        rule: [this.$ruleUtil.getRemarkMaxLengthRule()],
        customRules: [this.$ruleUtil.getNameCustomRule()],
      },
    ];
  }

  /**
   * 结果判断
   */
  private resultJudgment(res: ResultModel<DepartmentListModel[]>) {
    if (res.code === ResultCodeEnum.success) {
      if (res.data.length === 0 || (res.data.length === 1 && res.data[0].id === this.unitId)) {
        return true;
      }
    } else {
      return false;
    }
  }

  /**
   * 初始化单位选择器配置
   */
  private initAreaSelectorConfig(nodes: NzTreeNode[]): void {
    this.areaSelectorConfig = {
      width: '500px',
      height: '300px',
      title: this.language.unitSelect,
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
   * 获取页面类型
   */
  private getPageTitle(type: string): string {
    let title;
    switch (type) {
      case OperateTypeEnum.add:
        title = `${this.language.addUnit} ${this.language.unit}`;
        break;
      case OperateTypeEnum.update:
        title = `${this.language.update} ${this.language.unit}`;
        break;
    }
    return title;
  }

  /**
   * 获取单个部门信息
   */
  private getUnitListById(unitId: string): void {
    this.$userService.queryDeptInfoById(unitId).subscribe((res: ResultModel<DepartmentListModel>) => {
      const unitInfo = res.data;
      this.unitInfo = unitInfo;
      this.unitInfo.deptLevel = Number(this.unitInfo.deptLevel);
      this.selectUnitName = unitInfo.parentDepartmentName;
      // 部门下责任人列表
      if (this.deptChargeUserList && this.deptChargeUserList.length) {
        const deptChargeUser = this.deptChargeUserList.find(item => item.deptChargeUserId === unitInfo.deptChargeUserId);
        if (deptChargeUser) {
          unitInfo.deptPhoneNum = deptChargeUser.phoneNumber;
        }
      }
      this.formStatus.resetData(unitInfo);
      // 递归设置部门的选择情况
      this.$userUtilService.setAreaNodesStatus(this.treeNodes, unitInfo.deptFatherId, this.unitInfo.id);
    });
  }
}
