import {PLAN_PROJECT_SERVER} from '../../../../core-module/api-service/api-common.config';
// 服务前缀
const PREFIX = `${PLAN_PROJECT_SERVER}/planInfo`;
// 规划后台接口路径常量对象
export const PlanUrlConst = {

  // 新增规划
  insertPlan: `${PREFIX}/insertPlan`,

  // 查询规划列表
  selectPlanList: `${PREFIX}/selectPlanList`,

  // 根据规划id查询详情
  selectPlanInfo: `${PREFIX}/selectPlanInfo`,

  // 编辑规划
  updatePlan: `${PREFIX}/updatePlan`,

  // 查询规划下智慧杆
  selectPlanPointByPlanId: `${PREFIX}/selectPlanPointByPlanId`,

  // 删除规划
  deletePlan: `${PREFIX}/deletePlan`,

  // 规划列表导出
  exportPlanList: `${PREFIX}/exportPlanList`,

  // 查询智慧杆型号
  selectAllPointModel: `${PREFIX}/selectAllPointModel`,

  // 新增智慧杆(地图创建规划)
  insertPlanPoint: `${PREFIX}/insertPlanPoint`,

  // 查询智慧杆列表
  selectPlanPointList: `${PREFIX}/selectPlanPointList`,

  // 编辑智慧杆
  updatePlanPoint: `${PREFIX}/updatePlanPoint`,

  // 根据智慧杆id查智慧杆
  queryPlanPointById: `${PREFIX}/queryPlanPointById`,

  // 删除智慧杆
  deletePlanPoint: `${PREFIX}/deletePlanPoint`,

  // 智慧杆列表导出
  exportPlanPointList: `${PREFIX}/exportPlanPointList`,

  // 智慧杆列表总数小卡片
  pointCountByStatus: `${PREFIX}/pointCountByStatus`,

  // 检查规划名称重复
  checkPlanName: `${PREFIX}/checkPlanName`,

  // 检查智慧杆名称重复
  checkPlanPointName: `${PREFIX}/checkPlanPointName`,

  // 查询规划下智慧杆状态
  checkPlanPointRunnableStatus: `${PREFIX}/checkPlanPointRunnableStatus`,

  // 查询所有的规划点
  getPlanPolymerizationPoint: `${PLAN_PROJECT_SERVER}/planData/getPlanPolymerizationPoint`,

  // 根据区域id查询规划下设施
  getPlanNonPolymerizationPoint: `${PLAN_PROJECT_SERVER}/planData/getPlanNonPolymerizationPoint`,

  // 查询中心点
  getPlanPolymerizationPointCenter: `${PLAN_PROJECT_SERVER}/planData/queryPlanPolymerizationPointCenter`,

  // 根据智慧名称查询智慧杆
  queryPoleByName: `${PLAN_PROJECT_SERVER}/planData/queryPoleByName`,

  // 查询规划下未分配项目的智慧杆点位
  selectPointByPlanIdAndNoProject: `${PREFIX}/selectPointByPlanIdAndNoProject`,

  // 查询规划集合下智慧杆的中心点
  selectPlanPointCenter: `${PREFIX}/selectPlanPointCenter`,
};
