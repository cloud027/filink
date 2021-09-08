import {PRODUCT_SERVER} from '../../../../core-module/api-service/api-common.config';

/**
 * 项目规划管理接口地址常量
 */
export const PlanProjectUrlConst = {

  // 校验项目名称重复性
  checkProjectName: `${PRODUCT_SERVER}/projectInfo/checkProjectName`,

  // 校验项目编号重复性
  checkProjectCode: `${PRODUCT_SERVER}/projectInfo/checkProjectCode`,

  // 新增项目
  addProjectInfo: `${PRODUCT_SERVER}/projectInfo/addProjectInfo`,

  // 更新项目基本信息
  updateProjectInfo: `${PRODUCT_SERVER}/projectInfo/updateProjectInfo`,

  // 根据项目id查询项目基本信息
  queryProjectInfoById: `${PRODUCT_SERVER}/projectInfo/queryProjectInfoById`,

  // 查询项目列表(分页)
  queryProjectInfoListByPage: `${PRODUCT_SERVER}/projectInfo/queryProjectInfoListByPage`,

  // 批量启动项目
  startProject: `${PRODUCT_SERVER}/projectInfo/startProject`,

  // 批量结束项目
  finishProject: `${PRODUCT_SERVER}/projectInfo/finishProject`,

  // 查询项目下在建状态的点位列表(分页带权限)
  queryBuildingPointByPage: `${PRODUCT_SERVER}/projectInfo/queryBuildingPointByPage`,

  // 批量删除项目
  deleteProjectInfo: `${PRODUCT_SERVER}/projectInfo/deleteProjectInfo`,

  // 查询项目列表统计卡片
  queryProjectInfoStatistics: `${PRODUCT_SERVER}/projectInfo/queryProjectInfoStatistics`,

  // 项目列表导出
  exportProjectList: `${PRODUCT_SERVER}/projectInfo/exportProjectList`,


  // 项目智慧杆
  // 项目智慧杆列表查询
  queryProjectPoleByPage: `${PRODUCT_SERVER}/projectInfo/queryProjectPoleByPage`,

  // 项目智慧杆统计卡片
  queryProjectPoleStatistics: `${PRODUCT_SERVER}/projectInfo/queryProjectPoleStatistics`,

  // 项目智慧杆列表导出
  exportProjectPointList: `${PRODUCT_SERVER}/projectInfo/exportProjectPointList`,

  // 更新项目智慧杆点位信息
  updatePointInfo: `${PRODUCT_SERVER}/projectInfo/updateProjectPointInfoById`,

  // 校验项目智慧杆点位能否修改
  checkPointCanUpdate: `${PRODUCT_SERVER}/projectInfo/checkPointCanUpdate`,

  // 更新点位状态
  updateProjectStatus: `${PRODUCT_SERVER}/projectInfo/updateProjectStatus`,

  // 更新点位id查询点位信息
  queryProjectPointById: `${PRODUCT_SERVER}/projectInfo/queryProjectPointById`,

  // 新增项目点位
  addProjectPoint: `${PRODUCT_SERVER}/projectInfo/addProjectPoint`,

  // 修改项目点位
  updateProjectPoint: `${PRODUCT_SERVER}/projectInfo/updateProjectPoint`,

  // 查询项目点位信息
  queryPointInfoByProjectId: `${PRODUCT_SERVER}/projectInfo/queryPointInfoByProjectId`,

  // 校验项目智慧杆名字重新
  checkProjectPointName: `${PRODUCT_SERVER}/projectInfo/checkProjectPointName`,
};
