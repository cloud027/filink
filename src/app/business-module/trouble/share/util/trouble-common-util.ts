import {NzI18nService} from 'ng-zorro-antd';
import {CommonUtil} from '../../../../shared-module/util/common-util';
import {DesignateReasonEnum, DesignateTypeEnum} from '../enum/trouble.enum';
import {PageModel} from '../../../../shared-module/model/page.model';
import {TroubleModel} from '../../../../core-module/model/trouble/trouble.model';
import {ResultModel} from '../../../../shared-module/model/result.model';
export class TroubleCommonUtil {
  /**
   * 获取指派类型
   */
  public static getDesignateType(i18n: NzI18nService, code = null) {
    return CommonUtil.codeTranslate(DesignateTypeEnum, i18n, code, 'fault.config');
  }

  /**
   * 获取指派原因
   */
  public static getDesignateReason(i18n: NzI18nService, code = null) {
    return CommonUtil.codeTranslate(DesignateReasonEnum, i18n, code, 'fault.config');
  }

  /**
   * 获取翻页信息
   */
  public static getTroublePageInfo(troubleModelData: ResultModel<TroubleModel[]>): PageModel {
    const pageModel = new PageModel();
    pageModel.Total = troubleModelData.totalCount;
    pageModel.pageSize = troubleModelData.size;
    pageModel.pageIndex = troubleModelData.pageNum;
    return pageModel;
  }
}
