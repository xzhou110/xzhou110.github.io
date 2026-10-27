const root = document.documentElement;
const themeButtons = document.querySelectorAll('[data-set-theme]');
function syncTheme() {
  themeButtons.forEach(button => button.setAttribute('aria-pressed',String(button.dataset.setTheme === root.dataset.theme)));
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content',root.dataset.theme === 'dark' ? '#171a1b' : '#f7f7f2');
}
themeButtons.forEach(button=>button.addEventListener('click',()=>{
  root.dataset.theme=button.dataset.setTheme;
  try { localStorage.setItem('theme',root.dataset.theme); } catch { /* Theme works without storage. */ }
  syncTheme();
}));
syncTheme();
const preference=matchMedia('(prefers-color-scheme: dark)');
preference.addEventListener('change',()=>{
  try { if(['light','dark'].includes(localStorage.getItem('theme'))) return; } catch { /* Follow system. */ }
  root.dataset.theme=preference.matches?'dark':'light';syncTheme();
});
const header=document.querySelector('.site-header');
function measureHeader(){if(header)root.style.setProperty('--nav-height',`${Math.ceil(header.getBoundingClientRect().height)}px`);}
if(header&&'ResizeObserver' in window)new ResizeObserver(measureHeader).observe(header);
measureHeader();
const navLinks=[...document.querySelectorAll('.topbar nav a')];
const sections=[...document.querySelectorAll('main > section[id]')];
let queued=false;
function syncSection(){
  if(!document.getElementById('work'))return;
  const boundary=(header?.getBoundingClientRect().height||0)+48;
  const bottom=scrollY>0&&scrollY+innerHeight>=document.documentElement.scrollHeight-2;
  const current=bottom?sections.at(-1):sections.filter(section=>section.getBoundingClientRect().top<=boundary).at(-1);
  navLinks.forEach(link=>{if(current&&link.hash===`#${current.id}`)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');});
  queued=false;
}
function queueSection(){if(!queued){queued=true;requestAnimationFrame(syncSection);}}
addEventListener('scroll',queueSection,{passive:true});
addEventListener('resize',()=>{measureHeader();queueSection();});
syncSection();
// Preserve older homepage bookmarks after case studies gained their own URLs.
const idsElement=document.getElementById('project-ids');
if(idsElement){
  const ids=JSON.parse(idsElement.textContent);
  function restoreLegacy(){
    const url=new URL(location.href);
    let id;try{id=decodeURIComponent(url.hash.slice(1));}catch{return;}
    if(ids.includes(id)){
      url.pathname=`/projects/${id}/`;url.hash='';
      if(url.searchParams.has('work')){url.searchParams.set('category',url.searchParams.get('work'));url.searchParams.delete('work');url.searchParams.set('collection','1');}
      location.replace(url);
    }else if(url.searchParams.has('work')){
      url.pathname='/projects/';url.searchParams.set('category',url.searchParams.get('work'));url.searchParams.delete('work');url.hash='';location.replace(url);
    }
  }
  addEventListener('hashchange',restoreLegacy);restoreLegacy();
}
const caseBack=document.getElementById('case-back');
if(caseBack&&new URL(location.href).searchParams.get('collection')==='1'){
  const url=new URL(location.href);url.pathname='/projects/';url.searchParams.delete('collection');url.hash=document.querySelector('.case-page').dataset.project;
  caseBack.href=url;caseBack.textContent='← Back to All Projects';
}
