/* ═══════════════════════════════════════════════
   YZS® — 动效编排
   GSAP + ScrollTrigger + SplitText + Lenis
   ═══════════════════════════════════════════════ */
gsap.registerPlugin(ScrollTrigger, SplitText, ScrambleTextPlugin);

const isFinePointer = matchMedia('(pointer: fine)').matches;
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ─────────── 项目数据(模态框) ─────────── */
const WORKS = {
  w01: {
    meta: '立体装置 · 概念艺术 · 2025.10.26',
    title: '43+1 — 力量与平衡',
    desc: '灵感来自举起榔头即将敲下那一刻身体内部的张力——行动与克制之间的悬停。榔头被定格在钉子的世界中,失去攻击性,反被钉子们支撑、包围。力量在此被凝固,攻击者与承受者的关系被倒置。材料:榔头、钉子、木板。',
    media: ['work01.jpg', 'work01-2.jpg', 'work01-3.jpg', 'work01-5.jpg'],
  },
  w02: {
    meta: '镜面装置 · 互动艺术 · 2025.11.13',
    title: '皮囊记忆 / Memory of the Flesh',
    desc: '镜面被框入洁白边界,观者既是观看者也是被观看者。画框象征「被社会规训的目光」,镜面是「自我反思的现场」——关于「身体记忆」的存在证据。作品编号 #2、日期 2025/11/13,带档案与实验意味。材料:镜面、画框、印刷文字。',
    media: ['work02.jpg', 'work02-3.jpg', 'work02-5.jpg'],
  },
  w03: {
    meta: '综合材料 · 装置雕塑 · 2025',
    title: '痛 — 被规训的皮囊',
    desc: '以「皮囊」为核心意象,隐喻个体在社交滤镜与社会规训下被捆束、塑形。借鉴久保田華布「残像记忆」的手法,金属网与石膏层层叠加,象征被压缩的情绪与碎裂的自我。材料:金属网、石膏、钢丝、色彩颜料。',
    media: ['work03.jpg', 'work03-2.jpg', 'work03-4.jpg'],
  },
  w04: {
    meta: '智能穿戴 · 仿生设计 · 交互装置',
    title: '深海呼吸 — 压力代谢仪式',
    desc: '近未来隐喻:社会压力如深海般无声蔓延。服饰表面流动的呼吸鳃结构随呼吸与心理压力起伏,仿生感官脊柱自颈后延伸,感应单元如神经突触闪烁——将焦虑转化为可视的起伏波纹。材料:3D 打印结构、传感器、Arduino、织物。',
    team: '团队:杨子硕 · 陈炜翔 · 李卓霖 · 温勤学 · 庄嘉程 · 陈静怡',
    media: ['work04.jpg', 'work04-2.jpg', 'work04-scr1.jpg'],
  },
  w05: {
    meta: '交互装置 · 时间感知',
    title: '拓印 — 流动的痕',
    desc: '直径约 30cm 的圆形黑色沙台,中央沙丘之下藏着机械与超声波传感系统。观众靠近,沙丘崩塌流动;远离,则回归静止——但痕迹不可逆。以「沙」为媒介,将无形的时间感知转化为可观察、可触摸的流动痕迹。距离即介入。',
    team: '团队:杨子硕 · 黄雪颖 · 申一辰 · 邱敏婧 · 崔晴瑜',
    media: ['work05.jpg'],
    demo: { href: 'lab/sand-trace.html', label: '▶ 打开互动模拟 Demo(需摄像头)' },
  },
  w07: {
    meta: '系统设计 · 行为可视化 · 环境协同',
    title: '安静指数 / Quiet Index',
    desc: '电子显示屏与环境传感器在夜间自动监测宿舍声环境,把不可见的噪音与作息状态转化为可理解的「安静指数」。非指向性提示避免归因个体;「去 APP 依赖」的分层设计,让不接入系统的人也能从公共屏幕获得基础反馈。',
    media: ['work07.mp4', 'work07-demo.mp4'],
  },
  w08: {
    meta: '非遗再生 · 综合材料 · 装置设计',
    title: '靛狮 · 域守 / Indigo Lion',
    desc: '结合墩头篮非遗与舞狮意象:废弃报纸塑造体量,表面覆以废旧纺织物,拼接轮胎与电路板——柔软乡土与坚硬工业的对照。口部嵌入墩头村长颈景深装置,形成由表及里的阅读路径,重构地方文化记忆。',
    media: ['work08.jpg', 'work08-2.jpg', 'work08-3.jpg', 'work08-demo.mp4'],
  },
};

/* ─────────── LENIS 平滑滚动 ─────────── */
const lenis = new Lenis({ duration: 1.15, smoothWheel: true });
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((t) => lenis.raf(t * 1000));
gsap.ticker.lagSmoothing(0);

document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener('click', (e) => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    closeMenu();
    lenis.scrollTo(target, { offset: 0, duration: 1.6 });
  });
});

/* ─────────── PRELOADER ─────────── */
const preloader = document.getElementById('preloader');
const counterEl = document.getElementById('counter');
const words = gsap.utils.toArray('.preloader__word');

const introTL = gsap.timeline({ paused: true });

(function preload() {
  const state = { n: 0 };
  const wordsTL = gsap.timeline();
  words.forEach((w, idx) => {
    gsap.set(w, { yPercent: 110 });
    wordsTL
      .to(w, { yPercent: 0, duration: 0.4, ease: 'power3.out' }, idx * 0.62)
      .to(w, { yPercent: -110, duration: 0.4, ease: 'power3.in' }, idx * 0.62 + 0.46);
  });
  wordsTL.to(words[words.length - 1], { yPercent: 0, duration: 0.4, ease: 'power3.out' });

  gsap.to(state, {
    n: 100,
    duration: reduceMotion ? 0.3 : 3.2,
    ease: 'power2.inOut',
    onUpdate: () => {
      counterEl.textContent = Math.round(state.n);
      gsap.set('#preloaderBar', { width: state.n + '%' });
    },
    onComplete: exitPreloader,
  });

  function exitPreloader() {
    const tl = gsap.timeline();
    tl.to('.preloader__inner', { yPercent: -12, opacity: 0, duration: 0.6, ease: 'power2.in' })
      .to(preloader, { clipPath: 'inset(0 0 100% 0)', duration: 1.05, ease: 'power4.inOut' }, '-=0.15')
      .set(preloader, { display: 'none' })
      .add(() => introTL.play(), '-=0.9');
  }
})();

/* ─────────── HERO 入场 ─────────── */
const heroLines = new SplitText('.hero__line', { type: 'chars' });
gsap.set(heroLines.chars, { yPercent: 120, rotate: 6 });
gsap.set('.hero__eyebrow .line', { yPercent: 120 });
gsap.set(['.hero__sub', '.hero__scroll-hint', '.hero__marquee'], { autoAlpha: 0 });

introTL
  .to('.hero__eyebrow .line', { yPercent: 0, duration: 0.9, ease: 'power4.out' })
  .to(heroLines.chars, {
    yPercent: 0, rotate: 0,
    duration: 1.3, ease: 'power4.out',
    stagger: { each: 0.035, from: 'start' },
  }, '-=0.55')
  .to('.hero__sub', { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power3.out', startAt: { y: 30 } }, '-=0.7')
  .to(['.hero__marquee', '.hero__scroll-hint'], { autoAlpha: 1, duration: 0.8 }, '-=0.4');

/* hero 标题滚动视差 + 淡出 */
gsap.to('.hero__inner', {
  yPercent: -18, autoAlpha: 0.25, ease: 'none',
  scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true },
});

/* ─────────── 滚动进度条 ─────────── */
gsap.to('#scrollProgress', {
  scaleX: 1, ease: 'none',
  scrollTrigger: { start: 0, end: () => document.documentElement.scrollHeight - innerHeight, scrub: 0.3 },
});

/* ─────────── 通用入场原语 ─────────── */
gsap.utils.toArray('[data-reveal]').forEach((el) => {
  gsap.to(el, {
    opacity: 1, y: 0, duration: 1.1, ease: 'power3.out',
    scrollTrigger: { trigger: el, start: 'top 85%' },
  });
});

gsap.utils.toArray('[data-clip]').forEach((el) => {
  gsap.to(el, {
    clipPath: 'inset(0% 0 0 0)', duration: 1.4, ease: 'power4.inOut',
    scrollTrigger: { trigger: el, start: 'top 82%' },
  });
});

gsap.utils.toArray('[data-parallax]').forEach((img) => {
  const amt = parseFloat(img.dataset.parallax) || 12;
  gsap.fromTo(img, { yPercent: -amt / 2, scale: 1 + amt / 100 }, {
    yPercent: amt / 2, ease: 'none',
    scrollTrigger: { trigger: img.closest('[data-clip]') || img, start: 'top bottom', end: 'bottom top', scrub: true },
  });
});

/* 大标题按字符拆分入场 */
gsap.utils.toArray('[data-split], [data-split-sm]').forEach((el) => {
  const split = new SplitText(el, { type: 'chars' });
  gsap.set(split.chars, { yPercent: 110, opacity: 0 });
  gsap.to(split.chars, {
    yPercent: 0, opacity: 1, duration: 1, ease: 'power4.out',
    stagger: 0.02,
    scrollTrigger: { trigger: el, start: 'top 85%' },
  });
});

/* 宣言正文:字符渐显扫过(scrub) */
const manifestoSplit = new SplitText('[data-lines]', { type: 'chars' });
gsap.set(manifestoSplit.chars, { opacity: 0.14 });
gsap.to(manifestoSplit.chars, {
  opacity: 1, ease: 'none', stagger: 0.35,
  scrollTrigger: { trigger: '[data-lines]', start: 'top 78%', end: 'bottom 45%', scrub: 0.6 },
});

/* ─────────── 数字滚动 ─────────── */
gsap.utils.toArray('[data-count]').forEach((el) => {
  const target = +el.dataset.count;
  const state = { n: 0 };
  ScrollTrigger.create({
    trigger: el, start: 'top 88%', once: true,
    onEnter: () => gsap.to(state, {
      n: target, duration: 1.8, ease: 'power3.out',
      onUpdate: () => { el.textContent = Math.round(state.n); },
    }),
  });
});

/* ─────────── 跑马灯(滚动速度联动) ─────────── */
let scrollVel = 0;
lenis.on('scroll', (e) => { scrollVel = e.velocity || 0; });
const marquees = [];
document.querySelectorAll('.marquee').forEach((mq) => {
  const track = mq.querySelector('.marquee__track');
  const m = {
    dir: parseFloat(mq.dataset.speed) || 1,
    x: 0, half: 0, active: false,
    setX: gsap.quickSetter(track, 'x', 'px'),
    measure: () => { m.half = track.scrollWidth / 2; },
  };
  new IntersectionObserver(([en]) => { m.active = en.isIntersecting; }, { threshold: 0 }).observe(mq);
  marquees.push(m);
});
function measureMarquees() { marquees.forEach((m) => m.measure()); }
addEventListener('load', measureMarquees);
addEventListener('resize', measureMarquees);
measureMarquees();
gsap.ticker.add((_, dtMs) => {
  const boost = Math.min(Math.abs(scrollVel) * 6, 340);
  for (const m of marquees) {
    if (!m.active || !m.half) continue;
    m.x -= (60 + boost) * m.dir * (dtMs / 1000);
    m.setX(gsap.utils.wrap(-m.half, 0, m.x));
  }
});

/* ─────────── 周边横向滚动 ─────────── */
const goodsTrack = document.getElementById('goodsTrack');
if (goodsTrack) {
  const getDist = () => goodsTrack.scrollWidth - innerWidth;
  gsap.to(goodsTrack, {
    x: () => -getDist(), ease: 'none',
    scrollTrigger: {
      trigger: '.goods', start: 'top top',
      end: () => '+=' + getDist(),
      pin: '.goods__pin', scrub: 1,
      invalidateOnRefresh: true, anticipatePin: 1,
    },
  });
}

/* ─────────── 作品序号视差 ─────────── */
gsap.utils.toArray('.work__index').forEach((el) => {
  gsap.fromTo(el, { y: 60 }, {
    y: -60, ease: 'none',
    scrollTrigger: { trigger: el.closest('.work'), start: 'top bottom', end: 'bottom top', scrub: true },
  });
});

/* ─────────── 页脚大字填充 ─────────── */
gsap.to('#footerBig', {
  backgroundPosition: '0% 0', ease: 'none',
  scrollTrigger: { trigger: '#footerBig', start: 'top 85%', end: 'top 30%', scrub: 0.5 },
});

/* ─────────── 自定义光标 ─────────── */
if (isFinePointer) {
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');
  const label = document.getElementById('cursorLabel');
  const pos = { x: innerWidth / 2, y: innerHeight / 2 };
  const fol = { x: pos.x, y: pos.y };
  gsap.set([cursor, follower], { xPercent: -50, yPercent: -50 });

  addEventListener('pointermove', (e) => { pos.x = e.clientX; pos.y = e.clientY; });
  const setCx = gsap.quickSetter(cursor, 'x', 'px');
  const setCy = gsap.quickSetter(cursor, 'y', 'px');
  const setFx = gsap.quickSetter(follower, 'x', 'px');
  const setFy = gsap.quickSetter(follower, 'y', 'px');
  gsap.ticker.add(() => {
    fol.x += (pos.x - fol.x) * 0.13;
    fol.y += (pos.y - fol.y) * 0.13;
    setCx(pos.x); setCy(pos.y);
    setFx(fol.x); setFy(fol.y);
  });

  document.querySelectorAll('a, button, .app__tags li').forEach((el) => {
    el.addEventListener('pointerenter', () => follower.classList.add('is-hover'));
    el.addEventListener('pointerleave', () => follower.classList.remove('is-hover'));
  });
  document.querySelectorAll('.work__media, .goods__item').forEach((el) => {
    el.addEventListener('pointerenter', () => { follower.classList.add('is-view'); label.textContent = 'VIEW'; });
    el.addEventListener('pointerleave', () => follower.classList.remove('is-view'));
  });
}

/* ─────────── 磁吸元素 ─────────── */
if (isFinePointer && !reduceMotion) {
  document.querySelectorAll('[data-magnetic]').forEach((el) => {
    const strength = 0.35;
    const qx = gsap.quickTo(el, 'x', { duration: 0.4, ease: 'power3.out' });
    const qy = gsap.quickTo(el, 'y', { duration: 0.4, ease: 'power3.out' });
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      qx((e.clientX - r.left - r.width / 2) * strength);
      qy((e.clientY - r.top - r.height / 2) * strength);
    });
    el.addEventListener('pointerleave', () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.4)', overwrite: 'auto' });
    });
  });
}

/* ─────────── 导航乱码悬停 ─────────── */
document.querySelectorAll('.nav__link').forEach((link) => {
  const zh = link.textContent;
  const en = link.dataset.scramble;
  link.addEventListener('pointerenter', () => {
    gsap.to(link, { duration: 0.6, scrambleText: { text: en, chars: '!<>-_\\/[]{}—=+*^?#___', speed: 0.9 } });
  });
  link.addEventListener('pointerleave', () => {
    gsap.to(link, { duration: 0.5, scrambleText: { text: zh, chars: '!<>-_\\/[]{}—=+*^?#___', speed: 0.9 } });
  });
});

/* ─────────── 全屏菜单 ─────────── */
const burger = document.getElementById('burger');
const menu = document.getElementById('menu');
let menuOpen = false;
const menuTL = gsap.timeline({ paused: true })
  .set(menu, { visibility: 'visible', pointerEvents: 'auto' })
  .to('.menu__bg', { clipPath: 'inset(0 0 0% 0)', duration: 0.8, ease: 'power4.inOut' })
  .fromTo('.menu__link', { yPercent: 60, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.7, ease: 'power3.out', stagger: 0.07 }, '-=0.3')
  .fromTo('.menu__foot', { opacity: 0 }, { opacity: 1, duration: 0.5 }, '-=0.4');

function openMenu() {
  menuOpen = true;
  menu.classList.add('is-open');
  burger.classList.add('is-open');
  lenis.stop();
  menuTL.timeScale(1).play();
}
function closeMenu() {
  if (!menuOpen) return;
  menuOpen = false;
  burger.classList.remove('is-open');
  lenis.start();
  menuTL.timeScale(1.6).reverse().eventCallback('onReverseComplete', () => menu.classList.remove('is-open'));
}
burger.addEventListener('click', () => (menuOpen ? closeMenu() : openMenu()));

/* ─────────── 3D 倾斜卡片 ─────────── */
if (isFinePointer && !reduceMotion) {
  document.querySelectorAll('[data-tilt]').forEach((card) => {
    gsap.set(card, { transformPerspective: 800 });
    const qrx = gsap.quickTo(card, 'rotateX', { duration: 0.5, ease: 'power2.out' });
    const qry = gsap.quickTo(card, 'rotateY', { duration: 0.5, ease: 'power2.out' });
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      qrx(((e.clientY - r.top) / r.height - 0.5) * -8);
      qry(((e.clientX - r.left) / r.width - 0.5) * 8);
      card.style.setProperty('--mx', ((e.clientX - r.left) / r.width) * 100 + '%');
      card.style.setProperty('--my', ((e.clientY - r.top) / r.height) * 100 + '%');
    });
    card.addEventListener('pointerleave', () => {
      gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.9, ease: 'elastic.out(1, 0.5)', overwrite: 'auto' });
    });
  });
}

/* ─────────── 项目模态框 ─────────── */
const modal = document.getElementById('modal');
gsap.set('.modal__panel', { xPercent: 103 });
const modalTL = gsap.timeline({ paused: true })
  .set(modal, { visibility: 'visible', pointerEvents: 'auto' })
  .to('.modal__bg', { opacity: 1, duration: 0.45, ease: 'power2.out' })
  .to('.modal__panel', { xPercent: 0, duration: 0.8, ease: 'power4.out' }, '-=0.25');

function openModal(id) {
  const data = WORKS[id];
  if (!data) return;
  document.getElementById('modalMeta').textContent = data.meta;
  document.getElementById('modalTitle').textContent = data.title;
  document.getElementById('modalDesc').textContent = data.desc;

  const gallery = document.getElementById('modalGallery');
  gallery.innerHTML = '';
  if (data.team) {
    const t = document.createElement('p');
    t.className = 'modal__team';
    t.textContent = data.team;
    gallery.appendChild(t);
  }
  if (data.demo) {
    const d = document.createElement('a');
    d.href = data.demo.href;
    d.target = '_blank';
    d.rel = 'noopener';
    d.className = 'work__open';
    d.style.marginBottom = '1rem';
    d.textContent = data.demo.label;
    gallery.appendChild(d);
  }
  data.media.forEach((m) => {
    let node;
    if (m.endsWith('.mp4')) {
      node = document.createElement('video');
      node.src = 'assets/img/' + m;
      node.muted = true; node.loop = true; node.autoplay = true; node.playsInline = true;
      node.controls = true;
    } else {
      node = document.createElement('img');
      node.src = 'assets/img/' + m;
      node.loading = 'lazy';
      node.alt = data.title;
    }
    gallery.appendChild(node);
  });

  document.getElementById('modalScroll').scrollTop = 0;
  modal.classList.add('is-open');
  lenis.stop();
  modalTL.timeScale(1).play();
  gsap.fromTo(gallery.children, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', stagger: 0.08, delay: 0.35 });
}
function closeModal() {
  lenis.start();
  modalTL.timeScale(1.5).reverse().eventCallback('onReverseComplete', () => {
    modal.classList.remove('is-open');
    document.getElementById('modalGallery').querySelectorAll('video').forEach((v) => v.pause());
  });
}
document.querySelectorAll('.work').forEach((w) => {
  const id = w.dataset.work;
  w.querySelector('.work__open').addEventListener('click', () => openModal(id));
  w.querySelector('.work__media').addEventListener('click', () => openModal(id));
});
document.getElementById('modalClose').addEventListener('click', closeModal);
document.getElementById('modalBg').addEventListener('click', closeModal);
addEventListener('keydown', (e) => {
  if (e.key === 'Escape') { closeModal(); closeMenu(); }
});

/* ─────────── 视频离屏暂停 ─────────── */
const vidObserver = new IntersectionObserver((entries) => {
  entries.forEach((en) => {
    const v = en.target;
    if (en.isIntersecting) { v.play().catch(() => {}); } else { v.pause(); }
  });
}, { threshold: 0.15 });
document.querySelectorAll('main video').forEach((v) => vidObserver.observe(v));

/* ─────────── 字体加载后刷新 ─────────── */
if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(() => ScrollTrigger.refresh());
}
addEventListener('load', () => ScrollTrigger.refresh());
