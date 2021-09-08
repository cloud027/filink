export class MapConfig {
  private _mapId: string;  // 地图id
  private _mapType: string;   // 地图类型  baidu为百度地图 google为谷歌地图
  private _defaultIconSize: string;  // 图标大小
  private _mapStyle?: any;  // 地图自定义样式
  constructor(mapId?, mapType?, iconSize?, mapStyle?) {
    this._mapId = mapId;
    this._mapType = mapType;
    this._defaultIconSize = iconSize;
    this._mapStyle = mapStyle;
  }

  set mapId(value) {
    this._mapId = value;
  }

  get mapId() {
    return this._mapId;
  }

  set mapType(value) {
    this._mapType = value;
  }

  get mapType() {
    return this._mapType;
  }

  set defaultIconSize(value) {
    this._defaultIconSize = value;
  }

  get defaultIconSize() {
    return this._defaultIconSize;
  }

  set mapStyle(value) {
    this._mapStyle = value;
  }

  get mapStyle() {
    return this._mapStyle;
  }
}
