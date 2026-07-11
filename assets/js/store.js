/* ————————————————————————————————————————
   طبقة البيانات المشتركة لموقع «رحلتي» — rahlati:v2
   المخطط الكامل موثّق في docs/STRUCTURE.md
   تُستخدم من الرئيسية وكل صفحات sections/*.html

   لا محتوى تجريبي أو أمثلة عامة: المخزن يبدأ فارغًا وينتظر
   بيانات مروه الحقيقية — عاداتها وأهدافها وأحلامها ويومياتها.
———————————————————————————————————————— */
(function(){
  const KEY = "rahlati:v2";

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

  function buildEmptyStore(){
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
        reflection: ""
      },
      thursday: {
        book: {title:"", image:""},
        checklist: [
          {name:"قراءة فصلٍ من كتابي", done:false},
          {name:"تجهيز قائمة الجمعة", done:false},
          {name:"تدوين خاطرة المساء", done:false}
        ]
      },

      // ————— هرم الطموح الثلاثي —————
      habits: [],   // { id, name, category, active, streak, longestStreak, checkedDates:[], linkedDreamId }
      goals:  [],   // { id, name, category, status, progress, startDate, targetDate, why, notes, milestones:[], tasks:[], photos:[], linkedDreamId }
      dreams: [],   // { id, name, category, why, vision, timeframe, status, relatedGoalIds:[], photos:[] }

      english: {streak:0, todayTask:""},
      achievements: [],   // { name, when } — ستُولَّد تلقائيًا من عادات/أهداف حقيقية مكتملة
      memories: [],       // { caption, date, image }
      settings: {name:"مروه العامري", theme:"ليليّ هادئ", reminder:"٩:٠٠ مساءً", lang:"العربية"},
      activity: {}
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
    store.habits = store.habits || [];
    store.dreams = store.dreams || [];
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
    return store;
  }

  function loadStore(){
    try{
      const saved = JSON.parse(localStorage.getItem(KEY));
      if (saved && saved.journal && saved.friday && saved.activity) return migrate(saved);
    }catch(e){}
    const empty = buildEmptyStore();
    saveStore(empty);
    return empty;
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
    uid, currentWeekStart, weekDates
  };
})();
