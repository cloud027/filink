import {Component, Input, OnInit} from '@angular/core';
import {NzI18nService} from 'ng-zorro-antd';
import * as _ from 'lodash';
import {ProductApiService} from '../../../share/service/product-api.service';
import {FiLinkModalService} from '../../../../../shared-module/service/filink-modal/filink-modal.service';
import {ProductLanguageInterface} from '../../../../../../assets/i18n/product/product.language.interface';
import {LanguageEnum} from '../../../../../shared-module/enum/language.enum';
import {ResultModel} from '../../../../../shared-module/model/result.model';
import {ResultCodeEnum} from '../../../../../shared-module/enum/result-code.enum';
import {ProductGatewayImageDetailModel} from '../../../../../core-module/model/product/product-gateway-image-detail.model';
import {ProductGatewayPositionModel} from '../../../../../core-module/model/product/product-gateway-position.model';
import {CheckTypeEnum, PortTypeEnum} from '../../../../../core-module/enum/product/product.enum';
import {ProductUtil} from '../../../share/util/product.util';

/**
 * 网关图编辑
 */
@Component({
  selector: 'app-product-gateway-update',
  templateUrl: './product-gateway-update.component.html',
  styleUrls: ['./product-gateway-update.component.scss']
})
export class ProductGatewayUpdateComponent implements OnInit {
  // 产品id
  @Input() public productId: string;
  // 是否展示按钮
  @Input() public showBtn: boolean = true;
  // 产品国际化
  public productLanguage: ProductLanguageInterface;
  // 是否展示批量上传弹框
  public uploadModalVisible: boolean = false;
  // 引入qunee画布
  public Q = window['Q'];
  // 画布对象
  public graph;
  // 网关图详情
  public gatewayImageDetail: ProductGatewayImageDetailModel = new ProductGatewayImageDetailModel();
  // 端口类型
  public portTypeEnum = PortTypeEnum;
  // 国际化模块
  public languageEnum = LanguageEnum;
  // 端口详情是否展示
  public communicationPortDetailVisible: boolean = false;
  // 当前端口
  public currentPort: ProductGatewayPositionModel = new ProductGatewayPositionModel();
  // 端口节点
  public portNodeMap: Map<string, any> = new Map<string, any>();
  // 页面是否加载
  public pageLoading: boolean = false;
  // 校验方式枚举
  public checkTypeEnum = CheckTypeEnum;

  /**
   * 构造器实例化
   */
  constructor(private $nzI18n: NzI18nService,
              private $message: FiLinkModalService,
              private $productApiService: ProductApiService) {
  }

  /**
   * 组件初始化
   */
  public ngOnInit(): void {
    this.productLanguage = this.$nzI18n.getLocaleData(LanguageEnum.product);
    // 根据产品id查询网关图信息
    this.queryGatewayDetail();
  }


  /**
   * 执行上传
   */
  public onClickDoUpload(files: File[]): void {
    if (!_.isEmpty(files)) {
      this.pageLoading = true;
      const formData = new FormData();
      files.forEach(item => {
        formData.append('files', item);
      });
      formData.append('productId', this.productId);
      this.$productApiService.uploadGatewayImage(formData).subscribe((res: ResultModel<string>) => {
        this.pageLoading = false;
        if (res.code === ResultCodeEnum.success) {
          this.$message.success(this.productLanguage.uploadGatewayImagSuccess);
          this.uploadModalVisible = false;
          this.queryGatewayDetail();
        } else {
          this.$message.error(res.msg);
        }
      }, () => this.pageLoading = false);
    }
  }

  /**
   * 根据网关id查询网关图的详细信息
   */
  public queryGatewayDetail(): void {
    this.$productApiService.gatewayImageInfo(this.productId).subscribe((res: ResultModel<ProductGatewayImageDetailModel>) => {
      if (res.code === ResultCodeEnum.success) {
        this.gatewayImageDetail = res.data;
        this.initGatewayQueen();
      } else {
        this.$message.error(res.msg);
      }
    });
  }

  /**
   * 初始化网关Queen
   */
  public initGatewayQueen(): void {
    if (this.graph) {
      this.graph.clear();
    }
    // 先画网关的主题图
    if (this.graph === undefined) {
      this.graph = new this.Q.Graph('gateway-canvas');
    }
    const node1 = this.graph.createNode('', 0, 0);
    node1.image = this.gatewayImageDetail.fileFullPath;
    node1.movable = false;
    node1.zIndex = 1;
    // 再将配置的端口设置成可用
    if (!_.isEmpty(this.gatewayImageDetail.portInfoList)) {
      this.gatewayImageDetail.portInfoList.forEach(item => {
        const node = this.graph.createNode('',
          Number(item.xposition), Number(item.yposition));
        node.image = item.pointImage;
        node.anchorPosition = this.Q.Position.MIDDLE;
        node.zIndex = 2;
        node['data'] = item;
        this.portNodeMap.set(`${item.portFlag}_${item.portType}_${item.portNumber}`, node);
      });
    }
    this.graph.moveToCenter();
    // 因为qunee中有个加载的过程进去不一定 能缩放到最优，所以使用setTimeout
    setTimeout(() => {
      this.graph.zoomToOverview();
    }, 500);
    // 添加点击监听事件
    this.graph.onmousemove = (evt) => {
      const elementNode = document.getElementById('port-detail');
      const tempNode = evt.getData();
      if (tempNode) {
        const portData = tempNode['data'];
        if (portData) {
          this.currentPort = portData;
          elementNode.style.display = 'block';
          elementNode.style.marginTop = evt.layerY + 'px';
          elementNode.style.marginLeft = evt.layerX + 'px';
        } else {
          elementNode.style.display = 'none';
        }
        // 将点击的端口边框标红
        this.onLocationPort(portData);
      } else {
        elementNode.style.display = 'none';
      }
    };
  }

  /**
   * 端口定位将边框设置成红色
   */
  public onLocationPort(data: ProductGatewayPositionModel): void {
    if (data) {
      const mapKey = `${data.portFlag}_${data.portType}_${data.portNumber}`;
      this.portNodeMap.forEach((value, key) => {
        value.setStyle(this.Q.Styles.BORDER, mapKey === key ? 1 : null);
        value.setStyle(this.Q.Styles.BORDER_COLOR, mapKey === key ? 'blue' : '');
        value.setStyle(this.Q.Styles.BORDER_RADIUS, 0);
      });
    } else {
      this.portNodeMap.forEach((value) => {
        value.setStyle(this.Q.Styles.BORDER, null);
        value.setStyle(this.Q.Styles.BORDER_COLOR, '');
      });
    }

  }

  /**
   * 导出qunee图片
   */
  public onPrintImage(): boolean {
    return ProductUtil.onPrint(this.graph, this.productLanguage);
  }
}
