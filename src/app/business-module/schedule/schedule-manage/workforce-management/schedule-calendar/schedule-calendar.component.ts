import {AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {NzCalendarComponent, NzI18nService} from 'ng-zorro-antd';
import * as _ from 'lodash';
import {CommonLanguageInterface} from '../../../../../../assets/i18n/common/common.language.interface';
import {LanguageEnum} from '../../../../../shared-module/enum/language.enum';
import {CommonUtil} from '../../../../../shared-module/util/common-util';
import {TableComponent} from '../../../../../shared-module/component/table/table.component';
import {ScheduleLanguageInterface} from '../../../../../../assets/i18n/schedule/schedule.language.interface';
import {differenceInCalendarDays, setMonth, setYear} from 'date-fns';
import {ScheduleApiService} from '../../../share/service/schedule-api.service';
import {FiLinkModalService} from '../../../../../shared-module/service/filink-modal/filink-modal.service';
import {ResultCodeEnum} from '../../../../../shared-module/enum/result-code.enum';
import {OperateTypeEnum} from '../../../../../shared-module/enum/page-operate-type.enum';
import {ActivatedRoute} from '@angular/router';
import {PersonInfoModel} from '../../../share/model/person-info.model';
import {JobStatusEnum} from '../../../share/enum/job-status.enum';

/**
 * 排班日历
 */
@Component({
  selector: 'app-schedule-calendar',
  templateUrl: './schedule-calendar.component.html',
  styleUrls: ['./schedule-calendar.component.scss']
})
export class ScheduleCalendarComponent implements OnInit, AfterViewInit, OnDestroy {
  // 是否展示人员搜索输入框
  @Input() isShowSearch = false;
  // 是否展示自动排班按钮 && 是否可以自动排班和手动排班，为false时 只能查看排班，不能手动或自动排班
  @Input() isShowAutoScheduleBtn = false;
  // 传入的要排班的开始日期和结束日期
  @Input() dateRange: string[] = [];
  // 排班的人员数据
  @Input() scheduleMemberDataList =  [];
  // 备份编辑时当前排班人员的原始数据，便于日期修改又还原后能展示初始数据（因为编辑时当前排班人员数据只会查询一次）
  @Input() scheduleMemberDataListBackup = [];
  // 已经排班的日期
  @Input() scheduledDateList: string[] = [];
  // 选择的班组名称id集合，根据该字段获取成员列表以及自动排班
  @Input() teamIdList: string[] = [];
  // 页面类型
  @Input() pageType: OperateTypeEnum;
  // 编辑页面判断是否需要查询自动排班信息
  @Input() isQueryAutoScheduling: boolean = true;
  // 手动排班时，需要校验排班人员是否在这一天已经有排班
  @Input() querySchedulingParams;
  // 编辑时备份当前已排班的数据
  @Input() public updateScheduleDataBackup = [];
  // 查看排班的表格和日历的切换
  @Output() switchTableAndCalender = new EventEmitter();
  // 排班的人员数据
  @Output() scheduleMemberDataListChange = new EventEmitter();
  // 备份当前排班的人员数据
  @Output() scheduleMemberDataListBackupChange = new EventEmitter();
  // 备份当前排班的数据
  @Output() updateScheduleDataBackupChange = new EventEmitter();
  // 已经排班的日期
  @Output() scheduledDateListChange = new EventEmitter();
  // 第二步中的下一步是否可以点击
  @Output() nextValid = new EventEmitter();
  // 班组成员表格选择器
  @ViewChild('teamTableComponent') teamTableComponent: TableComponent;
  // 日历选择器
  @ViewChild('calendarComponent') calendarComponent: NzCalendarComponent;
  // 公共国际化
  public commonLanguage: CommonLanguageInterface;
  // 排班管理国际化
  public scheduleLanguage: ScheduleLanguageInterface;
  // 当前选中的日期
  public selectDate: Date = null;
  // 搜索人员时选中的人员所排班的日期
  public searchMemberDate = [];
  // 搜索人员姓名的值
  public memberValue: string = '';
  // 是否展示班组选择器弹框
  public isShowPersonModal: boolean = false;
  // 选择的班组成员信息集合
  public selectMemberList = [];
  // 判断是否可以自动排班
  private isAutoScheduling: boolean = true;
  // 查询排班日历的查询年份
  private queryYear: number = new Date().getFullYear();
  // 查询排班日历的查询月份
  private queryMonth: number = new Date().getMonth() + 1;
  // 当前日期的时间是否小于班次时间
  private isHistoryScheduleTime = false;

  constructor(private $nzI18n: NzI18nService,
              private $scheduleService: ScheduleApiService,
              private $active: ActivatedRoute,
              private $message: FiLinkModalService) {}

  /**
   * 初始化
   */
  public ngOnInit(): void {
    this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
    this.scheduleLanguage = this.$nzI18n.getLocaleData(LanguageEnum.schedule);
    if (this.dateRange && this.dateRange.length) {
      this.selectDate = new Date(this.dateRange[0]);
      this.queryYear = this.selectDate.getFullYear();
      this.queryMonth = this.selectDate.getMonth() + 1;
      // 将时间段范围跟当前日期做比较，方便后续每个日期格disable值的校验以及是否可以自动排班的校验
      if (differenceInCalendarDays(new Date(this.dateRange[0]), new Date()) < 0) {
        this.dateRange[0] = CommonUtil.dateFmt('yyyy-MM-dd', new Date());
        if (this.dateRange[1] && differenceInCalendarDays(new Date(this.dateRange[1]), new Date()) < 0) {
          this.dateRange[1] = CommonUtil.dateFmt('yyyy-MM-dd', new Date());
          this.isAutoScheduling = false;
        }
      }
    }
    if (this.querySchedulingParams && this.querySchedulingParams.shiftEndTime) {
      const endTimeSplit = this.querySchedulingParams.shiftEndTime.split(':');
      const endHour = endTimeSplit[0];
      const endMinute = endTimeSplit[1];
      this.isHistoryScheduleTime = Number(endHour) < new Date().getHours() || (Number(endHour) === new Date().getHours() && Number(endMinute) <= new Date().getMinutes());
    }
    if ([OperateTypeEnum.update, OperateTypeEnum.view].includes(this.pageType)) {
      if (this.isQueryAutoScheduling && !(this.scheduleMemberDataList && this.scheduleMemberDataList.length)) {
        this.querySchedulingData();
      } else if (this.scheduleMemberDataList && this.scheduleMemberDataList.length) {
        // 如果当前排班人员的数据不为空时，根据原始的排班人员数据进行处理，使日期修改又还原后能展示初始数据
        // 情况包含排班人员的时间小于等于当前时间（相当于是历史排班） 或者 排班人员的时间在开始时间和结束时间之间才在日历格中展示当前排班的人员名
        this.handleScheduleData();
        // 将改变后的排班人员数据传给父组件
        this.scheduleMemberDataListChange.emit(this.scheduleMemberDataList);
      }
    } else {
      // 新增时，排班之后返回第一步修改数据后，对下一步日历当中的数据做处理
      this.handleAddScheduleData();
    }
    // 根据当前是否有排班人员数据来控制下一步按钮的点击
    this.nextValid.emit(!(this.scheduleMemberDataList && this.scheduleMemberDataList.length));
  }

  public ngAfterViewInit(): void {
    if (this.pageType === OperateTypeEnum.view) {
      // 重写日历组件中的年份和月份变化的方法
      this.calendarComponent.onMonthSelect = (month) => {
        this.queryMonth = month + 1;
        this.querySchedulingData();
        this.onMonthSelectBackup(month);
      };

      this.calendarComponent.onYearSelect = (year) => {
        this.queryYear = year;
        this.querySchedulingData();
        this.onYearSelectBackup(year);
      };
    }
  }

  /**
   * 销毁
   */
  public ngOnDestroy(): void {
    this.calendarComponent = null;
  }
  /**
   * 人员搜索事件
   */
  public memberSearch(): void {
    // 根据输入的人员名称 高亮含有该人员的日期格
    if (this.memberValue && this.scheduleMemberDataList.length) {
      this.searchMemberDate = this.scheduleMemberDataList.filter(item => item.personName.includes(this.memberValue)).map(item => item.scheduleDate);
      if (this.searchMemberDate.length) {
        this.selectDate = new Date(this.searchMemberDate[0]);
      } else {
        this.$message.info(this.scheduleLanguage.scheduleSearchPeopleTip);
        this.selectDate = new Date(this.dateRange[0]);
      }
    } else {
      this.searchMemberDate = [];
    }
    if (this.memberValue && !this.scheduleMemberDataList.length) {
      this.$message.info(this.scheduleLanguage.noSearchPersonTip);
    }
  }

  /**
   * 判断是否为选中的日期，是则添加选中后的样式
   * param currentDate
   */
  public isSelectDate(currentDate: Date): boolean {
    return this.searchMemberDate.some(item => item === CommonUtil.dateFmt('yyyy-MM-dd', currentDate));
  }

  /**
   * 日期格是否置灰
   * 在当前日期之前的置灰
   * 不在选择的排班日期前后的时间置灰
   * param date
   */
  public isDisable(date: Date): boolean {
    // 没有自动排班按钮时，即也没有手动排班，即都是展示查看排班情况的日历，不需要将日历格置灰
    if (!this.isShowAutoScheduleBtn) {
      return false;
    }
    // 当不能自动排班时，即此时的开始日期和结束日期都比当前日期小，即可直接返回true
    if (!this.isAutoScheduling) {
      return true;
    }
    if (this.dateRange && this.dateRange.length) {
      // 比较当前时间与班次结束时间，如果当前时间在班次结束时间之后则将该单元格置灰
      const endTimeSplit = this.querySchedulingParams.shiftEndTime.split(':');
      const endHour = endTimeSplit[0];
      const endMinute = endTimeSplit[1];
      let flag = false;
      if (differenceInCalendarDays(date, new Date()) === 0) {
        flag = Number(endHour) < new Date().getHours() || (Number(endHour) === new Date().getHours() && Number(endMinute) <= new Date().getMinutes());
      }
      return differenceInCalendarDays(date, new Date(this.dateRange[0])) < 0
        || differenceInCalendarDays(date, new Date(this.dateRange[1])) > 0
        || flag
    }
  }

  /**
   * 点击日期格子事件
   * param date
   */
  public dateCellClick(date: Date): void {
    this.selectDate = date;
    // 查看排班管理日历，点击日期格判断是否是当月的日期，不是当月的日期，则需调用查看排班的接口
    if (this.pageType === OperateTypeEnum.view) {
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      if (month !== this.queryMonth || year !== this.queryYear) {
        this.queryMonth = month;
        this.querySchedulingData();
        this.calendarComponent['updateDate'](date);
        this.calendarComponent.nzSelectChange.emit(date);
      }
      return;
    }
    // 置灰的日期格子不能点击
    if (!this.isShowAutoScheduleBtn || this.isDisable(date)) {
      return;
    }
    // 找到当前日期格子排班的人员，在班组成员列表中回显
    this.selectMemberList = this.scheduleMemberDataList.filter(item => item.scheduleDate === CommonUtil.dateFmt('yyyy-MM-dd', this.selectDate))
      .map(item => Object.assign(item, {id: item.personId}));
    this.isShowPersonModal = true;
  }

  /**
   * 自动排班事件
   */
  public autoSchedule(): void {
    if (!this.isAutoScheduling) {
      this.$message.info(this.scheduleLanguage.autoSchedulingTip);
      return;
    }
    const queryParams = {
      startDate: this.dateRange[0],
      endDate: this.dateRange[1],
      teamIdList: this.teamIdList,
      shiftId: this.querySchedulingParams.shiftId
    };
    // 编辑时，点击自动排班需要传给后台当前排班的id
    if (this.pageType === OperateTypeEnum.update) {
      queryParams['id'] = this.querySchedulingParams.scheduleId;
    }
    this.$scheduleService.autoScheduleInfo(queryParams).subscribe(res => {
      if (res.code === ResultCodeEnum.success) {
        // 编辑时，进行自动排班操作，需要保留已排班数据的日期，以便后续对已排班数据的处理
        if (this.updateScheduleDataBackup.length) {
          this.updateScheduleDataBackup.forEach(item => {
            this.scheduledDateList.push(item.startDate)
          });
        }
        this.handleSchedulePersonData(res.data || []);
        this.$message.success(this.scheduleLanguage.autoScheduleSuccess);
      } else {
        this.$message.error(res.msg);
      }
    });
  }

  /**
   * 选择班组成员确定事件
   */
  public handlePersonOk(members: PersonInfoModel[]): void {
    // 离职人员不能排班
    if (members.some(item => item.onJobStatus === JobStatusEnum.resign)) {
      this.$message.info(this.scheduleLanguage.cannotSelectResignPerson);
      return;
    }
    const selectDateStr = CommonUtil.dateFmt('yyyy-MM-dd', this.selectDate);
    this.checkManualSchedulePerson(members, selectDateStr).then(res => {
      this.scheduledDateListChange.emit(this.scheduledDateList);
      // 替换当前日期的成员为此时选择的成员
      this.scheduleMemberDataList = this.scheduleMemberDataList.filter(item => item.scheduleDate !== selectDateStr);
      this.scheduleMemberDataList.push(...res);
      this.scheduleMemberDataListBackup = _.cloneDeep(this.scheduleMemberDataList);
      this.scheduleMemberDataListBackupChange.emit(this.scheduleMemberDataListBackup);
      this.scheduleMemberDataListChange.emit(this.scheduleMemberDataList);
      this.isShowPersonModal = false;
      // 根据当前是否有排班人员数据来控制下一步按钮的点击
      this.nextValid.emit(!(this.scheduleMemberDataList && this.scheduleMemberDataList.length));
    });
  }

  /**
   * 在对应的日期格中展示对应的排班人员
   * param currentDate
   * param memberScheduleDate
   */
  public isShowMember(currentDate: Date, memberScheduleDate: string | Date): boolean {
    const dateTemp = memberScheduleDate instanceof Date ? CommonUtil.dateFmt('yyyy-MM-dd', memberScheduleDate) : memberScheduleDate;
    return CommonUtil.dateFmt('yyyy-MM-dd', currentDate) === dateTemp;
  }
  /**
   * 新增时，排班之后返回第一步修改数据后，对下一步日历当中的数据做处理
   */
  public handleAddScheduleData(): void{
    // 新增时,若已经排班但是返回上一步进行时间或班次的修改，则会进行时间上的判断，对之前排班的数据进行处理
    if (this.scheduleMemberDataList && this.scheduleMemberDataList.length) {
      this.scheduleMemberDataList = this.scheduleMemberDataList.filter(item => {
        const isTimeRange = differenceInCalendarDays(new Date(item.scheduleDate), new Date(this.dateRange[0])) >= 0
          && differenceInCalendarDays(new Date(item.scheduleDate), new Date(this.dateRange[1])) <= 0;
        // 如果修改了开始日期或结束日期，判断之前的排班数据是否在范围内，若在则保留，否则清空
        if (isTimeRange) {
          // 如果当前排班日历的日期就是今天的日期，需要判断班次的结束时间是否大于当前时间，若大于则保留当前日期的排班数据，否则清空
          if (differenceInCalendarDays(new Date(item.scheduleDate), new Date()) === 0) {
            return !this.isHistoryScheduleTime;
          } else {
            return true;
          }
        } else {
          return false;
        }
      });
      // 将改变后的排班人员数据传给父组件
      this.scheduleMemberDataListChange.emit(this.scheduleMemberDataList);
    }
  }

  /**
   * 对已经排好的数据进行处理，判断数据是否清空或保留
   */
  private handleScheduleData(): void {
    this.scheduleMemberDataList = this.scheduleMemberDataListBackup.filter(item => {
      const isTimeRange = differenceInCalendarDays(new Date(item.scheduleDate), new Date(this.dateRange[0])) >= 0
        && differenceInCalendarDays(new Date(item.scheduleDate), new Date(this.dateRange[1])) <= 0;
      if (differenceInCalendarDays(new Date(item.scheduleDate), new Date()) < 0) {
        // 如果是历史排班数据保留，不可编辑
        return true;
        // 如果与当前日期一样，需要判断当前时分与班次时分的大小
      } else if(differenceInCalendarDays(new Date(item.scheduleDate), new Date()) === 0) {
        // 如果班次时间大于当前时分（当前算做未来数据），在排班日期范围内保留可编辑，否则清空不可编辑
        if (!this.isHistoryScheduleTime) {
          return isTimeRange;
          // 如果班次时间小于当前时分（当前算做历史数据），数据直接清空且不可编辑
        } else return false;
      } else {
        // 如果是未来排班数据，在时间范围内的则保留可编辑，否则清空不可编辑
        return isTimeRange;
      }
    });
  }
  /**
   * 校验选择的排班人员与其他排班是否在当前日期中有冲突
   */
  private checkManualSchedulePerson(members: any[], selectDateStr: string): Promise<Array<PersonInfoModel>> {
    return new Promise((resolve, reject) => {
      if (members.length) {
        members = members.map(item => {
          // 给选中的成员加上当前日期
          return Object.assign({},
            {personId: item.id, personName: item.personName, teamId: item.teamId, scheduleDate: selectDateStr, startDate: selectDateStr, shiftId: this.querySchedulingParams.shiftId});
        });
        const params = Object.assign({}, this.querySchedulingParams, {saveSchedulingPersonDTOList: members});
        this.$scheduleService.checkManualScheduleSave(params).subscribe(res => {
          if (res.code === ResultCodeEnum.success) {
            if (!res.data) {
              this.$message.confirm(this.scheduleLanguage.selectSchedulePersonTip, () => {
                // 将已排班的日期加入到数组中并去重
                this.scheduledDateList.push(selectDateStr);
                this.scheduledDateList = Array.from(new Set(this.scheduledDateList));
                resolve(members);
              });
            } else {
              // 将已排班的日期加入到数组中并去重
              this.scheduledDateList.push(selectDateStr);
              this.scheduledDateList = Array.from(new Set(this.scheduledDateList));
              resolve(members);
            }
          } else if (res.code === ResultCodeEnum.cannotSelectResignPerson) {
            // 有离职人员时不能排班 (后台校验，针对编辑页面回显时，此时拿不到人员的在职状态，需要通过后端校验)
            this.$message.info(this.scheduleLanguage.cannotSelectResignPerson);
          } else {
            this.$message.error(res.msg);
          }
        });
      } else {
        // 未选择成员时则删除已加入到数组中的该日期
        this.scheduledDateList = this.scheduledDateList.filter(item => item !== selectDateStr);
        resolve(members);
      }
    });
  }

  /**
   * 根据年月查询排班人员信息
   * param queryYear
   * param queryMonth
   */
  private querySchedulingData(): void {
    this.scheduleMemberDataList = [];
    // 获取查看排班的id集合
    let schedulingIdList = this.$active.snapshot.queryParams.id;
    schedulingIdList = schedulingIdList instanceof Array ? schedulingIdList : [schedulingIdList];
    const params = {schedulingIdList};
    // 查看排班的日历页面 需根据年份和月份查询排班情况，而不是一次查询出所有的排班
    if (this.pageType === OperateTypeEnum.view) {
      Object.assign(params, {queryYear: this.queryYear, queryMonth: this.queryMonth});
    }
    this.$scheduleService.schedulingPersonCalendar(params).subscribe(res => {
      if (res.code === ResultCodeEnum.success) {
        this.updateScheduleDataBackup = res.data || [];
        this.updateScheduleDataBackupChange.emit(this.updateScheduleDataBackup);
        this.handleSchedulePersonData(res.data || []);
      } else {
        this.$message.error(res.msg);
      }
    });
  }

  /**
   * 处理排班人员数据
   * param data
   */
  private handleSchedulePersonData(data: any): void {
    if (this.pageType === OperateTypeEnum.view) {
      data.forEach(personItem => {
        this.scheduleMemberDataList.push({
          personName: personItem.personName,
          personId: personItem.personId,
          scheduleDate: personItem.startDate,
          teamId: personItem.teamId
        });
      });
      this.memberSearch();
    } else {
      // 筛选出当前已经手动排班的日期人员数据，或在当前日期之前算作历史排班的数据
      const tempDataList = this.scheduleMemberDataList.filter(item => this.scheduledDateList.includes(item.scheduleDate) ||
        differenceInCalendarDays(new Date(item.scheduleDate), new Date(this.dateRange[0])) < 0
      );
      // 新添加的排班人员数据
      this.scheduleMemberDataList = data.filter((personItem) => !this.scheduledDateList.some(item => item === personItem.startDate))
        .map(personItem => {
          return {
            personName: personItem.personName,
            personId: personItem.personId,
            scheduleDate: personItem.startDate,
            teamId: personItem.teamId
          };
        });
      // 将之前已排班的数据与新添加的数据整合在一起（若tempDataList没有值，相当于只保留新添加的排班人员的数据）
      // 这样不会出现人员数据重复累加在同一日期出现
      this.scheduleMemberDataList.push(...tempDataList);
      // 保存一份排班人员最原始的数据
      this.scheduleMemberDataListBackup = _.cloneDeep(this.scheduleMemberDataList);
      // 根据原始的排班人员数据进行处理，使日期修改又还原后能展示初始数据
      this.handleScheduleData();
      this.scheduleMemberDataListChange.emit(this.scheduleMemberDataList);
      // 将原始存储的排班人员传给父组件
      this.scheduleMemberDataListBackupChange.emit(this.scheduleMemberDataListBackup);
      // 根据当前是否有排班人员数据来控制下一步按钮的点击
      this.nextValid.emit(!(this.scheduleMemberDataList && this.scheduleMemberDataList.length));
    }
  }

  /**
   * zorro的选择年份月份的方法备份
   * param month
   */
  private onMonthSelectBackup(month: number): void {
    const date = setMonth(this.calendarComponent.activeDate, month);
    this.calendarComponent['updateDate'](date);
    this.calendarComponent.nzSelectChange.emit(date);
  }

  /**
   * zorro的选择年份的方法备份
   * param year
   */
  private onYearSelectBackup(year: number): void {
    const date = setYear(this.calendarComponent.activeDate, year);
    this.calendarComponent['updateDate'](date);
    this.calendarComponent.nzSelectChange.emit(date);
  }
}
