import {JobStatusEnum} from '../enum/job-status.enum';
import {ColumnConfig} from '../../../../shared-module/model/table-config.model';

export class PersonInfoConfig {
  /**
   * 班组成员表格列配置项
   * param commonLanguage
   * param scheduleLanguage
   * param jobStatusTemp 在职状态模板
   */
  public static personColumnConfig(commonLanguage, scheduleLanguage, jobStatusTemp): ColumnConfig[] {
    return [
      // 选择
      {type: 'select', fixedStyle: {fixedLeft: true, style: {left: '0'}}, width: 60},
      // 序号
      {
        type: 'serial-number', width: 60, title: commonLanguage.serialNumber,
        fixedStyle: {fixedLeft: true, style: {left: '60px'}}
      },
      // 姓名
      {
        title: scheduleLanguage.userName, key: 'personName', width: 120, isShowSort: true,
        searchable: true, configurable: false,
        searchConfig: {type: 'input'}
      },
      // 工号
      {
        title: scheduleLanguage.jobNumber, key: 'jobNumber', width: 120, isShowSort: true,
        searchable: true, configurable: false,
        searchConfig: {type: 'input'}
      },
      // 单位
      {
        title: scheduleLanguage.unit, key: 'deptName', width: 200, configurable: false,
        searchable: true, isShowSort: true,
        // searchConfig: {type: 'render', renderTemplate: this.unitNameSearch}
        searchConfig: {type: 'input'}
      },
      // 手机号
      {
        title: scheduleLanguage.phoneNumber, key: 'phoneNumber', width: 150, isShowSort: true,
        searchable: true, configurable: false,
        searchConfig: {type: 'input'}
      },
      {
        // 岗位
        title: scheduleLanguage.workPosition, key: 'workPosition', width: 120, isShowSort: true,
        searchable: true, configurable: false,
        searchConfig: {type: 'input'}
      },
      // 在职状态
      {
        title: scheduleLanguage.jobStatus, key: 'onJobStatus', width: 120, isShowSort: true,
        searchable: true, configurable: false,
        type: 'render',
        minWidth: 80,
        renderTemplate: jobStatusTemp,
        searchConfig: {
          type: 'select',
          selectInfo: [
            {label: scheduleLanguage.work, value: JobStatusEnum.work},
            {label: scheduleLanguage.resign, value: JobStatusEnum.resign}
          ]
        }
      },
      // 入职日期
      {
        title: scheduleLanguage.entryTime, key: 'entryTime', width: 180, isShowSort: true,
        searchable: true,
        configurable: false,
        pipe: 'date',
        pipeParam: 'yyyy-MM-dd',
        searchConfig: {type: 'dateRang'}
      },
      // 离职日期
      {
        title: scheduleLanguage.leaveTime, key: 'leaveTime', width: 180, isShowSort: true,
        searchable: true,
        configurable: false,
        pipe: 'date',
        pipeParam: 'yyyy-MM-dd',
        searchConfig: {type: 'dateRang'}
      },
      // 备注
      {
        title: scheduleLanguage.remark, key: 'remark', width: 150, isShowSort: true,
        searchable: true, configurable: false,
        searchConfig: {type: 'input'}
      },
      {
        title: commonLanguage.operate, key: '', width: 80,
        configurable: false,
        searchable: true,
        searchConfig: {type: 'operate'},
        fixedStyle: {fixedRight: true, style: {right: '0px'}}
      }
    ];
  }
}
