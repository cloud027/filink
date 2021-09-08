import {DepartmentUnitModel} from '../../../../core-module/model/work-order/department-unit.model';
import {TreeSelectorConfigModel} from '../../../model/tree-selector-config.model';
import {FilterCondition} from '../../../model/query-condition.model';
import {ResultModel} from '../../../model/result.model';
import {ResultCodeEnum} from '../../../enum/result-code.enum';
import {UserForCommonService} from '../../../../core-module/api-service/user';
import * as _ from 'lodash';
import {FiLinkModalService} from '../../../service/filink-modal/filink-modal.service';
import {LanguageEnum} from '../../../enum/language.enum';
import {NzI18nService} from 'ng-zorro-antd';
import {FacilityLanguageInterface} from '../../../../../assets/i18n/facility/facility.language.interface';
import {OperatorEnum} from '../../../enum/operator.enum';
import {UserForCommonUtil} from '../../../../core-module/business-util/user/user-for-common.util';

/**
 * 责任单位选择器公共TS
 * 用于列表上的责任单位查询
 * 与页面模板配合使用 使用时必须先初始化配置调用 initTreeSelectorConfig
 */
export class ListUnitSelector {
  // 已选择责任单位名称
  public selectUnitName: string = '';
  // 责任单位选择器隐藏显示
  public isVisible: boolean = false;
  // 树选择器配置
  public treeSelectorConfig: TreeSelectorConfigModel;
  // 树的数据
  public treeNodes: DepartmentUnitModel[] = [];
  // 设施语言包
  public language: FacilityLanguageInterface;
  // 过滤的值
  private filterValue: FilterCondition;

  constructor(public $userService: UserForCommonService,
              public $nzI18n: NzI18nService,
              public $message: FiLinkModalService) {
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.facility);
  }

  /**
   * 责任单位选择结果
   * param event
   */
  public selectDataChange(event: DepartmentUnitModel[], isDeptCodeSearch: boolean): void {
    let selectArr = [];
    this.selectUnitName = '';
    if (event.length > 0) {
      selectArr = event.map(item => {
        this.selectUnitName += `${item.deptName},`;
        if (isDeptCodeSearch) {
          return item.deptCode;
        } else {
          return item.id;
        }
      });
    }
    this.filterValue.filterName = event.map(item => item.deptName).join(',');
    this.selectUnitName = this.selectUnitName.substring(0, this.selectUnitName.length - 1);
    if (selectArr.length === 0) {
      this.filterValue.filterValue = null;
    } else {
      this.filterValue.filterValue = selectArr;
    }
  }

  /**
   * 打开责任单位选择器
   * @param filterValue FilterCondition
   * @param key 用于回显，默认为id，可能值为deptCode
   */
  public showModal(filterValue: FilterCondition, key?: string): void {
    if (!this.selectUnitName) {
      UserForCommonUtil.setTreeNodesStatus(this.treeNodes, []);
    }
    this.filterValue = filterValue;
    this.filterValue.operator = OperatorEnum.in;
    if (!this.filterValue.filterValue) {
      this.filterValue.filterValue = [];
    }
    // 当责任单位数据不为空的时候
    if (!_.isEmpty(this.treeNodes)) {
      this.treeSelectorConfig.treeNodes = this.treeNodes;
      if (this.filterValue.filterValue.length) {
        UserForCommonUtil.setTreeNodesStatus(this.treeNodes, this.filterValue.filterValue, {idKey: key});
      }
      this.isVisible = true;
    } else {
      this.$userService.queryTotalDept().subscribe((result: ResultModel<DepartmentUnitModel[]>) => {
        if (result.code === ResultCodeEnum.success) {
          this.treeNodes = result.data || [];
          if (this.filterValue.filterValue.length) {
            UserForCommonUtil.setTreeNodesStatus(this.treeNodes, this.filterValue.filterValue, {idKey: key});
          }
          this.treeSelectorConfig.treeNodes = this.treeNodes;
          this.isVisible = true;
        } else {
          this.$message.error(result.msg);
        }
      });
    }
  }

  /**
   * 初始化单位选择器配置
   */
  public initTreeSelectorConfig(): void {
    const treeSetting = {
      check: {
        enable: true,
        chkboxType: {'Y': '', 'N': ''},
        chkStyle: 'checkbox',
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
        showIcon: false,
        showLine: false
      }
    };
    this.treeSelectorConfig = {
      title: `${this.language.selectUnit}`,
      treeNodes: this.treeNodes,
      treeSetting: treeSetting,
      width: '1000px',
      height: '300px',
      onlyLeaves: false,
      selectedColumn: [
        {
          title: this.language.deptName, key: 'deptName', width: 100,
        },
        {
          title: this.language.deptLevel, key: 'deptLevel', width: 100,
        },
        {
          title: this.language.parentDept, key: 'parentDepartmentName', width: 100,
        }
      ]
    };
  }

}
