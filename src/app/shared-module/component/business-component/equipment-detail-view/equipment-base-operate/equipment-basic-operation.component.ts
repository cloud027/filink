import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import * as _ from 'lodash';
import {NzI18nService, NzModalService, UploadFile} from 'ng-zorro-antd';
import {BusinessFacilityService} from '../../../../service/business-facility/business-facility.service';
import {FacilityForCommonService} from '../../../../../core-module/api-service/facility';
import {FiLinkModalService} from '../../../../service/filink-modal/filink-modal.service';
import {FacilityLanguageInterface} from '../../../../../../assets/i18n/facility/facility.language.interface';
import {ResultModel} from '../../../../model/result.model';
import {ResultCodeEnum} from '../../../../enum/result-code.enum';
import {CommonLanguageInterface} from '../../../../../../assets/i18n/common/common.language.interface';
import {LanguageEnum} from '../../../../enum/language.enum';
import {PicResourceEnum} from '../../../../../core-module/enum/picture/pic-resource.enum';
import {CompressUtil} from '../../../../util/compress-util';
import {BINARY_SYSTEM_CONST, FILE_TYPE_CONST, IMG_SIZE_CONST} from '../../../../../core-module/const/common.const';
import {ObjectTypeEnum} from '../../../../../core-module/enum/facility/object-type.enum';
import {SessionUtil} from '../../../../util/session-util';
import {EquipmentStatusEnum, EquipmentTypeEnum} from '../../../../../core-module/enum/equipment/equipment.enum';
import {ConfigDetailRequestModel} from '../../../../../core-module/model/equipment/config-detail-request.model';
import {AssetManagementLanguageInterface} from '../../../../../../assets/i18n/asset-manage/asset-management.language.interface';
import {EquipmentGetConfigCommon} from './equipment-get-config-common';

/**
 * 设施详情操作按钮组件
 * created by PoHe
 */
@Component({
  selector: 'app-equipment-basic-operation',
  templateUrl: './equipment-basic-operation.component.html',
  styleUrls: ['./equipment-basic-operation.component.scss']
})
export class EquipmentBasicOperationComponent implements OnInit {
  //  入参设备id
  @Input()
  public equipmentId: string = '';
  // 设备类型
  @Input()
  public equipmentType: EquipmentTypeEnum;
  // 设备型号
  @Input()
  public equipmentModel: string = '';
  // 设备名称
  @Input()
  public equipmentName: string = '';
  // 设备状态
  @Input()
  public equipmentStatus: EquipmentStatusEnum;
  // 是否为无缘锁
  @Input()
  isPassiveLock: boolean = false;
  // 设备管理国际化
  public language: FacilityLanguageInterface;
  // 公共国际化
  public commonLanguage: CommonLanguageInterface;
  // 是否显示删除按钮
  public canDelete: boolean = true;
  // 设备配置弹框是否显示
  public equipmentConfigShow: boolean = false;
  // 是否能上传图片操作
  public canUpload: boolean = true;
  // 提交操作时按钮置灰
  public buttonDisabled: boolean = false;
  // 设备配置内容
  public equipmentConfigContent: Array<any>;
  // 设备配置提交是否可以操作
  public configOkDisabled: boolean = true;
  // 页面是否loading
  public loading: boolean = false;
  // 设备配置详情参数
  public equipmentConfigParam: ConfigDetailRequestModel = new ConfigDetailRequestModel();
  // 是否展示网关配置按钮
  public isShowGatewayConfig: boolean = false;
  // 设备id
  public configEquipmentId: string;
  // 资产公共国际化
  public assetLanguage: AssetManagementLanguageInterface;
  // 非网关配置时专用字段
  public deviceConfiguration: boolean = true;

  /**
   * 构造器
   */
  constructor(
    private $nzI18n: NzI18nService,
    private $message: FiLinkModalService,
    private $http: HttpClient,
    private $router: Router,
    private $modalService: NzModalService,
    private $active: ActivatedRoute,
    private $facilityForCommonService: FacilityForCommonService,
    private $businessFacilityService: BusinessFacilityService,
    private $facilityCommonService: FacilityForCommonService,
  ) {
  }

  /**
   * 组件初始化
   */
  public ngOnInit(): void {
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.facility);
    this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
    this.assetLanguage = this.$nzI18n.getLocaleData(LanguageEnum.assets);
    this.canDelete = [EquipmentStatusEnum.unSet, EquipmentStatusEnum.dismantled].includes(this.equipmentStatus);
    // 判断是否有上传图片的权限
    this.canUpload = !SessionUtil.checkHasRole('03-8-3-2');
    // 网关详情多一个网关配置的按钮
    if (this.equipmentType === EquipmentTypeEnum.gateway) {
      this.isShowGatewayConfig = true;
    }
  }

  /**
   * 点击编辑设施按钮
   */
  public onClickEditButton(): void {
    this.$router.navigate(['business/facility/equipment-detail/update'],
      {queryParams: {equipmentId: this.equipmentId}}).then();
  }

  /**
   * 配置设备
   */
  public onClickEquipmentConfig(): void {
    const equipmentModel = {equipmentId: this.equipmentId};
    this.getPramsConfig(equipmentModel);
  }

  /**
   * 网关拓扑配置
   */
  public onClickGatewayConfig(): void {
    this.$router.navigate(['business/facility/gateway-config'],
      {
        queryParams: {
          id: this.equipmentId,
          name: this.equipmentName,
          model: this.equipmentModel
        }
      }).then();
  }

  /**
   * 获取参数配置项内容
   */
  public getPramsConfig(equipmentModel: { equipmentId: string } | { equipmentModel: string }): void {
    this.$facilityForCommonService.getEquipmentConfigByModel(equipmentModel).subscribe((result: ResultModel<any>) => {
      if (result.code === ResultCodeEnum.success) {
        this.equipmentConfigContent = [];
        const temp = result.data || [];
        // 无设备配置项，不请求详情接口
        if (!_.isEmpty(temp)) {
          this.configEquipmentId = this.equipmentId;
          // 获取配置详情参数
          this.equipmentConfigParam = {
            equipmentId: this.equipmentId,
            equipmentType: this.equipmentType
          };
          if (this.equipmentType === EquipmentTypeEnum.gateway) {
            EquipmentGetConfigCommon.queryGatewayPropertyConfig(this.equipmentConfigParam.equipmentId, temp, this);
            this.deviceConfiguration = false;
          } else {
            this.deviceConfiguration = true;
            this.equipmentConfigContent = temp;
            this.equipmentConfigShow = true;
          }
        } else {
          this.$message.info(this.assetLanguage.noEquipmentConfigTip);
        }
        // 初始默认按钮不能点击
        this.configOkDisabled = true;
      } else {
        this.$message.error(result.msg);
      }
    });
  }

  /**
   * 打开设备配置弹窗 (不能删 有用到）
   */
  public openEquipmentConfigShow() {
    // 打开设备配置弹框
    this.configOkDisabled = true;
    this.equipmentConfigShow = true;
  }

  /**
   * 上传之前判断文件格式
   */
  beforeUpload = (file: UploadFile): boolean => {
    if (!FILE_TYPE_CONST.includes(file.type)) {
      this.$message.error(this.language.fileFormatError);
      return false;
    }
  };
  /**
   * 上传文件
   */
  uploadImg = (item: UploadFile) => {
    if (!item) {
      return;
    }
    this.loading = true;
    const formData = new FormData();
    formData.append('resource', PicResourceEnum.realPic);
    formData.append('objectId', this.equipmentId);
    formData.append('objectType', ObjectTypeEnum.equipment);
    if (item.file.size / (BINARY_SYSTEM_CONST * BINARY_SYSTEM_CONST) > IMG_SIZE_CONST) {
      CompressUtil.compressImg(item.file as File).then((res: File) => {
        formData.append('pic', res, res.name);
        this.handelUploadImg(formData);
      });
    } else {
      formData.append('pic', item.file);
      this.handelUploadImg(formData);
    }
  };

  /**
   * 点击删除按钮
   */
  public onClickDelete(): void {
    this.$modalService.confirm({
      nzTitle: this.language.prompt,
      nzContent: `<span>${this.language.confirmDeleteEquipment}</span>`,
      nzOkText: this.commonLanguage.cancel,
      nzOkType: 'danger',
      nzMaskClosable: false,
      nzOnOk: () => {
      },
      nzCancelText: this.commonLanguage.confirm,
      nzOnCancel: () => {
        this.loading = true;
        this.$facilityForCommonService.deleteEquipmentByIds([this.equipmentId]).subscribe(
          (res: ResultModel<string>) => {
            if (res.code === ResultCodeEnum.success) {
              this.$message.success(this.language.deleteEquipmentSuccess);
              this.loading = false;
              window.history.go(-1);
            } else {
              this.$message.error(res.msg);
              this.loading = false;
            }
          }, () => {
            this.loading = false;
          });
      }
    });
  }

  /**
   * 执行上传
   */
  private handelUploadImg(formData: FormData) {
    this.buttonDisabled = true;
    this.$facilityForCommonService.uploadImg(formData).subscribe((result: ResultModel<string>) => {
      if (result.code === ResultCodeEnum.success) {
        this.$message.success(this.language.uploadImgSuccess);
        this.buttonDisabled = false;
        this.loading = false;
        this.$businessFacilityService.eventEmit.emit();
      } else {
        this.loading = false;
        this.$message.error(result.msg);
        this.buttonDisabled = false;
      }
    }, () => {
      this.loading = false;
      this.buttonDisabled = false;
    });
  }
}
