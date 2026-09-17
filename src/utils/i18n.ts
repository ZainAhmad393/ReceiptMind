import { AppCurrency, AppLanguage } from '../types';

export interface Translations {
  appName: string;
  tagline: string;
  tabs: {
    home: string;
    warranties: string;
    chat: string;
    library: string;
    receipts: string;
    insights: string;
    settings: string;
  };
  nav: {
    home: string;
    warranties: string;
    chat: string;
    library: string;
    receipts: string;
    insights: string;
    settings: string;
  };
  home: {
    thisMonthSpending: string;
    vsLastMonth: string;
    activeWarranties: string;
    expiringSoon: string;
    topCategory: string;
    recentReceipts: string;
    seeAll: string;
    scansLeft: string;
    upgradeToUnlimited: string;
    spendingBreakdown: string;
    monthlyTrend: string;
  };
  warranty: {
    title: string;
    subtitle: string;
    allWarranties: string;
    safe: string;
    expiringSoon: string;
    critical: string;
    expired: string;
    daysLeft: string;
    monthsWarranty: string;
    claimGuide: string;
    viewReceipt: string;
    noWarranties: string;
    sendTestNotification: string;
    notificationSent: string;
    serialNumber: string;
    modelNumber: string;
  };
  capture: {
    title: string;
    alignReceipt: string;
    takePhoto: string;
    uploadImage: string;
    sampleReceipts: string;
    readingReceipt: string;
    extractingItems: string;
    verifyingWarranties: string;
    reviewTitle: string;
    storeName: string;
    date: string;
    paymentMethod: string;
    itemsPurchased: string;
    addItem: string;
    hasWarranty: string;
    warrantyDuration: string;
    subtotal: string;
    tax: string;
    total: string;
    saveReceipt: string;
    successSaved: string;
    cancel: string;
  };
  library: {
    title: string;
    searchPlaceholder: string;
    allCategories: string;
    filterWarrantyOnly: string;
    exportCsv: string;
    exportPdf: string;
    noReceiptsFound: string;
    receiptDetails: string;
    itemsCount: string;
  };
  insights: {
    title: string;
    spendingOverview: string;
    aiSmartTip: string;
    generateTip: string;
    generating: string;
    protectedValue: string;
    monthOverMonth: string;
  };
  paywall: {
    title: string;
    subtitle: string;
    monthly: string;
    annual: string;
    bestValue: string;
    savePercent: string;
    feature1: string;
    feature2: string;
    feature3: string;
    feature4: string;
    feature5: string;
    subscribeNow: string;
    restorePurchases: string;
    sandboxTest: string;
    freePlan: string;
    premiumPlan: string;
    currentPlan: string;
  };
  settings: {
    title: string;
    profile: string;
    preferences: string;
    currency: string;
    language: string;
    darkMode: string;
    notifications: string;
    remind30: string;
    remind7: string;
    remind1: string;
    insuranceMode: string;
    insuranceModeDesc: string;
    subscription: string;
    managePlan: string;
    storeAssets: string;
    storeAssetsDesc: string;
    resetData: string;
  };
}

const rawTranslations: Record<AppLanguage, Translations> = {
  en: {
    appName: 'ReceiptMind',
    tagline: 'AI Receipt Scanner & Warranty Keeper',
    tabs: {
      home: 'Home',
      warranties: 'Warranties',
      chat: 'ReceiptMind AI',
      library: 'Library',
      receipts: 'Library',
      insights: 'Insights',
      settings: 'Settings',
    },
    nav: {
      home: 'Home',
      warranties: 'Warranties',
      chat: 'ReceiptMind AI',
      library: 'Library',
      receipts: 'Library',
      insights: 'Insights',
      settings: 'Settings',
    },
    home: {
      thisMonthSpending: 'This Month’s Spending',
      vsLastMonth: 'vs last month',
      activeWarranties: 'Tracked Warranties',
      expiringSoon: 'expiring soon',
      topCategory: 'Top Category',
      recentReceipts: 'Recent Receipts',
      seeAll: 'See all',
      scansLeft: 'scans left this month',
      upgradeToUnlimited: 'Upgrade for unlimited scans & Insurance Mode',
      spendingBreakdown: 'Category Spending',
      monthlyTrend: 'Monthly Spending Trend',
    },
    warranty: {
      title: 'Warranty Center',
      subtitle: 'Never miss an expiration or return policy deadline',
      allWarranties: 'All',
      safe: 'Safe (>30d)',
      expiringSoon: 'Expiring (8-30d)',
      critical: 'Urgent (≤7d)',
      expired: 'Expired',
      daysLeft: 'days remaining',
      monthsWarranty: 'months coverage',
      claimGuide: 'Store Return & Claim Policy',
      viewReceipt: 'View Original Receipt',
      noWarranties: 'No tracked warranties found',
      sendTestNotification: 'Simulate Push Alert',
      notificationSent: 'Warranty alert notification triggered!',
      serialNumber: 'Serial / IMEI',
      modelNumber: 'Model Number',
    },
    capture: {
      title: 'Scan Receipt',
      alignReceipt: 'Align receipt within edges for automatic detection',
      takePhoto: 'Capture Receipt',
      uploadImage: 'Upload Photo or PDF',
      sampleReceipts: 'Try Demo Receipt',
      readingReceipt: 'Reading your receipt with AI...',
      extractingItems: 'Identifying items & store details...',
      verifyingWarranties: 'Estimating warranty eligibility...',
      reviewTitle: 'Review & Verify Extraction',
      storeName: 'Store Name',
      date: 'Purchase Date',
      paymentMethod: 'Payment Method',
      itemsPurchased: 'Items Purchased',
      addItem: '+ Add Item',
      hasWarranty: 'Warranty Covered',
      warrantyDuration: 'Months',
      subtotal: 'Subtotal',
      tax: 'Tax',
      total: 'Total Amount',
      saveReceipt: 'Save Receipt to Library',
      successSaved: 'Receipt verified and saved!',
      cancel: 'Retake',
    },
    library: {
      title: 'Receipt Library',
      searchPlaceholder: 'Search store, items, or notes...',
      allCategories: 'All Categories',
      filterWarrantyOnly: 'Has Warranty',
      exportCsv: 'Export CSV',
      exportPdf: 'Print / PDF',
      noReceiptsFound: 'No receipts match your search',
      receiptDetails: 'Receipt Details',
      itemsCount: 'items',
    },
    insights: {
      title: 'Financial & Warranty Insights',
      spendingOverview: 'Spending Trends',
      aiSmartTip: 'AI Spending & Warranty Tip',
      generateTip: 'Refresh AI Tip',
      generating: 'Generating advice with AI...',
      protectedValue: 'Protected Merchandise Value',
      monthOverMonth: 'Month over Month Variance',
    },
    paywall: {
      title: 'Unlock ReceiptMind Pro',
      subtitle: 'Unlimited scans, Insurance Mode vault, and automated warranty alerts',
      monthly: 'Monthly',
      annual: 'Annual',
      bestValue: 'Best Value',
      savePercent: 'Save 33%',
      feature1: 'Unlimited AI receipt scans & exports',
      feature2: 'Insurance Mode: certified claim backups',
      feature3: 'Automated 30d, 7d, 1d push reminders',
      feature4: 'Multi-device cloud synchronization',
      feature5: 'Zero ads & priority vision extraction',
      subscribeNow: 'Start 7-Day Free Trial',
      restorePurchases: 'Restore Purchases',
      sandboxTest: 'RevenueCat Sandbox Toggle',
      freePlan: 'Free Tier',
      premiumPlan: 'ReceiptMind Pro',
      currentPlan: 'Current Plan',
    },
    settings: {
      title: 'Settings',
      profile: 'User Profile',
      preferences: 'Preferences',
      currency: 'Default Currency',
      language: 'Language & Locale',
      darkMode: 'Dark Mode',
      notifications: 'Warranty Notifications',
      remind30: '30 Days Before Expiry',
      remind7: '7 Days Before Expiry',
      remind1: '1 Day Before Expiry',
      insuranceMode: 'Insurance Mode Vault',
      insuranceModeDesc: 'Store high-resolution receipt photos and serial numbers for insurance claims',
      subscription: 'Subscription & Billing',
      managePlan: 'Manage RevenueCat Entitlements',
      storeAssets: 'App Store & Launch Kit',
      storeAssetsDesc: 'View icon, splash screen, and App Store preview screenshots',
      resetData: 'Reset Demo Data',
    },
  },
  es: {
    appName: 'ReceiptMind',
    tagline: 'Escáner de Recibos IA y Recordatorio de Garantías',
    tabs: {
      home: 'Inicio',
      warranties: 'Garantías',
      chat: 'ReceiptMind AI',
      library: 'Recibos',
      receipts: 'Recibos',
      insights: 'Análisis',
      settings: 'Ajustes',
    },
    nav: {
      home: 'Inicio',
      warranties: 'Garantías',
      chat: 'ReceiptMind AI',
      library: 'Recibos',
      receipts: 'Recibos',
      insights: 'Análisis',
      settings: 'Ajustes',
    },
    home: {
      thisMonthSpending: 'Gasto de Este Mes',
      vsLastMonth: 'vs mes anterior',
      activeWarranties: 'Garantías Activas',
      expiringSoon: 'vencen pronto',
      topCategory: 'Categoría Principal',
      recentReceipts: 'Recibos Recientes',
      seeAll: 'Ver todos',
      scansLeft: 'escaneos restantes este mes',
      upgradeToUnlimited: 'Mejora a ilimitado y Modo Seguro',
      spendingBreakdown: 'Distribución de Gastos',
      monthlyTrend: 'Tendencia Mensual',
    },
    warranty: {
      title: 'Centro de Garantías',
      subtitle: 'Nunca pierdas una fecha límite de garantía o devolución',
      allWarranties: 'Todas',
      safe: 'Seguras (>30d)',
      expiringSoon: 'Por Vencer (8-30d)',
      critical: 'Urgente (≤7d)',
      expired: 'Vencidas',
      daysLeft: 'días restantes',
      monthsWarranty: 'meses de cobertura',
      claimGuide: 'Política de Devolución',
      viewReceipt: 'Ver Recibo Original',
      noWarranties: 'No se encontraron garantías registradas',
      sendTestNotification: 'Simular Alerta Push',
      notificationSent: '¡Alerta de garantía enviada!',
      serialNumber: 'Número de Serie',
      modelNumber: 'Modelo',
    },
    capture: {
      title: 'Escanear Recibo',
      alignReceipt: 'Alinea el recibo dentro del marco',
      takePhoto: 'Capturar Recibo',
      uploadImage: 'Subir Foto o PDF',
      sampleReceipts: 'Recibo de Prueba',
      readingReceipt: 'Leyendo el recibo con IA...',
      extractingItems: 'Identificando artículos y comercio...',
      verifyingWarranties: 'Calculando garantías aplicables...',
      reviewTitle: 'Revisar y Verificar',
      storeName: 'Nombre del Comercio',
      date: 'Fecha de Compra',
      paymentMethod: 'Método de Pago',
      itemsPurchased: 'Artículos Comprados',
      addItem: '+ Añadir Artículo',
      hasWarranty: 'Garantía Incluida',
      warrantyDuration: 'Meses',
      subtotal: 'Subtotal',
      tax: 'Impuestos',
      total: 'Total',
      saveReceipt: 'Guardar Recibo',
      successSaved: '¡Recibo verificado y guardado!',
      cancel: 'Repetir',
    },
    library: {
      title: 'Biblioteca de Recibos',
      searchPlaceholder: 'Buscar comercio, producto o nota...',
      allCategories: 'Todas las Categorías',
      filterWarrantyOnly: 'Con Garantía',
      exportCsv: 'Exportar CSV',
      exportPdf: 'Imprimir / PDF',
      noReceiptsFound: 'No se encontraron recibos',
      receiptDetails: 'Detalles del Recibo',
      itemsCount: 'artículos',
    },
    insights: {
      title: 'Análisis de Gastos y Garantías',
      spendingOverview: 'Tendencias de Gasto',
      aiSmartTip: 'Consejo Inteligente de IA',
      generateTip: 'Actualizar Consejo',
      generating: 'Generando análisis...',
      protectedValue: 'Valor Bajo Garantía',
      monthOverMonth: 'Variación Mensual',
    },
    paywall: {
      title: 'Desbloquea ReceiptMind Pro',
      subtitle: 'Escaneos ilimitados, Modo Seguro y alertas automáticas',
      monthly: 'Mensual',
      annual: 'Anual',
      bestValue: 'Mejor Valor',
      savePercent: 'Ahorra 33%',
      feature1: 'Escaneos y exportaciones ilimitadas',
      feature2: 'Modo Seguro para reclamos y siniestros',
      feature3: 'Recordatorios push automáticos 30d, 7d y 1d',
      feature4: 'Sincronización en la nube multidispositivo',
      feature5: 'Sin anuncios y máxima velocidad de IA',
      subscribeNow: 'Iniciar Prueba Gratuita',
      restorePurchases: 'Restaurar Compras',
      sandboxTest: 'Simulador RevenueCat',
      freePlan: 'Plan Gratuito',
      premiumPlan: 'ReceiptMind Pro',
      currentPlan: 'Plan Actual',
    },
    settings: {
      title: 'Ajustes',
      profile: 'Perfil de Usuario',
      preferences: 'Preferencias',
      currency: 'Moneda Predeterminada',
      language: 'Idioma y Región',
      darkMode: 'Modo Oscuro',
      notifications: 'Notificaciones de Garantía',
      remind30: '30 Días Antes',
      remind7: '7 Días Antes',
      remind1: '1 Día Antes',
      insuranceMode: 'Bóveda de Seguro',
      insuranceModeDesc: 'Guarda fotos en alta resolución y números de serie para reclamos',
      subscription: 'Suscripción y Pagos',
      managePlan: 'Gestionar Suscripción',
      storeAssets: 'Kit de Tienda de Apps',
      storeAssetsDesc: 'Ver icono, pantalla de bienvenida y capturas de pantalla',
      resetData: 'Restablecer Datos de Demostración',
    },
  },
  fr: {
    appName: 'ReceiptMind',
    tagline: 'Scanner de Reçus IA & Gestionnaire de Garanties',
    tabs: {
      home: 'Accueil',
      warranties: 'Garanties',
      chat: 'ReceiptMind AI',
      library: 'Reçus',
      receipts: 'Reçus',
      insights: 'Analyses',
      settings: 'Réglages',
    },
    nav: {
      home: 'Accueil',
      warranties: 'Garanties',
      chat: 'ReceiptMind AI',
      library: 'Reçus',
      receipts: 'Reçus',
      insights: 'Analyses',
      settings: 'Réglages',
    },
    home: {
      thisMonthSpending: 'Dépenses du Mois',
      vsLastMonth: 'vs mois dernier',
      activeWarranties: 'Garanties Actives',
      expiringSoon: 'expirent bientôt',
      topCategory: 'Catégorie Principale',
      recentReceipts: 'Reçus Récents',
      seeAll: 'Tout voir',
      scansLeft: 'scans restants ce mois',
      upgradeToUnlimited: 'Passez à l’illimité et au Mode Assurance',
      spendingBreakdown: 'Répartition des Dépenses',
      monthlyTrend: 'Évolution Mensuelle',
    },
    warranty: {
      title: 'Centre de Garanties',
      subtitle: 'Ne manquez plus jamais une date limite de garantie',
      allWarranties: 'Toutes',
      safe: 'Sûres (>30j)',
      expiringSoon: 'Bientôt (8-30j)',
      critical: 'Urgent (≤7j)',
      expired: 'Expirées',
      daysLeft: 'jours restants',
      monthsWarranty: 'mois de garantie',
      claimGuide: 'Conditions de retour du magasin',
      viewReceipt: 'Voir le Reçu Original',
      noWarranties: 'Aucune garantie trouvée',
      sendTestNotification: 'Simuler Alerte Push',
      notificationSent: 'Alerte de garantie déclenchée !',
      serialNumber: 'Numéro de Série',
      modelNumber: 'Numéro de Modèle',
    },
    capture: {
      title: 'Scanner un Reçu',
      alignReceipt: 'Alignez le reçu dans les repères',
      takePhoto: 'Prendre la Photo',
      uploadImage: 'Importer Photo ou PDF',
      sampleReceipts: 'Reçu d’Exemple',
      readingReceipt: 'Lecture du reçu par l’IA...',
      extractingItems: 'Extraction des articles et montants...',
      verifyingWarranties: 'Vérification de l’éligibilité garantie...',
      reviewTitle: 'Vérifier l’Extraction',
      storeName: 'Nom du Magasin',
      date: 'Date d’Achat',
      paymentMethod: 'Mode de Paiement',
      itemsPurchased: 'Articles Achetés',
      addItem: '+ Ajouter un Article',
      hasWarranty: 'Garantie Prise en Charge',
      warrantyDuration: 'Mois',
      subtotal: 'Sous-total',
      tax: 'Taxes',
      total: 'Montant Total',
      saveReceipt: 'Enregistrer le Reçu',
      successSaved: 'Reçu vérifié et enregistré !',
      cancel: 'Reprendre',
    },
    library: {
      title: 'Bibliothèque des Reçus',
      searchPlaceholder: 'Rechercher magasin, article ou note...',
      allCategories: 'Toutes Catégories',
      filterWarrantyOnly: 'Sous Garantie',
      exportCsv: 'Exporter CSV',
      exportPdf: 'Imprimer / PDF',
      noReceiptsFound: 'Aucun reçu correspondant',
      receiptDetails: 'Détails du Reçu',
      itemsCount: 'articles',
    },
    insights: {
      title: 'Analyses Dépenses & Garanties',
      spendingOverview: 'Tendances Budgétaires',
      aiSmartTip: 'Conseil IA Personnalisé',
      generateTip: 'Actualiser le Conseil',
      generating: 'Génération en cours...',
      protectedValue: 'Valeur Sous Garantie',
      monthOverMonth: 'Variation Mensuelle',
    },
    paywall: {
      title: 'Débloquez ReceiptMind Pro',
      subtitle: 'Scans illimités, coffre-fort d’assurance et rappels prioritaires',
      monthly: 'Mensuel',
      annual: 'Annuel',
      bestValue: 'Meilleure Offre',
      savePercent: 'Économisez 33%',
      feature1: 'Scans et exports illimités',
      feature2: 'Mode Assurance : sauvegarde certifiée',
      feature3: 'Rappels push automatiques à 30j, 7j et 1j',
      feature4: 'Synchronisation cloud multi-appareils',
      feature5: 'Sans publicité et extraction accélérée',
      subscribeNow: 'Démarrer l’Essai Gratuit',
      restorePurchases: 'Restaurer les Achats',
      sandboxTest: 'Bascule RevenueCat Sandbox',
      freePlan: 'Formule Gratuite',
      premiumPlan: 'ReceiptMind Pro',
      currentPlan: 'Formule Actuelle',
    },
    settings: {
      title: 'Paramètres',
      profile: 'Profil Utilisateur',
      preferences: 'Préférences',
      currency: 'Devise par Défaut',
      language: 'Langue & Région',
      darkMode: 'Mode Sombre',
      notifications: 'Notifications de Garantie',
      remind30: '30 Jours Avant',
      remind7: '7 Jours Avant',
      remind1: '1 Jour Avant',
      insuranceMode: 'Coffre Mode Assurance',
      insuranceModeDesc: 'Conservez photos HD et numéros de série pour vos déclarations',
      subscription: 'Abonnement et Facturation',
      managePlan: 'Gérer l’Abonnement',
      storeAssets: 'Kit App Store & Lancement',
      storeAssetsDesc: 'Visualiser l’icône, le splash screen et les captures d’écran',
      resetData: 'Réinitialiser Données Démo',
    },
  },
  ar: {
    appName: 'ReceiptMind',
    tagline: 'ماسح الفواتير الذكي ومتتبع الضمانات',
    tabs: {
      home: 'الرئيسية',
      warranties: 'الضمانات',
      chat: 'ReceiptMind AI',
      library: 'الفواتير',
      receipts: 'الفواتير',
      insights: 'التحليلات',
      settings: 'الإعدادات',
    },
    nav: {
      home: 'الرئيسية',
      warranties: 'الضمانات',
      chat: 'ReceiptMind AI',
      library: 'الفواتير',
      receipts: 'الفواتير',
      insights: 'التحليلات',
      settings: 'الإعدادات',
    },
    home: {
      thisMonthSpending: 'مصروفات هذا الشهر',
      vsLastMonth: 'مقارنة بالشهر السابق',
      activeWarranties: 'الضمانات النشطة',
      expiringSoon: 'تنتهي قريباً',
      topCategory: 'أعلى تصنيف',
      recentReceipts: 'أحدث الفواتير',
      seeAll: 'عرض الكل',
      scansLeft: 'عمليات مسح متبقية هذا الشهر',
      upgradeToUnlimited: 'الترقية لعدد لا محدود ووضع التأمين',
      spendingBreakdown: 'توزيع المصروفات',
      monthlyTrend: 'مسار الصرف الشهري',
    },
    warranty: {
      title: 'مركز الضمانات',
      subtitle: 'لا تفوّت موعد انتهاء الضمان أو سياسة الإرجاع',
      allWarranties: 'الكل',
      safe: 'آمنة (>30 يوم)',
      expiringSoon: 'تنتهي قريباً (8-30 يوم)',
      critical: 'عاجلة (≤7 أيام)',
      expired: 'منتهية',
      daysLeft: 'يوماً متبقياً',
      monthsWarranty: 'أشهر تغطية',
      claimGuide: 'سياسة إرجاع المتجر والمطالبة',
      viewReceipt: 'عرض الفاتورة الأصلية',
      noWarranties: 'لا توجد ضمانات مسجلة',
      sendTestNotification: 'محاكاة إشعار فوري',
      notificationSent: 'تم إرسال إشعار تذكير الضمان!',
      serialNumber: 'الرقم التسلسلي',
      modelNumber: 'رقم الموديل',
    },
    capture: {
      title: 'مسح الفاتورة',
      alignReceipt: 'ضع الفاتورة داخل الإطار للمسح التلقائي',
      takePhoto: 'التقاط صورة',
      uploadImage: 'تحميل صورة أو PDF',
      sampleReceipts: 'فاتورة تجريبية',
      readingReceipt: 'جاري قراءة الفاتورة بالذكاء الاصطناعي...',
      extractingItems: 'استخراج المشتريات وتفاصيل المتجر...',
      verifyingWarranties: 'تقدير فترة الضمان للأجهزة...',
      reviewTitle: 'مراجعة وتأكيد البيانات',
      storeName: 'اسم المتجر',
      date: 'تاريخ الشراء',
      paymentMethod: 'طريقة الدفع',
      itemsPurchased: 'العناصر المشتراة',
      addItem: '+ إضافة عنصر',
      hasWarranty: 'خاضع للضمان',
      warrantyDuration: 'أشهر',
      subtotal: 'المجموع الفرعي',
      tax: 'الضريبة',
      total: 'المبلغ الإجمالي',
      saveReceipt: 'حفظ الفاتورة',
      successSaved: 'تم التحقق من الفاتورة وحفظها بنجاح!',
      cancel: 'إعادة التقاط',
    },
    library: {
      title: 'أرشيف الفواتير',
      searchPlaceholder: 'ابحث عن متجر، منتج، أو ملاحظة...',
      allCategories: 'جميع التصنيفات',
      filterWarrantyOnly: 'تحتوي على ضمان',
      exportCsv: 'تصدير CSV',
      exportPdf: 'طباعة / PDF',
      noReceiptsFound: 'لم يتم العثور على فواتير',
      receiptDetails: 'تفاصيل الفاتورة',
      itemsCount: 'عناصر',
    },
    insights: {
      title: 'تحليلات الإنفاق والضمانات',
      spendingOverview: 'اتجاهات الإنفاق',
      aiSmartTip: 'نصيحة ذكية من الذكاء الاصطناعي',
      generateTip: 'تحديث النصيحة',
      generating: 'جاري التحليل...',
      protectedValue: 'قيمة المشتريات المحمية بالضمان',
      monthOverMonth: 'التغير مقارنة بالشهر السابق',
    },
    paywall: {
      title: 'الترقية إلى ReceiptMind Pro',
      subtitle: 'مسح غير محدود، خزينة التأمين وتنبيهات الضمان التلقائية',
      monthly: 'شهري',
      annual: 'سنوي',
      bestValue: 'أفضل قيمة',
      savePercent: 'وفر 33%',
      feature1: 'مسح وتصدير فواتير غير محدود',
      feature2: 'وضع التأمين: نسخ احتياطية معتمدة للمطالبات',
      feature3: 'تنبيهات فورية قبل 30 و7 وأيام و1 يوم',
      feature4: 'مزامنة سحابية على جميع الأجهزة',
      feature5: 'بدون إعلانات ومسح فائق السرعة',
      subscribeNow: 'ابدأ التجربة المجانية لـ 7 أيام',
      restorePurchases: 'استعادة المشتريات',
      sandboxTest: 'تجربة بيئة RevenueCat',
      freePlan: 'الخطة المجانية',
      premiumPlan: 'ReceiptMind Pro',
      currentPlan: 'الخطة الحالية',
    },
    settings: {
      title: 'الإعدادات',
      profile: 'الملف الشخصي',
      preferences: 'التفضيلات',
      currency: 'العملة الافتراضية',
      language: 'اللغة والمنطقة',
      darkMode: 'الوضع الليلي',
      notifications: 'إشعارات الضمان',
      remind30: 'قبل 30 يوماً من الانتهاء',
      remind7: 'قبل 7 أيام من الانتهاء',
      remind1: 'قبل يوم واحد من الانتهاء',
      insuranceMode: 'خزينة وضع التأمين',
      insuranceModeDesc: 'حفظ صور عالية الدقة وأرقام تسلسلية لمطالبات التأمين والضمان',
      subscription: 'الاشتراك والفوترة',
      managePlan: 'إدارة الاشتراك',
      storeAssets: 'أصول متجر التطبيقات',
      storeAssetsDesc: 'عرض الأيقونة، شاشة البدء ولقطات الشاشة للمتاجر',
      resetData: 'إعادة تعيين البيانات التجريبية',
    },
  },
  ur: {
    appName: 'ReceiptMind',
    tagline: 'اے آئی رسید سکینر اور وارنٹی مینیجر',
    tabs: {
      home: 'ہوم',
      warranties: 'وارنٹی',
      chat: 'ReceiptMind AI',
      library: 'رسیدیں',
      receipts: 'رسیدیں',
      insights: 'تجزیہ',
      settings: 'ترتیبات',
    },
    nav: {
      home: 'ہوم',
      warranties: 'وارنٹی',
      chat: 'ReceiptMind AI',
      library: 'رسیدیں',
      receipts: 'رسیدیں',
      insights: 'تجزیہ',
      settings: 'ترتیبات',
    },
    home: {
      thisMonthSpending: 'اس ماہ کا خرچ',
      vsLastMonth: 'پچھلے ماہ کے مقابلے',
      activeWarranties: 'فعال وارنٹیز',
      expiringSoon: 'جلد ختم ہونے والی',
      topCategory: 'اہم ترین کیٹیگری',
      recentReceipts: 'حالیہ رسیدیں',
      seeAll: 'سب دیکھیں',
      scansLeft: 'اس ماہ کے باقی سکین',
      upgradeToUnlimited: 'لامحدود سکین اور انشورنس موڈ حاصل کریں',
      spendingBreakdown: 'اخراجات کی تفصیل',
      monthlyTrend: 'ماہانہ رجحان',
    },
    warranty: {
      title: 'وارنٹی سینٹر',
      subtitle: 'وارنٹی یا ریٹرن کی آخری تاریخ کبھی نہ بھولیں',
      allWarranties: 'تمام',
      safe: 'محفوظ (>30 دن)',
      expiringSoon: 'جلد ختم (8-30 دن)',
      critical: 'فوری (≤7 دن)',
      expired: 'ختم شدہ',
      daysLeft: 'دن باقی ہیں',
      monthsWarranty: 'ماہ کی کوریج',
      claimGuide: 'اسٹور ریٹرن و کلیم پالیسی',
      viewReceipt: 'اصل رسید دیکھیں',
      noWarranties: 'کوئی وارنٹی ریکارڈ نہیں ملی',
      sendTestNotification: 'پش نوٹیفکیشن ٹیسٹ کریں',
      notificationSent: 'وارنٹی یاد دہانی کا نوٹیفکیشن بھیج دیا گیا!',
      serialNumber: 'سیریل نمبر',
      modelNumber: 'ماڈل نمبر',
    },
    capture: {
      title: 'رسید سکین کریں',
      alignReceipt: 'رسید کو فریم کے اندر سیدھا رکھیں',
      takePhoto: 'تصویر لیں',
      uploadImage: 'تصویر یا پی ڈی ایف اپلوڈ کریں',
      sampleReceipts: 'ڈیمو رسید آزمائیں',
      readingReceipt: 'اے آئی رسید پڑھ رہا ہے...',
      extractingItems: 'اشیاء اور اسٹور کی معلومات جمع ہو رہی ہیں...',
      verifyingWarranties: 'وارنٹی کی تفصیلات دیکھی جا رہی ہیں...',
      reviewTitle: 'جانچ اور تصدیق',
      storeName: 'اسٹور کا نام',
      date: 'خریداری کی تاریخ',
      paymentMethod: 'ادائیگی کا طریقہ',
      itemsPurchased: 'خریدی گئی اشیاء',
      addItem: '+ نئی چیز شامل کریں',
      hasWarranty: 'وارنٹی شامل ہے',
      warrantyDuration: 'مہینے',
      subtotal: 'ذیلی کل',
      tax: 'ٹیکس',
      total: 'کل رقم',
      saveReceipt: 'رسید محفوظ کریں',
      successSaved: 'رسید کامیابی سے محفوظ کرلی گئی!',
      cancel: 'دوبارہ لیں',
    },
    library: {
      title: 'رسیدوں کی لائبریری',
      searchPlaceholder: 'اسٹور، چیز یا نوٹ تلاش کریں...',
      allCategories: 'تمام کیٹیگریز',
      filterWarrantyOnly: 'وارنٹی والی رسیدیں',
      exportCsv: 'ایکسپورٹ CSV',
      exportPdf: 'پرنٹ / PDF',
      noReceiptsFound: 'کوئی رسید نہیں ملی',
      receiptDetails: 'رسید کی تفصیلات',
      itemsCount: 'اشیاء',
    },
    insights: {
      title: 'اخراجات اور وارنٹی بصیرت',
      spendingOverview: 'اخراجات کا رجحان',
      aiSmartTip: 'اے آئی ہوشیار مشورہ',
      generateTip: 'نیا مشورہ حاصل کریں',
      generating: 'مشورہ تیار ہو رہا ہے...',
      protectedValue: 'وارنٹی یافتہ اشیاء کی مالیت',
      monthOverMonth: 'ماہ بہ ماہ تبدیلی',
    },
    paywall: {
      title: 'ReceiptMind Pro حاصل کریں',
      subtitle: 'لامحدود سکین، انشورنس والٹ اور خودکار الرٹس',
      monthly: 'ماہانہ',
      annual: 'سالانہ',
      bestValue: 'بہترین قیمت',
      savePercent: '33% بچت',
      feature1: 'لامحدود اے آئی سکین اور ایکسپورٹ',
      feature2: 'انشورنس کلیم کے لیے سرٹیفائیڈ بیک اپ',
      feature3: '30، 7 اور 1 دن پہلے خودکار الرٹس',
      feature4: 'کلاؤڈ سنکرونائزیشن',
      feature5: 'اشتہارات سے پاک اور تیز رفتار',
      subscribeNow: '7 دن کا مفت ٹرائل شروع کریں',
      restorePurchases: 'خریداری بحال کریں',
      sandboxTest: 'ریونیو کیٹ سینڈ باکس ٹیسٹ',
      freePlan: 'مفت پلان',
      premiumPlan: 'ReceiptMind Pro',
      currentPlan: 'موجودہ پلان',
    },
    settings: {
      title: 'ترتیبات',
      profile: 'صارف پروفائل',
      preferences: 'ترجیحات',
      currency: 'بنیادی کرنسی',
      language: 'زبان و علاقہ',
      darkMode: 'ڈارک موڈ',
      notifications: 'وارنٹی نوٹیفکیشنز',
      remind30: '30 دن پہلے یاد دہانی',
      remind7: '7 دن پہلے یاد دہانی',
      remind1: '1 دن پہلے یاد دہانی',
      insuranceMode: 'انشورنس موڈ والٹ',
      insuranceModeDesc: 'انشورنس کلیمز کے لیے ہائی ریزولوشن رسیدیں اور سیریل نمبر محفوظ رکھیں',
      subscription: 'سبسکرپشن اور بلنگ',
      managePlan: 'سبسکرپشن تبدیل کریں',
      storeAssets: 'ایپ اسٹور اور لانچ کٹ',
      storeAssetsDesc: 'ایپ آئیکن، سپلیش اسکرین اور اسکرین شاٹس دیکھیں',
      resetData: 'ڈیمو ڈیٹا ری سیٹ کریں',
    },
  },
};

export const translations: Record<AppLanguage, Translations> = new Proxy(
  rawTranslations,
  {
    get(target, prop: string) {
      if (prop in target) {
        return target[prop as AppLanguage];
      }
      return target.en;
    },
  }
);

export function getTranslations(lang?: string | null): Translations {
  if (lang && lang in rawTranslations) {
    return rawTranslations[lang as AppLanguage];
  }
  return rawTranslations.en;
}

export function isRTL(lang: AppLanguage): boolean {
  return lang === 'ar' || lang === 'ur';
}

export function formatCurrency(amount: number, currency: AppCurrency = 'USD'): string {
  const symbols: Record<AppCurrency, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    CAD: 'CA$',
    AUD: 'AU$',
    JPY: '¥',
    AED: 'AED ',
    PKR: 'Rs. ',
    SAR: 'SAR ',
  };

  const symbol = symbols[currency] || '$';
  if (currency === 'JPY') {
    return `${symbol}${Math.round(amount).toLocaleString()}`;
  }
  return `${symbol}${amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}
