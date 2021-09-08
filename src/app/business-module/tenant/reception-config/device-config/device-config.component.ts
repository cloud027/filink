import {Component, OnInit} from '@angular/core';
import {TenantLanguageInterface} from '../../../../../assets/i18n/tenant/tenant.language.interface';
import {TenantApiService} from '../../share/sevice/tenant-api.service';
import {ActivatedRoute, Router} from '@angular/router';
import {NzI18nService, NzModalService} from 'ng-zorro-antd';
import {RuleUtil} from '../../../../shared-module/util/rule-util';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {LanguageEnum} from '../../../../shared-module/enum/language.enum';
import {ResultModel} from '../../../../shared-module/model/result.model';
import {ResultCodeEnum} from '../../../../shared-module/enum/result-code.enum';
import {CommonLanguageInterface} from '../../../../../assets/i18n/common/common.language.interface';
import {CommonUtil} from '../../../../shared-module/util/common-util';

@Component({
  selector: 'app-device-config',
  templateUrl: './device-config.component.html',
  styleUrls: ['./device-config.component.scss']
})
export class DeviceConfigComponent implements OnInit {
  // 设施配置数据
  public deviceElementList;
  // 备份配置数据
  public dataChange;
  // 按钮loading
  public submitLoading = false;
  // 设施列表分类卡片可见
  public radioValue = '1';
  // 租户id
  public tenantId: string = '';
  // 是否为点击保存配置
  public confirmSave: boolean = true;


  // 设施列表字段
  public deviceListField;
  // 设施功能按钮
  public deviceButton;
  // 设施列表操作菜单
  public deviceOperationMenu;
  // 设施详情卡片
  public deviceDetailsCard;


  // 国际化
  public language: TenantLanguageInterface;
  // 公共语言包
  public commonLanguage: CommonLanguageInterface;


  constructor(
    public $tenantApiService: TenantApiService,
    public $router: Router,
    public $nzI18n: NzI18nService,
    public $ruleUtil: RuleUtil,
    public $active: ActivatedRoute,
    private $message: FiLinkModalService,
    private $activatedRoute: ActivatedRoute,
    public modalService: NzModalService,
  ) {
  }

  ngOnInit() {
    // 国际化
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.tenant);
    // 通用国际化
    this.commonLanguage = this.$nzI18n.getLocaleData('common');
    this.queryTenantConfig();
  }

  /**
   * 设施配置数据
   */
  queryTenantConfig() {
    this.$activatedRoute.queryParams.subscribe(params => {
      this.tenantId = params.id;
      this.$tenantApiService.queryElementById(this.tenantId).subscribe((result: ResultModel<any>) => {
        if (result.code === ResultCodeEnum.success) {
          // 保存首页配置数据
          this.deviceElementList = CommonUtil.deepCopy(result.data.deviceElementList || []);
          // 备份首页配置数据
          this.dataChange = CommonUtil.deepCopy(result.data.deviceElementList || []);

          this.deviceElementList.forEach(item => {
            if (item.elementCode === 'deviceListClassify') {
              // 设施列表分类卡片
              this.radioValue = item.isShow;
            }
            if (item.elementCode === 'deviceListField') {
              // 设施列表字段
              this.deviceListField = item.children;
            }
            if (item.elementCode === 'deviceButton') {
              // 设施功能按钮
              this.deviceButton = item.children;
            }
            if (item.elementCode === 'deviceOperationMenu') {
              // 设施列表操作菜单
              this.deviceOperationMenu = item.children;
            }
            if (item.elementCode === 'deviceDetailsCard') {
              // 设施详情卡片
              this.deviceDetailsCard = item.children;
            }
          });
        }
      });
    });
  }

  /**
   * 设施卡片切换
   */
  public ngModelChange() {
    this.deviceElementList.forEach(item => {
      if (item.elementCode === 'deviceListClassify') {
        // 设施列表分类卡片
        item.isShow = this.radioValue;
      }
    });
    this.deviceDataChanges();
  }


  /**
   * 设施列表勾选
   */
  public log(item, isShow): void {
    const show = isShow === '1' ? '0' : '1';
    item.isShow = show;
    this.deviceDataChanges();
  }

  /**
   * 详情卡显示切换
   */
  public detailCardCheck(data, elementCode) {
    data.forEach(item => {
      if (item.elementCode === elementCode) {
        item.isShow = item.isShow === '0' ? '1' : '0';
      }
    });
    this.deviceDataChanges();
  }


  /**
   * 确认事件
   */
  public updateMenuTemplate(): void {
    // 保存配置
    this.updateElement();
  }


  /**
   * 保存数据
   */
  public updateElement() {
    this.submitLoading = true;
    this.deviceDataChanges();
    const body = {
      tenantId: this.tenantId,
      alarmElementList: null,
      deviceElementList: this.deviceElementList,
      homePageElementList: null,
    };
    this.$tenantApiService.updateElementById(body).subscribe((result: ResultModel<any>) => {
      this.submitLoading = false;
      if (result.code === ResultCodeEnum.success) {
        this.$message.success(this.language.tenantConfigMsg);
        if (this.confirmSave) {
          // 刷新数据
          this.queryTenantConfig();
        }
      } else {
        this.$message.warning(result.msg);
      }
    }, () => {
      this.submitLoading = false;
    });
  }

  /**
   * 设施数据处理
   */
  public deviceDataChanges() {
    this.deviceElementList.forEach(item => {
      if (item.elementCode === 'deviceListClassify') {
        // 设施列表分类卡片
        item.isShow = this.radioValue;
      }
      if (item.elementCode === 'deviceListField') {
        // 设施列表字段
        item.children = this.deviceListField;
      }
      if (item.elementCode === 'deviceButton') {
        // 设施功能按钮
        item.children = this.deviceButton;
      }
      if (item.elementCode === 'deviceOperationMenu') {
        // 设施列表操作菜单
        item.children = this.deviceOperationMenu;
      }
      if (item.elementCode === 'deviceDetailsCard') {
        // 设施详情卡片
        item.children = this.deviceDetailsCard;
      }
    });
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
    if (this.deviceElementList && this.dataChange) {
      // 保存首页配置数据
      const data = JSON.stringify(this.deviceElementList).toString();
      const dataChange = JSON.stringify(this.dataChange).toString();
      if (data === dataChange) {
        return false;
      } else {
        return true;
      }
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
