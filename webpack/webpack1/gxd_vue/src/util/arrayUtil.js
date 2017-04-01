export default {
  // 将对象数组中的所有对象设置其属性的值;多用于在获取对象数组，但是其中的对象需要再增加一下属性
  setObjectAttribute (array, attribute, value) {
    for (let i = 0; i < array.length; i++) {
      array[i][attribute] = value
    }
  },
  // 深度遍历一个对象数组，将这个数组中所有的对象的某个属性设置为某个值
  setObjectArrayAttributeDeep (array, attribute, value) {
    for (let i = 0; i < array.length; i++) {
      array[i][attribute] = value
      if (array[i].children && array[i].children.length > 0) {
        this.setObjectArrayAttributeDeep(array[i].children, attribute, value)
      }
    }
  },
  setObjectChildrenAttribute (obj, attribue, value) {
    setObjectChildren(obj, attribue, value)
  },
  // 判断对象数组中每个对象的某个属性的值是否是指定的值
  isArrayObjectSameAttribute (array, attribue, value) {
    for (let i = 0; i < array.length; i++) {
      if (array[i][attribue] !== value) {
        return false
      }
    }
    return true
  },
  // 从对象数组中取出符合条件（对象）的数组
  getArrayObjectByAttribute (array, attribue, value) {
    let arr = []
    for (let i = 0; i < array.length; i++) {
      if (array[i][attribue] === value) {
        arr.push(array[i])
      }
    }
    return arr
  },
  // 根据对象的某个关键字，判断这个对象是否存在对象数组中。
  isObjectInArray (array, key, value) {
    for (let item of array) {
      if (item[key] === value) {
        return true
      }
    }
    return false
  },
  // 深度遍历一个对象数组，返回这个数组中满足条件的对象
  getSelectObjectArray (array, key, value) {
    let arr = []
    for (let item of array) {
      if (item[key] === value) {
        arr.push(item)
      }
      else {
        // 判断这个对象的children中的对象是否满足条件
        if (item.children && item.children.length > 0) {
          arr = arr.concat(this.getSelectObjectArray(item.children, key, value))
        }
      }
    }
    return arr
  },
  // 从数组对象中删除满足条件的数组对象,返回
  deleteObjectFromArray (array, key, value) {
    let r
    for (let i = 0; i < array.length; i++) {
      if (array[i][key] === value) {
        r = array.splice(i, 1)
        i = i - 1
      }
    }
    return r
  },
  // 根据对象的某个关键字，去除对象数组中重复的对象，同时去除没有这个关键字的对象
  uniqueArrayObjectByKey (array, key) {
    let arr = []
    for (let item of array) {
      if (!this.isObjectInArray(arr, key, item[key])) {
        arr.push(item)
      }
    }
    return arr
  },
  // 判断对象数组中是否存在另一个对象数组中，如果存在，那么就将这个对象的某个属性设置为某个值。
  // 可以用来判断一个数组中是否在另一个数组中存在相同的对象id。并将这个对象设置某种值。
  transArrayAttributeByArray (oriArray, tarArray, key, attr, val, flag) {
    for (let obj of tarArray) {
      for (var i = 0, length = oriArray.length; i < length; i++) {
        let obj2 = oriArray[i]
        if (obj[key] === obj2[key] && obj[key] !== undefined) {
          obj[attr] = val
          if (flag) { // 如果flag为true,将判断数组中匹配的元素删除
            oriArray.splice(i, 1)
            i = i - 1
            length = length - 1
          }
        }
      }
    }
    return tarArray
  },
  // 判断对象数组中是否存在另一个对象数组中，如果存在，那么就将这个对象的某个属性设置为某个值。
  // 可以用来判断一个数组中是否在另一个数组中存在相同的对象id。并将这个对象设置flag，否则设置为取反。
  transArrayFlagByArray (oriArray, tarArray, key, attr, val) {
    this.setObjectAttribute(tarArray, attr, !val)
    for (let obj of tarArray) {
      for (var i = 0, length = oriArray.length; i < length; i++) {
        let obj2 = oriArray[i]
        if (obj[key] === obj2[key] && obj[key] !== undefined) {
          obj[attr] = val
        }
      }
    }
    return tarArray
  }
}
function setObjectChildren (obj, attribue, value) {
  if (obj.children && obj.children.length > 0) {
    let array = obj.children
    for (let i = 0; i < array.length; i++) {
      array[i][attribue] = value
      setObjectChildren(array[i], attribue, value)
    }
  }
}
