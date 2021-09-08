import {USER_SERVER} from '../api-common.config';
const USER = `${USER_SERVER}/user`;
const UNIFY_AUTH = `${USER_SERVER}/unifyauth`;
const DEPARTMENT = `${USER_SERVER}/department`;
const ROLE = `${USER_SERVER}/role`;

export const OFFLINE = `${USER}/forceOffline`;
// 修改密码
export const MODIFY_PASSWORD = `${USER}/modifyPWD`;
export const LOGOUT = `${USER}/logout`;
// 不分页查询部门信息
export const QUERY_ALL_DEPARTMENT = `${DEPARTMENT}/queryTotalDepartment`;

// 查询所有单位/部门(无分页)
export const QUERY_TOTAL_DEPT = `${DEPARTMENT}/queryTotalDepartment`;
// 查询统一授权信息
export const QUERY_USER_UNIFY_AUTH_BY_ID = `${UNIFY_AUTH}/queryUserAuthInfoById`;

// 在线用户信息列表
export const GET_ONLINE_USER = `${USER}/getOnLineUser`;
// 查询用户列表(带权限)
export const QUERY_USER_BY_PERMISSION = `${USER}/queryUserByPermission`;

// 查询用户列表(后端重写自定义的)
export const QUERY_USER_LISTS = `${USER}/queryUserByField`;
// 查询未读消息数量
export const QUERY_UNREAD_COUNT = `${USER_SERVER}/messageHall/countUnread`;
// 查询所有角色(无分页)
export const QUERY_ALL_ROLES = `${ROLE}/queryAllRoles`;
// 用户校验
export const VERIFY_USER_INFO = `${USER}/verifyUserInfo`;
// 用户名校验
export const CHECK_USER_NAME = `${USER}/checkUserNameExist`;
// 获取所有责任人列表
export const QUERY_USERS_BY_DEPTID = `${USER}/queryUsersByDeptId/`;
