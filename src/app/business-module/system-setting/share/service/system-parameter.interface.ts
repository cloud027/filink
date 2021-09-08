import {Observable} from 'rxjs';

export interface SystemParameterInterface {

  /**
   * 更新设置
   */
  updateSystem(type, body);

  /**
   * 获取系统语言
   */
  queryLanguage();

  /**
   * 查询系统初始化配置
   */
  selectDisplaySettingsParamForPageCollection();

  /**
   * email测试
   */
  testEmail(body);

  /**
   * phone测试
   */
  testPhone(body);

  /**
   * phone测试
   */
  ftpSettingsTest(body);

  /**
   * 查询列设置
   */
  queryColumnSetting(): Observable<Object>;

  /**
   * 保存列设置
   */
  saveColumnSetting(body): Observable<Object>;

  /**
   * 查询当前密码安全策略
   */
  queryPasswordPresent(type);


  /**
   * 更新密码安全策略
   */
  updatePasswordStrategy(body);

  /**
   * 查询当前账号安全策略
   */
  queryAccountPresent(queryAccountPresent);


  /**
   * 更新账号安全策略
   */
  updateAccountStrategy(body);

  /**
   * 查询访问控制列表
   */
  queryRangesAll(body);

  /**
   * 删除访问控制列表
   * param body
   */
  deleteRanges(body);

  /**
   * 访问控制新增ip范围
   * param body
   */
  addIpRange(body);

  /**
   * 修改IP范围
   * param body
   */
  updateIpRange(body);

  /**
   * 获取单个ip详情
   * param body
   */
  queryRangeId(body);

  /**
   * 启用/禁用状态更新
   * param body
   */
  updateRangeStatus(body);

  /**
   * 全部启用或者禁用
   * param body
   */
  updateAllRangesStatus(body);


  /**
   *查询账号安全策略
   */
  queryAccountSecurity();

  /**
   * 查询密码安全策略
   */
  queryPasswordSecurity();

  /**
   * 查询默认菜单
   */
  getDefaultMenuTemplate();

  /**
   * 新增菜单模板
   * param params
   */
  addMenuTemplate(params);

  /**
   * 菜单管理列表查询
   * param params
   */
  queryListMenuTemplateByPage(params);

  /**
   * 启用菜单模板
   * param id
   */
  openMenuTemplate(id);

  /**
   * 删除菜单模板
   * param ids
   */
  deleteMenuTemplate(ids);

  /**
   * 根据id获取模板详情
   * param id
   */
  getMenuTemplateByMenuTemplateId(id);

  /**
   * 模板信息修改
   * param params
   */
  updateMenuTemplate(params);

  /**
   * 获取开启的菜单模板
   */
  getShowMenuTemplate();

  /**
   * 异步校验菜单名称
   */
  queryMenuExists(params);

  /**
   * 异步校设施协议名称
   */
  checkDeviceProtocolNameRepeat(params);

  /**
   * 查询系统日志
   * param params
   */
  findSystemLog(params);

  /**
   * 安全日志
   * param params
   */
  findSecurityLog(params);

  /**
   * 导出系统日志
   */
  exportSysLogExport(body);

  /**
   * 导出操作日志
   */
  exportOperateLogExport(body);

  /**
   * 导出安全日志
   */
  exportSecurityLogExport(body);

  /**
   * 获取License详情
   */
  getLicenseDetail();

  /**
   *  查询默认策略
   */
  queryDumpPolicy(params): Observable<Object>;

  /**
   * 更新转储策略
   */
  updateDumpPolicy(body): Observable<Object>;

  /**
   * 手动转储
   */
  handDumpData(type): Observable<Object>;

  /**
   * 查询最新转储信息
   */
  queryNowDumpInfo(type): Observable<Object>;

  /**
   * 查询指定转储信息
   */
  queryDumpInfo(id): Observable<Object>;

  /**
   * 新增设施协议
   * param params
   */
  addDeviceProtocol(params);

  /**
   * 覆盖更新
   */
  updateCoverDeviceProtocol(params);

  /**
   * 修改设施协议
   * param params
   */
  updateDeviceProtocol(params);

  /**
   * 修改设施协议名称
   * param params
   */
  updateProtocolName(params);

  /**
   * 删除设施协议
   * param protocolId
   */
  deleteDeviceProtocol(params);

  /**
   * 查询设施列表
   * param params
   */
  queryDeviceProtocolList(params);

  /**
   * 实施协议文件校验
   * param params
   */
  queryFileLimit();

  /**
   * 根据协议类型查询协议配置
   * param type
   */
  queryProtocol(type);

  /**
   * 更新协议配置
   * param params
   */
  updateProtocol(params);

  /**
   * 获取关于页面数据
   */
  about();

  /**
   * 校验设备型号和文件是否已经存在
   */
  queryDeviceProtocolByEquipmentModel(data: FormData);

  /**
   * 根据产品的appId查询第三方服务地址
   * param appId
   */
  findPlatformAppInfoByAppId(appId: string);

  /**
   * 测试备份地址是否正确
   * param data
   */
  backupAddrTest(data: {backupLocation: string; backupAddr: string});

}
