import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {StorageLanguageInterface} from '../../../../../../assets/i18n/storage/storage.language.interface';
import {CommonLanguageInterface} from '../../../../../../assets/i18n/common/common.language.interface';
import {FormItem} from '../../../../../shared-module/component/form/form-config';
import {FormOperate} from '../../../../../shared-module/component/form/form-operate.service';
import {LanguageEnum} from '../../../../../shared-module/enum/language.enum';
import {Router} from '@angular/router';
import {NzI18nService} from 'ng-zorro-antd';
import {OperateTypeEnum} from '../../../../../shared-module/enum/page-operate-type.enum';
import {ColumnConfig, TableConfigModel} from '../../../../../shared-module/model/table-config.model';
import {FacilityForCommonUtil} from '../../../../../core-module/business-util/facility/facility-for-common.util';
import {FilterCondition, PageCondition, QueryConditionModel, SortCondition} from '../../../../../shared-module/model/query-condition.model';
import {ProductInfoModel} from '../../../../../core-module/model/product/product-info.model';
import {LockTypeEnum, ProductTypeEnum} from '../../../../../core-module/enum/product/product.enum';
import {CommonUtil} from '../../../../../shared-module/util/common-util';
import {CameraTypeEnum, EquipmentTypeEnum} from '../../../../../core-module/enum/equipment/equipment.enum';
import {WarehousingListModel} from '../../../share/model/warehousing-list.model';
import {ResultModel} from '../../../../../shared-module/model/result.model';
import {ResultCodeEnum} from '../../../../../shared-module/enum/result-code.enum';
import {StorageApiService} from '../../../share/service/storage-api.service';
import {DeviceTypeEnum} from '../../../../../core-module/enum/facility/facility.enum';
import {PageModel} from '../../../../../shared-module/model/page.model';
import {FiLinkModalService} from '../../../../../shared-module/service/filink-modal/filink-modal.service';
import {TableComponent} from '../../../../../shared-module/component/table/table.component';
import {PageSizeEnum} from '../../../../../shared-module/enum/page-size.enum';
import {MaterialTypeEnum} from '../../../share/enum/material-type.enum';
import {OperatorEnum} from '../../../../../shared-module/enum/operator.enum';
import {WarehousingStatusEnum} from '../../../share/enum/material-status.enum';
import {TableSortConfig} from '../../../../../shared-module/enum/table-style-config.enum';
import * as _ from 'lodash';
import {DELIVERY_NUM_EMPTY} from '../../../share/const/storage.const';

/**
 * 新增出库物料
 */
@Component({
  selector: 'app-add-delivery',
  templateUrl: './add-delivery.component.html',
  styleUrls: ['./add-delivery.component.scss']
})
export class AddDeliveryComponent implements OnInit, OnDestroy {
  // 待出库表格实例
  @ViewChild('tableComponent') private tableComponent: TableComponent;
  // 已选待出库表格
  @ViewChild('waitDeliveryTable') private waitDeliveryTable: TableComponent;
  // 规格型号选择器
  @ViewChild('materialModelSelector') private materialModelSelector: TemplateRef<HTMLDocument>;
  // 标题
  public pageTitle: string = '';
  // 页面类型
  public pageType: string = OperateTypeEnum.add;
  // 国际化
  public storageLanguage: StorageLanguageInterface;
  public commonLanguage: CommonLanguageInterface;

  // 列表配置
  public formColumn: FormItem[] = [];
  // 按钮loading
  public isLoading: boolean = false;
  // 按钮禁用
  public isDisabled: boolean = true;

  // 待出库物料列表数据
  public waitDeliveryDataSet: WarehousingListModel[] = [];
  // 待出库物料列表配置
  public selectTableConfig: TableConfigModel = new TableConfigModel();
  // 列表查询参数
  public queryCondition: QueryConditionModel = new QueryConditionModel();
  // 待出库物料列表分页
  public waitDeliveryPageBean: PageModel = new PageModel();

  // 规格型号选择器列表是否可见
  public modelSelectVisible: boolean = false;
  // 选择的规格型号id
  public selectModelId: string = '';
  // 规格型号列表中的产品类型信息源
  public productTypeDataSource = [];

  // 添加出库物料列表配置
  public tableConfig: TableConfigModel = new TableConfigModel();
  // 是否展示添加出库物料弹窗
  public isShowModal: boolean = false;
  // 添加出库物料列表数据
  public dataSet: WarehousingListModel[] = [];
  // 添加出库物料列表分页
  public pageBean: PageModel = new PageModel();

  // 是否展示修改出库物料数量的弹窗
  public showEditDeliveryNum: boolean = false;
  // 当前修改数量所选的物料数据
  public editDeliveryData;
  // 用于回显的所选的添加出库物料数据
  public selectDeliveryData: WarehousingListModel[] = [];
  // 所选的添加出库物料的数据
  private selectWarehousingData: WarehousingListModel[] = [];
  // 基础信息表单操作实现类
  private formStatus: FormOperate;
  // 当前所选物料类型code
  private materialCode: string;
  // 当前所选物料类型
  private materialType: MaterialTypeEnum | string;
  // 当前选择编辑的物料入库编号
  private currentSelectDataId: string;
  // 摄像头/智能门禁锁的类型
  private cameraType: CameraTypeEnum | LockTypeEnum;
  constructor(public $nzI18n: NzI18nService,
              public $router: Router,
              public $message: FiLinkModalService,
              public $storageService: StorageApiService) {
  }

  /**
   * 初始化
   */
  public ngOnInit(): void {
    // 初始国际化
    this.storageLanguage = this.$nzI18n.getLocaleData(LanguageEnum.storage);
    this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
    // 初始化基础信息表单
    this.initForm();
    // 初始化待出库物料表格
    this.initTableConfig();
    // 设置待出库物料列表分页的默认每页5条数据
    this.waitDeliveryPageBean.pageSize = PageSizeEnum.sizeFive;
    // 添加出库物料列表分页初始化
    this.queryCondition.pageCondition = new PageCondition(1, PageSizeEnum.sizeFive);
  }

  /**
   * 销毁
   */
  public ngOnDestroy(): void {
    this.tableComponent = null;
    this.materialModelSelector = null;
    this.waitDeliveryTable = null;
  }

  /**
   * 获取基础信息表单实例对象
   */
  public formInstance(event: { instance: FormOperate }): void {
    this.formStatus = event.instance;
    this.formStatus.group.statusChanges.subscribe(() => {
      this.isDisabled = !this.formStatus.getRealValid();
    });
  }

  /**
   * 返回
   */
  public goBack(): void {
    this.$router.navigate(['/business/storage/delivery']).then();
  }

  /**
   * 修改出库数量选择确认事件
   */
  public handleNumOk(data): void {
    this.showEditDeliveryNum = false;
    // 得到当前的出库数量保存下来 后面传给后台
    this.selectWarehousingData.forEach(item => {
      if (item.warehousingId === this.currentSelectDataId) {
        item.deliveryNum = data.deliveryNum;
      }
    });
  }

  /**
   * 提交
   */
  public submit(): void {
    this.isLoading = true;
    let data = _.cloneDeep(this.selectWarehousingData);
    // 将所选的所有数据传给后台
    data.forEach(item => {
      // 出库数量为--情况时，给后台传的数据为0
      item.deliveryNum = item.deliveryNum === '--' ? DELIVERY_NUM_EMPTY : item.deliveryNum;
      // 这里获取的备注是物料入库的备注信息，在此不传给后台
      item.remark = '';
    });
    this.$storageService.addDelivery(data).subscribe((res) => {
      this.isLoading = false;
      if (res.code === ResultCodeEnum.success) {
        this.$message.success(this.storageLanguage.addDeliverySuccess);
        this.goBack();
      } else {
        this.$message.error(res.msg);
      }
    }, () => {
      this.isLoading = false;
    });
  }

  /**
   * 选择规格型号之后的确定事件
   */
  public handleModelOk(selectData: ProductInfoModel[]): void {
    this.modelSelectVisible = false;
    if (selectData.length) {
      const tempData = selectData[0];
      this.selectModelId = selectData[0].productId;
      this.materialCode = tempData.typeCode;
      this.cameraType = tempData.pattern;
      this.formStatus.resetControlData('materialModel', tempData.productModel);
      // 设置显示物料类型为当前设施、设备名称；当为设备时，才有软硬件版本号
      if (tempData.typeFlag === ProductTypeEnum.equipment) {
        this.materialType = MaterialTypeEnum.equipment;
        this.formStatus.resetControlData('materialType', CommonUtil.codeTranslate(EquipmentTypeEnum, this.$nzI18n, tempData.typeCode));
      } else if (tempData.typeFlag === ProductTypeEnum.facility) {
        this.materialType = MaterialTypeEnum.facility;
        this.formStatus.resetControlData('materialType', CommonUtil.codeTranslate(DeviceTypeEnum, this.$nzI18n, tempData.typeCode));
      } else {
        this.materialType = MaterialTypeEnum.other;
        this.formStatus.resetControlData('materialType', CommonUtil.codeTranslate(ProductTypeEnum, this.$nzI18n, tempData.typeCode));
      }
      const hidden = tempData.typeFlag === ProductTypeEnum.facility ||
        (tempData.typeCode === EquipmentTypeEnum.intelligentEntranceGuardLock && tempData.pattern === LockTypeEnum.passiveLock);
      this.formStatus.setColumnHidden(['softwareVersion', 'hardwareVersion'], hidden);
      // 设置软硬件版本号的值
      this.formStatus.resetControlData('softwareVersion', tempData.softwareVersion);
      this.formStatus.resetControlData('hardwareVersion', tempData.hardwareVersion);
    } else {
      this.selectModelId = '';
      ['materialModel', 'materialType', 'softwareVersion', 'hardwareVersion'].forEach(key => {
        this.formStatus.resetControlData(key, '');
      });
    }
    // 重新选择规格型后，待出库物料数据随之清空，按钮变为不可点击状态
    this.waitDeliveryDataSet = [];
    this.selectDeliveryData = [];
  }

  /**
   * 显示规格型号弹窗
   */
  public showModelSelect(): void {
    this.modelSelectVisible = true;
    // 设置规格型号产品类型过滤条件
    this.productTypeDataSource = FacilityForCommonUtil.getRoleFacility(this.$nzI18n).concat(
      FacilityForCommonUtil.getRoleEquipmentType(this.$nzI18n)
    );
    this.productTypeDataSource.push({label: this.storageLanguage.otherTotal, code: 'other'});
  }

  /**
   * 待出库物料列表分页
   */
  public waitDeliveryPageChange(event: PageModel): void {
    // 前端分页
    this.waitDeliveryPageBean.pageSize = event.pageSize;
    this.waitDeliveryPageBean.pageSize = event.pageSize;
    this.waitDeliveryDataSet = this.selectWarehousingData.slice(
      event.pageSize * (event.pageIndex - 1),
      event.pageSize * event.pageIndex
    );
  }

  /**
   * 添加出库物料列表分页
   */
  public pageChange(event: PageModel): void {
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
    this.queryWarehousingList();
  }

  /**
   * 选择入库物料确定事件
   */
  public handleOk(): void {
    // 选择的数据将要展示在表格中 为未被选中的状态
    this.selectDeliveryData = this.tableComponent.getDataChecked();
    this.selectDeliveryData.forEach(item => {
      // 默认出库数量为0，展示为--
        item.deliveryNum = '--';
        // 如果有选择的出库物料，且出库数量不为0 则当前所选的物料还保持之前的出库数量
        if(this.selectWarehousingData.length) {
          this.selectWarehousingData.filter(i => i.deliveryNum).forEach(_item => {
              if (item.warehousingId === _item.warehousingId) {
                item.deliveryNum = _item.deliveryNum;
              }
          });
        }
    });
    this.selectWarehousingData = _.cloneDeep(this.selectDeliveryData).map(item => {
      item.checked = false;
      return item;
    });
    // 获取总条数
    this.waitDeliveryPageBean.pageIndex = 1;
    this.waitDeliveryPageBean.Total = this.selectWarehousingData.length;
    this.waitDeliveryDataSet = this.selectWarehousingData.slice(0, this.waitDeliveryPageBean.pageSize);
    this.isShowModal = false;

  }

  /**
   * 选择入库物料清空事件
   */
  public cleanUp(): void {
    this.tableComponent.keepSelectedData.clear();
    this.tableComponent.updateSelectedData();
    this.tableComponent.checkStatus();
  }

  /**
   * 初始化基础信息表单
   */
  private initForm(): void {
    this.formColumn = [
      {
        // 规格型号
        label: this.storageLanguage.productModel,
        key: 'materialModel',
        require: true,
        type: 'custom',
        template: this.materialModelSelector,
        rule: [{required: true}]
      },
      {
        // 物料分类
        label: this.storageLanguage.materialType,
        key: 'materialType',
        col: 24,
        require: true,
        type: 'input',
        disabled: true,
        placeholder: this.storageLanguage.automaticAcquisition,
        rule: [{required: true}]
      },
      {
        // 软件版本号
        label: this.storageLanguage.softwareVersion,
        key: 'softwareVersion',
        col: 24,
        require: true,
        type: 'input',
        disabled: true,
        hidden: true,
        placeholder: this.storageLanguage.automaticAcquisition,
        rule: [{required: true}]
      },
      {
        // 硬件版本号
        label: this.storageLanguage.hardwareVersion,
        key: 'hardwareVersion',
        col: 24,
        require: true,
        type: 'input',
        hidden: true,
        disabled: true,
        placeholder: this.storageLanguage.automaticAcquisition,
        rule: [{required: true}]
      }
    ];
  }

  /**
   * 初始化待出库物料表格
   */
  private initTableConfig(): void {
    this.selectTableConfig = {
      isDraggable: true,
      isLoading: false,
      scroll: {x: '1200px', y: '600px'},
      noIndex: true,
      notShowPrint: true,
      showSizeChanger: true,
      showPagination: true,
      pageSizeOptions: [5, 10, 20, 30, 40],
      columnConfig: this.waitDeliveryColumnConfig(false),
      topButtons: [
        {
          // 添加
          text: this.commonLanguage.addTo,
          iconClassName: 'fiLink-add-no-circle',
          handle: () => {
            if (!this.formStatus.group.controls['materialModel'].value) {
              this.$message.info(this.storageLanguage.isAddDeliveryTips);
              return;
            }
            // 弹出可出库物料数据选择框
            this.isShowModal = true;
            // 初始化添加出库物料列表配置
            this.initWarehousingTable();
            // 查询条件置为空
            this.queryCondition.filterConditions = [];
            this.queryCondition.pageCondition.pageNum = 1;
            // 获取数据
            this.queryWarehousingList();
          }
        },
        {
          // 批量删除
          text: this.commonLanguage.deleteBtn,
          btnType: 'danger',
          needConfirm: true,
          canDisabled: true,
          className: 'table-top-delete-btn',
          iconClassName: 'fiLink-delete',
          handle: (data: WarehousingListModel[]) => {
            const delIds = data.map(item => item.warehousingId);
            this.handleDelete(delIds);
          }
        }
      ],
      operation: [
        {
          // 编辑出库数量
          text: this.commonLanguage.edit,
          className: 'fiLink-edit',
          handle: (data: WarehousingListModel) => {
            this.showEditDeliveryNum = true;
            // 编辑出库数量的表单初始化
            this.editDeliveryData = data;
            this.currentSelectDataId = data.warehousingId;
          }
        },
        {
          // 单个删除
          text: this.commonLanguage.deleteBtn,
          className: 'fiLink-delete red-icon',
          btnType: 'danger',
          iconClassName: 'fiLink-delete',
          needConfirm: true,
          canDisabled: true,
          handle: (data: WarehousingListModel) => {
            this.handleDelete([data.warehousingId]);
          }
        },
      ],
      // 排序
      sort: (event: SortCondition) => {
        let temp;
        if (event && Object.keys(event).length) {
          temp = _.sortBy(this.selectWarehousingData, event.sortField);
          if (event.sortRule === TableSortConfig.DESC) {
            temp.reverse();
          }
        } else {
          // 没有排序时就还原成之前的数组
          temp = this.selectWarehousingData;
        }
        this.selectWarehousingData = [...temp];
        this.waitDeliveryDataSet = this.selectWarehousingData.slice(
          this.waitDeliveryPageBean.pageSize * (this.waitDeliveryPageBean.pageIndex - 1),
          this.waitDeliveryPageBean.pageSize * this.waitDeliveryPageBean.pageIndex
        );
      }
    };
  }

  /**
   * 初始化待出库物料列表信息
   */
  private initWarehousingTable(): void {
    this.tableConfig = {
      isDraggable: true,
      isLoading: false,
      scroll: {x: '1200px', y: '600px'},
      noIndex: true,
      notShowPrint: true,
      showSizeChanger: true,
      showSearchSwitch: true,
      showPagination: true,
      selectedIdKey: 'warehousingId',
      keepSelected: true,
      pageSizeOptions: [5, 10, 20, 30, 40],
      columnConfig: this.waitDeliveryColumnConfig(true),
      // 排序
      sort: (event: SortCondition) => {
        this.queryCondition.sortCondition.sortField = event.sortField;
        this.queryCondition.sortCondition.sortRule = event.sortRule;
        this.queryWarehousingList();
      },
      // 搜索
      handleSearch: (event: FilterCondition[]) => {
        this.queryCondition.pageCondition.pageNum = 1;
        this.queryCondition.filterConditions = event;
        // 对于物料类型、物料数量、物料单价、物料状态的筛选条件做处理
        event.forEach(item => {
          const array = ['materialNum', 'materialUnitPrice', 'remainingNum'];
          if (array.includes(item.filterField)) {
            item.operator = OperatorEnum.eq;
          }
        });
        this.queryWarehousingList();
      }
    };
  }

  /**
   * 待出库物料/添加出库物料展示列表配置
   * @param isShow 控制出库数量列的显示与隐藏
   */
  private waitDeliveryColumnConfig(isShow: boolean): ColumnConfig[] {
    const columnConfig: ColumnConfig[] = [
      // 选择
      {type: 'select', fixedStyle: {fixedLeft: true, style: {left: '0'}}, width: 60},
      // 序号
      {
        type: 'serial-number',
        width: 60,
        title: this.commonLanguage.serialNumber,
        fixedStyle: {fixedLeft: true, style: {left: '60px'}}
      },
      {
        // 物料编号
        title: this.storageLanguage.materialSerial,
        key: 'materialNumber',
        width: 150,
        isShowSort: true,
        searchable: true,
        searchConfig: {type: 'input'}
      },
      {
        // 物料名称
        title: this.storageLanguage.materialName,
        key: 'materialName',
        width: 150,
        isShowSort: true,
        searchable: true,
        searchConfig: {type: 'input'}
      },
      {
        // 入库编号
        title: this.storageLanguage.warehousingCode,
        key: 'warehousingId',
        width: 200,
        isShowSort: true,
        searchable: true,
        searchConfig: {type: 'input'}
      },
      {
        // 物料单价
        title: this.storageLanguage.materialUnitPrice,
        key: 'materialUnitPrice',
        width: 150,
        isShowSort: true,
        searchable: true,
        searchConfig: {type: 'input'}
      },
      {
        // 物料数量
        title: this.storageLanguage.materialNum,
        key: 'remainingNum',
        width: 150,
        isShowSort: true,
        searchable: true,
        searchConfig: {type: 'input'}
      },
      {
        // 出库数量
        title: this.storageLanguage.deliveryNum,
        key: 'deliveryNum',
        width: 150,
        isShowSort: true,
        searchable: true,
        hidden: isShow,
        searchConfig: {type: 'input'}
      },
      {
        // 操作
        title: this.commonLanguage.operate, key: '', width: 80,
        configurable: false,
        searchable: true,
        searchConfig: {type: 'operate'},
        fixedStyle: {fixedRight: true, style: {right: '0px'}}
      }
    ];
    return columnConfig;
  }

  /**
   * 获取入库物料信息
   */
  private queryWarehousingList(): void {
    this.tableConfig.isLoading = true;
    const data = this.formStatus.getRealData();
    delete data.materialType;
    // 添加筛选条件 当前所选型号、物料类型、软硬件版本、已入库的物料
    // 当为设施，或设备为无源锁时 不添加软硬件版本的筛选条件
    const noVersion = this.materialType === MaterialTypeEnum.facility ||
      (this.materialCode === EquipmentTypeEnum.intelligentEntranceGuardLock && this.cameraType === LockTypeEnum.passiveLock);
    Object.keys(data).forEach(key => {
      if (!((key === 'softwareVersion' || key === 'hardwareVersion') && noVersion)) {
        if (key === 'materialModel') {
          this.queryCondition.filterConditions.push(
            new FilterCondition(key, OperatorEnum.in, [this.selectModelId])
          );
        } else {
          const filterCondition = new FilterCondition(key, OperatorEnum.like, data[key]);
          this.queryCondition.filterConditions.push(filterCondition);
        }
      }
    });
    this.queryCondition.filterConditions.push(
      new FilterCondition('materialStatus', OperatorEnum.eq, WarehousingStatusEnum.isWareHousing),
      new FilterCondition('materialCode', OperatorEnum.in, [this.materialCode]),
      new FilterCondition('remainingNum', OperatorEnum.gte, '0'),
    );
    this.$storageService.queryWarehousingList(this.queryCondition).subscribe((res: ResultModel<WarehousingListModel[]>) => {
      this.tableConfig.isLoading = false;
      if (res.code === ResultCodeEnum.success) {
        this.dataSet = res.data || [];
        this.pageBean.Total = res.totalCount;
        this.pageBean.pageIndex = res.pageNum;
        this.pageBean.pageSize = res.size;
      } else {
        this.$message.error(res.msg);
      }
    }, () => {
      this.tableConfig.isLoading = false;
    });
  }

  /**
   * 单个或批量删除待入库物料信息
   */
  private handleDelete(ids: string[]): void {
    // 待出库物料数据更新为 除当前所选数据外的其他数据
    this.selectDeliveryData = this.selectDeliveryData.filter(item => !ids.includes(item.warehousingId));
    this.selectWarehousingData = this.selectWarehousingData.filter(item => !ids.includes(item.warehousingId));
    this.waitDeliveryPageBean.Total = this.selectWarehousingData.length;
    this.waitDeliveryDataSet = this.selectWarehousingData.slice(
      this.waitDeliveryPageBean.pageSize * (this.waitDeliveryPageBean.pageIndex - 1),
      this.waitDeliveryPageBean.pageSize * this.waitDeliveryPageBean.pageIndex
    );
  }
}
