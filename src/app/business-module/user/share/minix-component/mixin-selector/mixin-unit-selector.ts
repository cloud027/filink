import {FacilityForCommonUtil} from '../../../../../core-module/business-util/facility/facility-for-common.util';
import {ResultModel} from '../../../../../shared-module/model/result.model';
import {Router} from '@angular/router';
import {DateHelperService, NzI18nService} from 'ng-zorro-antd';
import {UserService} from '../../service/user.service';
import {UserForCommonService} from '../../../../../core-module/api-service/user';
import {FiLinkModalService} from '../../../../../shared-module/service/filink-modal/filink-modal.service';
import {TreeSelectorConfigModel} from '../../../../../shared-module/model/tree-selector-config.model';
import {FacilityLanguageInterface} from '../../../../../../assets/i18n/facility/facility.language.interface';
import {LanguageEnum} from '../../../../../shared-module/enum/language.enum';
import {DepartmentUnitModel} from '../../../../../core-module/model/work-order/department-unit.model';
import {FilterCondition} from '../../../../../shared-module/model/query-condition.model';

/**
 * 公共mixin单位选择器相关
 */
export class MixinUnitSelector {
  // 责任单位选择结果
  public selectUnitName: string = '';
  // 树节点
  public treeNodes = [];
  // 树节点配置
  public treeSetting = {};
  // 记录选择器结果
  public filterValue: FilterCondition;
  // 责任单位选择器显示
  public isVisible: boolean = false;
  // 打开责任单位选择器树配置
  public treeSelectorConfig: TreeSelectorConfigModel;
  // 设施模块国际化语言
  public areaLanguage: FacilityLanguageInterface;
  constructor(
    public $router: Router,
    public $nzI18n: NzI18nService,
    public $userService: UserService,
    public $userForCommonService: UserForCommonService,
    public $message: FiLinkModalService,
    public $dateHelper: DateHelperService,
  ) {
    this.areaLanguage = this.$nzI18n.getLocaleData(LanguageEnum.facility);
  }
  /**
   * 打开责任单位选择器
   */
  public showModal(filterValue: FilterCondition): void  {
    if (!this.selectUnitName) {
      FacilityForCommonUtil.setTreeNodesStatus(this.treeNodes, []);
    }
    this.filterValue = filterValue;
    if (!this.filterValue.filterName) {
      this.filterValue.filterName = [];
    }
    this.treeSelectorConfig.treeNodes = this.treeNodes;
    if (this.filterValue.filterName && this.filterValue.filterName.length) {
      // 单位选择器回显
      FacilityForCommonUtil.setTreeNodesStatus(this.treeNodes, this.filterValue.filterName);
    }
    this.isVisible = true;
  }
  /**
   * 查询所有的区域
   */
  public queryDeptList(): void  {
    this.$userForCommonService.queryAllDepartment().subscribe((result: ResultModel<DepartmentUnitModel[]>) => {
      this.treeNodes = result.data || [];
    });
  }

  /**
   * 责任单位选择结果
   * param event
   */
  public selectDataChange(event: DepartmentUnitModel[]): void {
    let selectArr = [];
    let selectNameArr = [];
    this.selectUnitName = '';
    if (event.length > 0) {
      selectArr = event.map(item => {
        this.selectUnitName += `${item.deptName},`;
        return item.id;
      });
      selectNameArr = event.map(item => {
        return item.deptName;
      });
    }
    // 单位选择器回显数据时传给后台的id
    this.filterValue.filterName = selectArr;
    this.selectUnitName = this.selectUnitName.substring(0, this.selectUnitName.length - 1);
    if (selectArr.length === 0) {
      this.filterValue.filterValue = null;
    } else {
      // 输入框回显name
      this.filterValue.filterValue = selectNameArr;
    }
  }
  /**
   * 初始化单位选择器配置
   */
  public initTreeSelectorConfig(): void  {
    this.treeSetting = {
      check: {
        enable: true,
        chkStyle: 'checkbox',
        chkboxType: {'Y': '', 'N': ''},
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
    };
    this.treeSelectorConfig = {
      title: `${this.areaLanguage.selectUnit}`,
      width: '1000px',
      height: '300px',
      treeNodes: this.treeNodes,
      treeSetting: this.treeSetting,
      onlyLeaves: false,
      selectedColumn: [
        {
          title: this.areaLanguage.deptName, key: 'deptName', width: 100,
        },
        {
          title: this.areaLanguage.deptLevel, key: 'deptLevel', width: 100,
        },
        {
          title: this.areaLanguage.parentDept, key: 'parentDepartmentName', width: 100,
        }
      ]
    };
  }
}
