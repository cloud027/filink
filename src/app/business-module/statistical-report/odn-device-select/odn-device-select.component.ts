import {Component, Input, OnInit} from '@angular/core';
import {Option} from '../../../shared-module/component/check-select-input/check-select-input.component';
import {CommonUtil} from '../../../shared-module/util/common-util';
import * as $ from 'jquery';
import {NzI18nService} from 'ng-zorro-antd';
import {FiLinkModalService} from '../../../shared-module/service/filink-modal/filink-modal.service';

/**
 * 设施全选modal框
 */
@Component({
  selector: 'app-odn-device-select',
  templateUrl: './odn-device-select.component.html',
  styleUrls: ['./odn-device-select.component.scss']
})
export class OdnDeviceSelectComponent implements OnInit {
  // input数据
  _checkedStr = '';
  // 是否全选
  checkAllStatus = false;
  // 选择的数据list
  checkedList: Array<Option> = [];
  // 显示隐藏
  isVisible = false;
  // 默认值
  defaultCheckList = [];
  // 搜索下拉框数据
  selectInfo = {
    data: [],
    label: 'name',
    value: 'id'
  };
  // 搜索值
  searchValue;
  language;
  @Input() areaName;
  @Input() checkList: Array<Option> = [{
    label: '光交箱',
    value: '001',
  }, {
    label: '人井',
    value: '030',
  }, {
    label: '配线架',
    value: '060',
  }, {
    label: '接头盒',
    value: '090',
  }, {
    label: '分纤箱',
    value: '150',
  }];
  @Input() placeholder;

  constructor(private $nzi18n: NzI18nService,
              private $message: FiLinkModalService
  ) {
  }

  ngOnInit() {
    this.language = this.$nzi18n.getLocale();
  }

  onModelChange: Function = () => {
  }

  // get checkedStr(): any {
  //   return this._checkedStr;
  // }
  //
  // set checkedStr(v: any) {
  //   this._checkedStr = v;
  //   this.onModelChange(this.checkedList);
  // }

  allChecked(event) {
    this.checkList.filter(item => !item.isDisable).forEach(item => {
      item.checked = event;
    });
  }

  checkItem(obj?: Option) {
    if (obj) {
      this.checkedList = this.checkList.map(item => {
        if (item.value === obj.value) {
          item.checked = !obj.checked;
        }
        return item;
      });
    }
    if (this.checkList.filter(item => !item.isDisable).length !== 0) {
      this.checkAllStatus = this.checkList.filter(item => !item.isDisable).every(item => item.checked);
    } else {
      this.checkAllStatus = false;
    }
  }

  handleOk() {
    this.checkedList = this.checkList.filter(item => item.checked);
    const arr = this.checkedList.map(item => item.label);
    this._checkedStr = arr.join('，');
    this.isVisible = false;
    $('#nzCard')[0].scrollTop = 0;
    this.searchValue = '';
  }


  handleCancel() {
    this.isVisible = false;
    this.checkList = CommonUtil.deepClone(this.defaultCheckList);
    $('#nzCard')[0].scrollTop = 0;
    this.searchValue = '';
  }

  clear() {
    this._checkedStr = '';
    this.searchValue = '';
    this.checkAllStatus = false;
    this.checkList.map(item => item.checked = false);
    this.checkedList = [];
    this.onModelChange(this.checkedList);
  }

  showSelect() {
    if (this.areaName) {
      this.isVisible = true;
      this.defaultCheckList = CommonUtil.deepClone(this.checkList);
      this.checkAllStatus = this.checkList.every(item => item.checked);
    } else {
      this.$message.warning(this.language.statistical.PleaseSelectArea);
    }
  }

  deviceSelect(event) {
    console.log(event);
  }

  /**
   * 搜索组件选中某一条
   * param event id
   */
  modelChange(event) {
    let dataIndex;
    this.checkList.forEach((item, index) => {
      if (item.value === event) {
        dataIndex = index + 2;
        item['style'] = true;
      } else {
        item['style'] = false;
      }
    });
    $('#nzCard')[0].scrollTop = (dataIndex * 21) - 42;
  }

  /**
   * 搜索框input值变化
   * param event
   */
  inputChange(event) {
    this.searchValue = event;
    const node = [];
    if (event) {
      this.checkList.forEach(item => {
        if (item.label.indexOf(event) !== -1) {
          node.push(item);
        }
      });
      this.selectInfo = {
        data: node,
        label: 'label',
        value: 'value',
      };
    } else {
      this.selectInfo = {
        data: [],
        label: 'label',
        value: 'value',
      };
    }
  }
}

export interface Option {
  label: string;
  value: any;
  checked?: boolean;
}
