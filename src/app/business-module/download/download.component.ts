import {Component, OnInit, TemplateRef, ViewChild, OnDestroy} from '@angular/core';
import {PageModel} from '../../shared-module/model/page.model';
import {TableConfigModel} from '../../shared-module/model/table-config.model';
import {NzI18nService} from 'ng-zorro-antd';
import {DownloadLanguageInterface} from '../../../assets/i18n/download/download.language.interface';
import {DownloadService} from './share/service/download.service';
import {Result} from '../../shared-module/entity/result';
import {PageCondition, QueryConditionModel} from '../../shared-module/model/query-condition.model';
import {FiLinkModalService} from '../../shared-module/service/filink-modal/filink-modal.service';
import {Download} from '../../shared-module/util/download';
import {ResultCodeEnum} from '../../shared-module/enum/result-code.enum';
import {ExcelExportModel} from './share/model/excel-export.model';

/**
 * 导出管理
 */
@Component({
  selector: 'app-download',
  templateUrl: './download.component.html',
  styleUrls: ['./download.component.scss']
})
export class DownloadComponent implements OnInit, OnDestroy {

  constructor(private $I18n: NzI18nService, private $downloadService: DownloadService,
              private $message: FiLinkModalService, private $download: Download
  ) {
  }
  // 表格数据
  _dataSet = [];
  // 表格分页配置
  pageBean: PageModel = new PageModel(10, 1, 1);
  // 表格配置
  tableConfig: TableConfigModel;
  // 轮询定时器ID
  timeoutID: any;
  // 国际化
  public language: DownloadLanguageInterface;
  // 查询条件
  queryCondition: QueryConditionModel = new QueryConditionModel();
  // 进度条模板
  @ViewChild('progress') progressTemp: TemplateRef<any>;
  // 操作栏

  ngOnInit() {
    this.queryCondition.pageCondition = new PageCondition(1, 10);
    this.language = this.$I18n.getLocaleData('download');
    this.initTableConfig();
    this.queryExportTaskList();
  }

  // 跳转页面后清除定时器
  ngOnDestroy() {
    clearInterval(this.timeoutID);
  }

  // 分页
  pageChange(event) {
    this.tableConfig.isLoading = true;
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
    clearInterval(this.timeoutID);
    this.queryExportTaskList();
  }

  /**
   * 初始化表格配置
   */
  initTableConfig() {
    this.tableConfig = {
      showSearch: false,
      isLoading: true,
      noIndex: true,
      scroll: {x: '1000px', y: '325px'},
      showPagination: true,
      showSizeChanger: true,
      isDraggable: true,
      columnConfig: [
        {type: 'select', fixedStyle: {fixedLeft: true, style: {left: '0px'}}, width: 70},
        {
          type: 'serial-number', width: 70, title: this.language.serialNumber,
          fixedStyle: {fixedLeft: true, style: {left: '70px'}}
        },
        {
          title: this.language.module, key: 'listName', width: 250, minWidth: 150
        },
        {
          title: this.language.time, key: 'tsCreateTime', pipe: 'date', width: 200, minWidth: 150
        }, {
          title: this.language.endExportTime, key: 'endTime', pipe: 'date', width: 200, minWidth: 150
        },
        {title: this.language.progress, type: 'render', renderTemplate: this.progressTemp, minWidth: 200},
        {
          title: this.language.handle, type: 'operate',
          width: 100
        }
      ],
      operation: [
        // 下载
        {
          text: this.language.download,
          className: 'fiLink-download-file',
          key: 'isDown',
          handle: (data) => {
            this.$download.downloadFile(data.filePath);
          }
        },
        // 重试
        {
          text: this.language.retry,
          className: 'fiLink-refresh-index',
          key: 'isRetry',
          handle: (data) => {
            clearInterval(this.timeoutID);
            this.Retry(data);
          }
        },
        // 终止
        {
          text: this.language.suspend,
          className: 'fiLink-suspend',
          key: 'isSuspend',
          handle: (data) => {
            clearInterval(this.timeoutID);
            this.tableConfig.isLoading = true;
            this.$downloadService.stopExport(data.taskInfoId).subscribe((result: Result) => {
              if (result.code === 0) {
                clearTimeout(this.timeoutID);
                this.$message.success(result.msg);
                this.queryExportTaskList();
              } else {
                this.$message.error(result.msg);
              }
            }, () => {
              this.tableConfig.isLoading = false;
            });
          }
        },
        // 再次执行
        {
          text: this.language.restart,
          className: 'fiLink-reset',
          key: 'isAgain',
          handle: (data) => {
            clearInterval(this.timeoutID);
            this.Retry(data);
          }
        },
        // 开始
        {
          text: this.language.start,
          className: 'fiLink-pic-bofang',
          key: 'isPlay',
          handle: (data) => {
            clearInterval(this.timeoutID);
            this.Retry(data);
          }
        },
        // 删除
        {
          text: this.language.delete,
          className: 'fiLink-delete red-icon',
          needConfirm: true,
          handle: (data) => {
            clearInterval(this.timeoutID);
            this.deleteExportTask(data);
          }
        }
      ],
      topButtons: [
        {
          text: this.language.delete,
          btnType: 'danger',
          className: 'table-top-delete-btn',
          iconClassName: 'fiLink-delete',
          canDisabled: true,
          needConfirm: true,
          handle: (data) => {
            clearInterval(this.timeoutID);
            this.deleteExportTask(data);
          }
        },
      ]
    };
  }


  /**
   * 查询导出列表
   */
  queryExportTaskList() {
    this.$downloadService.queryExportTaskList(this.queryCondition).subscribe((result: Result) => {
      if (result.code === 0) {
        this.tableConfig.isLoading = false;
        this._dataSet = result.data;
        this.pageBean.Total = result.totalCount;
        this._dataSet.forEach(item => {
          if ((item.fileGeneratedNum && item.fileGeneratedNum !== 0) && item.fileNum) {
            item['progress'] = Number((item.fileGeneratedNum / item.fileNum) * 100).toFixed(1);
            if (item['progress'] > 100) {
              item['progress'] = 98;
            }
          } else {
            item['progress'] = 0;
          }
          // 进度条状态判断及按钮选择
          if (item.taskStatus === 1 || item.taskStatus === 0) {
            this._dataSet['isPolling'] = true;
          }
        });
        this.setIcon(this._dataSet);
        if (this._dataSet['isPolling'] === true) {
          this.timeoutID = setInterval(() => this.getProgress(), 5000);
        }
      }
    }, () => {
      this.tableConfig.isLoading = false;
    });
  }

  /**
   * 重试
   */
  Retry(data) {
    this.tableConfig.isLoading = true;
    data.columnInfos = JSON.parse(data.columnInfos);
    let againObj: ExcelExportModel;
    if (data.listName === this.language.facilityPictureList) {
      againObj = {
        excelType: data.excelType,
        queryCondition: JSON.parse(data.queryCondition),
        taskId: data.taskInfoId,
      };
    } else {
      againObj = {
        excelType: data.excelType,
        queryCondition: JSON.parse(data.queryCondition),
        taskId: data.taskInfoId,
        columnInfoList: data.columnInfos
      };
    }
    if (data.objectList) {
      againObj['objectList'] = data.objectList;
    }
    this.$downloadService.excelExport(data.methodPath, againObj).subscribe((result: Result) => {
      // todo build2时需删除等于0的情况
      if (result.code === 0 || result.code === ResultCodeEnum.success) {
        this.queryExportTaskList();
        // this.$message.success(result.msg);
      } else {
        this.tableConfig.isLoading = false;
        this.queryExportTaskList();
        this.$message.error(result.msg);
      }
    }, () => {
      this.tableConfig.isLoading = false;
      this.queryExportTaskList();
    });
  }

  deleteExportTask(data) {
    this.tableConfig.isLoading = true;
    const deleteList = [];
    if (data.length) {
      data.forEach(item => {
        deleteList.push(item.taskInfoId);
      });
    } else {
      deleteList.push(data.taskInfoId);
    }
    this.$downloadService.deleteTask(deleteList).subscribe((result: Result) => {
      if (result.code === 0) {
        this.tableConfig.isLoading = false;
        this.queryCondition.pageCondition.pageNum = 1;
        this.pageBean.pageIndex = 1;
        this.pageBean.pageSize = this.queryCondition.pageCondition.pageSize;
        this.$message.success(result.msg);
        this.queryExportTaskList();
      } else {
        this.tableConfig.isLoading = false;
        this.$message.error(result.msg);
      }
    }, () => {
      this.tableConfig.isLoading = false;
      this.queryExportTaskList();
    });
  }

  /**
   * 轮询查看进度条
   */
  getProgress() {
    this.$downloadService.queryExportTaskList(this.queryCondition).subscribe((result: Result) => {
      result.data.forEach((item) => {
        const temp = this._dataSet.find(_item => item.taskInfoId === _item.taskInfoId);
        if (temp && (temp.taskStatus === 0 || temp.taskStatus === 1)) {
          temp.taskStatus = item.taskStatus;
          temp.tsUpDateTime = item.tsUpDateTime;
          if (temp.taskStatus !== 0) {
            temp.progress = Number((item.fileGeneratedNum / item.fileNum) * 100).toFixed(1);
          }
        }
        if (temp.taskStatus === 3) {
          temp.filePath = item.filePath;
        }
      });
      if (this._dataSet.length > 0 && this._dataSet.find(_item => _item.taskStatus === 1 || _item.taskStatus === 0)) {
        this._dataSet['isPolling'] = true;
      } else {
        this._dataSet['isPolling'] = false;
      }
      if (!this._dataSet['isPolling']) {
        clearInterval(this.timeoutID);
      }
      this.setIcon(this._dataSet);
    });
    if (this._dataSet.length === 0) {
      clearInterval(this.timeoutID);
    }
  }

  /**
   * 更改图标
   */
  setIcon(data) {
    data.forEach(item => {
      // 进度条状态判断及按钮选择
      if (item.taskStatus === 4) {
        item['nzStatus'] = 'exception';
        item['isRetry'] = true;
        item['isDown'] = false;
        item['isSuspend'] = false;
        item['isAgain'] = false;
        item['isPlay'] = false;
      } else if (item.taskStatus === 3) {
        item['nzStatus'] = 'success';
        item['isRetry'] = false;
        item['isDown'] = true;
        item['isSuspend'] = false;
        item['isAgain'] = false;
        item['isPlay'] = false;
        item['endTime'] = item.tsUpDateTime;
      } else if (item.taskStatus === 1) {
        item['nzStatus'] = 'active';
        item['isSuspend'] = true;
        item['isRetry'] = false;
        item['isDown'] = false;
        item['isAgain'] = false;
        item['isPlay'] = false;
      } else if (item.taskStatus === 2) {
        item['nzStatus'] = '';
        item['isAgain'] = true;
        item['isSuspend'] = false;
        item['isRetry'] = false;
        item['isDown'] = false;
        item['isPlay'] = false;
      } else {
        item['nzStatus'] = '';
        item['isPlay'] = true;
        item['isAgain'] = false;
        item['isSuspend'] = false;
        item['isRetry'] = false;
        item['isDown'] = false;
      }
    });
  }
}
