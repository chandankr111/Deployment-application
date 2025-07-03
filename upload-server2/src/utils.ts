const MAX_LEN = 5;

export function generate(){
    const subset = "hwjeasbrfigj24w95u86tu9504368983qjhrnbfjehrnbfrv89w4";
    let ans = "";
    for(let  i =0  ; i < MAX_LEN ;i++ ){
        ans += subset[Math.floor(Math.random()*subset.length)];
    }
    return ans;
}