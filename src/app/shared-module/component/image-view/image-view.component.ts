import {Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, Renderer2, SimpleChanges, ViewChild} from '@angular/core';
import * as _ from 'lodash';
import {FiLinkModalService} from '../../service/filink-modal/filink-modal.service';
import {ResultModel} from '../../model/result.model';
import {ResultCodeEnum} from '../../enum/result-code.enum';
import {BINARY_SYSTEM_CONST} from '../../../core-module/const/common.const';
import {FacilityForCommonService} from '../../../core-module/api-service/facility';
import {PictureListModel} from '../../../core-module/model/picture/picture-list.model';
import {QueryRealPicModel} from '../../../core-module/model/picture/query-real-pic.model';

/**
 * 图片查看组件
 */
@Component({
  selector: 'app-image-view',
  templateUrl: './image-view.component.html',
  styleUrls: ['./image-view.component.scss']
})
export class ImageViewComponent implements OnInit, OnChanges {

  @Input() curPicInfo: PictureListModel;
  @Input() picList: Array<PictureListModel> = [];
  @Output() viewClose = new EventEmitter();
  @ViewChild('img') imgElementRef: ElementRef;
  // 滑动图片列表
  public slidePicList: Array<PictureListModel> = [];
  // 图片放大缩小状态
  public imgState = {
    rot: 0, // 图片旋转角度
    scale: 1
  };
  // 鼠标是否按下
  public isMousedown = false;
  // 记录鼠标原始位置
  public imgCoordinate = {
    x: 0,
    y: 0,
    left: 0,
    top: 0
  };

  constructor(private renderer2: Renderer2,
              private $message: FiLinkModalService,
              private $facilityForCommon: FacilityForCommonService) {
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.dealSlidePicList(changes.curPicInfo.currentValue, changes.picList.currentValue);
  }

  public close(): void {
    this.viewClose.emit();
  }

  /**
   * 图片处理
   * param curPicInfo
   * param showPicList
   */
  public dealSlidePicList(curPicInfo, picList): void {
    this.picList = picList.map((item, index) => {
      item.indexNo = index + 1;
      return item;
    });
    // 查询一遍图片详情
    this.getCurPicDetail();
    this.curPicInfo = (this.picList.filter(item => item.picId === this.curPicInfo.picId))[0];
    if (picList.length <= 5) {
      this.slidePicList = picList;
    } else {
      this.initSlidePicList();
    }
  }

  /**
   * 查询当前图片的详情
   */
  private getCurPicDetail(): void {
    const queryBody = new QueryRealPicModel(
      this.curPicInfo.objectId, this.curPicInfo.objectType,
      this.curPicInfo.resource, null, null,
      this.curPicInfo.picId);
    this.$facilityForCommon.getPicDetail([queryBody]).subscribe((res: ResultModel<PictureListModel[]>) => {
      if (res.code === ResultCodeEnum.success) {
        if (!_.isEmpty(res.data)) {
          const index = this.curPicInfo.indexNo;
          this.curPicInfo = res.data[0];
          this.curPicInfo.indexNo = index;
          if (this.curPicInfo) {
            this.curPicInfo.picSize = this.curPicInfo.picSize ? `${(this.curPicInfo.picSize / BINARY_SYSTEM_CONST).toFixed(2)}kb` : '';
          }
        }
      } else {
        this.$message.error(res.msg);
      }
    });

  }

  /**
   * 上一页
   */
  public last(): void {
    const indexNo = this.curPicInfo.indexNo;
    if (indexNo === 1) {
      return;
    }
    this.curPicInfo = this.picList[indexNo - 2];
    this.getCurPicDetail();
    if (this.picList.length > 5) {
      this.initSlidePicList();
    }
    // 初始化图片状态
    this.imgReset();
  }

  /**
   * 下一页
   */
  public next(): void {
    const indexNo = this.curPicInfo.indexNo;
    if (indexNo === this.picList.length) {
      return;
    }
    this.curPicInfo = this.picList[indexNo];
    this.getCurPicDetail();
    if (this.picList.length > 5) {
      this.initSlidePicList();
    }
    // 初始化图片状态
    this.imgReset();
  }

  /**
   * 点击滑动图片选择
   * param item
   */
  public choosePic(item): void {
    this.curPicInfo = item;
    this.getCurPicDetail();
    if (this.picList.length > 5) {
      this.initSlidePicList();
    }
    this.imgReset();
  }

  /**
   * 图片向右旋转
   */
  public imgRight(): void {
    this.imgState.rot++;
    if (this.imgState.rot > 3) {
      this.imgState.rot = 0;
    }
    this.imgScaleRotate();
  }

  /**
   * 图片向左旋转
   */
  public imgLeft(): void {
    this.imgState.rot--;
    if (this.imgState.rot < 0) {
      this.imgState.rot = 3;
    }
    this.imgScaleRotate();
  }

  /**
   * 图片放大缩小
   * param multiple
   */
  public imgToSize(multiple): void {
    this.imgState.scale = this.imgState.scale * (1 + multiple);
    this.imgScaleRotate();
  }

  /**
   * 图片放大旋转
   */
  public imgScaleRotate(): void {
    this.renderer2.setStyle(this.imgElementRef.nativeElement,
      'transform', `scale(${this.imgState.scale}) rotate(${this.imgState.rot * 90}deg)`);
  }

  /**
   * 图片比例还原
   */
  public imgResetScale(): void {
    this.imgState.scale = 1;
    this.imgScaleRotate();
    this.movePicture(0, 0);
  }

  /**
   * 图片还原
   */
  public imgReset(): void {
    this.imgState.scale = 1;
    this.imgState.rot = 0;
    this.imgScaleRotate();
    this.movePicture(0, 0);
  }

  /**
   * 监听鼠标点击图片
   * param event
   */
  public imgMousedown(event: MouseEvent): boolean {
    this.isMousedown = true;
    this.imgCoordinate.x = event.clientX;
    this.imgCoordinate.y = event.clientY;
    if (this.imgElementRef.nativeElement.style.left) {
      this.imgCoordinate.left = parseInt(this.imgElementRef.nativeElement.style.left, 0);
    }
    if (this.imgElementRef.nativeElement.style.top) {
      this.imgCoordinate.top = parseInt(this.imgElementRef.nativeElement.style.top, 0);
    }
    return false;
  }

  /**
   * 监听鼠标在图片上移动
   * param event
   */
  public imgMousemove(event: MouseEvent): void {
    if (this.isMousedown) {
      const x = event.clientX;
      const y = event.clientY;
      this.movePicture(this.imgCoordinate.left + x - this.imgCoordinate.x, this.imgCoordinate.top + y - this.imgCoordinate.y);
    }
  }

  /**
   * 监听鼠标离开和鼠标放开
   */
  public imgMouseup(): void {
    this.isMousedown = false;
  }

  /**
   * 图片拖拽
   * param left
   * param top
   */
  public movePicture(left, top): void {
    this.renderer2.setStyle(this.imgElementRef.nativeElement, 'left', `${left}px`);
    this.renderer2.setStyle(this.imgElementRef.nativeElement, 'top', `${top}px`);
  }

  /**
   * 初始化slidePicList
   */
  private initSlidePicList(): void {
    const indexNo = this.curPicInfo.indexNo;
    if (indexNo >= 3 && this.picList.length - indexNo >= 2) {
      this.slidePicList = this.picList.slice(indexNo - 3, indexNo + 2);
    } else if (indexNo < 3) {
      this.slidePicList = this.picList.filter(item => item.indexNo < 6);
    } else {
      this.slidePicList = this.picList.filter(item => item.indexNo > this.picList.length - 5);
    }
  }

}
