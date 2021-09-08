/**
 * Created by wh1709040 on 2019/6/15.
 */
import {BaseInfoModel} from './base-info.model';

export class BoxInfoModel extends BaseInfoModel {

  // 备注
  public memo: string;
  // 制造商
  public producer: string;

  // 配线架专有属性 //
  // 设施形态(光纤配线架、中间配线架、总配线架)
  public deviceForm: string;
  // 机架行号
  public lineNum: number;
  // 机架列号
  public columnNum: number;
  // 配线架专有属性 end//

  // 光交箱、分纤箱、接头盒专有属性 //
  // 安装方式(光交箱：落地、架空；分纤箱与接头盒：落地、壁挂、抱杆)
  public installationMode: number | string;
  // 光交箱、分纤箱、接头盒专有属性 end//

  // 接头盒专有属性 //
  // 设备类型
  // 最大纤芯数
  public maxFiberNum: number;
  // 密封方式(热缩、机械)
  public sealMode: number | string;
  // 敷设方式(人井、管道、架空、直埋、壁挂、托架、手孔、人孔)
  public layMode: number | string;
  // 规格说明(两进两出、三进三出、四进四出)
  public standard: number | string;
  // 接续信息(直通、分歧)
  public follow: number | string;
// 接头盒专有属性 end//
}
