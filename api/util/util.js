exports.descendingSort=function(a,b){
if(a.users.length<b.users.length){
	return 1;
}
else if(a.users.length===b.users.length){
    return 0;
}
else{
	return -1;
}
//return a.users.length-b.users.length;
};