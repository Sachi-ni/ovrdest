let P=[], f="All", query="";
const tabs=$("tabs"), grid=$("grid"), lb=$("lb"), search=$("search"), clearSearch=$("clearSearch"), DEFAULT_SIZES=["S","M","L","XL","XXL"];

const money=n=>CURRENCY+" "+Number(n).toLocaleString("en-US");
const hasPrice=p=>typeof p.price==="number"&&isFinite(p.price)&&p.price>0;

/* Turn a Sanity document or a products.json row into one standard shape */
function normalise(r,i){
  return {
    id:r.id||r._id||("p"+i), name:r.name||"Untitled", colour:r.colour||"Black",
    price:(r.price===null||r.price===undefined||r.price==="")?null:Number(r.price),
    sizes:(Array.isArray(r.sizes)&&r.sizes.length)?r.sizes:DEFAULT_SIZES,
    inStock:r.inStock!==false, image:r.image||"", order:Number(r.order)||i+1
  };
}

async function fromSanity(){
  const q='*[_type=="product" && !(_id in path("drafts.**"))] | order(order asc, name asc){_id,name,colour,price,sizes,inStock,order,"image":photo.asset->url}';
  const url="https://"+SANITY_PROJECT_ID+".apicdn.sanity.io/v2024-01-01/data/query/"+SANITY_DATASET+"?query="+encodeURIComponent(q);
  const res=await fetch(url); if(!res.ok) throw new Error("Sanity "+res.status);
  const j=await res.json(); if(!Array.isArray(j.result)) throw new Error("Bad response");
  return j.result.map(r=>{ if(r.image) r.image+="?w=900&auto=format&q=80"; return r; });
}
async function fromFile(){
  const res=await fetch("products.json"); if(!res.ok) throw new Error("products.json "+res.status);
  return res.json();
}
async function load(){
  let rows=null;
  if(SANITY_PROJECT_ID){ try{ rows=await fromSanity(); }catch(e){ console.warn("Sanity unavailable, using products.json",e); } }
  if(!rows){ try{ rows=await fromFile(); }catch(e){ console.error(e); } }
  if(!rows){ grid.innerHTML='<p class="msg">We could not load the designs. Please message us on WhatsApp and we will help you order.</p>'; return; }
  P=rows.map(normalise).filter(p=>p.image).sort((a,b)=>a.order-b.order);
  buildTabs(); render();
}

function buildTabs(){
  tabs.innerHTML="";
  const colours=["All",...new Set(P.map(p=>p.colour))];
  if(colours.length<=2){ tabs.style.display="none"; return; }
  colours.forEach(t=>{const b=document.createElement("button");b.textContent=t==="All"?"All Designs":t+" Tees";b.dataset.t=t;b.onclick=()=>{f=t;render()};tabs.appendChild(b)});
}

function msg(i,size){
  const p=P[i];
  return `Hi OVRZD, I'd like to order:\n${p.name} (${p.colour}) oversized tee\nSize: ${size}\nQty: 1\n${hasPrice(p)?"Price: "+money(p.price)+"\n":""}Payment: Cash on delivery\n\nName:\nAddress:\nPhone:`;
}

function normaliseSearch(value){
  return value.trim().replace(/\s+/g," ").toLocaleLowerCase();
}

function render(){
  [...tabs.children].forEach(b=>b.classList.toggle("on",b.dataset.t===f));
  clearSearch.hidden=!search.value;
  const terms=normaliseSearch(query).split(" ").filter(Boolean);
  const list=P.map((p,i)=>({p,i})).filter(({p})=>{
    const searchable=normaliseSearch(p.name+" "+p.colour);
    return (f==="All"||p.colour===f)&&terms.every(term=>searchable.includes(term));
  });
  if(!list.length){
    grid.innerHTML=terms.length?'<p class="msg">No designs found. Try another name or colour.</p>':'<p class="msg">No designs to show right now.</p>';
    return;
  }
  grid.innerHTML=list.map(({p,i})=>{
    const out=!p.inStock, dis=out?' aria-disabled="true" tabindex="-1"':'';
    return `<div class="card${out?" sold":""}">${out?'<span class="tag">Sold out</span>':""}<img loading="lazy" src="${esc(p.image)}" alt="${esc(p.name)} ${esc(p.colour)} oversized tee">
<div class="body"><h3>${esc(p.name)}</h3><small>${esc(p.colour)} oversized tee</small>
${hasPrice(p)?`<div class="price">${money(p.price)}</div>`:`<div class="price ask">Message us for price</div>`}
<div class="row">${p.sizes.map((s,k)=>`<label><input type="radio" name="s${i}" value="${esc(s)}" ${k===Math.min(2,p.sizes.length-1)?"checked":""} ${out?"disabled":""}><span>${esc(s)}</span></label>`).join("")}</div>
<div class="acts"><a class="btn wa" data-i="${i}" data-t="w" href="#" target="_blank" rel="noopener"${dis}>WhatsApp</a><a class="btn out" data-i="${i}" data-t="e" href="#"${dis}>Email</a></div></div></div>`}).join("");
}

if(tabs&&grid){
  if(search&&clearSearch){
    search.addEventListener("input",()=>{query=search.value;render()});
    clearSearch.addEventListener("click",()=>{search.value="";query="";render();search.focus()});
  }
  grid.addEventListener("click",e=>{
    if(e.target.tagName==="IMG"&&lb){lb.firstChild.src=e.target.src;lb.classList.add("on");return}
    const a=e.target.closest("a[data-i]"); if(!a) return;
    if(a.getAttribute("aria-disabled")==="true"){e.preventDefault();return}
    const i=+a.dataset.i, sel=document.querySelector('input[name="s'+i+'"]:checked');
    const m=msg(i, sel?sel.value:"M");
    a.href=a.dataset.t==="w"?wa(m):"mailto:"+EM+"?subject="+encodeURIComponent("Order: "+P[i].name+" ("+P[i].colour+")")+"&body="+encodeURIComponent(m);
  });
  if(lb){
    lb.onclick=()=>lb.classList.remove("on");
    addEventListener("keydown",e=>{if(e.key==="Escape")lb.classList.remove("on")});
  }
  load();
}
