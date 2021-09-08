import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {
  ADD_ALARM_STATISTICAL_TEMPLATE,
  ALARM_INCREMENTAL_STATISTICS, ALARM_STATISTICAL_LIST,
  AREA_ALARM_STATISTICS, DELETE_ALARM_STATISTICAL,
  EXPORT_ALARM_STATISTICAL, QUERY_ALARM_CONUT_BY_LEVEL_AND_AREA,
  QUERY_ALARM_HANDLE,
  QUERY_ALARM_NAME_STATISTICS, QUERY_ALARM_STAt_BY_TEMP_ID, STATISTICAL_TEMPLATE_NAME, UPDATE_ALARM_STATISTICAL_TEMPLATE
} from '../../../../core-module/api-service/alarm/alarm-request-url';

@Injectable()
export class AlarmStatisticalService {

  constructor(private $http: HttpClient) {
  }

  // 告警统计页面
  exportAlarmStatistical(body,typeNumber): Observable<Object> {
    return this.$http.post(`${EXPORT_ALARM_STATISTICAL}/${typeNumber}`, body);
  }

  // 告警处理统计
  queryAlarmHandle(body): Observable<Object> {
    return this.$http.post(`${QUERY_ALARM_HANDLE}`, body);
  }

  // 告警增量统计
  alarmIncrementalStatistics(body): Observable<Object> {
    return this.$http.post(`${ALARM_INCREMENTAL_STATISTICS}`, body);
  }

  // 区域告警比统计
  areaAlarmStatistics(body): Observable<Object> {
    return this.$http.post(`${AREA_ALARM_STATISTICS}`, body);
  }

  // 告警名称统计
  queryAlarmNameStatistics(body): Observable<Object> {
    return this.$http.post(`${QUERY_ALARM_NAME_STATISTICS}`, body);
  }

  // 告警类型统计
  queryAlarmConutByLevelAndArea(body): Observable<Object> {
    return this.$http.post(`${QUERY_ALARM_CONUT_BY_LEVEL_AND_AREA}`, body);
  }

  // 告警统计 模板查询
  alarmStatisticalList(body): Observable<Object> {
    return this.$http.post(`${ALARM_STATISTICAL_LIST}` + `/${body}`, null);
  }

// 模板统计删除
  deleteAlarmStatistical(id: string[]): Observable<Object> {
    return this.$http.post(`${DELETE_ALARM_STATISTICAL}`, id);
  }

// 告警模板 通过ID查询 当条数据
  queryAlarmStatByTempId(id: string[]): Observable<Object> {
    return this.$http.post(`${QUERY_ALARM_STAt_BY_TEMP_ID}` + `/${id}`, null);
  }

// 模板统计新增
  addAlarmStatisticalTemplate(body): Observable<Object> {
    return this.$http.post(`${ADD_ALARM_STATISTICAL_TEMPLATE}`, body);
  }

  // 编辑 告警模板
  updateAlarmStatisticalTemplate(body): Observable<Object> {
    return this.$http.post(`${UPDATE_ALARM_STATISTICAL_TEMPLATE}`, body);
  }
  // 统计模板名称唯一性校验
  checkAlarmStatisticalName(name: string, id: string): Observable<Object> {
    return this.$http.post(STATISTICAL_TEMPLATE_NAME, {templateName: name, id: id});
  }
}
