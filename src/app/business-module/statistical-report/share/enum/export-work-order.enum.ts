export enum ExportWorkOrderEnum {
  'otherCount' = '0',
  'repairCount' = '1',
  'liveCount' = '2'
}

export enum ExportWorkOrderStatusEnum {
  'assignedCount' = 'assigned',
  'completedCount' = 'completed',
  'pendingCount' = 'pending',
  'processingCount' = 'processing',
  'singleBackCount' = 'singleBack',
  'turnProcessCount' = 'turnProcess',
}

export enum ExportWorkOrderFailureEnum {
  'otherCount' = '0',
  'failureCount' = '1',
  'rodeWorkCount' = '2',
  'stealWearCount' = '3',
  'clearFailureCount' = '4'
}

export enum ExportWorkOrderDeviceTypeEnum {
  'opticalBoxCount' = 'D001',
  'wisdomCount' = 'D002',
  // 配电箱
  'distributionPanelCount' = 'D003',
  'wellCount' = 'D004',
  'outdoorCabinetCount' = 'D005',
  'distributionFrameCount' = 'D006',
  'junctionBoxCount' = 'D007'
}

export enum ExportWorkOrderPercentEnum {
  'areaProcCount' = 'count',
  'areaProcPercent' = 'percent'
}
