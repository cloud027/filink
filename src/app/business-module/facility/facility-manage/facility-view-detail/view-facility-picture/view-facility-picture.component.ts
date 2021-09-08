import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {NzI18nService} from 'ng-zorro-antd';
import {SmartService} from '../../../../../core-module/api-service/facility/smart/smart.service';
import {Result} from '../../../../../shared-module/entity/result';
import {FiLinkModalService} from '../../../../../shared-module/service/filink-modal/filink-modal.service';
import {ActivatedRoute} from '@angular/router';
import {TableConfigModel} from '../../../../../shared-module/model/table-config.model';
import {FacilityLog} from '../../../../../core-module/model/facility/facility-log';
import {QueryConditionModel} from '../../../../../shared-module/model/query-condition.model';
import {
  AdapterTypeEnum,
  OppositeLabelTypeEnum,
  OppositePortStateEnum,
  OppositeRfidStatusEnum
} from '../../../../../shared-module/entity/template';
import {PageModel} from '../../../../../shared-module/model/page.model';

@Component({
  selector: 'app-view-facility-picture',
  templateUrl: './view-facility-picture.component.html',
  styleUrls: ['./view-facility-picture.component.scss']
})
export class ViewFacilityPictureComponent implements OnInit, AfterViewInit {

  @ViewChild('adapterType') private adapterType;
  @ViewChild('portStatus') private portStatus;
  @ViewChild('markType') private markType;
  @ViewChild('rfidStatus') private rfidStatus;
  // 设施id
  public deviceId: string;
  // 框id
  public frameID = '';
  // 当前框信息
  public frameInfo = {
    businessNum: 1
  };
  // 跳纤侧端口统计图表
  public eChartOption = null;
  // 当前点击端口id
  public portID = '';
  // 当前端口信息
  public portData = '';
  // 当前端口盘信息
  public boardInfo = {
    businessNum: 1
  };
  // 箱默认A面
  public boxSide = 0;
  // 表格查询条件
  public tableData: any;
  // 适配器类型
  adapterTypeEnum;
  // 标签类型
  labelTypeEnum;
  // 标签状态
  rfidStatusEnum;
  // 对端端口状态
  portStateEnum;
  // 表格数据
  public _dataSet: FacilityLog[] = [];
  public tableConfig: TableConfigModel;
  public language: any = {};
  // 表格通用分页配置
  public pageBean: PageModel = new PageModel(10, 1, 1);
  constructor(public $nzI18n: NzI18nService,
              private $message: FiLinkModalService,
              private $smartService: SmartService,
              private $active: ActivatedRoute,
  ) {
  }

  public ngOnInit(): void  {
    this.adapterTypeEnum = AdapterTypeEnum;
    this.labelTypeEnum = OppositeLabelTypeEnum;
    this.rfidStatusEnum = OppositeRfidStatusEnum;
    this.portStateEnum = OppositePortStateEnum;
    this.language = this.$nzI18n.getLocale();
    // 查询设施ID
    this.$active.queryParams.subscribe(params => {
      this.deviceId = params.id;
    });
    // 初始化表格数据
    this.initTableConfig();
  }

 public ngAfterViewInit(): void  {
    // 跳纤侧端口统计  （Echarts饼图）
    this.searchLocalPortInformation();
  }

  /**
   * 框切换
   * param item
   */
 public frameChange(item): void  {
    // 获取当前盘信息  主要用于查询对端端口信息
    this.frameInfo = item.data;
    this.frameID = item.data.id;
  }

  /**
   * 箱AB面切换
   */
  public BoxSideChange(side): void  {
    this.boxSide = side;
  }

  /**
   * 端口信息变化
   * param item
   */
 public portChange(item): void  {
    if (item && item.data) {
      this.portID = item.data.id;
      this.portData = item.data;
      // 获取当前端口盘信息  （用于查询对端端口信息）
      this.boardInfo = item.data.parent.data;
      // 跳纤侧端口统计  （Echarts饼图）
      this.searchLocalPortInformation();
      // 查询对端端口信息 （表格数据）
      this.searchReverseSidePort();
    }
  }


  public initChart(data): void  {
    const echartData = [
      // 占用端口数量
      {value: data.usedCount, name: this.language.facility.occupiedPorts},
      // 空闲端口数量
      {value: data.unusedCount, name: this.language.facility.freePorts},
      // 异常端口数量
      {value: data.exceptionCount, name: this.language.facility.exceptionPorts},
      // 预占端口数量
      {value: data.advanceCount, name: this.language.facility.PreemptPorts},
      // 虚占端口数量
      {value: data.virtualCount, name: this.language.facility.phantomPorts},
    ];
    this.eChartOption = {
      title: {
        // 端口总数
        text: this.language.facility.totalPorts,
        left: 'center',
        top: '30%',
        padding: [24, 0],
        textStyle: {
          color: '#bfbfbf',
          fontSize: 15,
          fontStyle: 'bold',
          align: 'center',
        }
      },
      tooltip: {
        show: true,
        trigger: 'item',
        formatter: '{b}: {c} ({d}%)'
      },
      legend: {
        selectedMode: false,
        formatter: function (name) {
          let total = 0;
          // 总和
          echartData.forEach(function (value, index, array) {
            total += value.value;
          });
          return total;
        },
        data: [echartData[0].name],
        y: 'bottom',
        left: 'center',
        top: '50%',
        icon: 'none',
        align: 'center',
        textStyle: {
          color: '#3c3c3c',
          fontSize: 20,
        },
      },
      series: [{
        // 端口总数
        name: this.language.facility.totalPorts,
        type: 'pie',
        radius: ['90%', '50%'],
        hoverAnimation: false,
        label: {
          normal: {
            show: false,
          }
        },
        labelLine: {
          normal: {
            show: false,
          }
        },
        data: echartData
      }]
    };
  }

  /**
   *跳纤侧端口统计  Echarts饼图
   */
  public searchLocalPortInformation(): void  {
    this.$smartService.queryLocalPortInformation(this.deviceId).subscribe((res: Result) => {
      if (res.code === 0) {
        this.initChart(res.data);
      } else {
        this.$message.error(res.msg);
      }
    });
  }


  /**
   * 查询对端端口信息
   */
  public searchReverseSidePort(): void  {
    this.tableConfig.isLoading = true;
    this.tableData = {
      'deviceId': this.deviceId, // 设施ID
      'boxSide': this.boxSide, // 端口所属箱架ab面（0、A面；1、B面）
      'frameNo': this.frameInfo['businessNum'], // 端口所属框ab号
      'discSide': this.boardInfo['childList'][0].side, // 端口所属盘ab面（0、A面；1、B面）
      'discNo': this.boardInfo['businessNum'], // 端口所属盘ab号
      'portNo': this.portData['businessNum'] // 端口号
    };
    // 查询表格数据 oppositePortNo
    this.$smartService.queryJumpFiberInfoByPortInfo(this.tableData).subscribe((result: Result) => {
      this.tableConfig.isLoading = false;
      // 对端端口号排序
      result.data.sort((a, b) => {
        return a.oppositePortNo.localeCompare(b.oppositePortNo);
      });
      this._dataSet = result.data || [];
    });
  }

  /**
   * 初始化表格配置
   */
  private initTableConfig(): void  {
    this.tableConfig = {
      isDraggable: true,
      isLoading: false,
      noIndex: true,
      showSearchExport: true,
      scroll: {x: '700px', y: '325px'},
      columnConfig: [
        {type: 'select', fixedStyle: {fixedLeft: true, style: {left: '0px'}}, width: 62},
        {
          type: 'serial-number', width: 62, title: this.language.facility.serialNumber,
          fixedStyle: {fixedLeft: true, style: {left: '62px'}}
        },
        {
          // 对端设施名称
          title: this.language.facility.oppositeDeviceTypeName,
          key: 'oppositeDeviceName',
          width: 200,

        },
        {
          // 对端设施类型
          title: this.language.facility.oppositeDeviceType,
          key: 'oppositeDeviceTypeName',
          width: 200,
        },
        {
          // 对端端口号
          title: this.language.facility.oppositePortNo,
          key: 'oppositePortNo',
          width: 200,
        },
        {
          // 对端端口状态
          title: this.language.facility.oppositePortStatus,
          key: 'oppositePortStatus',
          width: 200,
          type: 'render',
          renderTemplate: this.portStatus,
        },
        {
          // 对端端口智能标签id
          title: this.language.facility.oppositeRfidCode,
          key: 'oppositePortRfidCode',
          width: 200,
        },
        {
          // 对端端口适配器类型
          title: this.language.facility.adapterType,
          key: 'adapterType',
          width: 200,
          type: 'render',
          renderTemplate: this.adapterType,
        },
        {
          // 对端端口标签类型
          title: this.language.facility.oppositePortMarkType,
          key: 'oppositePortMarkType',
          width: 200,
          type: 'render',
          renderTemplate: this.markType,
        },
        {
          // 对端端口标签状态
          title: this.language.facility.oppositePortRfidStatus,
          key: 'oppositePortRfidStatus',
          width: 200,
          type: 'render',
          renderTemplate: this.rfidStatus,
        },
        {
          // 对端智能标签备注
          title: this.language.facility.remark,
          key: 'oppositePortRemark',
          width: 200,
        },
        { // 操作
          title: this.language.facility.operate,
          fixedStyle: {fixedRight: true, style: {right: '0px'}}, width: 150,
        },
      ],
      notShowPrint: true,
      bordered: false,
      showSearch: false,
      topButtons: [],
      operation: [
        { // 单行删除
          text: this.language.deleteHandle,
          className: 'fiLink-delete red-icon',
          canDisabled: true, needConfirm: true,
          permissionCode: '03-1-5-4-1',
          handle: (data) => {
            const delaeteData = {
              'jumpFiberIdList': [data.jumpFiberId]
            };
            this.$smartService.deleteJumpFiberInfoById(delaeteData).subscribe((result: Result) => {
              if (result.code === 0) {
                this.$message.success(result.msg);
                // 刷新表格数据
                this.searchReverseSidePort();
              } else {
                this.$message.error(result.msg);
              }
            });
          }
        },
      ],
      // 导出
      handleExport: (event) => {
        for (let i = 0; i < event.columnInfoList.length; i++) {
          // 对端设施类型导出字段转换
          if (event.columnInfoList[i].propertyName === 'oppositeDeviceTypeName') {
            event.columnInfoList[i].propertyName = 'oppositeDeviceType';
            event.columnInfoList[i].isTranslation = 1;
          }
          // 对端端口适配器类型
          if (event.columnInfoList[i].propertyName === 'adapterType') {
            event.columnInfoList[i].propertyName = 'oppositeAdapterType';
            event.columnInfoList[i].isTranslation = 1;
          }
          // 对端端口标签类型
          if (event.columnInfoList[i].propertyName === 'oppositePortMarkType') {
            event.columnInfoList[i].propertyName = 'oppositePortRfidType';
            event.columnInfoList[i].isTranslation = 1;
          }
          if (event.columnInfoList[i].propertyName === 'oppositePortStatus') {
            event.columnInfoList[i].isTranslation = 1;
          }
          if (event.columnInfoList[i].propertyName === 'oppositePortRfidStatus') {
            event.columnInfoList[i].isTranslation = 1;
          }
        }
        // 处理参数
        const body = {
          queryCondition: new QueryConditionModel(),
          columnInfoList: event.columnInfoList,
          excelType: event.excelType
        };
        body.queryCondition.bizCondition = this.tableData;
        this.$smartService.exportJumpFiberInfoByPortInfo(body).subscribe((res: Result) => {
          if (res.code === 0) {
            this.$message.success(res.msg);
          } else {
            this.$message.warning(res.msg);
          }
        });
      }
    };
  }

  /**
   * 返回上一步
   */
  public goBack(): void {
    window.history.go(-1);
  }
  /**
   * 监听页面切换
   * param event
   */
  pageChange(event) {

  }

}
