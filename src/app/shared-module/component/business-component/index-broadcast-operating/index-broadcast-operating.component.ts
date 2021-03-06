import {Component, Input, OnInit} from '@angular/core';
import {NzI18nService} from 'ng-zorro-antd';
import {SessionUtil} from '../../../util/session-util';
import * as _ from 'lodash';
import {ResultModel} from '../../../model/result.model';
import {ResultCodeEnum} from '../../../enum/result-code.enum';
import {ApplicationSystemForCommonService} from '../../../../core-module/api-service/application-system/application-system-for-common.service';
import {FiLinkModalService} from '../../../service/filink-modal/filink-modal.service';
import {LanguageEnum} from '../../../enum/language.enum';
import {ApplicationInterface} from '../../../../../assets/i18n/application/application.interface';
import {EquipmentListModel} from '../../../../core-module/model/equipment/equipment-list.model';
import {ControlInstructEnum} from '../../../../core-module/enum/instruct/control-instruct.enum';
import {CallTypeEnum} from '../../../../core-module/enum/product/product.enum';
import {FilterValueConst} from '../../../../business-module/application-system/share/const/filter.const';
import {QueryConditionModel} from '../../../model/query-condition.model';
import {DistributeModel} from '../../../../business-module/application-system/share/model/distribute.model';
import {OnlineLanguageInterface} from '../../../../../assets/i18n/online/online-language.interface';
import {PageModel} from '../../../model/page.model';
import {EnergyApiService} from '../../../../business-module/energy/share/service/energy/energy-api.service';

@Component({
  selector: 'app-broadcast-operating',
  templateUrl: './index-broadcast-operating.component.html',
  styleUrls: ['./index-broadcast-operating.component.scss']
})
export class IndexBroadcastOperatingComponent implements OnInit {
  @Input() equipmentId: string;
  @Input() equipmentName: string;
  @Input() sequenceId: string;
  public volumeValue: number = 0;
  public insertVolumeValue: number = 0;
  public onlineVolumeValue: number = 0;
  public insertType: number = 0;
  public isInsert: boolean = false;
  public isOnline: boolean = false;
  public sourceId: string;
  public selectedEquipmentData = [];
  public equipmentList = [];
  // ??????????????????
  public recordEquipmentList = [];
  public volumeList = [];
  public audioQueryCondition: QueryConditionModel = new QueryConditionModel();
  public audioPageBean: PageModel = new PageModel();
// ?????????????????????
  public languageTable: ApplicationInterface;
  // ???????????????
  public language: OnlineLanguageInterface;
  public isStop: boolean = false;
  private savePlanThrottle: boolean = false;

  // ????????????
  public radioStatus: boolean = false;

  constructor(
    // ????????????
    private $applicationService: ApplicationSystemForCommonService,
    // ???????????????
    private $nzI18n: NzI18nService,
    // ??????
    private $message: FiLinkModalService,
    private $energyApiService: EnergyApiService
  ) {
    this.language = $nzI18n.getLocaleData(LanguageEnum.online);
    this.languageTable = $nzI18n.getLocaleData(LanguageEnum.application);
  }

  ngOnInit(): void {
    this.queryBroadcastVolumeById(this.sequenceId);
    // ??????????????????
    this.queryEquipmentList();
  }

  handleVolumeSlider(event, type) {
    this.volumeValue = event;
    this.volumeList = [{equipmentId: this.equipmentId}];
    if (type === 0) {
      this.confirmVolume();
    }
  }

  showOnlineModel() {
    const radioData = JSON.parse(sessionStorage.getItem('radioData'));
    if (radioData) {
      this.$message.warning('??????????????????????????????');
      return;
    }
    this.equipmentList = [{equipmentId: this.equipmentId}];
    this.isOnline = true;
  }

  showInsertModel() {
    const radioData = JSON.parse(sessionStorage.getItem('radioData'));
    if (radioData) {
      this.$message.warning('??????????????????????????????');
      return;
    }
    this.selectedEquipmentData = [{equipmentId: this.equipmentId}];
    this.isInsert = true;
    this.queryBroadcastVolumeById(this.sequenceId);
  }

  stopInsert() {
    const radioData = JSON.parse(sessionStorage.getItem('radioData'));
    if (radioData) {
      this.$message.warning('??????????????????????????????');
      return;
    }
    this.equipmentList = [{equipmentId: this.equipmentId}];
    const params = {
      commandId: ControlInstructEnum.broadcastStop,
      equipmentIds: this.equipmentList.map(item => item.equipmentId),
      param: {}
    };
    this.instructDistribute(params);
  }

  public checkHasRole(codes: string[]): boolean {
    if (_.isEmpty(codes)) {
      return true;
    }
    const userInfo = SessionUtil.getUserInfo();
    if (userInfo && userInfo.role && userInfo.role.permissionList) {
      const perCodeList = userInfo.role.permissionList.map(v => v.id) || [];
      const tempArr = _.intersection(codes, perCodeList);
      return _.isEmpty(tempArr);
    } else {
      return true;
    }
  }

  public queryBroadcastVolumeById(id) {
    this.$applicationService.queryBroadcastVolumeById({sequenceId: id}).subscribe((res: ResultModel<string>) => {
      if (res.code === ResultCodeEnum.success) {
        this.volumeValue = Number(res.data);
        this.insertVolumeValue = Number(res.data);
        this.onlineVolumeValue = Number(res.data);
      } else {
        this.$message.error(res.msg);
      }
    });
  }

  public handleSource(event) {
    this.sourceId = event;
  }

  public handleCloseOnline() {
    if (!this.sourceId) {
      this.isOnline = false;
    } else {
      this.isOnline = false;
      if (this.radioStatus) {
        this.$energyApiService.messageTopic.next({
          type: 1, // ????????????  1???????????????  2???????????????
          radioId: this.sourceId,
          radioName: this.equipmentName,
        });
      }
    }
    this.sourceId = null;
    this.isStop = false;
  }

  /**
   * ???????????? ???????????????
   */
  public switchOnlineOperate(type) {
    // ??????????????????????????????
    if (this.sourceId) {
      const params = {
        commandId: ControlInstructEnum.broadcastOnline,
        equipmentIds: [this.equipmentId],
        param: {
          sourceId: this.sourceId, // ??????????????????id  sequenceId
          isStop: type, //  0 - ??????   1 - ??????.
        }
      };
      if (type === '1') {
        params.commandId = ControlInstructEnum.broadcastOnlineStop;
      }
      if (this.savePlanThrottle) {
        return;
      }
      // ?????????????????????????????????
      this.savePlanThrottle = true;
      this.$applicationService.instructDistribute(params).subscribe((res: ResultModel<string>) => {
        if (res.code === ResultCodeEnum.success) {
          const volumeParams = {
            commandId: ControlInstructEnum.broadcastVolume,
            equipmentIds: [this.equipmentId],
            param: {
              volume: this.onlineVolumeValue
            }
          };
          this.radioStatus = type !== '1';
          this.instructDistribute(volumeParams, type);
          this.isStop = type !== '1';
          // ??????????????????
          sessionStorage.setItem('radioData', JSON.stringify(params));
          if (type === '1') {
            sessionStorage.removeItem('radioData');
          }
        } else {
          this.$message.error(res.msg);
        }
      });
    } else {
      this.$message.warning(this.language.selectDevice);
    }
  }

  public queryEquipmentList() {
    this.audioQueryCondition.filterConditions = [
      {
        filterValue: FilterValueConst.callFilter,
        filterField: 'equipmentType',
        operator: 'in'
      },
      {
        filterValue: CallTypeEnum.microphone,
        filterField: 'equipmentModelType',
        operator: 'eq'
      }
    ];
    this.audioQueryCondition.pageCondition.pageSize = 10;
    this.audioQueryCondition.pageCondition.pageNum = 1;
    this.$applicationService.equipmentListByPage(this.audioQueryCondition).subscribe((res: ResultModel<EquipmentListModel[]>) => {
      if (res.code === ResultCodeEnum.success) {
        const {totalCount, pageNum, size, data} = res;
        this.recordEquipmentList = data || [];
        this.audioPageBean.Total = totalCount;
        this.audioPageBean.pageIndex = pageNum;
        this.audioPageBean.pageSize = size;
      } else {
        this.$message.error(res.msg);
      }

    });
  }

  /**
   * ????????????
   * @ param params
   */
  public instructDistribute(params: DistributeModel, type?: string): void {
    this.$applicationService.instructDistribute(params).subscribe((res: ResultModel<string>) => {
      if (res.code === ResultCodeEnum.success) {
        this.$message.success(`${this.languageTable.contentList.distribution}!`);
        if (type === '0') {
          //??????????????????
          this.isStop = true;
        } else {
          //??????????????????
          this.isStop = false;
        }
        this.savePlanThrottle = false;
      } else {
        this.$message.error(res.msg);
      }
    });
  }

  /**
   * ????????????
   */
  public confirmVolume(): void {
    const params: DistributeModel = {
      equipmentIds: this.volumeList.map(item => item.equipmentId),
      commandId: ControlInstructEnum.broadcastVolumeSave,
      param: {
        volume: this.volumeValue
      }
    };
    this.$applicationService.instructDistribute(params).subscribe((res: ResultModel<string>) => {
      if (res.code === ResultCodeEnum.success) {
        const volumeParams = {
          commandId: ControlInstructEnum.broadcastVolume,
          equipmentIds: this.volumeList.map(item => item.equipmentId),
          param: {
            volume: this.volumeValue
          }
        };
        this.instructDistribute(volumeParams);

      } else {
        this.$message.error(res.msg);
      }
    });
  }
}
