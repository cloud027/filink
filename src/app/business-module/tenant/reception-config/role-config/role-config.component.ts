import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {NzI18nService, NzModalService} from 'ng-zorro-antd';
import {LanguageEnum} from '../../../../shared-module/enum/language.enum';
import {RoleLanguageInterface} from '../../../../../assets/i18n/role/role-language.interface';
import {CommonLanguageInterface} from '../../../../../assets/i18n/common/common.language.interface';
import {ResultModel} from '../../../../shared-module/model/result.model';
import {ResultCodeEnum} from '../../../../shared-module/enum/result-code.enum';
import {TenantApiService} from '../../share/sevice/tenant-api.service';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {UserUtilService} from '../../share/sevice/user-util.service';
import {takeUntil} from 'rxjs/operators';
import {ActivatedRoute, Router} from '@angular/router';
import {Subject} from 'rxjs';
import {MixinRoleSelector} from '../../share/component/mixin-role-selector';
import {DeviceEquipmentEnum} from '../../../user/share/enum/device-equipment.enum';
import {TenantLanguageInterface} from '../../../../../assets/i18n/tenant/tenant.language.interface';


declare var $: any;

@Component({
  selector: 'app-role-config',
  templateUrl: './role-config.component.html',
  styleUrls: ['./role-config.component.scss']
})
export class RoleConfigComponent extends MixinRoleSelector implements OnInit, AfterViewInit, OnDestroy {

  // 角色模块国际化配置
  public language: RoleLanguageInterface;
  // 国际化
  public tenantLanguage: TenantLanguageInterface;
  // 是否隐藏按钮
  public isHiddenButton: boolean = true;
  // 公共语言包
  public commonLanguage: CommonLanguageInterface;
  // 左边的数据
  public selectDataLeft;
  // 右边的数据
  public selectDataRight;
  // 左边树实例
  public treeInstanceLeft: any;
  // 右边树实例
  public treeInstanceRight: any;
  // 操作权限数据
  public leftNodes: any = [];
  // 设施集数据
  public rightNodes: any = [];
  // 权限id
  public roleId: string = '';
  // 租户id
  public tenantId: string = '';
  // 按钮loading
  public submitLoading = false;
  // 左侧树数据
  public leftZtreeData;
  // 右侧树数据
  public rightZtreeData;
  // 初始化保存左侧树数据
  public leftDataChanges = '';
  // 初始化保存右侧树数据
  public rightDataChanges = '';
  // 监听状态
  public changeStatus: boolean = true;
  // 是否为点击保存配置
  public confirmSave: boolean = true;


  // 关闭订阅流
  private destroy$ = new Subject<any>();

  constructor(public $nzI18n: NzI18nService,
              public $tenantApiService: TenantApiService,
              private $message: FiLinkModalService,
              private $userUtilService: UserUtilService,
              private $activatedRoute: ActivatedRoute,
              public $router: Router,
              public modalService: NzModalService) {
    // 获取国际化配置
    super($nzI18n);
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.role);
  }


  ngOnInit() {
    // 通用国际化
    this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
    // 国际化
    this.tenantLanguage = this.$nzI18n.getLocaleData(LanguageEnum.tenant);
    // 查询租户权限集
    this.queryTenantRole();
  }


  /**
   * 页面销毁
   */
  ngOnDestroy(): void {
    // 销毁zTree
    $.fn.zTree.destroy();
  }


  /**
   * 页面加载完成后
   */
  public ngAfterViewInit(): void {
    // this.initTree();
  }

  /**
   * 查询租户权限集
   */
  queryTenantRole() {
    this.$activatedRoute.queryParams.pipe((takeUntil(this.destroy$))).subscribe(params => {
      this.roleId = params.roleId;
      this.tenantId = params.id;
      this.$tenantApiService.queryTenantDevicesById(this.tenantId).subscribe((res: ResultModel<any>) => {
        if (res.code === ResultCodeEnum.success && res.data) {
          this.changeStatus = true;
          const roleInfo = res.data;
          // 记录id
          this.roleId = roleInfo.id;
          const arr = [];
          if (roleInfo.deviceTypes.length) {
            arr.push(...roleInfo.deviceTypes, DeviceEquipmentEnum.device);
          }
          if (roleInfo.equipmentTypes.length) {
            arr.push(...roleInfo.equipmentTypes, DeviceEquipmentEnum.equipment);
          }
          if (roleInfo.projectPlanningTypes.length) {
            arr.push(...roleInfo.projectPlanningTypes, DeviceEquipmentEnum.planProject);
          }
          // 获取权限树
          this.getPermission().then((data) => {
            // 查询权限相关
            const permissionSelectData = data;
            const authorityIds = [];   // 角色权限id
            this.$userUtilService.queryTenantTreeNodeListId(permissionSelectData, authorityIds);
            this.leftNodes = data;
            this.$userUtilService.getAllDeviceType().then(_data => {
              this.rightNodes = _data;
              this.initRoleSelectorConfig(this.leftNodes, this.rightNodes);
              // 递归设置角色权限的选择情况
              this.$userUtilService.setRoleTreeNodesStatus(this.leftNodes, authorityIds);
              // 递归设置设施权限的选择情况
              this.$userUtilService.setFacilityTreeNodesStastus(this.rightNodes, arr);
              this.initTree();
            });
          });
        } else if (res.code === ResultCodeEnum.roleOrDeptNotExist) {
          // 角色不存在提示
          this.$message.info(this.language.roleExistTips);
        }
      });
    });
  }

  /**
   * 获取顶级权限
   */
  private getPermission(): Promise<any[]> {
    return new Promise((resolve) => {
      this.$tenantApiService.queryTenantPermissionById(this.tenantId).subscribe((result: ResultModel<any>) => {
        const data = result.data.permissionList || [];
        resolve(data);
      });
    });
  }


  /**
   * tree初始化
   */
  initTree() {
    // 初始化左边的树
    $.fn.zTree.init($('#roleLeft'),
      Object.assign(this.roleSelectorConfig.treeLeftSetting, {}),
      this.roleSelectorConfig.leftNodes);
    this.treeInstanceLeft = $.fn.zTree.getZTreeObj('roleLeft');
    if (this.treeInstanceLeft) {
    // 展开到已选数据
    this.selectDataLeft = this.treeInstanceLeft.getCheckedNodes(true);
    if (this.selectDataLeft.length > 0) {
      this.treeInstanceLeft.expandAll(true);
    }
      this.leftDataChanges = this.treeInstanceLeft.getCheckedNodes(false);
    }
    // 初始化右边的树
    $.fn.zTree.init($('#roleRight'),
      Object.assign(this.roleSelectorConfig.treeRightSetting, {}),
      this.roleSelectorConfig.rightNodes);
    this.treeInstanceRight = $.fn.zTree.getZTreeObj('roleRight');
    // 展开到已选数据
    if (this.treeInstanceRight) {
      this.selectDataRight = this.treeInstanceRight.getCheckedNodes(true);
      if (this.selectDataRight.length > 0) {
        this.treeInstanceRight.expandAll(true);
      }
      this.rightDataChanges = this.treeInstanceRight.getCheckedNodes(false);
    }

  }


  /**
   * 确认事件
   */
  public updateMenuTemplate(): void {
    // 保存配置
    this.updateElement();
  }

  /**
   * 保存数据
   */
  public updateElement() {
    this.leftZtreeData = this.treeInstanceLeft.getCheckedNodes(false);
    this.rightZtreeData = this.treeInstanceRight.getCheckedNodes(false);

    // 设施集数据
    const deviceTypes = [];
    // 设备集数据
    const equipmentTypes = [];
    // 规划项目集合
    // const projectPlanningTypes = [];
    // 处理权限数据
    if (this.leftZtreeData.length) {
      // 未勾选数据状态修改
      this.leftZtreeData.forEach(item => {
        item.isShow = '0';
      });
    }

    // 处理设施设备集数据
    if (this.rightZtreeData) {
      this.rightZtreeData.forEach(item => {
        if (item.pId === DeviceEquipmentEnum.device) {
          deviceTypes.push(item.code);
        }
        if (item.pId === DeviceEquipmentEnum.equipment || item.pId === DeviceEquipmentEnum.planProject) {
          equipmentTypes.push(item.code);
        }
        // if (item.pId === DeviceEquipmentEnum.planProject) {
        //   projectPlanningTypes.push(item.code);
        // }
      });
    }

    // 权限集查询条件
    const PermissionBody = {
      tenantId: this.tenantId,
      permissionList: this.leftZtreeData
    };
    // 设施集查询条件
    const DevicesBody = {
      tenantId: this.tenantId,
      deviceTypes: deviceTypes,
      equipmentTypes: equipmentTypes,
      /*projectPlanningTypes: projectPlanningTypes*/
    };

    // 保存权限集
    this.$tenantApiService.updateTenantPermissionById(PermissionBody).subscribe((result: ResultModel<any>) => {
      if (result.data === ResultCodeEnum.success) {
        this.deviceRolePost(DevicesBody);
      }
    });
  }

  /**
   * 保存设施设备集
   */

  public deviceRolePost(DevicesBody) {
    // 保存设施集
    this.$tenantApiService.updateTenantDevicesById(DevicesBody).subscribe((result: ResultModel<any>) => {
      this.resultMsg(result);
    });
  }


  /**
   * 结果判断
   */
  private resultMsg(result): void {
    if (result.code === ResultCodeEnum.success) {
      this.$message.success(this.tenantLanguage.tenantConfigMsg);
      if (this.confirmSave) {
        // 刷新数据
        this.queryTenantRole();
        this.changeStatus = false;
      }
    } else {
      this.$message.error(result.msg);
    }
  }

  /**
   * 取消按钮，回列表
   */
  public cancel(): void {
    const dataChang = this.comparedDatas();
    if (dataChang) {
      this.confirm();
    } else {
      // 返回租户列表
      this.$router.navigate(['/business/tenant/tenant-list']).then();
    }

  }

  /**
   * 对比数据是否有改变
   */
  public comparedDatas() {
    if (this.changeStatus && this.treeInstanceLeft && this.treeInstanceRight) {
      // 获取左侧
      this.leftZtreeData = this.treeInstanceLeft.getCheckedNodes(false);
      const leftZtreeData = this.leftZtreeData.toString();

      // 右侧树数据
      this.rightZtreeData = this.treeInstanceRight.getCheckedNodes(false);
      const rightZtreeData = this.rightZtreeData.toString();

      // 与初始化数据对比
      const leftDataChanges = this.leftDataChanges.toString();
      const rightDataChanges = this.rightDataChanges.toString();


      if (leftDataChanges === leftZtreeData && rightDataChanges === rightZtreeData) {
        return false;
      } else {
        return true;
      }
    }
  }


  /**
   * 确认弹窗
   */
  public confirm(): void {
    this.modalService.warning({
      nzTitle: this.tenantLanguage.saveConfigMsg,
      nzContent: this.tenantLanguage.beenSaveConfigMsg,
      nzOkText: this.commonLanguage.cancel,
      nzOkType: 'danger',
      nzCancelText: this.commonLanguage.confirm,
      nzMaskClosable: false,
      nzOnCancel: () => {
        // true为点击配置保存按钮,false为弹框保存
        this.confirmSave = false;
        // 保存配置
        this.updateElement();
        // 返回租户列表
        this.$router.navigate(['/business/tenant/tenant-list']).then();
      },
      nzOnOk: () => {
        this.$router.navigate(['/business/tenant/tenant-list']).then();
      }
    });
  }


}
