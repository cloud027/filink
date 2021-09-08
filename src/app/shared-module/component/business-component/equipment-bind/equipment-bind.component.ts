import {Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild} from '@angular/core';
import * as _ from 'lodash';
import {FiLinkModalService} from '../../../service/filink-modal/filink-modal.service';
import {NzI18nService, NzModalService} from 'ng-zorro-antd';
import {FacilityForCommonService} from '../../../../core-module/api-service/facility';
import {PageModel} from '../../../model/page.model';
import {TableConfigModel} from '../../../model/table-config.model';
import {FilterCondition, QueryConditionModel, SortCondition} from '../../../model/query-condition.model';
import {CommonLanguageInterface} from '../../../../../assets/i18n/common/common.language.interface';
import {LanguageEnum} from '../../../enum/language.enum';
import {FacilityLanguageInterface} from '../../../../../assets/i18n/facility/facility.language.interface';
import {PAGE_NO_DEFAULT_CONST} from '../../../../core-module/const/common.const';
import {ResultModel} from '../../../model/result.model';
import {ResultCodeEnum} from '../../../enum/result-code.enum';
import {InstructSendModel} from '../../../../core-module/model/group/instruct-send.model';
import {AssetManagementLanguageInterface} from '../../../../../assets/i18n/asset-manage/asset-management.language.interface';
import {OperatorEnum} from '../../../enum/operator.enum';
import {EquipmentListModel} from '../../../../core-module/model/equipment/equipment-list.model';
import {ControlInstructEnum} from '../../../../core-module/enum/instruct/control-instruct.enum';
import {ApplicationSystemForCommonService} from '../../../../core-module/api-service/application-system';
import {PageSizeEnum} from '../../../enum/page-size.enum';
import {EquipmentApiService} from '../../../../business-module/facility/share/service/equipment/equipment-api.service';

/**
 * 设备绑定组件
 */
@Component({
  selector: 'app-equipment-bind',
  templateUrl: './equipment-bind.component.html',
  styleUrls: ['./equipment-bind.component.scss']
})
export class EquipmentBindComponent implements OnInit {
  @Input() public gatewayId: string;
  // 入参设备id
  @Input() public centerControlId: string;
  // 显示隐藏变化
  @Output() public visibleChange = new EventEmitter<any>();
  // 线缆编号
  @ViewChild('cableNumTemp') private cableNumTemp: TemplateRef<HTMLDocument>;
  // 档案编号模版
  @ViewChild('fileNoTemp') private fileNoTemp: TemplateRef<HTMLDocument>;
  // 分组编号
  @ViewChild('groupNoTemp') private groupNumTemp: TemplateRef<HTMLDocument>;
  // 列表数据
  public dataSet: EquipmentListModel[] = [];
  // 分页参数
  public pageBean: PageModel = new PageModel(PageSizeEnum.sizeFive, 1);
  // 表格参数
  public tableConfig: TableConfigModel;
  // 列表查询条件
  public queryCondition: QueryConditionModel = new QueryConditionModel();
  // 公共国际化
  public commonLanguage: CommonLanguageInterface;
  // 设施国际化
  public language: FacilityLanguageInterface;
  // 查询列表数据返回的设备id
  public equipmentIds: string[] = [];
  // 资产国际化
  private assetLanguage: AssetManagementLanguageInterface;

  /**
   * 构造器
   */
  constructor(private $nzI18n: NzI18nService,
              private $message: FiLinkModalService,
              private $modalService: NzModalService,
              private $applicationCommonService: ApplicationSystemForCommonService,
              private $facilityCommonService: FacilityForCommonService,
              private $EquipmentApiService: EquipmentApiService) {
  }

  public ngOnInit(): void {
    this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.facility);
    this.assetLanguage = this.$nzI18n.getLocaleData(LanguageEnum.assets);
    this.queryCondition.pageCondition.pageNum = this.pageBean.pageIndex;
    this.queryCondition.pageCondition.pageSize = this.pageBean.pageSize;
    // 初始化表格
    this.initTaleConfig();
    // 查询数据
    this.queryDataList();
  }

  /**
   * 切换页面大小事件
   */
  public pageChange(event: PageModel): void {
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
    this.queryDataList();
  }

  /**
   * 修改分组编号
   */
  public onChangeGroupNum(data: EquipmentListModel): void {
    data.equipmentGroupNum = data.equipmentGroupNum.replace(/\D/g, '');
    if (Number(data.equipmentGroupNum) > 10 || Number(data.equipmentGroupNum) < 1) {
      data['groupNumStatus'] = 'xc-form-error';
      data.equipmentGroupNum = '';
      data['errorMsg'] = this.language.groupNumRule;
    } else {
      data['groupNumStatus'] = '';
      data['errorMsg'] = null;
    }
  }

  /**
   * 修改档案编号字段事件
   */
  public onChangeDocNum(data: EquipmentListModel): void {
    data.equipmentDocNum = data.equipmentDocNum.replace(/\D/g, '');
    if (Number(data.equipmentDocNum) < 1 || Number(data.equipmentDocNum) > 1024) {
      data['numStatus'] = 'xc-form-error';
      data.equipmentDocNum = '';
      data['docErrorMsg'] = this.language.docNumRule;
    } else {
      data['numStatus'] = '';
      data['docErrorMsg'] = null;
    }
  }

  /**
   * 初始化表格
   */
  public initTaleConfig(): void {
    this.tableConfig = {
      primaryKey: '03-8-bind',
      isDraggable: false,
      isLoading: true,
      showSearchSwitch: true,
      notShowPrint: true,
      showSizeChanger: true,
      noAutoHeight: false,
      scroll: {x: '700px', y: '580px'},
      noIndex: true,
      showSearchExport: false,
      showImport: false,
      showPagination: true,
      columnConfig: [
        { // 选择
          title: this.language.select,
          type: 'select',
          width: 62
        },
        { // 序号
          type: 'serial-number',
          width: 70,
          title: this.commonLanguage.serialNumber
        },
        { // 名称
          title: this.language.equipmentName,
          key: 'equipmentName',
          searchable: true,
          isShowSort: true,
          width: 180,
          searchConfig: {type: 'input'},
        },
        {
          // 线缆编号
          title: this.language.cableNo,
          key: 'cableNum',
          type: 'render',
          renderTemplate: this.cableNumTemp,
          searchable: true,
          width: 150,
          isShowSort: true,
          searchConfig: {type: 'input'},
        },
        { // 设备编号
          title: this.language.fileNo,
          key: 'equipmentDocNum',
          type: 'render',
          renderTemplate: this.fileNoTemp,
          searchable: true,
          isShowSort: true,
          width: 150,
          searchConfig: {type: 'input'},
        },
        { // 分组编号
          title: this.language.groupNo,
          key: 'equipmentGroupNum',
          type: 'render',
          renderTemplate: this.groupNumTemp,
          searchable: true,
          width: 150,
          isShowSort: true,
          searchConfig: {type: 'input'},
        },
        { // 操作
          title: this.commonLanguage.operate,
          searchable: true,
          width: 150,
          searchConfig: {type: 'operate'},
          key: '',
        }
      ],
      topButtons: [
        {
          text: this.language.equipmentDocConfig,
          iconClassName: 'fiLink-peizhi',
          className: 'equipment-batch-config-btn',
          canDisabled: true,
          handle: (data: EquipmentListModel[]) => {
            const noSequenceIdData = data.filter(item => !item.sequenceId);
            if (!_.isEmpty(noSequenceIdData)) {
              this.$message.info(this.language.selectedDataHasNoSequenceId);
              return;
            }
            const noEquipmentDocNum = data.filter(v => !v.equipmentDocNum);
            if (!_.isEmpty(noEquipmentDocNum)) {
              this.$message.info(this.language.configTip);
              return;
            }
            const noEquipmentCableNum = data.filter(v => !v.cableNum);
            if (!_.isEmpty(noEquipmentCableNum)) {
              this.$message.info(this.language.cableNoMustNotBeNull);
              return;
            }
            this.sendConfigInstruct(data, ControlInstructEnum.docNum);
          }
        },
        {
          text: this.language.equipmentGroupConfig,
          iconClassName: 'fiLink-normal-x',
          className: 'equipment-batch-config-btn',
          canDisabled: true,
          handle: (data: EquipmentListModel[]) => {
            const noSequenceIdData = data.filter(item => !item.sequenceId);
            if (!_.isEmpty(noSequenceIdData)) {
              this.$message.info(this.language.selectedDataHasNoSequenceId);
              return;
            }
            const noEquipmentNoData = data.filter(v => !v.equipmentGroupNum);
            if (!_.isEmpty(noEquipmentNoData)) {
              this.$message.info(this.language.pleaseConfigEquipmentNoFirst);
              return;
            }
            const noEquipmentGroupNum = data.filter(v => !v.equipmentGroupNum);
            if (!_.isEmpty(noEquipmentGroupNum)) {
              this.$message.info(this.language.groupNoMustNotBeNull);
              return;
            }
            this.sendConfigInstruct(data, ControlInstructEnum.groupNum);
          }
        },
      ],
      operation: [
        { // 档案编号配置
          needConfirm: false,
          text: this.language.equipmentDocConfig, className: 'fiLink-peizhi',
          handle: (data: EquipmentListModel) => {
            if (!data.cableNum) {
              this.$message.info(this.language.cableNoMustNotBeNull);
              return;
            }
            if (!data.sequenceId) {
              this.$message.info(this.language.pleaseEnterSqeNo);
              return;
            }
            if (data.equipmentDocNum) {
              // 先校验档案编码的唯一性通过就下发指令
              this.checkEquipmentDocNum(data);
            } else {
              this.$message.info(this.language.equipmentDocNumEmpty);
            }
          },
        },
        { // 组号配置
          needConfirm: false,
          text: this.language.equipmentGroupConfig, className: 'fiLink-normal-x',
          handle: (data: EquipmentListModel) => {
            if (!data.sequenceId) {
              this.$message.info(this.language.pleaseEnterSqeNo);
              return;
            }
            if (!data.equipmentDocNum) {
              this.$message.info(this.language.pleaseConfigEquipmentNoFirst);
              return;
            }
            if (!data.equipmentGroupNum) {
              this.$message.info(this.language.groupNoMustNotBeNull);
              return;
            }
            // 先校验档案编码的唯一性通过就下发指令
            this.sendConfigInstruct([data], ControlInstructEnum.groupNum);
          },
        },
      ],
      handleSearch: (event: FilterCondition[]) => {
        this.queryCondition.filterConditions = event;
        this.queryCondition.pageCondition.pageNum = PAGE_NO_DEFAULT_CONST;
        this.queryDataList();
      },
      sort: (event: SortCondition) => {
        this.queryCondition.sortCondition = event;
        this.queryCondition.pageCondition.pageNum = PAGE_NO_DEFAULT_CONST;
        this.queryDataList();
      }
    };
  }

  /**
   * 查询列表数据
   */
  private queryDataList(): void {
    if (this.centerControlId) {
      const filter = new FilterCondition('centerControlId', OperatorEnum.eq, this.centerControlId);
      this.queryCondition.filterConditions = _.uniqBy(this.queryCondition.filterConditions.concat([filter]), 'filterField');
    }
    this.tableConfig.isLoading = true;
    this.$facilityCommonService.queryEquipmentBind(this.queryCondition).subscribe((res: ResultModel<EquipmentListModel[]>) => {
      if (res.code === ResultCodeEnum.success) {
        this.dataSet = res.data;
        this.pageBean.pageSize = res.size;
        this.pageBean.pageIndex = res.pageNum;
        this.pageBean.Total = res.totalCount;
        this.tableConfig.isLoading = false;
        this.$EquipmentApiService.querySingLightAndCableRelation(this.centerControlId).subscribe((result: ResultModel<any[]>) => {
          if (result.code === ResultCodeEnum.success) {
            result.data.forEach(item => {
              if (item.cableNum !== null) {
                this.dataSet.forEach(_item => {
                  if (item.equipmentId === _item.equipmentId) {
                    _item.equipmentCableOption = [String(item.cableNum)];
                    _item.cableNum = String(item.cableNum);
                  }
                });
              }
            });
          }
        });
      } else {
        this.tableConfig.isLoading = false;
        this.$message.error(res.msg);
      }
    }, () => {
      this.tableConfig.isLoading = false;
    });
    this.tableConfig.isLoading = false;
  }

  /**
   * 下发配置指令
   */
  private sendConfigInstruct(data: EquipmentListModel[], commandId: string): void {
    // 调用指令下发接口
    const body = new InstructSendModel();
    body.commandId = commandId;
    body.equipmentIds = [this.centerControlId];
    const configList = [];
    data.forEach(item => {
      configList.push({
        sequenceId: item.sequenceId,
        equipmentId: item.equipmentId,
        equipmentDocNum: item.equipmentDocNum,
        equipmentGroupNum: item.equipmentGroupNum ? item.equipmentGroupNum : null,
        cableNum: item.cableNum ? item.cableNum : null
      });
    });
    body.param = {configList: configList};
    // 确定指令下发
    this.$modalService.confirm({
      nzTitle: this.language.prompt,
      nzContent: `<span>${this.language.confirmBindEquipment}</span>`,
      nzOkText: this.commonLanguage.cancel,
      nzOkType: 'danger',
      nzMaskClosable: false,
      nzOnOk: () => {
      },
      nzCancelText: this.commonLanguage.confirm,
      nzOnCancel: () => {
        // 调用后台接口
        this.$applicationCommonService.instructDistribute(body).subscribe((res: ResultModel<boolean>) => {
          if (res.code === ResultCodeEnum.success) {
            this.$message.success(this.assetLanguage.instructHasSent);
            data['numStatus'] = '';
            data['groupNumStatus'] = '';
          } else {
            this.$message.error(res.msg);
          }
        });
      }
    });
  }

  /**
   * 档案编号的唯一性校验
   */
  private checkEquipmentDocNum(data: EquipmentListModel): void {
    const body = {
      centerControlId: this.centerControlId,
      equipmentDocNum: data.equipmentDocNum,
      singleControlId: data.equipmentId,
      cableNum: data.cableNum
    };
    this.$facilityCommonService.queryEquipmentDocNumIsExist(body).subscribe((res: ResultModel<boolean>) => {
      if (res.code === ResultCodeEnum.success) {
        if (res.data) {
          this.sendConfigInstruct([data], ControlInstructEnum.docNum);
        } else {
          data['numStatus'] = 'xc-form-error';
          this.$message.info(this.language.equipmentDocNumExist);
        }
      } else {
        this.$message.error(res.msg);
      }
    });
  }
}
