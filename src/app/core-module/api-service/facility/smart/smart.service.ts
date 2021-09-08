import {Injectable} from '@angular/core';
import {SmartInterface} from './smart.interface';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {smartHttpUrl} from '../facility-request-url-old';

@Injectable()
export class SmartService implements SmartInterface {

  constructor(private $http: HttpClient) {
  }

  /**
   * 创建模板
   * param body
   */
  createTemplate(body): Observable<Object> {
    return this.$http.post(smartHttpUrl.createTemplate, body);
  }

  /**
   * 查询模板详情
   * param body
   */
  queryDetailedTemplate(body): Observable<Object> {
    return this.$http.post(smartHttpUrl.queryDetailedTemplate, body);
  }

  /**
   * 查询所有模板
   * param body
   */
  queryAllTemplate(body): Observable<Object> {
    return this.$http.post(smartHttpUrl.queryAllTemplate, body);
  }

  /**
   * 查询实景图坐标
   * param body
   */
  queryRealPosition(body): Observable<Object> {
    return this.$http.post(smartHttpUrl.queryRealPosition, body);
  }

  /**
   * 查询框实景坐标
   * param id
   */
  queryRealPositionByFrame(id): Observable<Object> {
    return this.$http.get(`${smartHttpUrl.queryRealPositionByFrame}/${id}`);
  }

  /**
   * 根据端口ID查询端口信息
   * param id
   */
  queryPortInfoByPortId(id): Observable<Object> {
    return this.$http.get(`${smartHttpUrl.queryPortInfoByPortId}/${id}`);
  }

  /**
   * 查询智能标签信息
   * param body
   * returns {Observable<Object>}
   */
  querySmartInfo(body): Observable<Object> {
    return this.$http.post(`${smartHttpUrl.querySmartInfo}`, body);
  }

  /**
   * 更新设施专属业务信息
   * param body
   * returns {Observable<Object>}
   */
  uploadFacilityBusinessInfo(body): Observable<Object> {
    return this.$http.post(`${smartHttpUrl.uploadFacilityBusinessInfo}`, body);
  }

  /**
   * 通过id查询设施专属业务信息
   * param deviceId
   * param deviceType
   * returns {Observable<Object>}
   */
  queryFacilityBusInfoById(deviceId, deviceType): Observable<Object> {
    return this.$http.post(`${smartHttpUrl.queryFacilityBusInfoById}?deviceId=${deviceId}&deviceType=${deviceType}`, {});
  }

  /**
   * 跳纤侧端口统计  (Echarts饼图)
   */
  queryLocalPortInformation(id): Observable<Object> {
    return this.$http.get(`${smartHttpUrl.queryLocalPortInformation}/${id}`);
  }

  /**
   * 查询对端端口信息 （表格）
   * param data
   */
  queryJumpFiberInfoByPortInfo(data): Observable<Object> {
    return this.$http.post(`${smartHttpUrl.queryJumpFiberInfoByPortInfo}`, data);
  }

  /**
   * 删除对端端口信息 （表格）
   * param data
   */
  deleteJumpFiberInfoById(data): Observable<Object> {
    return this.$http.post(`${smartHttpUrl.deleteJumpFiberInfoById}`, data);
  }

  /**
   * 导出对端端口信息 （表格导出）
   * param body
   */
  exportJumpFiberInfoByPortInfo(body): Observable<Object> {
    return this.$http.post(`${smartHttpUrl.exportJumpFiberInfoByPortInfo}`, body);
  }

  /**
   * 右键事件切换端口上下架状态
   * param data
   */
  updatePortState(data): Observable<Object> {
    return this.$http.post(`${smartHttpUrl.updatePortState}`, data);
  }

  /**
   * 删除模板
   * param body
   */
  deleteTemplate(body): Observable<Object> {
    return this.$http.post(smartHttpUrl.deleteTemplate, body);
  }

  /**
   * 修改模板
   * param body
   */
  updateTemplate(body): Observable<Object> {
    return this.$http.post(smartHttpUrl.updateTemplate, body);
  }
}
