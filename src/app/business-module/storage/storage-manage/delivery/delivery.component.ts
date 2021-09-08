import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import * as _ from 'lodash';
import {StorageLanguageInterface} from '../../../../../assets/i18n/storage/storage.language.interface';
import {CommonLanguageInterface} from '../../../../../assets/i18n/common/common.language.interface';
import {StorageApiService} from '../../share/service/storage-api.service';
import {LanguageEnum} from '../../../../shared-module/enum/language.enum';
import {NzI18nService, NzModalService, UploadFile} from 'ng-zorro-antd';
import {Router} from '@angular/router';
import {PageModel} from '../../../../shared-module/model/page.model';
import {TableConfigModel} from '../../../../shared-module/model/table-config.model';
import {FilterCondition, QueryConditionModel, SortCondition} from '../../../../shared-module/model/query-condition.model';
import {DeliveryStatusEnum} from '../../share/enum/material-status.enum';
import {EquipmentTypeEnum} from '../../../../core-module/enum/equipment/equipment.enum';
import {MaterialTypeEnum} from '../../share/enum/material-type.enum';
import {FacilityForCommonUtil} from '../../../../core-module/business-util/facility/facility-for-common.util';
import {ResultModel} from '../../../../shared-module/model/result.model';
import {ResultCodeEnum} from '../../../../shared-module/enum/result-code.enum';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {ListExportModel} from '../../../../core-module/model/list-export.model';
import {DeliveryListModel} from '../../share/model/delivery-list.model';
import {StorageUtil} from '../../share/util/storage.util';
import {DeviceTypeEnum} from '../../../../core-module/enum/facility/facility.enum';
import {ListUnitSelector} from '../../../../shared-module/component/business-component/list-unit-selector/list-unit-selector';
import {UserForCommonService} from '../../../../core-module/api-service';
import {ExportRequestModel} from '../../../../shared-module/model/export-request.model';
import {OperatorEnum} from '../../../../shared-module/enum/operator.enum';
import {StorageServiceUrlConst} from '../../share/const/storage-service-url.const';
import {Download} from '../../../../shared-module/util/download';
import {ProductInfoModel} from '../../../../core-module/model/product/product-info.model';
import {FilterValueModel} from '../../../../core-module/model/work-order/filter-value.model';
import {UserRoleModel} from '../../../../core-module/model/user/user-role.model';
import {SupplierDataModel} from '../../../../core-module/model/supplier/supplier-data.model';
import {ModifyDeliveryComponent} from './modify-delivery/modify-delivery.component';
import {StorageSynopsisChartComponent} from '../../share/component/storage-synopsis-chart/storage-synopsis-chart.component';
import {ImportMissionService} from '../../../../core-module/mission/import.mission.service';
import {SupplierForCommonUtil} from '../../../../core-module/business-util/supplier/supplier-for-common.util';
import {UserForCommonUtil} from '../../../../core-module/business-util/user/user-for-common.util';
import {MaterialOperateTypeEnum} from '../../share/enum/material-operate-type.enum';

/**
 * 出库物料列表
 */
@Component({
  selector: 'app-delivery',
  templateUrl: './delivery.component.html',
  styleUrls: ['./delivery.component.scss']
})
export class DeliveryComponent extends ListUnitSelector implements OnInit {
  // 物料类型模版
  @ViewChild('materialType') public materialTypeTemplate: TemplateRef<HTMLDocument>;
  // 状态
  @ViewChild('materialStatus') public materialStatusTemplate: TemplateRef<HTMLDocument>;
  // 导入
  @ViewChild('importTemp') private importTemp: TemplateRef<any>;
  // 物料单价模板
  @ViewChild('unitPriceTemp') public unitPriceTemp: TemplateRef<any>;
  // 责任单位选择模板
  @ViewChild('unitNameSearch') unitNameSearch: TemplateRef<any>;
  // 单位部门模板
  @ViewChild('departmentTemp') private departmentTemp: TemplateRef<any>;
  // 规格型号选择
  @ViewChild('materialModelTemp') public materialModelTemp: TemplateRef<any>;
  // 供应商选择模板
  @ViewChild('supplierTemp') supplierTemp: TemplateRef<any>;
  // 领用人员、出库人员
  @ViewChild('userSearchTemp') userSearchTemp: TemplateRef<any>;
  @ViewChild('deliveryUserTemp') deliveryUserTemp: TemplateRef<any>;
  // 编辑出库弹窗
  @ViewChild('updateDelivery') updateDelivery: ModifyDeliveryComponent;
  // 入库总览统计图
  @ViewChild('storageChart') public storageChart: StorageSynopsisChartComponent;
  // 国际化
  public storageLanguage: StorageLanguageInterface;
  public commonLanguage: CommonLanguageInterface;
  // 列表数据
  public dataSet: DeliveryListModel[] = [];
  // 列表分页
  public pageBean: PageModel = new PageModel();
  // 列表配置
  public tableConfig: TableConfigModel = new TableConfigModel();
  // 列表查询参数
  public queryCondition: QueryConditionModel = new QueryConditionModel();
  // 设施类型枚举
  public deviceTypeEnum = DeviceTypeEnum;
  // 设备类型枚举
  public equipmentTypeEnum = EquipmentTypeEnum;
  // 国际化枚举
  public languageEnum = LanguageEnum;
  // 物料分类枚举
  public materialTypeEnum = MaterialTypeEnum;
  // 物料状态分类
  public materialStatusEnum = DeliveryStatusEnum;
  // 是否展示统计图
  public isShowCharts: boolean = false;
  // 上传的文件序列
  public fileList: UploadFile[] = [];
  // 勾选用户
  public checkUserObject: FilterValueModel = new FilterValueModel();
  // 显示领用人员选择
  public isShowUserTemp: boolean = false;
  // 显示出库人员选择
  public isShowDeliveryUserTemp: boolean = false;
  // 存放选择的领用人员数据
  public selectUserList: UserRoleModel[] = [];
  // 存放选择的出库人员数据
  public selectDeliveryUserList: UserRoleModel[] = [];
  // 勾选供应商
  public selectSupplierObject: FilterValueModel = new FilterValueModel();
  // 显示供应商选择
  public isShowSupplier: boolean = false;
  // 存放选择的供应商数据
  public selectSupplierList: SupplierDataModel[] = [];
  // 显示规格型号选择
  public isShowModel: boolean = false;
  // 规格型号列表中的产品类型信息源
  public productTypeDataSource = [];
  // 选中的物料型号信息 用于回显
  public selectModelList: ProductInfoModel[] = [];
  // 选择的型号名称
  public selectModelObject: FilterValueModel = new FilterValueModel();
  // 编辑出库弹窗是否显示
  public showUpdateDeliveryModel: boolean = false;
  // 当前所选进行出库编辑的物料id
  public deliveryId: string;
  // 当前修改数量所选的物料名称
  public deliveryMaterialName: string;
  // 用户筛选条件
  private userFilterValue: FilterCondition;
  // 规格型号筛选条件
  private modelFilterValue: FilterCondition;
  // 供应商筛选条件
  private supplierFilterValue: FilterCondition;
  // 上传的文件序列
  private fileArray = [];
  // 上传的文件类型
  private fileType: string;
  constructor(public $nzI18n: NzI18nService,
              public $nzModalService: NzModalService,
              public $userForCommonService: UserForCommonService,
              public $router: Router,
              public $storageApiService: StorageApiService,
              public $message: FiLinkModalService,
              private $refresh: ImportMissionService,
              private $download: Download) {
    super($userForCommonService, $nzI18n, $message);
  }

  /**
   * 初始化
   */
  public ngOnInit(): void {
    // 初始国际化
    this.storageLanguage = this.$nzI18n.getLocaleData(LanguageEnum.storage);
    this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
    // 初始化列表数据
    this.initTableConfig();
    this.queryDeliveryList();
    this.initTreeSelectorConfig();
    // 导入服务 监听数据变化 用于列表刷新使用
    this.$refresh.refreshChangeHook.subscribe(() => {
      this.queryDeliveryList();
    });
  }

  /**
   * 分页
   */
  public pageChange(event: PageModel): void {
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
    this.queryDeliveryList();
  }

  /**
   * 上传文件
   */
  public beforeUpload = (file: UploadFile): boolean => {
    this.fileArray = this.fileArray.concat(file);
    if (this.fileArray.length > 1) {
      this.fileArray.splice(0, 1);
    }
    this.fileList = this.fileArray;
    const fileName = this.fileList[0].name;
    const index = fileName.lastIndexOf('\.');
    this.fileType = fileName.substring(index + 1, fileName.length);
    return false;
  }

  /**
   * 用户名称
   */
  public onSelectUser(event: UserRoleModel[]): void {
    // 判断选择的是领用人员还是出库人员
    if (this.userFilterValue.filterField === 'collectUser') {
      this.selectUserList = event;
    } else {
      this.selectDeliveryUserList = event;
    }
    UserForCommonUtil.selectUser(event, this);
  }

  /**
   * 用户名称选择
   */
  public openUserSelector(filterValue: FilterCondition, isDeliveryUser: boolean): void {
    // 判断是领用人员还是出库人员的弹出框
    if (isDeliveryUser) {
      this.isShowDeliveryUserTemp = true;
    } else {
      this.isShowUserTemp = true;
    }
    this.userFilterValue = filterValue;
    this.userFilterValue.operator = OperatorEnum.in;
  }

  /**
   * 打开供应商选择器
   */
  public openSupplierSelector(filterValue: FilterCondition): void {
    this.isShowSupplier = true;
    this.supplierFilterValue = filterValue;
    this.supplierFilterValue.operator = OperatorEnum.in;
  }

  /**
   * 供应商选择改变事件
   */
  public onSelectSupplier(event: SupplierDataModel[]): void {
    this.selectSupplierList = event;
    SupplierForCommonUtil.selectSupplier(event, this);
  }

  /**
   * 打开规格型号选择器
   */

  public openMaterialModel(filterValue: FilterCondition): void {
    this.isShowModel = true;
    this.productTypeDataSource = FacilityForCommonUtil.getRoleFacility(this.$nzI18n).concat(
      FacilityForCommonUtil.getRoleEquipmentType(this.$nzI18n)
    );
    this.productTypeDataSource.push({label: this.storageLanguage.otherTotal, code: 'other'});
    this.modelFilterValue = filterValue;
    this.modelFilterValue.operator = OperatorEnum.in;
  }

  /**
   * 选择规格型号的确定事件
   */
  public handleModelOk(event: ProductInfoModel[]): void {
    this.selectModelList = event;
    StorageUtil.selectModel(event, this);
    this.isShowModel = false;
  }

  /**
   * 编辑出库确定事件
   */
  public handleUpdateDelivery(data): void {
    data.deliveryId = this.deliveryId;
    data.materialName = this.deliveryMaterialName;
    this.$storageApiService.updateDeliveryById(data).subscribe((res: ResultModel<string>) => {
      if (res.code === ResultCodeEnum.success) {
        this.$message.success(this.storageLanguage.updateDeliverySuccess);
        this.showUpdateDeliveryModel = false;
        this.queryDeliveryList();
      } else {
        this.$message.error(res.msg);
      }
    });
  }

  /**
   * 查询列表数据
   */
  private queryDeliveryList(): void {
    this.tableConfig.isLoading = true;
    this.$storageApiService.queryDeliveryList(this.queryCondition).subscribe((res: ResultModel<DeliveryListModel[]>) => {
      this.tableConfig.isLoading = false;
      if (res.code === ResultCodeEnum.success) {
        this.dataSet = res.data || [];
        this.pageBean.pageSize = res.size;
        this.pageBean.pageIndex = res.pageNum;
        this.pageBean.Total = res.totalCount;
        // 获取设备和设施的图标
        StorageUtil.handleListData(this.dataSet, MaterialOperateTypeEnum.delivery);
      } else {
        this.$message.error(res.msg);
      }
    }, () => {
      this.tableConfig.isLoading = false;
    });
  }

  /**
   * 初始化表格数据
   */
  private initTableConfig(): void {
    this.tableConfig = {
      isDraggable: true,
      isLoading: false,
      showSizeChanger: true,
      showSearchSwitch: true,
      showPagination: true,
      notShowPrint: false,
      scroll: {x: '1200px', y: '600px'},
      noIndex: true,
      showSearchExport: true,
      primaryKey: '19-3',
      columnConfig: [
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
          // 出库编号
          title: this.storageLanguage.deliveryCode,
          key: 'deliveryId',
          width: 200,
          isShowSort: true,
          searchable: true,
          configurable: true,
          searchConfig: {type: 'input'}
        },
        {
          // 物料名称
          title: this.storageLanguage.materialName,
          key: 'materialName',
          width: 150,
          isShowSort: true,
          searchable: true,
          configurable: true,
          searchConfig: {type: 'input'}
        },
        {
          // 物料编号
          title: this.storageLanguage.materialSerial,
          key: 'materialNumber',
          width: 150,
          isShowSort: true,
          searchable: true,
          configurable: true,
          searchConfig: {type: 'input'}
        },
        {
          // 状态 已出库 未出库
          title: this.storageLanguage.materialStatus,
          key: 'materialStatus',
          width: 150,
          type: 'render',
          renderTemplate: this.materialStatusTemplate,
          isShowSort: true,
          searchable: true,
          configurable: true,
          searchConfig: {
            type: 'select',
            selectInfo: [
              {label: this.storageLanguage.isDelivery, value: DeliveryStatusEnum.isDelivery},
              {label: this.storageLanguage.noDelivery, value: DeliveryStatusEnum.noDelivery}
            ],
            label: 'label',
            value: 'code'
          }
        },
        {
          // 物料数量
          title: this.storageLanguage.materialNum,
          key: 'remainingNum',
          width: 150,
          isShowSort: true,
          searchable: true,
          configurable: true,
          searchConfig: {type: 'input'}
        },
        {
          // 出库数量
          title: this.storageLanguage.deliveryNum,
          key: 'deliveryNum',
          width: 150,
          isShowSort: true,
          searchable: true,
          configurable: true,
          searchConfig: {type: 'input'}
        },
        {
          // 物料分类
          title: this.storageLanguage.materialType,
          key: 'materialCode',
          width: 150,
          type: 'render',
          renderTemplate: this.materialTypeTemplate,
          configurable: true,
          isShowSort: true,
          searchable: true,
          searchConfig: {
            type: 'select',
            selectType: 'multiple',
            selectInfo: StorageUtil.getMaterialTypeSelect(this.$nzI18n, this.storageLanguage),
            label: 'label',
            value: 'code'
          }
        },
        {
          // 规格型号
          title: this.storageLanguage.productModel,
          key: 'materialModelName',
          width: 150,
          isShowSort: true,
          searchable: true,
          sortKey: 'materialModel',
          searchKey: 'materialModel',
          configurable: true,
          searchConfig: {type: 'render', renderTemplate: this.materialModelTemp}
        },
        {
          // 入库编号
          title: this.storageLanguage.warehousingCode,
          key: 'warehousingId',
          width: 200,
          isShowSort: true,
          searchable: true,
          configurable: true,
          searchConfig: {type: 'input'}
        },
        {
          // 软件版本号
          title: this.storageLanguage.softwareVersion,
          key: 'softwareVersion',
          width: 150,
          isShowSort: true,
          searchable: true,
          configurable: true,
          searchConfig: {type: 'input'}
        },
        {
          // 硬件版本号
          title: this.storageLanguage.hardwareVersion,
          key: 'hardwareVersion',
          width: 150,
          isShowSort: true,
          searchable: true,
          configurable: true,
          searchConfig: {type: 'input'}
        },
        {
          // 物料单价
          title: this.storageLanguage.materialUnitPrice,
          key: 'materialUnitPrice',
          width: 150,
          type: 'render',
          renderTemplate: this.unitPriceTemp,
          isShowSort: true,
          searchable: true,
          configurable: true,
          searchConfig: {type: 'input'}
        },
        {
          // 供应商
          title: this.storageLanguage.supplier,
          key: 'supplierName',
          width: 150,
          isShowSort: true,
          searchable: true,
          sortKey: 'supplierId',
          searchKey: 'supplierId',
          configurable: true,
          searchConfig: {type: 'render', renderTemplate: this.supplierTemp}
        },
        {
          // 领用单位
          title: this.storageLanguage.deptName,
          key: 'collectDeptName',
          width: 150,
          isShowSort: true,
          searchable: true,
          searchKey: 'collectDept',
          sortKey: 'collectDept',
          configurable: true,
          hidden: true,
          renderTemplate: this.departmentTemp,
          searchConfig: {type: 'render', renderTemplate: this.unitNameSearch}
        },
        {
          // 领用人员
          title: this.storageLanguage.collectUserName,
          key: 'collectUserName',
          width: 150,
          isShowSort: true,
          searchable: true,
          searchKey: 'collectUser',
          sortKey: 'collectUser',
          configurable: true,
          hidden: true,
          searchConfig: {type: 'render', renderTemplate: this.userSearchTemp}
        },
        {
          // 出库事由
          title: this.storageLanguage.deliveryReason,
          key: 'deliveryReason',
          width: 150,
          isShowSort: true,
          searchable: true,
          hidden: true,
          configurable: true,
          searchConfig: {type: 'input'}
        },
        {
          // 出库时间
          title: this.storageLanguage.deliveryTime,
          key: 'deliveryDate',
          width: 150,
          isShowSort: true,
          pipe: 'date',
          pipeParam: 'yyyy-MM-dd hh:mm:ss',
          hidden: true,
          configurable: true,
          searchable: true,
          searchConfig: {type: 'dateRang'}
        },
        {
          // 出库人
          title: this.storageLanguage.deliveryUserName,
          key: 'deliveryUserName',
          width: 150,
          isShowSort: true,
          searchable: true,
          sortKey: 'deliveryUser',
          searchKey: 'deliveryUser',
          configurable: true,
          hidden: true,
          searchConfig: {type: 'render', renderTemplate: this.deliveryUserTemp}
        },
        {
          // 备注
          title: this.storageLanguage.remark, key: 'remark', width: 150, isShowSort: true,
          searchable: true, configurable: true,
          hidden: true,
          searchConfig: {type: 'input'}
        },
        {
          // 操作
          title: this.commonLanguage.operate,
          searchable: true,
          searchConfig: {type: 'operate'},
          key: '', width: 100,
          fixedStyle: {fixedRight: true, style: {right: '0px'}}
        }
      ],
      bordered: false,
      showSearch: false,
      operation: [
        {
          // 编辑
          text: this.commonLanguage.edit,
          key: 'canOperate',
          className: 'fiLink-edit',
          permissionCode: '19-3-3',
          disabledClassName: 'fiLink-edit disabled-icon',
          handle: (data: DeliveryListModel) => {
            this.deliveryId = data.deliveryId;
            this.deliveryMaterialName = data.materialName;
            this.showUpdateDeliveryModel = true;
          }
        },
        {
          // 单个出库
          text: this.storageLanguage.delivery,
          className: 'fiLink-delivery',
          key: 'canOperate',
          disabledClassName: 'fiLink-delivery disabled-icon',
          permissionCode: '19-3-5',
          handle: (data: DeliveryListModel) => {
            if (data.deliveryNum === '--') {
              this.$message.info(this.storageLanguage.deliveryNumEmpty);
              return;
            }
            this.$router.navigate(['/business/storage/submit-delivery'],
              {queryParams: {deliveryId: [data.deliveryId]}}).then();
          }
        },
        {
          // 单个删除
          text: this.commonLanguage.deleteBtn,
          key: 'canOperate',
          className: 'fiLink-delete red-icon',
          btnType: 'danger',
          iconClassName: 'fiLink-delete',
          disabledClassName: 'fiLink-delete disabled-icon',
          canDisabled: true,
          needConfirm: true,
          permissionCode: '19-3-4',
          handle: (data: DeliveryListModel) => {
            this.$message.confirm(this.storageLanguage.deleteWareContent2, () => {
                this.deleteDelivery([data]);
            });
          }
        },
      ],
      rightTopButtons: [
        // 导入
        {
          text: this.commonLanguage.import,
          iconClassName: 'fiLink-import',
          permissionCode: '19-3-6',
          handle: () => {
            const modal = this.$nzModalService.create({
              nzTitle: this.commonLanguage.selectImport,
              nzClassName: 'custom-create-modal',
              nzContent: this.importTemp,
              nzOkType: 'danger',
              nzFooter: [
                {
                  label: this.commonLanguage.confirm,
                  onClick: () => {
                    this.handleImport();
                    modal.destroy();
                  }
                },
                {
                  label: this.commonLanguage.cancel,
                  type: 'danger',
                  onClick: () => {
                    this.fileList = [];
                    this.fileArray = [];
                    this.fileType = null;
                    modal.destroy();
                  }
                },
              ]
            });
          }
        },
        // 导入模板下载
        {
          text: this.commonLanguage.downloadTemplate, iconClassName: 'fiLink-download-file',
          permissionCode: '19-3-7',
          handle: () => {
            this.$download.downloadFile(StorageServiceUrlConst.downloadDeliveryTemplate, 'deliveryImportTemplate.xlsx');
          },
        },
        {
          // 统计图
          text: this.storageLanguage.summaryGraph,
          iconClassName: 'fiLink-analysis',
          permissionCode: '19-3-8',
          handle: () => {
            this.isShowCharts = true;
            this.storageChart.handleSearch();
          },
        }
      ],
      topButtons: [
        {
          // 新增
          text: this.commonLanguage.add,
          iconClassName: 'fiLink-add-no-circle',
          permissionCode: '19-3-2',
          handle: () => {
            this.$router.navigate(['/business/storage/delivery/add']).then();
          }
        },
        {
          // 批量出库
          text: this.storageLanguage.delivery,
          iconClassName: 'fiLink-delivery',
          permissionCode: '19-3-5',
          handle: (data: DeliveryListModel[]) => {
            // 若未选择数据点击出库 则提示请勾选列表数据
            if (data.length > 0) {
              // 如果已入库的数据不为0 即有是已入库的给出相应提示 并不可进行删除操作
              if (data.some(item => item.materialStatus === DeliveryStatusEnum.isDelivery)) {
                this.$message.info(this.storageLanguage.deliveryAgain);
                return;
              }
              // 判断出库数量是否为空，给出提示
              const deliveryNum = data.some(item => item.deliveryNum === '--');
              if (deliveryNum) {
                this.$message.info(this.storageLanguage.deliveryNumEmpty);
                return;
              }
              // 将所有未出库数据的出库编号保存起来
              const noDeliveryIds = [];
              data.forEach(item => noDeliveryIds.push(item.deliveryId));
              this.$router.navigate(['/business/storage/submit-delivery'], {queryParams: {deliveryId: noDeliveryIds}}).then();
            } else {
              this.$message.info(this.storageLanguage.pleaseCheckThe);
            }

          }
        },
        {
          // 批量删除
          text: this.commonLanguage.deleteBtn,
          btnType: 'danger',
          canDisabled: true,
          needConfirm: true,
          className: 'table-top-delete-btn',
          iconClassName: 'fiLink-delete',
          permissionCode: '19-3-4',
          handle: (data: DeliveryListModel[]) => {
            // 如果已入库的数据不为0 即有是已入库的给出相应提示 并不可进行删除操作
            if (data.some(item => item.materialStatus === DeliveryStatusEnum.isDelivery)) {
              this.$message.info(this.storageLanguage.notDeleteDeliveryTips);
              return;
            } else {
              this.$message.confirm(this.storageLanguage.deleteWareContent1, () => {
                this.deleteDelivery(data);
              });
            }
          }
        }
      ],
      // 排序
      sort: (event: SortCondition) => {
        this.queryCondition.sortCondition.sortField = event.sortField;
        this.queryCondition.sortCondition.sortRule = event.sortRule;
        this.queryDeliveryList();
      },
      // 搜索
      handleSearch: (event: FilterCondition[]) => {
        this.queryCondition.pageCondition.pageNum = 1;
        this.queryCondition.filterConditions = event;
        // 对于物料类型、物料数量、物料单价、物料状态的筛选条件做处理
        event.forEach(item => {
          const array = ['materialType', 'remainingNum', 'materialUnitPrice', 'materialStatus', 'deliveryNum'];
          if (array.includes(item.filterField)) {
            item.operator = OperatorEnum.eq;
          }
        });
        // 没有值的时候重置已选数据
        if (!event.length) {
          this.selectUnitName = '';
          FacilityForCommonUtil.setTreeNodesStatus(this.treeNodes || [], []);
          this.selectUserList = [];
          this.selectDeliveryUserList = [];
          this.selectSupplierList = [];
          this.selectModelList = [];
          this.selectSupplierObject = new FilterValueModel();
          this.selectModelObject = new FilterValueModel();
        }
        this.queryDeliveryList();
      },
      // 导出
      handleExport: (event: ListExportModel<DeliveryListModel[]>) => {
        this.handleExportDelivery(event);
      },
    };
  }

  /**
   * 导入
   */
  private handleImport(): void {
    const formData = new FormData();
    this.fileList.forEach((file: any) => {
      formData.append('file', file);
    });
    if (this.fileList.length === 1) {
      if (this.fileType === 'xls' || this.fileType === 'xlsx') {
        this.$storageApiService.importDeliveryList(formData).subscribe((result: ResultModel<string>) => {
          this.fileType = null;
          this.fileList = [];
          if (result.code === ResultCodeEnum.success) {
            this.$message.success(this.commonLanguage.importTask);
            this.fileArray = [];
          } else {
            this.$message.error(result.msg);
          }
        });
      } else {
        this.$message.info(this.commonLanguage.fileTypeTips);
      }
    } else {
      this.$message.info(this.commonLanguage.selectFileTips);
    }
  }

  /**
   * 单个、批量删除出库物料
   */
  private deleteDelivery(data: DeliveryListModel[]): void {
    const deliveryIds = data.map(item => item.deliveryId);
    this.$storageApiService.deleteDeliveryByIds({ids: deliveryIds}).subscribe((result: ResultModel<string>) => {
      if (result.code === ResultCodeEnum.success) {
        this.$message.success(this.storageLanguage.deleteDeliverySuccess);
        this.queryCondition.pageCondition.pageNum = 1;
        this.queryDeliveryList();
      } else {
        this.$message.error(result.msg);
      }
    });
  }

  /**
   * 物料出库数据导出
   */
  private handleExportDelivery(event: ListExportModel<DeliveryListModel[]>): void {
    // 处理参数
    const exportBody = new ExportRequestModel(event.columnInfoList, event.excelType);
    // 处理选择的数据
    if (event && !_.isEmpty(event.selectItem)) {
      const ids = event.selectItem.map(item => item.deliveryId);
      const filter = new FilterCondition('deliveryId', OperatorEnum.in, ids);
      exportBody.queryCondition.filterConditions.push(filter);
    } else {
      // 处理查询条件
      exportBody.queryCondition.filterConditions = event.queryTerm;
    }
    this.$storageApiService.exportDeliveryList(exportBody).subscribe((res: ResultModel<string>) => {
      if (res.code === ResultCodeEnum.success) {
        this.$message.success(this.storageLanguage.exportDeliverySuccess);
      } else {
        this.$message.error(res.msg);
      }
    });
  }
}
