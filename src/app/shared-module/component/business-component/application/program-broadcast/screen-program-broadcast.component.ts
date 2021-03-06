import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, TemplateRef, ViewChild} from '@angular/core';
import {ResultModel} from '../../../../model/result.model';
import {ResultCodeEnum} from '../../../../enum/result-code.enum';
import {FiLinkModalService} from '../../../../service/filink-modal/filink-modal.service';
import {NativeWebsocketImplService} from '../../../../../core-module/websocket/native-websocket-impl.service';
import {ApplicationInterface} from '../../../../../../assets/i18n/application/application.interface';
import {LanguageEnum} from '../../../../enum/language.enum';
import {NzI18nService} from 'ng-zorro-antd';
import {TableConfigModel} from '../../../../model/table-config.model';
import {PageModel} from '../../../../model/page.model';
import {FilterCondition, QueryConditionModel, SortCondition} from '../../../../model/query-condition.model';
import {PolicyEnum, StrategyStatusEnum} from '../../../../../business-module/application-system/share/enum/policy.enum';
import {OperatorEnum} from '../../../../enum/operator.enum';
import {ProgramListModel} from '../../../../../business-module/application-system/share/model/policy.control.model';
import {ApplicationService} from '../../../../../business-module/application-system/share/service/application.service';
import {CommonUtil} from '../../../../util/common-util';
import {ApplicationFinalConst} from '../../../../../business-module/application-system/share/const/application-system.const';
import {DistributeModel} from '../../../../../business-module/application-system/share/model/distribute.model';
import {InstructConfig} from '../../../../../business-module/application-system/share/config/instruct.config';
import {FileNameTypeEnum, ImageEnum, PlayEnum, ProgramTypeEnum} from '../../../../../business-module/application-system/share/enum/program.enum';
import {CurrentTimeConst} from '../../../../../business-module/application-system/share/const/program.const';
import {OnlineLanguageInterface} from '../../../../../../assets/i18n/online/online-language.interface';
import {ProgramBroadcastPermissionModel} from '../../../../../core-module/model/program-broadcast-permission.model';
import {ControlInstructEnum} from '../../../../../core-module/enum/instruct/control-instruct.enum';
import {ApplicationSystemForCommonService} from '../../../../../core-module/api-service/application-system';
import {SessionUtil} from '../../../../util/session-util';
import {Download} from '../../../../util/download';

@Component({
  selector: 'screen-program-broadcast',
  templateUrl: './screen-program-broadcast.component.html',
  styleUrls: ['./screen-program-broadcast.component.scss']
})
export class ScreenProgramBroadcastComponent implements OnInit, OnChanges {
  // ?????????
  @Input() public lightValue: number = 0;
  // ?????????
  @Input() public volumeValue: number = 0;
  /**
   * ?????????????????? ??????any??????????????????????????????????????????=
   */
  @Input() operatePermissionEnum: any;
  /**
   * ??????id
   */
  @Input() public equipmentId: string = '';
  @Input() public sliderShow: boolean = false;
  @Input() public equipmentModel: string = '';
  @Output() public operationEvent = new EventEmitter();
  // ????????????
  @ViewChild('radioTemp') radioTemp: TemplateRef<any>;
  // ????????????
  @ViewChild('programFileName') programFileName: TemplateRef<any>;
  /**
   * ????????????
   */
  public programIdPath: string = '';
  // ????????????
  public programName: string = '';
  // ????????????
  public isShowProgram: boolean = false;
  // ???????????????
  public isVideo: boolean = true;
  // ???????????????id
  public selectedProgramId: string;
  // ????????????
  public pageBean: PageModel = new PageModel();
  // ????????????
  public dataSet: ProgramListModel[] = [];
  public operationList = [];
  public sliderList = [];
  public programItem = {};
  // ?????????????????????
  public programPreview: boolean;
  // ?????????????????????
  public isSetProgram: boolean;
  // ????????????
  public tableConfig: TableConfigModel;
  // ???????????????
  public selectedProgram: ProgramListModel = new ProgramListModel();
  // ????????????
  public queryCondition: QueryConditionModel = new QueryConditionModel();
  // ???????????????
  public language: OnlineLanguageInterface;
  // ?????????????????????
  public languageTable: ApplicationInterface;
  /**
   * ?????????????????????
   */
  public programBroadcastPermissionModel: ProgramBroadcastPermissionModel = new ProgramBroadcastPermissionModel();
  private timer = null;
  private programParams: DistributeModel;

  constructor(
    // ??????
    private $message: FiLinkModalService,
    // ???????????????
    private $nzI18n: NzI18nService,
    // ????????????
    private $applicationService: ApplicationService,
    private $wsService: NativeWebsocketImplService,
    // ????????????
    private $applicationCommonService: ApplicationSystemForCommonService,
    private $download: Download
  ) {
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.online);
    this.languageTable = this.$nzI18n.getLocaleData(LanguageEnum.application);
  }

  ngOnInit(): void {
    if (this.operatePermissionEnum) {
      // ??????????????????????????????
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
  ngOnChanges(changes: SimpleChanges) {
    // ?????????????????????????????????????????????
    if (changes && changes.lightValue) {
      this.sliderList.forEach(item => {
        if (item.id === ControlInstructEnum.dimming) {
          item.value = this.lightValue;
        }
      });
    }
    if (changes && changes.volumeValue) {
      this.sliderList.forEach(item => {
        if (item.id === ControlInstructEnum.setVolume) {
          item.value = this.volumeValue;
        }
      });
    }
  }
  /**
   * ???????????????
   * @ param event
   * @ param item
   */
  public selectedProgramChange(event: string, item: ProgramListModel): void {
    this.selectedProgram = item;
  }


  /**
   * ?????????????????????????????????
   */
  public getOperation(): void {
    const params = {
      equipmentId: this.equipmentId
    };
    this.$applicationService.getOperation(params).subscribe((res: ResultModel<any>) => {
      if (res.code === ResultCodeEnum.success) {
        if (res.data.operations && res.data.operations.length) {
          this.operationList = res.data.operations;
          this.sliderList = res.data.operations.filter(item => item.type === 'slider');
          this.programItem = res.data.operations.find(item => item.id === 'SET_PROGRAM');
          this.isSetProgram = !!res.data.operations.find(item => item.id === 'SET_PROGRAM');
          this.programPreview = !!res.data.operations.find(item => item.id === 'PROGRAM_PREVIEW');
          // ?????????????????????????????????
          this.operationList.forEach(item => {
            Object.keys(this.programBroadcastPermissionModel).forEach(_item => {
              if (item.id === _item) {
                item.code = this.programBroadcastPermissionModel[_item];
              }
            });
          });
          this.operationEvent.emit(this.operationList);
          this.sliderList.forEach(item => item.disable = !SessionUtil.checkHasRole(item.code));
        }
      } else {
        this.$message.error(res.msg);
      }
    });
  }

  /**
   * ??????????????????
   * @ param event
   */
  public showProgram(data): void {
    if (!data.disable) {
      this.isShowProgram = true;
    }
  }

  /**
   * ????????????
   * @ param event
   */
  public pageChange(event: PageModel): void {
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
    this.refreshData();
  }

  /**
   * ????????????ID ???????????????????????????????????????
   */
  private queryEquipmentCurrentPlayProgram(id): void {
    this.$applicationCommonService.queryEquipmentCurrentPlayProgram(id).subscribe((res: ResultModel<any>) => {
      if (res.code !== ResultCodeEnum.success) {
        this.$message.error(res.msg);
      }
    });
  }

  /**
   * ?????????????????????
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
        // ??????
        {
          type: 'serial-number', width: 62, title: this.language.serialNumber
        },
        // ????????????
        {
          title: this.languageTable.strategyList.programName, key: 'programName', width: 300, isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        // ????????????
        {
          title: this.languageTable.strategyList.programPurpose, key: 'programPurpose', width: 300, isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        // ??????
        {
          title: this.languageTable.strategyList.duration, key: 'duration', width: 300, isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        // ?????????
        {
          title: this.languageTable.strategyList.resolution, key: 'resolution', width: 300, isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        // ????????????
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
        // ??????
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
      // ??????
      sort: (event: SortCondition) => {
        this.queryCondition.sortCondition.sortField = event.sortField;
        this.queryCondition.sortCondition.sortRule = event.sortRule;
        this.refreshData();
      },
      // ??????
      handleSearch: (event: FilterCondition[]) => {
        this.queryCondition.pageCondition.pageNum = 1;
        this.queryCondition.filterConditions = event;
        this.refreshData();
      }
    };
  }

  /**
   * ????????????????????????????????????
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
   * ????????????
   * @ param item
   */
  public downloadProgram(item: ProgramListModel): void {
    this.$download.downloadFile(item.programPath, item.programFileName);
  }

  /**
   * ??????????????????
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
   *??????????????????
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
   * ????????????
   */
  public handleProgramCancel(): void {
    this.isShowProgram = false;
  }

  /**
   * ??????????????????
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
   * ????????????
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
    // ?????????????????? ??????????????????

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
        // ??????15s ??????????????????????????????
        setTimeout(() => {
          this.queryEquipmentCurrentPlayProgram(this.equipmentId);
        }, 15000);

      } else {
        this.$message.error(res.msg);
      }

    });

  }

  /**
   * ??????????????????
   */
  private refreshData(): void {
    this.tableConfig.isLoading = true;
    const programStatusFlag = this.queryCondition.filterConditions.some(item => item.filterField === PolicyEnum.programStatus);
    if (!programStatusFlag) {
      const programStatus = new FilterCondition(PolicyEnum.programStatus, OperatorEnum.eq, StrategyStatusEnum.linkage);
      this.queryCondition.filterConditions.push(programStatus);
    }
    let hasProgramTypeFilter = false;
    this.queryCondition.filterConditions.forEach(item => {
      if (item.filterField === PolicyEnum.programType) {
        hasProgramTypeFilter = true;
      }
    });
    if (!hasProgramTypeFilter) {
      const programType = new FilterCondition(PolicyEnum.programType, OperatorEnum.eq, ProgramTypeEnum.info);
      this.queryCondition.filterConditions.push(programType);
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
   * webSocket????????????
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
          console.log(this.programIdPath);
          this.programName = equipmentData[0].programName;
          clearTimeout(this.timer);
        }
      }
    });
  }
}
