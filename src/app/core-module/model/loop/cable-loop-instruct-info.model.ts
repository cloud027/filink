/**
 * 线缆设置配置下发模型
 */
export class CableLoopInstructInfoModel {
  /**
   * 线缆设置指令id
   */
  public commandId;
  /**
   * 设备id
   */
  public equipmentIds: string[];
  /**
   * 配置下发参数
   */
  public param: {
    /**
     * 线缆参数
     */
      cableParam: [],
    /**
     * 线缆数量
     */
      cableNum: number,
  };
}
