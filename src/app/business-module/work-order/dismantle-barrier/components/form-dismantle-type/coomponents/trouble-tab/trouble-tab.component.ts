import {
  Component,
  OnInit,
  ViewChild,
  TemplateRef,
  Output,
  EventEmitter,
  Input,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DateHelperService, NzI18nService, NzModalService, NzTreeNode } from 'ng-zorro-antd';

import { TroubleForCommonService } from '../../../../../../../core-module/api-service/trouble';
import { FiLinkModalService } from '../../../../../../../shared-module/service/filink-modal/filink-modal.service';
import { TroubleUtil } from '../../../../../../../core-module/business-util/trouble/trouble-util';
import { RuleUtil } from '../../../../../../../shared-module/util/rule-util';
import { UserForCommonService } from '../../../../../../../core-module/api-service/user';
import { AlarmForCommonService } from '../../../../../../../core-module/api-service/alarm';
import { TroubleService } from '../../../../../../trouble/share/service';
import { AlarmStoreService } from '../../../../../../../core-module/store/alarm.store.service';

import { TroubleListComponent } from '../../../../../../trouble/trouble-manage/trouble-list/trouble-list.component';

import { AlarmForCommonUtil } from '../../../../../../../core-module/business-util/alarm/alarm-for-common.util';
import {
  FilterCondition,
  SortCondition,
} from '../../../../../../../shared-module/model/query-condition.model';
import { OperatorEnum } from '../../../../../../../shared-module/enum/operator.enum';
import { PageModel } from '../../../../../../../shared-module/model/page.model';
import { SelectEquipmentModel } from '../../../../../../../core-module/model/equipment/select-equipment.model';
import { SelectDeviceModel } from '../../../../../../../core-module/model/facility/select-device.model';
import { TroubleModel } from '../../../../../../../core-module/model/trouble/trouble.model';
import { TroubleHintListEnum } from '../../../../../../trouble/share/enum/trouble.enum';
import { FacilityForCommonUtil } from '../../../../../../../core-module/business-util/facility/facility-for-common.util';
import { SessionUtil } from '../../../../../../../shared-module/util/session-util';
import { SelectModel } from '../../../../../../../shared-module/model/select.model';
import { DismantleWarnTroubleEnum } from '../../../../../share/enum/dismantle-barrier.config.enum';
import { TroubleToolService } from '../../../../../../../core-module/api-service/trouble/trouble-tool.service';

@Component({
  selector: 'app-trouble-tab',
  templateUrl: './trouble-tab.component.html',
  styleUrls: ['./trouble-tab.component.scss'],
})
export class TroubleTabComponent extends TroubleListComponent implements OnInit {
  // 单选
  @ViewChild('radioTemp') radioTemp: TemplateRef<any>;
  /** 表格单选框的点击事件 */
  @Output() radioClickChange = new EventEmitter<any>();
  /** 选中的 id */
  @Input() selectedTroubldId: string;
  /** 选中的 name */
  @Input() selectedTroubldName: string;
  @Input() selectDataType: string;

  /** 数据过滤的条件 */
  @Input() filterData;
  // 已选择
  _selectedData: TroubleModel;
  constructor(
    public $router: Router,
    public $nzI18n: NzI18nService,
    public $troubleService: TroubleService,
    public $message: FiLinkModalService,
    public $active: ActivatedRoute,
    public $alarmStoreService: AlarmStoreService,
    public $troubleToolService: TroubleToolService,
    public $dateHelper: DateHelperService,
    public $ruleUtil: RuleUtil,
    public modalService: NzModalService,
    public $userService: UserForCommonService,
    public $alarmService: AlarmForCommonService,
  ) {
    super(
      $router,
      $nzI18n,
      $troubleService,
      $message,
      $active,
      $alarmStoreService,
      $troubleToolService,
      $dateHelper,
      $ruleUtil,
      modalService,
      $userService,
      $alarmService,
    );
  }

  ngOnInit() {
    // 故障类型
    this.getTroubleType();
    // 告警选择显示初始化
    this.troubleHintList = [
      {
        label: this.language.displayTroubleLevel,
        code: TroubleHintListEnum.troubleLevelCode,
      },
      {
        label: this.language.displayTroubleFacilityType,
        code: TroubleHintListEnum.troubleFacilityTypeCode,
      },
    ];
    // 设施权限
    this.deviceRoleTypes = FacilityForCommonUtil.getRoleFacility(this.$nzI18n);
    // 获取用户信息
    if (SessionUtil.getToken()) {
      this.token = SessionUtil.getToken();
      this.userInfo = SessionUtil.getUserInfo();
      this.userId = this.userInfo.id;
    }
    this.queryCondition.pageCondition.pageSize = this.pageBean.pageSize;
    this.queryCondition.pageCondition.pageNum = this.pageBean.pageIndex;
    this.init_Table();
    this.queryCondition.filterConditions = [
      {
        filterField: 'deviceId',
        filterValue: [this.filterData],
        operator: OperatorEnum.in,
      },
    ];
    this.refreshData();
  }
  /** 初始化表格 */
  init_Table() {
    this.tableConfig = {
      outHeight: 108,
      isDraggable: true,
      isLoading: false,
      showSearchSwitch: true,
      showSizeChanger: true,
      showSearchExport: false,
      searchReturnType: 'array',
      noIndex: true,
      notShowPrint: true,
      scroll: { x: '1200px', y: '600px' },
      columnConfig: [
        {
          type: 'render',
          key: 'selectedTroubldId',
          title: '',
          renderTemplate: this.radioTemp,
          fixedStyle: { fixedLeft: true, style: { left: '0px' } },
          width: 42,
        },
        {
          // 序号
          type: 'serial-number',
          width: 62,
          title: this.language.serialNumber,
          fixedStyle: { fixedLeft: true, style: { left: '42px' } },
        },
        {
          // 故障编号
          title: this.language.troubleCode,
          key: 'troubleCode',
          width: 140,
          isShowSort: true,
          searchable: true,
          searchConfig: { type: 'input' },
        },
        {
          // 处理状态
          title: this.language.handleStatus,
          key: 'handleStatus',
          width: 120,
          isShowSort: true,
          type: 'render',
          searchable: true,
          searchConfig: {
            type: 'select',
            selectType: 'multiple',
            selectInfo: TroubleUtil.translateHandleStatus(this.$nzI18n),
            label: 'label',
            value: 'code',
          },
          renderTemplate: this.handleStatusTemp,
        },
        {
          // 故障级别
          title: this.language.troubleLevel,
          key: 'troubleLevel',
          width: 150,
          isShowSort: true,
          type: 'render',
          searchable: true,
          searchConfig: {
            type: 'select',
            selectType: 'multiple',
            selectInfo: AlarmForCommonUtil.translateAlarmLevel(this.$nzI18n),
            label: 'label',
            value: 'code',
          },
          renderTemplate: this.troubleLevelTemp,
        },
        {
          // 故障类型
          title: this.language.troubleType,
          key: 'troubleType',
          width: 160,
          isShowSort: true,
          searchable: true,
          searchKey: 'troubleType',
          searchConfig: {
            type: 'select',
            selectType: 'multiple',
            selectInfo: this.troubleTypeList,
          },
        },
        {
          // 故障来源
          title: this.language.troubleSource,
          key: 'troubleSource',
          width: 150,
          isShowSort: true,
          searchable: true,
          searchConfig: {
            type: 'select',
            selectType: 'multiple',
            selectInfo: TroubleUtil.translateTroubleSource(this.$nzI18n),
            label: 'label',
            value: 'code',
          },
        },
        {
          // 设施类型
          title: this.language.alarmSourceType,
          key: 'deviceType',
          width: 120,
          isShowSort: true,
          searchable: true,
          type: 'render',
          renderTemplate: this.troubleDeviceType,
          searchConfig: {
            type: 'select',
            selectType: 'multiple',
            selectInfo: this.deviceRoleTypes,
            label: 'label',
            value: 'code',
          },
        },
        {
          // 故障设施
          title: this.language.troubleFacility,
          key: 'deviceName',
          width: 120,
          isShowSort: true,
          searchConfig: {
            type: 'render',
            renderTemplate: this.facilityTemp,
          },
        },
        {
          // 故障设备
          title: this.language.troubleEquipment,
          key: 'equipment',
          width: 120,
          searchable: true,
          isShowSort: true,
          type: 'render',
          searchConfig: {
            type: 'render',
            renderTemplate: this.equipmentTemp,
          },
          renderTemplate: this.troubleEquipment,
        },
        {
          // 故障描述
          title: this.language.troubleDescribe,
          key: 'troubleDescribe',
          width: 120,
          isShowSort: true,
          searchable: true,
          type: 'render',
          renderTemplate: this.refAlarmTemp,
          searchConfig: { type: 'input' },
        },
        {
          // 创建时间
          title: this.language.createTime,
          key: 'createTime',
          width: 180,
          pipe: 'date',
          isShowSort: true,
          searchable: true,
          searchKey: 'createTime',
          searchConfig: { type: 'dateRang' },
        },
        {
          // 处置时间
          title: this.language.handleTime,
          key: 'handleTime',
          width: 180,
          pipe: 'date',
          isShowSort: true,
          searchable: true,
          searchKey: 'handleTime',
          searchConfig: { type: 'dateRang' },
        },
        {
          // 填报人
          title: this.language.reportUserName,
          key: 'reportUserName',
          width: 125,
          isShowSort: true,
          searchable: true,
          searchConfig: { type: 'input' },
        },
        {
          // 处理责任人
          title: this.language.person,
          key: 'assignUserName',
          width: 125,
          isShowSort: true,
          searchable: true,
          searchConfig: { type: 'input' },
        },
        {
          // 发生时间
          title: this.language.happenTime,
          key: 'happenTime',
          width: 180,
          pipe: 'date',
          isShowSort: true,
          searchable: true,
          searchKey: 'happenTime',
          searchConfig: { type: 'dateRang' },
        },
        {
          // 责任单位
          title: this.language.deptName,
          key: 'assignDeptName',
          width: 180,
          isShowSort: true,
          searchable: true,
          searchConfig: { type: 'render', renderTemplate: this.UnitNameSearch },
        },
        {
          // 备注
          title: this.language.troubleRemark,
          key: 'troubleRemark',
          width: 200,
          isShowSort: true,
          searchable: true,
          searchConfig: { type: 'input' },
        },
        {
          title: this.language.operate,
          searchable: true,
          searchConfig: { type: 'operate' },
          key: '',
          width: 150,
          fixedStyle: { fixedRight: true, style: { right: '0px' } },
        },
      ],
      showPagination: true,
      bordered: false,
      showSearch: false,
      topButtons: [],
      moreButtons: [],
      operation: [],
      leftBottomButtons: [],
      sort: (event: SortCondition) => {
        this.queryCondition.sortCondition.sortField = event.sortField;
        this.queryCondition.sortCondition.sortRule = event.sortRule;
        this.refreshData();
      },
      handleSearch: (event: FilterCondition[]) => {
        this.queryCondition.filterConditions = [];
        if (!event.length) {
          this.clearData();
          this.isClickSlider = false;
          this.queryCondition.pageCondition = {
            pageSize: this.pageBean.pageSize,
            pageNum: 1,
          };
          this.queryCondition.filterConditions = [
            {
              filterField: 'deviceId',
              filterValue: [this.filterData],
              operator: OperatorEnum.in,
            },
          ];
          this.refreshData();
        } else {
          const filterEvent = this.handleFilter(event);
          filterEvent.push({
            filterField: 'deviceId',
            filterValue: [this.filterData],
            operator: OperatorEnum.in,
          });
          this.pageBean = new PageModel();
          this.queryCondition.filterConditions = filterEvent;
          this.queryCondition.pageCondition = {
            pageSize: this.pageBean.pageSize,
            pageNum: this.pageBean.pageIndex,
          };
          this.refreshData();
        }
      },
    };
  }
  getTroubleType(): void {
    this.$troubleToolService.getTroubleTypeList().then((data: SelectModel[]) => {
      this.troubleTypeList = data;
      // 表格配置初始化
      this.init_Table();
    });
  }

  /**
   * 区域告警等模板数据清除
   */
  clearData() {
    // 单位清空
    this.selectUnitName = '';
    FacilityForCommonUtil.setTreeNodesStatus(this.treeNodes, []);
    // 故障设施
    this.checkTroubleData = new SelectDeviceModel();
    this.initTroubleObjectConfig();
    // 故障设备
    this.checkTroubleObject = new SelectEquipmentModel();
    this.selectEquipments = [];
  }

  /**
   * 过滤条件处理
   */
  handleFilter(filters: FilterCondition[]) {
    const filterEvent = [];
    filters.forEach((item) => {
      switch (item.filterField) {
        case 'deviceName':
          // 设施名称
          if (this.checkTroubleData.deviceName) {
            filterEvent.push({
              filterField: 'deviceId',
              filterValue: this.checkTroubleData.deviceId,
              operator: OperatorEnum.eq,
            });
          }
          break;
        case 'equipment':
          // 设备名称
          if (this.checkTroubleObject.ids) {
            filterEvent.push({
              filterField: 'equipment.equipmentId',
              filterValue: this.checkTroubleObject.ids,
              operator: OperatorEnum.in,
            });
          }
          break;
        case 'assignDeptName':
          // 责任单位
          filterEvent.push({
            filterField: 'deptId',
            filterValue: item.filterValue,
            operator: OperatorEnum.in,
          });
          break;
        default:
          filterEvent.push(item);
      }
    });
    return filterEvent;
  }

  /**
   * 选择告警
   * param event
   * param data
   */
  public selectedAlarmChange(event, data): void {
    this._selectedData = data;
    this.radioClickChange.emit(DismantleWarnTroubleEnum.trouble);
  }

  /** 传递给父组件当前选中的数据 */
  tranSelectedData() {
    // return this._selectedData;
    if (this._selectedData) {
        return this._selectedData;
    }else{
       return {
           id: this.selectedTroubldId,
           troubleCode: this.selectedTroubldName
        }
    }
  }

  /** 清空已经选中的数据 */
  clearSelectedData() {
    this.selectedTroubldId = null;
    this._selectedData = null;
  }
}
