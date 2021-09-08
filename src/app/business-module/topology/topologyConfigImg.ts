export enum TopologyConfigImg {
  allfacillties = 'assets/img/topology/icon_allfacilities.png', // 所有设施
  distributionFrame = 'assets/img/topology/icon_distributionFrame.png', // 配线架
  junctionBox = 'assets/img/topology/icon_JunctionBox.png', // 接线盒
  opticalIntersection = 'assets/img/topology/icon_opticalIntersection.png', // 光交箱
  splitting = 'assets/img/topology/icon_Splitting.png',
  manwell = 'assets/img/topology/icon_Manwell.png',  // 人井
}
export enum TopologyDevice {
  Optical_Box = '001', // 光交箱(有锁)(有智能标签)
  Well = '030', // 人井(有锁)
  Distribution_Frame = '060', // 配线架(有智能标签)
  Junction_Box = '090', // 接头盒(有智能标签)
  // Optical_Cable = '120', // 光缆段
   Splitting_Box = '150', // 分纤箱
  // Parts = '180' ,// 配件
  OUTDOOR_CABINET = '210' // 室外柜 (有锁)
}
