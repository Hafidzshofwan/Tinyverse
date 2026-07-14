/* TinyVerse - Jembatan Profil Pasien terpusat (port verbatim v17).
   Disuntik ke tiap island. Membaca localStorage['tv_pasien_aktif'] (dibagikan
   satu-origin dgn app induk) lalu mengisi input alat via terapkan(). Auto-refresh
   saat profil berubah (event 'storage' dari app induk). Menyertakan Safety Guard
   Puyer (scanPuyer + INX). */
(function(){
  'use strict';
  var LSKEY='tv_pasien_aktif';
  function $(id){return document.getElementById(id);}
  function num(v){var n=parseFloat(v);return isFinite(n)?n:null;}
  function norm(s){return String(s||'').trim().toLowerCase().replace(/[^a-z0-9]+/g,'');}
  function load(){try{return JSON.parse(localStorage.getItem(LSKEY))||{};}catch(e){return {};}}
  function setVal(id,val){var el=$(id);if(!el||val==null||val==='')return;el.value=val;try{el.dispatchEvent(new Event('input',{bubbles:true}));el.dispatchEvent(new Event('change',{bubbles:true}));}catch(e){}}
  function usiaTeks(b){if(b==null)return '';if(b<24)return b+' bulan';var th=Math.floor(b/12),s=b%12;return s?(th+' th '+s+' bln'):(th+' tahun');}
  var pasien=load();
  function injectSafetyCss(){ if($('tvSafetyCss'))return; var st=document.createElement('style'); st.id='tvSafetyCss'; st.textContent=".tv-safety{margin:0 0 12px;border-radius:14px;padding:11px 14px;font-size:.84rem;line-height:1.45}\n.tv-safety.ok{background:#ECFDF3;border:1.5px solid #ABEFC6;color:#067647}\n.tv-safety.warn{background:#FFFAEB;border:1.5px solid #FEDF89;color:#B54708}\n.tv-safety.danger{background:#FEF3F2;border:1.5px solid #FECDCA;color:#B42318}\n.tv-safety b{font-family:'Fredoka',sans-serif;display:block;margin-bottom:2px}\n.tv-safety ul{margin:6px 0 0;padding-left:18px}\n.tv-safety li{margin:2px 0}"; (document.head||document.documentElement).appendChild(st); }
  function terapkan(){
    var bb=pasien.bb,ub=pasien.usiaBulan,tb=pasien.tb,nm=pasien.nama;
    setVal('beratBadan',bb);setVal('usiaBulan',ub);
    setVal('cairanBerat',bb);setVal('cairanBeratB',bb);setVal('cairanBeratC',bb);
    setVal('burnBerat',bb);
    if(ub!=null)setVal('burnUsia',Math.round((ub/12)*10)/10);
    if(ub!=null){var tab=$('cairanUsiaCTab');if(tab){var key=ub<12?'bayi':'anak';tab.querySelectorAll('[data-usia-c]').forEach(function(b){b.classList.toggle('aktif',b.getAttribute('data-usia-c')===key);});}}
    setVal('puyerBb',bb);setVal('puyerUsia',ub);
    setVal('nutBB',bb);setVal('nutUsiaBln',ub);
    setVal('naBB',bb);setVal('kBB',bb);setVal('caBB',bb);
    setVal('drtBB',bb);setVal('drtNama',nm);if(ub!=null)setVal('drtUsia',usiaTeks(ub));
    setVal('summaryNama',nm);
    if(ub!=null)setVal('summaryUsia',usiaTeks(ub));
    if(bb!=null||tb!=null)setVal('summaryBbTb',(bb!=null?bb+' kg':'')+(tb!=null?((bb!=null?' / ':'')+tb+' cm'):''));
    setVal('tkInputX',ub);setVal('tkInput_berat',bb);setVal('tkInput_tinggi',tb);
    try{var _tk=(typeof tkState!=='undefined')?tkState:null;if(_tk&&pasien.jk&&_tk.kelamin!==pasien.jk){_tk.kelamin=pasien.jk;if(window.tkRenderKelamin)window.tkRenderKelamin();if(window.tkRenderRingkasan)window.tkRenderRingkasan();if(window.tkRenderStepper)window.tkRenderStepper();}}catch(e){}
  }
  var INX=[
    {a:/ibuprofen|mefenamat|ketorolac|aspirin|asetosal|diklofenak|piroksikam|ketoprofen/,b:/ibuprofen|mefenamat|ketorolac|aspirin|asetosal|diklofenak|piroksikam|ketoprofen/,dup:true,msg:'Dua obat antiinflamasi/antinyeri (NSAID) sekaligus — risiko perdarahan & gangguan ginjal meningkat.'},
    {a:/domperidon|metoclopramide|metoklopramid/,b:/domperidon|metoclopramide|metoklopramid/,dup:true,msg:'Dua obat prokinetik bersamaan — risiko efek ekstrapiramidal.'},
    {a:/ondansetron|domperidon|metoclopramide|metoklopramid/,b:/eritromisin|erythromycin|klaritromisin|clarithromycin|azitromisin|azithromycin/,msg:'Kombinasi ini dapat memperpanjang interval QT (risiko aritmia).'},
    {a:/ctm|chlorphenir|klorfenir|cetirizine|setirizin|loratadin|loratadine|difenhidramin|diphenhydramin/,b:/ctm|chlorphenir|klorfenir|cetirizine|setirizin|loratadin|loratadine|difenhidramin|diphenhydramin/,dup:true,msg:'Dua antihistamin sekaligus — efek sedasi/antikolinergik bertumpuk.'},
    {a:/prednison|prednisone|dexamethasone|deksametason|metilprednisolon|methylprednisolone/,b:/ibuprofen|mefenamat|ketorolac|aspirin|asetosal|diklofenak/,msg:'Kortikosteroid + NSAID — meningkatkan risiko ulkus/perdarahan saluran cerna.'}
  ];
  function scanPuyer(){
    var box=$('puyerHasil');if(!box)return;
    var inputs=document.querySelectorAll('#puyerObatList [data-field="nama"]');
    var names=[];inputs.forEach(function(i){var v=(i.value||'').trim();if(v)names.push(v);});
    var old=$('tvSafetyPuyer');if(old)old.remove();
    if(names.length<1)return;
    var hits=[],seen={};
    names.forEach(function(n){var k=norm(n);if(!k)return;seen[k]=(seen[k]||0)+1;});
    Object.keys(seen).forEach(function(k){if(seen[k]>1)hits.push({lv:'danger',t:'Obat \"'+k+'\" tercantum lebih dari sekali — periksa kemungkinan dosis ganda.'});});
    var low=names.map(function(n){return n.toLowerCase();});
    INX.forEach(function(p){var ia=[],ib=[];low.forEach(function(n,idx){if(p.a.test(n))ia.push(idx);if(p.b.test(n))ib.push(idx);});var f=false;for(var i=0;i<ia.length&&!f;i++)for(var j=0;j<ib.length;j++){if(ia[i]!==ib[j]){f=true;break;}}if(f)hits.push({lv:'warn',t:p.msg});});
    var el=document.createElement('div');el.id='tvSafetyPuyer';
    if(!hits.length){el.className='tv-safety ok';el.innerHTML='<b>🛡️ Safety Guard</b>Tidak terdeteksi duplikasi atau interaksi umum. Tetap verifikasi sesuai kondisi pasien.';}
    else{var danger=hits.some(function(h){return h.lv==='danger';});el.className='tv-safety '+(danger?'danger':'warn');el.innerHTML='<b>🛡️ Safety Guard — perhatian</b><ul>'+hits.map(function(h){return '<li>'+h.t+'</li>';}).join('')+'</ul>';}
    box.insertBefore(el,box.firstChild);
  }
  document.addEventListener('click',function(e){var t=e.target;if(t&&(t.id=='puyerHitung'||(t.closest&&t.closest('#puyerHitung'))))setTimeout(scanPuyer,150);});

  function boot(){ pasien=load(); try{terapkan();}catch(e){} }
  injectSafetyCss();
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
  window.addEventListener('load',boot);
  setTimeout(boot,300); setTimeout(boot,900);
  window.addEventListener('storage',function(e){ if(!e.key||e.key===LSKEY){ pasien=load(); try{terapkan();}catch(x){} } });
  window.addEventListener('message',function(e){ if(e&&e.data&&e.data.__tvPasien){ pasien=load(); try{terapkan();}catch(x){} } });
  window.TVPasien={get:function(){return load();},terapkan:function(){pasien=load();terapkan();}};
})();
