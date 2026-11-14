const isSubpage = location.pathname.includes('/pages/');
const base = isSubpage ? '../' : '';
const url = file => base + file;
async function loadData(key){try{const r=await fetch(url(DATA_FILES[key]));if(!r.ok)throw new Error(r.status);return await r.json()}catch(e){console.warn('Could not load',key,e);return []}}
const esc = s => String(s ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const seasonLabel = n => `Season ${String(n).padStart(2,'0')}`;
function seasonCard(s){return `<a class="season-card" href="${url('pages/season-detail.html?id='+encodeURIComponent(s.id))}"><div class="season-card-top"><span>${seasonLabel(s.number)}</span><span>${esc(s.status||'ARCHIVED')}</span></div><h3>${esc(s.title||'Untitled season')}</h3><p>${esc(s.summary||'Season report coming soon.')}</p><div class="season-card-bottom"><span>League finish <b>${esc(s.league_finish||'TBD')}</b></span><span>Explore ↗</span></div></a>`}
function statCard(label,value,note=''){return `<div class="stat-card"><span>${esc(label)}</span><strong>${esc(value)}</strong><small>${esc(note)}</small></div>`}
async function initHome(){const seasons=await loadData('seasons');const completed=seasons.filter(s=>s.status==='COMPLETED');const best=completed.map(s=>Number(s.league_finish)).filter(n=>n>0).sort((a,b)=>a-b)[0];const stats=document.querySelector('#overview-stats');if(stats)stats.innerHTML=[statCard('Seasons recorded',seasons.length,'The archive journey'),statCard('Best league finish',best?`#${best}`:'TBD','Across completed seasons'),statCard('Trophies','0','Update in trophy history'),statCard('Squad identity','Spanish','In-game nationality policy')].join('');const home=document.querySelector('#home-seasons');if(home)home.innerHTML=seasons.slice().sort((a,b)=>b.number-a.number).slice(0,3).map(seasonCard).join('');const all=document.querySelector('#all-seasons');if(all)all.innerHTML=seasons.slice().sort((a,b)=>a.number-b.number).map(seasonCard).join('')}
async function initSquad() {
  const grid = document.querySelector('#player-grid');
  if (!grid) return;
  const players = await loadData('players');
  const search = document.querySelector('#player-search'),
        pos = document.querySelector('#position-filter'),
        season = document.querySelector('#season-filter'),
        empty = document.querySelector('#player-empty');

  function render() {
    const q = search.value.toLowerCase();
    const filtered = players.filter(p =>
      (!q || p.name.toLowerCase().includes(q)) &&
      (!pos.value || p.position_group === pos.value) &&
      (!season.value || (p.seasons || []).includes(Number(season.value)))
    );

    grid.innerHTML = filtered.map(p => {
      const photoUrl = p.photo
        ? (/^https?:\/\//i.test(p.photo) ? p.photo : '../' + p.photo)
        : '';
      const initials = esc(p.initials || p.name.split(' ').map(x => x[0]).slice(0, 2).join(''));

      return `<article class="player-card">
        <div class="player-photo">
          ${photoUrl
            ? `<img src="${esc(photoUrl)}" alt="${esc(p.name)}" referrerpolicy="no-referrer" style="width:100%;height:100%;object-fit:contain;display:block;">`
            : initials}
        </div>
        <div class="player-info">
          <div class="player-meta">
            <span>${esc(p.position || 'Position TBD')}</span>
            <span class="ovr">${esc(p.ovr ?? '--')}</span>
          </div>
          <h3>${esc(p.name)}</h3>
          <p>${esc(p.nationality || 'Nationality TBD')} · ${esc(p.status || 'Squad')}</p>
        </div>
      </article>`;
    }).join('');

    empty.hidden = filtered.length > 0;
  }

  [search, pos, season].forEach(el => el.addEventListener('input', render));
  render();
}
async function initTransfers(){const body=document.querySelector('#transfer-table');if(!body)return;const transfers=await loadData('transfers');const sf=document.querySelector('#transfer-season'),tf=document.querySelector('#transfer-type'),empty=document.querySelector('#transfer-empty');function render(){const rows=transfers.filter(t=>(!sf.value||String(t.season)===sf.value)&&(!tf.value||t.type===tf.value));body.innerHTML=rows.map(t=>`<tr><td>${seasonLabel(t.season)}</td><td><b>${esc(t.player)}</b></td><td><span class="movement ${t.type==='IN'?'in':'out'}">${t.type==='IN'?'ARRIVAL':'DEPARTURE'}</span></td><td>${esc(t.position||'—')}</td><td>${esc(t.fee||'Undisclosed')}</td><td>${esc(t.notes||'—')}</td></tr>`).join('');empty.hidden=rows.length>0}[sf,tf].forEach(el=>el.addEventListener('change',render));render()}
async function initRecords(){const grid=document.querySelector('#record-stats');if(!grid)return;const records=await loadData('records');const featured=records.slice(0,4);grid.innerHTML=featured.map(r=>statCard(r.label,r.value,r.note||'')).join('');const body=document.querySelector('#records-table');body.innerHTML=records.map(r=>`<tr><td>${esc(r.label)}</td><td>${esc(r.holder||'TBD')}</td><td><b>${esc(r.value)}</b></td><td>${esc(r.note||'—')}</td></tr>`).join('')}
async function initHistory(){const el=document.querySelector('#history-timeline');if(!el)return;const seasons=await loadData('seasons');el.innerHTML=seasons.sort((a,b)=>a.number-b.number).map(s=>`<article class="timeline-item"><span>${seasonLabel(s.number)} · ${esc(s.status||'PLANNED')}</span><h3>${esc(s.title)}</h3><p>${esc(s.summary||'Details to be added.')}</p></article>`).join('')}
async function initGallery(){const el=document.querySelector('#gallery-grid');if(!el)return;const items=await loadData('gallery');el.innerHTML=items.map(g=>`<article class="gallery-item"><div class="gallery-image" style="${g.image?'background-image:url(../'+esc(g.image)+')':''}">${g.image?'': 'IMAGE PLACEHOLDER'}</div><div class="gallery-caption"><b>${esc(g.title)}</b><span>${seasonLabel(g.season)} · ${esc(g.category||'Moment')}</span></div></article>`).join('')}
async function initSeasonDetail(){const el=document.querySelector('#season-detail');if(!el)return;const id=new URLSearchParams(location.search).get('id');const seasons=await loadData('seasons');const s=seasons.find(x=>x.id===id);if(!s){el.innerHTML='<p>Season not found. Return to the <a class="text-link" href="seasons.html">season archive</a>.</p>';return}el.innerHTML=`<a class="back-link" href="seasons.html">← ALL SEASONS</a><section class="detail-hero"><p class="eyebrow">${seasonLabel(s.number)} · ${esc(s.status||'ARCHIVED')}</p><h1>${esc(s.title)}</h1><p>${esc(s.summary||'Season report in progress.')}</p></section><div class="stat-grid">${statCard('League finish',s.league_finish||'TBD')}${statCard('Trophies',(s.trophies||[]).length)}${statCard('Best signing',s.best_signing||'TBD')}${statCard('Young player',s.young_player||'TBD')}</div><div class="detail-columns"><section class="detail-panel"><h2>Season objectives</h2><ul>${(s.objectives||[]).map(x=>`<li>${esc(x)}</li>`).join('')||'<li class="missing">To be added</li>'}</ul></section><section class="detail-panel"><h2>Season review</h2><p>${esc(s.review||'Review to be added.')}</p></section><section class="detail-panel"><h2>Key decisions</h2><p>${esc(s.key_decisions||'To be added.')}</p></section><section class="detail-panel"><h2>Honours & highlights</h2><ul>${(s.trophies||[]).map(x=>`<li>${esc(x)}</li>`).join('')||'<li>No trophies recorded.</li>'}</ul></section></div>`}
document.querySelectorAll('[data-year]').forEach(el=>el.textContent=new Date().getFullYear());
const menu=document.querySelector('.menu-toggle');if(menu)menu.addEventListener('click',()=>{const nav=document.querySelector('.nav');const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open))});
initHome();initSquad();initTransfers();initRecords();initHistory();initGallery();initSeasonDetail();
