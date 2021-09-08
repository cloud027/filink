import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {TreeSelectorConfigModel} from '../../../shared-module/model/tree-selector-config.model';
import {PageModel} from '../../../shared-module/model/page.model';
import {TableConfigModel} from '../../../shared-module/model/table-config.model';
import {QueryConditionModel, SortCondition} from '../../../shared-module/model/query-condition.model';
import {NzI18nService, NzModalService} from 'ng-zorro-antd';
import {Result} from '../../../shared-module/entity/result';
import {ActivatedRoute} from '@angular/router';
import {ChartUtil} from '../../../shared-module/util/chart-util';
import {AreaModel} from '../../../core-module/model/facility/area.model';
import {FiLinkModalService} from '../../../shared-module/service/filink-modal/filink-modal.service';
import {OdnService} from '../share/service/odn.service';
import {FacilityForCommonService} from '../../../core-module/api-service';
import {FacilityForCommonUtil} from '../../../core-module/business-util/facility/facility-for-common.util';
import {ResultModel} from '../../../shared-module/model/result.model';
import {StatisticalUtil} from '../share/util/statistical.util';
import {StatisticalForCommonService} from '../../../core-module/api-service';

/**
 * 光缆及纤芯统计
 */
@Component({
  selector: 'app-optical-cable',
  templateUrl: './optical-cable.component.html',
  styleUrls: ['./optical-cable.component.scss']
})
export class OpticalCableComponent implements OnInit {
  // 处理前端对表格数据的筛选用
  defaultTableValue = [];
  // 选择的光缆段数据
  selectDataCable;
  // 选择的光缆段Id
  selectDataCableId = [];
  // 国际化
  language;
  // 选择的光缆段名称
  cableName = '';
  facilityLanguage;
  statisticalLanguage;
  // 饼图实例
  ringChartInstance;
  // 柱状图实例
  barChartInstance;
  // 统计图表显示隐藏
  hide = false;
  // 统计表格数据
  __dataset: any[] = [];
  // 统计表格分页参数
  pageBean: PageModel = new PageModel(10, 1, 1);
  // 统计表格配置
  tableConfig: TableConfigModel;
  // 页面类型
  pageTitleType;
  // 光缆段表格数据
  section_dataSet = [];
  // 进度条
  ProgressShow = false;
  section_pageBean: PageModel = new PageModel(10, 1, 1); // 分页
  section_queryCondition: QueryConditionModel = new QueryConditionModel(); // 分页条件
  section_tableConfig: TableConfigModel; // 表格配置
  // 选择光缆段modal模板
  @ViewChild('sectionTemp') sectionTemp: TemplateRef<any>;


  // 区域名称
  areaName = '';
  // 区域id
  areaId;
  // 区域选择器显示隐藏
  areaSelectVisible = false;
  // 区域选择器
  areaSelectorConfig: any = new TreeSelectorConfigModel();
  // 区域树数据
  areaNodes = [];
  // 区域信息
  areaInfo: any = new AreaModel();

  constructor(private $NZi18: NzI18nService,
              // private $facilityUtilService: FacilityUtilService,
              private $facilityCommonService: FacilityForCommonService,
              // private $DeviceStatistical: DeviceStatisticalService,
              private $activatedRoute: ActivatedRoute,
              private $modal: NzModalService,
              // private $facilityService: FacilityService,
              // private $facilityApiService: FacilityApiService,
              private $OdnDeviceService: OdnService,
              private $message: FiLinkModalService,
              private $statisticalCommonService: StatisticalForCommonService
  ) {
  }

  ngOnInit() {
    this.facilityLanguage = this.$NZi18.getLocaleData('facility');
    this.statisticalLanguage = this.$NZi18.getLocaleData('statistical');
    this.getPageType();
    if (this.pageTitleType === 'cable') {
      this.opticalFiber();
    } else {
      this.section_initTableConfig();
      // this.section_refreshData();
    }
    // this.$facilityUtilService.getArea().then((data: NzTreeNode[]) => {
    //   FacilityForCommonUtil.setAreaNodesStatus(data, null, null);
    //   this.areaNodes = data;
    //   this.initAreaSelectorConfig(data);
    // });
    this.$facilityCommonService.queryAreaList().subscribe((result: ResultModel<any>) => {
      const data = result.data || [];
      // 递归设置区域的选择情况
      FacilityForCommonUtil.setAreaNodesStatus(data, null, null);
      this.areaNodes = data;
    });
    this.areaSelectorConfig = StatisticalUtil.initTreeSelectorConfig(this.facilityLanguage, this.areaNodes);
  }

  getPageType() {
    switch (this.$activatedRoute.snapshot.url[0].path) {
      case 'optical-cable':
        this.pageTitleType = 'cable';
        break;
      case 'cable-segment':
        this.pageTitleType = 'segment';
        break;
      case 'core-fiber':
        this.pageTitleType = 'fiber';
        break;
    }
    this.initTableConfig();
  }

  /**
   *光缆段信息列表分页
   */
  section_pageChange(event) {
    this.section_queryCondition.pageCondition.pageNum = event.pageIndex;
    this.section_queryCondition.pageCondition.pageSize = event.pageSize;
    this.section_refreshData();
  }

  /**
   *获取光缆段信息列表
   */
  public section_refreshData() {
    this.section_tableConfig.isLoading = true;
    // this.section_queryCondition.pageCondition.pageSize = 10;
    this.section_queryCondition.bizCondition = {
      areaIds: [this.areaId],
    };
    this.$statisticalCommonService.getCableSegmentList(this.section_queryCondition).subscribe((result: Result) => {
      this.section_pageBean.Total = result.totalCount;
      // this.section_pageBean.pageIndex = result.pageNum;
      // this.section_pageBean.pageSize = result.size;
      this.section_tableConfig.isLoading = false;
      this.section_dataSet = result.data;
      // this.section_dataSet.forEach(item => {
      //   this.selectDataCableId.forEach(_item => {
      //     if (item.opticCableSectionId === _item) {
      //       item.checked = true;
      //     }
      //   });
      // });
    }, () => {
      this.section_tableConfig.isLoading = false;
    });
  }

  /**
   * 处理统计
   */
  statistical() {
    this.ProgressShow = true;
    this.hide = true;
    // if (this.pageTitleType !== 'fused') {
    //   this.setChartData(this.aa);
    // } else {
    //   this.setChartData(this.bb);
    // }
    // this.$OdnDeviceService.jumpFiberPortStatistics({'facilities': deviceSelectList}).subscribe((result: Result) => {
    //   this.setChartData(result.data);
    // });
    if (this.pageTitleType === 'segment') {
      this.$OdnDeviceService.opticalFiberSection({opticalCableSegment: this.selectDataCableId}).subscribe((result: Result) => {
        this.__dataset = [result.data];
        this.setChartData(result.data);
        this.__dataset.forEach(item => {
          item['tableName'] = this.statisticalLanguage.cableStatusNumber;
          this.__dataset.push({
            tableName: this.statisticalLanguage.cableStatusRatio,
            used: item.used === 0 ? 0 : Math.round(item.used / item.totalCount * 10000) / 100.00 + '%',
            unused: item.unused === 0 ? 0 : Math.round(item.unused / item.totalCount * 10000) / 100.00 + '%',
            totalCount: '100%',
          });
        });
        this.ProgressShow = false;
      });
    } else {
      this.$OdnDeviceService.coreStatistics({opticalCableSegment: this.selectDataCableId}).subscribe((result: Result) => {
        this.__dataset = [result.data];
        this.setChartData(result.data);
        this.__dataset.forEach(item => {
          item['tableName'] = this.statisticalLanguage.cableCoreFiberNumber;
          this.__dataset.push({
            tableName: this.statisticalLanguage.cableCoreFiberRatio,
            usedCount: item.usedCount === 0 ? 0 : Math.round(item.usedCount / item.totalCount * 10000) / 100.00 + '%',
            unusedCount: item.unusedCount === 0 ? 0 : Math.round(item.unusedCount / item.totalCount * 10000) / 100.00 + '%',
            totalCount: '100%',
          });
        });
        this.ProgressShow = false;
      });
    }
  }

  /**
   * 获取饼图实例
   * param event
   */
  getRingChartInstance(event) {
    this.ringChartInstance = event;
  }

  /**
   * 获取柱状图实例
   * param event
   */
  getBarChartInstance(event) {
    this.barChartInstance = event;
  }

  /**
   * 表格翻页
   * param event
   */
  pageChange(event) {

  }

  /**
   * 初始化表格配置
   */
  initTableConfig() {
    const columns = [];
    if (this.pageTitleType === 'segment') {
      columns.push(
        {
          title: '', width: 150, key: 'tableName', searchable: true, searchConfig: {
            type: 'input'
          }
        },
        {
          title: this.statisticalLanguage.used, width: 150, key: 'used', searchable: true, searchConfig: {
            type: 'input'
          }
        },
        {
          title: this.statisticalLanguage.unused, width: 150, key: 'unused', searchable: true, searchConfig: {
            type: 'input'
          }
        },
        {
          title: this.statisticalLanguage.totalCount, width: 150, key: 'totalCount', searchable: true, searchConfig: {
            type: 'input'
          }
        }
      );
    } else if (this.pageTitleType === 'cable') {
      columns.push(
        {
          title: '', width: 150, key: 'tableName', searchable: true, searchConfig: {
            type: 'input'
          }
        },
        {
          title: this.statisticalLanguage.stairCount, width: 150, key: 'stairCount', searchable: true, searchConfig: {
            type: 'input'
          }
        },
        {
          title: this.statisticalLanguage.secondaryCount,
          width: 150,
          key: 'secondaryCount',
          searchable: true,
          searchConfig: {
            type: 'input'
          }
        },
        {
          title: this.statisticalLanguage.trunkCount, width: 150, key: 'trunkCount', searchable: true, searchConfig: {
            type: 'input'
          }
        },
        {
          title: this.statisticalLanguage.relayCount, width: 150, key: 'relayCount', searchable: true, searchConfig: {
            type: 'input'
          }
        },
        {
          title: this.statisticalLanguage.terminalCount,
          width: 150,
          key: 'terminalCount',
          searchable: true,
          searchConfig: {
            type: 'input'
          }
        },
        {
          title: this.statisticalLanguage.coreCount, width: 150, key: 'coreCount', searchable: true, searchConfig: {
            type: 'input'
          }
        },
        {
          title: this.statisticalLanguage.convergeCount,
          width: 150,
          key: 'convergeCount',
          searchable: true,
          searchConfig: {
            type: 'input'
          }
        },
        {
          title: this.statisticalLanguage.tandemCount, width: 150, key: 'tandemCount', searchable: true, searchConfig: {
            type: 'input'
          }
        },
        {
          title: this.statisticalLanguage.contactCount,
          width: 150,
          key: 'contactCount',
          searchable: true,
          searchConfig: {
            type: 'input'
          }
        },
        {
          title: this.statisticalLanguage.internalCount,
          width: 150,
          key: 'internalCount',
          searchable: true,
          searchConfig: {
            type: 'input'
          }
        },
        {
          title: this.statisticalLanguage.totalCount,
          width: 150,
          key: 'totalCount',
          searchable: true,

          searchConfig: {
            type: 'input'
          }
        }, {
          title: '', searchable: true,
          searchConfig: {type: 'operate'}, key: '', width: 75, fixedStyle: {fixedRight: true, style: {right: '0px'}}
        },
      );
    } else {
      columns.push(
        {
          title: '', width: 150, key: 'tableName', searchable: true, searchConfig: {
            type: 'input'
          }
        },
        {
          title: this.statisticalLanguage.usedCount, width: 150, key: 'usedCount', searchable: true, searchConfig: {
            type: 'input'
          }
        },
        {
          title: this.statisticalLanguage.unusedCount, width: 150, key: 'unusedCount', searchable: true, searchConfig: {
            type: 'input'
          }
        },
        {
          title: this.statisticalLanguage.totalCount, width: 150, key: 'totalCount', searchable: true, searchConfig: {
            type: 'input'
          }
        }
      );
    }
    this.tableConfig = {
      showSearchExport: true,
      noIndex: true,
      noExportHtml: true,
      showSearchSwitch: false,
      notShowPrint: true,
      isDraggable: false,
      scroll: {x: '1000px', y: '325px'},
      columnConfig: columns,
      handleExport: (event) => {
        this.setExport(event);
      },
      handleSearch: (event) => {
        if (event && event.length) {
          // 有筛选数据时进入
          event.forEach(item => {
            this.__dataset = this.defaultTableValue.filter(items => {
              return items[item.filterField] + '' === item.filterValue;
            });
          });
        } else {
          // 重置表格
          this.__dataset = this.defaultTableValue;
        }
      }
    };
  }

  /**
   * 处理列表导出
   * param data
   */
  setExport(data) {
    data.objectList = this.__dataset;
    data.queryCondition = {
      'filterConditions': [],
      'pageCondition': {},
      'sortCondition': {},
      'bizCondition': {}
    };
    if (this.pageTitleType === 'cable') {
      this.$OdnDeviceService.exportOpticalFiber(data).subscribe((result: Result) => {
        if (result.code === 0) {
          this.$message.success(result.msg);
        } else {
          this.$message.error(result.msg);
        }
      });
    } else if (this.pageTitleType === 'segment') {
      this.$OdnDeviceService.exportOpticalFiberSection(data).subscribe((result: Result) => {
        if (result.code === 0) {
          this.$message.success(result.msg);
        } else {
          this.$message.error(result.msg);
        }
      });
    } else {
      this.$OdnDeviceService.exportCoreStatistics(data).subscribe((result: Result) => {
        if (result.code === 0) {
          this.$message.success(result.msg);
        } else {
          this.$message.error(result.msg);
        }
      });
    }
  }

  /**
   * 对跳纤、盘、框处理图表数据
   */
  setChartData(data) {
    const ringData = [];
    const ringName = [];
    const barData = [];
    const barName = [];
    Object.keys(data).map(item => {
      if (item !== 'totalCount') {
        ringData.push({value: data[item], name: this.statisticalLanguage[item]});
        ringName.push(this.statisticalLanguage[item]);
        barData.push(data[item]);
        barName.push(this.statisticalLanguage[item]);
      }
    });
    setTimeout(() => {
      this.ringChartInstance.setOption(ChartUtil.setRingChartOption(ringData, ringName));
      this.barChartInstance.setOption(ChartUtil.setBarChartOption(barData, barName));
    }, 100);
  }

  /**
   * 光缆统计
   */
  opticalFiber() {
    this.ProgressShow = true;
    this.$OdnDeviceService.opticalFiber().subscribe((result: Result) => {
      this.hide = true;
      this.setChartData(result.data);
      this.__dataset.push(result.data);
      this.__dataset.forEach(item => {
        item['tableName'] = this.statisticalLanguage.cableTypeNumber;
        this.__dataset.push({
          tableName: this.statisticalLanguage.cableTypeRatio,
          trunkCount: item.trunkCount === 0 ? 0 : Math.round(item.trunkCount / item.totalCount * 10000) / 100.00 + '%',
          stairCount: item.stairCount === 0 ? 0 : Math.round(item.stairCount / item.totalCount * 10000) / 100.00 + '%',
          secondaryCount: item.secondaryCount === 0 ? 0 : Math.round(item.secondaryCount / item.totalCount * 10000) / 100.00 + '%',
          coreCount: item.coreCount === 0 ? 0 : Math.round(item.coreCount / item.totalCount * 10000) / 100.00 + '%',
          convergeCount: item.convergeCount === 0 ? 0 : Math.round(item.convergeCount / item.totalCount * 10000) / 100.00 + '%',
          tandemCount: item.tandemCount === 0 ? 0 : Math.round(item.tandemCount / item.totalCount * 10000) / 100.00 + '%',
          contactCount: item.contactCount === 0 ? 0 : Math.round(item.contactCount / item.totalCount * 10000) / 100.00 + '%',
          internalCount: item.internalCount === 0 ? 0 : Math.round(item.internalCount / item.totalCount * 10000) / 100.00 + '%',
          relayCount: item.relayCount === 0 ? 0 : Math.round(item.relayCount / item.totalCount * 10000) / 100.00 + '%',
          terminalCount: item.terminalCount === 0 ? 0 : Math.round(item.terminalCount / item.totalCount * 10000) / 100.00 + '%',
          totalCount: '100%'
        });
      });
      this.defaultTableValue = this.__dataset;
      this.ProgressShow = false;
    });
  }

  /**
   * 打开光缆段选择器
   */
  showCableSelect() {
    if (this.areaName) {
      if (this.areaId !== '') {
        const firstValue = this.selectDataCableId;
        // this.section_refreshData();
        const modal = this.$modal.create({
          nzTitle: this.statisticalLanguage.selectCableSegment,
          nzContent: this.sectionTemp,
          nzOkText: this.statisticalLanguage.okText,
          nzCancelText: this.statisticalLanguage.cancelText,
          nzOkType: 'danger',
          nzClassName: 'custom-create-modal',
          nzMaskClosable: false,
          nzWidth: 800,
          nzFooter: [
            {
              label: this.statisticalLanguage.okText,
              onClick: ($event) => {
                if (!this.selectDataCable) {
                  modal.destroy();
                  return;
                }
                const data = [];
                this.selectDataCable.forEach(item => {
                  data.push(item.opticCableSectionId);
                });
                this.selectDataCableId = data;
                const dataName = [];
                this.section_dataSet.map(item => {
                  this.selectDataCableId.map(_item => {
                    if (item.opticCableSectionId === _item) {
                      dataName.push(item.opticCableSectionName);
                    }
                  });
                });
                this.cableName = dataName.join();
                modal.destroy();
              }
            },
            {
              label: this.statisticalLanguage.cancelText,
              type: 'danger',
              onClick: () => {
                this.selectDataCableId = firstValue;
                modal.destroy();
              }
            },
          ]
        });
      }
    } else {
      this.$message.warning(this.statisticalLanguage.PleaseSelectArea);
    }
  }

  /**
   *初始化光缆段信息表单配置
   */
  private section_initTableConfig() {
    this.section_tableConfig = {
      isDraggable: true,
      isLoading: false,
      showSearchSwitch: true,
      showSearch: false,
      showSizeChanger: true,
      noIndex: true,
      notShowPrint: true,
      showPagination: true,
      bordered: false,
      searchReturnType: 'object',
      scroll: {x: '700px', y: '600px'},
      columnConfig: [
        {type: 'select', fixedStyle: {fixedLeft: true, style: {left: '0px'}}, width: 62},
        {
          type: 'serial-number', width: 62, title: this.statisticalLanguage.serialNumber,
          fixedStyle: {fixedLeft: true, style: {left: '62px'}}
        },
        { // 光缆段名称
          title: this.facilityLanguage.cableSegmentName,
          key: 'opticCableSectionName',
          width: 200,
          isShowSort: true,
          // configurable: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        { // 所属光缆名称
          title: this.facilityLanguage.nameOfTheCable,
          key: 'opticCableName',
          fixedStyle: {fixedRight: true, style: {left: '124px'}},
          width: 200,
          isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        {
          title: '', searchable: true,
          searchConfig: {type: 'operate'}, key: '', width: 120, fixedStyle: {fixedRight: true, style: {right: '0px'}}
        },
      ],
      // 光缆段列表排序
      sort: (event: SortCondition) => {
        this.section_queryCondition.sortCondition.sortField = event.sortField;
        this.section_queryCondition.sortCondition.sortRule = event.sortRule;
        this.section_refreshData();
      },
      handleSelect: (event, currentItem) => {
        this.selectDataCable = event;
      },
      handleSearch: (event) => {
        // this.section_pageBean.pageIndex = 1;
        this.section_queryCondition.bizCondition = event;
        this.section_refreshData();
      }
    };
  }

  /**
   * 打开区域选择器
   */
  showAreaSelector() {
    this.areaSelectorConfig.treeNodes = this.areaNodes;
    this.areaSelectVisible = true;
  }

  /**
   * 区域选择器选择事件
   * param event
   */
  areaSelectChange(event) {
    if (this.cableName !== '') {
      // 光缆段名称
      this.cableName = '';
      // 光缆段数据
      this.section_dataSet = [];
      // 选择的光缆段数据
      this.selectDataCable = [];
      // 选择的光缆段Id
      this.selectDataCableId = [];
    }
    if (event[0]) {
      FacilityForCommonUtil.setAreaNodesStatus(this.areaNodes, event[0].areaId, this.areaInfo.areaId);
      this.areaName = event[0].areaName;
      this.areaId = event[0].areaId;
      this.section_refreshData();
    } else {
      this.cableName = '';
      FacilityForCommonUtil.setAreaNodesStatus(this.areaNodes, null, this.areaInfo.areaId);
      this.areaName = '';
    }
  }

  /**
   * 初始化区域选择器配置
   * param nodes
   */
  private initAreaSelectorConfig(nodes) {
    this.areaSelectorConfig = {
      width: '500px',
      height: '300px',
      title: `${this.facilityLanguage.select}${this.facilityLanguage.area}`,
      treeSetting: {
        check: {
          enable: true,
          chkStyle: 'checkbox',
          chkboxType: {'Y': '', 'N': ''},
        },
        data: {
          simpleData: {
            enable: true,
            idKey: 'areaId',
          },
          key: {
            name: 'areaName'
          },
        },

        view: {
          showIcon: false,
          showLine: false
        }
      },
      treeNodes: nodes
    };
  }


}
