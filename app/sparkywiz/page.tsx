'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';

/* ============================================================
   TYPES
   ============================================================ */
type Lang  = 'en' | 'es' | 'zh' | 'vi';
type Theme = 'dark' | 'light';
type CalcId = 'voltage-drop' | 'box-fill' | 'ampacity' | 'conduit-fill' | 'bending' | null;

/* ============================================================
   TRANSLATIONS
   ============================================================ */
const T: Record<Lang, Record<string, any>> = {
  en: {
    nav: { signin: 'Sign In' },
    hero: {
      eyebrow: 'The Electrical Intelligence Platform',
      title1: 'Everything an Electrician',
      title2: 'Needs. One App.',
      sub: 'Speed on site. Intelligence in your pocket.',
      download: '⬇ Download Free',
      signin: 'Sign In →',
      pills: ['⚡ NEC Lookup','📐 Calculators','📋 Compliance','📝 Open Bids','🏢 Building Intel','🤖 Ask Sparky','📷 Scan Equipment','🔩 Materials','🏛️ Permits','🔌 Transformers'],
    },
    calc: {
      eyebrow: 'Live Calculators',
      title: 'Built for the Field.',
      sub: 'Tap any calculator for a live interactive demo. No account needed.',
      calculate: 'Calculate',
      close: '✕ Close',
    },
    search: {
      eyebrow: 'Equipment Index',
      title: 'Find anything instantly.',
      sub: 'Search 2M+ equipment specs, wire tables, breakers, panels, and transformers.',
      placeholder: 'Search equipment, breakers, panels, wire…',
      noResults: 'No results found. Try "Square D" or "#12 AWG".',
    },
    bento: {
      eyebrow: 'Platform Features',
      title: 'Everything in one place.',
      sub: 'From calculators to compliance — Sparky Wiz covers the full workflow.',
      askTitle: 'Ask Sparky',
      askDesc: 'AI trained on the NEC, panel schedules, manufacturer specs, and decades of field knowledge. Ask anything.',
    },
    phone: {
      eyebrow: 'App Preview',
      title: 'The app that works as hard as you do.',
      sub: 'Native iOS and Android. Offline-first. Built for gloves, sunlight, and one hand.',
    },
    ai: {
      eyebrow: 'AI Assistant',
      title: 'Ask Sparky Anything.',
      sub: 'Trained on the complete NEC, manufacturer specs, panel schedules, and decades of field experience.',
      question: 'Can I put this EV charger on this panel?',
      thinking: '⚡ Analyzing panel schedule and load data…',
      answer: "Based on the panel schedule you scanned, your 200A main has 180A of existing calculated load. A 48A Level 2 EV charger would bring your total to 228A — exceeding service capacity by 28A.\n\nOptions:\n→ Upgrade service to 320A\n→ Add load management to shed non-critical loads\n→ Install a 30A EVSE instead (Level 2, slower charge)\n\nWant me to calculate the exact derating factors or generate a load analysis report?",
    },
    comparison: {
      eyebrow: 'Why Sparky Wiz',
      title: 'One App. Everything Else Is Just a Calculator.',
      otherTitle: 'Calculator Apps',
      sparkyTitle: 'Sparky Wiz',
      otherItems: ['Voltage Drop','Ampacity'],
      sparkyItems: ['Voltage Drop','Ampacity','Box Fill','Conduit Fill','Bending','NEC Code Search','AI Assistant (Ask Sparky)','Open Bids','Compliance Checks','OCR Equipment Scan','Barcode Lookup','Material Lists','Permit Tracking','Supplier Network'],
    },
    network: {
      eyebrow: 'IIE Network',
      title: "This Isn't Just an App.",
      sub: 'Sparky Wiz is the field interface to the Intelligent Index of Electrical — a living, connected database of equipment, permits, suppliers, and compliance data.',
      powered: 'Powered by IIE',
      center: 'Sparky Wiz',
      nodes: ['Equipment Index','Permit Index','Supplier Index','Bid Index','Compliance Index','Manufacturer Index'],
    },
    footer: {
      tagline: 'Speed in the field. Intelligence in your pocket.',
      product: 'Product',
      company: 'Company',
      legal: 'Legal',
      followUs: 'Follow Us',
      appStore: 'App Store',
      playStore: 'Google Play',
      copyright: '© 2025 Sparky Wiz, Inc. All rights reserved.',
      madeWith: 'Made with ⚡ in the USA',
      cookiePref: 'Cookie Preferences',
      links: {
        product: ['Calculators','NEC Lookup','Compliance','Open Bids','Building Intel','Ask Sparky (AI)','Scan Equipment','Pricing'],
        company: ['About Us','Blog','Careers','Press','Partners','Contact'],
        legal: ['Privacy Policy','Terms of Service','Cookie Policy','Accessibility','Security','Sitemap'],
      },
    },
  },
  es: {
    nav: { signin: 'Iniciar Sesión' },
    hero: {
      eyebrow: 'La Plataforma de Inteligencia Eléctrica',
      title1: 'Todo lo que un Electricista',
      title2: 'Necesita. Una App.',
      sub: 'Velocidad en obra. Inteligencia en tu bolsillo.',
      download: '⬇ Descargar Gratis',
      signin: 'Iniciar Sesión →',
      pills: ['⚡ Búsqueda NEC','📐 Calculadoras','📋 Cumplimiento','📝 Licitaciones','🏢 Edificios','🤖 Ask Sparky','📷 Escanear','🔩 Materiales','🏛️ Permisos','🔌 Transformadores'],
    },
    calc: { eyebrow: 'Calculadoras en Vivo', title: 'Diseñado para Obra.', sub: 'Toca para calcular en vivo. Sin cuenta requerida.', calculate: 'Calcular', close: '✕ Cerrar' },
    search: { eyebrow: 'Índice de Equipos', title: 'Encuentra todo al instante.', sub: 'Busca más de 2M especificaciones de equipos, cables, interruptores y paneles.', placeholder: 'Buscar equipos, interruptores, paneles, cable…', noResults: 'Sin resultados encontrados.' },
    bento: { eyebrow: 'Características', title: 'Todo en un solo lugar.', sub: 'De calculadoras a cumplimiento.', askTitle: 'Ask Sparky', askDesc: 'IA entrenada en NEC, planos de paneles y años de experiencia en campo.' },
    phone: { eyebrow: 'Vista Previa', title: 'La app que trabaja tan duro como tú.', sub: 'iOS y Android nativos. Sin conexión primero.' },
    ai: { eyebrow: 'Asistente IA', title: 'Pregúntale a Sparky.', sub: 'Entrenado con NEC completo, especificaciones de fabricantes y experiencia de campo.', question: '¿Puedo conectar este cargador EV a este panel?', thinking: '⚡ Analizando el panel y datos de carga…', answer: 'Basado en el plan escaneado, tu interruptor de 200A tiene 180A de carga existente. Un cargador EV de 48A llevaría el total a 228A — excede la capacidad por 28A.\n\nOpciones:\n→ Actualizar servicio a 320A\n→ Agregar gestión de carga\n→ Instalar EVSE de 30A' },
    comparison: { eyebrow: 'Por qué Sparky Wiz', title: 'Una App. El Resto Son Solo Calculadoras.', otherTitle: 'Apps de Cálculo', sparkyTitle: 'Sparky Wiz', otherItems: ['Caída de Voltaje','Ampacidad'], sparkyItems: ['Caída de Voltaje','Ampacidad','Relleno de Caja','Llenado de Conduit','Doblado','Búsqueda NEC','Asistente IA','Licitaciones','Verificación de Código','Escaneo OCR','Código de Barras','Materiales','Permisos','Proveedores'] },
    network: { eyebrow: 'Red IIE', title: 'Esto No Es Solo Una App.', sub: 'Sparky Wiz es la interfaz al Índice Inteligente Eléctrico.', powered: 'Impulsado por IIE', center: 'Sparky Wiz', nodes: ['Índice de Equipos','Índice de Permisos','Índice de Proveedores','Índice de Licitaciones','Índice de Cumplimiento','Índice de Fabricantes'] },
    footer: { tagline: 'Velocidad en obra. Inteligencia en tu bolsillo.', product: 'Producto', company: 'Empresa', legal: 'Legal', followUs: 'Síguenos', appStore: 'App Store', playStore: 'Google Play', copyright: '© 2025 Sparky Wiz, Inc. Todos los derechos reservados.', madeWith: 'Hecho con ⚡ en EE.UU.', cookiePref: 'Preferencias de Cookies', links: { product: ['Calculadoras','Búsqueda NEC','Cumplimiento','Licitaciones','Edificios','Ask Sparky','Escanear','Precios'], company: ['Sobre Nosotros','Blog','Empleos','Prensa','Socios','Contacto'], legal: ['Política de Privacidad','Términos de Servicio','Política de Cookies','Accesibilidad','Seguridad','Mapa del Sitio'] } },
  },
  zh: {
    nav: { signin: '登录' },
    hero: {
      eyebrow: '智能电气平台',
      title1: '电工所需的一切，',
      title2: '尽在一款应用。',
      sub: '现场速度。口袋智慧。',
      download: '⬇ 免费下载',
      signin: '登录 →',
      pills: ['⚡ NEC查询','📐 计算器','📋 合规','📝 招标','🏢 楼宇智能','🤖 Ask Sparky','📷 扫描设备','🔩 材料','🏛️ 许可证','🔌 变压器'],
    },
    calc: { eyebrow: '实时计算器', title: '专为现场打造。', sub: '点击运行实时计算。无需注册。', calculate: '计算', close: '✕ 关闭' },
    search: { eyebrow: '设备索引', title: '即时查找任何内容。', sub: '搜索200万+设备规格、电线表、断路器、配电盘和变压器。', placeholder: '搜索设备、断路器、配电盘、导线…', noResults: '未找到结果。请尝试"Square D"或"#12 AWG"。' },
    bento: { eyebrow: '平台功能', title: '一站式解决所有需求。', sub: '从计算器到合规——Sparky Wiz涵盖完整工作流程。', askTitle: 'Ask Sparky', askDesc: '基于完整NEC、制造商规格和数十年现场经验训练的AI助手。' },
    phone: { eyebrow: '应用预览', title: '像你一样努力工作的应用程序。', sub: '原生iOS和Android。离线优先。专为手套、阳光和单手操作设计。' },
    ai: { eyebrow: 'AI助手', title: '向Sparky提问。', sub: '基于完整NEC、制造商规格和数十年现场经验训练。', question: '我能把这个EV充电器接到这个配电盘吗？', thinking: '⚡ 正在分析配电盘和负载数据…', answer: '根据您扫描的配电盘，您的200A主断路器已有180A计算负载。48A Level 2 EV充电器将使总负载达到228A——超过服务容量28A。\n\n选项：\n→ 升级服务至320A\n→ 添加负载管理以切除非关键负载\n→ 改为安装30A EVSE' },
    comparison: { eyebrow: '为什么选择Sparky Wiz', title: '一款应用，其他都只是计算器。', otherTitle: '计算器应用', sparkyTitle: 'Sparky Wiz', otherItems: ['电压降','载流量'], sparkyItems: ['电压降','载流量','接线盒填充','导管填充','弯管','NEC规范查询','AI助手','招标','合规检查','OCR扫描','条码查询','材料清单','许可证追踪','供应商网络'] },
    network: { eyebrow: 'IIE网络', title: '这不只是一款应用。', sub: 'Sparky Wiz是智能电气索引(IIE)的现场接口。', powered: '由IIE提供支持', center: 'Sparky Wiz', nodes: ['设备索引','许可证索引','供应商索引','招标索引','合规索引','制造商索引'] },
    footer: { tagline: '现场速度。口袋智慧。', product: '产品', company: '公司', legal: '法律', followUs: '关注我们', appStore: 'App Store', playStore: 'Google Play', copyright: '© 2025 Sparky Wiz, Inc. 保留所有权利。', madeWith: '在美国用⚡制造', cookiePref: 'Cookie偏好', links: { product: ['计算器','NEC查询','合规','招标','楼宇智能','Ask Sparky','扫描设备','价格'], company: ['关于我们','博客','招聘','新闻','合作伙伴','联系我们'], legal: ['隐私政策','服务条款','Cookie政策','无障碍','安全','网站地图'] } },
  },
  vi: {
    nav: { signin: 'Đăng nhập' },
    hero: {
      eyebrow: 'Nền tảng Trí tuệ Điện',
      title1: 'Tất cả những gì Thợ điện',
      title2: 'Cần. Một ứng dụng.',
      sub: 'Tốc độ tại công trình. Trí tuệ trong túi.',
      download: '⬇ Tải miễn phí',
      signin: 'Đăng nhập →',
      pills: ['⚡ Tra cứu NEC','📐 Máy tính','📋 Tuân thủ','📝 Đấu thầu','🏢 Tòa nhà','🤖 Ask Sparky','📷 Quét thiết bị','🔩 Vật liệu','🏛️ Giấy phép','🔌 Biến áp'],
    },
    calc: { eyebrow: 'Máy Tính Trực Tiếp', title: 'Xây dựng cho Công trường.', sub: 'Nhấn để tính toán trực tiếp. Không cần tài khoản.', calculate: 'Tính toán', close: '✕ Đóng' },
    search: { eyebrow: 'Chỉ mục Thiết bị', title: 'Tìm thấy mọi thứ ngay lập tức.', sub: 'Tìm kiếm hơn 2 triệu thông số thiết bị.', placeholder: 'Tìm kiếm thiết bị, cầu dao, tủ điện, dây điện…', noResults: 'Không tìm thấy kết quả.' },
    bento: { eyebrow: 'Tính năng Nền tảng', title: 'Mọi thứ ở một nơi.', sub: 'Từ máy tính đến tuân thủ — Sparky Wiz bao phủ toàn bộ quy trình.', askTitle: 'Ask Sparky', askDesc: 'AI được đào tạo trên NEC đầy đủ, thông số kỹ thuật và kinh nghiệm thực tế.' },
    phone: { eyebrow: 'Xem trước ứng dụng', title: 'Ứng dụng làm việc chăm chỉ như bạn.', sub: 'iOS và Android gốc. Ưu tiên ngoại tuyến.' },
    ai: { eyebrow: 'Trợ lý AI', title: 'Hỏi Sparky bất cứ điều gì.', sub: 'Được đào tạo với NEC đầy đủ, thông số kỹ thuật và kinh nghiệm thực tế.', question: 'Tôi có thể lắp bộ sạc EV này vào tủ điện này không?', thinking: '⚡ Đang phân tích sơ đồ tủ điện…', answer: 'Dựa trên sơ đồ bạn đã quét, cầu dao chính 200A có tải hiện tại 180A. Bộ sạc EV 48A sẽ đưa tổng lên 228A — vượt công suất 28A.\n\nCác lựa chọn:\n→ Nâng cấp dịch vụ lên 320A\n→ Thêm quản lý tải\n→ Cài đặt EVSE 30A thay thế' },
    comparison: { eyebrow: 'Tại sao Sparky Wiz', title: 'Một ứng dụng. Tất cả còn lại chỉ là máy tính.', otherTitle: 'Ứng dụng Tính toán', sparkyTitle: 'Sparky Wiz', otherItems: ['Sụt áp','Khả năng dẫn điện'], sparkyItems: ['Sụt áp','Khả năng dẫn điện','Lấp đầy hộp','Lấp đầy ống','Uốn ống','Tra cứu NEC','Trợ lý AI','Đấu thầu','Kiểm tra tuân thủ','Quét OCR','Tra cứu mã vạch','Danh sách vật liệu','Theo dõi giấy phép','Mạng lưới nhà cung cấp'] },
    network: { eyebrow: 'Mạng IIE', title: 'Đây không chỉ là một ứng dụng.', sub: 'Sparky Wiz là giao diện thực địa cho Chỉ mục Điện Thông minh (IIE).', powered: 'Được hỗ trợ bởi IIE', center: 'Sparky Wiz', nodes: ['Chỉ mục Thiết bị','Chỉ mục Giấy phép','Chỉ mục Nhà cung cấp','Chỉ mục Đấu thầu','Chỉ mục Tuân thủ','Chỉ mục Nhà sản xuất'] },
    footer: { tagline: 'Tốc độ tại công trình. Trí tuệ trong túi.', product: 'Sản phẩm', company: 'Công ty', legal: 'Pháp lý', followUs: 'Theo dõi chúng tôi', appStore: 'App Store', playStore: 'Google Play', copyright: '© 2025 Sparky Wiz, Inc. Bảo lưu mọi quyền.', madeWith: 'Được tạo với ⚡ tại Hoa Kỳ', cookiePref: 'Tùy chọn Cookie', links: { product: ['Máy tính','Tra cứu NEC','Tuân thủ','Đấu thầu','Tòa nhà thông minh','Ask Sparky','Quét thiết bị','Giá cả'], company: ['Về chúng tôi','Blog','Tuyển dụng','Báo chí','Đối tác','Liên hệ'], legal: ['Chính sách Bảo mật','Điều khoản Dịch vụ','Chính sách Cookie','Khả năng tiếp cận','Bảo mật','Sơ đồ trang web'] } },
  },
};

/* ============================================================
   CALCULATOR DATA
   ============================================================ */
const CALCULATORS = [
  { id: 'voltage-drop', icon: '⚡', name: 'Voltage Drop', color: '#2F80ED', desc: 'NEC-compliant voltage drop' },
  { id: 'box-fill',     icon: '📦', name: 'Box Fill',     color: '#7C3AED', desc: 'Junction box fill check' },
  { id: 'ampacity',     icon: '🧮', name: 'Ampacity',     color: '#00C48C', desc: 'Wire ampacity with derating' },
  { id: 'conduit-fill', icon: '📏', name: 'Conduit Fill', color: '#F59E0B', desc: 'Conduit fill per NEC Ch. 9' },
  { id: 'bending',      icon: '📐', name: 'Bending',      color: '#EF4444', desc: 'Stub-up & offset bending' },
] as const;

/* ============================================================
   EQUIPMENT DATA
   ============================================================ */
const EQUIPMENT = [
  { id: 1,  icon: '⚡', name: 'Square D QO230',        cat: 'Breaker',     specs: '30A · 2-Pole · 120/240V' },
  { id: 2,  icon: '⚡', name: 'Square D QO115',        cat: 'Breaker',     specs: '15A · 1-Pole · 120V' },
  { id: 3,  icon: '⚡', name: 'Siemens Q260',          cat: 'Breaker',     specs: '60A · 2-Pole · 120/240V' },
  { id: 4,  icon: '⚡', name: 'Eaton BR230',           cat: 'Breaker',     specs: '30A · 2-Pole · 120/240V' },
  { id: 5,  icon: '⚡', name: 'GE THQP220',            cat: 'Breaker',     specs: '20A · 2-Pole · 120/240V' },
  { id: 6,  icon: '🔌', name: '#12 AWG THHN Copper',   cat: 'Wire',        specs: '20A · 1.98Ω/kFT · 0.0133 in²' },
  { id: 7,  icon: '🔌', name: '#10 AWG THHN Copper',   cat: 'Wire',        specs: '30A · 1.24Ω/kFT · 0.0211 in²' },
  { id: 8,  icon: '🔌', name: '#8 AWG THHN Copper',    cat: 'Wire',        specs: '40A · 0.778Ω/kFT · 0.0366 in²' },
  { id: 9,  icon: '🔌', name: '#6 AWG THHN Aluminum',  cat: 'Wire',        specs: '50A · 0.808Ω/kFT · 0.059 in²' },
  { id: 10, icon: '🏭', name: 'Square D QO130L200PG',  cat: 'Panel',       specs: '200A · 30 Spaces · 120/240V' },
  { id: 11, icon: '🏭', name: 'Siemens P3042B3200',    cat: 'Panel',       specs: '200A · 42 Spaces · 120/240V' },
  { id: 12, icon: '📏', name: '3/4" EMT Conduit',       cat: 'Conduit',     specs: 'Max Fill: 0.213 in² · Steel' },
  { id: 13, icon: '📏', name: '1" EMT Conduit',          cat: 'Conduit',     specs: 'Max Fill: 0.346 in² · Steel' },
  { id: 14, icon: '🔋', name: 'Square D 45KVA Xfmr',   cat: 'Transformer', specs: '480V → 120/208V · 45KVA' },
  { id: 15, icon: '🔋', name: 'Eaton 75KVA Xfmr',      cat: 'Transformer', specs: '480V → 120/208V · 75KVA' },
];

/* ============================================================
   BENTO FEATURES
   ============================================================ */
const BENTO_FEATURES = [
  { icon: '🏛️', title: 'Permits',           desc: 'Pull permit status by address or APN in real-time.' },
  { icon: '✅', title: 'Compliance',         desc: 'NEC article checks, violation flags, and code references.' },
  { icon: '📝', title: 'Open Bids',          desc: 'Browse, filter, and submit electrical bids instantly.' },
  { icon: '🔩', title: 'Materials',          desc: 'Generate material takeoffs and pricing lists.' },
  { icon: '🏭', title: 'Suppliers',          desc: 'Local supplier pricing, availability, and contact.' },
  { icon: '⚙️', title: 'Equipment',          desc: 'Full equipment specs, datasheets, and alternatives.' },
  { icon: '🔌', title: 'Transformer Lookup', desc: 'KVA, turns ratio, impedance, and NEC sizing.' },
  { icon: '🏢', title: 'Utilities',          desc: 'Utility interconnect requirements and contact data.' },
];

/* ============================================================
   CALCULATOR LOGIC
   ============================================================ */
const WIRE_R: Record<string, Record<string, number>> = {
  copper:   { '#14': 3.14, '#12': 1.98, '#10': 1.24, '#8': 0.778, '#6': 0.491 },
  aluminum: { '#14': 5.17, '#12': 3.26, '#10': 2.04, '#8': 1.28,  '#6': 0.808 },
};
function calcVD(phase: string, v: number, mat: string, ws: string, ft: number, i: number) {
  const R = WIRE_R[mat]?.[ws] ?? 1.98;
  const f = phase === '3' ? 1.732 : 2;
  const vd = (f * ft * R * i) / 1000;
  const pct = (vd / v) * 100;
  return { vd: vd.toFixed(2), pct: pct.toFixed(1), end: (v - vd).toFixed(1), pass: pct <= 3 };
}

const WIRE_VOL: Record<string, number> = { '#14': 2.0, '#12': 2.25, '#10': 2.5, '#8': 3.0, '#6': 5.0 };
const BOX_VOL: Record<string, number>  = { '4×4×1.5"': 21.0, '4×4×2⅛"': 30.3, '2×3×2½"': 14.0, '2×3×3½"': 18.0, 'Two-gang': 28.0 };
function calcBF(box: string, cond: number, awg: string, clamps: number, dev: number, gnd: number) {
  const v = WIRE_VOL[awg] ?? 2.25;
  const total = cond * v + (clamps > 0 ? v : 0) + dev * 2 * v + (gnd > 0 ? v : 0);
  const max = BOX_VOL[box] ?? 21.0;
  return { total: total.toFixed(2), max, pass: total <= max, rem: (max - total).toFixed(2) };
}

const AMP_BASE: Record<string, Record<number, number>> = {
  '#14': { 60: 15, 75: 20, 90: 25 }, '#12': { 60: 20, 75: 25, 90: 30 },
  '#10': { 60: 30, 75: 35, 90: 40 }, '#8':  { 60: 40, 75: 50, 90: 55 },
  '#6':  { 60: 55, 75: 65, 90: 75 }, '#4':  { 60: 70, 75: 85, 90: 95 },
  '3/0': { 60: 165, 75: 200, 90: 225 }, '4/0': { 60: 195, 75: 230, 90: 260 },
};
function calcAmp(ws: string, tr: number, amb: number, cnt: number) {
  const base = AMP_BASE[ws]?.[tr] ?? 20;
  const tf = Math.sqrt(Math.max(0, (tr - amb) / (tr - 30)));
  const ff = cnt <= 3 ? 1 : cnt <= 6 ? 0.8 : cnt <= 9 ? 0.7 : 0.5;
  const adj = Math.floor(base * tf * ff);
  const brk = [15,20,25,30,35,40,50,60,70,80,90,100,110,125,150,175,200].find(b => b >= adj) ?? adj;
  return { adj, base, tf: tf.toFixed(2), ff, brk };
}

const CND_A: Record<string, Record<string, number>> = {
  EMT: { '1/2"': 0.122, '3/4"': 0.213, '1"': 0.346, '1¼"': 0.598, '1½"': 0.814 },
  RMC: { '1/2"': 0.126, '3/4"': 0.217, '1"': 0.355, '1¼"': 0.610, '1½"': 0.829 },
};
const WIRE_A: Record<string, number> = { '#14': 0.0097, '#12': 0.0133, '#10': 0.0211, '#8': 0.0366, '#6': 0.0507 };
function calcCF(ct: string, cs: string, awg: string, qty: number) {
  const ca = CND_A[ct]?.[cs] ?? 0.213;
  const n = qty;
  const maxPct = n === 1 ? 0.53 : n === 2 ? 0.31 : 0.40;
  const used = (WIRE_A[awg] ?? 0.0133) * n;
  const allowed = ca * maxPct;
  const pct = (used / ca) * 100;
  return { used: used.toFixed(4), allowed: allowed.toFixed(4), pct: pct.toFixed(1), maxPct: (maxPct * 100).toFixed(0), pass: used <= allowed };
}

const TAKEUP: Record<number, Record<string, number>> = {
  30: { '1/2"': 5, '3/4"': 6, '1"': 8 },
  45: { '1/2"': 6, '3/4"': 8, '1"': 11 },
  60: { '1/2"': 8, '3/4"': 11, '1"': 14 },
};
function calcBend(mode: string, angle: number, val: number, cs: string) {
  const tu = TAKEUP[angle]?.[cs] ?? 6;
  const shrinkFactor: Record<number, number> = { 30: 0.25, 45: 0.50, 60: 1.00 };
  const sf = shrinkFactor[angle] ?? 0.5;
  if (mode === 'stub') return { mode: 'Stub-up', mark: (val - tu).toFixed(2), tu };
  const shrink = (val * sf).toFixed(3);
  const spread = (val / Math.sin((angle * Math.PI) / 180) * Math.cos((angle * Math.PI) / 180)).toFixed(2);
  return { mode: 'Offset', shrink, spread, tu };
}

/* ============================================================
   HOOKS
   ============================================================ */
function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

function useTypewriter(text: string, active: boolean, speed = 35) {
  const [out, setOut] = useState('');
  useEffect(() => {
    if (!active) { setOut(''); return; }
    setOut(''); let i = 0;
    const t = setInterval(() => { i < text.length ? setOut(text.slice(0, ++i)) : clearInterval(t); }, speed);
    return () => clearInterval(t);
  }, [active, text, speed]);
  return out;
}

/* ============================================================
   SVG SOCIAL ICONS
   ============================================================ */
const IconX = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);
const IconLinkedIn = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);
const IconInstagram = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);
const IconYouTube = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);
const IconFacebook = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);
const IconTikTok = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
  </svg>
);
const IconSun = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
);
const IconMoon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
);
const IconApple = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
  </svg>
);
const IconGoogle = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.05 20.28c-.98.595-2.09.91-3.21.9C10.18 21.17 7 18 7 14c0-3.31 2.69-6 6-6 1.52 0 2.87.57 3.9 1.49L14.57 12H20v-2h-6.14c-.48-.77-1.24-1.36-2.14-1.65C10.73 8.12 9.35 8 8 8.14 5.63 8.43 3.74 9.94 3.14 12c-.73 2.47.43 5.13 2.86 6.26.53.24 1.09.4 1.66.46-1.69-.39-3.16-1.64-3.66-3.31C3.39 12.85 4.74 10.14 7.31 9.19c1.04-.4 2.17-.5 3.25-.24 1.11.27 2.07.89 2.74 1.77.67.88 1 1.98.94 3.11-.05 1.06-.45 2.06-1.15 2.83-.7.77-1.66 1.26-2.7 1.37-1.04.11-2.1-.16-2.97-.76-.87-.6-1.49-1.53-1.72-2.57-.5-2.19.93-4.39 3.11-4.89.49-.11 1-.14 1.5-.07-.7.28-1.26.79-1.61 1.45-.35.66-.44 1.43-.25 2.15.37 1.38 1.7 2.22 3.09 1.97.66-.12 1.25-.47 1.67-.99.42-.52.65-1.17.62-1.84C12.05 11.69 11 10.91 9.84 10.91h-.37c.82-.54 1.83-.71 2.78-.47 2.08.53 3.39 2.55 3.14 4.71-.12 1.04-.61 2.01-1.41 2.71-.8.7-1.84 1.09-2.91 1.11-.52.01-1.04-.06-1.54-.22-.19.23-.39.45-.59.66.57.19 1.16.3 1.76.3 1.49 0 2.96-.56 4.06-1.55l.29.28z"/>
  </svg>
);
const IconSearch = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
  </svg>
);

/* ============================================================
   COMPONENTS
   ============================================================ */

/* ── Navbar ─────────────────────────────────────────────────── */
function Navbar({ theme, setTheme, lang, setLang, t }: { theme: Theme; setTheme: (t: Theme) => void; lang: Lang; setLang: (l: Lang) => void; t: Record<string,any> }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const LANGS: { key: Lang; label: string }[] = [
    { key: 'en', label: 'EN' }, { key: 'es', label: 'ES' },
    { key: 'zh', label: '中文' }, { key: 'vi', label: 'VI' },
  ];

  return (
    <nav className="nav-glass" style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, transition: 'all 0.3s' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
          <span style={{ fontSize: 24 }}>⚡</span>
          <span className="font-display" style={{ fontWeight: 700, fontSize: 18, color: 'var(--sparky-text)', letterSpacing: '-0.02em' }}>Sparky Wiz</span>
        </div>

        {/* Right controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {/* Language toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 2, marginRight: 8 }}>
            {LANGS.map((l, i) => (
              <React.Fragment key={l.key}>
                {i > 0 && <span style={{ color: 'var(--sparky-muted)', fontSize: 12, padding: '0 1px' }}>|</span>}
                <button
                  onClick={() => setLang(l.key)}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    padding: '4px 6px', borderRadius: 6, fontSize: 13, fontWeight: lang === l.key ? 700 : 500,
                    color: lang === l.key ? 'var(--sparky-blue)' : 'var(--sparky-muted)',
                    transition: 'color 0.2s', fontFamily: 'inherit',
                  }}
                >
                  {l.label}
                </button>
              </React.Fragment>
            ))}
          </div>

          {/* Theme toggle */}
          <button className="btn-icon" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label="Toggle theme">
            {theme === 'dark' ? <IconSun /> : <IconMoon />}
          </button>

          {/* Sign In */}
          <button
            className="btn-primary"
            style={{ padding: '9px 22px', fontSize: 14, borderRadius: 10, marginLeft: 4 }}
          >
            {t.nav.signin}
          </button>
        </div>
      </div>
    </nav>
  );
}

/* ── Hero Section ───────────────────────────────────────────── */
function HeroSection({ t }: { t: Record<string,any> }) {
  const pills = [...t.hero.pills, ...t.hero.pills];
  return (
    <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', paddingTop: 80 }}>
      {/* Background */}
      <div className="hero-bg" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div className="hero-grid" />
        <div className="hero-glow-1" />
        <div className="hero-glow-2" />
      </div>

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '0 24px', maxWidth: 900, width: '100%' }}>
        <div className="anim-fadeUp d-0">
          <span className="section-eyebrow">{t.hero.eyebrow}</span>
        </div>
        <h1 className="font-display anim-fadeUp d-1" style={{ fontSize: 'clamp(42px, 7vw, 80px)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.05, color: 'var(--sparky-text)', marginBottom: 8 }}>
          {t.hero.title1}
        </h1>
        <h1 className="font-display anim-fadeUp d-2" style={{ fontSize: 'clamp(42px, 7vw, 80px)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.05, marginBottom: 24 }}>
          <span className="text-gradient">{t.hero.title2}</span>
        </h1>
        <p className="anim-fadeUp d-3" style={{ fontSize: 'clamp(18px, 2.5vw, 22px)', color: 'var(--sparky-muted2)', lineHeight: 1.6, marginBottom: 40, maxWidth: 560, margin: '0 auto 40px' }}>
          {t.hero.sub}
        </p>
        <div className="anim-fadeUp d-4" style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 64 }}>
          <button className="btn-primary" style={{ fontSize: 17, padding: '16px 38px' }}>{t.hero.download}</button>
          <button className="btn-secondary" style={{ fontSize: 17, padding: '16px 38px' }}>{t.hero.signin}</button>
        </div>
      </div>

      {/* Pill marquee */}
      <div className="anim-fadeUp d-5" style={{ position: 'relative', zIndex: 2, width: '100%' }}>
        <div className="pill-track-wrap">
          <div className="pill-track">
            {pills.map((pill: string, i: number) => (
              <span key={i} className="feature-pill">{pill}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Calculator Showcase ────────────────────────────────────── */
function CalculatorShowcase({ t }: { t: Record<string,any> }) {
  const [active, setActive] = useState<CalcId>(null);
  const { ref, visible } = useScrollReveal();

  const toggleCalc = (id: CalcId) => setActive(prev => prev === id ? null : id);

  return (
    <section style={{ background: 'var(--sparky-bg2)' }}>
      <div className="sw-section" ref={ref as any}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <span className={`section-eyebrow ${visible ? 'anim-fadeUp' : ''}`}>{t.calc.eyebrow}</span>
          <h2 className={`font-display ${visible ? 'anim-fadeUp d-1' : ''}`} style={{ fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 700, letterSpacing: '-0.025em', color: 'var(--sparky-text)', opacity: visible ? undefined : 0 }}>
            {t.calc.title}
          </h2>
          <p className={`${visible ? 'anim-fadeUp d-2' : ''}`} style={{ color: 'var(--sparky-muted2)', fontSize: 18, marginTop: 10, opacity: visible ? undefined : 0 }}>
            {t.calc.sub}
          </p>
        </div>

        {/* Calculator icon grid */}
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 32 }}>
          {CALCULATORS.map((c, i) => (
            <div
              key={c.id}
              className={`calc-icon-card ${active === c.id ? 'active' : ''} ${visible ? `anim-scaleIn d-${i + 1}` : ''}`}
              style={{ opacity: visible ? undefined : 0 }}
              onClick={() => toggleCalc(c.id as CalcId)}
            >
              <div style={{ width: 56, height: 56, borderRadius: 18, background: `${c.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30, border: `1px solid ${c.color}33` }}>
                {c.icon}
              </div>
              <div style={{ textAlign: 'center' }}>
                <div className="font-display" style={{ fontSize: 14, fontWeight: 700, color: 'var(--sparky-text)', letterSpacing: '-0.01em' }}>{c.name}</div>
                <div style={{ fontSize: 11, color: 'var(--sparky-muted)', marginTop: 2 }}>{c.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Expanded calculator panel */}
        {active && <CalcPanel id={active} t={t} onClose={() => setActive(null)} />}
      </div>
    </section>
  );
}

function CalcPanel({ id, t, onClose }: { id: CalcId; t: Record<string,any>; onClose: () => void }) {
  const c = CALCULATORS.find(c => c.id === id)!;
  return (
    <div className="calc-panel" style={{ marginTop: 8, padding: 32 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 28 }}>{c.icon}</span>
          <span className="font-display" style={{ fontSize: 22, fontWeight: 700, color: 'var(--sparky-text)', letterSpacing: '-0.02em' }}>{c.name}</span>
        </div>
        <button className="btn-sm" onClick={onClose} style={{ background: 'var(--sparky-surface)', color: 'var(--sparky-muted2)', border: '1px solid var(--sparky-border)' }}>{t.calc.close}</button>
      </div>
      {id === 'voltage-drop' && <VDCalc t={t} color={c.color} />}
      {id === 'box-fill'     && <BFCalc t={t} color={c.color} />}
      {id === 'ampacity'     && <AmpCalc t={t} color={c.color} />}
      {id === 'conduit-fill' && <CFCalc t={t} color={c.color} />}
      {id === 'bending'      && <BendCalc t={t} color={c.color} />}
    </div>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14 }}>{children}</div>;
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><label className="sw-label">{label}</label>{children}</div>;
}
function ResultBox({ result, color }: { result: React.ReactNode; color: string }) {
  return (
    <div style={{ background: `${color}11`, border: `1px solid ${color}33`, borderRadius: 16, padding: 24, marginTop: 20 }}>
      {result}
    </div>
  );
}

function VDCalc({ t, color }: { t: Record<string,any>; color: string }) {
  const [phase, setPhase] = useState('1');
  const [v, setV]   = useState(120);
  const [mat, setMat] = useState('copper');
  const [ws, setWs] = useState('#12');
  const [ft, setFt] = useState(100);
  const [amp, setAmp] = useState(20);
  const [res, setRes] = useState<any>(null);

  const run = () => setRes(calcVD(phase, v, mat, ws, ft, amp));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <Row>
        <Field label="Phase"><select className="sw-input" value={phase} onChange={e => setPhase(e.target.value)}><option value="1">1-Phase</option><option value="3">3-Phase</option></select></Field>
        <Field label="Voltage"><select className="sw-input" value={v} onChange={e => setV(+e.target.value)}><option value={120}>120V</option><option value={208}>208V</option><option value={240}>240V</option><option value={277}>277V</option><option value={480}>480V</option></select></Field>
        <Field label="Material"><select className="sw-input" value={mat} onChange={e => setMat(e.target.value)}><option value="copper">Copper</option><option value="aluminum">Aluminum</option></select></Field>
        <Field label="Wire Size"><select className="sw-input" value={ws} onChange={e => setWs(e.target.value)}>{['#14','#12','#10','#8','#6'].map(s => <option key={s}>{s}</option>)}</select></Field>
        <Field label="Length (ft)"><input className="sw-input" type="number" value={ft} onChange={e => setFt(+e.target.value)} min={1} /></Field>
        <Field label="Current (A)"><input className="sw-input" type="number" value={amp} onChange={e => setAmp(+e.target.value)} min={1} /></Field>
      </Row>
      <button className="btn-sm" style={{ alignSelf: 'flex-start', background: color }} onClick={run}>{t.calc.calculate}</button>
      {res && (
        <ResultBox color={color} result={
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 13, color: 'var(--sparky-muted)', marginBottom: 2 }}>Voltage Drop</div>
              <div className="font-display" style={{ fontSize: 36, fontWeight: 800, color, letterSpacing: '-0.03em' }}>{res.vd}V</div>
            </div>
            <div>
              <div style={{ fontSize: 13, color: 'var(--sparky-muted)', marginBottom: 2 }}>Drop %</div>
              <div className="font-display" style={{ fontSize: 36, fontWeight: 800, color, letterSpacing: '-0.03em' }}>{res.pct}%</div>
            </div>
            <div>
              <div style={{ fontSize: 13, color: 'var(--sparky-muted)', marginBottom: 2 }}>Voltage at End</div>
              <div className="font-display" style={{ fontSize: 36, fontWeight: 800, color: 'var(--sparky-text)', letterSpacing: '-0.03em' }}>{res.end}V</div>
            </div>
            <span className={res.pass ? 'badge-pass' : 'badge-fail'}>{res.pass ? '✓ PASS' : '✗ FAIL'}</span>
            {!res.pass && <span style={{ fontSize: 13, color: 'var(--sparky-muted)' }}>NEC 210.19 recommends ≤ 3%</span>}
          </div>
        } />
      )}
    </div>
  );
}

function BFCalc({ t, color }: { t: Record<string,any>; color: string }) {
  const [box, setBox] = useState('4×4×1.5"');
  const [cond, setCond] = useState(3);
  const [awg, setAwg] = useState('#12');
  const [clamps, setClamps] = useState(0);
  const [dev, setDev] = useState(1);
  const [gnd, setGnd] = useState(1);
  const [res, setRes] = useState<any>(null);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <Row>
        <Field label="Box Size"><select className="sw-input" value={box} onChange={e => setBox(e.target.value)}>{Object.keys(BOX_VOL).map(k => <option key={k}>{k}</option>)}</select></Field>
        <Field label="Wire Size (AWG)"><select className="sw-input" value={awg} onChange={e => setAwg(e.target.value)}>{['#14','#12','#10','#8','#6'].map(s => <option key={s}>{s}</option>)}</select></Field>
        <Field label="Conductors"><input className="sw-input" type="number" value={cond} onChange={e => setCond(+e.target.value)} min={0} /></Field>
        <Field label="Clamp Sets"><input className="sw-input" type="number" value={clamps} onChange={e => setClamps(+e.target.value)} min={0} /></Field>
        <Field label="Devices"><input className="sw-input" type="number" value={dev} onChange={e => setDev(+e.target.value)} min={0} /></Field>
        <Field label="EGC Count"><input className="sw-input" type="number" value={gnd} onChange={e => setGnd(+e.target.value)} min={0} /></Field>
      </Row>
      <button className="btn-sm" style={{ alignSelf: 'flex-start', background: color }} onClick={() => setRes(calcBF(box, cond, awg, clamps, dev, gnd))}>{t.calc.calculate}</button>
      {res && (
        <ResultBox color={color} result={
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'center' }}>
            <div><div style={{ fontSize: 13, color: 'var(--sparky-muted)', marginBottom: 2 }}>Used Volume</div><div className="font-display" style={{ fontSize: 36, fontWeight: 800, color, letterSpacing: '-0.03em' }}>{res.total} in³</div></div>
            <div><div style={{ fontSize: 13, color: 'var(--sparky-muted)', marginBottom: 2 }}>Box Volume</div><div className="font-display" style={{ fontSize: 36, fontWeight: 800, color: 'var(--sparky-text)', letterSpacing: '-0.03em' }}>{res.max} in³</div></div>
            <div><div style={{ fontSize: 13, color: 'var(--sparky-muted)', marginBottom: 2 }}>Remaining</div><div className="font-display" style={{ fontSize: 36, fontWeight: 800, color: +res.rem >= 0 ? 'var(--sparky-green)' : 'var(--sparky-red)', letterSpacing: '-0.03em' }}>{res.rem} in³</div></div>
            <span className={res.pass ? 'badge-pass' : 'badge-fail'}>{res.pass ? '✓ PASS' : '✗ FAIL'}</span>
          </div>
        } />
      )}
    </div>
  );
}

function AmpCalc({ t, color }: { t: Record<string,any>; color: string }) {
  const [ws, setWs] = useState('#10');
  const [tr, setTr] = useState(75);
  const [amb, setAmb] = useState(30);
  const [cnt, setCnt] = useState(3);
  const [res, setRes] = useState<any>(null);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <Row>
        <Field label="Wire Size"><select className="sw-input" value={ws} onChange={e => setWs(e.target.value)}>{['#14','#12','#10','#8','#6','#4','3/0','4/0'].map(s => <option key={s}>{s}</option>)}</select></Field>
        <Field label="Temp Rating (°C)"><select className="sw-input" value={tr} onChange={e => setTr(+e.target.value)}><option value={60}>60°C</option><option value={75}>75°C</option><option value={90}>90°C</option></select></Field>
        <Field label="Ambient Temp (°C)"><input className="sw-input" type="number" value={amb} onChange={e => setAmb(+e.target.value)} min={10} max={70} /></Field>
        <Field label="Conductors in Conduit"><input className="sw-input" type="number" value={cnt} onChange={e => setCnt(+e.target.value)} min={1} max={40} /></Field>
      </Row>
      <button className="btn-sm" style={{ alignSelf: 'flex-start', background: color }} onClick={() => setRes(calcAmp(ws, tr, amb, cnt))}>{t.calc.calculate}</button>
      {res && (
        <ResultBox color={color} result={
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'center' }}>
            <div><div style={{ fontSize: 13, color: 'var(--sparky-muted)', marginBottom: 2 }}>Adjusted Ampacity</div><div className="font-display" style={{ fontSize: 36, fontWeight: 800, color, letterSpacing: '-0.03em' }}>{res.adj}A</div></div>
            <div><div style={{ fontSize: 13, color: 'var(--sparky-muted)', marginBottom: 2 }}>Base Ampacity</div><div className="font-display" style={{ fontSize: 36, fontWeight: 800, color: 'var(--sparky-text)', letterSpacing: '-0.03em' }}>{res.base}A</div></div>
            <div><div style={{ fontSize: 13, color: 'var(--sparky-muted)', marginBottom: 2 }}>Breaker Size</div><div className="font-display" style={{ fontSize: 36, fontWeight: 800, color: 'var(--sparky-green)', letterSpacing: '-0.03em' }}>{res.brk}A</div></div>
            <div style={{ fontSize: 13, color: 'var(--sparky-muted)' }}>Temp factor: {res.tf} · Fill factor: {res.ff}</div>
          </div>
        } />
      )}
    </div>
  );
}

function CFCalc({ t, color }: { t: Record<string,any>; color: string }) {
  const [ct, setCt] = useState('EMT');
  const [cs, setCs] = useState('3/4"');
  const [awg, setAwg] = useState('#12');
  const [qty, setQty] = useState(3);
  const [res, setRes] = useState<any>(null);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <Row>
        <Field label="Conduit Type"><select className="sw-input" value={ct} onChange={e => setCt(e.target.value)}><option>EMT</option><option>RMC</option></select></Field>
        <Field label="Conduit Size"><select className="sw-input" value={cs} onChange={e => setCs(e.target.value)}>{Object.keys(CND_A[ct] || {}).map(k => <option key={k}>{k}</option>)}</select></Field>
        <Field label="Wire Size"><select className="sw-input" value={awg} onChange={e => setAwg(e.target.value)}>{['#14','#12','#10','#8','#6'].map(s => <option key={s}>{s}</option>)}</select></Field>
        <Field label="Wire Count"><input className="sw-input" type="number" value={qty} onChange={e => setQty(+e.target.value)} min={1} max={30} /></Field>
      </Row>
      <button className="btn-sm" style={{ alignSelf: 'flex-start', background: color }} onClick={() => setRes(calcCF(ct, cs, awg, qty))}>{t.calc.calculate}</button>
      {res && (
        <ResultBox color={color} result={
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'center' }}>
            <div><div style={{ fontSize: 13, color: 'var(--sparky-muted)', marginBottom: 2 }}>Fill %</div><div className="font-display" style={{ fontSize: 36, fontWeight: 800, color, letterSpacing: '-0.03em' }}>{res.pct}%</div></div>
            <div><div style={{ fontSize: 13, color: 'var(--sparky-muted)', marginBottom: 2 }}>Max Allowed</div><div className="font-display" style={{ fontSize: 36, fontWeight: 800, color: 'var(--sparky-text)', letterSpacing: '-0.03em' }}>{res.maxPct}%</div></div>
            <div><div style={{ fontSize: 13, color: 'var(--sparky-muted)', marginBottom: 2 }}>Area Used</div><div className="font-display" style={{ fontSize: 24, fontWeight: 700, color: 'var(--sparky-text)' }}>{res.used} in²</div></div>
            <span className={res.pass ? 'badge-pass' : 'badge-fail'}>{res.pass ? '✓ PASS' : '✗ FAIL'}</span>
          </div>
        } />
      )}
    </div>
  );
}

function BendCalc({ t, color }: { t: Record<string,any>; color: string }) {
  const [mode, setMode] = useState('stub');
  const [angle, setAngle] = useState(45);
  const [val, setVal] = useState(12);
  const [cs, setCs] = useState('3/4"');
  const [res, setRes] = useState<any>(null);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <Row>
        <Field label="Mode"><select className="sw-input" value={mode} onChange={e => setMode(e.target.value)}><option value="stub">Stub-up</option><option value="offset">Offset</option></select></Field>
        <Field label="Bend Angle"><select className="sw-input" value={angle} onChange={e => setAngle(+e.target.value)}><option value={30}>30°</option><option value={45}>45°</option><option value={60}>60°</option></select></Field>
        <Field label="Conduit Size"><select className="sw-input" value={cs} onChange={e => setCs(e.target.value)}><option>1/2"</option><option>3/4"</option><option>1"</option></select></Field>
        <Field label={mode === 'stub' ? 'Stub Length (in)' : 'Offset Height (in)'}><input className="sw-input" type="number" value={val} onChange={e => setVal(+e.target.value)} min={1} /></Field>
      </Row>
      <button className="btn-sm" style={{ alignSelf: 'flex-start', background: color }} onClick={() => setRes(calcBend(mode, angle, val, cs))}>{t.calc.calculate}</button>
      {res && (
        <ResultBox color={color} result={
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'center' }}>
            {'mark' in res ? (
              <><div><div style={{ fontSize: 13, color: 'var(--sparky-muted)', marginBottom: 2 }}>Mark at</div><div className="font-display" style={{ fontSize: 36, fontWeight: 800, color, letterSpacing: '-0.03em' }}>{res.mark}"</div></div><div><div style={{ fontSize: 13, color: 'var(--sparky-muted)', marginBottom: 2 }}>Take-up</div><div className="font-display" style={{ fontSize: 36, fontWeight: 800, color: 'var(--sparky-text)', letterSpacing: '-0.03em' }}>{res.tu}"</div></div></>
            ) : (
              <><div><div style={{ fontSize: 13, color: 'var(--sparky-muted)', marginBottom: 2 }}>Shrink</div><div className="font-display" style={{ fontSize: 36, fontWeight: 800, color, letterSpacing: '-0.03em' }}>{(res as any).shrink}"</div></div><div><div style={{ fontSize: 13, color: 'var(--sparky-muted)', marginBottom: 2 }}>Spread</div><div className="font-display" style={{ fontSize: 36, fontWeight: 800, color: 'var(--sparky-text)', letterSpacing: '-0.03em' }}>{(res as any).spread}"</div></div></>
            )}
          </div>
        } />
      )}
    </div>
  );
}

/* ── Spotlight Search ───────────────────────────────────────── */
function SpotlightSearch({ t }: { t: Record<string,any> }) {
  const [query, setQuery] = useState('');
  const { ref, visible } = useScrollReveal();
  const results = query.trim().length > 1
    ? EQUIPMENT.filter(e => e.name.toLowerCase().includes(query.toLowerCase()) || e.cat.toLowerCase().includes(query.toLowerCase())).slice(0, 6)
    : [];

  const CAT_COLORS: Record<string, string> = { Breaker: '#2F80ED', Wire: '#00C48C', Panel: '#7C3AED', Conduit: '#F59E0B', Transformer: '#EF4444' };

  return (
    <section style={{ background: 'var(--sparky-bg)' }}>
      <div className="sw-section" ref={ref as any} style={{ textAlign: 'center' }}>
        <div className={visible ? 'anim-fadeUp' : ''} style={{ opacity: visible ? undefined : 0 }}>
          <span className="section-eyebrow">{t.search.eyebrow}</span>
        </div>
        <h2 className={`font-display ${visible ? 'anim-fadeUp d-1' : ''}`} style={{ fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 700, letterSpacing: '-0.025em', color: 'var(--sparky-text)', marginBottom: 12, opacity: visible ? undefined : 0 }}>
          {t.search.title}
        </h2>
        <p className={`${visible ? 'anim-fadeUp d-2' : ''}`} style={{ color: 'var(--sparky-muted2)', fontSize: 18, marginBottom: 40, opacity: visible ? undefined : 0 }}>
          {t.search.sub}
        </p>

        <div className={`${visible ? 'anim-fadeUp d-3' : ''}`} style={{ maxWidth: 680, margin: '0 auto', position: 'relative', opacity: visible ? undefined : 0 }}>
          {/* Search icon */}
          <div style={{ position: 'absolute', left: 20, top: '50%', transform: query && results.length ? 'translateY(-100%)' : 'translateY(-50%)', transition: 'transform 0.2s', color: 'var(--sparky-muted)', pointerEvents: 'none', marginTop: results.length ? -8 : 0, zIndex: 2 }}>
            <IconSearch />
          </div>
          <input
            className="spotlight-input"
            type="text"
            placeholder={t.search.placeholder}
            value={query}
            onChange={e => setQuery(e.target.value)}
          />

          {/* Results */}
          {query.trim().length > 1 && (
            <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {results.length > 0 ? results.map((r, i) => (
                <div key={r.id} className="spotlight-result" style={{ animationDelay: `${i * 0.05}s` }}>
                  <span style={{ fontSize: 24, width: 40, textAlign: 'center', flexShrink: 0 }}>{r.icon}</span>
                  <div style={{ flex: 1, textAlign: 'left', minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 15, color: 'var(--sparky-text)', marginBottom: 2 }}>{r.name}</div>
                    <div style={{ fontSize: 13, color: 'var(--sparky-muted)' }}>{r.specs}</div>
                  </div>
                  <span style={{ padding: '3px 10px', borderRadius: 100, fontSize: 12, fontWeight: 600, background: `${CAT_COLORS[r.cat] ?? '#6B7280'}18`, color: CAT_COLORS[r.cat] ?? '#6B7280', border: `1px solid ${CAT_COLORS[r.cat] ?? '#6B7280'}33`, flexShrink: 0 }}>{r.cat}</span>
                </div>
              )) : (
                <div style={{ padding: 20, textAlign: 'center', color: 'var(--sparky-muted)', fontSize: 15 }}>{t.search.noResults}</div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/* ── Bento Grid ─────────────────────────────────────────────── */
function BentoGrid({ t }: { t: Record<string,any> }) {
  const { ref, visible } = useScrollReveal();
  return (
    <section style={{ background: 'var(--sparky-bg2)' }}>
      <div className="sw-section" ref={ref as any}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <span className={`section-eyebrow ${visible ? 'anim-fadeUp' : ''}`}>{t.bento.eyebrow}</span>
          <h2 className={`font-display ${visible ? 'anim-fadeUp d-1' : ''}`} style={{ fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 700, letterSpacing: '-0.025em', color: 'var(--sparky-text)', marginBottom: 10, opacity: visible ? undefined : 0 }}>
            {t.bento.title}
          </h2>
          <p className={`${visible ? 'anim-fadeUp d-2' : ''}`} style={{ color: 'var(--sparky-muted2)', fontSize: 18, opacity: visible ? undefined : 0 }}>
            {t.bento.sub}
          </p>
        </div>

        <div className={`bento-grid ${visible ? 'anim-fadeUp d-3' : ''}`} style={{ opacity: visible ? undefined : 0 }}>
          {/* Ask Sparky — large card */}
          <div className="bento-card bento-large" style={{ background: 'linear-gradient(135deg, #0f1d3a 0%, #111827 100%)', border: '1px solid rgba(47,128,237,0.25)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: -60, right: -60, width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(47,128,237,0.2) 0%, transparent 70%)', pointerEvents: 'none' }} />
            <div style={{ position: 'relative', zIndex: 1, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 260 }}>
              <div>
                <div style={{ fontSize: 40, marginBottom: 12 }}>🤖</div>
                <h3 className="font-display" style={{ fontSize: 26, fontWeight: 700, color: '#F9FAFB', letterSpacing: '-0.02em', marginBottom: 8 }}>{t.bento.askTitle}</h3>
                <p style={{ fontSize: 15, color: '#9CA3AF', lineHeight: 1.6, maxWidth: 340 }}>{t.bento.askDesc}</p>
              </div>
              <div style={{ marginTop: 24, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '12px 16px', fontSize: 14, color: '#6B7280', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>💬</span><span style={{ flex: 1 }}>Ask an NEC code question...</span>
                <span style={{ color: '#2F80ED', fontWeight: 600, fontSize: 13 }}>Enter ↵</span>
              </div>
            </div>
          </div>

          {/* Feature cards */}
          {BENTO_FEATURES.map((f) => (
            <div key={f.title} className="bento-card">
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ fontSize: 30, marginBottom: 12 }}>{f.icon}</div>
                <h3 className="font-display" style={{ fontSize: 17, fontWeight: 700, color: 'var(--sparky-text)', letterSpacing: '-0.01em', marginBottom: 6 }}>{f.title}</h3>
                <p style={{ fontSize: 13, color: 'var(--sparky-muted2)', lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Phone Mockup ───────────────────────────────────────────── */
function PhoneMockup({ t }: { t: Record<string,any> }) {
  const { ref, visible } = useScrollReveal();
  const screens = [
    { title: 'Voltage Drop', color: '#2F80ED', content: 'calculator' },
    { title: 'OCR Scan', color: '#00C48C', content: 'ocr' },
    { title: 'Barcode', color: '#F59E0B', content: 'barcode' },
    { title: 'Open Bids', color: '#7C3AED', content: 'bids' },
    { title: 'Ask Sparky', color: '#EF4444', content: 'ai' },
  ];

  return (
    <section style={{ background: 'var(--sparky-bg)' }}>
      <div className="sw-section">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 64 }}>
          <div ref={ref as any} style={{ textAlign: 'center' }}>
            <span className={`section-eyebrow ${visible ? 'anim-fadeUp' : ''}`}>{t.phone.eyebrow}</span>
            <h2 className={`font-display ${visible ? 'anim-fadeUp d-1' : ''}`} style={{ fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 700, letterSpacing: '-0.025em', color: 'var(--sparky-text)', marginBottom: 12, opacity: visible ? undefined : 0 }}>
              {t.phone.title}
            </h2>
            <p className={`${visible ? 'anim-fadeUp d-2' : ''}`} style={{ color: 'var(--sparky-muted2)', fontSize: 18, opacity: visible ? undefined : 0 }}>
              {t.phone.sub}
            </p>
          </div>

          {/* Phone */}
          <div className={`phone-shell anim-float ${visible ? 'anim-fadeUp' : ''}`} style={{ opacity: visible ? undefined : 0 }}>
            <div className="phone-screen">
              <div className="phone-notch" />
              <div className="screens-track">
                {screens.map((s, si) => (
                  <div key={si} className="mock-screen">
                    {/* Status bar */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#4B5563', marginBottom: 8 }}>
                      <span>9:41</span><span>●●●●</span>
                    </div>
                    {/* Screen header */}
                    <div style={{ background: s.color + '22', borderRadius: 10, padding: '8px 10px', display: 'flex', alignItems: 'center', gap: 8, border: `1px solid ${s.color}44`, marginBottom: 8 }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: s.color }} />
                      <span style={{ fontSize: 12, fontWeight: 700, color: s.color }}>{s.title}</span>
                    </div>
                    {/* Mock content */}
                    {s.content === 'calculator' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        {['Phase: 1-Phase','Voltage: 120V','Wire: #12 Cu','Length: 100 ft'].map(l => (
                          <div key={l} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 6, padding: '5px 8px', fontSize: 10, color: '#6B7280', border: '1px solid rgba(255,255,255,0.06)' }}>{l}</div>
                        ))}
                        <div style={{ background: '#2F80ED22', borderRadius: 8, padding: '8px', marginTop: 4, border: '1px solid #2F80ED44', textAlign: 'center' }}>
                          <div style={{ fontSize: 18, fontWeight: 800, color: '#2F80ED' }}>2.4V</div>
                          <div style={{ fontSize: 9, color: '#00C48C' }}>2.0% — ✓ PASS</div>
                        </div>
                      </div>
                    )}
                    {s.content === 'ocr' && (
                      <div style={{ flex: 1, background: 'rgba(0,196,140,0.05)', border: '2px dashed rgba(0,196,140,0.3)', borderRadius: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, padding: 12, position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, transparent, #00C48C, transparent)', animation: 'scanLine 2s ease-in-out infinite', top: '30%' }} />
                        <div style={{ fontSize: 16 }}>📷</div>
                        <div style={{ fontSize: 10, color: '#00C48C', textAlign: 'center' }}>Scanning label…</div>
                        <div style={{ fontSize: 9, color: '#4B5563', background: 'rgba(0,0,0,0.4)', padding: '3px 6px', borderRadius: 4 }}>Square D QO230</div>
                      </div>
                    )}
                    {s.content === 'barcode' && (
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 5 }}>
                        <div style={{ display: 'flex', gap: 2, justifyContent: 'center', height: 50, alignItems: 'flex-end' }}>
                          {Array.from({ length: 22 }, (_, i) => <div key={i} style={{ width: i % 3 === 0 ? 3 : 2, height: `${40 + Math.sin(i) * 15}%`, background: '#F59E0B', borderRadius: 1 }} />)}
                        </div>
                        <div style={{ fontSize: 10, color: '#F59E0B', textAlign: 'center', fontFamily: 'monospace' }}>784752930041</div>
                        <div style={{ background: '#F59E0B11', borderRadius: 6, padding: '5px 8px', fontSize: 9, color: '#D1D5DB', border: '1px solid #F59E0B33' }}>3/4" EMT Conduit × 10ft</div>
                      </div>
                    )}
                    {s.content === 'bids' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                        {[{t:'Commercial Office Rewire', a:'$48,500', d:'2d'},{t:'Panel Upgrade 200A', a:'$3,200', d:'5d'},{t:'EV Charger Install ×4', a:'$12,800', d:'1d'}].map((b, i) => (
                          <div key={i} style={{ background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 8, padding: '7px 8px' }}>
                            <div style={{ fontSize: 10, fontWeight: 600, color: '#D1D5DB', marginBottom: 2 }}>{b.t}</div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <span style={{ fontSize: 11, fontWeight: 700, color: '#7C3AED' }}>{b.a}</span>
                              <span style={{ fontSize: 9, color: '#6B7280' }}>{b.d} left</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    {s.content === 'ai' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 8, padding: '6px 8px', fontSize: 10, color: '#9CA3AF', alignSelf: 'flex-end', maxWidth: '80%' }}>Can I add a 50A EV charger?</div>
                        <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, padding: '7px 9px', fontSize: 10, color: '#D1D5DB', lineHeight: 1.5 }}>
                          ⚡ Based on your 200A service with 165A load, a 50A EVSE would exceed capacity. Consider a 30A EVSE or service upgrade.
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── AI Section ─────────────────────────────────────────────── */
function AISection({ t }: { t: Record<string,any> }) {
  const { ref, visible } = useScrollReveal();
  const [phase, setPhase] = useState<'idle' | 'typing' | 'thinking' | 'answering' | 'done'>('idle');
  const typed = useTypewriter(t.ai.question, phase === 'typing');
  const answTyped = useTypewriter(t.ai.answer, phase === 'answering', 12);

  useEffect(() => {
    if (!visible || phase !== 'idle') return;
    const t1 = setTimeout(() => setPhase('typing'), 800);
    return () => clearTimeout(t1);
  }, [visible, phase]);

  useEffect(() => {
    if (phase !== 'typing' || typed !== t.ai.question) return;
    const t1 = setTimeout(() => setPhase('thinking'), 600);
    return () => clearTimeout(t1);
  }, [phase, typed, t.ai.question]);

  useEffect(() => {
    if (phase !== 'thinking') return;
    const t1 = setTimeout(() => setPhase('answering'), 2000);
    return () => clearTimeout(t1);
  }, [phase]);

  useEffect(() => {
    if (phase !== 'answering' || answTyped !== t.ai.answer) return;
    setPhase('done');
  }, [phase, answTyped, t.ai.answer]);

  return (
    <section style={{ background: '#060d1a' }}>
      <div className="sw-section-full" ref={ref as any} style={{ maxWidth: 900, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <span className={`section-eyebrow ${visible ? 'anim-fadeUp' : ''}`}>{t.ai.eyebrow}</span>
          <h2 className={`font-display ${visible ? 'anim-fadeUp d-1' : ''}`} style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 800, letterSpacing: '-0.03em', color: 'white', marginBottom: 12, opacity: visible ? undefined : 0 }}>
            {t.ai.title}
          </h2>
          <p className={`${visible ? 'anim-fadeUp d-2' : ''}`} style={{ fontSize: 18, color: '#6B7280', lineHeight: 1.6, maxWidth: 600, margin: '0 auto', opacity: visible ? undefined : 0 }}>
            {t.ai.sub}
          </p>
        </div>

        <div className={`${visible ? 'anim-fadeUp d-3' : ''}`} style={{ opacity: visible ? undefined : 0 }}>
          {/* Input */}
          <div className="ai-chat-box" style={{ marginBottom: 16 }}>
            <span style={{ fontSize: 22, flexShrink: 0 }}>💬</span>
            <span style={{ flex: 1, fontSize: 17, color: phase === 'idle' ? '#374151' : 'white' }}>
              {phase === 'idle' ? t.ai.question.slice(0, 0) : typed}
              {(phase === 'typing') && <span className="ai-cursor" />}
            </span>
            <button className="btn-sm" style={{ flexShrink: 0, fontSize: 13 }}>Ask ↵</button>
          </div>

          {/* Thinking */}
          {phase === 'thinking' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 20px', color: '#6B7280', fontSize: 14, animation: 'fadeIn 0.4s ease forwards' }}>
              <div style={{ display: 'flex', gap: 4 }}>
                {[0,1,2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: '#2F80ED', animation: `blink 1.2s ${i * 0.2}s ease infinite` }} />)}
              </div>
              {t.ai.thinking}
            </div>
          )}

          {/* Answer */}
          {(phase === 'answering' || phase === 'done') && (
            <div className="ai-response">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <span style={{ fontSize: 20 }}>🤖</span>
                <span className="font-display" style={{ fontWeight: 700, color: 'white', fontSize: 15 }}>Sparky</span>
                <span style={{ fontSize: 11, background: 'rgba(0,196,140,0.15)', color: '#00C48C', border: '1px solid rgba(0,196,140,0.25)', padding: '2px 8px', borderRadius: 100, fontWeight: 600 }}>AI · NEC 2023</span>
              </div>
              <p style={{ fontSize: 15, color: '#D1D5DB', lineHeight: 1.8, whiteSpace: 'pre-line' }}>{answTyped}{phase === 'answering' && <span className="ai-cursor" />}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/* ── Comparison ─────────────────────────────────────────────── */
function ComparisonSection({ t }: { t: Record<string,any> }) {
  const { ref, visible } = useScrollReveal();
  return (
    <section style={{ background: 'var(--sparky-bg)' }}>
      <div className="sw-section" ref={ref as any}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <span className={`section-eyebrow ${visible ? 'anim-fadeUp' : ''}`}>{t.comparison.eyebrow}</span>
          <h2 className={`font-display ${visible ? 'anim-fadeUp d-1' : ''}`} style={{ fontSize: 'clamp(28px, 4vw, 46px)', fontWeight: 700, letterSpacing: '-0.025em', color: 'var(--sparky-text)', maxWidth: 700, margin: '0 auto', opacity: visible ? undefined : 0 }}>
            {t.comparison.title}
          </h2>
        </div>

        <div className={`${visible ? 'anim-scaleIn d-2' : ''}`} style={{ display: 'flex', gap: 20, flexWrap: 'wrap', opacity: visible ? undefined : 0 }}>
          {/* Other apps */}
          <div className="compare-col" style={{ opacity: 0.6 }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--sparky-border)', background: 'var(--sparky-surface2)' }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--sparky-muted)' }}>{t.comparison.otherTitle}</div>
            </div>
            <div style={{ padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 0 }}>
              {t.comparison.otherItems.map((item: string) => (
                <div key={item} className="compare-item">
                  <span style={{ color: '#00C48C', fontWeight: 700, fontSize: 16 }}>✓</span>
                  <span style={{ color: 'var(--sparky-muted2)' }}>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Sparky Wiz */}
          <div className="compare-col" style={{ border: '1px solid rgba(47,128,237,0.35)', flex: 1.5, minWidth: 260 }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(47,128,237,0.15)', background: 'linear-gradient(135deg, rgba(47,128,237,0.12), rgba(0,196,140,0.06))' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 18 }}>⚡</span>
                <span className="font-display" style={{ fontWeight: 800, color: '#2F80ED', fontSize: 15 }}>{t.comparison.sparkyTitle}</span>
                <span style={{ background: 'rgba(0,196,140,0.15)', color: '#00C48C', border: '1px solid rgba(0,196,140,0.3)', padding: '2px 8px', borderRadius: 100, fontSize: 11, fontWeight: 700, marginLeft: 'auto' }}>Everything</span>
              </div>
            </div>
            <div style={{ padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 0 }}>
              {t.comparison.sparkyItems.map((item: string) => (
                <div key={item} className="compare-item">
                  <span style={{ color: '#2F80ED', fontWeight: 700, fontSize: 16 }}>✓</span>
                  <span style={{ color: 'var(--sparky-text)', fontWeight: 500 }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── IIE Network ────────────────────────────────────────────── */
function IIENetwork({ t }: { t: Record<string,any> }) {
  const { ref, visible } = useScrollReveal();
  const cx = 300, cy = 200, r = 130;
  const nodes = t.network.nodes;
  const angles = nodes.map((_: string, i: number) => (i / nodes.length) * 2 * Math.PI - Math.PI / 2);
  const pts = angles.map((a: number) => ({ x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) }));

  return (
    <section style={{ background: 'var(--sparky-bg2)' }}>
      <div className="sw-section" ref={ref as any} style={{ textAlign: 'center' }}>
        <span className={`section-eyebrow ${visible ? 'anim-fadeUp' : ''}`}>{t.network.eyebrow}</span>
        <h2 className={`font-display ${visible ? 'anim-fadeUp d-1' : ''}`} style={{ fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 700, letterSpacing: '-0.025em', color: 'var(--sparky-text)', marginBottom: 12, opacity: visible ? undefined : 0 }}>
          {t.network.title}
        </h2>
        <p className={`${visible ? 'anim-fadeUp d-2' : ''}`} style={{ color: 'var(--sparky-muted2)', fontSize: 18, maxWidth: 680, margin: '0 auto 56px', lineHeight: 1.7, opacity: visible ? undefined : 0 }}>
          {t.network.sub}
        </p>

        {/* SVG Network */}
        <div className={`${visible ? 'anim-scaleIn d-3' : ''}`} style={{ opacity: visible ? undefined : 0, display: 'inline-block', width: '100%', maxWidth: 600 }}>
          <svg viewBox="0 0 600 400" style={{ width: '100%', overflow: 'visible' }}>
            <defs>
              <radialGradient id="centerGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#2F80ED" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#00C48C" stopOpacity="0.05" />
              </radialGradient>
            </defs>

            {/* Lines */}
            {pts.map((p: {x:number;y:number}, i: number) => (
              <line key={i}
                x1={cx} y1={cy} x2={p.x} y2={p.y}
                stroke="url(#centerGrad)"
                strokeWidth="1.5"
                className={visible ? 'network-line' : ''}
                style={{ animationDelay: `${0.3 + i * 0.15}s`, stroke: 'rgba(47,128,237,0.35)' }}
              />
            ))}

            {/* Center node */}
            <circle cx={cx} cy={cy} r={52} fill="#2F80ED" fillOpacity="0.12" stroke="#2F80ED" strokeWidth="1.5" className={visible ? 'network-node' : ''} style={{ animationDelay: '0.1s' }} />
            <circle cx={cx} cy={cy} r={42} fill="#2F80ED" fillOpacity="0.08" />
            <text x={cx} y={cy - 8} textAnchor="middle" fill="#2F80ED" fontSize="22">⚡</text>
            <text x={cx} y={cy + 10} textAnchor="middle" fill="#F9FAFB" fontSize="11" fontWeight="700" fontFamily="Space Grotesk, Inter, sans-serif">Sparky Wiz</text>

            {/* Outer nodes */}
            {pts.map((p: {x:number;y:number}, i: number) => (
              <g key={i} className={visible ? 'network-node' : ''} style={{ animationDelay: `${0.5 + i * 0.15}s` }}>
                <circle cx={p.x} cy={p.y} r={38} fill="var(--sparky-surface)" stroke="rgba(47,128,237,0.25)" strokeWidth="1" />
                <circle cx={p.x} cy={p.y} r={30} fill="rgba(47,128,237,0.05)" />
                <foreignObject x={p.x - 34} y={p.y - 18} width={68} height={36}>
                  <div style={{ fontSize: 9, fontWeight: 600, color: '#9CA3AF', textAlign: 'center', lineHeight: 1.3, fontFamily: 'Inter, sans-serif' }}>
                    {nodes[i]}
                  </div>
                </foreignObject>
              </g>
            ))}
          </svg>
        </div>

        <div className={`${visible ? 'anim-fadeUp d-5' : ''}`} style={{ marginTop: 32, opacity: visible ? undefined : 0 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 100, background: 'linear-gradient(135deg, rgba(47,128,237,0.15), rgba(0,196,140,0.1))', border: '1px solid rgba(47,128,237,0.25)', color: 'var(--sparky-muted2)', fontSize: 14, fontWeight: 600 }}>
            <span style={{ color: '#2F80ED' }}>●</span> {t.network.powered}
          </span>
        </div>
      </div>
    </section>
  );
}

/* ── Footer ─────────────────────────────────────────────────── */
function Footer({ t, lang, setLang }: { t: Record<string,any>; lang: Lang; setLang: (l: Lang) => void }) {
  const socials = [
    { icon: <IconX />,         label: 'X / Twitter', href: '#' },
    { icon: <IconLinkedIn />,  label: 'LinkedIn',    href: '#' },
    { icon: <IconInstagram />, label: 'Instagram',   href: '#' },
    { icon: <IconYouTube />,   label: 'YouTube',     href: '#' },
    { icon: <IconFacebook />,  label: 'Facebook',    href: '#' },
    { icon: <IconTikTok />,    label: 'TikTok',      href: '#' },
  ];

  const LANGS: { key: Lang; label: string }[] = [
    { key: 'en', label: 'English' }, { key: 'es', label: 'Español' },
    { key: 'zh', label: '中文' }, { key: 'vi', label: 'Tiếng Việt' },
  ];

  return (
    <footer style={{ background: 'var(--sparky-bg)', borderTop: '1px solid var(--sparky-border)' }}>
      {/* Main footer grid */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '72px 24px 40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 48, marginBottom: 64 }}>
          
          {/* Brand column */}
          <div style={{ gridColumn: 'span 1' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <span style={{ fontSize: 28 }}>⚡</span>
              <span className="font-display" style={{ fontWeight: 800, fontSize: 20, color: 'var(--sparky-text)', letterSpacing: '-0.02em' }}>Sparky Wiz</span>
            </div>
            <p style={{ fontSize: 14, color: 'var(--sparky-muted2)', lineHeight: 1.8, marginBottom: 24, maxWidth: 240 }}>
              {t.footer.tagline}
            </p>

            {/* App store badges */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
              <button className="app-badge" style={{ width: 'fit-content' }}>
                <IconApple />
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: 10, color: 'var(--sparky-muted)', lineHeight: 1 }}>Download on the</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--sparky-text)', lineHeight: 1.3 }}>{t.footer.appStore}</div>
                </div>
              </button>
              <button className="app-badge" style={{ width: 'fit-content' }}>
                <IconGoogle />
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: 10, color: 'var(--sparky-muted)', lineHeight: 1 }}>Get it on</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--sparky-text)', lineHeight: 1.3 }}>{t.footer.playStore}</div>
                </div>
              </button>
            </div>

            {/* Social icons */}
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--sparky-muted)', marginBottom: 12 }}>{t.footer.followUs}</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {socials.map(s => (
                  <a key={s.label} href={s.href} aria-label={s.label} className="social-icon-btn">{s.icon}</a>
                ))}
              </div>
            </div>
          </div>

          {/* Product links */}
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--sparky-muted)', marginBottom: 20 }}>{t.footer.product}</div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {t.footer.links.product.map((link: string) => (
                <li key={link}><a href="#" className="footer-link">{link}</a></li>
              ))}
            </ul>
          </div>

          {/* Company links */}
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--sparky-muted)', marginBottom: 20 }}>{t.footer.company}</div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {t.footer.links.company.map((link: string) => (
                <li key={link}><a href="#" className="footer-link">{link}</a></li>
              ))}
            </ul>
          </div>

          {/* Legal links */}
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--sparky-muted)', marginBottom: 20 }}>{t.footer.legal}</div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {t.footer.links.legal.map((link: string) => (
                <li key={link}><a href="#" className="footer-link">{link}</a></li>
              ))}
            </ul>
            {/* Cookie preference button */}
            <button
              onClick={() => alert('Cookie preferences panel would open here')}
              style={{ marginTop: 20, display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 8, border: '1px solid var(--sparky-border2)', background: 'transparent', color: 'var(--sparky-muted2)', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--sparky-blue)'; (e.currentTarget as HTMLElement).style.color = 'var(--sparky-blue)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--sparky-border2)'; (e.currentTarget as HTMLElement).style.color = 'var(--sparky-muted2)'; }}
            >
              🍪 {t.footer.cookiePref}
            </button>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: 'var(--sparky-border)', marginBottom: 28 }} />

        {/* Bottom bar */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          {/* Copyright + made with */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontSize: 14, color: 'var(--sparky-muted)' }}>{t.footer.copyright}</span>
            <span style={{ fontSize: 12, color: 'var(--sparky-muted)' }}>{t.footer.madeWith}</span>
          </div>

          {/* NEC disclaimer */}
          <span style={{ fontSize: 12, color: 'var(--sparky-muted)', maxWidth: 400, textAlign: 'center' }}>
            NEC data based on NFPA 70-2023. Always verify with official NEC publications for final installations.
          </span>

          {/* Language selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {LANGS.map((l, i) => (
              <React.Fragment key={l.key}>
                {i > 0 && <span style={{ color: 'var(--sparky-muted)', fontSize: 12 }}>·</span>}
                <button
                  onClick={() => setLang(l.key)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: lang === l.key ? 700 : 400, color: lang === l.key ? 'var(--sparky-blue)' : 'var(--sparky-muted)', fontFamily: 'inherit', padding: '2px 4px', borderRadius: 4, transition: 'color 0.2s' }}
                >
                  {l.label}
                </button>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ============================================================
   MAIN PAGE
   ============================================================ */
export default function LandingPage() {
  const [theme, setTheme] = useState<Theme>('dark');
  const [lang, setLang]   = useState<Lang>('en');
  const t = T[lang];

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.body.style.background = theme === 'dark' ? '#0B1220' : '#EFF4FF';
  }, [theme]);

  const handleSetTheme = useCallback((next: Theme) => setTheme(next), []);
  const handleSetLang  = useCallback((next: Lang)  => setLang(next),  []);

  return (
    <div data-theme={theme} style={{ minHeight: '100vh', background: 'var(--sparky-bg)', color: 'var(--sparky-text)', transition: 'background 0.3s, color 0.3s' }}>
      <Navbar theme={theme} setTheme={handleSetTheme} lang={lang} setLang={handleSetLang} t={t} />

      <main style={{ paddingTop: 64 }}>
        <HeroSection t={t} />
        <CalculatorShowcase t={t} />
        <SpotlightSearch t={t} />
        <BentoGrid t={t} />
        <PhoneMockup t={t} />
        <AISection t={t} />
        <ComparisonSection t={t} />
        <IIENetwork t={t} />
      </main>

      <Footer t={t} lang={lang} setLang={handleSetLang} />
    </div>
  );
}
