import {
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { Router } from '@angular/router';
import { NzI18nService, NzModalService } from 'ng-zorro-antd';
import * as _ from 'lodash';
import { TableComponent } from '../../../../../shared-module/component/table/table.component';
import { ImportMissionService } from '../../../../../core-module/mission/import.mission.service';
import { LockService } from '../../../../../core-module/api-service/lock';
import { FiLinkModalService } from '../../../../../shared-module/service/filink-modal/filink-modal.service';
import { FacilityService } from '../../../../../core-module/api-service/facility/facility-manage';
import { Download } from '../../../../../shared-module/util/download';
import {
  FilterCondition,
  QueryConditionModel,
  SortCondition,
} from '../../../../../shared-module/model/query-condition.model';
import { LanguageEnum } from '../../../../../shared-module/enum/language.enum';
import { FacilityForCommonUtil } from '../../../../../core-module/business-util/facility/facility-for-common.util';
import { SelectModel } from '../../../../../shared-module/model/select.model';
import { DeviceTypeEnum } from '../../../../../core-module/enum/facility/facility.enum';
import { ResultCodeEnum } from '../../../../../shared-module/enum/result-code.enum';
import { FacilityListModel } from '../../../../../core-module/model/facility/facility-list.model';
import { CommonLanguageInterface } from '../../../../../../assets/i18n/common/common.language.interface';
import { PageModel } from '../../../../../shared-module/model/page.model';
import { TableConfigModel } from '../../../../../shared-module/model/table-config.model';
import { WorkOrderLanguageInterface } from '../../../../../../assets/i18n/work-order/work-order.language.interface';
import { EquipmentTypeEnum } from '../../../../../core-module/enum/equipment/equipment.enum';
import { DismantleBarrierWorkOrderService } from '../../../share/service/dismantle-barrier/dismantle-barrier-work-order.service';
import { Result } from '../../../../../shared-module/entity/result';
import { DismantleTypeEnum } from '../../../share/enum/dismantle-barrier.config.enum';

@Component({
  selector: 'app-dismantle-ponit-model',
  templateUrl: './dismantle-ponit-model.component.html',
  styleUrls: ['./dismantle-ponit-model.component.scss'],
})
export class DismantlePonitModelComponent implements OnInit {
  // 表格实例
  @ViewChild('tableComponent') private _tableComponent: TableComponent;
  // 设施类型模板
  @ViewChild('equipmentTypeTemplate') equipmentTypeTemplate: TemplateRef<HTMLDocument>;
  // 单选按钮
  @ViewChild('radioTemp') radioTemp: TemplateRef<HTMLDocument>;
  // 设施状态
  @ViewChild('deviceTypeTemp') deviceTypeTemp: TemplateRef<HTMLDocument>;
  // 设施图标
  @ViewChild('deviceTemp') public deviceTemp: TemplateRef<any>;
  // 多选数据时的回显key数组
  @Input() public selectedEquipments: any = [];
  /** 设施根据 所选设施 过滤 */
  @Input() deviceId: string;
  /** title */
  @Input() title;

  // 弹框显示状态
  @Input()
  set dismantlePointVisible(params) {
    this._dismantlePointVisible = params;
    this.dismantlePointVisibleChange.emit(this._dismantlePointVisible);
  }
  // 获取modal框显示状态
  get dismantlePointVisible() {
    return this._dismantlePointVisible;
  }
  /** 选择的 设备 id */
  @Input() public selectEquipmentId: string = '';

  /** 是否是 详情页面进入 */
  @Input() isDetailPage: boolean = false;
  /** 详情页进入的时候 判断是 设施还是设备类型 */
  @Input() selectedType: DismantleTypeEnum;
  /** 详情页面 如果是 拆除类型选择的是 设备类型  点位的表格数据 是传递的数据*/
  @Input() gainTableData: [] = [];
  /** 是否是编辑页面进入 true 说明从编辑页面进入，只能单选  */
  @Input() isEditPage: boolean = false;

  // 显示隐藏变化
  @Output() public dismantlePointVisibleChange = new EventEmitter<any>();
  // 选中的值变化
  @Output() public selectDataChange = new EventEmitter<any>();
  // 显示隐藏
  public _dismantlePointVisible = false;
  // 设备类型枚举
  public equipmentTypeEnum = EquipmentTypeEnum;

  /** 设施设备类型 */
  dismantleTypeEnum = DismantleTypeEnum;

  // 默认查询设施类型
  deviceFilterCondition: FilterCondition;
  // 登录有权限设施类型
  private deviceRoleTypeList: SelectModel[];
  /** 已选数据 */
  public _selectedData: FacilityListModel[] = [];
  // 设施枚举
  public deviceTypeCode = DeviceTypeEnum;

  dataSet: [] = [];
  pageBean: PageModel = new PageModel();
  // 表格配置
  public tableConfig: TableConfigModel;
  // 查询参数
  public queryCondition: QueryConditionModel = new QueryConditionModel();

  // 首页语言包
  public commonLanguage: CommonLanguageInterface;
  language: WorkOrderLanguageInterface;
  // 国际化前缀枚举
  public languageEnum = LanguageEnum;

  /**
   * 构造器
   */
  constructor(
    public $nzModalService: NzModalService,
    public $nzI18n: NzI18nService,
    public $message: FiLinkModalService,
    public $modal: NzModalService,
    public $lockService: LockService,
    public $facilityService: FacilityService,
    public $refresh: ImportMissionService,
    public $download: Download,
    public $router: Router,
    public $dismantleBarrierWorkOrderService: DismantleBarrierWorkOrderService,
  ) {}

  /**
   * 组件初始化
   */
  public ngOnInit(): void {
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.workOrder);
    this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
    this.deviceRoleTypeList = FacilityForCommonUtil.getRoleFacility(this.$nzI18n);
    this._selectedData = this.selectedEquipments || [];
    this.gainInitTableConfig();
    // 不是详情页面进入
    if (!this.isDetailPage) {
      // 查询列表数据
      this.refreshData();
    } else {
      if (this.selectedType === DismantleTypeEnum.device) {
        // 查询列表数据
        this.refreshData();
      } else if (this.selectedType === DismantleTypeEnum.equipment) {
        this.dataSet = this.gainTableData;
      }
      this.tableConfig.isLoading = false;
    }
  }

  /** 表格 配置 编辑页面和新增页面的选择 */
  setTableConfig() {
    // 编辑页面，单选
    if (this.isEditPage) {
      return {
        type: 'render',
        renderTemplate: this.radioTemp,
        fixedStyle: { fixedLeft: true, style: { left: '0px' } },
        width: 62,
      };
    } else {
      return {
        type: this.isDetailPage ? '' : 'select',
        fixedStyle: { fixedLeft: true, style: { left: '0px' } },
        width: 62,
        hidden: this.isDetailPage,
      };
    }
  }
  /**
   * 初始化表格配置
   */
  gainInitTableConfig(): void {
    this.tableConfig = {
      isDraggable: true,
      isLoading: true,
      outHeight: 108,
      showSizeChanger: true,
      showSearchSwitch: !this.isDetailPage,
      scroll: { x: '1804px', y: '340px' },
      noIndex: true,
      showSearchExport: false,
      notShowPrint: true,
      keepSelected: true,
      showPagination: !this.isDetailPage,
      bordered: false,
      showSearch: false,
      selectedIdKey: 'equipmentId',
      columnConfig: [
        this.setTableConfig(),
        {
          type: 'serial-number',
          title: this.commonLanguage.serialNumber,
          fixedStyle: { fixedLeft: true, style: { left: '62px' } },
          width: 62,
          hidden: this.isDetailPage,
        },
        // 点位
        {
          title: this.language.ponit,
          key: 'mountPosition',
          width: 150,
          isShowSort: true,
          searchable: true,
          searchConfig: { type: 'input' },
        },
        // 设备类型
        {
          title: this.language.equipmentType,
          key: 'equipmentType',
          width: 150,
          type: 'render',
          minWidth: 150,
          isShowSort: true,
          searchable: true,
          renderTemplate: this.equipmentTypeTemplate,
          searchConfig: {
            type: 'select',
            selectType: 'multiple',
            selectInfo: FacilityForCommonUtil.getRoleEquipmentType(this.$nzI18n),
            label: 'label',
            value: 'code',
          },
        },
        // 设备名称
        {
          title: this.language.equipmentName,
          key: 'equipmentName',
          width: 300,
          type: 'input',
          isShowSort: true,
          searchable: true,
          searchConfig: { type: 'input' },
        },
        // 设备ID
        {
          title: this.language.equipmentId,
          key: 'sequenceId',
          width: 300,
          type: 'input',
          isShowSort: true,
          searchable: true,
          searchConfig: { type: 'input' },
        },
        // 资产编号
        {
          title: this.language.assetNumber,
          key: 'equipmentCode',
          width: 150,
          isShowSort: true,
          searchable: true,
          searchConfig: { type: 'input' },
        },
        {
          // 操作
          title: this.commonLanguage.operate,
          searchable: true,
          searchConfig: { type: 'operate' },
          key: '',
          width: 180,
          fixedStyle: { fixedRight: true, style: { right: '0px' } },
        },
      ],
      topButtons: [],
      operation: [],
      rightTopButtons: [],
      // 勾选事件
      handleSelect: (event) => {
        this._selectedData = event;
        this.selectedEquipments = event;
      },
      sort: (event: SortCondition) => {
        this.queryCondition.sortCondition.sortField = event.sortField;
        this.queryCondition.sortCondition.sortRule = event.sortRule;
        this.refreshData();
      },
      handleSearch: (event: FilterCondition[]) => {
        this.queryCondition.pageCondition.pageNum = 1;
        this.queryCondition.filterConditions = event;
        this.refreshData();
      },
    };
    if (this.isDetailPage) {
      this.tableConfig.columnConfig.map((item) => {
        if (item.isShowSort) { delete item.isShowSort; }
      });
    }
  }

  /**
   * 刷新表格数据
   */
  refreshData() {
    const isAddProCreMove = this.isDetailPage ? null : '0';
    const bizCondition = {
      deviceId: this.deviceId,
      isAddProCreMove,
    };
    this.queryCondition.bizCondition = bizCondition;
    this.$dismantleBarrierWorkOrderService.dismantlePointList_API(this.queryCondition).subscribe(
      (res: Result) => {
        this.dataSet = [];
        if (res.code === ResultCodeEnum.success) {
          this.pageBean.Total = res.totalCount;
          this.pageBean.pageSize = res.size;
          this.pageBean.pageIndex = res.pageNum;
          this.dataSet = res.data;
        }
        this.tableConfig.isLoading = false;
      },
      () => {
        this.tableConfig.isLoading = false;
      },
    );
  }
  public pageChange(event): void {
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
    this.refreshData();
  }

  /**
   * 单选设备
   */
  public onEquipmentChange(event: string, data): void {
    this.selectEquipmentId = event;
    this._selectedData = [data];
  }

  Confirm() {
    const data = this._selectedData;
    this.selectDataChange.emit(data);
    this.dismantlePointVisible = false;
  }

  clearSelectData() {
    this._tableComponent.keepSelectedData.clear();
    this._tableComponent.checkStatus();
    this._selectedData = [];
    this.selectedEquipments = [];
    this.selectEquipmentId = null;
    this.refreshData();
  }
}
