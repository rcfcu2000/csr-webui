// 公共的方法
export function arrayNodUp(arr, propertyName) {
    // 使用Set来存储已经遇到过的属性值  
    const uniqueValues = new Set();
    // 使用Map来存储去重后的对象，键为属性值，值为对象本身  
    const uniqueObjects = new Map();

    arr.forEach(obj => {
        console.log(obj);
        // 假设propertyName是对象的一个属性，用于判断对象是否唯一  
        const value = obj[propertyName];
        // 如果属性值在Set中不存在，则将其添加到Set和Map中  
        if (!uniqueValues.has(value)) {
            uniqueValues.add(value);
            uniqueObjects.set(value, obj);
        }
    });

    // 返回Map中的值（即去重后的对象数组）  
    return Array.from(uniqueObjects.values());
} 