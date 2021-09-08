import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NzI18nService} from 'ng-zorro-antd';
import {FiLinkModalService} from '../../../service/filink-modal/filink-modal.service';
import {PageModel} from '../../../model/page.model';
import {PageSizeEnum} from '../../../enum/page-size.enum';
import {TableConfigModel} from '../../../model/table-config.model';
import {FacilityLanguageInterface} from '../../../../../assets/i18n/facility/facility.language.interface';
import {LanguageEnum} from '../../../enum/language.enum';
import {FilterCondition, QueryConditionModel, SortCondition} from '../../../model/query-condition.model';
import {ResultModel} from '../../../model/result.model';
import {ResultCodeEnum} from '../../../enum/result-code.enum';
import {CommonLanguageInterface} from '../../../../../assets/i18n/common/common.language.interface';
import {GroupListModel} from '../../../../core-module/model/group/group-list.model';
import {FacilityForCommonService} from '../../../../core-module/api-service/facility';

/**
 * 设备下面的分组信息
 * created by PoHe
 */
@Component({
  selector: 'group-info-list',
  templateUrl: './group-info-list.component.html',
})
export class GroupInfoListComponent implements OnInit {
  // 设备id 入参
  @Input() public equipmentId: string;
  // 设施Id类型
  @Input() public deviceId: string;
  // 弹框显示状态
  @Input()
  set groupVisible(params) {
    this._groupVisible = params;
    this.groupVisibleChange.emit(this._groupVisible);
  }
  // 显示隐藏变化
  @Output() public groupVisibleChange = new EventEmitter<boolean>();
  // 获取modal框显示状态
  get groupVisible() {
    return this._groupVisible;
  }
  // 私有是否显示
  public _groupVisible: boolean = false;
  // 弹框是否显示
  // 分组数据集
  public dataSet: GroupListModel[] = [];
  // 分页参数
  public pageBean: PageModel = new PageModel(PageSizeEnum.sizeFive);
  // 列表参数
  public tableConfig: TableConfigModel = new TableConfigModel();
  // 设施语言包
  public language: FacilityLanguageInterface;
  // 公共的语言包
  public commonLanguage: CommonLanguageInterface;
  // 查询列表参数
  public queryCondition: QueryConditionModel = new QueryConditionModel();

  /**
   *  构造器
   */
  constructor(public $nzI18n: NzI18nService,
              public $message: FiLinkModalService,
              public $facilityForCommon: FacilityForCommonService) {
  }

  /**
   *  初始化列表
   */
  public ngOnInit(): void {
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.facility);
    this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
    // 初始化表格参数
    this.initTableConfig();
    //  查询列表
     this.queryData();
  }

  /**
   *  切换页面
   */
  public pageChange(event: PageModel): void {
   this.queryCondition.pageCondition.pageSize = event.pageSize;
   this.queryCondition.pageCondition.pageNum = event.pageIndex;
   this.queryData();
  }

  /**
   *  初始化表格数据
   */
  public initTableConfig(): void {
    this.tableConfig = {
      isDraggable: true,
      isLoading: true,
      showSearchSwitch: true,
      showSizeChanger: true,
      notShowPrint: true,
      scroll: {x: '1200px', y: '400px'},
      noIndex: true,
      noAutoHeight: true,
      showSearchExport: false,
      columnConfig: [
        { // 序号
          type: 'serial-number',
          width: 62,
          title: this.language.serialNumber
        },
        { // 分组名称
          title: this.language.groupName,
          key: 'groupName',
          width: 200,
          configurable: false,
          searchable: true,
          isShowSort: true,
          searchConfig: {type: 'input'}
        },
        { // 备注
          title: this.language.remarks,
          key: 'remark',
          isShowSort: true,
          configurable: false,
          width: 200,
          searchable: true,
          searchConfig: {
            type: 'input'
          }
        },
        { // 操作
          title: this.commonLanguage.operate, searchable: true,
          searchConfig: {type: 'operate'}, key: '', width: 150
        }
      ],
      showPagination: true,
      // 排序
      sort: (event: SortCondition) => {
        this.queryCondition.sortCondition.sortField = event.sortField;
        this.queryCondition.sortCondition.sortRule = event.sortRule;
        this.queryData();
      },
      // 过滤查询
      handleSearch: (event: FilterCondition[]) => {
        this.queryCondition.pageCondition.pageNum = 1;
        this.queryCondition.filterConditions = event;
        this.queryData();
      }
    };
  }

  /**
   * 查询列表数据
   */
  public queryData(): void {
    this.tableConfig.isLoading = true;
    this.queryCondition.bizCondition = {equipmentId: this.equipmentId, deviceId: this.deviceId};
    this.$facilityForCommon.queryGroupInfoByEquipmentId(this.queryCondition).subscribe(
      (result: ResultModel<GroupListModel[]>) => {
      if (result.code === ResultCodeEnum.success) {
        this.tableConfig.isLoading = false;
        this.dataSet = result.data;
        this.pageBean.pageIndex = result.pageNum;
        this.pageBean.Total = result.totalCount;
        this.pageBean.pageSize = result.size;
      } else {
        this.tableConfig.isLoading = false;
        this.$message.error(result.msg);
      }
    }, () => { this.tableConfig.isLoading = false; });
  }
}
