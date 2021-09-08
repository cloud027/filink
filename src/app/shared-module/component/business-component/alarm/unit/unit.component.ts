import {Component, Input, OnInit} from '@angular/core';
import {NzI18nService} from 'ng-zorro-antd';
import {AlarmLanguageInterface} from 'src/assets/i18n/alarm/alarm-language.interface';
import {TreeSelectorConfigModel} from '../../../../model/tree-selector-config.model';
import {AlarmSelectorConfigModel, AlarmSelectorInitialValueModel} from '../../../../model/alarm-selector-config.model';
import {SessionUtil} from '../../../../util/session-util';
import {UserForCommonService} from '../../../../../core-module/api-service/user/user-for-common.service';
import {FilterCondition} from '../../../../model/query-condition.model';
import {AlarmSelectorConfigTypeEnum} from '../../../../../shared-module/enum/alarm-selector-config-type.enum';
import {DepartmentUnitModel} from '../../../../../core-module/model/work-order/department-unit.model';
import { ADMIN_USER_ID } from '../../../../../core-module/const/common.const';
import {LanguageEnum} from '../../../../enum/language.enum';

/**
 * 责任单位选择器组件
 */
@Component({
  selector: 'app-unit',
  templateUrl: './unit.component.html',
  styleUrls: ['../alarm-name/alarm-name.component.scss']
})
export class UnitComponent implements OnInit {
  /** 父组件传入的责任单位选择器的相关配置项*/
  @Input() set unitConfig(unitConfig: AlarmSelectorConfigModel) {
    if (unitConfig) {
      this.unitConfigBackups = unitConfig;
      this.handleInputData();
    }
  }
  /** 默认过滤条件*/
  @Input() filterValue: FilterCondition;
  /** 树选择器配置*/
  public treeSelectorConfig: TreeSelectorConfigModel;
  /** 是否显示责任单位树弹框*/
  public isVisible: boolean = false;
  /** 该组件被使用的类型 表单/表格*/
  public useType: AlarmSelectorConfigTypeEnum  = AlarmSelectorConfigTypeEnum.table;
  /** 被使用的类型枚举*/
  public alarmSelectorConfigTypeEnum = AlarmSelectorConfigTypeEnum;
  /** 勾选的责任单位*/
  public checkUnit: AlarmSelectorInitialValueModel = new AlarmSelectorInitialValueModel();
  /** 告警国际化*/
  public language: AlarmLanguageInterface;
  /** 责任单位选择器树的数据*/
  private treeNodes: DepartmentUnitModel[] = [];
  /** 父组件传入的责任单位选择器的相关配置项备份*/
  private unitConfigBackups: AlarmSelectorConfigModel;
  /** 从缓存中获取的用户的相关信息*/
  private userInfo = {id: '', deptId: ''};


  constructor(
    private $userCommonService: UserForCommonService,
    public $nzI18n: NzI18nService,
  ) {
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.alarm);
  }

  ngOnInit() {
    // 获取当前用户的单位
    const {id, deptId} = SessionUtil.getUserInfo();
    this.userInfo = {id, deptId};
    this.queryDeptList();
    this.initTreeSelectorConfig();
  }

    /**
   * 责任单位选择结果
   * param event
   */
  public selectDataChange(event: DepartmentUnitModel[]): void {
    this.checkUnit = {
      ids: event.map(item => item.id ),
      name: event.map(item => item.deptName).join(',')
    };
    if ( this.useType === AlarmSelectorConfigTypeEnum.table ) {
      this.filterValue.filterValue = this.checkUnit.ids;
    }
    this.unitConfigBackups.handledCheckedFun(this.checkUnit);
  }

  /**
   * 打开责任单位选择器
   */
  public showModal(): void {
      this.isVisible = true;
      // 根据当前用户 权限效验
      if ( this.treeNodes && this.treeNodes.length ) {
        this.isDisabled();
      }
      // 如果有数据 就默认勾选
      if ( this.checkUnit.ids && this.checkUnit.ids.length ) {
        this.isCheckData(this.treeNodes, this.checkUnit.ids);
      }
      this.initTreeSelectorConfig();
  }

  /**
   * 处理父组件传入的数据
   */
  private handleInputData(): void {
    // 获取类型
    if (this.unitConfigBackups.type) {
      this.useType = this.unitConfigBackups.type;
    }
    // 获取默认数据
    if (this.unitConfigBackups.initialValue && this.unitConfigBackups.initialValue.ids
      && this.unitConfigBackups.initialValue.ids.length) {
      this.checkUnit = this.unitConfigBackups.initialValue;
    }
    if (this.unitConfigBackups.clear) {
      this.checkUnit = new AlarmSelectorInitialValueModel();
    }
  }

  /**
   * 初始化单位选择器配置
   */
  private initTreeSelectorConfig(): void {
    const treeSetting = {
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
      title: this.language.selectUnit,
      width: '1000px',
      height: '300px',
      treeNodes: this.treeNodes,
      treeSetting,
      onlyLeaves: false,
      selectedColumn: [
        {
          title: this.language.unitName, key: 'deptName', width: 100,
        },
        {
          title: this.language.unitLevel, key: 'deptLevel', width: 100,
        },
        {
          title: this.language.placeUnit, key: 'parentDepartmentName', width: 100,
        }
      ]
    };
  }

  /**
   * 递归循环 勾选数据
   * param data
   * param ids
   */
  private isCheckData(data: DepartmentUnitModel[], ids: string[]): void {
    ids.forEach( id => {
      data.forEach(item => {
         if ( id === item.id ) {
             item.checked = true;
         }
         if (item.childDepartmentList) {
           this.isCheckData(item.childDepartmentList, ids);
         }
      });
    });
  }

  /**
   * 根据当前用户 权限效验
   */
  private isDisabled(): void {
    if ( this.userInfo.id !== ADMIN_USER_ID ) {
      // 非admin账户进入
      this.treeNodes.forEach(item => {
        if ( this.userInfo.deptId !== item.id ) {
          item.chkDisabled = true;
        } else {
          item.chkDisabled = false;
        }
      });
    }

  }

  /**
   * 查询所有的区域
   */
  private queryDeptList(): void {
    this.$userCommonService.queryAllDepartment().subscribe((result) => {
      this.treeNodes = result.data || [];
    });
  }

}
