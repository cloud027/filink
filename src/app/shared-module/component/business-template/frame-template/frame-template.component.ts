import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {BoardPutState, Template, TemplateType, TemplateColor, MaxNum} from '../../../entity/template';
import {BasicTemplate} from '../basic-template';
import {DrawInfo} from '../template-item.enum';
import {DrawTemplateService} from '../draw-template.service';
import {Result} from '../../../entity/result';
import {FiLinkModalService} from '../../../service/filink-modal/filink-modal.service';
import {SmartService} from '../../../../core-module/api-service/facility/smart/smart.service';
import {TemplateSearchComponent} from '../template-search/template-search.component';
import {NzI18nService} from 'ng-zorro-antd';
import {FacilityLanguageInterface} from '../../../../../assets/i18n/facility/facility.language.interface';

@Component({
  selector: 'app-frame-template',
  templateUrl: './frame-template.component.html',
  styleUrls: ['./frame-template.component.scss']
})
export class FrameTemplateComponent extends BasicTemplate implements OnInit {
  public language: FacilityLanguageInterface;
  @ViewChild('templateSearch') templateSearch: TemplateSearchComponent;
  @Input() TemplateReqDto;
  // 框模板信息
  frameInfo: Template = {
    name: '',
    col: 3,
    row: 3,
    templateType: TemplateType.FRAME,
    childTemplateId: '',
    putState: BoardPutState.LAY
  };
  // 框模板大小
  size = {
    width: 200,
    height: 200
  };
  // 选择的盘模板
  boardTemplate;
  // 查询模板类型
  templateType = TemplateType.BOARD;
  // 模板保存弹框
  saveShow = false;

  // 当前横竖状态
  putstate;


  constructor(private $nzI18n: NzI18nService,
              private $drawTemplateService: DrawTemplateService,
              private $message: FiLinkModalService,
              private $smartService: SmartService) {
    super();
  }

  ngOnInit() {
    this.language = this.$nzI18n.getLocaleData('facility');
  }

  frameSearch() {
    this.templateSearch.search();
  }

  /**
   * 选择模板信息
   * param event
   */
  selectTemplate(event) {
    this.initGraph('frame-template');
    this.graph.clear();
    this.boardTemplate = event;
  }

  /**
   * 监听横纵向切换
   */
  selectState(event) {
    this.putstate = event;
  }

  /**
   * 判断是否可以预览
   */
  canPreview(type) {
    if (type === 'save') {
      return this.frameInfo.name && this.frameInfo.row > 0 && this.frameInfo.col > 0 && this.boardTemplate;
    }
    return this.frameInfo.row > 0 && this.frameInfo.col > 0 && this.boardTemplate;
  }

  /**
   * 预览
   */
  preview() {
    const boardNum = this.boardTemplate.reversible * this.boardTemplate.col * this.boardTemplate.row;
    const frameNum = this.frameInfo.col * this.frameInfo.row;
    const templateNum = boardNum * frameNum;
    // 判断端口数是否大于最大纤芯数
    if (templateNum > MaxNum.Maximum) {
      this.$message.warning(this.language.templateErrorMessage);
    } else {
      // 横向
      let row = this.boardTemplate.row;
      let col = this.boardTemplate.col;
      // 纵向
      if (this.putstate === BoardPutState.STELLEN) {
        row = this.boardTemplate.col;
        col = this.boardTemplate.row;
      }
      this.initGraph('frame-template');
      this.graph.clear();
      // 线条禁止拖动
      this.graph.isSelectable = (item) => {
        return item.get('type') === 'cabinet';
      };
      const drawInfo: DrawInfo = {
        startX: 0,
        startY: 0,
        row: this.frameInfo.row,
        col: this.frameInfo.col,
        width: this.size.width,
        height: this.size.height,
        position: this.TemplateReqDto.frameCodeRule,
        direction: this.TemplateReqDto.frameTrend
      };
      // 首先绘制框
      this.$drawTemplateService.drawTemplate(drawInfo, this.graph, TemplateColor.theTemplate);
      // 每个框里面绘制盘
      for (let i = 0; i < this.frameInfo.col; i++) {
        for (let j = 0; j < this.frameInfo.row; j++) {
          const drawBoard = {
            startX: 10 + i * this.size.width,
            startY: 10 + j * this.size.height,
            row: row,
            col: col,
            width: (this.size.width - 20) / col,
            height: (this.size.height - 20) / row,
            position: this.TemplateReqDto.frameCodeRule,
            direction: this.TemplateReqDto.frameTrend
          };
          this.$drawTemplateService.drawTemplate(drawBoard, this.graph);
        }
      }
    }
  }

  /**
   * 框模板保存
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
   * 框模板确认
   */
  saveOk() {
    const boardNum = this.boardTemplate.reversible * this.boardTemplate.col * this.boardTemplate.row;
    const frameNum = this.frameInfo.col * this.frameInfo.row;
    const templateNum = boardNum * frameNum;
    // 判断端口数是否大于最大纤芯数
    if (templateNum > MaxNum.Maximum) {
      this.$message.warning(this.language.templateErrorMessage);
    } else {
      const data = JSON.parse(JSON.stringify(this.frameInfo));
      data['childTemplateId'] = (new Array(this.frameInfo.col * this.frameInfo.row)).fill(this.boardTemplate.id).join(',');
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
