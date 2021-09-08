import {RuleUtil} from '../../../../shared-module/util/rule-util';
import {CommonUtil} from '../../../../shared-module/util/common-util';
import {ResultCodeEnum} from '../../../../shared-module/enum/result-code.enum';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {IsSelectAllEnum} from '../../share/enum/clear-barrier-work-order.enum';
import {WorkOrderPageTypeEnum} from '../../share/enum/work-order-page-type.enum';

/**
 * 任务表单配置
 */
export class InspectionTaskDetailUtil {
  /**
   * 巡检任务表单初始化
   */
  public static initTaskFormColumn(that): void {
    that.formColumn = [
      { // 巡检任务名称
        label: that.language.inspectionTaskName, labelWidth: 180,
        key: 'inspectionTaskName',
        type: 'input',
        require: true,
        disabled: that.isView,
        rule: [{required: true},
          RuleUtil.getNameMinLengthRule(),
          RuleUtil.getNameMaxLengthRule(),
          RuleUtil.getAlarmNamePatternRule(that.InspectionLanguage.nameCodeMsg)
        ],
        asyncRules: [
          that.$ruleUtil.getNameAsyncRule(value => that.$inspectionWorkOrderService.checkName(CommonUtil.trim(value),
            that.updateStatus ? that.inspectionTaskId : null),
            res => res.code === ResultCodeEnum.success)
        ],
        modelChange: (controls, event, key, formOperate) => {
          that.inspectionTaskName = event;
        }
      },
      { // 巡检周期
        label: that.language.inspectionCycle, labelWidth: 180,
        key: 'taskPeriod',
        type: 'input',
        disabled: that.isView,
        require: true,
        rule: [{required: true}, that.$ruleUtil.getTaskPeriodRule()],
      },
      { // 巡检工单期望用时
        label: that.language.taskExpectedTime, labelWidth: 180,
        key: 'procPlanDate',
        type: 'input',
        disabled: that.isView,
        require: true,
        rule: [{required: true}, that.$ruleUtil.getProcPlanDateRule()],
      },
      { // 起始时间
        label: that.language.startTime, labelWidth: 180,
        key: 'taskStartTime',
        type: 'custom',
        require: true,
        disabled: that.isView, rule: [{required: true}],
        template: that.taskStartTimeTemp,
        asyncRules: [{
          asyncRule: (control: FormControl) => {
            that.dateStart = control.value;
            const start = (new Date(control.value)).getTime();
            const end = (new Date(that.dateEnd)).getTime();
            if (start > end && end > 0) {
              that.$modalService.error(that.language.startTimeTip);
              that.dateStart = null;
              return Observable.create(observer => {
                that.checkTime = true;
                observer.next(null);
                observer.complete();
                that.formStatus.resetControlData('taskStartTime', null);
              });
            } else {
              that.checkTime = false;
            }
            return Observable.create(observer => {
              that.today = new Date();
              if (control.value !== null && control.value > that.today) {
                observer.next(null);
                observer.complete();
                that.checkTime = false;
              } else {
                that.checkTime = true;
                that.dateStart = null;
                that.formStatus.resetControlData('taskStartTime', null);
                observer.next({error: true, duplicated: true});
                observer.complete();
              }
            });
          },
        }],
      },
      { // 结束时间
        label: that.language.endTime, labelWidth: 180,
        key: 'taskEndTime',
        type: 'custom',
        disabled: that.isView, rule: [],
        template: that.taskEndTimeTemp,
        asyncRules: [{
          asyncRule: (control: FormControl) => {
            const start = (new Date(that.dateStart)).getTime();
            const end = new Date(control.value).getTime();
            if (!control.value) {
              return Observable.create(observer => {
                observer.next(null);
                observer.complete();
              });
            }
            that.dateEnd = control.value;
            if (start > end) {
              that.$modalService.error(that.language.endTimeIsGreaterThanStartTime);
              that.dateEnd = null;
              that.formStatus.resetControlData('taskEndTime', '');
              return Observable.create(observer => {
                observer.next(null);
                observer.complete();
              });
            }
            return Observable.create(observer => {
              if (that.dateEnd < that.dateStart && that.dateEnd) {
                that.$modalService.info(`${that.language.endTimeTip}`);
              }
              if (!that.dateStart || that.dateStart > that.dateEnd) {
                that.$modalService.info(that.language.firstSelectEndDateTip);
                that.formStatus.resetControlData('taskEndTime', '');
              }
              if (control.value !== null && control.value > that.dateStart) {
                observer.next(null);
                observer.complete();
              } else {
                observer.next({error: true, duplicated: true});
                observer.complete();
              }
            });
          },
        }],
      },
      { // 是否自动派单
        label: that.InspectionLanguage.autoDispatch,
        key: 'autoDispatch', type: 'custom',
        require: true, labelWidth: 180,
        rule: [{required: true}],
        template: that.autoDispatch,
        initialValue: IsSelectAllEnum.deny
      },
      { // 责任单位
        label: that.language.responsibleUnit, labelWidth: 180,
        key: 'departmentList',
        type: 'custom',
        template: that.departmentSelectorTemp,
        require: true, rule: [{required: true}]
      },
      {// 巡检区域
        label: that.language.inspectionArea, labelWidth: 180,
        key: 'inspectionAreaName',
        type: 'custom',
        template: that.areaSelectorTemp,
        require: true, rule: [{required: true}],
      },
      { // 是否巡检全集
        label: that.language.whetherCompleteWorks, labelWidth: 180,
        key: 'isSelectAll',
        type: 'radio', require: true,
        disabled: that.isView, rule: [{required: true}],
        initialValue: that.defaultStatus,
        radioInfo: {
          data: [
            {label: that.language.right, value: IsSelectAllEnum.right}, // 表示巡检全集
            {label: that.language.deny, value: IsSelectAllEnum.deny}, // 表示不巡检全集
          ], label: 'label', value: 'value'
        },
        modelChange: (controls, event, key, formOperate) => {
          that.isSelectAll = event;
          that.equipmentName = '';
          // 新增只在区域选择时调用设施区域关联接口
          if (that.pageType === WorkOrderPageTypeEnum.add && that.isSelectAll === IsSelectAllEnum.right && that.areaName !== '') {
            // 设施总数
            that.selectDeviceNumber = that.deviceData.length + '';
            that.formStatus.resetControlData('inspectionDeviceCount', that.selectDeviceNumber);
            that.inspectionFacilitiesSelectorName = that.selectDeviceName;
            that.equipmentName = that.selectEquipmentName;
          }
          if (event === IsSelectAllEnum.deny) {
            that.inspectionFacilitiesSelectorDisabled = false;
          } else if (event === IsSelectAllEnum.right && that.isChooseAll) {
            that.inspectionFacilitiesSelectorDisabled = true;
            that.queryDeviceByArea(that.inspectionAreaCode);
          }
          if ((that.isChooseAll || that.pageType === WorkOrderPageTypeEnum.add) && event === '0') {
            that.inspectionFacilitiesSelectorName = '';
            that.formStatus.resetControlData('deviceName', '');
            that.formStatus.resetControlData('inspectionDeviceCount', '');
            that.equipmentSelectList = [];
            that.equipmentListValue = [];
          }/* else {
            that.formStatus.resetControlData('deviceName', that.inspectionFacilitiesSelectorName);
            that.formStatus.resetControlData('inspectionDeviceCount', that.deviceList.length);
          }*/
          that.isChooseAll = true;
        }
      },
      { // 巡检设施
        label: that.language.inspectionFacility, labelWidth: 180,
        key: 'deviceName', type: 'custom',
        require: true, rule: [{required: true}],
        template: that.inspectionFacilitiesSelectorTemp,
      },
      { // 设备类型
        label: that.language.equipmentType,
        key: 'equipmentType', labelWidth: 180, rule: [], type: 'custom',
        template: that.equipmentListTemp,
        initialValue: that.equipmentSelectList,
      },
      { // 是否生成多个工单
        label: that.language.isCreatMultiWorkOrder, labelWidth: 180,
        key: 'isMultipleOrder', type: 'radio', disabled: that.isView, rule: [],
        initialValue: IsSelectAllEnum.deny,
        radioInfo: {
          data: [
            {label: that.language.right, value: IsSelectAllEnum.right}, // 表示生成多个
            {label: that.language.deny, value: IsSelectAllEnum.deny}, // 表示不生成多个
          ], label: 'label', value: 'value'
        },
        modelChange: (controls, event, key, formOperate) => {
          that.isMultipleOrder = event;
        }
      },
      { // 巡检模板
        label: that.language.inspectionTemplate, labelWidth: 180,
        key: 'inspectionTemplate',
        type: 'custom',
        require: true, rule: [{required: true}],
        template: that.inspectionTemplate,
      },
      { // 巡检设施总数
        label: that.language.totalInspectionFacilities, labelWidth: 180,
        key: 'inspectionDeviceCount',
        type: 'input',
        disabled: true,
        require: true, rule: [{required: true}],
        placeholder: that.language.automaticGenerated,
      },
    ];
  }
}
