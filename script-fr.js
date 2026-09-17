const splash=document.querySelector('#splash');
const logoIntro=document.querySelector('#logoIntro');
const heroVideo=document.querySelector('#heroVideo');
const skip=document.querySelector('#skipIntro');
let closed=false;
function enterSite(){if(closed)return;closed=true;splash.classList.add('hide');document.body.classList.remove('splash-active');heroVideo.play().catch(()=>{});startBackgroundMusic().catch(()=>{});setTimeout(()=>splash.remove(),900)}
logoIntro.addEventListener('ended',enterSite);
logoIntro.addEventListener('error',enterSite);
skip.addEventListener('click',enterSite);
setTimeout(enterSite,7000);
const menu=document.querySelector('#menu'),nav=document.querySelector('.top nav');menu.addEventListener('click',()=>nav.classList.toggle('open'));nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));
const sound=document.querySelector('#soundToggle'),backgroundMusic=document.querySelector('#backgroundMusic');
let musicOn=false;
function setMusicUI(on){
  musicOn=on;
  sound.textContent=on?'Son : ON':'Son : OFF';
  sound.setAttribute('aria-label',on?'Couper le son':'Activer le son');
}
async function startBackgroundMusic(){
  try{
    backgroundMusic.volume=0.72;
    await backgroundMusic.play();
    setMusicUI(true);
    return true;
  }catch(e){
    musicOn=false;
    sound.textContent='Son : ON';
    sound.setAttribute('aria-label','Couper le son');
    return false;
  }
}
startBackgroundMusic();
document.addEventListener('DOMContentLoaded',startBackgroundMusic,{once:true});
window.addEventListener('load',startBackgroundMusic,{once:true});
logoIntro.addEventListener('ended',startBackgroundMusic,{once:true});
function unlockMusic(){
  if(!musicOn) startBackgroundMusic();
}
['pointerdown','mousedown','touchstart','keydown','click'].forEach(evt=>{
  document.addEventListener(evt,unlockMusic,{once:true,capture:true,passive:true});
});
sound.addEventListener('click',async()=>{
  if(!musicOn){await startBackgroundMusic()}
  else{backgroundMusic.pause();setMusicUI(false)}
});
heroVideo.addEventListener('ended',()=>{heroVideo.currentTime=0;heroVideo.play().catch(()=>{})});
document.querySelector('form').addEventListener('submit',e=>{e.preventDefault();alert('Le formulaire est actuellement en démonstration. L’envoi des demandes sera activé lors de la mise en ligne du site.');});

// v22 — lightweight branded confetti, limited to side gutters of selected sections
const confettiToggle=document.querySelector('#confettiToggle');
const confettiSections=[document.querySelector('.hero'),document.querySelector('#philosophy'),document.querySelector('#contact')].filter(Boolean);
const confettiPalette=['#FFD34E','#F6B817','#E69A2E','#FFF0A6','#FF6B7D','#FF9FB0','#F36B9A','#F28C52','#E8D8FF','#AFCBFF','#FFFFFF'];
function makeConfetti(section,index){
  const layer=document.createElement('div');layer.className='confetti-layer';layer.setAttribute('aria-hidden','true');
  const count=window.innerWidth<560?24:54;
  for(let i=0;i<count;i++){
    const piece=document.createElement('i');
    const side=i%2===0?'left':'right';
    const edge=1.5+Math.random()*17.5;
    const x=side==='left'?edge:100-edge;
    const ribbon=Math.random()<.27;
    piece.className='confetti-piece'+(ribbon?' ribbon':'');
    piece.style.setProperty('--x',x+'%');
    piece.style.setProperty('--w',(5+Math.random()*8)+'px');
    piece.style.setProperty('--h',(8+Math.random()*12)+'px');
    piece.style.setProperty('--r',Math.random()<.3?'50%':'2px');
    piece.style.setProperty('--c',confettiPalette[Math.floor(Math.random()*confettiPalette.length)]);
    piece.style.setProperty('--o',(0.78+Math.random()*.22).toFixed(2));
    piece.style.setProperty('--rot',Math.floor(Math.random()*360)+'deg');
    piece.style.setProperty('--dur',(6+Math.random()*8)+'s');
    piece.style.setProperty('--delay',(-Math.random()*14-index*1.7)+'s');
    piece.style.setProperty('--drift',((Math.random()-.5)*105)+'px');
    layer.appendChild(piece);
  }
  section.appendChild(layer);
}
confettiSections.forEach(makeConfetti);
let confettiOn=true;
confettiToggle?.addEventListener('click',async()=>{
  // If the browser blocked audible autoplay, use this first user gesture only
  // to unlock the requested music. Keep confetti ON instead of making the
  // confusing state where music starts only when confetti is switched off.
  if(!musicOn){
    const started=await startBackgroundMusic();
    if(started && confettiOn) return;
  }
  confettiOn=!confettiOn;
  document.body.classList.toggle('confetti-off',!confettiOn);
  confettiToggle.textContent=confettiOn?'Confettis : ON':'Confettis : OFF';
  confettiToggle.setAttribute('aria-label',confettiOn?'Désactiver les confettis':'Activer les confettis');
  confettiToggle.setAttribute('aria-pressed',String(confettiOn));
});
