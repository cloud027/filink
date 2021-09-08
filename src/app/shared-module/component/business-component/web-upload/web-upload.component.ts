import {AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {NzI18nService, NzModalService} from 'ng-zorro-antd';
import {HttpClient} from '@angular/common/http';
import {FiLinkModalService} from '../../../service/filink-modal/filink-modal.service';
import {ResultModel} from '../../../model/result.model';
import {CommonLanguageInterface} from '../../../../../assets/i18n/common/common.language.interface';
import {LanguageEnum} from '../../../enum/language.enum';
import {DefaultAccept} from 'src/app/shared-module/const/upload-file-type.const';
import {WebUploadService} from '../../../service/web-upload/web-upload.service';
import {SupportFileType} from '../../../model/web-uploader.model';
import {WebUploaderUrl} from '../../../../core-module/api-service/web-uploader/web-uploader-request-url';
import {WebUploaderRequestService} from '../../../../core-module/api-service/web-uploader';
import {SetRequestHeaderUtil} from '../../../util/set-request-header-util';
import {CommonUtil} from '../../../util/common-util';

// 上传文件库
declare const WebUploader: any;
// jQuery库
declare const $: any;
// 当前全局变量
declare const ZWUP: any;
// window对象
declare const window: any;

/**
 * 大文件上传组件
 */
@Component({
  selector: 'app-web-upload',
  templateUrl: './web-upload.component.html',
  styleUrls: ['./web-upload.component.scss']
})
export class WebUploadComponent implements OnInit, AfterViewInit, OnDestroy {
  // 显示隐藏弹窗
  @Input()
  set xcVisible(params) {
    this.isVisible = params;
    this.xcVisibleChange.emit(this.isVisible);
  }
  get xcVisible() {
    return this.isVisible;
  }
  // 业务模块id
  @Input() businessId: string;
  // 回调接口
  @Input() callBakUrl: string;
  // 回调接口参数
  @Input() callBakParams: string;
  // 可支持的文件类型
  @Input() set defaultAccepts(accept: SupportFileType) {
    if (accept) {
      this.uploadAccept = accept;
    } else {
      this.uploadAccept = DefaultAccept;
    }
  }
  // 上传文件标题
  @Input() uploadTitle: string;
  // 上传文件提示信息
  @Input() uploadMsg: string;
  // 是否需要按钮
  @Input() isNeedBtn: boolean = false;
  // 显示隐藏变化
  @Output() xcVisibleChange = new EventEmitter<boolean>();
  // 对外取消按钮事件
  @Output() closeModal = new EventEmitter<any>();
  // 对外确定按钮事件
  @Output() determine = new EventEmitter<any>();
  // 对外抛出正在上传的文件
  @Output() outputFiles = new EventEmitter<any>();
  // 是否有文件
  public hasFile: boolean = false;
  // 进度值
  public filePercent: number;
  // 上传提示信息
  public fileMsg;
  // 上传状态
  public uploadStatus: boolean = true;
  // 公共语言包
  public language: CommonLanguageInterface;
  // 页面dom节点id
  public uploadDomId: string;
  // 文本东id
  public textDomId: string;
  // 是否暂停上传
  public isPaused: boolean = false;
  // 显示隐藏
  private isVisible: boolean = false;
  // 上传完成的文件
  private uploadFile;
  // MD5加密的文件
  private md5File: string;
  // 上传实例
  private uploader;
  // 上传实例
  private _uploader;
  // 上传请求头
  private requestHeaders;
  // 上传的接口
  private uploadUrl: string = WebUploaderUrl.uploadUrl;
  // 校验文件接口
  private checkUrl: string = WebUploaderUrl.checkUrl;
  // 是否有开始上传
  private isUpload: boolean = false;
  // 支持的文件类型
  private uploadAccept;

  constructor(
    private $http: HttpClient,
    private $message: FiLinkModalService,
    private $i18n: NzI18nService,
    private $webUpload: WebUploadService,
    private $uploadService: WebUploaderRequestService,
    private $modalService: NzModalService,
  ) {}

  public ngOnInit(): void {
    this.language = this.$i18n.getLocaleData(LanguageEnum.common);
    this.requestHeaders = SetRequestHeaderUtil.setHeadersInfo();
    this.uploadAccept.title = this.language.supportType;
    if (!this.uploadTitle) {
      this.uploadTitle = this.language.uploadFile;
    }

    // 外部组件调用删除文件
    this.$webUpload.deleteLoadFile.subscribe(() => {
      if (this.fileMsg && this.fileMsg.id) {
        this.deleteFile();
      }
    });
    this.uploadDomId = `upload_documents_${CommonUtil.getUUid()}`;
    this.textDomId = `text_${CommonUtil.getUUid()}`;
  }

  public ngOnDestroy(): void {
    // 清空上传队列
    this._uploader.reset();
    // 注销组件
    WebUploader.Uploader.unRegister('custom');
  }


  public ngAfterViewInit(): void {
    const This = this;
    window.ZWUP = window.ZWUP || {};
    ZWUP.basePath = '';
    // html5加载或者flash加载配置文件路径
    ZWUP.flashPath = '/src/assets/js/web-upload/uploader.swf';
    ZWUP.isServerConfigLoaded = false;
    ZWUP.maxSize = 1024 * 1024 * 1024 * 5;
    // 获取文件服务地址
    const hostname = window.location.hostname;
    // 文件服务地址（可以不要，后台会自动获取）
    ZWUP.fileServerUrl = ZWUP.fileServerUrl || `http://${window.location.hostname}:10201/`;
    if (hostname.indexOf('localhost') > -1) {
      ZWUP.fileServerUrl = 'http://10.5.24.236:10201/';
    }
    // uploadMap实例
    const uploadMap = new MyUploadMap();
    // 线上文件块记录
    const chunkMap = new MyUploadMap();
    $.fn.extend({
      'zwUploader': function (option) {
        const items = this.each(function () {
          if ($.isPlainObject(option)) {
            this.controller = new Controller(this, option);
          }
        });
        return items;
      }
    });

    WebUploader.Uploader.register({
      'before-send-file': 'beforeSendFile', // 整个文件上传前
      'before-send': 'beforeSend',   // 每个分片上传前
      name: 'custom'
    }, {
      beforeSendFile: function (file) {
        const fileName = file.name;
        const fileSize = file.size;
        const file_ruid = file.id;
        const that = this.owner.controller;
        // 秒传验证
        const task = new $.Deferred();
        (new WebUploader.Uploader()).md5File(file, 0, 10 * 1024 * 1024).progress(function (percentage) {
        }).then(function (val) {
          This.fileMsg.statusText = This.language.readFile;
          const fileMd5 = val;
          This.md5File = val;
          const data = {
            type: 0,
            fileName: fileName,
            fileMd5: fileMd5,
            fileSize: fileSize,
            businessId: This.businessId,
            callBakUrl: This.callBakUrl,
            callBakParams: This.callBakParams
          };
          /*This.$uploadService.checkLoadFile(data).subscribe((rs: ResultModel<any>) => {
            if (rs.code === '0') {
              if (rs.data && rs.data.completeFlag === 0) {
                // 该文件已上传过
                $('#' + This.uploadDomId).find('.web-uploader-container').hide();
                file.statusText = This.language.alreadyUpload;
                const up_self = uploadMap.get(that.option.uploaderId);
                up_self.skipFile(file);
                file.viewPath = rs.data;
                task.resolve();
                return;
              }
              if (rs.data.chunkCurr < 0) {
                // 无法获取当前文件块
                file.statusText = This.language.notFileBlock;
                task.reject();
                return;
              }
              chunkMap.put(file_ruid, {fileMd5: fileMd5, chunkCurr: rs.data.chunkCurr, lock: rs.data.lockFlag});
              task.resolve();
            } else {
              if (rs && rs.msg) {
                This.fileMsg.statusText = rs.msg;
                // 上次文件不符
                This._uploader.removeFile(file);
                // 显示按钮
                $('#' + This.uploadDomId).find('.web-uploader-container').show();
                const list = This._uploader.getFiles();
                This.fileMsg = list[0];
                if (rs.data && (rs.data.fileName !== file.name) && rs.data.fileMd5) {
                  /!*const msg = `上次上传文件为-${rs.data.fileName}，续传文件与上次文件不符，是否删除上次文件再重新选择上传?`;
                  This.isConfirmDeleteFile(rs.data.fileMd5, msg);*!/
                  This.deleteFile(rs.data.fileMd5, true);
                  // 删除后继续上传
                  This.checkFileAndUpload(data, file.id, task, chunkMap);
                }
              } else {
                // 服务器异常
                This.$message.error(This.language.serverException);
              }
              This.filePercent = 0;
              task.reject();
            }
          }, error => {
            file.statusText = This.language.serverError;
            task.reject();
          });*/
          // 开始校验及上传
          checkFileUpload();
          function checkFileUpload() {
            This.$uploadService.checkLoadFile(data).subscribe((rs: ResultModel<any>) => {
              if (rs.code === '0') {
                if (rs.data && rs.data.completeFlag === 0) {
                  // 该文件已上传过
                  $('#' + This.uploadDomId).find('.web-uploader-container').hide();
                  file.statusText = This.language.alreadyUpload;
                  const up_self = uploadMap.get(that.option.uploaderId);
                  up_self.skipFile(file);
                  file.viewPath = rs.data;
                  task.resolve();
                  return;
                }
                if (rs.data.chunkCurr < 0) {
                  // 无法获取当前文件块
                  file.statusText = This.language.notFileBlock;
                  task.reject();
                  return;
                }
                chunkMap.put(file_ruid, {fileMd5: fileMd5, chunkCurr: rs.data.chunkCurr, lock: rs.data.lockFlag});
                task.resolve();
              } else {
                if (rs && rs.msg) {
                  // 上次文件不符
                  // This.fileMsg.statusText = rs.msg;
                  // This._uploader.removeFile(file);
                  // 显示按钮
                  $('#' + This.uploadDomId).find('.web-uploader-container').show();
                  const list = This._uploader.getFiles();
                  This.fileMsg = list[0];
                  if (rs.data && (rs.data.fileName !== file.name) && rs.data.fileMd5) {
                    /*const msg = `上次上传文件为-${rs.data.fileName}，续传文件与上次文件不符，是否删除上次文件再重新选择上传?`;
                    This.isConfirmDeleteFile(rs.data.fileMd5, msg);*/
                    // This.deleteFile(rs.data.fileMd5, true);
                    // 文件不符删除后继续上传
                    This.$uploadService.deleteLoadFile({fileMd5: rs.data.fileMd5, businessId: This.businessId}).subscribe((res: ResultModel<string>) => {
                      if (res.code === '0') {
                        // checkFileUpload();
                        This._uploader.retry();
                      }
                    });
                  }
                } else {
                  // 服务器异常
                  This.$message.error(This.language.serverException);
                }
                This.filePercent = 0;
                task.reject();
              }
            }, error => {
              file.statusText = This.language.serverError;
              task.reject();
            });
          }
        });
        return $.when(task);
      },
      beforeSend: function (block) {
        const task = new $.Deferred();
        const ruid = block.file.id;
        const chunkCurr = chunkMap.get(ruid).chunkCurr;
        $('#' + This.uploadDomId).find('.web-uploader-container').hide();
        $('#' + This.textDomId).find('.pause').show();
        if (block.chunk < chunkCurr) {
          This.fileMsg.statusText = This.language.pleaseWait;
          task.reject();
        } else {
          // console.log(`Block ${block.chunk} is being uploaded`);
          // 开始上传第一块时，对外发送文件信息
          if (block.chunk > 0 && block.file.viewPath && !This.isUpload) {
            This.isUpload = true;
            This.fileMsg.statusText = This.language.uploading;
            Object.assign(block.file.viewPath, {isUploadFinished: false});
            This.outputFiles.emit(block.file.viewPath);
          }
          if (block.total < 1024 * 1024) {
            block.chunk = 1;
          }
          task.resolve();
        }
        return $.when(task);
      }
    });
    // 控制器，监听各种事件
    const Controller = function (input, option) {
      const fileName = $(input).attr('data-ZW-upload-name') || 'file';
      const previewNames = $(input).attr('data-ZW-upload-preview') || '';
      const perviewFileNames = $(input).attr('data-ZW-upload-preview-names') || '';
      this.input = input;
      this.option = $.extend(false, {
        'baseUrlString': ZWUP.basePath,                                 // string
        'checkUrl': This.checkUrl,     // string
        'uploadUrl': This.uploadUrl,   // string
        'flashPath': ZWUP.flashPath,                         // string
        'accept': This.uploadAccept,                   // function
        'fileName': fileName,                           // string
        'previewNames': previewNames.split(','),        // string
        'perviewFileNames': perviewFileNames.split(','), // string
        'minItems': 1,                                  // number
        'maxItems': 20,                                 // number
        'uploadFinishedHandler': null,                  // function 上传文件完成回调
      }, option);

      if (!ZWUP.isServerConfigLoaded) {
        const that = this;
        _loadServerConfig(function () {
          _setup.apply(that, [input]);
        }, that);
      } else {
        _setup.apply(this, [input]);
      }
    };

    const _loadServerConfig = function (callback, controller) {
      ZWUP.isServerConfigLoaded = true;
      callback();
    };


    // ------- Private Method Here -------------
    // ------- Private Method Here -------------

    const _setup = function (input) {
      const that = this;
      const $input = $(input);
      const uploaderId = `file_${new Date().getTime()}_${parseInt(String(Math.random() * 1000), 10)}`;
      that.option.uploaderId = uploaderId;
      const $uploadContentView = that.option.createUploadBtn(that, uploaderId);
      $input.append($uploadContentView);

      const _uploader = this.uploader('#' + uploaderId);
      _uploader.controller = that;
      uploadMap.put(uploaderId, _uploader);

      // 加入上传队列之前
      _uploader.on('beforeFileQueued', function (file) {
        This._uploader.reset();
        This.isUpload = false;
        This.hasFile = false;
        This.fileMsg = null;
        const controller = _uploader.controller;
        if (controller.option.isAllowAddFile) {
          return controller.option.isAllowAddFile(controller);
        }
        return true;
      });

      // 当有文件被添加进队列的时候
      _uploader.on('fileQueued', function (file) {
        console.log('add to file queue');
        _appendFile.apply(that, ['', file]);
      });

      // 开始上传之前
      _uploader.on('uploadBeforeSend', function (block, data) {
        data.fileMd5 = chunkMap.get(block.file.id).fileMd5;
        data.chunkSize = block.blob.size;
        data.lock = chunkMap.get(block.file.id).lock;
      });

      // 某个文件开始上传前触发，一个文件只会触发一次。
      _uploader.on('uploadStart', function (file) {
        This.fileMsg = file;
        console.log(This.fileMsg);
      });

      // 当开始上传流程时触发。
      _uploader.on('startUpload', function () {
        This.uploadStatus = true;
      });

      // 当开始上传流程暂停时触发。
      _uploader.on('stopUpload', function () {
        This.uploadStatus = false;
        if (This.isUpload) {
          This.fileMsg.statusText = This.language.pauseLoad;
        }
      });

      // 文件上传过程中创建进度条实时显示。
      _uploader.on('uploadProgress', (file, percentage) => {
        This.filePercent = Math.ceil(percentage * 100);
        This.hasFile = true;
      });

      /*$('#stop').on('click', function () {
        _uploader.stop(true);
      });
      $('#retry').on('click', function () {
        _uploader.retry();
      });*/
      _uploader.on('uploadAccept', function (file, response) {
        let result;
        try {
          result = JSON.parse(response._raw);
          if (result.code === 1) {
            file.file.statusText = result.msg;
            file.file.viewPath = '';
          } else {
            file.file.viewPath = result.data;
            return true;
          }
        } catch (err) {
          return false;
        }
        return false;
      });

      // 当文件上传出错时触发。
      _uploader.on('uploadError', function (file) {
        // This._uploader.reset();
        This.filePercent = 0;
        // This.fileMsg.name = '';
        // This.fileMsg.statusText = `${This.language.loadError}，${file.statusText}`;
      });

      // 当文件上传成功时触发。
      _uploader.on('uploadSuccess', function (file, resp) {
        This.uploadFile = file;
        This.filePercent = 100;
        This.hasFile = true;
        This.isUpload = false;
        This.fileMsg.statusText = This.language.uploadSuccess;
        $('#' + This.textDomId).find('.text').text(This.language.uploadSuccess);
        $('#' + This.textDomId).find('.pause').hide();
        Object.assign(file.viewPath, {isUploadFinished: true});
        This.outputFiles.emit(file.viewPath);
      });
      // 不管成功或者失败，文件上传完成时触发
      _uploader.on('uploadComplete', function (file) {
      });
      // 所有文件上传结束
      _uploader.on('uploadFinished', function () {
      });
      // 文件校验不通过，包括格式校验大小及个数校验
      _uploader.on('error', function (type) {
      });
      This._uploader = _uploader;
    };

    const _appendFile = function (fileUrl, file) {
      const fileId = file.id;
      const fileName = this.option.fileName;
      const contentView = $(this.input);
      const fileUrlWithHost = ZWUP.fileServerUrl + fileUrl;
      file.url = fileUrl;
      this.option.createUploadItem(this, contentView, fileId, fileName, fileUrlWithHost, file);
    };

    const _error = function (msg) {
      if ($.isFunction(this.option.onerror)) {
        this.option.onerror.apply(this, [msg]);
      }
    };

    // 初始化组件所需配置，参数
    Controller.prototype.uploader = function (pick) {
      const accept = this.option.accept() || This.uploadAccept;
      const runtimeOrder = this.option.runtimeOrder;
      const flashPath = this.option.flashPath;
      const uploadURLString = this.option.baseUrlString + this.option.uploadUrl;
      return WebUploader.create({
        // swf文件路径
        swf: flashPath,
        // 内部根据当前运行是创建，可能是input元素，也可能是flash. 这里是div的id
        pick: {
          id: pick,
          multiple: false
        },
        // 文件接收服务端
        server: uploadURLString,
        // 文件类型
        accept: accept,
        // 指定运行时启动顺序。默认会想尝试 html5 是否支持，如果支持则使用 html5, 否则则使用 flash.
        runtimeOrder: runtimeOrder,
        // 是否压缩
        resize: false,
        // 配置压缩的图片的选项。如果此选项为false, 则图片在上传前不进行压缩
        compress: false,
        // 选完文件后，是否自动上传。
        auto: true,
        // 是否开启分片上传。
        chunked: true,
        // 分片大小， 默认大小为5MB. 当前为1MB
        chunkSize: 1024 * 1024,
        // 分片上传，允许自动重传多少次
        chunkRetry: 2,
        // 上传并发数。允许同时最大上传进程数。
        threads: 1,
        // 上传接口请求头
        headers: This.requestHeaders,
        // 同一文件是否可重复选择
        duplicate: false,
        // 上传数量限制
        fileNumLimit: 1,
        // 限制上传单个文件大小 不超过3GB
        // fileSingleSizeLimit: 1024 * 1024 * 1024 * 3,
      });
    };

    // map方法定义
    function MyUploadMap() {
      this.elements = [];

      // 获取MAP元素个数
      this.size = function () {
        return this.elements.length;
      };

      // 判断MAP是否为空
      this.isEmpty = function () {
        return (this.elements.length < 1);
      };

      // 删除MAP所有元素
      this.clear = function () {
        this.elements = [];
      };

      // 向MAP中增加元素（key, value)
      this.put = function (_key, _value) {
        const exist = this.containsKey(_key);
        if (exist) {
          this.remove(_key);
        }

        this.elements.push({
          key: _key,
          value: _value
        });
      };

      // 删除指定KEY的元素，成功返回True，失败返回False
      this.remove = function (_key) {
        let bln = false;
        try {
          for (let i = 0; i < this.elements.length; i++) {
            if (this.elements[i].key === _key) {
              this.elements.splice(i, 1);
              return true;
            }
          }
        } catch (e) {
          bln = false;
        }
        return bln;
      };

      // 获取指定KEY的元素值VALUE，失败返回NULL
      this.get = function (_key) {
        try {
          for (let i = 0; i < this.elements.length; i++) {
            if (this.elements[i].key === _key) {
              return this.elements[i].value;
            }
          }
        } catch (e) {
          return null;
        }
      };

      // 获取指定索引的元素（使用element.key，element.value获取KEY和VALUE），失败返回NULL
      this.element = function (_index) {
        if (_index < 0 || _index >= this.elements.length) {
          return null;
        }
        return this.elements[_index];
      };

      // 判断MAP中是否含有指定KEY的元素
      this.containsKey = function (_key) {
        let bln = false;
        try {
          for (let i = 0; i < this.elements.length; i++) {
            if (this.elements[i].key === _key) {
              bln = true;
            }
          }
        } catch (e) {
          bln = false;
        }
        return bln;
      };

      // 判断MAP中是否含有指定VALUE的元素
      this.containsValue = function (_value) {
        let bln = false;
        try {
          for (let i = 0; i < this.elements.length; i++) {
            if (this.elements[i].value === _value) {
              bln = true;
            }
          }
        } catch (e) {
          bln = false;
        }
        return bln;
      };

      // 获取MAP中所有VALUE的数组（ARRAY）
      this.values = function () {
        const arr = new Array();
        for (let i = 0; i < this.elements.length; i++) {
          arr.push(this.elements[i].value);
        }
        return arr;
      };

      // 获取MAP中所有KEY的数组（ARRAY）
      this.keys = function () {
        const arr = new Array();
        for (let i = 0; i < this.elements.length; i++) {
          arr.push(this.elements[i].key);
        }
        return arr;
      };
    }

    const zwblankuploader_accept = () => {
      return false;
    };
    const zwblankuploader_createUploadBtn = (controller, btnId) => {
      const hideCss = controller.option.isReadonly ? 'zw-hidden' : 'zw-ib';
      const btn = $('<div id="' + `fileList_${btnId}` + '" class="fileList"></div>'
          + '<div id="' + `${btnId}` + '" class="' + `zw-document-uploader${hideCss}` + '">' + `${This.language.clickLoad}` + '</div>');
      return btn;
    };
    const zwblankuploader_createUploadItem = (controller, contentView, fileId, fileName, fileUrlWithHost, file) => {};

    /// 绑定初始化组件
    $('#' + This.uploadDomId).zwUploader({
      accept: zwblankuploader_accept, // 可以上传文件类型,一般用组件默认即可
      createUploadBtn: zwblankuploader_createUploadBtn,
      createUploadItem: zwblankuploader_createUploadItem,
      uploadFinishedHandler: function (item) {
      }
    });

  }

  /**
   * 确定
   */
  public handleOk() {
    // console.log(this._uploader.getFiles());
    this.determine.emit();
    this.handleCancel();
  }

  /**
   * 取消/关闭弹窗
   */
  public handleCancel() {
    if (this.fileMsg) {
      // 来源是产品
      if (this.businessId.includes('upload-product')) {
          // 文件在上传中或者上传中断
          const status = this.fileMsg.getStatus();
          if (status === 'progress' && status === 'interrupt' && this.uploadFile.viewPath.isUploadFinished) {
            this.$modalService.confirm({
              nzTitle: this.language.prompt,
              nzContent: '当前文件未上传完成，是否取消上传？',
              nzMaskClosable: false,
              nzOkText: this.language.cancelText,
              nzCancelText: this.language.okText,
              nzOkType: 'danger',
              nzOnOk: () => {},
              nzOnCancel: () => {
                this.resetFile();
                this.deleteFile(this.md5File);
              }
            });
          } else if (status === 'complete') {
            // 已完成上传的文件直接关闭弹窗，不删除文件
            this.resetFile();
          } else {
            // 文件不在上传中或者未完成
            this.resetFile();
            this.deleteFile(this.md5File);
          }
      } else {
        // 其他模块
        this.resetFile();
      }
    } else {
      // 没有选择文件
      this.resetFile();
    }
    this.closeModal.emit();
  }

  /**
   * 暂停上传。第一个参数为是否中断上传当前正在上传的文件。
   * 如果第一个参数是文件，则只暂停指定文件。
   */
  public pauseLoad() {
    this._uploader.stop(true);
    this.isPaused = true;
  }

  /**
   * 重试上传，重试指定文件，或者从出错的文件开始重新上传
   */
  public retry() {
    this._uploader.retry();
    this.isPaused = false;
  }

  /**
   * 弹窗提示是否删除
   */
  private isConfirmDeleteFile(fileMd5: string, msg: string): void {
    this.$modalService.confirm({
      nzTitle: this.language.prompt,
      nzContent: msg,
      nzMaskClosable: false,
      nzOkText: this.language.cancelText,
      nzCancelText: this.language.okText,
      nzOkType: 'danger',
      nzOnOk: () => {},
      nzOnCancel: () => {
        this.deleteFile(fileMd5);
      }
    });
  }

  /**
   * 删除文件
   */
  public deleteFile(fileMd5?: string): void {
    // this._uploader.removeFile(this.fileMsg, true);
    const data = {
      fileMd5: fileMd5 ? fileMd5 : this.md5File,
      businessId: this.businessId
    };
    this.$uploadService.deleteLoadFile(data).subscribe((res: ResultModel<string>) => {
      if (res.code === '0') {
        this.resetFile();
        this.closeModal.emit(true);
        this.isPaused = false;
      }
    });
  }

  /**
   * 重置
   */
  private resetFile(): void {
    this.xcVisible = false;
    this.uploadFile = null;
    this.hasFile = false;
    this.isUpload = false;
    this.filePercent = 0;
    this.fileMsg = null;
    this._uploader.reset();
    $('#' + this.uploadDomId).find('.web-uploader-container').show();
  }

}
