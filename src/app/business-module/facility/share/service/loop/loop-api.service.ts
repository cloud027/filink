import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ResultModel} from '../../../../../shared-module/model/result.model';
import {LoopRequestUrlConst} from '../../const/loop-service-url.const';
import {LoopViewDetailModel} from '../../../../../core-module/model/loop/loop-view-detail.model';
import {ExportRequestModel} from '../../../../../shared-module/model/export-request.model';
import {MoveInOrOutModel} from '../../../../../core-module/model/loop/move-in-or-out.model';
import {LoopPullCloseBreakModel} from '../../model/loop-pull-close-break.model';
import {InstructSendRequestModel} from '../../../../../core-module/model/group/instruct-send-request.model';
import {EquipmentListModel} from '../../../../../core-module/model/equipment/equipment-list.model';


/**
 * 回路管理服务接口实现类
 */
@Injectable()
export class LoopApiService {
  constructor(private $http: HttpClient) {
  }
  /**
   * 检验回路名称是否唯一
   */
  public queryLoopNameIsExist(body: { loopId?: string, loopName: string }): Observable<ResultModel<boolean>> {
    return this.$http.post<ResultModel<boolean>>(`${LoopRequestUrlConst.queryLoopNameIsExist}`, body);
  }

  /**
   * 新增回路
   */
  public addLoop(body: LoopViewDetailModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${LoopRequestUrlConst.addLoop}`, body);
  }

  /**
   * 编辑回路
   */
  public updateLoopById(body: LoopViewDetailModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${LoopRequestUrlConst.updateLoopById}`, body);
  }

  /**
   * 删除回路
   */
  public deleteLoopByIds(body: { loopIds: string[] }): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${LoopRequestUrlConst.deleteLoopByIds}`, body);
  }


  /**
   * 移入回路
   */
  public moveIntoLoop(body: MoveInOrOutModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${LoopRequestUrlConst.moveIntoLoop}`, body);
  }


  /**
   * 检验回路名称是否唯一
   */
  public queryLoopCodeIsExist(body: { loopId?: string, loopCode: string, centralizedControlId: string, distributionBoxId: string }): Observable<ResultModel<boolean>> {
    return this.$http.post<ResultModel<boolean>>(`${LoopRequestUrlConst.queryLoopCodeIsExist}`, body);
  }

  /**
   * 回路拉合闸 保存设备配置下发指令
   */
  public pullBrakeOperate(body: InstructSendRequestModel<LoopPullCloseBreakModel>): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${LoopRequestUrlConst.pullBrakeOperate}`, body);
  }

  /**
   * 导出回路列表
   */
  public exportLoopList(body: ExportRequestModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${LoopRequestUrlConst.exportLoopList}`, body);
  }




  /**
   * 查询设施的区域信息
   */
  public queryEquipmentInfoList(body: { deviceId: string }): Observable<ResultModel<EquipmentListModel[]>> {
    return this.$http.post<ResultModel<EquipmentListModel[]>>(`${LoopRequestUrlConst.queryEquipmentInfoList}`, body);
  }
}
