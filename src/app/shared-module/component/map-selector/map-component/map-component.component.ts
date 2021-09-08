import {AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {MapDrawingService} from '../map-drawing.service';
import {FiLinkModalService} from '../../../service/filink-modal/filink-modal.service';
import {CommonLanguageInterface} from '../../../../../assets/i18n/common/common.language.interface';
import {NzI18nService} from 'ng-zorro-antd';
import {RuleUtil} from '../../../util/rule-util';
import {FormLanguageInterface} from '../../../../../assets/i18n/form/form.language.interface';
import {IndexLanguageInterface} from '../../../../../assets/i18n/index/index.language.interface';
import {BMapPlusService} from '../../../service/map-service/b-map/b-map-plus.service';
import {GMapPlusService} from '../../../service/map-service/g-map/g-map-plus.service';
import {BMapDrawingService} from '../../../service/map-service/b-map/b-map-drawing.service';
import {GMapDrawingService} from '../../../service/map-service/g-map/g-map-drawing.service';
import {LanguageEnum} from '../../../enum/language.enum';

declare const MAP_TYPE;

declare const BMap: any;
declare const BMapLib: any;
declare const BMAP_ANCHOR_TOP_LEFT: any;
declare const BMAP_ANCHOR_TOP_RIGHT: any;

/**
 * 地理位置选择器
 */
@Component({
  selector: 'xc-map-component',
  templateUrl: './map-component.component.html',
  styleUrls: ['./map-component.component.scss']
})
export class MapComponentComponent implements OnInit, AfterViewInit, OnChanges {
  // 传入点回显
  @Input() point;
  // 传入的设施地址回显
  @Input() facilityAddress;
  // 选择框显示关闭事件
  @Output() xcVisibleChange = new EventEmitter<boolean>();
  // 所选点位变化事件
  @Output() selectDataChange = new EventEmitter<any[]>();
  // 地址搜索key
  public searchKey: any = '';
  // 公共语言包
  public language: CommonLanguageInterface;
  // form 语言包
  public formLanguage: FormLanguageInterface;
  // 地图类型 build or google
  public mapType: string;
  // 所选点位地址对象
  public address: any = {
    address: '',
    point: {lat: '', lng: ''},
    addressComponents: {
      province: '',
      city: '',
      district: ''
    }
  };
  // 首页语言包
  public indexLanguage: IndexLanguageInterface;
  public options: string[] = [];
  // 地图实例
  private mapInstance: any;
  // 地图绘制实例
  private mapDrawUtil: MapDrawingService;
  // 地图服务类
  private mapService: any;
  // 所选点的覆盖物
  private overlays: any;

  constructor(private $message: FiLinkModalService,
              private $ruleUtil: RuleUtil,
              private $i18n: NzI18nService) {
  }

  // 控制弹框显示隐藏
  private _xcVisible = false;

  get xcVisible() {
    return this._xcVisible;
  }

  @Input()
  set xcVisible(params: boolean) {
    this._xcVisible = params;
    this.xcVisibleChange.emit(this._xcVisible);
  }

  ngOnInit() {
    this.mapType = MAP_TYPE;
    this.language = this.$i18n.getLocaleData(LanguageEnum.common);
    this.formLanguage = this.$i18n.getLocaleData(LanguageEnum.form);
    this.indexLanguage = this.$i18n.getLocaleData(LanguageEnum.index);
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  ngAfterViewInit(): void {

  }

  /**
   * 弹框打开之后
   */
  public afterModelOpen(): void {
    this.searchKey = '';
    if (!this.mapInstance) {
      this.initMap();

    }
    if (this.overlays) {
      this.mapService.removeOverlay(this.overlays);
    }
    if (this.point && this.point.lat && this.point.lng) {
      const marker = this.mapService.createPoint(this.point.lng, this.point.lat);
      this.mapService.setCenterAndZoom(this.point.lng, this.point.lat, 12);
      this.overlays = this.mapService.addOverlay(marker);
      this.mapService.getLocation(this.overlays.point, (result) => {
        this.address = result;
        // 组件初始化地图使用外界传入的地址
        this.address.address = this.facilityAddress;
      });
    } else {
      this.address = {
        address: '',
        point: {lat: '', lng: ''},
        addressComponents: {
          province: '',
          city: '',
          district: ''
        }
      };
    }
  }

  /**
   * 点击确认
   */
  public handleOk(): void {
    // 详细地址名称必填
    if (!this.address.address) {
      this.$message.error(this.language.addressRequired);
      return;
    }
    // 详细地址名称非空校验
    if (/^\s+$/.test(this.address.address)) {
      this.$message.error(this.$ruleUtil.getNameCustomRule().msg);
      return;
    }
    // 详情地址名称正则校验
    if (!new RegExp(this.$ruleUtil.getNameRule().pattern).test(this.address.address)) {
      this.$message.error(this.$ruleUtil.getNameRule().msg);
      return;
    }
    // 详细地址名称长度校验
    if (this.address.address.length > this.$ruleUtil.getRemarkMaxLengthRule().maxLength) {
      this.$message.error(
        `${this.formLanguage.maxLengthMsg}${this.$ruleUtil.getRemarkMaxLengthRule().maxLength}${this.formLanguage.count}`);
      return;
    }
    this.selectDataChange.emit(this.address);
    this.handleCancel();
  }

  /**
   * 点击取消
   */
  public handleCancel(): void {
    this.xcVisible = false;
  }

  /**
   * 定位
   */
  public location(): void {
    const key = this.searchKey.trimLeft().trimRight();
    if (!key) {
      return;
    }
    this.mapService.searchLocation(key, (results, status) => {
      if (status === 'OK') {
        this.mapInstance.setCenter(results[0].geometry.location);
      } else {
        // this.$message.error('无结果');
      }
    });
  }

  /**
   * 缩小
   */
  public zoomOut(): void {
    this.mapService.zoomIn();
  }

  /**
   * 放大
   */
  public zoomIn(): void {
    this.mapService.zoomOut();
  }

  /**
   * 初始化地图
   */
  public initMap(): void {
    // 实例化地图服务类
    if (this.mapType === 'baidu') {
      this.mapService = new BMapPlusService();
      this.mapService.createPlusMap('mapContainer');
      this.mapService.addLocationSearchControl('_suggestId', '_searchResultPanel');
      // 实例化鼠标绘制工具
      // @ts-ignore
      this.mapDrawUtil = new BMapDrawingService(this.mapService.mapInstance);
    } else {
      this.mapService = new GMapPlusService();
      this.mapService.createPlusMap('mapContainer');
      // 实例化鼠标绘制工具
      // @ts-ignore
      this.mapDrawUtil = new GMapDrawingService(this.mapService.mapInstance);
    }
    // 没有传点的时候 定位到用户当前的位置
    if (!this.point || !this.point.lat || !this.point.lng) {
      this.mapService.locateToUserCity();
    }
    this.mapInstance = this.mapService.mapInstance;
    this.mapDrawUtil.open();
    // 添加鼠标绘制工具监听事件，用于获取绘制结果
    this.mapDrawUtil.addEventListener('overlaycomplete', (e) => {
      if (this.overlays) {
        this.mapService.removeOverlay(this.overlays);
      }
      this.overlays = e.overlay;
      this.mapService.getLocation(this.overlays.point, (result) => {
        this.address = result;
      });
    });
  }
}
