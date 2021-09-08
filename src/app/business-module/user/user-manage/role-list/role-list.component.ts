import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {NzI18nService} from 'ng-zorro-antd';
import {UserUtilService} from '../../share/service/user-util.service';
import {PageModel} from '../../../../shared-module/model/page.model';
import {TableConfigModel} from '../../../../shared-module/model/table-config.model';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {FilterCondition, QueryConditionModel, SortCondition} from '../../../../shared-module/model/query-condition.model';
import {ResultModel} from '../../../../shared-module/model/result.model';
import {UserService} from '../../share/service/user.service';
import {MixinRoleSelector} from '../../share/minix-component/mixin-selector/mixin-role-selector';
import {ResultCodeEnum} from '../../../../shared-module/enum/result-code.enum';
import {DepartmentListModel} from '../../share/model/department-list.model';
import {RoleListModel} from '../../../../core-module/model/user/role-list.model';
import {InnerTablePageModel} from '../../share/model/inner-table-page.model';
import {UserForCommonService} from '../../../../core-module/api-service/user';
import {DeviceEquipmentEnum} from '../../share/enum/device-equipment.enum';

/**
 * 角色列表模块
 */
@Component({
  selector: 'app-role-list',
  templateUrl: './role-list.component.html',
  styleUrls: ['./role-list.component.scss']
})

export class RoleListComponent extends MixinRoleSelector implements OnInit {
  // 角色名称模板
  @ViewChild('roleTemp') private roleTemp: TemplateRef<any>;
  // 列表数据
  public _dataSet = [];
  // 分页配置
  public pageBean: PageModel = new PageModel(10, 1, 1);
  // 列表配置
  public tableConfig: TableConfigModel;
  // 显示操作权限与设施集
  public roleSelectorVisible = false;
  // 查询配置
  private queryCondition: QueryConditionModel = new QueryConditionModel();
  // 查询biz
  private filterObject = {};
  // 批量删除逻辑标记
  private flag: boolean = true;
  // 查看的角色id
  private roleId: string;
  // 操作权限数据
  private leftNodes: any = [];
  // 设施集数据
  private rightNodes: any = [];

  constructor(
    public $router: Router,
    public $nzI18n: NzI18nService,
    public $userService: UserService,
    public $message: FiLinkModalService,
    private $userUtilService: UserUtilService,
    private $userServiceForCommon: UserForCommonService,
  ) {
    super($nzI18n);
  }

  public ngOnInit(): void {
    // 初始化列表
    this.initTableConfig();
    // 刷新列表数据
    this.refreshData();
  }

  /**
   * 页码变化
   */
  public pageChange(event: PageModel): void {
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
    this.refreshData();
  }

  /**
   * 获取角色列表信息
   */
  private refreshData(): void {
    this.tableConfig.isLoading = true;
    this.$userService.queryRoles(this.queryCondition).subscribe((res: ResultModel<InnerTablePageModel<DepartmentListModel[]>>) => {
      this.tableConfig.isLoading = false;
      this._dataSet = res.data.data;
      this.pageBean.Total = res.data.totalCount;
      this.pageBean.pageIndex = res.data.pageNum;
      this.pageBean.pageSize = res.data.size;
      // 默认角色不显示操作按钮
      this._dataSet.forEach(item => {
        if (item.defaultRole === 0) {
          item.isShowDeleteIcon = true;
        }
        if (item.defaultRole === 1) {
          item.isShowDeleteIcon = false;
        }
      });
    }, () => {
      this.tableConfig.isLoading = false;
    });
  }

  /**
   * 跳转修改角色页面
   */
  private openModifyRole(userId: string): void {
    this.$router.navigate(['business/user/role-detail/update'], {
      queryParams: {id: userId}
    }).then();
  }

  /**
   * 跳第一页
   */
  private goToFirstPage(): void {
    this.queryCondition.pageCondition.pageNum = 1;
    this.refreshData();
  }


  /**
   * 初始化表格配置
   */
  private initTableConfig(): void {
    this.tableConfig = {
      primaryKey: '01-3',
      showSearchSwitch: true,
      isLoading: false,
      noIndex: true,
      notShowPrint: true,
      showSizeChanger: true,
      scroll: {x: '1200px', y: '600px'},
      isDraggable: true,
      columnConfig: [
        {type: 'select', fixedStyle: {fixedLeft: true, style: {left: '0px'}}, width: 61},
        {
          // 序号
          type: 'serial-number', width: 61, title: this.language.serialNumber,
          fixedStyle: {fixedLeft: true, style: {left: '61px'}}
        },
        {
          // 角色名称
          title: this.language.roleName, key: 'roleName', width: 500, isShowSort: true,
          searchable: true, configurable: true,
          type: 'render',
          renderTemplate: this.roleTemp,
          searchConfig: {
            type: 'input'
          }
        },
        {
          // 备注
          title: this.language.remark, key: 'remark', width: 300, configurable: true, isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'},
        },
        {
          title: this.language.operate, searchable: true,
          searchConfig: {type: 'operate'}, key: '', width: 120, fixedStyle: {fixedRight: true, style: {right: '0px'}}
        },
      ],
      showPagination: true,
      bordered: false,
      showSearch: false,
      searchReturnType: 'Array',
      topButtons: [
        {
          // 新增
          text: this.language.addUser,
          iconClassName: 'fiLink-add-no-circle',
          permissionCode: '01-3-1',
          handle: (currentIndex) => {
            this.$router.navigate(['business/user/role-detail/add']).then();
          }
        },
        {
          // 删除
          text: this.language.deleteHandle,
          btnType: 'danger',
          className: 'table-top-delete-btn',
          iconClassName: 'fiLink-delete',
          needConfirm: true,
          canDisabled: true,
          permissionCode: '01-3-3',
          handle: (currentIndex: RoleListModel[]) => {
            this.flag = true;
            // 默认角色不可删除
            if (currentIndex.length > 0) {
              currentIndex.forEach(item => {
                if (item.defaultRole === 1) {
                  this.flag = false;
                }
              });
              if (! this.flag) {
                this.$message.info(this.language.defaultRoleTips);
              }
              if (this.flag) {
                const ids = currentIndex.map(item => item.id);
                const params = {firstArrayParameter: ids};
                this.deleteRole(params);
              }
            } else {
              return;
            }
          }
        },
      ],
      operation: [
        {
          // 查看角色权集
          text: this.language.roleSet,
          className: 'fiLink-collection-facilities',
          permissionCode: '01-3-4',
          handle: (currentIndex: RoleListModel) => {
            this.$userService.queryRoleInfoById(currentIndex.id).subscribe((res: ResultModel<RoleListModel>) => {
              if (res.code === 0) {
                const roleInfo = res.data;
                // 记录id
                this.roleId = roleInfo.id;
                // 查询权限相关
                const permissionSelectData = roleInfo.permissionList;
                const authorityIds = [];   // 角色权限id
                this.$userUtilService.queryTreeNodeListId(permissionSelectData, authorityIds);
                const arr = [];
                if (roleInfo.roleDeviceTypeDto.deviceTypes.length) {
                  arr.push(...roleInfo.roleDeviceTypeDto.deviceTypes, DeviceEquipmentEnum.device);
                }
                if (roleInfo.roleDeviceTypeDto.equipmentTypes.length) {
                  arr.push(...roleInfo.roleDeviceTypeDto.equipmentTypes, DeviceEquipmentEnum.equipment);
                }
                if (roleInfo.roleDeviceTypeDto.projectPlanningTypes.length) {
                  arr.push(...roleInfo.roleDeviceTypeDto.projectPlanningTypes, DeviceEquipmentEnum.planProject);
                }
                // 获取权限树
                this.getPermission().then((data) => {
                  this.leftNodes = this.$userUtilService.queryShowPermission(data);
                  this.$userUtilService.getAllDeviceType().then(_data => {
                    this.rightNodes = _data;
                    this.initRoleSelectorConfig(this.leftNodes, this.rightNodes);
                    // 递归设置角色权限的选择情况
                    this.$userUtilService.setRoleTreeNodesStatus(this.leftNodes, authorityIds);
                    // 递归设置设施权限的选择情况
                    this.$userUtilService.setFacilityTreeNodesStastus(this.rightNodes, arr);
                    this.roleSelectorVisible = true;
                  });
                });
              } else if (res.code === ResultCodeEnum.roleOrDeptNotExist) {
                // 角色不存在提示
                this.$message.info(this.language.roleExistTips);
                this.goToFirstPage();
              }
            });
          }
        },
        {
          text: this.language.update,
          className: 'fiLink-edit',
          key: 'isShowDeleteIcon',
          permissionCode: '01-3-2',
          handle: (currentIndex: RoleListModel) => {
            this.$userService.queryRoleInfoById(currentIndex.id).subscribe((res: ResultModel<RoleListModel>) => {
              if (res.code === 0) {
                this.openModifyRole(currentIndex.id);
              } else if (res.code === ResultCodeEnum.roleOrDeptNotExist) {
                // 角色不存在提示
                this.$message.info(this.language.roleExistTips);
                this.goToFirstPage();
              }
            });
          }
        },
        {
          text: this.language.deleteHandle,
          canDisabled: true,
          needConfirm: true,
          className: 'fiLink-delete red-icon',
          key: 'isShowDeleteIcon',
          permissionCode: '01-3-3',
          handle: (currentIndex: RoleListModel) => {
            this.$userService.queryRoleInfoById(currentIndex.id).subscribe((res: ResultModel<RoleListModel>) => {
              if (res.code === 0) {
                if (currentIndex.defaultRole === 1) {
                  this.$message.info(this.language.defaultRoleTips);
                } else if (currentIndex.defaultRole === 0) {
                  const params = {firstArrayParameter: [currentIndex.id]};
                  this.deleteRole(params);
                }
              } else if (res.code === ResultCodeEnum.roleOrDeptNotExist) {
                // 角色不存在提示
                this.$message.info(this.language.roleExistTips);
                this.goToFirstPage();
              }
            });
          }
        },
      ],
      sort: (event: SortCondition) => {
        const obj = {
          sortProperties: event.sortField,
          sort: event.sortRule
        };
        // 适应后台
        if (event.sortField === 'roleName') {
          obj.sortProperties = 'role_name';
        }
        this.queryCondition.bizCondition = Object.assign(this.filterObject, obj);
        this.refreshData();
      },
      handleSearch: (event: FilterCondition[]) => {
        const obj = {};
        event.forEach(item => {
          obj[item.filterField] = item.filterValue;
        });
        this.queryCondition.pageCondition.pageNum = 1;
        this.filterObject = obj;
        this.queryCondition.bizCondition = Object.assign(this.filterObject, obj);
        this.refreshData();
      }
    };
  }

  /**
   * 获取顶级权限
   */
  private getPermission(): Promise<any[]> {
    const tenantId = JSON.parse(localStorage.getItem('userInfo')).tenantId;
    return new Promise((resolve) => {
      // 查询顶级权限
      this.$userServiceForCommon.queryTenantPermissionById(tenantId).subscribe((result: ResultModel<any>) => {
        const data = result.data ? (result.data.permissionList || []) : [];
        resolve(data);
      });
    });
  }

  /**
   * 删除角色通用处理
   */
  private deleteRole(params: {firstArrayParameter: string[]}): void {
    this.$userService.deleteRole(params).subscribe((res: ResultModel<any>) => {
      if (res.code === 0) {
        this.$message.success(this.language.deleteRoleSuccess);
        this.goToFirstPage();
      } else if (res.code === ResultCodeEnum.roleNotExist) {
        this.$message.info(res.msg);
      } else {
        this.$message.error(res.msg);
      }
    });
  }
}
