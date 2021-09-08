import {Component, Input, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {NzI18nService} from 'ng-zorro-antd';
import {TableConfigModel} from '../../../../../shared-module/model/table-config.model';
import {FilterCondition, QueryConditionModel} from '../../../../../shared-module/model/query-condition.model';
import {FacilityLanguageInterface} from '../../../../../../assets/i18n/facility/facility.language.interface';
import {SystemForCommonService} from '../../../../../core-module/api-service/system-setting';
import {FacilityService} from '../../../../../core-module/api-service/facility/facility-manage';
import {CommonLanguageInterface} from '../../../../../../assets/i18n/common/common.language.interface';
import {OperatorEnum} from '../../../../../shared-module/enum/operator.enum';
import {LanguageEnum} from '../../../../../shared-module/enum/language.enum';
import {ResultModel} from '../../../../../shared-module/model/result.model';
import {ResultCodeEnum} from '../../../../../shared-module/enum/result-code.enum';
import {FacilityLog} from '../../../../../core-module/model/facility/facility-log';
import {LogOptResultEnum} from '../../../share/enum/log-opt-result.enum';
import {SessionUtil} from '../../../../../shared-module/util/session-util';
import {FacilityApiService} from '../../../share/service/facility/facility-api.service';
import {CommonUtil} from '../../../../../shared-module/util/common-util';
import {OperateLogModel} from '../../../../../core-module/model/system-setting/operate-log.model';
import {LogTypeEnum} from '../../../share/enum/facility.enum';
import {EquipmentTypeEnum} from '../../../../../core-module/enum/equipment/equipment.enum';

/**
 * 设施详情设施日志组件
 */
@Component({
  selector: 'app-facility-view-detail-log',
  templateUrl: './facility-view-detail-log.component.html',
  styleUrls: ['./facility-view-detail-log.component.scss']
})
export class FacilityViewDetailLogComponent implements OnInit {
  // 设施id
  @Input()
  public deviceId: string;
  @Input()
  public showEquipmentLog: boolean = false;
  @Input()
  public showOperateLog: boolean = false;
  // 操作结果
  @ViewChild('optResult') private optResult: TemplateRef<HTMLDocument>;
  // 设施日志列表数据
  public facilityLogSet: FacilityLog[] = [];
  // 操作日志数据
  public operationLogSet: OperateLogModel[] = [];
  // 设施日志列表配置
  public facilityLogTableConfig: TableConfigModel;
  // 操作日志列表配置
  public operationLogTableConfig: TableConfigModel;
  // 设施语言包
  public language: FacilityLanguageInterface;
  // 系统设置语言包
  public systemSettingLogLanguage;
  // 公共语言包
  public commonLanguage: CommonLanguageInterface;
  // 日志语言包
  public logLanguage;
  // 操作枚举
  public optResultEnum = LogOptResultEnum;
  // 查询条件
  private queryCondition: QueryConditionModel = new QueryConditionModel();

  constructor(private $nzI18n: NzI18nService,
              private $facilityService: FacilityService,
              private $facilityApiService: FacilityApiService,
              private $logManageService: SystemForCommonService,
              private $router: Router) {
  }

  public ngOnInit(): void {
    this.optResultEnum = LogOptResultEnum;
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.facility);
    this.systemSettingLogLanguage = this.$nzI18n.getLocaleData(LanguageEnum.systemSetting);
    this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
    this.logLanguage = this.$nzI18n.getLocaleData(LanguageEnum.log);
    this.initTableConfig();
    this.refreshData();
  }

  /**
   * 判断是否有操作权限
   */
  public checkHasRole(code: string): boolean {
    return SessionUtil.checkHasRole(code);
  }
  /**
   * 导航跳转
   * param url
   */
  public navigatorTo(url: string): void {
    this.$router.navigate([url], {queryParams: {id: this.deviceId}}).then();
  }

  /**
   * 初始化列表配置
   */
  private initTableConfig(): void {
    this.facilityLogTableConfig = {
      isDraggable: true,
      isLoading: false,
      scroll: {x: '512px', y: '600px'},
      noIndex: true,
      columnConfig: [
        { // 日志名称
          title: this.language.deviceLogName, key: 'logName', width: 250
        },
        { // 日志类型
          title: this.language.deviceLogType, key: 'logType', width: 250,
        },
        { // 设备名称
          title: this.language.equipmentName, key: 'equipmentName', width: 250,
        },
        { // 设备类型
          title: this.language.equipmentType, key: 'equipmentType', width: 250,
        },
        { // 发生时间
          title: this.language.createTime, key: 'currentTime', width: 150, pipe: 'date',
        },
        {
          title: this.language.extraRemarks, key: 'remarks', width: 250,
        },
      ],
      showPagination: false,
      bordered: false,
      showSearch: false,
      topButtons: [],
      operation: [],
      leftBottomButtons: [],
    };
    this.operationLogTableConfig = {
      isDraggable: true,
      isLoading: false,
      showSearchSwitch: false,
      showRowSelection: false,
      showSizeChanger: false,
      scroll: {x: '662px', y: '600px'},
      noIndex: true,
      columnConfig: [
        {
          title: this.systemSettingLogLanguage.optUserName,
          key: 'optUserName',
          width: 350
        },
        {
          title: this.systemSettingLogLanguage.optTime,
          key: 'optTime',
          width: 350,
          pipe: 'date',
        },
        {
          title: this.systemSettingLogLanguage.optResult,
          key: 'optResult',
          width: 350,
          type: 'render',
          renderTemplate: this.optResult,
        },
        {
          title: this.systemSettingLogLanguage.detailInfo,
          key: 'detailInfo',
          width: 350,
        },
      ],
      showPagination: false,
      bordered: false,
      showSearch: false,
      topButtons: [],
      operation: [],
      leftBottomButtons: [],
    };
  }

  /**
   * 刷新数据
   */
  private refreshData(): void {
    this.facilityLogTableConfig.isLoading = true;
    this.operationLogTableConfig.isLoading = true;
    // 查询条件
    const condition = new FilterCondition('deviceId', OperatorEnum.eq, this.deviceId);
    this.queryCondition.filterConditions = [condition];
    this.$facilityApiService.queryDeviceLogListByPage(this.queryCondition).subscribe(
      (result: ResultModel<FacilityLog[]>) => {
        this.facilityLogTableConfig.isLoading = false;
        if (result.code === ResultCodeEnum.success) {
          this.facilityLogSet = result.data || [];
          // 截取五条数据
          if (this.facilityLogSet.length > 5) {
            this.facilityLogSet = this.facilityLogSet.slice(0, 5);
          }
          this.facilityLogSet.forEach(item => {
            if (item.equipmentType) {
              item.equipmentType = CommonUtil.codeTranslate(EquipmentTypeEnum, this.$nzI18n, item.equipmentType) as string;
            }
            if (item.logType) {
              item.logType = CommonUtil.codeTranslate(LogTypeEnum, this.$nzI18n, item.logType) as string;
            }
          });
        }
      }, () => {
        this.facilityLogTableConfig.isLoading = false;
      });
    condition.filterField = 'optObjId';
    this.queryCondition.sortCondition.sortField = 'optTime';
    this.queryCondition.sortCondition.sortRule = 'desc';
    this.$logManageService.findOperateLog(this.queryCondition).subscribe((result: ResultModel<OperateLogModel[]>) => {
    if (result.code === 0) {
        this.operationLogSet = result.data || [];
        // 截取五条数据
        if (this.operationLogSet.length > 5) {
          this.operationLogSet = this.operationLogSet.slice(0, 5);
        }
      }
      this.operationLogTableConfig.isLoading = false;
    }, () => {
      this.operationLogTableConfig.isLoading = false;
    });
  }
}
