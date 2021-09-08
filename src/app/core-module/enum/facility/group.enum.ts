/**
 *  快速分组类型枚举
 */
export enum QuickGroupTypeEnum {
  // 隔一选一
  oneByOne = 1,
  // 隔二选一
  chooseOneOutOfTwo = 2,
  // 隔三选一
  chooseOneOutOfThree = 3,
  // 隔四选一
  chooseOneOutOfFour = 4
}

/**
 *  分组类型
 */
 export enum GroupTypeEnum {
  //  移入其他分组
   moveInOtherGroup = 1,
  //  移出当前分组
   moveOutCurrentGroup = 2,
  //  移入新分组
   moveInNewGroup = 3,
 }
