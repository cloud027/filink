import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import * as _ from 'lodash';
import {PageModel} from '../../../../shared-module/model/page.model';
import {TableConfigModel} from '../../../../shared-module/model/table-config.model';
import {FilterCondition, QueryConditionModel, SortCondition} from '../../../../shared-module/model/query-condition.model';
import {StorageLanguageInterface} from '../../../../../assets/i18n/storage/storage.language.interface';
import {StorageApiService} from '../../share/service/storage-api.service';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {NzI18nService, NzModalService, UploadFile} from 'ng-zorro-antd';
import {Router} from '@angular/router';
import {LanguageEnum} from '../../../../shared-module/enum/language.enum';
import {CommonLanguageInterface} from '../../../../../assets/i18n/common/common.language.interface';
import {DeviceTypeEnum} from '../../../../core-module/enum/facility/facility.enum';
import {EquipmentTypeEnum} from '../../../../core-module/enum/equipment/equipment.enum';
import {MaterialTypeEnum} from '../../share/enum/material-type.enum';
import {FacilityForCommonUtil} from '../../../../core-module/business-util/facility/facility-for-common.util';
import {WarehousingStatusEnum} from '../../share/enum/material-status.enum';
import {ResultModel} from '../../../../shared-module/model/result.model';
import {ResultCodeEnum} from '../../../../shared-module/enum/result-code.enum';
import {FormItem} from '../../../../shared-module/component/form/form-config';
import {FormOperate} from '../../../../shared-module/component/form/form-operate.service';
import {RuleUtil} from '../../../../shared-module/util/rule-util';
import {WarehousingListModel} from '../../share/model/warehousing-list.model';
import {SessionUtil} from '../../../../shared-module/util/session-util';
import {Download} from '../../../../shared-module/util/download';
import {ListExportModel} from '../../../../core-module/model/list-export.model';
import {ExportRequestModel} from '../../../../shared-module/model/export-request.model';
import {OperatorEnum} from '../../../../shared-module/enum/operator.enum';
import {StorageUtil} from '../../share/util/storage.util';
import {StorageServiceUrlConst} from '../../share/const/storage-service-url.const';
import {FilterValueModel} from '../../../../core-module/model/work-order/filter-value.model';
import {UserRoleModel} from '../../../../core-module/model/user/user-role.model';
import {ListUnitSelector} from '../../../../shared-module/component/business-component/list-unit-selector/list-unit-selector';
import {UserForCommonService} from '../../../../core-module/api-service';
import {SupplierDataModel} from '../../../../core-module/model/supplier/supplier-data.model';
import {ProductInfoModel} from '../../../../core-module/model/product/product-info.model';
import {ImportMissionService} from '../../../../core-module/mission/import.mission.service';
import {StorageSynopsisChartComponent} from '../../share/component/storage-synopsis-chart/storage-synopsis-chart.component';
import {SupplierForCommonUtil} from '../../../../core-module/business-util/supplier/supplier-for-common.util';
import {UserForCommonUtil} from '../../../../core-module/business-util/user/user-for-common.util';
import {MaterialOperateTypeEnum} from '../../share/enum/material-operate-type.enum';

/**
 * 物料入库页面
 */
@Component({
  selector: 'app-warehousing',
  templateUrl: './warehousing.component.html',
  styleUrls: ['./warehousing.component.scss']
})
export class WarehousingComponent extends ListUnitSelector implements OnInit {
  // 创建人、更新人员
  @ViewChild('userSearchTemp') userSearchTemp: TemplateRef<any>;
  // 责任单位选择模板
  @ViewChild('unitNameSearch') unitNameSearch: TemplateRef<any>;
  // 供应商选择模板
  @ViewChild('supplierTemp') supplierTemp: TemplateRef<any>;
  // 规格型号选择
  @ViewChild('materialModelTemp') public materialModelTemp: TemplateRef<any>;
  // 物料类型模版
  @ViewChild('materialType') public materialTypeTemplate: TemplateRef<HTMLDocument>;
  // 状态
  @ViewChild('materialStatus') public materialStatusTemplate: TemplateRef<HTMLDocument>;
  // 导入
  @ViewChild('importTemp') private importTemp: TemplateRef<any>;
  // 物料单价模板
  @ViewChild('unitPriceTemp') public unitPriceTemp: TemplateRef<any>;
  // 入库总览统计图
  @ViewChild('storageChart') public storageChart: StorageSynopsisChartComponent;
  // 国际化
  public storageLanguage: StorageLanguageInterface;
  public commonLanguage: CommonLanguageInterface;
  // 列表数据
  public dataSet: WarehousingListModel[] = [];
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
  public materialStatusEnum = WarehousingStatusEnum;
  // 是否展示入库弹窗
  public isShowWareModel: boolean = false;
  // 入库表单数据
  public formColumn: FormItem[] = [];
  // 弹框中表单的确认按钮是否可以点击
  public isFormDisabled: boolean = true;
  // 确认按钮加载中
  public submitLoading: boolean = false;
  // 是否展示统计图
  public isShowCharts: boolean = false;
  // 上传的文件序列
  public fileList: UploadFile[] = [];
  // 勾选用户
  public checkUserObject: FilterValueModel = new FilterValueModel();
  // 显示用户选择
  public isShowUserTemp: boolean = false;
  // 存放用户数据
  public selectUserList: UserRoleModel[] = [];
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
  // 用户显示
  private userFilterValue: FilterCondition;
  // 规格型号筛选条件
  private modelFilterValue: FilterCondition;
  // 供应商显示
  private supplierFilterValue: FilterCondition;
  // 上传的文件序列
  private fileArray = [];
  // 上传的文件类型
  private fileType: string;
  // 表单实例对象
  private formStatus: FormOperate;
  // 选择的数据Id
  private warehousingIds: string[] = [];

  constructor(public $nzI18n: NzI18nService,
              public $userService: UserForCommonService,
              public $message: FiLinkModalService,
              public $nzModalService: NzModalService,
              public $router: Router,
              public $storageApiService: StorageApiService,
              private $refresh: ImportMissionService,
              private $download: Download,
              private $ruleUtil: RuleUtil) {
    super($userService, $nzI18n, $message);
  }

  /**
   * 初始化
   */
  public ngOnInit(): void {
    // 初始国际化
    this.storageLanguage = this.$nzI18n.getLocaleData(LanguageEnum.storage);
    this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
    // 初始化表格
    this.initTable();
    // 获取列表数据
    this.queryWarehousingList();
    // 初始化责任单位下拉树
    this.initTreeSelectorConfig();
    // 导入服务 监听数据变化 用于列表刷新使用
    this.$refresh.refreshChangeHook.subscribe(() => {
      this.queryWarehousingList();
    });
  }

  /**
   * 分页
   */
  public pageChange(event: PageModel): void {
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
    this.queryWarehousingList();
  }

  /**
   * 入库表单实例化
   */
  public formInstance(event: { instance: FormOperate }): void {
    this.formStatus = event.instance;
    this.formStatus.group.statusChanges.subscribe(() => {
      this.isFormDisabled = !this.formStatus.getRealValid();
    });
    // 进行入库操作时，表单中的入库人、入库单位默认为当前用户及其单位 不可更改
    const userInfo = SessionUtil.getUserInfo();
    this.formStatus.resetControlData('warehousingUserName', userInfo.userName);
    this.formStatus.resetControlData('warehousingDeptName', userInfo.department.deptName);
  }

  /**
   * 物料入库提交
   */
  public warehousingSubmit(): void {
    const data = this.formStatus.group.getRawValue();
    // 处理数据
    const userInfo = SessionUtil.getUserInfo();
    Object.assign(data, {
      ids: this.warehousingIds,
      warehousingUser: userInfo.id,
      warehousingDept: userInfo.deptId
    });
    this.submitLoading = true;
    this.$storageApiService.submitWarehousingByIds(data).subscribe((result: ResultModel<any>) => {
      this.submitLoading = false;
      if (result.code === ResultCodeEnum.success) {
        this.$message.success(this.storageLanguage.warehousingSuccess);
        this.isShowWareModel = false;
        this.queryWarehousingList();
      } else {
        this.$message.error(result.msg);
      }
    }, () => {
      this.submitLoading = false;
    });
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
  };

  /**
   * 用户名称
   */
  public onSelectUser(event: UserRoleModel[]): void {
    this.selectUserList = event;
    UserForCommonUtil.selectUser(event, this);
  }

  /**
   * 用户名称选择
   */
  public openUserSelector(filterValue: FilterCondition): void {
    this.isShowUserTemp = true;
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
   * 查询列表数据
   */
  private queryWarehousingList(): void {
    this.tableConfig.isLoading = true;
    this.$storageApiService.queryWarehousingList(this.queryCondition).subscribe((res: ResultModel<WarehousingListModel[]>) => {
      this.tableConfig.isLoading = false;
      if (res.code === ResultCodeEnum.success) {
        this.dataSet = res.data || [];
        this.pageBean.pageSize = res.size;
        this.pageBean.pageIndex = res.pageNum;
        this.pageBean.Total = res.totalCount;
        // 处理获取到的数据（获取状态图标、物料分类图标、是否有删除、编辑操作）
        StorageUtil.handleListData(this.dataSet, MaterialOperateTypeEnum.warehousing);
      } else {
        this.$message.error(res.msg);
      }
    }, () => {
      this.tableConfig.isLoading = false;
    });
  }

  /**
   * 初始化表格
   */
  private initTable(): void {
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
      primaryKey: '19-2',
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
          // 状态 已入库 未入库
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
              {label: this.storageLanguage.isWareHousing, value: WarehousingStatusEnum.isWareHousing},
              {label: this.storageLanguage.noWareHousing, value: WarehousingStatusEnum.noWareHousing}
            ],
            label: 'label',
            value: 'code'
          }
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
          sortKey: 'materialModel',
          searchKey: 'materialModel',
          searchable: true,
          configurable: true,
          searchConfig: {type: 'render', renderTemplate: this.materialModelTemp}
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
          // 物料数量
          title: this.storageLanguage.materialNum,
          key: 'materialNum',
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
          type: 'render',
          renderTemplate: this.unitPriceTemp,
          width: 150,
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
          sortKey: 'supplierId',
          searchKey: 'supplierId',
          isShowSort: true,
          searchable: true,
          configurable: true,
          searchConfig: {type: 'render', renderTemplate: this.supplierTemp}
        },
        {
          // 入库人员
          title: this.storageLanguage.warehousingUser,
          key: 'warehousingUserName',
          width: 150,
          isShowSort: true,
          searchable: true,
          sortKey: 'warehousingUser',
          searchKey: 'warehousingUser',
          configurable: true,
          hidden: true,
          searchConfig: {type: 'render', renderTemplate: this.userSearchTemp}
        },
        {
          // 入库单位
          title: this.storageLanguage.warehousingDept,
          key: 'warehousingDeptName',
          width: 150,
          isShowSort: true,
          sortKey: 'warehousingDept',
          searchKey: 'warehousingDept',
          searchable: true,
          hidden: true,
          configurable: true,
          searchConfig: {type: 'render', renderTemplate: this.unitNameSearch}
        },
        {
          // 入库事由
          title: this.storageLanguage.warehousingReason,
          key: 'warehousingReason',
          width: 150,
          isShowSort: true,
          searchable: true,
          hidden: true,
          configurable: true,
          searchConfig: {type: 'input'}
        },
        {
          // 入库时间
          title: this.storageLanguage.storageTime,
          key: 'warehousingDate',
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
          // 备注
          title: this.storageLanguage.remark, key: 'remark', width: 150, isShowSort: true,
          searchable: true, configurable: true,
          hidden: true,
          searchConfig: {type: 'input'}
        },
        {
          // 操作列
          title: this.commonLanguage.operate,
          searchable: true,
          searchConfig: {type: 'operate'},
          key: '', width: 180,
          fixedStyle: {fixedRight: true, style: {right: '0px'}}
        },
      ],
      bordered: false,
      showSearch: false,
      rightTopButtons: [
        // 导入
        {
          text: this.commonLanguage.import,
          iconClassName: 'fiLink-import',
          permissionCode: '19-2-6',
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
          permissionCode: '19-2-7',
          handle: () => {
            this.$download.downloadFile(StorageServiceUrlConst.downloadTemplate, 'warehousingImportTemplate.xlsx');
          },
        },
        {
          // 统计图
          text: this.storageLanguage.summaryGraph,
          iconClassName: 'fiLink-analysis',
          permissionCode: '19-2-8',
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
          permissionCode: '19-2-2',
          handle: () => {
            this.$router.navigate(['/business/storage/warehousing/add']).then();
          }
        },
        {
          // 批量入库
          text: this.storageLanguage.warehousing,
          iconClassName: 'fiLink-warehousing',
          permissionCode: '19-2-5',
          handle: (data: WarehousingListModel[]) => {
            // 若未选择数据点击入库 则提示请勾选列表数据
            if (data.length > 0) {
              // 如果有已入库数据 则给出相应提示 并不可进行入库操作
              if (data.some(item => item.materialStatus === WarehousingStatusEnum.isWareHousing)) {
                this.$message.info(this.storageLanguage.warehousingAgain);
                return;
              }
              this.isShowWareModel = true;
              this.warehousingIds = [];
              data.forEach(item => this.warehousingIds.push(item.warehousingId));
              // 初始化提交入库表单数据
              this.formInit();
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
          permissionCode: '19-2-4',
          handle: (data: WarehousingListModel[]) => {
            // 如果已入库的数据不为0 即有是已入库的给出相应提示 并不可进行删除操作
            if (data.some(item => item.materialStatus === WarehousingStatusEnum.isWareHousing)) {
              this.$message.info(this.storageLanguage.notDeleteWarehousingTips);
              return;
            } else {
              this.$message.confirm(this.storageLanguage.deleteWareContent1, () => {
                this.deleteWarehousing(data);
              });
            }
          }
        }
      ],
      operation: [
        {
          // 编辑
          text: this.commonLanguage.edit,
          className: 'fiLink-edit',
          permissionCode: '19-2-3',
          handle: (data: WarehousingListModel) => {
            this.$router.navigate(['/business/storage/warehousing/update'],
              {queryParams: {warehousingId: data.warehousingId, pattern: data.equipmentModelType}}).then();
          }
        },
        {
          // 入库
          text: this.storageLanguage.warehousing,
          key: 'canOperate',
          className: 'fiLink-warehousing',
          disabledClassName: 'fiLink-warehousing disabled-icon',
          permissionCode: '19-2-5',
          handle: (data: WarehousingListModel) => {
            this.warehousingIds = [data.warehousingId];
            this.isShowWareModel = true;
            this.formInit();
          }
        },
        {
          // 单个删除
          text: this.commonLanguage.deleteBtn,
          key: 'canOperate',
          className: 'fiLink-delete red-icon',
          disabledClassName: 'fiLink-delete disabled-icon',
          btnType: 'danger',
          iconClassName: 'fiLink-delete',
          needConfirm: true,
          canDisabled: true,
          permissionCode: '19-2-4',
          handle: (data: WarehousingListModel) => {
              this.$message.confirm(this.storageLanguage.deleteWareContent2, () => {
                this.deleteWarehousing([data]);
              });
          }
        },
      ],
      // 排序
      sort: (event: SortCondition) => {
        this.queryCondition.sortCondition.sortField = event.sortField;
        this.queryCondition.sortCondition.sortRule = event.sortRule;
        this.queryWarehousingList();
      },
      // 搜索
      handleSearch: (event: FilterCondition[]) => {
        // 对于物料类型、物料数量、物料单价、物料状态的筛选条件做处理
        event.forEach(item => {
          const array = ['materialType', 'materialNum', 'materialUnitPrice', 'materialStatus'];
          if (array.includes(item.filterField)) {
            item.operator = OperatorEnum.eq;
          }
        });
        this.queryCondition.pageCondition.pageNum = 1;
        this.queryCondition.filterConditions = event;
        // 没有值的时候重置已选数据
        if (!event.length) {
          this.selectUnitName = '';
          FacilityForCommonUtil.setTreeNodesStatus(this.treeNodes || [], []);
          this.selectUserList = [];
          this.selectSupplierList = [];
          this.selectModelList = [];
          this.selectSupplierObject = new FilterValueModel();
          this.selectModelObject = new FilterValueModel();
        }
        this.queryWarehousingList();
      },
      // 导出
      handleExport: (event: ListExportModel<WarehousingListModel[]>) => {
        this.handleExportWarehousing(event);
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
        this.$storageApiService.importWarehousingList(formData).subscribe((result: ResultModel<string>) => {
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
   * 初始化提交入库弹窗中的表单
   */
  private formInit(): void {
    this.formColumn = [
      {
        // 入库人
        label: this.storageLanguage.warehousingPerson,
        key: 'warehousingUserName',
        type: 'input',
        col: 24,
        require: true,
        disabled: true,
        rule: [{required: true}],
        asyncRules: [],
      },
      {
        // 入库单位
        label: this.storageLanguage.warehousingDept,
        key: 'warehousingDeptName',
        type: 'input',
        col: 24,
        disabled: true,
        require: true,
        rule: [{required: true}],
        asyncRules: [],
      },
      {
        // 入库事由
        label: this.storageLanguage.warehousingReason,
        key: 'warehousingReason',
        type: 'input',
        col: 24,
        require: true,
        rule: [{required: true}, RuleUtil.getNameMinLengthRule(),
          RuleUtil.getNameMaxLengthRule(255)],
        customRules: [this.$ruleUtil.getNameCustomRule()]
      },
      {
        // 备注
        label: this.storageLanguage.remark,
        key: 'remark',
        type: 'textarea',
        col: 24,
        require: false,
        rule: [this.$ruleUtil.getRemarkMaxLengthRule()]
      },
    ];
  }

  /**
   * 单个或批量删除操作
   */
  private deleteWarehousing(data: WarehousingListModel[]): void {
      const warehousingIds = data.map(item => item.warehousingId);
      this.$storageApiService.deleteWarehousingByIds({ids: warehousingIds}).subscribe((res: ResultModel<string>) => {
        if (res.code === ResultCodeEnum.success) {
          this.$message.success(this.storageLanguage.deleteWareSuccess);
          this.queryCondition.pageCondition.pageNum = 1;
          this.queryWarehousingList();
        } else {
          this.$message.error(res.msg);
        }
      });
  }

  /**
   * 物料入库导出
   */
  private handleExportWarehousing(event: ListExportModel<WarehousingListModel[]>): void {
    // 处理参数
    const exportBody = new ExportRequestModel(event.columnInfoList, event.excelType);
    // 处理选择的数据
    if (event && !_.isEmpty(event.selectItem)) {
      const ids = event.selectItem.map(item => item.warehousingId);
      const filter = new FilterCondition('warehousingId', OperatorEnum.in, ids);
      exportBody.queryCondition.filterConditions.push(filter);
    } else {
      // 处理查询条件
      exportBody.queryCondition.filterConditions = event.queryTerm;
    }
    this.$storageApiService.exportWarehousingList(exportBody).subscribe((res: ResultModel<string>) => {
      if (res.code === ResultCodeEnum.success) {
        this.$message.success(this.storageLanguage.exportWarehousing);
      } else {
        this.$message.error(res.msg);
      }
    });
  }
}
