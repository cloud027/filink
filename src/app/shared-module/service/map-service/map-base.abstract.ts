/**
 * Created by xiaoconghu on 2020/6/5.
 */
import {MapBasePointInterface} from './map-base-point.interface';
import {MapBaseViewInterface} from './map-base-view.interface';

export abstract class MapBaseAbstract implements MapBasePointInterface, MapBaseViewInterface {
  mapInstance;

  abstract createBaseMap(documentId);

  getZoom() {
    return this.mapInstance.getZoom();
  }

  abstract getOffset();

  abstract setZoom(zoom);

  abstract zoomIn(level?: number);

  abstract zoomOut(level?: number);

  abstract enableScroll();

  abstract createPoint(lng, lat);

  abstract setCenterAndZoom(lng?, lat?, zoom?);

  abstract setMapTypeId(type);

  abstract loopDrawLine(data);

  destroy() {
    this.mapInstance = null;
  }

}

