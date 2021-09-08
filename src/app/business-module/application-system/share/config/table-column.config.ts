import {CommonUtil} from '../../../../shared-module/util/common-util';
import {LanguageEnum} from '../../../../shared-module/enum/language.enum';
import {OnlineLanguageInterface} from '../../../../../assets/i18n/online/online-language.interface';
import {ApplicationInterface} from '../../../../../assets/i18n/application/application.interface';
import {NzI18nService} from 'ng-zorro-antd';
import {FacilityLanguageInterface} from '../../../../../assets/i18n/facility/facility.language.interface';
import {AssetManagementLanguageInterface} from '../../../../../assets/i18n/asset-manage/asset-management.language.interface';
import {LoopStatusEnum, LoopTypeEnum} from '../../../../core-module/enum/loop/loop.enum';
import {FacilityForCommonUtil} from '../../../../core-module/business-util/facility/facility-for-common.util';
import {EquipmentEnumStatus} from '../../../../core-module/enum/equipment/equipment.enum';
import {SelectModel} from '../../../../shared-module/model/select.model';
import {TemplateRef} from '@angular/core';
import {ColumnConfig, TableConfigModel} from '../../../../shared-module/model/table-config.model';
import {CommonLanguageInterface} from '../../../../../assets/i18n/common/common.language.interface';

export class TableColumnConfig {
  /**
   * 表格配置项抽取
   * @ param language 多语言
   * @ param languageTable 多语言
   */
  static equipmentColumnConfig(language: OnlineLanguageInterface,
                               languageTable: ApplicationInterface,
                               equipmentTypeTemp,
                               equipmentStatusFilterTemp,
                               $nzI18n: NzI18nService) {
    return [
      {
        type: 'serial-number',
        width: 62,
        title: language.serialNumber
      },
      // 序号
      {
        title: languageTable.equipmentTable.assetNumber,
        key: 'equipmentCode',
        width: 150,
        isShowSort: true,
        searchable: true,
        searchConfig: {type: 'input'}
      },
      // 设备名称
      {
        title: languageTable.equipmentTable.equipmentName,
        key: 'equipmentName',
        width: 150,
        searchable: true,
        isShowSort: true,
        searchConfig: {type: 'input'}
      },
      // 设备类型
      {
        title: languageTable.equipmentTable.equipmentType,
        key: 'equipmentType',
        isShowSort: true,
        type: 'render',
        width: 120,
        searchable: false,
        renderTemplate: equipmentTypeTemp
      },
      // 设备状态
      {
        title: languageTable.equipmentTable.equipmentStatus,
        key: 'equipmentStatus',
        width: 120,
        type: 'render',
        renderTemplate: equipmentStatusFilterTemp,
        searchable: true,
        isShowSort: true,
        searchConfig: {
          type: 'select', selectType: 'multiple',
          selectInfo: CommonUtil.codeTranslate(EquipmentEnumStatus, $nzI18n, null, LanguageEnum.facility),
          label: 'label',
          value: 'code'
        }
      },
      // 设备
      {
        title: languageTable.equipmentTable.equipmentModel,
        key: 'equipmentModel',
        width: 180,
        searchable: true,
        isShowSort: true,
        searchConfig: {type: 'input'}
      },
      // 供应商
      {
        title: languageTable.equipmentTable.supplier,
        key: 'supplier',
        width: 150,
        searchable: true,
        isShowSort: true,
        searchConfig: {type: 'input'}
      },
      // 报废年限
      {
        title: languageTable.equipmentTable.scrapTime,
        key: 'scrapTime',
        width: 150,
        searchable: true,
        isShowSort: true,
        searchConfig: {type: 'input'}
      },
      {
        title: language.operate,
        searchConfig: {type: 'operate'},
        searchable: true,
        key: '',
        width: 100,
        fixedStyle: {fixedRight: true, style: {right: '0px'}}
      },
    ];
  }

  /**
   * 设备配置
   * param equipmentLanguage
   * param $nzI18n
   * param equipmentTypeTemp
   * param equipmentStatusFilterTemp
   * param deviceFilterTemplate
   * param selectableEquipment
   * param noSearch
   */
  static getEquipmentConfig(equipmentLanguage: FacilityLanguageInterface,
                            $nzI18n: NzI18nService,
                            equipmentTypeTemp: TemplateRef<HTMLDocument>,
                            equipmentStatusFilterTemp: TemplateRef<HTMLDocument>,
                            deviceFilterTemplate: TemplateRef<HTMLDocument>,
                            selectableEquipment: SelectModel[] = null,
                            noSearch: boolean = false): ColumnConfig[] {
    return [
      // 序号
      {
        type: 'serial-number',
        width: 62,
        title: equipmentLanguage.serialNumber,
      },
      // 设备名称
      {
        title: equipmentLanguage.name,
        key: 'equipmentName',
        width: 200,
        isShowSort: true,
        searchable: !noSearch,
        searchConfig: {type: 'input'}
      },
      // 资产编号
      {
        title: equipmentLanguage.deviceCode,
        key: 'equipmentCode',
        width: 150,
        isShowSort: true,
        searchable: !noSearch,
        searchConfig: {type: 'input'},
      },
      { // 类型
        title: equipmentLanguage.type,
        key: 'equipmentType',
        isShowSort: true,
        type: 'render',
        width: 160,
        searchable: !noSearch,
        renderTemplate: equipmentTypeTemp,
        searchConfig: {
          type: 'select', selectType: 'multiple',
          selectInfo: selectableEquipment || FacilityForCommonUtil.getRoleEquipmentType($nzI18n),
          label: 'label',
          value: 'code'
        }
      },
      { // 状态
        title: equipmentLanguage.status,
        key: 'equipmentStatus',
        width: 130,
        type: 'render',
        renderTemplate: equipmentStatusFilterTemp,
        searchable: !noSearch,
        isShowSort: true,
        searchConfig: {
          type: 'select', selectType: 'multiple',
          selectInfo: CommonUtil.codeTranslate(EquipmentEnumStatus, $nzI18n, null, LanguageEnum.facility),
          label: 'label',
          value: 'code'
        }
      },
      { // 型号
        title: equipmentLanguage.equipmentModel,
        key: 'equipmentModel',
        width: 125,
        searchable: !noSearch,
        isShowSort: true,
        searchConfig: {type: 'input'}
      },
      { // 供应商
        title: equipmentLanguage.supplierName,
        key: 'supplier',
        width: 125,
        searchable: !noSearch,
        isShowSort: true,
        searchConfig: {type: 'input'}
      },
      { // 报废年限
        title: equipmentLanguage.scrapTime,
        key: 'scrapTime',
        width: 125,
        searchable: !noSearch,
        isShowSort: true,
        searchConfig: {type: 'input'}
      },
      { // 所属设施
        title: equipmentLanguage.affiliatedDevice,
        key: 'deviceName',
        searchKey: 'deviceId',
        width: 150,
        isShowSort: true,
        searchable: !noSearch,
        searchConfig: {
          type: 'render',
          renderTemplate: deviceFilterTemplate
        },
      },
      { // 挂载位置
        title: equipmentLanguage.mountPosition,
        key: 'mountPosition',
        width: 100,
        searchable: !noSearch,
        isShowSort: true,
        searchConfig: {type: 'input'}
      },
      // 操作
      {
        title: equipmentLanguage.operate,
        searchConfig: {type: 'operate'},
        searchable: !noSearch,
        hidden: noSearch,
        key: '',
        width: 100,
        fixedStyle: {fixedRight: true, style: {right: '0px'}}
      },
    ];
  }

  /**
   * 分组列表配置项
   * @ param language
   * @ param languageTable
   */
  static groupColumnConfig(language, languageTable, configurable?) {
    return [
      // 序号
      {
        type: 'serial-number',
        width: 62,
        title: language.serialNumber
      },
      // 分组名称
      {
        title: languageTable.equipmentTable.groupName,
        key: 'groupName',
        width: 300,
        isShowSort: true,
        configurable: configurable,
        searchable: true,
        searchConfig: {type: 'input'}
      },
      // 备注
      {
        title: languageTable.equipmentTable.remark,
        key: 'remark',
        width: 300,
        configurable: configurable,
        isShowSort: true,
        searchable: true,
        searchConfig: {type: 'input'}
      },
      {
        title: language.operate,
        searchConfig: {type: 'operate'},
        searchable: true,
        key: '',
        width: 200,
        fixedStyle: {fixedRight: true, style: {right: '0px'}}
      },
    ];
  }

  /**
   * 回路列表
   * @ param language
   * @ param languageTable
   */
  static loopColumnConfig(language: FacilityLanguageInterface,
                          assetLanguage: AssetManagementLanguageInterface,
                          $nzI18n: NzI18nService,
                          configurable?: boolean) {
    return [
      {
        type: 'serial-number',
        width: 62,
        title: language.serialNumber,
      },
      { // 回路名称
        title: language.loopName,
        key: 'loopName',
        width: 150,
        searchable: true,
        configurable: configurable,
        isShowSort: true,
        searchConfig: {type: 'input'},
      },
      { // 回路编号
        title: assetLanguage.loopCode,
        key: 'loopCode',
        width: 150,
        searchable: true,
        configurable: configurable,
        isShowSort: true,
        searchConfig: {type: 'input'}
      },
      { // 回路类型
        title: language.loopType,
        key: 'loopType',
        width: 150,
        configurable: configurable,
        searchable: true,
        isShowSort: true,
        searchConfig: {
          type: 'select', selectType: 'multiple',
          selectInfo: CommonUtil.codeTranslate(LoopTypeEnum, $nzI18n, null, LanguageEnum.facility),
          label: 'label',
          value: 'code'
        }
      },
      { // 回路状态
        title: assetLanguage.loopStatus,
        key: 'loopStatus',
        width: 150,
        configurable: configurable,
        searchable: true,
        isShowSort: true,
        searchConfig: {
          type: 'select',
          selectInfo: CommonUtil.codeTranslate(LoopStatusEnum, $nzI18n, null, LanguageEnum.facility),
          label: 'label',
          value: 'code'
        }
      },
      { // 所属配电箱
        title: language.distributionBox,
        key: 'distributionBoxName',
        width: 150,
        configurable: configurable,
        searchable: true,
        isShowSort: true,
        searchConfig: {type: 'input'}
      },
      { // 控制对象
        title: language.controlledObject,
        key: 'centralizedControlName',
        width: 150,
        configurable: configurable,
        searchable: true,
        isShowSort: true,
        searchConfig: {type: 'input'}
      },
      { // 备注
        title: language.remarks,
        key: 'remark',
        width: 150,
        configurable: configurable,
        searchable: true,
        isShowSort: true,
        searchConfig: {type: 'input'}
      },
      { // 操作
        title: language.operate,
        searchable: true,
        searchConfig: {type: 'operate'},
        key: '',
        width: 180,
        fixedStyle: {fixedRight: true, style: {right: '0px'}}
      },
    ];
  }

  static gatewayTableConfigTrigger(language: ApplicationInterface, commonLanguage: CommonLanguageInterface, editFn?, deleteFn?): TableConfigModel {
    const config = {
      isDraggable: true,
      isLoading: false,
      showSearchSwitch: false,
      showSizeChanger: true,
      scroll: {x: '500px', y: '600px'},
      noIndex: true,
      notShowPrint: true,
      columnConfig: [
        // 名称
        {
          title: language.strategyList.equipmentName,
          key: 'equipmentName',
          width: 100,
        },
        // 执行条件
        {
          title: language.strategyList.executionConditions,
          key: 'conditions',
          width: 200,
        },
      ],
      showPagination: false,
      bordered: false,
      showSearch: false,
      searchReturnType: 'Array',
      operation: [],
    };
    if (editFn && deleteFn) {
      config.columnConfig.push(this.setOperation(commonLanguage));
      config.operation = [
        // 编辑
        {
          text: language.strategyList.strategyEdit,
          className: 'fiLink-edit',
          handle: editFn
        },
        {
          text: language.strategyList.strategyDelete,
          className: 'fiLink-delete red-icon',
          needConfirm: true,
          confirmContent: `${language.strategyList.confirmDelete}?`,
          handle: deleteFn
        }
      ];
    }
    return config;
  }

  static gatewayTableConfigAction(language: ApplicationInterface, commonLanguage: CommonLanguageInterface, editFn?, deleteFn?): TableConfigModel {
    const config = {
      isDraggable: true,
      isLoading: false,
      showSearchSwitch: false,
      showSizeChanger: true,
      scroll: {x: '500px', y: '600px'},
      noIndex: true,
      notShowPrint: true,
      columnConfig: [
        // 名称
        {
          title: language.strategyList.equipmentName,
          key: 'equipmentNames',
          width: 100,
        },
        // 执行动作
        {
          title: language.strategyList.performAction,
          key: 'actions',
          width: 200,
        },
      ],
      showPagination: false,
      bordered: false,
      showSearch: false,
      searchReturnType: 'Array',
      operation: [],
    };
    if (editFn && deleteFn) {
      config.columnConfig.push(this.setOperation(commonLanguage));
      config.operation = [
        // 编辑
        {
          text: language.strategyList.strategyEdit,
          className: 'fiLink-edit',
          handle: editFn
        },
        {
          text: language.strategyList.strategyDelete,
          className: 'fiLink-delete red-icon',
          needConfirm: true,
          confirmContent: `${language.strategyList.confirmDelete}?`,
          handle: deleteFn
        }
      ];
    }
    return config;
  }

  static setOperation(commonLanguage) {
    return {
      title: commonLanguage.operate,
      searchConfig: {type: 'operate'},
      key: '',
      width: 80,
      fixedStyle: {fixedRight: true, style: {right: '0px'}}
    };
  }
}
