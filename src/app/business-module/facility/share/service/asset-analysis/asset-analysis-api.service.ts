import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ResultModel} from '../../../../../shared-module/model/result.model';
import {AssetAnalysisServiceUrlConst} from '../../const/asset-analysis-service-url.const';
import {AssetFailureModel} from '../../model/asset-analysis/asset-failure.model';
import {AssetGrowthDeviceModel} from '../../model/asset-analysis/asset-growth-device.model';
import {AssetTypeOrGrowthEquipmentModel} from '../../model/asset-analysis/asset-type-or-growth-equipment.model';
import {AssetTypeDeviceModel} from '../../model/asset-analysis/asset-type-device.model';
/**
 * 资产分析接口service
 */
@Injectable()
export class AssetAnalysisApiService {
  constructor(private $http: HttpClient) {
  }

  /**
   * 根据设施、区域或项目分析资产占比
   */
  public queryDeviceTypeCountByCondition(body): Observable<ResultModel<AssetTypeDeviceModel[]>> {
    return this.$http.post<ResultModel<AssetTypeDeviceModel[]>>(AssetAnalysisServiceUrlConst.queryDeviceTypeCountByCondition, body);
  }

  /**
   * 根据设备、区域分析资产占比
   */
  public queryEquipmentTypeCountByCondition(body): Observable<ResultModel<AssetTypeOrGrowthEquipmentModel[]>> {
    return this.$http.post<ResultModel<AssetTypeOrGrowthEquipmentModel[]>>(AssetAnalysisServiceUrlConst.queryEquipmentTypeCountByCondition, body);
  }

  /**
   * 资产占比设施维度为设施时表格数据导出
   */
  public exportDeviceTypeCount(body): Observable<ResultModel<any>> {
    return this.$http.post<ResultModel<any>>(AssetAnalysisServiceUrlConst.exportDeviceTypeCount, body);
  }

  /**
   * 资产占比设施维度为设备时表格数据导出
   */
  public exportEquipmentTypeCount(body): Observable<ResultModel<any>> {
    return this.$http.post<ResultModel<any>>(AssetAnalysisServiceUrlConst.exportEquipmentTypeCount, body);
  }

  /**
   * 项目列表接口
   */
  public queryProjectInfoListByPage(body): Observable<ResultModel<any>> {
    return this.$http.post<ResultModel<any>>(AssetAnalysisServiceUrlConst.queryProjectInfoListByPage, body);
  }

  /**
   * 资产故障分布设施列表查询接口
   */
  public deviceProductTroubleGrowthRate(body): Observable<ResultModel<AssetFailureModel[]>> {
    return this.$http.post<ResultModel<AssetFailureModel[]>>(AssetAnalysisServiceUrlConst.deviceProductTroubleGrowthRate, body);
  }

  /**
   * 资产故障分布设备列表查询接口
   */
  public equipmentProductTroubleGrowthRate(body): Observable<ResultModel<any>> {
    return this.$http.post<ResultModel<any>>(AssetAnalysisServiceUrlConst.equipmentProductTroubleGrowthRate, body);
  }

  /**
   * 资产故障分布表格数据导出接口
   */
  public exportProductTroubleGrowthRate(body): Observable<ResultModel<any>> {
    return this.$http.post<ResultModel<any>>(AssetAnalysisServiceUrlConst.exportProductTroubleGrowthRate, body);
  }

  /**
   * 资产增长率设施列表查询接口
   */
  public queryDeviceTypeGrowthRate(body): Observable<ResultModel<AssetGrowthDeviceModel[]>> {
    return this.$http.post<ResultModel<AssetGrowthDeviceModel[]>>(AssetAnalysisServiceUrlConst.queryDeviceTypeGrowthRate, body);
  }

  /**
   * 资产增长率设备列表查询接口
   */
  public queryEquipmentTypeGrowthRate(body): Observable<ResultModel<AssetTypeOrGrowthEquipmentModel[]>> {
    return this.$http.post<ResultModel<AssetTypeOrGrowthEquipmentModel[]>>(AssetAnalysisServiceUrlConst.queryEquipmentTypeGrowthRate, body);
  }

  /**
   * 资产增长率设施表格数据导出接口
   */
  public exportDeviceTypeGrowthRate(body): Observable<ResultModel<any>> {
    return this.$http.post<ResultModel<any>>(AssetAnalysisServiceUrlConst.exportDeviceTypeGrowthRate, body);
  }

  /**
   * 资产增长率设备表格数据导出接口
   */
  public exportEquipmentTypeGrowthRate(body): Observable<ResultModel<any>> {
    return this.$http.post<ResultModel<any>>(AssetAnalysisServiceUrlConst.exportEquipmentTypeGrowthRate, body);
  }

}
