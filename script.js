// Hamster Clicker — analog
// Все ассеты ожидаются в папке elements (иконки, картинки, звуки)
// Не является официальным продуктом Hamster Kombat

(() => {
  'use strict';

  // --------- Утилиты ----------
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

  const fmt = (n, digits = 2) => {
    if (!isFinite(n)) return '0';
    const abs = Math.abs(n);
    const sign = n < 0 ? '-' : '';
    const units = [
      { v: 1e15, s: 'Q' },
      { v: 1e12, s: 'T' },
      { v: 1e9,  s: 'B' },
      { v: 1e6,  s: 'M' },
      { v: 1e3,  s: 'K' },
    ];
    for (const u of units) {
      if (abs >= u.v) return sign + (abs / u.v).toFixed(digits) + u.s;
    }
    return sign + (abs < 1000 ? abs.toFixed(abs < 10 ? digits : 0) : abs.toFixed(0));
  };

  const timeFmt = (sec) => {
    sec = Math.max(0, Math.floor(sec));
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    if (h) return `${h}ч ${m}м`;
    if (m) return `${m}м ${s}с`;
    return `${s}с`;
  };

  const nowSec = () => Math.floor(Date.now() / 1000);

  // --------- База апгрейдов ----------
  const UPGRADE_DEFS = [
    // TAP
    { id:'tap_power', type:'tap', icon:'elements/icons/tap_power.png', name:'Сила тапа', desc:'Увеличивает монеты за тап.', baseCost:10, costMult:1.15, effectBase:1, effectPerLevel:1, effectType:'addTap' },
    { id:'max_energy', type:'tap', icon:'elements/icons/energy.png', name:'Макс. энергия', desc:'+к максимальной энергии.', baseCost:50, costMult:1.18, effectBase:10, effectPerLevel:10, effectType:'addMaxEnergy' },
    { id:'energy_regen', type:'tap', icon:'elements/icons/regen.png', name:'Регенерация', desc:'+энергии/сек.', baseCost:75, costMult:1.16, effectBase:0.2, effectPerLevel:0.2, effectType:'addRegen' },
    { id:'crit_chance', type:'tap', icon:'elements/icons/crit.png', name:'Крит. шанс', desc:'Шанс крит-удара.', baseCost:120, costMult:1.20, effectBase:0.01, effectPerLevel:0.01, effectType:'addCritChance' },
    { id:'crit_mult', type:'tap', icon:'elements/icons/critx.png', name:'Крит. множитель', desc:'Сила крита.', baseCost:150, costMult:1.22, effectBase:0.20, effectPerLevel:0.10, effectType:'addCritMult' },

    // PASSIVE
    { id:'kiosk', type:'passive', icon:'elements/icons/kiosk.png', name:'Киоск', desc:'+пассивный доход.', baseCost:100, costMult:1.12, effectBase:1, effectPerLevel:1, effectType:'addPassive' },
    { id:'shop', type:'passive', icon:'elements/icons/shop.png', name:'Магазин', desc:'+пассивный доход.', baseCost:500, costMult:1.13, effectBase:5, effectPerLevel:5, effectType:'addPassive' },
    { id:'exchange', type:'passive', icon:'elements/icons/exchange.png', name:'Биржа', desc:'+пассивный доход.', baseCost:5000, costMult:1.14, effectBase:50, effectPerLevel:50, effectType:'addPassive' },
    { id:'mining_farm', type:'passive', icon:'elements/icons/miner.png', name:'Майнинг ферма', desc:'+пассивный доход.', baseCost:25000, costMult:1.15, effectBase:150, effectPerLevel:150, effectType:'addPassive' },
  ];

  const BASE = {
    tapPower: 1,
    maxEnergy: 50,
    energyRegen: 1,
    critChance: 0.05,
    critMult: 2,
    passivePerSec: 0,
  };

  // --------- Задания ----------
  const QUEST_DEFS = [
    { id:'tap_100', name:'Сделай 100 тапов', type:'taps', target:100, reward:{gems:3, coins:50} },
    { id:'tap_1000', name:'Сделай 1000 тапов', type:'taps', target:1000, reward:{gems:7, coins:200} },
    { id:'buy_5', name:'Купи 5 апгрейдов', type:'buys', target:5, reward:{gems:5, coins:150} },
    { id:'passive_50', name:'Достигни 50/сек пассивно', type:'passive', target:50, reward:{gems:10, coins:0} },
    { id:'level_5', name:'Достигни 5 уровня', type:'level', target:5, reward:{gems:12, coins:0} },
  ];

  // --------- Состояние ----------
  const DEFAULT_STATE = () => ({
    coins: 0,
    gems: 0,
    energy: BASE.maxEnergy,
    maxEnergy: BASE.maxEnergy,
    energyRegen: BASE.energyRegen,
    tapPower: BASE.tapPower,
    critChance: BASE.critChance,
    critMult: BASE.critMult,
    passivePerSec: 0,

    upgrades: {}, // id -> level
    totalBuys: 0,

    boosts: {
      incomeX2: { active:false, endsAt:0 },
      turbo:    { active:false, endsAt:0 }, // no energy cost
      autoclick:{ active:false, endsAt:0, cps:20 },
    },

    level: 1,
    xp: 0,
    xpForNext: 100,

    daily: { lastClaimDay: null, streak: 0 },

    quests: QUEST_DEFS.map(q => ({ id:q.id, progress:0, done:false, claimed:false })),

    settings: { sound:true, vibrate:true, reducedMotion:false },

    stats: { taps:0, crits:0, earned:0, spent:0, timePlayed:0 },

    // системное
    lastActiveAt: nowSec(),
    lastSavedAt: nowSec(),
    version: 1,
  });

  let S = null; // state

  // Буферы для дробных начислений
  const accum = {
    energy: 0,
    coins: 0,
  };

  // --------- Элементы UI ----------
  const coinsText = $('#coinsText');
  const gemsText = $('#gemsText');
  const energyText = $('#energyText');
  const energyMetaText = $('#energyMetaText');
  const regenText = $('#regenText');
  const energyFill = $('#energyFill');
  const tapPowerText = $('#tapPowerText');
  const passiveText = $('#passiveText');
  const levelText = $('#levelText');
  const statTaps = $('#statTaps');
  const statCrits = $('#statCrits');
  const statEarned = $('#statEarned');
  const statSpent = $('#statSpent');
  const statTime = $('#statTime');
  const tapButton = $('#tapButton');

  const x2Badge = $('#x2Badge');
  const turboBadge = $('#turboBadge');
  const autoBadge = $('#autoBadge');
  const critSpark = $('#critSpark');

  const upgradesTapWrap = $('#upgradesTap');
  const upgradesPassiveWrap = $('#upgradesPassive');

  const questsList = $('#questsList');
  const dailyInfo = $('#dailyInfo');
  const dailyClaimBtn = $('#dailyClaimBtn');

  const soundToggle = $('#soundToggle');
  const vibrateToggle = $('#vibrateToggle');
  const motionToggle = $('#motionToggle');
  const exportBtn = $('#exportBtn');
  const importBtn = $('#importBtn');
  const resetBtn = $('#resetBtn');

  const toastEl = $('#toast');
  const modalOverlay = $('#modalOverlay');
  const modalTitle = $('#modalTitle');
  const modalBody = $('#modalBody');
  const modalFooter = $('#modalFooter');
  const modalClose = $('#modalClose');

  // Sounds
  const sClick = $('#sClick');
  const sUpgrade = $('#sUpgrade');
  const sCash = $('#sCash');
  const sBoost = $('#sBoost');
  const sUi = $('#sUi');

  // --------- Рендер ----------
  function renderBalances() {
    coinsText.textContent = fmt(S.coins);
    gemsText.textContent = fmt(S.gems);
    energyText.textContent = `${Math.floor(S.energy)}/${Math.floor(S.maxEnergy)}`;
    energyMetaText.textContent = `${Math.floor(S.energy)}/${Math.floor(S.maxEnergy)}`;
    regenText.textContent = `+${(S.energyRegen).toFixed(2)}/сек`;
    const fill = S.maxEnergy > 0 ? (S.energy / S.maxEnergy) * 100 : 0;
    energyFill.style.width = `${clamp(fill, 0, 100)}%`;

    tapPowerText.textContent = fmt(effectiveTapPower(), 2);
    passiveText.textContent = fmt(effectivePassivePerSec(), 2);
    levelText.textContent = S.level;
  }

  function renderStats() {
    statTaps.textContent = S.stats.taps;
    statCrits.textContent = S.stats.crits;
    statEarned.textContent = fmt(S.stats.earned);
    statSpent.textContent = fmt(S.stats.spent);
    statTime.textContent = `${Math.floor(S.stats.timePlayed)}с`;
  }

  function renderBadges() {
    const now = nowSec();
    x2Badge.hidden = !(S.boosts.incomeX2.active && S.boosts.incomeX2.endsAt > now);
    turboBadge.hidden = !(S.boosts.turbo.active && S.boosts.turbo.endsAt > now);
    autoBadge.hidden = !(S.boosts.autoclick.active && S.boosts.autoclick.endsAt > now);
  }

  function renderUpgrades() {
    upgradesTapWrap.innerHTML = '';
    upgradesPassiveWrap.innerHTML = '';

    for (const def of UPGRADE_DEFS) {
      const level = S.upgrades[def.id] || 0;
      const cost = upgradeCost(def, level);
      const effect = effectAtLevel(def, level + 1); // следующий уровень

      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <div class="card__icon"><img src="${def.icon}" alt=""></div>
        <div class="card__body">
          <div class="card__title">${def.name} <span style="color:var(--muted)">LV ${level}</span></div>
          <div class="card__desc">${def.desc}</div>
          <div class="card__meta">
            <span class="price"><img src="elements/icons/coin.svg"/> ${fmt(cost)}</span>
            <button class="btn" data-upg="${def.id}">Купить (+${formatEffect(def, effect)})</button>
          </div>
        </div>
      `;

      const btn = $('button', card);
      btn.disabled = S.coins < cost;

      btn.addEventListener('click', () => buyUpgrade(def.id));

      if (def.type === 'tap') upgradesTapWrap.appendChild(card);
      else upgradesPassiveWrap.appendChild(card);
    }
  }

  function renderQuests() {
    questsList.innerHTML = '';
    for (const qDef of QUEST_DEFS) {
      const q = S.quests.find(x => x.id === qDef.id);
      const progress = clamp(q.progress / qDef.target, 0, 1);
      const done = q.progress >= qDef.target;
      const claimed = q.claimed;

      const div = document.createElement('div');
      div.className = 'card';
      div.innerHTML = `
        <div class="card__icon"><img src="elements/icons/tasks.svg" alt=""></div>
        <div class="card__body">
          <div class="card__title">${qDef.name}</div>
          <div class="card__desc">
            Прогресс: ${Math.min(q.progress, qDef.target)} / ${qDef.target}
            <div style="height:8px;background:#0f1425;border-radius:999px;overflow:hidden;margin-top:6px;">
              <div style="height:100%; width:${progress*100}%; background:linear-gradient(90deg,#5fe3b8,#00c2ff)"></div>
            </div>
          </div>
          <div class="card__meta">
            <span class="price">
              <img src="elements/icons/gem.svg"/> ${qDef.reward.gems || 0}
              <span style="margin-left:8px"></span>
              <img src="elements/icons/coin.svg"/> ${qDef.reward.coins || 0}
            </span>
            <button class="btn" ${(!done || claimed) ? 'disabled' : ''} data-quest="${qDef.id}">${claimed ? 'Получено' : 'Забрать'}</button>
          </div>
        </div>
      `;

      const btn = $('button', div);
      btn.addEventListener('click', () => claimQuest(qDef.id));

      questsList.appendChild(div);
    }

    // daily
    const todayKey = new Date().toDateString();
    const canClaim = S.daily.lastClaimDay !== todayKey;
    dailyInfo.textContent = canClaim ? `Готово! Серия: ${S.daily.streak} дней` : `Уже получено сегодня. Серия: ${S.daily.streak} дней`;
    dailyClaimBtn.disabled = !canClaim;
  }

  function formatEffect(def, e) {
    if (def.effectType === 'addPassive') return `${fmt(e)}/сек`;
    if (def.effectType === 'addRegen') return `${e.toFixed(2)}/сек`;
    if (def.effectType === 'addCritChance') return `${(e*100).toFixed(0)}%`;
    if (def.effectType === 'addCritMult') return `${e.toFixed(2)}x`;
    return fmt(e);
  }

  // --------- Логика апгрейдов ----------
  function upgradeCost(def, level) {
    return Math.floor(def.baseCost * Math.pow(def.costMult, level));
  }
  function effectAtLevel(def, level) {
    if (level <= 0) return 0;
    return def.effectBase + def.effectPerLevel * (level - 1);
  }

  function recalcDerived() {
    // Сбрасываем к базовым
    let tapPower = BASE.tapPower;
    let maxEnergy = BASE.maxEnergy;
    let energyRegen = BASE.energyRegen;
    let critChance = BASE.critChance;
    let critMult = BASE.critMult;
    let passive = BASE.passivePerSec;

    for (const def of UPGRADE_DEFS) {
      const level = S.upgrades[def.id] || 0;
      if (!level) continue;
      const total = effectAtLevel(def, level);
      switch(def.effectType) {
        case 'addTap': tapPower += total; break;
        case 'addMaxEnergy': maxEnergy += total; break;
        case 'addRegen': energyRegen += total; break;
        case 'addCritChance': critChance += total; break;
        case 'addCritMult': critMult += total; break;
        case 'addPassive': passive += total; break;
      }
    }

    S.tapPower = tapPower;
    S.maxEnergy = maxEnergy;
    S.energyRegen = energyRegen;
    S.critChance = clamp(critChance, 0, 0.9);
    S.critMult = Math.max(1, critMult);
    S.passivePerSec = passive;

    // Энергия не больше нового максимума
    S.energy = clamp(S.energy, 0, S.maxEnergy);
  }

  function buyUpgrade(id) {
    const def = UPGRADE_DEFS.find(x => x.id === id);
    if (!def) return;
    const level = S.upgrades[id] || 0;
    const cost = upgradeCost(def, level);
    if (S.coins < cost) {
      toast('Недостаточно монет');
      return;
    }
    S.coins -= cost;
    S.upgrades[id] = level + 1;
    S.totalBuys += 1;
    S.stats.spent += cost;
    playSound(sUpgrade);

    recalcDerived();
    renderBalances();
    renderUpgrades();
    updateQuestsProgressOnBuy();
    save();

    // Маленькая вспышка монет
    popAtButton($('.card button[data-upg="'+id+'"]'), `-${fmt(cost)}`, '#ff8a8a');
  }

  function updateQuestsProgressOnBuy() {
    const q = S.quests.find(x => x.id === 'buy_5');
    if (q && !q.done) {
      q.progress = Math.min(q.progress + 1, QUEST_DEFS.find(d=>d.id==='buy_5').target);
      if (q.progress >= QUEST_DEFS.find(d=>d.id==='buy_5').target) q.done = true;
      renderQuests();
      saveThrottled();
    }
  }

  // --------- Тап ----------
  function effectiveTapPower() {
    let p = S.tapPower;
    if (S.boosts.incomeX2.active && S.boosts.incomeX2.endsAt > nowSec()) p *= 2;
    return p;
  }
  function effectivePassivePerSec() {
    let p = S.passivePerSec;
    if (S.boosts.incomeX2.active && S.boosts.incomeX2.endsAt > nowSec()) p *= 2;
    return p;
  }

  function doTap(x, y) {
    const now = nowSec();
    // Расход энергии, если нет турбо
    const turboActive = (S.boosts.turbo.active && S.boosts.turbo.endsAt > now);

    if (!turboActive) {
      if (S.energy < 1) {
        toast('Нет энергии');
        shakeEnergy();
        return;
      }
      S.energy -= 1;
    }

    let val = S.tapPower;
    // x2 доход
    if (S.boosts.incomeX2.active && S.boosts.incomeX2.endsAt > now) val *= 2;

    // крит
    const isCrit = Math.random() < S.critChance;
    if (isCrit) {
      val *= S.critMult;
      S.stats.crits++;
      showCrit();
    }

    S.coins += val;
    S.stats.taps++;
    S.stats.earned += val;

    // XP
    addXp(val * 0.1);

    playSound(sClick);
    vibrate(10);

    // Попап
    floating(x, y, `+${fmt(val)}`);

    renderBalances();
    renderStats();
    updateQuestsProgressOnTap();
    saveThrottled();
  }

  function showCrit() {
    critSpark.hidden = false;
    critSpark.classList.remove('crit-show');
    critSpark.offsetWidth; // reflow
    critSpark.classList.add('crit-show');
    setTimeout(() => { critSpark.hidden = true; }, 800);
  }

  function updateQuestsProgressOnTap() {
    const q100 = S.quests.find(x => x.id==='tap_100');
    if (q100 && !q100.done) {
      q100.progress = Math.min(q100.progress + 1, QUEST_DEFS.find(d=>d.id==='tap_100').target);
      if (q100.progress >= QUEST_DEFS.find(d=>d.id==='tap_100').target) q100.done = true;
    }
    const q1000 = S.quests.find(x => x.id==='tap_1000');
    if (q1000 && !q1000.done) {
      q1000.progress = Math.min(q1000.progress + 1, QUEST_DEFS.find(d=>d.id==='tap_1000').target);
      if (q1000.progress >= QUEST_DEFS.find(d=>d.id==='tap_1000').target) q1000.done = true;
    }
    renderQuests();
  }

  function shakeEnergy() {
    energyFill.style.transition = 'none';
    energyFill.style.transform = 'translateX(-2px)';
    setTimeout(()=> energyFill.style.transform = 'translateX(2px)', 50);
    setTimeout(()=> {
      energyFill.style.transform = 'translateX(0)';
      energyFill.style.transition = '';
    }, 100);
  }

  // --------- Пассив, энергия, цикл ----------
  let lastFrame = performance.now();

  function gameLoop(ts) {
    const dt = Math.min(0.2, (ts - lastFrame) / 1000); // cap 200ms
    lastFrame = ts;

    // время в игре
    S.stats.timePlayed += dt;

    // Энергия реген
    if (!(S.boosts.turbo.active && S.boosts.turbo.endsAt > nowSec())) {
      accum.energy += S.energyRegen * dt;
      if (accum.energy >= 1) {
        const gain = Math.floor(accum.energy);
        accum.energy -= gain;
        S.energy = clamp(S.energy + gain, 0, S.maxEnergy);
      }
    } else {
      // Турбо — поддерживаем макс энергию
      S.energy = S.maxEnergy;
      accum.energy = 0;
    }

    // Пассивный доход
    const pass = effectivePassivePerSec() * dt;
    accum.coins += pass;
    if (accum.coins >= 1) {
      const add = Math.floor(accum.coins);
      accum.coins -= add;
      S.coins += add;
      S.stats.earned += add;
      addXp(add * 0.05);

      // Квест на пассив
      const q = S.quests.find(x => x.id==='passive_50');
      if (q && !q.done) {
        if (S.passivePerSec >= 50) { q.progress = 50; q.done = true; renderQuests(); }
      }
    }

    // Проверка бустов и бейджей
    checkBoostsExpiration();
    renderBadges();

    // Автоклик
    if (S.boosts.autoclick.active && S.boosts.autoclick.endsAt > nowSec()) {
      const cps = S.boosts.autoclick.cps;
      // имитируем клики: cps * dt раз
      const clicks = Math.floor(cps * dt);
      if (clicks > 0) {
        for (let i=0;i<clicks;i++) {
          // центр кнопки
          const rect = tapButton.getBoundingClientRect();
          doTap(rect.left + rect.width/2, rect.top + rect.height/2);
        }
      }
    }

    renderBalances();
    renderStats();

    // автосейв раз в 5 сек
    if (nowSec() - S.lastSavedAt >= 5) save();

    requestAnimationFrame(gameLoop);
  }

  function checkBoostsExpiration() {
    const n = nowSec();
    for (const key of Object.keys(S.boosts)) {
      const b = S.boosts[key];
      if (b.active && b.endsAt <= n) {
        b.active = false;
        b.endsAt = 0;
      }
    }
  }

  // --------- Опыт и уровни ----------
  function addXp(x) {
    S.xp += x;
    while (S.xp >= S.xpForNext) {
      S.xp -= S.xpForNext;
      S.level += 1;
      S.xpForNext = Math.floor(100 * Math.pow(1.15, S.level - 1));
      // Награда за уровень
      S.gems += 5;
      S.energy = S.maxEnergy;
      toast(`Уровень ${S.level}! +5 кристаллов`);
      playSound(sCash);

      // Квест на уровень
      const q = S.quests.find(x => x.id==='level_5');
      if (q && !q.done && S.level >= 5) { q.progress = 5; q.done = true; renderQuests(); }
    }
  }

  // --------- Бусты ----------
  function activateBoost(type) {
    const n = nowSec();
    let cost = 0;
    let dur = 0;

    if (type === 'x2') { cost = 20; dur = 10 * 60; }
    if (type === 'turbo') { cost = 12; dur = 30; }
    if (type === 'auto') { cost = 15; dur = 60; }

    if (S.gems < cost) { toast('Не хватает кристаллов'); return; }

    S.gems -= cost;

    if (type === 'x2') {
      S.boosts.incomeX2.active = true;
      S.boosts.incomeX2.endsAt = n + dur;
    }
    if (type === 'turbo') {
      S.boosts.turbo.active = true;
      S.boosts.turbo.endsAt = n + dur;
    }
    if (type === 'auto') {
      S.boosts.autoclick.active = true;
      S.boosts.autoclick.endsAt = n + dur;
    }

    playSound(sBoost);
    vibrate(30);
    toast('Буст активирован!');
    renderBadges();
    renderBalances();
    save();
  }

  // --------- Задания ----------
  function claimQuest(id) {
    const qDef = QUEST_DEFS.find(x => x.id === id);
    const q = S.quests.find(x => x.id === id);
    if (!q || !qDef) return;
    if (!(q.done && !q.claimed)) return;

    q.claimed = true;
    S.gems += qDef.reward.gems || 0;
    S.coins += qDef.reward.coins || 0;
    S.stats.earned += (qDef.reward.coins || 0);

    playSound(sCash);
    toast('Награда получена!');
    renderBalances();
    renderQuests();
    save();
  }

  // --------- Ежедневная награда ----------
  function claimDaily() {
    const todayKey = new Date().toDateString();
    if (S.daily.lastClaimDay === todayKey) {
      toast('Сегодня уже получено');
      return;
    }
    const streak = (S.daily.lastClaimDay && (new Date(S.daily.lastClaimDay).toDateString() !== todayKey)) ? S.daily.streak + 1 : (S.daily.streak || 1);

    // Награда растет со стриком
    const coins = 100 * streak;
    const gems = Math.min(3 + Math.floor(streak/3), 15);

    S.coins += coins;
    S.gems += gems;
    S.stats.earned += coins;

    S.daily.lastClaimDay = todayKey;
    S.daily.streak = streak;

    playSound(sCash);
    toast(`Ежедневная награда: +${fmt(coins)} монет, +${gems} кристаллов`);
    renderBalances();
    renderQuests();
    save();
  }

  // --------- Сохранение ----------
  const SAVE_KEY = 'hk_analog_v1';

  function save() {
    try {
      S.lastSavedAt = nowSec();
      localStorage.setItem(SAVE_KEY, JSON.stringify(S));
    } catch (e) {
      console.warn('save error', e);
    }
  }
  let saveTimer = null;
  function saveThrottled() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(save, 800);
  }
  function load() {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return DEFAULT_STATE();
    try {
      const parsed = JSON.parse(raw);
      // слияние с дефолтом
      const def = DEFAULT_STATE();
      const merged = Object.assign(def, parsed);
      // восстанавливаем вложенные объекты
      merged.boosts = Object.assign(def.boosts, parsed.boosts || {});
      merged.daily = Object.assign(def.daily, parsed.daily || {});
      merged.settings = Object.assign(def.settings, parsed.settings || {});
      merged.stats = Object.assign(def.stats, parsed.stats || {});
      merged.quests = parsed.quests && Array.isArray(parsed.quests) ? parsed.quests : def.quests;
      return merged;
    } catch(e) {
      console.warn('load error', e);
      return DEFAULT_STATE();
    }
  }

  // Оффлайн доход
  function applyOfflineEarnings(prevTime) {
    const now = nowSec();
    const dt = clamp(now - prevTime, 0, 12*3600); // кап 12 часов
    if (dt < 3) return; // мелочь не показываем

    // Учитыть возможное окончание x2
    let coins = 0;
    const pass = S.passivePerSec;
    const b = S.boosts.incomeX2;
    if (b.active && b.endsAt > prevTime) {
      const tBoost = Math.min(now, b.endsAt) - prevTime;
      const tRest = dt - Math.max(0, tBoost);
      if (tBoost > 0) coins += pass * 2 * tBoost;
      if (tRest > 0) coins += pass * tRest;
    } else {
      coins = pass * dt;
    }
    coins = Math.floor(coins);

    if (coins > 0) {
      S.coins += coins;
      S.stats.earned += coins;
      modal({
        title: 'Оффлайн доход',
        body: `<p>Ты был оффлайн: <b>${timeFmt(dt)}</b></p>
               <p>Заработано пассивно: <b>${fmt(coins)}</b> монет</p>`,
        actions: [{ label:'Забрать', primary:true }]
      });
    }
  }

  // --------- Модалки и тосты ----------
  function modal({ title, body, actions = [] }) {
    modalTitle.textContent = title || 'Инфо';
    modalBody.innerHTML = body || '';
    modalFooter.innerHTML = '';
    for (const a of actions) {
      const btn = document.createElement('button');
      btn.className = 'btn' + (a.primary ? '' : ' btn--ghost');
      btn.textContent = a.label;
      btn.addEventListener('click', () => {
        if (a.onClick) a.onClick();
        closeModal();
      });
      modalFooter.appendChild(btn);
    }
    modalOverlay.hidden = false;
    playSound(sUi);
  }
  function closeModal() { modalOverlay.hidden = true; }

  modalClose.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  function toast(txt, ms = 1400) {
    toastEl.textContent = txt;
    toastEl.classList.add('show');
    setTimeout(() => toastEl.classList.remove('show'), ms);
  }

  // --------- Всплывающие числа ----------
  function floating(x, y, text) {
    const el = document.createElement('div');
    el.className = 'float';
    el.textContent = text;
    el.style.left = x + 'px';
    el.style.top = y + 'px';
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 800);
  }

  function popAtButton(btn, text, color='#ffd257') {
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    floating(rect.left + rect.width/2, rect.top, text);
    const last = document.body.lastElementChild;
    if (last) last.style.color = color;
  }

  // --------- Интеракция ----------
  tapButton.addEventListener('click', (e) => {
    const x = e.clientX || (e.touches && e.touches[0].clientX);
    const y = e.clientY || (e.touches && e.touches[0].clientY);
    doTap(x, y);
  });

  // Навигация
  $$('.tabbar__btn').forEach(btn => {
    btn.addEventListener('click', () => {
      $$('.tabbar__btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const id = btn.dataset.screen;
      $$('.screen').forEach(s => s.classList.remove('active'));
      $('#'+id).classList.add('active');
      playSound(sUi);
    });
  });

  // Вкладки в "Бизнес"
  $$('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const container = tab.parentElement;
      $$('.tab', container).forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const paneId = tab.dataset.tab;
      $$('.tab-pane', container.nextElementSibling).forEach(p => p.classList.remove('active'));
      $('#'+paneId).classList.add('active');
      playSound(sUi);
    });
  });

  // Бусты
  $$('#screen-boosts .btn[data-boost]').forEach(btn => {
    btn.addEventListener('click', () => activateBoost(btn.dataset.boost));
  });

  // Дейли
  dailyClaimBtn.addEventListener('click', claimDaily);

  // Настройки
  soundToggle.addEventListener('change', () => { S.settings.sound = soundToggle.checked; saveThrottled(); });
  vibrateToggle.addEventListener('change', () => { S.settings.vibrate = vibrateToggle.checked; saveThrottled(); });
  motionToggle.addEventListener('change', () => {
    S.settings.reducedMotion = motionToggle.checked;
    document.body.classList.toggle('reduced', S.settings.reducedMotion);
    saveThrottled();
  });

  // Экспорт / Импорт / Сброс
  exportBtn.addEventListener('click', () => {
    const data = btoa(unescape(encodeURIComponent(JSON.stringify(S))));
    modal({
      title: 'Экспорт сохранения',
      body: `<p>Скопируй строку ниже и сохрани.</p>
             <textarea style="width:100%;height:140px;border-radius:8px;background:#0f1425;color:#dfe6f8;border:1px solid rgba(255,255,255,.1);padding:8px">${data}</textarea>`,
      actions: [{ label:'Понятно', primary:true }]
    });
  });

  importBtn.addEventListener('click', () => {
    modal({
      title: 'Импорт сохранения',
      body: `<p>Вставь экспортированный код:</p>
             <textarea id="importText" style="width:100%;height:140px;border-radius:8px;background:#0f1425;color:#dfe6f8;border:1px solid rgba(255,255,255,.1);padding:8px"></textarea>`,
      actions: [
        { label:'Отмена' },
        { label:'Импорт', primary:true, onClick: () => {
            try {
              const txt = $('#importText').value.trim();
              const parsed = JSON.parse(decodeURIComponent(escape(atob(txt))));
              localStorage.setItem(SAVE_KEY, JSON.stringify(parsed));
              location.reload();
            } catch(e) {
              toast('Неверный код');
            }
        }}
      ]
    });
  });

  resetBtn.addEventListener('click', () => {
    modal({
      title: 'Сброс прогресса',
      body: `<p>Удалить все данные и начать заново?</p>`,
      actions: [
        { label:'Отмена' },
        { label:'Сброс', primary:true, onClick: () => {
            localStorage.removeItem(SAVE_KEY);
            location.reload();
        }}
      ]
    });
  });

  // Квесты — клики по кнопкам "Забрать"
  questsList.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-quest]');
    if (btn) claimQuest(btn.dataset.quest);
  });

  // --------- Звук/Вибра ----------
  function playSound(a) {
    if (!S.settings.sound) return;
    try { a.currentTime = 0; a.play(); } catch(e) {}
  }
  function vibrate(ms) {
    if (!S.settings.vibrate) return;
    if (navigator.vibrate) navigator.vibrate(ms);
  }

  // --------- Инициализация ----------
  function init() {
    S = load();
    recalcDerived();
    soundToggle.checked = !!S.settings.sound;
    vibrateToggle.checked = !!S.settings.vibrate;
    motionToggle.checked = !!S.settings.reducedMotion;
    document.body.classList.toggle('reduced', S.settings.reducedMotion);

    renderUpgrades();
    renderBalances();
    renderStats();
    renderQuests();
    renderBadges();

    // Оффлайн доход
    applyOfflineEarnings(S.lastActiveAt);
    S.lastActiveAt = nowSec();
    save();

    // События видимости
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        S.lastActiveAt = nowSec();
        save();
      } else {
        applyOfflineEarnings(S.lastActiveAt);
        S.lastActiveAt = nowSec();
        save();
      }
    });

    // Запуск цикла
    lastFrame = performance.now();
    requestAnimationFrame(gameLoop);
  }

  // старт после загрузки
  window.addEventListener('load', init);

})();
