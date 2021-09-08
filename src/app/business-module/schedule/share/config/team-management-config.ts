export class TeamManagementConfig {

  /**
   * 初始化班组管理列表配置项
   * param commonLanguage
   * param scheduleLanguage
   * param teamMemberTpl
   */
  public static initTeamManagementColumnConfig(commonLanguage, scheduleLanguage, configurable, teamMemberTpl = null, unitNameSearchTpl = null) {
    return [
      // 选择
      {type: 'select', fixedStyle: {fixedLeft: true, style: {left: '0'}}, width: 60},
      // 序号
      {
        type: 'serial-number', width: 60, title: commonLanguage.serialNumber,
        fixedStyle: {fixedLeft: true, style: {left: '60px'}}
      },
      // 单位
      {
        title: scheduleLanguage.unit, key: 'deptName', width: 150, isShowSort: true,
        searchable: true, configurable,
        searchKey: unitNameSearchTpl ? 'deptCodeList' : 'deptName',
        searchConfig: {type: unitNameSearchTpl ? 'render' : 'input', renderTemplate: unitNameSearchTpl}
      },
      // 班组名称
      {
        title: scheduleLanguage.teamName, key: 'teamName', width: 150, isShowSort: true,
        searchable: true, configurable,
        searchConfig: {type: 'input'}
      },
      // 班组成员
      {
        title: scheduleLanguage.teamMember, key: 'personInformationNames', width: 150,
        searchable: true, configurable,
        searchKey: teamMemberTpl ? 'personIdList' : 'personName',
        searchConfig: {type: teamMemberTpl ? 'render' : 'input', renderTemplate: teamMemberTpl}
      },
      // 备注
      {
        title: scheduleLanguage.remark, key: 'remark', width: 150, isShowSort: true,
        searchable: true, configurable,
        searchConfig: {type: 'input'}
      },
      { // 操作列
        title: commonLanguage.operate,
        searchable: true,
        searchConfig: {type: 'operate'},
        key: '', width: 80,
        fixedStyle: {fixedRight: true, style: {right: '0px'}}
      },
    ];
  }
}
