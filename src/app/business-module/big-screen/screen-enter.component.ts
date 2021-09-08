import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import {NzI18nService} from 'ng-zorro-antd';
import {ShowScreenComponent} from './show-screen/show-screen.component';
import {Result} from '../../shared-module/entity/result';
import {FiLinkModalService} from '../../shared-module/service/filink-modal/filink-modal.service';
import {MapScreenService} from '../../core-module/api-service/screen-map/map-screen';
import {BigScreenLanguageInterface} from '../../../assets/i18n/big-screen/screen.language.interface';
import * as $ from 'jquery';


@Component({
  selector: 'app-enterScreen',
  templateUrl: './screen-enter.component.html',
  styleUrls: ['./screen-enter.component.scss']
})
export class ScreenEnterComponent implements OnInit {
  // 是否显示大屏
  isVisible = false;
  // 显示修改名称
  isEditName = true;
  // 列表数据
  screenList = [];
  /** 国际化 */
  language: BigScreenLanguageInterface;
  /** 修改名称时拷贝一个对象 */
  tempScreen = {};
  @ViewChild('showViewScreen') showViewScreen: ShowScreenComponent;
  @ViewChild('showViewScreen') viewScreen: ElementRef;

  constructor(private $I18n: NzI18nService,
              private $message: FiLinkModalService,
              private $MapScreenService: MapScreenService) {
  }

  ngOnInit() {
    this.getScreenList();
    this.language = this.$I18n.getLocaleData('bigScreen');
  }

  /**
   * 显示大屏
   */
  showScreen() {
    this.isVisible = true;
  }

  /**
   * 获取大屏列表
   */
  getScreenList() {
    this.$MapScreenService.getALLScreen().subscribe((result: Result) => {
      if (result.code === 0) {
        this.screenList = result.data;
      } else {
        this.$message.error(result.msg);
      }
    });
  }

  /**
   * 修改大屏名称
   */
  editName(item) {
    this.tempScreen = Object.assign({}, item);
    this.isEditName = false;
    // input渲染完成后添加焦点效果
    setTimeout(() => {
      $('#nameEdit').focus();
    }, 0);
  }

  changeName(item) {
    // todo 失去焦点请求接口
    this.isEditName = true;
    if (!item.largeScreenName.trim()) {
      this.$message.info(this.language.largeScreenNameWarning);
      // 回显
      item.largeScreenName = this.tempScreen['largeScreenName'];
    } else {
      this.$MapScreenService.editScreenName(item).subscribe((result: Result) => {
        if (result.code === 0) {
          this.$message.success(result.msg);
          this.getScreenList();
        } else {
          // 更新失败将名称还原
          item.largeScreenName = this.tempScreen['largeScreenName'];
          this.$message.error(result.msg);
        }
      });
    }
  }

}
