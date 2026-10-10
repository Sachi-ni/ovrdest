/* OVRZD size guide: adds a "Size guide" link to every product card and to the collection heading.
   Opens a popup with a readable size table plus the full size chart image.
   Self-contained: it injects its own styles and popup. Needs images/size-chart.webp.
   To change the measurements, edit the DATA block below (and replace images/size-chart.webp). */
(function(){
  /* ---------- DATA (inches) ---------- */
  var IMG="images/size-chart.webp";
  var SIZES=["M","L","XL"];
  var ROWS=[["Chest (width)",["21.5","22","23"]],["Length",["27.5","28.7","29.5"]],["Sleeve",["10","10.5","11"]]];
  var WA="94714074497";

  /* ---------- STYLES ---------- */
  var css=''
  +'.sg-link{display:inline-flex;align-items:center;gap:6px;margin:12px 0 0;padding:0;background:none;border:0;color:var(--ac,#e8d9b5);font:500 13px var(--h,system-ui,sans-serif);cursor:pointer;text-decoration:underline;text-underline-offset:3px}'
  +'.sg-link:hover{filter:brightness(1.15)}'
  +'.sg-link+.row{margin-top:10px}'
  +'.sg-page{text-align:center;margin:0 0 24px}.sg-page .sg-link{margin:0;font-size:14px}'
  +'.sg{position:fixed;inset:0;z-index:40;display:grid;place-items:center;background:#000d;padding:16px}'
  +'.sg[hidden]{display:none}'
  +'.sg-box{position:relative;width:min(760px,100%);max-height:100%;overflow:auto;background:var(--card,#151515);color:var(--fg,#f5f5f5);border:1px solid var(--line,#262626);border-radius:20px;padding:28px 24px 24px;outline:none}'
  +'.sg-box h2{font:700 26px var(--h,system-ui,sans-serif);margin:0 0 6px}'
  +'.sg-x{position:absolute;top:12px;right:12px;width:40px;height:40px;border-radius:50%;border:1.5px solid var(--line,#262626);background:#0c0c0c;color:var(--fg,#f5f5f5);font-size:22px;line-height:1;cursor:pointer}'
  +'.sg-note{color:var(--mut,#a0a0a0);font-size:14px;margin:0 0 16px}'
  +'.sg-scroll{overflow-x:auto}'
  +'.sg table{width:100%;border-collapse:collapse;font-size:15px;min-width:320px}'
  +'.sg th,.sg td{padding:12px 10px;text-align:center;border-bottom:1px solid var(--line,#262626)}'
  +'.sg thead th{font:700 15px var(--h,system-ui,sans-serif);color:var(--ac,#e8d9b5)}'
  +'.sg tbody th{text-align:left;font-weight:600}'
  +'.sg-how{display:grid;gap:8px;margin:18px 0;color:var(--mut,#a0a0a0);font-size:14px}'
  +'.sg-how b{color:var(--fg,#f5f5f5);font-weight:600}'
  +'.sg-img{display:block;text-decoration:none;color:var(--mut,#a0a0a0);font-size:13px;text-align:center}'
  +'.sg-img img{display:block;width:100%;height:auto;border-radius:12px;border:1px solid var(--line,#262626);margin-bottom:8px;background:#fff}'
  +'.sg-help{margin:16px 0 0;text-align:center;color:var(--mut,#a0a0a0);font-size:14px}'
  +'.sg-help a{color:var(--ac,#e8d9b5)}'
  +'@media(max-width:520px){.sg-box{padding:24px 16px 18px}.sg th,.sg td{padding:10px 6px}}';
  var st=document.createElement('style'); st.textContent=css; document.head.appendChild(st);

  /* ---------- POPUP ---------- */
  var head='<tr><th scope="col">Size (inches)</th>'+SIZES.map(function(s){return '<th scope="col">'+s+'</th>'}).join('')+'</tr>';
  var body=ROWS.map(function(r){return '<tr><th scope="row">'+r[0]+'</th>'+r[1].map(function(v){return '<td>'+v+'</td>'}).join('')+'</tr>'}).join('');
  var box=document.createElement('div'); box.className='sg'; box.hidden=true;
  box.innerHTML='<div class="sg-box" role="dialog" aria-modal="true" aria-labelledby="sgTitle" tabindex="-1">'
   +'<button class="sg-x" type="button" aria-label="Close size guide">&times;</button>'
   +'<h2 id="sgTitle">Size guide</h2>'
   +'<p class="sg-note">All measurements are in inches, taken with the T-shirt laid flat.</p>'
   +'<div class="sg-scroll"><table><thead>'+head+'</thead><tbody>'+body+'</tbody></table></div>'
   +'<div class="sg-how"><div><b>Chest (width):</b> measure across the chest, armpit to armpit.</div><div><b>Length:</b> measure from the shoulder to the bottom hem.</div><div><b>Sleeve:</b> measure from the shoulder seam to the sleeve end.</div></div>'
   +'<a class="sg-img" href="'+IMG+'" target="_blank" rel="noopener"><img src="'+IMG+'" alt="OVRZD size chart showing how to measure chest, length and sleeve, with measurements for M, L and XL in inches" loading="lazy"><span>Tap the chart to open it full size</span></a>'
   +'<p class="sg-help">Between sizes or not sure? <a href="https://wa.me/'+WA+'?text='+encodeURIComponent("Hi OVRZD, I need help choosing a size.")+'" target="_blank" rel="noopener">Ask us on WhatsApp</a></p>'
   +'</div>';
  document.body.appendChild(box);
  var dlg=box.firstChild, closeBtn=box.querySelector('.sg-x'), lastFocus=null;

  function open(from){ lastFocus=from||document.activeElement; box.hidden=false; document.body.style.overflow='hidden'; dlg.scrollTop=0; closeBtn.focus(); }
  function close(){ if(box.hidden) return; box.hidden=true; document.body.style.overflow=''; if(lastFocus&&lastFocus.focus) lastFocus.focus(); }

  document.addEventListener('click',function(e){
    var t=e.target.closest&&e.target.closest('[data-size-guide],a[href="#size-guide"]');
    if(t){ e.preventDefault(); open(t); return; }
    if(e.target===box||e.target.closest('.sg-x')) close();
  });
  document.addEventListener('keydown',function(e){
    if(box.hidden) return;
    if(e.key==='Escape'){ close(); return; }
    if(e.key==='Tab'){ /* keep keyboard focus inside the popup */
      var f=[].slice.call(dlg.querySelectorAll('button,a[href]')); if(!f.length) return;
      var first=f[0], last=f[f.length-1];
      if(e.shiftKey&&(document.activeElement===first||document.activeElement===dlg)){ e.preventDefault(); last.focus(); }
      else if(!e.shiftKey&&document.activeElement===last){ e.preventDefault(); first.focus(); }
    }
  });

  /* ---------- ADD THE LINKS ---------- */
  function mk(txt,cls){ var b=document.createElement('button'); b.type='button'; b.className=cls; b.setAttribute('data-size-guide',''); b.textContent=txt; return b; }
  function inject(){
    document.querySelectorAll('#grid .card .row').forEach(function(r){
      var p=r.previousElementSibling; if(p&&p.classList.contains('sg-link')) return;
      r.parentNode.insertBefore(mk('Size guide','sg-link'),r);
    });
    if(!document.querySelector('.sg-page')){
      var anchor=document.querySelector('.tools')||document.getElementById('tabs')||document.getElementById('grid');
      if(anchor){
        var d=document.createElement('div'); d.className='sg-page'; d.appendChild(mk('Not sure about your size? View the size guide','sg-link'));
        anchor.parentNode.insertBefore(d,anchor);
      }
    }
  }
  var g=document.getElementById('grid');
  if(g) new MutationObserver(inject).observe(g,{childList:true});
  inject();
})();