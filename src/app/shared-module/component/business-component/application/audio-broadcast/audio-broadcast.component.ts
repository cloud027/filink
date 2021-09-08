import {Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild} from '@angular/core';
import {FiLinkModalService} from '../../../../service/filink-modal/filink-modal.service';
import {NativeWebsocketImplService} from '../../../../../core-module/websocket/native-websocket-impl.service';
import {ApplicationCommonService} from '../../../../service/application/application-common.service';
import {ApplicationInterface} from '../../../../../../assets/i18n/application/application.interface';
import {NzI18nService} from 'ng-zorro-antd';
import {PolicyEnum, StrategyStatusEnum} from '../../../../../business-module/application-system/share/enum/policy.enum';
import {ProgramListModel} from '../../../../../business-module/application-system/share/model/policy.control.model';
import {ApplicationService} from '../../../../../business-module/application-system/share/service/application.service';
import {CommonUtil} from '../../../../util/common-util';
import {ApplicationFinalConst, RouterJumpConst} from '../../../../../business-module/application-system/share/const/application-system.const';
import {DistributeModel} from '../../../../../business-module/application-system/share/model/distribute.model';
import {InstructConfig} from '../../../../../business-module/application-system/share/config/instruct.config';
import {FileNameTypeEnum, ImageEnum, PlayEnum} from '../../../../../business-module/application-system/share/enum/program.enum';
import {CurrentTimeConst} from '../../../../../business-module/application-system/share/const/program.const';
import {OnlineLanguageInterface} from '../../../../../../assets/i18n/online/online-language.interface';
import {ProgramBroadcastPermissionModel} from '../../../../../core-module/model/program-broadcast-permission.model';
import {ControlInstructEnum} from '../../../../../core-module/enum/instruct/control-instruct.enum';
import {OperatorEnum} from '../../../../enum/operator.enum';
import {PageModel} from '../../../../model/page.model';
import {TableConfigModel} from '../../../../model/table-config.model';
import {FilterCondition, QueryConditionModel, SortCondition} from '../../../../model/query-condition.model';
import {ResultModel} from '../../../../model/result.model';
import {LanguageEnum} from '../../../../enum/language.enum';
import {ResultCodeEnum} from '../../../../enum/result-code.enum';
@Component({
  selector: 'app-audio-broadcast',
  templateUrl: './audio-broadcast.component.html',
  styleUrls: ['./audio-broadcast.component.scss']
})
export class AudioBroadcastComponent implements OnInit {

  /**
   * 批量控制枚举 此处any是因为每个地方枚举命名不一样
   */
  @Input() operatePermissionEnum: any;
  /**
   * 设备id
   */
  @Input() public equipmentId: string = '';
  @Input() public sliderShow: boolean = false;
  @Input() public equipmentModel: string = '';
  @Output() public operationEvent = new EventEmitter();
  // 设备单选
  @ViewChild('radioTemp') radioTemp: TemplateRef<any>;
  // 节目文件
  @ViewChild('programFileName') programFileName: TemplateRef<any>;
  /**
   * 节目地址
   */
  public programIdPath: string = '';
  public filePath: string = '';
  // 节目名称
  public programName: string = '';
  private timer = null;
  // 节目显示
  public isShowProgram: boolean = false;
  // 是否是视屏
  public isVideo: boolean = true;
  // 亮度值
  public lightValue: number = 0;
  // 选中的节目id
  public selectedProgramId: string;
  // 音量值
  public volumeValue: number = 0;
  // 分页实体
  public pageBean: PageModel = new PageModel();
  // 节目列表
  public dataSet: ProgramListModel[] = [];
  public operationList = [];
  public sliderList = [];
  public programItem = {};
  private programParams: DistributeModel;
  // 表格配置
  public tableConfig: TableConfigModel;
  // 选中的节目
  public selectedProgram: ProgramListModel = new ProgramListModel();
  // 分页条件
  public queryCondition: QueryConditionModel = new QueryConditionModel();
  // 多语言配置
  public language: OnlineLanguageInterface;
  // 设备列表多语言
  public languageTable: ApplicationInterface;
  /**
   * 批量操作权限码
   */
  public programBroadcastPermissionModel: ProgramBroadcastPermissionModel = new ProgramBroadcastPermissionModel();

  constructor(
    // 提示
    private $message: FiLinkModalService,
    // 多语言配置
    private $nzI18n: NzI18nService,
    // 接口服务
    private $applicationService: ApplicationService,
    private $wsService: NativeWebsocketImplService,
    // 接口服务
    private $applicationCommonService: ApplicationCommonService,
  ) {
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.online);
    this.languageTable = this.$nzI18n.getLocaleData(LanguageEnum.application);
  }

  ngOnInit(): void {
    if (this.operatePermissionEnum) {
      // 获取批量操作的权限码
      Object.keys(this.operatePermissionEnum).forEach(v => {
        this.programBroadcastPermissionModel[v] = this.operatePermissionEnum[v];
      });
    }
    this.wsMsgAccept();
    this.queryEquipmentCurrentPlayProgram(this.equipmentId);
    this.initTableConfig();
    this.getOperation();
    this.refreshData();
  }

  /**
   * 根据设备ID 查询当前设备播放的节目信息
   */
  private queryEquipmentCurrentPlayProgram(id): void {
    this.$applicationCommonService.queryEquipmentCurrentPlayProgram(id).subscribe((res: ResultModel<any>) => {
      if (res.code !== ResultCodeEnum.success) {
        this.$message.error(res.msg);
      }
    });
  }

  /**
   * 初始化表格配置
   */
  private initTableConfig(): void {
    this.tableConfig = {
      isDraggable: true,
      isLoading: false,
      showSearchSwitch: true,
      showSizeChanger: true,
      scroll: {x: '1600px', y: '600px'},
      noIndex: true,
      notShowPrint: true,
      columnConfig: [
        {
          title: '',
          type: 'render',
          key: 'selectedProgramId',
          renderTemplate: this.radioTemp,
          fixedStyle: {fixedLeft: true, style: {left: '0px'}},
          width: 42
        },
        // 序号
        {
          type: 'serial-number', width: 62, title: this.language.serialNumber
        },
        // 节目名称
        {
          title: this.languageTable.strategyList.programName, key: 'programName', width: 300, isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        // 节目用途
        {
          title: this.languageTable.strategyList.programPurpose, key: 'programPurpose', width: 300, isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        // 时长
        {
          title: this.languageTable.strategyList.duration, key: 'duration', width: 300, isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        // 分辨率
        {
          title: this.languageTable.strategyList.resolution, key: 'resolution', width: 300, isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        // 节目文件
        {
          title: this.languageTable.strategyList.programFileName,
          key: 'programFileName',
          width: 300,
          isShowSort: true,
          searchable: true,
          type: 'render',
          renderTemplate: this.programFileName,
          searchConfig: {type: 'input'},
        },
        // 操作
        {
          title: this.language.operate,
          searchable: true,
          searchConfig: {type: 'operate'},
          key: '',
          width: 150,
          fixedStyle: {fixedRight: true, style: {right: '0px'}}
        },
      ],
      showPagination: true,
      bordered: false,
      showSearch: false,
      searchReturnType: 'Array',
      topButtons: [],
      operation: [],
      leftBottomButtons: [],
      // 排序
      sort: (event: SortCondition) => {
        this.queryCondition.sortCondition.sortField = event.sortField;
        this.queryCondition.sortCondition.sortRule = event.sortRule;
        this.refreshData();
      },
      // 搜索
      handleSearch: (event: FilterCondition[]) => {
        this.queryCondition.pageCondition.pageNum = 1;
        this.queryCondition.filterConditions = event;
        this.refreshData();
      }
    };
  }

  /**
   * 滑块变化的时候触发的事件
   * @ param id
   */
  public handleChange(data): void {
    const params = {
      commandId: data.id,
      equipmentIds: [this.equipmentId],
      param: {}
    };
    if (data.id === ControlInstructEnum.setVolume) {
      this.volumeValue = data.value;
    }
    if (data.id === ControlInstructEnum.dimming) {
      this.lightValue = data.value;
    }
    params.param[data.paramId] = data.value;
    const instructConfig = new InstructConfig(this.$applicationService, this.$nzI18n, this.$message);
    instructConfig.instructDistribute(params);
  }

  /**
   * 选中的节目
   * @ param event
   * @ param item
   */
  public selectedProgramChange(event: string, item: ProgramListModel): void {
    this.selectedProgram = item;
  }

  /**
   * 下载视频
   * @ param item
   */
  public downloadProgram(item: ProgramListModel): void {
    const path = `${item.programPath}/${item.programFileName}`;
    const blob = new Blob([path], {type: RouterJumpConst.fileType});
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = item.programFileName;
    link.click();
    window.URL.revokeObjectURL(link.href);
  }

  /**
   * 设备控制里面的按钮集合
   */
  public getOperation(): void {
    const params = {
      equipmentModel: this.equipmentModel
    };
    this.$applicationService.getOperation(params).subscribe((res: ResultModel<any>) => {
      if (res.code === ResultCodeEnum.success) {
        if (res.data.operations && res.data.operations.length) {
          this.operationList = res.data.operations;
          this.sliderList = res.data.operations.filter(item => item.type === 'slider');
          this.programItem = res.data.operations.find(item => item.id === 'SET_PROGRAM');
          // 将按钮给上相应的权限码
          this.operationList.forEach(item => {
            Object.keys(this.programBroadcastPermissionModel).forEach(_item => {
              if (item.id === _item) {
                item.code = this.programBroadcastPermissionModel[_item];
              }
            });
          });
          this.operationEvent.emit(this.operationList);
        }
      } else {
        this.$message.error(res.msg);
      }
    });
  }

  /**
   * 是否显示节目
   * @ param event
   */
  public showProgram(data): void {
    // if (!data.disable) {
    //   this.isShowProgram = true;
    // }
    this.isShowProgram = true;
  }

  /**
   * 默认滑块的值
   */
  private sliderDefault(): void {
    if (this.sliderList && this.sliderList.length) {
      this.sliderList.forEach(item => {
        if (item.id === ControlInstructEnum.setVolume) {
          this.volumeValue = item.value;
        }
        if (item.id === ControlInstructEnum.dimming) {
          this.lightValue = item.value;
        }
      });
    }
  }

  /**
   *选择节目名称
   */
  public handleProgramOk(): void {
    if (this.selectedProgram.programName) {
      this.programName = this.selectedProgram.programName;
      this.sliderDefault();
      this.parameter();

    }
    this.isShowProgram = false;
  }

  /**
   * 取消节目
   */
  public handleProgramCancel(): void {
    this.isShowProgram = false;
  }

  /**
   * 判断播放类型
   * @ param data
   */
  private playType(data): PlayEnum {
    let type;
    if (data.programFileType === ImageEnum.picture) {
      type = PlayEnum.image;
    } else {
      type = data.programFileType;
    }
    return type;
  }

  /**
   * 节目参数
   */
  private parameter(): void {
    const {programPath, programSize, md5, duration, resolution, fastdfsAddr, mode, programId, programName} = this.selectedProgram;
    const widthH = resolution.includes('*') && resolution.split('*') || [];
    const width = widthH[0];
    const height = widthH[1];
    const current = CommonUtil.dateFmt(ApplicationFinalConst.dateTypeDay, new Date());
    const time = duration.match(/\d+/g)[0];
    this.programParams = {
      commandId: ControlInstructEnum.screenPlay,
      equipmentIds: [this.equipmentId],
      param: {
        volume: this.volumeValue,
        light: this.lightValue,
        periodType: StrategyStatusEnum.execType,
        dayTime: [
          {
            month: new Date().getMonth() + 1,
            monthDay: [new Date().getDate()]
          }
        ],
        startDate: current,
        endDate: current,
        fastdfsAddr: fastdfsAddr,
        totalSize: Number(programSize),
        playTimes: [
          {
            playStartTime: CurrentTimeConst.start,
            playEndTime: CurrentTimeConst.end
          },
        ],
        program: [{
          playType: 0,
          playOrder: 0,
          type: this.playType(this.selectedProgram),
          fileExt: mode,
          md5: md5,
          programPath: programPath,
          height: Number(width),
          width: Number(height),
          programId: programId,
          programName: programName,
          progSize: Number(programSize),
          timeSpan: Number(time) || 86400,
          speed: '',
          displayLeft: '',
          displayRight: ''
        }]
      }
    };
    // 设置播放时间 解决闪屏问题

     this.$applicationService.queryEquipmentCurrentPlayStrategy(this.equipmentId).subscribe((res: ResultModel<boolean>) => {
      if (res.code === ResultCodeEnum.success) {

        if (!res.data) {
          const endDate = new Date();
          endDate.setFullYear(new Date().getFullYear() + 100);
          this.programParams.param.endDate = CommonUtil.dateFmt(ApplicationFinalConst.dateTypeDay, endDate);
          this.programParams.param.periodType = StrategyStatusEnum.centralizedControl;
        }

        const instructConfig = new InstructConfig(this.$applicationService, this.$nzI18n, this.$message);
        instructConfig.instructDistribute(this.programParams);
        // 异步15s 后去请求获取当前节目
        setTimeout(() => {
          this.queryEquipmentCurrentPlayProgram(this.equipmentId);
        }, 15000);

      } else {
        this.$message.error(res.msg);
      }

    });

  }

  /**
   * 分页查询
   * @ param event
   */
  public pageChange(event: PageModel): void {
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
    this.refreshData();
  }

  /**
   * 刷新表格数据
   */
  private refreshData(): void {
    this.tableConfig.isLoading = true;
    const programStatusFlag = this.queryCondition.filterConditions.some(item => item.filterField === PolicyEnum.programStatus);
    if (!programStatusFlag) {
      const programStatus = new FilterCondition(PolicyEnum.programStatus, OperatorEnum.eq, StrategyStatusEnum.linkage);
      this.queryCondition.filterConditions.push(programStatus);
    }
    this.$applicationService.getReleaseContentList(this.queryCondition).subscribe((res: ResultModel<ProgramListModel[]>) => {
      this.tableConfig.isLoading = false;
      if (res.code === ResultCodeEnum.success) {
        const {totalCount, pageNum, size, data} = res;
        this.dataSet = data || [];
        this.pageBean.Total = totalCount;
        this.pageBean.pageIndex = pageNum;
        this.pageBean.pageSize = size;
      } else {
        this.$message.error(res.msg);
      }
    }, () => {
      this.tableConfig.isLoading = false;
    });
  }

  /**
   * webSocket消息监听
   */
  private wsMsgAccept(): void {
    if (!this.$wsService.subscibeMessage) {
      this.$wsService.connect();
    }
    this.timer = setTimeout(() => {
      this.programIdPath = 'true';
    }, 1000);
    this.$wsService.subscibeMessage.subscribe(msg => {
      const data = JSON.parse(msg.data);
      if (data.channelKey === 'screenPlayKey') {
        const equipmentData = data.msg;
        if (equipmentData && equipmentData.length) {
          const fastdfsAddr = equipmentData[0].fastdfsAddr;
          this.isVideo = equipmentData[0].programFileType === FileNameTypeEnum.video;
          const programPath = equipmentData[0].programPath.replace(/\\/g, '/');
          this.programIdPath = `${fastdfsAddr}/${programPath}`;
          this.programName = equipmentData[0].programName;
          clearTimeout(this.timer);
        }
      }
    });
  }
}
