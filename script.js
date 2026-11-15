// ======= PERSONALIZA AQUÍ =======
const CONFIG = {
  carta: [
    "¡Feliz cumpleaños!",
    "¡Felices 24 años! Espero que hoy tengas un día increíble, lleno de sonrisas, abrazos y momentos muy bonitos.",
    "Quiero que sepas que te quiero muchísimo y que me alegra poder celebrar un año más de tu vida. Deseo de todo corazón que esta nueva etapa venga acompañada de muchas alegrías, sueños cumplidos y experiencias que te hagan muy feliz.",
    "Gracias por ser una persona tan especial. Espero que nunca te falten motivos para sonreír, personas que te quieran tanto como mereces y momentos que te recuerden lo bonita que es la vida.",
    "Disfruta muchísimo tu día, ríe, celebra y déjate consentir. Nunca olvides lo mucho que te quiero y lo importante que eres para mí.",
    "Te deseo todo lo bonito que existe, hoy y siempre.",
    "¡Feliz cumpleaños! Te quiero muchísimo."
  ],
  lineas: ["FELIZ", "CUMPLEAÑOS", "24 años"]   // texto de la animación final
};
// ================================
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
let vistaAct="inicio", animId=0;
function ir(id){
  vistaAct=id; $$(".vista").forEach(v=>v.classList.toggle("on",v.id===id));
  $$("#nav a").forEach(a=>a.classList.toggle("on",a.dataset.go===id));
  cancelAnimationFrame(animId); if(id==="final") document.fonts.load('700 20px "Playfair Display"').finally(()=>{ if(vistaAct==="final") finale() }); if(id==="carta") carta();
}
document.addEventListener("click",e=>{const g=e.target.closest("[data-go]"); if(g) ir(g.dataset.go)});
$("#abrir").onclick=$("#regalo").onclick=()=>{$("#regalo").classList.add("abre"); confeti(); setTimeout(()=>ir("sorpresa"),1100)};
// ---- carta (aparece párrafo por párrafo)
function carta(){
  const p=$("#papel"); p.innerHTML="";
  CONFIG.carta.forEach((t,i)=>{ const e=document.createElement(i?"p":"h3"); e.textContent=t; if(i) e.style.animationDelay=(i*0.7)+"s"; p.appendChild(e); });
}
// ---- flores dibujadas (SVG animado)
const COL=["#ffffff","#c9a6ff","#9b5cff","#7a2cf0","#e9dcff"];
$("#jardin").onclick=e=>{
  const r=e.currentTarget.getBoundingClientRect(), x=e.clientX-r.left, y=e.clientY-r.top, H=r.height-y+30;
  const n=5+(Math.random()*4|0), col=COL[Math.random()*COL.length|0], sz=14+Math.random()*10;
  let pet=""; for(let i=0;i<n;i++) pet+=`<ellipse cx="0" cy="${-sz}" rx="${sz*.55}" ry="${sz}" fill="${col}" opacity=".92" transform="rotate(${i*360/n})"/>`;
  const s=document.createElementNS("http://www.w3.org/2000/svg","svg");
  s.setAttribute("width",80); s.setAttribute("height",H); s.setAttribute("viewBox",`0 0 80 ${H}`);
  s.style.left=(x-40)+"px"; s.style.top=(y-30)+"px";
  const L=H-30, dir=Math.random()<.5?-1:1;
  s.innerHTML=`<path class="tallo" style="--l:${L*1.2}" d="M40 30 Q${40+dir*12} ${30+L/2} 40 ${H}"/>
   <ellipse class="hoja" cx="${40+dir*12}" cy="${30+L*.6}" rx="12" ry="5" transform="rotate(${-dir*25} ${40+dir*12} ${30+L*.6})"/>
   <g transform="translate(40 30)"><g class="cab">${pet}<circle r="${sz*.42}" fill="#16081f" stroke="#fff" stroke-width="2"/></g></g>`;
  $("#jardin").appendChild(s);
};
// ---- pastel
$("#tarta").onclick=()=>{
  const v=$$(".vela:not(.off)"); if(v.length) v[0].classList.add("off");
  if(!$$(".vela:not(.off)").length){ $("#pistaPastel").textContent="Pide un deseo"; confeti(); $("#alFinal").classList.add("on"); }
};
$("#alFinal").onclick=()=>ir("final");
$("#repetir").onclick=()=>{cancelAnimationFrame(animId); finale()};
// ---- confeti (morado / blanco)
function confeti(){
  const c=$("#confeti"),x=c.getContext("2d"); c.width=innerWidth; c.height=innerHeight;
  const cs=["#fff","#e9dcff","#c9a6ff","#9b5cff","#7a2cf0"];
  const p=Array.from({length:130},()=>({x:innerWidth/2,y:innerHeight/2,vx:(Math.random()-.5)*14,vy:-Math.random()*14-3,c:cs[Math.random()*5|0],s:5+Math.random()*6}));
  (function t(n){x.clearRect(0,0,c.width,c.height);p.forEach(q=>{q.x+=q.vx;q.y+=q.vy;q.vy+=.3;x.fillStyle=q.c;x.fillRect(q.x,q.y,q.s,q.s)});if(n>110)x.clearRect(0,0,c.width,c.height);else requestAnimationFrame(()=>t(n+1))})(0);
}
// ---- animación final: letras-fuegos artificiales -> texto -> globos
function finale(){
  const c=$("#lienzo"),x=c.getContext("2d"); c.width=innerWidth; c.height=innerHeight;
  const W=c.width,H=c.height, tam=Math.max(18,Math.min(W/11,54)), paso=tam*1.05;
  const fuente=k=>`700 ${k}px "Playfair Display",Georgia,serif`;
  const L=[], n=CONFIG.lineas.length;
  CONFIG.lineas.forEach((ln,i)=>{
    const t=ln.split(""), ancho=t.length*paso, y=H/2+(i-(n-1)/2)*tam*1.8;
    t.forEach((ch,j)=>{ if(ch===" ")return;
      const px=W/2-ancho/2+j*paso+paso/2, hue=255+Math.random()*50, col=j%3===0?"#fff":`hsl(${hue},90%,68%)`;
      L.push({ch,tx:px,ty:y,hue,col,x:px,y:H+20,fase:"sube",d:Math.random()*90,vx:0,vy:0,g:0,b:0});
    });
  });
  const F=[]; let t0=0;
  (function bucle(){
    t0++; x.fillStyle="rgba(5,3,10,.28)"; x.fillRect(0,0,W,H);
    x.textAlign="center"; x.textBaseline="middle";
    L.forEach(l=>{
      if(t0<l.d) return;
      if(l.fase==="sube"){ l.y-=(l.y-l.ty)*.045+4; x.fillStyle=l.col; x.beginPath(); x.arc(l.x,l.y,3,0,7); x.fill();
        if(l.y-l.ty<24){ l.fase="texto"; for(let k=0;k<22;k++){const a=Math.random()*6.28,s=Math.random()*4+1; F.push({x:l.x,y:l.y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,h:l.hue,v:1})} l.t=0; } }
      else if(l.fase==="texto"){ l.t++; x.fillStyle=l.col; x.font=fuente(tam); x.fillText(l.ch,l.x,l.y);
        if(l.t>260+l.d*.3){ l.fase="globo"; l.vy=-.8-Math.random()*1.2; l.vx=(Math.random()-.5)*.8; l.b=Math.random()*6; } }
      else { l.b+=.04; l.x+=l.vx+Math.sin(l.b)*.5; l.y+=l.vy;
        x.strokeStyle="#6b5a8a"; x.beginPath(); x.moveTo(l.x,l.y+tam*.55); x.quadraticCurveTo(l.x+6,l.y+tam,l.x,l.y+tam*1.5); x.stroke();
        x.fillStyle=l.col; x.beginPath(); x.ellipse(l.x,l.y,tam*.42,tam*.55,0,0,7); x.fill();
        x.fillStyle=l.col==="#fff"?"#7a2cf0":"#fff"; x.font=fuente(tam*.6); x.fillText(l.ch,l.x,l.y); }
    });
    F.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.vy+=.05;p.v-=.015;x.fillStyle=`hsla(${p.h},90%,70%,${Math.max(p.v,0)})`;x.fillRect(p.x,p.y,2.5,2.5)});
    for(let i=F.length-1;i>=0;i--) if(F[i].v<=0)F.splice(i,1);
    if(L.every(l=>l.fase==="globo"&&l.y<-80)){ setTimeout(()=>{ if(vistaAct==="final") finale() },900); return; }
    animId=requestAnimationFrame(bucle);
  })();
}
addEventListener("resize",()=>{ if(vistaAct==="final"){cancelAnimationFrame(animId); finale()} });
ir("inicio");
