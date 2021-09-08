import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {FacilityLanguageInterface} from '../../../../assets/i18n/facility/facility.language.interface';
import {NzI18nService, NzModalService} from 'ng-zorro-antd';
import {CodingStandardApiService} from '../share/service/coding-standard/coding-standard-api.service';
import {LanguageEnum} from '../../../shared-module/enum/language.enum';
import {PageModel} from '../../../shared-module/model/page.model';
import {TableConfigModel} from '../../../shared-module/model/table-config.model';
import {QueryConditionModel, SortCondition} from '../../../shared-module/model/query-condition.model';
import {ResultModel} from '../../../shared-module/model/result.model';
import {ResultCodeEnum} from '../../../shared-module/enum/result-code.enum';
import {TableComponent} from '../../../shared-module/component/table/table.component';
import {CodingStandardEnum} from '../share/enum/coding-standard.enum';
import {FiLinkModalService} from '../../../shared-module/service/filink-modal/filink-modal.service';
import {TreeSelectorConfigModel} from '../../../shared-module/model/tree-selector-config.model';
import {AreaModel} from '../../../core-module/model/facility/area.model';
import {FacilityForCommonService} from '../../../core-module/api-service/facility';
import {CommonLanguageInterface} from '../../../../assets/i18n/common/common.language.interface';
import {CommonUtil} from '../../../shared-module/util/common-util';
import {DeviceTypeEnum} from '../../../core-module/enum/facility/facility.enum';
import {EquipmentTypeEnum} from '../../../core-module/enum/equipment/equipment.enum';
declare var $: any;

@Component({
  selector: 'app-coding-standard',
  templateUrl: './coding-standard.component.html',
  styleUrls: ['./coding-standard.component.scss']
})
export class CodingStandardComponent implements OnInit {
  // 启用状态
  @ViewChild('enableStatus') enableStatus: TemplateRef<any>;
  // 表格
  @ViewChild('codingTableList') private codingTableList: TableComponent;
  // 设施语言包
  public language: FacilityLanguageInterface;
  // 公共国际化语言包
  public commonLanguage: CommonLanguageInterface;
  // 列表数据
  public dataSet = [];
  // 列表分页实体
  public pageBean: PageModel = new PageModel();
  // 列表配置
  public tableConfig: TableConfigModel = new TableConfigModel();
  // 列表查询条件
  public queryCondition: QueryConditionModel = new QueryConditionModel();
  // 是否展示查看可选字段弹窗
  public isShow: boolean = false;
  // 是否展示编码范围弹窗
  public isShowCodingRange: boolean = false;
  // 可选字段集
  public fieldList: string[] = [];
  // 资产类型树配置
  public assetTypeSelectorConfig: TreeSelectorConfigModel = new TreeSelectorConfigModel();
  // 编码范围树配置
  public codingRangeSelectorConfig: TreeSelectorConfigModel = new TreeSelectorConfigModel();
  // 资产类型树实例
  public treeInstanceLeft: any;
  // 编码范围树实例
  public treeInstanceRight: any;
  // 资产类型树数据集
  public assetTypeNodes: any = [];
  // 编码范围树数据集
  public codingRangeNodes: any = [];

  constructor(
    public $nzI18n: NzI18nService,
    public $CodingStandardApiService: CodingStandardApiService,
    private $facilityCommonService: FacilityForCommonService,
    public $message: FiLinkModalService,
    private $modalService: NzModalService,
    private $router: Router
  ) {
  }

  ngOnInit() {
    // 国际化
    this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.facility);
    this.initTableConfig();
    this.codingRuleListByPage();
  }

  /**
   * 分页查询
   * @param event PageModel
   */
  public pageChange(event: PageModel): void {
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
    this.codingRuleListByPage();
  }

  /**
   * 监听switch开关事件
   * @ param event
   */
  public switchChange(event): void {
    this.dataSet.forEach(item => {
      if (event.codingRuleId === item.codingRuleId) {
        item.switchLoading = true;
      }
    });
    const body = {
      codingRuleIds: [event.codingRuleId]
    };
    // 状态由禁用状态变为启用状态
    if (!event.buttonDisabled) {
      this.enableCodingRule(body, '1');
    } else {
      // 状态由启用状态变为禁用状态
      this.disableCodingRule(body, '0');
    }
  }

  /**
   * 关闭查看可选字段弹窗
   */
  public handleCancel(): void {
    this.isShow = false;

  }

  /**
   * 关闭编码范围弹窗
   */
  public handleCancelCodingRange(): void {
    this.isShowCodingRange = false;
  }

  /**
   * 查询查询编码标准列表
   */
  private codingRuleListByPage(): void {
    this.queryCondition.bizCondition = {
      codingRuleName: '',
      codingRuleContent: '',
      maxLength: '',
      codingRuleStatus: '',
      remark: '',
      codingRuleType: ''
    };
    this.tableConfig.isLoading = true;
    this.$CodingStandardApiService.codingRuleListByPage(this.queryCondition).subscribe((result: ResultModel<any>) => {
      if (result.code === ResultCodeEnum.success) {
        this.tableConfig.isLoading = false;
        this.dataSet = result.data || [];
        this.dataSet.forEach(item => {
          item.buttonDisabled = item.codingRuleStatus === CodingStandardEnum.enable;
          item.switchLoading = false;
        });
        this.pageBean.Total = result.totalCount;
        this.pageBean.pageIndex = result.pageNum;
        this.pageBean.pageSize = result.size;
      }
    }, () => {
      this.tableConfig.isLoading = false;
    });
}

  /**
   * 获取编码标准可选字段
   */
  private queryCodingRuleField(): void {
    this.isShow = true;
    this.$CodingStandardApiService.queryCodingRuleField().subscribe((result: ResultModel<any>) => {
      if (result.code === ResultCodeEnum.success) {
        const arr = [];
        result.data.forEach(item => {
          if (item.status === '1') {
            arr.push(item.fieldShowText);
          }
        });
        this.fieldList = arr;
      } else {
        this.$message.error(result.msg);
      }
    }, () => {
    });
  }

  /**
   * 编码标准删除
   */
  private deleteCodingRule(ids): void {
    this.tableConfig.isLoading = true;
    this.$CodingStandardApiService.deleteCodingRule(ids).subscribe((result: ResultModel<any>) => {
      if (result.code === ResultCodeEnum.success) {
        this.tableConfig.isLoading = false;
        this.$message.success(this.language.codingStandard.deleteCodingStandardSuccess);
        this.queryCondition.pageCondition.pageNum = 1;
        this.codingRuleListByPage();
      } else {
        this.$message.error(result.msg);
        this.tableConfig.isLoading = false;
      }
    }, () => {
      this.tableConfig.isLoading = false;
    });
  }

  /**
   * 编码标准禁用
   */
  private disableCodingRule(body, status): void {
    this.$CodingStandardApiService.disableCodingRule(body).subscribe((result: ResultModel<any>) => {
      if (result.code === ResultCodeEnum.success) {
        this.isChangeStatus(body, false, status);
        this.$message.success(this.language.disableCodingSuccessfully);
      } else {
        this.$message.error(result.msg);
        this.isChangeStatus(body, false);
      }
    }, () => {
      this.isChangeStatus(body, false);
    });
  }

  /**
   * 编码标准启用
   */
  private enableCodingRule(body, status): void {
    this.$CodingStandardApiService.enableCodingRule(body).subscribe((result: ResultModel<any>) => {
      if (result.code === ResultCodeEnum.success) {
        this.isChangeStatus(body, false, status);
        this.$message.success(this.language.encodingSuccessfully);
      } else {
        this.$message.error(result.msg);
        this.isChangeStatus(body, false);
      }
    }, () => {
      this.isChangeStatus(body, false);
    });
  }

  /**
   * 启用禁用调接口成功后，改变按钮状态，否则不变
   */
  private isChangeStatus(body, isLoading: boolean, isChangeStatus?): void {
    this.dataSet.forEach(item => {
      if (body.codingRuleIds[0] === item.codingRuleId) {
        item.switchLoading = isLoading;
        if (isChangeStatus) {
          item.codingRuleStatus = isChangeStatus;
          if (isChangeStatus === '1') {
            item.buttonDisabled = true;
          } else {
            item.buttonDisabled = false;
          }
        }
      }
    });
  }

  /**
   * 初始化表格配置
   */
  private initTableConfig(): void {
    this.tableConfig = {
      isDraggable: true,
      isLoading: false,
      outHeight: 108,
      keepSelected: true,
      selectedIdKey: 'codingRuleId',
      primaryKey: '03-12-0',
      showSizeChanger: true,
      showSearchSwitch: false,
      scroll: {x: '1804px', y: '340px'},
      noIndex: true,
      showSearchExport: false,
      notShowPrint: true,
      columnConfig: [
        {type: 'select', fixedStyle: {fixedLeft: true, style: {left: '0px'}}, width: 62},
        {
          type: 'serial-number', width: 62, title: this.language.serialNumber,
          fixedStyle: {fixedLeft: true, style: {left: '62px'}}
        },
        { // 名称
          title: this.language.codingStandard.codingName, key: 'codingRuleName', width: 150,
          fixedStyle: {fixedLeft: true, style: {left: '124px'}},
          isShowSort: true,
        },
        { // 编码内容
          title: this.language.codingStandard.codingContent, key: 'codingRuleContent', width: 150,
          isShowSort: true,
        },
        { // 最大编码长度
          title: this.language.codingStandard.maxEncodingLength, key: 'maxLength', width: 150,
          isShowSort: true,
        },
        // 启用状态
        {
          title: this.language.codingStandard.enabledState,
          key: 'codingRuleStatus',
          width: 100,
          isShowSort: true,
          type: 'render',
          renderTemplate: this.enableStatus,
        },
        { // 备注
          title: this.language.remarks, key: 'remark',
          isShowSort: true,
          width: 150,
        },
        {
          title: this.language.operate, searchable: true,
          searchConfig: {type: 'operate'}, key: '', width: 150, fixedStyle: {fixedRight: true, style: {right: '0px'}}
        },
      ],
      showPagination: true,
      bordered: false,
      showSearch: false,
      topButtons: [
        {
          // 新增编码标准
          text: this.language.addArea,
          permissionCode: '03-12-1',
          iconClassName: 'fiLink-add-no-circle',
          handle: () => {
            this.addCodingStandard();
          }
        },
        {
          // 查看可选字段
          text: this.language.codingStandard.queryOptionalFields,
          permissionCode: '03-12-4',
          iconClassName: 'fiLink-optional-field',
          className: 'batch-coding-field-btn',
          handle: () => {
            this.queryCodingRuleField();
          }
        },
        {
          // 删除编码标准
          text: this.language.deleteHandle,
          permissionCode: '03-12-3',
          btnType: 'danger',
          className: 'table-top-delete-btn',
          iconClassName: 'fiLink-delete',
          needConfirm: false,
          canDisabled: true,
          handle: (data) => {
            if (data.every(item => item.buttonDisabled === false)) {
              const arr = [];
              data.forEach(item => {
                arr.push(item.codingRuleId);
              });
              const ids = {codingRuleIds: arr};
              this.deleteConfirmation(ids);
            } else {
              this.$message.info(this.language.codingStandard.enableCodingCanNotDelete);
            }
          }
        },
      ],
      operation: [
        // 编辑
        {
          text: this.language.codingStandard.codingEdit,
          permissionCode: '03-12-2',
          className: 'fiLink-edit',
          handle: (data) => {
            if (data.buttonDisabled) {
              this.$message.info(this.language.codingStandard.enableCodingCanNotEdit);
            } else {
              this.navigateToDetail('business/facility/coding-detail/update',
                  {queryParams: {codingRuleId: data.codingRuleId}});
            }
          }
        },
        // 编码范围
        {
          text: this.language.codingStandard.codingRange,
          permissionCode: '03-12-5',
          className: 'fiLink-coding-range-icon',
          handle: (data) => {
            this.isShowCodingRange = true;
            this.queryCodingRuleInfo({codingRuleId: data.codingRuleId}).then((TreeData) => {
              this.getAreaTreeData(TreeData.scopeCodeList).then();
              this.queryAssetTypeList(TreeData.typeCodeList);
            });
          }
        },
        // 删除
        {
          text: this.language.deleteHandle,
          permissionCode: '03-12-3',
          className: 'fiLink-delete red-icon',
          needConfirm: false,
          handle: (data) => {
            if (data.buttonDisabled) {
              this.$message.info(this.language.codingStandard.enableCodingCanNotDelete);
            } else {
              const ids = {codingRuleIds: [data.codingRuleId]};
              this.deleteConfirmation(ids);
            }
          }
        }
      ],
      // 排序
      sort: (event: SortCondition) => {
        this.queryCondition.sortCondition.sortField = event.sortField;
        this.queryCondition.sortCondition.sortRule = event.sortRule;
        this.codingRuleListByPage();
      },
    };
  }

  /**
   * 跳转到新增编码标准页面
   */
  private addCodingStandard(): void {
    this.navigateToDetail(`business/facility/coding-detail/add`);
  }

  /**
   * 跳转到详情
   * param url
   */
  private navigateToDetail(url: string, extras = {}): void {
    this.$router.navigate([url], extras).then();
  }

  /**
   * tree初始化
   */
  initTree() {
    // 初始化左边的树
    $.fn.zTree.init($('#assetType'), this.assetTypeSelectorConfig.treeSetting, this.assetTypeNodes);
    this.treeInstanceLeft = $.fn.zTree.getZTreeObj('assetType');
    $.fn.zTree.init($('#codingRange'), this.codingRangeSelectorConfig.treeSetting, this.codingRangeNodes);
    this.treeInstanceRight = $.fn.zTree.getZTreeObj('codingRange');
    if (this.treeInstanceLeft) {
      if (this.assetTypeNodes.length > 0) {
        this.treeInstanceLeft.expandAll(true);
      }
    }
    if (this.treeInstanceRight) {
      if (this.codingRangeNodes.length > 0) {
        this.treeInstanceRight.expandAll(true);
      }
    }
  }

  /**
   * 获取资产类型设施设备集
   */
  private queryAssetTypeList(typeCodeList: any[] = []): void {
      this.$CodingStandardApiService.queryDeviceTypeList().subscribe((result: ResultModel<any>) => {
        if (result.code === ResultCodeEnum.success) {
          const deviceTypeList = [];
          const equipmentTypeList = [];
          result.data.forEach(item => {
            if (item.generalClassification === '1') {
              deviceTypeList.push({
                typeCode: item.typeCode,
                typeName: CommonUtil.codeTranslate(DeviceTypeEnum, this.$nzI18n, item.typeCode, 'facility.config'),
                checked: Boolean(typeCodeList.find(_item => item.typeCode === _item.typeCode)),
                chkDisabled: true
              });
            } else {
              equipmentTypeList.push({
                typeCode: item.typeCode,
                typeName: CommonUtil.codeTranslate(EquipmentTypeEnum, this.$nzI18n, item.typeCode, 'facility'),
                checked: Boolean(typeCodeList.find(_item => item.typeCode === _item.typeCode)),
                chkDisabled: true
              });
            }
          });
          const deviceObject = {typeCode: '1', typeName: this.language.codingStandard.facilitySet, chkDisabled: true,
          children: deviceTypeList, checked: Boolean(deviceTypeList.find(item => item.checked))};
          const equipmentObject = {typeCode: '2', typeName: this.language.codingStandard.equipmentSet, chkDisabled: true,
          children: equipmentTypeList, checked: Boolean(equipmentTypeList.find(item => item.checked))};
          this.assetTypeNodes = [deviceObject, equipmentObject];
          this.assetTypeSelectorConfig = {
            width: '800px',
            height: '300px',
            title: this.language.codingStandard.assetType,
            treeSetting: {
              check: {
                enable: true,
                chkStyle: 'checkbox',
                chkboxType: {'Y': 'ps', 'N': 'ps'},
              },
              data: {
                simpleData: {
                  enable: true,
                  idKey: 'typeCode',
                },
                key: {
                  name: 'typeName',
                  children: 'children'
                },
              },
              view: {
                showIcon: false,
                showLine: false
              }
            },
          };
          this.initTree();
        }
      }, () => {
      });
  }

  /**
   * 获取区域数数据源
   */
  private getAreaTreeData(selectAreaList?: any[]): Promise<any> {
    return new Promise((resolve) => {
      this.$facilityCommonService.queryAreaList().subscribe((result: ResultModel<AreaModel[]>) => {
        if (result.code === ResultCodeEnum.success) {
          this.codingRangeNodes = result.data || [];
          // 递归设置区域的节点的被选状态
          this.setAreaTreeNodesStatus(this.codingRangeNodes, selectAreaList);
          const allObject = {areaId: '1', areaName: this.language.codingStandard.all , checked: Boolean(!selectAreaList.length), chkDisabled: true};
          const areaObject = {areaId: '2', areaName: this.language.codingStandard.area, checked: Boolean(selectAreaList.length), chkDisabled: true, children: this.codingRangeNodes};
          this.codingRangeNodes = [allObject, areaObject];
          this.codingRangeSelectorConfig = {
            width: '800px',
            height: '300px',
            title: this.language.codingStandard.codingRange,
            treeSetting: {
              check: {
                enable: true,
                chkStyle: 'checkbox',
                chkboxType: {'Y': 'ps', 'N': 'ps'},
              },
              data: {
                simpleData: {
                  enable: true,
                  idKey: 'areaId',
                },
                key: {
                  name: 'areaName',
                  children: 'children'
                },
              },
              view: {
                showIcon: false,
                showLine: false
              }
            },
          };
          this.initTree();
          resolve();
        } else {
          this.$message.error(result.msg);
        }
      }, () => {
      });
    });
  }

  /**
   * 编辑获取回显数据
   */
  private queryCodingRuleInfo(data: {}): Promise<any> {
    return new Promise((resolve, reject) => {
      this.$CodingStandardApiService.queryCodingRuleInfo(data).subscribe((res: ResultModel<any>) => {
        if (res.code === ResultCodeEnum.success) {
          const treeData = res.data || [];
          resolve(treeData);
        } else {
          this.$message.error(res.msg);
        }
      }, () => {
        reject();
      });

    });

  }

  /**
   * 递归设置区域的节点的被选状态
   */
  private setAreaTreeNodesStatus(data: any, selectData: any[]) {
    data.forEach (item => {
      item.chkDisabled = true;
      if (selectData.length) {
        item.checked = Boolean(selectData.find(_item => item.areaId === _item.scopeId));
      }
      if (item.children) {
        this.setAreaTreeNodesStatus(item.children, selectData);
      }
    });
  }

  /**
   * 删除确认弹框
   */
  private deleteConfirmation(ids: any): void {
    this.$modalService.confirm({
      nzTitle: this.language.prompt,
      nzOkType: 'danger',
      nzContent: `<span>${this.language.deleteTip}</span>`,
      nzOkText: this.commonLanguage.cancel,
      nzMaskClosable: false,
      nzOnOk: () => {
      },
      nzCancelText: this.commonLanguage.confirm,
      nzOnCancel: () => {
        this.deleteCodingRule(ids);
      }
    });
  }
}
