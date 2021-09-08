import {PRODUCT_SERVER} from '../api-common.config';

export const PlanProjectRequestUrlConst = {
  // 查询项目列表(分页)
  queryProjectInfoListByPage: `${PRODUCT_SERVER}/projectInfo/queryProjectInfoListByPage`,
  // 根据智慧名称查询智慧杆
  queryPoleByName: `${PRODUCT_SERVER}/planData/queryPoleByName`,
  // 查询规划列表
  selectPlanList: `${PRODUCT_SERVER}/planInfo/selectPlanList`,

  // 查询所有的规划点
  getPlanPolymerizationPoint: `${PRODUCT_SERVER}/planData/getPlanPolymerizationPoint`,

  // 根据区域id查询规划下设施
  getPlanNonPolymerizationPoint: `${PRODUCT_SERVER}/planData/getPlanNonPolymerizationPoint`,

  // 查询中心点
  getPlanPolymerizationPointCenter: `${PRODUCT_SERVER}/planData/queryPlanPolymerizationPointCenter`,

  // 查询规划下未分配项目的智慧杆点位
  selectPointByPlanIdAndNoProject: `${PRODUCT_SERVER}/planInfo/selectPointByPlanIdAndNoProject`,
};
