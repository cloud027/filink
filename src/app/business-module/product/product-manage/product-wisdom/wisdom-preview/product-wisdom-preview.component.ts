import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import * as _ from 'lodash';
import {OperateTypeEnum} from '../../../../../shared-module/enum/page-operate-type.enum';
import {ActivatedRoute} from '@angular/router';
import {FiLinkModalService} from '../../../../../shared-module/service/filink-modal/filink-modal.service';
import {ProductApiService} from '../../../share/service/product-api.service';
import {ProductLanguageInterface} from '../../../../../../assets/i18n/product/product.language.interface';
import {NzI18nService} from 'ng-zorro-antd';
import {LanguageEnum} from '../../../../../shared-module/enum/language.enum';
import {ProductPoleImageInfoModel} from '../../../../../core-module/model/product/product-pole-image-info.model';
import {EquipmentTypeEnum} from '../../../../../core-module/enum/equipment/equipment.enum';
import {ProductEquipmentModelModel} from '../../../../../core-module/model/product/product-equipment-model.model';
import {ResultModel} from '../../../../../shared-module/model/result.model';
import {ResultCodeEnum} from '../../../../../shared-module/enum/result-code.enum';
import {ProductUtil} from '../../../share/util/product.util';
import {PositionTypeEnum} from '../../../../../core-module/enum/product/product.enum';

/**
 * 智慧杆体预览组件
 */
@Component({
  selector: 'app-product-wisdom-preview',
  templateUrl: './product-wisdom-preview.component.html',
  styleUrls: []
})
export class ProductWisdomPreviewComponent implements OnInit, AfterViewInit {
  // 产品id
  @Input() public productId: string;
  // 预览数据信息
  @Input() public previewDataDetail: ProductPoleImageInfoModel;
  // 是否展示操作按钮
  @Input() public showBtn: boolean = true;
  // 上传文件之后抛出事件
  @Output() public positionConfig = new EventEmitter<any>();
  // 页面操作类型
  public pageOperateType: OperateTypeEnum = OperateTypeEnum.add;
  // 产品管理国际化
  public productLanguage: ProductLanguageInterface;
  // 页面标题
  public pageTitle: string;
  // 引入qunee画布
  public Q = window['Q'];
  // 画布对象
  public graph;
  // 设备类型枚举
  public equipmentTypeEnum = EquipmentTypeEnum;
  // 语言国际化
  public languageEnum = LanguageEnum;
  // 绘制节点map
  public nodesMap: Map<string, any> = new Map<string, any>();
  // 点位类型
  public positionTypeEnum = PositionTypeEnum;


  /**
   * 构造器
   */
  constructor(private $active: ActivatedRoute,
              private $productApiService: ProductApiService,
              private $message: FiLinkModalService,
              private $nzI18n: NzI18nService) {
  }

  /**
   * 组件初始化
   */
  public ngOnInit(): void {
    this.productLanguage = this.$nzI18n.getLocaleData(LanguageEnum.product);
    this.pageOperateType = this.$active.snapshot.params.type;
    this.pageTitle = this.pageOperateType === OperateTypeEnum.update ? this.productLanguage.updateWisdomImg : this.productLanguage.addWisdomImg;
  }

  /**
   * 页面加载完之后进行qunee渲染
   */
  public ngAfterViewInit(): void {
    this.handelCanvas();
  }

  /**
   * 点位配置
   */
  public onClickPositionConfig(): void {
    this.positionConfig.emit(true);
  }

  /**
   * 下载预览图
   */
  public onExportImg(): boolean {
    return ProductUtil.onPrint(this.graph, this.productLanguage);
  }

  /**
   * 保存杆型图
   */
  public onSaveWisdom(): void {
    // 获取坐标id和可选设备类型
    if (!_.isEmpty(this.previewDataDetail.pointConfigList)) {
      const body = this.previewDataDetail.pointConfigList.map(item => {
        return {
          pointConfigId: item.pointConfigId,
          selectEquipment: item.selectEquipment.join(',') as string
        };
      });
      // 调用后台的接口
      this.$productApiService.insertPoleImage(body).subscribe((res: ResultModel<string>) => {
        if (res.code === ResultCodeEnum.success) {
          this.$message.success(this.productLanguage.savePoleSuccess);
        } else {
          this.$message.error(res.msg);
        }
      });
    }
  }

  /**
   * 切换设备类型事件
   */
  public onChangeViewType(data: ProductEquipmentModelModel): void {
    if (data.viewType) {
      // 从fileFullPath里面找到文件节点
      if (_.isEmpty(this.previewDataDetail.productFileList)) {
        return;
      }
      const tempFile = this.previewDataDetail.productFileList.find(item => item.fileType === data.viewType);
      if (!tempFile) {
        return;
      }
      const node = this.nodesMap.get(data.configSort);
      node.image = tempFile.fileFullPath;
      node.name = '';
    }
  }

  /**
   * 处理qunee图
   */
  private handelCanvas(): void {
    if (!this.previewDataDetail) {
      return;
    }
    this.graph = new this.Q.Graph('wisdom-position');
    this.graph.moveToCenter();
    const body = this.graph.createNode('', 0, 0);
    body.image = this.previewDataDetail.fileFullPath;
    body.movable = false;
    body.zIndex = 1;
    // 分别创建节点
    if (!_.isEmpty(this.previewDataDetail.pointConfigList)) {
      this.previewDataDetail.pointConfigList.forEach(item => {
        const node = this.graph.createNode('' + item.configSort,
          Number(item.xposition), Number(item.yposition));
        node.image = this.Q.Shapes.getShape(this.Q.Consts.SHAPE_CIRCLE, 0, 0, 40, 40);
        node.setStyle(this.Q.Styles.SHAPE_FILL_COLOR, '#36cfc9');
        node.setStyle(this.Q.Styles.SHAPE_STROKE_STYLE, '#fff');
        node.setStyle(this.Q.Styles.LABEL_ANCHOR_POSITION, this.Q.Position.CENTER_MIDDLE);
        node.setStyle(this.Q.Styles.LABEL_POSITION, this.Q.Position.CENTER_MIDDLE);
        node.setStyle(this.Q.Styles.LABEL_FONT_SIZE, 32);
        node.setStyle(this.Q.Styles.LABEL_COLOR, '#fff');
        this.nodesMap.set('' + item.configSort, node);
      });
    }
    this.graph.moveToCenter();
    setTimeout(() => {
      this.graph.zoomToOverview();
    }, 500);
  }
}
