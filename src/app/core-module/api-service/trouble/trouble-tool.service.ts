import { Injectable } from '@angular/core';
import {ResultModel} from "../../../shared-module/model/result.model";
import {SelectModel} from "../../../shared-module/model/select.model";
import {ResultCodeEnum} from "../../../shared-module/enum/result-code.enum";
import {TroubleForCommonService} from "./index";

@Injectable({
  providedIn: 'root'
})
export class TroubleToolService {

  constructor(
    private $troubleService: TroubleForCommonService
  ) {
  }

  /**
   * 故障类型
   */
  public getTroubleTypeList() {
    return new Promise((resolve, reject) => {
      this.$troubleService.queryTroubleType().subscribe((res: ResultModel<SelectModel[]>) => {
        if (res.code === ResultCodeEnum.success) {
          const data = res.data;
          const troubleTypeList = data.map(item => {
            return ({'label': item.value, 'value': item.key, 'code': item.key});
          });
          resolve(troubleTypeList);
        }
      }, (error) => {
        reject(error);
      });
    });
  }
}
