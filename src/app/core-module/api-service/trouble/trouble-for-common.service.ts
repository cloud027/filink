import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {ResultModel} from '../../../shared-module/model/result.model';
import {SelectModel} from '../../../shared-module/model/select.model';
import {QUERY_TROUBLE_DETAIL, QUERY_TROUBLE_TYPE, QUERY_UNIT_BY_AREA_CODE} from './trouble-request-url';
import {HttpClient} from '@angular/common/http';
import {TroubleModel} from '../../model/trouble/trouble.model';
import {AreaDeviceParamModel} from '../../model/work-order/area-device-param.model';
import {DepartmentUnitModel} from '../../model/work-order/department-unit.model';

@Injectable({
  providedIn: 'root'
})
export class TroubleForCommonService {

  constructor(
    private $http: HttpClient
  ) { }

  // 故障类型
  queryTroubleType(): Observable<ResultModel<SelectModel[]>> {
    return this.$http.get<ResultModel<SelectModel[]>>(`${QUERY_TROUBLE_TYPE}`);
  }
    // 故障详情
  queryTroubleDetail(id: string): Observable<ResultModel<TroubleModel>> {
    return this.$http.get<ResultModel<TroubleModel>>(`${QUERY_TROUBLE_DETAIL}/${id}`);
  }
  // 根据区域code及用户id查询同级和下级单位信息
  queryUnitListByArea(body: AreaDeviceParamModel): Observable<ResultModel<DepartmentUnitModel[]>> {
    return this.$http.post<ResultModel<DepartmentUnitModel[]>>(`${QUERY_UNIT_BY_AREA_CODE}`, body);
  }
  // 接收/不接收故障指派
  getTroubleAssign(url: string, that) {
    const xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
      // 判断数据是否正常返回
      if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
        // 接收数据
        console.log(xmlHttp.responseText);
        that.$message.success('success');
      } else {
        that.$message.error('error');
      }
    };
    xmlHttp.open('GET', url, true);
    xmlHttp.setRequestHeader('Content-Type', 'application/json');
    xmlHttp.setRequestHeader('Accept', 'application/json');
    xmlHttp.send();
  }
}
