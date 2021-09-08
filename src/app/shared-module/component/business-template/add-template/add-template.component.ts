import {Component, EventEmitter, Input, OnInit, Output, ViewChild, AfterViewInit} from '@angular/core';
import {BoxTemplateComponent} from '../box-template/box-template.component';
import {FrameTemplateComponent} from '../frame-template/frame-template.component';
import {BoardTemplateComponent} from '../board-template/board-template.component';
import {BusinessTemplateService} from '../business-template.service';
import {FacilityLanguageInterface} from '../../../../../assets/i18n/facility/facility.language.interface';
import {NzI18nService} from 'ng-zorro-antd';

@Component({
  selector: 'app-add-template',
  templateUrl: './add-template.component.html',
  styleUrls: ['./add-template.component.scss']
})
export class AddTemplateComponent implements OnInit, AfterViewInit {
  public language: FacilityLanguageInterface;
  @Input() isVisible: boolean = false;
  @Output() handleClose = new EventEmitter<any>();
  @Input() TemplateReqDto;
  @ViewChild('boxTemplate') boxTemplate: BoxTemplateComponent;
  @ViewChild('frameTemplate') frameTemplate: FrameTemplateComponent;
  @ViewChild('boardTemplate') boardTemplate: BoardTemplateComponent;
  // 修改值
  modifyTemplate;
  // 模板修改保存显示
  modifyShow;

  constructor(private $nzI18n: NzI18nService,
              private $businessTemplateService: BusinessTemplateService) {
  }

  ngOnInit() {
    this.language = this.$nzI18n.getLocaleData('facility');
  }

  ngAfterViewInit() {
    this.$businessTemplateService.eventEmit.subscribe((value) => {
      if (value.modifyTemplate) {
        this.isVisible = true;
        this.modifyShow = value.modifyShow;
        this.modifyTemplate = value.modifyTemplate;
        this.boxTemplate.modifyBox(this.modifyTemplate);
      }
    });
  }

  /**
   * 保存模板
   */
  handleOk() {

  }

  /**
   * 箱刷新
   */
  boxSearch() {
    this.boxTemplate.boxSearch();
  }

  /**
   * 盘刷新
   */
  frameSearch() {
    this.frameTemplate.frameSearch();
  }

  /**
   * 关闭模态框
   */
  close() {
    if (this.boxTemplate.graph) {
      this.boxTemplate.clearGraph();
    }
    this.modifyShow = false;
    this.boxTemplate.modifyBox('');
    this.handleClose.emit();
    this.isVisible = false;
  }
}
