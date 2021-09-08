export class AlarmStatisticalUtil {
  /**
   * 通过id获取区域名称
   */
  public static byKeyGetValue(data: any[], id) {
    const arr = [];
    const pushToArr = (treeNodes) => {
      treeNodes.forEach(item => {
        arr.push(item);
        if (item.children && item.children.length > 0) {
          pushToArr(item.children);
        }
      });
    };
    pushToArr(data);
    const name = arr.filter(_item => _item.areaId === id);
    return name[0].areaName;
  }
}
