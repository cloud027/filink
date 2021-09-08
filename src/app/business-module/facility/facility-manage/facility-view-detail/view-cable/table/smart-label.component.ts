import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TableConfigModel} from '../../../../../../shared-module/model/table-config.model';
import {PageModel} from '../../../../../../shared-module/model/page.model';
import {QueryConditionModel, SortCondition} from '../../../../../../shared-module/model/query-condition.model';
import {FacilityLanguageInterface} from '../../../../../../../assets/i18n/facility/facility.language.interface';
import {InspectionLanguageInterface} from '../../../../../../../assets/i18n/inspection-task/inspection.language.interface';
import {NzI18nService} from 'ng-zorro-antd';
import {Result} from '../../../../../../shared-module/entity/result';
import {FacilityService} from '../../../../../../core-module/api-service/facility/facility-manage';
import {FiLinkModalService} from '../../../../../../shared-module/service/filink-modal/filink-modal.service';
import {FacilityApiService} from '../../../../share/service/facility/facility-api.service';

/**
 * 智能标签列表组件
 */
@Component({
  selector: 'app-smart-label',
  templateUrl: './smart-label.component.html',
  styleUrls: ['./smart-label.component.scss']
})
export class SmartLabelComponent implements OnInit {
  // 光缆段id
  @Input() public opticCableSectionId: string;
  // 智能标签列表弹框关闭
  @Output() public close = new EventEmitter();
  // 设施国际化
  public language: FacilityLanguageInterface;
  // 巡检国际化
  public InspectionLanguage: InspectionLanguageInterface;
  // 智能标签列表
  public label_dataSet = [];
  // 智能标签表格配置
  public label_tableConfig: TableConfigModel;
  // 智能标签列表分页
  public label_pageBean: PageModel = new PageModel(5);
  // 智能标签列表分页条件
  public label_queryCondition: QueryConditionModel = new QueryConditionModel();

  constructor(
    public $nzI18n: NzI18nService,
    public $facilityService: FacilityService,
    private $facilityApiService: FacilityApiService,
    public $modalService: FiLinkModalService,
  ) {
  }

  public ngOnInit(): void {
    this.InspectionLanguage = this.$nzI18n.getLocaleData('inspection');
    this.language = this.$nzI18n.getLocaleData('facility');
    this.initLabelTableConfig();
    this.label_refreshData();
  }

  /**
   *获取智能标签列表
   */
  public label_refreshData(): void {
    this.label_tableConfig.isLoading = true;
    this.label_queryCondition.bizCondition.opticCableSectionId = this.opticCableSectionId;
    this.$facilityApiService.getSmartLabelList(this.label_queryCondition).subscribe((result: Result) => {
      this.label_tableConfig.isLoading = false;
      this.label_dataSet = result.data;
    }, () => {
      this.label_tableConfig.isLoading = false;
    });
  }

  /**
   * 关闭弹框
   */
  public handleCancel(): void {
    this.close.emit();
  }

  /**
   *初始化智能标签信息表单配置
   */
  public initLabelTableConfig(): void {
    this.label_tableConfig = {
      isDraggable: true,
      primaryKey: '03-6-7',
      isLoading: false,
      showSizeChanger: true,
      showPagination: false,
      notShowPrint: true,
      topButtons: [],
      scroll: {x: '1600px', y: '600px'},
      columnConfig: [
        {type: 'select', fixedStyle: {fixedLeft: true, style: {left: '0px'}}, width: 62},
        { // 标签ID
          title: this.language.tagID, key: 'rfidCode', width: 200,
          isShowSort: true, configurable: true
        },
        { // 经纬度
          title: this.language.latitudeAndLongitude, key: 'position', width: 200,
          isShowSort: true, configurable: true
        },
        { // 埋深
          title: this.language.buriedDepth, key: 'ruriedDepth', width: 200,
          isShowSort: true, configurable: true
        },
        { // 温度
          title: this.language.temperature, key: 'temperature', width: 200,
          isShowSort: true, configurable: true,
        },
        { // 是否震动
          title: this.language.whetherItIsShaking, key: 'vibrate', width: 200,
          isShowSort: true, configurable: true,
        },
        { // 距离起始位置（m）
          title: this.language.distanceStartingPosition,
          key: 'distanceStartingPosition',
          width: 200,
          isShowSort: true, configurable: true
        },
        { // 备注
          title: this.language.remarks, key: 'remark', width: 200,
          isShowSort: true, configurable: true
        },
        { // 操作
          title: this.language.operate,
          fixedStyle: {fixedRight: true, style: {right: '0px'}}, width: 100,
          searchConfig: {type: 'operate'},
        },
      ],
      bordered: false, showSearch: false,
      operation: [
        { // 删除
          text: this.language.deleteHandle,
          className: 'fiLink-delete red-icon',
          permissionCode: '03-6-3',
          canDisabled: true, needConfirm: true,
          handle: (data) => {
            const request = {
              opticStatusIdList: [data.opticStatusId]
            };
            this.$facilityApiService.deleteSmartLabelInfo(request).subscribe((result: Result) => {
              if (result.code === 0) {
                this.$modalService.success(result.msg);
                // 删除之后返回到第一页
                this.label_refreshData();
              } else {
                this.$modalService.error(result.msg);
              }
            });
          }
        },
      ],
      // 智能标签列表排序
      sort: (event: SortCondition) => {
        this.label_queryCondition.sortCondition.sortField = event.sortField;
        this.label_queryCondition.sortCondition.sortRule = event.sortRule;
        this.label_refreshData();
      },
    };
  }

}
