import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TemplateType} from '../../../entity/template';
import {SmartService} from '../../../../core-module/api-service/facility/smart/smart.service';
import {Result} from '../../../entity/result';
import {BusinessTemplateService} from '../business-template.service';
import {FiLinkModalService} from '../../../service/filink-modal/filink-modal.service';
import {FacilityLanguageInterface} from '../../../../../assets/i18n/facility/facility.language.interface';
import {NzI18nService} from 'ng-zorro-antd';

@Component({
  selector: 'app-template-search',
  templateUrl: './template-search.component.html',
  styleUrls: ['./template-search.component.scss']
})
export class TemplateSearchComponent implements OnInit {
  public language: FacilityLanguageInterface;
  @Output() chooseTemplate = new EventEmitter();
  @Input() modifyShow;
  @Input() searchPlaceholder = '';
  @Input() templateType = TemplateType.BOX;
  // 搜索框模板名称
  templateName: string = '';
  // 显示的模板列表
  templateList = [];
  // 选择的模板信息
  selectedTemplate = {id: ''};
  // 修改模板
  visible;
  // 修改数据
  modifyTemplate;
  // 删除模板弹框
  isVisible;
  // 删除数据
  dataDelete;

  constructor(private $nzI18n: NzI18nService,
              private $smartService: SmartService,
              private $message: FiLinkModalService,
              private $businessTemplateService: BusinessTemplateService) {
  }

  ngOnInit() {
    this.language = this.$nzI18n.getLocaleData('facility');
    this.search();
  }


  /**
   * 选择某个模板
   */
  selectTemplate(item) {
    this.selectedTemplate = item;
    this.chooseTemplate.emit(item);
  }

  /**
   * 搜索
   */
  search() {
    const searchQuery = {
      templateType: this.templateType
    };
    if (this.templateName) {
      searchQuery['name'] = this.templateName;
    }
    this.$smartService.queryAllTemplate(searchQuery).subscribe((result: Result) => {
      if (result.code === 0) {
        this.templateList = result.data;
      }
    });
  }

  /**
   * 修改
   */
  templateModify(item) {
    this.selectedTemplate = item;
    this.$businessTemplateService.eventEmit.emit({modifyShow: true, modifyTemplate: item});
    // this.modifyTemplate.emit(item);
  }

  /**
   * 删除
   */
  templateDelete(item) {
    this.isVisible = true;
    this.dataDelete = item;
  }

  /**
   * 删除模板弹框关闭按钮
   */
  handleCancel() {
    this.isVisible = false;
  }

  /**
   * 删除模板弹框确认按钮
   */
  handleOk() {
    const data = {
      id: this.dataDelete.id,
      templateType: this.dataDelete.templateType
    };
    this.$smartService.deleteTemplate(data).subscribe((result: Result) => {
      if (result.code === 0) {
        this.$message.info(result.msg);
        this.search();
        this.isVisible = false;
      } else {
        this.$message.warning(result.msg);
      }
    });
  }
}
