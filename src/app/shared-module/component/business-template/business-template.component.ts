import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {DrawInfo} from './template-item.enum';
import {BoardPutState, Template, TemplateColor, TemplateType} from '../../entity/template';
import {BasicTemplate} from './basic-template';
import {DrawTemplateService} from './draw-template.service';
import {TemplateSearchComponent} from './template-search/template-search.component';
import {BusinessTemplateService} from './business-template.service';
import {FiLinkModalService} from '../../service/filink-modal/filink-modal.service';
import {NzI18nService} from 'ng-zorro-antd';
import {FacilityLanguageInterface} from '../../../../assets/i18n/facility/facility.language.interface';
import {MaxNum} from '../../entity/template';

@Component({
  selector: 'app-business-template',
  templateUrl: './business-template.component.html',
  styleUrls: ['./business-template.component.scss']
})
export class BusinessTemplateComponent extends BasicTemplate implements OnInit {
  public language: FacilityLanguageInterface;
  @ViewChild('templateSearch') templateSearch: TemplateSearchComponent;
  @Output() selectedTemplate = new EventEmitter<any>();
  @Input() TemplateReqDto;
  // 获取queen实例
  Q = window['Q'];
  graph;
  // 当前模板名称
  templateInfo: Template = {
    name: ''
  };
  templateType = TemplateType.BOX;
  // 箱模板大小
  size = {
    width: 300,
    height: 300
  };
  // 新增模板显示隐藏
  isVisible: boolean = false;
  // 编辑图标显示隐藏
  modifyShow = true;
  // 修改数据
  modifyTemplate;
  // 盘横竖状态行
  putStateRow;
  // 盘横竖状态列
  putStateCol;

  constructor(private $drawTemplateService: DrawTemplateService,
              private $businessTemplateService: BusinessTemplateService,
              private $message: FiLinkModalService,
              private $nzI18n: NzI18nService) {
    super();
  }

  ngOnInit() {
    this.language = this.$nzI18n.getLocaleData('facility');
  }


  /**
   * 模板选择
   * param item
   */
  selectTemplate(item) {
    // 横向
    if (item.childTemplateList[0].putState === BoardPutState.LAY) {
      this.putStateRow = item.childTemplateList[0].childTemplateList[0].row;
      this.putStateCol = item.childTemplateList[0].childTemplateList[0].col;
    }
    // 纵向
    if (item.childTemplateList[0].putState === BoardPutState.STELLEN) {

      this.putStateRow = item.childTemplateList[0].childTemplateList[0].col;
      this.putStateCol = item.childTemplateList[0].childTemplateList[0].row;
    }
    this.templateInfo = item;
    this.draw();
  }

  /**
   * 模板绘制
   */
  draw() {
    this.initGraph('template-info-canvas');
    this.graph.clear();
    // 线条禁止拖动
    this.graph.isSelectable = (item) => {
      return item.get('type') === 'cabinet';
    };
    for (let k = 1; k <= this.templateInfo.reversible; k++) {
      const drawBox: DrawInfo = {
        startX: k === 1 ? 0 : this.templateInfo.col * this.size.width + this.spaceBetween,
        startY: 0,
        row: this.templateInfo.row,
        col: this.templateInfo.col,
        width: this.size.width,
        height: this.size.height,
        position: this.TemplateReqDto.boxCodeRule,
        direction: this.TemplateReqDto.boxTrend
      };
      // 首先绘制箱
      this.$drawTemplateService.drawTemplate(drawBox, this.graph, TemplateColor.theTemplate);

      // 每个箱里面绘制框
      for (let i = 0; i < this.templateInfo.col; i++) {
        for (let j = 0; j < this.templateInfo.row; j++) {
          const frameTemplate = this.templateInfo.childTemplateList[i * j + j];
          const drawFrame = {
            startX: drawBox.startX + 10 + i * this.size.width,
            startY: drawBox.startY + 10 + j * this.size.height,
            row: frameTemplate.row,
            col: frameTemplate.col,
            width: (this.size.width - 20) / frameTemplate.col,
            height: (this.size.height - 20) / frameTemplate.row,
            position: this.TemplateReqDto.boxCodeRule,
            direction: this.TemplateReqDto.boxTrend
          };
          this.$drawTemplateService.drawTemplate(drawFrame, this.graph);
          // 每个框里面绘制盘
          for (let n = 0; n < frameTemplate.col; n++) {
            for (let m = 0; m < frameTemplate.row; m++) {
              const size = {
                width: drawFrame.width - 20,
                height: drawFrame.height - 20,
              };
              /*const boardTemplate = frameTemplate.childTemplateList[n * m + m];*/
              const drawBoard = {
                startX: drawFrame.startX + 10 + n * drawFrame.width,
                startY: drawFrame.startY + 10 + m * drawFrame.height,
                row: this.putStateRow,
                col: this.putStateCol,
                // row: boardTemplate.row,
                // col: boardTemplate.col,
                width: size.width / this.putStateCol,
                height: size.height / this.putStateRow,
                // width: size.width / boardTemplate.col,
                // height: size.height / boardTemplate.row,

                position: this.TemplateReqDto.boxCodeRule,
                direction: this.TemplateReqDto.boxTrend
              };
              this.$drawTemplateService.drawTemplate(drawBoard, this.graph);
            }
          }
        }
      }
      if (k === 2) {
        const width = this.size.width;
        const col = this.templateInfo.col;
        this.drawReversible(width, col, this.graph);
      }
    }
  }

  /**
   * 新增模板按钮
   */
  addTemplate() {
    this.isVisible = true;
    this.$businessTemplateService.eventEmit.emit({modifyTemplate: null});
  }

  /**
   * 确认模板
   */
  handleOk() {
    const boxNum = this.templateInfo.childTemplateList;
    const frameNum = this.templateInfo.childTemplateList[0].childTemplateList;
    const boardNum = this.templateInfo.childTemplateList[0].childTemplateList[0];
    const templateNum = boxNum.length * frameNum.length * boardNum.reversible * boardNum.col * boardNum.row;
    // 判断端口数是否大于最大纤芯数
    if (templateNum > MaxNum.Maximum) {
      this.$message.warning(this.language.templateErrorMessage);
    } else {
      this.selectedTemplate.emit(this.templateInfo);
    }
  }

  /**
   * 选择模板取消按钮
   */
  handleClose() {
    this.isVisible = false;
    this.templateSearch.search();
  }

}
