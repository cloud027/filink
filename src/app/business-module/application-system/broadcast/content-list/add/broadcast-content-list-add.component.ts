import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NzI18nService, UploadFile} from 'ng-zorro-antd';
import * as _ from 'lodash';
import {FiLinkModalService} from '../../../../../shared-module/service/filink-modal/filink-modal.service';
import {FormOperate} from '../../../../../shared-module/component/form/form-operate.service';
import {ApplicationService} from '../../../share/service/application.service';
import {FormItem} from '../../../../../shared-module/component/form/form-config';
import {ResultModel} from '../../../../../shared-module/model/result.model';
import {FileUploadComponentModel} from '../../../../../shared-module/model/file-upload-component.model';
import {RuleUtil} from '../../../../../shared-module/util/rule-util';
import {ApplicationInterface} from '../../../../../../assets/i18n/application/application.interface';
import {LanguageEnum} from '../../../../../shared-module/enum/language.enum';
import {ContentListModel} from '../../../share/model/content.list.model';
import {CalculationFileSizeConst, PICTURE_TYPE_CONST, VIDEO_TYPE_CONST, AUDIO_CONST} from '../../../share/const/program.const';
import {CheckUserModel} from '../../../share/model/check.user.model';
import {CommonLanguageInterface} from '../../../../../../assets/i18n/common/common.language.interface';
import {getFileType} from '../../../share/util/application.util';
import {FileTypeEnum, ProgramTypeEnum} from '../../../share/enum/program.enum';
import {ResultCodeEnum} from '../../../../../shared-module/enum/result-code.enum';


/**
 * 内容新增/编辑页面
 */
@Component({
  selector: 'app-broadcast-content-list-add',
  templateUrl: './broadcast-content-list-add.component.html',
  styleUrls: ['./broadcast-content-list-add.component.scss']
})
export class BroadcastContentListAddComponent implements OnInit, OnDestroy {
  /**
   * 表单中的上传文件
   */
  @ViewChild('upload') upload;
  /**
   * 表单中的上传文件
   */
  @ViewChild('checker') checker;
  /**
   * 页面标题
   */
  public pageTitle: string = '';
  /**
   * 列表初始加载图标
   */
  public isLoading = false;
  /**
   * form表单配置
   */
  public formColumn: FormItem[] = [];
  /**
   * 表单状态
   */
  public formStatus: FormOperate;
  /**
   * 是否是编辑或者新增 false: add true: update
   */
  private isUpdateOrAdd: boolean = false;
  /**
   * 节目ID
   */
  private programId: string;
  /**
   * 文件数组
   */
  public certificateFileList: UploadFile[] = [];
  /**
   * 文件是否已上传
   */
  public certificateUploadBtnDisabled = false;
  /**
   * 确定按钮的状态
   */
  public isDisabled: boolean = false;
  /**
   * 文件名字
   */
  public programFileName: string;
  /**
   * 国际化
   */
  public language: ApplicationInterface;
  /**
   * 审核人列表
   */
  public reviewedByArr: CheckUserModel[] = [];
  /**
   * 公共国际化
   */
  public commonLanguage: CommonLanguageInterface;
  /**
   * 文件信息
   */
  public certificateFileInfo = new FileUploadComponentModel();

  /**
   *
   * @param $applicationService 后台接口服务
   * @param $message 提示信息服务
   * @param $router 路由跳转服务
   * @param $activatedRoute 路由传参服务
   * @param $ruleUtil 规则服务
   * @param $nzI18n  国际化服务
   */
  constructor(
    private $applicationService: ApplicationService,
    private $message: FiLinkModalService,
    private $router: Router,
    private $ruleUtil: RuleUtil,
    private $activatedRoute: ActivatedRoute,
    private $nzI18n: NzI18nService
  ) {
  }

  ngOnInit(): void {
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.application);
    this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
    // 文件能上传类型
    this.certificateFileInfo = new FileUploadComponentModel(AUDIO_CONST, 1, this.language.frequentlyUsed.uploadAudioTips);
    // 标题默认新增内容
    this.pageTitle = this.language.contentList.addContent;
    this.initColumn();
    this.getCheckUsers();
    this.$activatedRoute.queryParams.subscribe(params => {
      if (params.programId) {
        this.programId = params.programId;
        this.isUpdateOrAdd = true;
        // 有ID则为编辑页面 标题为编辑内容
        this.pageTitle = this.language.contentList.editContent;
        this.onInitialization();
      }
    });
  }

  /**
   * 页面销毁
   */
  ngOnDestroy(): void {
    this.upload = null;
    this.checker = null;
  }

  /**
   * 审核人列表
   */
  public getCheckUsers(): void {
    this.$applicationService.getCheckUsers()
      .subscribe((result: ResultModel<CheckUserModel[]>) => {
        if (result.code === ResultCodeEnum.success) {
          this.reviewedByArr = result.data || [];
        } else {
          this.$message.error(result.msg);
        }
      });
  }

  /**
   * 获取form表单对象
   * @param event 表单
   */
  public formInstance(event: { instance: FormOperate }): void {
    this.formStatus = event.instance;
    // 校验表单
    this.formStatus.group.statusChanges.subscribe(() => {
      this.isDisabled = this.formStatus.getRealValid();
    });
  }

  /**
   * 编辑初始化
   */
  private onInitialization(): void {
    this.$applicationService.lookReleaseProgram(this.programId)
      .subscribe((result: ResultModel<ContentListModel>) => {
        if (result.code === ResultCodeEnum.success) {
          this.formStatus.resetData(result.data);
          this.formStatus.group.controls['programFileType'].reset(getFileType(this.$nzI18n, result.data.programFileType));
          this.certificateFileList = [{
            uid: result.data.programId,
            size: 0,
            type: '',
            name: result.data.programFileName,
            status: 'done',
            url: result.data.programPath
          }];
          this.programFileName = result.data.programFileName || '';
          // set 一个值  让表单可以通过验证  如文件修改  则该值没覆盖  如若没有 则上传时 判断删除
          this.formStatus.group.controls['file'].reset('isDocumentModification');
        } else {
          this.$message.error(result.msg);
        }
      });
  }

  /**
   * 表单配置
   */
  private initColumn(): void {
    this.formColumn = [
      // 节目名称
      {
        label: this.language.contentList.programName,
        key: 'programName',
        type: 'input',
        require: true,
        disabled: false,
        rule: [
          {required: true},
          {maxLength: 32},
          RuleUtil.getNamePatternRule(this.commonLanguage.namePattenMsg)
        ],
        asyncRules: [
          this.$ruleUtil.getNameAsyncRule((value) => {
            const param = {
              programId: this.programId || '',
              programName: value,
              programType: ProgramTypeEnum.broadcast,
            };
            return this.$applicationService.programNameRepeat(param);
          }, (res) => {
            if (res.code === ResultCodeEnum.success) {
              return !res.data;
            }
            return false;
          })
        ],
        customRules: [this.$ruleUtil.getNameCustomRule()],
      },
      // 节目描述
      {
        label: this.language.contentList.programDescription,
        key: 'programPurpose',
        type: 'input',
        require: true,
        disabled: false,
        // 描述该节目内容用途
        placeholder: this.language.contentList.describeProgram,
        rule: [{required: true}, {maxLength: 64}],
        customRules: [this.$ruleUtil.getNameCustomRule()],
      },
      // 节目文件
      {
        label: this.language.contentList.programFiles,
        key: 'file',
        type: 'custom',
        require: true,
        rule: [{required: true}],
        template: this.upload
      },
      // 时长
      {
        label: this.language.contentList.duration,
        key: 'duration',
        type: 'input',
        require: true,
        disabled: true,
        // 上传文件自动获取
        placeholder: this.language.contentList.automaticAcquisition,
        rule: [{required: true}],
      },
      // 格式
      {
        label: this.language.contentList.format,
        key: 'mode',
        type: 'input',
        require: true,
        disabled: true,
        placeholder: this.language.contentList.automaticAcquisition,
        rule: [{required: true}],
      },
      // 分辨率
      {
        label: this.language.contentList.resolvingPower,
        key: 'resolution',
        type: 'input',
        require: true,
        disabled: true,
        hidden: true,
        placeholder: this.language.contentList.automaticAcquisition,
        rule: [{required: true}],
      },
      // 大小
      {
        label: this.language.contentList.size,
        key: 'programSize',
        type: 'input',
        require: true,
        disabled: true,
        suffix: 'B',
        placeholder: this.language.contentList.automaticAcquisition,
        rule: [{required: true}],
      },
      // 类型
      {
        label: this.language.contentList.type,
        key: 'programFileType',
        type: 'input',
        require: true,
        disabled: true,
        placeholder: this.language.contentList.automaticAcquisition,
        rule: [{required: true}],
      },
      // 申请人
      {
        label: this.language.contentList.applicant,
        key: 'applyUser',
        type: 'input',
        disabled: false,
        rule: [{maxLength: 32}]
      },
      // 审核人
      {
        label: this.language.contentList.checker,
        key: 'reviewedUser',
        type: 'custom',
        rule: [],
        template: this.checker
      },
      // 备注
      {
        label: this.language.frequentlyUsed.remarks,
        disabled: false,
        key: 'remark',
        type: 'textarea',
        rule: [{maxLength: 255}]
      },
    ];
  }

  /**
   * 防抖
   */
  buttonDebounce = _.debounce(() => {
    const data = this.formStatus.group.getRawValue();
    // 冗余字段给默认值
    data.resolution = 1;
    data.programType = ProgramTypeEnum.broadcast;
    // console.log(data);
    const requestParameter = new FormData();
    // 该值等于isDocumentModification  则表示未上传新的文件  删除字段
    if (data.file === 'isDocumentModification') {
      delete data.file;
    }
    // 將data对象里面的属性append到参数里面
    Object.keys(data).forEach(item => {
      if (data[item]) {
        requestParameter.append(item, data[item]);
      }
    });
    requestParameter.append('programFileName', this.programFileName);
    let request = this.$applicationService.addReleaseProgram(requestParameter);
    // 判断是否为编辑
    if (this.isUpdateOrAdd) {
      requestParameter.append('programId', this.programId);
      request = this.$applicationService.editReleaseProgram(requestParameter);
    }
    request.subscribe((result: ResultModel<ContentListModel[]>) => {
      this.isLoading = false;
      if (result.code === ResultCodeEnum.success) {
        this.$router.navigate(['business/application/broadcast/broadcast-content-list'], {}).then();
      } else {
        this.$message.error(result.msg);
      }
    }, error => {
      this.isLoading = false;
    });
  }, 500, {leading: false, trailing: true});

  /**
   * 提交方法
   */
  public onConfirm(): void {
    this.isLoading = true;
    this.buttonDebounce();
  }

  /**
   * 文件上传
   * @param files 文件
   */
  public uploadFile(files: UploadFile) {
    // 文件大小
    const fileSize: number = files[0].size;
    if ((fileSize / CalculationFileSizeConst.mb) > 100) {
      this.certificateFileList = [];
      this.$message.warning(this.language.contentList.fileMsg);
      return;
    }
    this.certificateUploadBtnDisabled = true;
    this.formStatus.group.controls['file'].reset(files[0]);
    this.formStatus.group.controls['programSize'].reset(fileSize);
    // 文件格式
    const FileNameTypeEnum = files[0].type;
    const fileName = files[0].name.lastIndexOf('.');
    this.programFileName = files[0].name;
    // 文件后缀名
    const suffix = files[0].name.substring(fileName, files[0].name.length);
    this.formStatus.group.controls['mode'].reset(suffix);

    // 判断是否为视频
    if (VIDEO_TYPE_CONST.includes(FileNameTypeEnum)) {
      // 文件类型
      this.formStatus.group.controls['programFileType'].reset(getFileType(this.$nzI18n, FileTypeEnum.video));
      const videoSrc = window.URL.createObjectURL(files[0]);
      const video = document.createElement('video');
      video.src = videoSrc;
      // 先给视频两个默认值  能预览成功的视频  则会重新赋值 没有预览成功的视频则是默认值（3gp的视频无法预览）
      this.formStatus.group.controls['duration'].reset('0');
      this.formStatus.group.controls['resolution'].reset('0');
      video.oncanplay = (() => {
        // 获取 时长(取整) 分辨率
        const duration = Math.floor(video.duration) + '秒';
        if (video.videoWidth > 1280 || video.videoHeight > 1080) {
          this.reSetFormData();
          this.$message.warning(this.language.contentList.resolutionFormat);
          return;
        }
        const resolution = `${video.videoWidth}*${video.videoHeight}`;
        // 将时长  分辨率set到表单中
        this.formStatus.group.controls['duration'].reset(duration);
        this.formStatus.group.controls['resolution'].reset(resolution);
      });
      // 判断是否为图片
    } else if (PICTURE_TYPE_CONST.includes(FileNameTypeEnum)) {
      // 文件类型
      this.formStatus.group.controls['programFileType'].reset(getFileType(this.$nzI18n, FileTypeEnum.image));
      // 如果为图片  时长为0
      this.formStatus.group.controls['duration'].reset('0');
      const imageSrc = window.URL.createObjectURL(files[0]);
      const image = document.createElement('img');
      image.src = imageSrc;
      image.onload = (() => {
        if (image.width > 1280 || image.height > 1080) {
          this.reSetFormData();
          this.$message.warning(this.language.contentList.resolutionFormat);
          return;
        }
        const resolution = `${image.width}*${image.height}`;
        this.formStatus.group.controls['resolution'].reset(resolution);
      });
    } else if (AUDIO_CONST.includes(FileNameTypeEnum)) {
      // 文件类型
      this.formStatus.group.controls['programFileType'].reset(getFileType(this.$nzI18n, FileTypeEnum.audio));
      // 先给视频两个默认值  能预览成功的视频  则会重新赋值 没有预览成功的视频则是默认值（3gp的视频无法预览）
      this.formStatus.group.controls['duration'].reset('0');
      this.formStatus.group.controls['resolution'].reset('0');
      const audiorc = window.URL.createObjectURL(files[0]);
      const audio = document.createElement('audio');
      audio.src = audiorc;
      audio.oncanplay = (() => {
        // 获取 时长(取整) 分辨率
        const duration = Math.floor(audio.duration) + '秒';
        // 将时长  分辨率set到表单中
        this.formStatus.group.controls['duration'].reset(duration);
      });
    } else {
      // 文件类型
      this.formStatus.group.controls['programFileType'].reset(getFileType(this.$nzI18n, FileTypeEnum.text));
    }
  }


  /**
   * 删除上传的文件
   * @param file 文件
   */
  public removeFileChange(file: UploadFile): void {
    this.certificateUploadBtnDisabled = true;
    this.$message.success(`${this.language.frequentlyUsed.deleteSucceeded}!`);
    // 文件删除后需要表单的格式等置空
    this.reSetFormData();
    this.certificateFileList = this.certificateFileList.filter(item => item.uid !== file.uid);
    this.certificateUploadBtnDisabled = false;
  }

  /**
   * 重置删除文件的值
   */
  private reSetFormData(): void {
    this.formStatus.group.controls['file'].reset(null);
    this.formStatus.group.controls['programSize'].reset('');
    this.formStatus.group.controls['mode'].reset('');
    this.formStatus.group.controls['duration'].reset('');
    this.formStatus.group.controls['resolution'].reset('');
    this.formStatus.group.controls['programFileType'].reset('');
    this.certificateFileList = [];
    this.certificateUploadBtnDisabled = false;
  }

  /**
   * 取消
   */
  public onCancel(): void {
    window.history.go(-1);
  }
}
