import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ResultModel} from '../../../shared-module/model/result.model';
import {STATISTICAL_REQUEST_URL} from './statistical-request-url';

@Injectable()
export class StatisticalForCommonService {
  constructor(private $http: HttpClient) {
  }

  public getCableSegmentList(body): Observable<ResultModel<any>> {
    return this.$http.post<ResultModel<any>>(STATISTICAL_REQUEST_URL.opticCableSectionById, body);
  }
}
