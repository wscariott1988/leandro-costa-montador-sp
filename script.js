(function () {
  const form = document.getElementById('quoteForm');

  if (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();

      const cidade = document.getElementById('cidade').value;
      const servico = document.getElementById('servico').value;
      const movel = document.getElementById('movel').value.trim();

      if (!cidade || !servico || !movel) {
        form.reportValidity();
        return;
      }

      const message = [
        'Olá, encontrei você no Google e gostaria de um orçamento',
        '',
        'Cidade: ' + cidade,
        'Serviço: ' + servico,
        'Móvel: ' + movel,
        '',
        'Se tiver foto da caixa ou link do móvel, posso enviar na conversa.'
      ].join('\n');

      const link = document.createElement('a');
      link.href = 'https://wa.me/5519984425375?text=' + encodeURIComponent(message);
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      link.remove();
    });
  }

  const carousel = document.querySelector('[data-carousel]');

  if (carousel) {
    const viewport = carousel.querySelector('[data-viewport]');
    const track = carousel.querySelector('[data-track]');
    const prevButton = carousel.querySelector('[data-prev]');
    const nextButton = carousel.querySelector('[data-next]');
    const counter = carousel.querySelector('[data-counter]');
    const dots = carousel.querySelector('[data-dots]');
    const cards = Array.from(track.children);
    const total = cards.length;

    let perView = 1;
    let page = 0;

    function readPerView() {
      const value = parseInt(getComputedStyle(carousel).getPropertyValue('--per-view'), 10);
      return Number.isFinite(value) && value > 0 ? value : 1;
    }

    function pageTotal() {
      return Math.max(1, Math.ceil(total / perView));
    }

    function gapSize() {
      const styles = getComputedStyle(track);
      return parseFloat(styles.columnGap || styles.gap) || 0;
    }

    function stepSize() {
      return cards[0].getBoundingClientRect().width + gapSize();
    }

    function maxOffset() {
      return Math.max(0, track.scrollWidth - viewport.clientWidth);
    }

    function buildDots() {
      dots.replaceChildren();

      for (let index = 0; index < pageTotal(); index += 1) {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.setAttribute('aria-label', 'Ir para a página ' + (index + 1) + ' de ' + pageTotal());
        dot.addEventListener('click', function () {
          goTo(index);
        });
        dots.appendChild(dot);
      }
    }

    function render() {
      const offset = Math.min(page * perView * stepSize(), maxOffset());
      track.style.transform = 'translate3d(-' + offset + 'px, 0, 0)';

      const firstIndex = Math.min(total, Math.round(offset / stepSize()) + 1);
      const lastIndex = Math.min(total, firstIndex + perView - 1);

      if (perView === 1) {
        counter.textContent = firstIndex + ' / ' + total;
      } else if (firstIndex === lastIndex) {
        counter.textContent = firstIndex + ' de ' + total;
      } else {
        counter.textContent = firstIndex + '–' + lastIndex + ' de ' + total;
      }

      Array.from(dots.children).forEach(function (dot, index) {
        dot.setAttribute('aria-current', index === page ? 'true' : 'false');
      });

      cards.forEach(function (card, index) {
        card.setAttribute('aria-hidden', index < firstIndex - 1 || index >= lastIndex ? 'true' : 'false');
      });
    }

    function goTo(nextPage) {
      const pages = pageTotal();
      page = ((nextPage % pages) + pages) % pages;
      render();
    }

    prevButton.addEventListener('click', function () {
      goTo(page - 1);
    });

    nextButton.addEventListener('click', function () {
      goTo(page + 1);
    });

    carousel.addEventListener('keydown', function (event) {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        goTo(page - 1);
      }

      if (event.key === 'ArrowRight') {
        event.preventDefault();
        goTo(page + 1);
      }
    });

    let touchStartX = 0;
    let touchStartY = 0;
    let touching = false;

    viewport.addEventListener('touchstart', function (event) {
      touchStartX = event.changedTouches[0].clientX;
      touchStartY = event.changedTouches[0].clientY;
      touching = true;
    }, { passive: true });

    viewport.addEventListener('touchend', function (event) {
      if (!touching) {
        return;
      }

      const deltaX = event.changedTouches[0].clientX - touchStartX;
      const deltaY = event.changedTouches[0].clientY - touchStartY;
      touching = false;

      if (Math.abs(deltaX) > 45 && Math.abs(deltaX) > Math.abs(deltaY) * 1.2) {
        goTo(page + (deltaX < 0 ? 1 : -1));
      }
    }, { passive: true });

    function syncLayout() {
      const nextPerView = readPerView();

      if (nextPerView !== perView) {
        perView = nextPerView;
        page = Math.min(page, pageTotal() - 1);
        buildDots();
      }

      render();
    }

    let resizeFrame = 0;
    window.addEventListener('resize', function () {
      cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(syncLayout);
    });

    perView = readPerView();
    buildDots();
    render();
    requestAnimationFrame(render);
  }

  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(function (item) {
    item.addEventListener('toggle', function () {
      if (!item.open) {
        return;
      }

      faqItems.forEach(function (other) {
        if (other !== item) {
          other.open = false;
        }
      });
    });
  });
})();
