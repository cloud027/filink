import { Component, OnInit, Input } from '@angular/core';
import { NzI18nService } from 'ng-zorro-antd';
import {AlarmLanguageInterface} from 'src/assets/i18n/alarm/alarm-language.interface';
import {TreeSelectorConfigModel} from '../../../../model/tree-selector-config.model';
import { AlarmSelectorConfigModel, AlarmSelectorInitialValueModel } from '../../../../model/alarm-selector-config.model';
import {FacilityForCommonUtil} from '../../../../../core-module/business-util/facility/facility-for-common.util';
import {FacilityForCommonService} from '../../../../../core-module/api-service/facility/facility-for-common.service';
import {AlarmSelectorConfigTypeEnum} from '../../../../enum/alarm-selector-config-type.enum';
import {LanguageEnum} from '../../../../enum/language.enum';
import {FilterCondition} from '../../../../model/query-condition.model';
import { AreaModel } from 'src/app/core-module/model/facility/area.model';

/**
 * 区域选择器组件
 */
@Component({
  selector: 'app-area',
  templateUrl: './area.component.html',
  styleUrls: ['../alarm-name/alarm-name.component.scss']
})
export class AreaComponent implements OnInit {
  /** 父组件传入的区域选择器的相关配置项*/
  @Input() set areaConfig(areaConfig: AlarmSelectorConfigModel) {
    if (areaConfig) {
      this.areaConfigBackups = areaConfig;
      this.handleInputData();
    }
  }
  /** 默认过滤条件*/
  @Input() filterValue: FilterCondition;
  /** 是否展示区域选择器弹框*/
  public areaSelectVisible: boolean = false;
  /** 树选择器配置*/
  public treeSelectorConfig: TreeSelectorConfigModel;
  /** 该组件被使用的类型 表单/表格*/
  public useType: AlarmSelectorConfigTypeEnum  = AlarmSelectorConfigTypeEnum.table;
  /** 被使用的类型枚举*/
  public alarmSelectorConfigTypeEnum = AlarmSelectorConfigTypeEnum;
  /** 选中的区域列表数据*/
  public checkedAreaList: AlarmSelectorInitialValueModel = new AlarmSelectorInitialValueModel();
  /** 告警国际化*/
  public language: AlarmLanguageInterface;
  /** 区域选择器树的数据*/
  private areaSelectorConfig: TreeSelectorConfigModel = new TreeSelectorConfigModel();
  /** 父组件传入的区域选择器的相关配置项备份*/
  private areaConfigBackups: AlarmSelectorConfigModel;

  constructor(
    public $nzI18n: NzI18nService,
    private $facilityForCommonService: FacilityForCommonService,
  ) {
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.alarm);
  }
  ngOnInit() {
    // 初始化区域树配置项
    this.initTreeSelectorConfig();
  }

  /**
   * 打开区域选择器
   */
  public showAreaSelectorModal(): void {
    // 请求区域
    this.$facilityForCommonService.queryAreaList().subscribe((res) => {
      const data = res.data || [];
      FacilityForCommonUtil.setAreaNodesStatus(data, null, null);
      this.areaSelectorConfig.treeNodes = data;
      this.areaSelectVisible = true;
      // 如果有数据 就默认勾选
      if (this.checkedAreaList.ids && this.checkedAreaList.ids.length) {
        this.isCheckData(this.areaSelectorConfig.treeNodes, this.checkedAreaList.ids);
      } else {
        this.handleTreeData(this.areaSelectorConfig.treeNodes);
      }
      this.initTreeSelectorConfig();
    });
  }

  /**
   * 区域选择结果
   * param event
   */
  public selectDataChange(event: AreaModel[]): void {
    this.checkedAreaList = {
      ids: event.map(item => item.areaId ),
      name: event.map(item => item.areaName).join(','),
      areaCode: event.map(item => item.areaCode ),
    };
    if ( this.useType === AlarmSelectorConfigTypeEnum.table ) {
      this.filterValue.filterValue = this.checkedAreaList.ids;
      this.filterValue.filterName = this.checkedAreaList.name;
    }
    this.areaConfigBackups.handledCheckedFun(this.checkedAreaList);
  }

  /**
   * 递归循环 勾选数据
   * param data
   * param ids
   */
  private isCheckData(data: AreaModel[], ids: string[]): void {
    ids.forEach( id => {
      data.forEach(item => {
        item.id = item.areaId;
        if ( id === item.areaId ) {
          item.checked = true;
        }
        if (item.children) {
          this.isCheckData(item.children, ids);
        }
      });
    });
  }

  /**
   * 处理树结构，添加id和value属性，转化为树组件需要的结构
   * param data
   */
  private handleTreeData(data: AreaModel[]): void {
    data.forEach(item => {
      item.id = item.areaId;
      item.value = item.areaId;
      if (item.children) {
        this.handleTreeData(item.children);
      }
    });
  }

  /**
   * 初始化树选择器配置
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
          enable: false,
          idKey: 'areaId',
        },
        key: {
          name: 'areaName'
        },
      },
      view: {
        showIcon: false,
        showLine: false
      }
    };
    this.treeSelectorConfig = {
      title: this.language.area,
      width: '1000px',
      height: '300px',
      treeNodes: this.areaSelectorConfig.treeNodes,
      treeSetting,
      onlyLeaves: false,
      selectedColumn: [
        {
          title: this.language.areaNames, key: 'areaName', width: 300,
        }
      ]
    };
  }

  /**
   * 处理父组件传入的数据
   */
  private handleInputData(): void {
    if ( this.areaConfigBackups.type ) {
      this.useType = this.areaConfigBackups.type;
    }
    // 获取默认数据
    if ( this.areaConfigBackups.initialValue &&  this.areaConfigBackups.initialValue.ids
      && this.areaConfigBackups.initialValue.ids.length ) {
      this.checkedAreaList = this.areaConfigBackups.initialValue;
    }

    if ( this.areaConfigBackups.clear ) {
      // 清除数据
      this.checkedAreaList = new AlarmSelectorInitialValueModel();
    }
  }
}
