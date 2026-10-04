const D=ms=>new Promise(r=>setTimeout(r,ms)),rn=n=>Math.random()*n|0,shf=a=>[...a].sort(()=>Math.random()-.5);
let tok=0;

const sp=(pl,x,y)=>{
    for(let i=0;i<10;i++){
        const s=document.createElement('i');
        s.className='sp';s.textContent='✨';
        s.style.cssText=`left:${x}px;top:${y}px;--x:${rn(140)-70}px;--y:${rn(140)-90}px`;
        pl.appendChild(s);
        setTimeout(()=>s.remove(),1100);
    }
};

const bx=(e,pl)=>{
    const a=pl.getBoundingClientRect(),b=e.getBoundingClientRect();
    return[b.left-a.left+b.width/2,b.top-a.top+b.height/2];
};

const E={};

E.seq=async(pl,say,win,ok,c)=>{
    const n=c.it.length;
    pl.innerHTML=`<div class="clue" id="pt"></div><div class="tiles">${c.it.map((e,i)=>`<button class="tk ${c.k||''}" data-i="${i}" style="--h:${i*70}deg">${e}</button>`).join('')}</div>`;
    const tk=[...pl.querySelectorAll('.tk')],
    lit=async(i,ms=550)=>{tk[i].classList.add('lit');await D(ms);tk[i].classList.remove('lit');await D(160);};
    let st=0,seq=[],inp=0,busy=true;
    const play=async()=>{
        busy=true;inp=0;
        say('Watch closely…');
        if(c.show){
            $('#pt').textContent=seq.map(i=>c.it[i]).join('  →  ');
            await D(2200+seq.length*700);
            $('#pt').textContent='';
        }else{
        for(const i of seq){if(!ok())return;await lit(i);}
    }
say('Your turn!');
busy=false;
};
const nx=()=>{
    if(c.ext&&seq.length)seq.push(rn(n));
    else seq=Array.from({length:c.L[st]},()=>rn(n));
    play();
};
tk.forEach(b=>b.onclick=async()=>{
    if(busy||!ok())return;
    const i=+b.dataset.i;
    if(i==seq[inp]){
        lit(i,250);
        if(++inp==seq.length){
            busy=true;
            if(++st==c.L.length)return win();
            say('Beautiful! Now a longer one…');
            await D(900);
            nx();
        }
}else{
busy=true;
b.classList.add('bad');
if(miss())return;
say('Not quite — watch again.');
await D(900);
b.classList.remove('bad');
play();
}
});
nx();
};

E.ord=async(pl,say,win,ok,c)=>{
    let st=0;
    const stage=()=>{
        const L=c.L[st];
        let pool,tg;
        if(c.m=='trail'){
            pool=[];
            for(let k=0;k<L;k++)pool.push({n:'d'+k,e:'👣',gl:1,x:8+k*(72/L)+rn(6),y:78-k*(62/L)});
            tg=[...pool];
            for(let k=0;k<L+4;k++)pool.push({n:'x'+k,e:'🐾',x:rn(84)+4,y:rn(76)+4});
        }else if(c.ff){
        tg=Array.from({length:L},()=>c.it[rn(c.it.length)]);
        pool=[...tg,...Array.from({length:3+st},()=>c.it[rn(c.it.length)])].map(o=>({...o}));
    }else{
    pool=c.it.slice(0,c.grow?Math.min(c.it.length,L+3):c.it.length);
    tg=shf(pool).slice(0,L);
}
const sl=shf([...Array(12).keys()]);
pool.forEach((o,i)=>{
    if(o.x==null){
        const s=sl[i%12];
        o.x=6+(s%4)*23+rn(5);
        o.y=6+(s/4|0)*30+rn(8);
    }
});
pl.innerHTML=`<div class="clue" id="cl"></div><div class="arena" id="ar"></div>`;
let idx=0,ht;
const btns=pool.map(o=>{
    const b=document.createElement('button');
    b.className='tg'+(o.gl?' gl':'')+(c.ff?' ffd':'');
    b.innerHTML=o.e;
    b.style.left=o.x+'%';
    b.style.top=o.y+'%';
    if(c.ff)b.style.animationDelay='-'+rn(5)+'s';
    $('#ar').appendChild(b);
    b.onclick=()=>{
        if(!ok())return;
        if(o.n==tg[idx].n){
            sp(pl,...bx(b,pl));
            b.classList.add('done');
            if(c.ff)b.style.display='none';
            idx++;
            clearTimeout(ht);
            if(idx==L){
                if(++st==c.L.length)return win();
                say('Wonderful! One more…');
                setTimeout(stage,1000);
            }else{hint();}
    }else{
    b.classList.add('bad');
    if(miss())return;
    say(c.bad||'Not that one — try again.');
    if(c.ff){
        b.style.visibility='hidden';
        setTimeout(()=>b.style.visibility='',900);
    }else{
    setTimeout(()=>b.classList.remove('bad'),500);
}
}
};
return b;
});
const hint=()=>{
    if(c.m=='glow'){
        clearTimeout(ht);
        ht=setTimeout(()=>{
            const t=tg[idx];
            if(t)btns[pool.findIndex(o=>o.n==t.n)].classList.add('hint');
        },1300);
}
};
if(c.m=='glow'){
    say('Clear the obstacle that glows, one at a time.');
    hint();
}else if(c.m=='trail')say('Follow the glowing deer prints from the bottom up. Ignore other tracks 🐾.');
else{
    $('#cl').innerHTML=c.cl(tg);
    if(c.m=='flash'){
        say('Memorize the order…');
        setTimeout(()=>{$('#cl').innerHTML='';say('Now do it from memory!');},2500+L*900);
    }else{say('Follow the clue.');}
}
};
stage();
};

E.lit=async(pl,say,win,ok,c)=>{
    let sc=0,t=c.t,u=0;
    pl.innerHTML='<div class="arena" id="ar"></div><div class="pr"><i id="pb"></i></div>';
    const ar=$('#ar'),sl=shf([...Array(12).keys()]);
    const mk=p=>{
        const b=document.createElement('button');
        b.className='tg';
        b.textContent=c.e;
        const s=p??sl[u++%12];
        b.style.left=5+(s%4)*23+rn(6)+'%';
        b.style.top=4+(s/4|0)*30+rn(8)+'%';
        ar.appendChild(b);
        return b;
    };
const fx=c.sp?[]:Array.from({length:c.n},()=>mk());
say(`Catch ${c.need}!`);
while(sc<c.need&&ok()){
    let b;
    if(c.sp)b=mk(rn(12));
    else{
        if(c.grow&&sc&&sc%3==0&&fx.length<10&&!fx.g)fx.push(mk());
        b=fx[rn(fx.length)];
    }
b.classList.add('lit');
let hit=false;
await new Promise(res=>{
    b.onclick=()=>{hit=true;res();};
    setTimeout(res,t);
});
b.classList.remove('lit');
b.onclick=null;
if(hit){
    sc++;
    say('');
    sp(pl,...bx(b,pl));
    $('#pb').style.width=sc/c.need*100+'%';
    t=Math.max(c.min,t*.9);
}else{
if(!miss())say('Too slow — you can do it!');
}
if(c.sp)b.remove();
await D(250);
}
if(ok())win();
};

E.fall=(pl,say,win,ok,c)=>{
    let g=0,d=c.d;
    pl.innerHTML='<div class="arena" id="ar"></div><div class="pr"><i id="pb"></i></div>';
    const ar=$('#ar');
    say(`Collect ${c.need} glowing petals — skip the plain ones.`);
    const iv=setInterval(()=>{
        if(!ok()||g>=c.need)return clearInterval(iv);
        const m=Math.random()<Math.max(.35,.8-g*.05),b=document.createElement('button');
        b.className='pt'+(m?' mg2':'');
        b.textContent=m?c.e:c.e2;
        b.style.left=rn(88)+'%';
        b.style.animationDuration=d+'ms';
        b.onclick=()=>{
            if(m){
                g++;
                sp(pl,...bx(b,pl));
                d=Math.max(2800,d-150);
            }else{
            g=Math.max(0,g-1);
            if(!miss())say('That was just an ordinary petal.');
        }
    $('#pb').style.width=g/c.need*100+'%';
    b.remove();
    if(g>=c.need){clearInterval(iv);win();}
};
ar.appendChild(b);
setTimeout(()=>b.remove(),d+100);
},c.iv);
};

E.path=(pl,say,win,ok,c)=>{
    const ans=Array.from({length:c.d},()=>rn(c.b));
    let lv=0,bad={};
    const rd=()=>{
        let h=`<div class="lv"><span class="nd on">${c.goal}</span></div>`;
        for(let l=c.d-1;l>=0;l--){
            h+='<div class="lv">'+Array.from({length:c.b},(_,i)=>`<button class="nd ${l<lv&&ans[l]==i?'on':''} ${c.cl&&l==lv&&ans[l]==i&&(c.cl==1||lv>=1)?'cl':''} ${bad[l+'_'+i]?'bad':''}" data-l="${l}" data-i="${i}" ${l!=lv||bad[l+'_'+i]?'disabled':''}>${c.n}</button>`).join('')+'</div>';
        }
    pl.innerHTML=h+`<div class="lv">${c.start}</div>`;
    pl.querySelectorAll('.nd[data-l]').forEach(b=>b.onclick=()=>{
        if(!ok())return;
        const l=+b.dataset.l,i=+b.dataset.i;
        if(ans[l]==i){
            lv++;
            say('The way opens…');
            if(lv==c.d){rd();return win();}
        }else if(miss()){
        return;
    }else if(c.rs){
    lv=0;bad={};
    say('The branches tangle — the path resets.');
}else{
bad[l+'_'+i]=1;
say('A dead end — that branch withers gently.');
}
rd();
});
};
say('Choose a branch at each level, bottom to top.');
rd();
};

E.cyc=(pl,say,win,ok,c)=>{
    const S=['🌙','⭐','🔥','💧','🍃'],tg=Array.from({length:4},()=>rn(5)),cur=tg.map(t=>(t+1+rn(4))%5);
    pl.innerHTML=`<p>Pattern:</p><div class="tiles">${tg.map(t=>`<span class="tk lit2">${S[t]}</span>`).join('')}</div><p>Tap each pillar to change its symbol:</p><div class="tiles" id="pi"></div>`;
    const rd=()=>{
        const p=$('#pi');
        p.innerHTML=cur.map((s,i)=>`<button class="tk ${s==tg[i]?'lit2':''}" data-i="${i}">${S[s]}</button>`).join('');
        p.querySelectorAll('.tk').forEach(b=>b.onclick=()=>{
            if(!ok())return;
            const i=+b.dataset.i,was=cur[i]==tg[i];
            cur[i]=(cur[i]+1)%5;
            if(was&&miss()){rd();return;}
            rd();
            if(cur.every((s,j)=>s==tg[j]))win();
        });
};
rd();
};

E.rot=(pl,say,win,ok,c)=>{
    const q=Array.from({length:9},()=>1+rn(3));
    pl.innerHTML='<div class="rg" id="rg"></div>';
    const g=$('#rg');
    say('Tap pieces to rotate them until the rune is whole.');
    q.forEach((v,i)=>{
        const b=document.createElement('button');
        b.className='rt';
        b.style.transform=`rotate(${v*90}deg)`;
        b.innerHTML=`<span style="left:${-(i%3)*72}px;top:${-(i/3|0)*72}px">ᚱ</span>`;
        b.onclick=()=>{
            if(!ok())return;
            if(q[i]==0&&miss())return;
            q[i]=(q[i]+1)%4;
            b.style.transform=`rotate(${q[i]*90}deg)`;
            if(q.every(x=>!x)){
                g.style.filter='drop-shadow(0 0 22px #ffd978)';
                win();
            }
    };
g.appendChild(b);
});
};

E.mt=(pl,say,win,ok,c)=>{
    const C=['#ff6fb5','#5ab6ff','#ffd24a','#a77bff','#5de0a0','#ff8a5c'];
    const C2=['#ff6fb5','#ff9ccd','#5ab6ff','#8fd0ff','#a77bff','#c9a8ff'];
    let st=0,sel=null;
    const run=()=>{
        const n=[3,4,5][st],cs=st==2?[C2[0],C2[1],C2[2],C2[3],C2[4]]:shf(C).slice(0,n);
        pl.innerHTML=`<div class="tiles">${cs.map(x=>`<button class="tk bf fl" data-c="${x}" style="--c:${x};animation-delay:-${rn(4)}s">🦋</button>`).join('')}</div><div class="tiles">${shf(cs).map(x=>`<button class="tk" data-c="${x}" style="--c:${x};box-shadow:0 0 22px ${x}">🌸</button>`).join('')}</div>`;
        const B=[...pl.querySelectorAll('.bf')],F=[...pl.querySelectorAll('.tk:not(.bf)')];
        B.forEach(b=>b.onclick=()=>{
            if(b.classList.contains('done'))return;
            B.forEach(x=>x.classList.remove('sel'));
            b.classList.add('sel');
            sel=b;
            say('Now tap the matching flower.');
        });
    F.forEach(f=>f.onclick=()=>{
        if(!ok()||f.classList.contains('done'))return;
        if(!sel)return say('Pick a butterfly first.');
        if(sel.dataset.c==f.dataset.c){
            sp(pl,...bx(f,pl));
            sel.classList.add('done');
            sel.classList.remove('sel','fl');
            sel.style.visibility='hidden';
            f.classList.add('done');
            f.textContent='🦋';
            sel=null;
            say('');
            if(B.every(x=>x.classList.contains('done'))){
                if(++st==3)return win();
                say('More butterflies arrive!');
                setTimeout(run,1100);
            }
    }else{
    f.classList.add('bad');
    if(miss())return;
    say('Not that blossom — try again.');
    setTimeout(()=>f.classList.remove('bad'),500);
}
});
};
run();
};

E.dec=(pl,say,win,ok,c)=>{
    const Q=[
    ['The deer keeps glancing toward the 🌸 flowers.',[['🌿 Offer fresh leaves',0],['🔔 Ring a loud bell',0],['✨ Hold out a glowing flower',1]]],
    ['The deer lowers its head toward a trickling 💧 stream.',[['🍎 Wave a shiny apple',0],['🤫 Sit quietly by the water',1],['🥁 Tap a drum',0]]],
    ['A soft 🌙 glyph glows above the deer, and its ears tilt back.',[['🎺 Blow a trumpet',0],['🏃 Run closer',0],['🎶 Hum a gentle moonlit tune',1]]]
    ];
    let st=0,p=0;
    const rd=()=>{
        const q=Q[st];
        pl.innerHTML=`<div class="trk"><span style="left:${4+p*26}%">🦌</span><b>🧚</b></div><p class="clue">${q[0]}</p><div class="tiles">${shf(q[1]).map(o=>`<button class="nd" data-k="${o[1]}">${o[0]}</button>`).join('')}</div>`;
        pl.querySelectorAll('.nd').forEach(b=>b.onclick=()=>{
            if(!ok())return;
            if(b.dataset.k=='1'){
                st++;p=st;
                if(st==3){say('');rd2();return win();}
                say('The deer steps closer…');
                rd();
            }else{
            p=Math.max(0,st-1);
            if(miss())return;
            say('The deer steps back a little. Look for clues.');
            rd();
        }
});
};
const rd2=()=>{pl.querySelector('.trk span').style.left='72%';};
rd();
};

const M=(t,i,w,f)=>({t,i,w,run:f});
const Q=(f,c)=>(...a)=>f(...a,c);
const FF=(e,n,c)=>({e:`<b style="color:${c}">●</b>`,n});
const hs=['moon','star','flower','mushroom','butterfly'];
const hi=['🌙','⭐','🌸','🍄','🦋'];

const MG={
    w1:M('Temple Memory Runes','Runes glow in a sequence. Watch, then tap them in the same order.','The temple stones hum — the Forgotten Temple has awakened!',Q(E.seq,{it:['ᚠ','ᚢ','ᚦ','ᚨ','ᚱ','ᚲ'],L:[3,4,5],k:'rn'})),
    w2:M('Whispering Roots','Find the way from the entrance to the glowing heart of the tree. Tap one root at each fork — dead ends only wither gently.','The roots part — you reached the heart of the Ancient Hollow Tree!',Q(E.path,{d:3,b:3,n:'🌱',goal:'🌟',start:'🚪 Entrance'})),
    w3:M('Crystal Sequence','Crystals light up in order. Repeat it — each success adds one more crystal.','The crystals ring out in harmony!',Q(E.seq,{it:['💎','🔷','🔮','💠'],L:[3,4,5,6],ext:1,k:'cr'})),
    w4:M('Mushroom Hop','Tap the glowing mushroom before it fades. They get quicker!','The mushrooms bounce with joy!',Q(E.lit,{e:'🍄',n:6,t:1500,min:700,need:8})),
    w5:M('Follow the Footprints','Find the deer’s glowing prints and tap them in order along the trail. Other tracks are decoys.','You followed the trail — the Ancient Forest Deer is near!',Q(E.ord,{m:'trail',L:[3,4,5]})),
    w6:M('Wolf’s Howl','The wolf howls in glowing symbols. Repeat the pattern. No sound needed.','The wolf answers with a silver howl!',Q(E.seq,{it:['🌕','🌙','⭐','💫','🔵'],L:[3,4,5,6],k:'wf'})),
    w7:M('Catch the Moonlight','Tap the pools of moonlight before they fade away.','Moonlight pours through the canopy!',Q(E.lit,{e:'🌙',sp:1,t:1500,min:600,need:9})),
    w8:M('Rune Restoration','Tap the broken pieces to rotate them until the ancient rune is whole. Turning an upright piece counts as a slip.','The rune blazes with restored power!',E.rot),
    m1:M('Witch’s Potion','Memorize the recipe, then add the ingredients to the cauldron in order. Wrong ones just fizzle.','The cauldron glows — the potion is perfect! 🧪',Q(E.ord,{m:'flash',it:[{e:'🍄',n:'glowing mushroom'},{e:'💧',n:'moonwater'},{e:'✨',n:'firefly dust'},{e:'🍃',n:'magic leaf'},{e:'💎',n:'crystal'},{e:'🐸',n:'frog toe'}],L:[3,4],cl:t=>'Recipe: '+t.map(x=>x.e+' '+x.n).join(' → '),bad:'💥 Bloop! The cauldron burps purple smoke.'})),
    m2:M('Ruins Alignment','Tap each pillar to change its symbol until all match the pattern. Turning a matched pillar away counts as a slip.','The ruins awaken with a pulse of light!',E.cyc),
    m3:M('Mushroom Glow','Tap the glowing mushroom to collect its spores. More mushrooms appear and the glow gets shorter.','You gathered enough spores!',Q(E.lit,{e:'🍄',n:3,grow:1,t:1700,min:650,need:9})),
    m4:M('Twisted Branches','Climb from the roots to the glowing leaf. A wrong branch resets your path. The right way glows faintly as you climb.','You reached the glowing leaf!',Q(E.path,{d:4,b:3,rs:1,cl:2,n:'🌿',goal:'🍃',start:'🌳 Roots'})),
    m5:M('Firefly Gathering','Memorize the glow colors, then tap fireflies of those colors in order.','The fireflies gather and light up the swamp!',Q(E.ord,{m:'flash',ff:1,it:[FF('','Gold','#ffd24a'),FF('','Blue','#5ab6ff'),FF('','Purple','#b07cff')],L:[3,4,5],cl:t=>t.map(x=>x.e+' '+x.n).join(' → ')})),
    m6:M('Frog Spirit Rhythm','The frogs perform a sequence. Tap them in the same order. No sound needed.','All the frog spirits glow together!',Q(E.seq,{it:['🐸','🐸','🐸','🐸'],L:[3,4,5,6],k:'fg'})),
    g1:M('Everbloom — Grow the Flowers','Study the flower pattern. When it hides, tap the flowers in the same order.','The Flower Circle has awakened!',Q(E.seq,{it:['🌸','🌼','🌷','🌹'],L:[3,4,5],show:1})),
    g2:M('Light the Fairy Village','Read the clue, then light the fairy houses in the order it says.','The Fairy Village is glowing again!',Q(E.ord,{m:'clue',grow:1,it:hs.map((n,i)=>({e:`<small>${hi[i]}</small>🏡`,n})),L:[2,3,3],cl:t=>'First light the house beside the '+t.map(x=>x.n).join(', then the ')+'.'})),
    g3:M('Fountain of Wishes — Restore the Magic','Clear the blocked streams in the right order. The next obstacle begins to glow when you pause.','The Fountain of Wishes is flowing with magic!',Q(E.ord,{m:'glow',it:[{e:'🍃',n:'leaf'},{e:'🪨',n:'stone'},{e:'🌿',n:'vine'},{e:'🪵',n:'log'},{e:'🍂',n:'debris'}],L:[3,4,5]})),
    g4:M('Twilight Lanterns — Light the Garden Path','Watch the lanterns light up, then repeat the order.','The Lantern Path has come alive!',Q(E.seq,{it:hi,L:[3,4,5],k:'ln'})),
    g5:M('Guide the Butterflies','Tap a butterfly, then the flower of the same color to guide it home.','The butterflies have found their blossoms!',E.mt),
    g6:M('Befriend the Gentle Deer','Watch the deer and the scene for clues, then choose the kindest action.','The Gentle Deer trusts you!',E.dec),
    g7:M('Catch the Falling Blossoms','Tap the glowing petals. Plain petals are decoys!','The garden is filled with enchanted blossoms!',Q(E.fall,{e:'🌸',e2:'🌸',need:10,d:6500,iv:900})),
    g8:M('Grow the Enchanted Rose Vines','Grow the vine upward. Follow the glowing leaves to the healthiest branch.','The enchanted roses are in full bloom!',Q(E.path,{d:5,b:3,cl:1,n:'🌿',goal:'🌹',start:'🌱 Seed'}))
};

function mini(o){
    const g=MG[o.id],el=$('#mini'),t=++tok;
    let over=false,MS=0;const LIM=4;
    el.innerHTML=`<div class="top"><div class="lab">ROUND ${r} OF 5</div>${hrt()}<div class="bar"><i style="width:${(r-1)/5*100+10}%"></i></div></div>
    <div class="mg">
    <h2>${g.t}</h2>
    <p class="ins" id="in">${g.i} <em>Four slips and the Grove's magic weakens.</em></p>
    <div class="slips" id="sl"></div>
    <div class="play" id="pl"><div class="ic" style="margin-top:50px">${o.ic}</div></div>
    <div class="msg" id="mm"></div>
    <div class="row"><button class="btn" id="st">START</button><button class="btn alt" id="ct" hidden>CONTINUE</button></div>
    </div>`;
    const pl=$('#pl'),say=m=>$('#mm').textContent=m,
    win=()=>{
        if(over)return;over=true;
        if(t!=tok)return;
        say('✨ '+g.w);
        pl.classList.add('won');
        for(let i=0;i<5;i++)setTimeout(()=>sp(pl,pl.clientWidth*(.15+i*.18),pl.clientHeight/2),i*150);
        $('#ct').hidden=false;
    };
const pips=()=>{$('#sl').innerHTML=Array.from({length:LIM},(_,i)=>`<span class="${i<LIM-MS?'':'lost'}">🍃</span>`).join('');};
pips();
const fail=()=>{
    over=true;tok++;
    HP=Math.max(0,HP-1);DORM[o.id]=1;
    document.querySelector('#mini .hearts').outerHTML=hrt();
    say("💔 The Grove's magic weakens...");
    pl.classList.add('lost');
    $('#ct').hidden=false;
};
missFn=()=>{
    if(over||t!=tok)return true;
    MS++;pips();
    if(MS>=LIM){fail();return true;}
    return false;
};
$('#st').onclick=function(){
    this.hidden=true;
    $('#in').style.display='none';
    pl.innerHTML='';
    g.run(pl,say,win,()=>t==tok);
};
$('#ct').onclick=()=>{tok++;adv();};
}

