import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {NzI18nService, NzModalService} from 'ng-zorro-antd';
import {LockService} from '../../../../core-module/api-service/lock';
import {FormOperate} from '../../../../shared-module/component/form/form-operate.service';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {IndexLanguageInterface} from '../../../../../assets/i18n/index/index.language.interface';
import {FacilityLanguageInterface} from '../../../../../assets/i18n/facility/facility.language.interface';
import {FacilityService} from '../../../../core-module/api-service/facility/facility-manage';
import {TableConfigModel} from '../../../../shared-module/model/table-config.model';
import {PageModel} from '../../../../shared-module/model/page.model';
import {FilterCondition, QueryConditionModel, SortCondition} from '../../../../shared-module/model/query-condition.model';
import {FormItem} from '../../../../shared-module/component/form/form-config';
import {ResultModel} from '../../../../shared-module/model/result.model';
import {ResultCodeEnum} from '../../../../shared-module/enum/result-code.enum';
import {OperatorEnum} from '../../../../shared-module/enum/operator.enum';
import {LanguageEnum} from '../../../../shared-module/enum/language.enum';
import {ControlInfo} from '../../share/model/control-info';
import {SimPackageTypeEnum} from '../../../../core-module/enum/facility/facility.enum';
import {CommonUtil} from '../../../../shared-module/util/common-util';
import {ListExportModel} from '../../../../core-module/model/list-export.model';
import {IS_TRANSLATION_CONST} from '../../../../core-module/const/common.const';

/**
 * 设施列表组件
 */
@Component({
  selector: 'app-control-list',
  templateUrl: './control-list.component.html',
  styleUrls: ['./control-list.component.scss']
})

export class ControlListComponent implements OnInit {
  // 列表数据
  public dataSet: ControlInfo[] = [];
  // 列表分页实体
  public pageBean: PageModel = new PageModel();
  // 列表配置
  public tableConfig: TableConfigModel;
  // 设施语言包
  public language: FacilityLanguageInterface;
  // 首页语言包
  public indexLanguage: IndexLanguageInterface;
  // 列表查询条件
  public queryCondition: QueryConditionModel = new QueryConditionModel();
  // 表单配置
  public formColumn: Array<FormItem> = [];
  // 表单状态
  public formStatus: FormOperate;
  // 套餐编辑弹窗
  public isVisible = false;
  // 保存按钮加载
  public isLoading = false;
  // hostId集合
  public equipmentIds: Array<string>;
  // 自定义模板
  @ViewChild('simPackageTypeTemp') private simPackageTypeTemp: TemplateRef<Element>;

  constructor(private $nzI18n: NzI18nService,
              private $message: FiLinkModalService,
              private $modal: NzModalService,
              private $lockService: LockService,
              private $facilityService: FacilityService) {
  }

  public ngOnInit(): void {
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.facility);
    this.indexLanguage = this.$nzI18n.getLocaleData(LanguageEnum.index);
    this.initTableConfig();
    this.refreshData();
    // 初始化表单配置
    this.initForm();
  }

  /**
   * 切换分页
   * @param event PageModel
   */
  public pageChange(event: PageModel): void {
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
    this.refreshData();
  }

  /**
   * 初始化表单
   */
  public initForm(): void {
    this.formColumn = [
      {
        label: this.language.simPackage,
        key: 'simPackage',
        type: 'radio',
        require: false,
        col: 24,
        radioInfo: {
          data: [
            {label: this.language.config.oneYear, value: 1},
            {label: this.language.config.threeYear, value: 3},
            {label: this.language.config.fiveYear, value: 5},
          ],
          label: 'label',
          value: 'value'
        },
        rule: [],
        asyncRules: []
      },
    ];
  }

  /**
   * 取消修改
   */
  public editHandleCancel(): void {
    this.equipmentIds = [];
    this.isVisible = false;
    this.refreshData();
  }

  /**
   * 编辑表单实例
   * param event
   */
  public formInstance(event: { instance: FormOperate }): void {
    this.formStatus = event.instance;
  }

  /**
   * 代开弹框
   */
  public openPackageModal(simPackage?): void {
    this.isVisible = true;
    if (simPackage) {
      setTimeout(() => {
        this.formStatus.resetControlData('simPackage', simPackage);
      });
    }

  }

  /**
   * 刷新表格数据
   */
  private refreshData(): void {
    this.tableConfig.isLoading = true;
    this.$facilityService.getControlByPackage(this.queryCondition).subscribe((result: ResultModel<ControlInfo[]>) => {
      this.tableConfig.isLoading = false;
      if (result.code === ResultCodeEnum.success) {
        this.pageBean.Total = result.totalCount;
        this.pageBean.pageIndex = result.pageNum;
        this.pageBean.pageSize = result.size;
        this.dataSet = result.data || [];
        this.dataSet.forEach(item => {
          item.simPackageOrigin = item.simPackage;
          item.simPackage = CommonUtil.codeTranslate(SimPackageTypeEnum, this.$nzI18n, item.simPackage.toString()) as string;
        });
      } else {
        this.$message.error(result.msg);
      }
    }, () => {
      this.tableConfig.isLoading = false;
    });
  }

  /**
   * 初始化表格配置
   */
  private initTableConfig(): void {
    this.tableConfig = {
      outHeight: 108,
      primaryKey: '03-7',
      isDraggable: true,
      isLoading: true,
      showSearchSwitch: true,
      showSizeChanger: true,
      scroll: {x: '1804px', y: '340px'},
      noIndex: true,
      showSearchExport: true,
      columnConfig: [
        {type: 'select', fixedStyle: {fixedLeft: true, style: {left: '0px'}}, width: 62},
        {
          type: 'serial-number', width: 62, title: this.language.serialNumber,
          fixedStyle: {fixedLeft: true, style: {left: '62px'}}
        },
        { // iccId
          title: this.language.iccid, key: 'iccid',
          width: 280,
          configurable: true,
          isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'},
          fixedStyle: {fixedLeft: true, style: {left: '124px'}}
        },
        { // sim套餐
          title: this.language.simPackage, key: 'simPackage',
          width: 200,
          configurable: true,
          isShowSort: true,
          searchable: true,
          renderTemplate: this.simPackageTypeTemp,
          searchConfig: {
            type: 'select',
            selectType: 'multiple',
            selectInfo: CommonUtil.codeTranslate(SimPackageTypeEnum, this.$nzI18n),
            label: 'label',
            value: 'code'
          }

        },
        { // 设施id
          title: this.language.deviceId, key: 'deviceId',
          width: 280,
          configurable: true,
          isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'},
        },
        { // 主控id
          title: this.language.hostId, key: 'equipmentId',
          width: 280,
          configurable: true,
          isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'},
        },
        { // 创建时间
          title: this.language.currentTime, key: 'currentTime',
          width: 200,
          pipe: 'date',
          configurable: true,
          isShowSort: true,
          searchable: true,
          searchKey: 'currentTime',
          searchConfig: {type: 'dateRang'}
        },
        { // 操作
          title: this.language.operate, searchable: true,
          searchConfig: {type: 'operate'}, key: '', width: 180, fixedStyle: {fixedRight: true, style: {right: '0px'}}
        },
      ],
      showPagination: true,
      bordered: false,
      showSearch: false,
      operation: [
        {
          text: this.language.updatePackage,
          className: 'fiLink-edit',
          handle: (currentIndex: ControlInfo) => {
            this.equipmentIds = [currentIndex.equipmentId];
            this.openPackageModal(currentIndex.simPackageOrigin);
          }
        },
      ],
      leftBottomButtons: [
        {
          text: this.language.updatePackage,
          handle: (data: ControlInfo[]) => {
            this.equipmentIds = data.map(item => item.equipmentId);
            this.tableConfig.isLoading = true;
            this.openPackageModal();
          },
          canDisabled: true,
          className: 'small-button'
        },
      ],
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
      handleExport: (event: ListExportModel<ControlInfo[]>) => {
        // 处理参数
        const body = {
          queryCondition: new QueryConditionModel(),
          columnInfoList: event.columnInfoList,
          excelType: event.excelType
        };
        body.columnInfoList.forEach(item => {
          if (['simPackage', 'currentTime'].includes(item.propertyName)) {
            // 后台处理字段标示
            item.isTranslation = IS_TRANSLATION_CONST;
          }
        });
        // 处理选择的项目
        if (event.selectItem.length > 0) {
          const ids = event.selectItem.map(item => item.equipmentId);
          const filter = new FilterCondition('equipmentId');
          filter.filterValue = ids;
          filter.operator = OperatorEnum.in;
          body.queryCondition.filterConditions.push(filter);
        } else {
          // 处理查询条件
          body.queryCondition.filterConditions = event.queryTerm;
        }
        this.$facilityService.expertControl(body).subscribe((res: ResultModel<string>) => {
          if (res.code === ResultCodeEnum.success) {
            this.$message.success(this.language.exportSimSuccess);
          } else {
            this.$message.error(res.msg);
          }
        });
      }
    };
  }

  /**
   * 变更套餐
   */
  private updateSimPackage(params: {
    equipmentIds: Array<string>,
    simPackage: string
  }): void {
    this.$facilityService.updateSimPackage(params).subscribe((result: ResultModel<string>) => {
      if (result.code === ResultCodeEnum.success) {
        this.$message.success(this.language.updateSimPackageMsg);
        this.queryCondition.pageCondition.pageNum = 1;
        this.refreshData();
        this.isVisible = false;
        this.equipmentIds = [];
      } else {
        this.tableConfig.isLoading = false;
        this.$message.error(result.msg);
      }
    }, () => {
      this.tableConfig.isLoading = false;
    });
  }

  /**
   * 修改套餐
   */
  private handleUpdate(): void {
    const formData = this.formStatus.getData();
    const params = {
      equipmentIds: this.equipmentIds,
      simPackage: formData.simPackage
    };
    if (!params.simPackage) {
      this.$message.info(this.language.pleaseSelectSimPackage);
    } else {
      this.updateSimPackage(params);
    }
  }
}
