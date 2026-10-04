$('#mc').onclick=()=>$('#md').classList.remove('o');

$('#go').onclick=()=>{HP=3;DORM={};S={env:null,c:[]};r=1;show('round',round);};

(function(){
    let h='';
    for(let i=0;i<26;i++)h+=`<div class="ff" style="left:${Math.random()*100}%;top:${Math.random()*100}%;animation-delay:-${Math.random()*9}s,-${Math.random()*3}s"></div>`;
    $('#ffs').innerHTML=h;
    $('#sbg').innerHTML=scene({env:'woods',c:[{fx:'fire',el:[]}]},'s').replace('width="800" height="500"','width="100%" height="100%"');
})();

S={env:null,c:[]};
r=1;
