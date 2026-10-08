"use strict";

const $ = (id) => document.getElementById(id);
const q = (selector) => document.querySelector(selector);
const qa = (selector) => [...document.querySelectorAll(selector)];

const PROVIDER = {
  name: "ООО «АРХИЛОФТ»",
  ogrn: "1257700019334",
  inn: "9731146509",
  kpp: "773101001",
  address: "121353, г. Москва, Сколковское шоссе, д. 31, стр. 4",
  account: "40702810601530000657",
  bank: "АО «АЛЬФА-БАНК»",
  correspondent: "30101810200000000593",
  bik: "044525593",
  email: "info@archilofts.ru",
  phone: "+7 (985) 128-00-77",
  signer: "Нам Вероника Валентиновна",
  signerGenitive: "Нам Вероники Валентиновны",
  signerShort: "В. В. Нам",
  signerRole: "руководителя отдела продаж",
  authorityNumber: "01-10-2026",
  authorityDate: "2026-10-01",
  authorityValidThrough: "2026-12-31",
};

const FIXED_SPACES = Object.freeze(["LaserSpace", "AcrylSpace"]);

const CATALOG = {
  minimum: { kind: "equipment", name: "Пакет технического оснащения «Минимум»", qty: 1, unit: "компл.", price: 45000 },
  basic: { kind: "equipment", name: "Пакет «Базовый» до 100–150 гостей", qty: 1, unit: "компл.", price: 100000 },
  basicScreen: { kind: "equipment", name: "Пакет «Базовый с экраном» до 100–150 гостей", qty: 1, unit: "компл.", price: 175500 },
  comfort: { kind: "equipment", name: "Пакет технического оборудования «Комфорт+» от 150 гостей", qty: 1, unit: "компл.", price: 168000 },
  comfortScreen: { kind: "equipment", name: "Пакет «Комфорт+ с экраном» от 150 гостей", qty: 1, unit: "компл.", price: 240000 },
  allInclusive: { kind: "equipment", name: "Пакет «Всё включено ArchiLoft»", qty: 1, unit: "компл.", price: 300000 },
  allInclusiveScreen: { kind: "equipment", name: "Пакет «Всё включено ArchiLoft с экраном»", qty: 1, unit: "компл.", price: 385800 },
  stage: { kind: "equipment", name: "Сцена с монтажом и демонтажом", qty: 1, unit: "компл.", price: 15000 },
  laser: { kind: "equipment", name: "Лазерное оборудование / лазерное шоу", qty: 1, unit: "усл.", price: 60000 },
  screenOffer: { kind: "equipment", name: "Светодиодный экран 3,5 × 2 м с видеорежиссёром", qty: 1, unit: "компл.", price: 86400 },
  mapping: { kind: "equipment", name: "3D-мэппинг: два проектора Roly RL-10KU RL-85U", qty: 1, unit: "компл.", price: 65000 },
  soundDirector: { kind: "service", name: "Услуги звукорежиссёра, смена 9 часов", qty: 1, unit: "смена", price: 25000 },
  lightDirector: { kind: "service", name: "Услуги светорежиссёра, смена 9 часов", qty: 1, unit: "смена", price: 25000 },
  dutyTechnician: { kind: "service", name: "Услуги дежурного техника по звуку и/или свету, смена 9 часов", qty: 1, unit: "смена", price: 15000 },
  remount: { kind: "service", name: "Перемонтаж стороннего оборудования", qty: 1, unit: "усл.", price: 10000 },
  screenFixed: { kind: "equipment", name: "Стационарный экран 3,5 × 2 м с видеопультовой", qty: 1, unit: "компл.", price: 60000 },
  screenDelivered: { kind: "equipment", name: "Экран 3,5 × 2 м с видеопультовой, доставкой, монтажом и видеоинженером", qty: 1, unit: "компл.", price: 178000 },
  screenLarge: { kind: "equipment", name: "Экран 4,5 × 2,5 м с видеопультовой, доставкой, монтажом и видеоинженером", qty: 1, unit: "компл.", price: 222000 },
  karaoke: { kind: "equipment", name: "Комплект караоке AST 250 с LED-телевизором 65″ и цифровым микшерным пультом", qty: 1, unit: "компл.", price: 72500 },
};

let services = ["comfort"].map((key, index) => ({
  id: `${Date.now()}-${index}`,
  ...CATALOG[key],
}));
let activeDocument = "contract";

const html = (value) => String(value ?? "")
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#039;");

const numberValue = (id) => Number($(id).value || 0);
const textValue = (id) => $(id).value.trim();
const dateValue = (id) => $(id).value ? new Date($(id).value) : null;
const selectedPartyType = () => q('input[name="partyType"]:checked').value;

const STORAGE_KEY = "archidocs.workspace.v1";
const FORM_FIELD_IDS = Object.freeze([
  "contractNumber", "contractDate", "documentDate", "addendumNumber", "eventStart", "eventEnd", "technicalStart", "technicalEnd", "guestCount", "eventPurpose",
  "personName", "passport", "birthDate", "passportIssuer", "passportDate", "passportCode", "personAddress", "personPhone", "personEmail",
  "companyName", "companyInn", "companyKpp", "companyOgrn", "companyAddress", "companyPostalAddress", "companyPhone", "companyEmail", "companyBank", "companyAccount",
  "companyCorrespondent", "companyBik", "companySigner", "companySignerRole", "companySignerBasis",
  "rentAmount", "depositAmount", "vatRate", "vatMode", "firstPaymentPercent", "firstPaymentDays",
  "finalPaymentDaysBefore", "depositDaysBefore", "overtimeRate", "addendumPaymentPercent", "addendumPaymentDays", "addendumFinalDaysBefore",
]);
const PARTY_FIELD_IDS = Object.freeze({
  person: ["personName", "passport", "birthDate", "passportIssuer", "passportDate", "passportCode", "personAddress", "personPhone", "personEmail"],
  company: ["companyName", "companyInn", "companyKpp", "companyOgrn", "companyAddress", "companyPostalAddress", "companyPhone", "companyEmail", "companyBank", "companyAccount", "companyCorrespondent", "companyBik", "companySigner", "companySignerRole", "companySignerBasis"],
});
const DEFAULT_FIELD_VALUES = Object.freeze(Object.fromEntries(FORM_FIELD_IDS.map((id) => [id, $(id).value])));
let storageEnabled = true;
let storageState = { version: 1, draft: null, currentContractId: null, contracts: [] };
let currentContractId = null;
let storageSaveTimer = null;
let restoringStorage = false;

const formatMoney = (value) => new Intl.NumberFormat("ru-RU", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
}).format(Number(value || 0));

const formatInteger = (value) => new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 0 }).format(Number(value || 0));

const formatDateLong = (value) => {
  if (!value) return "НЕ ЗАПОЛНЕНО";
  const date = value instanceof Date ? value : new Date(`${value}T12:00:00`);
  const months = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"];
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()} года`;
};

const formatDateTime = (value) => {
  if (!value) return "НЕ ЗАПОЛНЕНО";
  const date = value instanceof Date ? value : new Date(value);
  const datePart = formatDateLong(date);
  const timePart = new Intl.DateTimeFormat("ru-RU", { hour: "2-digit", minute: "2-digit" }).format(date);
  return `${datePart} ${timePart}`;
};

const hoursBetween = (start, end) => start && end ? Math.max(0, (end - start) / 3600000) : 0;

const addCalendarDays = (date, count) => {
  if (!date) return null;
  const result = new Date(date);
  result.setDate(result.getDate() + Math.max(0, Number(count) || 0));
  return result;
};

const subtractCalendarDays = (date, count) => {
  if (!date) return null;
  const result = new Date(date);
  result.setDate(result.getDate() - Math.max(0, Number(count) || 0));
  return result;
};

const dateOnly = (date) => date ? new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12) : null;

const paymentDatesFor = ({ contractDate, documentDate, eventStart, technicalStart, firstPaymentDays, finalPaymentDaysBefore, depositDaysBefore, addendumPaymentDays, addendumFinalDaysBefore }) => {
  const signing = contractDate ? new Date(`${contractDate}T12:00:00`) : null;
  const addendumSigning = documentDate ? new Date(`${documentDate}T12:00:00`) : null;
  const eventDate = dateOnly(eventStart);
  const technicalDate = dateOnly(technicalStart || eventStart);
  return {
    firstPaymentDate: addCalendarDays(signing, firstPaymentDays),
    finalPaymentDate: subtractCalendarDays(eventDate, finalPaymentDaysBefore),
    depositPaymentDate: subtractCalendarDays(eventDate, depositDaysBefore),
    addendumFirstPaymentDate: addCalendarDays(addendumSigning, addendumPaymentDays),
    addendumFinalPaymentDate: subtractCalendarDays(technicalDate, addendumFinalDaysBefore),
  };
};

const contractRequiresFullPayment = (data) => {
  if (Number(data?.firstPaymentPercent) === 100) return true;
  if (!data?.contractDate || !data?.finalPaymentDate) return false;
  return data.finalPaymentDate < new Date(`${data.contractDate}T00:00:00`);
};

const declension = (n, forms) => {
  const n10 = n % 10;
  const n100 = n % 100;
  if (n100 >= 11 && n100 <= 19) return forms[2];
  if (n10 === 1) return forms[0];
  if (n10 >= 2 && n10 <= 4) return forms[1];
  return forms[2];
};

const triadWords = (value, feminine = false) => {
  const hundreds = ["", "сто", "двести", "триста", "четыреста", "пятьсот", "шестьсот", "семьсот", "восемьсот", "девятьсот"];
  const tens = ["", "", "двадцать", "тридцать", "сорок", "пятьдесят", "шестьдесят", "семьдесят", "восемьдесят", "девяносто"];
  const teens = ["десять", "одиннадцать", "двенадцать", "тринадцать", "четырнадцать", "пятнадцать", "шестнадцать", "семнадцать", "восемнадцать", "девятнадцать"];
  const onesMale = ["", "один", "два", "три", "четыре", "пять", "шесть", "семь", "восемь", "девять"];
  const onesFemale = ["", "одна", "две", "три", "четыре", "пять", "шесть", "семь", "восемь", "девять"];
  const words = [];
  words.push(hundreds[Math.floor(value / 100)]);
  const rest = value % 100;
  if (rest >= 10 && rest <= 19) {
    words.push(teens[rest - 10]);
  } else {
    words.push(tens[Math.floor(rest / 10)]);
    words.push((feminine ? onesFemale : onesMale)[rest % 10]);
  }
  return words.filter(Boolean);
};

const integerToWords = (raw) => {
  let value = Math.max(0, Math.floor(Number(raw) || 0));
  if (value === 0) return "ноль";
  const scales = [
    null,
    { forms: ["тысяча", "тысячи", "тысяч"], feminine: true },
    { forms: ["миллион", "миллиона", "миллионов"], feminine: false },
    { forms: ["миллиард", "миллиарда", "миллиардов"], feminine: false },
  ];
  const words = [];
  let scale = 0;
  while (value > 0 && scale < scales.length) {
    const triad = value % 1000;
    if (triad) {
      const scaleInfo = scales[scale];
      const chunk = triadWords(triad, scaleInfo?.feminine);
      if (scaleInfo) chunk.push(declension(triad, scaleInfo.forms));
      words.unshift(...chunk);
    }
    value = Math.floor(value / 1000);
    scale += 1;
  }
  return words.join(" ");
};

const amountInWords = (amount) => {
  const normalized = Math.max(0, Number(amount) || 0);
  const rubles = Math.floor(normalized + 0.00001);
  const kopeks = Math.round((normalized - rubles) * 100);
  const phrase = `${integerToWords(rubles)} ${declension(rubles, ["рубль", "рубля", "рублей"])} ${String(kopeks).padStart(2, "0")} ${declension(kopeks, ["копейка", "копейки", "копеек"])}`;
  return phrase.charAt(0).toUpperCase() + phrase.slice(1);
};

const shortName = (name) => {
  if (!name || name === "НЕ ЗАПОЛНЕНО") return "НЕ ЗАПОЛНЕНО";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "НЕ ЗАПОЛНЕНО";
  const [surname, first, middle] = parts;
  return `${first ? `${first[0]}. ` : ""}${middle ? `${middle[0]}. ` : ""}${surname}`;
};

const contactRequisites = (phoneId, emailId) => {
  const contacts = [];
  const phone = textValue(phoneId);
  const email = textValue(emailId);
  if (phone) contacts.push(`Телефон: ${phone}`);
  if (email) contacts.push(`e-mail: ${email}`);
  return contacts.join("; ");
};

const currentParty = () => {
  if (selectedPartyType() === "company") {
    const name = textValue("companyName") || "НЕ ЗАПОЛНЕНО";
    const signer = textValue("companySigner") || "НЕ ЗАПОЛНЕНО";
    const role = textValue("companySignerRole") || "представителя";
    const basis = textValue("companySignerBasis") || "НЕ ЗАПОЛНЕНО";
    return {
      type: "company",
      name,
      short: name,
      signature: shortName(signer),
      intro: `${name} в лице ${role} ${signer}, действующего на основании ${basis}`,
      requisites: [
        name,
        `ИНН ${textValue("companyInn") || "—"}; КПП ${textValue("companyKpp") || "—"}; ОГРН ${textValue("companyOgrn") || "—"}`,
        `Юридический адрес: ${textValue("companyAddress") || "—"}`,
        `Почтовый адрес: ${textValue("companyPostalAddress") || "—"}`,
        `р/с ${textValue("companyAccount") || "—"} в ${textValue("companyBank") || "—"}`,
        `к/с ${textValue("companyCorrespondent") || "—"}; БИК ${textValue("companyBik") || "—"}`,
        contactRequisites("companyPhone", "companyEmail"),
        `Подписант: ${signer}, ${role}, на основании ${basis}`,
      ].filter(Boolean),
    };
  }
  const name = textValue("personName") || "НЕ ЗАПОЛНЕНО";
  return {
    type: "person",
    name,
    short: name,
    signature: shortName(name),
    intro: name,
    requisites: [
      name,
      `Паспорт: ${textValue("passport") || "—"}, выдан ${formatDateLong($("passportDate").value)} ${textValue("passportIssuer") || "—"}, код подразделения ${textValue("passportCode") || "—"}`,
      `Дата рождения: ${formatDateLong($("birthDate").value)}`,
      `Адрес регистрации: ${textValue("personAddress") || "—"}`,
      contactRequisites("personPhone", "personEmail"),
    ].filter(Boolean),
  };
};

const serviceSubtotal = () => services.reduce((sum, service) => sum + Math.max(0, Number(service.qty) || 0) * Math.max(0, Number(service.price) || 0), 0);

const totalsFor = (subtotal) => {
  const rate = numberValue("vatRate");
  const mode = $("vatMode").value;
  if (!rate) return { net: subtotal, vat: 0, total: subtotal, rate, mode };
  if (mode === "included") {
    const vat = subtotal * rate / (100 + rate);
    return { net: subtotal - vat, vat, total: subtotal, rate, mode };
  }
  const vat = subtotal * rate / 100;
  return { net: subtotal, vat, total: subtotal + vat, rate, mode };
};

const serviceRowsHtml = () => services.length ? services.map((service, index) => {
  const total = Number(service.qty || 0) * Number(service.price || 0);
  return `<tr>
    <td>${index + 1}</td>
    <td>${html(service.name || "НЕ ЗАПОЛНЕНО")}</td>
    <td class="number">${html(service.qty || 0)}</td>
    <td>${html(service.unit || "ед.")}</td>
    <td class="number">${formatMoney(service.price)}</td>
    <td class="number">${formatMoney(total)}</td>
  </tr>`;
}).join("") : `<tr><td>—</td><td>Дополнительное техническое оснащение не выбрано</td><td class="number">—</td><td>—</td><td class="number">0,00</td><td class="number">0,00</td></tr>`;

const providerAuthorityText = () => `доверенности № ${PROVIDER.authorityNumber} от ${formatDateLong(PROVIDER.authorityDate)}`;
const providerIntro = () => `${PROVIDER.name} в лице ${PROVIDER.signerRole} ${PROVIDER.signerGenitive}, действующей на основании ${providerAuthorityText()}`;
const providerRequisites = () => `${PROVIDER.name}<br>ОГРН ${PROVIDER.ogrn}; ИНН ${PROVIDER.inn}; КПП ${PROVIDER.kpp}<br>Адрес: ${PROVIDER.address}<br>р/с ${PROVIDER.account} в ${PROVIDER.bank}<br>к/с ${PROVIDER.correspondent}; БИК ${PROVIDER.bik}<br>${PROVIDER.email}; ${PROVIDER.phone}<br>Подписант: ${PROVIDER.signer}, ${providerAuthorityText()}`;

const taxWording = (totals) => {
  if (!totals.rate) return "НДС не облагается";
  return totals.mode === "included"
    ? `В том числе НДС ${totals.rate}% — ${formatMoney(totals.vat)} руб`
    : `Кроме того начисляется НДС ${totals.rate}% — ${formatMoney(totals.vat)} руб`;
};

const totalTaxWording = (totals) => !totals.rate
  ? "НДС не облагается"
  : `В том числе НДС ${totals.rate}% — ${formatMoney(totals.vat)} руб`;

const serviceTotalWording = (totals) => totals.rate && totals.mode === "onTop"
  ? `${formatMoney(totals.net)} руб. НДС ${totals.rate}% уплачивается дополнительно сверх указанной суммы.`
  : `${formatMoney(totals.total)} руб. (${taxWording(totals).toLowerCase()})`;

const signatureBlocks = (party, leftTitle = "Сторона 2") => `<div class="doc-signatures">
  <div class="doc-signature-box"><p><strong>${html(leftTitle)}</strong><br>${party.requisites.map(html).join("<br>")}</p><p class="signature-line">____________ / ${html(party.signature)} /</p></div>
  <div class="doc-signature-box"><p><strong>Сторона 1</strong><br>${providerRequisites()}</p><p class="signature-line">____________ / ${PROVIDER.signerShort} /</p></div>
</div>`;

const sampleSignatureBlocks = (party, leftTitle = "Сторона 2") => `<div class="doc-signatures">
  <div class="doc-signature-box"><p><strong>${html(leftTitle)}</strong><br>${party.requisites.map(html).join("<br>")}</p><p class="blocked-signature">──────── НЕ ПОДПИСЫВАТЬ · ОБРАЗЕЦ ────────</p></div>
  <div class="doc-signature-box"><p><strong>Сторона 1</strong><br>${providerRequisites()}</p><p class="blocked-signature">──────── НЕ ПОДПИСЫВАТЬ · ОБРАЗЕЦ ────────</p></div>
</div>`;

const usesPageSignoffs = () => activeDocument === "contract" || activeDocument === "addendum";

const pageSignoffMarkup = (data, pageText) => {
  return `<div class="page-signoff" aria-label="Подписи сторон на странице">
    <div class="page-signoff-meta"><span></span><span>${html(pageText)}</span></div>
    <div class="page-signoff-row">
      <div><strong>Сторона 2</strong><span>____________ / ${html(data.party.signature)} /</span></div>
      <div><strong>Сторона 1</strong><span>____________ / ${PROVIDER.signerShort} /</span></div>
    </div>
  </div>`;
};

const decoratePageSignoffs = (data) => {
  const includeSignoffs = usesPageSignoffs();
  [...$("paper").children].filter((page) => page.classList.contains("doc-page")).forEach((page, index) => {
    if (!page.querySelector(":scope > .doc-letterhead")) {
      page.insertAdjacentHTML("afterbegin", '<div class="doc-letterhead"><img src="./assets/archiloft-logo.jpeg" width="3860" height="939" alt="ArchiLoft — футуристичный арт-особняк"></div>');
    }
    if (!includeSignoffs) return;
    const label = page.querySelector(".page-label");
    const pageText = `Страница ${index + 1}`;
    label?.remove();
    page.classList.add("has-page-signoff");
    page.insertAdjacentHTML("beforeend", pageSignoffMarkup(data, pageText));
  });
};

const renderTransferAct = (data, { sample = false, pageLabel = "" } = {}) => `<section class="doc-page${sample ? " act-sample" : ""}">
  ${sample ? '<p class="act-watermark">ФОРМА<br>НЕ ПОДПИСЫВАТЬ</p>' : ""}
  <p class="doc-right">${sample ? "<strong>Приложение № 4</strong><br>" : ""}к Договору № ${html(data.contractNumber)} от ${html(formatDateLong(data.contractDate))}</p>
  <p class="doc-kicker">${sample ? "ФОРМА АКТА" : "АКТ"} ПЕРЕДАЧИ ПОМЕЩЕНИЯ</p>
  <div class="doc-meta"><span>г. Москва</span><span>${html(formatDateLong(data.eventStart))}</span></div>
  <p>Сторона 1 передала, а Сторона 2 приняла внутренние помещения общей площадью 425,04 кв. м и террасу площадью 83 кв. м, а также имущество по Договору № ${html(data.contractNumber)} для Мероприятия с ${html(formatDateTime(data.eventStart))} до ${html(formatDateTime(data.eventEnd))}.</p>
  <div class="doc-lines"><div>Состояние помещения и имущества:</div><div class="doc-line"></div><div class="doc-line"></div><div>Выявленные недостатки и замечания:</div><div class="doc-line"></div><div class="doc-line"></div><div>Дополнительные сведения:</div><div class="doc-line"></div></div>
  <p>При отсутствии замечаний Сторона 2 подтверждает пригодность помещения для согласованной цели и получение имущества в указанной комплектности.</p>
  ${sample ? sampleSignatureBlocks(data.party) : signatureBlocks(data.party)}
  ${pageLabel ? `<p class="page-label">${html(pageLabel)}</p>` : ""}
</section>`;

const renderReturnAct = (data, { sample = false, pageLabel = "" } = {}) => `<section class="doc-page${sample ? " act-sample" : ""}">
  ${sample ? '<p class="act-watermark">ФОРМА<br>НЕ ПОДПИСЫВАТЬ</p>' : ""}
  <p class="doc-right">${sample ? "<strong>Приложение № 5</strong><br>" : ""}к Договору № ${html(data.contractNumber)} от ${html(formatDateLong(data.contractDate))}</p>
  <p class="doc-kicker">${sample ? "ФОРМА АКТА" : "АКТ"} ВОЗВРАТА ПОМЕЩЕНИЯ</p>
  <div class="doc-meta"><span>г. Москва</span><span>${html(formatDateLong(data.eventEnd))}</span></div>
  <p>Сторона 2 возвратила, а Сторона 1 приняла внутренние помещения общей площадью 425,04 кв. м, террасу площадью 83 кв. м и имущество после Мероприятия по Договору № ${html(data.contractNumber)}.</p>
  <div class="doc-lines"><div>Повреждения, утрата имущества и иные замечания:</div><div class="doc-line"></div><div class="doc-line"></div><div>Необходимая уборка / вывоз имущества:</div><div class="doc-line"></div><div class="doc-line"></div><div>Согласованные удержания из депозита:</div><div class="doc-line"></div><div>Иные сведения:</div><div class="doc-line"></div></div>
  <p>Если замечания не указаны, помещение считается возвращённым без видимых повреждений. Это не исключает требований по скрытым повреждениям, которые невозможно было обнаружить при обычном осмотре.</p>
  ${sample ? sampleSignatureBlocks(data.party) : signatureBlocks(data.party)}
  ${pageLabel ? `<p class="page-label">${html(pageLabel)}</p>` : ""}
</section>`;

const equipmentServices = () => services.filter((service) => service.kind !== "service");
const technicalEquipmentTable = (withReturn = false) => {
  const equipment = equipmentServices();
  return `<table class="doc-table"><thead><tr><th>№</th><th>Наименование оборудования</th><th>Кол-во</th><th>Комплектность</th><th>Состояние${withReturn ? " при возврате" : " при передаче"}</th><th>Замечания</th></tr></thead><tbody>${equipment.length ? equipment.map((service, index) => `<tr><td>${index + 1}</td><td>${html(service.name)}</td><td>${html(service.qty)} ${html(service.unit)}</td><td>____________</td><td>____________</td><td>____________</td></tr>`).join("") : '<tr><td>—</td><td>Оборудование для передачи не указано</td><td>—</td><td>—</td><td>—</td><td>—</td></tr>'}</tbody></table>`;
};

const renderTechTransferAct = (data) => `<section class="doc-page">
  <p class="doc-right">к Дополнительному соглашению${data.addendumNumber ? ` № ${html(data.addendumNumber)}` : ""} от ${html(formatDateLong(data.documentDate))}<br>к Договору № ${html(data.contractNumber)} от ${html(formatDateLong(data.contractDate))}</p>
  <p class="doc-kicker">АКТ ПЕРЕДАЧИ ТЕХНИЧЕСКОГО ОБОРУДОВАНИЯ</p>
  <div class="doc-meta"><span>г. Москва</span><span>${html(formatDateLong(data.technicalStart))}</span></div>
  <p>Сторона 1 передала, а Сторона 2 приняла до начала использования следующее техническое оборудование:</p>
  ${technicalEquipmentTable(false)}
  <p>Оборудование передано для использования с ${html(formatDateTime(data.technicalStart))} до ${html(formatDateTime(data.technicalEnd))}.</p>
  ${signatureBlocks(data.party)}
</section>`;

const renderTechReturnAct = (data) => `<section class="doc-page">
  <p class="doc-right">к Дополнительному соглашению${data.addendumNumber ? ` № ${html(data.addendumNumber)}` : ""} от ${html(formatDateLong(data.documentDate))}<br>к Договору № ${html(data.contractNumber)} от ${html(formatDateLong(data.contractDate))}</p>
  <p class="doc-kicker">АКТ ВОЗВРАТА ТЕХНИЧЕСКОГО ОБОРУДОВАНИЯ</p>
  <div class="doc-meta"><span>г. Москва</span><span>${html(formatDateLong(data.technicalEnd))}</span></div>
  <p>Сторона 2 возвратила, а Сторона 1 приняла следующее техническое оборудование:</p>
  ${technicalEquipmentTable(true)}
  <div class="doc-lines"><div>Замечания к комплектности и состоянию оборудования:</div><div class="doc-line"></div><div class="doc-line"></div></div>
  ${signatureBlocks(data.party)}
</section>`;

const cancellationTerms = () => `
  <p>6.1. При отмене или изменении срока Мероприятия по причинам, не зависящим от Стороны 1, Сторона 2 самостоятельно несёт ответственность перед посетителями и иными лицами.</p>
  <p>6.2. При отмене Мероприятия более чем за 30 календарных дней до даты его проведения все ранее перечисленные по Договору денежные средства возвращаются Стороне 2 в полном объёме в течение 10 календарных дней с даты получения Стороной 1 письменного уведомления.</p>
  <p>6.3. При отмене Мероприятия не более чем за 30 и не менее чем за 16 календарных дней до даты его проведения Сторона 1 возвращает полученные денежные средства за вычетом 50% полной цены Договора.</p>
  <p>6.4. При отмене Мероприятия за 15 календарных дней или менее Сторона 2 обязана оплатить полную цену Договора.</p>
  <p>6.5. При переносе Мероприятия более чем за 30 календарных дней внесённые средства засчитываются в оплату новой свободной даты. Разница в цене и стоимость дополнительных услуг оплачиваются в течение 3 календарных дней с даты выставления счёта, но в любом случае до новой даты Мероприятия.</p>
  <p>6.6. При переносе Мероприятия за 21–30 календарных дней Сторона 1 удерживает 50% цены Договора, а оставшаяся часть внесённых средств засчитывается в оплату новой свободной даты по действующей на неё цене.</p>
  <p>6.7. При переносе Мероприятия за 20 календарных дней или менее Сторона 1 удерживает полную стоимость субаренды и согласованных дополнительных услуг.</p>
  <p>6.8. Отмена, перенос и иные изменения оформляются письменным соглашением Сторон либо письменными уведомлениями по согласованным каналам связи, если изменение не затрагивает иные существенные условия.</p>`;

const renderRouteAppendix = (data, pageLabel = "Страница 9") => `<section class="doc-page doc-route">
  <p class="doc-right"><strong>Приложение № 3</strong><br>к Договору № ${html(data.contractNumber)} от ${html(formatDateLong(data.contractDate))}</p>
  <p class="doc-kicker">СХЕМА И ПОРЯДОК ПРОЕЗДА</p>
  <p><strong>Адрес:</strong> 121353, г. Москва, Сколковское шоссе, д. 31, стр. 4, пространство «АРХИЛОФТ».</p>
  <p>С 10:00 до 21:30 проезд осуществляется через парковку ТЦ «СпортХит». С 21:30 до 08:00 въезд и выезд с охраняемой территории осуществляется через Арку.</p>
  <p>Сторона 2 обязана заранее сообщить Стороне 1 сведения о транспорте, подрядчиках и времени прибытия, необходимые для организации доступа.</p>
  <p>Парковка на территории ТЦ «СпортХит» не предоставляется. Транспорт не должен перекрывать проезды, эвакуационные выходы и доступ экстренных служб.</p>
  <img class="route-map" src="./assets/route-map.jpg" alt="Схема дневного и ночного проезда к ArchiLoft">
  <div class="route-card"><strong>Ориентир для печатной схемы</strong><span>Сколковское шоссе, д. 31, стр. 4</span><span>Дневной проезд: через парковку ТЦ «СпортХит»</span><span>Ночной проезд: через Арку</span></div>
  ${signatureBlocks(data.party)}
  <p class="page-label">${html(pageLabel)}</p>
</section>`;

const EVENT_RULES = Object.freeze([
  {
    "title": "Условия бронирования площадки и подготовка к Мероприятию",
    "paragraphs": [
      "Для подтверждения бронирования даты Стороны заключают договор субаренды нежилого помещения.",
      "Работа площадки осуществляется строго в рамках данного Договора.",
      "Дата брони закрепляется за Стороной 2 после внесения 50% предоплаты.",
      "Если бронирование осуществляется менее чем за 14 календарных дней до мероприятия, вносится 100% предоплата.",
      "Оплата производится на расчетный счет компании ООО «АРХИЛОФТ».",
      "За 7 календарных дней менеджеры ArchiLoft направят Стороне 2 файл «ТЗ мероприятия». Данный файл поможет Стороне 2 ещё раз пройтись по всем основным моментам и окончательно определиться со всеми дополнительными услугами, а менеджерам площадки — более детально подготовиться ко дню Мероприятия.",
      "Будьте внимательны – данный файл содержит две вкладки.",
      "Заполненный файл необходимо предоставить не позднее чем за 3 рабочих дня до даты Мероприятия.",
      "За 7 календарных дней со Стороной 2 также согласовывается работа PR-отдела площадки на Мероприятии. Фото- и видеоконтент может использоваться PR-отделом для публикации в социальных сетях и на сайте лофта. PR-отдел не публикует изображения гостей Мероприятия, а использует материалы, на которых присутствуют интерьер и экстерьер особняка, шоу-программа и общие планы. Контент публикуется после согласования со Стороной 2."
    ]
  },
  {
    "title": "Монтаж и демонтаж на площадке",
    "paragraphs": [
      "В случае, если необходимо осуществить крепеж к стенам, есть возможность сверления швов между кирпичом. Данный момент согласовывается с менеджером площадки заблаговременно.",
      "Фиксация защитных напольных покрытий с клейким слоем допускается, а также крепление проводов, кабелей и иных коммутационных систем с использованием монтажных лент на клеевой основе, при условии, что их подложка выполнена на бумажном скотче.",
      "Использование виниловых наклеек, включая буквы и узоры, запрещено. Они могут оставить следы, повредить поверхность и усложнить очистку. Площадка стремится поддерживать пространство в идеальном состоянии для комфорта и удобства Стороны 2, поэтому рекомендуется использовать только разрешённые материалы, которые легко снимаются без остатка. Если у Стороны 2 возникнут вопросы по допустимым способам крепления, команда площадки поможет подобрать подходящее решение.",
      "При несоблюдении данных правил взимается штраф в размере – 20 000 рублей.",
      "Монтаж и демонтаж крупногабаритных конструкций осуществляется Стороной 2 исключительно в присутствии технического специалиста, администратора площадки, а также, в присутствии представителя Стороны 2."
    ]
  },
  {
    "title": "Клининг",
    "paragraphs": [
      "Уборка помещения после мероприятия осуществляется силами клининга ArchiLoft.",
      "При сильном загрязнении площадки, использование конфетти, бумажного шоу оплачивается усиленный клининг в размере – 25 000 рублей.",
      "Вид конфетти согласовывается с менеджером площадки заблаговременно.",
      "Использование мелких/рваных конфетти на площадке – 50 000 рублей.",
      "Повышение стоимости усиленного клининга при использование мелких или рваных конфетти на площадке связан с несколькими важными факторами:",
      "3.1. Сложность уборки",
      "Мелкие частицы конфетти застревают в напольных покрытиях, щелях между кирпичной кладкой и могут попадать в вентиляцию, систему кондиционирования. Их трудно убрать даже с помощью профессиональной уборки, что увеличивает затраты на клининг и может испортить внешний вид площадки.",
      "3.2. Повреждение оборудования и систем вентиляции",
      "Конфетти может попасть в системы кондиционирования, вентиляции, технического оснащения. Это может привести к поломкам и дополнительным расходам на обслуживание.",
      "Усиленная уборка санитарных зон и площадки от биологических загрязнений.",
      "Стоимость – от 15 000 рублей.",
      "При необходимости сумма за данную уборку вычитается из Страхового депозита.",
      "Использование песка, сыпучих и иных декоративных материалов требуют индивидуального согласования с менеджером площадки."
    ]
  },
  {
    "title": "Запреты и пожарная безопасность",
    "paragraphs": [
      "Запрещается проносить с собой в пространства ArchiLoft оружие, колющие или режущие предметы, взрывчатые, легковоспламеняющиеся вещества, огнеопасные и пиротехнические вещества или изделия, горючие материалы.",
      "Разрешены свечи в торт и холодные фонтаны (до 20 см).",
      "Внутри площадки разрешено курение электронных сигарет, icos, glo, а также, паровых коктейлей от аккредитованного подрядчика площадки."
    ]
  },
  {
    "title": "Техническое оснащение арт-особняка",
    "paragraphs": [
      "Выделенная мощность электричества – 80 кВт.",
      "Точки подключения: 32А – 2 шт., 63 – 1 шт. (Расположены в Laser Space)",
      "Дополнительное силовое подключение в кухонной зоне – 32А.",
      "Дополнительное силовое подключение на улице (возле арт-объекта Альвеола) – 32А.",
      "Работы по подключению проводятся только в присутствии Технического специалиста площадки. В иных случаях площадка не несет ответственность за подключение оборудования и распределения электричества.",
      "Важно! Работа технической группы может быть остановлена техническим специалистом или администратором площадки при несоблюдении правил техники безопасности и самовольном подключении к силовым распределителям.",
      "Сторона 2 уведомлена и соглашается с тем, что на Площадке статично установлено звуковое, световое, видеопроекционное и иное техническое оборудование, которое не входит в стоимость субаренды Площадки и оплачивается дополнительно на условиях отдельного дополнительного соглашения Сторон.",
      "Перечень статично установленного технического оснащения Площадки:",
      "Звуковое оборудование",
      "Микшерные пульты:",
      "Midas MR18 — 1 шт.;",
      "Allen & Heath ZED-10FX — 1 шт.",
      "Акустические системы и обработка сигнала:",
      "Meyer Sound Galileo 616 AES Processor — 1 шт.;",
      "Meyer Sound CQ-2 — 2 шт.;",
      "Meyer Sound CQ-1 — 2 шт.;",
      "Meyer Sound UPA-1P — 2 шт.;",
      "Meyer Sound M3D SUB — 4 шт.;",
      "Стойка для акустической системы с плоским основанием A-stand (усиленная) — 2 шт.",
      "Радиомикрофоны:",
      "Oktava OWS-U1200H — 2 шт.",
      "Сценический подиум",
      "сценический подиум размером 3 х 4 м, высотой 30 см, устанавливаемый при необходимости.",
      "Световое оснащение",
      "вращающаяся голова типа “beam” INVOLIGHT BEAMFINITY-X — 4 шт.;",
      "вращающаяся голова типа “Wash” SHADOW WASH W1240B — 8 шт.;",
      "вращающаяся голова типа “BSW” SHADOW MASK 200 — 4 шт.;",
      "консоль управления светом SHADOW Command Wing + моноблок — 1 шт.;",
      "компактные тотемы с плоским основанием — 6 шт.",
      "Проекционное оборудование",
      "проектор Roly RL-10KU для воспроизведения 3D-проекции на полигональную стену — 2 шт.;",
      "видеосервер — 1 шт.",
      "Лазерное оборудование",
      "точечный лазер в проемах между залами “One beam laser” — 8 шт.;",
      "цветной лазерный проектор (6 Вт) — 1 шт.;",
      "линейный лазерный прожектор “LaserBar” SHADOW LASER BAR OBI WAN — 4 шт.",
      "Коммутация",
      "комплект сигнальной и электрической коммутации.",
      "Учитывая наличие на Площадке статично установленного технического оснащения, Сторона 2 вправе по своему выбору:",
      "оплатить по отдельному дополнительному соглашению сервисный сбор за привлечение стороннего подрядчика по техническому обеспечению в размере 50 000 (Пятьдесят тысяч) рублей; либо",
      "заказать у Стороны 1 по отдельному дополнительному соглашению услугу по техническому обеспечению на сумму от 50 000 (Пятьдесят тысяч) рублей.",
      "Любой демонтаж статично установленного на Площадке технического оснащения допускается только при наличии предварительного письменного согласования со Стороной 1. Возможность демонтажа определяется Стороной 1 в каждом конкретном случае индивидуально и зависит от состава, количества, особенностей и объема оборудования, подлежащего демонтажу.",
      "Стоимость, сроки, порядок и техническая возможность демонтажа статично установленного оборудования определяются Стороной 1 дополнительно и согласовываются Сторонами отдельно."
    ]
  },
  {
    "title": "Кейтеринг",
    "paragraphs": [
      "На площадке аккредитовано 4 подрядчика, предоставляющие кейтеринг сервис.",
      "При привлечении стороннего подрядчика по кейтерингу взимается сервисный сбор в размере 70 000 рублей.",
      "При привлечении стороннего подрядчика по кейтерингу Сторона 2 обязуется заранее передать ему настоящие правила работы на площадке, которые заблаговременно направляет персональный менеджер площадки. Это позволяет обеспечить бесперебойную работу Мероприятия и соблюдение установленных требований.",
      "Важно! В случае несоблюдения данных правил, представители площадки оставляют за собой право приостановить работу стороннего кейтеринга до полного устранения нарушений.",
      "Пробковый сбор – отсутствует."
    ]
  },
  {
    "title": "Паровые коктейли",
    "paragraphs": [
      "На площадке работает аккредитованный подрядчик кальянного кейтеринга.",
      "Работа стороннего кальянного сервиса на площадке возможна по согласованию со Стороной 1 и при уплате сервисного сбора.",
      "Исключения – презентация оборудования, табака для паровых коктейлей и т.п.",
      "В таком случае, на площадку вызывается представитель аккредитованного подрядчика от площадки для контроля соблюдения правил работы кальянных кейтерингов на площадке.",
      "Работа представителя оплачивается дополнительно в размере от 10 000 рублей."
    ]
  },
  {
    "title": "Парковка автомобилей, гримвагенов и киносъёмочных караванов",
    "paragraphs": [
      "В день Мероприятия парковка автомобилей на территории ТЦ «СпортХит» категорически запрещена.",
      "Бесплатная парковка и городской паркинг:",
      "Во время всего дня мероприятия, парковка автомобилей разрешена на прилегающей территории особняка, включенной в стоимость аренды, которая вмещает до 6-7 авто.",
      "Перед ТЦ «СпортХит», есть платная площадка городского московского паркинга, которой можно воспользоваться, согласно городскому тарифу.",
      "Рядом с территорией особняка располагается платная парковка за шлагбаумом по адресу: Сколковское шоссе 31 стр.2. Тариф – 50 рублей/1час",
      "Выкуп дополнительный парковочных мест:",
      "При необходимости, есть возможность аренды дополнительного парковочного подиума, в непосредственной близости от особняка на 10 авто. Стоимость 25 000 р.",
      "При необходимости, есть возможность выкупа дополнительных парковочных мест. Тариф 3 000 р./1 парковочное место. Можно использовать для парковки гримвагена.",
      "Важно! Парковка авто на территории ТЦ «СпортХит» запрещена. Штраф 5 000 р./1 парковочное место.",
      "Парковка гримвагенов и киносъемочных караванов:",
      "Если на Мероприятии планируются выездные гримёрки или гримвагены, их парковка возможна:",
      "На прилегающей территории особняка.",
      "Если гримваген планируется 12 метров и более, его заезд осуществляется через шлагбаум, расположенный по адресу: Сколковское шоссе 31, стр. 2. Для заезда на территорию необходимо предоставить информацию о марке и гос. номер транспорта. Информация должна быть предоставлена не позднее, чем за три рабочих дня до мероприятия.",
      "Возле арт-объекта «Альвеола» выведено дополнительное трёхфазное силовое подключение 32А, которое можно использовать для подключения гримвагена.",
      "Это поможет избежать шума в момент мероприятия от портативного генератора.",
      "Если у транспортного средства иной вид подключения к силовым подключения – переходник на 32А подрядчик должен обеспечить сам.",
      "На парковке ТЦ «СпортХит».",
      "Для установки гримвагена на территории ТЦ «СпортХит» необходимо выкупить парковочные места по тарифу 3 000 р./1 место. Для парковки гримвагена, минимально выкупается от 4-х мест.",
      "Мусор и любые загрязнения в гримвагене устраняются силами подрядчиков, предоставляющих данную услугу. Если Стороне 2 требуется помощь клинеров площадки, такая услуга оплачивается отдельно и согласовывается с менеджерами индивидуально.",
      "Оставлять мусор на территории после эксплуатации гримвагена запрещено. Слив любых отходов, биологических загрязнений на территории особняка и ТЦ «СпортХит» строго запрещен. Штраф – 40 000 рублей."
    ]
  },
  {
    "title": "Обращение с мусором на площадке",
    "paragraphs": [
      "Крупногабаритный мусор, который образовывается на площадке в результате работы подрядчиков, формируется и выносится / вывозится с площадки силами самих подрядчиков. Мусорный контейнер находится за зданием ArchiLoft.",
      "Клининг площадки за мусор от подрядчиков ответственности не несет.",
      "В случае, если после выезда всех подрядчиков на площадке остается крупногабаритный мусор от подрядчиков, из страхового депозита взимается сумма, равная усиленному клинингу (от 25 000 р.), в зависимости от количества оставленного мусора."
    ]
  },
  {
    "title": "Охрана на Мероприятиях",
    "paragraphs": [
      "Особняк находится на охраняемой территории. Также, есть опция организации работы профессиональных сотрудников ЧОП от проверенного подрядчика площадки.",
      "Условия бронирования – 1 сотрудник, минимум на 6 часов работы, 3 500 р. / 1 час. Привлечения сторонних сотрудников охраны разрешено.",
      "Персонал площадки не несет ответственность за работу сторонних сотрудников охраны."
    ]
  },
  {
    "title": "Обращение с мебелью особняка и хелперы площадки",
    "paragraphs": [
      "На площадке находится ряд стильной дизайнерской мебели Vondom.",
      "Вся мебель, размещенная в лофте, предоставляется Стороне 2 как составная часть Площадки и сохраняется в ее пределах на весь срок субаренды. Вынос мебели за пределы лофта, ее полное удаление из пространства Площадки, а также перемещение в иные помещения или зоны хранения в рамках исполнения настоящего Договора не допускаются.",
      "В случае отсутствия дождя, в летний период времени, мебель может быть расположена на террасе.",
      "Изменение конфигурации пространства путем сложной, неоднократной или нестандартной перестановки, перемещения либо трансформации мебели внутри площадки возможно исходя из заполненного технического задания с подробным описанием задачи. Такая работа сверх включённой в стоимость субаренды базовой помощи при расстановке мебели оплачивается отдельно; стоимость обсуждается индивидуально.",
      "После завершения мероприятия, мебель лофта возвращается на места, с помощью хелперов от площадки.",
      "За стороннюю мебель на площадке представители площадки и хелперы ответственности не несут.",
      "Площадка может предоставить квалифицированных подрядчиков по аренде дополнительной мебели. Информацию можно запросить у менеджеров площадки.",
      "Также, на площадке расположена стойка ресепшен на колесиках. Данная стойка из особняка не демонтируется. Есть возможность её передвижения между пространствами, а также, в случае ее ненадобности, расположения её у черной чугунной винтовой лестницы.",
      "В случае отсутствия дождя, в летний период времени, мебель может быть расположена на террасе.",
      "При необходимости площадка может предоставить дополнительных хелперов для помощи в монтаже / демонтаже сверх включённой в стоимость субаренды базовой помощи персонала при расстановке мебели лофта.",
      "Работа дополнительных хелперов оплачивается отдельно – от 6 000 р. (стоимость может варьироваться в зависимости от занятости хелперов на монтаже / демонтаже)."
    ]
  },
  {
    "title": "Установка автомобиля на площадке",
    "paragraphs": [
      "Размеры для завоза авто на площадку: длина веранды / колесной базы: 4 м. 5 см., Ширина дверного проема: 2м. 25 см. Высота дверного проема: 2м. 30см., максимальный вес автомобиля: 3 тонны. В случае нарушения установленных размеров и веса, Сторона 2 берет все риски по размещению автомобиля на террасе на себя.",
      "Сторона 2 вызывает подрядчика, предоставляющего эвакуатор типа «стрелка».",
      "Для установки автомобиля на площадке необходимо демонтировать заграждение, которое находится на террасе. Данная услуга оплачивается дополнительно. Стоимость – 20 000 р.",
      "Сторона 2 обязана не позднее, чем за 3 рабочих дня до старта мероприятия передать точное время начала монтажа и так же демонтажа автомобиля.",
      "Монтаж и демонтаж автомобиля в лофт осуществляется строго в присутствие технического специалиста и администратора площадки.",
      "Расположение автомобиля возможно только в Acryl Space.",
      "Допустимое количество автомобилей на площадке – 2 автомобиля, вес каждого автомобиля не должен превышать 3 тонн.",
      "Любые загрязнения (масляные пятна, бензин) Сторона 2 устраняет своими силами либо силами клининга лофта за дополнительную стоимость. Стоимость определяется индивидуально в зависимости от степени и количества загрязнений."
    ]
  }
]);

const ruleParagraph = (data, paragraph) => {
  if (paragraph === "Дата брони закрепляется за Стороной 2 после внесения 50% предоплаты.") {
    return contractRequiresFullPayment(data)
      ? "Дата брони закрепляется за Стороной 2 после внесения 100% оплаты в срок, установленный Договором."
      : "Дата брони закрепляется за Стороной 2 после внесения первого платежа 50% в срок, установленный Договором.";
  }
  if (paragraph === "Если бронирование осуществляется менее чем за 14 календарных дней до мероприятия, вносится 100% предоплата.") {
    return contractRequiresFullPayment(data)
      ? "Порядок и срок внесения 100% оплаты определяются Договором."
      : "Если до начала Мероприятия остаётся менее 14 календарных дней, порядок оплаты определяется Договором и не может предусматривать платёж после начала Мероприятия.";
  }
  return paragraph;
};

const renderRules = (data) => `<div class="doc-rules-flow">
  <p class="doc-right"><strong>Приложение № 6</strong><br>к Договору № ${html(data.contractNumber)} от ${html(formatDateLong(data.contractDate))}</p>
  <p class="doc-kicker">ПРАВИЛА СУБАРЕНДЫ ПОМЕЩЕНИЯ ПРИ ПРОВЕДЕНИИ МЕРОПРИЯТИЯ</p>
  ${EVENT_RULES.map((section) => `<h4>${html(section.title)}</h4>${section.paragraphs.map((paragraph) => `<p>${html(ruleParagraph(data, paragraph))}</p>`).join("")}`).join("")}
</div>`;

const renderContract = (data) => {
  const rentTotals = totalsFor(data.rentAmount);
  const contractTotals = rentTotals;
  const firstPercent = Math.min(100, Math.max(0, data.firstPaymentPercent));
  const firstPayment = contractTotals.net * firstPercent / 100;
  const finalPayment = contractTotals.net - firstPayment;
  const contractSignedTooLate = contractRequiresFullPayment(data) && firstPercent !== 100;
  const inventoryA = [
    "стойка регистрации — 1 шт.", "фуршетный стол-трансформер в стиле LOFT — 5 шт.", "светильник белый — 2 шт.",
    "стул-кресло уличное чёрное Vondom — 3 шт.", "софа уличная чёрная Vondom — 1 шт.", "стол журнальный чёрный Vondom — 1 шт.",
    "кашпо с цветами чёрное Vondom — 5 шт.", "стулья-гамаки уличные — 4 шт.", "чёрные круглые столы Vondom — 3 шт.",
    "стулья AFRICA ARMCHAIR 58×53×75 BLACK — 2 шт.", "стулья DELTA CHAIR with arms BLACK — 7 шт.", "стол большой белый Vondom — 1 шт.",
    "стул низкий белый Vondom — 8 шт.", "стул высокий барный белый Vondom — 4 шт.", "кресло белое Vondom — 3 шт.",
    "кашпо белое — 2 шт.", "стол FRAME MESA ALUM. 160×80×74 (на антресоли) — 1 шт.", "стулья FAZ ARMCHAIR STAINLESS 57×50×80 WHITE (на антресоли) — 4 шт."
  ];
  const inventoryB = [
    "коктейльный столик высокий TABLE DELTA 105h BLACK (в зоне кейтеринга) — 1 шт.",
    "барный стул AFRICA BAR STOOL 48×48×95 BLACK (в зоне кейтеринга) — 2 шт.",
    "барный стул FAZ STOOL 50×51×111 BLACK — 4 шт.", "дизайнерские коктейльные столы — 6 шт.",
    "Moon TV — плазменная панель — 1 шт.", "гримёрный стол — 1 шт.", "гримёрное зеркало — 1 шт.",
    "белые офисные столы на колёсах — 6 шт.", "офисные кресла белые — 7 шт.", "неоновая надпись MARS — 1 шт.",
    "белый стол IKEA на антресоли — 3 шт.", "столы чёрные с решёткой — 3 шт.", "сантехническое оборудование в санузлах",
    "пожаростойкие шторы ASLEY — 40 шт.", "дизайнерская фигурка «Слоник» — 1 шт.",
    "шестистворчатая ширма белая — 1 шт.", "трёхстворчатая ширма чёрная — 1 шт.", "картины — 3 шт.",
    "пледы — 7 шт.", "ароматизатор помещения — 1 шт.", "зарядный модуль «Бери заряд» — 1 шт.",
    "зарядный модуль «Изи-пауэр» — 1 шт.", "арт-объект «Альвеола»", "светильник уличный «Буква А» — 1 шт.",
    "уличный указатель — 1 шт."
  ];
  const inventoryList = (items, extraClass = "") => `<ul class="doc-list${extraClass ? ` ${extraClass}` : ""}">${items.map((item) => `<li>${html(item)}</li>`).join("")}</ul>`;

  return `
    <div class="doc-contract-flow">
      <p class="doc-kicker">ДОГОВОР СУБАРЕНДЫ НЕЖИЛОГО ПОМЕЩЕНИЯ № ${html(data.contractNumber)}</p>
      <div class="doc-meta"><span>г. Москва</span><span>${html(formatDateLong(data.contractDate))}</span></div>
      <p>${providerIntro()}, далее — «Сторона 1», с одной стороны, и ${html(data.party.intro)}, далее — «Сторона 2», с другой стороны, совместно именуемые «Стороны», заключили настоящий договор о нижеследующем.</p>

      <h3>1. Предмет договора</h3>
      <p>1.1. Сторона 1 обязуется передать Стороне 2 за плату во временное пользование пространство «АРХИЛОФТ»: внутренние помещения LaserSpace и AcrylSpace общей площадью 425,04 кв. м и террасу площадью 83 кв. м, расположенные по адресу: г. Москва, Сколковское шоссе, д. 31, стр. 4, вместе с находящимся в них движимым имуществом (далее — «Помещение») для проведения мероприятия следующего назначения: ${html(data.eventPurpose)} (далее — «Мероприятие»).</p>
      <p>1.2. Границы Помещения отмечены на копии поэтажного плана, а состав имущества и технические параметры указаны в Приложении № 1.</p>
      <p>1.3. Передача и возврат Помещения оформляются актами по формам Приложений № 4 и № 5. Право собственности на Помещение и имущество к Стороне 2 не переходит.</p>
      <p>1.4. Право Стороны 1 передавать Помещение в субаренду подтверждается договором аренды недвижимого имущества № 23 от 1 февраля 2025 года, заключённым с ООО «СКОЛКОВО ИНВЕСТ».</p>

      <h3>2. Срок аренды и порядок пользования Помещением</h3>
      <p>2.1. Срок аренды, включая монтаж и демонтаж: с ${html(formatDateTime(data.eventStart))} до ${html(formatDateTime(data.eventEnd))}. Общая продолжительность — ${formatInteger(data.durationHours)} ч.</p>
      <p>2.2. Сторона 2, предварительно письменно согласовав продление со Стороной 1, вправе продлить срок аренды из расчёта ${formatMoney(data.overtimeRate)} руб. за каждый начатый дополнительный час.</p>
      <p>2.3. Сторона 1 предоставляет Стороне 2, её работникам, подрядчикам и гостям доступ в Помещение в согласованный период. Сторона 2 заранее передаёт списки и сведения, необходимые для допуска. Сторона 1 не отвечает за проникновение посторонних лиц, если оно не вызвано виновными действиями или бездействием Стороны 1.</p>
      <p>2.4. По письменному согласованию Сторон Сторона 1 за дополнительную плату вправе привлечь для охраны Мероприятия частную охранную организацию, имеющую действующую лицензию на осуществление охранной деятельности. Сторона 1 самостоятельно охранную деятельность не осуществляет.</p>

      <h3>3. Обязанности Стороны 1</h3>
      <p>3.1. Передать Помещение и указанное в Приложении № 1 имущество по акту в пригодном для согласованного использования состоянии.</p>
      <p>3.2. Обеспечить исправность внутренних инженерных систем, кроме перебоев, возникших не по вине Стороны 1, включая плановые отключения городских служб.</p>
      <p>3.3. При аварии, возникшей не по вине Стороны 2, незамедлительно принять необходимые меры по её устранению.</p>
      <p>3.4. Оказывать в период действия Договора консультационную, информационную и организационную помощь для эффективного и безопасного использования Помещения. Техническое оснащение и услуги предоставляются только по отдельному письменному дополнительному соглашению Сторон.</p>

      <h3>4. Обязанности Стороны 2</h3>
      <p>4.1. Принять от Стороны 1 Помещение и движимое имущество по акту передачи на условиях Договора и Приложения № 4.</p>
      <p>4.2. Возвратить Стороне 1 Помещение и движимое имущество по акту возврата на условиях Договора и Приложения № 5.</p>
      <p>4.3. Пользоваться Помещением строго в соответствии с условиями Договора и только для цели, указанной в п. 1.1.</p>
      <p>4.4. Оплатить стоимость субаренды, иные согласованные услуги и страховой депозит в размере, порядке и сроки, предусмотренные Договором.</p>
      <p>4.5. Соблюдать Правила субаренды Помещения при проведении Мероприятия, приведённые в Приложении № 6, и обеспечить их соблюдение своими работниками, подрядчиками, посетителями и гостями.</p>
      <p>4.6. Самостоятельно обеспечить соблюдение интеллектуальных прав при использовании на Мероприятии текстовых, фото-, видео-, музыкальных и иных материалов и урегулировать связанные с ними требования третьих лиц.</p>
      <p>4.7. Не позднее чем за 7 календарных дней до Мероприятия передать Стороне 1 сведения о количестве гостей и персонала, подрядчиках, техническом задании, спецификации и энергопотреблении оборудования.</p>
      <p>4.8. Обеспечить соблюдение применимых требований пожарной безопасности. Не загромождать проходы, проезды, пути эвакуации и пожарные выходы; не перекрывать доступ к средствам пожаротушения; не курить вне специально отведённых мест; не использовать пиротехнику и открытый огонь, кроме прямо предусмотренных Договором и предварительно письменно согласованных исключений.</p>
      <p>4.9. Обеспечить безопасную эксплуатацию электроустановок, проводки и электрических соединений, соблюдение требований техники безопасности и производственной санитарии. Любое подключение к электрической сети и использование дополнительной мощности выполняются только после согласования и под контролем специалиста Стороны 1.</p>
      <p>4.10. Возместить ущерб Помещению, имуществу Стороны 1 и третьих лиц, причинённый Стороной 2, её работниками, гостями или подрядчиками. Повреждения фиксируются двусторонним актом, а при отказе или уклонении Стороны 2 — односторонним актом комиссии Стороны 1 не менее чем из двух лиц с фотофиксацией. Размер ущерба подтверждается документами подрядчиков либо независимого специалиста; по согласованию Сторон Сторона 2 вправе устранить повреждение своими силами.</p>
      <p>4.11. Освободить Помещение от собственного оборудования, декораций, мебели и мусора и подписать акт возврата не позднее ${html(formatDateTime(data.eventEnd))}. При просрочке уплачивается ${formatMoney(data.overtimeRate)} руб. за каждый начатый дополнительный час. Если Сторона 2 уклоняется от подписания акта, Сторона 1 вправе оформить возврат актом комиссии не менее чем из двух лиц с фотофиксацией.</p>
      <p>4.12. Самостоятельно отвечать за несчастные случаи со своими представителями, подрядчиками, работниками, посетителями и гостями, если они не вызваны виновными действиями Стороны 1, и возместить документально подтверждённые расходы Стороны 1, возникшие из-за нарушения Стороной 2 Договора или обязательных требований.</p>
      <p>4.13. Обеспечить соблюдение санитарно-эпидемиологических требований всеми лицами, допущенными Стороной 2 в Помещение.</p>
      <p>4.14. При выполнении монтажных, декоративных, подвесных, световых, электротехнических и иных работ самостоятельно обеспечить безопасность, охрану труда, допуск обученного персонала, наличие необходимых разрешений и полную ответственность за причинённый такими работами вред. Сторона 1 вправе остановить работы при нарушении требований безопасности.</p>
      <p>4.15. Не использовать Помещение для целей, отличных от указанных в п. 1.1.</p>
      <p>4.16. Поддерживать надлежащее санитарное состояние Помещения до его возврата, обеспечить вывоз крупногабаритного мусора и мусора подрядчиков. При невыполнении этой обязанности Сторона 1 вправе организовать уборку и вывоз за счёт Стороны 2.</p>
      <p>4.17. Если Помещение приведено в аварийное или непригодное состояние вследствие действий или бездействия Стороны 2, восстановить его своими силами и за свой счёт либо возместить Стороне 1 документально подтверждённые расходы на восстановление.</p>
      <p>4.18. Не передавать Помещение полностью или частично в субаренду и не предоставлять его третьим лицам для самостоятельного использования без письменного согласия Стороны 1.</p>
      <p>4.19. Соблюдать применимые требования природоохранного законодательства и правила обращения с отходами. Сторона 1 не отвечает за нарушения, допущенные Стороной 2 или привлечёнными ею лицами.</p>
      <p>4.20. Своими силами, с привлечением третьих лиц либо путём заказа отдельной услуги у Стороны 1 обеспечить безопасность всех лиц, находящихся на Мероприятии.</p>
      <p>4.21. Обеспечить охрану Помещения на период Мероприятия своими силами, с привлечением третьих лиц либо путём заказа отдельной услуги у Стороны 1.</p>
      <p>4.22. Если присутствие сотрудников Стороны 1 в Помещении во время Мероприятия недопустимо, заранее письменно уведомить об этом Сторону 1. При отсутствии такого уведомления сотрудники Стороны 1 вправе проходить через Помещение по служебной необходимости в рабочие дни с 10:00 до 19:00, не вмешиваясь в ход Мероприятия.</p>

      <h3>5. Стоимость и порядок расчётов</h3>
      <p>5.1. Стоимость субаренды составляет ${html(serviceTotalWording(rentTotals))}</p>
      <p>5.2. Техническое оборудование и услуги в стоимость субаренды не входят. Их состав, стоимость и порядок оплаты определяются отдельным дополнительным соглашением.</p>
      ${contractSignedTooLate ? `<p>5.3. Поскольку Договор подписывается позднее чем за 14 календарных дней до начала Мероприятия, 100% стоимости — ${formatMoney(contractTotals.net)} руб. — уплачивается в течение 3 календарных дней с даты подписания, но в любом случае до начала Мероприятия.</p>` : firstPercent === 100 ? `<p>5.3. 100% стоимости — ${formatMoney(contractTotals.net)} руб. — вносится не позднее ${html(formatDateLong(data.firstPaymentDate))}, то есть в течение 3 календарных дней с даты подписания Договора, но в любом случае до начала Мероприятия.</p>` : `<p>5.3. Оплата производится двумя платежами.</p><p>5.3.1. Первый платёж 50% — ${formatMoney(firstPayment)} руб. — вносится не позднее ${html(formatDateLong(data.firstPaymentDate))}, в течение 3 календарных дней с даты подписания Договора.</p><p>5.3.2. Оставшиеся 50% — ${formatMoney(finalPayment)} руб. — вносятся не позднее ${html(formatDateLong(data.finalPaymentDate))}, за 14 календарных дней до начала Мероприятия.</p>`}
      <p>5.4. Все расчёты производятся в рублях. Обязательство по оплате считается исполненным в день зачисления средств на расчётный счёт Стороны 1.</p>
      <p>5.5. Страховой депозит составляет ${formatMoney(data.depositAmount)} руб. и вносится не позднее ${html(formatDateLong(data.depositPaymentDate))}. Депозит не является оплатой субаренды или услуг.</p>
      <p>5.6. Из депозита могут быть удержаны документально подтверждённые суммы ущерба, дополнительной уборки, вывоза имущества и иные расходы, возникшие вследствие нарушения Стороной 2 Договора. Если подтверждённые суммы превышают депозит, разница оплачивается Стороной 2 в течение 3 рабочих дней с даты получения требования и подтверждающих документов.</p>
      <p>5.7. Неиспользованный остаток депозита возвращается в течение 3 рабочих дней после возврата Помещения, завершения уборки и подписания акта либо оформления акта комиссией в предусмотренном Договором случае.</p>
      <p>5.8. При нарушении срока оплаты или внесения депозита Сторона 1 вправе полностью или частично ограничить доступ в Помещение и приостановить исполнение обязательств до поступления полной суммы.</p>

      <h3>6. Отказ от Договора и перенос Мероприятия</h3>
      ${cancellationTerms(data)}

      <h3>7. Ответственность и обстоятельства непреодолимой силы</h3>
      <p>7.1. За нарушение денежных обязательств виновная Сторона уплачивает неустойку 0,1% от просроченной суммы за каждый день просрочки, но не более 10% такой суммы.</p>
      <p>7.2. Сторона 2 возмещает стоимость утраченного или повреждённого имущества, а также документально подтверждённые расходы на восстановление. Стоимость определяется по соглашению, а при споре — независимым специалистом.</p>
      <p>7.3. Сторона 1 не является организатором, партнёром, спонсором или участником Мероприятия, если иное прямо не согласовано письменно; не принимает участия в его содержании и не выражает согласия или одобрения высказываниям, акциям и действиям организаторов, участников и гостей, включая противоправные либо противоречащие общепринятым нормам морали. За содержание, законность и последствия Мероприятия отвечает Сторона 2. При явном нарушении закона, общественного порядка или требований безопасности Сторона 1 вправе потребовать прекращения соответствующих действий и приостановить Мероприятие.</p>
      <p>7.4. В остальной части ответственность Сторон определяется Договором и применимым законодательством.</p>
      <p>7.5. Стороны освобождаются от ответственности за неисполнение обязательств вследствие чрезвычайных и непредотвратимых обстоятельств, включая стихийные бедствия, военные действия, акты органов власти и иные обстоятельства, которые Сторона не могла разумно предотвратить.</p>
      <p>7.6. Сторона, для которой возникли такие обстоятельства, незамедлительно уведомляет другую Сторону и предоставляет подтверждающие документы при их наличии.</p>

      <h3>8. Акты и электронный документооборот</h3>
      <p>8.1. ${data.party.type === "company" ? "Передача и возврат Помещения оформляются отдельными актами. Сторона 1 вправе направить Стороне 2 УПД; при отсутствии подписанного УПД или мотивированных замечаний в течение 5 календарных дней УПД считается согласованным, если Сторона 1 располагает подтверждениями исполнения." : "Передача и возврат Помещения оформляются отдельными актами. Исполнение обязательств подтверждается подписанными Сторонами документами; отсутствие ответа или возражений Стороны 2 само по себе не означает автоматическую приёмку."}</p>
      <p>8.2. ${data.party.type === "company" ? "Договор, дополнительные соглашения, приложения, УПД, акты и иные связанные с исполнением документы могут оформляться и подписываться через систему электронного документооборота (ЭДО) с использованием электронной подписи уполномоченного лица. Документы, подписанные и переданные через ЭДО, признаются равнозначными бумажным оригиналам, подписанным собственноручно. До начала обмена через ЭДО либо наряду с ним Стороны вправе обмениваться подписанными скан-копиями по согласованным электронной почте, номеру телефона или мессенджеру." : "Договор, приложения и иные документы могут оформляться на бумаге либо путём обмена подписанными скан-копиями по согласованным электронной почте, номеру телефона или мессенджеру. Уведомления допускаются по электронной почте, SMS и в мессенджерах."} Изменение существенных условий действительно только в подписанном Сторонами документе.</p>

      <h3>9. Споры, конфиденциальность, срок действия и заключительные условия</h3>
      <p>9.1. Споры разрешаются переговорами и в претензионном порядке, срок ответа — 14 календарных дней. ${data.party.type === "company" ? "Неурегулированный спор передаётся в Арбитражный суд города Москвы." : "Неурегулированный спор передаётся в суд по правилам подсудности, установленным законом."}</p>
      <p>9.2. Условия Договора и полученная при его исполнении непубличная информация являются конфиденциальными. Раскрытие допускается для исполнения Договора, по закону, государственным органам и лицам, которым информация необходима для исполнения.</p>
      <p>9.3. Обрабатываются только необходимые персональные данные; Сторона 1 принимает предусмотренные законом правовые, организационные и технические меры их защиты.</p>
      <p>9.4. Стороны сообщают друг другу об изменении реквизитов и контактных данных по согласованным каналам связи.</p>
      <p>9.5. Договор вступает в силу с момента подписания Сторонами и действует до полного исполнения ими обязательств.</p>
      <p>9.6. ${data.party.type === "company" ? "Договор составлен в двух бумажных экземплярах равной юридической силы либо в виде электронного документа, подписанного Сторонами через ЭДО. Права и обязанности переходят к правопреемникам Сторон." : "Договор составлен в двух бумажных экземплярах равной юридической силы, по одному для каждой Стороны."}</p>
      <p>9.7. Приложения: № 1 «План и описание Помещения, его технических параметров и имущества»; № 2 «Параметры Мероприятия и стоимость субаренды»; № 3 «Схема и порядок проезда»; № 4 «Форма акта передачи Помещения»; № 5 «Форма акта возврата Помещения»; № 6 «Правила субаренды Помещения при проведении Мероприятия».</p>

      <h3>10. Реквизиты и подписи Сторон</h3>
      ${signatureBlocks(data.party)}
    </div>

    <div class="doc-floor-plan-flow">
      <p class="doc-right"><strong>Приложение № 1</strong><br>к Договору № ${html(data.contractNumber)} от ${html(formatDateLong(data.contractDate))}</p>
      <p class="doc-kicker">ПЛАН И ОПИСАНИЕ ПОМЕЩЕНИЯ</p>
      <img class="floor-plan" src="./assets/floor-plan.png" alt="Поэтажный план ArchiLoft с экспликацией помещений">
      <p>1. Передаются внутренние помещения LaserSpace и AcrylSpace общей площадью 425,04 кв. м и терраса площадью 83 кв. м, расположенные по адресу: г. Москва, Сколковское шоссе, д. 31, стр. 4.</p>
      <p>2. Допустимая нагрузка на перекрытия: AcrylSpace — 750 кг/м², LaserSpace — 500 кг/м², терраса и антресоль — 500 кг/м². Сторона 2 не вправе размещать предметы в положении, количестве или весе, превышающих допустимую нагрузку либо способных повредить Помещение.</p>
      <p>3. Выделенная электрическая мощность — 80 кВт. Точки подключения: 32А 380В 5 pin 3P+PE+N — 2 шт.; 63А 380В 5 pin 3P+PE+N — 1 шт.; уличная силовая розетка 32А 380В 5 pin 3P+PE+N; дополнительное силовое подключение в кухонной зоне — 32А.</p>
      <p>4. Максимальная допустимая нагрузка на один из 13 предустановленных анкеров — 100 кг.</p>
      <p>5. Открытый огонь запрещён. Исключение составляют свечи в торт и холодные фонтаны высотой до 20 см, допускаемые после предварительного письменного согласования со Стороной 1. Гриль или барбекю, иные холодные фонтаны, бенгальские огни и фаер-шоу допускаются только на специально отведённой прилегающей территории и после такого согласования.</p>
      <p>6. Для завоза автомобиля: длина веранды / колёсной базы — 4,05 м, ширина дверного проёма — 2,25 м, высота — 2,30 м, максимальная масса автомобиля — 3 т. Размещение допускается только после согласования схемы монтажа; риск нарушения согласованных габаритов и массы несёт Сторона 2.</p>
      <p>7. Движимое имущество:</p>
      ${inventoryList([...inventoryA, ...inventoryB], "inventory-columns")}
      <p>8. Состояние и фактическое количество имущества проверяются при передаче. Расхождения фиксируются в акте и имеют приоритет перед настоящим перечнем.</p>
    </div>

    <section class="doc-page">
      <p class="doc-right"><strong>Приложение № 2</strong><br>к Договору № ${html(data.contractNumber)} от ${html(formatDateLong(data.contractDate))}</p>
      <p class="doc-kicker">ПАРАМЕТРЫ МЕРОПРИЯТИЯ И СТОИМОСТЬ СУБАРЕНДЫ</p>
      <table class="doc-table"><tbody>
        <tr><th>Период аренды</th><td>${html(formatDateTime(data.eventStart))} — ${html(formatDateTime(data.eventEnd))}</td></tr>
        <tr><th>Продолжительность</th><td>${formatInteger(data.durationHours)} ч.</td></tr>
        <tr><th>Количество гостей</th><td>${formatInteger(data.guestCount)}</td></tr>
        <tr><th>Пространства</th><td>LaserSpace и AcrylSpace — 425,04 кв. м; терраса — 83 кв. м</td></tr>
        <tr><th>Назначение</th><td>${html(data.eventPurpose)}</td></tr>
        <tr><th>Субаренда</th><td>${html(serviceTotalWording(rentTotals))}</td></tr>
        <tr><th>Страховой депозит</th><td>${formatMoney(data.depositAmount)} руб., возвратный</td></tr>
      </tbody></table>
      <p><strong>Итого по Договору: ${formatMoney(contractTotals.net)} руб.</strong> НДС 5% уплачивается дополнительно сверх указанной суммы.</p>
      <p>В стоимость субаренды входят пользование внутренними помещениями LaserSpace и AcrylSpace общей площадью 425,04 кв. м, террасой площадью 83 кв. м и указанным в Приложении № 1 имуществом; парковка на прилегающей территории вместимостью до 6–7 автомобилей; базовый клининг до, во время и после Мероприятия; работа администратора площадки и технического менеджера в части эксплуатации Помещения; помощь персонала площадки при расстановке мебели лофта во время монтажа и демонтажа.</p>
      <p>Техническое оснащение и услуги в указанную сумму не входят и оформляются отдельным дополнительным соглашением.</p>
      <p>${contractSignedTooLate ? `Оплата 100%: ${formatMoney(contractTotals.net)} руб. в течение 3 календарных дней с даты подписания, но до начала Мероприятия.` : firstPercent === 100 ? `Оплата 100%: ${formatMoney(contractTotals.net)} руб. до ${html(formatDateLong(data.firstPaymentDate))}, но до начала Мероприятия.` : `Первый платёж 50%: ${formatMoney(firstPayment)} руб. до ${html(formatDateLong(data.firstPaymentDate))}. Остаток 50%: ${formatMoney(finalPayment)} руб. до ${html(formatDateLong(data.finalPaymentDate))}.`} НДС 5% уплачивается дополнительно сверх каждого указанного платежа. Депозит: ${formatMoney(data.depositAmount)} руб. не позднее начала Мероприятия.</p>
      ${signatureBlocks(data.party)}
      <p class="page-label">Страница 5</p>
    </section>

    ${renderRouteAppendix(data, "Страница 6")}

    ${renderTransferAct(data, { sample: true, pageLabel: "Страница 7" })}

    ${renderReturnAct(data, { sample: true, pageLabel: "Страница 8" })}

    ${renderRules(data)}`;
};

const renderAddendum = (data) => {
  const technicalTotals = totalsFor(serviceSubtotal());
  const firstPercent = Math.min(100, Math.max(0, data.addendumPaymentPercent));
  const firstPayment = technicalTotals.net * firstPercent / 100;
  const finalPayment = technicalTotals.net - firstPayment;
  const addendumSignedTooLate = data.addendumFinalPaymentDate && data.documentDate && data.addendumFinalPaymentDate < new Date(`${data.documentDate}T12:00:00`);
  const numberText = data.addendumNumber ? ` № ${html(data.addendumNumber)}` : "";
  return `<div class="doc-addendum-flow">
    <p class="doc-kicker">ДОПОЛНИТЕЛЬНОЕ СОГЛАШЕНИЕ${numberText}</p>
    <p class="doc-subtitle">о техническом обеспечении мероприятия<br>к Договору субаренды нежилого помещения № ${html(data.contractNumber)} от ${html(formatDateLong(data.contractDate))}</p>
    <div class="doc-meta"><span>г. Москва</span><span>${html(formatDateLong(data.documentDate))}</span></div>
    <p>${providerIntro()}, далее — «Сторона 1», с одной стороны, и ${html(data.party.intro)}, далее — «Сторона 2», с другой стороны, совместно именуемые «Стороны», заключили настоящее дополнительное соглашение к Договору о нижеследующем.</p>

    <h3>1. Техническое обеспечение</h3>
    <p>1.1. Сторона 1 предоставляет Стороне 2 техническое оборудование и оказывает услуги для мероприятия следующего назначения: ${html(data.eventPurpose)}, проводимого в помещениях LaserSpace и AcrylSpace и на террасе по адресу: г. Москва, Сколковское шоссе, д. 31, стр. 4, в период с ${html(formatDateTime(data.technicalStart))} до ${html(formatDateTime(data.technicalEnd))}.</p>
    <p>1.2. Состав и стоимость технического обеспечения:</p>
    <table class="doc-table"><thead><tr><th>№</th><th>Оборудование и услуги</th><th>Кол-во</th><th>Ед.</th><th>Цена, руб.</th><th>Сумма, руб.</th></tr></thead><tbody>${serviceRowsHtml()}</tbody></table>
    <p>1.3. Стоимость технического обеспечения составляет <strong>${formatMoney(technicalTotals.net)} руб.</strong> (${html(amountInWords(technicalTotals.net))}). НДС 5% уплачивается дополнительно сверх указанной суммы. Стоимость оплачивается отдельно от арендной платы по Договору.</p>
    <p>1.4. Право собственности на предоставленное оборудование к Стороне 2 не переходит.</p>
    <p>1.5. Сторона 1 вправе привлекать третьих лиц, оставаясь ответственной перед Стороной 2 за надлежащее исполнение согласованных обязательств.</p>

    <h3>2. Порядок оплаты</h3>
    ${addendumSignedTooLate ? `<p>2.1. Поскольку настоящее соглашение подписывается позднее чем за 14 календарных дней до начала технических работ, 100% общей стоимости — ${formatMoney(technicalTotals.net)} руб. — уплачивается в течение 3 календарных дней с даты подписания, но в любом случае до начала оказания услуг.</p>` : firstPercent === 100 ? `<p>2.1. 100% общей стоимости — ${formatMoney(technicalTotals.net)} руб. — уплачивается не позднее ${html(formatDateLong(data.addendumFirstPaymentDate))}, то есть в течение 3 календарных дней с даты подписания настоящего соглашения, но до начала оказания услуг.</p>` : `<p>2.1. Первый платёж 50% — ${formatMoney(firstPayment)} руб. — вносится не позднее ${html(formatDateLong(data.addendumFirstPaymentDate))}, в течение 3 календарных дней с даты подписания настоящего соглашения.</p><p>2.2. Оставшиеся 50% — ${formatMoney(finalPayment)} руб. — вносятся не позднее ${html(formatDateLong(data.addendumFinalPaymentDate))}, за 14 календарных дней до начала технических работ.</p>`}
    <p>2.3. Обязательство по оплате считается исполненным в день зачисления средств на расчётный счёт Стороны 1.</p>

    <h3>3. Передача оборудования</h3>
    <p>3.1. Фактическая передача оборудования до начала использования оформляется отдельным актом с указанием наименования, количества, комплектности, состояния и замечаний.</p>
    <p>3.2. Возврат оборудования после завершения Мероприятия оформляется отдельным актом. В акты передачи и возврата включается только оборудование; оказанные услуги в них не перечисляются.</p>
    <p>3.3. Акты передачи и возврата оборудования подписываются уполномоченными представителями Сторон и подтверждают соответственно передачу и возврат оборудования.</p>

    <h3>4. Прочие условия</h3>
    <p>4.1. Настоящее дополнительное соглашение является неотъемлемой частью Договора. В части технического обеспечения его условия имеют приоритет. Остальные условия Договора сохраняют силу.</p>
    <p>4.2. Изменение состава, количества и (или) стоимости оборудования и услуг допускается только путём заключения дополнительного соглашения к Договору, подписанного обеими Сторонами. Замена оборудования на эквивалент допускается только с письменного согласия Стороны 2.</p>
    <p>4.3. К отказу Стороны 2 от услуг применяются согласованные в основном Договоре правила отмены Мероприятия; двойное взыскание за одно нарушение не допускается.</p>
    <div class="addendum-closing">
      <p>4.4. ${data.party.type === "company" ? "Дополнительное соглашение составлено в двух бумажных экземплярах равной юридической силы либо в виде электронного документа, подписанного Сторонами через ЭДО." : "Дополнительное соглашение составлено в двух бумажных экземплярах равной юридической силы, по одному для каждой Стороны."}</p>
      <h3>5. Реквизиты и подписи Сторон</h3>
      ${signatureBlocks(data.party)}
    </div>
  </div>`;
};

const createAddendumPage = () => {
  const page = document.createElement("section");
  page.className = "doc-page doc-addendum has-page-signoff doc-pagination-probe";
  page.innerHTML = '<div class="doc-letterhead"><img src="./assets/archiloft-logo.jpeg" width="3860" height="939" alt="ArchiLoft — футуристичный арт-особняк"></div>';
  $("paper").append(page);
  return page;
};

const addendumPageOverflows = (page) => page.scrollHeight > page.clientHeight + 1;
const addendumContentBlocks = (page) => [...page.children].filter((child) => !child.classList.contains("doc-letterhead"));

const paginateAddendum = () => {
  const source = $("paper").querySelector(":scope > .doc-addendum-flow");
  if (!source) return 0;
  const blocks = [...source.children];
  source.remove();
  let page = createAddendumPage();

  const startNextPage = () => {
    page = createAddendumPage();
    return page;
  };

  const appendTable = (table) => {
    const rows = [...(table.tBodies[0]?.rows || [])];
    const createTableShell = () => {
      const shell = table.cloneNode(false);
      if (table.tHead) shell.append(table.tHead.cloneNode(true));
      const body = document.createElement("tbody");
      shell.append(body);
      return { shell, body };
    };

    let { shell, body } = createTableShell();
    page.append(shell);
    if (addendumPageOverflows(page) && addendumContentBlocks(page).length > 1) {
      shell.remove();
      startNextPage();
      ({ shell, body } = createTableShell());
      page.append(shell);
    }

    rows.forEach((row) => {
      body.append(row);
      if (!addendumPageOverflows(page)) return;
      row.remove();
      if (!body.rows.length) {
        body.append(row);
        return;
      }
      startNextPage();
      ({ shell, body } = createTableShell());
      page.append(shell);
      body.append(row);
    });
  };

  blocks.forEach((block) => {
    if (block.tagName === "TABLE") {
      appendTable(block);
      return;
    }
    page.append(block);
    if (!addendumPageOverflows(page)) return;
    block.remove();
    let carriedHeading = null;
    const previous = addendumContentBlocks(page).at(-1);
    if (previous?.matches("h2, h3, h4")) {
      carriedHeading = previous;
      carriedHeading.remove();
    }
    if (!addendumContentBlocks(page).length) {
      if (carriedHeading) page.append(carriedHeading);
      page.append(block);
      return;
    }
    startNextPage();
    if (carriedHeading) page.append(carriedHeading);
    page.append(block);
  });

  const pages = [...$("paper").querySelectorAll(":scope > .doc-addendum")];
  pages.forEach((item) => item.classList.remove("doc-pagination-probe"));
  return pages.length;
};

const createContractPage = (referenceNode) => {
  const page = document.createElement("section");
  page.className = "doc-page doc-contract has-page-signoff doc-pagination-probe";
  page.innerHTML = '<div class="doc-letterhead"><img src="./assets/archiloft-logo.jpeg" width="3860" height="939" alt="ArchiLoft — футуристичный арт-особняк"></div>';
  $("paper").insertBefore(page, referenceNode || null);
  return page;
};

const contractContentBlocks = (page) => [...page.children].filter((child) => !child.classList.contains("doc-letterhead"));

const paginateContract = () => {
  const source = $("paper").querySelector(":scope > .doc-contract-flow");
  if (!source) return 0;
  const blocks = [...source.children];
  const referenceNode = source.nextElementSibling;
  source.remove();
  let page = createContractPage(referenceNode);

  blocks.forEach((block) => {
    page.append(block);
    if (page.scrollHeight <= page.clientHeight + 1) return;
    block.remove();
    let carriedHeading = null;
    const previous = contractContentBlocks(page).at(-1);
    if (previous?.matches("h2, h3, h4")) {
      carriedHeading = previous;
      carriedHeading.remove();
    }
    if (!contractContentBlocks(page).length) {
      if (carriedHeading) page.append(carriedHeading);
      page.append(block);
      return;
    }
    page = createContractPage(referenceNode);
    if (carriedHeading) page.append(carriedHeading);
    page.append(block);
  });

  const pages = [...$("paper").querySelectorAll(":scope > .doc-contract")];
  pages.forEach((item) => item.classList.remove("doc-pagination-probe"));
  return pages.length;
};

const createFloorPlanPage = (referenceNode) => {
  const page = document.createElement("section");
  page.className = "doc-page doc-floor-plan has-page-signoff doc-pagination-probe";
  page.innerHTML = '<div class="doc-letterhead"><img src="./assets/archiloft-logo.jpeg" width="3860" height="939" alt="ArchiLoft — футуристичный арт-особняк"></div>';
  $("paper").insertBefore(page, referenceNode || null);
  return page;
};

const floorPlanContentBlocks = (page) => [...page.children].filter((child) => !child.classList.contains("doc-letterhead"));
const floorPlanPageOverflows = (page) => page.scrollHeight > page.clientHeight + 1;

const paginateFloorPlan = () => {
  const source = $("paper").querySelector(":scope > .doc-floor-plan-flow");
  if (!source) return 0;
  const blocks = [...source.children];
  const referenceNode = source.nextElementSibling;
  source.remove();
  let page = createFloorPlanPage(referenceNode);

  const startNextPage = () => {
    page = createFloorPlanPage(referenceNode);
    return page;
  };

  const appendList = (list) => {
    const items = [...list.children];
    let shell = list.cloneNode(false);
    page.append(shell);

    items.forEach((item) => {
      shell.append(item);
      if (!floorPlanPageOverflows(page)) return;
      item.remove();
      if (!shell.children.length) shell.remove();
      startNextPage();
      shell = list.cloneNode(false);
      page.append(shell);
      shell.append(item);
    });
  };

  blocks.forEach((block) => {
    if (block.matches("ul, ol")) {
      appendList(block);
      return;
    }
    page.append(block);
    if (!floorPlanPageOverflows(page)) return;
    block.remove();
    if (!floorPlanContentBlocks(page).length) {
      page.append(block);
      return;
    }
    startNextPage();
    page.append(block);
  });

  const pages = [...$("paper").querySelectorAll(":scope > .doc-floor-plan")];
  pages.forEach((item) => item.classList.remove("doc-pagination-probe"));
  return pages.length;
};

const createRulesPage = () => {
  const page = document.createElement("section");
  page.className = "doc-page doc-rules has-page-signoff doc-pagination-probe";
  page.innerHTML = '<div class="doc-letterhead"><img src="./assets/archiloft-logo.jpeg" width="3860" height="939" alt="ArchiLoft — футуристичный арт-особняк"></div>';
  $("paper").append(page);
  return page;
};

const rulesContentBlocks = (page) => [...page.children].filter((child) => !child.classList.contains("doc-letterhead"));

const paginateRules = () => {
  const source = $("paper").querySelector(":scope > .doc-rules-flow");
  if (!source) return 0;
  const blocks = [...source.children];
  source.remove();
  let page = createRulesPage();

  blocks.forEach((block) => {
    page.append(block);
    if (page.scrollHeight <= page.clientHeight + 1) return;
    block.remove();
    let carriedHeading = null;
    const previous = rulesContentBlocks(page).at(-1);
    if (previous?.matches("h2, h3, h4")) {
      carriedHeading = previous;
      carriedHeading.remove();
    }
    if (!rulesContentBlocks(page).length) {
      if (carriedHeading) page.append(carriedHeading);
      page.append(block);
      return;
    }
    page = createRulesPage();
    if (carriedHeading) page.append(carriedHeading);
    page.append(block);
  });

  const pages = [...$("paper").querySelectorAll(":scope > .doc-rules")];
  pages.forEach((item) => item.classList.remove("doc-pagination-probe"));
  return pages.length;
};

const getData = () => {
  const eventStart = dateValue("eventStart");
  const eventEnd = dateValue("eventEnd");
  const technicalStart = dateValue("technicalStart") || eventStart;
  const technicalEnd = dateValue("technicalEnd") || eventEnd;
  const base = {
    contractNumber: textValue("contractNumber") || "НЕ ЗАПОЛНЕНО",
    addendumNumber: textValue("addendumNumber"),
    contractDate: $("contractDate").value,
    documentDate: $("documentDate").value,
    eventStart,
    eventEnd,
    technicalStart,
    technicalEnd,
    durationHours: hoursBetween(eventStart, eventEnd),
    guestCount: numberValue("guestCount"),
    eventPurpose: textValue("eventPurpose") || "частное мероприятие",
    spaces: [...FIXED_SPACES],
    party: currentParty(),
    rentAmount: numberValue("rentAmount"),
    depositAmount: numberValue("depositAmount"),
    firstPaymentPercent: numberValue("firstPaymentPercent"),
    firstPaymentDays: numberValue("firstPaymentDays"),
    finalPaymentDaysBefore: numberValue("finalPaymentDaysBefore"),
    depositDaysBefore: numberValue("depositDaysBefore"),
    addendumPaymentPercent: numberValue("addendumPaymentPercent"),
    addendumPaymentDays: numberValue("addendumPaymentDays"),
    addendumFinalDaysBefore: numberValue("addendumFinalDaysBefore"),
    overtimeRate: numberValue("overtimeRate"),
  };
  return { ...base, ...paymentDatesFor(base) };
};

const recordId = (prefix) => `${prefix}-${globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`}`;
const compactServices = () => services.map(({ kind, name, qty, unit, price }) => ({ kind, name, qty, unit, price }));
const snapshotPartyName = (snapshot) => {
  const fields = snapshot?.fields || {};
  return snapshot?.partyType === "company" ? fields.companyName?.trim() : fields.personName?.trim();
};
const localDateFieldValue = (date = new Date()) => {
  const pad = (value) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};
const captureWorkspaceSnapshot = () => ({
  partyType: selectedPartyType(),
  fields: Object.fromEntries(FORM_FIELD_IDS.map((id) => [id, $(id).value])),
  services: compactServices(),
});

const readWorkspaceStorage = () => {
  let raw = null;
  try {
    raw = localStorage.getItem(STORAGE_KEY);
  } catch (_) {
    storageEnabled = false;
    return { version: 1, draft: null, currentContractId: null, contracts: [] };
  }
  if (!raw) return { version: 1, draft: null, currentContractId: null, contracts: [] };
  try {
    const saved = JSON.parse(raw);
    return {
      version: 1,
      draft: saved?.draft && typeof saved.draft === "object" ? saved.draft : null,
      currentContractId: typeof saved?.currentContractId === "string" ? saved.currentContractId : null,
      contracts: Array.isArray(saved?.contracts) ? saved.contracts.slice(0, 200) : [],
    };
  } catch (_) {
    return { version: 1, draft: null, currentContractId: null, contracts: [] };
  }
};

const writeWorkspaceStorage = () => {
  if (!storageEnabled) return false;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(storageState));
    return true;
  } catch (_) {
    storageEnabled = false;
    return false;
  }
};

const setCacheStatus = (message, saving = false) => {
  const status = $("cacheStatus");
  status.textContent = message;
  status.classList.toggle("is-saving", saving);
};

const contractRecordParts = (record) => {
  const snapshot = record.snapshot || {};
  const number = snapshot.fields?.contractNumber?.trim() || "без номера";
  const party = snapshotPartyName(snapshot) || "контрагент не указан";
  const start = snapshot.fields?.eventStart;
  const event = start && !Number.isNaN(new Date(start).getTime()) ? new Date(start).toLocaleDateString("ru-RU") : "дата не указана";
  return { number, party, event };
};
const contractRecordLabel = (record) => {
  const { number, party, event } = contractRecordParts(record);
  return `№ ${number} · ${party} · ${event}`;
};

const renderStorageControls = () => {
  const contracts = storageState.contracts.slice().sort((a, b) => String(b.updatedAt).localeCompare(String(a.updatedAt)));
  $("contractCount").textContent = `${contracts.length} / 200`;
  $("savedContractSelect").innerHTML = `<option value="">Текущий черновик</option>${contracts.map((record) => `<option value="${html(record.id)}">${html(contractRecordLabel(record))}</option>`).join("")}`;
  $("savedContractSelect").value = currentContractId || "";
  $("deleteContract").disabled = !currentContractId;
  $("contractSidebarList").innerHTML = contracts.length ? contracts.map((record) => {
    const { number, party, event } = contractRecordParts(record);
    return `<button type="button" class="contract-nav-item${record.id === currentContractId ? " active" : ""}" data-contract-id="${html(record.id)}"${record.id === currentContractId ? ' aria-current="page"' : ""}><strong>Договор № ${html(number)}</strong><span>${html(party)}</span><small>Мероприятие: ${html(event)}</small></button>`;
  }).join("") : '<div class="contract-nav-empty">Сохранённых договоров пока нет. Заполните карточку и нажмите «Сохранить договор».</div>';

};

const applyWorkspaceSnapshot = (snapshot, { contractId = null, render = true } = {}) => {
  restoringStorage = true;
  const fields = snapshot?.fields || {};
  FORM_FIELD_IDS.forEach((id) => {
    const value = Object.prototype.hasOwnProperty.call(fields, id) ? fields[id] ?? "" : DEFAULT_FIELD_VALUES[id];
    $(id).value = id === "eventPurpose" && value === "частного мероприятия" ? "частное мероприятие" : value;
  });
  const partyType = snapshot?.partyType === "company" ? "company" : "person";
  q(`input[name="partyType"][value="${partyType}"]`).checked = true;
  services = Array.isArray(snapshot?.services) ? snapshot.services.map((item, index) => ({
    id: `saved-${Date.now()}-${index}`,
    kind: item?.kind === "service" ? "service" : "equipment",
    name: String(item?.name || ""),
    qty: Number(item?.qty || 0),
    unit: String(item?.unit || "усл."),
    price: Number(item?.price || 0),
  })) : [];
  currentContractId = contractId;
  storageState.currentContractId = contractId;
  restoringStorage = false;
  if (render) {
    togglePartyFields();
    renderServiceRows();
    activateDocument("contract");
    renderStorageControls();
  }
};

const persistWorkspaceDraft = () => {
  if (restoringStorage) return;
  const snapshot = captureWorkspaceSnapshot();
  storageState.draft = snapshot;
  storageState.currentContractId = currentContractId;
  if (currentContractId) {
    const record = storageState.contracts.find((item) => item.id === currentContractId);
    if (record) {
      record.snapshot = snapshot;
      record.updatedAt = new Date().toISOString();
    }
  }
  const saved = writeWorkspaceStorage();
  renderStorageControls();
  setCacheStatus(saved ? (currentContractId ? "Договор и черновик сохранены" : "Черновик сохранён в этом браузере") : "Автосохранение недоступно", !saved);
};

const scheduleWorkspaceSave = () => {
  if (restoringStorage) return;
  clearTimeout(storageSaveTimer);
  setCacheStatus("Сохраняю изменения…", true);
  storageSaveTimer = setTimeout(() => {
    storageSaveTimer = null;
    persistWorkspaceDraft();
  }, 260);
};

const flushWorkspaceDraft = () => {
  if (!storageSaveTimer) return;
  clearTimeout(storageSaveTimer);
  storageSaveTimer = null;
  persistWorkspaceDraft();
};

const saveCurrentContract = ({ silent = false } = {}) => {
  clearTimeout(storageSaveTimer);
  storageSaveTimer = null;
  const snapshot = captureWorkspaceSnapshot();
  const now = new Date().toISOString();
  const id = currentContractId || recordId("contract");
  const existing = storageState.contracts.find((record) => record.id === id);
  const record = { id, createdAt: existing?.createdAt || now, updatedAt: now, snapshot };
  storageState.contracts = [record, ...storageState.contracts.filter((item) => item.id !== id)].slice(0, 200);
  storageState.draft = snapshot;
  storageState.currentContractId = id;
  currentContractId = id;
  writeWorkspaceStorage();
  renderStorageControls();
  if (!silent) setCacheStatus("Договор сохранён в реестре");
  return record;
};

const startNewContract = () => {
  flushWorkspaceDraft();
  const currentSnapshot = captureWorkspaceSnapshot();
  if (!currentContractId && currentSnapshot.fields.contractNumber?.trim() && snapshotPartyName(currentSnapshot)) saveCurrentContract({ silent: true });
  const today = localDateFieldValue();
  const snapshot = {
    partyType: "person",
    fields: {
      ...DEFAULT_FIELD_VALUES,
      contractNumber: "",
      addendumNumber: "",
      contractDate: today,
      documentDate: today,
      eventStart: "",
      eventEnd: "",
      technicalStart: "",
      technicalEnd: "",
    },
    services: [],
  };
  [...PARTY_FIELD_IDS.person, ...PARTY_FIELD_IDS.company].forEach((id) => { snapshot.fields[id] = ""; });
  applyWorkspaceSnapshot(snapshot, { contractId: null });
  storageState.draft = captureWorkspaceSnapshot();
  writeWorkspaceStorage();
  setCacheStatus("Новый пустой договор создан");
  $("contractNumber").focus();
};

const initializeWorkspaceStorage = () => {
  storageState = readWorkspaceStorage();
  const storedContractId = storageState.contracts.some((record) => record.id === storageState.currentContractId) ? storageState.currentContractId : null;
  if (storageState.draft) applyWorkspaceSnapshot(storageState.draft, { contractId: storedContractId, render: false });
  else if (storedContractId) {
    const storedRecord = storageState.contracts.find((record) => record.id === storedContractId);
    applyWorkspaceSnapshot(storedRecord.snapshot, { contractId: storedContractId, render: false });
  }
  else {
    const fields = {
      ...DEFAULT_FIELD_VALUES,
      contractNumber: "",
      addendumNumber: "",
      contractDate: localDateFieldValue(),
      documentDate: localDateFieldValue(),
      eventStart: "",
      eventEnd: "",
      technicalStart: "",
      technicalEnd: "",
    };
    [...PARTY_FIELD_IDS.person, ...PARTY_FIELD_IDS.company].forEach((id) => { fields[id] = ""; });
    applyWorkspaceSnapshot({ partyType: "person", fields, services: [] }, { contractId: null, render: false });
  }
  renderStorageControls();
  setCacheStatus(storageEnabled ? (storageState.draft ? "Черновик восстановлен из этого браузера" : "Черновик сохраняется автоматически") : "Автосохранение недоступно", !storageEnabled);
};

const validate = (data) => {
  const issues = [];
  const add = (type, text) => issues.push({ type, text });
  if (!textValue("contractNumber")) add("error", "Укажите номер договора.");
  if (!data.contractDate) add("error", "Укажите дату договора.");
  if (activeDocument === "addendum" && !data.documentDate) add("error", "Укажите дату дополнительного соглашения.");
  if (!data.eventStart || !data.eventEnd) add("error", "Укажите начало и окончание мероприятия.");
  if (data.eventStart && data.eventEnd && data.eventEnd <= data.eventStart) add("error", "Окончание мероприятия должно быть позже начала.");
  if (["addendum", "techTransfer", "techReturn"].includes(activeDocument) && (!data.technicalStart || !data.technicalEnd)) add("error", "Укажите начало и окончание технических работ.");
  if (data.technicalStart && data.technicalEnd && data.technicalEnd <= data.technicalStart) add("error", "Окончание технических работ должно быть позже начала.");
  if (data.party.type === "person") {
    const required = [
      ["personName", "ФИО"], ["passport", "серию и номер паспорта"], ["birthDate", "дату рождения"],
      ["passportIssuer", "кем выдан паспорт"], ["passportDate", "дату выдачи"],
      ["passportCode", "код подразделения"], ["personAddress", "адрес регистрации"],
    ];
    const missing = required.filter(([id]) => !textValue(id)).map(([, label]) => label);
    if (missing.length) add("error", `Физическое лицо: заполните ${missing.join(", ")}.`);
    if (!textValue("personPhone") && !textValue("personEmail")) add("error", "Физическое лицо: укажите телефон или электронную почту.");
  } else {
    const required = [
      ["companyName", "полное наименование"], ["companyInn", "ИНН"], ["companyKpp", "КПП"],
      ["companyOgrn", "ОГРН"], ["companyAddress", "юридический адрес"], ["companyBank", "банк"],
      ["companyAccount", "расчётный счёт"], ["companyCorrespondent", "корреспондентский счёт"],
      ["companyBik", "БИК"], ["companySigner", "подписанта"],
      ["companySignerRole", "должность подписанта"], ["companySignerBasis", "основание полномочий"],
    ];
    const missing = required.filter(([id]) => !textValue(id)).map(([, label]) => label);
    if (missing.length) add("error", `Юридическое лицо: заполните ${missing.join(", ")}.`);
    if (!textValue("companyPhone") && !textValue("companyEmail")) add("error", "Юридическое лицо: укажите телефон или электронную почту.");
  }
  if (activeDocument === "addendum" && !services.length) add("error", "Добавьте хотя бы одну позицию технического оснащения в дополнительное соглашение.");
  if (activeDocument === "addendum" && services.some((item) => !item.name.trim() || Number(item.qty) <= 0 || Number(item.price) < 0)) add("error", "Проверьте наименование, количество и цену во всех строках дополнительного соглашения.");
  if (activeDocument === "addendum" && data.documentDate && data.contractDate && new Date(data.documentDate) < new Date(data.contractDate)) add("warning", "Дата дополнительного соглашения раньше даты договора.");
  const contractSigningDate = data.contractDate ? new Date(`${data.contractDate}T00:00:00`) : null;
  if (contractSigningDate && data.eventStart && data.eventStart <= contractSigningDate) add("error", "Начало мероприятия должно быть позже даты подписания договора.");
  if (contractRequiresFullPayment(data) && Number(data.firstPaymentPercent) !== 100) add("warning", "Договор подписывается позднее чем за 14 дней до мероприятия: документ автоматически укажет оплату 100% в течение 3 дней с даты подписания, но до начала мероприятия.");
  if (data.firstPaymentDate && data.eventStart && data.firstPaymentDate >= data.eventStart) add("warning", "Три календарных дня истекают после начала мероприятия: документ требует оплатить 100% до начала мероприятия.");
  if (!contractRequiresFullPayment(data) && data.finalPaymentDate && data.firstPaymentDate && data.finalPaymentDate < data.firstPaymentDate) add("warning", "Остаток по расчёту требуется раньше первого платежа. Скорректируйте сроки или процент оплаты.");
  if (data.depositPaymentDate && data.contractDate && data.depositPaymentDate < new Date(`${data.contractDate}T00:00:00`)) add("warning", "Расчётная дата депозита раньше подписания договора.");
  if (data.firstPaymentPercent < 0 || data.firstPaymentPercent > 100) add("error", "Первый платёж должен быть от 0% до 100%.");
  if (activeDocument === "addendum" && data.addendumFinalPaymentDate && data.documentDate && data.addendumFinalPaymentDate < new Date(`${data.documentDate}T00:00:00`)) add("warning", "Допсоглашение подписывается поздно: документ автоматически укажет 100% оплаты в течение 3 дней, но до начала услуг.");
  if (activeDocument === "addendum" && data.addendumFirstPaymentDate && data.technicalStart && data.addendumFirstPaymentDate >= data.technicalStart) add("warning", "Оплата должна поступить до начала технических работ; это условие автоматически включено в допсоглашение.");
  if (activeDocument === "addendum" && (data.addendumPaymentPercent < 0 || data.addendumPaymentPercent > 100)) add("error", "Первый платёж по дополнительному соглашению должен быть от 0% до 100%.");
  const signingMoment = ({
    contract: data.contractDate,
    addendum: data.documentDate,
    transfer: data.eventStart,
    return: data.eventEnd,
    techTransfer: data.technicalStart,
    techReturn: data.technicalEnd,
  })[activeDocument];
  if (signingMoment) {
    const signingValue = signingMoment instanceof Date ? signingMoment : new Date(String(signingMoment).includes("T") ? signingMoment : `${signingMoment}T12:00:00`);
    const signingDate = dateOnly(signingValue);
    const authorityStart = new Date(`${PROVIDER.authorityDate}T00:00:00`);
    const authorityEnd = new Date(`${PROVIDER.authorityValidThrough}T23:59:59`);
    if (signingDate < authorityStart || signingDate > authorityEnd) {
      add("warning", `Доверенность № ${PROVIDER.authorityNumber} действует с ${formatDateLong(authorityStart)} по ${formatDateLong(authorityEnd)} включительно. Дата выбранного документа выходит за этот срок — перед подписанием нужно заменить доверенность или подписанта.`);
    }
  }
  if (numberValue("vatRate") > 0 && $("vatMode").value === "onTop") add("ok", `НДС ${numberValue("vatRate")}% будет рассчитан отдельно для договора аренды и дополнительного соглашения.`);
  if (!issues.length) add("ok", "Все обязательные поля заполнены, логических противоречий не найдено.");
  return issues;
};

const DOCX_MIME = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
const DOCX_ENCODER = new TextEncoder();

const xml = (value) => String(value ?? "")
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&apos;");

const normalizedWordText = (value) => String(value ?? "").replace(/\s+/g, " ");

const wordRunXml = (text, format = {}) => {
  if (!text) return "";
  const properties = [
    format.bold ? "<w:b/>" : "",
    format.italic ? "<w:i/>" : "",
    format.underline ? '<w:u w:val="single"/>' : "",
  ].join("");
  return `<w:r>${properties ? `<w:rPr>${properties}</w:rPr>` : ""}<w:t xml:space="preserve">${xml(text)}</w:t></w:r>`;
};

const wordInlineXml = (node, format = {}) => {
  if (node.nodeType === Node.TEXT_NODE) {
    const text = normalizedWordText(node.nodeValue);
    return text.trim() ? wordRunXml(text, format) : "";
  }
  if (node.nodeType !== Node.ELEMENT_NODE) return "";
  const tag = node.tagName.toLowerCase();
  if (tag === "br") return "<w:r><w:br/></w:r>";
  const next = {
    bold: format.bold || tag === "strong" || tag === "b",
    italic: format.italic || tag === "em" || tag === "i",
    underline: format.underline || tag === "u",
  };
  return [...node.childNodes].map((child) => wordInlineXml(child, next)).join("");
};

const wordParagraphXml = (element, options = {}) => {
  const tag = element.tagName?.toLowerCase() || "p";
  const classes = element.classList || { contains: () => false };
  let style = options.style || "Normal";
  if (classes.contains("doc-kicker")) style = "Title";
  else if (classes.contains("doc-subtitle")) style = "Subtitle";
  else if (classes.contains("act-watermark")) style = "Warning";
  else if (/^h[1-4]$/.test(tag)) style = tag === "h4" ? "Heading2" : "Heading1";
  else if (classes.contains("doc-small")) style = "Small";

  let alignment = options.alignment || "";
  if (classes.contains("doc-center") || classes.contains("doc-kicker") || classes.contains("doc-subtitle")) alignment = "center";
  if (classes.contains("doc-right")) alignment = "right";

  const paragraphProperties = [
    `<w:pStyle w:val="${style}"/>`,
    alignment ? `<w:jc w:val="${alignment}"/>` : "",
    options.keepNext || ["Title", "Subtitle", "Heading1", "Heading2"].includes(style) ? "<w:keepNext/>" : "",
    options.bottomBorder ? '<w:pBdr><w:bottom w:val="single" w:sz="4" w:space="1" w:color="777777"/></w:pBdr>' : "",
    options.minHeight ? `<w:spacing w:line="${options.minHeight}" w:lineRule="atLeast"/>` : "",
  ].join("");
  const runs = [...element.childNodes].map((child) => wordInlineXml(child, { bold: options.bold })).join("") || "<w:r><w:t></w:t></w:r>";
  return `<w:p><w:pPr>${paragraphProperties}</w:pPr>${runs}</w:p>`;
};

const wordCellXml = (contentXml, width, options = {}) => `<w:tc>
  <w:tcPr><w:tcW w:w="${width}" w:type="dxa"/><w:vAlign w:val="center"/>${options.shading ? `<w:shd w:val="clear" w:fill="${options.shading}"/>` : ""}</w:tcPr>
  ${contentXml || "<w:p/>"}
</w:tc>`;

const wordTableShellXml = (rowsXml, widths, bordered = true) => `<w:tbl>
  <w:tblPr><w:tblW w:w="0" w:type="auto"/><w:tblLayout w:type="fixed"/>${bordered ? '<w:tblBorders><w:top w:val="single" w:sz="4" w:color="A6A6A6"/><w:left w:val="single" w:sz="4" w:color="A6A6A6"/><w:bottom w:val="single" w:sz="4" w:color="A6A6A6"/><w:right w:val="single" w:sz="4" w:color="A6A6A6"/><w:insideH w:val="single" w:sz="4" w:color="D9D9D9"/><w:insideV w:val="single" w:sz="4" w:color="D9D9D9"/></w:tblBorders>' : '<w:tblBorders><w:top w:val="nil"/><w:left w:val="nil"/><w:bottom w:val="nil"/><w:right w:val="nil"/><w:insideH w:val="nil"/><w:insideV w:val="nil"/></w:tblBorders>'}<w:tblCellMar><w:top w:w="90" w:type="dxa"/><w:left w:w="100" w:type="dxa"/><w:bottom w:w="90" w:type="dxa"/><w:right w:w="100" w:type="dxa"/></w:tblCellMar></w:tblPr>
  <w:tblGrid>${widths.map((width) => `<w:gridCol w:w="${width}"/>`).join("")}</w:tblGrid>${rowsXml}
</w:tbl>`;

const wordHtmlTableXml = (table) => {
  const rows = [...table.rows];
  const columnCount = Math.max(1, ...rows.map((row) => row.cells.length));
  const widths = columnCount === 6 ? [450, 4300, 820, 760, 1780, 1780]
    : columnCount === 2 ? [3100, 6800]
      : Array.from({ length: columnCount }, () => Math.floor(9900 / columnCount));
  const rowsXml = rows.map((row) => {
    const isHeader = [...row.cells].some((cell) => cell.tagName.toLowerCase() === "th");
    const cells = [...row.cells].map((cell, index) => {
      const bold = isHeader || cell.tagName.toLowerCase() === "th";
      const alignment = cell.classList.contains("number") || (columnCount === 6 && index >= 2) ? "right" : "left";
      const content = wordParagraphXml(cell, { style: "TableText", bold, alignment });
      return wordCellXml(content, widths[index] || widths.at(-1), { shading: isHeader ? "E7EEF6" : "" });
    }).join("");
    return `<w:tr><w:trPr><w:cantSplit/>${isHeader ? "<w:tblHeader/>" : ""}</w:trPr>${cells}</w:tr>`;
  }).join("");
  return wordTableShellXml(rowsXml, widths, true);
};

const wordMetaXml = (element) => {
  const parts = [...element.children];
  const widths = [4950, 4950];
  const cells = parts.slice(0, 2).map((part, index) => wordCellXml(
    wordParagraphXml(part, { style: "Normal", alignment: index ? "right" : "left" }),
    widths[index],
  )).join("");
  return wordTableShellXml(`<w:tr>${cells}</w:tr>`, widths, false);
};

const wordSignaturesXml = (element) => {
  const boxes = [...element.querySelectorAll(":scope > .doc-signature-box")];
  const widths = [4950, 4950];
  const cells = boxes.slice(0, 2).map((box, index) => {
    const paragraphs = [...box.children].map((child) => wordParagraphXml(child, { style: "Small" })).join("");
    return wordCellXml(paragraphs, widths[index]);
  }).join("");
  return wordTableShellXml(`<w:tr><w:trPr><w:cantSplit/></w:trPr>${cells}</w:tr>`, widths, true);
};

const wordListItemParagraphXml = (element, item, index, style = "Normal") => {
  const proxy = document.createElement("p");
  proxy.append(document.createTextNode(element.tagName.toLowerCase() === "ol" ? `${index + 1}. ` : "• "));
  [...item.childNodes].forEach((child) => proxy.append(child.cloneNode(true)));
  return wordParagraphXml(proxy, { style });
};

const wordInventoryListXml = (element) => {
  const items = [...element.children];
  const splitAt = Math.ceil(items.length / 2);
  const rowsXml = Array.from({ length: splitAt }, (_, rowIndex) => {
    const left = items[rowIndex];
    const right = items[rowIndex + splitAt];
    const cells = [left, right].map((item, columnIndex) => wordCellXml(
      item ? wordListItemParagraphXml(element, item, rowIndex + columnIndex * splitAt, "Small") : "<w:p/>",
      4950,
    )).join("");
    return `<w:tr><w:trPr><w:cantSplit/></w:trPr>${cells}</w:tr>`;
  }).join("");
  return `<w:tbl><w:tblPr><w:tblW w:w="9900" w:type="dxa"/><w:tblLayout w:type="fixed"/><w:tblBorders><w:top w:val="nil"/><w:left w:val="nil"/><w:bottom w:val="nil"/><w:right w:val="nil"/><w:insideH w:val="nil"/><w:insideV w:val="nil"/></w:tblBorders><w:tblCellMar><w:top w:w="0" w:type="dxa"/><w:left w:w="80" w:type="dxa"/><w:bottom w:w="0" w:type="dxa"/><w:right w:w="80" w:type="dxa"/></w:tblCellMar></w:tblPr><w:tblGrid><w:gridCol w:w="4950"/><w:gridCol w:w="4950"/></w:tblGrid>${rowsXml}</w:tbl>`;
};

const wordListXml = (element) => element.classList.contains("inventory-columns")
  ? wordInventoryListXml(element)
  : [...element.children].map((item, index) => wordListItemParagraphXml(element, item, index)).join("");

const wordLinesXml = (element) => [...element.children].map((child) => child.classList.contains("doc-line")
  ? wordParagraphXml(child, { bottomBorder: true, minHeight: 300 })
  : wordParagraphXml(child, { style: "Normal" })).join("");

const wordRouteMapXml = () => {
  const width = 3429000;
  const height = 3683000;
  return `<w:p><w:pPr><w:jc w:val="center"/><w:spacing w:before="80" w:after="80"/></w:pPr><w:r><w:drawing><wp:inline distT="0" distB="0" distL="0" distR="0"><wp:extent cx="${width}" cy="${height}"/><wp:docPr id="2" name="Схема проезда ArchiLoft"/><a:graphic><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture"><pic:pic><pic:nvPicPr><pic:cNvPr id="2" name="Схема проезда ArchiLoft"/><pic:cNvPicPr/></pic:nvPicPr><pic:blipFill><a:blip r:embed="rId5"/><a:stretch><a:fillRect/></a:stretch></pic:blipFill><pic:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="${width}" cy="${height}"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></pic:spPr></pic:pic></a:graphicData></a:graphic></wp:inline></w:drawing></w:r></w:p>`;
};

const wordFloorPlanXml = () => {
  const width = 6000000;
  const height = 4148571;
  return `<w:p><w:pPr><w:jc w:val="center"/><w:spacing w:before="80" w:after="80"/></w:pPr><w:r><w:drawing><wp:inline distT="0" distB="0" distL="0" distR="0"><wp:extent cx="${width}" cy="${height}"/><wp:docPr id="3" name="Поэтажный план ArchiLoft"/><a:graphic><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture"><pic:pic><pic:nvPicPr><pic:cNvPr id="3" name="Поэтажный план ArchiLoft"/><pic:cNvPicPr/></pic:nvPicPr><pic:blipFill><a:blip r:embed="rId6"/><a:stretch><a:fillRect/></a:stretch></pic:blipFill><pic:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="${width}" cy="${height}"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></pic:spPr></pic:pic></a:graphicData></a:graphic></wp:inline></w:drawing></w:r></w:p>`;
};

const wordBlocksXml = (container) => [...container.children].map((child) => {
  const tag = child.tagName.toLowerCase();
  if (child.classList.contains("doc-letterhead")) return "";
  if (child.classList.contains("page-label")) return "";
  if (child.classList.contains("page-signoff")) return "";
  if (["p", "h1", "h2", "h3", "h4"].includes(tag)) return wordParagraphXml(child);
  if (tag === "table") return wordHtmlTableXml(child);
  if (tag === "ul" || tag === "ol") return wordListXml(child);
  if (child.classList.contains("doc-meta")) return wordMetaXml(child);
  if (child.classList.contains("doc-signatures")) return wordSignaturesXml(child);
  if (child.classList.contains("doc-lines")) return wordLinesXml(child);
  if (tag === "img") {
    if (child.classList.contains("route-map")) return wordRouteMapXml();
    if (child.classList.contains("floor-plan")) return wordFloorPlanXml();
    return "";
  }
  if (!child.children.length) return child.textContent.trim() ? wordParagraphXml(child, { style: "Normal" }) : "";
  return wordBlocksXml(child);
}).join("");

const docxDocumentXml = (includeFooter = false) => {
  const pages = [...$("paper").querySelectorAll(":scope > .doc-page")];
  const body = pages.map((page, index) => {
    const nextPage = pages[index + 1];
    const continuesContract = activeDocument === "contract" && (
      (page.classList.contains("doc-contract") && nextPage?.classList.contains("doc-contract")) ||
      (page.classList.contains("doc-floor-plan") && nextPage?.classList.contains("doc-floor-plan")) ||
      (page.classList.contains("doc-rules") && nextPage?.classList.contains("doc-rules"))
    );
    const continuesFlow = continuesContract || (activeDocument === "addendum" && page.classList.contains("doc-addendum") && nextPage?.classList.contains("doc-addendum"));
    const pageBreak = index < pages.length - 1 && !continuesFlow ? '<w:p><w:r><w:br w:type="page"/></w:r></w:p>' : "";
    return `${wordBlocksXml(page)}${pageBreak}`;
  }).join("");
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture"><w:body>${body}<w:sectPr><w:headerReference w:type="default" r:id="rId4"/>${includeFooter ? '<w:footerReference w:type="default" r:id="rId3"/>' : ""}<w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="2015" w:right="850" w:bottom="1252" w:left="1560" w:header="128" w:footer="372" w:gutter="0"/></w:sectPr></w:body></w:document>`;
};

const docxHeaderXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:hdr xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture"><w:p><w:pPr><w:jc w:val="center"/><w:spacing w:after="0"/></w:pPr><w:r><w:drawing><wp:inline distT="0" distB="0" distL="0" distR="0"><wp:extent cx="4925289" cy="1200150"/><wp:docPr id="1" name="ArchiLoft logo"/><a:graphic><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture"><pic:pic><pic:nvPicPr><pic:cNvPr id="0" name="ArchiLoft logo"/><pic:cNvPicPr/></pic:nvPicPr><pic:blipFill><a:blip r:embed="rId1"/><a:stretch><a:fillRect/></a:stretch></pic:blipFill><pic:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="4925289" cy="1200150"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></pic:spPr></pic:pic></a:graphicData></a:graphic></wp:inline></w:drawing></w:r></w:p></w:hdr>`;

const docxHeaderRelsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="media/archiloft-logo.jpeg"/></Relationships>`;

const footerRunXml = (text, { bold = false, size = 16 } = {}) => `<w:r><w:rPr>${bold ? "<w:b/>" : ""}<w:sz w:val="${size}"/><w:szCs w:val="${size}"/></w:rPr><w:t xml:space="preserve">${xml(text)}</w:t></w:r>`;
const footerParagraphXml = (content, alignment = "left", topBorder = false) => `<w:p><w:pPr><w:spacing w:before="0" w:after="0" w:line="190" w:lineRule="exact"/><w:jc w:val="${alignment}"/>${topBorder ? '<w:pBdr><w:top w:val="single" w:sz="4" w:space="2" w:color="808080"/></w:pBdr>' : ""}</w:pPr>${content}</w:p>`;
const footerCellXml = (content, width) => `<w:tc><w:tcPr><w:tcW w:w="${width}" w:type="dxa"/><w:vAlign w:val="center"/></w:tcPr>${content}</w:tc>`;
const footerTableXml = (cells, widths) => `<w:tbl><w:tblPr><w:tblW w:w="9900" w:type="dxa"/><w:tblLayout w:type="fixed"/><w:tblBorders><w:top w:val="nil"/><w:left w:val="nil"/><w:bottom w:val="nil"/><w:right w:val="nil"/><w:insideH w:val="nil"/><w:insideV w:val="nil"/></w:tblBorders><w:tblCellMar><w:top w:w="0" w:type="dxa"/><w:left w:w="40" w:type="dxa"/><w:bottom w:w="0" w:type="dxa"/><w:right w:w="40" w:type="dxa"/></w:tblCellMar></w:tblPr><w:tblGrid>${widths.map((width) => `<w:gridCol w:w="${width}"/>`).join("")}</w:tblGrid><w:tr>${cells}</w:tr></w:tbl>`;

const docxFooterXml = () => {
  const data = getData();
  const noteRow = footerTableXml([
    footerCellXml(footerParagraphXml(footerRunXml(""), "left"), 8200),
    footerCellXml(footerParagraphXml(`${footerRunXml("Страница ")}<w:fldSimple w:instr=" PAGE ">${footerRunXml("1")}</w:fldSimple>`, "right"), 1700),
  ], [8200, 1700]);
  const signatureRow = footerTableXml([
    footerCellXml(footerParagraphXml(`${footerRunXml("Сторона 2 ", { bold: true, size: 18 })}${footerRunXml(`____________ / ${data.party.signature} /`, { size: 18 })}`, "left", true), 4950),
    footerCellXml(footerParagraphXml(`${footerRunXml("Сторона 1 ", { bold: true, size: 18 })}${footerRunXml(`____________ / ${PROVIDER.signerShort} /`, { size: 18 })}`, "right", true), 4950),
  ], [4950, 4950]);
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:ftr xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">${noteRow}${signatureRow}</w:ftr>`;
};

const docxStylesXml = () => {
  const bodySize = activeDocument === "addendum" ? 22 : 20;
  const smallSize = activeDocument === "addendum" ? 20 : 18;
  const bodyLine = activeDocument === "addendum" ? 250 : 232;
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:eastAsia="Times New Roman" w:cs="Times New Roman"/><w:color w:val="000000"/><w:sz w:val="${bodySize}"/><w:szCs w:val="${bodySize}"/></w:rPr></w:rPrDefault><w:pPrDefault><w:pPr><w:spacing w:before="0" w:after="0" w:line="${bodyLine}" w:lineRule="auto"/><w:jc w:val="both"/></w:pPr></w:pPrDefault></w:docDefaults>
  <w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/><w:qFormat/><w:pPr><w:spacing w:before="0" w:after="0" w:line="${bodyLine}" w:lineRule="auto"/><w:jc w:val="both"/></w:pPr></w:style>
  <w:style w:type="paragraph" w:styleId="Title"><w:name w:val="Title"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:qFormat/><w:pPr><w:spacing w:before="0" w:after="80"/><w:jc w:val="center"/><w:keepNext/></w:pPr><w:rPr><w:b/><w:color w:val="000000"/><w:sz w:val="${bodySize}"/><w:szCs w:val="${bodySize}"/></w:rPr></w:style>
  <w:style w:type="paragraph" w:styleId="Subtitle"><w:name w:val="Subtitle"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:qFormat/><w:pPr><w:spacing w:after="80"/><w:jc w:val="center"/><w:keepNext/></w:pPr><w:rPr><w:color w:val="000000"/><w:sz w:val="${bodySize}"/><w:szCs w:val="${bodySize}"/></w:rPr></w:style>
  <w:style w:type="paragraph" w:styleId="Heading1"><w:name w:val="heading 1"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:qFormat/><w:pPr><w:spacing w:before="100" w:after="40"/><w:keepNext/><w:outlineLvl w:val="0"/></w:pPr><w:rPr><w:b/><w:color w:val="000000"/><w:sz w:val="${bodySize}"/><w:szCs w:val="${bodySize}"/></w:rPr></w:style>
  <w:style w:type="paragraph" w:styleId="Heading2"><w:name w:val="heading 2"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:qFormat/><w:pPr><w:spacing w:before="80" w:after="30"/><w:keepNext/><w:outlineLvl w:val="1"/></w:pPr><w:rPr><w:b/><w:color w:val="000000"/><w:sz w:val="${bodySize}"/><w:szCs w:val="${bodySize}"/></w:rPr></w:style>
  <w:style w:type="paragraph" w:styleId="Small"><w:name w:val="Small"/><w:basedOn w:val="Normal"/><w:pPr><w:spacing w:after="0" w:line="220" w:lineRule="auto"/></w:pPr><w:rPr><w:sz w:val="${smallSize}"/><w:szCs w:val="${smallSize}"/></w:rPr></w:style>
  <w:style w:type="paragraph" w:styleId="TableText"><w:name w:val="Table Text"/><w:basedOn w:val="Normal"/><w:pPr><w:spacing w:after="0" w:line="220" w:lineRule="auto"/></w:pPr><w:rPr><w:sz w:val="${smallSize}"/><w:szCs w:val="${smallSize}"/></w:rPr></w:style>
  <w:style w:type="paragraph" w:styleId="Warning"><w:name w:val="Warning"/><w:basedOn w:val="Normal"/><w:pPr><w:spacing w:before="80" w:after="120"/><w:jc w:val="center"/><w:keepNext/></w:pPr><w:rPr><w:b/><w:color w:val="9B1C1C"/><w:sz w:val="32"/><w:szCs w:val="32"/></w:rPr></w:style>
</w:styles>`;
};

const docxContentTypesXml = (includeFooter = false) => `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Default Extension="jpeg" ContentType="image/jpeg"/><Default Extension="png" ContentType="image/png"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/><Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/><Override PartName="/word/settings.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.settings+xml"/><Override PartName="/word/header1.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.header+xml"/>${includeFooter ? '<Override PartName="/word/footer1.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml"/>' : ""}<Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/><Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/></Types>`;

const docxRootRelsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/><Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/></Relationships>`;

const docxDocumentRelsXml = (includeFooter = false) => `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/settings" Target="settings.xml"/>${includeFooter ? '<Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/footer" Target="footer1.xml"/>' : ""}<Relationship Id="rId4" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/header" Target="header1.xml"/><Relationship Id="rId5" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="media/route-map.jpeg"/><Relationship Id="rId6" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="media/floor-plan.png"/></Relationships>`;
const docxSettingsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:settings xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:zoom w:percent="100"/><w:defaultTabStop w:val="720"/><w:characterSpacingControl w:val="doNotCompress"/></w:settings>`;
const docxAppXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes"><Application>ArchiDocs</Application><AppVersion>1.0</AppVersion></Properties>`;

const docxCrcTable = (() => {
  const table = new Uint32Array(256);
  for (let index = 0; index < 256; index += 1) {
    let value = index;
    for (let bit = 0; bit < 8; bit += 1) value = (value & 1) ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
    table[index] = value >>> 0;
  }
  return table;
})();

const docxCrc32 = (bytes) => {
  let crc = 0xffffffff;
  for (const byte of bytes) crc = docxCrcTable[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
};

const docxU16 = (value) => new Uint8Array([value & 0xff, (value >>> 8) & 0xff]);
const docxU32 = (value) => new Uint8Array([value & 0xff, (value >>> 8) & 0xff, (value >>> 16) & 0xff, (value >>> 24) & 0xff]);
const docxBytes = (value) => value instanceof Uint8Array ? value : DOCX_ENCODER.encode(String(value));
const docxConcat = (chunks) => {
  const output = new Uint8Array(chunks.reduce((sum, chunk) => sum + chunk.length, 0));
  let offset = 0;
  for (const chunk of chunks) { output.set(chunk, offset); offset += chunk.length; }
  return output;
};

const docxZip = (entries) => {
  const localParts = [];
  const centralParts = [];
  let offset = 0;
  const now = new Date();
  const dosTime = (now.getHours() << 11) | (now.getMinutes() << 5) | Math.floor(now.getSeconds() / 2);
  const dosDate = ((Math.max(1980, now.getFullYear()) - 1980) << 9) | ((now.getMonth() + 1) << 5) | now.getDate();

  for (const [name, content] of entries) {
    const nameBytes = DOCX_ENCODER.encode(name);
    const data = docxBytes(content);
    const crc = docxCrc32(data);
    const local = docxConcat([
      docxU32(0x04034b50), docxU16(20), docxU16(0x0800), docxU16(0), docxU16(dosTime), docxU16(dosDate),
      docxU32(crc), docxU32(data.length), docxU32(data.length), docxU16(nameBytes.length), docxU16(0), nameBytes, data,
    ]);
    localParts.push(local);
    centralParts.push(docxConcat([
      docxU32(0x02014b50), docxU16(20), docxU16(20), docxU16(0x0800), docxU16(0), docxU16(dosTime), docxU16(dosDate),
      docxU32(crc), docxU32(data.length), docxU32(data.length), docxU16(nameBytes.length), docxU16(0), docxU16(0),
      docxU16(0), docxU16(0), docxU32(0), docxU32(offset), nameBytes,
    ]));
    offset += local.length;
  }
  const central = docxConcat(centralParts);
  const end = docxConcat([
    docxU32(0x06054b50), docxU16(0), docxU16(0), docxU16(entries.length), docxU16(entries.length),
    docxU32(central.length), docxU32(offset), docxU16(0),
  ]);
  return docxConcat([...localParts, central, end]);
};

const createWordBlob = (title, logoBytes, routeMapBytes, floorPlanBytes) => {
  const created = new Date().toISOString();
  const includeFooter = usesPageSignoffs();
  const core = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dcmitype="http://purl.org/dc/dcmitype/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><dc:title>${xml(title)}</dc:title><dc:creator>ArchiDocs</dc:creator><cp:lastModifiedBy>ArchiDocs</cp:lastModifiedBy><dcterms:created xsi:type="dcterms:W3CDTF">${created}</dcterms:created><dcterms:modified xsi:type="dcterms:W3CDTF">${created}</dcterms:modified></cp:coreProperties>`;
  const entries = [
    ["[Content_Types].xml", docxContentTypesXml(includeFooter)],
    ["_rels/.rels", docxRootRelsXml],
    ["docProps/core.xml", core],
    ["docProps/app.xml", docxAppXml],
    ["word/document.xml", docxDocumentXml(includeFooter)],
    ["word/styles.xml", docxStylesXml()],
    ["word/settings.xml", docxSettingsXml],
    ["word/_rels/document.xml.rels", docxDocumentRelsXml(includeFooter)],
    ["word/header1.xml", docxHeaderXml],
    ["word/_rels/header1.xml.rels", docxHeaderRelsXml],
    ["word/media/archiloft-logo.jpeg", logoBytes],
    ["word/media/route-map.jpeg", routeMapBytes],
    ["word/media/floor-plan.png", floorPlanBytes],
  ];
  if (includeFooter) entries.push(["word/footer1.xml", docxFooterXml()]);
  const archive = docxZip(entries);
  return new Blob([archive], { type: DOCX_MIME });
};

const downloadActiveWord = async () => {
  const data = getData();
  const documents = {
    contract: { label: "Договор", title: `Договор субаренды нежилого помещения № ${data.contractNumber}` },
    addendum: { label: "Допсоглашение", title: `Дополнительное соглашение к договору № ${data.contractNumber}` },
    transfer: { label: "Акт_передачи", title: `Акт приёма-передачи по договору № ${data.contractNumber}` },
    return: { label: "Акт_возврата", title: `Акт возврата по договору № ${data.contractNumber}` },
    techTransfer: { label: "Акт_передачи_техники", title: `Акт передачи технического оборудования к договору № ${data.contractNumber}` },
    techReturn: { label: "Акт_возврата_техники", title: `Акт возврата технического оборудования к договору № ${data.contractNumber}` },
  };
  const { label, title } = documents[activeDocument] || documents.contract;
  const safeNumber = data.contractNumber.replace(/[\\/:*?"<>|]+/g, "-");
  const button = $("wordButton");
  const original = button.textContent;
  button.disabled = true;
  button.textContent = "Готовим Word…";
  let logoBytes;
  let routeMapBytes;
  let floorPlanBytes;
  try {
    const [logoResponse, routeMapResponse, floorPlanResponse] = await Promise.all([
      fetch("./assets/archiloft-logo.jpeg"),
      fetch("./assets/route-map.jpg"),
      fetch("./assets/floor-plan.png"),
    ]);
    if (!logoResponse.ok || !routeMapResponse.ok || !floorPlanResponse.ok) throw new Error("Графика не загрузилась");
    logoBytes = new Uint8Array(await logoResponse.arrayBuffer());
    routeMapBytes = new Uint8Array(await routeMapResponse.arrayBuffer());
    floorPlanBytes = new Uint8Array(await floorPlanResponse.arrayBuffer());
  } catch (_) {
    button.disabled = false;
    button.textContent = "Ошибка графики";
    setTimeout(() => { button.textContent = original; renderPreview(); }, 1800);
    return;
  }
  const url = URL.createObjectURL(createWordBlob(title, logoBytes, routeMapBytes, floorPlanBytes));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `${label}_${safeNumber}.docx`;
  anchor.className = "word-download-link";
  anchor.hidden = true;
  document.body.append(anchor);
  anchor.click();
  setTimeout(() => { anchor.remove(); URL.revokeObjectURL(url); }, 30000);
  button.disabled = false;
  button.textContent = "Word скачан";
  setTimeout(() => { button.textContent = original; }, 1600);
};

const renderValidation = (issues) => {
  const count = issues.filter((item) => item.type !== "ok").length;
  $("validationCount").textContent = `${count} ${declension(count, ["замечание", "замечания", "замечаний"])}`;
  $("validationList").innerHTML = issues.map((item) => `<li class="${item.type}">${html(item.text)}</li>`).join("");
  const hasErrors = issues.some((item) => item.type === "error");
  $("printButton").disabled = hasErrors;
  $("wordButton").disabled = hasErrors;
  $("printButton").title = hasErrors ? "Сначала исправьте обязательные поля" : "Открыть системное окно печати";
  $("wordButton").title = hasErrors ? "Сначала исправьте обязательные поля" : "Скачать выбранный документ в формате DOCX";
};

const normalizePartyTerms = (markup) => {
  const replacements = [
    ["Арендодателем", "Стороной 1"], ["Субарендатором", "Стороной 2"],
    ["Арендодателю", "Стороне 1"], ["Субарендатору", "Стороне 2"],
    ["Арендодателя", "Стороны 1"], ["Субарендатора", "Стороны 2"],
    ["Арендодатель", "Сторона 1"], ["Субарендатор", "Сторона 2"],
  ];
  return replacements.reduce((result, [from, to]) => result.replaceAll(from, to), markup);
};

const renderPreview = () => {
  const data = getData();
  const serviceTotals = totalsFor(serviceSubtotal());
  const issues = validate(data);
  renderValidation(issues);
  const automaticFullPayment = contractRequiresFullPayment(data) && Number(data.firstPaymentPercent) !== 100;
  $("firstPaymentDatePreview").textContent = automaticFullPayment ? "в течение 3 дней, но до начала мероприятия" : formatDateLong(data.firstPaymentDate);
  $("finalPaymentDatePreview").textContent = automaticFullPayment ? "не применяется — автоматически 100%" : formatDateLong(data.finalPaymentDate);
  $("depositDatePreview").textContent = formatDateLong(data.depositPaymentDate);
  $("addendumFirstPaymentDatePreview").textContent = formatDateLong(data.addendumFirstPaymentDate);
  $("addendumFinalPaymentDatePreview").textContent = formatDateLong(data.addendumFinalPaymentDate);
  const summaries = {
    contract: `только аренда ${formatMoney(totalsFor(data.rentAmount).net)} ₽ + НДС 5% · мероприятие ${formatInteger(data.durationHours)} ч.`,
    addendum: `${services.length} ${declension(services.length, ["позиция", "позиции", "позиций"])} · техническое оснащение ${formatMoney(serviceTotals.net)} ₽ + НДС 5%`,
    transfer: `1 страница · подписываемый акт передачи · ${formatDateLong(data.eventStart)}`,
    return: `1 страница · подписываемый акт возврата · ${formatDateLong(data.eventEnd)}`,
    techTransfer: `1 страница · акт передачи оборудования · ${formatDateLong(data.technicalStart)}`,
    techReturn: `1 страница · акт возврата оборудования · ${formatDateLong(data.technicalEnd)}`,
  };
  const renderers = {
    contract: renderContract,
    addendum: renderAddendum,
    transfer: renderTransferAct,
    return: renderReturnAct,
    techTransfer: renderTechTransferAct,
    techReturn: renderTechReturnAct,
  };
  $("previewSummary").textContent = summaries[activeDocument] || summaries.contract;
  $("paper").innerHTML = normalizePartyTerms((renderers[activeDocument] || renderContract)(data));
  const addendumPages = activeDocument === "addendum" ? paginateAddendum() : 0;
  if (activeDocument === "contract") {
    paginateContract();
    paginateFloorPlan();
    paginateRules();
  }
  decoratePageSignoffs(data);
  if (activeDocument === "addendum") {
    $("previewSummary").textContent = `${addendumPages} ${declension(addendumPages, ["страница", "страницы", "страниц"])} · ${summaries.addendum}`;
  } else if (activeDocument === "contract") {
    const contractPages = $("paper").querySelectorAll(":scope > .doc-page").length;
    $("previewSummary").textContent = `${contractPages} ${declension(contractPages, ["страница", "страницы", "страниц"])} · ${summaries.contract}`;
  }
};

const renderServiceRows = () => {
  $("serviceList").innerHTML = services.map((service) => `<div class="service-row" data-id="${html(service.id)}">
    <label class="service-name">Наименование<input data-field="name" value="${html(service.name)}"></label>
    <label class="service-kind">Тип<select data-field="kind"><option value="equipment"${service.kind !== "service" ? " selected" : ""}>Оборудование</option><option value="service"${service.kind === "service" ? " selected" : ""}>Услуга</option></select></label>
    <label class="service-qty">Кол-во<input data-field="qty" type="number" min="0.01" step="0.01" value="${html(service.qty)}"></label>
    <label class="service-unit">Единица<input data-field="unit" value="${html(service.unit)}"></label>
    <label class="service-price">Цена, ₽<input data-field="price" type="number" min="0" step="0.01" value="${html(service.price)}"></label>
    <button type="button" class="remove-service" aria-label="Удалить позицию">×</button>
  </div>`).join("");

  qa(".service-row").forEach((row) => {
    const service = services.find((item) => item.id === row.dataset.id);
    row.querySelectorAll("input, select").forEach((input) => input.addEventListener("input", () => {
      service[input.dataset.field] = ["qty", "price"].includes(input.dataset.field) ? Number(input.value) : input.value;
      renderPreview();
      scheduleWorkspaceSave();
    }));
    row.querySelector(".remove-service").addEventListener("click", () => {
      services = services.filter((item) => item.id !== row.dataset.id);
      renderServiceRows();
      renderPreview();
      scheduleWorkspaceSave();
    });
  });
};

const togglePartyFields = () => {
  const company = selectedPartyType() === "company";
  $("personFields").hidden = company;
  $("companyFields").hidden = !company;
};

$("addService").addEventListener("click", () => {
  const selected = CATALOG[$("serviceCatalog").value];
  services.push({ id: `${Date.now()}-${Math.random().toString(16).slice(2)}`, ...selected });
  renderServiceRows();
  renderPreview();
  scheduleWorkspaceSave();
});

$("addCustomService").addEventListener("click", () => {
  services.push({
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    kind: "service",
    name: "Новая услуга",
    qty: 1,
    unit: "усл.",
    price: 0,
  });
  renderServiceRows();
  renderPreview();
  scheduleWorkspaceSave();
  const lastName = qa('.service-row input[data-field="name"]').at(-1);
  lastName?.focus();
  lastName?.select();
});

const activateDocument = (documentName) => {
  activeDocument = documentName;
  qa("[data-doc]").forEach((item) => {
    const active = item.dataset.doc === documentName;
    item.classList.toggle("active", active);
    item.setAttribute("aria-selected", String(active));
  });
  renderPreview();
};

const isActDocument = (documentName) => ["transfer", "return", "techTransfer", "techReturn"].includes(documentName);
const startOfLocalDay = (date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());
let pendingActDocument = null;

const requestActAccess = (documentName) => {
  const data = getData();
  const now = new Date();
  const dialog = $("actGateDialog");
  const confirmButton = $("actGateConfirm");
  let blocked = false;
  let title = "Проверка даты";
  let message = "";
  let confirmLabel = "Подтвердить";

  if (documentName === "transfer" || documentName === "techTransfer") {
    const actStart = documentName === "techTransfer" ? data.technicalStart : data.eventStart;
    const eventDay = actStart ? startOfLocalDay(actStart) : null;
    blocked = !eventDay;
    if (!eventDay) {
      title = "Акт передачи пока недоступен";
      message = "Сначала укажите дату начала мероприятия.";
    } else if (startOfLocalDay(now) < eventDay) {
      title = `Подписать ${formatDateLong(actStart)}!!!`;
      message = `Акт можно открыть и распечатать сейчас, но подписывать его следует только ${formatDateLong(actStart)} — в дату ${documentName === "techTransfer" ? "передачи технического оборудования" : "начала мероприятия"}.`;
      confirmLabel = "Открыть акт для печати";
    } else {
      title = "Сегодня точно дата мероприятия?";
      message = `Подтвердите, что по договору № ${data.contractNumber} сегодня действительно наступила дата ${documentName === "techTransfer" ? "передачи технического оборудования" : "мероприятия"}. Только после этого откроется акт для подписания.`;
      confirmLabel = documentName === "techTransfer" ? "Да, оборудование передаётся" : "Да, мероприятие началось";
    }
  } else {
    const actEnd = documentName === "techReturn" ? data.technicalEnd : data.eventEnd;
    blocked = !actEnd;
    if (!actEnd) {
      title = "Акт возврата пока недоступен";
      message = "Сначала укажите дату и время окончания мероприятия.";
    } else if (now < actEnd) {
      title = `Подписать после ${formatDateTime(actEnd)}!!!`;
      message = `Акт можно открыть и распечатать сейчас, но подписывать его следует только после указанной даты и времени — когда ${documentName === "techReturn" ? "технические работы завершены и оборудование возвращено" : "мероприятие завершено и помещение возвращено"}.`;
      confirmLabel = "Открыть акт для печати";
    } else {
      title = "Мероприятие точно закончилось?";
      message = `Подтвердите, что мероприятие по договору № ${data.contractNumber} действительно завершилось${documentName === "techReturn" ? " и техническое оборудование возвращается" : " и помещение возвращается Стороне 1"}.`;
      confirmLabel = documentName === "techReturn" ? "Да, оборудование возвращается" : "Да, мероприятие закончилось";
    }
  }

  pendingActDocument = blocked ? null : documentName;
  dialog.dataset.blocked = String(blocked);
  $("actGateTitle").textContent = title;
  $("actGateMessage").textContent = message;
  confirmButton.textContent = confirmLabel;
  confirmButton.hidden = blocked;
  dialog.returnValue = "";
  dialog.showModal();
};

$("actGateDialog").addEventListener("close", () => {
  if ($("actGateDialog").returnValue === "confirm" && pendingActDocument) activateDocument(pendingActDocument);
  pendingActDocument = null;
});

$("deal-form").addEventListener("input", () => {
  togglePartyFields();
  if (isActDocument(activeDocument)) activateDocument("contract");
  else renderPreview();
  scheduleWorkspaceSave();
});
$("deal-form").addEventListener("change", () => {
  togglePartyFields();
  if (isActDocument(activeDocument)) activateDocument("contract");
  else renderPreview();
  scheduleWorkspaceSave();
});

$("saveContract").addEventListener("click", () => saveCurrentContract());
$("newContract").addEventListener("click", startNewContract);
const openStoredContract = (nextContractId) => {
  flushWorkspaceDraft();
  if (!nextContractId) {
    currentContractId = null;
    storageState.currentContractId = null;
    storageState.draft = captureWorkspaceSnapshot();
    writeWorkspaceStorage();
    renderStorageControls();
    setCacheStatus("Открыта несохранённая копия договора");
    return false;
  }
  const record = storageState.contracts.find((item) => item.id === nextContractId);
  if (record) {
    applyWorkspaceSnapshot(record.snapshot, { contractId: record.id });
    storageState.draft = captureWorkspaceSnapshot();
    writeWorkspaceStorage();
    setCacheStatus("Сохранённый договор открыт");
    return true;
  }
  return false;
};
$("savedContractSelect").addEventListener("change", (event) => {
  openStoredContract(event.currentTarget.value);
});
$("contractSidebarList").addEventListener("click", (event) => {
  const button = event.target.closest("[data-contract-id]");
  if (button) openStoredContract(button.dataset.contractId);
});
$("deleteContract").addEventListener("click", () => {
  if (!currentContractId) return;
  const record = storageState.contracts.find((item) => item.id === currentContractId);
  if (!window.confirm(`Удалить договор ${record ? contractRecordLabel(record) : ""} из реестра? Текущая форма останется открытой.`)) return;
  storageState.contracts = storageState.contracts.filter((item) => item.id !== currentContractId);
  currentContractId = null;
  storageState.currentContractId = null;
  storageState.draft = captureWorkspaceSnapshot();
  writeWorkspaceStorage();
  renderStorageControls();
  setCacheStatus("Договор удалён из реестра; форма оставлена как черновик");
});
$("clearWorkspace").addEventListener("click", () => {
  if (!window.confirm("Удалить из этого браузера все сохранённые договоры и черновик? Отменить это действие будет нельзя.")) return;
  clearTimeout(storageSaveTimer);
  storageSaveTimer = null;
  try { localStorage.removeItem(STORAGE_KEY); } catch (_) { /* Storage may already be unavailable. */ }
  storageEnabled = true;
  storageState = { version: 1, draft: null, currentContractId: null, contracts: [] };
  currentContractId = null;
  const fields = { ...DEFAULT_FIELD_VALUES, contractNumber: "", addendumNumber: "", contractDate: localDateFieldValue(), documentDate: localDateFieldValue(), eventStart: "", eventEnd: "", technicalStart: "", technicalEnd: "" };
  [...PARTY_FIELD_IDS.person, ...PARTY_FIELD_IDS.company].forEach((id) => { fields[id] = ""; });
  applyWorkspaceSnapshot({ partyType: "person", fields, services: [] }, { contractId: null });
  storageState.draft = captureWorkspaceSnapshot();
  writeWorkspaceStorage();
  renderStorageControls();
  setCacheStatus("Локальные договоры и черновик удалены");
});

qa("[data-doc]").forEach((button) => button.addEventListener("click", () => {
  if (isActDocument(button.dataset.doc)) requestActAccess(button.dataset.doc);
  else activateDocument(button.dataset.doc);
}));

$("printButton").addEventListener("click", () => window.print());
$("wordButton").addEventListener("click", downloadActiveWord);

const registerWebMCP = () => {
  const context = document.modelContext;
  if (!context?.registerTool) return;
  const lifecycle = new AbortController();
  const setIfPresent = (input, key, id) => {
    if (Object.prototype.hasOwnProperty.call(input, key)) $(id).value = input[key] ?? "";
  };
  try {
    void Promise.resolve(context.registerTool({
      name: "fill_event_documents",
      title: "Заполнить документы мероприятия",
      description: "Заполняет видимую карточку новой сделки и обновляет печатные документы.",
      inputSchema: {
        type: "object",
        properties: {
          contractNumber: { type: "string" },
          addendumNumber: { type: "string" },
          contractDate: { type: "string", description: "Дата YYYY-MM-DD" },
          documentDate: { type: "string", description: "Дата YYYY-MM-DD" },
          eventStart: { type: "string", description: "Дата и время YYYY-MM-DDTHH:mm" },
          eventEnd: { type: "string", description: "Дата и время YYYY-MM-DDTHH:mm" },
          technicalStart: { type: "string", description: "Начало технических работ YYYY-MM-DDTHH:mm" },
          technicalEnd: { type: "string", description: "Окончание технических работ YYYY-MM-DDTHH:mm" },
          partyType: { type: "string", enum: ["person", "company"] },
          personName: { type: "string" },
          passport: { type: "string" },
          birthDate: { type: "string", description: "Дата YYYY-MM-DD" },
          passportIssuer: { type: "string" },
          passportDate: { type: "string", description: "Дата YYYY-MM-DD" },
          passportCode: { type: "string" },
          personAddress: { type: "string" },
          personPhone: { type: "string" },
          personEmail: { type: "string" },
          companyName: { type: "string" },
          companyInn: { type: "string" },
          companyKpp: { type: "string" },
          companyOgrn: { type: "string" },
          companyAddress: { type: "string" },
          companyPostalAddress: { type: "string" },
          companyPhone: { type: "string" },
          companyEmail: { type: "string" },
          companyBank: { type: "string" },
          companyAccount: { type: "string" },
          companyCorrespondent: { type: "string" },
          companyBik: { type: "string" },
          companySigner: { type: "string" },
          companySignerRole: { type: "string" },
          companySignerBasis: { type: "string" },
          firstPaymentPercent: { type: "number", enum: [50, 100] },
          addendumPaymentPercent: { type: "number", enum: [50, 100] },
          services: { type: "array", items: { type: "object", properties: { kind: { type: "string", enum: ["equipment", "service"] }, name: { type: "string" }, qty: { type: "number" }, unit: { type: "string" }, price: { type: "number" } }, required: ["name", "qty", "price"], additionalProperties: false } },
        },
        additionalProperties: false,
      },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      execute(input) {
        for (const key of ["contractDate", "documentDate", "eventStart", "eventEnd", "technicalStart", "technicalEnd", "birthDate", "passportDate"]) {
          if (Object.prototype.hasOwnProperty.call(input, key) && input[key] && Number.isNaN(new Date(input[key]).getTime())) {
            throw new Error(`Некорректное значение даты: ${key}`);
          }
        }
        if (Array.isArray(input.services) && input.services.some((item) => !item || typeof item.name !== "string" || !item.name.trim() || !(item.qty > 0) || !(item.price >= 0))) {
          throw new Error("Некорректная строка услуги");
        }
        setIfPresent(input, "contractNumber", "contractNumber");
        setIfPresent(input, "addendumNumber", "addendumNumber");
        setIfPresent(input, "contractDate", "contractDate");
        setIfPresent(input, "documentDate", "documentDate");
        setIfPresent(input, "eventStart", "eventStart");
        setIfPresent(input, "eventEnd", "eventEnd");
        setIfPresent(input, "technicalStart", "technicalStart");
        setIfPresent(input, "technicalEnd", "technicalEnd");
        setIfPresent(input, "firstPaymentPercent", "firstPaymentPercent");
        setIfPresent(input, "addendumPaymentPercent", "addendumPaymentPercent");
        if (input.partyType === "person" || input.partyType === "company") {
          q(`input[name="partyType"][value="${input.partyType}"]`).checked = true;
        }
        for (const key of ["personName", "passport", "birthDate", "passportIssuer", "passportDate", "passportCode", "personAddress", "personPhone", "personEmail"]) {
          setIfPresent(input, key, key);
        }
        for (const key of ["companyName", "companyInn", "companyKpp", "companyOgrn", "companyAddress", "companyPostalAddress", "companyPhone", "companyEmail", "companyBank", "companyAccount", "companyCorrespondent", "companyBik", "companySigner", "companySignerRole", "companySignerBasis"]) {
          setIfPresent(input, key, key);
        }
        if (Array.isArray(input.services)) services = input.services.map((item, index) => ({ id: `mcp-${Date.now()}-${index}`, kind: item.kind === "equipment" ? "equipment" : "service", unit: "усл.", ...item }));
        togglePartyFields();
        renderServiceRows();
        activateDocument("contract");
        persistWorkspaceDraft();
        return { status: "updated", document: activeDocument, services: services.length };
      },
    }, { signal: lifecycle.signal })).catch(() => {});

    void Promise.resolve(context.registerTool({
      name: "read_event_document_summary",
      title: "Прочитать сводку документов",
      description: "Возвращает суммы, даты и текущие замечания без изменения формы.",
      inputSchema: { type: "object", properties: {}, additionalProperties: false },
      annotations: { readOnlyHint: true, untrustedContentHint: false },
      execute() {
        const data = getData();
        const totals = totalsFor(serviceSubtotal());
        return {
          contractNumber: data.contractNumber,
          party: data.party.name,
          eventStart: data.eventStart?.toISOString() || null,
          eventEnd: data.eventEnd?.toISOString() || null,
          rentTotal: totalsFor(data.rentAmount).total,
          technicalTotal: totals.total,
          addendumFirstPaymentDate: data.addendumFirstPaymentDate?.toISOString() || null,
          addendumFinalPaymentDate: data.addendumFinalPaymentDate?.toISOString() || null,
          issues: validate(data).filter((item) => item.type !== "ok"),
        };
      },
    }, { signal: lifecycle.signal })).catch(() => {});
  } catch (_) {
    // WebMCP is optional; the visible interface remains fully functional.
  }
};

initializeWorkspaceStorage();
togglePartyFields();
renderServiceRows();
renderPreview();
registerWebMCP();
