import {RoleLanguageInterface} from '../../../../../assets/i18n/role/role-language.interface';
import {TreeSelectorConfigModel} from '../../../../shared-module/model/tree-selector-config.model';
import {NzI18nService, NzTreeNode} from 'ng-zorro-antd';
import {LanguageEnum} from '../../../../shared-module/enum/language.enum';

/**
 * 公共mixin角色选择器相关
 */
export class MixinRoleSelector {
  // 角色模块国际化配置
  public language: RoleLanguageInterface;
  // 树配置
  public roleSelectorConfig: TreeSelectorConfigModel = new TreeSelectorConfigModel();

  constructor(public $nzI18n: NzI18nService) {
    // 获取国际化配置
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.role);
  }

  /**
   * 操作权限与设施集配置
   */
  public initRoleSelectorConfig(leftNodes: NzTreeNode[], rightNodes: NzTreeNode[]) {
    this.roleSelectorConfig = {
      width: '800px',
      height: '300px',
      title: this.language.permissionAndFacilities,
      treeLeftSetting: {
        check: {
          enable: true,
          chkStyle: 'checkbox',
          chkboxType: {'Y': 'ps', 'N': 'ps'},
        },
        data: {
          simpleData: {
            enable: true,
            idKey: 'id',
          },
          key: {
            name: 'name',
            children: 'childPermissionList'
          },
        },
        view: {
          showIcon: false,
          showLine: false
        }
      },
      treeRightSetting: {
        check: {
          enable: true,
          chkStyle: 'checkbox',
          chkboxType: {'Y': 'ps', 'N': 'ps'},
        },
        data: {
          simpleData: {
            enable: true,
            idKey: 'code',
          },
          key: {
            name: 'name',
            children: 'children'
          },
        },
        view: {
          showIcon: false,
          showLine: false
        }
      },
      rightTitle: this.language.facilities,
      rightNodes: rightNodes,
      leftTitle: this.language.operatePermission,
      leftNodes: leftNodes,
    };
  }
}
