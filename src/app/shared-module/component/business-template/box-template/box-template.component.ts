import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {BasicTemplate} from '../basic-template';
import {MaxNum, Reversible, Template, TemplateColor, TemplateType, BoardPutState} from '../../../entity/template';
import {DrawInfo} from '../template-item.enum';
import {DrawTemplateService} from '../draw-template.service';
import {FiLinkModalService} from '../../../service/filink-modal/filink-modal.service';
import {SmartService} from '../../../../core-module/api-service/facility/smart/smart.service';
import {Result} from '../../../entity/result';
import {TemplateSearchComponent} from '../template-search/template-search.component';
import {NzI18nService} from 'ng-zorro-antd';
import {FacilityLanguageInterface} from '../../../../../assets/i18n/facility/facility.language.interface';

@Component({
  selector: 'app-box-template',
  templateUrl: './box-template.component.html',
  styleUrls: ['./box-template.component.scss']
})
export class BoxTemplateComponent extends BasicTemplate implements OnInit {
  public language: FacilityLanguageInterface;
  @ViewChild('templateSearch') templateSearch: TemplateSearchComponent;
  @Input() TemplateReqDto;
  @Input() modifyTemplate;
  @Input() modifyShow;
  // 模板保存弹框
  saveShow = false;
  // 箱模板信息
  boxInfo: Template = {
    name: '',
    col: 2,
    row: 2,
    templateType: TemplateType.BOX,
    reversible: Reversible.SINGLE,
    childTemplateId: ''
  };

  // 箱模板大小
  size = {
    width: 300,
    height: 300
  };
  // 查询模板类型
  templateType = TemplateType.FRAME;
  // 选择的盘模板
  frameTemplate: Template;
  // 盘横竖状态行
  putStateRow;
  // 盘横竖状态列
  putStateCol;

  constructor(private $nzI18n: NzI18nService,
              private $drawTemplateService: DrawTemplateService,
              private $message: FiLinkModalService,
              private $smartService: SmartService) {
    super();
  }

  /**
   * 选择模板信息
   * param event
   */
  selectTemplate(event) {
    this.initGraph('box-template');
    this.graph.clear();
    // 横向
    if (event.putState === BoardPutState.LAY) {
      this.putStateRow = event.childTemplateList[0].row;
      this.putStateCol = event.childTemplateList[0].col;
    }
    // 纵向
    if (event.putState === BoardPutState.STELLEN) {
      this.putStateRow = event.childTemplateList[0].col;
      this.putStateCol = event.childTemplateList[0].row;
    }
    this.frameTemplate = event;
  }

  ngOnInit() {
    this.language = this.$nzI18n.getLocaleData('facility');
  }

  /**
   * 保存刷新
   */
  boxSearch() {
    this.templateSearch.search();
  }

  /**
   * 判断当前页面是修改还是新增
   */
  modifyBox(data) {
    if (data) {
      this.boxInfo.name = data.name;
      this.boxInfo.col = data.col;
      this.boxInfo.row = data.row;
      this.boxInfo.templateType = data.templateType;
      this.boxInfo.reversible = data.reversible;
        this.boxInfo.childTemplateId = data.childTemplateId;
      this.boxInfo.id = data.id;
      this.frameTemplate = data.childTemplateList[0];
      this.preview();
    } else {
      this.boxInfo = {
        name: '',
        col: 2,
        row: 2,
        templateType: TemplateType.BOX,
        reversible: Reversible.SINGLE,
        childTemplateId: ''
      };
    }
  }

  /**
   * 预览按钮是否可点击
   */
  canPreview(type) {
    if (type === 'save') {
      return this.boxInfo.name && this.boxInfo.col > 0 && this.boxInfo.row > 0 && this.frameTemplate;
    } else {
      return this.boxInfo.col > 0 && this.boxInfo.row > 0 && this.frameTemplate;
    }
  }

  /**
   * 预览
   */
  preview() {
    const boardNum = this.frameTemplate.childTemplateList[0];
    const frameNum = this.frameTemplate.col * this.frameTemplate.row;
    const boxNum = this.boxInfo.reversible * this.boxInfo.col * this.boxInfo.row;
    const templateNum = boardNum.reversible * boardNum.col * boardNum.row * frameNum * boxNum;
    // 判断端口数是否大于最大纤芯数
    if (templateNum > MaxNum.Maximum) {
      this.$message.warning(this.language.templateErrorMessage);
    } else {
      this.initGraph('box-template');
      this.graph.clear();
      // 线条禁止拖动
      this.graph.isSelectable = (item) => {
        return item.get('type') === 'cabinet';
      };
      for (let k = 1; k <= this.boxInfo.reversible; k++) {
        const drawInfo: DrawInfo = {
          startX: k === 1 ? 0 : this.boxInfo.col * this.size.width + this.spaceBetween,
          startY: 0,
          row: this.boxInfo.row,
          col: this.boxInfo.col,
          width: this.size.width,
          height: this.size.height,
          position: this.TemplateReqDto.boxCodeRule,
          direction: this.TemplateReqDto.boxTrend
        };
        // 首先绘制箱
        this.$drawTemplateService.drawTemplate(drawInfo, this.graph, TemplateColor.theTemplate);

        // 每个箱里面绘制框
        for (let i = 0; i < this.boxInfo.col; i++) {
          for (let j = 0; j < this.boxInfo.row; j++) {
            const drawFrame = {
              startX: drawInfo.startX + 10 + i * this.size.width,
              startY: drawInfo.startY + 10 + j * this.size.height,
              row: this.frameTemplate.row,
              col: this.frameTemplate.col,
              width: (this.size.width - 20) / this.frameTemplate.col,
              height: (this.size.height - 20) / this.frameTemplate.row,
              position: this.TemplateReqDto.boxCodeRule,
              direction: this.TemplateReqDto.boxTrend
            };
            this.$drawTemplateService.drawTemplate(drawFrame, this.graph);
            // 每个框里面绘制盘
            for (let n = 0; n < this.frameTemplate.col; n++) {
              for (let m = 0; m < this.frameTemplate.row; m++) {
                const size = {
                  width: drawFrame.width - 20,
                  height: drawFrame.height - 20,
                };
                /*const boardTemplate = this.frameTemplate.childTemplateList[n * m + m];*/
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

        // 绘制每个箱上面的AB二字
        if (k === 2) {
          const width = this.size.width;
          const col = this.boxInfo.col;
          this.drawReversible(width, col, this.graph);
        }
      }
    }
  }

  /**
   * 修改箱模板
   */
  handleModify() {
    const data = JSON.parse(JSON.stringify(this.boxInfo));
    data['childTemplateId'] = (new Array(this.boxInfo.col * this.boxInfo.row)).fill(this.frameTemplate.id).join(',');
    this.loading = true;
    this.$smartService.updateTemplate(data).subscribe((result: Result) => {
      this.loading = false;
      if (result.code === 0) {
        this.$message.info(result.msg);
      } else {
        this.$message.warning(result.msg);
      }
    }, () => {
      this.loading = false;
    });
  }

  /**
   * 保存箱模板
   */
  handleSave() {
    this.saveShow = true;
  }


  /**
   * 模态框取消
   */
  saveCancel() {
    this.saveShow = false;
  }

  /**
   * 模态框确认
   */
  saveOk() {
    const boardNum = this.frameTemplate.childTemplateList[0];
    const frameNum = this.frameTemplate.col * this.frameTemplate.row;
    const boxNum = this.boxInfo.reversible * this.boxInfo.col * this.boxInfo.row;
    const templateNum = boardNum.reversible * boardNum.col * boardNum.row * frameNum * boxNum;
    // 判断端口数是否大于最大纤芯数
    if (templateNum > MaxNum.Maximum) {
      this.$message.warning(this.language.templateErrorMessage);
    } else {
      const data = JSON.parse(JSON.stringify(this.boxInfo));
      data['childTemplateId'] = (new Array(this.boxInfo.col * this.boxInfo.row)).fill(this.frameTemplate.id).join(',');
      this.loading = true;
      this.$smartService.createTemplate(data).subscribe((result: Result) => {
        this.loading = false;
        if (result.code === 0) {
          this.$message.info(result.msg);
        } else {
          this.$message.warning(result.msg);
        }
      }, () => {
        this.loading = false;
      });
    }
    this.saveShow = false;
  }

}
