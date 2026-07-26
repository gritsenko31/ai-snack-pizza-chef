/* ============================================================
   AI Snack & Pizza Chef — script.js
   Game logic + OpenRouter API integration
   ============================================================ */

'use strict';

// ─────────────────────────────────────────────
//  CONFIG
// ─────────────────────────────────────────────
async function askAI(messages) {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messages: messages
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || data.error || 'Ошибка при вызове сервера');
    }

    return data.choices[0].message.content;

  } catch (error) {
    console.error('Ошибка получения ответа:', error);
    return null;
  }
}

// ─────────────────────────────────────────────
//  LEVEL DATA
// ─────────────────────────────────────────────
const LEVELS = [
  {
    id: 1,
    name: 'Sandwich',
    tag: 'Level 1 — Sandwich',
    customerAvatar: '👧',
    dishEmoji: '🥪',
    orderText: 'I want a HUGE colorful sandwich on toasted golden bread with melted yellow cheese, fresh red tomatoes, and crispy green lettuce! Oh, and some creamy white mayo please! 🥪',
    hint: 'Try to include: bread type, ingredients, colors, and sauces!',
    checklistItems: [
      {
        id: 'bread',
        label: 'Bread / Base',
        emoji: '🍞',
        keywords: ['bread', 'toast', 'toasted', 'bun', 'roll', 'bagel', 'baguette', 'white', 'brown', 'whole', 'sourdough', 'rye'],
        description: 'bread, toast, bun…'
      },
      {
        id: 'protein',
        label: 'Protein / Main Filling',
        emoji: '🥩',
        keywords: ['cheese', 'chicken', 'turkey', 'ham', 'beef', 'tuna', 'egg', 'bacon', 'salami', 'meat', 'fish'],
        description: 'cheese, chicken, ham…'
      },
      {
        id: 'veggies',
        label: 'Vegetables',
        emoji: '🥬',
        keywords: ['tomato', 'lettuce', 'cucumber', 'onion', 'pepper', 'avocado', 'spinach', 'pickle', 'olive', 'mushroom', 'veggie', 'vegetable'],
        description: 'tomato, lettuce, cucumber…'
      },
      {
        id: 'sauce',
        label: 'Sauce / Spread',
        emoji: '🫙',
        keywords: ['mayo', 'mayonnaise', 'mustard', 'ketchup', 'sauce', 'butter', 'cream', 'dressing', 'ranch', 'pesto', 'hummus'],
        description: 'mayo, mustard, ketchup…'
      },
      {
        id: 'color',
        label: 'Colors Mentioned',
        emoji: '🎨',
        keywords: ['red', 'green', 'yellow', 'orange', 'white', 'brown', 'golden', 'purple', 'blue', 'pink', 'colorful', 'bright'],
        description: 'red, green, yellow…'
      }
    ],
    systemPrompt: `You are a friendly, encouraging AI judge for a children's cooking game (ages 5-9). 
The child was asked to describe a sandwich with: toasted bread, cheese, tomatoes, lettuce, and a sauce.
Analyze the child's prompt for detail and creativity.

SCORING RULES:
- 1 star: Very short prompt (1-4 words, e.g. "make a sandwich")
- 2 stars: Some details mentioned (1-2 ingredients or colors)
- 3 stars: Detailed prompt with multiple ingredients, colors, and/or bread type

IMPORTANT: Respond ONLY with a valid JSON object. No extra text, no markdown, no code blocks.
Use this exact structure:
{
  "stars": <1, 2, or 3>,
  "feedback": "<encouraging message for a child, max 2 sentences, use emojis>",
  "ingredients_found": ["<ingredient1>", "<ingredient2>"],
  "missing_details": ["<missing1>", "<missing2>"]
}`
  },
  {
    id: 2,
    name: 'Pizza',
    tag: 'Level 2 — Party Pizza',
    customerAvatar: '👦',
    dishEmoji: '🍕',
    orderText: 'Make me the BEST party pizza ever! I want a round crispy crust with rich red tomato sauce, lots of melted white mozzarella cheese, colorful bell peppers, juicy mushrooms, and black olives on top! Sprinkle some green basil leaves too! 🍕🎉',
    hint: 'Include: crust type, sauce, 3+ toppings, colors, and decorations!',
    checklistItems: [
      {
        id: 'crust',
        label: 'Crust / Dough',
        emoji: '⭕',
        keywords: ['crust', 'dough', 'base', 'thin', 'thick', 'crispy', 'fluffy', 'round', 'square', 'deep', 'pan', 'neapolitan', 'sourdough'],
        description: 'thin crust, thick dough…'
      },
      {
        id: 'sauce',
        label: 'Sauce',
        emoji: '🍅',
        keywords: ['sauce', 'tomato', 'marinara', 'pesto', 'white', 'cream', 'bbq', 'buffalo', 'garlic', 'olive oil', 'red sauce'],
        description: 'tomato sauce, pesto…'
      },
      {
        id: 'cheese',
        label: 'Cheese',
        emoji: '🧀',
        keywords: ['cheese', 'mozzarella', 'parmesan', 'cheddar', 'ricotta', 'gouda', 'feta', 'melted', 'grated', 'shredded'],
        description: 'mozzarella, cheddar…'
      },
      {
        id: 'toppings',
        label: '3+ Toppings',
        emoji: '🫑',
        keywords: ['pepper', 'mushroom', 'olive', 'onion', 'pepperoni', 'sausage', 'ham', 'bacon', 'chicken', 'spinach', 'tomato', 'basil', 'oregano', 'pineapple', 'anchovy', 'jalapeño', 'corn', 'broccoli'],
        description: 'peppers, mushrooms, olives…',
        requireCount: 3
      },
      {
        id: 'color',
        label: 'Colors Mentioned',
        emoji: '🎨',
        keywords: ['red', 'green', 'yellow', 'orange', 'white', 'brown', 'golden', 'purple', 'black', 'colorful', 'bright', 'crispy'],
        description: 'red, green, yellow…'
      },
      {
        id: 'decoration',
        label: 'Decoration / Finishing',
        emoji: '✨',
        keywords: ['basil', 'oregano', 'herbs', 'drizzle', 'sprinkle', 'garnish', 'extra', 'fresh', 'baked', 'hot', 'party', 'special', 'beautiful', 'amazing', 'delicious'],
        description: 'basil, oregano, drizzle…'
      }
    ],
    systemPrompt: `You are a friendly, encouraging AI judge for a children's cooking game (ages 5-9).
The child was asked to describe a party pizza with: crispy crust, tomato sauce, mozzarella cheese, 3+ toppings (peppers, mushrooms, olives), and decorations like basil.
Analyze the child's prompt for detail and creativity.

SCORING RULES:
- 1 star: Very short prompt (1-5 words, e.g. "make a pizza")
- 2 stars: Some details (sauce + 1-2 toppings OR cheese mentioned)
- 3 stars: Detailed prompt with crust type, sauce, cheese, 3+ toppings, colors, and/or decorations

IMPORTANT: Respond ONLY with a valid JSON object. No extra text, no markdown, no code blocks.
Use this exact structure:
{
  "stars": <1, 2, or 3>,
  "feedback": "<encouraging message for a child, max 2 sentences, use emojis>",
  "ingredients_found": ["<ingredient1>", "<ingredient2>"],
  "missing_details": ["<missing1>", "<missing2>"]
}`
  }
];

// ─────────────────────────────────────────────
//  STATE
// ─────────────────────────────────────────────
let currentLevelIndex = 0;
let userApiKey = localStorage.getItem('openrouter_api_key') || '';

// ─────────────────────────────────────────────
//  DOM REFERENCES
// ─────────────────────────────────────────────
const $ = id => document.getElementById(id);

const DOM = {
  // Header
  currentLevelNum:    $('current-level-num'),
  levelBadge:         $('level-badge'),

  // Order card
  customerAvatar:     $('customer-avatar'),
  levelTag:           $('level-tag'),
  orderText:          $('order-text'),
  hintText:           $('hint-text'),

  // Prompt
  promptInput:        $('prompt-input'),
  charCount:          $('char-count'),
  cookBtn:            $('cook-btn'),
  clearPromptBtn:     $('clear-prompt-btn'),

  // Meter
  meterFill:          $('meter-fill'),
  meterPercent:       $('meter-percent'),
  checklist:          $('checklist'),

  // Dish preview
  dishEmoji:          $('dish-emoji'),
  dishWaitingText:    $('dish-waiting-text'),

  // Result overlay
  resultOverlay:      $('result-overlay'),
  resultStars:        $('result-stars'),
  resultDishEmoji:    $('result-dish-emoji'),
  resultTitle:        $('result-title'),
  resultFeedback:     $('result-feedback'),
  resultFoundWrap:    $('result-found-wrap'),
  resultFoundTags:    $('result-found-tags'),
  resultMissingWrap:  $('result-missing-wrap'),
  resultMissingTags:  $('result-missing-tags'),
  resultClose:        $('result-close'),
  retryBtn:           $('retry-btn'),
  nextLevelBtn:       $('next-level-btn'),

  // Loading
  loadingOverlay:     $('loading-overlay'),

  // Settings
  openSettings:       $('open-settings'),
  settingsModal:      $('settings-modal'),
  closeSettings:      $('close-settings'),
  apiKeyInput:        $('api-key-input'),
  saveApiKey:         $('save-api-key'),
  clearApiKey:        $('clear-api-key'),
  keyStatus:          $('key-status'),

  // Level banner
  levelBanner:        $('level-complete-banner'),
};

// ─────────────────────────────────────────────
//  INIT
// ─────────────────────────────────────────────
function init() {
  loadLevel(currentLevelIndex);
  bindEvents();
  if (userApiKey) {
    DOM.apiKeyInput.value = userApiKey;
    setKeyStatus('✅ Custom API key loaded!', 'ok');
  }
}

// ─────────────────────────────────────────────
//  LOAD LEVEL
// ─────────────────────────────────────────────
function loadLevel(index) {
  const level = LEVELS[index];

  // Header
  DOM.currentLevelNum.textContent = level.id;

  // Order card
  DOM.customerAvatar.textContent = level.customerAvatar;
  DOM.levelTag.textContent       = level.tag;
  DOM.orderText.textContent      = level.orderText;
  DOM.hintText.textContent       = level.hint;

  // Dish preview
  DOM.dishEmoji.textContent      = level.dishEmoji;
  DOM.dishWaitingText.textContent = 'Your dish will appear here after cooking!';
  DOM.dishWaitingText.style.display = 'block';

  // Remove old ingredient chips
  const oldChips = document.querySelector('.dish-ingredients-row');
  if (oldChips) oldChips.remove();

  // Clear prompt
  DOM.promptInput.value = '';
  DOM.charCount.textContent = '0';

  // Build checklist
  buildChecklist(level);

  // Reset meter
  updateMeter(0);

  // Hide next level btn if last level
  DOM.nextLevelBtn.style.display = (index >= LEVELS.length - 1) ? 'none' : 'inline-flex';
}

// ─────────────────────────────────────────────
//  BUILD CHECKLIST
// ─────────────────────────────────────────────
function buildChecklist(level) {
  DOM.checklist.innerHTML = '';
  level.checklistItems.forEach(item => {
    const li = document.createElement('li');
    li.className = 'checklist-item';
    li.id = `check-${item.id}`;
    li.innerHTML = `
      <span class="check-icon">${item.emoji}</span>
      <span class="check-label">${item.label}</span>
      <span class="check-keywords">${item.description}</span>
    `;
    DOM.checklist.appendChild(li);
  });
}

// ─────────────────────────────────────────────
//  LIVE PROMPT ANALYSIS (on input)
// ─────────────────────────────────────────────
function analyzePromptLive() {
  const text  = DOM.promptInput.value.toLowerCase();
  const level = LEVELS[currentLevelIndex];
  let foundCount = 0;

  level.checklistItems.forEach(item => {
    const el = $(`check-${item.id}`);
    if (!el) return;

    let found = false;

    if (item.requireCount) {
      // Count how many distinct keywords from this category appear
      const matches = item.keywords.filter(kw => text.includes(kw));
      found = matches.length >= item.requireCount;
    } else {
      found = item.keywords.some(kw => text.includes(kw));
    }

    if (found) {
      el.classList.add('found');
      el.querySelector('.check-icon').textContent = '✅';
      foundCount++;
    } else {
      el.classList.remove('found');
      el.querySelector('.check-icon').textContent = item.emoji;
    }
  });

  const pct = Math.round((foundCount / level.checklistItems.length) * 100);
  updateMeter(pct);

  // Update dish preview emoji based on completeness
  updateDishPreview(text, pct, level);
}

// ─────────────────────────────────────────────
//  UPDATE METER
// ─────────────────────────────────────────────
function updateMeter(pct) {
  DOM.meterFill.style.width    = pct + '%';
  DOM.meterPercent.textContent = pct + '%';

  // Color gradient hint
  if (pct < 34) {
    DOM.meterFill.style.background = 'linear-gradient(90deg, #ff6b35, #ff8c42)';
  } else if (pct < 67) {
    DOM.meterFill.style.background = 'linear-gradient(90deg, #ff6b35, #ffd700)';
  } else {
    DOM.meterFill.style.background = 'linear-gradient(90deg, #ffd700, #56c596)';
  }
}

// ─────────────────────────────────────────────
//  UPDATE DISH PREVIEW
// ─────────────────────────────────────────────
function updateDishPreview(text, pct, level) {
  if (pct === 0) {
    DOM.dishEmoji.textContent = level.dishEmoji;
    DOM.dishWaitingText.style.display = 'block';
    return;
  }

  DOM.dishWaitingText.style.display = 'none';

  // Build ingredient chips from found keywords
  const allKeywords = [];
  level.checklistItems.forEach(item => {
    item.keywords.forEach(kw => {
      if (text.includes(kw) && !allKeywords.includes(kw)) {
        allKeywords.push(kw);
      }
    });
  });

  // Show a "building" emoji
  const buildEmojis = level.id === 1
    ? ['🍞', '🥪', '🥪✨', '🥪🌟', '🥪⭐🌟']
    : ['🫓', '🍕', '🍕✨', '🍕🌟', '🍕⭐🌟'];

  const emojiIdx = Math.min(Math.floor(pct / 20), buildEmojis.length - 1);
  DOM.dishEmoji.textContent = buildEmojis[emojiIdx];

  // Render ingredient chips (max 8)
  let chipsRow = document.querySelector('.dish-ingredients-row');
  if (!chipsRow) {
    chipsRow = document.createElement('div');
    chipsRow.className = 'dish-ingredients-row';
    DOM.dishEmoji.parentElement.appendChild(chipsRow);
  }

  const displayKws = allKeywords.slice(0, 8);
  chipsRow.innerHTML = displayKws
    .map(kw => `<span class="ingredient-chip">${kw}</span>`)
    .join('');
}

// ─────────────────────────────────────────────
//  COOK — CALL OPENROUTER API
// ─────────────────────────────────────────────
async function cookDish() {
  const prompt = DOM.promptInput.value.trim();

  if (!prompt) {
    shakeElement(DOM.promptInput);
    DOM.promptInput.placeholder = '⚠️ Please write something first!';
    setTimeout(() => {
      DOM.promptInput.placeholder = 'Describe the meal in detail here...';
    }, 2500);
    return;
  }

  const level  = LEVELS[currentLevelIndex];
  const apiKey = userApiKey || DEFAULT_API_KEY;

  showLoading(true);
  DOM.cookBtn.disabled = true;

  let lastError = null;

  for (const model of MODEL_FALLBACKS) {
    try {
      console.log(`Trying model: ${model}`);

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type':  'application/json',
          'HTTP-Referer':  window.location.href,
          'X-Title':       'AI Snack & Pizza Chef'
        },
        body: JSON.stringify({
          model,
          messages: [
            {
              role: 'system',
              content: level.systemPrompt
            },
            {
              role: 'user',
              content: `Child's prompt: "${prompt}"`
            }
          ],
          temperature: 0.4,
          max_tokens:  400
        })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        const msg = errData?.error?.message || `HTTP ${response.status}`;
        // If model not found / unavailable, try next fallback
        if (response.status === 404 || response.status === 400 || response.status === 503) {
          console.warn(`Model ${model} unavailable (${msg}), trying next fallback...`);
          lastError = new Error(msg);
          continue;
        }
        throw new Error(msg);
      }

      const data    = await response.json();
      const rawText = data?.choices?.[0]?.message?.content || '';

      // Parse JSON from response
      const result = parseAIResponse(rawText);
      showResult(result, level);

      // Success — exit loop
      showLoading(false);
      DOM.cookBtn.disabled = false;
      return;

    } catch (err) {
      // Network error or non-retryable error — try next model
      console.warn(`Model ${model} failed:`, err.message);
      lastError = err;
    }
  }

  // All models failed
  console.error('All models failed. Last error:', lastError);
  showErrorResult(lastError?.message || 'All AI models are unavailable. Please try again later.');

  showLoading(false);
  DOM.cookBtn.disabled = false;
}

// ─────────────────────────────────────────────
//  PARSE AI RESPONSE
// ─────────────────────────────────────────────
function parseAIResponse(rawText) {
  // Try to extract JSON from the response
  try {
    // Direct parse
    return JSON.parse(rawText.trim());
  } catch (_) {
    // Try to find JSON block inside the text
    const match = rawText.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch (_2) { /* fall through */ }
    }
  }

  // Fallback: derive stars from prompt length
  const promptLen = DOM.promptInput.value.trim().split(/\s+/).length;
  let stars = 1;
  if (promptLen >= 10) stars = 2;
  if (promptLen >= 20) stars = 3;

  return {
    stars,
    feedback: stars === 3
      ? "Amazing description! You're a real chef! 🌟"
      : stars === 2
        ? "Good job! Try adding more colors and ingredients! 🍳"
        : "Nice try! Add more details to get more stars! ⭐",
    ingredients_found: [],
    missing_details:   []
  };
}

// ─────────────────────────────────────────────
//  SHOW RESULT
// ─────────────────────────────────────────────
function showResult(result, level) {
  const stars   = Math.max(1, Math.min(3, result.stars || 1));
  const found   = Array.isArray(result.ingredients_found) ? result.ingredients_found : [];
  const missing = Array.isArray(result.missing_details)   ? result.missing_details   : [];

  // Stars
  DOM.resultStars.innerHTML = [1, 2, 3]
    .map(n => `<span class="${n <= stars ? 'star-filled' : 'star-empty'}">${n <= stars ? '⭐' : '☆'}</span>`)
    .join('');

  // Dish emoji
  DOM.resultDishEmoji.textContent = level.dishEmoji;

  // Title
  const titles = {
    1: '🙂 Keep Trying!',
    2: '👍 Good Job!',
    3: '🏆 Amazing Chef!'
  };
  DOM.resultTitle.textContent = titles[stars];

  // Feedback
  DOM.resultFeedback.textContent = result.feedback || 'Great effort!';

  // Found tags
  if (found.length > 0) {
    DOM.resultFoundWrap.style.display = 'block';
    DOM.resultFoundTags.innerHTML = found
      .map(f => `<span class="tag tag-found">✅ ${f}</span>`)
      .join('');
  } else {
    DOM.resultFoundWrap.style.display = 'none';
  }

  // Missing tags
  if (missing.length > 0) {
    DOM.resultMissingWrap.style.display = 'block';
    DOM.resultMissingTags.innerHTML = missing
      .map(m => `<span class="tag tag-missing">💡 ${m}</span>`)
      .join('');
  } else {
    DOM.resultMissingWrap.style.display = 'none';
  }

  // Show/hide next level button
  DOM.nextLevelBtn.style.display = (currentLevelIndex >= LEVELS.length - 1) ? 'none' : 'inline-flex';

  // Show overlay
  DOM.resultOverlay.classList.remove('hidden');

  // Confetti for 3 stars
  if (stars === 3) {
    launchConfetti();
  }
}

// ─────────────────────────────────────────────
//  SHOW ERROR RESULT
// ─────────────────────────────────────────────
function showErrorResult(message) {
  DOM.resultStars.innerHTML = '<span class="star-empty">☆</span><span class="star-empty">☆</span><span class="star-empty">☆</span>';
  DOM.resultDishEmoji.textContent = '😵';
  DOM.resultTitle.textContent = '⚠️ Oops!';
  DOM.resultFeedback.textContent = `Something went wrong: ${message}. Please check your API key in Settings ⚙️ and try again!`;
  DOM.resultFoundWrap.style.display  = 'none';
  DOM.resultMissingWrap.style.display = 'none';
  DOM.nextLevelBtn.style.display = 'none';
  DOM.resultOverlay.classList.remove('hidden');
}

// ─────────────────────────────────────────────
//  CONFETTI 🎉
// ─────────────────────────────────────────────
function launchConfetti() {
  const colors  = ['#FF6B35', '#FFD700', '#4ECDC4', '#56C596', '#9B59B6', '#E74C3C'];
  const emojis  = ['🎉', '⭐', '🌟', '✨', '🎊', '🍕', '🥪'];
  const container = document.body;

  for (let i = 0; i < 30; i++) {
    setTimeout(() => {
      const el = document.createElement('div');
      el.style.cssText = `
        position: fixed;
        top: -30px;
        left: ${Math.random() * 100}vw;
        font-size: ${1 + Math.random() * 1.5}rem;
        z-index: 9999;
        pointer-events: none;
        animation: confettiFall ${1.5 + Math.random() * 2}s ease-in forwards;
        transform: rotate(${Math.random() * 360}deg);
      `;
      el.textContent = Math.random() > 0.5
        ? emojis[Math.floor(Math.random() * emojis.length)]
        : '●';
      if (el.textContent === '●') {
        el.style.color = colors[Math.floor(Math.random() * colors.length)];
      }
      container.appendChild(el);
      setTimeout(() => el.remove(), 4000);
    }, i * 80);
  }

  // Inject keyframe if not present
  if (!document.getElementById('confetti-style')) {
    const style = document.createElement('style');
    style.id = 'confetti-style';
    style.textContent = `
      @keyframes confettiFall {
        0%   { transform: translateY(0) rotate(0deg); opacity: 1; }
        100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }
}

// ─────────────────────────────────────────────
//  SHAKE ANIMATION
// ─────────────────────────────────────────────
function shakeElement(el) {
  el.style.animation = 'none';
  el.offsetHeight; // reflow
  el.style.animation = 'shake 0.4s ease';
  if (!document.getElementById('shake-style')) {
    const style = document.createElement('style');
    style.id = 'shake-style';
    style.textContent = `
      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        20%       { transform: translateX(-8px); }
        40%       { transform: translateX(8px); }
        60%       { transform: translateX(-6px); }
        80%       { transform: translateX(6px); }
      }
    `;
    document.head.appendChild(style);
  }
  setTimeout(() => { el.style.animation = ''; }, 500);
}

// ─────────────────────────────────────────────
//  LOADING
// ─────────────────────────────────────────────
function showLoading(show) {
  DOM.loadingOverlay.classList.toggle('hidden', !show);
}

// ─────────────────────────────────────────────
//  LEVEL BANNER
// ─────────────────────────────────────────────
function showLevelBanner() {
  DOM.levelBanner.classList.remove('hidden');
  setTimeout(() => {
    DOM.levelBanner.classList.add('hidden');
  }, 3200);
}

// ─────────────────────────────────────────────
//  SETTINGS
// ─────────────────────────────────────────────
function setKeyStatus(msg, type) {
  DOM.keyStatus.textContent  = msg;
  DOM.keyStatus.className    = `key-status ${type}`;
}

// ─────────────────────────────────────────────
//  BIND EVENTS
// ─────────────────────────────────────────────
function bindEvents() {

  // Live prompt analysis
  DOM.promptInput.addEventListener('input', () => {
    DOM.charCount.textContent = DOM.promptInput.value.length;
    analyzePromptLive();
  });

  // Cook button
  DOM.cookBtn.addEventListener('click', cookDish);

  // Clear prompt
  DOM.clearPromptBtn.addEventListener('click', () => {
    DOM.promptInput.value = '';
    DOM.charCount.textContent = '0';
    analyzePromptLive();
    DOM.promptInput.focus();
  });

  // Result overlay close
  DOM.resultClose.addEventListener('click', () => {
    DOM.resultOverlay.classList.add('hidden');
  });

  // Click outside result box to close
  DOM.resultOverlay.addEventListener('click', e => {
    if (e.target === DOM.resultOverlay) {
      DOM.resultOverlay.classList.add('hidden');
    }
  });

  // Retry button
  DOM.retryBtn.addEventListener('click', () => {
    DOM.resultOverlay.classList.add('hidden');
    DOM.promptInput.value = '';
    DOM.charCount.textContent = '0';
    analyzePromptLive();
    DOM.promptInput.focus();
  });

  // Next level button
  DOM.nextLevelBtn.addEventListener('click', () => {
    DOM.resultOverlay.classList.add('hidden');
    if (currentLevelIndex < LEVELS.length - 1) {
      currentLevelIndex++;
      loadLevel(currentLevelIndex);
      showLevelBanner();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });

  // Settings open
  DOM.openSettings.addEventListener('click', () => {
    DOM.settingsModal.classList.remove('hidden');
    DOM.apiKeyInput.focus();
  });

  // Settings close
  DOM.closeSettings.addEventListener('click', () => {
    DOM.settingsModal.classList.add('hidden');
  });

  // Click outside settings modal
  DOM.settingsModal.addEventListener('click', e => {
    if (e.target === DOM.settingsModal) {
      DOM.settingsModal.classList.add('hidden');
    }
  });

  // Save API key
  DOM.saveApiKey.addEventListener('click', () => {
    const key = DOM.apiKeyInput.value.trim();
    if (!key) {
      setKeyStatus('⚠️ Please enter a key first.', 'error');
      return;
    }
    userApiKey = key;
    localStorage.setItem('openrouter_api_key', key);
    setKeyStatus('✅ API key saved successfully!', 'ok');
  });

  // Clear API key
  DOM.clearApiKey.addEventListener('click', () => {
    userApiKey = '';
    localStorage.removeItem('openrouter_api_key');
    DOM.apiKeyInput.value = '';
    setKeyStatus('🗑️ Key cleared. Using default key.', 'ok');
  });

  // Keyboard shortcut: Ctrl+Enter to cook
  DOM.promptInput.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      cookDish();
    }
  });
}

// ─────────────────────────────────────────────
//  START
// ─────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', init);
