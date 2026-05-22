/* =========================================================
   CloudBaby 小云朵班级常规养成助手
   app.js
   纯前端、无外部依赖、localStorage 持久化
   ========================================================= */

(() => {
  'use strict';

  const STORAGE_KEY = 'CloudBaby_State_v1';
  const MAX_HISTORY = 400;
  const MAX_DAILY_LOGS = 160;
  const MAX_PETALS = 5;

  const LEVELS = [
    { level: 1, threshold: 10, emoji: '🎀', name: '蝴蝶结' },
    { level: 2, threshold: 30, emoji: '🌸', name: '小花花' },
    { level: 3, threshold: 60, emoji: '👑', name: '小皇冠' },
    { level: 4, threshold: 100, emoji: '🦋', name: '小蝴蝶' },
    { level: 5, threshold: 150, emoji: '🌈', name: '小彩虹' },
    { level: 6, threshold: 210, emoji: '💎', name: '宝石' },
    { level: 7, threshold: 280, emoji: '⭐', name: '小星星' },
    { level: 8, threshold: 360, emoji: '🕊️', name: '和平鸽' },
    { level: 9, threshold: 450, emoji: '🎪', name: '小马戏团' },
    { level: 10, threshold: 550, emoji: '🏆', name: '冠军奖杯' }
  ];

  const GROUP_NAMES = ['苹果组', '星星组', '月亮组', '太阳组', '彩虹组', '云朵组'];
  const GROUP_EMOJIS = ['🍎', '⭐', '🌙', '☀️', '🌈', '☁️'];

  const SCENES = [
    {
      id: 'arrival',
      emoji: '🌅',
      title: '入园',
      badge: '🌅 入园',
      stageClass: 'stage-arrival',
      guide: '小云朵正在门口等大家问好，开启亮晶晶的一天。',
      tasks: ['主动问好', '放好书包', '微笑入园'],
      visuals: [
        ['visual-large', 'left:8%;bottom:12%;', '🏫'],
        ['visual-medium', 'right:11%;top:18%;', '🎒'],
        ['visual-small', 'left:18%;top:18%;', '☀️']
      ]
    },
    {
      id: 'exercise',
      emoji: '☀️',
      title: '早操',
      badge: '☀️ 早操',
      stageClass: 'stage-exercise',
      guide: '跟着音乐动起来，小云朵会吸收到满满太阳能量。',
      tasks: ['跟着节奏', '动作有力', '保持安全距离'],
      visuals: [
        ['visual-large', 'left:9%;top:10%;', '☀️'],
        ['visual-medium', 'right:12%;bottom:16%;', '🎵'],
        ['visual-small', 'left:18%;bottom:18%;', '🏃']
      ]
    },
    {
      id: 'lineup',
      emoji: '🚂',
      title: '排队',
      badge: '🚂 排队',
      stageClass: 'stage-lineup',
      guide: '小火车准备出发啦，排整齐的车厢会一个个亮起来。',
      tasks: ['站在线上', '不推不挤', '跟上队伍'],
      visuals: [
        ['visual-large', 'left:8%;bottom:13%;', '🚂'],
        ['visual-medium', 'right:11%;bottom:16%;', '🚃'],
        ['visual-medium', 'right:23%;bottom:16%;', '🚃']
      ]
    },
    {
      id: 'class',
      emoji: '📚',
      title: '上课',
      badge: '📚 上课',
      stageClass: 'stage-class',
      guide: '坐好、认真听、举手说，小云朵的注意力星星会增加。',
      tasks: ['坐端正', '认真听', '举手表达'],
      visuals: [
        ['visual-large', 'left:8%;bottom:12%;', '📚'],
        ['visual-medium', 'right:12%;top:16%;', '💡'],
        ['visual-small', 'left:22%;top:18%;', '⭐']
      ]
    },
    {
      id: 'quiet',
      emoji: '🤫',
      title: '安静',
      badge: '🤫 安静',
      stageClass: 'stage-quiet',
      guide: '把声音放轻一点，声音泡泡就会慢慢变小。',
      tasks: ['轻声走', '轻声说', '慢慢走'],
      visuals: [
        ['visual-large', 'left:8%;bottom:13%;', '🫧'],
        ['visual-medium', 'right:14%;top:18%;', '🤫'],
        ['visual-small', 'left:20%;top:20%;', '🕊️']
      ]
    },
    {
      id: 'meal',
      emoji: '🍽️',
      title: '进餐',
      badge: '🍽️ 进餐',
      stageClass: 'stage-meal',
      guide: '不挑食、光盘、勇敢尝试，小云朵会补充营养能量。',
      tasks: ['不挑食', '光盘行动', '尝试新食物'],
      visuals: [
        ['visual-large', 'left:8%;bottom:14%;', '🍽️'],
        ['visual-medium', 'right:12%;bottom:18%;', '🥕'],
        ['visual-medium', 'right:24%;top:18%;', '🍚']
      ]
    },
    {
      id: 'nap',
      emoji: '😴',
      title: '午睡',
      badge: '😴 午睡',
      stageClass: 'stage-nap',
      guide: '安静躺好，闭眼休息，小云朵会进入甜甜梦乡。',
      tasks: ['安静躺好', '闭眼休息', '不打扰别人'],
      visuals: [
        ['visual-large', 'left:10%;top:14%;', '🌙'],
        ['visual-small', 'right:15%;top:18%;', '⭐'],
        ['visual-medium', 'right:13%;bottom:18%;', '🧸']
      ]
    },
    {
      id: 'cleanup',
      emoji: '🧸',
      title: '收玩具',
      badge: '🧸 收玩具',
      stageClass: 'stage-cleanup',
      guide: '把玩具宝宝送回家，小云朵的房间会越来越整齐。',
      tasks: ['分类整理', '送玩具回家', '一起合作'],
      visuals: [
        ['visual-large', 'left:9%;bottom:14%;', '🧸'],
        ['visual-medium', 'right:12%;bottom:17%;', '🧩'],
        ['visual-medium', 'right:25%;top:19%;', '📦']
      ]
    },
    {
      id: 'summary',
      emoji: '📊',
      title: '离园总结',
      badge: '📊 总结',
      stageClass: 'stage-summary',
      guide: '放学前看看小云朵今天的成长报告。',
      tasks: ['看今日状态', '表扬小明星', '查看累计成长'],
      visuals: [
        ['visual-large', 'left:9%;bottom:13%;', '📬'],
        ['visual-medium', 'right:12%;top:18%;', '🏅'],
        ['visual-medium', 'right:22%;bottom:17%;', '🌈']
      ]
    }
  ];

  const TEMPLATES = {
    arrival: {
      praise: [
        '{target}今天主动问好啦，小云朵一下子醒得亮晶晶！',
        '{target}把书包放好了，小云朵送你一颗整理星！',
        '{target}微笑走进教室，小云朵的早晨变甜了。',
        '{target}进园很有礼貌，云朵门口开出一朵小花。',
        '{target}准备得真快，小云朵可以安心开始新一天啦！'
      ],
      remind: [
        '{target}，小云朵还在等你的早安问候，我们一起说一声好吗？',
        '{target}，书包宝宝想回到自己的小位置，我们一起帮它吧。',
        '{target}，进教室慢慢走，小云朵会觉得更安全。',
        '{target}，先把小手空出来，云朵会更容易抱抱你。',
        '{target}，我们用微笑开始今天，好吗？'
      ],
      encourage: [
        '彩虹班用问好开启一天，小云朵已经慢慢亮起来啦！',
        '每一个微笑都会被小云朵记住，我们一起开始吧。',
        '今天不比谁最快，我们一起把入园常规做好。'
      ]
    },
    exercise: {
      praise: [
        '{target}早操动作真有力，小云朵吸收到太阳能量啦！',
        '{target}跟着节奏动起来，云朵都想一起跳舞。',
        '{target}站在安全位置做早操，真像活力小太阳！',
        '{target}小手伸得高高的，把阳光送给小云朵啦。',
        '{target}坚持做完动作，小云朵给你一颗运动星！'
      ],
      remind: [
        '{target}，我们把小手小脚动起来，帮小云朵充一点能量吧。',
        '{target}，跟着音乐慢慢来，小云朵会陪你一起做。',
        '{target}，和旁边小朋友保持距离，云朵会更安心。',
        '{target}，眼睛看老师，动作会变得更整齐。',
        '{target}，太阳能量还差一点，我们再试一次。'
      ],
      encourage: [
        '彩虹班的小太阳们一起运动，小云朵越来越有精神啦！',
        '跟着音乐动一动，今天的能量就从早操开始。',
        '动作不一定最快，认真跟着做就是最棒的。'
      ]
    },
    lineup: {
      praise: [
        '{target}找到自己的小车厢啦，小云朵火车准备出发！',
        '{target}排得直直的，像一节亮晶晶的小车厢。',
        '{target}没有推挤，云朵火车开得又稳又安全。',
        '{target}跟上队伍啦，小云朵给你一张车票。',
        '{target}站在线上真认真，火车灯都亮起来了！'
      ],
      remind: [
        '{target}，小火车还差你这一节车厢，我们一起站回队伍里吧。',
        '{target}，脚步站稳，小云朵火车马上出发啦。',
        '{target}，轻轻排队不推挤，火车开得更安全。',
        '{target}，看一看前面的小朋友，我们跟上队伍。',
        '{target}，车厢要排整齐，云朵司机才找得到方向。'
      ],
      encourage: [
        '彩虹班小火车准备出发，整齐的车厢最安全！',
        '排队不是比赛快慢，是一起安全到达。',
        '每个小朋友都是重要车厢，大家连起来就能出发。'
      ]
    },
    class: {
      praise: [
        '{target}坐得端端正正，小云朵的注意力星星亮了。',
        '{target}认真听老师说话，云朵把这一刻记下来了。',
        '{target}举手表达真勇敢，小云朵送你一颗想法星！',
        '{target}眼睛看老师，像小星星一样亮。',
        '{target}上课很专注，云朵的小书本翻开啦。'
      ],
      remind: [
        '{target}，坐直一点，小云朵就能和你一起听清故事。',
        '{target}，精彩内容要开始啦，我们把眼睛送给老师。',
        '{target}，想说话可以举小手，小云朵会等你。',
        '{target}，小椅子想抱住你，我们坐稳一点。',
        '{target}，把小耳朵打开，云朵的故事星要亮啦。'
      ],
      encourage: [
        '认真听、勇敢说，彩虹班的想法星越来越多。',
        '每一个举起的小手，都是送给小云朵的勇敢礼物。',
        '我们一起安静听讲，让故事完整住进小脑袋里。'
      ]
    },
    quiet: {
      praise: [
        '{target}轻轻走路，小云朵听见了安静的声音。',
        '{target}把声音放小了，声音泡泡慢慢变透明啦。',
        '{target}轻声说话很温柔，小云朵觉得好舒服。',
        '{target}没有打扰别人，云朵送你一片小羽毛。',
        '{target}慢慢走、轻轻走，像保护小云朵的小卫士。'
      ],
      remind: [
        '{target}，我们一起把声音放进小口袋里，好吗？',
        '{target}，脚步轻一点，小云朵会更安心。',
        '{target}，声音泡泡有点大，我们让它慢慢变小。',
        '{target}，像小猫一样轻轻走，云朵会对你笑。',
        '{target}，我们用小小声说话，保护大家的耳朵。'
      ],
      encourage: [
        '安静不是没有声音，是大家都会轻轻保护别人。',
        '彩虹班的轻声能量来了，小云朵觉得很安心。',
        '我们一起把声音变小，让教室变得软软的。'
      ]
    },
    meal: {
      praise: [
        '{target}勇敢尝了一口新食物，小云朵营养能量增加啦！',
        '{target}今天光盘啦，小云朵吃到了满满能量。',
        '{target}不挑食真棒，云朵身体变得更有力。',
        '{target}自己认真吃饭，小云朵给你一颗营养星。',
        '{target}小口小口吃得很安静，云朵餐厅真温暖。'
      ],
      remind: [
        '{target}，我们先尝一小口，给小云朵一点营养能量吧。',
        '{target}，小勺子想帮忙，我们一起慢慢吃。',
        '{target}，饭菜宝宝还在等你，小云朵也想补充能量。',
        '{target}，嘴巴里有食物时慢慢咽，云朵会更放心。',
        '{target}，不着急，我们一口一口把能量吃进去。'
      ],
      encourage: [
        '彩虹班一起补充营养，小云朵会变得更有精神。',
        '勇敢尝一口，就是送给自己的成长礼物。',
        '安静进餐、慢慢咀嚼，小云朵餐厅开饭啦。'
      ]
    },
    nap: {
      praise: [
        '{target}安静躺好了，小云朵的梦境星星亮起来。',
        '{target}闭上眼睛休息，云朵给你盖上甜甜小毯子。',
        '{target}没有打扰别人，午睡月亮轻轻升起来。',
        '{target}呼吸慢慢的，小云朵也进入梦乡啦。',
        '{target}午睡常规做得好，云朵送你一颗梦境星。'
      ],
      remind: [
        '{target}，我们把声音藏进小枕头里，让小云朵也做个甜甜的梦吧。',
        '{target}，身体轻轻躺好，小毯子会保护你。',
        '{target}，闭上眼睛休息一会儿，云朵会陪着你。',
        '{target}，小声音先休息，等起床再出来玩。',
        '{target}，不打扰旁边的小朋友，就是在守护云朵梦境。'
      ],
      encourage: [
        '午睡时间到啦，彩虹班一起进入安静梦境。',
        '闭眼休息不是停止成长，是给下午补充能量。',
        '小声音休息一会儿，小云朵会做一个彩虹梦。'
      ]
    },
    cleanup: {
      praise: [
        '{target}把玩具送回家啦，小云朵的房间一下子变整齐！',
        '{target}会分类整理，玩具宝宝都找到家了。',
        '{target}主动帮忙收玩具，云朵给你一颗整理星。',
        '{target}收拾得又快又轻，小云朵房间变漂亮了。',
        '{target}和小伙伴一起合作，云朵的玩具柜亮起来啦。'
      ],
      remind: [
        '{target}，玩具宝宝还没回家，我们一起送它回家吧。',
        '{target}，小云朵的房间想变整齐，还需要你帮一点忙。',
        '{target}，积木在找自己的盒子，我们帮它排排队。',
        '{target}，收玩具不是着急跑，是慢慢把家找对。',
        '{target}，你的小手一帮忙，云朵房间就会亮一点。'
      ],
      encourage: [
        '玩具宝宝都要回家啦，彩虹班一起帮小云朵整理房间。',
        '一个人收一点，教室就会变得亮晶晶。',
        '分类整理是很厉害的本领，小云朵正在看大家合作。'
      ]
    },
    summary: {
      praise: [
        '{target}今天陪小云朵成长了很多，云朵把努力记下来了。',
        '{target}今天有好多亮晶晶表现，小云朵很想谢谢你。',
        '{target}把好常规坚持到最后，云朵送你一枚离园星。',
        '{target}今天帮助班级变得更温暖，小云朵记得你。',
        '{target}的努力让今天更完整，小云朵明天还想见到你。'
      ],
      remind: [
        '{target}，明天我们可以再帮小云朵多一点，好吗？',
        '{target}，今天还差一点点，明天我们一起继续努力。',
        '{target}，小云朵相信你明天会做得更稳。',
        '{target}，把今天的小提醒收进口袋，明天再试一次。',
        '{target}，我们慢慢来，小云朵会陪你进步。'
      ],
      encourage: [
        '今天的每一次努力都被小云朵记住了，明天继续一起长大。',
        '彩虹班不是一天变好，而是一天一点点变好。',
        '放学啦，小云朵把今天的成长装进云朵信箱。'
      ]
    }
  };

  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => Array.from(document.querySelectorAll(selector));

  const dom = {
    todayLabel: $('#todayLabel'),
    healthTop: $('#healthTop'),
    levelTop: $('#levelTop'),
    voiceToggle: $('#voiceToggle'),
    aboutBtn: $('#aboutBtn'),
    sceneGrid: $('#sceneGrid'),
    groupGrid: $('#groupGrid'),
    kidGrid: $('#kidGrid'),
    classTargetBtn: $('#classTargetBtn'),
    editKidsBtn: $('#editKidsBtn'),
    stageCard: $('#stageCard'),
    sceneTitle: $('#sceneTitle'),
    sceneGuide: $('#sceneGuide'),
    sceneBadge: $('#sceneBadge'),
    sceneVisual: $('#sceneVisual'),
    cloudWrap: $('#cloudWrap'),
    cloudBody: $('#cloudBody'),
    decorRing: $('#decorRing'),
    cloudBubble: $('#cloudBubble'),
    healthFace: $('#healthFace'),
    healthText: $('#healthText'),
    healthDesc: $('#healthDesc'),
    growthLevel: $('#growthLevel'),
    growthText: $('#growthText'),
    growthBar: $('#growthBar'),
    taskChips: $('#taskChips'),
    selectedTargetLabel: $('#selectedTargetLabel'),
    praiseBtn: $('#praiseBtn'),
    remindBtn: $('#remindBtn'),
    encourageBtn: $('#encourageBtn'),
    summaryBtn: $('#summaryBtn'),
    speechMeta: $('#speechMeta'),
    speechBox: $('#speechBox'),
    rerollBtn: $('#rerollBtn'),
    readSpeechBtn: $('#readSpeechBtn'),
    copySpeechBtn: $('#copySpeechBtn'),
    todayPraise: $('#todayPraise'),
    todayRemind: $('#todayRemind'),
    todayEncourage: $('#todayEncourage'),
    starList: $('#starList'),
    dataBtn: $('#dataBtn'),
    flowerList: $('#flowerList'),
    decorGallery: $('#decorGallery'),
    mailboxBtn: $('#mailboxBtn'),
    resetTodayBtn: $('#resetTodayBtn'),
    resetAllBtn: $('#resetAllBtn'),
    modalRoot: $('#modalRoot'),
    particleLayer: $('#particleLayer')
  };

  let state = null;
  let bubbleTimer = null;
  let lastSpeechContext = null;

  function getTodayKey() {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  function getDateLabel() {
    const d = new Date();
    return `${d.getMonth() + 1}月${d.getDate()}日`;
  }

  function getWeekKey(date = new Date()) {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, '0')}`;
  }

  function getYesterdayKey() {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  function clamp(num, min, max) {
    return Math.max(min, Math.min(max, num));
  }

  function getDefaultKids() {
    return Array.from({ length: 27 }, (_, i) => `幼儿${i + 1}`);
  }

  function buildGroups(kids) {
    const groups = [];
    const baseSizes = kids.length === 27 ? [5, 5, 5, 5, 4, 3] : null;
    let start = 0;

    for (let i = 0; i < GROUP_NAMES.length; i++) {
      let size;
      if (baseSizes) {
        size = baseSizes[i];
      } else {
        const remainKids = kids.length - start;
        const remainGroups = GROUP_NAMES.length - i;
        size = Math.ceil(remainKids / remainGroups);
      }
      groups.push({
        id: `group-${i}`,
        name: GROUP_NAMES[i],
        emoji: GROUP_EMOJIS[i],
        kids: kids.slice(start, start + size)
      });
      start += size;
    }

    return groups;
  }

  function createDaily(dateKey = getTodayKey()) {
    const groupPetals = {};
    GROUP_NAMES.forEach((name) => { groupPetals[name] = 0; });

    return {
      date: dateKey,
      health: 100,
      praiseCount: 0,
      remindCount: 0,
      encouragementCount: 0,
      kidPraiseMap: {},
      groupPetals,
      sceneActionMap: {},
      logs: [],
      didGuardToday: false
    };
  }

  function createWeekly(weekKey = getWeekKey()) {
    const groupScores = {};
    GROUP_NAMES.forEach((name) => { groupScores[name] = 0; });

    return {
      weekKey,
      groupScores,
      kidScores: {},
      champions: []
    };
  }

  function createInitialState() {
    const kids = getDefaultKids();
    return {
      version: '1.0.0',
      lastOpenDate: getTodayKey(),
      currentWeekKey: getWeekKey(),
      kids,
      groups: buildGroups(kids),
      selectedTarget: null,
      currentScene: 'arrival',
      settings: {
        voiceOn: true
      },
      daily: createDaily(),
      weekly: createWeekly(),
      longTerm: {
        totalEnergy: 0,
        level: 0,
        unlockedDecorations: [],
        totalPraiseCount: 0,
        kidTotalPraiseMap: {},
        continuousDays: 0,
        lastGuardDate: '',
        historyLogs: [],
        weeklyHonors: []
      },
      ui: {
        lastSpeechText: '',
        lastSpeechType: '',
        lastSpeechScene: '',
        lastSpeechTarget: ''
      }
    };
  }

  function normalizeState(raw) {
    const initial = createInitialState();
    const next = { ...initial, ...raw };

    next.kids = Array.isArray(raw?.kids) && raw.kids.length ? raw.kids : initial.kids;
    next.groups = buildGroups(next.kids);
    next.settings = { ...initial.settings, ...(raw?.settings || {}) };
    next.daily = { ...createDaily(), ...(raw?.daily || {}) };
    next.weekly = { ...createWeekly(), ...(raw?.weekly || {}) };
    next.longTerm = { ...initial.longTerm, ...(raw?.longTerm || {}) };
    next.ui = { ...initial.ui, ...(raw?.ui || {}) };

    if (!next.daily.groupPetals) next.daily.groupPetals = createDaily().groupPetals;
    GROUP_NAMES.forEach((name) => {
      if (typeof next.daily.groupPetals[name] !== 'number') next.daily.groupPetals[name] = 0;
      if (typeof next.weekly.groupScores[name] !== 'number') next.weekly.groupScores[name] = 0;
    });

    next.longTerm.level = calculateLevel(next.longTerm.totalEnergy);
    next.longTerm.unlockedDecorations = LEVELS
      .filter((item) => item.level <= next.longTerm.level)
      .map((item) => item.emoji);

    return next;
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return createInitialState();
      return normalizeState(JSON.parse(raw));
    } catch (error) {
      console.warn('CloudBaby 状态读取失败，将使用初始状态：', error);
      return createInitialState();
    }
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.warn('CloudBaby 状态保存失败：', error);
      showToast('数据保存失败，请检查浏览器存储空间');
    }
  }

  function checkDateAndWeekReset() {
    const today = getTodayKey();
    const weekKey = getWeekKey();

    if (!state.daily || state.daily.date !== today) {
      state.daily = createDaily(today);
      state.lastOpenDate = today;
    }

    if (!state.weekly || state.weekly.weekKey !== weekKey) {
      const honor = buildWeeklyHonor(state.weekly);
      if (honor) {
        state.longTerm.weeklyHonors.unshift(honor);
        state.longTerm.weeklyHonors = state.longTerm.weeklyHonors.slice(0, 12);
      }
      state.weekly = createWeekly(weekKey);
      state.currentWeekKey = weekKey;
    }
  }

  function buildWeeklyHonor(weekly) {
    if (!weekly) return null;
    const bestGroup = getTopEntries(weekly.groupScores || {}, 1)[0];
    const bestKid = getTopEntries(weekly.kidScores || {}, 1)[0];
    if (!bestGroup && !bestKid) return null;

    return {
      weekKey: weekly.weekKey,
      group: bestGroup ? bestGroup[0] : '暂无',
      groupScore: bestGroup ? bestGroup[1] : 0,
      kid: bestKid ? bestKid[0] : '暂无',
      kidScore: bestKid ? bestKid[1] : 0,
      createdAt: new Date().toISOString()
    };
  }

  function initApp() {
    state = loadState();
    checkDateAndWeekReset();
    bindEvents();
    renderAll();
    saveState();
    showBubble('你好呀！我是小云朵，今天也一起守护好常规吧。');
  }

  function bindEvents() {
    dom.praiseBtn.addEventListener('click', handlePraise);
    dom.remindBtn.addEventListener('click', handleRemind);
    dom.encourageBtn.addEventListener('click', handleEncourage);
    dom.summaryBtn.addEventListener('click', showSummaryModal);
    dom.rerollBtn.addEventListener('click', rerollSpeech);
    dom.readSpeechBtn.addEventListener('click', () => speakText(state.ui.lastSpeechText || dom.speechBox.textContent));
    dom.copySpeechBtn.addEventListener('click', () => copyText(state.ui.lastSpeechText || dom.speechBox.textContent));
    dom.dataBtn.addEventListener('click', showDataModal);
    dom.mailboxBtn.addEventListener('click', showMailboxModal);
    dom.resetTodayBtn.addEventListener('click', resetToday);
    dom.resetAllBtn.addEventListener('click', resetAll);
    dom.editKidsBtn.addEventListener('click', openSettingsModal);
    dom.aboutBtn.addEventListener('click', showAboutModal);
    dom.voiceToggle.addEventListener('click', toggleVoice);
    dom.classTargetBtn.addEventListener('click', () => selectTarget('class', 'class'));
    dom.cloudWrap.addEventListener('click', handleCloudClick);
    dom.cloudWrap.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handleCloudClick();
      }
    });
  }

  function renderAll() {
    renderScenes();
    renderTargets();
    renderStage();
    renderCloud();
    renderStats();
    renderSpeech();
  }

  function renderScenes() {
    dom.sceneGrid.innerHTML = SCENES.map((scene) => `
      <button class="scene-btn ${state.currentScene === scene.id ? 'active' : ''}" type="button" data-scene="${scene.id}">
        <span>${scene.emoji}</span>${scene.title}
      </button>
    `).join('');

    dom.sceneGrid.querySelectorAll('.scene-btn').forEach((btn) => {
      btn.addEventListener('click', () => selectScene(btn.dataset.scene));
    });
  }

  function renderTargets() {
    const selected = state.selectedTarget;
    dom.classTargetBtn.classList.toggle('active', selected?.type === 'class');

    dom.groupGrid.innerHTML = state.groups.map((group) => `
      <button class="group-btn ${selected?.type === 'group' && selected.id === group.id ? 'active' : ''}" type="button" data-group-id="${group.id}">
        ${group.emoji} ${group.name}
      </button>
    `).join('');

    dom.groupGrid.querySelectorAll('.group-btn').forEach((btn) => {
      btn.addEventListener('click', () => selectTarget('group', btn.dataset.groupId));
    });

    dom.kidGrid.innerHTML = state.kids.map((kid, index) => `
      <button class="kid-btn ${selected?.type === 'kid' && selected.id === kid ? 'active' : ''}" type="button" data-kid="${escapeAttr(kid)}" data-index="${index}">
        ${kid}
      </button>
    `).join('');

    dom.kidGrid.querySelectorAll('.kid-btn').forEach((btn) => {
      btn.addEventListener('click', () => selectTarget('kid', btn.dataset.kid));
    });

    const label = getTargetLabel(state.selectedTarget);
    dom.selectedTargetLabel.textContent = label ? `已选择：${label}` : '未选择对象';
  }

  function renderStage() {
    const scene = getScene(state.currentScene);
    dom.stageCard.querySelector('.cloud-stage').className = `cloud-stage ${scene.stageClass}`;
    dom.sceneTitle.textContent = scene.title;
    dom.sceneGuide.textContent = scene.guide;
    dom.sceneBadge.textContent = scene.badge;
    dom.taskChips.innerHTML = scene.tasks.map((task) => `<span class="task-chip">${task}</span>`).join('');
    dom.sceneVisual.innerHTML = scene.visuals.map(([cls, style, content], index) => `
      <span class="visual-item ${cls}" style="${style}; animation-delay:${index * 0.45}s;">${content}</span>
    `).join('');
  }

  function renderCloud() {
    const health = state.daily.health;
    dom.cloudWrap.classList.remove('cloud-health-good', 'cloud-health-normal', 'cloud-health-tired', 'cloud-health-sleepy', 'cloud-health-rest');
    dom.cloudWrap.classList.add(getHealthClass(health));

    const unlocked = LEVELS.filter((item) => item.level <= state.longTerm.level);
    dom.decorRing.innerHTML = unlocked.map((item, index) => {
      const angle = (index / Math.max(unlocked.length, 1)) * Math.PI * 2 - Math.PI / 2;
      const radiusX = 132;
      const radiusY = 100;
      const x = 160 + Math.cos(angle) * radiusX - 14;
      const y = 126 + Math.sin(angle) * radiusY - 14;
      return `<span class="decor-item" title="Lv.${item.level} ${item.name}" style="left:${x}px;top:${y}px;animation-delay:${index * 0.18}s;">${item.emoji}</span>`;
    }).join('');
  }

  function renderStats() {
    const levelInfo = getLevelProgress();
    const healthInfo = getHealthInfo(state.daily.health);

    dom.todayLabel.textContent = getDateLabel();
    dom.healthTop.textContent = state.daily.health;
    dom.levelTop.textContent = `Lv.${state.longTerm.level}`;
    dom.voiceToggle.textContent = state.settings.voiceOn ? '🔊 语音开' : '🔇 语音关';

    dom.growthLevel.textContent = `Lv.${state.longTerm.level}`;
    dom.growthText.textContent = levelInfo.isMax
      ? `累计能量 ${state.longTerm.totalEnergy} / 已满级`
      : `累计能量 ${state.longTerm.totalEnergy} / ${levelInfo.nextThreshold}`;
    dom.growthBar.style.width = `${levelInfo.percent}%`;

    dom.healthFace.textContent = healthInfo.emoji;
    dom.healthText.textContent = `今日健康 ${state.daily.health}`;
    dom.healthDesc.textContent = healthInfo.desc;

    dom.todayPraise.textContent = state.daily.praiseCount;
    dom.todayRemind.textContent = state.daily.remindCount;
    dom.todayEncourage.textContent = state.daily.encouragementCount;

    renderStarList();
    renderFlowers();
    renderGallery();
  }

  function renderSpeech() {
    if (state.ui.lastSpeechText) {
      const scene = getScene(state.ui.lastSpeechScene || state.currentScene);
      dom.speechMeta.textContent = `${scene.title} · ${actionName(state.ui.lastSpeechType)} · ${state.ui.lastSpeechTarget || '全班'}`;
      dom.speechBox.textContent = state.ui.lastSpeechText;
    } else {
      dom.speechMeta.textContent = '当前还没有生成话术';
      dom.speechBox.textContent = '选择场景和对象后，点击“表扬”或“温柔提醒”，小云朵会自动生成适合幼儿的温柔话术。';
    }
  }

  function renderStarList() {
    const top = getTopEntries(state.daily.kidPraiseMap, 5);
    if (!top.length) {
      dom.starList.innerHTML = '<div class="empty-tip">今天的小明星正在诞生中</div>';
      return;
    }

    dom.starList.innerHTML = top.map(([name, count], index) => `
      <div class="star-item">
        <span class="star-rank">${index + 1}</span>
        <strong>${escapeHTML(name)}</strong>
        <span>${count} 次</span>
      </div>
    `).join('');
  }

  function renderFlowers() {
    dom.flowerList.innerHTML = state.groups.map((group) => {
      const petals = state.daily.groupPetals[group.name] || 0;
      const petalHTML = Array.from({ length: MAX_PETALS }, (_, i) => `<span class="petal ${i < petals ? 'active' : ''}">🌸</span>`).join('');
      return `
        <div class="flower-item">
          <strong>${group.emoji} ${group.name}</strong>
          <div class="flower-petals">${petalHTML}</div>
        </div>
      `;
    }).join('');
  }

  function renderGallery() {
    dom.decorGallery.innerHTML = LEVELS.map((item) => {
      const unlocked = item.level <= state.longTerm.level;
      return `
        <div class="decor-cell ${unlocked ? '' : 'locked'}" title="Lv.${item.level} ${item.name}">
          <span class="lvl">Lv.${item.level}</span>
          <span class="emoji">${item.emoji}</span>
        </div>
      `;
    }).join('');
  }

  function selectScene(sceneId) {
    state.currentScene = sceneId;
    saveState();
    renderAll();

    const scene = getScene(sceneId);
    showBubble(scene.guide);
    if (sceneId === 'summary') {
      setTimeout(showSummaryModal, 350);
    } else {
      speakText(scene.guide);
    }
  }

  function selectTarget(type, id) {
    if (type === 'class') {
      state.selectedTarget = { type: 'class', id: 'class', name: '全班' };
    } else if (type === 'group') {
      const group = state.groups.find((item) => item.id === id);
      if (!group) return;
      state.selectedTarget = { type: 'group', id: group.id, name: group.name };
    } else if (type === 'kid') {
      state.selectedTarget = { type: 'kid', id, name: id };
    }

    saveState();
    renderTargets();
    const label = getTargetLabel(state.selectedTarget);
    showBubble(`我看见 ${label} 啦！`);
  }

  function handlePraise() {
    if (!ensureTarget()) return;
    const target = state.selectedTarget;
    const text = generateSpeech(state.currentScene, target, 'praise');
    const energy = target.type === 'kid' ? 1 : target.type === 'group' ? 3 : 5;

    state.daily.praiseCount += 1;
    updateHealth(4, false);
    addEnergy(energy);
    updateDailySceneCount(state.currentScene, 'praise');
    markGuardDay();

    if (target.type === 'kid') {
      incrementMap(state.daily.kidPraiseMap, target.name, 1);
      incrementMap(state.weekly.kidScores, target.name, 1);
      incrementMap(state.longTerm.kidTotalPraiseMap, target.name, 1);
      const group = findGroupByKid(target.name);
      if (group) {
        addGroupPetals(group.name, 1);
        incrementMap(state.weekly.groupScores, group.name, 1);
      }
    } else if (target.type === 'group') {
      addGroupPetals(target.name, 2);
      incrementMap(state.weekly.groupScores, target.name, 3);
    } else if (target.type === 'class') {
      state.groups.forEach((group) => addGroupPetals(group.name, 1, false));
      GROUP_NAMES.forEach((name) => incrementMap(state.weekly.groupScores, name, 1));
    }

    state.longTerm.totalPraiseCount += 1;
    addLog({ action: 'praise', text, target });
    commitSpeech(text, 'praise', target);
    saveState();
    renderAll();
    showBubble(text);
    speakText(text);
    animateCloud('jump');
    spawnParticles('⭐', 16);
    checkLevelUpFeedback();
  }

  function handleRemind() {
    if (!ensureTarget()) return;
    const target = state.selectedTarget;
    const text = generateSpeech(state.currentScene, target, 'remind');

    state.daily.remindCount += 1;
    updateHealth(-8, false);
    updateDailySceneCount(state.currentScene, 'remind');
    addLog({ action: 'remind', text, target, history: false });
    commitSpeech(text, 'remind', target);
    saveState();
    renderAll();
    showBubble(text, 4200);
    speakText(text);
    animateCloud('shake');
    spawnParticles('🍃', 8);
  }

  function handleEncourage() {
    const target = state.selectedTarget || { type: 'class', id: 'class', name: '全班' };
    const safeTarget = target.type === 'kid' ? { type: 'class', id: 'class', name: '全班' } : target;
    const text = generateSpeech(state.currentScene, safeTarget, 'encourage');

    state.daily.encouragementCount += 1;
    updateHealth(2, false);
    addEnergy(1);
    updateDailySceneCount(state.currentScene, 'encourage');
    markGuardDay();
    addLog({ action: 'encourage', text, target: safeTarget });
    commitSpeech(text, 'encourage', safeTarget);
    saveState();
    renderAll();
    showBubble(text);
    speakText(text);
    animateCloud('glow');
    spawnParticles('✨', 14);
    checkLevelUpFeedback();
  }

  function ensureTarget() {
    if (state.selectedTarget) return true;
    showToast('请先选择幼儿、小组或全班');
    showBubble('先告诉我，要表扬或提醒谁呢？');
    return false;
  }

  function generateSpeech(sceneId, target, actionType) {
    const sceneTemplates = TEMPLATES[sceneId] || TEMPLATES.arrival;
    const list = sceneTemplates[actionType] || sceneTemplates.praise;
    let template = pickDifferent(list, state.ui.lastSpeechText);
    const label = getTargetLabel(target);
    return template
      .replaceAll('{target}', label)
      .replaceAll('{name}', label)
      .replaceAll('{group}', label)
      .replaceAll('{scene}', getScene(sceneId).title);
  }

  function pickDifferent(list, lastText) {
    if (!Array.isArray(list) || list.length === 0) return '你做得真棒，小云朵记住啦！';
    if (list.length === 1) return list[0];

    let picked = list[Math.floor(Math.random() * list.length)];
    for (let i = 0; i < 8 && picked === lastText; i++) {
      picked = list[Math.floor(Math.random() * list.length)];
    }
    return picked;
  }

  function rerollSpeech() {
    if (!lastSpeechContext) {
      if (!state.selectedTarget) {
        showToast('请先选择对象并生成一句话术');
        return;
      }
      lastSpeechContext = {
        sceneId: state.currentScene,
        target: state.selectedTarget,
        actionType: 'praise'
      };
    }

    const text = generateSpeech(lastSpeechContext.sceneId, lastSpeechContext.target, lastSpeechContext.actionType);
    commitSpeech(text, lastSpeechContext.actionType, lastSpeechContext.target, lastSpeechContext.sceneId);
    saveState();
    renderSpeech();
    showBubble(text);
  }

  function commitSpeech(text, actionType, target, sceneId = state.currentScene) {
    state.ui.lastSpeechText = text;
    state.ui.lastSpeechType = actionType;
    state.ui.lastSpeechScene = sceneId;
    state.ui.lastSpeechTarget = getTargetLabel(target);
    lastSpeechContext = { sceneId, target: { ...target }, actionType };
  }

  function speakText(text) {
    if (!state?.settings?.voiceOn) return;
    if (!text || !('speechSynthesis' in window)) return;

    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'zh-CN';
      utterance.rate = 0.88;
      utterance.pitch = 1.35;
      utterance.volume = 0.95;
      const voices = window.speechSynthesis.getVoices();
      const zhVoice = voices.find((voice) => voice.lang && voice.lang.toLowerCase().includes('zh'));
      if (zhVoice) utterance.voice = zhVoice;
      window.speechSynthesis.speak(utterance);
    } catch (error) {
      console.warn('语音朗读失败：', error);
    }
  }

  function addEnergy(amount) {
    const oldLevel = state.longTerm.level;
    state.longTerm.totalEnergy += amount;
    state.longTerm.level = calculateLevel(state.longTerm.totalEnergy);
    state.longTerm.unlockedDecorations = LEVELS
      .filter((item) => item.level <= state.longTerm.level)
      .map((item) => item.emoji);
    state._justLeveled = state.longTerm.level > oldLevel ? { oldLevel, newLevel: state.longTerm.level } : null;
  }

  function updateHealth(delta, shouldRender = true) {
    state.daily.health = clamp(state.daily.health + delta, 0, 100);
    if (shouldRender) {
      saveState();
      renderAll();
    }
  }

  function calculateLevel(totalEnergy) {
    let level = 0;
    LEVELS.forEach((item) => {
      if (totalEnergy >= item.threshold) level = item.level;
    });
    return level;
  }

  function getLevelProgress() {
    const level = state.longTerm.level;
    const total = state.longTerm.totalEnergy;
    if (level >= 10) return { isMax: true, currentBase: LEVELS[9].threshold, nextThreshold: LEVELS[9].threshold, percent: 100 };

    const next = LEVELS.find((item) => item.level === level + 1);
    const currentBase = level === 0 ? 0 : LEVELS[level - 1].threshold;
    const range = next.threshold - currentBase;
    const current = total - currentBase;
    return {
      isMax: false,
      currentBase,
      nextThreshold: next.threshold,
      percent: clamp((current / range) * 100, 0, 100)
    };
  }

  function checkLevelUpFeedback() {
    const levelInfo = state._justLeveled;
    if (!levelInfo) return;
    const unlocked = LEVELS.filter((item) => item.level > levelInfo.oldLevel && item.level <= levelInfo.newLevel);
    const latest = unlocked[unlocked.length - 1];
    if (!latest) return;

    setTimeout(() => {
      animateCloud('glow');
      spawnParticles('🌈', 24);
      showBubble(`我升到 Lv.${levelInfo.newLevel} 啦！获得了新装饰：${latest.emoji} ${latest.name}！`, 5000);
      speakText(`我升到 ${levelInfo.newLevel} 级啦！获得了新装饰 ${latest.name}！`);
      showLevelModal(levelInfo.newLevel, unlocked);
      state._justLeveled = null;
      saveState();
    }, 350);
  }

  function unlockDecoration(level) {
    const item = LEVELS.find((levelItem) => levelItem.level === level);
    if (!item) return;
    if (!state.longTerm.unlockedDecorations.includes(item.emoji)) {
      state.longTerm.unlockedDecorations.push(item.emoji);
    }
  }

  function addGroupPetals(groupName, amount = 1, showBloom = true) {
    const before = state.daily.groupPetals[groupName] || 0;
    const after = clamp(before + amount, 0, MAX_PETALS);
    state.daily.groupPetals[groupName] = after;
    if (showBloom && before < MAX_PETALS && after >= MAX_PETALS) {
      setTimeout(() => {
        showBubble(`${groupName}的花朵盛开啦！`);
        spawnParticles('🌸', 20);
        speakText(`${groupName}的花朵盛开啦！`);
      }, 250);
    }
  }

  function addLog({ action, text, target, history = true }) {
    const scene = getScene(state.currentScene);
    const logItem = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      date: getTodayKey(),
      time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      timestamp: new Date().toISOString(),
      sceneId: scene.id,
      sceneName: scene.title,
      action,
      targetType: target.type,
      targetName: getTargetLabel(target),
      text
    };

    state.daily.logs.unshift(logItem);
    state.daily.logs = state.daily.logs.slice(0, MAX_DAILY_LOGS);

    if (history && (action === 'praise' || action === 'encourage')) {
      state.longTerm.historyLogs.unshift(logItem);
      state.longTerm.historyLogs = state.longTerm.historyLogs.slice(0, MAX_HISTORY);
    }
  }

  function updateDailySceneCount(sceneId, action) {
    const key = `${sceneId}:${action}`;
    incrementMap(state.daily.sceneActionMap, key, 1);
  }

  function markGuardDay() {
    if (state.daily.didGuardToday) return;
    const today = getTodayKey();
    const yesterday = getYesterdayKey();

    if (state.longTerm.lastGuardDate === today) {
      state.daily.didGuardToday = true;
      return;
    }

    if (state.longTerm.lastGuardDate === yesterday) {
      state.longTerm.continuousDays += 1;
    } else {
      state.longTerm.continuousDays = 1;
    }

    state.longTerm.lastGuardDate = today;
    state.daily.didGuardToday = true;
  }

  function resetToday() {
    openConfirmModal({
      title: '确认今日重置？',
      message: '只会重置今日健康值、今日记录、今日小明星和小组花瓣，不会清空累计等级、能量、装饰和历史信箱。',
      confirmText: '确认今日重置',
      onConfirm: () => {
        state.daily = createDaily(getTodayKey());
        state.selectedTarget = null;
        state.ui.lastSpeechText = '';
        lastSpeechContext = null;
        saveState();
        renderAll();
        showBubble('新的一天开始啦，小云朵又恢复精神了！');
        showToast('今日数据已重置');
      }
    });
  }

  function resetAll() {
    openConfirmModal({
      title: '确认全部清空？',
      message: '这会清空所有累计等级、能量、装饰、历史表扬和名单设置，恢复到初始状态。这个操作不可撤销。',
      confirmText: '全部清空',
      danger: true,
      onConfirm: () => {
        localStorage.removeItem(STORAGE_KEY);
        state = createInitialState();
        lastSpeechContext = null;
        saveState();
        renderAll();
        showBubble('我回到初始状态啦，我们重新开始养成吧。');
        showToast('所有数据已清空');
      }
    });
  }

  function openSettingsModal() {
    const content = `
      <p>请按行输入幼儿姓名。保存后系统会自动重新分组，名单会保存到本浏览器。</p>
      <textarea class="kids-textarea" id="kidsTextarea">${state.kids.map(escapeHTML).join('\n')}</textarea>
      <div class="modal-actions">
        <button class="modal-btn" data-close="true" type="button">取消</button>
        <button class="modal-btn primary" id="saveKidsBtn" type="button">保存名单</button>
      </div>
    `;
    openModal('编辑幼儿名单', content);
    $('#saveKidsBtn').addEventListener('click', saveKidsFromSettings);
  }

  function saveKidsFromSettings() {
    const textarea = $('#kidsTextarea');
    const kids = textarea.value
      .split('\n')
      .map((name) => name.trim())
      .filter(Boolean);

    if (!kids.length) {
      showToast('名单不能为空');
      return;
    }

    state.kids = kids;
    state.groups = buildGroups(kids);
    state.selectedTarget = null;
    GROUP_NAMES.forEach((name) => {
      if (typeof state.daily.groupPetals[name] !== 'number') state.daily.groupPetals[name] = 0;
      if (typeof state.weekly.groupScores[name] !== 'number') state.weekly.groupScores[name] = 0;
    });
    saveState();
    closeModal();
    renderAll();
    showToast('名单已保存');
  }

  function showSummaryModal() {
    const report = buildSummaryReport();
    openModal('📊 今日小云朵成长报告', `
      <div class="summary-report" id="summaryReport">
        ${report.html}
      </div>
      <div class="modal-actions">
        <button class="modal-btn" id="copySummaryBtn" type="button">复制总结</button>
        <button class="modal-btn" id="readSummaryBtn" type="button">朗读总结</button>
        <button class="modal-btn primary" data-close="true" type="button">关闭</button>
      </div>
    `, { wide: true });

    $('#copySummaryBtn').addEventListener('click', () => copyText(report.text));
    $('#readSummaryBtn').addEventListener('click', () => speakText(report.text));
    spawnParticles('✨', 16);
  }

  function buildSummaryReport() {
    const healthInfo = getHealthInfo(state.daily.health);
    const topKids = getTopEntries(state.daily.kidPraiseMap, 5);
    const topKidText = topKids.length ? topKids.map(([name, count]) => `${name}（${count}次）`).join('、') : '今天的小明星正在诞生中';
    const bestGroup = getTopEntries(state.daily.groupPetals, 1)[0];
    const bestGroupText = bestGroup && bestGroup[1] > 0 ? `${bestGroup[0]}（${bestGroup[1]}片花瓣）` : '暂无';
    const mostScene = getMostActiveScene();
    const progress = getLevelProgress();
    const nextText = progress.isMax ? '已经满级啦' : `距离下一级还差 ${Math.max(0, progress.nextThreshold - state.longTerm.totalEnergy)} 能量`;
    const suggestion = buildTeacherSuggestion(mostScene);
    const decorations = LEVELS.filter((item) => item.level <= state.longTerm.level).map((item) => `${item.emoji}${item.name}`).join('、') || '还没有解锁，继续努力';

    const html = `
      <h3>小云朵今天的状态</h3>
      <p class="summary-line">${healthInfo.emoji} 小云朵今日健康值为 <strong>${state.daily.health}</strong>，${healthInfo.summary}</p>
      <h3>今日数据</h3>
      <p class="summary-line">✅ 表扬 ${state.daily.praiseCount} 次　🌱 温柔提醒 ${state.daily.remindCount} 次　✨ 集体鼓励 ${state.daily.encouragementCount} 次</p>
      <p class="summary-line">🌟 今日小明星：${escapeHTML(topKidText)}</p>
      <p class="summary-line">🌸 今日小花园：${escapeHTML(bestGroupText)}</p>
      <p class="summary-line">🧭 今日最活跃场景：${mostScene || '暂无'}</p>
      <h3>长期成长</h3>
      <p class="summary-line">🏅 当前等级：Lv.${state.longTerm.level}　☀️ 累计能量：${state.longTerm.totalEnergy}　${nextText}</p>
      <p class="summary-line">🎁 已获得装饰：${escapeHTML(decorations)}</p>
      <p class="summary-line">🔥 连续守护天数：${state.longTerm.continuousDays} 天</p>
      <h3>AI 教师建议</h3>
      <p class="summary-line">${escapeHTML(suggestion)}</p>
    `;

    const text = [
      '今日小云朵成长报告',
      `小云朵今日健康值：${state.daily.health}，${healthInfo.summary}`,
      `今日表扬：${state.daily.praiseCount} 次；温柔提醒：${state.daily.remindCount} 次；集体鼓励：${state.daily.encouragementCount} 次。`,
      `今日小明星：${topKidText}`,
      `今日小花园：${bestGroupText}`,
      `今日最活跃场景：${mostScene || '暂无'}`,
      `当前等级：Lv.${state.longTerm.level}；累计能量：${state.longTerm.totalEnergy}；${nextText}`,
      `已获得装饰：${decorations}`,
      `连续守护天数：${state.longTerm.continuousDays} 天`,
      `教师建议：${suggestion}`
    ].join('\n');

    return { html, text };
  }

  function buildTeacherSuggestion(mostScene) {
    if (state.daily.health >= 85 && state.daily.remindCount <= 3) {
      return '今天整体常规很好，明天可以继续强化孩子的主动表达和自主收拾，让好习惯更稳定。';
    }
    if (state.daily.remindCount >= 8) {
      return '今天提醒次数较多，建议明天入园前先用小云朵讲一个简短规则故事，再进入具体活动。';
    }
    if (state.daily.health < 50) {
      return '今天小云朵有些疲惫，可以减少批评式提醒，多使用集体鼓励和具体表扬，让孩子重新建立信心。';
    }
    if (mostScene && mostScene.includes('收玩具')) {
      return '收玩具环节比较活跃，可以提前 3 分钟开启倒计时，并用“送玩具回家”的语言降低催促感。';
    }
    if (mostScene && mostScene.includes('排队')) {
      return '排队环节可以使用“小火车车厢”的比喻，让孩子知道自己在队伍中的位置。';
    }
    return '今天已经积累了不少正向表现，明天可以继续用小云朵的成长变化帮助孩子看见自己的进步。';
  }

  function showDataModal() {
    const weeklyGroup = getTopEntries(state.weekly.groupScores, 3).map(([name, score]) => `${name}：${score}`).join('<br>') || '暂无';
    const weeklyKid = getTopEntries(state.weekly.kidScores, 3).map(([name, score]) => `${escapeHTML(name)}：${score}`).join('<br>') || '暂无';
    const topLongTerm = getTopEntries(state.longTerm.kidTotalPraiseMap, 5).map(([name, score]) => `${escapeHTML(name)}：${score}`).join('<br>') || '暂无';
    const recentHonors = state.longTerm.weeklyHonors?.length
      ? state.longTerm.weeklyHonors.slice(0, 4).map((honor) => `${honor.weekKey}：${honor.group} / ${escapeHTML(honor.kid)}`).join('<br>')
      : '暂无';

    openModal('📈 CloudBaby 数据面板', `
      <div class="data-grid">
        <div class="data-card"><h3>今日数据</h3><p>表扬：${state.daily.praiseCount}<br>提醒：${state.daily.remindCount}<br>鼓励：${state.daily.encouragementCount}<br>健康值：${state.daily.health}</p></div>
        <div class="data-card"><h3>长期成长</h3><p>等级：Lv.${state.longTerm.level}<br>累计能量：${state.longTerm.totalEnergy}<br>历史表扬：${state.longTerm.totalPraiseCount}<br>连续守护：${state.longTerm.continuousDays} 天</p></div>
        <div class="data-card"><h3>本周小组</h3><p>${weeklyGroup}</p></div>
        <div class="data-card"><h3>本周个人</h3><p>${weeklyKid}</p></div>
        <div class="data-card"><h3>历史表扬榜</h3><p>${topLongTerm}</p></div>
        <div class="data-card"><h3>近期周荣誉</h3><p>${recentHonors}</p></div>
      </div>
      <div class="modal-actions"><button class="modal-btn primary" data-close="true" type="button">关闭</button></div>
    `, { wide: true });
  }

  function showMailboxModal() {
    const logs = state.longTerm.historyLogs || [];
    const list = logs.length ? logs.map((log) => `
      <div class="log-item">
        <strong>${actionIcon(log.action)} ${escapeHTML(log.targetName)} · ${escapeHTML(log.sceneName)}</strong>
        <p>${escapeHTML(log.text)}</p>
        <small>${log.date} ${log.time}</small>
      </div>
    `).join('') : '<div class="empty-tip">表扬信箱还是空的，今天可以从第一句表扬开始。</div>';

    openModal('📬 表扬信箱', `
      <div class="log-list">${list}</div>
      <div class="modal-actions"><button class="modal-btn primary" data-close="true" type="button">关闭</button></div>
    `, { wide: true });
  }

  function showAboutModal() {
    openModal('☁️ 作品说明', `
      <p><strong>小云朵的成长，就是班级的成长。</strong></p>
      <p>CloudBaby 不是用批评管理孩子，而是把常规培养变成孩子愿意参与的共同任务。幼儿通过问好、排队、安静、收拾、午睡、进餐等日常行为，帮助班级宠物小云朵积累能量、恢复状态、获得装饰。</p>
      <p>教师只需选择场景和对象，点击表扬或温柔提醒，就能获得适合当前情境的儿童化话术，同时系统会自动记录今日表现、长期成长、小组花瓣和表扬信箱。</p>
      <p>长期等级和装饰不会每天清空，孩子可以看到“我们一起养大的云朵”；今日健康值和小明星每天更新，帮助老师进行轻量复盘。</p>
      <div class="modal-actions"><button class="modal-btn primary" data-close="true" type="button">我知道了</button></div>
    `);
  }

  function showLevelModal(level, unlocked) {
    const unlockedText = unlocked.map((item) => `${item.emoji} ${item.name}`).join('、');
    openModal('🎉 小云朵升级啦', `
      <p>小云朵升到 <strong>Lv.${level}</strong> 啦！</p>
      <p>新获得装饰：<strong>${unlockedText}</strong></p>
      <p>这些装饰会永久环绕在小云朵身边，代表彩虹班一点一滴积累下来的努力。</p>
      <div class="modal-actions"><button class="modal-btn primary" data-close="true" type="button">太棒了</button></div>
    `);
  }

  function openConfirmModal({ title, message, confirmText, danger = false, onConfirm }) {
    openModal(title, `
      <p>${escapeHTML(message)}</p>
      <div class="modal-actions">
        <button class="modal-btn" data-close="true" type="button">取消</button>
        <button class="modal-btn ${danger ? 'danger' : 'primary'}" id="confirmModalBtn" type="button">${escapeHTML(confirmText)}</button>
      </div>
    `);
    $('#confirmModalBtn').addEventListener('click', () => {
      closeModal();
      onConfirm?.();
    });
  }

  function openModal(title, content, options = {}) {
    dom.modalRoot.innerHTML = `
      <div class="modal-backdrop" role="dialog" aria-modal="true">
        <div class="modal ${options.wide ? 'wide' : ''}">
          <div class="modal-header">
            <h2>${title}</h2>
            <button class="close-btn" type="button" aria-label="关闭">×</button>
          </div>
          <div class="modal-body">${content}</div>
        </div>
      </div>
    `;

    dom.modalRoot.querySelector('.close-btn').addEventListener('click', closeModal);
    dom.modalRoot.querySelectorAll('[data-close="true"]').forEach((btn) => btn.addEventListener('click', closeModal));
    dom.modalRoot.querySelector('.modal-backdrop').addEventListener('click', (event) => {
      if (event.target.classList.contains('modal-backdrop')) closeModal();
    });
  }

  function closeModal() {
    dom.modalRoot.innerHTML = '';
  }

  function handleCloudClick() {
    const info = getHealthInfo(state.daily.health);
    const scene = getScene(state.currentScene);
    const text = `${info.cloudTalk} 现在是${scene.title}时间，我们一起加油吧。`;
    showBubble(text);
    speakText(text);
    animateCloud('glow');
  }

  function toggleVoice() {
    state.settings.voiceOn = !state.settings.voiceOn;
    if (!state.settings.voiceOn && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    saveState();
    renderStats();
    showToast(state.settings.voiceOn ? '语音已开启' : '语音已关闭');
  }

  function showBubble(text, duration = 3600) {
    if (bubbleTimer) clearTimeout(bubbleTimer);
    dom.cloudBubble.textContent = text;
    dom.cloudBubble.classList.add('show');
    bubbleTimer = setTimeout(() => dom.cloudBubble.classList.remove('show'), duration);
  }

  function animateCloud(className) {
    dom.cloudWrap.classList.remove('jump', 'shake', 'glow');
    void dom.cloudWrap.offsetWidth;
    dom.cloudWrap.classList.add(className);
    setTimeout(() => dom.cloudWrap.classList.remove(className), 1300);
  }

  function spawnParticles(emoji = '⭐', count = 12) {
    const rect = dom.cloudWrap.getBoundingClientRect();
    const startX = rect.left + rect.width / 2;
    const startY = rect.top + rect.height / 2;

    for (let i = 0; i < count; i++) {
      const particle = document.createElement('span');
      particle.className = 'particle';
      particle.textContent = emoji;
      particle.style.left = `${startX + (Math.random() - 0.5) * 60}px`;
      particle.style.top = `${startY + (Math.random() - 0.5) * 50}px`;
      particle.style.setProperty('--dx', `${(Math.random() - 0.5) * 240}px`);
      particle.style.setProperty('--dy', `${-120 - Math.random() * 140}px`);
      particle.style.setProperty('--rot', `${(Math.random() - 0.5) * 520}deg`);
      dom.particleLayer.appendChild(particle);
      setTimeout(() => particle.remove(), 1400);
    }
  }

  function showToast(text) {
    const old = document.querySelector('.toast');
    if (old) old.remove();
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = text;
    document.body.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('show'));
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 260);
    }, 2200);
  }

  function copyText(text) {
    if (!text) return;
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).then(() => showToast('已复制')).catch(() => fallbackCopy(text));
    } else {
      fallbackCopy(text);
    }
  }

  function fallbackCopy(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      showToast('已复制');
    } catch (error) {
      showToast('复制失败，请手动复制');
    }
    textarea.remove();
  }

  function getScene(sceneId) {
    return SCENES.find((scene) => scene.id === sceneId) || SCENES[0];
  }

  function getTargetLabel(target) {
    if (!target) return '';
    if (target.type === 'class') return '彩虹班的小朋友';
    if (target.type === 'group') return `${target.name}的小朋友`;
    return target.name;
  }

  function findGroupByKid(kidName) {
    return state.groups.find((group) => group.kids.includes(kidName));
  }

  function getHealthClass(health) {
    if (health >= 90) return 'cloud-health-good';
    if (health >= 70) return 'cloud-health-normal';
    if (health >= 50) return 'cloud-health-tired';
    if (health >= 30) return 'cloud-health-sleepy';
    return 'cloud-health-rest';
  }

  function getHealthInfo(health) {
    if (health >= 90) {
      return {
        emoji: '😊',
        desc: '白白净净，笑容灿烂',
        summary: '说明彩虹班今天整体常规很好，小朋友给了它很多正向能量。',
        cloudTalk: '我今天亮晶晶的，感觉被大家照顾得很好！'
      };
    }
    if (health >= 70) {
      return {
        emoji: '🙂',
        desc: '状态稳定，继续加油',
        summary: '整体表现比较稳定，还可以通过更多具体表扬让小云朵更亮。',
        cloudTalk: '我现在状态不错，还想继续收到大家的好习惯能量。'
      };
    }
    if (health >= 50) {
      return {
        emoji: '😌',
        desc: '有点疲惫，需要鼓励',
        summary: '今天有些环节需要继续练习，建议多用集体鼓励和具体示范。',
        cloudTalk: '我有一点点累，但大家再努力一点我就会恢复啦。'
      };
    }
    if (health >= 30) {
      return {
        emoji: '😴',
        desc: '需要休息，放慢节奏',
        summary: '今天提醒较多，可以用更明确的场景任务帮助孩子重新进入节奏。',
        cloudTalk: '我有点困了，我们轻轻地、慢慢地把常规做好吧。'
      };
    }
    return {
      emoji: '🧸',
      desc: '休息中，需要温柔守护',
      summary: '今天小云朵比较疲惫，建议减少催促，多使用短句、示范和正向等待。',
      cloudTalk: '我想休息一下，不过我相信大家明天会帮我变亮。'
    };
  }

  function getMostActiveScene() {
    const countByScene = {};
    Object.entries(state.daily.sceneActionMap || {}).forEach(([key, count]) => {
      const [sceneId] = key.split(':');
      countByScene[sceneId] = (countByScene[sceneId] || 0) + count;
    });
    const top = getTopEntries(countByScene, 1)[0];
    return top ? getScene(top[0]).title : '';
  }

  function getTopEntries(map = {}, limit = 5) {
    return Object.entries(map)
      .filter(([, value]) => Number(value) > 0)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit);
  }

  function incrementMap(map, key, amount = 1) {
    if (!key) return;
    map[key] = (Number(map[key]) || 0) + amount;
  }

  function actionName(action) {
    const map = {
      praise: '表扬',
      remind: '温柔提醒',
      encourage: '集体鼓励'
    };
    return map[action] || '话术';
  }

  function actionIcon(action) {
    const map = {
      praise: '✅',
      remind: '🌱',
      encourage: '✨'
    };
    return map[action] || '💬';
  }

  function escapeHTML(value) {
    return String(value ?? '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  function escapeAttr(value) {
    return escapeHTML(value);
  }

  window.addEventListener('DOMContentLoaded', initApp);
})();
