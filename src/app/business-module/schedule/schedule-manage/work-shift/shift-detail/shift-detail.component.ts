import {Component, OnInit, ViewChild, TemplateRef} from '@angular/core';
import {OperateTypeEnum} from '../../../../../shared-module/enum/page-operate-type.enum';
import {NzI18nService} from 'ng-zorro-antd';
import {Router, ActivatedRoute} from '@angular/router';
import {ScheduleLanguageInterface} from '../../../../../../assets/i18n/schedule/schedule.language.interface';
import {LanguageEnum} from '../../../../../shared-module/enum/language.enum';
import {CommonLanguageInterface} from '../../../../../../assets/i18n/common/common.language.interface';
import {FormItem} from '../../../../../shared-module/component/form/form-config';
import {FormOperate} from '../../../../../shared-module/component/form/form-operate.service';
import {RuleUtil} from '../../../../../shared-module/util/rule-util';
import {ScheduleApiService} from '../../../share/service/schedule-api.service';
import {WorkShiftDataModel} from '../../../share/model/work-shift-data.model';
import {ResultModel} from '../../../../../shared-module/model/result.model';
import {ResultCodeEnum} from '../../../../../shared-module/enum/result-code.enum';
import {FiLinkModalService} from '../../../../../shared-module/service/filink-modal/filink-modal.service';
import {CommonUtil} from '../../../../../shared-module/util/common-util';
import {DateFormatStringEnum} from '../../../../../shared-module/enum/date-format-string.enum';

/**
 * 新增、编辑班次
 */
@Component({
  selector: 'app-shift-detail',
  templateUrl: './shift-detail.component.html',
  styleUrls: ['./shift-detail.component.scss']
})
export class ShiftDetailComponent implements OnInit {
  // 班次时段
  @ViewChild('shiftTimeTemp') public shiftTimeTemp: TemplateRef<HTMLDocument>;
  // 页面标题
  public pageTitle: string = '';
  // 页面类型
  public pageType: string = OperateTypeEnum.add;
  // 公共国际化
  public commonLanguage: CommonLanguageInterface;
  // 国际化
  public scheduleLanguage: ScheduleLanguageInterface;
  // 表单配置
  public formColumn: FormItem[] = [];
  // 按钮loading
  public isLoading: boolean = false;
  // 按钮禁用
  public isDisabled: boolean = true;
  // 时间格式
  public format: string = DateFormatStringEnum.timeFormat;
  // 时间选择框默认打开的选择
  public defaultOpenValue: Date = new Date(0, 0, 0, 0, 0, 0);
  // 表单操作实现类
  private formStatus: FormOperate;
  // 班次id
  private shiftId: string;

  constructor(public $nzI18n: NzI18nService,
              public $message: FiLinkModalService,
              private $router: Router,
              private $active: ActivatedRoute,
              private $ruleUtil: RuleUtil,
              private $scheduleService: ScheduleApiService) {
  }

  /**
   * 初始化
   */
  public ngOnInit(): void {
    // 国际化
    this.scheduleLanguage = this.$nzI18n.getLocaleData(LanguageEnum.schedule);
    this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
    // 初始化表单
    this.initForm();
    // 初始化新增/编辑页面
    this.getPage();
  }

  /**
   * 获取表单实例对象
   */
  public formInstance(event: { instance: FormOperate }): void {
    this.formStatus = event.instance;
    this.formStatus.group.statusChanges.subscribe(() => {
      this.isDisabled = !(this.formStatus.getRealValid() && this.formStatus.getData('startTime') && this.formStatus.getData('endTime'));
    });
  }

  /**
   * 提交
   */
  public submit(): void {
    // 获取表单数据
    const data = this.formStatus.getData();
    // 处理开始时间和结束时间
    data.startTime = CommonUtil.dateFmt(this.format.toLowerCase(), data.startTime);
    data.endTime = CommonUtil.dateFmt(this.format.toLowerCase(), data.endTime);
    if (!this.shiftId) {
      // 新增
      this.saveData(data);
    } else {
      // 编辑需要传id
      data.id = this.shiftId;
      // 查看当前班次时段与其他班次时段是否有交叉，并给出提示
      this.$scheduleService.checkSave(data).subscribe((res: ResultModel<boolean>) => {
        if (res.code === ResultCodeEnum.success) {
          if (!res.data) {
            this.$message.confirm(this.scheduleLanguage.noModifyShift, () => {
              this.saveData(data);
            });
          } else {
            this.saveData(data);
          }
        } else {
          this.$message.error(res.msg);
        }
      });
    }
  }

  /**
   * 跳转到列表
   */
  public goBack(): void {
    this.$router.navigate(['/business/schedule/work-shift']).then();
  }

  /**
   * 保存操作处理
   */
  private saveData(data: WorkShiftDataModel): void {
    this.isLoading = true;
    this.$scheduleService.saveShiftInfo(data).subscribe((res: ResultModel<string>) => {
      this.isLoading = false;
      if (res.code === ResultCodeEnum.success) {
        if (!this.shiftId) {
          this.$message.success(this.scheduleLanguage.addShiftSuccess);
        } else {
          this.$message.success(this.scheduleLanguage.updateShiftSuccess);
        }
        this.goBack();
      } else {
        this.$message.error(res.msg);
      }
    }, () => {
      this.isLoading = false;
    });
  }

  /**
   * 初始化表单
   */
  private initForm(): void {
    this.formColumn = [
      {
        // 班次名称
        label: this.scheduleLanguage.workShiftName,
        key: 'shiftName',
        require: true,
        type: 'input',
        rule: [{required: true}, RuleUtil.getNameMinLengthRule(), RuleUtil.getNameMaxLengthRule(),
          RuleUtil.getCurrentNameRule(this.commonLanguage.nameCodeMsg)
        ],
        customRules: [this.$ruleUtil.getNameCustomRule()],
        asyncRules: [
          // 调用接口异步校验名称唯一性
          this.$ruleUtil.getNameAsyncRule(value => this.$scheduleService.checkShiftName({shiftName: value, id: this.shiftId}),
            res => !res.data, '班次名称已存在')
        ],
      },
      {
        // 班次类型
        label: this.scheduleLanguage.workShiftType,
        key: 'shiftType',
        type: 'input',
        rule: [RuleUtil.getNameMinLengthRule(), RuleUtil.getNameMaxLengthRule(),
          RuleUtil.getCurrentNameRule(this.commonLanguage.nameCodeMsg)
        ],
        customRules: [this.$ruleUtil.getNameCustomRule()],
        asyncRules: [
          // 调用接口异步校验类型唯一性
          this.$ruleUtil.getNameAsyncRule(value => this.$scheduleService.checkShiftType({shiftType: value, id: this.shiftId}),
            res => !res.data, '班次类型已存在')
        ],
      },
      {
        // 班次时段开始时间
        label: this.scheduleLanguage.shiftTime,
        key: 'startTime',
        width: 400,
        require: true,
        type: 'custom',
        template: this.shiftTimeTemp,
        rule: []
      },
      {
        // 班次时段结束时间 不展示
        label: this.scheduleLanguage.shiftTime,
        key: 'endTime',
        width: 400,
        require: true,
        hidden: true,
        type: 'custom',
        template: this.shiftTimeTemp,
        rule: []
      },
      {
        // 备注
        label: this.scheduleLanguage.remark,
        key: 'remark',
        type: 'textarea',
        rule: [this.$ruleUtil.getRemarkMaxLengthRule()]
      }
    ];
  }

  /**
   * 获取新增、编辑页面显示
   */
  private getPage(): void {
    // 获取页面操作类型及标题
    this.pageType = this.$active.snapshot.params.type;
    this.pageTitle = this.pageType === OperateTypeEnum.update ? this.scheduleLanguage.updateShift : this.scheduleLanguage.addShift;
    if (this.pageType === OperateTypeEnum.update) {
      this.$active.queryParams.subscribe(params => {
        this.shiftId = params.id;
        // 编辑数据回显
        this.getShiftData();
      });
    }
  }

  /**
   * 编辑数据回显
   */
  private getShiftData(): void {
    // 通过id查询班次信息进行回显
    this.$scheduleService.queryListShiftById(this.shiftId).subscribe((res: ResultModel<WorkShiftDataModel>) => {
      if (res.code === ResultCodeEnum.success) {
        const data = res.data;
        // 处理得到的开始时间和结束时间 进行回显
        const startTime = data.startTime.split(':');
        const endTime = data.endTime.split(':');
        this.formStatus.resetData(data);
        this.formStatus.resetControlData('startTime',
          new Date(0, 0, 0, Number(startTime[0]), Number(startTime[1]))
        );
        this.formStatus.resetControlData('endTime',
          new Date(0, 0, 0, Number(endTime[0]), Number(endTime[1]))
        );
      }
    });
  }
}
