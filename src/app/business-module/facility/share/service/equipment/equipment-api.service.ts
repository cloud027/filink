import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {EquipmentServiceUrlConst} from '../../const/equipment-service-url.const';
import {ResultModel} from '../../../../../shared-module/model/result.model';
import {EquipmentModelModel} from '../../model/equipment-model.model';
import {NzTreeNode} from 'ng-zorro-antd';
import {ExportRequestModel} from '../../../../../shared-module/model/export-request.model';
import {GatewayDataRequestModel} from '../../model/gateway-data-request.model';
import {GatewayPortInfoModel} from '../../model/gateway-port-info.model';
import {GatewayConfigClearModel} from '../../model/gateway-config-clear.model';
import {QueryGatewayInfoModel} from '../../model/query-gateway-info.model';
import {EquipmentAddInfoModel} from '../../../../../core-module/model/equipment/equipment-add-info.model';
import {ConfigResponseContentModel} from '../../../../../core-module/model/equipment/config-response-content.model';
import {LoopListModel} from '../../../../../core-module/model/loop/loop-list.model';
import {LoopViewDetailModel} from '../../../../../core-module/model/loop/loop-view-detail.model';
import {LoopSingleControlNumberModel} from '../../../../../core-module/model/loop/loop-single-control-number.model';
import {LoopCableInfoModel} from '../../../../../core-module/model/loop/loop-cable-info.model';
import {CableLoopInstructInfoModel} from '../../../../../core-module/model/loop/cable-loop-instruct-info.model';

/**
 * 设备管理服务接口实现类
 */
@Injectable()
export class EquipmentApiService {
  constructor(private $http: HttpClient) {
  }

  /**
   *  自动生成设备名称
   */
  public getEquipmentName(temp: { equipmentName: string }): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(EquipmentServiceUrlConst.getEquipmentName, temp);
  }

  /**
   *  查询设备名称是否已经存在
   */
  public queryEquipmentNameIsExist(body: { equipmentId: string, equipmentName: string }): Observable<ResultModel<boolean>> {
    return this.$http.post<ResultModel<boolean>>(EquipmentServiceUrlConst.queryEquipmentNameIsExist, body);
  }

  /**
   * 查询资产编码是否存在
   */
  public queryEquipmentCodeIsExist(body: { equipmentId: string, equipmentCode: string }): Observable<ResultModel<boolean>> {
    return this.$http.post<ResultModel<boolean>>(EquipmentServiceUrlConst.queryEquipmentCodeIsExist, body);
  }

  /**
   * 增加设备
   */
  public addEquipment(body: EquipmentAddInfoModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(EquipmentServiceUrlConst.addEquipment, body);
  }

  /**
   * 修改设备
   */
  public updateEquipmentById(body: EquipmentAddInfoModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(EquipmentServiceUrlConst.updateEquipmentById, body);
  }

  /**
   * 删除设备
   */
  public deleteEquipmentByIds(body: string[]): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(EquipmentServiceUrlConst.deleteEquipmentByIds, body);
  }

  /**
   * 根据设备id查询设备信息
   */
  public getEquipmentById(body): Observable<ResultModel<any>> {
    return this.$http.post<ResultModel<any>>(EquipmentServiceUrlConst.getEquipmentById, body);
  }


  /**
   * 根据设施id查询挂载位置
   */
  public findMountPositionById(body: {
    equipmentId: string,
    deviceId: string, mountPosition: number, equipmentType: string
  }): Observable<ResultModel<string[]>> {
    return this.$http.post<ResultModel<string[]>>(EquipmentServiceUrlConst.findMountPositionById, body);
  }

  /**
   * 获取型号信息
   */
  public getDeviceModelByType(body: { type: string, typeObject: string }): Observable<ResultModel<EquipmentModelModel[]>> {
    return this.$http.post<ResultModel<EquipmentModelModel[]>>(EquipmentServiceUrlConst.getDeviceModelByType, body);
  }

  /**
   * 获取网关端口
   */
  public queryGatewayPort(body: any): Observable<ResultModel<string[]>> {
    return this.$http.post<ResultModel<string[]>>(EquipmentServiceUrlConst.queryGatewayPort, body);
  }

  /**
   * 上传图片
   */
  public uploadImg(formData: FormData): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(EquipmentServiceUrlConst.uploadImageForLive, formData);
  }

  /**
   *  根据设施id查询回路信息
   */
  public loopListByDeviceIds(body: string[]): Observable<ResultModel<LoopListModel[]>> {
    return this.$http.post<ResultModel<LoopListModel[]>>(EquipmentServiceUrlConst.loopListByDeviceIds, body);
  }

  /**
   * 查询网关端口连接拓扑
   */
  public queryGatewayPortInfoTopology(body: QueryGatewayInfoModel): Observable<ResultModel<GatewayPortInfoModel[]>> {
    return this.$http.post<ResultModel<GatewayPortInfoModel[]>>(EquipmentServiceUrlConst.queryGatewayPortInfoTopology, body);
  }

  /**
   * 查询网关端口连接拓扑
   */
  public queryEquipmentPortInfoTopology(body): Observable<ResultModel<any>> {
    return this.$http.post<ResultModel<any>>(EquipmentServiceUrlConst.queryEquipmentPortInfoTopology, body);
  }

  /**
   * 保存网关端口拓扑
   */
  public saveGatewayPortInfo(body: GatewayDataRequestModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(EquipmentServiceUrlConst.saveGatewayPortInfo, body);
  }

  /**
   * 保存网关端口拓扑
   */
  public saveEquipmentPortLiveInfo(body: any): Observable<ResultModel<any>> {
    return this.$http.post<ResultModel<any>>(EquipmentServiceUrlConst.saveEquipmentPortLiveInfo, body);
  }

  /**
   * 清除网关端口信息
   */
  public deleteGatewayPortInfo(body: GatewayConfigClearModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(EquipmentServiceUrlConst.deleteGatewayPortInfo, body);
  }

  /**
   * 清除网关端口信息new
   */
  public deleteEquipmentPortLiveInfo(body: any): Observable<ResultModel<any>> {
    return this.$http.post<ResultModel<any>>(EquipmentServiceUrlConst.deleteEquipmentPortLiveInfo, body);
  }

  /**
   * 拖动设备位置
   */
  public updateEquipmentPosition(body: any): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(EquipmentServiceUrlConst.updateEquipmentPosition, body);
  }

  /**
   * 修改连线信息
   */
  public updateLineName(body: any): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(EquipmentServiceUrlConst.updateLineName, body);
  }

  /**
   * 修改节点名称信息
   */
  public updateNodeName(body: any): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(EquipmentServiceUrlConst.updateNodeName, body);
  }

  /**
   * 根据设备型号获取设备配置项
   */
  public getEquipmentConfigByModel(body): Observable<ResultModel<ConfigResponseContentModel[]>> {
    return this.$http.post<ResultModel<ConfigResponseContentModel[]>>(EquipmentServiceUrlConst.getEquipmentConfigByModel, body);
  }

  /**
   * 根据集控id查询回路信息
   */
  public queryLoopInfoByCentralizedId(id: string): Observable<ResultModel<LoopViewDetailModel[]>> {
    return this.$http.get<ResultModel<LoopViewDetailModel[]>>(`${EquipmentServiceUrlConst.queryLoopInfoByCentralizedId}/${id}`);
  }

  /**
   * 根据集控id 获取回路下的单控总数
   */
  public queryLoopSingleNumByCenterId(id: string): Observable<ResultModel<LoopSingleControlNumberModel[]>> {
    return this.$http.get<ResultModel<LoopSingleControlNumberModel[]>>(`${EquipmentServiceUrlConst.queryLoopSingleNumByCenterId}/${id}`);
  }

  /**
   * 查询回路和线缆的绑定关系
   */
  public queryLoopCableInfo(id: string): Observable<ResultModel<LoopCableInfoModel[]>> {
    return this.$http.get<ResultModel<LoopCableInfoModel[]>>(`${EquipmentServiceUrlConst.queryLoopCableInfo}/${id}`);
  }

  /**
   * 线缆配置下发
   */
  public instructDistribute(body: CableLoopInstructInfoModel): Observable<ResultModel<any>> {
    return this.$http.post<ResultModel<CableLoopInstructInfoModel>>(EquipmentServiceUrlConst.instructDistribute, body);
  }

  /**
   * 单控和线缆的关系
   */
  public querySingLightAndCableRelation(id: string): Observable<ResultModel<any[]>> {
    return this.$http.get<ResultModel<any[]>>(`${EquipmentServiceUrlConst.querySingLightAndCableRelation}/${id}`);
  }

  /**
   * 获取权限区域
   */
  public queryAreaListForPageSelection(queryBody): Observable<ResultModel<NzTreeNode[]>> {
    return this.$http.post<ResultModel<NzTreeNode[]>>(EquipmentServiceUrlConst.queryAreaListForPageSelection, queryBody);
  }

  /**
   * 导出设备接口
   */
  public exportEquipmentData(body: ExportRequestModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(EquipmentServiceUrlConst.exportEquipmentData, body);
  }
   /**
   * 导出设备接口
   */
    public exportEquipmentListNew(body: ExportRequestModel): Observable<ResultModel<string>> {
        return this.$http.post<ResultModel<string>>(EquipmentServiceUrlConst.exportEquipmentListNew, body);
      }

  /**
   * 下载批量导入模板
   */
  public downloadTemplate(): Observable<ResultModel<string>> {
    return this.$http.get<ResultModel<string>>(EquipmentServiceUrlConst.downloadTemplate);
  }

  /**
   * 设备批量导入
   */
  public batchImportEquipmentInfo(body: FormData): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(EquipmentServiceUrlConst.batchImportEquipmentInfo, body);
  }

  /**
   * 校验设备id的唯一性
   */
  public querySequenceIdIsExist(body: { equipmentId: string, sequenceId: string }): Observable<ResultModel<boolean>> {
    return this.$http.post<ResultModel<boolean>>(EquipmentServiceUrlConst.querySequenceIdIsExist, body);
  }

  /**
   * 校验平台id的唯一性
   */
  public queryEquipmentPlatformIdIsExist(body: { equipmentId: string, platformId: string }): Observable<ResultModel<boolean>> {
    return this.$http.post<ResultModel<boolean>>(EquipmentServiceUrlConst.queryEquipmentPlatformIdIsExist, body);
  }

  /**
   * 校验传感器名称唯一性
   */
  public querySensorNameIsExist(body): Observable<ResultModel<boolean>> {
    return this.$http.post<ResultModel<boolean>>(EquipmentServiceUrlConst.querySensorNameIsExist, body);
  }

  /**
   * 新增网关传感器
   * @param body 传感器信息
   */
  public createSensor(body): Observable<ResultModel<boolean>> {
    return this.$http.post<ResultModel<boolean>>(EquipmentServiceUrlConst.createSensor, body);
  }

  /**
   * 查询传感器信息
   * @param body 网关id 端口id
   */
  public querySensorDetail(body: { gatewayId: string, port: string }): Observable<ResultModel<any>> {
    return this.$http.post<ResultModel<any>>(EquipmentServiceUrlConst.querySensorDetail, body);
  }

  /**
   * 查询传感器信息
   * @param body 网关id 端口id
   */
  public updateSensor(body): Observable<ResultModel<any>> {
    return this.$http.post<ResultModel<any>>(EquipmentServiceUrlConst.updateSensor, body);
  }

  /**
   * 删除网关上传感器
   */
  public deleteSensor(body): Observable<ResultModel<any>> {
    return this.$http.post<ResultModel<any>>(EquipmentServiceUrlConst.deleteSensor, body);
  }

  /**
   * 删除网关上传感器
   */
  public querySensorInfoList(body): Observable<ResultModel<any>> {
    return this.$http.post<ResultModel<any>>(EquipmentServiceUrlConst.querySensorInfoList, body);
  }

  /**
   * 获取上传信息value
   */
  public getEquipmentDataByType(body): Observable<ResultModel<any>> {
    return this.$http.post<ResultModel<any>>(EquipmentServiceUrlConst.getEquipmentDataByType, body);
  }
}
