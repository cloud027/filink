import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import Viewer from 'viewerjs';
import {Overlay, OverlayRef} from '@angular/cdk/overlay';
import {TemplatePortal} from '@angular/cdk/portal';
import {Download} from '../../../../../shared-module/util/download';
import {NzI18nService} from 'ng-zorro-antd';
import {PictureListModel} from '../../../../../core-module/model/picture/picture-list.model';
import {LanguageEnum} from '../../../../../shared-module/enum/language.enum';
import {BigPictureModel} from '../../../share/model/big-picture.model';

/**
 * 图片管理列表
 */
@Component({
  selector: 'app-image-list',
  templateUrl: './image-list.component.html',
  styleUrls: ['./image-list.component.scss']
})
export class ImageListComponent implements OnInit, OnChanges {
  // 图片list用于切换
  @Input() public photoList: Array<PictureListModel> = [];
  // 时间字符传
  @Input() public timeStr = '';
  // 选择图片事件 无法具体到类型，因为数据key和value全是动态的
  @Output() public selectChange = new EventEmitter();
  // 查看图片事件
  @Output() public viewItem = new EventEmitter<PictureListModel>();
  // 删除图片事件
  @Output() public delImg = new EventEmitter<PictureListModel[]>();
  // 查看大图事件
  @Output() public viewLargerImage = new EventEmitter<BigPictureModel>();
  // 图片心信息模版
  @ViewChild('picInfo') public picInfoTemplate: TemplateRef<any>;
  // 当前图片信息
  public curPhoto = {
    picName: ''
  };
  public viewer: Viewer;
  // 全部勾选
  public allChecked = false;
  // 已勾选列表
  public selectedList = [];
  // 是否显示
  public hidden = true;
  // 国际化
  public language: any;
  public overlayRef: OverlayRef;
  constructor( private overlay: Overlay,
               private $download: Download,
               private $nzI18n: NzI18nService,
               private viewContainerRef: ViewContainerRef) { }

  /**
   * 初始化
   */
  public ngOnInit(): void {
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.facility);
    // 图片大小转换
    this.photoList.forEach((item: PictureListModel) => {
      item.picSize = item.picSize ? (item.picSize / 1000).toFixed(2) + 'kb' : '';
    });
  }

  /**
   * 监听数据变化
   * param changes
   */
  public ngOnChanges(changes: SimpleChanges): void {
    // 监听到数据变化时取消全选
    this.allChecked = false;
  }

  /**
   * 勾选
   */
  public checkItem(item: PictureListModel): void {
    if (!this.selectedList.some((el) => item.picId === el.picId)) {
      this.selectedList.push(item);
    } else {
      this.selectedList = this.selectedList.filter(el => el.picId !== item.picId);
      item.checked = false;
    }
    this.updateAllChecked();
    const obj = {};
    obj[this.timeStr] = this.selectedList;
    this.selectChange.emit(obj);
  }

  /**
   * 全部勾选/取消
   */
  public selectAll(): void {
    if (this.allChecked) {
      this.photoList.forEach(item => item.checked = true);
      this.selectedList = this.photoList;
    } else {
      this.photoList.forEach(item => item.checked = false);
      this.selectedList = [];
    }
    const obj = {};
    obj[this.timeStr] = this.selectedList;
    this.selectChange.emit(obj);
  }

  /**
   * 图片删除
   * param item
   */
  public delete(event, item: PictureListModel): void {
    event.stopPropagation();
    // 如果该图片已勾选则先去掉勾选
    if (item.checked) {
      this.checkItem(item);
    }
    this.delImg.emit([item]);
  }
  /**
   * 大图退出
   */
  public close(): void {
    this.curPhoto = {picName: ''};
    this.viewer.hide();
  }

  /**
   * 查看详情
   * param item
   */
  public clickItem(event, item: PictureListModel): void {
    event.stopPropagation();
    this.viewItem.emit(item);
  }

  /**
   * 鼠标移动到眼睛显示图片信息
   * param item 时表移上去参数
   * param picInfo 图片信息
   */
  public showPicInfo(item: any, picInfo: PictureListModel): void {
    const strategy = this.overlay
      .position()
      .flexibleConnectedTo(item.target).withPositions([{ originX: 'start',
        originY: 'bottom',
        overlayX: 'start',
        overlayY: 'top',
        offsetY: 10
        }]);
    this.overlayRef = this.overlay.create({
      hasBackdrop: false,
      positionStrategy: strategy
    });
    this.overlayRef.attach(new TemplatePortal(this.picInfoTemplate, this.viewContainerRef, {picInfo}));
  }

  /**
   * 移开隐藏图片信息
   */
  public hidePicInfo(): void {
    this.overlayRef.detach();
  }

  /**
   * 点击图片查看大图
   * param item
   */
  public viewBigPic(item: PictureListModel): void {
    this.viewLargerImage.emit({
      curPicInfo: item,
      bigPicList: this.photoList
    });
  }

  /**
   * 图片下载
   * param url
   */
  public download(event, url: string): void {
    event.stopPropagation();
    this.$download.downloadFile(url);
  }
  /**
   * 更新全选
   */
  private updateAllChecked(): void {
    this.allChecked = this.selectedList.length === this.photoList.length;
  }
}
