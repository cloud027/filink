import {Component, OnDestroy, OnInit} from '@angular/core';
import {TenantApiService} from '../../share/sevice/tenant-api.service';
import {ActivatedRoute, Router} from '@angular/router';
import {NzI18nService, NzModalService} from 'ng-zorro-antd';
import {RuleUtil} from '../../../../shared-module/util/rule-util';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {LanguageEnum} from '../../../../shared-module/enum/language.enum';
import {TenantLanguageInterface} from '../../../../../assets/i18n/tenant/tenant.language.interface';
import {ResultModel} from '../../../../shared-module/model/result.model';
import {ResultCodeEnum} from '../../../../shared-module/enum/result-code.enum';
import {CommonLanguageInterface} from '../../../../../assets/i18n/common/common.language.interface';
import {CommonUtil} from '../../../../shared-module/util/common-util';

@Component({
  selector: 'app-alarm-config',
  templateUrl: './alarm-config.component.html',
  styleUrls: ['./alarm-config.component.scss']
})
export class AlarmConfigComponent implements OnInit, OnDestroy {

  // 告警配置数据
  public alarmElementList;
  // 备份首页配置数据
  public dataChange;
  // 按钮loading
  public submitLoading: boolean = false;
  // 租户id
  public tenantId: string = '';
  // 是否为点击保存配置
  public confirmSave: boolean = true;
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
   * 页面销毁
   */
  ngOnDestroy(): void {
  }

  /**
   * 查询首页/设施/告警配置数据
   */
  queryTenantConfig() {
    this.$activatedRoute.queryParams.subscribe(params => {
      this.tenantId = params.id;
      this.$tenantApiService.queryElementById(this.tenantId).subscribe((result: ResultModel<any>) => {
        if (result.code === ResultCodeEnum.success) {
          // 保存配置数据
          this.alarmElementList = CommonUtil.deepCopy(result.data.alarmElementList || []);
          // 备份配置数据
          this.dataChange = CommonUtil.deepCopy(result.data.alarmElementList || []);
        }
      });
    });
  }

  /**
   * 告警全选事件
   */
  public alarmSelectAll(data, elementCode) {
    data.isShow = data.isShow === '1' ? '0' : '1';
    data.children.forEach(item => {
      item.isShow = data.isShow;
    });
  }

  /**
   * 勾选事件
   */
  /**
   * 设施列表勾选
   */
  public log(item, isShow): void {
    const show = isShow === '1' ? '0' : '1';
    item.isShow = show;
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
    const body = {
      tenantId: this.tenantId,
      alarmElementList: this.alarmElementList,
      deviceElementList: null,
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
    if (this.alarmElementList && this.dataChange) {
      // 保存首页配置数据
      const data = JSON.stringify(this.alarmElementList).toString();
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
