/**
 * Created by xiaoconghu on 2020/6/5.
 */

export interface MapBasePointInterface {
    /**
     * 生成point
     * param lng
     * param lat
     * returns {any}
     */
    createPoint(lng, lat): any;
}
