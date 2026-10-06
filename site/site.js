/* ================= SETTINGS (the only part a developer needs to edit) ================= */
const SANITY_PROJECT_ID = "8i5408fi";      // paste your Sanity project ID here, e.g. "ab12cd34"
const SANITY_DATASET    = "production";
const N1="94714074497", N2="94707066681", EM="ovrzdest@gmail.com";
const CURRENCY = "LKR";
/* If SANITY_PROJECT_ID is empty, or Sanity cannot be reached, the site shows products.json instead. */

const $=i=>document.getElementById(i);
const wa=(t,n=N1)=>"https://wa.me/"+n+"?text="+encodeURIComponent(t), hi="Hi OVRZD, I'd like to ask about your t-shirts.";
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));

["hWa","heroWa","fab","c1"].forEach(i=>{const link=$(i);if(link)link.href=wa(hi)});
const secondContact=$("c2");
if(secondContact)secondContact.href=wa(hi,N2);

const formFields=["fn","fp","fm"].map($).filter(Boolean);
const sendWhatsApp=$("fw"), sendEmail=$("fe");
if(formFields.length===3&&sendWhatsApp&&sendEmail){
  function fm(){
    const m=`Hi OVRZD,\n${$("fm").value||"I'd like to ask about your t-shirts."}\n\nName: ${$("fn").value}\nPhone: ${$("fp").value}`;
    sendWhatsApp.href=wa(m);
    sendEmail.href="mailto:"+EM+"?subject="+encodeURIComponent("Message from "+($("fn").value||"website"))+"&body="+encodeURIComponent(m);
  }
  formFields.forEach(field=>field.addEventListener("input",fm));
  fm();
}

const menuToggle=$("menuToggle"), siteNav=$("siteNav");
if(menuToggle&&siteNav){
  const closeMenu=()=>{
    siteNav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded","false");
    menuToggle.setAttribute("aria-label","Open navigation menu");
  };
  menuToggle.addEventListener("click",()=>{
    const open=menuToggle.getAttribute("aria-expanded")!=="true";
    menuToggle.setAttribute("aria-expanded",String(open));
    menuToggle.setAttribute("aria-label",open?"Close navigation menu":"Open navigation menu");
    siteNav.classList.toggle("open",open);
  });
  siteNav.addEventListener("click",event=>{
    if(event.target.closest("a"))closeMenu();
  });
  document.addEventListener("keydown",event=>{
    if(event.key==="Escape")closeMenu();
  });
  document.addEventListener("click",event=>{
    if(!siteNav.contains(event.target)&&!menuToggle.contains(event.target))closeMenu();
  });
}
