import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {TreeSelectorConfigModel} from '../../../shared-module/model/tree-selector-config.model';
import {PageModel} from '../../../shared-module/model/page.model';
import {TableConfigModel} from '../../../shared-module/model/table-config.model';
import {QueryConditionModel, SortCondition} from '../../../shared-module/model/query-condition.model';
import {NzI18nService, NzModalService} from 'ng-zorro-antd';
import {ActivatedRoute} from '@angular/router';
import {ChartUtil} from '../../../shared-module/util/chart-util';
import {CommonUtil} from '../../../shared-module/util/common-util';
import {StatisticalLanguageInterface} from '../../../../assets/i18n/statistical/statistical-language.interface';
import {FiLinkModalService} from '../../../shared-module/service/filink-modal/filink-modal.service';
import {ResultModel} from '../../../shared-module/model/result.model';
import {DeviceStatisticalService} from '../share/service/device-statistical.service';
import {FacilityForCommonService} from '../../../core-module/api-service/facility';
import {StatisticalUtil} from '../share/util/statistical.util';
import {FacilityForCommonUtil} from '../../../core-module/business-util/facility/facility-for-common.util';
import {FacilityListModel} from '../../../core-module/model/facility/facility-list.model';
import {DeployStatusEnum, DeviceStatusEnum, DeviceTypeEnum, sensorValueEnum} from '../../../core-module/enum/facility/facility.enum';
import {ResultCodeEnum} from '../../../shared-module/enum/result-code.enum';
import {ExportRequestModel} from '../../../shared-module/model/export-request.model';
import {DeviceReqModel} from '../share/model/device/device-req.model';
import {ChartColor} from '../share/const/chart-color';
import {LanguageEnum} from '../../../shared-module/enum/language.enum';
import {Observable} from 'rxjs';
import {OperatorEnum} from '../../../shared-module/enum/operator.enum';

/**
 * 设施统计
 */
@Component({
  selector: 'app-device-statistical',
  templateUrl: './device-statistical.component.html',
  styleUrls: ['./device-statistical.component.scss']
})
export class DeviceStatisticalComponent implements OnInit {
  // 单选按钮
  @ViewChild('radioTemp') radioTemp: TemplateRef<any>;
  // 设施模板
  @ViewChild('deviceTemp') deviceTemp: TemplateRef<any>;
  // 按钮禁用状态
  public btnDisabled = true;
  public language: StatisticalLanguageInterface;
  // 区域名称
  public areaName = '';
  // 表格数据默认值，用于前台筛选用
  private defaultTableValue = [];
  // loading状态
  public isLoading = true;
  // 表格分页配置
  public pageBean: PageModel = new PageModel(10, 1, 1);
  // 表格配置
  public tableConfig: TableConfigModel;
  // 表格查询条件
  private queryCondition: QueryConditionModel = new QueryConditionModel();
  public hide = true;
  // 选择的设施数据
  private selectDeviceData;
  // 表格数据
  public __dataset = [];
  // 饼图实例
  private barChartInstance;
  // 柱状图实例
  private ringChartInstance;
  // 折线图实例
  private lineChartInstance;
  // 区域选择器的显示隐藏
  public isVisible = false;
  // 区域树配置
  public treeSelectorConfig: TreeSelectorConfigModel;
  // 区域树数据
  public treeNodes;
  // 复选框选择设施类型集合
  public deviceTypeList = [];
  // 选择的区域信息集合
  private selectAreaList;
  // 选择的区域Id信息集合
  private selectAreaIDList;
  // 下拉框数据
  public selectInfo;
  // 页面类型
  public pageTypeTitle;
  // 单选框的值
  public radioValue;
  // 表格表头
  private tableHeader;
  // 选择设施的名称
  public deviceName;
  // 设施表格数据
  public deviceDataSet = [];
  // 设施表格配置
  public deviceTableConfig: TableConfigModel;
  // 单选按钮的ID
  public selectedAlarmId = null;
  // chart 标题
  private chartTitle = {};
  // 有无统计数据
  public isNoData = false;
  // 时间选择控件的值
  public rangDateValue = [];
  // loading状态
  public showLoading = false;
  // 进度条
  public ProgressShow = false;

  constructor(private $NZi18: NzI18nService,
              private $DeviceStatistical: DeviceStatisticalService,
              private $activatedRoute: ActivatedRoute,
              private $modal: NzModalService,
              public $message: FiLinkModalService,
              private $facilityCommonService: FacilityForCommonService
  ) {
  }

  public ngOnInit(): void {
    this.language = this.$NZi18.getLocaleData('statistical');
    this.$facilityCommonService.queryAreaList().subscribe((result: ResultModel<any>) => {
      const data = result.data || [];
      // 递归设置区域的选择情况
      FacilityForCommonUtil.setAreaNodesStatus(data, null, null);
      this.treeNodes = data;
      this.isCheckData(this.treeNodes);
    });
    this.treeSelectorConfig = StatisticalUtil.initTreeSelectorConfig(this.language, this.treeNodes);
    this.getPageType();
    this.initDeviceTable();
  }

  /**
   * 给选择设施的列表附加id属性，防止在表格中勾选时树表不作出相应的变化
   * param data
   */
  public isCheckData(data): void {
    data.forEach(item => {
      item.id = item.areaId;
      item.areaLevel = item.level;
      if (item.children) {
        this.isCheckData(item.children);
      }
    });
  }

  /**
   * 获取页面标题
   */
  private getPageType(): void {
    if (this.$activatedRoute.snapshot.url[0].path === 'device-statistical') {
      this.pageTypeTitle = 'queryDeviceNumber';
      this.getUserCanLookDeviceType();
    } else if (this.$activatedRoute.snapshot.url[0].path === 'device-status') {
      this.pageTypeTitle = 'queryDeviceStatus';
      this.tableHeader = CommonUtil.codeTranslate(DeviceStatusEnum, this.$NZi18);
      this.getUserCanLookDeviceType();
    } else if (this.$activatedRoute.snapshot.url[0].path === 'device-deploy') {
      this.pageTypeTitle = 'queryDeviceDeployStatus';
      this.tableHeader = CommonUtil.codeTranslate(DeployStatusEnum, this.$NZi18, null, 'facility');
      this.getUserCanLookDeviceType();
    } else {
      this.pageTypeTitle = 'queryDeviceSensor';
      this.selectInfo = CommonUtil.codeTranslate(sensorValueEnum, this.$NZi18);
      this.selectInfo = this.selectInfo.filter(item => item.code !== sensorValueEnum.leach);
    }
    this.selectInfo.map(item => {
      item.value = item.code;
    });
  }

  /**
   * 获取当前用户能看到的设施类型
   */
  private getUserCanLookDeviceType(): void {
    /*this.selectInfo = CommonUtil.codeTranslate(DeviceTypeEnum, this.$NZi18);
    const list = [];
    this.selectInfo.forEach(item => {
      if (SessionUtil.getUserInfo().role.roleDevicetypeList.filter(_item => _item.deviceTypeId === item.code).length > 0) {
        list.push(item);
      }
    });
    this.selectInfo = list;*/
    this.selectInfo = FacilityForCommonUtil.getRoleFacility(this.$NZi18);
  }

  /**
   * 表格翻页
   * param event
   */
  public _pageChange(event): void {
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
    this.queryDeviceList();
  }

  public pageChange(event): void {

  }

  /**
   * 初始化表格配置
   * param type
   */
  private initTableConfig(type): void {
    const columnConfigs = [{
      title: this.language.areaName, key: 'areaName', width: 200, searchable: true, searchConfig: {
        type: 'input'
      }
    }];
    const deviceTypeList = [];
    if (this.pageTypeTitle === 'queryDeviceNumber') {
      this.deviceTypeList.forEach(item => {
        deviceTypeList.push(item.code);
      });
    }
    // 页面为设施数量统计
    if (type === 'queryDeviceNumber') {
      deviceTypeList.forEach(item => {
        columnConfigs.push({
          title: FacilityForCommonUtil.translateDeviceType(this.$NZi18, item), key: item, width: 200, searchable: true, searchConfig: {
            type: 'input'
          }
        });
      });
    } else if (type === 'queryDeviceStatus' || type === 'queryDeviceDeployStatus') {
      // 页面为设施状态统计
      this.tableHeader.forEach(item => {
        columnConfigs.push({
          title: item.label, key: item.code, width: 200, searchable: true, searchConfig: {
            type: 'input'
          }
        });
      });
    }
    this.tableConfig = {
      noIndex: true,
      showSearchExport: true,
      showSearchSwitch: true,
      showSearch: false,
      notShowPrint: true,
      noExportHtml: true,
      scroll: {x: '1000px', y: '325px'},
      columnConfig: columnConfigs,
      handleExport: (event) => {
        this.setExportParam(event);
      },
      handleSearch: (event) => {
        if (event && event.length) {
          this.__dataset = this.defaultTableValue.filter(item => {
            return event.every(_item => {
              if (_item.operator === OperatorEnum.like) {
                return String(item[_item.filterField]).includes(_item.filterValue);
              } else if (_item.operator === OperatorEnum.in) {
                return _item.filterValue.includes(item[_item.filterField]);
              }
            });
          });
        } else {
          // 重置表格
          this.__dataset = this.defaultTableValue;
        }
      }
    };
    this.tableConfig.columnConfig.push({
      title: '', searchable: true,
      searchConfig: {type: 'operate'}, key: '', width: 75, fixedStyle: {fixedRight: true, style: {right: '0px'}}
    });
  }

  /**
   * 点击统计按钮
   */
  public statistical(): void {
    this.ProgressShow = true;
    this.hide = false;
    this.showLoading = false;
    this.initTableConfig(this.pageTypeTitle);
    const statisticalData = new DeviceReqModel();
    let response: Observable<ResultModel<any>>;
    if (this.pageTypeTitle === 'queryDeviceNumber') {
      statisticalData.deviceTypes = [];
      this.deviceTypeList.forEach(item => {
        statisticalData.deviceTypes.push(item.code);
      });
      statisticalData.areaIds = this.selectAreaIDList;
      response = this.$DeviceStatistical.queryDeviceNumber(statisticalData);
    } else if (this.pageTypeTitle === 'queryDeviceSensor') {
      statisticalData.deviceId = this.selectedAlarmId;
      statisticalData.sensorType = this.radioValue;
      statisticalData.startTime = new Date(this.rangDateValue[0]).getTime();
      statisticalData.endTime = new Date(this.rangDateValue[1]).getTime();
      response = this.$DeviceStatistical.queryDeviceSensor(statisticalData);
    } else {
      statisticalData.deviceType = this.radioValue;
      statisticalData.areaIds = this.selectAreaIDList;
      if (this.pageTypeTitle === 'queryDeviceDeployStatus') {
        response = this.$DeviceStatistical.queryDeviceDeployStatus(statisticalData);
      } else {
        response = this.$DeviceStatistical.queryDeviceStatus(statisticalData);
      }
    }
    response.subscribe((result: ResultModel<any>) => {
      this.__dataset = result.data;
      if (this.pageTypeTitle !== 'queryDeviceSensor') {
        this.__dataset.forEach(item => {
          this.selectAreaList.forEach(_item => {
            if (item.areaId === _item.areaId) {
              item.areaName = _item.areaName;
            }
          });
        });
        this.defaultTableValue = CommonUtil.deepClone(this.__dataset);
      }
      this.showLoading = true;
      if (this.pageTypeTitle !== 'queryDeviceSensor') {
        this.setChartData(result.data);
      } else {
        this.isNoData = false;
        setTimeout(() => this.lineChartInstance.setOption(ChartUtil.setLineTimeChartOption(this.setLineChart(result.data))));
      }
      this.ProgressShow = false;
    });
  }


  /**
   * 设置图表数据
   */
  private setChartData(data): void {
    const dataMap = {};
    data.forEach(item => {
      Object.keys(item).forEach(_item => {
        if (_item !== 'areaId') {
          if (!dataMap[_item]) {
            dataMap[_item] = [];
          }
          dataMap[_item].push(item[_item]);
        }
      });
    });
    const ringData = [];
    const ringName = [];
    const barData = [];
    const barName = [];
    Object.keys(dataMap).sort().forEach(key => {
      if (key !== 'areaName') {
        dataMap[key] = dataMap[key].reduce((a, b) => a + b);
        if (this.pageTypeTitle === 'queryDeviceNumber') {
          ringData.push({
            value: dataMap[key],
            name: FacilityForCommonUtil.translateDeviceType(this.$NZi18, key),
            itemStyle: {
              color: ChartColor[key]
            }
          });
          ringName.push(FacilityForCommonUtil.translateDeviceType(this.$NZi18, key));
          barData.push({
            value: dataMap[key], itemStyle: {
              color: ChartColor[key]
            }
          });
          barName.push(FacilityForCommonUtil.translateDeviceType(this.$NZi18, key));
        } else {
          this.tableHeader.map(item => {
            if (item.code === key) {
              ringData.push({
                value: dataMap[key],
                name: item.label
              });
              ringName.push(item.label);
              barData.push(dataMap[key]);
              barName.push(item.label);
            }
          });
        }
      }
    });
    setTimeout(() => this.ringChartInstance.setOption(ChartUtil.setRingChartOption(ringData, ringName)));
    setTimeout(() => this.barChartInstance.setOption(ChartUtil.setBarChartOption(barData, barName)));
  }

  /**
   * 设置折线图数据
   * param _data
   */
  private setLineChart(_data): any[] {
    const data = [];
    Object.keys(_data).forEach(key => {
      const dataObj = {};
      const dataItem = [];
      let chartData = [];
      _data[key].forEach(_item => {
        chartData.push(CommonUtil.dateFmt('yyyy-MM-dd hh:mm:ss', new Date(_item.currentTime)));
        chartData.push(Number(_item[this.radioValue]));
        dataItem.push(chartData);
        dataObj['name'] = key;
        dataObj['value'] = dataItem;
        chartData = [];
      });
      data.push(dataObj);

    });
    return data;
  }

  /**
   * 获取饼图实例
   * param event
   */
  public getRingChartInstance(event): void {
    this.ringChartInstance = event;
  }

  /**
   * 获取柱状图实例
   * param event
   */
  public getBarChartInstance(event): void {
    this.barChartInstance = event;
  }

  /**
   * 获取线图实例
   * param event
   */
  public getLineChartInstance(event): void {
    this.lineChartInstance = event;
  }

  /**
   * 打开区域选择器
   */
  public showAreaSelect(): void {
    this.treeSelectorConfig.treeNodes = this.treeNodes;
    this.isVisible = true;
  }

  /**
   * 选择区域
   * param event
   */
  public selectDataChange(event): void {
    this.selectAreaList = event;
    const areaNameList = [];
    if (event.length > 0) {
      this.selectAreaIDList = event.map(item => {
        areaNameList.push(item.areaName);
        return item.areaId;
      });
      this.areaName = areaNameList.join();
    } else {
      this.areaName = '';
      this.selectAreaIDList = [];
    }
    FacilityForCommonUtil.setAreaNodesMultiStatus(this.treeNodes, this.selectAreaIDList);
    this.disabledResources();
  }

  /**
   * 初始化树配置
   */
  private initTreeSelectorConfig(): void {
    const treeSetting = {
      check: {
        enable: true,
        chkStyle: 'checkbox',
        chkboxType: {'Y': '', 'N': ''},
      },
      data: {
        simpleData: {
          enable: false,
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
    };
    this.treeSelectorConfig = {
      // 选择区域
      title: this.language.selectArea,
      width: '1000px',
      height: '300px',
      treeNodes: this.treeNodes,
      treeSetting: treeSetting,
      onlyLeaves: false,
      selectedColumn: [
        {
          title: this.language.areaName, key: 'areaName', width: 100,
        },
        {
          title: this.language.areaLevel, key: 'areaLevel', width: 100,
        }
      ]
    };
  }

  /**
   * 设施选择宽出现
   */
  public showDeviceSelect(): void {
    this.queryCondition.filterConditions = [];
    this.queryDeviceList();
    const modal = this.$modal.create({
      nzTitle: this.language.selectDevice,
      nzContent: this.deviceTemp,
      nzOkText: this.language.okText,
      nzCancelText: this.language.cancelText,
      nzOkType: 'danger',
      nzClassName: 'custom-create-modal',
      nzMaskClosable: false,
      nzWidth: 1000,
      nzFooter: [
        {
          label: this.language.okText,
          onClick: ($event) => {
            if (this.selectDeviceData) {
              this.deviceName = this.selectDeviceData.deviceName;
              this.selectedAlarmId = this.selectDeviceData.deviceId;
            }
            this.disabledResources();
            modal.destroy();
          }
        },
        {
          label: this.language.cancelText,
          type: 'danger',
          onClick: () => {
            this.selectDeviceData = '';
            this.selectedAlarmId = null;
            this.disabledResources();
            modal.destroy();
          }
        },
      ]
    });
  }

  /**
   * 选择设施（单选）表格配置
   */
  private initDeviceTable(): void {
    const filterValue = ['D006', 'D007'];
    const enumValue = FacilityForCommonUtil.getRoleFacility(this.$NZi18);
    const newArr = CommonUtil.deepClone(enumValue);
    const filterList = newArr.filter(item => !filterValue.includes(item.code));
    this.deviceTableConfig = {
      noIndex: true,
      showPagination: true,
      showSizeChanger: true,
      showSearchSwitch: true,
      notShowPrint: true,
      isLoading: true,
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
          type: 'serial-number', width: 62, title: this.language.serialNumber
        },
        {title: this.language.deviceName, width: 150, key: 'deviceName', searchable: true, searchConfig: {type: 'input'}, isShowSort: true},
        {
          title: this.language.deviceType,
          width: 150,
          key: 'deviceType',
          searchable: true,
          searchConfig: {
            type: 'select',
            selectType: 'multiple',
            selectInfo: filterList,
            label: 'label',
            value: 'code'
          },
          isShowSort: true
        },
        {
          title: this.language.FacilityNumber,
          width: 200,
          key: 'deviceCode',
          searchable: true,
          searchConfig: {type: 'input'},
          isShowSort: true
        },
        {title: this.language.ownAreaName, width: 200, key: 'areaName', searchable: true, searchConfig: {type: 'input'}, isShowSort: true},
        {
          title: this.language.operate, searchable: true,
          searchConfig: {type: 'operate'}, key: '', width: 75, fixedStyle: {fixedRight: true, style: {right: '0px'}}
        },
      ],
      sort: (event: SortCondition) => {
        this.queryCondition.sortCondition.sortField = event.sortField;
        this.queryCondition.sortCondition.sortRule = event.sortRule;
      },
      handleSearch: (event) => {
        this.queryCondition.filterConditions = event;
        this.queryDeviceList();
      }
    };
  }

  /**
   * 查询设施列表
   */
  private queryDeviceList(): void {
    this.queryCondition.filterConditions.push({filterValue: ['D001', 'D004', 'D005'], filterField: 'deviceType', operator: 'in'});
    this.deviceTableConfig.isLoading = true;
    this.$facilityCommonService.deviceListByPage(this.queryCondition).subscribe((result: ResultModel<FacilityListModel[]>) => {
      this.deviceDataSet = result.data;
      this.deviceDataSet.forEach(item => {
        // item.deviceType = getDeviceType(this.$NZi18, item.deviceType);
        item.deviceType = CommonUtil.codeTranslate(DeviceTypeEnum, this.$NZi18, item.deviceType);
        // item.deviceStatus = getDeployStatus(this.$NZi18, item.deviceStatus);
        item.deviceStatus = CommonUtil.codeTranslate(DeployStatusEnum, this.$NZi18, item.deviceStatus, LanguageEnum.facility);
      });
      this.pageBean.Total = result.totalCount;
      this.deviceTableConfig.isLoading = false;
    });
  }

  /**
   * 选择设施
   * param event
   * param data
   */
  public selectedAlarmChange(event, data): void {
    this.selectDeviceData = data;
  }

  public rangValueChange(event): void {
    this.disabledResources();
  }

  /**
   * 设置导出信息
   * param data
   */
  private setExportParam(data): void {
    // {columnName: "配线架", propertyName: "060"}
    data.columnInfoList.forEach(item => {
      if (item.propertyName !== 'areaName') {
        item.propertyName = 'type' + item.propertyName;
      }
    });
    data.queryCondition = {
      filterConditions: [],
      pageCondition: {},
      sortCondition: {},
      bizCondition: {}
    };
    data['objectList'] = CommonUtil.deepClone(this.__dataset);
    const obj = {};
    const objList = [];
    data.objectList.forEach(item => {
      delete item.areaId;
      Object.keys(item).forEach(_item => {
        if (_item !== 'areaName') {
          obj['type' + _item] = item[_item];
        } else {
          obj[_item] = item[_item];
        }
      });
      objList.push(CommonUtil.deepClone(obj));
    });
    const reqObj = new ExportRequestModel(data.columnInfoList, data.excelType, new QueryConditionModel());
    reqObj.objectList = objList;
    if (this.pageTypeTitle === 'queryDeviceNumber') {
      this.$DeviceStatistical.exportDeviceCount(reqObj).subscribe((result: ResultModel<string>) => {
        this.setResultData(result);
      });
    } else if (this.pageTypeTitle === 'queryDeviceStatus') {
      this.$DeviceStatistical.exportDeviceStatusCount(reqObj).subscribe((result: ResultModel<string>) => {
        this.setResultData(result);
      });
    } else if (this.pageTypeTitle === 'queryDeviceDeployStatus') {
      this.$DeviceStatistical.exportDeployStatusCount(reqObj).subscribe((result: ResultModel<string>) => {
        this.setResultData(result);
      });
    }
  }

  /**
   * 处理导出时后台返回数据
   * param result
   */
  private setResultData(result): void {
    if (result.code === ResultCodeEnum.success || result.code === 0) {
      this.$message.success(result.msg);
    } else {
      this.$message.error(result.msg);
    }
  }

  /**
   * 处理时间选择变化
   * param event
   */
  public onOpenChange(event): void {
    if (!event && this.rangDateValue.length) {
      // 这里深拷贝一个对象
      const temp = [new Date(this.rangDateValue[0].getTime()), new Date(this.rangDateValue[1].getTime())];
      if (this.rangDateValue.length === 2 && this.rangDateValue[0].getTime() > this.rangDateValue[1].getTime()) {
        // 当选时间的时候ui组件判断错误，赋值为开始的那个
        this.rangDateValue = [];
      } else {
        this.rangDateValue = [];
        this.rangDateValue = temp;
      }
    }
  }

  /**
   * 判断按钮是否启用禁用
   */
  // 判断统计按钮 是否禁用
  private disabledResources(): void {
    if (this.pageTypeTitle === 'queryDeviceSensor') {
      if (this.radioValue && this.deviceName && this.rangDateValue.length) {
        this.btnDisabled = false;
      } else {
        this.btnDisabled = true;
      }
    } else {
      if ((this.areaName ? !this.areaName : !this.deviceName) ||
        (this.radioValue ? (!this.radioValue) : this.deviceTypeList.length === 0)) {
        this.btnDisabled = true;
      } else {
        this.btnDisabled = false;
      }
    }
  }

  public selectCheckBoxChange(): void {
    this.disabledResources();
  }
}
