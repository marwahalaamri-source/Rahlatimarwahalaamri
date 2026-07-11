/* ————————————————————————————————————————
   طبقة البيانات المشتركة لموقع «رحلتي» — rahlati:v2
   المخطط الكامل موثّق في docs/STRUCTURE.md
   تُستخدم من الرئيسية وكل صفحات sections/*.html
———————————————————————————————————————— */
(function(){
  const KEY = "rahlati:v2";

  const arabicNum = n => String(n).replace(/\d/g, d => "٠١٢٣٤٥٦٧٨٩"[d]);
  const iso = d => d.toISOString().slice(0,10);
  const daysAgo = n => iso(new Date(Date.now() - n*86400000));

  function buildDemoStore(){
    const y = daysAgo(1);
    const satOffset = (new Date().getDay() + 1) % 7; // بداية الأسبوع الحالي = السبت
    const weekStart = new Date(Date.now() - satOffset*86400000);
    const wDate = n => iso(new Date(weekStart.getTime() + n*86400000));

    return {
      journal: [
        {date:y, text:"يومٌ هادئ… مشيتُ عند الغروب، وقرأتُ فصلًا من كتابي المفضّل.", mood:"هادئة", gratitude:"فنجان قهوةٍ في الشرفة"}
      ],
      week: {
        goal:"أسبوعٌ متوازن… عبادة، وحركة، وتعلّم",
        quote:"«الأسبوعُ الجميل يُبنى يومًا بيوم»",
        days:[
          {name:"السبت", date:wDate(0), tasks:[{t:"رياضة الصباح",done:true},{t:"قراءة ٣٠ صفحة",done:true},{t:"ترتيب المكتب",done:false}],
           appointments:[{time:"٩:٠٠ ص",text:"موعد أسناني"}], habits:[{name:"شرب الماء",done:true},{name:"ورد قرآني",done:true}], notes:"يوم هادئ ومنظم"},
          {name:"الأحد", date:wDate(1), tasks:[{t:"مراجعة الإنجليزية",done:true},{t:"مشي المساء",done:true}],
           appointments:[], habits:[{name:"شرب الماء",done:true},{name:"ورد قرآني",done:true}], notes:""},
          {name:"الاثنين", date:wDate(2), tasks:[{t:"كتابة اليوميات",done:true},{t:"مكالمة العائلة",done:false}],
           appointments:[{time:"٤:٠٠ م",text:"اجتماع عمل"}], habits:[{name:"شرب الماء",done:true},{name:"ورد قرآني",done:false}], notes:""},
          {name:"الثلاثاء", date:wDate(3), tasks:[{t:"درس إنجليزية",done:true},{t:"تحضير وجبات صحية",done:true},{t:"قراءة",done:true}],
           appointments:[], habits:[{name:"شرب الماء",done:true},{name:"ورد قرآني",done:true}], notes:"يوم منتج جدًا"},
          {name:"الأربعاء", date:wDate(4), tasks:[{t:"رياضة",done:true},{t:"مراجعة الأهداف",done:false}],
           appointments:[], habits:[{name:"شرب الماء",done:false},{name:"ورد قرآني",done:true}], notes:""},
          {name:"الخميس", date:wDate(5), tasks:[{t:"تدوين الامتنان",done:true},{t:"تجهيز المقاضي",done:false}],
           appointments:[{time:"٨:٠٠ م",text:"ليلة القراءة"}], habits:[{name:"شرب الماء",done:false},{name:"ورد قرآني",done:false}], notes:""},
          {name:"الجمعة", date:wDate(6), tasks:[{t:"روتين الجمعة",done:false},{t:"وقت العائلة",done:false}],
           appointments:[], habits:[{name:"شرب الماء",done:false},{name:"ورد قرآني",done:false}], notes:""}
        ],
        shopping:[{item:"فواكه وخضار",done:true},{item:"قهوة مختصة",done:false},{item:"دفتر جديد",done:false}],
        priorities:["إنهاء الفصل الثالث من الكتاب","المواظبة على المشي","حفظ ٢٠ كلمة جديدة"],
        weeklyGoals:[
          {category:"شخصية", name:"وقتٌ يومي للقراءة", progress:60},
          {category:"عملية", name:"إنهاء مشروع التقرير", progress:40},
          {category:"صحية", name:"المشي ٥ أيام", progress:70},
          {category:"دينية", name:"ختم جزء من القرآن", progress:50},
          {category:"تعلم", name:"حفظ ٢٠ كلمة إنجليزية", progress:35}
        ],
        habitTracker:{name:"شرب ٨ أكواب ماء", streak:4},
        review:{worked:"", improve:"", learned:"", goalAchieved:null, rating:0}
      },
      friday: {
        checklist:[
          {name:"قراءة سورة الكهف", done:true},
          {name:"التخطيط للأسبوع القادم", done:true},
          {name:"تنظيف الغرفة", done:false},
          {name:"مراجعة الأهداف", done:false},
          {name:"تأمل وامتنان", done:false}
        ],
        reflection:""
      },
      goals: [
        {name:"ختم القرآن الكريم", category:"روحانية", progress:35, targetDate:"2026-12-31", notes:"", status:"نشط",
         milestones:[{name:"١٠ أجزاء",done:true},{name:"٢٠ جزءًا",done:false},{name:"ختمة كاملة",done:false}]},
        {name:"المشي ٨٠ كم شهريًا", category:"صحة", progress:65, targetDate:"2026-08-31", notes:"", status:"نشط",
         milestones:[{name:"٢٠ كم",done:true},{name:"٥٠ كم",done:true},{name:"٨٠ كم",done:false}]},
        {name:"إتقان ٥٠٠ كلمة إنجليزية", category:"تعلم", progress:28, targetDate:"2026-11-30", notes:"", status:"نشط",
         milestones:[{name:"١٠٠ كلمة",done:true},{name:"٣٠٠ كلمة",done:false},{name:"٥٠٠ كلمة",done:false}]},
        {name:"صندوق الادخار الشهري", category:"مالية", progress:50, targetDate:"2026-12-31", notes:"", status:"نشط",
         milestones:[{name:"الشهر الأول",done:true},{name:"ستة أشهر",done:false}]},
        {name:"زيارة اليابان", category:"أحلام", progress:10, targetDate:"2027-04-01", notes:"ادخار + تخطيط الرحلة", status:"نشط",
         milestones:[{name:"جواز السفر",done:true},{name:"خطة الرحلة",done:false},{name:"الحجز",done:false}]},
        {name:"تعلّم أساسيات التصوير", category:"شخصية", progress:100, targetDate:"2026-05-01", notes:"", status:"مكتمل",
         milestones:[{name:"دورة أساسيات",done:true},{name:"١٠٠ صورة",done:true}]}
      ],
      thursday: {
        book: {title:"كتاب الأسبوع", image:""},
        checklist:[
          {name:"قراءة فصلٍ من كتابي", done:false},
          {name:"تجهيز قائمة الجمعة", done:false},
          {name:"تدوين خاطرة المساء", done:false}
        ]
      },
      english: {streak:5, todayTask:"راجعي كلمات هذا الأسبوع"},
      achievements: [
        {name:"٧ أيامٍ من التدوين المتواصل", when:"منذ يومين"},
        {name:"أول هدفٍ مكتمل", when:"الأسبوع الماضي"},
        {name:"١٠٠ كلمة إنجليزية", when:"قبل شهر"},
        {name:"أول ذكرى محفوظة", when:"قبل شهرين"}
      ],
      memories: [
        {caption:"غروبُ يوم الجمعة", date:y, image:"assets/memory-sample.jpg"},
        {caption:"قهوة الصباح مع كتاب", date:y, image:""},
        {caption:"نزهة الجبل", date:y, image:""}
      ],
      settings: {name:"مروه العامري", theme:"ليليّ هادئ", reminder:"٩:٠٠ مساءً", lang:"العربية"},
      activity: {
        journal:daysAgo(1), week:daysAgo(0), friday:daysAgo(1), goals:daysAgo(2),
        english:daysAgo(0), achievements:daysAgo(2), memories:daysAgo(1), settings:daysAgo(7)
      }
    };
  }

  /* ترقية آمنة: تعبئة أي حقول أُضيفت لاحقًا للمخطط دون فقدان بيانات قديمة */
  function migrate(store){
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
    w.habitTracker = w.habitTracker || {name:"", streak:0};
    if (typeof w.review !== "object" || w.review === null){
      w.review = {worked:"", improve:"", learned:"", goalAchieved:null, rating:0};
    }
    store.activity = store.activity || {};
    return store;
  }

  function loadStore(){
    try{
      const saved = JSON.parse(localStorage.getItem(KEY));
      if (saved && saved.journal && saved.friday && saved.activity) return migrate(saved);
    }catch(e){}
    const demo = buildDemoStore();
    saveStore(demo);
    return demo;
  }

  function saveStore(store){
    try{ localStorage.setItem(KEY, JSON.stringify(store)); }catch(e){}
  }

  function touch(store, sectionId){
    store.activity = store.activity || {};
    store.activity[sectionId] = iso(new Date());
  }

  window.RahlatiStore = { load: loadStore, save: saveStore, touch, arabicNum, KEY };
})();
