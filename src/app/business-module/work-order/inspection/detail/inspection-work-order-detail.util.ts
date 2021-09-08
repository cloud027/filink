import {Observable} from 'rxjs';
import {CommonUtil} from '../../../../shared-module/util/common-util';
import {ResultCodeEnum} from '../../../../shared-module/enum/result-code.enum';
import {
  ClearBarrierOrInspectEnum,
  IsSelectAllEnum,
  IsSelectAllItemEnum, ResourceTypeEnum
} from '../../share/enum/clear-barrier-work-order.enum';
import {FacilityForCommonUtil} from '../../../../core-module/business-util/facility/facility-for-common.util';
import {WorkOrderPageTypeEnum} from '../../share/enum/work-order-page-type.enum';
import {ResultModel} from '../../../../shared-module/model/result.model';
import {WorkOrderBusinessCommonUtil} from '../../share/util/work-order-business-common.util';
import {RuleUtil} from '../../../../shared-module/util/rule-util';
import {WorkOrderFormLabelWidth} from '../../share/const/work-order.const';

/**
 * 表单配置
 */
export class InspectionDetailUtil {
  /**
   * 初始化表单
   */
  public static initInspectionForm(that): void {
    that.formColumn = [
      { // 工单名称
        label: that.InspectionLanguage.workOrderName,
        key: 'title', type: 'input', require: true,
        disabled: that.disabledIf,
        placeholder: that.InspectionLanguage.pleaseEnter,
        rule: [
          {required: true},
          {maxLength: 32},
          RuleUtil.getAlarmNamePatternRule(that.InspectionLanguage.nameCodeMsg)],
        customRules: [that.$ruleUtil.getNameCustomRule()],
        asyncRules: [
          that.$ruleUtil.getNameAsyncRule(value => that.$inspectionWorkOrderService.checkInspectionOrderName(CommonUtil.trim(value), that.procId),
            res => res.code === ResultCodeEnum.success)
        ],
        modelChange: (controls, event, key, formOperate) => {
          that.inspectionName = event;
        }
      },
      {// 工单类型
        label: that.InspectionLanguage.typeOfWorkOrder,
        key: 'procResourceType', type: 'input',
        disabled: true, require: true, rule: [],
        initialValue: that.InspectionLanguage.inspection,
      },
      {// 巡检起始时间
        label: that.InspectionLanguage.inspectionStartTime,
        key: 'inspectionStartTime', type: 'custom',
        require: true, rule: [],
        template: that.inspectionStartDate,
        disabled: that.disabledIf,
        asyncRules: [{
          asyncRule: (control: any) => {
            that.dateStart = control.value;
            const start = (new Date(control.value)).getTime();
            const end = (new Date(that.dateEnd)).getTime();
            if (start > end && end > 0) {
              that.$modalService.error(that.InspectionLanguage.startTimeTip);
              that.dateStart = null;
              that.formStatus.resetControlData('inspectionStartTime', '');
              return Observable.create(observer => {
                observer.next(null);
                observer.complete();
              });
            }
            return Observable.create(observer => {
              if (control.value && start < end) {
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
      {// 巡检结束时间
        label: that.InspectionLanguage.inspectionEndTime,
        key: 'inspectionEndTime', type: 'custom',
        require: true, rule: [],
        template: that.inspectionEndDate,
        disabled: that.disabledIf,
        asyncRules: [{
          asyncRule: (control: any) => {
            that.dateEnd = control.value;
            if (!control.value) {
              return Observable.create(observer => {
                observer.next(null);
                observer.complete();
              });
            }
            const start = (new Date(that.dateStart)).getTime();
            const end = new Date(control.value).getTime();
            if (start > end) {
              that.$modalService.error(that.InspectionLanguage.endTimeIsGreaterThanStartTime);
              that.dateEnd = null;
              that.formStatus.resetControlData('inspectionEndTime', '');
              that.formStatus.resetControlData('lastDays', '');
              return Observable.create(observer => {
                observer.next(null);
                observer.complete();
              });
            }
            return Observable.create(observer => {
              let flag = true;
              if (that.dateEnd < that.dateStart && that.dateEnd) {
                flag = false;
                that.$modalService.info(`${that.InspectionLanguage.endTimeTip}`);
              }
              if (control.value && control.value > that.dateStart) {
                if (!that.dateStart || that.dateStart > that.dateEnd) {
                  flag = false;
                  that.$modalService.info(`${that.InspectionLanguage.firstSelectEndDateTip}`);
                  that.formStatus.resetControlData('inspectionEndTime', '');
                }
                observer.next(null);
                observer.complete();
              } else {
                observer.next({error: true, duplicated: true});
                observer.complete();
              }
              if (flag) {
                const nowDate = new Date().getTime();
                if (that.dateEnd) {
                  that.lastDays = Math.ceil(((that.dateEnd - nowDate) / 86400 / 1000) - 1);
                  that.formStatus.resetControlData('lastDays', that.lastDays);
                }
              }
            });
          },
        }],
      },
      {// 剩余天数
        label: that.InspectionLanguage.daysRemaining,
        disabled: true, key: 'lastDays',
        type: 'input', initialValue: '0', rule: [],
      },
      {// 巡检区域
        label: that.InspectionLanguage.inspectionArea,
        key: 'inspectionAreaName', type: 'custom',
        disabled: that.disabledIf,
        require: true, inputType: '', rule: [],
        template: that.areaSelector,
      },
      {// 设施类型
        label: that.InspectionLanguage.deviceType,
        key: 'deviceType', type: 'select',
        disabled: true, require: true,
        selectInfo: {
          data: FacilityForCommonUtil.getRoleFacility(that.$nzI18n),
          label: 'label', value: 'code',
        },
        rule: [],
        modelChange: (controls, event, key, formOperate) => {
          if (that.areaName === '') {
            that.$modalService.error(that.InspectionLanguage.pleaseSelectTheAreaInformationFirstTip);
            return;
          }
          // 过滤设备类型
          that.equipmentSelectList = [];
          that.equipmentListValue = [];
          that.equipmentSelectList = (WorkOrderBusinessCommonUtil.filterEquipmentTypes(event, that.$nzI18n)).equipList;
          that.equipmentListValue = (WorkOrderBusinessCommonUtil.filterEquipmentTypes(event, that.$nzI18n)).equipType;
          // 保存所选设施
          that.deviceType = event;
          that.changeDevice = event;
          that.InquireDeviceTypes = [];
          that.InquireDeviceTypes.push(event);
          that.isSelectAll = IsSelectAllItemEnum.isSelectAll;
          if (that.changeDevice) {
            //  获取区域id下的设施参数
            if (that.disabledIf) {
              that.equipDisabled = true;
            } else {
              if (that.isChooseDevice) {
                that.queryInspectionDeviceByArea(that.deviceAreaCode);
              } else {
                that.isChooseDevice = true;
              }
              that.equipDisabled = false;
            }
          }
        },
      },
      { // 设备类型
        label: that.InspectionLanguage.equipmentType,
        key: 'equipmentType', type: 'custom', rule: [],
        template: that.equipmentListTemp,
        initialValue: that.equipmentSelectList,
      },
      { // 是否巡检全集
        label: that.InspectionLanguage.whetherCompleteWorks,
        key: 'isSelectAll', type: 'radio',
        require: true, disabled: that.disabledIf,
        rule: [{required: true}],
        initialValue: that.isSelectAll,
        radioInfo: {
          data: [
            {label: that.InspectionLanguage.right, value: IsSelectAllEnum.right}, // 是
            {label: that.InspectionLanguage.deny, value: IsSelectAllEnum.deny}, // 否
          ],
          label: 'label', value: 'value'
        },
        modelChange: (controls, event, key, formOperate) => {
          that.isSelectAll = event;
          if (that.deviceType !== null) {
            that.changeInspectionFacilities(event);
          }
          if (event === IsSelectAllEnum.deny && that.isChooseAll) {
            that.inspectEquipmentName = '';
            that.inspectionFacilitiesSelectorName = '';
            that.formStatus.resetControlData('deviceList', '');
            that.formStatus.resetControlData('inspectionEquipment', '');
          }
          if (event === IsSelectAllEnum.right && that.isChooseAll) {
            that.equipmentListValue = that.equipmentSelectList.map(v => {
              return v.code;
            });
            if (that.deviceAreaCode) {
              that.queryInspectionDeviceByArea(that.deviceAreaCode);
            }
          }
          that.isChooseAll = true;
        }
      },
      {// 巡检设施
        label: that.InspectionLanguage.inspectionFacility,
        key: 'deviceList', type: 'custom',
        disabled: that.disabledIf, require: true,
        template: that.inspectionFacilitiesSelector,
        rule: [{required: true}],
      },
      {// 巡检设备
        label: that.InspectionLanguage.inspectionEquipment,
        key: 'inspectionEquipment', type: 'custom',
        disabled: that.disabledIf, rule: [],
        template: that.inspectionEquipmentSelector,
      },
      { // 巡检模板
        label: that.InspectionLanguage.inspectionTemplate,
        key: 'inspectionTemplate', type: 'custom',
        disabled: that.disabledIf,
        require: true, rule: [],
        template: that.inspectionTemplate,
      },
      { // 是否自动派单
        label: that.InspectionLanguage.autoDispatch,
        key: 'autoDispatch', type: 'custom', disabled: that.isDispatch,
        require: true, rule: [{required: true}],
        template: that.autoDispatch,
        initialValue: IsSelectAllEnum.deny
      },
      {// 责任单位
        label: that.InspectionLanguage.responsibleUnit,
        key: 'deptList', type: 'custom', rule: [],
        template: that.departmentSelector,
      },
      {// 备注
        label: that.InspectionLanguage.remark,
        disabled: that.remarkDisabled,
        key: 'remark', type: 'textarea',
        rule: [{minLength: 0}, {maxLength: 255}]
      },
    ];
    that.formColumn.forEach(v => {
      v.labelWidth = WorkOrderFormLabelWidth;
    });
  }

  /**
   * 保存新增/编辑/重新生成
   */
  public static saveInspectionData(that, data): void {
    that.isLoading = true;
    data.title = CommonUtil.trim(data.title);
    data.deviceList = that.deviceList;
    data.deptList = that.deptList;
    data.procType = ClearBarrierOrInspectEnum.inspection;
    // 表示工单的来源类型是手动新增的
    data.procResourceType = ResourceTypeEnum.manuallyAdd;
    data.expectedCompletedTime = CommonUtil.sendBackEndTime(new Date(data.inspectionEndDate));
    data.selectAll = that.isSelectAll;
    data.accountabilityDept = '';
    data.accountabilityDeptName = '';
    // 取单位
    if (that.deptList && that.deptList.length > 0) {
      data.accountabilityDept = that.deptList[0].deptCode;
      data.accountabilityDeptName = that.deptList[0].accountabilityDeptName;
    }
    // 设备类型
    data.equipmentType = that.equipmentListValue.toString();
    // 设备
    if (that.equipmentListValue.length > 0) {
      data.procRelatedEquipment = that.equipList;
    } else {
      data.procRelatedEquipment = [];
    }
    // 模板
    if (that.selectTemplateData) {
      data.template = {
        templateName: that.selectTemplateData.templateName,
        templateId: that.selectTemplateData.templateId,
        inspectionItemList: that.selectTemplateData.inspectionItemList
      };
    } else {
      data.template = {};
    }
    // 设施
    data.procRelatedDevices = that.deviceList;
    if (that.pageType === WorkOrderPageTypeEnum.update || that.pageType === WorkOrderPageTypeEnum.restUpdate) {
      if (that.deviceList.length > 0) {
        data.deviceList = that.deviceList;
        data.procRelatedDevices = that.deviceList;
      } else {
        data.deviceList = that.updateDeviceList;
        data.procRelatedDevices = that.updateDeviceList;
      }
    }
    // 时间
    data.inspectionStartTime = CommonUtil.sendBackEndTime(new Date(data.inspectionStartTime).getTime());
    data.inspectionEndTime = CommonUtil.sendBackEndTime(new Date(data.inspectionEndTime).getTime());
    data.expectedCompletedTime = CommonUtil.sendBackEndTime(new Date(data.inspectionEndTime).getTime());
    data.inspectionAreaName = that.areaName;
    data.inspectionAreaId = that.inspectionAreaId;
    data.deviceAreaCode = that.deviceAreaCode;
    // 备注
    data.remark = CommonUtil.trim(data.remark);
    // 新增
    if (that.pageType === WorkOrderPageTypeEnum.add) {
      that.$inspectionWorkOrderService.addWorkUnfinished(data).subscribe((result: ResultModel<string>) => {
        that.isLoading = false;
        if (result.code === ResultCodeEnum.success) {
          that.goBack();
          that.$modalService.success(that.InspectionLanguage.operateMsg.addSuccess);
        } else {
          that.$modalService.error(result.msg);
        }
      }, () => {
        that.isLoading = false;
      });
    } else if (that.pageType === WorkOrderPageTypeEnum.update) {
      // 编辑
      data.procId = that.procId;
      that.$inspectionWorkOrderService.updateWorkUnfinished(data).subscribe((result: ResultModel<string>) => {
        that.isLoading = false;
        if (result.code === ResultCodeEnum.success) {
          that.goBack();
          that.$modalService.success(that.InspectionLanguage.operateMsg.editSuccess);
        } else {
          that.$modalService.error(result.msg);
        }
      }, () => {
        that.isLoading = false;
      });
    } else if (that.pageType === WorkOrderPageTypeEnum.restUpdate) {
      // 重新生成
      data.regenerateId = that.procId;
      that.$inspectionWorkOrderService.inspectionRegenerate(data).subscribe((result: ResultModel<string>) => {
        that.isLoading = false;
        if (result.code === ResultCodeEnum.success) {
          if (that.pageRoute && that.pageRoute === WorkOrderPageTypeEnum.finished) {
            that.$router.navigate(['/business/work-order/inspection/finished-list']).then();
          } else {
            that.$router.navigate(['/business/work-order/inspection/unfinished-list']).then();
          }
          that.$modalService.success(that.InspectionLanguage.CreateTheInspectionWorkOrderSuccessfully);
        } else {
          that.$modalService.error(result.msg);
        }
      }, () => {
        that.isLoading = false;
      });
    }
  }

}

