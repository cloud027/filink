import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {NzI18nService, NzModalService} from 'ng-zorro-antd';
import {ActivatedRoute, Router} from '@angular/router';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {ResultModel} from '../../../../shared-module/model/result.model';
import {TenantApiService} from '../../share/sevice/tenant-api.service';
import {LanguageEnum} from '../../../../shared-module/enum/language.enum';
import {TenantLanguageInterface} from '../../../../../assets/i18n/tenant/tenant.language.interface';
import {ResultCodeEnum} from '../../../../shared-module/enum/result-code.enum';
import {SystemLanguageEnum} from '../../../../core-module/enum/alarm/system-language.enum';
import {CommonLanguageInterface} from '../../../../../assets/i18n/common/common.language.interface';

@Component({
  selector: 'app-menu-config',
  templateUrl: './menu-config.component.html',
  styleUrls: ['./menu-config.component.scss']
})
export class MenuConfigComponent implements OnInit {
  // 树
  @ViewChild('tree') private tree;
  // 当前语言环境
  @Input() languageConfig;
  // 国际化
  public language: TenantLanguageInterface;
  // 公共语言包
  public commonLanguage: CommonLanguageInterface;
  // 页面title
  public pageTitle: string;
  // 当前模板id
  public tenantId: string = '';
  // 当前模板版本
  public version: 1;
  // 树数据
  public treeData: any;
  // 主页面菜单配置
  public menuNodeList = [];
  // 三级菜单路由配置
  public threeMenuInfo = {menuName: '', children: []};
  // 是否显示
  public isVisible: boolean = false;
  // 加载圈
  public submitLoading = false;
  // 语言配置枚举
  public languageEnum = SystemLanguageEnum;
  // 备份首页配置数据开关
  public dataChanges: boolean = false;
  // 是否为点击保存配置
  public confirmSave: boolean = true;


  constructor(
    public $nzI18n: NzI18nService,
    public $tenantApiService: TenantApiService,
    public $activatedRoute: ActivatedRoute,
    public $message: FiLinkModalService,
    public $router: Router,
    public modalService: NzModalService,
  ) {
  }

  public ngOnInit(): void {
    // 获取当前语言环境
    this.languageConfig = JSON.parse(localStorage.getItem('localLanguage'));
    // 通用国际化
    this.commonLanguage = this.$nzI18n.getLocaleData('common');
    // 国际化
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.tenant);
    // 根据id是否在  判断是新增还是修改页面
    this.$activatedRoute.queryParams.subscribe(params => {
      if (params.id) {
        this.tenantId = params.id;
        this.queryTreeDatas();
      }
    });

  }

  /**
   * 数据刷新
   */
  public queryTreeDatas(): void {
    this.$tenantApiService.getTenantMenuByTenantId(this.tenantId, this.languageConfig)
      .subscribe((result: ResultModel<any>) => {
        if (result.code === ResultCodeEnum.success) {
          const {menuInfoTrees} = result.data || [];
          this.dealTree(menuInfoTrees);
          this.treeData = menuInfoTrees;
        } else {
          this.$message.error(result.msg);
        }
      });
  }

  /**
   * 子组件回传
   */
  public dataChange(event: boolean) {
    this.dataChanges = event;
  }


  /**
   * 处理树结构
   * param treeNode
   */
  public dealTree(treeNode): void {
    for (let i = 0; i < treeNode.length; i++) {
      // 翻译菜单树
      // const name = this.$nzI18n.translate(`navigation.${treeNode[i].menuId}`);
      // 如果前端翻译未成功使用数据库初始化name
      // if (name !== `navigation.${treeNode[i].menuId}`) {
      //   treeNode[i].menuName = name;
      // // }
      if (treeNode[i].children && treeNode[i].children.length > 0) {
        this.dealTree(treeNode[i].children);
      } else {
        treeNode[i].isLeaf = true;
      }
    }
  }


  /**
   * 更新模板信息
   */
  public updateMenuTemplate(): void {
    // 保存配置
    this.updateElement();
  }

  /**
   * 保存数据
   */
  public updateElement() {
    const treeData = this.tree.getTreeData();
    this.submitLoading = true;
    const data = {
      tenantId: this.tenantId,
      menuInfoTrees: treeData
    };
    this.$tenantApiService.updateTenantMenuByTenantId(data).subscribe((result: ResultModel<string>) => {
      this.submitLoading = false;
      if (result.code === ResultCodeEnum.success) {
        this.$message.success(this.language.tenantConfigMsg);
        if (this.confirmSave) {
          // 刷新数据
          // 刷新数据
          this.queryTreeDatas();
        }
        this.dataChanges = false;
      } else {
        this.$message.warning(result.msg);
      }
    }, () => {
      this.submitLoading = false;
    });
  }

  /**
   * 预览菜单
   */
  public showMenu(): void {
    // 获取菜单配置
    setTimeout(() => {
      this.menuNodeList = this.tree.getTreeData();
    }, 0);
    this.isVisible = true;
  }

  /**
   * 确定
   */
  public handleCancel(): void {
    this.isVisible = false;
    this.menuNodeList = [];
    this.threeMenuInfo = {menuName: '', children: []};
  }

  /**
   * 取消按钮，回列表
   */
  public cancel(): void {
    const dataChang = this.comparedDatas();
    if (dataChang) {
      this.confirm();
    } else {
      // 返回租户列表
      this.$router.navigate(['/business/tenant/tenant-list']).then();
    }

  }

  /**
   * 对比数据是否有改变
   */
  public comparedDatas() {
    if (this.dataChanges) {
      return true;
    } else {
      return false;
    }
  }


  /**
   * 确认弹窗
   */
  public confirm(): void {
    this.modalService.warning({
      nzTitle: this.language.saveConfigMsg,
      nzContent: this.language.beenSaveConfigMsg,
      nzOkText: this.commonLanguage.cancel,
      nzOkType: 'danger',
      nzCancelText: this.commonLanguage.confirm,
      nzMaskClosable: false,
      nzOnCancel: () => {
        // true为点击配置保存按钮,false为弹框保存
        this.confirmSave = false;
        // 保存配置
        this.updateElement();
        // 返回租户列表
        this.$router.navigate(['/business/tenant/tenant-list']).then();
      },
      nzOnOk: () => {
        this.$router.navigate(['/business/tenant/tenant-list']).then();
      }
    });
  }


}
