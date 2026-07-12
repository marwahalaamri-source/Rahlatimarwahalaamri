/* ————————————————————————————————————————
   طبقة البيانات المشتركة لموقع «رحلتي» — rahlati:v3
   المخطط الكامل موثّق في docs/STRUCTURE.md
   تُستخدم من الرئيسية وكل صفحات sections/*.html

   البيانات الأولية هنا هي حياة مروه الحقيقية كما وصفتها بنفسها —
   لا أمثلة عامة. الحقول التأمّلية (لماذا/رؤية) التي لم تكتبها مروه
   بنفسها تُركت فارغة عمدًا لتملأها هي، لا لتُختلَق نيابةً عنها.
   (رُقّي مفتاح التخزين من v2 إلى v3 لضمان تحميل هذه البيانات
   نظيفةً في أي متصفح جرّب النسخة الفارغة سابقًا.)
———————————————————————————————————————— */
(function(){
  const KEY = "rahlati:v3";

  const arabicNum = n => String(n).replace(/\d/g, d => "٠١٢٣٤٥٦٧٨٩"[d]);
  const iso = d => d.toISOString().slice(0,10);
  const daysAgo = n => iso(new Date(Date.now() - n*86400000));
  const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2,7);

  const DAY_NAMES = ["السبت","الأحد","الاثنين","الثلاثاء","الأربعاء","الخميس","الجمعة"];

  /* تاريخ السبت الذي يبدأ به الأسبوع الحالي */
  function currentWeekStart(){
    const satOffset = (new Date().getDay() + 1) % 7;
    return iso(new Date(Date.now() - satOffset*86400000));
  }
  /* الأيام السبعة (السبت→الجمعة) لأسبوعٍ يبدأ بتاريخ weekStartISO */
  function weekDates(weekStartISO){
    const start = new Date(weekStartISO + "T12:00:00");
    return Array.from({length:7}, (_,i)=> iso(new Date(start.getTime() + i*86400000)));
  }

  function habit(name, category, frequency){
    return {id:uid(), name, category, frequency, active:true, streak:0, longestStreak:0, checkedDates:[], linkedDreamId:null};
  }
  function goal(name, category, status, extra){
    return Object.assign({
      id:uid(), name, category, status, progress:0,
      startDate:"", targetDate:"", why:"", notes:"",
      milestones:[], tasks:[], photos:[], linkedDreamId:null
    }, extra||{});
  }
  function dream(name, category){
    return {id:uid(), name, category, why:"", vision:"", timeframe:"", status:"حيّ", relatedGoalIds:[], photos:[]};
  }
  function project(name, status, extra){
    return Object.assign({
      id:uid(), name, status,               // حالي | مستقبلي | مكتمل
      progress:0, startDate:"", targetDate:"",
      why:"", notes:"", milestones:[], tasks:[], photos:[]
    }, extra||{});
  }

  function buildInitialStore(){
    const weekStart = currentWeekStart();
    const dates = weekDates(weekStart);

    return {
      journal: [],   // { date, mood, intent, priorities:["","",""], tasks:[{t,done}],
                     //   plan, diary, gratitude:["","",""], proud, photo, rating, note, linkedGoalId }

      week: {
        goal: "",
        quote: "",
        days: DAY_NAMES.map((name,i) => ({
          name, date: dates[i],
          tasks: [], appointments: [], habits: [], notes: ""
        })),
        shopping: [],
        priorities: ["","",""],
        weeklyGoals: [
          {category:"شخصية", name:"", progress:0},
          {category:"عملية", name:"", progress:0},
          {category:"صحية", name:"", progress:0},
          {category:"دينية", name:"", progress:0},
          {category:"تعلم", name:"", progress:0}
        ],
        review: {worked:"", improve:"", learned:"", goalAchieved:null, focusConsistencyPct:0, rating:0}
      },

      // تركيز الأسبوع — يُختار كل جمعة، بؤرة أو بؤرتان كحد أقصى
      weeklyFocus: {
        weekStart,
        items: [],   // { id, text, linkedHabitId, checkedDates:[] }
        history: []  // { weekStart, items:[{text, consistencyPct}] }
      },

      friday: {
        checklist: [
          {name:"قراءة سورة الكهف", done:false},
          {name:"اختيار تركيز الأسبوع القادم", done:false},
          {name:"التخطيط للأسبوع القادم", done:false},
          {name:"تنظيف الغرفة", done:false},
          {name:"مراجعة الأهداف", done:false},
          {name:"تأمل وامتنان", done:false}
        ],
        reflection: "",
        gratitude: ["","",""],
        spiritualPrep: "",
        nextWeekGoal: "",
        nextWeekPriorities: ["","",""],
        nextWeekFocusItems: [],   // { text, linkedHabitId }
        scheduleNotes: "",
        lastCompleted: ""
      },
      thursday: {
        book: {title:"", image:""},
        checklist: [
          {name:"قراءة فصلٍ من كتابي", done:false},
          {name:"تجهيز قائمة الجمعة", done:false},
          {name:"تدوين خاطرة المساء", done:false}
        ]
      },

      /* ————— هرم الطموح الرباعي: عادات · أهداف · مشاريع · أحلام ————— */

      habits: [
        // 🌙 الإيمان — يومية
        habit("الصلاة في وقتها","دينية","يومية"),
        habit("أذكار الصباح","دينية","يومية"),
        habit("أذكار المساء","دينية","يومية"),
        habit("الدعاء اليومي","دينية","يومية"),
        habit("صلاة الوتر","دينية","يومية"),
        habit("صلاة الضحى","دينية","يومية"),
        // 🌙 الإيمان — أسبوعية
        habit("سورة الكهف كل جمعة","دينية","أسبوعية"),
        habit("الصدقة الأسبوعية","دينية","أسبوعية"),
        habit("التخطيط الأسبوعي (روتين الجمعة)","دينية","أسبوعية"),
        habit("فيتامين د (تذكير أسبوعي)","دينية","أسبوعية"),
        // ❤️ الصحة — يومية
        habit("شرب ١٫٥–٢ لتر ماء","صحية","يومية"),
        habit("تناول ٩٠–١٠٠غ بروتين","صحية","يومية"),
        habit("النوم مبكرًا للاستيقاظ لصلاة الفجر","صحية","يومية"),
        habit("أخذ المكمّلات الغذائية","صحية","يومية"),
        habit("روتين العناية بالبشرة","صحية","يومية"),
        habit("المشي","صحية","يومية"),
        // ❤️ الصحة — تمارين منخفضة التأثير (بسبب حالة في الورك)
        habit("بيلاتس","صحية","أسبوعية"),
        habit("تمارين مرونة وإطالة الورك","صحية","أسبوعية"),
        // 🌸 شخصية
        habit("الحفاظ على غرفتي منظمة","شخصية","يومية"),
        // 👨‍👩‍👧 علاقات — أسبوعية
        habit("قضاء وقتٍ نوعي مع ابنتي","اجتماعية","أسبوعية"),
        habit("قضاء وقتٍ نوعي مع عائلتي","اجتماعية","أسبوعية"),
        habit("صلة الرحم","اجتماعية","أسبوعية"),
        habit("التواصل مع صديقاتي","اجتماعية","أسبوعية")
      ],

      goals: [
        // 🌙 الإيمان
        goal("ختم القرآن الكريم","دينية","جارٍ التنفيذ"),
        goal("أداء العمرة","دينية","لم يبدأ"),
        // ❤️ الصحة
        goal("أن أصبح أقوى وأصحّ نسخة من نفسي","صحية","جارٍ التنفيذ", {
          notes:"بسبب حالة في الورك، التمارين يجب أن تكون منخفضة التأثير: بيلاتس، مشي، وتمارين مرونة الورك."
        }),
        goal("الوصول إلى وزني المستهدف (٥٢ كجم)","صحية","جارٍ التنفيذ", {
          notes:"الوزن الحالي: ٦٥ كجم — الوزن المستهدف: ٥٢ كجم"
        }),
        // 📚 التعلّم
        goal("إتقان الإنجليزية والتحدث بثقة","تعلم","جارٍ التنفيذ", {
          notes:"الأولوية التعليمية الأولى حاليًا"
        }),
        // 💰 المال
        goal("سداد جميع الديون","مالية","جارٍ التنفيذ"),
        goal("بناء صندوق طوارئ","مالية","لم يبدأ"),
        goal("الادخار بانتظام","مالية","جارٍ التنفيذ"),
        goal("بدء الاستثمار","مالية","لم يبدأ"),
        goal("بناء مصدر دخل إضافي","مالية","لم يبدأ"),
        // 🌸 شخصية
        goal("اكتشاف هوايات جديدة","شخصية","لم يبدأ"),
        goal("تجربة تجارب جديدة","شخصية","لم يبدأ"),
        goal("السفر داخل المملكة العربية السعودية","شخصية","لم يبدأ"),
        goal("تطوير مهارتي في التصوير","شخصية","لم يبدأ")
      ],

      dreams: [
        dream("السفر إلى اليابان","شخصية"),
        dream("السفر إلى باريس","شخصية"),
        dream("السفر إلى لندن","شخصية"),
        dream("امتلاك منزل","شخصية"),
        dream("امتلاك سيارة","شخصية"),
        dream("بناء عمل تجاري ناجح","عملية")
      ],

      projects: [
        // مشاريعي الخاصة — لا علاقة لها بالوظيفة اليومية
        project("رحلتي","حالي", {
          progress: 30,
          notes: "موقعي الشخصي الذي نبنيه معًا الآن",
          milestones: [
            {name:"الهوية البصرية والصفحة الرئيسية", done:true},
            {name:"دفتري اليومي", done:true},
            {name:"التخطيط الأسبوعي", done:true},
            {name:"عاداتي وأهدافي وأحلامي ومشاريعي", done:false},
            {name:"روتين الجمعة والخميس", done:false},
            {name:"باقي الأقسام (الإنجليزية، الإنجازات، الذكريات، الإعدادات)", done:false}
          ]
        }),
        project("بناء عملي التجاري الخاص","مستقبلي")
      ],

      /* ————— الصحة: الوزن + التغذية + الرياضة + النوم + المكمّلات + العناية ————— */
      health: {
        weight: { startWeight: 65, current: 65, target: 52, log: [{date: iso(new Date()), kg: 65}] },
        nutrition: { proteinGoalMin: 90, proteinGoalMax: 100, waterGoalL: 1.75, log: [], meals: [] },
        exercise: { log: [] },   // { date, type, durationMin, painBefore, painAfter }
        sleep: { wakeGoal: "٥:٠٠ ص", log: [] },   // { date, sleepTime, wakeTime, hours }
        supplements: [
          {id: uid(), name:"Berberine", frequency:"يومية", doseTime:"", takenDates: []},
          {id: uid(), name:"Vitamin C", frequency:"يومية", doseTime:"", takenDates: []},
          {id: uid(), name:"Glutathione", frequency:"يومية", doseTime:"", takenDates: []},
          {id: uid(), name:"Vitamin D", frequency:"أسبوعية", doseTime:"", takenDates: []}
        ],
        care: { notes: "", photos: [] }
      },

      english: {streak:0, todayTask:""},
      achievements: [],   // { name, when } — ستُولَّد تلقائيًا من عادات/أهداف حقيقية مكتملة
      memories: [],       // { caption, date, image }
      settings: {name:"مروه العامري", theme:"ليليّ هادئ", reminder:"٩:٠٠ مساءً", lang:"العربية"},
      activity: {},

      // أرشيف الأسابيع المنتهية — تُبنى عند كل تدوير أسبوعي (روتين الجمعة)
      weekHistory: []   // { weekStart, review, weeklyGoals, focusItems:[{text,consistencyPct}] }
    };
  }

  /* ترقية آمنة: تعبئة أي حقول أُضيفت لاحقًا للمخطط دون فقدان بيانات قديمة */
  function migrate(store){
    // اليوميات: توحيد الشكل القديم {text, gratitude:string} مع الشكل الغني الحالي
    store.journal = (store.journal || []).map(e => ({
      date: e.date,
      mood: e.mood || "",
      intent: e.intent || "",
      priorities: (e.priorities && e.priorities.length) ? e.priorities : ["","",""],
      tasks: e.tasks || [],
      plan: e.plan || "",
      diary: e.diary || e.text || "",
      gratitude: Array.isArray(e.gratitude) ? e.gratitude : (e.gratitude ? [e.gratitude,"",""] : ["","",""]),
      proud: e.proud || "",
      photo: e.photo || "",
      rating: e.rating || 0,
      note: e.note || "",
      linkedGoalId: e.linkedGoalId || null
    }));

    const w = store.week = store.week || {};
    w.goal = w.goal || "";
    w.quote = w.quote || "";
    w.days = (w.days || []).map(d => ({
      name: d.name,
      date: d.date || "",
      tasks: d.tasks || [],
      appointments: d.appointments || [],
      habits: d.habits || [],
      notes: d.notes || ""
    }));
    w.shopping = w.shopping || [];
    w.priorities = w.priorities && w.priorities.length ? w.priorities : ["","",""];
    w.weeklyGoals = (w.weeklyGoals && w.weeklyGoals.length) ? w.weeklyGoals : [
      {category:"شخصية", name:"", progress:0},
      {category:"عملية", name:"", progress:0},
      {category:"صحية", name:"", progress:0},
      {category:"دينية", name:"", progress:0},
      {category:"تعلم", name:"", progress:0}
    ];
    if (typeof w.review !== "object" || w.review === null){
      w.review = {worked:"", improve:"", learned:"", goalAchieved:null, focusConsistencyPct:0, rating:0};
    }
    w.review.focusConsistencyPct = w.review.focusConsistencyPct || 0;

    // تركيز الأسبوع — يحلّ محل week.habitTracker السابق (يُنقل تلقائيًا إن وُجد)
    if (!store.weeklyFocus){
      store.weeklyFocus = {weekStart: currentWeekStart(), items:[], history:[]};
      if (w.habitTracker && w.habitTracker.name){
        store.weeklyFocus.items.push({id:uid(), text:w.habitTracker.name, linkedHabitId:null, checkedDates:[]});
      }
    }
    delete w.habitTracker;

    // هرم الطموح: تعبئة المصفوفات الناقصة + فصل «أحلام» عن الأهداف
    store.habits = (store.habits || []).map(h => ({
      id: h.id || uid(), name: h.name, category: h.category,
      frequency: h.frequency || "يومية",
      active: h.active !== false, streak: h.streak || 0, longestStreak: h.longestStreak || 0,
      checkedDates: h.checkedDates || [], linkedDreamId: h.linkedDreamId || null
    }));
    store.dreams = (store.dreams || []).map(d => ({
      id: d.id || uid(), name: d.name, category: d.category,
      why: d.why || "", vision: d.vision || "", timeframe: d.timeframe || "",
      status: d.status || "حيّ", relatedGoalIds: d.relatedGoalIds || [], photos: d.photos || []
    }));
    store.projects = (store.projects || []).map(p => ({
      id: p.id || uid(), name: p.name, status: p.status || "حالي",
      progress: p.progress || 0, startDate: p.startDate || "", targetDate: p.targetDate || "",
      why: p.why || "", notes: p.notes || "",
      milestones: p.milestones || [], tasks: p.tasks || [], photos: p.photos || []
    }));

    const catMap = {"روحانية":"دينية", "صحة":"صحية"};
    const statusMap = {"نشط":"جارٍ التنفيذ"};
    const rawGoals = store.goals || [];
    store.goals = [];
    rawGoals.forEach(g => {
      const category = catMap[g.category] || g.category;
      if (category === "أحلام"){
        // هذا "هدف" كان في الحقيقة حلمًا — يُنقل إلى dreams[] بدل حذفه
        store.dreams.push({
          id: g.id || uid(), name: g.name, category: "شخصية",
          why: g.why || "", vision: g.notes || "",
          timeframe: g.targetDate || "", status: g.status === "مكتمل" ? "تحقّق" : "حيّ",
          relatedGoalIds: [], photos: g.photos || []
        });
        return;
      }
      store.goals.push({
        id: g.id || uid(), name: g.name, category,
        status: statusMap[g.status] || g.status || "لم يبدأ",
        progress: g.progress || 0,
        startDate: g.startDate || "", targetDate: g.targetDate || "",
        why: g.why || "", notes: g.notes || "",
        milestones: g.milestones || [], tasks: g.tasks || [], photos: g.photos || [],
        linkedDreamId: g.linkedDreamId || null
      });
    });

    store.english = store.english || {streak:0, todayTask:""};
    store.achievements = store.achievements || [];
    store.memories = store.memories || [];
    store.settings = store.settings || {name:"مروه العامري", theme:"ليليّ هادئ", reminder:"٩:٠٠ مساءً", lang:"العربية"};
    store.activity = store.activity || {};
    store.weekHistory = store.weekHistory || [];

    // روتين الجمعة — تعبئة حقول التجديد الأسبوعي التي أُضيفت لاحقًا
    const f = store.friday = store.friday || {};
    f.checklist = f.checklist && f.checklist.length ? f.checklist : [
      {name:"قراءة سورة الكهف", done:false},
      {name:"اختيار تركيز الأسبوع القادم", done:false},
      {name:"التخطيط للأسبوع القادم", done:false},
      {name:"تنظيف الغرفة", done:false},
      {name:"مراجعة الأهداف", done:false},
      {name:"تأمل وامتنان", done:false}
    ];
    f.reflection = f.reflection || "";
    f.gratitude = (Array.isArray(f.gratitude) && f.gratitude.length) ? f.gratitude : ["","",""];
    f.spiritualPrep = f.spiritualPrep || "";
    f.nextWeekGoal = f.nextWeekGoal || "";
    f.nextWeekPriorities = (Array.isArray(f.nextWeekPriorities) && f.nextWeekPriorities.length) ? f.nextWeekPriorities : ["","",""];
    f.nextWeekFocusItems = f.nextWeekFocusItems || [];
    f.scheduleNotes = f.scheduleNotes || "";
    f.lastCompleted = f.lastCompleted || "";

    // الصحة — تعبئة آمنة لكل حقل، وزرع بيانات مروه الحقيقية عند غيابها فقط
    const h = store.health = store.health || {};
    h.weight = h.weight || {};
    h.weight.current = h.weight.current ?? 65;
    h.weight.target = h.weight.target ?? 52;
    h.weight.startWeight = h.weight.startWeight ?? h.weight.current;
    h.weight.log = (h.weight.log && h.weight.log.length) ? h.weight.log : [{date: iso(new Date()), kg: h.weight.current}];
    h.nutrition = h.nutrition || {};
    h.nutrition.proteinGoalMin = h.nutrition.proteinGoalMin ?? 90;
    h.nutrition.proteinGoalMax = h.nutrition.proteinGoalMax ?? 100;
    h.nutrition.waterGoalL = h.nutrition.waterGoalL ?? 1.75;
    h.nutrition.log = h.nutrition.log || [];
    h.nutrition.meals = h.nutrition.meals || [];
    h.exercise = h.exercise || {};
    h.exercise.log = h.exercise.log || [];
    h.sleep = h.sleep || {};
    h.sleep.wakeGoal = h.sleep.wakeGoal || "٥:٠٠ ص";
    h.sleep.log = h.sleep.log || [];
    h.supplements = (h.supplements && h.supplements.length) ? h.supplements.map(s => ({
      id: s.id || uid(), name: s.name, frequency: s.frequency || "يومية",
      doseTime: s.doseTime || "", takenDates: s.takenDates || []
    })) : [
      {id: uid(), name:"Berberine", frequency:"يومية", doseTime:"", takenDates: []},
      {id: uid(), name:"Vitamin C", frequency:"يومية", doseTime:"", takenDates: []},
      {id: uid(), name:"Glutathione", frequency:"يومية", doseTime:"", takenDates: []},
      {id: uid(), name:"Vitamin D", frequency:"أسبوعية", doseTime:"", takenDates: []}
    ];
    h.care = h.care || {};
    h.care.notes = h.care.notes || "";
    h.care.photos = h.care.photos || [];

    return store;
  }

  /* تدوير الأسبوع — اللحظة التي يبدأ فيها أسبوعٌ جديد فعليًا
     force=true: تُستدعى من زر «أنهيتُ الأسبوع» في روتين الجمعة (تدوير فوري، بصرف النظر عن التاريخ)
     force=false: فحص أمان تلقائي عند التحميل، يُدوِّر فقط إن تجاوز التاريخ الحقيقي أسبوع المتجر */
  function rolloverWeek(store, force){
    const realWeekStart = currentWeekStart();
    if (!force && store.week.days[0] && store.week.days[0].date >= realWeekStart) return store;

    const endingWeekStart = store.week.days[0] ? store.week.days[0].date : realWeekStart;

    // أرشفة تركيز الأسبوع المنتهي
    const endedFocusItems = (store.weeklyFocus.items || []).map(it => {
      const elapsed = store.week.days.filter(d => d.date <= iso(new Date())).length || 7;
      const done = (it.checkedDates || []).length;
      return {text: it.text, consistencyPct: Math.round(100 * done / elapsed)};
    });
    store.weeklyFocus.history = store.weeklyFocus.history || [];
    store.weeklyFocus.history.push({weekStart: endingWeekStart, items: endedFocusItems});

    // أرشفة الأسبوع المنتهي بالكامل
    store.weekHistory = store.weekHistory || [];
    store.weekHistory.push({
      weekStart: endingWeekStart,
      review: store.week.review,
      weeklyGoals: store.week.weeklyGoals,
      focusItems: endedFocusItems
    });

    // بناء الأسبوع الجديد — يبدأ دومًا اليوم التالي مباشرةً لنهاية الأسبوع المنتهي
    const newWeekStart = force
      ? iso(new Date(new Date(endingWeekStart+"T12:00:00").getTime() + 7*86400000))
      : realWeekStart;
    const newDates = weekDates(newWeekStart);
    const f = store.friday;
    store.week = {
      goal: f.nextWeekGoal || "",
      quote: "",
      days: DAY_NAMES.map((name,i) => ({
        name, date: newDates[i], tasks: [], appointments: [], habits: [], notes: ""
      })),
      shopping: [],
      priorities: (f.nextWeekPriorities && f.nextWeekPriorities.some(p=>p)) ? f.nextWeekPriorities : ["","",""],
      weeklyGoals: [
        {category:"شخصية", name:"", progress:0},
        {category:"عملية", name:"", progress:0},
        {category:"صحية", name:"", progress:0},
        {category:"دينية", name:"", progress:0},
        {category:"تعلم", name:"", progress:0}
      ],
      review: {worked:"", improve:"", learned:"", goalAchieved:null, focusConsistencyPct:0, rating:0}
    };

    // ترقية تركيز الأسبوع القادم (المُختار في روتين الجمعة) إلى تركيز الأسبوع الحيّ
    store.weeklyFocus = {
      weekStart: newWeekStart,
      items: (f.nextWeekFocusItems || []).map(it => ({
        id: uid(), text: it.text, linkedHabitId: it.linkedHabitId || null, checkedDates: []
      })),
      history: store.weeklyFocus.history
    };

    // إعادة تهيئة الحقول المرحلية لروتين الجمعة القادم
    f.nextWeekGoal = "";
    f.nextWeekPriorities = ["","",""];
    f.nextWeekFocusItems = [];
    f.lastCompleted = iso(new Date());
    f.checklist = f.checklist.map(c => ({name:c.name, done:false}));
    f.reflection = "";
    f.gratitude = ["","",""];
    f.spiritualPrep = "";
    f.scheduleNotes = "";

    return store;
  }

  function loadStore(){
    try{
      const saved = JSON.parse(localStorage.getItem(KEY));
      if (saved && saved.journal && saved.friday && saved.activity){
        const migrated = migrate(saved);
        rolloverWeek(migrated, false);
        return migrated;
      }
    }catch(e){}
    const initial = buildInitialStore();
    saveStore(initial);
    return initial;
  }

  function saveStore(store){
    try{ localStorage.setItem(KEY, JSON.stringify(store)); }catch(e){}
  }

  function touch(store, sectionId){
    store.activity = store.activity || {};
    store.activity[sectionId] = iso(new Date());
  }

  window.RahlatiStore = {
    load: loadStore, save: saveStore, touch, arabicNum, KEY,
    uid, currentWeekStart, weekDates, rolloverWeek
  };
})();
