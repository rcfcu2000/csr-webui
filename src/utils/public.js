// 全局方法
// 时间返回格式
export function formDate(date, type) {
    /* 
     type: 
     1、年月日时分秒2023-7-24 12:00:00 
     2、年月日时分2023-7-24 12:00
     3、年月日2023-7-24
     */
    let time;
    if (date != '') {
        time = new Date(date)
    } else {
        time = new Date()
    }

    let year = time.getFullYear()
    const month = (time.getMonth() + 1).toString().padStart(2, '0')
    const day = (time.getDate()).toString().padStart(2, '0')
    const hours = (time.getHours()).toString().padStart(2, '0')
    const minute = (time.getMinutes()).toString().padStart(2, '0')
    const second = (time.getSeconds()).toString().padStart(2, '0')

    switch (type) {
        case '1':
            return year + '-' + month + '-' + day + ' ' + hours + ':' + minute + ':' + second
        case '2':
            return year + '-' + month + '-' + day + ' ' + hours + ':' + minute
        case '3':
            return year + '-' + month + '-' + day
        default:
            break;
    }
}
// 菜单处理
export function updateCheckedStatus(a, b) {
    let mainArr = flattenChildren(a)
    let sonArr = flattenChildren(b)
    mainArr.forEach(item => {
        item.isChecked = false
    })
    let result = []
    for (let i = 0; i < sonArr.length; i++) {
        for (let j = 0; j < mainArr.length; j++) {
            if (sonArr[i].ID == mainArr[j].ID) {
                mainArr[j].isChecked = true
            }
        }
    }
    result = updateParentCheckedStatus(restoreHierarchy(mainArr))
    return result
}
// 恢复扁平化之后的数组
export function restoreHierarchy(flatList) {
    // 创建一个map，用于存储每个id对应的对象  
    const idMap = {};
    // 创建一个数组，用于存储根节点  
    const result = [];

    // 第一步：遍历扁平化数组，将对象存储到map中  
    flatList.forEach(item => {
        idMap[item.ID] = { ...item, children: [] }; // 复制对象并初始化children数组  
        // 删除children字段的null值（如果存在）  
        if (item.children === null) {
            delete item.children; // 而不是赋值[]，因为原始数据可能不需要这个字段  
        }
    });
    // 第二步：遍历扁平化数组，构建层次结构  
    flatList.forEach(item => {
        // 查找父节点  
        if (item.parentId in idMap) { // 使用in操作符检查parentId是否在map中  
            idMap[item.parentId].children.push(idMap[item.ID]); // 将子节点添加到父节点的children数组中  
        } else if (item.parentId == '0' || item.parentId == 0) { // 如果没有parentId（或parentId为0），则为根节点  
            result.push(idMap[item.ID]); // 将根节点添加到结果数组中  
        }
    });
    function childrenNull(result) {
        if (result.length > 0) {
            result.forEach(item => {
                if (item.children.length > 0) {
                    childrenNull(item.children)
                } else {
                    item.children = null
                }
            })
        }
    }
    childrenNull(result)

    // 返回结果数组  
    return result;
}
function updateParentCheckedStatus(items) {
    // 递归辅助函数，检查子项并更新父项的ischecked  
    function checkChildren(item) {
        if (item.children && item.children.length > 0) {
            // 检查所有子项  
            let allUnchecked = item.children.every(child => {
                // 递归检查子项  
                checkChildren(child);
                // 如果子项或子项的子项有任何一个被选中，则返回false  
                return !child.isChecked;
            });
            // 如果所有子项都未选中，则设置父项为未选中  
            if (allUnchecked) {
                item.isChecked = false;
            }
        }
    }

    // 对传入的所有项执行检查  
    items.forEach(item => {
        checkChildren(item);
    });

    return items; // 返回更新后的数组，但通常这个操作是就地更新的，不需要返回  
}
// 扁平化菜单数组
export function flattenChildren(arr) {
    let result = [];

    // 递归函数  
    function flatten(items) {
        items.forEach(item => {
            // 添加当前项到结果数组中  
            result.push(item);

            // 如果当前项有children属性，则递归处理  
            if (Array.isArray(item.children)) {
                flatten(item.children);
            }
        });
    }

    // 调用递归函数  
    flatten(arr);

    // 返回结果数组  
    return result;
}
// 列表查询
// 模糊查询函数  
export function fuzzySearch(array, searchField, searchTerm) {
    let arr = []
    array.forEach(item => {
        if (item[searchField].includes(searchTerm)) {
            arr.push(item)
        }
    })
    return arr
}
// 列表选择分组
export function groupingSearch(array, searchField, searchTerm) {
    let arr = []
    array.forEach(item => {
        if (item.qa_types[0][searchField].includes(searchTerm)) {
            arr.push(item)
        }
    })
    return arr
}