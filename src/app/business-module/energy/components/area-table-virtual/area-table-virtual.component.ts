import {
  Component,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild,
  TemplateRef,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { NzI18nService, NzModalService, NzTableComponent } from 'ng-zorro-antd';
import { TableService } from '../../../../shared-module/component/table/table.service';
import { TableComponent } from '../../../../shared-module/component/table/table.component';
import { FiLinkModalService } from '../../../../shared-module/service/filink-modal/filink-modal.service';
import { TableStylePixelEnum } from '../../../../shared-module/enum/table-style-pixel.enum';
import { AreaLevelEnum } from '../../../../core-module/enum/area/area.enum';
import { SystemForCommonService } from '../../../../core-module/api-service/system-setting';
import { TreeNodeModel } from '../../../../shared-module/model/tree-node.model';
import { CommonUtil } from '../../../../shared-module/util/common-util';
import {
  ColumnConfig,
  Operation,
  TableConfigModel,
} from '../../../../shared-module/model/table-config.model';
import {
  NzTableSortConfig,
  TableSortConfig,
  TableStyleConfigEnum,
} from '../../../../shared-module/enum/table-style-config.enum';
import {
  FilterCondition,
  SortCondition,
} from '../../../../shared-module/model/query-condition.model';
import { Result } from '../../../../shared-module/entity/result';
import { PageModel } from '../../../../shared-module/model/page.model';

declare var $: any;

@Component({
  selector: 'app-area-table-virtual',
  templateUrl: './area-table-virtual.component.html',
  styleUrls: ['./area-table-virtual.component.scss'],
  providers: [TableService],
})
export class AreaTableVirtualComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChild('nzTable') nzTable: NzTableComponent;
  // 导出模板
  @ViewChild('exportTemp') exportTemp: TemplateRef<any>;
  // 选择显示级别的值
  selectedValue = 0;
  // 显示级别的待选项
  @Input() selectedOption = [];
  // 显示级别的待选项placeHolder
  @Input() selectedPlaceHolder;
  // 级别字段key
  @Input() levelKey = 'level';
  // 名称字段key
  @Input() nameKey = 'areaName';
  // 数据集合
  @Input() dataSet = [];
  @Input() selectedData: any[] = [];
  // 列表配置
  @Input() tableConfig: TableConfigModel = new TableConfigModel();
  // 分页实体
  @Input() pageBean: PageModel = new PageModel();
  __dataSet = [];
  // 虚拟滚动最大Buffer高度
  nzVirtualMaxBufferPx;
  // 没数据值
  nzNoResult = '';
  // 列表最大高度
  tableMaxHeight;
  scrollHeight: any;

  // 所有选中
  allChecked = false;
  // 半选状态
  indeterminate = false;
  // 所有不选中
  allUnChecked = true;
  // 设置列配置项
  configurableColumn = [];
  // 下拉选择项
  listOfSelection = [];

  // 是否开始拖拽
  public dragging: boolean;
  // 拖拽线显示
  public resizeProxyShow: boolean;
  // 拖拽状态
  public dragState: {
    startMouseLeft: any
    startLeft: number
    startColumnLeft: number
    tableLeft: number
  };
  // 当前拖拽的列
  public draggingColumn: ColumnConfig;
  // 查询条件
  queryTerm: Map<string, FilterCondition> = new Map<string, FilterCondition>();
  // 日期搜索
  public searchDate = {};
  // 范围日期搜索
  public rangDateValue = {};
  // 导出选择项值
  public exportRadioValue;
  // 拖拽线id
  resizeProxyId = '';
  // 列表id
  tableId = '';
  // 打印了tooltip隐藏
  printVisible;
  // 列设置
  public columnSetting: any;
  // 列设置隐藏显示
  public setColumnVisible: boolean;
  // 列设置数据
  public columnSettings: any[];
  // 导出参数
  public exportQueryTerm: any;
  // 已选数据set
  public keepSelectedData = new Map<string, any>();
  // 为了解决第一次进入表格 有nz-switch产生的动画
  public showPagination: boolean = false;
  public isFireFox: boolean = false;

  // 语言包
  language: any = { table: {}, form: {}, common: {} };
  constructor(
    public modalService: NzModalService,
    public i18n: NzI18nService,
    public $message: FiLinkModalService,
    public $systemParameterService: SystemForCommonService,
    @Inject(DOCUMENT) private document: any,
    public tableService: TableService,
  ) {}

  ngOnInit(): void {
    this.language = this.i18n.getLocale();
    this.listOfSelection = [
      {
        text: this.language.table.SelectAllRow,
        onSelect: () => {
          this.checkAll(true);
        },
      },
      {
        text: this.language.table.SelectOddRow,
        onSelect: () => {
          this.dataSet.forEach((data, index) => (data.checked = index % 2 !== 0));
          this.refreshCheckStatus();
        },
      },
      {
        text: this.language.table.SelectEvenRow,
        onSelect: () => {
          this.dataSet.forEach((data, index) => (data.checked = index % 2 === 0));
          this.refreshCheckStatus();
        },
      },
    ];
    this.initIndexNo();
    this.resizeProxyId = CommonUtil.getUUid();
    this.tableId = CommonUtil.getUUid();
    if (navigator.userAgent.indexOf('Firefox') > -1) {
      this.isFireFox = true;
    }
  }
  ngOnDestroy(): void {
    this.pageBean = null;
    this.queryTerm = null;
    this.exportQueryTerm = null;
    this.tableConfig = null;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.dataSet) {
      this.selectedValue = null;
      this.initScrollBarWidth();
      this.tableMaxHeight = 220;
      if (
        Math.floor(this.tableMaxHeight / TableStyleConfigEnum.TABLE_ROW_HEIGHT) >
        this.dataSet.length
      ) {
        // 计算数据量应占的高度
        this.nzVirtualMaxBufferPx = this.calcVirtualTableHeight(this.dataSet.length);
      } else {
        this.nzVirtualMaxBufferPx = this.tableMaxHeight;
      }
      if (!this.tableConfig.noAutoHeight) {
        this.tableConfig.scroll.y = this.nzVirtualMaxBufferPx + TableStylePixelEnum.PIXEL;
      }
      // 如果是树表 创建父子结构
      if (this.tableConfig.columnConfig[0].type === 'expend') {
        const arr = [];
        this.dataSet.forEach((item, index) => {
          arr.push(item);
          item.serialNumber = index + 1;
          const areaLevelName = this.i18n.translate(
            `facility.config.${AreaLevelEnum[item[this.levelKey]]}`,
          );
          item[this.nameKey + 'Title'] = `${areaLevelName}:${item[this.nameKey]}\n`;
          if (
            item[this.tableConfig.columnConfig[0].expendDataKey] &&
            item[this.tableConfig.columnConfig[0].expendDataKey].length > 0
          ) {
            const that = this
            ; (function setFather(data) {
              data[that.tableConfig.columnConfig[0].expendDataKey].forEach((_item, _index) => {
                _item.father = data;
                if (data['expand']) {
                  arr.push(_item);
                }
                _item.serialNumber = `${data.serialNumber}-${_index + 1}`;
                const _areaLevelName = that.i18n.translate(
                  `facility.config.${AreaLevelEnum[_item[that.levelKey]]}`,
                );
                _item[that.nameKey + 'Title'] = `${data[that.nameKey + 'Title']}${_areaLevelName}:${
                  _item[that.nameKey]
                }\n`;
                if (
                  _item[that.tableConfig.columnConfig[0].expendDataKey] &&
                  _item[that.tableConfig.columnConfig[0].expendDataKey].length > 0
                ) {
                  setFather(_item);
                }
              });
            })(item);
          }
        });
        this.__dataSet = [];
        this.nzNoResult = '';
        setTimeout(() => {
          this.__dataSet = arr;
          this.nzNoResult = this.language.table.noData;
        });
      } else {
        this.__dataSet = this.dataSet;
      }
      if (changes.selectedData && changes.selectedData.currentValue.length) {
        this.keepSelectedData.clear();
        this.selectedData.forEach((item) => {
          this.keepSelectedData.set(item[this.tableConfig.selectedIdKey], item);
        });
      }
      this.calcTableHeight();
      this.updateSelectedData();
      this.checkStatus();
    }
    if (changes.tableConfig) {
      this.configurableColumn = this.tableConfig.columnConfig.filter((item) => item.configurable);
      this.queryTerm = this.tableService.initFilterParams(this.tableConfig);
      if (this.tableConfig && this.tableConfig.columnConfig) {
        this.tableConfig.columnConfig.forEach((item) => {
          if (
            item.searchable &&
            item.searchConfig &&
            item.searchConfig.type === 'dateRang' &&
            item.searchConfig.initialValue &&
            item.searchConfig.initialValue.length
          ) {
            // 将时间段的初始值 赋值给rangDateValue变量，以此回显
            this.rangDateValue[item.key] = [
              new Date(item.searchConfig.initialValue[0]),
              new Date(item.searchConfig.initialValue[1]),
            ];
          }
        });
      }
      this.calcTableHeight();
      // 获取表格列设置
      if (this.tableConfig.primaryKey) {
        this.getColumnSettings();
      }
      // 计算表格宽度
      this.calcTableWidth();
      this.toggleHiddenOperateColumn(this.tableConfig.showSearch);
    }
  }

  refreshCheckStatus(status?: boolean, data?): void {
    // 当为树表的情况
    if (this.tableConfig.columnConfig[0].type === 'expend') {
      if (data[this.tableConfig.columnConfig[0].expendDataKey]) {
        const setChild = (childData) => {
          childData.forEach((item) => {
            item.checked = status;
            if (
              item[this.tableConfig.columnConfig[0].expendDataKey] &&
              item[this.tableConfig.columnConfig[0].expendDataKey].length > 0
            ) {
              setChild(item[this.tableConfig.columnConfig[0].expendDataKey]);
            }
          });
        };
        setChild(data[this.tableConfig.columnConfig[0].expendDataKey]);
      }
      const allChecked = this.dataSet.every((value) => value.checked === true);
      this.allChecked = allChecked;
      this.allUnChecked = this.tableService.checkStatus(
        this.dataSet,
        this.tableConfig.columnConfig[0].expendDataKey,
      );
      this.collectSelectedId(status, data);
      this.checkStatus();
    }
    if (this.tableConfig.handleSelect) {
      this.tableConfig.handleSelect(this.getDataChecked(), data);
    }
  }

  /**
   *  检查全选、有选状态
   */
  checkStatus() {
    if (this.dataSet.length > 0) {
      const allChecked = this.dataSet.every((value) => value.checked);
      const allUnChecked = this.dataSet.every((value) => !value.checked);
      this.allChecked = allChecked;
      this.allUnChecked = allUnChecked;
      this.indeterminate = !allChecked && !allUnChecked;
    } else {
      this.allChecked = false;
      this.indeterminate = false;
      this.allUnChecked = true;
    }
  }
  getDataChecked(): any[] {
    const newArr: any[] = [];
    const that = this
    ; (function _getTreeDataChecked(data) {
      data.forEach((item: TreeNodeModel) => {
        if (item.checked) {
          newArr.push(item);
        }
        if (item.children && item.children.length > 0) {
          _getTreeDataChecked(item.children);
        }
      });
    })(this.dataSet);
    return newArr;
  }
  checkAll(value: boolean): void {
    // 当为树表的情况
    if (this.tableConfig.columnConfig[0].type === 'expend') {
      this.dataSet.forEach((data) => {
        data.checked = value;
        if (
          data[this.tableConfig.columnConfig[0].expendDataKey] &&
          data[this.tableConfig.columnConfig[0].expendDataKey].length > 0
        ) {
          const setChild = (childData) => {
            childData.forEach((item) => {
              item.checked = value;
              if (
                item[this.tableConfig.columnConfig[0].expendDataKey] &&
                item[this.tableConfig.columnConfig[0].expendDataKey].length > 0
              ) {
                setChild(item[this.tableConfig.columnConfig[0].expendDataKey]);
              }
            });
          };
          setChild(data[this.tableConfig.columnConfig[0].expendDataKey]);
        }
      });
    } else {
      this.dataSet.forEach((data) => (data.checked = value));
    }
    this.dataSet.forEach((item) => {
      this.collectSelectedId(value, item);
    });
    if (this.tableConfig.handleSelect) {
      this.tableConfig.handleSelect(this.getDataChecked());
    }
    this.checkStatus();
  }

  handle(operation: Operation, index, data, key) {
    if (data[key] === 'disabled') {
      return;
    }
    if (operation.needConfirm) {
      this.modalService.confirm(
        this.tablePrompt(
          () => {
            this.tableConfig.operation[index].handle(data);
          },
          () => {},
          operation.confirmTitle,
          operation.confirmContent,
        ),
      );
    } else {
      this.tableConfig.operation[index].handle(data);
    }
  }

  topHandle(operation: Operation) {
    if (this.tableConfig.isLoading) {
      return;
    }
    if (operation.needConfirm) {
      this.modalService.confirm(
        this.tablePrompt(
          () => {
            const data = this.getDataChecked();
            operation.handle(data);
          },
          () => {},
          operation.confirmTitle,
          operation.confirmContent,
        ),
      );
    } else {
      const data = this.getDataChecked();
      operation.handle(data);
    }
  }

  sort(event, key): void {
    if (event) {
      const sortCondition = new SortCondition();
      sortCondition.sortField = key;
      if (event === NzTableSortConfig.DESCEND) {
        sortCondition.sortRule = TableSortConfig.DESC;
      } else if (event === NzTableSortConfig.ASCEND) {
        sortCondition.sortRule = TableSortConfig.ASC;
      } else {
        sortCondition.sortRule = null;
      }
      this.tableConfig.sort(sortCondition);
    } else {
      this.tableConfig.sort({});
    }
  }
  /**
   * 过滤处理函数
   * param config
   * param $event
   */
  handleFilter(config, $event) {
    if (config.handleFilter) {
      config.handleFilter($event);
    }
  }
  handleMouseMove(event, column: ColumnConfig) {
    let target = event.target;
    while (target && target.tagName !== TableStylePixelEnum.TH_TAG_NAME) {
      target = target.parentNode;
    }
    const rect = target.getBoundingClientRect();
    const bodyStyle = document.body.style;
    // (虚拟滚动会有小问题，先禁用固定列拖拽列宽)
    if (
      !this.dragging &&
      this.tableConfig.isDraggable &&
      (!column.fixedStyle || this.tableConfig.columnConfig[0].type !== 'expend') &&
      rect.width > 12 &&
      rect.right - event.pageX < 8 &&
      column.width
    ) {
      bodyStyle.cursor = 'col-resize';
      target.style.cursor = 'col-resize';
      this.draggingColumn = column;
      if (column.hasOwnProperty('isShowSort')) {
        column.isShowSort = false;
      }
    } else if (!this.dragging) {
      bodyStyle.cursor = '';
      target.style.cursor = '';
      this.draggingColumn = null;
      if (column.hasOwnProperty('isShowSort')) {
        column.isShowSort = true;
      }
    }
  }

  handleMouseDown(event, column) {
    let target = event.target;
    while (target && target.tagName !== 'TH') {
      target = target.parentNode;
    }
    const table = document.getElementById(this.tableId);
    const tableLeft = table.getBoundingClientRect().left;
    const columnRect = target.getBoundingClientRect();
    const resizeProxy = document.getElementById(this.resizeProxyId);
    if (this.tableConfig.isDraggable && this.draggingColumn) {
      const minLeft =
        columnRect.left -
        tableLeft +
        (this.draggingColumn.minWidth || TableStyleConfigEnum.MIN_WIDTH);
      this.dragging = true;
      this.resizeProxyShow = true;
      this.dragState = {
        startMouseLeft: event.clientX,
        startLeft: columnRect.right - tableLeft,
        startColumnLeft: columnRect.left - tableLeft,
        tableLeft,
      };
      resizeProxy.style.left = this.dragState.startLeft + TableStylePixelEnum.PIXEL;
      const handleMouseMove = (_event) => {
        const deltaLeft = _event.clientX - this.dragState.startMouseLeft;
        const proxyLeft = this.dragState.startLeft + deltaLeft;
        resizeProxy.style.left = Math.max(minLeft, proxyLeft) + TableStylePixelEnum.PIXEL;
      };
      const handleMouseUp = () => {
        if (this.dragging) {
          const { startColumnLeft, startLeft } = this.dragState;
          const finalLeft = parseInt(document.getElementById(this.resizeProxyId).style.left, 10);
          const columnWidth = finalLeft - startColumnLeft;
          // 设置table的宽度
          this.tableConfig.scroll.x =
            parseInt(this.tableConfig.scroll.x, 10) +
            (finalLeft - startLeft) +
            TableStylePixelEnum.PIXEL;
          this.draggingColumn.width = columnWidth;
          // const temp = this.tableConfig.columnConfig.filter(item => (!item.hidden) && item.key);
          // const tempWidth = parseInt(temp[temp.length - 1].width, 10) - (finalLeft - startLeft);
          // const tableContainer = $(`#${this.tableId}`).width();
          // const aa = tableContainer > parseInt(this.tableConfig.scroll.x, 10);
          // if (this.draggingColumn.key !== temp[temp.length - 1].key) {
          //   temp[temp.length - 1].width = tempWidth;
          // }
          // 如果拖动列为固定列重新计算所有固定列列宽 (虚拟滚动会有小问题)todo
          if (this.draggingColumn.fixedStyle && this.draggingColumn.fixedStyle.fixedLeft) {
            const changeColumn = this.tableConfig.columnConfig.filter(
              (item) => item.fixedStyle && item.fixedStyle.fixedLeft,
            );
            changeColumn.forEach((item, index) => {
              let left = 0;
              for (let i = index; i--; i > 0) {
                left += changeColumn[i].width;
              }
              item.fixedStyle.style.left = left + TableStylePixelEnum.PIXEL;
            });
          }
          this.draggingColumn = null;
          this.dragging = false;
          this.resizeProxyShow = false;
        }
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
  }

  handleMouseOut(event, column) {
    document.body.style.cursor = '';
    if (column.hasOwnProperty('isShowSort')) {
      column.isShowSort = true;
    }
  }

  searchEvent(queryTerm) {
    this.queryTerm = queryTerm;
    this.handleSearch();
  }

  handleSearch() {
    let result;
    if (this.tableConfig.searchReturnType && this.tableConfig.searchReturnType === 'object') {
      result = this.tableService.createFilterConditionMap(this.queryTerm);
    } else {
      result = this.tableService.createFilterConditions(this.queryTerm);
    }
    // 点击查询之后把条件信息存入导出参数
    this.exportQueryTerm = result;
    this.tableConfig.handleSearch(result);
  }
  /**
   * 手动设置某一列过滤条件
   * param key
   * param value
   */
  handleSetControlData(key, value) {
    this.queryTerm.set(key, {
      filterValue: value,
      filterField: this.queryTerm.get(key).filterField,
      operator: this.queryTerm.get(key).operator,
    });
  }

  onChange(data) {
    const event = data.value;
    const key = data.key;
    if (event) {
      this.queryTerm.get(key).filterValue = event.getTime();
    } else {
      this.queryTerm.get(key).filterValue = null;
    }
  }

  rangValueChange(data) {
    const event = data.value;
    const key = data.key;
    const startTime = event[0] ? CommonUtil.tableQueryTime(event[0].getTime()) : null;
    const endTime = event[1] ? CommonUtil.tableQueryTime(event[1].getTime()) : null;
    if (startTime && endTime) {
      this.queryTerm.get(key).filterValue = [startTime, endTime];
    } else {
      this.queryTerm.get(key).filterValue = null;
    }
  }

  inputNumberValueChange($event) {
    this.queryTerm.get($event.key).filterValue = $event.value;
  }

  handleRest() {
    this.searchDate = {};
    this.rangDateValue = {};
    this.tableService.resetFilterConditions(this.queryTerm);
    this.handleSearch();
  }

  openTableSearch() {
    this.tableConfig.showSearch = !this.tableConfig.showSearch;
    this.toggleHiddenOperateColumn(this.tableConfig.showSearch);
    if (this.tableConfig.openTableSearch) {
      this.tableConfig.openTableSearch(this.tableConfig.showSearch);
    }
  }
  /**
   * 点击导入 目前仅支持 单文件 .xlsx 格式
   */
  clickImport(file: File) {
    this.tableConfig.handleImport(file);
  }

  /**
   * 点击导出
   */
  clickExport() {
    const modal = this.modalService.create({
      nzTitle: this.language.table.exportTemp,
      nzContent: this.exportTemp,
      nzOkType: 'danger',
      nzClassName: 'custom-create-modal',
      nzFooter: [
        {
          label: this.language.table.okText,
          onClick: () => {
            if (!this.exportRadioValue && this.exportRadioValue !== 0) {
              this.$message.error(this.language.table.exportTemp);
              return;
            }
            if (this.exportRadioValue === 'HTML') {
              setTimeout(() => {
                CommonUtil.exportHtml('FiLinkWeb.html');
              }, 500);
            } else {
              // 获取查询条件
              if (!this.exportQueryTerm) {
                if (
                  this.tableConfig.searchReturnType &&
                  this.tableConfig.searchReturnType === 'object'
                ) {
                  this.exportQueryTerm = {};
                } else {
                  this.exportQueryTerm = [];
                }
              }
              // 获取当显示的列(排除序号操作展开等列)
              const column = this.tableConfig.columnConfig.filter(
                (item) => !item['hidden'] && item.key && item.key !== 'serialNumber',
              );
              const __column = [];
              // 格式化参数
              column.forEach((item) => {
                __column.push({
                  columnName: item.title,
                  propertyName: item.key,
                });
              });
              const exportParams = {
                queryTerm: this.exportQueryTerm,
                selectItem: this.getDataChecked(),
                columnInfoList: __column,
                excelType: this.exportRadioValue,
              };
              this.tableConfig.handleExport(exportParams);
            }
            modal.destroy();
          },
        },
        {
          label: this.language.table.cancelText,
          type: 'danger',
          onClick: () => {
            modal.destroy();
          },
        },
      ],
    });
  }

  /**
   * 点击打印
   */
  printList() {
    // window['Print']('#fiLink', {
    //   onStart: function () { // 开始打印的事件
    //   },
    //   onEnd: function () { // 取消打印的事件
    //   }
    // });
    // 使用原生打印
    this.printVisible = false;
    setTimeout(() => {
      window.print();
    }, 200);
  }
  /**
   * 设置列下拉菜单显示状态改变
   * param event boolean
   */
  dropDownChange(event: boolean) {
    // 点击显示下拉菜单 不做处理
    if (event) {
      return;
    }
    // 为了三期做表格列的保存
  }

  /**
   * 自定义列 显示隐藏重新计算表格宽地
   * param event
   */
  configurableColumnChange(event) {
    event.item.hidden = !event.value;
    // _item.hidden = !event;
    this.calcTableWidth();
  }

  /**
   * 保存列设置
   */
  saveColumn() {
    const temp = this.configurableColumn.map((item) => {
      return { key: item.key, hidden: !!item.hidden };
    });
    const params = { menuId: this.tableConfig.primaryKey, custom: JSON.stringify(temp) };
    this.$systemParameterService.saveColumnSetting(params).subscribe((result: Result) => {
      if (result.code === 0) {
        this.$message.success(result.msg);
        // 保存成功更新本地存储
        this.columnSetting = temp;
        const columnSetting = this.columnSettings.find(
          (item) => item.menuId === this.tableConfig.primaryKey,
        );
        if (columnSetting) {
          columnSetting.custom = params.custom;
        } else {
          this.columnSettings.push(params);
        }
        localStorage.setItem('columnSettings', JSON.stringify(this.columnSettings));
        this.setColumnVisible = false;
      } else {
        this.$message.error(result.msg);
      }
    });
  }

  /**
   * 获取表格列表设置
   */
  getColumnSettings() {
    // 计算列设置查询本地有没有相关数据
    this.columnSettings = JSON.parse(localStorage.getItem('columnSettings')) || [];
    this.columnSetting = this.columnSettings.find(
      (item) => item.menuId === this.tableConfig.primaryKey,
    );
    if (this.columnSetting) {
      this.setColumnSettings(JSON.parse(this.columnSetting.custom));
    } else {
      // 如果本地数据中没有相关数据，请求后台接口
      this.$systemParameterService.queryColumnSetting().subscribe((result: Result) => {
        if (result.code === 0 && result.data.length > 0) {
          // 保存后台服务器设置到本地缓存
          localStorage.setItem('columnSettings', JSON.stringify(result.data));
          const remoteColumnSetting = result.data.find(
            (item) => item.menuId === this.tableConfig.primaryKey,
          );
          if (remoteColumnSetting) {
            this.setColumnSettings(JSON.parse(remoteColumnSetting.custom));
            this.calcTableWidth();
          }
        }
      });
    }
  }

  /**
   * 查询出当前表格的列设置
   * param columnSetting
   */
  setColumnSettings(columnSetting) {
    this.configurableColumn.forEach((item) => {
      columnSetting.forEach((_item) => {
        if (item.key === _item.key) {
          item.hidden = _item.hidden;
        }
      });
    });
    this.configurableColumn = [...this.configurableColumn];
  }
  /**
   * 计算表格宽度
   */
  calcTableWidth() {
    let tableWidth = 0;
    this.tableConfig.columnConfig.forEach((item: ColumnConfig) => {
      // 如果有一列没设置宽 为了防止这一列在操作之后不显示
      if (!item.width) {
        item.width = 100;
      }
      if (item.width && !item['hidden']) {
        tableWidth += item.width;
      }
    });
    if (this.tableConfig.scroll) {
      this.tableConfig.scroll.x = tableWidth + TableStylePixelEnum.PIXEL;
    }
  }
  /**
   * 计算表格高度
   */
  calcTableHeight() {
    // 表格高度自动适配 340 为基础表格的外高度 如果表格上有其他高的控制占高度需要传入outHeight
    // const outHeight = this.tableConfig.outHeight || 0;
    if (this.tableConfig.scroll && !this.tableConfig.noAutoHeight) {
      this.tableConfig.scroll.y =
        TableStyleConfigEnum.TABLE_ROW_HEIGHT * (this.pageBean.pageSize + 1) +
        TableStylePixelEnum.PIXEL;
      this.tableConfig.scroll = { x: this.tableConfig.scroll.x, y: this.tableConfig.scroll.y };
    }
  }
  /**
   * 初始化序号
   */
  initIndexNo() {
    if (!this.tableConfig.noIndex) {
      const columnConfig = {
        select: true,
        expand: true,
      };
      let index = 0;
      this.tableConfig.columnConfig.forEach((item) => {
        if (item.type in columnConfig) {
          index++;
        }
      });
      this.tableConfig.columnConfig.splice(index, 0, {
        type: 'serial-number',
        width: 62,
        title: this.language.facility.serialNumber,
        fixedStyle: { fixedLeft: true, style: { left: '62px' } },
      });
    }
  }
  /**
   * 表格统一提示配置
   * param handleOK
   * param handleCancel
   * returns any
   */
  tablePrompt(handleOK, handleCancel, title, content) {
    // 采用确定和取消互换
    const obj = {
      nzTitle: title || this.language.table.prompt,
      nzContent: content || `<span>${this.language.table.promptContent}</span>`,
      nzOkText: this.language.table.cancelText,
      nzOkType: 'danger',
      nzMaskClosable: false,
      nzOnOk: handleCancel,
      nzKeyboard: false,
      nzCancelText: this.language.table.okText,
      nzOnCancel: handleOK,
    };
    return obj;
  }

  onOpenChange(data) {
    // 为了解决UI框架的bug而采用的无奈代码，重新赋值
    const event = data.value;
    const key = data.key;
    if (!event) {
      // 这里深拷贝一个对象
      let temp;
      if (this.rangDateValue[key] && this.rangDateValue[key].length === 2) {
        temp = [
          new Date(this.rangDateValue[key][0].getTime()),
          new Date(this.rangDateValue[key][1].getTime()),
        ];
        if (this.rangDateValue[key][0].getTime() > this.rangDateValue[key][1].getTime()) {
          // 当选时间的时候ui组件判断错误，赋值为开始的那个
          this.rangDateValue[key] = [];
          this.queryTerm.get(key).filterValue = null;
          this.$message.warning(this.language.common.timeMsg);
        } else {
          this.rangDateValue[key] = [];
          this.rangDateValue[key] = temp;
        }
      } else {
        this.rangDateValue[key] = [];
        this.queryTerm.get(key).filterValue = null;
      }
    }
  }

  collectSelectedId(checked: boolean, item: any): void {
    const key = item[this.tableConfig.selectedIdKey];
    if (checked) {
      if (!this.keepSelectedData.has(key)) {
        this.keepSelectedData.set(key, item);
      }
    } else {
      // 添加size大于0的判断
      if (this.keepSelectedData.size > 0 && this.keepSelectedData.has(key)) {
        this.keepSelectedData.delete(key);
      }
    }
  }
  updateSelectedData(): void {
    const arr = [];
    this.dataSet.forEach((item) => {
      if (this.keepSelectedData.has(item[this.tableConfig.selectedIdKey])) {
        item.checked = true;
      } else {
        item.checked = false;
      }
      this.collectSelectedId(item.checked, item);
      arr.push(item);
      if (
        item[this.tableConfig.columnConfig[0].expendDataKey] &&
        item[this.tableConfig.columnConfig[0].expendDataKey].length > 0
      ) {
        const that = this
        ; (function setFather(_data) {
          _data[that.tableConfig.columnConfig[0].expendDataKey].forEach((_item) => {
            if (that.keepSelectedData.has(_item[that.tableConfig.selectedIdKey])) {
              _item.checked = true;
            } else {
              _item.checked = false;
            }
            that.collectSelectedId(_item.checked, _item);
            arr.push(_item);
            if (
              _item[that.tableConfig.columnConfig[0].expendDataKey] &&
              _item[that.tableConfig.columnConfig[0].expendDataKey].length > 0
            ) {
              setFather(_item);
            }
          });
        })(item);
      }
    });
    this.__dataSet = arr;
  }
  updateSelectedDataNoCheck() {
    this.dataSet.forEach((item) => {
      this.collectSelectedId(item.checked, item);
    });
  }
  toggleHiddenOperateColumn(hidden?: boolean): void {
    if (this.tableConfig.showSearchSwitch) {
      if (
        !this.tableConfig.operation ||
        (this.tableConfig.operation && this.tableConfig.operation.length === 0)
      ) {
        const column = this.tableConfig.columnConfig.find(
          (item) => item.searchConfig && item.searchConfig.type === 'operate',
        );
        if (column) {
          if (hidden !== undefined) {
            column.hidden = !hidden;
          } else {
            column.hidden = !column.hidden;
          }
        }
      }
    }
  }
  rowClick(data) {
    if (this.tableConfig.rowClick) {
      this.tableConfig.rowClick(data);
    }
  }

  /**
   * 展开事件处理函数
   * param data
   * param event
   */
  tableCollapse(_data, event, index) {
    // 先统一处理展开回调 后期可能会为每行展开加事件
    if (this.tableConfig.expandHandle) {
      this.tableConfig.expandHandle();
    }
    this.selectedValue = null;
    this.collapse(_data, event);
    // 如果展开开启滚动补偿机制
    if (event) {
      this.scrollCompensate(index);
    }
  }

  /**
   * 展开指定子集
   * param zIndex
   */
  openChildren(zIndex) {
    this.selectedValue = zIndex;
    const arr = [];
    const openRecursive = (data) => {
      data.forEach((item) => {
        item.expand = Number(item[this.levelKey]) <= zIndex;
        if (item.father) {
          if (item.father.expand) {
            arr.push(item);
          }
        } else {
          arr.push(item);
        }
        if (
          item[this.tableConfig.columnConfig[0].expendDataKey] &&
          item[this.tableConfig.columnConfig[0].expendDataKey].length
        ) {
          openRecursive(item[this.tableConfig.columnConfig[0].expendDataKey]);
        }
      });
    };
    openRecursive(this.dataSet);
    this.__dataSet = arr;
    this.__dataSet = [];
    this.nzNoResult = ' ';
    setTimeout(() => {
      this.__dataSet = arr;
      this.nzNoResult = this.language.table.noData;
      this.resetTableHeight();
    });
  }

  /**
   * 关闭所有子数据
   * param data
   * param event
   */
  collapse(data, event) {
    if (event === false) {
      data.forEach((item) => {
        item.expand = false;
        if (
          item[this.tableConfig.columnConfig[0].expendDataKey] &&
          item[this.tableConfig.columnConfig[0].expendDataKey].length > 0
        ) {
          this.collapse(item[this.tableConfig.columnConfig[0].expendDataKey], event);
        }
      });
    } else {
    }
    const arr = [];
    this.dataSet.forEach((item) => {
      arr.push(item);
      if (
        item[this.tableConfig.columnConfig[0].expendDataKey] &&
        item[this.tableConfig.columnConfig[0].expendDataKey].length > 0
      ) {
        const that = this
        ; (function setFather(_data) {
          _data[that.tableConfig.columnConfig[0].expendDataKey].forEach((_item) => {
            if (_data['expand']) {
              arr.push(_item);
            }
            if (
              _item[that.tableConfig.columnConfig[0].expendDataKey] &&
              _item[that.tableConfig.columnConfig[0].expendDataKey].length > 0
            ) {
              setFather(_item);
            }
          });
        })(item);
      }
    });
    this.__dataSet = arr;
    this.resetTableHeight();
  }

  /**
   * 重新计算表格高度(树表小数据量使用)
   */
  resetTableHeight() {
    // 计算当前数据应有高度
    const tableHeight = this.calcVirtualTableHeight(this.__dataSet.length);
    if (tableHeight < this.tableMaxHeight) {
      this.nzVirtualMaxBufferPx = tableHeight;
    } else {
      this.nzVirtualMaxBufferPx = this.tableMaxHeight;
    }
    if (!this.tableConfig.noAutoHeight) {
      this.tableConfig.scroll.y = this.nzVirtualMaxBufferPx + TableStylePixelEnum.PIXEL;
    }
  }

  /**
   * 滚动补偿机制
   * param index
   */
  scrollCompensate(index) {
    // 当前index的高度
    const height = index * TableStyleConfigEnum.TABLE_ROW_HEIGHT;
    // 页面卷曲的高度
    const scrollTop = this.nzTable.cdkVirtualScrollNativeElement.scrollTop;
    // 当前展开条数在页面地步最后一条滚动到下一条
    if (
      Number.parseInt(this.tableConfig.scroll.y, 10) - (height - scrollTop) <
      TableStyleConfigEnum.TABLE_ROW_HEIGHT * 2
    ) {
      const scrollHeight = TableStyleConfigEnum.TABLE_ROW_HEIGHT * (index + 1);
      this.nzTable.cdkVirtualScrollNativeElement.scrollTo({ top: scrollHeight });
    }
  }

  /**
   * 初始化计算浏览器滚动条高度
   */
  initScrollBarWidth(): void {
    if (this.scrollHeight) {
      return;
    }
    if (!this.document) {
      return;
    }
    const scrollbarMeasure = {
      position: 'absolute',
      top: '-9999px',
      width: '50px',
      height: '50px',
      overflow: 'scroll',
    };
    const scrollDiv = this.document.createElement('div');
    for (const scrollProp in scrollbarMeasure) {
      if (scrollbarMeasure.hasOwnProperty(scrollProp)) {
        scrollDiv.style[scrollProp] = scrollbarMeasure[scrollProp];
      }
    }
    this.document.body.appendChild(scrollDiv);
    this.scrollHeight = scrollDiv.offsetWidth - scrollDiv.clientWidth;
    this.document.body.removeChild(scrollDiv);
  }

  /**
   * 根据数量计算表格的高度
   * 无数据 不计算滚动条的高度
   * param length
   */
  calcVirtualTableHeight(length: number): number {
    if (length) {
      return length * TableStyleConfigEnum.TABLE_ROW_HEIGHT + this.scrollHeight;
    } else {
      return 0;
    }
  }
}
