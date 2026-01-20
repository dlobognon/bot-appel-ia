// Product page rendering (Pro V3)
function getQueryParam(name){
  const url = new URL(window.location.href);
  return url.searchParams.get(name);
}

function starsHtml(n){
  const full = Math.max(0, Math.min(5, Number(n)||0));
  return `<span class="stars">${Array.from({length:5}).map((_,i)=>`<span class="star">${i<full?'★':'☆'}</span>`).join('')}</span>`;
}

function avgStars(reviews){
  if(!reviews || !reviews.length) return 0;
  const sum = reviews.reduce((a,r)=>a + (Number(r.stars)||0), 0);
  return Math.round((sum / reviews.length) * 10) / 10;
}

function renderProductPage(){
  const root = document.getElementById("product-page");
  if(!root) return;

  const id = Number(getQueryParam("id") || "0");
  const p = (window.products || []).find(x=>x.id===id);
  if(!p){
    const missingTitle = (typeof window.t === 'function') ? window.t('product.not_found_title') : 'Produit introuvable';
    const missingDesc = (typeof window.t === 'function') ? window.t('product.not_found_desc') : 'Retournez au catalogue.';
    const missingBtn = (typeof window.t === 'function') ? window.t('nav.catalogue') : 'Catalogue';
    root.innerHTML = `<div class="pinfo"><h1>${missingTitle}</h1><p class="desc">${missingDesc}</p><a class="secondary-btn" href="index.html#catalogue">${missingBtn}</a></div>`;
    return;
  }

  const imgs = (p.images && p.images.length) ? p.images.slice(0,8) : [p.image].filter(Boolean);
  const reviews = p.reviews || [];
  const avg = avgStars(reviews);

  const pName = (typeof window.t === 'function') ? (window.t(`product.${p.id}.name`) || p.name) : p.name;
  const pDesc = (typeof window.t === 'function') ? (window.t(`product.${p.id}.desc`) || p.description) : p.description;
  const pBenefits = (p.benefits || []).map((b, i) => {
    if (typeof window.t === 'function') {
      return window.t(`product.${p.id}.benefit.${i+1}`) || b;
    }
    return b;
  });

  document.title = `${pName} – Legancy Boutique`;

  root.innerHTML = `
    <div class="gallery">
      <div class="gallery-main">
        <button class="gbtn prev" type="button" aria-label="${(typeof window.t === 'function') ? window.t('product.prev') : 'Previous'}">‹</button>
        <img id="main-img" src="${imgs[0]}" alt="${pName}">
        <button class="gbtn next" type="button" aria-label="${(typeof window.t === 'function') ? window.t('product.next') : 'Next'}">›</button>
      </div>
      <div class="thumbs" id="thumbs">
        ${imgs.map((u,i)=>`
          <button class="thumb ${i===0?'active':''}" type="button" data-idx="${i}">
            <img src="${u}" alt="${pName} ${i+1}">
          </button>
        `).join('')}
      </div>
    </div>

    <div class="pinfo">
      <div class="pcat">${p.category}</div>
      <h1>${pName}</h1>

      <div class="price-row" style="margin-top:10px;">
        ${p.oldPrice ? `<span class="badge-promo">${p.promoLabel || "PROMO"}</span>` : ""}
        <span class="current-price">${formatCurrency(p.price)}</span>
        ${p.oldPrice ? `<span class="old-price">${formatCurrency(p.oldPrice)}</span>` : ""}
      </div>

      <div class="rating-row">
        ${starsHtml(Math.round(avg))}
        <span>${avg} / 5 • ${reviews.length} avis</span>
      </div>

      <p class="desc">${pDesc || ""}</p>

      <ul class="benefits">
        ${pBenefits.map(b=>`<li>${b}</li>`).join('')}
      </ul>

      <div class="p-actions">
        <button class="primary-btn" type="button" id="add-btn">${(typeof window.t === 'function') ? window.t('product.add_to_cart') : 'Ajouter au panier'}</button>
        <button class="secondary-btn" type="button" id="buy-btn">${(typeof window.t === 'function') ? window.t('product.buy_now') : 'Acheter maintenant'}</button>
      </div>

      <div class="reviews">
        <h3 style="margin:0;">Avis clients</h3>
        ${reviews.length ? reviews.map(r=>`
          <div class="review-card">
            <div class="review-head">
              <div class="review-name">${r.name || "Client"}</div>
              <div>${starsHtml(r.stars)}</div>
            </div>
            <div class="review-text">${r.text || ""}</div>
          </div>
        `).join('') : `<p class="desc" style="margin-top:8px;">Aucun avis pour le moment.</p>`}
      </div>
    </div>
  `;

  let idx = 0;
  const main = document.getElementById("main-img");
  const thumbs = Array.from(document.querySelectorAll("#thumbs .thumb"));

  function setIdx(n){
    idx = (n + imgs.length) % imgs.length;
    main.src = imgs[idx];
    thumbs.forEach(t=>t.classList.remove("active"));
    const btn = thumbs[idx];
    if(btn) btn.classList.add("active");
  }

  document.querySelector(".gbtn.prev")?.addEventListener("click", ()=>setIdx(idx-1));
  document.querySelector(".gbtn.next")?.addEventListener("click", ()=>setIdx(idx+1));
  thumbs.forEach(t=> t.addEventListener("click", ()=>setIdx(Number(t.dataset.idx||0))) );

  document.getElementById("add-btn")?.addEventListener("click", ()=> addToCart(p.id));
  document.getElementById("buy-btn")?.addEventListener("click", ()=>{ addToCart(p.id); openCart(); });
}

document.addEventListener("DOMContentLoaded", renderProductPage);
