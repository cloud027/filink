import {FacilityForCommonUtil} from '../../../../core-module/business-util/facility/facility-for-common.util';
import {AbstractControl} from '@angular/forms';
import {CommonUtil} from '../../../../shared-module/util/common-util';
import {RuleUtil} from '../../../../shared-module/util/rule-util';
import {IsSelectAllEnum} from '../../share/enum/clear-barrier-work-order.enum';
import {ResultCodeEnum} from '../../../../shared-module/enum/result-code.enum';
import {DeviceTypeEnum} from '../../../../core-module/enum/facility/facility.enum';
import {EquipmentTypeEnum} from '../../../../core-module/enum/equipment/equipment.enum';

/**
 * 新增/编辑安装工单表单配置
 */
export  class InstallDetailFormUtil {
  /**
   * 初始化表单
   */
  public static initInstallationForm(that): void {
    const typeList = FacilityForCommonUtil.getRoleEquipmentType(that.$nzI18n);
    // 过滤电子锁相关
    const equipmentTypes = [];
    typeList.forEach(item => {
      if (item.code !== EquipmentTypeEnum.intelligentEntranceGuardLock) {
        equipmentTypes.push(item);
      }
    });
    that.formColumn = [
      { // 工单名称
        label: that.inspectionLanguage.workOrderName,
        key: 'title', type: 'input', require: true,
        disabled: that.isCanSelect,
        rule: [
          {required: true},
          RuleUtil.getNameMaxLengthRule(),
          RuleUtil.getAlarmNamePatternRule(that.inspectionLanguage.nameCodeMsg)
        ],
        customRules: [that.$ruleUtil.getNameCustomRule()],
        asyncRules: [
          that.$ruleUtil.getNameAsyncRule(value => that.$installService.checkInstallOrderName(CommonUtil.trim(value), that.procId),
            res => {
            if (res.code === ResultCodeEnum.success) {
              that.checkName = true;
              return true;
            } else {
              that.checkName = false;
              return false;
            }
          })
        ]
      },
      { // 工单类型
        label: that.inspectionLanguage.typeOfWorkOrder, key: 'procType',
        disabled: true, require: true, type: 'input',
        initialValue: that.inspectionLanguage.installOrder, rule: []
      },
      { // 任务描述
        label: that.inspectionLanguage.taskDesc,
        key: 'taskDesc', type: 'input',
        disabled: that.isCanSelect,
        rule: [{minLength: 0}, {maxLength: 255}],
      },
      {// 设施名称
        label: that.inspectionLanguage.devicesName,
        key: 'devicesName', type: 'custom',
        require: true,
        rule: [{required: true}],
        template: that.selectDeviceTemp,
      },
      {// 设施区域
        label: that.inspectionLanguage.deviceArea,
        key: 'deviceArea', type: 'input',
        disabled: true,
        require: true,
        rule: [{required: true}]
      },
      {// 设施类型
        label: that.inspectionLanguage.deviceType,
        key: 'deviceType', type: 'input',
        disabled: true,
        require: true,
        rule: [{required: true}]
      },
      {// 设施型号
        label: that.inspectionLanguage.deviceModel,
        key: 'deviceModel', require: true,
        disabled: true,
        type: 'input',
        rule: [{required: true}],
      },
      { // 是否新增设备
        label: that.inspectionLanguage.isAddEquip,
        key: 'isGenerateEquipment', type: 'radio',
        require: true,
        rule: [{required: true}],
        initialValue: IsSelectAllEnum.deny,
        radioInfo: {
          data: [
            {label: that.inspectionLanguage.right, value: IsSelectAllEnum.right}, // 是
            {label: that.inspectionLanguage.deny, value: IsSelectAllEnum.deny}, // 否
          ],
          label: 'label', value: 'value'
        },
        modelChange: (controls, event, key, formOperate) => {
          that.equipmentName = null;
          that.equipModel = null;
          that.wisdomMountPosition = null;
          that.formStatus.resetControlData('assetCode', null);
          that.formStatus.resetControlData('equipmentType', null);
          that.formStatus.resetControlData('equipmentModel', null);
          that.formStatus.resetControlData('pointPosition', null);
          if (event === IsSelectAllEnum.right) {
            that.isAddEquip = true;
            that.isEquipModel = false;
            that.isPoint = false;
            that.showPointSelect = true;
            that.formColumn.forEach(v => {
              if (v.key === 'assetCode') {
                v.hidden = false;
              }
            });
            that.formStatus.group.controls['equipmentType'].enable();
          } else {
            that.isAddEquip = false;
            that.isEquipModel = true;
            that.isPoint = true;
            that.showPointSelect = false;
            that.formStatus.group.controls['equipmentType'].disable();
            that.formColumn.forEach(v => {
              if (v.key === 'assetCode') {
                v.hidden = true;
              }
            });
          }
        }
      },
      {// 设备名称
        label: that.inspectionLanguage.equipmentName,
        key: 'equipmentName', type: 'custom',
        require: true,
        template: that.equipmentTemp,
        rule: [
          {required: true},
          RuleUtil.getNameMaxLengthRule(),
          that.$ruleUtil.getNameRule()
        ],
        customRules: [that.$ruleUtil.getNameCustomRule()],
      },
      {  // 资产编码
        label: that.inspectionLanguage.assetCode,
        key: 'assetCode', type: 'input',
        hidden: true,
        rule: [
          RuleUtil.getMaxLength40Rule(),
          RuleUtil.getCodeRule(that.inspectionLanguage.nameCodeMsg)
        ],
        customRules: [that.$ruleUtil.getNameCustomRule()],
        asyncRules: [
          that.$ruleUtil.getNameAsyncRule(value => that.$installService.checkEquipmentCodeIsExist('', value),
              res => res.data, that.inspectionLanguage.equipmentCodeExist)
        ],
      },
      { // 设备类型
        label: that.inspectionLanguage.equipmentType,
        key: 'equipmentType', type: 'select',
        require: true, disabled: true,
        rule: [{required: true}],
        selectInfo: {
          data: equipmentTypes,
          label: 'label', value: 'code',
        },
        modelChange: (controls, event, key, formOperate) => {
          if (that.selectDeviceList.length) {
            const devType = that.selectDeviceList[0].deviceType;
            // 智慧杆才可以有挂载点位
            const isAddEquipment = that.formStatus.getData('isGenerateEquipment');
            if (devType === DeviceTypeEnum.wisdom && isAddEquipment === IsSelectAllEnum.right) {
              that.getMountPoint();
              that.isPoint = false;
            }
          }
          // 清空型号和点位
          that.equipModelData = [];
          that.equipModel = '';
          that.wisdomMountPosition = null;
          that.formStatus.resetControlData('equipmentModel', null);
          that.formStatus.resetControlData('pointPosition', null);
          that.formStatus.group.controls['pointPosition'].reset(null);
        }
      },
      {// 设备型号
        label: that.inspectionLanguage.equipmentModel,
        key: 'equipmentModel', type: 'custom',
        require: true, rule: [{required: true}],
        template: that.equipModelTemp
      },
      {// 选择点位
        label: that.inspectionLanguage.selectPoint,
        key: 'pointPosition',
        rule: [], type: 'custom',
        template: that.positionDevTemplate,
      },
      { // 是否自动派单
        label: that.inspectionLanguage.autoDispatch,
        key: 'autoDispatch', type: 'custom',
        require: true,
        rule: [{required: true}],
        template: that.autoDispatch,
        initialValue: IsSelectAllEnum.deny
      },
      {// 责任单位
        label: that.inspectionLanguage.responsibleUnit,
        key: 'accountabilityDept',
        type: 'custom', rule: [],
        template: that.departmentSelector,
      },
      { // 期望完工时间
        label: that.inspectionLanguage.inspectionEndTime,
        key: 'planCompletedTime', type: 'custom',
        template: that.ecTimeTemp, require: true,
        rule: [{required: true}], disabled: that.isCanSelect,
        customRules: [{
          code: 'isTime', msg: null,
            validator: (control: AbstractControl): { [key: string]: boolean } => {
            if (control.value && CommonUtil.sendBackEndTime(new Date(control.value).getTime()) < new Date().getTime()) {
              if (that.formStatus.group.controls['planCompletedTime'].dirty) {
                that.$message.info(that.inspectionLanguage.expectedCompletionTimeMustBeGreaterThanCurrentTime);
                return {isTime: true};
              }
            } else {
              return null;
            }
          }
        }]
      },
      {// 备注
        label: that.inspectionLanguage.remark,
        key: 'remark', type: 'textarea',
        rule: [{minLength: 0}, {maxLength: 255}]
      }
    ];
  }
}
