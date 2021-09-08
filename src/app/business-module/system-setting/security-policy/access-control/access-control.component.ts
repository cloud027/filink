import {Component, OnInit, ViewChild, TemplateRef} from '@angular/core';
import {ColumnConfigService} from '../../share/service/column-config.service';
import {NzI18nService} from 'ng-zorro-antd';
import {BasicConfig} from '../../share/service/basic-config';
import {SystemParameterService} from '../../share/service';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {PageModel} from '../../../../shared-module/model/page.model';
import {FilterCondition, QueryConditionModel, SortCondition} from '../../../../shared-module/model/query-condition.model';
import {ResultModel} from '../../../../shared-module/model/result.model';
import {RangeModel} from '../../share/mode/range.model';
import {LanguageEnum} from '../../../../shared-module/enum/language.enum';
import {CommonLanguageInterface} from '../../../../../assets/i18n/common/common.language.interface';
import {StatusEnum} from '../../share/enum/system-setting.enum';
import {UpdateRangeStatusModel} from '../../share/mode/update-range-status.model';

/**
 * 访问控制列表
 */
@Component({
  selector: 'app-access-control',
  templateUrl: './access-control.component.html',
  styleUrls: ['./access-control.component.scss']
})
export class AccessControlComponent extends BasicConfig implements OnInit {
  // 状态模板
  @ViewChild('templateStatus') private templateStatus: TemplateRef<HTMLDocument>;
  // 分页参数设置
  public pageBean: PageModel = new PageModel(10);
  // 查询条件
  public queryConditions: QueryConditionModel = new QueryConditionModel();
  // 新增修改是否显示
  public isVisible: boolean = false;
  // 当前访问控制信息
  public curIpInfo: RangeModel = new RangeModel();
  // 公共国际化
  public commonLanguage: CommonLanguageInterface;
  // 新增修改title
  public title = this.language.systemSetting.addIPAddressRange;
  // 启用状态
  public statusEnum = StatusEnum;

  constructor(private $columnConfigService: ColumnConfigService,
              private $securityPolicyService: SystemParameterService,
              private $message: FiLinkModalService,
              public $nzI18n: NzI18nService) {
    super($nzI18n);
  }

  public ngOnInit(): void {
    this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
    this.tableConfig = {
      primaryKey: '04-4-1',
      isDraggable: true,
      isLoading: false,
      showSizeChanger: true,
      showSearchSwitch: true,
      scroll: {x: '600px', y: '325px'},
      showPagination: true,
      columnConfig: this.$columnConfigService.getAccessControlColumnConfig(
        {statue: this.templateStatus}),
      bordered: false,
      showSearch: false,
      sort: (e: SortCondition) => {
        this.queryConditions.sortCondition = e;
        this.searchList();
      },
      handleSearch: (event: FilterCondition[]) => {
        this.queryConditions.pageCondition.pageNum = 1;
        this.handleSearch(event);
      },
      topButtons: [
        {
          // 新增
          text: this.language.table.add,
          iconClassName: 'fiLink-add-no-circle',
          permissionCode: '04-4-1-1',
          handle: () => {
            this.curIpInfo = new RangeModel();
            this.title = this.language.systemSetting.addIPAddressRange;
            this.isVisible = true;
          }
        },
        {
          // 删除
          text: this.language.table.delete,
          btnType: 'danger',
          className: 'table-top-delete-btn',
          permissionCode: '04-4-1-3',
          needConfirm: true,
          canDisabled: true,
          iconClassName: 'fiLink-delete',
          handle: (data: RangeModel[]) => {
            const rangeIds = data.map(item => item.rangeId);
            this.delList(rangeIds);
          }
        }
      ],
      moreButtons: [
        {
          // 启用
          text: this.language.systemSetting.selectEnable,
          btnType: 'danger',
          iconClassName: 'fiLink-enable',
          permissionCode: '04-4-1-4',
          handle: (data: RangeModel[]) => {
            const rangeIds = data.map(item => item.rangeId);
            const sentData = {
              rangeIds: rangeIds,
              rangeStatus: StatusEnum.enable
            };
            this.rangeStatus(sentData);
          },
          canDisabled: true,
          className: 'small-button'
        },
        {
          //  禁用
          text: this.language.systemSetting.prohibit,
          btnType: 'danger',
          iconClassName: 'fiLink-disable-o',
          permissionCode: '04-4-1-4',
          handle: (data: RangeModel[]) => {
            const rangeIds = data.map(item => item.rangeId);
            const sentData = {
              rangeIds: rangeIds,
              rangeStatus: StatusEnum.disable
            };
            this.rangeStatus(sentData);

          },
          canDisabled: true,
          className: 'small-button'
        },
        {
          // 全部启用
          text: this.language.systemSetting.allEnabled,
          btnType: 'danger',
          iconClassName: 'fiLink-enable',
          needConfirm: true,
          confirmContent: this.language.systemSetting.isItAllEnabled + '？',
          permissionCode: '04-4-1-4',
          handle: () => {
            this.updateAllRangesStatus(StatusEnum.enable);
          }
        },
        {
          // 全部禁用
          text: this.language.systemSetting.disableAll,
          btnType: 'danger',
          iconClassName: 'fiLink-disable-o',
          needConfirm: true,
          permissionCode: '04-4-1-4',
          confirmContent: this.language.systemSetting.isItAllDisabled + '？',
          handle: () => {
            this.updateAllRangesStatus(StatusEnum.disable);
          }
        }
      ],
      operation: [
        {
          // 编辑
          text: this.language.facility.update,
          className: 'fiLink-edit',
          permissionCode: '04-4-1-2',
          handle: (current: RangeModel) => {
            this.title = this.language.systemSetting.modifyIPAddressRange;
            this.isVisible = true;
            this.curIpInfo = current;
          }
        },
        {
          // 删除
          text: this.language.table.delete,
          className: 'fiLink-delete red-icon',
          permissionCode: '04-4-1-3',
          needConfirm: true,
          handle: (current: RangeModel) => {
            this.delList([current.rangeId]);
          }
        }],
    };
    this.searchList();
  }

  public pageChange(event: PageModel): void {
    this.queryConditions.pageCondition.pageNum = event.pageIndex;
    this.queryConditions.pageCondition.pageSize = event.pageSize;
    this.searchList();
  }

  /**
   * 新增修改取消按钮
   */
  public detailCancel(item: boolean): void {
    this.isVisible = false;
    // 取消则不重新查询
    if (item) {
      this.searchList();
    }
  }

  /**
   * 启用/禁用切换
   * param item
   */
  public changeStatue(item: RangeModel): void {
    const sentData = {
      rangeIds: [item.rangeId],
      rangeStatus: StatusEnum.enable
    };
    // 处理动画
    this._dataSet.forEach(obj => {
      if (obj.rangeId === item.rangeId) {
        obj.clicked = true;
      }
    });
    item.rangeStatus === StatusEnum.enable ? sentData.rangeStatus = StatusEnum.disable : sentData.rangeStatus = StatusEnum.enable;
    this.$securityPolicyService.updateRangeStatus(sentData).subscribe((result: ResultModel<RangeModel>) => {
      if (result.code === 0) {
        this._dataSet.forEach(obj => {
          obj.clicked = false;
          if (obj.rangeId === item.rangeId) {
            obj.rangeStatus === StatusEnum.enable ? obj.rangeStatus = StatusEnum.disable : obj.rangeStatus = StatusEnum.enable;
          }
        });
      } else {
        this.$message.error(result.msg);
        this.searchList();
      }
    });
  }

  /**
   * 查询控制列表
   */
  public searchList(): void {
    this.tableConfig.isLoading = true;
    this.$securityPolicyService.queryRangesAll(this.queryConditions).subscribe((result: ResultModel<RangeModel[]>) => {
      this.tableConfig.isLoading = false;
      if (result.code === 0) {
        this._dataSet = result.data;
        this.pageBean.Total = result.totalCount;
        this.pageBean.pageIndex = result.pageNum;
        this.pageBean.pageSize = result.size;
      }
    });
  }

  /**
   * 删除访问控制列表
   * param ids
   */
  private delList(ids: Array<string>): void {
    this.$securityPolicyService.deleteRanges(ids).subscribe((result: ResultModel<string>) => {
      if (result.code === 0) {
        this.$message.success(result.msg);
        this.searchList();
      } else {
        this.$message.error(result.msg);
      }
    });
  }

  /**
   * 全部启用/禁用
   */
  private updateAllRangesStatus(rangeStatus: StatusEnum): void {
    const body = {
      rangeStatus: rangeStatus
    };
    this.$securityPolicyService.updateAllRangesStatus(body).subscribe((result: ResultModel<string>) => {
      if (result.code === 0) {
        this.searchList();
      } else {
        this.$message.error(result.msg);
      }
    });
  }

  /**
   * 批量启用/禁用
   */
  public rangeStatus(body: UpdateRangeStatusModel): void {
    this.$securityPolicyService.updateRangeStatus(body).subscribe((result: ResultModel<RangeModel>) => {
      if (result.code === 0) {
        this.searchList();
      } else {
        this.$message.error(result.msg);
        this.searchList();
      }
    });
  }
}
