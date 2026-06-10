# Седьмое небо — final_site (deploy)

Готово к выкладке на GitHub Pages. Конечный URL: **https://formand800.github.io/nebo/**

---

## Деплой на GitHub Pages — два пути

### Путь A. Через сайт GitHub (без терминала, ~3 минуты)

1. Залогинься на github.com под аккаунтом **formand800**.
2. Перейди https://github.com/new → создай **публичный** репозиторий с именем **`nebo`** (всё в нижнем регистре, важно — URL чувствителен к регистру). Public — обязательно, иначе Pages бесплатно не работает. Галку «Add a README» не ставь.
3. На странице созданного пустого репо нажми **«uploading an existing file»** → перетащи в окно **содержимое папки `final_site/`** (НЕ саму папку, а её внутренности: `index.html`, `styles.css`, `script.js`, `README.md` и папку `img/`). Подожди пока загрузятся 15 файлов (~20 МБ).
4. Внизу нажми **Commit changes**.
5. Settings → **Pages** (слева в меню) → блок **Build and deployment**:
   - Source: **Deploy from a branch**
   - Branch: **main** / **/(root)** → **Save**.
6. Подожди 30–60 секунд. Открой **https://formand800.github.io/nebo/** — сайт работает.

### Путь B. Через терминал (одной серией команд)

В терминале на Mac:

```bash
cd /Users/d.kubyshkin/Documents/Obsidian/vault/20-clients/7-nebo/7-nebo-redesign/final_site

git init -b main
git add .
git commit -m "Седьмое небо · первая выкладка"

# Если ещё нет gh CLI: brew install gh && gh auth login
gh repo create formand800/nebo --public --source=. --remote=origin --push

# Включить GitHub Pages из main / root
gh api -X POST repos/formand800/nebo/pages -f source[branch]=main -f source[path]=/

# URL появится через 30–60 сек
open https://formand800.github.io/nebo/
```

Если `gh` не стоит и не хочется ставить — после `git commit` сделай вручную: создай пустой репо `nebo` на github.com (Путь A, шаг 2), затем:

```bash
git remote add origin https://github.com/formand800/nebo.git
git push -u origin main
```

Потом включи Pages по шагу 5 из Пути A.

---

## После первого деплоя — обновления

Меняешь файлы локально → 3 команды:

```bash
git add . && git commit -m "правки" && git push
```

GitHub Pages пересоберёт сайт автоматически за ~30 секунд.

---

## Локальная проверка

```bash
cd final_site && python3 -m http.server 8000
# открыть http://localhost:8000
```

---

## Состав

```
final_site/
├── index.html
├── styles.css
├── script.js
├── README.md
└── img/             (11 файлов, ~20 МБ)
    ├── hero-main.jpg            — hero (премиум потолок + Москва ночью)
    ├── owner-anton.jpg          — Антон Базов, портрет
    ├── story-hidden.jpg
    ├── story-factures.jpg
    ├── story-water.jpg
    ├── story-light-arch.jpg
    ├── cat-matte.jpg
    ├── cat-gloss.jpg
    ├── cat-satin.jpg
    ├── cat-concrete.jpg
    └── cat-fabric.jpg
```

Архив `../final_site.zip` (19 МБ) — то же содержимое, для drag-and-drop через GitHub UI.

---

## Что осталось внешним (не блокирует деплой)

9 картинок ещё подгружаются с `7nebo-nf.ru` (4 карточки каталога: световые линии, многоуровневые, парящие, фотопечать; 5 фото портфолио; 1 фото в «честной смете» — настоящий объект). Сайт работает с ними как есть. Для полной автономии — прогнать через `../site/regenerate/` и подменить.

---

## Что осталось рискованным (честно, перед публикацией)

- **Цифры** (10 000 клиентов, 195 256 м², 97%, 5,0/400+) — не верифицированы. Подтвердить у Антона.
- **Перечень элитных ЖК** в блоке «когда нельзя ошибиться» (Level Причальный, Режиссёр, Династия, клиники Маршака/СМ, ЛесАрт Резорт) — юридически чувствительно, согласовать использование.
- **«Ателье»** ещё в hero (брендовая строка над H1). Из шапки и футера убрано. Если по архитектуре бренда суб-бренды отклонены — убрать и из hero (1 точка правки в `index.html`).
- **Формы — демо**: `script.js` показывает success локально, в AmoCRM не идёт. Подключить webhook в обработчиках `calcForm.submit` и `measureForm.submit` (маркер `// Демо: здесь подключается отправка в AmoCRM`).
- **Юр.страницы** `#privacy` — заглушки.
- **Аналитика** не подключена — добавить Метрику/GTM перед `</head>`.
