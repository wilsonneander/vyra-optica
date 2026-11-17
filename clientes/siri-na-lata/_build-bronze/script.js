// JS do modelo Bronze: menu do celular, topo sólido ao rolar, entrada suave e "aberto agora".
// Pequeno e sem dependências. Os horários vêm do content.js.
const C = require('../_build/content');

const horarios = JSON.stringify(C.horarios.map((h) => ({ d: h.d, a: h.abre, f: h.fecha })));

const js = `(function(){
var d=document,hdr=d.querySelector('[data-hdr]'),btn=d.querySelector('[data-menu]'),nav=d.getElementById('nav');
function setMenu(o){hdr.classList.toggle('open',o);nav.classList.toggle('open',o);btn.setAttribute('aria-expanded',o);btn.setAttribute('aria-label',o?'Fechar menu':'Abrir menu');}
btn.addEventListener('click',function(){setMenu(!nav.classList.contains('open'));});
nav.addEventListener('click',function(e){if(e.target.tagName==='A')setMenu(false);});
d.addEventListener('keydown',function(e){if(e.key==='Escape')setMenu(false);});
function onScroll(){hdr.classList.toggle('solid',window.scrollY>40);}
onScroll();window.addEventListener('scroll',onScroll,{passive:true});

var rv=d.querySelectorAll('.rv');
if('IntersectionObserver' in window){var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});},{rootMargin:'0px 0px -40px 0px'});rv.forEach(function(el){io.observe(el);});}
else rv.forEach(function(el){el.classList.add('in');});

/* horário de Brasília, mesmo que o visitante esteja em outro fuso */
var H=${horarios},NOMES=['domingo','segunda','terça','quarta','quinta','sexta','sábado'];
try{
  var p=new Intl.DateTimeFormat('en-US',{timeZone:'America/Sao_Paulo',weekday:'short',hour:'2-digit',minute:'2-digit',hour12:false}).formatToParts(new Date());
  var g=function(t){return (p.find(function(x){return x.type===t;})||{}).value;};
  var dia=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].indexOf(g('weekday')),min=(+g('hour')%24)*60+(+g('minute'));
  var m=function(s){var a=s.split(':');return a[0]*60+(+a[1]);};
  var hoje=H.filter(function(h){return h.d.indexOf(dia)>-1;})[0];
  d.querySelectorAll('tr[data-dias]').forEach(function(tr){if(tr.getAttribute('data-dias').split(',').indexOf(String(dia))>-1)tr.classList.add('hoje');});
  var txt,fmt=function(s){return s.replace(':00','h').replace(':','h');};
  if(hoje&&hoje.a&&min>=m(hoje.a)&&min<m(hoje.f)){txt='Aberto agora, até as '+fmt(hoje.f);}
  else{
    for(var i=0;i<8;i++){var dd=(dia+i)%7,h=H.filter(function(x){return x.d.indexOf(dd)>-1;})[0];
      if(h&&h.a&&(i>0||min<m(h.a))){txt='Fechado agora. Abrimos '+(i===0?'hoje':i===1?'amanhã':NOMES[dd])+' às '+fmt(h.a);break;}}
  }
  var el=d.querySelector('[data-agora]');if(el&&txt){var s=d.createElement('span');s.className='agora';s.textContent=txt;el.insertBefore(d.createTextNode(' \\u00a0 '),el.firstChild);el.insertBefore(s,el.firstChild);}
}catch(e){}
})();`;

module.exports = { js };
