let S,r,HP=3,DORM={};
let missFn=()=>true;const miss=()=>missFn();

function show(id,pre){
    const cur=document.querySelector('.screen.on');
    const nx=()=>{
        if(pre)pre();
        const e=$('#'+id);
        e.hidden=false;
        scrollTo(0,0);
        requestAnimationFrame(()=>requestAnimationFrame(()=>e.classList.add('on')));
    };
if(cur){
    cur.classList.remove('on');
    setTimeout(()=>{cur.hidden=true;nx();},380);
}else{nx();}
}

function round(){
    const el=$('#round'),isE=r==1;
    let h=`<div class="top"><div class="lab">ROUND ${r} OF 5</div>${hrt()}<div class="bar"><i style="width:${(r-1)/5*100+10}%"></i></div>`;
    if(!isE)h+=`<div class="pv">${scene(S,'p')}</div>`;
    const q=isE?'Where will your grove begin?':ENV[S.env].r[r-2][0];
    h+=`<h2>${q}</h2></div><div class="cards ${isE?'e':''}">`;
    if(isE){
        h+=Object.keys(ENV).map(k=>`<button class="card" data-k="${k}"><div class="art">${scene({env:k,c:[]},'e'+k)}</div><h3>${ENV[k].n}</h3><p>${ENV[k].d}</p></button>`).join('');
    }else{
    h+=ENV[S.env].r[r-2][1].map((o,i)=>`<button class="card" data-i="${i}"><div class="ic">${o.ic}</div><h3>${o.n}</h3><p>${o.d}</p></button>`).join('');
}
el.innerHTML=h+'</div>';
el.querySelectorAll('.card').forEach(b=>b.onclick=()=>{
    el.querySelectorAll('.card').forEach(x=>x.disabled=true);
    b.classList.add('sel');
    setTimeout(()=>{
        if(isE){
            S.env=b.dataset.k;
            document.body.dataset.env=S.env;
            adv();
        }else{
        const o=ENV[S.env].r[r-2][1][+b.dataset.i];
        S.c.push(o);
        MG[o.id]?show('mini',()=>mini(o)):adv();
    }
},520);
});
}

const adv=()=>{r++;r>5?show('final',fin):show('round',round);};

function fin(){S.hp=HP;S.dm=DORM;const T=TIER[HP],dm=S.c.filter(o=>DORM[o.id]).map(o=>o.ph);
    const ph=S.c.map(o=>o.ph),l=ph.slice(0,-1).join(', ')+', and '+ph.at(-1);
    $('#final').innerHTML=`<h1>Welcome to Your Enchanted Grove</h1>
    <div class="fin" id="fs">${scene(S,'f')}</div>
    <p>Your grove, born in the ${ENV[S.env].ph}, is filled with ${l}.</p>
    <div class="tier"><h3>${T.t}</h3>${hrt()}<ul>${T.l.map(x=>`<li>${x}</li>`).join('')}${HP<=1&&dm.length?`<li>💤 Sleeping: ${dm.join(', ')}</li>`:''}</ul></div>
    <div class="row"><button class="btn" id="ag">CREATE ANOTHER GROVE</button><button class="btn alt" id="sv">SAVE MY GROVE</button></div>`;
    $('#ag').onclick=()=>{HP=3;DORM={};S={env:null,c:[]};r=1;delete document.body.dataset.env;show('start');};
    $('#sv').onclick=save;
}

function save(){
    const svg=scene(S,'x').replace(' preserveAspectRatio="xMidYMid slice"','');
    const im=new Image;
    im.onload=()=>{
        const c=document.createElement('canvas');
        c.width=1600;c.height=1000;
        c.getContext('2d').drawImage(im,0,0,1600,1000);
        c.toBlob(async b=>{
            try{
                const d=window.claude?await window.claude.use('downloads'):null;
                if(d){
                    try{await d.save({filename:'my-enchanted-grove.png',data:b});return;}
                    catch(e){if(e&&e.code=='declined')return;}
                }
        }catch(e){}
    $('#mi').src=c.toDataURL('image/png');
    $('#md').classList.add('o');
},'image/png');
};
im.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);
}

