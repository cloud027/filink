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
 * ??????????????????
 */
@Component({
  selector: 'app-warehousing',
  templateUrl: './warehousing.component.html',
  styleUrls: ['./warehousing.component.scss']
})
export class WarehousingComponent extends ListUnitSelector implements OnInit {
  // ????????????????????????
  @ViewChild('userSearchTemp') userSearchTemp: TemplateRef<any>;
  // ????????????????????????
  @ViewChild('unitNameSearch') unitNameSearch: TemplateRef<any>;
  // ?????????????????????
  @ViewChild('supplierTemp') supplierTemp: TemplateRef<any>;
  // ??????????????????
  @ViewChild('materialModelTemp') public materialModelTemp: TemplateRef<any>;
  // ??????????????????
  @ViewChild('materialType') public materialTypeTemplate: TemplateRef<HTMLDocument>;
  // ??????
  @ViewChild('materialStatus') public materialStatusTemplate: TemplateRef<HTMLDocument>;
  // ??????
  @ViewChild('importTemp') private importTemp: TemplateRef<any>;
  // ??????????????????
  @ViewChild('unitPriceTemp') public unitPriceTemp: TemplateRef<any>;
  // ?????????????????????
  @ViewChild('storageChart') public storageChart: StorageSynopsisChartComponent;
  // ?????????
  public storageLanguage: StorageLanguageInterface;
  public commonLanguage: CommonLanguageInterface;
  // ????????????
  public dataSet: WarehousingListModel[] = [];
  // ????????????
  public pageBean: PageModel = new PageModel();
  // ????????????
  public tableConfig: TableConfigModel = new TableConfigModel();
  // ??????????????????
  public queryCondition: QueryConditionModel = new QueryConditionModel();
  // ??????????????????
  public deviceTypeEnum = DeviceTypeEnum;
  // ??????????????????
  public equipmentTypeEnum = EquipmentTypeEnum;
  // ???????????????
  public languageEnum = LanguageEnum;
  // ??????????????????
  public materialTypeEnum = MaterialTypeEnum;
  // ??????????????????
  public materialStatusEnum = WarehousingStatusEnum;
  // ????????????????????????
  public isShowWareModel: boolean = false;
  // ??????????????????
  public formColumn: FormItem[] = [];
  // ????????????????????????????????????????????????
  public isFormDisabled: boolean = true;
  // ?????????????????????
  public submitLoading: boolean = false;
  // ?????????????????????
  public isShowCharts: boolean = false;
  // ?????????????????????
  public fileList: UploadFile[] = [];
  // ????????????
  public checkUserObject: FilterValueModel = new FilterValueModel();
  // ??????????????????
  public isShowUserTemp: boolean = false;
  // ??????????????????
  public selectUserList: UserRoleModel[] = [];
  // ???????????????
  public selectSupplierObject: FilterValueModel = new FilterValueModel();
  // ?????????????????????
  public isShowSupplier: boolean = false;
  // ??????????????????????????????
  public selectSupplierList: SupplierDataModel[] = [];
  // ????????????????????????
  public isShowModel: boolean = false;
  // ?????????????????????????????????????????????
  public productTypeDataSource = [];
  // ??????????????????????????? ????????????
  public selectModelList: ProductInfoModel[] = [];
  // ?????????????????????
  public selectModelObject: FilterValueModel = new FilterValueModel();
  // ????????????
  private userFilterValue: FilterCondition;
  // ????????????????????????
  private modelFilterValue: FilterCondition;
  // ???????????????
  private supplierFilterValue: FilterCondition;
  // ?????????????????????
  private fileArray = [];
  // ?????????????????????
  private fileType: string;
  // ??????????????????
  private formStatus: FormOperate;
  // ???????????????Id
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
   * ?????????
   */
  public ngOnInit(): void {
    // ???????????????
    this.storageLanguage = this.$nzI18n.getLocaleData(LanguageEnum.storage);
    this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
    // ???????????????
    this.initTable();
    // ??????????????????
    this.queryWarehousingList();
    // ??????????????????????????????
    this.initTreeSelectorConfig();
    // ???????????? ?????????????????? ????????????????????????
    this.$refresh.refreshChangeHook.subscribe(() => {
      this.queryWarehousingList();
    });
  }

  /**
   * ??????
   */
  public pageChange(event: PageModel): void {
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
    this.queryWarehousingList();
  }

  /**
   * ?????????????????????
   */
  public formInstance(event: { instance: FormOperate }): void {
    this.formStatus = event.instance;
    this.formStatus.group.statusChanges.subscribe(() => {
      this.isFormDisabled = !this.formStatus.getRealValid();
    });
    // ????????????????????????????????????????????????????????????????????????????????????????????? ????????????
    const userInfo = SessionUtil.getUserInfo();
    this.formStatus.resetControlData('warehousingUserName', userInfo.userName);
    this.formStatus.resetControlData('warehousingDeptName', userInfo.department.deptName);
  }

  /**
   * ??????????????????
   */
  public warehousingSubmit(): void {
    const data = this.formStatus.group.getRawValue();
    // ????????????
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
   * ????????????
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
   * ????????????
   */
  public onSelectUser(event: UserRoleModel[]): void {
    this.selectUserList = event;
    UserForCommonUtil.selectUser(event, this);
  }

  /**
   * ??????????????????
   */
  public openUserSelector(filterValue: FilterCondition): void {
    this.isShowUserTemp = true;
    this.userFilterValue = filterValue;
    this.userFilterValue.operator = OperatorEnum.in;
  }

  /**
   * ????????????????????????
   */
  public openSupplierSelector(filterValue: FilterCondition): void {
    this.isShowSupplier = true;
    this.supplierFilterValue = filterValue;
    this.supplierFilterValue.operator = OperatorEnum.in;
  }

  /**
   * ???????????????????????????
   */
  public onSelectSupplier(event: SupplierDataModel[]): void {
    this.selectSupplierList = event;
    SupplierForCommonUtil.selectSupplier(event, this);
  }

  /**
   * ???????????????????????????
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
   * ?????????????????????????????????
   */
  public handleModelOk(event: ProductInfoModel[]): void {
    this.selectModelList = event;
    StorageUtil.selectModel(event, this);
    this.isShowModel = false;
  }

  /**
   * ??????????????????
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
        // ??????????????????????????????????????????????????????????????????????????????????????????????????????
        StorageUtil.handleListData(this.dataSet, MaterialOperateTypeEnum.warehousing);
      } else {
        this.$message.error(res.msg);
      }
    }, () => {
      this.tableConfig.isLoading = false;
    });
  }

  /**
   * ???????????????
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
        // ??????
        {type: 'select', fixedStyle: {fixedLeft: true, style: {left: '0'}}, width: 60},
        // ??????
        {
          type: 'serial-number',
          width: 60,
          title: this.commonLanguage.serialNumber,
          fixedStyle: {fixedLeft: true, style: {left: '60px'}}
        },
        {
          // ????????????
          title: this.storageLanguage.warehousingCode,
          key: 'warehousingId',
          width: 200,
          isShowSort: true,
          searchable: true,
          configurable: true,
          searchConfig: {type: 'input'}
        },
        {
          // ????????????
          title: this.storageLanguage.materialName,
          key: 'materialName',
          width: 150,
          isShowSort: true,
          searchable: true,
          configurable: true,
          searchConfig: {type: 'input'}
        },
        {
          // ????????????
          title: this.storageLanguage.materialSerial,
          key: 'materialNumber',
          width: 150,
          isShowSort: true,
          searchable: true,
          configurable: true,
          searchConfig: {type: 'input'}
        },
        {
          // ?????? ????????? ?????????
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
          // ????????????
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
          // ????????????
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
          // ???????????????
          title: this.storageLanguage.softwareVersion,
          key: 'softwareVersion',
          width: 150,
          isShowSort: true,
          searchable: true,
          configurable: true,
          searchConfig: {type: 'input'}
        },
        {
          // ???????????????
          title: this.storageLanguage.hardwareVersion,
          key: 'hardwareVersion',
          width: 150,
          isShowSort: true,
          searchable: true,
          configurable: true,
          searchConfig: {type: 'input'}
        },
        {
          // ????????????
          title: this.storageLanguage.materialNum,
          key: 'materialNum',
          width: 150,
          isShowSort: true,
          searchable: true,
          configurable: true,
          searchConfig: {type: 'input'}
        },
        {
          // ????????????
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
          // ?????????
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
          // ????????????
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
          // ????????????
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
          // ????????????
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
          // ????????????
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
          // ??????
          title: this.storageLanguage.remark, key: 'remark', width: 150, isShowSort: true,
          searchable: true, configurable: true,
          hidden: true,
          searchConfig: {type: 'input'}
        },
        {
          // ?????????
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
        // ??????
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
        // ??????????????????
        {
          text: this.commonLanguage.downloadTemplate, iconClassName: 'fiLink-download-file',
          permissionCode: '19-2-7',
          handle: () => {
            this.$download.downloadFile(StorageServiceUrlConst.downloadTemplate, 'warehousingImportTemplate.xlsx');
          },
        },
        {
          // ?????????
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
          // ??????
          text: this.commonLanguage.add,
          iconClassName: 'fiLink-add-no-circle',
          permissionCode: '19-2-2',
          handle: () => {
            this.$router.navigate(['/business/storage/warehousing/add']).then();
          }
        },
        {
          // ????????????
          text: this.storageLanguage.warehousing,
          iconClassName: 'fiLink-warehousing',
          permissionCode: '19-2-5',
          handle: (data: WarehousingListModel[]) => {
            // ?????????????????????????????? ??????????????????????????????
            if (data.length > 0) {
              // ???????????????????????? ????????????????????? ???????????????????????????
              if (data.some(item => item.materialStatus === WarehousingStatusEnum.isWareHousing)) {
                this.$message.info(this.storageLanguage.warehousingAgain);
                return;
              }
              this.isShowWareModel = true;
              this.warehousingIds = [];
              data.forEach(item => this.warehousingIds.push(item.warehousingId));
              // ?????????????????????????????????
              this.formInit();
            } else {
              this.$message.info(this.storageLanguage.pleaseCheckThe);
            }
          }
        },
        {
          // ????????????
          text: this.commonLanguage.deleteBtn,
          btnType: 'danger',
          canDisabled: true,
          needConfirm: true,
          className: 'table-top-delete-btn',
          iconClassName: 'fiLink-delete',
          permissionCode: '19-2-4',
          handle: (data: WarehousingListModel[]) => {
            // ??????????????????????????????0 ??????????????????????????????????????? ???????????????????????????
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
          // ??????
          text: this.commonLanguage.edit,
          className: 'fiLink-edit',
          permissionCode: '19-2-3',
          handle: (data: WarehousingListModel) => {
            this.$router.navigate(['/business/storage/warehousing/update'],
              {queryParams: {warehousingId: data.warehousingId, pattern: data.equipmentModelType}}).then();
          }
        },
        {
          // ??????
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
          // ????????????
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
      // ??????
      sort: (event: SortCondition) => {
        this.queryCondition.sortCondition.sortField = event.sortField;
        this.queryCondition.sortCondition.sortRule = event.sortRule;
        this.queryWarehousingList();
      },
      // ??????
      handleSearch: (event: FilterCondition[]) => {
        // ???????????????????????????????????????????????????????????????????????????????????????
        event.forEach(item => {
          const array = ['materialType', 'materialNum', 'materialUnitPrice', 'materialStatus'];
          if (array.includes(item.filterField)) {
            item.operator = OperatorEnum.eq;
          }
        });
        this.queryCondition.pageCondition.pageNum = 1;
        this.queryCondition.filterConditions = event;
        // ????????????????????????????????????
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
      // ??????
      handleExport: (event: ListExportModel<WarehousingListModel[]>) => {
        this.handleExportWarehousing(event);
      },
    };
  }

  /**
   * ??????
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
   * ???????????????????????????????????????
   */
  private formInit(): void {
    this.formColumn = [
      {
        // ?????????
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
        // ????????????
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
        // ????????????
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
        // ??????
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
   * ???????????????????????????
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
   * ??????????????????
   */
  private handleExportWarehousing(event: ListExportModel<WarehousingListModel[]>): void {
    // ????????????
    const exportBody = new ExportRequestModel(event.columnInfoList, event.excelType);
    // ?????????????????????
    if (event && !_.isEmpty(event.selectItem)) {
      const ids = event.selectItem.map(item => item.warehousingId);
      const filter = new FilterCondition('warehousingId', OperatorEnum.in, ids);
      exportBody.queryCondition.filterConditions.push(filter);
    } else {
      // ??????????????????
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
