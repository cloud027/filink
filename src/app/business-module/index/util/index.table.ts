import {TableBasic} from '../../../shared-module/component/table/table.basic';
import {NzI18nService} from 'ng-zorro-antd';
import {PageModel} from '../../../shared-module/model/page.model';
import {IndexLanguageInterface} from '../../../../assets/i18n/index/index.language.interface';
import {WorkOrderLanguageInterface} from '../../../../assets/i18n/work-order/work-order.language.interface';
import {FacilityLanguageInterface} from '../../../../assets/i18n/facility/facility.language.interface';
import {LanguageEnum} from '../../../shared-module/enum/language.enum';

export class IndexTable extends TableBasic {
  pageBean: PageModel = new PageModel(5, 1, 0);
  indexLanguage: IndexLanguageInterface;
  workOrderLanguage: WorkOrderLanguageInterface;
  facilityLanguage: FacilityLanguageInterface;
  constructor(
    public $nzI18n: NzI18nService,
  ) {
    super($nzI18n);
    this.indexLanguage = this.$nzI18n.getLocaleData(LanguageEnum.index);
    this.workOrderLanguage = this.$nzI18n.getLocaleData(LanguageEnum.workOrder);
    this.facilityLanguage = this.$nzI18n.getLocaleData(LanguageEnum.facility);
  }

}
