/* Python Space Quest: shared crew, XP, badges and page helpers for every World.
   Each World page sets window.QUEST = { world, bossId, lessons:{stationKey:[taskIds]} }
   before loading this file. Every task button / quiz carries data-id and data-xp. */
(function(){
  const KEY = "pyquest-v1";          // one save shared by all Worlds
  const OLD_W1 = "pyquest-w1-v1";    // first World 1 release saved here
  const CFG = window.QUEST || {world:1, lessons:{}, bossId:""};

  const AVATARS = ["🧑‍🚀","👩‍🚀","👨‍🚀","🤖","👽","🐱","🐶","🦊","🐼","🦄","🐉","🦖"];
  const RANKS = [
    [0,"Code Cadet","🧑‍🚀"],[100,"Space Explorer","🔭"],[250,"Rocket Pilot","🛸"],
    [450,"Star Captain","🌟"],[750,"Galaxy Guardian","🛡️"],[1100,"Fleet Commander","🎖️"],
    [1500,"Nebula Navigator","🌌"],[2000,"Cosmic Legend","🏆"]
  ];
  const BADGES = [
    // World 1
    {w:1,icon:"🗣️",name:"First Words",how:"Run your first program in Lesson 1",req:["l1-try"]},
    {w:1,icon:"🚀",name:"Liftoff",how:"Finish a Lesson 2 countdown challenge (any level)",any:["l2-c1","l2-c2","l2-c3"]},
    {w:1,icon:"🧮",name:"Space Calculator",how:"Get every Lesson 3 quiz question right",req:["l3-q1","l3-q2","l3-q3"]},
    {w:1,icon:"🎨",name:"Star Artist",how:"Finish any Lesson 4 challenge",any:["l4-c1","l4-c2","l4-c3"]},
    {w:1,icon:"🐛",name:"Bug Squasher",how:"Fix all 4 World 1 bug hunts",req:["l1-bug","l2-bug","l3-bug","l4-bug"]},
    {w:1,icon:"🤝",name:"Pair Power",how:"Do all 4 World 1 pair activities",req:["l1-pair","l2-pair","l3-pair","l4-pair"]},
    {w:1,icon:"🦸",name:"Hero Coder",how:"Finish all 4 World 1 Hero (⭐⭐⭐) challenges",req:["l1-c3","l2-c3","l3-c3","l4-c3"]},
    {w:1,icon:"🕹️",name:"Robot Commander",how:"Play the Robot Commander game",req:["un-play"]},
    {w:1,icon:"👑",name:"World 1 Champion",how:"Beat the Mission Patch boss",req:["boss-done"]},
    // World 2
    {w:2,icon:"📦",name:"Box Maker",how:"Run your first variable program in Lesson 1",req:["m1-try"]},
    {w:2,icon:"⛽",name:"Fuel Tracker",how:"Finish a Lesson 2 challenge (any level)",any:["m2-c1","m2-c2","m2-c3"]},
    {w:2,icon:"🎤",name:"Question Master",how:"Finish a Lesson 3 challenge (any level)",any:["m3-c1","m3-c2","m3-c3"]},
    {w:2,icon:"🔢",name:"Number Wizard",how:"Get every Lesson 4 quiz question right",req:["m4-q1","m4-q2","m4-q3"]},
    {w:2,icon:"🪲",name:"Super Bug Squasher",how:"Fix all 4 World 2 bug hunts",req:["m1-bug","m2-bug","m3-bug","m4-bug"]},
    {w:2,icon:"🫂",name:"Dream Team",how:"Do all 4 World 2 pair activities",req:["m1-pair","m2-pair","m3-pair","m4-pair"]},
    {w:2,icon:"⚡",name:"Super Hero Coder",how:"Finish all 4 World 2 Hero (⭐⭐⭐) challenges",req:["m1-c3","m2-c3","m3-c3","m4-c3"]},
    {w:2,icon:"🥤",name:"Box Swapper",how:"Play the Box Swap game",req:["w2-un"]},
    {w:2,icon:"🛂",name:"World 2 Champion",how:"Beat the Space Passport boss",req:["w2-boss"]},
    // World 3
    {w:3,icon:"⚖️",name:"True or False",how:"Run your first comparison program in Lesson 1",req:["d1-try"]},
    {w:3,icon:"🚦",name:"Decision Maker",how:"Finish a Lesson 2 challenge (any level)",any:["d2-c1","d2-c2","d2-c3"]},
    {w:3,icon:"🔀",name:"Path Finder",how:"Finish a Lesson 3 challenge (any level)",any:["d3-c1","d3-c2","d3-c3"]},
    {w:3,icon:"🎲",name:"Quiz Show Host",how:"Get every Lesson 4 quiz question right",req:["d4-q1","d4-q2","d4-q3"]},
    {w:3,icon:"🔦",name:"Bug Detective",how:"Fix all 4 World 3 bug hunts",req:["d1-bug","d2-bug","d3-bug","d4-bug"]},
    {w:3,icon:"🧩",name:"Perfect Pair",how:"Do all 4 World 3 pair activities",req:["d1-pair","d2-pair","d3-pair","d4-pair"]},
    {w:3,icon:"🌠",name:"Mega Hero Coder",how:"Finish all 4 World 3 Hero (⭐⭐⭐) challenges",req:["d1-c3","d2-c3","d3-c3","d4-c3"]},
    {w:3,icon:"🙋",name:"If-Machine",how:"Play the Human If-Machine game",req:["w3-un"]},
    {w:3,icon:"🗺️",name:"World 3 Champion",how:"Beat the Space Adventure boss",req:["w3-boss"]},
    // World 4
    {w:4,icon:"🔁",name:"Loop Starter",how:"Run your first loop in Lesson 1",req:["r1-try"]},
    {w:4,icon:"⏱️",name:"Count Master",how:"Finish a Lesson 2 challenge (any level)",any:["r2-c1","r2-c2","r2-c3"]},
    {w:4,icon:"🖼️",name:"Loop Artist",how:"Finish a Lesson 3 challenge (any level)",any:["r3-c1","r3-c2","r3-c3"]},
    {w:4,icon:"♾️",name:"While Wizard",how:"Get every Lesson 4 quiz question right",req:["r4-q1","r4-q2","r4-q3"]},
    {w:4,icon:"🕷️",name:"Bug Hunter Pro",how:"Fix all 4 World 4 bug hunts",req:["r1-bug","r2-bug","r3-bug","r4-bug"]},
    {w:4,icon:"👯",name:"Loop Buddies",how:"Do all 4 World 4 pair activities",req:["r1-pair","r2-pair","r3-pair","r4-pair"]},
    {w:4,icon:"💫",name:"Ultra Hero Coder",how:"Finish all 4 World 4 Hero (⭐⭐⭐) challenges",req:["r1-c3","r2-c3","r3-c3","r4-c3"]},
    {w:4,icon:"💃",name:"Loop Dancer",how:"Play the Loop Dance game",req:["w4-un"]},
    {w:4,icon:"🪐",name:"World 4 Champion",how:"Beat the Hidden Planet boss",req:["w4-boss"]}
  ];

  const XP = {};
  document.querySelectorAll("[data-id][data-xp]").forEach(el=>{XP[el.dataset.id]=+el.dataset.xp});

  // ---------- storage ----------
  function w1xp(id){ if(id==="un-play")return 20; if(id==="boss-done")return 50; const m=(id.split("-")[1]||""); return {c2:20,c3:30,bug:20}[m]||10; }
  let state = {players:[],active:null,done:{}};
  try{
    const s = JSON.parse(localStorage.getItem(KEY));
    if(s && Array.isArray(s.players)) state = Object.assign(state,s);
    else {
      const o = JSON.parse(localStorage.getItem(OLD_W1));
      if(o && Array.isArray(o.players)){
        state.players=o.players; state.active=o.active;
        Object.keys(o.done||{}).forEach(pid=>{state.done[pid]={};Object.keys(o.done[pid]).forEach(k=>{state.done[pid][k]=w1xp(k)})});
        localStorage.setItem(KEY,JSON.stringify(state));
      }
    }
  }catch(e){}
  function save(){try{localStorage.setItem(KEY,JSON.stringify(state))}catch(e){}}

  const $ = s=>document.querySelector(s);
  const toastEl = $("#toast"); let toastT;
  function toast(msg){toastEl.textContent=msg;toastEl.classList.add("show");clearTimeout(toastT);toastT=setTimeout(()=>toastEl.classList.remove("show"),2400)}

  function player(){return state.players.find(p=>p.id===state.active)||null}
  function doneOf(pid){return state.done[pid]||(state.done[pid]={})}
  function xpOf(pid){const d=state.done[pid]||{};return Object.keys(d).reduce((a,k)=>a+(Number(d[k])||0),0)}
  function rankOf(xp){let r=RANKS[0];RANKS.forEach(x=>{if(xp>=x[0])r=x});return r}
  function nextRank(xp){return RANKS.find(x=>x[0]>xp)||null}
  function badgesOf(pid){const d=state.done[pid]||{};return BADGES.filter(b=>b.req?b.req.every(k=>d[k]):b.any.some(k=>d[k]))}

  // ---------- rank + badge tables ----------
  const rt=$("#rank-table");
  if(rt) RANKS.forEach(r=>{const tr=document.createElement("tr");tr.innerHTML=`<td>${r[2]} ${r[1]}</td><td>${r[0]}</td>`;rt.appendChild(tr)});
  const bt=$("#badge-table");
  if(bt) BADGES.filter(b=>b.w===CFG.world).forEach(b=>{const tr=document.createElement("tr");tr.innerHTML=`<td>${b.icon} ${b.name}</td><td>${b.how}</td>`;bt.appendChild(tr)});

  // ---------- add crew ----------
  let pickedAvatar = AVATARS[0];
  const ap=$("#avatar-pick");
  AVATARS.forEach(a=>{const b=document.createElement("button");b.type="button";b.textContent=a;b.setAttribute("aria-label","Avatar "+a);b.setAttribute("aria-pressed",a===pickedAvatar);
    b.addEventListener("click",()=>{pickedAvatar=a;ap.querySelectorAll("button").forEach(x=>x.setAttribute("aria-pressed",x===b))});ap.appendChild(b)});

  $("#add-form").addEventListener("submit",e=>{
    e.preventDefault();
    const input=$("#new-name"); const name=input.value.trim(); if(!name) return;
    const p={id:Date.now().toString(36)+Math.random().toString(36).slice(2,6),name,avatar:pickedAvatar};
    state.players.push(p); state.active=p.id; input.value=""; save(); render();
    toast(`Welcome aboard, ${name}! ${p.avatar}`);
  });

  $("#active-player").addEventListener("change",e=>{state.active=e.target.value;save();render();const p=player();if(p)toast(`${p.avatar} ${p.name} is playing now`)});

  function award(id){
    const p=player();
    if(!p){toast("Add a crew member first!");location.hash="#crew";return}
    const before=badgesOf(p.id).map(b=>b.name); const rBefore=rankOf(xpOf(p.id))[1];
    doneOf(p.id)[id]=XP[id]||0; save(); render();
    const newB=badgesOf(p.id).filter(b=>!before.includes(b.name)); const rAfter=rankOf(xpOf(p.id));
    let msg=`+${XP[id]} XP for ${p.name}!`;
    if(newB.length) msg=`${newB[0].icon} Badge unlocked: ${newB[0].name}!`;
    if(rAfter[1]!==rBefore) msg=`${rAfter[2]} ${p.name} is now a ${rAfter[1]}!`;
    toast(msg);
  }

  document.querySelectorAll(".task").forEach(btn=>{
    btn.dataset.label=btn.textContent;
    btn.addEventListener("click",()=>{
      const p=player(); const id=btn.dataset.id;
      if(p&&doneOf(p.id)[id]!==undefined){delete doneOf(p.id)[id];save();render();toast("Unmarked. Tap again to mark it done.");return}
      award(id);
    });
  });

  document.querySelectorAll(".quiz").forEach(q=>{
    q.querySelectorAll(".choices button").forEach(b=>{
      b.type="button";
      b.addEventListener("click",()=>{
        const p=player(); if(!p){toast("Add a crew member first!");location.hash="#crew";return}
        if(doneOf(p.id)[q.dataset.id]!==undefined) return;
        const fb=q.querySelector(".feedback");
        if(b.hasAttribute("data-ok")) award(q.dataset.id);
        else{b.classList.add("wrong");fb.textContent="Not quite. Try another answer!";fb.className="feedback no"}
      });
    });
  });

  $("#reset-ask").addEventListener("click",()=>{$("#reset-confirm").hidden=false});
  $("#reset-no").addEventListener("click",()=>{$("#reset-confirm").hidden=true});
  $("#reset-yes").addEventListener("click",()=>{state={players:[],active:null,done:{}};save();$("#reset-confirm").hidden=true;render();toast("All scores deleted.")});

  function render(){
    if(!player()&&state.players.length) state.active=state.players[0].id;
    const p=player();
    const sel=$("#active-player"); sel.innerHTML="";
    if(!state.players.length){const o=document.createElement("option");o.textContent="Add your crew below";o.value="";sel.appendChild(o);sel.disabled=true}
    else{sel.disabled=false;state.players.forEach(pl=>{const o=document.createElement("option");o.value=pl.id;o.textContent=`${pl.avatar} ${pl.name}`;if(pl.id===state.active)o.selected=true;sel.appendChild(o)})}
    const xp=p?xpOf(p.id):0;
    $("#xp-pill").innerHTML=`⭐ <b>${xp}</b> XP · ${rankOf(xp)[1]}`;

    const list=$("#crew-list"); list.innerHTML="";
    if(!state.players.length){list.innerHTML=`<div class="empty">No crew yet. Type a name below, pick an avatar and tap <b>Add to crew</b>. Add one card for each learner.</div>`}
    state.players.forEach(pl=>{
      const x=xpOf(pl.id), r=rankOf(x), n=nextRank(x);
      const pct=n?Math.round((x-r[0])/(n[0]-r[0])*100):100;
      const card=document.createElement("div"); card.className="card player"+(pl.id===state.active?" active":"");
      card.innerHTML=`<div class="player-top"><div class="avatar">${pl.avatar}</div><div style="min-width:0"><div class="player-name"></div><div class="rank">${r[2]} ${r[1]} · <b>${x}</b> XP</div></div></div>
        <div class="bar" aria-hidden="true"><span style="width:${pct}%"></span></div>
        <div class="rank">${n?`${n[0]-x} XP to ${n[1]}`:"Top rank reached!"}</div>
        <div class="badges" aria-label="Badges">${badgesOf(pl.id).map(b=>`<span title="${b.name}">${b.icon}</span>`).join("")||'<span class="rank">No badges yet</span>'}</div>
        <div class="player-actions"></div>`;
      card.querySelector(".player-name").textContent=pl.name;
      const acts=card.querySelector(".player-actions");
      if(pl.id!==state.active){const b=document.createElement("button");b.className="btn small";b.type="button";b.textContent="Play as "+pl.name;b.addEventListener("click",()=>{state.active=pl.id;save();render();toast(`${pl.avatar} ${pl.name} is playing now`)});acts.appendChild(b)}
      const rm=document.createElement("button");rm.className="btn ghost small";rm.type="button";rm.textContent="Remove";
      rm.addEventListener("click",()=>{
        if(rm.dataset.sure){state.players=state.players.filter(z=>z.id!==pl.id);delete state.done[pl.id];if(state.active===pl.id)state.active=state.players[0]?state.players[0].id:null;save();render();toast(`${pl.name} left the crew.`)}
        else{rm.dataset.sure="1";rm.textContent="Tap again to remove";rm.classList.add("danger");rm.classList.remove("ghost")}
      });
      acts.appendChild(rm);
      list.appendChild(card);
    });

    const d=p?(state.done[p.id]||{}):{};
    const has=k=>d[k]!==undefined;
    document.querySelectorAll(".task").forEach(btn=>{
      const on=has(btn.dataset.id); btn.classList.toggle("is-done",on);
      btn.textContent=on?"✓ Done!":btn.dataset.label; btn.setAttribute("aria-pressed",on);
    });
    document.querySelectorAll(".quiz").forEach(q=>{
      const on=has(q.dataset.id); const fb=q.querySelector(".feedback");
      q.querySelectorAll(".choices button").forEach(b=>{b.classList.remove("wrong");b.classList.toggle("right",on&&b.hasAttribute("data-ok"))});
      if(on){fb.textContent="✓ "+q.dataset.explain+` +${XP[q.dataset.id]} XP`;fb.className="feedback ok"}else{fb.textContent="";fb.className="feedback"}
    });
    document.querySelectorAll(".station").forEach(st=>{
      const ids=CFG.lessons[st.dataset.lesson]||[]; const n=ids.filter(has).length;
      st.classList.toggle("done",!!p&&n===ids.length);
      st.querySelector(".prog").textContent=p?(n===ids.length?"✓ Complete":`${n} of ${ids.length} done`):`${ids.length} tasks`;
    });
    const cert=$("#cert"); const won=!!(p&&has(CFG.bossId));
    if(cert){cert.classList.toggle("show",won);
      if(won){$("#cert-name").textContent=`${p.avatar} ${p.name}`;$("#cert-rank").textContent=rankOf(xp)[1]}}
  }

  // ---------- code colouring + copy buttons ----------
  function esc(s){return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}
  const RE=/(#.*$)|("[^"\n]*"?|'[^'\n]*'?)|\b(print|input|int|if|elif|else|for|in|range|while|import|and|or|not|True|False|break)\b|\b(\d+(?:\.\d+)?)\b/gm;
  document.querySelectorAll("pre.code").forEach(pre=>{
    if(pre.getAttribute("aria-label")) return; // diagrams stay plain
    const raw=pre.textContent; let out="",last=0;
    raw.replace(RE,(m,c,s,k,n,i)=>{out+=esc(raw.slice(last,i));
      out+=c?`<span class="tok-com">${esc(m)}</span>`:s?`<span class="tok-str">${esc(m)}</span>`:k?`<span class="tok-kw">${esc(m)}</span>`:`<span class="tok-num">${esc(m)}</span>`;
      last=i+m.length;return m});
    out+=esc(raw.slice(last)); pre.innerHTML=out;
    if(pre.parentElement.classList.contains("codebox")){
      const b=document.createElement("button");b.className="copy";b.type="button";b.textContent="Copy";
      b.addEventListener("click",()=>{
        const done=()=>{b.textContent="Copied!";setTimeout(()=>b.textContent="Copy",1500)};
        const fallback=()=>{const r=document.createRange();r.selectNodeContents(pre);const s=getSelection();s.removeAllRanges();s.addRange(r);b.textContent="Selected, now copy";setTimeout(()=>b.textContent="Copy",2000)};
        try{navigator.clipboard.writeText(raw).then(done,fallback)}catch(e){fallback()}
      });
      pre.parentElement.appendChild(b);
    }
  });

  // ---------- hero starfield ----------
  const cv=$("#stars");
  if(cv){
    const ctx=cv.getContext("2d");
    const reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
    const label=cv.dataset.text||'print("BLAST OFF!")';
    const planetColor=cv.dataset.planet||"#5ec2ff";
    let W,H,stars=[];
    function size(){const r=cv.getBoundingClientRect();const dpr=Math.min(devicePixelRatio||1,2);W=r.width;H=r.height;cv.width=W*dpr;cv.height=H*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);
      stars=Array.from({length:Math.round(W/6)},()=>({x:Math.random()*W,y:Math.random()*H,r:Math.random()*1.4+.3,s:Math.random()*.6+.2}))}
    size(); addEventListener("resize",size);
    let t=0;
    (function draw(){
      ctx.clearRect(0,0,W,H);
      stars.forEach(s=>{ctx.globalAlpha=.5+.5*Math.sin(t*.03*s.s+s.x);ctx.fillStyle="#dbe5ff";ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,7);ctx.fill();if(!reduce){s.x-=s.s;if(s.x<0)s.x=W}});
      ctx.globalAlpha=1;
      ctx.fillStyle=planetColor;ctx.beginPath();ctx.arc(W-50,H-10,46,0,7);ctx.fill();
      ctx.fillStyle="rgba(0,0,0,.18)";ctx.beginPath();ctx.arc(W-38,H+2,46,0,7);ctx.fill();
      const rx=W*.22,ry=H/2+(reduce?0:Math.sin(t*.05)*6);
      ctx.save();ctx.translate(rx,ry);
      ctx.fillStyle="#ffb03a";ctx.beginPath();ctx.moveTo(-34,0);ctx.lineTo(-22,-7);ctx.lineTo(-22,7);ctx.fill();
      ctx.fillStyle="#ffffff";ctx.beginPath();ctx.moveTo(26,0);ctx.quadraticCurveTo(10,-12,-22,-10);ctx.lineTo(-22,10);ctx.quadraticCurveTo(10,12,26,0);ctx.fill();
      ctx.fillStyle="#e8541f";ctx.beginPath();ctx.moveTo(-14,-10);ctx.lineTo(-24,-20);ctx.lineTo(-24,-9);ctx.fill();ctx.beginPath();ctx.moveTo(-14,10);ctx.lineTo(-24,20);ctx.lineTo(-24,9);ctx.fill();
      ctx.fillStyle="#5ec2ff";ctx.beginPath();ctx.arc(6,0,4.5,0,7);ctx.fill();
      ctx.restore();
      ctx.fillStyle="#a6f0a6";ctx.font="600 13px JetBrains Mono, monospace";ctx.fillText(label,rx+40,ry+4);
      t++; if(!reduce) requestAnimationFrame(draw);
    })();
  }

  render();
})();
