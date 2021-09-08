import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Result} from '../../../shared-module/entity/result';
import {PageModel} from '../../../shared-module/model/page.model';
import {TableConfigModel} from '../../../shared-module/model/table-config.model';
import {NzI18nService, NzModalService} from 'ng-zorro-antd';
import {QueryConditionModel} from '../../../shared-module/model/query-condition.model';
import {StatisticalLanguageInterface} from '../../../../assets/i18n/statistical/statistical-language.interface';
import {getJumpType} from '../statistical.config';
import {ResultModel} from '../../../shared-module/model/result.model';
import {OdnService} from '../share/service/odn.service';
import {FacilityForCommonService} from '../../../core-module/api-service/facility';
import {FacilityForCommonUtil} from '../../../core-module/business-util/facility/facility-for-common.util';
import {FacilityListModel} from '../../../core-module/model/facility/facility-list.model';
import {CommonUtil} from '../../../shared-module/util/common-util';
import {DeviceTypeEnum} from '../../../core-module/enum/facility/facility.enum';

/**
 * ODN跳接关系统计
 */
@Component({
  selector: 'app-odn-device-jumper',
  templateUrl: './odn-device-jumper.component.html',
  styleUrls: ['./odn-device-jumper.component.scss']
})
export class OdnDeviceJumperComponent implements OnInit {
  // 表格数据
  _dataset = [];
  // 默认表格数据 筛选用
  defaultTableValue = [];
  // 选择设施表格数据
  deviceDataSet = [];
  // 选择设施2表格数据
  deviceTwoDataSet = [];
  // 统计表格分页配置
  pageBean: PageModel = new PageModel(10, 1, 10);
  // 选择设施1 表格分页配置
  devicePageBeanOne: PageModel = new PageModel(10, 1, 10);
  // 选择设施2 表格分页配置
  deviceTwoPageBean: PageModel = new PageModel(10, 1, 10);
  // 统计表格配置
  tableConfig: TableConfigModel;
  // 选择设施1表格配置
  deviceTableConfig: TableConfigModel;
  // 选择设施2表格配置
  deviceTwoTableConfig: TableConfigModel;
  // 选择设施1查询条件
  deviceQueryOne = new QueryConditionModel();
  // 选择设施2 查询条件
  deviceQueryTwo = new QueryConditionModel();
  // 页面类型
  pageTypes;
  // 设施1名称
  deviceNameOne;
  // 设施2名称
  deviceNameTwo;
  // 显示隐藏
  isVisible = false;
  // 选择设施1 id
  selectedDeviceId;
  // 选择设施2 Id
  selectedDeviceTwoId;
  // 选择设施1 数据
  selectDateOne;
  // 选择设施2 数据
  selectDateTwo;
  // 统计图表显示隐藏
  hide = false;
  // loading状态
  showLoading = true;
  // 进度条
  ProgressShow = false;
  // 统计国际化
  statisticalLanguage: StatisticalLanguageInterface;
  // 选择设施1 模板
  @ViewChild('deviceTemp') deviceTemp: TemplateRef<any>;
  // 选择设施2 模板
  @ViewChild('deviceTwoTemp') deviceTwoTemp: TemplateRef<any>;
  // 单选按钮模板
  @ViewChild('radioTemp') radioTemp: TemplateRef<any>;
  // 单选按钮2 模板
  @ViewChild('radioTwoTemp') radioTwoTemp: TemplateRef<any>;

  constructor(private $activeRouter: ActivatedRoute,
              private $OdnDeviceService: OdnService,
              private $modal: NzModalService,
              private $facilityApiService: FacilityForCommonService,
              private $nzi18n: NzI18nService) {
  }

  ngOnInit() {
    this.statisticalLanguage = this.$nzi18n.getLocaleData('statistical');
    this.getPageType();
    this.initTableConfig();
  }

  pageChange(event) {
  }

  devicePageChangeOne(event) {
    this.deviceTableConfig.isLoading = true;
    this.deviceQueryOne.pageCondition.pageNum = event.pageIndex;
    this.deviceQueryOne.pageCondition.pageSize = event.pageSize;
    this.queryDeviceList();
  }

  deviceTwoPageChangeOne(event) {
    this.deviceTwoTableConfig.isLoading = true;
    this.deviceQueryOne.pageCondition.pageNum = event.pageIndex;
    this.deviceQueryOne.pageCondition.pageSize = event.pageSize;
    this.queryDeviceTwoList();
  }

  getPageType() {
    this.pageTypes = this.$activeRouter.snapshot.url[1].path;
  }

  showDeviceSelect() {
    this.deviceTableConfig.isLoading = true;
    this.devicePageBeanOne.pageIndex = 1;
    this.deviceQueryOne.pageCondition.pageNum = 1;
    this.queryDeviceList();
    const modal = this.$modal.create({
      nzTitle: this.pageTypes === 'outer' ? this.statisticalLanguage.selectDeviceOne : this.statisticalLanguage.selectDevice,
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
          onClick: (event) => {
            if (this.selectDateOne) {
              this.deviceNameOne = this.selectDateOne.deviceName;
              this.selectedDeviceId = this.selectDateOne.deviceId;
            }
            modal.destroy();
          }
        },
        {
          label: this.statisticalLanguage.cancelText,
          type: 'danger',
          onClick: () => {
            if (!this.deviceNameOne) {
              this.selectDateOne = '';
              this.selectedDeviceId = null;
            }
            modal.destroy();
          }
        },
      ]
    });
  }

  showDeviceTwoSelect() {
    this.deviceTwoTableConfig.isLoading = true;
    this.deviceTwoPageBean.pageIndex = 1;
    this.deviceQueryTwo.pageCondition.pageNum = 1;
    this.queryDeviceTwoList();

    const modal = this.$modal.create({
      nzTitle: this.statisticalLanguage.selectDeviceTwo,
      nzContent: this.deviceTwoTemp,
      nzOkText: this.statisticalLanguage.okText,
      nzCancelText: this.statisticalLanguage.cancelText,
      nzOkType: 'danger',
      nzClassName: 'custom-create-modal',
      nzMaskClosable: false,
      nzWidth: 1000,
      nzFooter: [
        {
          label: this.statisticalLanguage.okText,
          onClick: (event) => {
            if (this.selectDateTwo) {
              this.deviceNameTwo = this.selectDateTwo.deviceName;
              this.selectedDeviceTwoId = this.selectDateTwo.deviceId;
            }
            modal.destroy();
          }
        },
        {
          label: this.statisticalLanguage.cancelText,
          type: 'danger',
          onClick: () => {
            if (!this.deviceNameTwo) {
              this.selectDateTwo = '';
              this.selectedDeviceTwoId = null;
            }
            modal.destroy();
          }
        },
      ]
    });
  }

  statistical() {
    // 进度条
    this.ProgressShow = true;
    this.hide = false;
    this.showLoading = false;
    const requestData = {};
    if (this.pageTypes === 'inner') {
      requestData['deviceId'] = this.selectedDeviceId;
    } else {
      requestData['deviceId'] = this.selectedDeviceId;
      requestData['deviceName'] = this.deviceNameOne;
      requestData['oppositeDeviceName'] = this.deviceNameTwo;
      requestData['oppositeDeviceId'] = this.selectedDeviceTwoId;
    }
    this.$OdnDeviceService[this.pageTypes](requestData).subscribe((result: Result) => {
      if (result.code === 0) {
        this.hide = true;
        this.showLoading = true;
        result.data.map(item => {
          item.branchingUnit = getJumpType(this.$nzi18n, 'statistical', item.branchingUnit);
        });
        this._dataset = result.data;
        this.defaultTableValue = result.data;
      }
      this.ProgressShow = false;
    });
  }

  selectDataChange(event) {
  }


  initTableConfig() {
    const columns = [];
    if (this.pageTypes === 'inner') {
      columns.push(
        {
          // 序号
          type: 'serial-number',
          width: 70,
          title: this.statisticalLanguage.serialNumber,
        },
        {
          // 本端端口号
          title: this.statisticalLanguage.localPortNumber,
          width: 150,
          key: 'portNo',
          searchable: true,
          searchConfig: {
            type: 'input'
          }
        },
        {
          // 对端端口号
          title: this.statisticalLanguage.peerPortNumber,
          width: 150,
          key: 'oppositePortNo',
          searchable: true,
          searchConfig: {
            type: 'input'
          }
        },
        {
          // 跳接类型
          title: this.statisticalLanguage.jumperType,
          width: 150,
          key: 'branchingUnit',
          searchable: true,
          searchConfig: {
            type: 'input'
          }
        }, {
          title: this.statisticalLanguage.jumperInformation,
          width: 150,
          key: 'remark',
          searchable: true,
          searchConfig: {
            type: 'input'
          }
        }
      );
    } else {
      columns.push(
        {
          type: 'serial-number',
          width: 70, title: this.statisticalLanguage.serialNumber,
          fixedStyle: {fixedLeft: true, style: {left: '0px'}}
        },
        {
          title: this.statisticalLanguage.localFacility,
          width: 150,
          key: 'deviceName',
          searchable: true,
          searchConfig: {
            type: 'input'
          }
        },
        {
          title: this.statisticalLanguage.localPort,
          width: 150,
          key: 'portNo',
          searchable: true,
          searchConfig: {
            type: 'input'
          }
        },
        {
          title: this.statisticalLanguage.peerFacility,
          width: 150,
          key: 'oppositeDeviceName',
          searchable: true,
          searchConfig: {
            type: 'input'
          }
        }, {
          title: this.statisticalLanguage.peerPort,
          width: 150,
          key: 'oppositePortNo',
          searchable: true,
          searchConfig: {
            type: 'input'
          }
        }, {
          title: this.statisticalLanguage.jumperType,
          width: 150,
          key: 'branchingUnit',
          searchable: true,
          searchConfig: {
            type: 'input'
          }
        }, {
          title: this.statisticalLanguage.jumperInformation,
          width: 150,
          key: 'remark',
          searchable: true,
          searchConfig: {
            type: 'input'
          }
        }
      );
    }
    this.tableConfig = {
      noIndex: true,
      showSearchExport: true,
      showSearchSwitch: true,
      showSearch: false,
      noExportHtml: true,
      notShowPrint: true,
      scroll: {x: '1000px', y: '325px'},
      columnConfig: columns,
      handleExport: (e) => {
        this.setExport(e);
      },
      handleSearch: (event) => {
        // if (event && event.length) {
        //   // 有筛选数据时进入
        //   event.forEach(item => {
        //     this._dataset = this._dataset.filter(items => {
        //       return items[item.filterField] + '' === item.filterValue;
        //     });
        //   });
        // } else {
        //   // 重置表格
        //   this._dataset = this.defaultTableValue;
        // }
        if (event && event.length) {
          // 有筛选数据时进入
          event.forEach(item => {
            this._dataset = this.defaultTableValue.filter(items => {
              const index = (items[item.filterField] + '').indexOf(item.filterValue);
              return index !== -1;
            });
          });
        } else {
          // 重置表格
          this._dataset = this.defaultTableValue;
        }
      }
    };
    this.tableConfig.columnConfig.push({
      title: '', searchable: true,
      searchConfig: {type: 'operate'}, key: '', width: 75, fixedStyle: {fixedRight: true, style: {right: '0px'}}
    });
    this.deviceTableConfig = {
      noIndex: true,
      showPagination: true,
      showSearch: false,
      isLoading: true,
      showSearchSwitch: true,
      notShowPrint: true,
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
          type: 'serial-number', width: 62, title: this.statisticalLanguage.serialNumber
        },
        {title: this.statisticalLanguage.deviceName, width: 150, key: 'deviceName', searchable: true, searchConfig: {type: 'input'}},
        {
          title: this.statisticalLanguage.deviceType,
          width: 150,
          key: 'deviceType',
        },
        {title: this.statisticalLanguage.ownAreaName, width: 200, key: 'areaName', searchable: true, searchConfig: {type: 'input'}},
        {
          title: '', searchable: true,
          searchConfig: {type: 'operate'}, key: '', width: 75, fixedStyle: {fixedRight: true, style: {right: '0px'}}
        },
      ],
      handleSearch: (event) => {
        this.deviceQueryOne.filterConditions = [];
        this.deviceTableConfig.isLoading = true;
        this.deviceQueryOne.filterConditions = event;
        this.queryDeviceList();
      }
    };
    this.deviceTwoTableConfig = {
      noIndex: true,
      showPagination: true,
      showSearch: false,
      isLoading: true,
      showSearchSwitch: true,
      notShowPrint: true,
      scroll: {x: '1000px', y: '325px'},
      columnConfig: [
        {
          title: '',
          type: 'render',
          key: 'selectedAlarmId',
          renderTemplate: this.radioTwoTemp,
          fixedStyle: {fixedLeft: true, style: {left: '0px'}}, width: 62
        },
        {
          title: this.statisticalLanguage.serialNumber,
          type: 'serial-number',
          width: 62,
        },
        {
          title: this.statisticalLanguage.deviceName,
          width: 150, key: 'deviceName',
          searchable: true, searchConfig: {type: 'input'}
        },
        {
          title: this.statisticalLanguage.deviceType,
          width: 150,
          key: 'deviceType'
        },
        {
          title: this.statisticalLanguage.ownAreaName,
          width: 200, key: 'areaName',
          searchable: true,
          searchConfig: {type: 'input'}
        },
        {
          title: '',
          searchable: true,
          searchConfig: {type: 'operate'},
          key: '', width: 75,
          fixedStyle: {
            fixedRight: true, style: {right: '0px'}
          }
        },
      ],
      handleSearch: (event) => {
        this.deviceQueryTwo.filterConditions = [];
        this.deviceTwoTableConfig.isLoading = true;
        this.deviceQueryTwo.filterConditions = event;
        this.queryDeviceTwoList();
      }
    };
  }

  setExport(data) {
    data.objectList = this._dataset;
    data.queryCondition = {
      'filterConditions': [],
      'pageCondition': {},
      'sortCondition': {},
      'bizCondition': {}
    };
    if (this.pageTypes === 'inner') {
      this.$OdnDeviceService.exportJumpConnectionInCabinet(data).subscribe((result: Result) => {
      });
    } else {
      this.$OdnDeviceService.exportJumpConnectionOutCabinet(data).subscribe((result: Result) => {
      });
    }
  }

  queryDeviceList() {
    if (this.pageTypes === 'outer') {
      this.deviceQueryOne.filterConditions.push({filterValue: ['060'], filterField: 'deviceType', operator: 'in'});
    } else {
      this.deviceQueryOne.filterConditions.push({filterValue: ['060', '001'], filterField: 'deviceType', operator: 'in'});
    }
    this.deviceQueryOne.pageCondition.pageNum = this.devicePageBeanOne.pageIndex;
    this.deviceQueryOne.pageCondition.pageSize = this.devicePageBeanOne.pageSize;
    this.$facilityApiService.deviceListByPage(this.deviceQueryOne).subscribe((result: ResultModel<FacilityListModel[]>) => {
      this.deviceTableConfig.isLoading = false;
      this.devicePageBeanOne.Total = result.totalCount;
      this.devicePageBeanOne.pageIndex = result.pageNum;
      this.deviceDataSet = result.data;
      this.deviceDataSet.map(item => {
        item.deviceType = FacilityForCommonUtil.translateDeviceType(this.$nzi18n, item.deviceType);
        if (this.selectedDeviceId && item.deviceId === this.selectedDeviceTwoId) {
          item.disable = true;
        } else {
          item.disable = false;
        }
      });
    });
  }

  queryDeviceTwoList() {
    this.deviceQueryTwo.filterConditions.push({filterValue: ['060'], filterField: 'deviceType', operator: 'in'});
    this.deviceQueryTwo.pageCondition.pageNum = this.deviceTwoPageBean.pageIndex;
    this.deviceQueryTwo.pageCondition.pageSize = this.deviceTwoPageBean.pageSize;
    this.$facilityApiService.deviceListByPage(this.deviceQueryTwo).subscribe((result: ResultModel<FacilityListModel[]>) => {
      this.deviceTwoTableConfig.isLoading = false;
      this.deviceTwoPageBean.Total = result.totalCount;
      this.deviceTwoPageBean.pageIndex = result.pageNum;
      this.deviceTwoDataSet = result.data;
      this.deviceTwoDataSet.map(item => {
        // item.deviceType = getDeviceType(this.$nzi18n, item.deviceType);
        item.deviceType = CommonUtil.codeTranslate(DeviceTypeEnum, this.$nzi18n, item.deviceType);
        if (this.selectedDeviceId && item.deviceId === this.selectedDeviceId) {
          item.disable = true;
        } else {
          item.disable = false;
        }
      });
    });
  }

  selectedDeviceChange(event, data) {
    this.selectDateOne = data;
  }

  selectedDeviceTwoChange(event, data) {
    this.selectDateTwo = data;
  }
}
