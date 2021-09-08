/**
 * 设备状态
 */
enum EquipmentStatusEnum {
    // 未配置
    unSet = '1',
    // 正常在线
    online = '2',
    // 告警
    alarm = '3',
    // 故障
    break = '4',
    // 下线
    offline = '5',
    // 失联
    outOfContact = '6',
    // 已拆除
    dismantled = '7'
}
/**
 * 摄像头类型枚举
 */
enum CameraTypeEnum {
    // 枪机摄像头
    gCamera = '01',
    // 球机摄像头
    bCamera = '02'
}
/**
 * 能耗
 */
export class EnergyModel {
    //  设备 id
    energyConsumptionNodeId: string;
    /**
     * 名称
     */
    public equipmentName: string;
    /**
     * 类型
     */
    public equipmentType: any;
    /**
     * 型号
     */
    public equipmentModel: string;
    /**
     * 设备ID 串号
     */
    public sequenceId: string;
    /**
     * 项目
     */
    public project: string;
    /**
     * 区域
     */
    public areaName: string;
    /**
     * 采集设施
     */
    public collectDeviceName: string;
    /**
     * 采集设备
     */
    public collectEquipmentName: string;
    /**
     * 采集回路
     */
    public loopName: string;
    /**
     * 通信设备
     */
    public gatewayName: string;
    /**
     * 通行设备状态
     */
    public gatewayStatus: EquipmentStatusEnum;
    /**
     * 能耗目标值(日)
     */
    public energyConsumptionTarget: string;
    /**
     * 详细地址
     */
    public address: string;
    /**
     * 备注
     */
    public remarks: string;

    /**
     * 扩展状态图标
     */
    public statusIconClass: string;
    /**
     * 扩展状态颜色
     */
    public statusColorClass: string;
    /**
     * 类型图标
     */
    public iconClass: string;
    /**
     * 型号类型
     */
    public equipmentModelType: CameraTypeEnum;
    /**
     * 表格行样式
     */
    public rowStyle: {};
}
