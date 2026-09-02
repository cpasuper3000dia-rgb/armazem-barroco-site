/* ============================================================
   Armazém Barroco — script compartilhado
   Usado por: index.html, produtos.html, ambientes.html
   ============================================================ */
(function(){

  /* ---- Modais legais (Privacidade / Cookies / Termos / Trocas) ---- */
  function openModal(id){
    var el = document.getElementById(id);
    if(!el) return;
    el.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeModal(id){
    var el = document.getElementById(id);
    if(!el) return;
    el.classList.remove('open');
    document.body.style.overflow = '';
  }
  window.openModal = openModal;
  window.closeModal = closeModal;

  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape'){
      document.querySelectorAll('.modal-backdrop.open').forEach(function(m){ closeModal(m.id); });
      closeLightbox();
    }
  });

  /* ---- Menu mobile ---- */
  var navToggle = document.querySelector('.nav-toggle');
  var navLinks = document.querySelector('.nav-links');
  if(navToggle && navLinks){
    navToggle.addEventListener('click', function(){
      var isOpen = navLinks.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    navLinks.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', function(){
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---- Aviso de cookies ---- */
  var banner = document.getElementById('cookie-banner');
  if(banner){
    var choice = null;
    try { choice = localStorage.getItem('armazem-barroco-cookie-choice'); } catch(e) {}
    if(!choice){
      requestAnimationFrame(function(){ setTimeout(function(){ banner.classList.add('visible'); }, 600); });
    }
    window.setCookieChoice = function(value){
      try { localStorage.setItem('armazem-barroco-cookie-choice', value); } catch(e) {}
      banner.classList.remove('visible');
    };
  }

  /* ---- Animação de entrada ao rolar ---- */
  if('IntersectionObserver' in window){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){ entry.target.classList.add('in'); io.unobserve(entry.target); }
      });
    }, { threshold:0.15 });
    document.querySelectorAll('.reveal').forEach(function(el){ io.observe(el); });
  } else {
    document.querySelectorAll('.reveal').forEach(function(el){ el.classList.add('in'); });
  }

  /* ---- Formulário de orçamento (demonstração) ---- */
  document.querySelectorAll('form[data-demo-form]').forEach(function(form){
    form.addEventListener('submit', function(e){
      e.preventDefault();
      var note = form.querySelector('.form-note');
      if(note){ note.textContent = 'Formulário de demonstração — conecte a um serviço de envio (ex.: e-mail, CRM ou WhatsApp API) para receber pedidos de verdade.'; }
    });
  });

  /* ---- Filtro de produtos (produtos.html) ---- */
  var filterBar = document.querySelector('.filter-bar');
  if(filterBar){
    var buttons = filterBar.querySelectorAll('.filter-btn');
    var cards = document.querySelectorAll('.produto-card');
    function applyFilter(cat){
      buttons.forEach(function(b){ b.setAttribute('aria-pressed', b.getAttribute('data-filter') === cat ? 'true' : 'false'); });
      cards.forEach(function(card){
        var show = (cat === 'todos') || (card.getAttribute('data-category') === cat);
        card.style.display = show ? '' : 'none';
      });
    }
    buttons.forEach(function(btn){
      btn.addEventListener('click', function(){ applyFilter(btn.getAttribute('data-filter')); });
    });
    /* Permite chegar direto numa categoria via link, ex.: produtos.html?cat=aparadores */
    try {
      var params = new URLSearchParams(window.location.search);
      var initial = params.get('cat');
      var validCats = Array.prototype.map.call(buttons, function(b){ return b.getAttribute('data-filter'); });
      if(initial && validCats.indexOf(initial) !== -1){ applyFilter(initial); }
    } catch(e) {}
  }

  /* ---- Lightbox da galeria (ambientes.html) ---- */
  var lightbox = document.getElementById('lightbox');
  var lbImg, lbCaption, items, currentIndex = 0;

  function openLightbox(index){
    if(!lightbox || !items || !items.length) return;
    currentIndex = index;
    updateLightbox();
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox(){
    if(!lightbox) return;
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }
  function updateLightbox(){
    var item = items[currentIndex];
    var img = item.querySelector('img');
    var capEl = item.querySelector('.cap');
    lbImg.src = img.src;
    lbImg.alt = img.alt;
    lbCaption.textContent = capEl ? capEl.textContent.trim() : img.alt;
  }
  function stepLightbox(dir){
    currentIndex = (currentIndex + dir + items.length) % items.length;
    updateLightbox();
  }

  if(lightbox){
    lbImg = lightbox.querySelector('img');
    lbCaption = lightbox.querySelector('figcaption');
    items = document.querySelectorAll('.galeria-item');
    items.forEach(function(item, index){
      item.addEventListener('click', function(){ openLightbox(index); });
    });
    var closeBtn = lightbox.querySelector('.lightbox-close');
    var prevBtn = lightbox.querySelector('.lightbox-prev');
    var nextBtn = lightbox.querySelector('.lightbox-next');
    if(closeBtn) closeBtn.addEventListener('click', closeLightbox);
    if(prevBtn) prevBtn.addEventListener('click', function(){ stepLightbox(-1); });
    if(nextBtn) nextBtn.addEventListener('click', function(){ stepLightbox(1); });
    lightbox.addEventListener('click', function(e){ if(e.target === lightbox) closeLightbox(); });
    document.addEventListener('keydown', function(e){
      if(!lightbox.classList.contains('open')) return;
      if(e.key === 'ArrowRight') stepLightbox(1);
      if(e.key === 'ArrowLeft') stepLightbox(-1);
    });
  }

})();
