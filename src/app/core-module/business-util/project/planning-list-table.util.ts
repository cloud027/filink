import {LanguageEnum} from '../../../shared-module/enum/language.enum';
import {NzI18nService} from 'ng-zorro-antd';
import {ColumnConfig} from '../../../shared-module/model/table-config.model';
import {CommonUtil} from '../../../shared-module/util/common-util';
import {PointStatusEnum} from '../../enum/plan/point-status.enum';
import {SelectModel} from '../../../shared-module/model/select.model';
import {RuleUtil} from '../../../shared-module/util/rule-util';
import {DateFormatStringEnum} from '../../../shared-module/enum/date-format-string.enum';

export class PlanningListTableUtil {
  /**
   * 获取规划列表表格配置
   * @param that 调用该方法的对象
   * @param $nzI18n 语言包
   */
  static getColumnConfig(that, $nzI18n: NzI18nService): ColumnConfig[] {
    const commonLanguage = $nzI18n.getLocaleData(LanguageEnum.common);
    const language = $nzI18n.getLocaleData(LanguageEnum.planProject);
    return [
      { // 选择
        type: 'select',
        fixedStyle: {fixedLeft: true, style: {left: '0px'}},
        width: 62
      },
      { // 序号
        type: 'serial-number',
        width: 62,
        title: commonLanguage.serialNumber,
        fixedStyle: {fixedLeft: true, style: {left: '62px'}}
      },
      { // 规划名称
        title: language.planName, key: 'planName', width: 150,
        isShowSort: true,
        searchable: true,
        searchConfig: {type: 'input'}
      },
      { // 规划编号
        title: language.planCode, key: 'planCode', width: 150,
        isShowSort: true,
        searchable: true,
        searchConfig: {type: 'input'}
      },
      { // 规划模型
        title: language.scaleNumber, key: 'scaleNumber', width: 150,
        isShowSort: true,
        searchable: true,
        searchConfig: {type: 'input'}
      },
      { // 已建设数量
        title: language.alreadyBuiltNumber, key: 'alreadyBuiltNumber', width: 150,
        isShowSort: true,
        searchable: true,
        searchConfig: {type: 'input'}
      },
      { // 建设中数量
        title: language.beingBuiltNumber, key: 'beingBuiltNumber', width: 150,
        isShowSort: true,
        searchable: true,
        searchConfig: {type: 'input'}
      },
      { // 规划区域
        title: language.areaName, key: 'areaName', width: 150,
        isShowSort: true,
        searchable: true,
        searchConfig: {type: 'input'}
      },
      { // 规划录入日期
        title: language.createTime, key: 'createTime', width: 150,
        isShowSort: true,
        searchable: true,
        searchConfig: {type: 'dateRang'},
        pipe: 'date',
        pipeParam: DateFormatStringEnum.date
      },
      { // 规划录入日期
        title: language.planFinishTime, key: 'planFinishTime', width: 150,
        isShowSort: true,
        searchable: true,
        searchConfig: {type: 'dateRang'},
        pipe: 'date',
        pipeParam: DateFormatStringEnum.date
      },
      { // 操作列
        title: commonLanguage.operate,
        searchable: true,
        searchConfig: {type: 'operate'},
        key: '', width: 180,
        fixedStyle: {fixedRight: true, style: {right: '0px'}}
      }
    ];
  }

  /**
   * 已选智慧杆列表表格配置
   * @param that 调用的对象
   * @param $nzI18n 语言包
   */
  static getWisdomListColumnConfig(that, $nzI18n: NzI18nService): ColumnConfig[] {
    const language = $nzI18n.getLocaleData(LanguageEnum.planProject);
    const commonLanguage = $nzI18n.getLocaleData(LanguageEnum.common);
    return [
      { // 选择
        type: 'select',
        fixedStyle: {fixedLeft: true, style: {left: '0px'}},
        width: 62
      },
      { // 序号
        type: 'serial-number',
        width: 62,
        title: commonLanguage.serialNumber,
        fixedStyle: {fixedLeft: true, style: {left: '62px'}}
      },
      { // 智慧杆名称
        title: language.wisdomName, key: 'pointName', width: 150,
        isShowSort: true,
        searchable: true,
        // configurable: false,
        searchConfig: {type: 'input'}
      },
      { // 智慧杆状态
        type: 'render',
        title: language.status, key: 'pointStatus', width: 150,
        renderTemplate: that.pointStatusTemp,
        isShowSort: true,
        searchable: true,
        // configurable: true,
        searchConfig: {
          type: 'select', selectType: 'multiple',
          selectInfo: CommonUtil.codeTranslate(PointStatusEnum, $nzI18n, null, LanguageEnum.planProject) as SelectModel[],
          label: 'label',
          value: 'code'
        }
      },
      { // 所属区域
        title: language.BelongsAreaName, key: 'areaName', width: 150,
        isShowSort: true,
        searchable: true,
        // configurable: false,
        searchConfig: {type: 'input'}
      },
      { // 型号
        title: language.model, key: 'pointModel', width: 150,
        isShowSort: true,
        searchable: true,
        // configurable: false,
        searchConfig: {type: 'input'}
      },
      { // 所属规划
        title: language.planId, key: 'planName', width: 150,
        isShowSort: true,
        searchable: true,
        // configurable: true,
        searchConfig: {type: 'input'}
      },
      { // 详细地址
        title: language.address, key: 'address', width: 150,
        isShowSort: true,
        searchable: true,
        // configurable: true,
        searchConfig: {type: 'input'}
      },
    ];
  }

  static getWisdomColumnConfig(that, $nzI18n: NzI18nService): ColumnConfig[] {
    const commonLanguage = $nzI18n.getLocaleData(LanguageEnum.common);
    const language = $nzI18n.getLocaleData(LanguageEnum.planProject);
    return [
      { // 选择
        type: 'select',
        fixedStyle: {fixedLeft: true, style: {left: '0px'}},
        width: 62
      },
      { // 序号
        type: 'serial-number',
        width: 62,
        title: commonLanguage.serialNumber,
        fixedStyle: {fixedLeft: true, style: {left: '62px'}}
      },
      { // 智慧杆名称
        title: language.wisdomName, key: 'pointName', width: 150,
        isShowSort: true,
        searchable: true,
        configurable: true,
        searchConfig: {type: 'input'}
      },
      { // 智慧杆型号
        title: language.wisdomModel, key: 'pointModel', width: 150,
        isShowSort: true,
        searchable: true,
        configurable: true,
        searchConfig: {type: 'input'}
      },
      { // 智慧杆供应商
        title: language.supplierName, key: 'supplierName', width: 150,
        isShowSort: true,
        searchable: true,
        configurable: true,
        searchConfig: {type: 'input'}
      },
      { // 智慧杆状态
        title: language.status, key: 'pointStatus', width: 150,
        type: 'render',
        renderTemplate: that.pointStatusTemp,
        isShowSort: true,
        searchable: true,
        configurable: true,
        searchConfig: {
          type: 'select', selectType: 'multiple',
          selectInfo: CommonUtil.codeTranslate(PointStatusEnum, $nzI18n, null, LanguageEnum.planProject) as SelectModel[],
          label: 'label',
          value: 'code'
        }
      },
      { // 所属规划
        title: language.planId, key: 'planName', width: 150,
        isShowSort: true,
        searchable: true,
        configurable: true,
        searchConfig: {type: 'input'}
      },
      { // 所属区域
        title: language.BelongsAreaName, key: 'areaName', width: 150,
        isShowSort: true,
        searchable: true,
        configurable: true,
        searchConfig: {type: 'input'}
      },
      { // 操作列
        title: commonLanguage.operate,
        searchable: true,
        searchConfig: {type: 'operate'},
        key: '', width: 180,
        fixedStyle: {fixedRight: true, style: {right: '0px'}}
      },
    ];
  }
  static getDeleteWisdomColumnConfig(that, $nzI18n: NzI18nService): ColumnConfig[] {
    const commonLanguage = $nzI18n.getLocaleData(LanguageEnum.common);
    const language = $nzI18n.getLocaleData(LanguageEnum.planProject);
    return [
      { // 选择
        type: 'select',
        fixedStyle: {fixedLeft: true, style: {left: '0px'}},
        width: 62
      },
      { // 序号
        type: 'serial-number',
        width: 62,
        title: commonLanguage.serialNumber,
        fixedStyle: {fixedLeft: true, style: {left: '62px'}}
      },
      { // 智慧杆名称
        title: language.wisdomName, key: 'pointName', width: 150,
        isShowSort: true,
        searchable: true,
        searchConfig: {type: 'input'}
      },
      { // 智慧杆型号
        title: language.wisdomModel, key: 'pointModel', width: 150,
        isShowSort: true,
        searchable: true,
        searchConfig: {type: 'input'}
      },
      { // 智慧杆状态
        title: language.status, key: 'pointStatus', width: 150,
        type: 'render',
        renderTemplate: that.pointStatusTemp,
        isShowSort: true,
        searchable: true,
        searchConfig: {
          type: 'select', selectType: 'multiple',
          selectInfo: CommonUtil.codeTranslate(PointStatusEnum, $nzI18n, null, LanguageEnum.planProject) as SelectModel[],
          label: 'label',
          value: 'code'
        }
      },
      { // 所属规划
        title: language.planId, key: 'planName', width: 150,
        isShowSort: true,
        searchable: true,
        searchConfig: {type: 'input'}
      },
      { // 所属区域
        title: language.BelongsAreaName, key: 'areaName', width: 150,
        isShowSort: true,
        searchable: true,
        searchConfig: {type: 'input'}
      },
      { // 操作列
        title: commonLanguage.operate,
        searchable: true,
        searchConfig: {type: 'operate'},
        key: '', width: 180,
        fixedStyle: {fixedRight: true, style: {right: '0px'}}
      },
    ];
  }
  static getWisdomFormColumnConfig($nzI18n: NzI18nService, that?) {
    const language = $nzI18n.getLocaleData(LanguageEnum.planProject);
    return [
      { // 智慧杆名称
        label: language.wisdomName,
        key: 'pointName',
        type: 'input',
        col: 24,
        require: true,
        rule: [{required: true}, RuleUtil.getNameMaxLengthRule(255)],
        customRules: [],
      },
      { // 所属区域
        label: language.BelongsAreaName,
        key: 'areaCode',
        type: 'custom',
        template: that.areaTemp,
        col: 24,
        require: true,
        rule: [{required: true}, RuleUtil.getNameMaxLengthRule(255)],
        customRules: [],
      },
      { // 智慧杆型号
        label: language.wisdomModel,
        key: 'productId',
        type: 'custom',
        template: that.wisdomModelTemp,
        col: 24,
        require: true,
        rule: [{required: true}, RuleUtil.getNameMaxLengthRule(255)],
        customRules: [],
      },
      { // 智慧杆状态
        label: language.status,
        key: 'pointStatus',
        type: 'select',
        selectInfo: {
          data: CommonUtil.codeTranslate(PointStatusEnum, $nzI18n, null, LanguageEnum.planProject),
          label: 'label',
          value: 'code'
        },
        col: 24,
        rule: [ RuleUtil.getNameMaxLengthRule(255)],
        customRules: [],
      },
      { // 所属规划
        label: language.planId,
        key: 'planName',
        type: 'input',
        col: 24,
        rule: [RuleUtil.getNameMaxLengthRule(255)],
        customRules: [],
      },
    ];
  }
}
