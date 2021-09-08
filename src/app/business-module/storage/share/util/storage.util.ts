import {CommonUtil} from '../../../../shared-module/util/common-util';
import * as _ from 'lodash';
import {DeliveryStatusEnum, DeliveryStatusIconEnum, WarehousingStatusEnum, WarehousingStatusIconEnum} from '../enum/material-status.enum';
import {ProductInfoModel} from '../../../../core-module/model/product/product-info.model';
import {SelectModel} from '../../../../shared-module/model/select.model';
import {FacilityForCommonUtil} from '../../../../core-module/business-util/facility/facility-for-common.util';
import {MaterialTypeEnum} from '../enum/material-type.enum';
import {DELIVERY_NUM_EMPTY} from '../const/storage.const';
import {MaterialOperateTypeEnum} from '../enum/material-operate-type.enum';

export class StorageUtil {
  /**
   * 获取入库状态图标
   */
  public static getWarehousingStatusIconClass(type): string {
    const classStr = CommonUtil.enumMappingTransform(type, WarehousingStatusEnum, WarehousingStatusIconEnum);
    return `iconfont fiLink-warehousing-${classStr} ${classStr}-icon`;
  }

  /**
   * 获取出库状态图标
   */
  public static getDeliveryStatusIconClass(type): string {
    const classStr = CommonUtil.enumMappingTransform(type, DeliveryStatusEnum, DeliveryStatusIconEnum);
    return `iconfont fiLink-delivery-${classStr} ${classStr}-icon`;
  }

  /**
   * 规格型号选择
   */
  public static selectModel(list: ProductInfoModel[], that): void {
    that.selectModelObject = {
      ids: list.map(v => v.productId) || [],
      name: list.map(v => v.productModel).join(',') || '',
    };
    that.modelFilterValue.filterValue = that.selectModelObject.ids.length > 0 ? that.selectModelObject.ids : null;
    that.modelFilterValue.filterName = that.selectModelObject.name;
  }

  /**
   * 获取物料类型下拉框
   */
  public static getMaterialTypeSelect($nzI18n, storageLanguage): SelectModel[] {
    // 设施
    let selectData = FacilityForCommonUtil.getRoleFacility($nzI18n);
    // 其他
    const otherSelect = [{
      label: storageLanguage.otherTotal,
      code: 'other'
    }];
    selectData = selectData.concat(FacilityForCommonUtil.getRoleEquipmentType($nzI18n), otherSelect) || [];
    return selectData;
  }

  /**
   * 处理获取的列表数据
   * @param dataSet 列表数据
   * @param operateType 入库 1，出库 2
   */
  public static handleListData(dataSet, operateType) {
    if (!_.isEmpty(dataSet)) {
      dataSet.forEach(item => {
        if (String(item.materialType) === String(MaterialTypeEnum.facility)) {
          item.iconClass = CommonUtil.getFacilityIConClass(item.materialCode);
        } else if (String(item.materialType) === String(MaterialTypeEnum.equipment)) {
          item.equipmentType = item.materialCode;
          item.iconClass = CommonUtil.getEquipmentTypeIcon(item);
        } else {
          // 如果物料类型是其他 暂时图标为空
          item.iconClass = CommonUtil.getFacilityIConClass('D000');
        }
        if (operateType !== '') {
          item.statusClass = operateType === MaterialOperateTypeEnum.warehousing ?
            this.getWarehousingStatusIconClass(item.materialStatus) : this.getDeliveryStatusIconClass(item.materialStatus);
          const materialStatus = operateType === MaterialOperateTypeEnum.warehousing ? WarehousingStatusEnum.isWareHousing : DeliveryStatusEnum.isDelivery;
          // 如果物料已入/出库，则不可进行入/出库、删除操作
          item.canOperate = item.materialStatus === materialStatus ? 'disabled' : 'enable';
          if (operateType === MaterialOperateTypeEnum.delivery) {
            // 如果出库数量为0 在页面中展示为 --
            item.deliveryNum = item.deliveryNum === DELIVERY_NUM_EMPTY ? '--' : item.deliveryNum;
          }
        }
      });
    }
  }
}
