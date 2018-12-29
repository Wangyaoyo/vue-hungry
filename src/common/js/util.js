/**
 * 解析url参数
 * @Example ?id=123&name=wy
 * @return   {id:123,name:wy}
 */
export function urlParse() {
  let url = window.location.search;
  let obj = {};
  let reg = /[?&][^?&]+=[^?&]+/g;
  let arr = url.match(reg);
  if(arr){
    for(let i = 0; i < arr.length; i++){
      //?id=123 => [id,123]
      let tempA = arr[i].substring(1).split('=');
      /* 对url进行解码 */
      let key = decodeURIComponent(tempA[0]);
      let val = decodeURIComponent(tempA[1]);
      obj.key = val;
    }
    /* 数组的另一种遍历方式 */
    /*arr.forEach((item) => {
      let tempA = item.substring(1).split('=');
    })*/

    return obj;
  }


}
