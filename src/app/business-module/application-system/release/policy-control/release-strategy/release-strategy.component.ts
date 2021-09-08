import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import {PageModel} from '../../../../../shared-module/model/page.model';
import {OnlineLanguageInterface} from '../../../../../../assets/i18n/online/online-language.interface';
import {NzI18nService, NzModalService} from 'ng-zorro-antd';
import {QueryConditionModel} from '../../../../../shared-module/model/query-condition.model';
import {ApplicationService} from '../../../share/service/application.service';
import {FiLinkModalService} from '../../../../../shared-module/service/filink-modal/filink-modal.service';
import {ApplicationInterface} from '../../../../../../assets/i18n/application/application.interface';
import {SliderValueConst} from '../../../share/const/slider.const';
import {InstructInfoModel, ProgramListModel, SelectedProgramModel, StrategyListModel, StrategyPlayPeriodRefListModel} from '../../../share/model/policy.control.model';
import {LanguageEnum} from '../../../../../shared-module/enum/language.enum';
import {ExecStatusConst} from '../../../share/const/application-system.const';
import {CommonLanguageInterface} from '../../../../../../assets/i18n/common/common.language.interface';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-release-strategy',
  templateUrl: './release-strategy.component.html',
  styleUrls: ['./release-strategy.component.scss']
})
export class ReleaseStrategyComponent implements OnInit {
  // 展示时长
  public showTime: number;
  // 循环模式
  public instructInfo: InstructInfoModel = new InstructInfoModel();
  // 节目列表
  public dataSet: ProgramListModel[] = [];
  // 分页实体
  public pageBean: PageModel = new PageModel();
  // 滑块值的常量
  public sliderValue = SliderValueConst;
  // 常量
  public execStatus = ExecStatusConst;
  // 多语言配置
  public language: OnlineLanguageInterface;
  // 设备列表多语言
  public languageTable: ApplicationInterface;
  /** 公共国际化*/
  public commonLanguage: CommonLanguageInterface;
  // 分页条件
  public queryCondition: QueryConditionModel = new QueryConditionModel();
  // 选中的节目
  public selectedProgram = {id: '', name: ''};
  // 播放时段集合
  public strategyPlayPeriodRefList: StrategyPlayPeriodRefListModel[] = [];
  // 节目集合
  public strategyProgRelationList: SelectedProgramModel[] = [];
  // 播放时段显示
  public isShowPattern: boolean = false;
  // 是否添加节目
  public isAddProgram: boolean = false;
  // 节目显示
  public isShowProgram: boolean = false;
  @Input()
  public stepsFirstParams: StrategyListModel = new StrategyListModel();
  @Output()
  strategyDetailValidChange = new EventEmitter<boolean>();
  constructor(
    // 多语言配置
    public $nzI18n: NzI18nService,
    // 错误提示框
    private $message: FiLinkModalService,
    // 接口请求服务
    public $applicationService: ApplicationService,
    // 路由
    public $router: Router,
    private $modalService: NzModalService
  ) {
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.online);
    // 表格多语言配置
    this.languageTable = this.$nzI18n.getLocaleData(LanguageEnum.application);
    this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
  }

  /**
   * 初始化
   */
  public ngOnInit(): void {
    // 获取数据
    Promise.resolve().then(() => {
      this.strategyDetailValid();
    });
  }

  /**
   * 选择时间
   * @ param result
   */
  public installSelectDate(timeList: number[]): void {
    if (this.timeRangeIsValid(timeList)) {
      this.stepsFirstParams.strategyPlayPeriodRefList.push({
        playStartTime: timeList[0],
        playEndTime: timeList[1],
        showTimePicker: false
      });
      this.isShowPattern = false;
      this.strategyDetailValid();
    } else {
      this.$message.warning(this.languageTable.strategyList.timePeriodCrossingErrTip);
    }
  }

  /**
   * 编辑时间
   * param timeList
   * param data
   */
  public editTimeRange(timeList: number[], data: StrategyPlayPeriodRefListModel, currentIndex: number) {
    if (this.timeRangeIsValid(timeList, currentIndex)) {
      data.playStartTime = timeList[0];
      data.playEndTime = timeList[1];
      data.showTimePicker = false;
    } else {
      this.$message.warning(this.languageTable.strategyList.timePeriodCrossingErrTip);
    }
  }

  /**
   * 删除指定的播放时段
   * @ param index 索引
   */
  public handleDeletePlay(index: number): void {
    this.stepsFirstParams.strategyPlayPeriodRefList.splice(index, 1);
    this.strategyDetailValid();
  }

  /**
   * 点击添加节目
   */
  public handleAddProgram(): void {
    this.isAddProgram = true;
    this.selectedProgram = {name: '', id: ''};
    this.showTime = null;
  }

  /**
   * 添加节目
   */
  public handleSave(): void {
    if (!this.selectedProgram.name) {
      this.$message.warning(`${this.languageTable.strategyList.pleaseSelectProgram}!`);
      return;
    }
    if (!this.showTime) {
      this.$message.warning(`${this.languageTable.strategyList.pleaseInputShowTime}!`);
      return;
    }
    const flag = this.stepsFirstParams.strategyProgRelationList.some(value => value.programId === this.selectedProgram.id);
    if (flag) {
      this.$message.error(this.languageTable.contentList.repeatProgram);
      return;
    }
    this.isAddProgram = false;
    const programNameArr = {
      programId: this.selectedProgram.id,
      programName: this.selectedProgram.name,
      playTime: this.showTime
    };
    this.stepsFirstParams.strategyProgRelationList = this.stepsFirstParams.strategyProgRelationList.concat([programNameArr]);
    this.strategyDetailValid();
  }

  /**
   * 添加时段
   */
  public handleAddPlay(): void {
    this.isShowPattern = true;
  }

  /**
   *选择节目名称
   */
  public handleProgramOk(selectedProgram): void {
    this.selectedProgram = {id: selectedProgram.id, name: selectedProgram.name};
    this.isShowProgram = false;
  }

  /**
   * 点击节目列表的删除按钮事件
   * param data
   */
  public confirmDelProgram(data: SelectedProgramModel) {
    this.$modalService.confirm({
      nzTitle: this.languageTable.strategyList.equipmentTip,
      nzContent: this.languageTable.strategyList.confirmDelete,
      nzOkText: this.commonLanguage.cancel,
      nzOkType: 'danger',
      nzMaskClosable: false,
      nzOnOk: () => {},
      nzKeyboard: false,
      nzCancelText: this.commonLanguage.okText,
      nzOnCancel: () => {this.handleDeleteProgram(data); }
    });
  }

  /**
   * 删除选中的节目
   * @ param index 节目序号
   */
  public handleDeleteProgram(delData: SelectedProgramModel) {
    const idx = this.stepsFirstParams.strategyProgRelationList.findIndex(item => item.programId === delData.programId);
    this.stepsFirstParams.strategyProgRelationList.splice(idx, 1);
    this.stepsFirstParams.strategyProgRelationList = this.stepsFirstParams.strategyProgRelationList.concat([]);
    this.strategyDetailValid();
  }

  /**
   * 表单验证校验
   */
  public strategyDetailValid(): void {
    let valid = false;
    if (this.stepsFirstParams.strategyPlayPeriodRefList.length &&
      this.stepsFirstParams.strategyProgRelationList.length
    ) {
      valid = true;
    } else {
      valid = false;
    }
    this.strategyDetailValidChange.emit(valid);
  }

  /**
   * 表格拖拽排序
   * param event
   */
  drop(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.stepsFirstParams.strategyProgRelationList, event.previousIndex, event.currentIndex);
  }

  /**
   * 时间段重复校验
   */
  private timeRangeIsValid(currentTimeRange: number[], currentIndex = -1) {
    const currentStart = currentTimeRange[0];
    const currentEnd = currentTimeRange[1];
    // 查找是否有重复的时间段 flag有值，则表示有重复的时间段
    const flag = this.stepsFirstParams.strategyPlayPeriodRefList.find((item, idx) => {
      // 当是编辑时间时，排除对当条时间的比较
      if (currentIndex !== idx) {
        const start = item.playStartTime;
        const end = item.playEndTime;
        return (start >= currentStart && start < currentEnd) || (end > currentStart && end <= currentEnd);
      }
    });
    return !flag;
  }
}
