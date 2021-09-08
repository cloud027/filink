import {Component, OnInit, Input, TemplateRef, ViewChild} from '@angular/core';
import {AlarmLanguageInterface} from '../../../../../../../assets/i18n/alarm/alarm-language.interface';
import {NzI18nService} from 'ng-zorro-antd';
import {TableConfigModel} from '../../../../../../shared-module/model/table-config.model';
import {LanguageEnum} from '../../../../../../shared-module/enum/language.enum';
import {AlarmStoreService} from '../../../../../../core-module/store/alarm.store.service';
import {AlarmService} from '../../../../share/service/alarm.service';
import {ResultCodeEnum} from '../../../../../../shared-module/enum/result-code.enum';
import {AlarmCleanStatusEnum} from '../../../../../../core-module/enum/alarm/alarm-clean-status.enum';
import {AlarmLevelEnum} from '../../../../../../core-module/enum/alarm/alarm-level.enum';
import {AlarmConfirmStatusEnum} from '../../../../../../core-module/enum/alarm/alarm-confirm-status.enum';
import {ResultModel} from '../../../../../../shared-module/model/result.model';
import {AlarmListModel} from '../../../../../../core-module/model/alarm/alarm-list.model';
import {FiLinkModalService} from '../../../../../../shared-module/service/filink-modal/filink-modal.service';
declare const $: any;

/**
 * 告警诊断详情-相关性告警
 */
@Component({
  selector: 'app-correlation-alarm',
  templateUrl: './correlation-alarm.component.html',
  styleUrls: ['./correlation-alarm.component.scss']
})
export class CorrelationAlarmComponent implements OnInit {
  // 告警id
  @Input() alarmId: string;
  // 告警级别过滤模板
  @ViewChild('alarmFixedLevelTemp') alarmFixedLevelTemp: TemplateRef<any>;
  // 清除状态过滤模板
  @ViewChild('isCleanTemp') isCleanTemp: TemplateRef<any>;
  // 确认状态过滤模板
  @ViewChild('isConfirmTemp') isConfirmTemp: TemplateRef<any>;
  // 告警国际化引用
  public language: AlarmLanguageInterface;
  // 相关性告警数据
  public correlationData = [];
  // 列表配置
  public alarmTableConfig: TableConfigModel;
  // 清除状态枚举
  public alarmCleanStatusEnum = AlarmCleanStatusEnum;
  // 确认状态枚举
  public alarmConfirmStatusEnum = AlarmConfirmStatusEnum;
  // 告警级别枚举
  public alarmLevelEnum = AlarmLevelEnum;
  // 国际化枚举
  public languageEnum = LanguageEnum;

  constructor(
    public $nzI18n: NzI18nService,
    public $alarmStoreService: AlarmStoreService,
    public $message: FiLinkModalService,
    private $alarmService: AlarmService,
  ) {
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.alarm);
  }

  /**
   * 初始化
   */
  public ngOnInit(): void {
    this.initTableConfig();
    this.refreshData();
  }
  /**
   * 刷新数据
   */
  private refreshData(): void {
    this.$alarmService.queryAlarmRelevanceList(this.alarmId).subscribe((res: ResultModel<AlarmListModel[]>) => {
      if (res.code === ResultCodeEnum.success) {
        const data = res.data || [];
        data.forEach(item => {
          item.style = this.$alarmStoreService.getAlarmColorByLevel(item.alarmFixedLevel);
          return item;
        });
        this.correlationData = data;
      } else {
        this.$message.error(res.msg);
      }
    });
  }
  /**
   * 初始化列表配置
   */
  private initTableConfig(): void {
    const width = ($('.correlation-alarm').width() - 100) / 7;
    this.alarmTableConfig = {
      isDraggable: true,
      isLoading: false,
      showPagination: false,
      bordered: false,
      showSearch: false,
      scroll: {x: '512px', y: '1200px'},
      columnConfig: [
        // 告警名称
        {title: this.language.alarmName, key: 'alarmName', width: width},
        {
          // 告警级别
          title: this.language.alarmFixedLevel, key: 'alarmFixedLevel', width: width,
          type: 'render', renderTemplate: this.alarmFixedLevelTemp,
        },
        {
          // 频次
          title: this.language.alarmHappenCount, key: 'alarmHappenCount', width: width
        },
        {
          // 最近发生时间
          title: this.language.alarmNearTime, key: 'alarmNearTime', pipe: 'date', width: width
        },
        {
          // 附加信息
          title: this.language.extras, key: 'extras', width: width
        },
        {
          // 清除状态
          title: this.language.alarmCleanStatus, key: 'alarmCleanStatus', width: width, type: 'render', renderTemplate: this.isCleanTemp,
        },
        {
          // 确认状态
          title: this.language.alarmConfirmStatus, key: 'alarmConfirmStatus', width: width,
          type: 'render',
          renderTemplate: this.isConfirmTemp
        }
      ],
      topButtons: [],
      operation: [],
      leftBottomButtons: [],
    };
  }

}
