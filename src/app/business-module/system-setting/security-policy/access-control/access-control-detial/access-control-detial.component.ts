import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild, ElementRef} from '@angular/core';
import {NzI18nService} from 'ng-zorro-antd';
import {ColumnConfigService} from '../../../share/service/column-config.service';
import {BasicConfig} from '../../../share/service/basic-config';
import {SystemParameterService} from '../../../share/service';
import {FiLinkModalService} from '../../../../../shared-module/service/filink-modal/filink-modal.service';
import {CommonUtil} from '../../../../../shared-module/util/common-util';
import {ResultModel} from '../../../../../shared-module/model/result.model';
import {RangeModel} from '../../../share/mode/range.model';
import {InputErrPositionEnum, IpEnum} from '../../../share/enum/system-setting.enum';
import {IpInfoTplModel} from '../../../share/mode/ip-info-tpl.model';

/**
 * 新增、编辑访问控制列表
 */
@Component({
  selector: 'app-access-control-detial',
  templateUrl: './access-control-detial.component.html',
  styleUrls: ['./access-control-detial.component.scss']
})
export class AccessControlDetialComponent extends BasicConfig implements OnInit, AfterViewInit {
  // 弹窗标题
  @Input() title = this.language.systemSetting.addIPAddressRange;
  // 弹窗是否可见
  @Input() isVisible: boolean = false;
  // IP数据集
  @Input() ipInfo = {rangeId: '', ipType: IpEnum.ipFour, startIp: '', endIp: '', mask: ''};
  // 推送取消事件
  @Output() cancel = new EventEmitter<boolean>();
  // startIPV4模板
  @ViewChild('startIPV4') private startIPV4Template;
  // 屏蔽IP
  @ViewChild('maskIp') maskIp: ElementRef;
  // 启用ip4
  @ViewChild('startIPV4Value') startIPV4: ElementRef;
  // 禁用ip4
  @ViewChild('endIPV4Value') endIPV4: ElementRef;
  // 禁用ip6
  @ViewChild('endIPV6Value') endIPV6: ElementRef;
  // 启用ip6
  @ViewChild('startIPV6Value') startIPV6: ElementRef;
  // 屏蔽IP6
  @ViewChild('ipV6Mask') maskIPV6: ElementRef;
  // 禁用ip4模板
  @ViewChild('endIPV4') private endIPV4Template;
  // 启用ip6模板
  @ViewChild('startIPV6') private startIPV6Template;
  // 启用ip6模板
  @ViewChild('endIPV6') private endIPV6Template;
  // 屏蔽IP6模板
  @ViewChild('maskIpv6') private maskIpv6Template;
  // 屏蔽IP4模板
  @ViewChild('maskIpv4') private maskIpv4Template;
  // 弹框宽度
  public modelWith: number = 680;
  public ipInfoTpl: IpInfoTplModel;
  // 路径
  private checkUrl: string = '';
  // IPV6 mask错误提示
  public maskErrors: boolean = false;
  // startIPV6错误提示
  public startIpV6Errors: boolean = false;
  // endIPV6错误提示
  public endIpV6Errors: boolean = false;
  // IPV6提交错误提示
  public ipV6submitErrors: boolean = false;
  // IPV4提交错误提示
  public ipV4submitErrors: boolean = false;
  // startIPV4错误提示
  public startIpV4Errors: boolean = false;
  // endIPV4错误提示
  public endIpV4Errors: boolean = false;
  // IPV4错误提示
  public maskIpV4Errors: boolean = false;
  // 默认ipv4
  public ipType: IpEnum = IpEnum.ipFour;
  // IPV4数组
  private ipv4Mask: Array<HTMLInputElement> = [];
  // StartIPV4数组
  private ipv4StartIp: Array<HTMLInputElement> = [];
  // EndIPV4数组
  private ipv4EndIp: Array<HTMLInputElement> = [];
  // EndIPV6数组
  private ipv6EndIp: Array<HTMLInputElement> = [];
  // StartIPV6数组
  private ipv6StartIp: Array<HTMLInputElement> = [];
  // IPV6数组
  private ipv6Mask: Array<HTMLInputElement> = [];

  constructor(public $nzI18n: NzI18nService,
              private $securityPolicyService: SystemParameterService,
              private $message: FiLinkModalService,
              private $columnConfigService: ColumnConfigService
  ) {
    super($nzI18n);
  }

  /**
   * 初始化
   */
  public ngOnInit(): void {
    this.ipInfoTpl = {
      startIPV4Template: this.startIPV4Template,
      endIPV4Template: this.endIPV4Template,
      modelChange: this.ipModelChange,
      maskIpv6Template: this.maskIpv6Template,
      maskIpv4Template: this.maskIpv4Template
    };
    this.formColumn = this.$columnConfigService.getAccessControlFormConfig(this.ipInfo, this.ipInfoTpl);
  }

  public ngAfterViewInit(): void {
    // 判断是否为空
    if (this.ipInfo.rangeId !== undefined) {
      this.$securityPolicyService.queryRangeId({rangeId: this.ipInfo.rangeId})
        .subscribe((result: ResultModel<RangeModel>) => {
          this.ipInfo = result.data;
          // 将值set到表单中
          this.formStatus.resetData(this.ipInfo);
          // 是否为ip4
          if (this.ipInfo.ipType === IpEnum.ipFour) {
            this.ipv4Mask = this.maskIp.nativeElement.getElementsByTagName('input');
            this.ipv4StartIp = this.startIPV4.nativeElement.getElementsByTagName('input');
            this.ipv4EndIp = this.endIPV4.nativeElement.getElementsByTagName('input');
            // 分割字符串
            const mask = this.ipInfo.mask.split('.');
            const startIp = this.ipInfo.startIp.split('.');
            const endIp = this.ipInfo.endIp.split('.');
            this.componentAssignment(this.ipv4Mask, mask);
            this.componentAssignment(this.ipv4StartIp, startIp);
            this.componentAssignment(this.ipv4EndIp, endIp);
            this.goNextInput(this.ipv4StartIp, this.ipInfo.ipType, InputErrPositionEnum.errIpv4StartIp);
            this.goNextInput(this.ipv4Mask, this.ipInfo.ipType, InputErrPositionEnum.errIpv4Mask);
            this.goNextInput(this.ipv4EndIp, this.ipInfo.ipType, InputErrPositionEnum.errIpv4EndIp);
            this.ipV4submitErrors = true;
            this.ipV6submitErrors = false;
          } else {
            setTimeout(() => {
              this.ipv6EndIp = this.endIPV6.nativeElement.getElementsByTagName('input');
              this.ipv6StartIp = this.startIPV6.nativeElement.getElementsByTagName('input');
              this.ipv6Mask = this.maskIPV6.nativeElement.getElementsByTagName('input');
              // 分割字符串
              const endIp = this.ipInfo.endIp.split(':');
              const startIp = this.ipInfo.startIp.split(':');
              const mask = this.ipInfo.mask;
              this.componentAssignment(this.ipv6EndIp, endIp);
              this.componentAssignment(this.ipv6StartIp, startIp);
              this.ipv6Mask[0].value = mask;
              this.goNextInput(this.ipv6EndIp, this.ipInfo.ipType, InputErrPositionEnum.errIpv6EndIp);
              this.goNextInput(this.ipv6StartIp, this.ipInfo.ipType, InputErrPositionEnum.errIpv6StartIp);
              this.ipV6submitErrors = true;
              this.ipV4submitErrors = false;
            }, 0);
          }
        });
    } else {
      this.defaultModel(this.ipType);
    }
  }

  /**
   * 组件赋值
   */
  public componentAssignment(array: Array<HTMLInputElement>, val: Array<string> | string): void {
    for (let i = 0; i < array.length; i++) {
      array[i].value = val[i];
    }
  }


  /**
   * 组件取值
   */
  public componentGetValue(array: Array<HTMLInputElement>, type: IpEnum): string {
    let temp1 = '';
    if (type === IpEnum.ipFour) {
      for (let i = 0; i < array.length; i++) {
        temp1 += `${array[i].value}.`;
      }
    } else if (type === IpEnum.ipSix) {
      for (let i = 0; i < array.length; i++) {
        temp1 += `${array[i].value}:`;
      }
    }
    return temp1.substring(0, temp1.length - 1);
  }

  /**
   * input框自动聚焦到下个input框
   * type判断是IPV4或IPV6
   */
  public goNextInput(el, type: IpEnum, ipType?: InputErrPositionEnum): void {
    // 正则
    const regEn = /^([\da-fA-F]{1,4})$/;
    const rx = /^(25[0-5]|2[0-4]\d|[01]?\d\d?)$/;
    const regIpv4Mask = /^(254|252|248|240|224|192|128|0)\.0\.0\.0|255\.(254|252|248|240|224|192|128|0)\.0\.0|255\.255\.(254|252|248|240|224|192|128|0)\.0|255\.255\.255\.(254|252|248|240|224|192|128|0)$/;
    let val;
    let reg;
    // 是否是ip6
    if (type === IpEnum.ipSix) {
      val = 4;
      reg = regEn;
    } else {
      val = 3;
      reg = rx;
    }
    for (let i = 0; i < el.length; i++) {
      const t = el[i];
      t.index = i;
      t.onkeyup = () => {
        const next = t.index + 1;
        // 内容是否正确 不正确就报错
        let showErrorFlag;
        if (ipType === InputErrPositionEnum.errIpv4Mask) {
          showErrorFlag = !regIpv4Mask.test(this.componentGetValue(el, type));
        } else {
          showErrorFlag = !reg.test(t.value);
        }

        if (showErrorFlag) {
          this.showErrors(ipType, true, type);
        } else {
          this.showErrors(ipType, false, type);
          // 当最后一个焦点失去时
          if (t.value.length === val) {
            if (next < el.length) {
              el[next].focus();
            }
          }
        }
      };
    }
  }

  /**
   * 判断是否输入错误
   * param num
   */
  public showErrors(num: InputErrPositionEnum, bool: boolean, type: IpEnum): void {
    // 判断ip类型输入错误
    if (type === IpEnum.ipSix) {
      num === InputErrPositionEnum.errIpv6StartIp ? this.startIpV6Errors = bool : this.endIpV6Errors = bool;
    } else {
      num === InputErrPositionEnum.errIpv4StartIp ? this.startIpV4Errors = bool : num === InputErrPositionEnum.errIpv4EndIp
        ? this.endIpV4Errors = bool : this.maskIpV4Errors = bool;
    }

  }

  /**
   * 确认按钮
   */
  public handleOk(): void {
    const form = document.forms[0];
    this.submitLoading = true;
    const item: RangeModel = this.formStatus.getData();
    // type 为 ip4
    if (item.ipType === IpEnum.ipFour) {
      item.startIp = this.componentGetValue(this.ipv4StartIp, item.ipType);
      item.endIp = this.componentGetValue(this.ipv4EndIp, item.ipType);
      item.mask = this.componentGetValue(this.ipv4Mask, item.ipType);
      // 起始IP 终止IP 掩码为...
      if (item.startIp === '...' || item.endIp === '...' || item.mask === '...') {
        this.$message.warning(this.language.systemSetting.pleaseFillInTheFullIPOrMask);
        this.submitLoading = false;
        return;
      }
      // 起始IP等于终止IP
      // if (item.startIp === item.endIp) {
      //   this.$message.warning(this.language.systemSetting.pleaseFillDifferenceIPOrMask);
      //   this.submitLoading = false;
      //   return;
      // }
    } else {
      this.ipv6EndIp = this.endIPV6.nativeElement.getElementsByTagName('input');
      this.ipv6StartIp = this.startIPV6.nativeElement.getElementsByTagName('input');
      this.ipv6Mask = this.maskIPV6.nativeElement.getElementsByTagName('input');
      item.endIp = this.componentGetValue(this.ipv6EndIp, item.ipType);
      item.startIp = this.componentGetValue(this.ipv6StartIp, item.ipType);
      item.mask = form.elements['maskIpV6'].value;
      // 起始IP和终止IP：：：：：： 掩码为空
      if (item.startIp === ':::::::' || item.endIp === ':::::::' || item.mask === '') {
        this.$message.warning(this.language.systemSetting.pleaseFillInTheFullIPOrMask);
        this.submitLoading = false;
        return;
      }
      // 起始IP等于终止IP
      // if (item.startIp === item.endIp) {
      //   this.$message.warning(this.language.systemSetting.pleaseFillDifferenceIPOrMask);
      //   this.submitLoading = false;
      //   return;
      // }
    }
    if (this.ipInfo.rangeId === undefined) {
      this.checkUrl = 'addIpRange';
    } else {
      this.checkUrl = 'updateIpRange';
      item.rangeId = this.ipInfo.rangeId;
    }
    // 比较IP的大小
    if (CommonUtil.compareIP(item.startIp, item.endIp)) {
      this.$securityPolicyService[this.checkUrl](item).subscribe((result: ResultModel<string>) => {
        this.submitLoading = false;
        if (result.code === 0) {
          this.$message.success(result.msg);
          this.cancel.emit(true);
        } else {
          this.$message.error(result.msg);
        }
      }, () => this.submitLoading = false);
    } else {
      this.$message.error(`${this.language.systemSetting.initiatingIPAndEndingIPIllegal}!`);
      this.submitLoading = false;
    }
  }

  /**
   * 取消按钮
   */
  public handleCancel(): void {
    this.cancel.emit();
  }

  /**
   * IPV6掩码失去焦事件
   */
  public endKeyMaskIpV6UpEvent(event): void {
    if (/^(\d|[[1-9]\d|1[0-1]\d|12[0-8])$/.test(event.target.value)) {
      this.maskErrors = false;
    } else {
      this.maskErrors = true;
    }
  }

  /**
   * 默认进页面是IPV4
   */
  private defaultModel(type: IpEnum): void {
    setTimeout(() => {
      this.ipv4Mask = this.maskIp.nativeElement.getElementsByTagName('input');
      this.ipv4StartIp = this.startIPV4.nativeElement.getElementsByTagName('input');
      this.ipv4EndIp = this.endIPV4.nativeElement.getElementsByTagName('input');
      this.goNextInput(this.ipv4StartIp, type, InputErrPositionEnum.errIpv4StartIp);
      this.goNextInput(this.ipv4Mask, type, InputErrPositionEnum.errIpv4Mask);
      this.goNextInput(this.ipv4EndIp, type, InputErrPositionEnum.errIpv4EndIp);
      this.ipV4submitErrors = true;
    }, 0);
  }

  /**
   * 切换模板
   */
  ipModelChange = (controls, $event: IpEnum, key: string) => {
    console.log(controls);
    if (key === 'ipType') {
      // 为ip6
      if ($event === IpEnum.ipSix) {
        this.modelWith = 1050;
        this.formColumn[1].template = this.startIPV6Template;
        this.formColumn[2].template = this.endIPV6Template;
        this.formColumn[3].template = this.maskIpv6Template;
        setTimeout(() => {
          const allStartIpV6 = document.querySelectorAll('.startIpv6');
          const allEndIpV6 = document.querySelectorAll('.endIpv6');
          this.goNextInput(allStartIpV6, $event, InputErrPositionEnum.errIpv6StartIp);
          this.goNextInput(allEndIpV6, $event, InputErrPositionEnum.errIpv6EndIp);
          this.ipV6submitErrors = true;
          this.ipV4submitErrors = false;
        }, 0);
      } else {
        // 为ip4
        this.modelWith = 680;
        this.formColumn[1].template = this.startIPV4Template;
        this.formColumn[2].template = this.endIPV4Template;
        this.formColumn[3].template = this.maskIpv4Template;
        this.defaultModel($event);
        this.ipV6submitErrors = false;
      }
    }
  }
}

