/* ============================================================
   СЕДЬМОЕ НЕБО — интерактив (без визуальных эффектов)
   Без внешних зависимостей. Формы — демо (без бэкенда).
   ============================================================ */
(function () {
  'use strict';
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Тень + авто-скрытие шапки при скролле вниз */
  var header = document.querySelector('.header');
  var lastScrollY = window.scrollY;
  var hideThreshold = 100; // не скрывать у самой верхушки
  function onScrollHeader() {
    var y = window.scrollY;
    header.classList.toggle('is-scrolled', y > 8);
    // Не скрывать, если открыто мобильное меню
    var menuOpen = document.getElementById('mmenu') && document.getElementById('mmenu').classList.contains('is-open');
    if (menuOpen) { header.classList.remove('is-hidden'); lastScrollY = y; return; }
    var diff = y - lastScrollY;
    if (Math.abs(diff) < 4) return; // игнорируем микро-движения
    if (diff > 0 && y > hideThreshold) {
      header.classList.add('is-hidden');     // скроллим вниз — прячем
    } else if (diff < 0) {
      header.classList.remove('is-hidden');  // вверх — возвращаем
    }
    lastScrollY = y;
  }
  window.addEventListener('scroll', onScrollHeader, { passive: true });
  onScrollHeader();

  /* Мобильное меню */
  var mmenu = document.getElementById('mmenu');
  var burger = document.getElementById('burger');
  var mclose = document.getElementById('mmenuClose');
  function openMenu() { mmenu.classList.add('is-open'); document.body.style.overflow = 'hidden'; }
  function closeMenu() { mmenu.classList.remove('is-open'); document.body.style.overflow = ''; }
  if (burger) burger.addEventListener('click', openMenu);
  if (mclose) mclose.addEventListener('click', closeMenu);
  mmenu.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeMenu); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });

  /* Мягкое появление */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else { reveals.forEach(function (el) { el.classList.add('is-in'); }); }

  /* Фильтр каталога */
  var filters = document.getElementById('catFilters');
  var grid = document.getElementById('catGrid');
  if (filters && grid) {
    filters.addEventListener('click', function (e) {
      var btn = e.target.closest('.chip');
      if (!btn) return;
      filters.querySelectorAll('.chip').forEach(function (c) { c.classList.remove('is-active'); });
      btn.classList.add('is-active');
      var f = btn.getAttribute('data-filter');
      grid.querySelectorAll('.cat__card').forEach(function (card) {
        card.style.display = (f === 'all' || card.getAttribute('data-cat') === f) ? '' : 'none';
      });
    });
  }

  /* Маска телефона */
  function maskPhone(input) {
    if (!input) return;
    input.addEventListener('input', function () {
      var d = input.value.replace(/\D/g, '');
      if (d.startsWith('8')) d = '7' + d.slice(1);
      if (!d.startsWith('7')) d = '7' + d;
      d = d.slice(0, 11);
      var out = '+7';
      if (d.length > 1) out += ' (' + d.slice(1, 4);
      if (d.length >= 4) out += ') ' + d.slice(4, 7);
      if (d.length >= 7) out += '-' + d.slice(7, 9);
      if (d.length >= 9) out += '-' + d.slice(9, 11);
      input.value = out;
    });
  }
  ['calcPhone', 'mPhone'].forEach(function (id) { maskPhone(document.getElementById(id)); });
  var phoneValid = function (v) { return v.replace(/\D/g, '').length >= 11; };

  /* Калькулятор */
  var calcForm = document.getElementById('calcForm');
  var calcResult = document.getElementById('calcResult');
  var calcSuccess = document.getElementById('calcSuccess');
  function fmt(n) { return n.toLocaleString('ru-RU'); }
  function recalc() {
    if (!calcForm) return;
    var price = +calcForm.querySelector('input[name="type"]:checked').value;
    var light = +calcForm.querySelector('input[name="light"]:checked').value;
    var area = parseFloat(document.getElementById('area').value);
    if (!area || area <= 0) { calcResult.classList.remove('is-visible'); return; }
    var base = price * area;
    var work = Math.round(base * 0.4);
    var lightCost = light ? Math.round(light * Math.min(area / 4, 12)) : 0;
    var total = base + work + lightCost;
    var low = Math.round(total / 100) * 100;
    var high = Math.round(total * 1.25 / 100) * 100;
    calcResult.innerHTML = 'Предварительно: <b>' + fmt(low) + ' – ' + fmt(high) + ' ₽</b><br><span style="font-size:13px;opacity:.8">за ' + area + ' м². Точную цену назовём на бесплатном замере.</span>';
    calcResult.classList.add('is-visible');
  }
  if (calcForm) {
    calcForm.addEventListener('change', recalc);
    document.getElementById('area').addEventListener('input', recalc);
    calcForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var phone = document.getElementById('calcPhone');
      var consent = calcForm.querySelector('input[type="checkbox"]');
      if (!phoneValid(phone.value)) { phone.focus(); phone.style.borderColor = '#e06a5a'; return; }
      if (!consent.checked) { consent.focus(); return; }
      // Демо: здесь подключается отправка в AmoCRM.
      calcForm.style.display = 'none';
      calcSuccess.classList.add('is-visible');
    });
  }

  /* Финальная форма */
  var measureForm = document.getElementById('measureForm');
  var measureSuccess = document.getElementById('measureSuccess');
  if (measureForm) {
    measureForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var phone = document.getElementById('mPhone');
      var consent = measureForm.querySelector('input[type="checkbox"]');
      if (!phoneValid(phone.value)) { phone.focus(); phone.style.borderColor = '#e06a5a'; return; }
      if (!consent.checked) { consent.focus(); return; }
      measureForm.style.display = 'none';
      measureSuccess.classList.add('is-visible');
    });
  }

  /* Плавная прокрутка с учётом шапки */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (id === '#' || id === '#top') return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      var top = target.getBoundingClientRect().top + window.scrollY - 88;
      window.scrollTo({ top: top, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  });
})();
