import {USER_SERVER, DEVICE_SERVER} from '../../../../core-module/api-service/api-common.config';

const USER = `${USER_SERVER}/user`;

// 查询单个用户信息
export const QUERY_USER_INFO_BY_ID = `${USER}/queryUserInfoById/`;
// 新增单个用户
export const INSERT_USER = `${USER}/insert`;
// 修改用户
export const UPDATE_USER = `${USER}/update`;
// 删除用户
export const DELETE_USER = `${USER}/deleteByIds`;
// 用户状态修改
export const UPDATE_USER_STATUS = `${USER}/updateUserStatus`;
// 用户校验
export const VERIFY_USER_INFO = `${USER}/verifyUserInfo`;
// 用户名称校验
export const VERIFY_USER_NAME = `${USER}/checkUserName`;
// 重置密码
export const RESET_PASSWORD = `${USER}/resetPWD`;

// 查询用户默认密码
export const QUERY_PASSWORD = `${USER}/queryUserDefaultPWD`;
// 强制下线在线用户
export const OFFLINE = `${USER}/forceOffline`;

// 导入用户
export const IMPORT_USER = `${USER}/importUserInfo`;
// 导出用户
export const EXPORT_USER = `${USER}/exportUserList`;


const DEPARTMENT = `${USER_SERVER}/department`;
// 查询部门列表信息
export const QUERY_DEPT_LIST = `${DEPARTMENT}/queryDeptList`;
// 不分页查询部门信息
export const QUERY_ALL_DEPARTMENT = `${DEPARTMENT}/queryTotalDepartment`;
// 查询单个部门信息
export const QUERY_DEPT_INFO_BY_ID = `${DEPARTMENT}/queryDeptInfoById/`;
// 新增单个部门
export const INSERT_DEPT = `${DEPARTMENT}/insert`;
// 删除部门
export const DELETE_DEPT = `${DEPARTMENT}/deleteByIds`;
// 修改部门信息
export const UPDATE_DEPT = `${DEPARTMENT}/update`;
// 查询所有部门(有分页)
export const QUERY_ALL_DEPT = `${DEPARTMENT}/queryDepartmentList`;
// 单位部门校验
export const VERIFY_DEPT_INFO = `${DEPARTMENT}/verifyDeptInfo`;
// 用户列表所有部门(平级)
export const QUERY_TOTAL_DEPARTMENT = `${DEPARTMENT}/conditionDepartment`;

const ROLE = `${USER_SERVER}/role`;
// 查询角色新接口
export const QUERY_ROLES_LIST = `${ROLE}/queryRoleByField`;
// 查询单个角色信息
export const QUERY_ROLE_INFO_BY_ID = `${ROLE}/queryRoleInfoById/`;
// 查询所有角色(无分页)
export const QUERY_ALL_ROLES = `${ROLE}/queryAllRoles`;
// 新增单个角色
export const INSERT_ROLE = `${ROLE}/insert`;
// 修改角色信息
export const UPDATE_ROLE = `${ROLE}/update`;
// 删除角色
export const DELETE_ROLE = `${ROLE}/deleteByIds`;
// 角色校验
export const VERIFY_ROLE_INFO = `${ROLE}/verifyRoleInfo`;

// 权限
const PERMISSION = `${USER_SERVER}/permission`;

// 查询顶级权限
export const QUERY_TOP_PERMISSION = `${PERMISSION}/queryTopPermission`;

// 设施
const DEVICEINFO = `${DEVICE_SERVER}/deviceInfo`;

// 根据设施ids查询设备信息
export const GET_DEVICE_BY_IDS = `${DEVICEINFO}/getDeviceByIds`;

// 获取所有的设施集
export const GET_DEVICE_TYPE = `${USER_SERVER}/role/queryInitDeviceType`;

// 获取所有责任人列表
export const QUERY_USERS_BY_DEPTID = `${USER}/queryUsersByDeptId/`;

