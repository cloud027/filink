import {Component, OnInit} from '@angular/core';
import {NzI18nService} from 'ng-zorro-antd';
import * as _ from 'lodash';
import {LanguageEnum} from '../../shared-module/enum/language.enum';
import {PageModel} from '../../shared-module/model/page.model';
import {UserLanguageInterface} from '../../../assets/i18n/user/user-language.interface';
import {FilterCondition, QueryConditionModel} from '../../shared-module/model/query-condition.model';
import {MessageService} from './share/service/message.service';
import {MessageTypeEnum} from './share/enum/message-type.enum';
import {MessageDataModel} from './share/model/message-data.model';
import {ResultModel} from '../../shared-module/model/result.model';
import {ResultCodeEnum} from '../../shared-module/enum/result-code.enum';
import {MessageCountMission} from '../../core-module/mission/message-count.mission';
import {Router} from '@angular/router';
import {OperatorEnum} from '../../shared-module/enum/operator.enum';
import {TIME_EXTRA} from '../../shared-module/const/time-extra';
import {TableSortConfig} from '../../shared-module/enum/table-style-config.enum';
import {DateTypeEnum} from '../../shared-module/enum/date-type.enum';
import {TimerSelectorService} from '../../shared-module/service/time-selector/timer-selector.service';
import {CommonUtil} from '../../shared-module/util/common-util';
import { HttpClient } from '@angular/common/http';
import {FiLinkModalService} from '../../shared-module/service/filink-modal/filink-modal.service';
import {IsReceiveEnum} from './share/enum/is-receive.enum';

/**
 * 消息通知页面
 */
@Component({
  selector: 'app-message-notification',
  templateUrl: './message-notification.component.html',
  styleUrls: ['./message-notification.component.scss']
})
export class MessageNotificationComponent implements OnInit {
  // 分页初始设置
  public pageBean: PageModel = new PageModel();
  // 查询条件
  public queryCondition = new QueryConditionModel();
  // 语言包
  public language: UserLanguageInterface;
  // 是否加载
  public isLoading: boolean = false;
  // 消息通知数据
  public messageData: MessageDataModel[] = [];
  // 消息查询
  public searchValue: string = '';
  // 消息类型枚举
  public messageTypeEnum = MessageTypeEnum;
  // 单选按钮值
  public radioValue: string = MessageTypeEnum.all;
  // 国际化枚举
  public languageEnum = LanguageEnum;
  // 时间选择器默认值
  public dateType = DateTypeEnum.threeMonth;
  // 是否已点击接收、不接收按钮
  public isReceiveEnum = IsReceiveEnum;
  // 开始时间过滤条件
  private startTimeFilter: FilterCondition = new FilterCondition();
  // 结束时间过滤条件
  private endTimeFilter: FilterCondition = new FilterCondition();

  constructor(public $nzI18n: NzI18nService,
              public $router: Router,
              public $http: HttpClient,
              public $messageService: MessageService,
              private $message: FiLinkModalService,
              private $timerSelectorService: TimerSelectorService,
              private $messageCountMission: MessageCountMission) {
  }

  /**
   * 初始化
   */
  public ngOnInit(): void {
    // 国际化
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.user);
    // 获取数据
    this.refreshData();
    // 监听消息大厅的未读消息数量
    this.$messageCountMission.messageCountChangeHook.subscribe(count => {
      // 当有未读消息,且在消息大厅页面时，刷新消息大厅页面数据
      if (this.$router.url === '/business/message-notification') {
        this.refreshData();
      }
    });
  }


  /**
   * 页码改变回调
   * @param event number
   */
  public pageIndexChange(event: number): void {
    this.queryCondition.pageCondition.pageNum = event;
    this.refreshData();
  }

  /**
   * 每页条数改变回调
   * @param event number
   */
  public pageSizeChange(event: number): void {
    this.queryCondition.pageCondition.pageSize = event;
    this.refreshData();
  }

  /**
   *  日期选择回调
   */
  public timeChangeFilter(event: { startTime: number, endTime: number }): void {
    // 当开始时间和结束时间为undefined时,默认给三个月内的范围
    if (event.startTime === undefined && event.endTime === undefined) {
      this.dateType = DateTypeEnum.threeMonth;
      const date = this.$timerSelectorService.getDateRang(90);
      event.startTime = CommonUtil.sendBackEndTime(new Date(_.first(date)).getTime());
      event.endTime = CommonUtil.sendBackEndTime(new Date(_.last(date)).getTime());
    }
    // 开始时间和结束时间的筛选条件
    this.startTimeFilter = new FilterCondition('create_time', OperatorEnum.gte, event.startTime);
    this.startTimeFilter.extra = TIME_EXTRA;
    this.endTimeFilter = new FilterCondition('create_time', OperatorEnum.lte, event.endTime);
    this.endTimeFilter.extra = TIME_EXTRA;
    // 查询关键字、单选钮的变化，进行数据刷新
    this.searchChange();
  }

  /**
   * 点击确认接收或不接收
   */
  public confirmData(url: string): void {
    this.$http.get(url, {responseType: 'text'}).subscribe(res => {
      this.$message.info(res);
      this.refreshData();
    });
  }

  /**
   * 输入关键词、选中单选钮变化回调
   */
  public searchChange(): void {
    this.queryCondition.filterConditions = [];
    this.queryCondition.pageCondition.pageNum = 1;
    // 关键字搜索
    if (this.searchValue) {
      this.queryCondition.filterConditions.push(new FilterCondition('content', OperatorEnum.like, this.searchValue));
    }
    // 点击按钮筛选
    if (this.radioValue !== MessageTypeEnum.all) {
      const filterCondition = new FilterCondition('type', OperatorEnum.eq, this.radioValue);
      this.queryCondition.filterConditions.push(filterCondition);
    }
    this.refreshData();
  }

  /**
   * 防抖 获取消息数据
   */
  refreshData = _.debounce(() => {
    // 添加时间的筛选条件
    this.queryCondition.filterConditions.push(this.startTimeFilter, this.endTimeFilter);
    // 添加排序条件，默认按时间降序排序
    this.queryCondition.sortCondition.sortField = 'create_time';
    this.queryCondition.sortCondition.sortRule = TableSortConfig.DESC;
    // 获取消息数据
    this.$messageService.queryMessage(this.queryCondition).subscribe((result: ResultModel<MessageDataModel[]>) => {
      this.isLoading = false;
      if (result.code === ResultCodeEnum.success) {
        this.messageData = result.data || [];
        // 获取每条数据内容中存在的url， url中存在多个链接用,分割
        this.messageData.forEach(item => {
          if (item.url !== null) {
            if (item.url.includes(',')) {
              // 获取每条数据对应的接收、不接收链接
              const contentUrl = item.url.split(',');
              item.acceptUrl = contentUrl[0];
              item.noAcceptUrl = contentUrl[1];
            } else {
              item.acceptUrl = item.url;
            }
          }
          // 如果消息中有<br>，则转化为\n，实现换行效果
          item.content = item.content.replace(/<br>/g, '\n');
        });
        this.pageBean.Total = result.totalCount;
        this.pageBean.pageIndex = result.pageNum;
        this.pageBean.pageSize = result.size;
      }
    }, () => {
      this.isLoading = false;
    });
  }, 200, {leading: false, trailing: true});
}
