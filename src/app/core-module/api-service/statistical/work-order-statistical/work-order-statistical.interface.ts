import { Observable } from 'rxjs';

export interface WorkOrderStatisticalInterface {

    querySalesOrderStatus(body): Observable<Object>;

    querySalesOrderProcessing(body): Observable<Object>;

    querySalesOrderFailure(body): Observable<Object>;

    queryWorkOrderDeviceType(body): Observable<Object>;

    querySalesOrderAreaPercent(body): Observable<Object>;

    querySalesOrderUnits(body): Observable<Object>;

    queryWorkOrderIncrement(body): Observable<Object>;

    clearBarrierDeviceTypeExport(body): Observable<Object>;

    clearBarrierStatusExport(body): Observable<Object>;

    clearBarrierProcessingExport(body): Observable<Object>;

    clearBarrierFailureExport(body): Observable<Object>;

    clearBarrierAreaPercentExport(body): Observable<Object>;

    inspectionDeviceTypeExport(body): Observable<Object>;

    inspectionStatusExport(body): Observable<Object>;

    inspectionAreaPercentExport(body): Observable<Object>;

    dismantleDeviceTypeExport(body): Observable<Object>;

    dismantleStatusExport(body): Observable<Object>;

    dismantleAreaPercentExport(body): Observable<Object>;

}


