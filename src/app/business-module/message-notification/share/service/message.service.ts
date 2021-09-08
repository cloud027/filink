import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {QueryConditionModel} from '../../../../shared-module/model/query-condition.model';
import { Observable } from 'rxjs';
import {ResultModel} from '../../../../shared-module/model/result.model';
import {MessageDataModel} from '../model/message-data.model';
import {MESSAGE_DATA_LIST} from '../const/message-url.const';

@Injectable()
export class MessageService {
  constructor(private $http: HttpClient) {
  }

  /**
   * 查询消息
   * @param body 查询条件
   */
  queryMessage(body: QueryConditionModel): Observable<ResultModel<MessageDataModel[]>> {
    return this.$http.post<ResultModel<MessageDataModel[]>>(`${MESSAGE_DATA_LIST}`, body);
  }
}
