import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {PageModel} from '../../../../shared-module/model/page.model';
import {TableConfigModel} from '../../../../shared-module/model/table-config.model';
import {Router} from '@angular/router';
import {DateHelperService, NzI18nService, NzModalRef, NzModalService} from 'ng-zorro-antd';
import {FacilityAuthLanguageInterface} from '../../../../../assets/i18n/facility-authorization/facilityAuth-language.interface';
import {FilterCondition, QueryConditionModel, SortCondition} from '../../../../shared-module/model/query-condition.model';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {FormItem} from '../../../../shared-module/component/form/form-config';
import {FormOperate} from '../../../../shared-module/component/form/form-operate.service';

import {ApplicationService} from '../../share/service/application.service';
import {FacilityLanguageInterface} from '../../../../../assets/i18n/facility/facility.language.interface';
import {CommonUtil} from '../../../../shared-module/util/common-util';
import {FacilityForCommonService} from '../../../../core-module/api-service/facility';
import {ResultModel} from '../../../../shared-module/model/result.model';
import {AuthorityFilterEnum, AuthorityStatusEnum, AuthorityTypeEnum} from '../../share/enum/authority.enum';
import {AuthorizationUtil} from '../../share/util/authorization.util';
import {FacilityListModel} from '../../../../core-module/model/facility/facility-list.model';
import {AuditingModal, AuthorityModel, DeviceAndDoorDataModel} from '../../share/model/authority.model';
import {TimeTypeEnum} from '../../share/enum/program.enum';
import {AuditOperationEnum} from '../../share/enum/operation-button.enum';
import {LanguageEnum} from '../../../../shared-module/enum/language.enum';
import {OperatorEnum} from '../../../../shared-module/enum/operator.enum';
import {DeviceTypeEnum} from '../../../../core-module/enum/facility/facility.enum';
/**
 * ????????????????????????
 */
@Component({
  selector: 'app-temporary-authorization',
  templateUrl: './temporary-authorization.component.html',
  styleUrls: ['./temporary-authorization.component.scss']
})
export class TemporaryAuthorizationComponent implements OnInit {
  // ???????????????????????????
  @ViewChild('userTemp') userTemp: TemplateRef<HTMLDocument>;
  // ????????????????????????
  @ViewChild('authUserTemp') authUserTemp: TemplateRef<HTMLDocument>;
  // ????????????????????????
  @ViewChild('authStatusTemp') authStatusTemp: TemplateRef<HTMLDocument>;
  // ??????????????????????????????
  @ViewChild('facilityListTemp') facilityListTemp: TemplateRef<HTMLDocument>;
  // ????????????
  @ViewChild('deviceStatusTemp') deviceStatusTemp: TemplateRef<HTMLDocument>;
  // ????????????
  @ViewChild('deviceTypeTemp') deviceTypeTemp: TemplateRef<HTMLDocument>;
  // ?????????????????????
  @ViewChild('doorLocksTemp') doorLocksTemp: TemplateRef<HTMLDocument>;
  // ?????????????????????
  @ViewChild('termTemp') termTemp: TemplateRef<HTMLDocument>;
  // ???????????????
  public dataSet: AuthorityModel[] = [];
  // ????????????
  public pageBean: PageModel = new PageModel(10, 1, 1);
  // ????????????
  public tableConfig: TableConfigModel;
  // ????????????
  public queryCondition: QueryConditionModel = new QueryConditionModel();
  // ????????????
  public filterObject = {};
  // ???????????????
  public facilityDataSet: FacilityListModel[] = [];
  // ????????????????????????
  public facilityPageBean: PageModel = new PageModel(10, 1, 1);
  // ??????????????????
  public facilityTableConfig: TableConfigModel;
  // ??????????????????
  public facilityQueryCondition: QueryConditionModel = new QueryConditionModel();
  // ????????????
  public query_Conditions: QueryConditionModel = new QueryConditionModel();
  // ????????????
  public _query_Conditions_: QueryConditionModel = new QueryConditionModel();
  public formColumn: FormItem[] = [];
  public formStatus: FormOperate;

  public isVisible: boolean = false;
  public isVerifyVisible: boolean = false;
  public isConfirmLoading: boolean = false;
  // ???????????????????????????
  public language: FacilityAuthLanguageInterface;
  // ?????????????????????
  public facilityLanguage: FacilityLanguageInterface;
  // ???????????? ??????2 ??????1
  public authStatus: number = AuthorityStatusEnum.enable;
  // ????????????
  public auditDescription: string = '';
  // ??????id
  public auditId: string = '';
  // ????????????
  public AuditOperation: string = '';
  public idsArray: string[] = [];
  public deviceIds: string[] = [];
  public devicesAndDoorsData: DeviceAndDoorDataModel[] = [];
  // ????????????id
  public applyUserId: string = '';
  public userIdArray: string[] = [];
  // ??????????????????
  public authorityStatusEnum = AuthorityStatusEnum;
  // ????????????
  public authorizationUtil = AuthorizationUtil;
  // ????????????
  public authorityType = AuthorityTypeEnum.temporaryAuthority ;
  // ??????????????????????????????????????????
  public deviceTypeCanSeeList;
  constructor(
    public $router: Router,
    public $nzI18n: NzI18nService,
    public $message: FiLinkModalService,
    public $dateHelper: DateHelperService,
    private $modal: NzModalService,
    private $facilityForCommonService: FacilityForCommonService,
    // ????????????
    private $applicationService: ApplicationService
  ) {
    this.deviceTypeCanSeeList = CommonUtil.codeTranslate(DeviceTypeEnum, this.$nzI18n);
  }


  /**
   * ?????????
   */
  public ngOnInit(): void {
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.facilityAuth);
    this.facilityLanguage = this.$nzI18n.getLocaleData(LanguageEnum.facility);
    this.initTableConfig();
    this.refreshData();
    this.deviceTypeCanSeeList = AuthorizationUtil.getUserCanLookDeviceType(this.deviceTypeCanSeeList);
  }

  /**
   * ????????????????????????
   */
  public refreshData(): void {
    this.tableConfig.isLoading = true;
    this.$applicationService.queryTempAuthList(this.queryCondition).subscribe((res: ResultModel<{ data: AuthorityModel[] }>) => {
      this.tableConfig.isLoading = false;
      this.dataSet = res.data.data;
      // ????????????
      this.setPageConfig(res.data);
      this.dataSet.forEach(item => {
        // ????????????
        item['isExamineShow'] = !item.auditingTime;
      });
    }, () => {
      this.tableConfig.isLoading = false;
    });
  }

  /**
   * ??????
   * @param event ????????????
   */
  public pageChange(event: PageModel): void {
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
    this.refreshData();
  }

  /**
   * ??????????????????
   * @param event ????????????
   */
  public facilityPageChange(event: PageModel): void {
    this.facilityQueryCondition.pageCondition.pageNum = event.pageIndex;
    this.facilityQueryCondition.pageCondition.pageSize = event.pageSize;
    AuthorizationUtil._refreshData(this);
  }

  /**
   * ????????????
   * @param data ??????
   */
  public setPageConfig(data): void {
    this.pageBean.Total = data.totalCount;
    this.pageBean.pageIndex = data.pageNum;
    this.pageBean.pageSize = data.size;
  }

  /**
   * ????????????
   */
  public verifyHandleOk(): void {
    this.isConfirmLoading = true;
    // ????????????
    if (this.AuditOperation === AuditOperationEnum.singleAudit) {
      const params: AuditingModal = {
        id: this.auditId,
        authStatus: Number(this.authStatus),
        auditingDesc: this.auditDescription,
        userId: this.applyUserId
      };
      this.$applicationService.audingTempAuthById(params).subscribe((res: ResultModel<object>) => {
        this.reviewTempAuthJudgment(res);
      });
      // ????????????
    } else if (this.AuditOperation === AuditOperationEnum.batchAudit) {
      const params: AuditingModal = {
        idList: this.idsArray,
        authStatus: Number(this.authStatus),
        auditingDesc: this.auditDescription,
        userIdList: this.userIdArray
      };
      this.$applicationService.audingTempAuthByIds(params).subscribe((res: ResultModel<object>) => {
        this.reviewTempAuthJudgment(res);
      });
    }

  }

  /**
   * ????????????
   */
  public verifyHandleCancel(): void {
    this.isVerifyVisible = false;
    this.authStatus = AuthorityStatusEnum.enable;
    this.auditDescription = '';
  }

  /**
   * ???????????????
   */
  public goToFirstPage(): void {
    this.queryCondition.pageCondition.pageNum = 1;
    this.refreshData();
  }


  /**
   * ????????????????????????
   */
  public queryTemporaryAuth(deviceIds): void {
    // ???????????????
    const modal = this.$modal.create({
      nzTitle: this.language.temporaryAuthRange,
      nzContent: this.facilityListTemp,
      nzOkText: this.language.cancel,
      nzCancelText: this.language.confirm,
      nzOkType: 'danger',
      nzClassName: 'custom-create-modal',
      nzWidth: '1000',
      nzFooter: [
        {
          label: this.language.confirm,
          show: false,
          onClick: () => {
            this.modalClose(modal);
          }
        },
        {
          label: this.language.cancel,
          show: false,
          type: 'danger',
          onClick: () => {
            this.modalClose(modal);
          }
        },
      ]
    });
    //  ??????????????????
    const query_Conditions: FilterCondition[] = [
      {
        filterField: 'deviceId',
        operator: OperatorEnum.in,
        filterValue: deviceIds
      }
    ];
    query_Conditions.forEach(item => {
      this.facilityQueryCondition.filterConditions.push(item);
    });
    AuthorizationUtil._refreshData(this);
    // ?????????????????????
    this.query_Conditions = CommonUtil.deepClone(this.facilityQueryCondition);
    // ?????????????????????
    this._query_Conditions_ = CommonUtil.deepClone(this.facilityQueryCondition);
  }


  /**
   * ???????????????
   */
  private initTableConfig(): void {
    this.tableConfig = {
      primaryKey: '09-5-2',
      isDraggable: true,
      isLoading: true,
      showSearchSwitch: true,
      showSizeChanger: true,
      scroll: {x: '2200px', y: '340px'},
      noIndex: true,
      notShowPrint: true,
      columnConfig: [
        {type: 'select', fixedStyle: {fixedLeft: true, style: {left: '0'}}, width: 62},
        {
          // ??????
          type: 'serial-number', width: 62, title: this.language.serialNumber,
          fixedStyle: {fixedLeft: true, style: {left: '62px'}}
        },
        {
          // ??????????????????
          title: this.language.name, key: 'name', width: 150, isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'},
          fixedStyle: {fixedLeft: true, style: {left: '124px'}}
        },
        {
          // ????????????
          title: this.language.authUser, key: 'authUserName', width: 150, isShowSort: true,
          configurable: true,
          searchable: true,
          type: 'render',
          renderTemplate: this.authUserTemp,
          searchConfig: {type: 'input'}
        },
        {
          // ???????????????
          title: this.language.user, key: 'userName', width: 150, isShowSort: true,
          configurable: true,
          searchable: true,
          type: 'render',
          renderTemplate: this.userTemp,
          searchConfig: {type: 'input'}
        },
        {
          // ??????
          title: this.language.term, key: 'authExpirationTime', width: 100,
          type: 'render', configurable: true,
          renderTemplate: this.termTemp
        },
        {
          // ????????????
          title: this.language.applyReason, key: 'applyReason', width: 150, isShowSort: true,
          configurable: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        {
          // ????????????
          title: this.language.applyTime, key: 'createTime', width: 180, isShowSort: true,
          configurable: true,
          searchable: true,
          searchConfig: {type: 'dateRang'},
          pipe: 'date'
        },
        {
          // ??????????????????
          title: this.language.authEffectiveTime, key: 'authEffectiveTime', width: 180, isShowSort: true,
          configurable: true,
          searchable: true,
          searchConfig: {type: 'dateRang'},
          pipe: 'date'
        },
        {
          // ??????????????????
          title: this.language.authExpirationTime, key: 'authExpirationTime', width: 180, isShowSort: true,
          configurable: true,
          searchable: true,
          searchConfig: {type: 'dateRang'},
          pipe: 'date'
        },
        {
          // ????????????
          title: this.language.auditingTime, key: 'auditingTime', width: 180, isShowSort: true,
          configurable: true,
          searchable: true,
          searchConfig: {type: 'dateRang'},
          pipe: 'date'
        },
        {
          // ????????????
          title: this.language.authStatus, key: 'authStatus', width: 100, isShowSort: true,
          configurable: true,
          searchable: true,
          type: 'render',
          renderTemplate: this.authStatusTemp,
          searchConfig: {
            type: 'select',
            selectInfo: [
              {label: this.language.takeEffect, value: 2},
              {label: this.language.prohibit, value: 1}
            ]
          },
          handleFilter: () => {
          },
        },
        {
          // ????????????
          title: this.language.auditingDesc, key: 'auditingDesc', width: 200, isShowSort: true,
          configurable: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        {
          // ??????
          title: this.language.operate, searchable: true,
          searchConfig: {type: 'operate'}, key: '', width: 100, fixedStyle: {fixedRight: true, style: {right: '0px'}}
        },
      ],
      showPagination: true,
      bordered: false,
      showSearch: false,
      searchReturnType: 'Object',
      topButtons: [
        {
          // ??????
          text: this.language.examine,
          iconClassName: 'fiLink-check',
          canDisabled: true,
          permissionCode: '09-5-2-2',
          handle: (data) => {
            if (data.some(_item => _item.auditingTime)) {
              this.$message.error(this.language.examineMsg);
              return false;
            }
            const nowTime = CommonUtil.getTimeStamp(new Date());
            const checkTime = data.every(item => {
              const expirationTime = CommonUtil.getTimeStamp(new Date(item.authExpirationTime));
              return expirationTime > nowTime;
            });
            if (checkTime === true) {
              // ??????
              this.idsArray = [];
              // ??????
              this.userIdArray = [];
              // ??????????????????
              this.AuditOperation = AuditOperationEnum.batchAudit;
              for (const item of data) {
                this.idsArray.push(item.id);
              }
              this.userIdArray = data.map(item => {
                return item.userId;
              });
              this.isVerifyVisible = true;
            } else {
              this.$message.info(this.language.overdueAudit);
            }
          }
        },
        {
          // ??????
          text: this.language.delete,
          btnType: 'danger',
          className: 'table-top-delete-btn',
          iconClassName: 'fiLink-delete',
          needConfirm: true,
          confirmContent: this.language.deleteAuthorizationTaskTips,
          canDisabled: true,
          permissionCode: '09-5-2-4',
          handle: (data) => {
            const ids = [];
            data.map(item => {
              ids.push(item.id);
            });
            this.$applicationService.deleteTempAuthByIds(ids).subscribe((res: ResultModel<string>) => {
              this.deleteJudgment(res);
            });
          }
        }
      ],
      operation: [
        {
          // ??????
          text: this.language.examine,
          className: 'fiLink-check',
          key: 'isExamineShow',
          permissionCode: '09-5-2-2',
          handle: (currentIndex) => {
            const nowTime = CommonUtil.getTimeStamp(new Date());
            const expirationTime = CommonUtil.getTimeStamp(new Date(currentIndex.authExpirationTime));
            if (expirationTime > nowTime) {
              this.auditId = currentIndex.id;
              this.applyUserId = currentIndex.userId;
              // ??????????????????
              this.AuditOperation = AuditOperationEnum.singleAudit;
              this.isVerifyVisible = true;
            } else {
              this.$message.info(this.language.overdueAudit);
            }
          }
        },
        {
          // ????????????
          text: this.language.authRange,
          className: 'fiLink-authority',
          permissionCode: '09-5-2-6',
          handle: (currentIndex) => {
            AuthorizationUtil.initFacilityTableConfig(this);
            // ??????
            this.deviceIds = [];
            // ??????
            this.facilityQueryCondition.filterConditions = [];
            // ????????????????????????
            this.$applicationService.queryTempAuthById(currentIndex.id).subscribe((res: ResultModel<AuthorityModel>) => {
              this.devicesAndDoorsData = res.data.authDeviceList;
              const data = res.data.authDeviceList;
              data.forEach(item => {
                this.deviceIds.push(item.deviceId);
              });
              this.queryTemporaryAuth(this.deviceIds);
            });

          }
        },
        {
          // ??????
          text: this.language.delete,
          needConfirm: true,
          confirmContent: this.language.deleteAuthorizationTaskTips,
          className: 'fiLink-delete red-icon',
          permissionCode: '09-5-2-4',
          handle: (currentIndex) => {
            this.$applicationService.deleteTempAuthById(currentIndex.id).subscribe((res: ResultModel<any>) => {
              this.deleteJudgment(res);
            });

          }
        }
      ],
      leftBottomButtons: [],
      sort: (event: SortCondition) => {
        const obj: SortCondition = new SortCondition;
        obj['sortProperties'] = event.sortField;
        obj['sort'] = event.sortRule;
        this.queryCondition.bizCondition = Object.assign(this.filterObject, obj);
        this.refreshData();
      },
      handleSearch: (event: FilterCondition[]) => {
        const obj = {};
        event.forEach(item => {
          if (item.operator === OperatorEnum.gte && item.filterField === AuthorityFilterEnum.createTime) {
            obj['createTime'] = this.changeTime(item.filterValue, TimeTypeEnum.start);
          } else if (item.operator === OperatorEnum.gte && item.filterField === AuthorityFilterEnum.authEffectiveTime) {
            obj['authEffectiveTime'] = this.changeTime(item.filterValue, TimeTypeEnum.start);
          } else if (item.operator === OperatorEnum.gte && item.filterField === AuthorityFilterEnum.authExpirationTime) {
            obj['authExpirationTime'] = this.changeTime(item.filterValue, TimeTypeEnum.start);
          } else if (item.operator === OperatorEnum.gte && item.filterField === AuthorityFilterEnum.auditingTime) {
            obj['auditingTime'] = this.changeTime(item.filterValue, TimeTypeEnum.start);
          } else if (item.operator === OperatorEnum.lte && item.filterField === AuthorityFilterEnum.createTime) {
            obj['createTimeEnd'] = this.changeTime(item.filterValue, TimeTypeEnum.end);
          } else if (item.operator === OperatorEnum.lte && item.filterField === AuthorityFilterEnum.authEffectiveTime) {
            obj['authEffectiveTimeEnd'] = this.changeTime(item.filterValue, TimeTypeEnum.end);
          } else if (item.operator === OperatorEnum.lte && item.filterField === AuthorityFilterEnum.authExpirationTime) {
            obj['authExpirationTimeEnd'] = this.changeTime(item.filterValue, TimeTypeEnum.end);
          } else if (item.operator === OperatorEnum.lte && item.filterField === AuthorityFilterEnum.auditingTime) {
            obj['auditingTimeEnd'] = this.changeTime(item.filterValue, TimeTypeEnum.end);
          } else {
            obj[item.filterField] = item.filterValue;
          }
        });
        this.queryCondition.pageCondition.pageNum = 1;
        this.filterObject = obj;
        this.queryCondition.bizCondition = Object.assign(this.filterObject, obj);
        this.refreshData();
      }
    };
  }

  /**
   * ???????????????
   * @param time ??????
   * @param type start:???????????? end:????????????
   */
  public changeTime(time, type: string) {
    const timeString = CommonUtil.dateFmt('yyyy/MM/dd', new Date(time));
    const date = new Date(type === TimeTypeEnum.start ? `${timeString} 00:00:00` : `${timeString} 23:59:59`);
    return typeof date === 'string' ? Date.parse(date) : CommonUtil.getTimeStamp(date);
  }

  /**
   * ???????????????????????????
   */
  private deleteJudgment(res: ResultModel<any>) {
    if (res.code === 0) {
      this.$message.success(res.msg);
      this.goToFirstPage();
      // ?????????????????????????????????
    } else if (res.code === 120390) {
      this.$message.info(res.msg);
      this.goToFirstPage();
      // ???????????????????????????
    } else if (res.code === 120400) {
      this.$message.info(res.msg);
    } else {
      this.$message.error(res.msg);
    }
  }


  /**
   * ?????????????????????
   */
  private reviewTempAuthJudgment(res): void {
    this.isConfirmLoading = false;
    this.isVerifyVisible = false;
    this.authStatus = AuthorityStatusEnum.enable;
    this.auditDescription = '';
    if (res.code === 0) {
      this.$message.success(res.msg);
      // ????????????????????????
      this.goToFirstPage();
      // ????????????
    } else if (res.code === 120380) {
      this.$message.info(res.msg);
      // ????????????????????????
    } else if (res.code === 120390) {
      this.$message.info(res.msg);
      this.goToFirstPage();
    } else {
      this.$message.error(res.msg);
    }
  }


  /**
   * ???????????????
   */
  private modalClose(modal: NzModalRef<{}, any>): void {
    this.facilityQueryCondition.pageCondition.pageNum = 1;
    this.devicesAndDoorsData = [];
    modal.destroy();
  }


}

