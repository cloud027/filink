import {Injectable} from '@angular/core';
import {SystemParameterInterface} from './system-parameter.interface';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {EXPORT_INSTRUCTION, SystemSettingRequireUrlConst} from '../const/http-url-const';
import {StatusEnum, SystemParameterConfigEnum} from '../enum/system-setting.enum';
import {ResultModel} from '../../../../shared-module/model/result.model';
import {OperateLogModel} from '../../../../core-module/model/system-setting/operate-log.model';
import {QueryConditionModel} from '../../../../shared-module/model/query-condition.model';
import {ExportRequestModel} from '../../../../shared-module/model/export-request.model';
import {RangeModel} from '../mode/range.model';
import {SystemParamModel} from '../mode/system-param.model';
import {DeviceProtocolListModel} from '../mode/device-protocol-list.model';
import {FileLimitModel} from '../mode/file-limit.model';
import {LanguageModel} from '../../../../core-module/model/alarm/language.model';
import {AccountSecurityModel} from '../../../../core-module/model/user/account-security.model';
import {PasswordCheckModel} from '../../../../core-module/model/alarm/password-check.model';
import {LicenseDetailModel} from '../mode/license-detail-model';
import {DumpInfoModel} from '../mode/dump-info.model';
import {AboutInfoModel} from '../mode/about-Info.model';
import {TestPhoneModel} from '../mode/test-phone.model';
import {FtpSettingsTestModel} from '../mode/ftp-settings-test.model';
import {RangeStatusModel} from '../mode/range-status.model';
import {MenuTemplateModel} from '../../../../core-module/model/system-setting/menu-template.model';
import { BackupSettingModel } from '../mode/backup-setting.model';
import { PlatformInfoModel } from '../mode/platform-info.model';
import {AlarmDumpModel} from '../mode/alarm-dump.model';

@Injectable()
export class SystemParameterService implements SystemParameterInterface {
  constructor(private $http: HttpClient) {
  }

  /**
   * 更新系统参数配置
   */
  updateSystem(type: string, body: any): Observable<ResultModel<string>> {
    switch (type) {
      // 更新消息
      case SystemParameterConfigEnum.msg:
        return this.$http.post<ResultModel<string>>(SystemSettingRequireUrlConst.updateMassage, body);
      // 更新邮件
      case SystemParameterConfigEnum.email:
        return this.$http.post<ResultModel<string>>(SystemSettingRequireUrlConst.updateMail, body);
      // 更新短信
      case SystemParameterConfigEnum.note:
        return this.$http.post<ResultModel<string>>(SystemSettingRequireUrlConst.updateNote, body);
      // 更新推送
      case SystemParameterConfigEnum.push:
        return this.$http.post<ResultModel<string>>(SystemSettingRequireUrlConst.updatePush, body);
      // 更新显示
      case SystemParameterConfigEnum.show:
        return this.$http.post<ResultModel<string>>(SystemSettingRequireUrlConst.updateShow, body);
      // 更新ftp
      case SystemParameterConfigEnum.ftp:
        return this.$http.post<ResultModel<string>>(SystemSettingRequireUrlConst.updateFtp, body);
      // 更新平台显示
      case SystemParameterConfigEnum.platformDisplay:
        return this.$http.post<ResultModel<string>>(SystemSettingRequireUrlConst.updatePlatformDisplay, body);
    }
  }

  /**
   * 更新备份设置参数
   */
  updateBackupSetting(body: {paramId: string; backup: BackupSettingModel}): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(SystemSettingRequireUrlConst.updateBackupSetting, body);
  }

  /**
   * 查询翻译
   */
  queryLanguage(): Observable<ResultModel<LanguageModel[]>> {
    return this.$http.get<ResultModel<LanguageModel[]>>(SystemSettingRequireUrlConst.queryLanguageAll);
  }

  selectDisplaySettingsParamForPageCollection(): Observable<ResultModel<any>> {
    return this.$http.get<ResultModel<any>>(SystemSettingRequireUrlConst.selectDisplaySettingsParamForPageCollection);
  }

  /**
   * 测试email
   * param body
   */
  testEmail(body: any): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(SystemSettingRequireUrlConst.sendMailTest, body);
  }

  /**
   * 测试手机号
   * param body
   */
  testPhone(body: TestPhoneModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(SystemSettingRequireUrlConst.sendMessageTest, body);
  }

  /**
   * 测试ftp
   * param body
   */
  ftpSettingsTest(body: FtpSettingsTestModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(SystemSettingRequireUrlConst.ftpSettingsTest, body);
  }

  /**
   * 获取表格列表设置
   */
  queryColumnSetting(): Observable<ResultModel<any>> {
    return this.$http.get<ResultModel<any>>(SystemSettingRequireUrlConst.queryColumnSettings);
  }

  /**
   * 保存列设置
   * param body
   */
  saveColumnSetting(body): Observable<ResultModel<any>> {
    return this.$http.post<ResultModel<any>>(SystemSettingRequireUrlConst.saveColumnSettings, body);
  }

  /**
   * 查询当前密码安全策略
   * param type
   */
  queryPasswordPresent(type: string): Observable<ResultModel<SystemParamModel>> {
    return this.$http.get<ResultModel<SystemParamModel>>(`${SystemSettingRequireUrlConst.queryPasswordPresent}/${type}`);
  }

  /**
   * 更新密码安全策略
   * param body
   */
  updatePasswordStrategy(body: any): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(SystemSettingRequireUrlConst.updatePasswordStrategy, body);
  }

  /**
   * 查询当前账号安全策略
   * param type
   */
  queryAccountPresent(type: string): Observable<ResultModel<SystemParamModel>> {
    return this.$http.get<ResultModel<SystemParamModel>>(`${SystemSettingRequireUrlConst.queryPasswordPresent}/${type}`);
  }

  /**
   * 更新账号安全策略
   * param body
   */
  updateAccountStrategy(body: any): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(SystemSettingRequireUrlConst.updateAccountStrategy, body);
  }

  /**
   * 查询访问控制列表
   * param body
   */
  queryRangesAll(body: QueryConditionModel): Observable<ResultModel<RangeModel[]>> {
    return this.$http.post<ResultModel<RangeModel[]>>(SystemSettingRequireUrlConst.queryRanges, body);
  }

  /**
   * 删除访问控制列表
   * param body
   */
  deleteRanges(body: Array<string>): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(SystemSettingRequireUrlConst.deleteRanges, body);
  }

  /**
   * 新增IP范围
   * param body
   */
  addIpRange(body: RangeModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(SystemSettingRequireUrlConst.addIpRange, body);
  }

  /**
   * 修改IP范围
   * param body
   */
  updateIpRange(body: RangeModel): Observable<ResultModel<string>> {
    return this.$http.put<ResultModel<string>>(SystemSettingRequireUrlConst.updateIpRange, body);
  }

  /**
   * 获取主键id
   * param body
   */
  queryRangeId(body: {rangeId: string}): Observable<ResultModel<RangeModel>> {
    return this.$http.post<ResultModel<RangeModel>>(SystemSettingRequireUrlConst.queryIpRangeById, body);
  }

  /**
   * 启用禁用切换
   * param body
   */
  updateRangeStatus(body: RangeStatusModel): Observable<ResultModel<RangeModel>> {
    return this.$http.put<ResultModel<RangeModel>>(SystemSettingRequireUrlConst.updateRangeStatus, body);
  }

  /**
   * 全部启用 禁用切换
   * param body
   */
  updateAllRangesStatus(body: {rangeStatus: StatusEnum}): Observable<ResultModel<string>> {
    return this.$http.put<ResultModel<string>>(SystemSettingRequireUrlConst.updateAllRangesStatus, body);
  }

  queryAccountSecurity(): Observable<ResultModel<AccountSecurityModel>> {
    return this.$http.get<ResultModel<AccountSecurityModel>>(`${SystemSettingRequireUrlConst.queryAccountSecurity}`);
  }

  queryPasswordSecurity(): Observable<ResultModel<PasswordCheckModel>> {
    return this.$http.get<ResultModel<PasswordCheckModel>>(`${SystemSettingRequireUrlConst.queryPasswordSecurity}`);
  }

  getDefaultMenuTemplate(): Observable<ResultModel<any>> {
    return this.$http.get<ResultModel<any>>(SystemSettingRequireUrlConst.getDefaultMenuTemplate);
  }

  addMenuTemplate(params): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(SystemSettingRequireUrlConst.addMenuTemplate, params);
  }

  queryListMenuTemplateByPage(params): Observable<ResultModel<MenuTemplateModel[]>> {
    return this.$http.post<ResultModel<MenuTemplateModel[]>>(SystemSettingRequireUrlConst.queryListMenuTemplateByPage, params);
  }

  openMenuTemplate(id: string): Observable<ResultModel<string>> {
    return this.$http.get<ResultModel<string>>(`${SystemSettingRequireUrlConst.openMenuTemplate}/${id}`);
  }

  deleteMenuTemplate(ids: Array<string>): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(SystemSettingRequireUrlConst.deleteMenuTemplate, ids);
  }

  getMenuTemplateByMenuTemplateId(id: string): Observable<ResultModel<any>> {
    return this.$http.get<ResultModel<any>>(`${SystemSettingRequireUrlConst.getMenuTemplateByMenuTemplateId}/${id}`);
  }

  updateMenuTemplate(params): Observable<ResultModel<string>> {
    return this.$http.put<ResultModel<string>>(SystemSettingRequireUrlConst.updateMenuTemplate, params);
  }

  getShowMenuTemplate() {
    return this.$http.get(`${SystemSettingRequireUrlConst.getShowMenuTemplate}`);
  }

  queryMenuExists(params): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(SystemSettingRequireUrlConst.queryMenuTemplateNameIsExists, params);
  }

  checkDeviceProtocolNameRepeat(params) {
    return this.$http.post(SystemSettingRequireUrlConst.checkDeviceProtocolNameRepeat, params);
  }

  /**
   * 查询系统日志
   */
  findSystemLog(params: QueryConditionModel): Observable<ResultModel<OperateLogModel[]>> {
    return this.$http.post<ResultModel<OperateLogModel[]>>(SystemSettingRequireUrlConst.findSystemLog, params);
  }

  /**
   * 查询操作日志
   */
  public findOperateLog(body: QueryConditionModel): Observable<ResultModel<OperateLogModel[]>> {
    return this.$http.post<ResultModel<OperateLogModel[]>>(SystemSettingRequireUrlConst.findOperateLog, body);
  }

  /**
   * 查询安全日志
   */
  findSecurityLog(params: QueryConditionModel): Observable<ResultModel<OperateLogModel[]>> {
    return this.$http.post<ResultModel<OperateLogModel[]>>(SystemSettingRequireUrlConst.findSecurityLog, params);
  }

  /**
   * 操作日志 导出
   */
  exportOperateLogExport(body: ExportRequestModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(SystemSettingRequireUrlConst.exportOperateLogExport, body);
  }

  /**
   * 系统日志 导出
   */
  exportSysLogExport(body: ExportRequestModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(SystemSettingRequireUrlConst.exportSysLogExport, body);
  }

  /**
   * 安全日志 导出
   */
  exportSecurityLogExport(body: ExportRequestModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(SystemSettingRequireUrlConst.exportSecurityLogExport, body);
  }

  /**
   * license列表查询
   */
  getLicenseDetail(): Observable<ResultModel<LicenseDetailModel[]>> {
    return this.$http.get<ResultModel<LicenseDetailModel[]>>(SystemSettingRequireUrlConst.getLicenseDetail);
  }

  /**
   * 查询告警转储策略
   * param params
   */
  queryDumpPolicy(params: number): Observable<ResultModel<SystemParamModel>> {
    return this.$http.get<ResultModel<SystemParamModel>>(`${SystemSettingRequireUrlConst.queryAlarmDumpPolicy}/${params}`);
  }

  /**
   * 更新转储策略
   * param body
   */
  updateDumpPolicy(body: {paramId: string, paramType: number, dumpBean: AlarmDumpModel}): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(SystemSettingRequireUrlConst.updateDumpPolicy, body);
  }

  /**
   * 手动转储数据
   * @param type number
   */
  handDumpData(type: number): Observable<ResultModel<string>> {
    return this.$http.get<ResultModel<string>>(`${SystemSettingRequireUrlConst.handDumpData}/${type}`);
  }

  /**
   * 查询最新的转储信息
   * @param type number
   */
  queryNowDumpInfo(type: number): Observable<ResultModel<DumpInfoModel>> {
    return this.$http.post<ResultModel<DumpInfoModel>>(`${SystemSettingRequireUrlConst.queryNowDumpInfo}/${type}`, {});
  }

  /**
   * 查询指定转储信息
   * @param id string
   */
  queryDumpInfo(id: string): Observable<ResultModel<DumpInfoModel>> {
    return this.$http.get<ResultModel<DumpInfoModel>>(`${SystemSettingRequireUrlConst.queryDumpInfo}/${id}`);
  }

  /**
   * 新增协议脚本
   * param params
   */
  addDeviceProtocol(params: DeviceProtocolListModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(SystemSettingRequireUrlConst.addDeviceProtocol, params);
  }

  /**
   * 覆盖更新
   */
  updateCoverDeviceProtocol(params: DeviceProtocolListModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(SystemSettingRequireUrlConst.updateCoverDeviceProtocol, params);
  }

  /**
   * 修改协议文件、配置文件等
   * param params
   */
  updateDeviceProtocol(params: FormData): Observable<ResultModel<DeviceProtocolListModel>> {
    return this.$http.post<ResultModel<DeviceProtocolListModel>>(SystemSettingRequireUrlConst.updateDeviceProtocol, params);
  }

  /**
   * 修改协议脚本
   * param params
   */
  updateProtocolName(params: DeviceProtocolListModel): Observable<ResultModel<DeviceProtocolListModel>> {
    return this.$http.post<ResultModel<DeviceProtocolListModel>>(SystemSettingRequireUrlConst.updateProtocolName, params);
  }

  /**
   * 删除协议脚本
   * param protocolId
   */
  deleteDeviceProtocol(params: Array<string>): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${SystemSettingRequireUrlConst.deleteDeviceProtocol}`, params);
  }

  /**
   * 查询接入协议列表
   * param params
   */
  queryDeviceProtocolList(params: QueryConditionModel): Observable<ResultModel<DeviceProtocolListModel[]>> {
    return this.$http.post<ResultModel<DeviceProtocolListModel[]>>(`${SystemSettingRequireUrlConst.queryDeviceProtocolList}`, params);
  }

  /**
   * 通过id查询接入协议列表
   * param params
   */
  queryDeviceProtocolById(id: string): Observable<ResultModel<DeviceProtocolListModel>> {
    return this.$http.get<ResultModel<DeviceProtocolListModel>>(`${SystemSettingRequireUrlConst.queryDeviceProtocolById}/${id}`);
  }

  /**
   * 实施协议文件校验
   * param params
   */
  queryFileLimit(): Observable<ResultModel<FileLimitModel>> {
    return this.$http.get<ResultModel<FileLimitModel>>(`${SystemSettingRequireUrlConst.queryFileLimit}`);
  }

  /**
   * 根据系统设置参数类型查询对应的参数配置信息
   * param type
   */
  queryProtocol(type: string): Observable<ResultModel<SystemParamModel>> {
    return this.$http.get<ResultModel<SystemParamModel>>(`${SystemSettingRequireUrlConst.queryProtocol}/${type}`);
  }

  /**
   * 更新协议配置
   * param body
   */
  updateProtocol(body: FormData): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(SystemSettingRequireUrlConst.updateProtocol, body);
  }

  /**
   * 获取关于页面相关配置
   */
  about(): Observable<ResultModel<AboutInfoModel>> {
    return this.$http.get<ResultModel<AboutInfoModel>>(SystemSettingRequireUrlConst.about);
  }

  /**
   * 查询协议文件和型号是否存在
   */
  public queryDeviceProtocolByEquipmentModel(data: FormData): Observable<ResultModel<DeviceProtocolListModel>> {
    return this.$http.post<ResultModel<DeviceProtocolListModel>>(SystemSettingRequireUrlConst.queryDeviceProtocolByEquipmentModel, data);
  }

  /**
   * 根据产品的appId查询第三方服务地址
   */
  public findPlatformAppInfoByAppId(appId: string): Observable<ResultModel<PlatformInfoModel>> {
    return this.$http.get<ResultModel<PlatformInfoModel>>(`${SystemSettingRequireUrlConst.getPlatformAppInfoByAppId}/${appId}`);
  }

  /**
   * 测试备份地址是否正确
   */
  public backupAddrTest(data: {backupLocation: string; backupAddr: string}): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(SystemSettingRequireUrlConst.backupAddrTest, data);
  }

  /**
   * 导出指令下发日志
   * @param body 指令内容、格式
   */
  public exportInstruction(body): Observable<ResultModel<any>>  {
    return this.$http.post<ResultModel<any>>(EXPORT_INSTRUCTION, body);
  }
}
