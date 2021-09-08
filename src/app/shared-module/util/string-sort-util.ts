/**
 * 手动设置表格前端字符串排序
 */
export class SetStringSortUtil {
  public static compare(property, sortRule) {
    return (a, b) => {
      const OneAttributes = a[property];
      const twoAttributes = b[property];
      if (sortRule === 'asc') {
        return OneAttributes.localeCompare(twoAttributes);
      }
      if (sortRule === 'desc') {
        return twoAttributes.localeCompare(OneAttributes);
      }
    };
  }
}
