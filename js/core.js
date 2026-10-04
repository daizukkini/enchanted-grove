const $=s=>document.querySelector(s);
const EM='font-family="Apple Color Emoji,Segoe UI Emoji,Noto Color Emoji,sans-serif"';
let sd=1;
/* FIX: the seed must advance on every call (sd=...) or every "random" value is identical and elements stack up */
const R=()=>(sd=sd*16807%2147483647)/2147483647,rr=(a,b)=>a+R()*(b-a);

/* Jittered, shuffled grid: n points spread organically across a box with breathing room */
const spread=(n,x0,x1,y0,y1)=>{
    const cols=Math.max(1,Math.ceil(Math.sqrt(n*(x1-x0)/Math.max(1,(y1-y0))))),rows=Math.ceil(n/cols),cw=(x1-x0)/cols,ch=(y1-y0)/rows,c=[];
    for(let j=0;j<rows;j++)for(let i=0;i<cols;i++)c.push([i,j]);
    for(let k=c.length-1;k>0;k--){const m=Math.floor(R()*(k+1));[c[k],c[m]]=[c[m],c[k]];}
    return c.slice(0,n).map(([i,j])=>[x0+(i+.15+R()*.7)*cw,y0+(j+.15+R()*.7)*ch]);
};

const PAL={
    woods:{sky:['#06222e','#0f4a5c','#1c7a82'],h:'#0e4150',g:'#0d3b3a',g2:'#092a2b'},
    marsh:{sky:['#1a1038','#46307a','#2d7f8f'],h:'#3b3470',g:'#12263a',g2:'#0b1a2a',w:'#1fb3b8'},
    garden:{sky:['#3b5fa0','#e98fb0','#ffd68a'],h:'#7bb072',g:'#5f9a4b',g2:'#3f7a3a'}
};

const tw=(x,y,h,c)=>`<path d="M${x} ${y}C${x-30} ${y-h*.3} ${x+40} ${y-h*.5} ${x} ${y-h*.8}M${x} ${y-h*.55}C${x+30} ${y-h*.65} ${x+50} ${y-h*.75} ${x+45} ${y-h}M${x} ${y-h*.7}C${x-35} ${y-h*.8} ${x-45} ${y-h*.95} ${x-40} ${y-h*1.05}" stroke="${c}" stroke-width="14" stroke-linecap="round" fill="none"/>`;

const GL={a:'#ffd978',b:'#7fe9ff',c:'#ffa6d6'};

function base(env,u){
    const P=PAL[env];
    let s=`<defs><linearGradient id="sk${u}" x1="0" y1="0" x2="0" y2="1">${P.sky.map((c,i)=>`<stop offset="${i/2}" stop-color="${c}"/>`).join('')}</linearGradient>${Object.keys(GL).map(k=>`<radialGradient id="g${k}${u}"><stop offset="0" stop-color="${GL[k]}" stop-opacity=".85"/><stop offset="1" stop-color="${GL[k]}" stop-opacity="0"/></radialGradient>`).join('')}</defs><rect width="800" height="500" fill="url(#sk${u})"/>`;
    if(env=='garden'){
        s+=`<circle cx="620" cy="270" r="170" fill="url(#ga${u})"/><ellipse cx="160" cy="90" rx="110" ry="22" fill="#ffd0e0" opacity=".5"/><ellipse cx="420" cy="60" rx="90" ry="16" fill="#ffe3c0" opacity=".45"/>`;
    }else{
    spread(40,0,800,0,230).forEach(([x,y])=>{s+=`<circle cx="${x}" cy="${y}" r="${rr(.6,1.8)}" fill="#fff" opacity="${rr(.3,.9)}"/>`;});
}
if(env=='marsh')s+=`<path d="M0 330L90 250L180 310L300 220L420 300L540 240L660 305L800 235V340H0Z" fill="${P.h}" opacity=".75"/>`;
else s+=`<path d="M0 330Q120 250 240 305T480 295T800 285V500H0Z" fill="${P.h}"/>`;
if(env=='woods'){
    [[40,110],[235,90],[585,100],[765,120]].forEach(([x,w])=>{
        s+=`<path d="M${x-w/2} 500C${x-w*.35} 300 ${x-w*.3} 100 ${x-w*.2} 0H${x+w*.2}C${x+w*.3} 100 ${x+w*.35} 300 ${x+w/2} 500Z" fill="#103a45"/><path d="M${x+w*.05} 500C${x+w*.1} 300 ${x+w*.1} 100 ${x+w*.1} 0H${x+w*.2}C${x+w*.3} 100 ${x+w*.35} 300 ${x+w/2} 500Z" fill="#1d6a74" opacity=".5"/>`;
    });
for(let i=0;i<30;i++){
    const x=(i+rr(.1,.9))*800/30,l=rr(60,230),c=R()<.5?'#7fe9ff':'#ffd978';
    s+=`<line x1="${x}" y1="0" x2="${x}" y2="${l}" stroke="${c}" stroke-width="1.3" opacity=".6"/><circle class="bk" style="animation-delay:-${rr(0,3)}s" cx="${x}" cy="${l}" r="3" fill="${c}"/><circle cx="${x}" cy="${l*.6}" r="2" fill="${c}" opacity=".8"/>`;
}
}
if(env=='marsh')s+=tw(90,430,330,'#0b1424')+tw(725,430,330,'#0b1424')+tw(250,360,150,'#1a2540');
if(env=='garden'){
    for(let i=0;i<9;i++){const t=i/6;s+=`<circle cx="${400+Math.sin(i)*30}" cy="${495-t*135}" r="${46-t*26}" fill="#e4d8b8" opacity=".85"/>`;}
    spread(70,0,800,350,495).forEach(([x,y],i)=>{s+=`<circle cx="${x}" cy="${y}" r="${rr(2,5)}" fill="${['#ff8fb8','#ffd24a','#c3a5ff','#fff'][i%4]}"/>`;});
}
s+=`<path d="M0 340Q200 320 400 340T800 335V500H0Z" fill="${P.g}"/>`;
if(env=='marsh'){
    s+=`<path d="M0 362Q200 346 400 366T800 356V500H0Z" fill="${P.w}" opacity=".8"/>`;
    spread(14,0,740,375,490).forEach(([x,y])=>{s+=`<line x1="${x}" y1="${y}" x2="${x+rr(30,70)}" y2="${y}" stroke="#d8ffff" stroke-width="2" opacity=".3"/>`;});
    spread(6,40,760,380,480).forEach(([x,y])=>{s+=`<ellipse cx="${x}" cy="${y}" rx="22" ry="7" fill="#2f8a5a"/>`;});
    s+=`<ellipse cx="400" cy="340" rx="420" ry="26" fill="#dff" opacity=".1"/>`;
}else{
s+=`<path d="M0 420Q250 400 500 425T800 415V500H0Z" fill="${P.g2}"/>`;
}
if(env=='woods'){
    spread(55,0,800,375,495).forEach(([x,y])=>{s+=`<circle cx="${x}" cy="${y}" r="${rr(2,4.5)}" fill="${R()<.6?'#bff3f0':'#f7a8d0'}" opacity=".9"/>`;});
}
return s;
}

const fx={
    fire:u=>{let s='';spread(22,40,760,130,430).forEach(([x,y])=>{s+=`<g class="fl" style="animation-delay:-${rr(0,5)}s"><circle cx="${x}" cy="${y}" r="10" fill="#ffe58a" opacity=".3"/><circle class="bk" style="animation-delay:-${rr(0,3)}s" cx="${x}" cy="${y}" r="3.2" fill="#fff3b0"/></g>`;});return s;},
    run:u=>{let s='',g='ᚠᚢᚦᚨᚱᚲᚷᚹᛉᛟ';spread(9,80,720,110,330).forEach(([x,y],i)=>{s+=`<text class="fl" style="animation-delay:-${rr(0,5)}s" x="${x}" y="${y}" font-size="${rr(26,42)}" fill="#ffe08a" opacity=".92">${g[i]}</text>`;});return s;},
    bf:u=>{let s='';spread(8,60,740,170,380).forEach(([x,y])=>{s+=`<text class="fl" style="animation-delay:-${rr(0,5)}s" x="${x}" y="${y}" font-size="${rr(28,40)}" ${EM}>🦋</text>`;});return s;},
    pet:u=>{let s='';spread(16,0,790,60,440).forEach(([x,y])=>{s+=`<text class="fl" style="animation-delay:-${rr(0,5)}s" x="${x}" y="${y}" font-size="${rr(14,22)}" ${EM}>🌸</text>`;});return s;},
    rose:u=>{let s='';spread(14,20,780,440,497).forEach(([x,y])=>{s+=`<text x="${x}" y="${y}" font-size="${rr(26,36)}" ${EM}>🌹</text>`;});return s;}
};

const em=(c,x,y,s,g,u)=>(g?`<circle cx="${x}" cy="${y-s*.35}" r="${s*.8}" fill="url(#g${g}${u})"/>`:'')+`<text x="${x}" y="${y}" font-size="${s}" text-anchor="middle" ${EM}>${c}</text>`;

function scene0(S,u){
    sd=11;
    let s=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice" width="800" height="500">`+base(S.env,u);
    S.c.forEach(o=>{o.el.forEach(e=>{s+=typeof e=='function'?e(u):typeof e=='string'?e:em(e[0],e[1],e[2],e[3],e[4],u);});});
    S.c.forEach(o=>{if(o.fx)s+=fx[o.fx](u);});
    return s+'</svg>';
}

/* ---- Hearts + performance-based Grove ---- */
const hrt=()=>`<div class="hearts" aria-label="${HP} of 3 hearts">${[0,1,2].map(i=>`<span class="${i<HP?'':'lost'}">❤️</span>`).join('')}</div>`;

const TIER=[
{t:'🌑 A Sleeping Grove',l:['🍂 Most areas lie dormant','✨ One small spark still waits']},
{t:'🌙 A Mysterious, Darker Grove',l:['🍂 Some areas remain dormant']},
{t:'🌿 A Healthy Grove',l:['✨ Some magic']},
{t:'✨ A Vibrant Grove',l:['🌳 Lots of wildlife','🌸 Everything glowing']}
];

const WL={
    woods:['🦉','🐿️','🦊','🐇','🦌','🦔'],
    marsh:['🦉','🦇','🐸','🐢','🦆','🦎'],
    garden:['🐦','🐇','🐝','🦔','🐿️','🦢']
};

function mood(env,hp,u){
    let s='';
    const spark=(n,c)=>{
        for(let i=0;
        i<n;
        i++){
            const x=rr(20,780),y=rr(60,480);
            s+=`<g class="fl" style="animation-delay:-${rr(0,5)}s"><circle cx="${x}" cy="${y}" r="9" fill="${c}" opacity=".3"/><circle class="bk" style="animation-delay:-${rr(0,3)}s" cx="${x}" cy="${y}" r="3" fill="#fff6c0"/></g>`;
        }
    };
    const wild=(n,lo,hi)=>{
        const L=WL[env];
        for(let i=0;
        i<n;
        i++)s+=em(L[i%L.length],rr(30,770),rr(430,492),rr(lo,hi),'a',u);
    };
    const leaves=n=>{
        S.lv=S.lv||Array.from({
            length:70
        },()=>({
            x:15+Math.random()*770,y:385+Math.random()*110,a:Math.random()*360,f:20+Math.random()*12
        }));
        S.lv.slice(0,n).forEach(l=>{
            s+=`<text x="${l.x.toFixed(1)}" y="${l.y.toFixed(1)}" font-size="${l.f.toFixed(0)}" text-anchor="middle" transform="rotate(${l.a.toFixed(0)} ${l.x.toFixed(1)} ${l.y.toFixed(1)})" ${EM}>🍂</text>`;
        });
    };
    if(hp>=3){
        s+=`<circle cx="400" cy="300" r="460" fill="url(#ga${u})" opacity=".28"/>`;
        spark(34,'#ffe58a');
        wild(8,30,44);
    }else if(hp==2){
        spark(12,'#ffe58a');
        wild(2,28,36);
    }else if(hp==1){
        s+=`<rect width="800" height="500" fill="#050816" opacity=".42"/><ellipse cx="400" cy="400" rx="460" ry="40" fill="#cfe" opacity=".12"/>`;
        leaves(45);
        spark(4,'#9fe0ff');
    }else{
        s+=`<rect width="800" height="500" fill="#03040c" opacity=".6"/>`;
        leaves(70);
        s+=em('✨',400,330,48,'a',u);
    }
    return s;
}

function scene(S,u){
    const hp=S.hp==null?3:S.hp;
    let S2=S;
    if(hp<=1&&S.dm)S2={...S,c:S.c.map(o=>S.dm[o.id]?{...o,fx:null,el:[()=>`<g opacity=".5" filter="url(#dm${u})">`,...o.el,()=>'</g>']}:o)};
    const svg=scene0(S2,u);
    if(S.hp==null)return svg;
    return svg.slice(0,-6)+`<defs><filter id="dm${u}"><feColorMatrix type="saturate" values=".1"/></filter></defs>`+mood(S.env,hp,u)+'</svg>';
}

const ring=u=>{
    let s='<ellipse cx="400" cy="408" rx="92" ry="22" fill="#2d6b3a" opacity=".8"/>';
    ['🌼','🌸','🌷','🌺','🌼','🌸','🌷','🌺','🌼','🌸'].forEach((c,i)=>{const a=i/10*6.283;s+=em(c,400+Math.cos(a)*92,415+Math.sin(a)*22,34,'',u);});
    return s+em('✨',400,410,34,'a',u);
};

const canopy=u=>{
    let s='';
    for(let i=0;i<16;i++)s+=`<circle cx="${i*54}" cy="${rr(0,34)}" r="${rr(34,56)}" fill="#0b3a2c"/>`;
    spread(16,0,800,20,70).forEach(([x,y])=>{s+=`<circle class="bk" style="animation-delay:-${rr(0,3)}s" cx="${x}" cy="${y}" r="3" fill="#ffd978"/>`;});
    return s;
};

const bloom=u=>{
    let s='<path d="M120 400C110 300 140 200 120 110" stroke="#5b3a3a" stroke-width="16" fill="none"/>';
    spread(18,40,210,40,150).forEach(([x,y])=>{s+=`<circle cx="${x}" cy="${y}" r="${rr(24,40)}" fill="#ffb3cf" opacity=".85"/>`;});
    return s;
};

const lant=u=>{
    let s='<path d="M0 60Q400 190 800 60" stroke="#6b5a3a" stroke-width="3" fill="none"/>';
    for(let i=1;i<8;i++){const x=i*100+rr(-16,16),y=60+Math.sin(i/8*Math.PI)*98*1.0;s+=em('🏮',x,y+30,30,'a',u);}
    return s;
};

const cry=u=>{
    let s='';
    [[500,100,330],[625,60,330],[740,120,330]].forEach(c=>{
        s+=`<polygon points="${c[0]},${c[2]} ${c[0]+18},${c[2]-c[1]*2} ${c[0]+36},${c[2]}" fill="#ff8fd8" opacity=".85"/><circle cx="${c[0]+18}" cy="${c[2]-c[1]}" r="46" fill="url(#gc${u})"/>`;
    });
return s;
};

const O=(id,ic,n,d,ph,el,f)=>({id,ic,n,d,ph,el,fx:f});

