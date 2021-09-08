/**
 * 产品列表数据模型
 */
import {CloudPlatformTypeEnum, LockTypeEnum, ProductTypeEnum} from '../../enum/product/product.enum';
import {PortInfoModel} from './port-info.model';
import {CameraTypeEnum, EquipmentTypeEnum} from '../../enum/equipment/equipment.enum';
import {DeviceTypeEnum} from '../../enum/facility/facility.enum';
import {ProductFileModel} from './product-file.model';

export class ProductInfoModel {

  /**
   * 产品id
   */
  public productId: string;
  /**
   * 规格型号
   */
  public productModel: string;
  /**
   * 产品分类
   */
  public typeFlag: ProductTypeEnum;
  /**
   * 产品分类编码
   */
  public typeCode: EquipmentTypeEnum | DeviceTypeEnum;
  /**
   * 计量单位
   */
  public unit: string;
  /**
   *  单价
   */
  public price: string;
  /**
   * 产品功能
   */
  public description: string;
  /**
   * 报废年限
   */
  public scrapTime: number;
  /**
   * 软件版本
   */
  public softwareVersion: string;
  /**
   * 硬件版本
   */
  public hardwareVersion: string;
  /**
   * 云平台类型
   */
  public platformType: CloudPlatformTypeEnum;
  /**
   * 云平台产品名称
   */
  public appName: string;
  /**
   * 云平台产品
   */
  public appId: string;
  /**
   * 供应商
   */
  public supplier: string;
  /**
   * 供应商名称
   */
  public supplierName: string;
  /**
   * 设施设备图片
   */
  public imageId: string;
  /**
   * 备注
   */
  public remark: string;
  /**
   * 安装数量
   */
  public quantity: number;
  /**
   * 创建人
   */
  public createUser: string;
  /**
   * 创建人名称
   */
  public createUserName: string;
  /**
   * 创建时间
   */
  public createTime: string;
  /**
   * 产品图片信息
   */
  public productFileList: ProductFileModel[];
  /**
   * 模版内容
   */
  public equipmentTemplate: string;
  /**
   * 更新时间
   */
  public updateTime: string;
  /**
   * 设备数据容量(条)
   */
  public dataCapacity: number;
  /**
   * 摄像头形态
   */
  public pattern: CameraTypeEnum | LockTypeEnum;
  /**
   * 是否存在杆型图
   */
  public fileExist: string;
  /**
   * 设备数据
   */
  public equipmentInfo: any;
  /**
   * 端口
   */
  public productPortList: PortInfoModel[];
  /**
   * 样式
   */
  public iconClass: string;
  /**
   * 杆型新增按钮是否展示
   */
  public showPoleUpload: boolean;
  /**
   * 杆型编辑按钮是否展示
   */
  public showPoleUpdate: boolean;
  /**
   *  网关上传按钮
   */
  public showGatewayUpload: boolean;
  /**
   * 网关编辑按钮
   */
  public showGatewayUpdate: boolean;
  /**
   * 配置模版按钮
   */
  public showConfigTemplate: boolean;
  /**
   * 通信模式
   */
  public communicateType: string;
  /**
   * 部门code
   */
  public deptCode: string;
  /**
   * 部门name
   */
  public deptName: string;
  /**
   * 图片路径
   */
  public fileFullPath: string;
  /**
   * 选中状态
   */
  public checked?: boolean;
  /**
   * 供应商id
   */
  public supplierId?: string;
  /**
   * 物料编码
   */
  public materialCode: string;
  /**
   * 供应商编号
   */
  public supplierNo: string;
}
