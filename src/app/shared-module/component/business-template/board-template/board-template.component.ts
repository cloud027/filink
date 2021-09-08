import {Component, Input, OnInit} from '@angular/core';
import {Reversible, Template, TemplateType} from '../../../entity/template';
import {DrawInfo} from '../template-item.enum';
import {DrawTemplateService} from '../draw-template.service';
import {BasicTemplate} from '../basic-template';
import {SmartService} from '../../../../core-module/api-service/facility/smart/smart.service';
import {Result} from '../../../entity/result';
import {FiLinkModalService} from '../../../service/filink-modal/filink-modal.service';
import {FacilityLanguageInterface} from '../../../../../assets/i18n/facility/facility.language.interface';
import {NzI18nService} from 'ng-zorro-antd';

@Component({
  selector: 'app-board-template',
  templateUrl: './board-template.component.html',
  styleUrls: ['./board-template.component.scss']
})
export class BoardTemplateComponent extends BasicTemplate implements OnInit {
  public language: FacilityLanguageInterface;
  @Input() TemplateReqDto;
  @Input() modifyTemplate;
  // 模板保存弹框
  saveShow = false;
  // 自定义board的宽高
  size = {
    width: 50,
    height: 50
  };
  // 盘模板信息
  boardInfo: Template = {
    name: '',
    col: 5,
    row: 3,
    reversible: Reversible.SINGLE,
    templateType: TemplateType.BOARD
  };


  constructor(private $nzI18n: NzI18nService,
              private $drawTemplateService: DrawTemplateService,
              private $message: FiLinkModalService,
              private $smartService: SmartService) {
    super();
  }

  ngOnInit() {
    this.language = this.$nzI18n.getLocaleData('facility');
  }

  /**
   * 模板预览
   */
  preview() {
    this.initGraph('board-template');
    this.graph.clear();
    // 线条禁止拖动
    this.graph.isSelectable = (item) => {
      return item.get('type') === 'cabinet';
    };
    if (this.boardInfo.reversible === Reversible.SINGLE) {
      const drawInfo: DrawInfo = {
        startX: 0,
        startY: 0,
        row: this.boardInfo.row,
        col: this.boardInfo.col,
        width: this.size.width,
        height: this.size.height,
        position: this.TemplateReqDto.discCodeRule,
        direction: this.TemplateReqDto.discTrend
      };
      this.$drawTemplateService.drawTemplate(drawInfo, this.graph);
    } else {
      const drawInfoA: DrawInfo = {
        startX: 0,
        startY: 0,
        row: this.boardInfo.row,
        col: this.boardInfo.col,
        width: this.size.width,
        height: this.size.height,
        position: this.TemplateReqDto.discCodeRule,
        direction: this.TemplateReqDto.discTrend
      };
      const drawInfoB: DrawInfo = {
        startX: this.boardInfo.col * this.size.width + this.spaceBetween,
        startY: 0,
        row: this.boardInfo.row,
        col: this.boardInfo.col,
        width: this.size.width,
        height: this.size.height,
        position: this.TemplateReqDto.discCodeRule,
        direction: this.TemplateReqDto.discTrend
      };
      // 绘制AB面
      this.$drawTemplateService.drawTemplate(drawInfoA, this.graph);
      this.$drawTemplateService.drawTemplate(drawInfoB, this.graph);
      this.drawReversible();
    }
  }

  /**
   * 绘制AB面
   */
  drawReversible() {
    const width = this.size.width;
    const col = this.boardInfo.col;
    const reversibleA = this.graph.createNode('A 面', width * col / 2, this.coordinate.y / -2);
    reversibleA.image = null;
    reversibleA.setStyle(this.Q.Styles.LABEL_FONT_SIZE, 12);
    const reversibleB = this.graph.createNode('B 面', width * col * 1.5 + this.spaceBetween, this.coordinate.y / -2);
    reversibleB.image = null;
    reversibleB.setStyle(this.Q.Styles.LABEL_FONT_SIZE, 12);
  }

  /**
   * 判断是否可以预览
   */
  canPreview(type) {
    if (type === 'save') {
      return this.boardInfo.name && this.boardInfo.row > 0 && this.boardInfo.col > 0;
    } else {
      return this.boardInfo.row > 0 && this.boardInfo.col > 0;
    }
  }


  /**
   * 模板保存
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
    this.loading = true;
    this.$smartService.createTemplate(this.boardInfo).subscribe((result: Result) => {
      this.loading = false;
      if (result.code === 0) {
        this.$message.info(result.msg);
      } else {
        this.$message.warning(result.msg);
      }
    }, () => {
      this.loading = false;
    });
    this.saveShow = false;
  }

}
