import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import * as _ from 'lodash';
import {ProductLanguageInterface} from '../../../../../../assets/i18n/product/product.language.interface';
import {NzI18nService} from 'ng-zorro-antd';
import {ProductApiService} from '../../../share/service/product-api.service';
import {FiLinkModalService} from '../../../../../shared-module/service/filink-modal/filink-modal.service';
import {RuleUtil} from '../../../../../shared-module/util/rule-util';
import {Router} from '@angular/router';
import {LanguageEnum} from '../../../../../shared-module/enum/language.enum';
import {FacilityForCommonUtil} from '../../../../../core-module/business-util/facility/facility-for-common.util';
import {ResultModel} from '../../../../../shared-module/model/result.model';
import {ResultCodeEnum} from '../../../../../shared-module/enum/result-code.enum';
import {ProductPoleImageInfoModel} from '../../../../../core-module/model/product/product-pole-image-info.model';
import {EquipmentTypeEnum} from '../../../../../core-module/enum/equipment/equipment.enum';
import {ProductUtil} from '../../../share/util/product.util';
import {PositionTypeEnum, ProductFileTypeEnum} from '../../../../../core-module/enum/product/product.enum';
import {BatchUploadFileComponent} from '../../../../../shared-module/component/business-component/batch-upload-file/batch-upload-file.component';

/**
 * 编辑智慧杆组件
 */
@Component({
  selector: 'app-product-update-wisdom',
  templateUrl: './product-update-wisdom.component.html',
  styleUrls: ['./product-update-wisdom.component.scss']
})
export class ProductUpdateWisdomComponent implements OnInit {
  // 上传组件
  @ViewChild('batchUploadTemp') batchUploadTemp: BatchUploadFileComponent;
  // 产品id
  @Input() public productId: string;
  // 上传文件之后抛出事件
  @Output() public previewWisdom = new EventEmitter<any>();
  // 产品国际化
  public productLanguage: ProductLanguageInterface;
  // 上传文件弹框是否显示
  public uploadIsVisible: boolean = false;
  // 引入qunee画布
  public Q = window['Q'];
  // 画布对象
  public graph;
  // 设备类型枚举
  public equipmentTypeEnum = EquipmentTypeEnum;
  // 语法枚举
  public languageEnum = LanguageEnum;
  // 产品点位图详情对象
  public productPositionDetail: ProductPoleImageInfoModel = new ProductPoleImageInfoModel();
  // 创建的点位节点node qunee里面使用无法给数据模型
  public nodes = {};
  // 上传文件类型
  public uploadFileTypeEnum = ProductFileTypeEnum;
  // 点位类型
  public positionTypeEnum = PositionTypeEnum;
  // 页面是否加载
  public pageLoading: boolean = false;

  /**
   * 构造器实例化
   */
  constructor(private $nzI18n: NzI18nService,
              private $productApiService: ProductApiService,
              private $ruleUtil: RuleUtil,
              private $router: Router,
              private $message: FiLinkModalService) {
  }

  /**
   * 组件初始化
   */
  public ngOnInit(): void {
    // 获取词条
    this.productLanguage = this.$nzI18n.getLocaleData(LanguageEnum.product);
    // 根据productId查询产品信息
    this.queryImgByProductId();
  }

  /**
   * 处理每个点位的设备类型下拉选
   */
  public handelSelectEquipmentList(): void {
    const equipmentSelectList = FacilityForCommonUtil.getRoleEquipmentType(this.$nzI18n);
    if (this.productPositionDetail && !_.isEmpty(this.productPositionDetail.pointConfigList)) {
      this.productPositionDetail.pointConfigList.forEach(item => {
        item.canSelectEquipment = equipmentSelectList.filter(row => item.selectEquipment.includes(row.code));
      });
    }
  }

  /**
   * 预览杆型图
   */
  public onClickPreview(): void {
    this.previewWisdom.emit(this.productPositionDetail);
  }

  /**
   * 上传文件成功
   */
  public onClickDoUpload(event: File[]): void {
    if (!_.isEmpty(event)) {
      this.pageLoading = true;
      const formData = new FormData();
      formData.append('productId', this.productId);
      event.forEach(v => {
        formData.append('files', v);
      });
      // 调用后台的上传接口
      this.$productApiService.uploadPoleImage(formData).subscribe((res: ResultModel<ProductPoleImageInfoModel>) => {
        this.pageLoading = false;
        if (res.code === ResultCodeEnum.success) {
          this.uploadIsVisible = false;
          this.$message.success(this.productLanguage.filesUploadSuccess);
          this.queryImgByProductId();
        } else {
          this.$message.error(res.msg);
        }
        this.batchUploadTemp.fileListRec = [];
      }, () => {
        this.pageLoading = false;
        this.batchUploadTemp.fileListRec = [];
      });
    }
  }

  /**
   * 执行保存杆型图的接口
   */
  public onSaveWisdom(): void {
    // 获取坐标id和可选设备类型
    if (!_.isEmpty(this.productPositionDetail.pointConfigList)) {
      const saveBody = this.productPositionDetail.pointConfigList.map(item => {
        return {
          selectEquipment: item.selectEquipment ? item.selectEquipment.join(',') as string : '',
          pointConfigId: item.pointConfigId
        };
      });
      // 调用后台的接口
      this.$productApiService.insertPoleImage(saveBody).subscribe((res: ResultModel<string>) => {
        if (res.code === ResultCodeEnum.success) {
          this.$message.success(this.productLanguage.savePoleSuccess);
        } else {
          this.$message.error(res.msg);
        }
      });
    }
  }

  /**
   * 初始化点位图
   */
  public initWisdomPosition(): void {
    if (this.graph) {
      this.graph.clear();
    } else {
      this.graph = new this.Q.Graph('wisdom-position');
    }
    if (this.productPositionDetail.fileFullPath) {
      // 先画杆体图
      const mainNode = this.graph.createNode('', 0, 0);
      mainNode.image = this.productPositionDetail.fileFullPath;
      mainNode.movable = false;
      mainNode.zIndex = 1;
      if (!_.isEmpty(this.productPositionDetail.pointConfigList)) {
        this.productPositionDetail.pointConfigList.forEach(item => {
          const node = this.graph.createNode('' + item.configSort,
            Number(item.xposition), Number(item.yposition));
          node.image = this.Q.Shapes.getShape(this.Q.Consts.SHAPE_CIRCLE, 0, 0, 40, 40);
          node.setStyle(this.Q.Styles.SHAPE_STROKE_STYLE, '#fff');
          node.setStyle(this.Q.Styles.SHAPE_FILL_COLOR, '#36cfc9');
          node.setStyle(this.Q.Styles.LABEL_POSITION, this.Q.Position.CENTER_MIDDLE);
          node.setStyle(this.Q.Styles.LABEL_ANCHOR_POSITION, this.Q.Position.CENTER_MIDDLE);
          node.setStyle(this.Q.Styles.LABEL_COLOR, '#fff');
          node.setStyle(this.Q.Styles.LABEL_FONT_SIZE, 32);
        });
      }
      // 创建点位
      this.graph.moveToCenter();
      setTimeout(() => {
        this.graph.zoomToOverview();
      }, 500);
    }
  }

  /**
   * 打印图片
   */
  public onPrint(): boolean {
    return ProductUtil.onPrint(this.graph, this.productLanguage);
  }

  /**
   * 根据产品id查询产品的杆型图片
   */
  private queryImgByProductId(): void {
    this.$productApiService.poleImageInfo(this.productId).subscribe((res: ResultModel<ProductPoleImageInfoModel>) => {
      if (res.code === ResultCodeEnum.success) {
        this.productPositionDetail = res.data;
        // 将点位图进行排序
        if (this.productPositionDetail && this.productPositionDetail.pointConfigList) {
          this.productPositionDetail.pointConfigList = _.orderBy(this.productPositionDetail.pointConfigList, 'configSort');
          this.productPositionDetail.pointConfigList.forEach(item => {
            if (item.selectEquipment) {
              item.selectEquipment = item.selectEquipment.split(',');
            }
          });
        }
        // 初始化杆图示意图
        this.initWisdomPosition();
        // 处理每个点位设备类型的下拉选数据
        this.handelSelectEquipmentList();
      } else {
        this.$message.error(res.msg);
      }
    });
  }
}
