import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {NzI18nService} from 'ng-zorro-antd';
import * as _ from 'lodash';
import {ColumnConfigService} from '../../share/service/column-config.service';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {BasicConfig} from '../../share/service/basic-config';
import {Download} from '../../../../shared-module/util/download';
import {PageModel} from '../../../../shared-module/model/page.model';
import {FilterCondition, QueryConditionModel, SortCondition} from '../../../../shared-module/model/query-condition.model';
import {RuleUtil} from '../../../../shared-module/util/rule-util';
import {SystemParameterService} from '../../share/service';
import {CommonLanguageInterface} from '../../../../../assets/i18n/common/common.language.interface';
import {ResultModel} from '../../../../shared-module/model/result.model';
import {LanguageEnum} from '../../../../shared-module/enum/language.enum';
import {DeviceProtocolListModel} from '../../share/mode/device-protocol-list.model';
import {EquipmentTypeEnum} from '../../../../core-module/enum/equipment/equipment.enum';
import {OperateTypeEnum} from '../../../../shared-module/enum/page-operate-type.enum';
import {Router} from '@angular/router';
import {ProtocolTypeEnum} from '../../share/enum/protocol-type.enum';
import {CommonUtil} from '../../../../shared-module/util/common-util';

/**
 * 接入协议管理
 */
@Component({
  selector: 'app-facility-agreement',
  templateUrl: './facility-agreement.component.html',
  styleUrls: ['./facility-agreement.component.scss']
})
export class FacilityAgreementComponent extends BasicConfig implements OnInit {
  // 文件下载
  @ViewChild('fileNameRef') public fileNameRef: TemplateRef<HTMLDocument>;
  //  设备配置文件
  @ViewChild('equipmentConfigFileNameRef') public equipmentConfigFileNameRef: TemplateRef<HTMLDocument>;
  // SSL证书下载
  @ViewChild('sslFileNameRef') public sslFileNameRef: TemplateRef<HTMLDocument>;
  // 设备类型
  @ViewChild('equipmentTypeTemp') equipmentTypeTemp: TemplateRef<any>;
  // 通信协议
  @ViewChild('communicationProtocolTemp') communicationProtocolTemp: TemplateRef<any>;
  // 接入方式
  @ViewChild('accessModeTemp') accessModeTemp: TemplateRef<any>;
  // 协议id
  public protocolId: string = '';
  // 分页
  public pageBean: PageModel = new PageModel(10);
  // 查询条件
  public queryConditions: QueryConditionModel = new QueryConditionModel();
  // 国际化
  public commonLanguage: CommonLanguageInterface;
  // 设备类型枚举
  public equipmentTypeEnum = EquipmentTypeEnum;
  // 国际化枚举
  public languageEnum = LanguageEnum;
  // 通信协议枚举
  public protocolTypeEnum = ProtocolTypeEnum;

  constructor(
    public $nzI18n: NzI18nService,
    private $columnConfigService: ColumnConfigService,
    private $message: FiLinkModalService,
    private fb: FormBuilder,
    private $download: Download,
    private $ruleUtil: RuleUtil,
    private $systemSettingService: SystemParameterService,
    private $router: Router
  ) {
    super($nzI18n);
  }

  /**
   * 初始化
   */
  public ngOnInit(): void {
    this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
    this.language = this.$nzI18n.getLocale();
    // 初始化表格
    this.initTableConfig();
    this.searchList();
  }

  /**
   * 分页实体
   * @param event PageModel
   */
  public pageChange(event: PageModel): void {
    this.queryConditions.pageCondition.pageNum = event.pageIndex;
    this.queryConditions.pageCondition.pageSize = event.pageSize;
    this.searchList();
  }


  /**
   * 查询设施协议列表
   */
  public searchList(): void {
    this.tableConfig.isLoading = true;
    this.$systemSettingService.queryDeviceProtocolList(this.queryConditions)
      .subscribe((result: ResultModel<DeviceProtocolListModel[]>) => {
        this.tableConfig.isLoading = false;
        if (result.code === 0) {
          this._dataSet = result.data;
          this.pageBean.Total = result.totalCount;
          this.pageBean.pageIndex = result.pageNum;
          this.pageBean.pageSize = result.size;
          if (!_.isEmpty(this._dataSet)) {
            this._dataSet.forEach(item => {
              // 获取设备图标样式
              if (item.equipmentType) {
                item.iconClass = CommonUtil.getEquipmentIconClassName(item.equipmentType);
              }
            });
          }
        }
      }, () => {
        this.tableConfig.isLoading = false;
      });
  }

  /**
   * 删除协议脚本
   * param protocolIds
   */
  public deleteFacility(protocolIds: Array<string>): void {
    this.$systemSettingService.deleteDeviceProtocol(protocolIds).subscribe((result: ResultModel<string>) => {
      if (result.code === 0) {
        this.$message.success(result.msg);
        this.searchList();
      } else {
        this.$message.error(result.msg);
      }
    });
  }

  /**
   * 文件下载
   * param item
   */
  public download(item: DeviceProtocolListModel, type: string): void {
    if (type === 'file') {
      this.$download.downloadFile(item.fileDownloadUrl, item.fileName);
    } else if (type === 'equipmentConfig') {
      this.$download.downloadFile(item.equipmentConfigFileDownloadUrl, item.equipmentConfigFileName);
    } else {
      this.$download.downloadFile(item.sslCertificateFileDownloadUrl, item.sslCertificateFileName);
    }
  }

  /**
   * 跳转到新增/编辑协议界面
   */
  public openProtocol(type: string, protocolId?: string): void {
    this.$router.navigate([`business/system/agreement/facility/${type}`], {
      queryParams: {id: protocolId}
    }).then();
  }

  /**
   * 初始化表单
   */
  private initTableConfig(): void {
    this.tableConfig = {
      primaryKey: '04-3-1',
      isDraggable: true,
      isLoading: false,
      showSearchSwitch: true,
      showPagination: true,
      showSizeChanger: true,
      scroll: {x: '600px', y: '325px'},
      columnConfig: this.$columnConfigService.getFacilityColumnConfig({
        fileName: this.fileNameRef,
        equipmentConfigFileName: this.equipmentConfigFileNameRef,
        sslFileName: this.sslFileNameRef,
        equipmentTypeTemp: this.equipmentTypeTemp,
        communicationProtocolTemp: this.communicationProtocolTemp,
        accessModeTemp: this.accessModeTemp
      }),
      bordered: false,
      showSearch: false,
      topButtons: [
        {
          // 新增
          text: this.language.table.add,
          iconClassName: 'fiLink-add-no-circle',
          permissionCode: '04-3-1-1',
          handle: () => {
            this.openProtocol(OperateTypeEnum.add);
          }
        },
        {
          // 删除
          text: this.language.table.delete,
          btnType: 'danger',
          needConfirm: true,
          canDisabled: true,
          permissionCode: '04-3-1-2',
          className: 'table-top-delete-btn',
          iconClassName: 'fiLink-delete',
          handle: (data: DeviceProtocolListModel[]) => {
            if (data.length === 0) {
              this.$message.warning(this.language.agreement.pleaseCheckToDeleteTheDataFirst + '!');
              return;
            }
            const ids = data.map(item => item.protocolId);
            this.deleteFacility(ids);
          }
        }
      ],
      sort: (e: SortCondition) => {
        this.queryConditions.sortCondition = e;
        this.searchList();
      },
      handleSearch: (event: FilterCondition[]) => {
        this.queryConditions.pageCondition.pageNum = 1;
        this.handleSearch(event);
      },
      operation: [
        {
          // 编辑
          text: this.language.facility.update,
          permissionCode: '04-3-1-2',
          className: 'fiLink-edit',
          handle: (data: DeviceProtocolListModel) => {
            this.openProtocol(OperateTypeEnum.update, data.protocolId);
          }
        },
        {
          // 删除
          text: this.language.table.delete,
          className: 'fiLink-delete red-icon',
          permissionCode: '04-3-1-3',
          needConfirm: true,
          handle: (current: DeviceProtocolListModel) => {
            this.deleteFacility([current.protocolId]);
          }
        }],
    };
  }
}
