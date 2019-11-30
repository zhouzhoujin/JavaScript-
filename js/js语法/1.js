    
        function solution(arg){
            var str = arg.toString();
            var arr = [];
            var flag = arg;             
            var target = 0;
            var args = arg
            for(let i = 0; i<str.length; i++){
                arr.push(str[i])
            }
            for(let j = 0; j<arr.length; j++){
                var arr1 = arr.slice(0)
                var temp = 0;
                var str1 = null;
  
                if(arr1[j] == 6){
                    temp = 9
                }else{
                    temp = 6
                }
                arr1.splice(j,1,temp);
                str1 = arr1.join('');
                target = parseInt(str1);
                if(target>flag){
                    flag = target
                    console.log(target)
                    args = target
                }
            }
            return args
        }
        console.log(solution(99666))