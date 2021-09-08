import {AfterContentInit, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {IndexLanguageInterface} from '../../../../../assets/i18n/index/index.language.interface';
import {SelectGroupDataModel, SelectGroupItemModel} from '../../shared/model/facility-condition.model';
import {QueryConditionModel} from '../../../../shared-module/model/query-condition.model';
import {NzI18nService} from 'ng-zorro-antd';
import {IndexFacilityService} from '../../../../core-module/api-service/index/facility';
import {MapStoreService} from '../../../../core-module/store/map.store.service';
import {LanguageEnum} from '../../../../shared-module/enum/language.enum';
import {ResultModel} from '../../../../shared-module/model/result.model';
import {ResultCodeEnum} from '../../../../shared-module/enum/result-code.enum';
import {GroupTypeEnum} from '../../shared/enum/index-enum';
import {indexCoverageType} from '../../../../core-module/const/index/index.const';



@Component({
  selector: 'app-facility-group',
  templateUrl: './facility-group.component.html',
  styleUrls: ['./facility-group.component.scss']
})
export class FacilityGroupComponent implements OnInit, AfterContentInit {

  // 数据回显
  @Input() facilityGroupList: string[];
  // 发送选中的分组
  @Output() selectGroupItemEmit = new EventEmitter<string[]>();
  // 国际化
  public indexLanguage: IndexLanguageInterface;
  // 选中可选项目
  public selectGroupItem: SelectGroupItemModel[] = [];
  // 选中的分组
  public selectGroupValue = [];
  // 分组列表查询条件
  public queryGroupListCondition: QueryConditionModel = new QueryConditionModel();
  // 分组全选
  public isGroupAllChecked: boolean = true;
  // 分组类型
  public groupTypeEnum = GroupTypeEnum;
  // 展示全部分组
  public showAllGroup: boolean = true;
  // 已选分组
  public groupSelectList: SelectGroupItemModel[] = [];
  // 当前选中样式
  public active: string = this.groupTypeEnum.allGroup;
  // 搜索值
  public searchKey: string;
  // 搜索信息配置
  public selectInfo = {
    data: [],
    label: 'label',
    value: 'code'
  };
  // 分组暂无数据显示样式
  public groupNoData: boolean = false;
  // 区域缓存为空标识
  private isDataNull: string = 'noData';

  constructor(public $nzI18n: NzI18nService,
              public $IndexFacilityService: IndexFacilityService,
              private $mapStoreService: MapStoreService) {
    this.indexLanguage = $nzI18n.getLocaleData(LanguageEnum.index);
  }

  public ngOnInit(): void {
  }

  public ngAfterContentInit(): void {
    this.getGroupList();
  }


  /**
   * 查询分组列表
   */
  public getGroupList(): void {
    delete this.queryGroupListCondition.pageCondition;
    this.$IndexFacilityService.queryGroupInfoList(this.queryGroupListCondition).subscribe((result: ResultModel<SelectGroupDataModel[]>) => {
      if (result.code === ResultCodeEnum.success) {
        const children: Array<{ label: string; value: string; check: boolean; }> = [];
        result.data.forEach(f => {
          children.push({label: f.groupName, value: f.groupId, check: true});
        });
        children.push({label: this.indexLanguage.unclassified, value: indexCoverageType.noGroup, check: true});
        this.selectGroupItem = children;
        if (this.$mapStoreService.logicGroupList.length) {
          // 当缓存数据不等于全部分组数据时，全部分组框不选中
          if (this.$mapStoreService.logicGroupList.length !== this.selectGroupItem.length || this.$mapStoreService.logicGroupList[0] === this.isDataNull ) {
            this.isGroupAllChecked = false;
          }
          this.selectGroupValue = this.$mapStoreService.logicGroupList;
        } else {
          this.selectGroupItem.forEach(item => {
            this.selectGroupValue.push(item.value);
          });
          this.$mapStoreService.logicGroupList = this.selectGroupValue;
        }
        this.selectGroupItem.forEach(item => {
          item.check = this.selectGroupValue.includes(item.value);
          if (item.check) {
            this.groupSelectList.push(item);
          }
        });
        this.groupNoData = true;
      }
    });
  }

  /**
   * 发送选中的分组
   */
  public selectItemOption(): void {
    this.$mapStoreService.logicGroupList = this.selectGroupValue;
    this.selectGroupItemEmit.emit(this.selectGroupValue);
  }

  /**
   * 点击全部分组
   */
  public groupChange(): void {
    this.isGroupAllChecked = !this.isGroupAllChecked;
    const groupSelect = [];
    if (!this.isGroupAllChecked) {
      this.selectGroupValue = [];
      this.selectGroupValue.push(this.isDataNull);
      this.selectItemOption();
      this.groupSelectList = [];
      this.selectGroupItem.forEach(item => {
        item.check = false;
      });
    } else {
      this.selectGroupItem.forEach(item => {
        item.check = true;
        groupSelect.push(item.value);
        this.selectGroupValue = groupSelect;
      });
      this.selectItemOption();
      this.groupSelectList = this.selectGroupItem;
    }
  }

  /**
   * 点击单个分组
   */
  public itemChange(item: SelectGroupItemModel): void {
    const groupSelect = [];
    this.groupSelectList = [];
    let checkNum = 0;
    this.selectGroupItem.forEach(data => {
      if (data.label === item.label) {
        data.check = !data.check;
      }
    });
    this.selectGroupItem.forEach(data => {
      if (data.check) {
        checkNum += 1;
        groupSelect.push(data.value);
        this.groupSelectList.push(data);
      }
    });
    this.selectGroupValue = groupSelect;
    this.selectItemOption();
    if (checkNum === this.selectGroupItem.length) {
      this.isGroupAllChecked = true;
    } else if (checkNum === 0) {
      this.isGroupAllChecked = false;
      this.selectGroupValue.push(this.isDataNull);
      this.selectItemOption();
    } else {
      this.isGroupAllChecked = false;
    }
  }

  /**
   * 显示全部分组或已选分组
   */
  public showGroup(groupType: string): void {
    this.active = groupType;
    // 点击全部分组时，显示全部分组部分
    this.showAllGroup = groupType !== this.groupTypeEnum.selectedGroup;
  }

  /**
   * 搜素某个分组
   */
  public modelChange(event: string): boolean {
    const groupSelect = [];
    document.getElementById(event).scrollIntoView(true);
    this.selectGroupItem.forEach(item => {
      if (item.value === event) {
        item.check = true;
        if (!this.selectGroupValue.includes(event)) {
          this.groupSelectList.push(item);
        }
      }
    });
    if (this.groupSelectList.length === this.selectGroupItem.length) {
      this.isGroupAllChecked = true;
    } else {
      this.isGroupAllChecked = false;
    }
    this.groupSelectList.forEach(item => {
      groupSelect.push(item.value);
    });
    this.selectGroupValue = groupSelect;
    this.selectItemOption();
    return false;
  }

  /**
   * 搜素框提示
   */
  public inputChange(event: string): void {
    if (event) {
      const node = this.selectGroupItem.filter(item => item.label.includes(event));
      const res = node.map(item => ({
          check: item.check,
          label: item.label,
          value: item.value,
          name: item.label,
          id: item.value,
        })
      );
      this.searchKey = event;
      this.selectInfo = {
        data: res,
        label: 'label',
        value:  'value'
      };
    } else {
      this.selectInfo = {
        data: [],
        label: 'label',
        value:  'value'
      };
    }
  }
}
