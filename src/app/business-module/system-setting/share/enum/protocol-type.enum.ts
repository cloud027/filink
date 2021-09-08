/**
 * 通信协议类型枚举
 */
export enum ProtocolTypeEnum {
  // TCP/IP
  tcp = 'TCP',
  // NB-IoT
  nb = 'NB-IoT',
  // LoRa
  lora = 'LoRa',
  // MQTT
  mqtt = 'MQTT',
  // LwM2M
  lwm2m = 'LwM2M',
  // SOAP
  soap = 'SOAP',
  // HTTP/HTTPS
  http = 'HTTP/HTTPS',
  // RESTful
  restful = 'RESTful',
  // ONVIF
  onvif = 'HTTP/ONVIF',
  // RTSP
  rtsp = 'RTSP',
  // RTMP
  rtmp = 'RTMP',
  // UDP协议
  udp = 'UDP',
  // websocket
  websocket = 'WEBSOCKET',
  // Modbus
  modbus = 'Modbus',
  // HTTP/camera
  camera = 'HTTP/camera'
}
