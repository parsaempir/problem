/**
 * @param {Array} arr
 * @param {number} depth
 * @return {Array}
 */
var flat = function (arr, n) {
    function helper(arr, depth){
        let result = [];
        for(let item of arr){
            if(Array.isArray(item) && depth < n){
                result.push(...helper(item, depth +1 ));
            }else{
                result.push(item)
            }
        }
        return result;
    }
        return helper(arr, 0);
};