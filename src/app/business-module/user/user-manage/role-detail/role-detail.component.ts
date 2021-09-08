import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FormItem} from '../../../../shared-module/component/form/form-config';
import {FormOperate} from '../../../../shared-module/component/form/form-operate.service';
import {NzI18nService} from 'ng-zorro-antd';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {TreeSelectorConfigModel} from '../../../../shared-module/model/tree-selector-config.model';
import {UserUtilService} from '../../share/service/user-util.service';
import {RuleUtil} from '../../../../shared-module/util/rule-util';
import {CommonUtil} from '../../../../shared-module/util/common-util';
import {DeviceEquipmentEnum} from '../../share/enum/device-equipment.enum';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {FilterCondition} from '../../../../shared-module/model/query-condition.model';
import {OperatorEnum} from '../../../../shared-module/enum/operator.enum';
import {OperateTypeEnum} from '../../../../shared-module/enum/page-operate-type.enum';
import {ResultModel} from '../../../../shared-module/model/result.model';
import {UserService} from '../../share/service/user.service';
import {MixinRoleSelector} from '../../share/minix-component/mixin-selector/mixin-role-selector';
import {ResultCodeEnum} from '../../../../shared-module/enum/result-code.enum';
import { UserForCommonService } from '../../../../core-module/api-service';

/**
 * 编辑角色模块
 */
@Component({
  selector: 'app-role-detail',
  templateUrl: './role-detail.component.html',
  styleUrls: ['./role-detail.component.scss']
})

export class RoleDetailComponent extends MixinRoleSelector implements OnInit, OnDestroy {
  // 选择器模板
  @ViewChild('operateSelector') private operateSelector: TemplateRef<any>;
  // 表单配置
  public formColumn: FormItem[] = [];
  // 页面标题
  public pageTitle: string;
  // 按钮loading
  public isLoading: boolean = false;
  // 按钮禁用
  public isDisabled: boolean = true;
  // 权限数据选择
  public roleSelectorVisible = false;
  // 权限选择器配置
  public roleSelectorConfig = new TreeSelectorConfigModel();
  // 页面加载
  public pageLoading = false;
  // 表单实例对象
  private formStatus: FormOperate;
  // 页面类型
  private pageType = OperateTypeEnum.add;
  // 权限id
  private roleId: string;
  // 权限信息
  private roleInfo: any = {};
  // 权限id集合
  private permissionIds = [];  // 权限id
  // 左边数据集合
  private leftNodes: any = [];
  // 右边数据集合
  private rightNodes: any = [];
  // 设施集数据
  private deviceTypesArr: string[] = [];
  // 设备集数据
  private equipmentTypesArr: string[] = [];
  // 规划项目集数据
  private projectPlanningTypesArr: string[] = [];
  // 关闭订阅流
  private destroy$ = new Subject<any>();

  constructor(
    public $nzI18n: NzI18nService,
    private $userService: UserService,
    private $userServiceForCommon: UserForCommonService,
    private $activatedRoute: ActivatedRoute,
    private $router: Router,
    private $message: FiLinkModalService,
    private $userUtilService: UserUtilService,
    private $ruleUtil: RuleUtil
  ) {
    super($nzI18n);
  }


  public ngOnInit(): void {
    // 获取当前页面类型
    this.$activatedRoute.params.pipe((takeUntil(this.destroy$))).subscribe((params: Params) => {
      this.pageType = params.type;
    });
    this.pageTitle = this.getPageTitle(this.pageType);
    this.pageLoading = true;
    // 新增和修改做不同处理
    if (this.pageType !== OperateTypeEnum.add) {
      this.$activatedRoute.queryParams.pipe((takeUntil(this.destroy$))).subscribe(params => {
        this.roleId = params.id;
        this.getPermission().then(() => {
          this.$userUtilService.getAllDeviceType().then(_data => {
            this.rightNodes = _data;
            this.initRoleSelectorConfig(this.leftNodes, this.rightNodes);
            // 获取单个角色信息
            this.getRoleInfoById(this.roleId);
          });
        });
      });
    } else {
      // 新增时
      this.getPermission().then(() => {
        this.$userUtilService.getAllDeviceType().then(_data => {
          this.pageLoading = false;
          this.rightNodes = _data;
          this.$userUtilService.setRoleTreeNodesStatus(this.leftNodes, []);
          this.$userUtilService.setFacilityTreeNodesStastus(this.rightNodes, []);
          this.initRoleSelectorConfig(this.leftNodes, this.rightNodes);
        });
      });
    }
    // 初始化表单
    this.initColumn();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  /**
   * 表单实例接收事件
   * param event
   */
  public formInstance(event: { instance: FormOperate }): void {
    this.formStatus = event.instance;
    // 校验表单
    this.formStatus.group.statusChanges.pipe((takeUntil(this.destroy$))).subscribe(() => {
      this.isDisabled = !event.instance.getValid();
    });
  }

  /**
   *打开操作模态框
   */
  public showSelectorModal(): void {
    const permissionIds = this.formStatus.getData('permissionIds') || [];
    this.$userUtilService.setRoleTreeNodesStatus(this.leftNodes, permissionIds);
    this.$userUtilService.setFacilityTreeNodesStastus(this.rightNodes, this.setDeviceEquipmentData());
    this.roleSelectorVisible = true;
  }

  /**
   *新增、修改角色
   */
  public submit(): void {
    this.isLoading = true;
    // 获取表单数据
    const roleObj = this.formStatus.getData();
    if (JSON.stringify(this.roleInfo) === '{}' &&
      this.roleInfo.defaultRole && this.roleInfo.defaultRole === 1) {
      // 去前后空格
      roleObj.roleName = CommonUtil.trim(roleObj.roleName);
    }
    roleObj.roleDeviceTypeDto = {
      deviceTypes: this.deviceTypesArr,
      equipmentTypes: this.equipmentTypesArr,
      projectPlanningTypes: this.projectPlanningTypesArr
    };
    // 新增页面
    if (this.pageType === OperateTypeEnum.add) {
      this.$userService.addRole(roleObj).subscribe((res: ResultModel<string>) => {
        this.isLoading = false;
        // 结果判断
        this.resultJudgment(res);
      });
    } else if (this.pageType === OperateTypeEnum.update) {
      // 修改页面判断默认角色
      if (this.roleInfo.defaultRole === 1) {
        roleObj.defaultRole = 1;
      } else {
        roleObj.defaultRole = 0;
      }
      roleObj.id = this.roleId;
      // 查询是否存在该id
      this.$userService.queryRoleInfoById(this.roleId).pipe((takeUntil(this.destroy$))).subscribe((result: ResultModel<any>) => {
        if (result.code === 0) {
          this.$userService.modifyRole(roleObj).pipe((takeUntil(this.destroy$))).subscribe((res: ResultModel<any>) => {
            this.isLoading = false;
            this.resultJudgment(res);
          });
        } else if (result.code === ResultCodeEnum.roleOrDeptNotExist) {
          // 不存在进行提示
          this.isLoading = false;
          this.$message.info(this.language.roleExistTips);
          this.goBack();
        }
      });
    }

  }

  /**
   * 操作权限、设施选中结果
   */
  public selectDataChange(event): void {
    // 左边树形节点
    const leftData = event.left;
    const permissionIds = [];
    leftData.forEach(item => {
      permissionIds.push(item.id);
    });
    this.formStatus.resetControlData('permissionIds', permissionIds);
    // 右边树形节点
    const rightData = event.right;
    this.deviceTypesArr = [];
    this.equipmentTypesArr = [];
    this.projectPlanningTypesArr = [];
    // 处理设施设备集数据
    rightData.forEach(item => {
      if (item.code === DeviceEquipmentEnum.device) {
        item.children.forEach(_item => {
          if (_item.checked) {
            this.deviceTypesArr.push(_item.code);
          }
        });
      }
      if (item.code === DeviceEquipmentEnum.equipment) {
        item.children.forEach(_item => {
          if (_item.checked) {
            this.equipmentTypesArr.push(_item.code);
          }
        });
      }
      if (item.code === DeviceEquipmentEnum.planProject) {
        item.children.forEach(_item => {
          if (_item.checked) {
            this.projectPlanningTypesArr.push(_item.code);
          }
        });
      }
    });
  }


  /**
   * 跳转到列表
   */
  public goBack(): void {
    this.$router.navigate(['/business/user/role-list']).then();
  }
  /**
   * 结果判断
   */
  private resultJudgment(res): void {
    if (res.code === 0) {
      if (!this.roleId) {
        this.$message.success(this.language.addRoleSuccess);
      } else {
        this.$message.success(this.language.updateRoleSuccess);
      }
      this.goBack();
    } else {
      this.$message.error(res.msg);
    }
  }


  /**
   * 获取单个角色信息
   */
  private getRoleInfoById(roleId): void {
    this.$userService.queryRoleInfoById(roleId).pipe((takeUntil(this.destroy$))).subscribe((res: ResultModel<any>) => {
      if (res.code === 0) {
        this.pageLoading = false;
        this.roleInfo = res.data;
        if (this.roleInfo.defaultRole === 1) {
          this.formStatus.group.controls['roleName'].disable();
        }
        // 角色权限id
        const authorityIds = [];
        // 获取到角色权限id集合
        this.$userUtilService.queryTreeNodeListId(this.roleInfo.permissionList, authorityIds);
        this.roleInfo.permissionIds = authorityIds;
        this.formStatus.resetData(this.roleInfo);
        // 递归设置角色权限的选择情况
        this.$userUtilService.setRoleTreeNodesStatus(this.leftNodes, authorityIds);
        // 递归设置设施权限的选择情况
        this.deviceTypesArr = this.roleInfo.roleDeviceTypeDto.deviceTypes;
        this.equipmentTypesArr = this.roleInfo.roleDeviceTypeDto.equipmentTypes;
        this.projectPlanningTypesArr = this.roleInfo.roleDeviceTypeDto.projectPlanningTypes;
        this.$userUtilService.setFacilityTreeNodesStastus(this.rightNodes, this.setDeviceEquipmentData());
      }
    });
  }

  /**
   * 设置设施设备即数据
   */
  private setDeviceEquipmentData(): string[] {
    const arr = [];
    if (this.deviceTypesArr.length) {
      arr.push(...this.deviceTypesArr, DeviceEquipmentEnum.device);
    }
    if (this.equipmentTypesArr.length) {
      arr.push(...this.equipmentTypesArr, DeviceEquipmentEnum.equipment);
    }
    if (this.projectPlanningTypesArr.length) {
      arr.push(...this.projectPlanningTypesArr, DeviceEquipmentEnum.planProject);
    }
    return arr;
  }

  /**
   * 获取顶级权限
   */
  private getPermission(): Promise<any[]> {
    const tenantId = JSON.parse(localStorage.getItem('userInfo')).tenantId;
    return new Promise((resolve) => {
      this.$userServiceForCommon.queryTenantPermissionById(tenantId).subscribe((result: ResultModel<any>) => {
        const data = result.data ? (result.data.permissionList || []) : [];
        this.leftNodes = this.$userUtilService.queryShowPermission(data);
        resolve();
      });
    });
  }

  /**
   * 初始化表单
   */
  private initColumn(): void {
    this.formColumn = [
      {
        label: this.language.roleName,
        key: 'roleName',
        type: 'input',
        notTrim: true,
        require: true,
        rule: [{required: true}, {maxLength: 32},
          {pattern: /^[A-Za-z0-9\u4e00-\u9fa5\-_\s]{1,32}$/, msg: this.language.roleNameTips1}],
        customRules: [],
        asyncRules: [
          this.$ruleUtil.getNameAsyncRule(value => this.$userService.verifyRoleInfo(
            {
              pageCondition: {pageNum: 1, pageSize: 10},
              filterConditions: [new FilterCondition('role_name', OperatorEnum.eq, value)]
            }),
            (res: ResultModel<any>) => {
              if (res.code === 0) {
                if (res.data.length === 0) {
                  return true;
                } else if (res.data.length > 0) {
                  return res.data[0].id === this.roleId;
                }
              } else {
                return false;
              }
            })
        ]
      },
      {
        label: this.language.permissionAndFacility, key: 'permissionIds', type: 'custom',
        require: false,
        template: this.operateSelector,
        rule: [],
        asyncRules: []
      },
      {
        label: this.language.remark,
        key: 'remark',
        type: 'input',
        require: false,
        rule: [this.$ruleUtil.getRemarkMaxLengthRule()],
        customRules: [this.$ruleUtil.getNameCustomRule()],
      }
    ];
  }

  /**
   * 获取页面类型
   * param type
   */
  private getPageTitle(type: string): string {
    let title;
    switch (type) {
      case OperateTypeEnum.add:
        title = `${this.language.addUser} ${this.language.role}`;
        break;
      case OperateTypeEnum.update:
        title = `${this.language.update} ${this.language.role}`;
        break;
    }
    return title;
  }
}


