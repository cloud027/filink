import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {TreeSelectorConfigModel} from '../../../../shared-module/model/tree-selector-config.model';
import {IndexLanguageInterface} from '../../../../../assets/i18n/index/index.language.interface';
import {AreaRecursiveModel} from '../../shared/model/area.model';
import {MapService} from '../../../../core-module/api-service';
import {NzI18nService} from 'ng-zorro-antd';
import {MapStoreService} from '../../../../core-module/store/map.store.service';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {IndexApiService} from '../../service/index/index-api.service';
import {FilterConditionService} from '../../service/filter-condition.service';
import {LanguageEnum} from '../../../../shared-module/enum/language.enum';
import {indexCoverageType} from '../../../../core-module/const/index/index.const';
import * as lodash from 'lodash';
import {ResultCodeEnum} from '../../../../shared-module/enum/result-code.enum';
import {ResultModel} from '../../../../shared-module/model/result.model';
import {SessionUtil} from '../../../../shared-module/util/session-util';

declare var $: any;

@Component({
  selector: 'app-smart-pole-model-tree',
  templateUrl: './smart-pole-model-tree.component.html',
  styleUrls: ['./smart-pole-model-tree.component.scss']
})
export class SmartPoleModelTreeComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {
  @Input() treeName: string;
  // tree
  @Input() treeSelectorConfig: TreeSelectorConfigModel = new TreeSelectorConfigModel();
  // 判断怎样渲染
  @Input() isShowNoData = false;
  // 区域选择结果
  @Output() areaDataEvent = new EventEmitter<string[]>();
  // 搜索框组件
  @ViewChild('input') inputElement: ElementRef;
  // 国际化翻译
  public language;
  // 国际化
  public indexLanguage: IndexLanguageInterface;
  // 是否显示区域分组下拉
  public selectType: boolean = false;
  // tree操作对象
  public treeInstance: any;
  // 搜索Key
  public searchKey: string;
  // 搜素信息
  public selectInfo = {
    data: [],
    label: 'label',
    value: 'code'
  };
  // 无数据时显示暂无数据
  public noData: boolean = false;
  // tree配置
  private setting;
  // 区域选择结果
  private areaList;
  // 搜索结果
  private searchResult = [];
  // 递归获取全量区域数据
  private areaRecursiveData: AreaRecursiveModel[] = [];
  // 智慧杆和型号数据
  private projectData: any;

  constructor(
    private $mapService: MapService,
    private $nzI18n: NzI18nService,
    private $mapStoreService: MapStoreService,
    private $message: FiLinkModalService,
    private $indexApiService: IndexApiService,
    private $filterConditionService: FilterConditionService
  ) {
  }

  /**
   * 防抖
   */
  areaDataShowFacility = lodash.debounce(() => {
    this.areaDataEvent.emit(this.areaList);
    // 只有设施设备列表需要刷新地图
    this.$filterConditionService.eventEmit.emit({refresh: true});
  }, 2000, {leading: false, trailing: true});

  public ngOnInit(): void {
    // 国际化配置
    this.language = this.$nzI18n.getLocale();
    this.indexLanguage = this.$nzI18n.getLocaleData(LanguageEnum.index);
    this.initTreeSetting();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.areaList && changes.$mapStoreService.currentValue) {
      this.addTreeData();
    }
  }

  public ngAfterViewInit(): void {
    // 初始化调用接口
    this.getAllAreaList();
  }

  /**
   * 组件销毁
   */
  public ngOnDestroy(): void {
    this.inputElement = null;
  }

  /**
   * 搜索组件选中某一条
   * param event id
   */
  public modelChange(event: string): void {
    const node = this.treeInstance.getNodeByParam('id', event, null);
    this.treeInstance.selectNode(node);
  }

  /**
   * 搜索框input值变化
   * param event
   */
  public inputChange(event: string): void {
    if (event) {
      const node = this.treeInstance.getNodesByParamFuzzy('name',
        event, null);
      this.selectInfo = {
        data: node,
        label: 'name',
        value: 'id'
      };
    } else {
      this.selectInfo = {
        data: [],
        label: 'name',
        value: 'id'
      };
    }

  }

  /**
   * 搜索
   */
  public search(): void {
    const _searchKey = this.searchKey.trim();
    if (this.searchKey) {
      const node = this.treeInstance.getNodesByParamFuzzy('name', _searchKey, null);
      this.searchResult = node;
    }
  }

  /**
   * 选择全部区域
   */
  public clickSelectAll(type?: boolean): void {
    // 获取tree对象
    const treeObj = $.fn.zTree.getZTreeObj(this.treeName);
    if (!treeObj) {
      return;
    }
    // 获取完整树节点
    let checkData;
    checkData = this.$mapStoreService.smartPoleModelTreeSelectedResults || [];
    const list = treeObj.getNodes();
    // 有缓存，保留操作结果
    if (checkData && typeof (type) !== 'boolean') {
      if (checkData.length === 0) {
        checkData.push(indexCoverageType.noData);
      } else {
        list.forEach(item => {
          checkData.forEach(checkDataItem => {
            if (item.planCode === checkDataItem) {
              treeObj.checkNode(item, true, true, false);
            }
          });
        });
      }
    } else {
      // 根据type类型为全选或去全选
      if (type === true) {
        this.selectNoAreaList(list, treeObj);
        list.forEach(item => {
          treeObj.checkNode(item, type, true, false);
        });
      } else {
        this.selectNoAreaList(list, treeObj);
      }
      // 存入缓存，初始化直接发射事件，跳过防抖
      if (type) {
        this.setAreaSelectedResults(list.map(item => item.planCode));
        this.areaDataEvent.emit(list.map(item => item.planCode));
      } else {
        this.setAreaSelectedResults([indexCoverageType.noData]);
        this.areaDataEvent.emit([indexCoverageType.noData]);
      }
      // 只有设施设备列表需要刷新地图
      this.$filterConditionService.eventEmit.emit({refresh: true});
    }
  }

  /**
   * 去全选递归所有区域
   */
  private selectNoAreaList(list, treeObj): void {
    list.forEach(item => {
      treeObj.checkNode(item, false, true, false);
      if (item.children) {
        this.selectNoAreaList(item.children, treeObj);
      }
    });
  }

  private setAllTreeNodeCheck(list, bool = false) {
    if (!bool) {
      list.forEach(item => {
        item.checked = true;
        if (item.children) {
          item.children = this.setAllTreeNodeCheck(item.children);
        }
      });
      return list;
    } else {
      list.forEach(item => {
        this.$mapStoreService.smartPoleModelTreeSelectedResults.push(item.planCode);
        if (item.children) {
          this.setAllTreeNodeCheck(item.children, true);
        }
      });
    }
  }

  /**
   * 初始化tree配置
   */
  private initTreeSetting(): void {
    this.setting = {
      check: {
        enable: true,
        chkboxType: {'Y': 'ps', 'N': 'ps'},
        chkStyle: 'checkbox',
        autoCheckTrigger: true
      },
      data: {
        simpleData: {
          enable: true,
          idKey: 'id',
        },
        key: {
          name: 'name',
          children: 'children'
        },
      },
      view: {
        showIcon: false,
        showLine: false
      },
      callback: {
        onCheck: (event, treeId, treeNode) => {
          setTimeout(() => {
            this.getCheckedArea();
          }, 500);
        }
      }
    };
  }

  /**
   * 获取区域列表
   */
  private getAllAreaList(): void {
    if (!SessionUtil.checkHasProjectPlanningTypes('P002')) {
      // 如果无项目集权限
      this.noData = true;
      return;
    }
    // 查询一级区域
    this.$indexApiService.projectDtaGetPoleModel({}).subscribe((result: ResultModel<any>) => {
      if (result.code === ResultCodeEnum.success) {
        // 判断有无数据，如果无数据显示暂无数据提示
        if (result.data.length === 0) {
          this.noData = true;
          return;
        }
        // 默认全部勾选并存入缓存
        this.$mapStoreService.logicSmartPoleModelList = this.setAllTreeNodeCheck(result.data);
        if (!this.$mapStoreService.smartPoleModelTreeSelectedResults.length) {
          this.setAllTreeNodeCheck(result.data, true);
        }
        this.$mapStoreService.chooseAllSmartPoleModelID = this.$mapStoreService.logicSmartPoleModelList.filter(item => item.hasPermissions)
          .map(item => item.areaId);
        // 加入tree树
        this.addTreeData();
        // 初始化默认区域
        this.clickSelectAll();
        // 设施设备列表初始化
        this.$mapStoreService.isInitLogicSmartPoleModelData = true;
        // 获取tree对象
        const treeObj = $.fn.zTree.getZTreeObj(this.treeName);
        // 获取全部节点集合
        const list = treeObj.getNodes();
        // 判断缓存是否为空
        if (this.$mapStoreService.lastSmartPoleModelData.length && this.$mapStoreService.lastSmartPoleModelData[0] !== 'noData') {
          // 第一个遍历先把所有区域去勾，之后再把缓存中的区域与tree树对比勾选中
          list.forEach(item => {
            treeObj.checkNode(item, true, true, false);
          });
          // list.forEach(item => {
          //   this.$mapStoreService.lastSmartPoleModelData.forEach(_item => {
          //     if (item.planCode === _item) {
          //       treeObj.checkNode(item, true, true, false);
          //     }
          //   });
          // });
          // 把数据发射给设施设备类型组件
          this.$mapStoreService.smartPoleModelTreeSelectedResults = this.$mapStoreService.lastSmartPoleModelData;
        } else if (this.$mapStoreService.lastSmartPoleModelData[0] === 'noData') {
          // 缓存为空的唯一标识，区域全部去选，把唯一标识发射给设施设备类型组件
          list.forEach(item => {
            treeObj.checkNode(item, false, true, false);
          });
          this.$mapStoreService.smartPoleModelTreeSelectedResults = ['noData'];
          this.areaDataEvent.emit(['noData']);
        }
        this.getCheckedArea();
      } else {
        this.$message.error(result.msg);
      }
    });
  }

  /**
   * 区域选中结果存入缓存
   * param data
   */
  private setAreaSelectedResults(data: string[]): void {
    this.$mapStoreService.smartPoleModelTreeSelectedResults = data;
    this.$mapStoreService.lastSmartPoleModelData = data;
    this.$mapStoreService.projectModelData = this.projectData;
  }

  /**
   * 智慧杆型号数据递归
   * param list
   */
  private areaListRecursiveNew(list, isChildren = false) {
    const areaList = [];
    if (!isChildren) {
      list.forEach(item => {
        areaList.push({
          id: item.poleModel,
          planCode: item.poleModel,
          name: item.poleModel,  // 去掉空格
          isParent: true, // 级别为1时，是父级
          checked: true,
          chkDisabled: false,
          children: item.children ? this.areaListRecursiveNew(item.children, true) : []
        });
      });
    } else {
      list.forEach(item => {
        areaList.push({
          id: item.supplierId,
          planCode: item.supplierId,
          name: item.supplierName,  // 去掉空格
          isParent: false, // 级别为1时，是父级
          checked: true,
          chkDisabled: false,
          children: []
        });
      });
    }
    return areaList;
  }

  /**
   * 添加数据
   */
  private addTreeData(): void {
    // 把后台返回的数据转化为ztree所需的数据格式
    this.areaRecursiveData = this.areaListRecursiveNew(this.$mapStoreService.logicSmartPoleModelList);
    // 创建Areatree树
    $.fn.zTree.init($(`#${this.treeName}`), this.setting, this.areaRecursiveData);
    this.treeInstance = $.fn.zTree.getZTreeObj(this.treeName);
  }

  /**
   * 获取勾选区域
   */
  private getCheckedArea(): void {
    // 获取tree对象
    const treeObj = $.fn.zTree.getZTreeObj(this.treeName);
    const nodes = treeObj.getNodes();
    const list: Array<any> = [];
    const smartList: Array<any> = [];
    const supplierList: Array<any> = [];
    treeObj.transformToArray(nodes).forEach(e => {
      const status = e.getCheckStatus();
      if (status.half === false && status.checked) {
        if (e.level === 0) {
          smartList.push(e.planCode);
        } else if (e.level === 1) {
          supplierList.push(e.planCode);
        }
      }
      if (status.half === true && status.checked) {
        if (e.level === 0) {
          smartList.push(e.planCode);
        }
      }
    });
    // 当数组长度为0时，添加无数据唯一标识
    if (smartList.length === 0) {
      list.push(indexCoverageType.noData);
    } else {
      list.push(smartList, supplierList);
    }
    // 获取最新勾选区域code
    this.areaList = list;
    const arr: any = [];
    nodes.forEach(item => {
      const obj = {
        pointModel: '',
        supplierId: []
      };
      if (item.level === 0 && item.checked) {
        obj.pointModel = item.planCode;
        item.children.forEach(v => {
          if (v.checked === true && v.level === 1) {
            obj.supplierId.push(v.planCode);
          }
        });
        arr.push(obj);
      }
    });
    this.projectData = arr;
    this.setAreaSelectedResults(list);
    // 选中结果
    this.areaDataShowFacility();
  }
}
