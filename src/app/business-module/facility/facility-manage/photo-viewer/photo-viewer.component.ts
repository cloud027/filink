import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {NzI18nService, NzModalService} from 'ng-zorro-antd';
import {PictureApiService} from '../../share/service/picture/picture-api.service';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {fromEvent} from 'rxjs';
import {debounceTime} from 'rxjs/operators';
import {ImageViewService} from '../../../../shared-module/service/picture-view/image-view.service';
import {ResultModel} from '../../../../shared-module/model/result.model';
import {ResultCodeEnum} from '../../../../shared-module/enum/result-code.enum';
import {ActivatedRoute} from '@angular/router';
import {PictureListModel} from '../../../../core-module/model/picture/picture-list.model';
import {BigPictureModel} from '../../share/model/big-picture.model';
import {PageCondition} from '../../../../shared-module/model/query-condition.model';
import {DateTypeEnum} from '../../../../shared-module/enum/date-type.enum';
import {TimeItemModel} from '../../../../core-module/model/equipment/time-item.model';
import {ImageFilterModel} from '../../share/model/image-filter.model';

/**
 * 查看图片
 */
@Component({
  selector: 'app-photo-viewer',
  templateUrl: './photo-viewer.component.html',
  styleUrls: ['./photo-viewer.component.scss']
})
export class PhotoViewerComponent implements OnInit {
  @ViewChild('imgView') imgView: ElementRef;
  // 图片列表 列表是以时间为key，无法给具体的类型
  public photoList: any[] = [];
  // 控制过滤显示隐藏
  public showFilter = false;
  // 列表查询条件 默认每页60
  public queryConditions = {
    bizCondition: {}, pageCondition: new PageCondition(1, 60)
  };
  // 当前查看图片信息
  public picInfo: PictureListModel = new PictureListModel();
  // 已勾选图片列表 选择的数据key是以时间为key无法给具体的类型
  public selectPicObj: any = {};
  // 时间选择器数据
  public timeList: Array<TimeItemModel> = [];
  // 国际化 获取的是所有的数据
  public language: any;
  // 查询加载动画
  public loading = false;
  // 滚动条监听
  public subscribeScroll;
  // 加载更多
  public loadMore = false;
  // 总页数
  public totalPage = 0;
  // 当前页数据
  public currentPageSize: number;
  // 设备id
  public equipmentId: string;

  constructor(private $nzI18n: NzI18nService,
              private $message: FiLinkModalService,
              private el: ElementRef,
              private $modalService: NzModalService,
              private $imageViewService: ImageViewService,
              private $active: ActivatedRoute,
              private $pictureApiService: PictureApiService) {
    this.language = $nzI18n.getLocale();
  }

  public ngOnInit(): void {
    // 初始化时间选择器列表
    this.timeList = [{
      label: this.language.facility.picInfo.day,
      value: DateTypeEnum.day
    }, {
      label: this.language.facility.picInfo.week,
      value: DateTypeEnum.week
    }, {
      label: this.language.facility.picInfo.month,
      value: DateTypeEnum.month
    }, {
      label: this.language.facility.picInfo.year,
      value: DateTypeEnum.year
    }];
    this.$active.queryParams.subscribe(params => {
      this.equipmentId = params.equipmentId;
    });
    if (this.equipmentId) {
      this.queryConditions.bizCondition = {equipmentIds: [this.equipmentId]};
    }
    this.searchList();
    this.subscribeScroll = fromEvent(this.imgView.nativeElement, 'scroll').pipe(debounceTime(100)).subscribe(result => {
      this.scrollListener(result);
    });
  }

  /**
   * 判断是否可以删除
   */
  public deleteDisable(): boolean {
    let delImgList = [];
    Object.values(this.selectPicObj).forEach(item => {
      delImgList = delImgList.concat(item);
    });
    return delImgList.length === 0;
  }

  /**
   * 查询
   */
  public searchList(): void {
    this.loading = true;
    // 将时间转化为时间戳
    const queryConditions = JSON.parse(JSON.stringify(this.queryConditions));
    if (queryConditions.bizCondition && queryConditions.bizCondition['startTime']) {
      queryConditions.bizCondition['startTime'] = (new Date(queryConditions.bizCondition['startTime']).getTime()) / 1000;
    }
    if (queryConditions.bizCondition && queryConditions.bizCondition['endTime']) {
      queryConditions.bizCondition['endTime'] = (new Date(queryConditions.bizCondition['endTime']).getTime()) / 1000;
    }
    this.$pictureApiService.imageListByPage(queryConditions).subscribe(((result: ResultModel<PictureListModel[]>) => {
      this.loading = false;
      this.loadMore = false;
      if (result.code === ResultCodeEnum.success) {
        this.totalPage = result.totalPage;
        this.currentPageSize = result.size;
        let photoList = Object.entries(result.data).map((arr) => {
          return {
            time: arr[0].replace(/-/g, '/'),
            picList: arr[1]
          };
        });
        const length = this.photoList.length;
        // 如果第一次和第二次查询上来的结果有冲突则合并
        if (length > 0 && this.photoList[length - 1].time === photoList[0].time) {
          this.photoList[length - 1].picList = this.photoList[length - 1].picList.concat(photoList[0].picList);
          photoList = photoList.slice(1);
        }
        this.photoList = this.photoList.concat(photoList);
      } else {
        this.$message.error(result.msg);
      }
    }), () => {
      this.loading = false;
      this.loadMore = false;
      if (this.queryConditions.pageCondition.pageNum > 1) {
        this.queryConditions.pageCondition.pageNum--;
      }
    });
  }

  /**
   * 监听查看文件变化
   */
  public picInfoChange(item: PictureListModel): void {
    this.picInfo = item;
  }

  /**
   * 查询条件变化
   * param filterObj
   */
  public changeFilter(filterObj: ImageFilterModel): void {
    // 初始化列表
    this.photoList = [];
    // 初始化分页条件
    this.queryConditions.pageCondition.pageNum = 1;
    filterObj.startTime = this.queryConditions.bizCondition['startTime'];
    filterObj.endTime = this.queryConditions.bizCondition['endTime'];
    this.queryConditions.bizCondition = filterObj;
    this.picInfo = {};
    this.searchList();
  }

  /**
   *  时间组件时间改变事件
   */
  public timeChangeFilter(filterObj: ImageFilterModel): void {
     this.queryConditions.bizCondition['startTime'] = filterObj.startTime ;
     this.queryConditions.bizCondition['endTime'] = filterObj.endTime;
     this.picInfo = {};
     this.searchList();
     this.photoList = [];
  }

  /**
   * 存储所用已选择图片
   * param list 数组中的每个key值不一样无法给准确的类型
   */
  public dealSelectPic(list: any): void {
    this.selectPicObj = Object.assign(this.selectPicObj, list);
  }

  /**
   * 批量删除图片
   */
  public handleDelete(): void {
    let delImgList = [];
    Object.values(this.selectPicObj).forEach(item => {
      delImgList = delImgList.concat(item);
    });
    this.delImg(delImgList);
  }

  /**
   * 图片删除
   * param list
   */
  public delImg(list: Array<any>): void {
    this.$modalService.confirm({
      nzTitle: this.language.table.prompt,
      nzContent: `<span>${this.language.table.promptContent}</span>`,
      nzOkText: this.language.table.cancelText,
      nzOkType: 'danger',
      nzMaskClosable: false,
      nzOnOk: () => {
      },
      nzCancelText: this.language.table.okText,
      nzOnCancel: () => {
        this.$pictureApiService.deleteImageIsDeletedByIds(list).subscribe((result: ResultModel<string>) => {
          if (result.code === ResultCodeEnum.success) {
            this.$message.success(result.msg);
            // 删除成功之后清空选中的图片
            this.selectPicObj = {};
            this.photoList = [];
            this.queryConditions.pageCondition = new PageCondition(1, 30);
            // 如果图片被删除 则不显示图片信息
            if (this.picInfo && this.picInfo.picId) {
              const picList = list.filter(item => item.picId === this.picInfo.picId);
              if (picList.length > 0) {
                this.picInfo = {};
              }
            }
            this.searchList();
          } else {
            this.$message.error(result.msg);
          }
        });
      },
    });
  }

  /**
   * 批量下载
   */
  public download(): void {
    const sendData = {
      taskId: '',
      queryCondition: {
        pageCondition: {},
        bizCondition:
          {
            picIds: []
          }
      }
    };
    let delImgList = [];
    Object.values(this.selectPicObj).forEach(item => {
      delImgList = delImgList.concat(item);
    });
    delImgList = delImgList.map(item => item.picId);
    if (delImgList && delImgList.length > 0) {
      sendData.queryCondition.bizCondition.picIds = delImgList;
      this.$pictureApiService.batchDownLoadImages(sendData).subscribe((result: ResultModel<string>) => {
        if (result.code === ResultCodeEnum.success) {
          this.$message.success(result.msg);
        } else {
          this.$message.error(result.msg);
        }
      });
    } else {
      this.$message.warning(this.language.facility.picInfo.downloadMsg);
    }
  }

  /**
   * 监听滚动条事件
   * param item
   */
  public scrollListener(item): void {
    // 判断是否还有数据 当前的pageSize小于查询的数据pageSize表示没数据了不再查询
    if (!this.loadMore && this.currentPageSize === this.queryConditions.pageCondition.pageSize) {
      const scrollHeight = item['target'].scrollHeight;
      const scrollTop = item['target'].scrollTop;
      const clientHeight = item['target'].clientHeight;
      if (scrollHeight - scrollTop - clientHeight <= 60) {
        this.loadMore = true;
        this.queryConditions.pageCondition.pageNum++;
        this.searchList();
      }
    }
  }

  /**
   * 查看大图
   * param item
   */
  public viewLargerImage(item: BigPictureModel): void {
    this.$imageViewService.showPictureView(item.bigPicList, item.curPicInfo);
  }
}
