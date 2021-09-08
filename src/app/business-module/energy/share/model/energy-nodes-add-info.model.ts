import { DeviceTypeEnum } from '../../../../core-module/enum/facility/facility.enum';
import { EquipmentTypeEnum } from '../../../../core-module/enum/equipment/equipment.enum';
import { EnergySelectedType } from '../enum/energy-config.enum';

/**
 * 设备新增或编辑数据模型
 */
export class EnergyNodesAddInfoModel {
    /** 是否从已有设备选择 1是   0否*/
    isSelectExistDevice: EnergySelectedType = EnergySelectedType.yes;
    /** 节点 id */
    energyConsumptionNodeId?: string;
    // 校验是否重名的名称 id
    equipmentId?: string;
    /**
     *  关联设备id
     */
    public relationEquipmentId?: string;
    /**
     *  名称 && 已有设备
     */
    public equipmentName: string;

    equipmentInfo: {
        /** 类型 */
        equipmentType: EquipmentTypeEnum
        equipmentModel: string // 型号
        supplier: string // 供应商
        supplierId: string // 供应商 id
        /** 报废年限 */
        scrapTime: string
        /** 资产编号 */
        equipmentCode: string
        softwareVersion: string // 软件版本号
        hardwareVersion: string // 硬件版本号
        sequenceId: string // 设备序号id
        areaId: string // 区域id
        areaCode: string // 区域 code
        address: string
        equipmentControlType: string // 通信设备选择的 类型
        deviceName: string // 所属设施名称
        deviceId: string // 所属设施 id
        deviceType: DeviceTypeEnum // 所属设施类型
        mountPosition: number // 挂载位置
        // 通信设备 -------------------------
        // 通信设备名称
        gatewayName: string
        // 通信设备 id
        gatewayId: string

        // 通信设备选择 网关需要填写 所属端口号
        portNo?: number
        // 通信设备 -------------------------
    };
    /**
     * 项目
     */
    public project: string;
    public projectName: string;

    // 采集设施 ids
    deviceIds: any[] = [];
    // 采集设备 id
    equipmentIds: any[] = [];
    //  采集回路 id
    loopIds: any[] = [];

    /**
     *  能耗目标值(日)
     */
    public energyConsumptionTarget: string;
    // 备注
    public remarks: string;

    resultData() {
        this.equipmentInfo = {
            equipmentType: null, // 类型
            equipmentModel: '', // 型号
            supplier: '', // 供应商
            supplierId: '',
            softwareVersion: '', // 软件版本号
            hardwareVersion: '', // 硬件版本号
            sequenceId: '', // 设备序号id
            areaId: '', // 区域id
            areaCode: '',
            address: '',
            equipmentControlType: '', // 通信设备选择的 类型
            gatewayName: '',
            gatewayId: '',
            deviceName: '',
            deviceId: '',
            deviceType: null,
            mountPosition: null,
            /** 报废年限 */
            scrapTime: '',
            /** 资产编号 */
            equipmentCode: ''
        };
        this.equipmentName = '';
        this.project = '';
        this.deviceIds = [];
        // 采集设备 id
        this.equipmentIds = [];
        //  采集回路 id
        this.loopIds = [];
        this.energyConsumptionTarget = '';
        this.remarks = '';
        this.relationEquipmentId = '';
        this.energyConsumptionNodeId = '';
        this.equipmentId = '';
    }
    constructor() {
        this.equipmentInfo = {
            equipmentType: null, // 类型
            equipmentModel: '', // 型号
            supplier: '', // 供应商
            supplierId: '',
            softwareVersion: '', // 软件版本号
            hardwareVersion: '', // 硬件版本号
            sequenceId: '', // 设备序号id
            areaId: '', // 区域id
            areaCode: '',
            address: '',
            equipmentControlType: '', // 通信设备选择的 类型
            gatewayName: '',
            gatewayId: '',
            deviceName: '',
            deviceId: '',
            deviceType: null,
            mountPosition: null,
            /** 报废年限 */
            scrapTime: '',
            /** 资产编号 */
            equipmentCode: ''
        };
    }
}
