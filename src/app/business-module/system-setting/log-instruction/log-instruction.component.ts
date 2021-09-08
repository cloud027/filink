import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {PageModel} from '../../../shared-module/model/page.model';
import {TableConfigModel} from '../../../shared-module/model/table-config.model';
import {FilterCondition, QueryConditionModel, SortCondition} from '../../../shared-module/model/query-condition.model';
import {ColumnConfigService} from '../share/service/column-config.service';
import {ResultCodeEnum} from '../../../shared-module/enum/result-code.enum';
import {FiLinkModalService} from '../../../shared-module/service/filink-modal/filink-modal.service';
import {ApplicationSystemForCommonService} from '../../../core-module/api-service/application-system';
import {InstructionModel} from '../../../core-module/model/instruction-model';
import {OperateResultEnum} from '../share/enum/system-setting.enum';
import {LanguageEnum} from '../../../shared-module/enum/language.enum';
import {NzI18nService} from 'ng-zorro-antd';
import {SystemParameterService} from '../share/service';
import {SystemInterface} from '../../../../assets/i18n/system-setting/system.interface';
import {AssetManagementLanguageInterface} from '../../../../assets/i18n/asset-manage/asset-management.language.interface';
import {OperatorEnum} from '../../../shared-module/enum/operator.enum';


/**
 * 指令日志页面
 */
@Component({
  selector: 'app-log-instruction',
  templateUrl: './log-instruction.component.html',
  styleUrls: ['./log-instruction.component.scss']
})
export class LogInstructionComponent implements OnInit {
  @ViewChild('operateResultTemp') public operateResultTemp: TemplateRef<any>;
  // 表格通用配置
  public dataSet: InstructionModel[] = [];
  // 表格通用分页配置
  public pageBean: PageModel = new PageModel(10, 1, 1);
  // 表格配置
  public tableConfig: TableConfigModel;
  // 查询条件
  public queryCondition: QueryConditionModel = new QueryConditionModel();
  public operateResultEnum = OperateResultEnum;
  public languageEnum = LanguageEnum;
  public systemLanguage: SystemInterface;
  public assetManagementLanguage: AssetManagementLanguageInterface;
  // 语言包
  public language: any = {table: {}, form: {}, common: {}};
  // 指令数据大，分页总条数不采用表格组件的分页，单独处理显示
  public totalCount: number = 0;


  constructor(
    public i18n: NzI18nService,
    private $columnConfigService: ColumnConfigService,
    private $applicationSystemForCommonService: ApplicationSystemForCommonService,
    private $message: FiLinkModalService,
    private $nzI18n: NzI18nService,
    private $systemSettingService: SystemParameterService,
  ) {
    this.systemLanguage = this.$nzI18n.getLocaleData(LanguageEnum.systemSetting);
  }

  public ngOnInit(): void {
    this.language = this.i18n.getLocale();
    this.assetManagementLanguage = this.$nzI18n.getLocaleData(LanguageEnum.assets);
    // 初始化表格配置
    this.initTable();
    this.refreshData();
  }


  /**
   * 刷新数据
   */
  public refreshData(): void {
    this.tableConfig.isLoading = true;
    // 获取最近10条指令下发消息
    this.$applicationSystemForCommonService.getInstructionNoticeList(this.queryCondition).subscribe((res) => {
      this.tableConfig.isLoading = false;
      if (res.code === ResultCodeEnum.success) {
        this.dataSet = res.data;
        this.dataSet.forEach(item => {
          item.success = item.success ? OperateResultEnum.success : OperateResultEnum.failure;
          item.operateObjName = item.operateObjName || this.systemLanguage.system;
        });
        this.pageBean.Total = res.totalPage * res.size;
        this.totalCount = res.totalCount;
        this.pageBean.pageSize = res.size;
        this.pageBean.pageIndex = res.pageNum;
        this.tableConfig.showEsPagination = this.dataSet.length > 0;
      } else {
        this.$message.error(res.msg);
      }
    });
  }

  /**
   * 分页
   * @param event 翻页
   */
  public pageChange(event: PageModel): void {
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
    this.refreshData();
  }


  /**
   * 初始化表格
   */
  private initTable(): void {
    this.tableConfig = {
      isDraggable: true,
      primaryKey: '',
      isLoading: true,
      showSearchSwitch: true,
      showSizeChanger: true,
      scroll: {x: '600px', y: '325px'},
      keepSelected: true,
      selectedIdKey: 'id',
      showSearchExport: true,
      columnConfig: this.$columnConfigService.getInstructionLogColumnConfig(this),
      // 是否显示分页
      showPagination: false,
      // 配合后台es查询分页
      showEsPagination: false,
      bordered: false,
      sort: (event: SortCondition) => {
        this.queryCondition.sortCondition = event;
        this.refreshData();
      },
      handleSearch: (event) => {
        this.queryCondition.pageCondition.pageNum = 1;
        event.forEach(item => {
          if (item.filterField === 'success') {
            item.filterValue = item.filterValue === OperateResultEnum.success;
          }
        });
        this.queryCondition.filterConditions = event;
        if (this.tableConfig.isLoading) {
          return;
        }
        this.refreshData();
      },
      handleExport: (event) => {
        const body = {
          queryCondition: new QueryConditionModel(),
          // 列信息
          columnInfoList: event.columnInfoList,
          // 导出文件类型
          excelType: event.excelType,
        };
        // 处理选择的数据
        if (event && event.selectItem.length > 0) {
          const ids = event.selectItem.map(item => item.id);
          const filter = new FilterCondition('id', OperatorEnum.in, ids);
          body.queryCondition.filterConditions.push(filter);
        }
        this.exportTable(body);
      }
    };
  }

  /**
   * 导出指令下发表格表格
   * @param body 导出内容格式等
   */
  private exportTable(body): void {
    this.$systemSettingService.exportInstruction(body).subscribe((res) => {
      if (res.code === ResultCodeEnum.success) {
        this.$message.success(this.assetManagementLanguage.exportSucceededTip);
      } else {
        this.$message.info(res.msg);
      }
    });
  }
}
