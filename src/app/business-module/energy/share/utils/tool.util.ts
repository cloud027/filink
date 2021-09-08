import { InsertCollectionTaskRefType } from '../enum/energy-config.enum';
/**
 * 处理应用范围列表数据分类
 */
export function listFmt(data) {
    const equipment = data.filter(
        (item) => item.refType === InsertCollectionTaskRefType.equipmentRefType
    );
    const group = data.filter((item) => item.refType === InsertCollectionTaskRefType.groupRefType);
    const area = data.filter((item) => item.refType === InsertCollectionTaskRefType.areaRefType);
    return { equipment, group, area };
}

/** 获取两个指定小时之间的所有 小时 */
export function getHoursBetween(start, end) {
    const result: Array<string> = [];
    const startHour = new Date(start).getHours();
    const endHour = new Date(end).getHours();
    let getCloneStartHour = startHour;
    while (getCloneStartHour <= endHour) {
        let resHour = '';
        if (getCloneStartHour < 10) {
            resHour = '0' + getCloneStartHour + ':00';
        } else { resHour = getCloneStartHour + ':00'; }
        getCloneStartHour += 1;
        result.push(resHour);
    }
    return result;
}


/** 获取两个时间戳之间的 所有 天 */
export function getDateDayFormate(start, end) {
    const result = [];
    const startTime: any = new Date(start);
    const endTime: any = new Date(end);
    while (endTime - startTime >= 0) {
        const year = startTime.getFullYear();
        let month: any = startTime.getMonth();
        month = month < 9 ? `0${month + 1}` : month + 1;
        const day =
            startTime.getDate().toString().length === 1
                ? `0${startTime.getDate()}`
                : startTime.getDate();
        result.push(`${year}-${month}-${day}`);

        startTime.setDate(startTime.getDate() + 1);
    }
    return result;
}

/** 获取两个时间之间的 月份 */
export function getMonthBetween(start, end) {
    // 初始化数组
    const result = [];
    // 获取时间对象
    const min = new Date(start);
    const max = new Date(end);
    // 复制一份起始时间对象
    const curr = min;
    // 定义字符串
    let str = '';
    // 起始时间在结束时间之前
    while (curr <= max) {
        // 获取此时间的月份
        const month = curr.getMonth();
        str = curr.getFullYear() + '-' + (month < 9 ? '0' + (month + 1) : (month + 1));
        // 将此年月加入数组
        result.push(str);
        // 更新此时间月份
        curr.setMonth(month + 1);
    }
    return result;
}

/** 获取两个时间 之间的 年份 */
export function getYearBetween(start, end) {
    const result = [];
    // 使用传入参数的时间
    const startTime: any = new Date(start);
    const endTime: any = new Date(end);
    while (endTime - startTime >= 0) {
        // 获取年份
        const year = startTime.getFullYear();
        // 加入数组
        result.push(year.toString());
        // 更新日期
        startTime.setFullYear(startTime.getFullYear() + 1);
    }
    return result;
}

