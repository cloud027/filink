import {Component, Input, OnInit} from '@angular/core';
import {NzI18nService} from 'ng-zorro-antd';
import * as _ from 'lodash';
import {NO_IMG} from '../../../../../core-module/const/common.const';
import {ProductLanguageInterface} from '../../../../../../assets/i18n/product/product.language.interface';
import {LanguageEnum} from '../../../../../shared-module/enum/language.enum';
import {DeviceChartUntil} from '../../../../../shared-module/util/device-chart-until';
import {ProductInfoModel} from '../../../../../core-module/model/product/product-info.model';
import {
  CloudPlatformTypeEnum,
  LockTypeEnum,
  ProductTypeEnum,
  ProductUnitEnum
} from '../../../../../core-module/enum/product/product.enum';
import {CameraTypeEnum, EquipmentTypeEnum} from '../../../../../core-module/enum/equipment/equipment.enum';
import {PortInfoModel} from '../../../../../core-module/model/product/port-info.model';
import {PageModel} from '../../../../../shared-module/model/page.model';
import {PageSizeEnum} from '../../../../../shared-module/enum/page-size.enum';
import {TableConfigModel} from '../../../../../shared-module/model/table-config.model';
import {FilterCondition, QueryConditionModel, SortCondition} from '../../../../../shared-module/model/query-condition.model';
import {OperatorEnum} from '../../../../../shared-module/enum/operator.enum';
import {TableSortConfig} from '../../../../../shared-module/enum/table-style-config.enum';

/**
 *  产品-设备基础信息
 */
@Component({
  selector: 'app-product-infrastructure-equipment',
  templateUrl: './product-infrastructure-equipment.component.html',
  styleUrls: ['./product-infrastructure-equipment.component.scss']
})
export class ProductInfrastructureEquipmentComponent implements OnInit {
  // 产品id
  @Input() public productId: string;
  // 产品详情数据
  @Input() public productDetail: ProductInfoModel = new ProductInfoModel();
  // 图片路径
  public productImgUrl: string = NO_IMG;
  // 故障率统计
  public breakRateOption = {};
  // 产品国际化
  public productLanguage: ProductLanguageInterface;
  // 是否显示预览弹框
  public showGatewayModal: boolean = false;
  // 是否显示端口列表弹框
  public showPortModal: boolean = false;
  // 计量单位枚举
  public productUnit = ProductUnitEnum;
  //  产品类型枚举
  public productTypeEnum = ProductTypeEnum;
  // 设备类型枚举
  public equipmentTypeEnum = EquipmentTypeEnum;
  // 电子锁形态
  public lockTypeEnum = LockTypeEnum;
  // 摄像头形态
  public cameraTypeEnum = CameraTypeEnum;
  // 国际化词条
  public language = LanguageEnum;
  // 云平台类型枚举
  public platformEnum = CloudPlatformTypeEnum;
  //  端口列表数据
  public portDataList: PortInfoModel[] = [];
  // 端口列表分页参数
  public portPageModel: PageModel = new PageModel(PageSizeEnum.sizeFive, 1);
  // 端口列表参数配置
  public portTableConfig: TableConfigModel = new TableConfigModel();
  // 端口列表查询条件
  public portQueryCondition: QueryConditionModel = new QueryConditionModel();


  constructor(private  $nzI18n: NzI18nService) {
  }

  /**
   * 组件初始化
   */
  public ngOnInit(): void {
    this.productLanguage = this.$nzI18n.getLocaleData(LanguageEnum.product);
    // 初始化故障率
    this.breakRateOption = DeviceChartUntil.setBreakRateChartOption(this.productLanguage, 0);
    // 初始化端口表格
    this.initPortTable();
    // 设备图片路径获取
    if (this.productDetail && this.productDetail.fileFullPath ) {
      this.productImgUrl = this.productDetail.fileFullPath;
    }
  }

  /**
   * 显示网关弹框
   */
  public onClickShowPort(): void {
    this.showPortModal = true;
    if (!_.isEmpty(this.productDetail.productPortList)) {
      this.onPageChange(this.portPageModel);
    }
  }

  /**
   * 预览网关
   */
  public onClickPreviewGateway(): void {
    // 根据产品
    this.showGatewayModal = true;
  }

  /**
   * 切换列表分页事件
   */
  public onPageChange(event: PageModel): void {
    this.portQueryCondition.pageCondition.pageSize = event.pageSize;
    this.portQueryCondition.pageCondition.pageSize = event.pageIndex;
    this.refreshPortList();
  }

  /**
   * 刷端口列表
   */
  private refreshPortList(): void {
    let portData;
    if (!_.isEmpty(this.portQueryCondition.filterConditions)) {
      portData = this.productDetail.productPortList.filter(item => {
        return this.portQueryCondition.filterConditions.every(v => {
          if (v.operator === OperatorEnum.in) {
            return v.filterValue.includes(item[v.filterField]);
          } else if (v.operator === OperatorEnum.like) {
            return item[v.filterField].includes(v.filterValue);
          } else if (v.operator === OperatorEnum.eq) {
            return v.filterValue === item[v.filterField];
          }
        });
      });
    } else {
      portData = this.productDetail.productPortList;
    }
    this.portPageModel.Total = portData.length;
    // 排序问题
    let portSortData;
    if (!this.portQueryCondition.sortCondition || !this.portQueryCondition.sortCondition.sortRule) {
      portSortData = portData;
    } else {
      portSortData = _.sortBy(portData, this.portQueryCondition.sortCondition.sortField);
      if (this.portQueryCondition.sortCondition.sortRule === TableSortConfig.DESC) {
        portSortData.reverse();
      }
    }
    // 刷新列表
    this.portDataList = portSortData.slice(this.portPageModel.pageSize * (
      this.portPageModel.pageIndex - 1), this.portPageModel.pageIndex * this.portPageModel.pageSize) || [];
  }

  /**
   * 初始化端口表格
   */
  private initPortTable(): void {
    this.portTableConfig = {
      primaryKey: '',
      isDraggable: true,
      isLoading: false,
      showSearchSwitch: true,
      showSizeChanger: true,
      notShowPrint: true,
      noAutoHeight: true,
      scroll: {x: '1200px', y: '400px'},
      noIndex: true,
      showSearchExport: false,
      showPagination: true,
      showSearch: false,
      pageSizeOptions: [5, 10, 20, 30, 40],
      columnConfig: [
        { // 序号
          type: 'serial-number',
          width: 62,
          title: this.productLanguage.serialNum,
        },
        { // 端口标识
          title: this.productLanguage.portFlag,
          width: 120,
          key: 'portFlag',
          configurable: false,
          searchable: true,
          isShowSort: true,
          searchConfig: {type: 'input'}
        },
        { // 端口类型
          title: this.productLanguage.portType,
          width: 120,
          key: 'portType',
          configurable: false,
          searchable: true,
          isShowSort: true,
          searchConfig: {
            type: 'select',
            selectInfo: [{label: '12V', code: '12V'}, {label: '24V', code: '24V'}, {label: '220V', code: '220V'}],
            label: 'label',
            value: 'code'
          }
        },
        { // 端口编号
          title: this.productLanguage.portNo,
          width: 120,
          key: 'portNumber',
          configurable: false,
          searchable: true,
          isShowSort: true,
          searchConfig: {type: 'input'}
        },
        { // 操作列
          title: this.productLanguage.operate,
          searchable: true,
          searchConfig: {
            type: 'operate',
          }, key: '', width: 100, fixedStyle: {fixedRight: true, style: {right: '0px'}}
        },
      ],
      handleSearch: (event: FilterCondition[]) => {
        this.portQueryCondition.filterConditions = event;
        this.refreshPortList();
      },
      sort: (event: SortCondition) => {
        this.portQueryCondition.sortCondition = event;
        this.refreshPortList();
      }
    };
  }
}
