import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ResultModel} from '../../../../../shared-module/model/result.model';
import {PictureServiceUrlConst} from '../../const/picture-service-url.const';
import {PictureListModel} from '../../../../../core-module/model/picture/picture-list.model';

/**
 * 图片管理接口
 */
@Injectable()
export class PictureApiService {
  constructor(private $http: HttpClient) {
  }

  /**
   * 查询图片列表
   */
  public imageListByPage(body): Observable<ResultModel<PictureListModel[]>> {
    return this.$http.post<ResultModel<PictureListModel[]>>(PictureServiceUrlConst.imageListByPage, body);
  }

  /**
   * 删除图片
   */
  public deleteImageIsDeletedByIds(body: PictureListModel[]): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(PictureServiceUrlConst.deleteImageIsDeletedByIds, body);
  }

  /**
   * 批量下载图片
   */
  public batchDownLoadImages(body): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(PictureServiceUrlConst.batchDownLoadImages, body);
  }
}
