export class DumpInfoModel {
  /**
   * UUID
   */
  public taskInfoId: string;

  /**
   * 任务类型
   */
  public taskInfoType: string;

  /**
   * 文件路径
   */
  public filePath: string;

  public fileNum: number;

  public fileGeneratedNum: number;

  /**
   * 任务状态
   */
  public taskStatus: number;

  /**
   * 创建时间
   */
  public createTime: string;

  /**
   * 创建人
   */
  public createUser: string;

  /**
   * 更新时间
   */
  public updateTime: string;

  /**
   * 更新人
   */
  public updateUser: string;
  /**
   * 列表名称
   */
  public listName: string;
  /**
   * 查询条件
   */
  public queryCondition: string;
  /**
   * 创建时间时间戳
   */
  public tsCreateTime: string;
  /**
   * 创建时间时间戳
   */
  public tsUpDateTime: string;
  /**
   * 删除标记 默认为0
   */
  public isDeleted: string;
  /**
   * 列明信息
   */
  public columnInfos: string;
  /**
   * 方法路径
   */
  public methodPath: string;
  /**
   * 文件类型，0为xsl,1为cvs
   */
  public excelType: number;
  /**
   * 转储数据的总条数
   */
  public dumpAllNumber: string;
  /**
   * 现在时间
   */
  public nowTime: string;
  /**
   * 下次
   */
  public nextTime: string;
  /**
   * 转储数据的总条数
   */
  public implementationNum: string;
  /**
   * 下次执行时间
   */
  public nextExecutionTime: string;
  /**
   * 现在状态
   */
  public nowStatus: string;
}
