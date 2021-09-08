import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {
  DEVICE_DETAIL_ALARM_STATISTICS,
  QUERY_ALARM_CURRENT_INFO_BY_ID,
  QUERY_ALARM_HISTORY_INFO,
  QUERY_ALARM_TYPE_LIST,
  QUERY_EXPERIENCE_INFO,
  UPDATE_ALARM_REMARK,
  UPDATE_HISTORY_ALARM_REMARK,
  QUERY_USER_INFOBY_DEPT_AND_DEVICE_TYPE,
  UPDATE_ALARM_CLEAN_STATUS,
  QUERY_ALARM_CURRENT_SET_LIST,
  QUERY_ALARM_LEVEL_LIST,
  QUERY_ALARM_STATISTICS, QUERY_ALARM_CURRENT_LIST,
} from './alarm-request-url';
import {ResultModel} from '../../../shared-module/model/result.model';
import {AlarmSuggestModel} from '../../model/alarm/alarm-suggest.model';
import {AlarmLevelStatisticsModel} from '../../model/alarm/alarm-level-statistics.model';
import {SelectModel} from '../../../shared-module/model/select.model';
import {QueryConditionModel} from '../../../shared-module/model/query-condition.model';
import { AlarmListModel } from '../../model/alarm/alarm-list.model';
import { AlarmNameListModel } from '../../model/alarm/alarm-name-list.model';
import { UserListModel } from '../../model/user/user-list.model';
import { AlarmNotifierRequestModel } from '../../model/alarm/alarm-notifier-request.model';
import {AlarmRemarkModel} from '../../model/alarm/alarm-remark.model';
import {QueryFacilityParamsModel} from '../../model/facility/query-facility-params.model';
import {AlarmSourceIncrementalModel} from '../../model/alarm/alarm-source-incremental.model';
import {AlarmNameStatisticsModel} from '../../model/alarm/alarm-name-statistics.model';
import {AlarmLevelModel} from '../../model/alarm/alarm-level.model';
import {AlarmLevelCardModel} from '../../model/alarm/alarm-level-card.model';
import {AlarmClearAffirmModel} from '../../model/alarm/alarm-clear-affirm.model';

@Injectable()
export class AlarmForCommonService {
  constructor(private $http: HttpClient) {
  }

  /**
   * 当前告警 修改备注
   * param body
   */
  updateAlarmRemark(body: AlarmRemarkModel[]): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${UPDATE_ALARM_REMARK}`, body);
  }
  /**
   * 查询当前告警列表信息
   * param queryCondition
   */
  queryCurrentAlarmList(queryCondition: QueryConditionModel): Observable<ResultModel<AlarmListModel[]>> {
    return this.$http.post<ResultModel<AlarmListModel[]>>(`${QUERY_ALARM_CURRENT_LIST}`, queryCondition);
  }
  /**
   * 历史告警 修改备注
   * param body
   */
  updateHistoryAlarmRemark(body): Observable<Object> {
    return this.$http.post(`${UPDATE_HISTORY_ALARM_REMARK}`, body);
  }

  /**
   * 设施历史告警级别统计
   */
  historyLevelStatistics(body: QueryFacilityParamsModel): Observable<ResultModel<AlarmLevelStatisticsModel>> {
    return this.$http.post<ResultModel<AlarmLevelStatisticsModel>>(`${DEVICE_DETAIL_ALARM_STATISTICS.historyLevel}`, body);
  }

  /***
   * 设施告警增量统计
   */
  queryAlarmSourceIncremental(body: QueryFacilityParamsModel): Observable<ResultModel<AlarmSourceIncrementalModel[]>> {
    return this.$http.post<ResultModel<AlarmSourceIncrementalModel[]>>(`${DEVICE_DETAIL_ALARM_STATISTICS.alarmSourceIncremental}`, body);
  }

  /**
   * 查询当前告警名称统计
   */
  currentSourceNameStatistics(body: QueryFacilityParamsModel): Observable<ResultModel<AlarmNameStatisticsModel[]>> {
    return this.$http.post<ResultModel<AlarmNameStatisticsModel[]>>(`${DEVICE_DETAIL_ALARM_STATISTICS.currentSourceName}`, body);
  }

  /**
   * 查询历史告警名称统计
   */
  historySourceNameStatistics(body: QueryFacilityParamsModel): Observable<ResultModel<AlarmNameStatisticsModel[]>> {
    return this.$http.post<ResultModel<AlarmNameStatisticsModel[]>>(`${DEVICE_DETAIL_ALARM_STATISTICS.historySourceName}`, body);
  }

  currentLevelStatistics(body: QueryFacilityParamsModel): Observable<ResultModel<AlarmLevelStatisticsModel>> {
    return this.$http.post<ResultModel<AlarmLevelStatisticsModel>>(`${DEVICE_DETAIL_ALARM_STATISTICS.currentLevel}`, body);
  }
  /**
   * 获取单条当前告警信息
   * param id
   */
  queryCurrentAlarmInfoById(id: string): Observable<ResultModel<AlarmListModel>> {
    return this.$http.post<ResultModel<AlarmListModel>>(`${QUERY_ALARM_CURRENT_INFO_BY_ID}` + `/${id}`, null);
  }

  /**
   * 获取单条历史告警信息
   * param id
   */
  queryAlarmHistoryInfo(id: string): Observable<ResultModel<AlarmListModel>> {
    return this.$http.post<ResultModel<AlarmListModel>>(`${QUERY_ALARM_HISTORY_INFO}/${id}`, null);
  }

  /**
   * 告警建议
   */
  queryExperienceInfo(): Observable<ResultModel<AlarmSuggestModel[]>> {
    return this.$http.get<ResultModel<AlarmSuggestModel[]>>(`${QUERY_EXPERIENCE_INFO}`);
  }

  /**
   * 告警类型
   */
  getAlarmTypeList(): Observable<ResultModel<SelectModel[]>> {
    return this.$http.get<ResultModel<SelectModel[]>>(`${QUERY_ALARM_TYPE_LIST}`);
  }
  /**
   * 更新当前告警的告警清除状态
   * param body
   */
  updateAlarmCleanStatus(body: AlarmClearAffirmModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${UPDATE_ALARM_CLEAN_STATUS}`, body);
  }

  /**
   * 获取告警名称列表数据
   * param queryCondition
   */
  queryAlarmCurrentSetList(queryCondition: QueryConditionModel): Observable<ResultModel<AlarmNameListModel[]>> {
    return this.$http.post<ResultModel<AlarmNameListModel[]>>(`${QUERY_ALARM_CURRENT_SET_LIST}`, queryCondition);
  }

  /**
   * 告警远程通知 新增页面 通过区域 设施类型 查询通知人
   * param body
   */
  queryUserInfoByDeptAndDeviceType(body: AlarmNotifierRequestModel): Observable<ResultModel<UserListModel[]>> {
    return this.$http.post<ResultModel<UserListModel[]>>(`${QUERY_USER_INFOBY_DEPT_AND_DEVICE_TYPE}`, body);
  }

  /**
   * 查询告警级别列表信息
   * param body
   */
  queryAlarmLevelList(body: QueryConditionModel): Observable<ResultModel<AlarmLevelModel[]>> {
    return this.$http.post<ResultModel<AlarmLevelModel[]>>(`${QUERY_ALARM_LEVEL_LIST}`, body);
  }

  /**
   * 查询告警等级
   * param id
   */
  queryAlarmStatistics(id: number): Observable<ResultModel<AlarmLevelCardModel[]>> {
    return this.$http.get<ResultModel<AlarmLevelCardModel[]>>(`${QUERY_ALARM_STATISTICS}/${id}`);
  }
}
