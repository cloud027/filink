/**
 * 产品设备模型数据结果
 */
import {EquipmentTypeEnum} from '../../enum/equipment/equipment.enum';
import {SelectModel} from '../../../shared-module/model/select.model';

export class ProductEquipmentModelModel {
  /**
   * 坐标id
   */
  public pointConfigId: string;
  /**
   * 编号
   */
  public configSort: string;
  /**
   * 横坐标
   */
  public xposition: string;
  /**
   * 纵坐标
   */
  public yposition: string;
  /**
   * 点位可配置设备
   */
  public selectEquipment: any;
  /**
   * 点位类型
   */
  public pointType: string;
  /**
   *  查看类型
    */
  public viewType: EquipmentTypeEnum;
  /**
   * 可选设备类型
   */
  public canSelectEquipment:  SelectModel[];
}
