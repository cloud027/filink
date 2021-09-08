import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {TableBasic} from '../../table/table.basic';
import {NzI18nService} from 'ng-zorro-antd';
import {FacilityLanguageInterface} from '../../../../../assets/i18n/facility/facility.language.interface';
import {LanguageEnum} from '../../../enum/language.enum';
import {FormOperate} from '../../form/form-operate.service';
import {FacilityForCommonService} from '../../../../core-module/api-service/facility';
import {ResultModel} from '../../../model/result.model';
import {ResultCodeEnum} from '../../../enum/result-code.enum';
import {EquipmentConfigDetailModel} from '../../../../core-module/model/equipment/equipment-config-detail.model';
import {FiLinkModalService} from '../../../service/filink-modal/filink-modal.service';

@Component({
  selector: 'app-equipment-config-gateway',
  templateUrl: './equipment-config-gateway.component.html',
  styleUrls: ['./equipment-config-gateway.component.scss']
})
export class EquipmentConfigGatewayComponent extends TableBasic implements OnInit, OnChanges {
  // tabId
  @Input() public tabId: string;
  // 设备配置项内容equipmentContent[] = [];
  @Input() public equipmentContent: any;
  // 设备配置详情参数
  @Input() public equipmentId: string;
  // 设施国际化
  public language: FacilityLanguageInterface;
  // 提交按钮loading
  public isLoading = false;
  // 配置项
  public configurationsList;

  constructor(
    public $nzI18n: NzI18nService,
    private $message: FiLinkModalService,
    private $facilityCommonService: FacilityForCommonService,
  ) {
    super($nzI18n);
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.facility);
  }

  ngOnInit() {
    this.configurationsList = this.equipmentContent;
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  formInstance(event: { instance: FormOperate }, currentItem, index) {
    currentItem.formInstance = event;
    currentItem.formInstance.instance.group.statusChanges.subscribe(() => {
      this.configurationsList.configurationList[index]['saveBtnDisabled'] = this.checked(currentItem);
    });
    // 初始化的按钮状态
    this.configurationsList.configurationList[index]['saveBtnDisabled'] = this.checked(currentItem);
  }

  /**
   * 最外层的表单验证
   */
  public checkDisabled(list) {
    let pass = true;
    list.forEach(item => {
       if (item.saveBtnDisabled) {
         pass = false;
       }
    });
    return !pass;
  }

  /**
   * 表单验证
   */
  public checked(currentItem): boolean {
    let pass = true;
        // 如果有一个没有通过校验
    if (!currentItem['formInstance'].instance.getValid()) {
      pass = false;
    }
    return !pass;
  }


  /**
   * 确定按钮
   */
  public submit(item, type): void {
    let param = {};
    let formParam;
    if (type === 1) {
      param = item.formInstance.instance.group.getRawValue();
      param['gw_id'] = this.equipmentId;
      let id = this.configurationsList.equipmentId;
      // 网关基础信息配置
      if (this.equipmentContent.id === 'E001') {
        id = this.equipmentId;
      }
      formParam = new EquipmentConfigDetailModel(item.commandId, [id], param);
    } else {
      item.configurationList.forEach(_temp => {
        param[_temp.id] = _temp.formInstance.instance.group.getRawValue();
      });
      param['gw_id'] = this.equipmentId;
      formParam = new EquipmentConfigDetailModel(item.commandId, [this.configurationsList.equipmentId], param);
    }

    this.$facilityCommonService.setInstructDeviceInfo(formParam, item.url).subscribe((result: ResultModel<any>) => {
      if (result.code === ResultCodeEnum.success) {
        this.$message.success(this.language.saveEquipmentConfigSuccess);
      } else {
        this.$message.error(result.msg);
      }
    });
  }
}
