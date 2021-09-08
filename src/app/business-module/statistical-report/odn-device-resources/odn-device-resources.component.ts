import {Component,  OnInit,  TemplateRef, ViewChild} from '@angular/core';
import {TreeSelectorConfigModel} from '../../../shared-module/model/tree-selector-config.model';
import {PageModel} from '../../../shared-module/model/page.model';
import {TableConfigModel} from '../../../shared-module/model/table-config.model';
import {QueryConditionModel} from '../../../shared-module/model/query-condition.model';
import {NzI18nService, NzModalService} from 'ng-zorro-antd';
import {Result} from '../../../shared-module/entity/result';
import {ActivatedRoute} from '@angular/router';
import {ChartUtil} from '../../../shared-module/util/chart-util';
import {AreaModel} from '../../../core-module/model/facility/area.model';
import {OdnDeviceSelectComponent} from '../odn-device-select/odn-device-select.component';
import {CommonUtil} from '../../../shared-module/util/common-util';
import {CheckSelectInputComponent} from '../../../shared-module/component/check-select-input/check-select-input.component';
import {FiLinkModalService} from '../../../shared-module/service/filink-modal/filink-modal.service';
import {OdnService} from '../share/service/odn.service';
import {FacilityForCommonService} from '../../../core-module/api-service';
import {ResultModel} from '../../../shared-module/model/result.model';
import {FacilityForCommonUtil} from '../../../core-module/business-util/facility/facility-for-common.util';
import {StatisticalUtil} from '../share/util/statistical.util';

/**
 * ODN设施资源统计
 */
@Component({
  selector: 'app-odn-device-resources',
  templateUrl: './odn-device-resources.component.html',
  styleUrls: ['./odn-device-resources.component.scss']
})
export class OdnDeviceResourcesComponent implements OnInit {
  // 统计表格前端筛选的默认数据
  defaultTableValue = [];
  // 提示语
  placeHolder;
  // 查询条件
  queryCondition: QueryConditionModel = new QueryConditionModel();
  // 选择的设施名称
  deviceName;
  // 选择的区域名称
  areaName = '';
  // 区域选择器显示隐藏
  areaSelectVisible = false;
  // 区域选择器
  areaSelectorConfig: any = new TreeSelectorConfigModel();
  facilityLanguage;
  statisticalLanguage;
  // 区域树数据
  areaNodes = [];
  // 设施多选下拉框list
  deviceList = [];
  // 区域信息
  areaInfo: any = new AreaModel();
  // 饼图实例
  ringChartInstance;
  // 柱状图实例
  barChartInstance;
  // 显示隐藏
  hide = false;
  // 表格数据
  __dataset: any[] = [];
  // 框、盘信息
  boxList = [];
  // 设施列表数据
  deviceDataSet = [];
  // 提供前端手动筛选
  _deviceDataSet = [];
  deviceDataSet_ = [];
  // 设施翻页配置
  devicePageBean: PageModel = new PageModel(10, 1, 1);
  // 表格翻页配置
  pageBean: PageModel = new PageModel(10, 1, 1);
  // 表格配置
  tableConfig: TableConfigModel;
  // 设施表格配置
  deviceTableConfig: TableConfigModel;
  // 页面标题
  pageTitleType;
  // 选择的设施id
  selectedDeviceId;
  // 选择是数据1
  selectDateOne;
  // 下拉列表集合
  selectInfo = [];
  listOfSelectedValue;
  // 进度条
  ProgressShow = false;
  // 选择ODN设施组件
  @ViewChild('selectOdnDeviceComp') selectOdnDeviceComp: OdnDeviceSelectComponent;
  // 选择框模板
  @ViewChild('selectOdnBoxComp') selectOdnBoxComp: OdnDeviceSelectComponent;
  // 设施模板
  @ViewChild('deviceTemp') deviceTemp: TemplateRef<any>;
  // 单选按钮
  @ViewChild('radioTemp') radioTemp: TemplateRef<any>;
  @ViewChild('checkListComp') checkListComp: CheckSelectInputComponent;

  constructor(private $NZi18: NzI18nService,
              // private $facilityUtilService: FacilityUtilService,
              private $activatedRoute: ActivatedRoute,
              private $modal: NzModalService,
              // private $facilityService: FacilityService,
              private $OdnDeviceService: OdnService,
              public $message: FiLinkModalService,
              private $facilityCommonService: FacilityForCommonService
  ) {
  }

  ngOnInit() {
    this.facilityLanguage = this.$NZi18.getLocaleData('facility');
    this.statisticalLanguage = this.$NZi18.getLocaleData('statistical');
    this.getPageType();
    const tableData = {};
    // this.$facilityUtilService.getArea().then((data: NzTreeNode[]) => {
    //   this.$facilityUtilService.setAreaNodesStatus(data, null, null);
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
    this.initDeviceTable();
  }

  /**
   * 获取页面类型
   */
  getPageType() {
    switch (this.$activatedRoute.snapshot.url[0].path) {
      case 'odn-jump-fiber':
        this.pageTitleType = 'jump';
        this.initTableConfig();
        break;
      case 'odn-fused-fiber':
        this.pageTitleType = 'fused';
        this.initTableConfig();
        break;
      case 'odn-disc':
        this.pageTitleType = 'disc';
        this.placeHolder = this.statisticalLanguage.selectDisc;
        this.initTableConfig();
        break;
      case 'odn-box':
        this.pageTitleType = 'box';
        this.placeHolder = this.statisticalLanguage.selectBox;
        this.initTableConfig();
        break;
    }
  }

  /**
   * 区域选择器选择事件
   * param event
   */
  areaSelectChange(event) {
    if (this.selectOdnDeviceComp) {
      this.selectOdnDeviceComp.clear();
    } else {
      this.deviceName = '';
      this._deviceDataSet = [];
      this.selectInfo = [];
      this.checkListComp.clearData();
    }
    if (event[0]) {
      this.deviceList = [];
      // SessionUtil.getUserInfo().role.roleDevicetypeList
      FacilityForCommonUtil.setAreaNodesStatus(this.areaNodes, event[0].areaId, this.areaInfo.areaId);
      this.areaName = event[0].areaName;
      const queryData = {};
      queryData['areaIds'] = [event[0].areaId];
      queryData['deviceTypes'] = ['001', '210', '060'];
      const deciveLists = [];
      this.$OdnDeviceService.queryAreaOdnDevice(queryData).subscribe((result: Result) => {
        result.data.map(item => {
          deciveLists.push({label: item.deviceName, value: item.deviceId, code: item.deviceType});
        });
        this.deviceList = deciveLists;
        this.deviceDataSet = result.data;
        this.deviceDataSet_ = result.data;
        this.showDeviceList();
        this.deviceDataSet.map(item => {
          // item.deviceType = getDeviceType(this.$NZi18, item.deviceType);
          item.deviceType = FacilityForCommonUtil.translateDeviceType(this.$NZi18, item.deviceType);
          // item.deviceStatus = getDeviceStatus(this.$NZi18, item.deviceStatus);
          item.deviceStatus = FacilityForCommonUtil.translateDeviceStatus(this.$NZi18, item.deviceStatus);
        });
      });
    } else {
      this.deviceList = [];
      FacilityForCommonUtil.setAreaNodesStatus(this.areaNodes, null, this.areaInfo.areaId);
      this.areaName = '';
    }
  }

  /**
   * 显示区域选择器
   */
  showAreaSelect() {
    this.areaSelectorConfig.treeNodes = this.areaNodes;
    this.areaSelectVisible = true;
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

  /**
   * 统计
   */
  statistical() {
    this.ProgressShow = true;
    this.hide = true;
    const deviceSelectList = [];
    this.deviceList.map(item => {
      if (item.checked) {
        deviceSelectList.push(item.value);
      }
    });
    if (this.pageTitleType === 'fused') {
      this.$OdnDeviceService.meltFiberPortStatistics({facilities: deviceSelectList}).subscribe((result: Result) => {
        this.setChartData(result.data);
        this.ProgressShow = false;
      });
    } else if (this.pageTitleType === 'jump') {
      this.$OdnDeviceService.jumpFiberPortStatistics({facilities: deviceSelectList}).subscribe((result: Result) => {
        this.setChartData(result.data);
        this.ProgressShow = false;
      });
    } else if (this.pageTitleType === 'box') {
      const data = {};
      data['deviceId'] = this.selectedDeviceId;
      data['frameNos'] = this.selectInfo.filter(item => item.checked);
      data['frameNos'] = data['frameNos'].map(item => item.value);
      this.$OdnDeviceService.framePortStatistics(data).subscribe((result: Result) => {
        this.setChartData(result.data);
        this.ProgressShow = false;
      });
    } else {
      const data = {};
      data['deviceId'] = this.selectedDeviceId;
      data['plateIds'] = this.selectInfo.filter(item => item.checked);
      data['plateIds'] = data['plateIds'].map(item => item.value);
      this.$OdnDeviceService.discPortStatistics(data).subscribe((result: Result) => {
        this.setChartData(result.data);
        this.ProgressShow = false;
      });
    }
    // this.$OdnDeviceService.jumpFiberPortStatistics({'facilities': deviceSelectList}).subscribe((result: Result) => {
    //   this.setChartData(result.data);
    // });
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

  _pageChange(event) {
    this.devicePageBean.pageIndex = event.pageIndex;
    this.devicePageBean.pageSize = event.pageSize;
    this.showDeviceList();
  }

  /**
   * 初始化表格配置
   */
  initTableConfig() {
    const columns = [];
    if (this.pageTitleType === 'fused') {
      columns.push(
        {
          title: '',
          width: 150,
          key: 'tableName',
          searchable: true,
          searchConfig: {
            type: 'input'
          }
        },
        {
          title: this.statisticalLanguage.usedPortCount,
          width: 150,
          key: 'usedPortCount',
          searchable: true,
          searchConfig: {
            type: 'input'
          }
        },
        {
          title: this.statisticalLanguage.unusedPortCount,
          width: 150,
          key: 'unusedPortCount',
          searchable: true,
          searchConfig: {
            type: 'input'
          }
        },
        {
          title: this.statisticalLanguage.totalCount,
          width: 150, key: 'totalCount',
          searchable: true,
          searchConfig: {
            type: 'input'
          }
        }
      );
    } else {
      columns.push(
        {
          title: '', width: 150,
          key: 'tableName',
          searchable: true,
          searchConfig: {
            type: 'input'
          }
        },
        {
          title: this.statisticalLanguage.usedCount,
          width: 150,
          key: 'usedCount',
          searchable: true,
          searchConfig: {
            type: 'input'
          }
        },
        {
          title: this.statisticalLanguage.unusedCount,
          width: 150,
          key: 'unusedCount',
          searchable: true,
          searchConfig: {
            type: 'input'
          }
        },
        {
          title: this.statisticalLanguage.exceptionCount,
          width: 150, key: 'exceptionCount',
          searchable: true,
          searchConfig: {
            type: 'input'
          }
        },
        {
          title: this.statisticalLanguage.advanceCount,
          width: 150, key: 'advanceCount',
          searchable: true,
          searchConfig: {
            type: 'input'
          }
        },
        {
          title: this.statisticalLanguage.virtualCount,
          width: 150, key: 'virtualCount',
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
        },
      );
    }
    this.tableConfig = {
      noIndex: true,
      showSearchExport: true,
      // showSearchSwitch: true,
      notShowPrint: true,
      noExportHtml: true,
      isDraggable: false,
      scroll: {x: '1000px', y: '325px'},
      columnConfig: columns,
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
      },
      handleExport: (event) => {
        this.setExport(event);
      }
    };
    this.tableConfig.columnConfig.push({
      title: '', searchable: true,
      searchConfig: {type: 'operate'}, key: '', width: 75, fixedStyle: {fixedRight: true, style: {right: '0px'}}
    });
  }

  /**
   * 处理导出
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
    if (this.pageTitleType === 'box') {
      this.$OdnDeviceService.exportFramePortStatistics(data).subscribe((result: Result) => {
        if (result.code === 0) {
          this.$message.success(result.msg);
        } else {
          this.$message.error(result.msg);
        }
      });
    } else if (this.pageTitleType === 'disc') {
      this.$OdnDeviceService.exportDiscPortStatistics(data).subscribe((result: Result) => {
        if (result.code === 0) {
          this.$message.success(result.msg);
        } else {
          this.$message.error(result.msg);
        }
      });
    } else if (this.pageTitleType === 'jump') {
      this.$OdnDeviceService.exportJumpFiberPortStatistics(data).subscribe((result: Result) => {
        if (result.code === 0) {
          this.$message.success(result.msg);
        } else {
          this.$message.error(result.msg);
        }
      });
    } else {
      this.$OdnDeviceService.exportMeltFiberPortStatistics(data).subscribe((result: Result) => {
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
    this.__dataset = [CommonUtil.deepClone(data)];
    if (this.pageTitleType === 'fused') {
      this.__dataset.map(item => {
        item['tableName'] = this.statisticalLanguage.quantity;
        this.__dataset.push({
          tableName: this.statisticalLanguage.PercentageShare,
          usedPortCount: item.usedPortCount === 0 ? 0 : Math.round(item.usedPortCount / item.totalCount * 10000) / 100.00 + '%',
          unusedPortCount: item.unusedPortCount === 0 ? 0 : Math.round(item.unusedPortCount / item.totalCount * 10000) / 100.00 + '%',
          totalCount: '100%'
        });
      });
    } else {
      this.__dataset.map(item => {
        item['tableName'] = this.statisticalLanguage.quantity;
        this.__dataset.push({
          tableName: this.statisticalLanguage.PercentageShare,
          usedCount: item.usedCount === 0 ? 0 : Math.round(item.usedCount / item.totalCount * 10000) / 100.00 + '%',
          unusedCount: item.unusedCount === 0 ? 0 : Math.round(item.unusedCount / item.totalCount * 10000) / 100.00 + '%',
          exceptionCount: item.exceptionCount === 0 ? 0 : Math.round(item.exceptionCount / item.totalCount * 10000) / 100.00 + '%',
          advanceCount: item.advanceCount === 0 ? 0 : Math.round(item.advanceCount / item.totalCount * 10000) / 100.00 + '%',
          virtualCount: item.virtualCount === 0 ? 0 : Math.round(item.virtualCount / item.totalCount * 10000) / 100.00 + '%',
          totalCount: '100%'
        });
      });
    }
    this.defaultTableValue = CommonUtil.deepClone(this.__dataset);
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
   * 查询框盘信息
   */
  queryBox() {

    this.$OdnDeviceService.queryTemplateTop(this.selectedDeviceId).subscribe((result: Result) => {
      const selectInfo = [];
      result.data = result.data.sort((a, b) => {
        return a.businessNum - b.businessNum;
      });
      // 框统计
      if (this.pageTitleType === 'box') {
        result.data.forEach(item => {
          if (item.side === 0) {
            selectInfo.push({label: 'A' + item.businessNum, value: item.id});
          } else if (item.side === 1) {
            selectInfo.push({label: 'B' + item.businessNum, value: item.id});
          }
        });
        // 熔配盘统计;
      } else {
        result.data.forEach(item => {
          item.childList.sort((a, b) => {
            return a.businessNum - b.businessNum;
          });
        });
        result.data.forEach(item => {
          if (item.childList.length > 0) {
            item.childList.forEach(_item => {
              if (item.side === 0 && _item.side === 0) {
                selectInfo.push({label: 'A' + item.businessNum + '-' + _item.businessNum, value: _item.id});
              } else if (item.side === 0 && _item.side === 1) {
                selectInfo.push({label: 'A' + item.businessNum + '-' + _item.businessNum, value: _item.id});
              } else if (item.side === 1 && _item.side === 0) {
                selectInfo.push({label: 'B' + item.businessNum + '-' + _item.businessNum, value: _item.id});
              } else if (item.side === 1 && _item.side === 1) {
                selectInfo.push({label: 'B' + item.businessNum + '-' + _item.businessNum, value: _item.id});
              }
            });
          }
        });
      }

      selectInfo.sort((a, b) => {
        return a.label[0].charCodeAt() - b.label[0].charCodeAt();
      });

      this.selectInfo = selectInfo;

    });
  }


  /**
   * 选择设施事件
   * param event
   * param data
   */
  selectedDeviceChange(event, data) {
    this.selectDateOne = data;
  }

  /**
   * 初始化设施选择器表格配置
   */
  initDeviceTable() {
    this.deviceTableConfig = {
      noIndex: true,
      showPagination: true,
      simplePage: true,
      showSearchSwitch: true,
      notShowPrint: true,
      isDraggable: false,
      scroll: {x: '1000px', y: '325px'},
      columnConfig: [
        {
          title: '',
          type: 'render',
          key: 'selectedAlarmId',
          renderTemplate: this.radioTemp,
          fixedStyle: {fixedLeft: true, style: {left: '0px'}}, width: 62
        },
        {
          type: 'serial-number', width: 62, title: this.facilityLanguage.serialNumber
        },
        {title: this.facilityLanguage.deviceName_a, width: 150, key: 'deviceName', searchable: true, searchConfig: {type: 'input'}},
        {title: this.facilityLanguage.deviceType_a, width: 150, key: 'deviceType', searchable: true, searchConfig: {type: 'input'}},
        {title: this.facilityLanguage.deviceStatus_a, width: 100, key: 'deviceStatus', searchable: true, searchConfig: {type: 'input'}},
        {title: this.facilityLanguage.affiliatedArea, key: 'areaName', searchable: true, searchConfig: {type: 'input'}},
        {
          title: '', searchable: true,
          searchConfig: {type: 'operate'}, key: '', width: 75, fixedStyle: {fixedRight: true, style: {right: '0px'}}
        },
      ],
      handleSearch: (event) => {
        if (event && event.length) {
          // 有筛选数据时进入
          event.forEach(item => {
            this.deviceDataSet_ = this.deviceDataSet.filter(items => {
              const index = (items[item.filterField] + '').indexOf(item.filterValue);
              return index !== -1;
            });
          });
          this.devicePageBean.pageIndex = 1;
          this.showDeviceList();
        } else {
          // 重置表格
          this.deviceDataSet_ = this.deviceDataSet;
          this.devicePageBean.pageIndex = 1;
          this.showDeviceList();
        }
      }
    };
  }

  /**
   * 打开设施选择器
   */
  showDeviceSelect() {
    if (this.areaName) {
      let firstOpenValue;
      if (this.selectDateOne) {
        firstOpenValue = this.selectDateOne.deviceId;
      }
      this.deviceDataSet_ = this.deviceDataSet;
      const modal = this.$modal.create({
        nzTitle: this.statisticalLanguage.selectDevice,
        nzContent: this.deviceTemp,
        nzOkText: this.statisticalLanguage.okText,
        nzCancelText: this.statisticalLanguage.cancelText,
        nzOkType: 'danger',
        nzClassName: 'custom-create-modal',
        nzMaskClosable: false,
        nzWidth: 1000,
        nzFooter: [
          {
            label: this.statisticalLanguage.okText,
            onClick: ($event) => {
              if (this.selectDateOne) {
                this.deviceName = this.selectDateOne.deviceName;
                this.selectedDeviceId = this.selectDateOne.deviceId;
                this.queryBox();
              }
              modal.destroy();
              this.checkListComp.clearData();
            }
          },
          {
            label: this.statisticalLanguage.cancelText,
            type: 'danger',
            onClick: () => {
              this.selectedDeviceId = firstOpenValue;
              modal.destroy();
            }
          },
        ]
      });
    } else {
      this.$message.warning(this.statisticalLanguage.PleaseSelectArea);
    }
  }

  /**
   * 按钮效验
   */
  isDisable() {
    if (this.areaName) {
      if (this.pageTitleType === 'box' || this.pageTitleType === 'disc') {
        if (this.deviceName && this.selectInfo.filter(item => item.checked).length > 0) {
          return false;
        } else {
          return true;
        }
      } else {
        if (this.deviceList.filter(item => item.checked).length > 0) {
          return false;
        } else {
          return true;
        }
      }
    } else {
      return true;
    }
  }

  /**
   * 显示设施集合
   */
  showDeviceList() {
    this.devicePageBean.Total = this.deviceDataSet_.length;
    const startIndex = this.devicePageBean.pageSize * (this.devicePageBean.pageIndex - 1);
    const endIndex = startIndex + this.devicePageBean.pageSize - 1;
    this._deviceDataSet = this.deviceDataSet_.filter((item, index) => {
      return index >= startIndex && index <= endIndex;
    });
  }
}
