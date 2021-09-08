import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {GroupInfoListComponent} from '../../../../shared-module/component/business-component/group-info-list/group-info-list.component';
import {NzI18nService} from 'ng-zorro-antd';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {FacilityForCommonService} from '../../../../core-module/api-service/facility';
import {ColumnConfig} from '../../../../shared-module/model/table-config.model';
import {ApplicationInterface} from '../../../../../assets/i18n/application/application.interface';
import {LanguageEnum} from '../../../../shared-module/enum/language.enum';
import {GroupListModel} from '../../../../core-module/model/group/group-list.model';
import {ResultModel} from '../../../../shared-module/model/result.model';
import {ResultCodeEnum} from '../../../../shared-module/enum/result-code.enum';

@Component({
  selector: 'app-group-list-selector',
  templateUrl: './group-list-selector.component.html',
})
export class GroupListSelectorComponent extends GroupInfoListComponent implements OnInit {
  @Input() public selectGroupIds;
  @Output() public selectDataChange = new EventEmitter<GroupListModel[]>();
  public columnConfig: ColumnConfig[] = [];
  public selectData: GroupListModel[];
  // 设备列表多语言
  public languageTable: ApplicationInterface;

  constructor(
    public $nzI18n: NzI18nService,
    public $message: FiLinkModalService,
    public $facilityForCommon: FacilityForCommonService
  ) {
    super($nzI18n, $message, $facilityForCommon);
  }

  public ngOnInit(): void {
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.facility);
    this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
    this.initTableConfig();
    // 处理表格初始化列配置
    this.handleColumn();
    //  查询列表
    this.queryData();
  }

  /**
   * 分组列的配置项
   */
  public handleColumn(): void {
    this.tableConfig.columnConfig.unshift({type: 'select', fixedStyle: {fixedLeft: true, style: {left: '0px'}}, width: 62});
    // 列表选中
    this.tableConfig.handleSelect = (event) => {
      this.selectData = event;
    };
  }

  /**
   * 确定选择分组
   */
  public confirmSelectGroupInfo(): void {
    this.groupVisible = false;
    this.selectDataChange.emit(this.selectData);
  }
  /**
   * 查询列表数据
   */
  public queryData(): void {
    this.tableConfig.isLoading = true;
    this.queryCondition.bizCondition = {equipmentId: this.equipmentId, deviceId: this.deviceId};
    this.$facilityForCommon.queryGroupInfoByEquipmentId(this.queryCondition).subscribe(
      (result: ResultModel<GroupListModel[]>) => {
        if (result.code === ResultCodeEnum.success) {
          this.tableConfig.isLoading = false;
          this.dataSet = result.data;
          this.initSelectData();
          this.pageBean.pageIndex = result.pageNum;
          this.pageBean.Total = result.totalCount;
          this.pageBean.pageSize = result.size;
        } else {
          this.tableConfig.isLoading = false;
          this.$message.error(result.msg);
        }
      }, () => { this.tableConfig.isLoading = false; });
  }
  /**
   * 回显勾选分组
   */
  private initSelectData(): void {
    if (this.selectGroupIds.length > 0) {
      this.dataSet.forEach(item => {
        item.checked = this.selectGroupIds.includes(item.groupId);
      });
    }
  }
}
