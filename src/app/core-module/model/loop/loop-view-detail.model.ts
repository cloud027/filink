import {LoopTypeEnum} from '../../enum/loop/loop.enum';
import {FacilityListModel} from '../facility/facility-list.model';

/**
 * 回路详情模型
 */
export class LoopViewDetailModel {
  /**
   * 回路id 编辑有
   */
  public loopId?: string;
  /**
   * 回路名称
   */
  public loopName: string;
  /**
   * 回路类型
   */
  public loopType: LoopTypeEnum;
  /**
   * 回路编号
   */
  public loopCode: string;

  /**
   * 自定义输入内容
   */
  public customizeLoopType?: string;
  /**
   * 所属配电箱
   */
  public distributionBoxId: string;
  /**
   * 所属配电箱名称
   */
  public distributionBoxName: string;
  /**
   * 关联设施数据集合
   */
  public loopDeviceRespList: FacilityListModel[];
  /**
   * 关联设施ids
   */
  public deviceIds: string[] = [];
  /**
   * 控制对象id
   */
  public centralizedControlId: string;
  /**
   * 控制对象
   */
  public centralizedControlName: string;
  /**
   * 备注
   */
  public remark: string;
  /**
   * 创建时间时间戳
   */
  public createTime: string;

  /**
   * 创建时间
   */
  public ctime: string | Date;
  /**
   * 创建人
   */
  public createUser: string;
  /**
   * 部门id
   */
  public departmentId?: string;
  /**
   * 回路状态
   */
  public loopStatus: string;
  /**
   * 修改时间
   */
  public updateTime: string;
  /**
   * 修改人
   */
  public updateUser: string;
  /**
   * 回路关联数组
   */
  public loopLineInfos: [];
  /**
   * 回路是否删除
   */
    public isDeleted: boolean;
}
