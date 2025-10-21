const bundles = [20, 70, 350, 700, 1400, 3500, 7000, 17500];
const USD_PER_COIN = 1 / 70; // $0.014285..., aligned with screenshot pricing

const grid = document.getElementById('bundleGrid');
const customPanel = document.getElementById('customAmountPanel');
const customAmountInput = document.getElementById('customAmount');
const applyCustomButton = document.getElementById('applyCustom');
const topUpButton = document.getElementById('topUpButton');
const sendUsernameInput = document.getElementById('sendUsername');

const modal = document.getElementById('resultModal');
const closeModalButton = document.getElementById('closeModal');
const countdownText = document.getElementById('countdownText');

let selectedCoins = null;
let selectedIsCustom = false;
let countdownTimer = null;

function formatUsd(value) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(value);
}

function priceForCoins(coins) {
  return Math.max(0, coins) * USD_PER_COIN;
}

function renderGrid() {
  const fragment = document.createDocumentFragment();

  bundles.forEach((coins) => {
    const tile = createBundleTile(coins);
    fragment.appendChild(tile);
  });

  // Custom tile
  const customTile = document.createElement('button');
  customTile.className = 'bundle-tile';
  customTile.type = 'button';
  customTile.innerHTML = `
    <div class="bundle-top">
      <div class="coin" aria-hidden="true"></div>
      <div class="bundle-amount">Custom</div>
    </div>
    <div class="bundle-price">Podporována větší množství</div>
  `;
  customTile.addEventListener('click', () => {
    selectCustom();
  });
  fragment.appendChild(customTile);

  grid.appendChild(fragment);
}

function createBundleTile(coins) {
  const tile = document.createElement('button');
  tile.className = 'bundle-tile';
  tile.type = 'button';
  const price = priceForCoins(coins);
  tile.innerHTML = `
    <div class="bundle-top">
      <div class="coin" aria-hidden="true"></div>
      <div class="bundle-amount"><span class="sr-only">Počet mincí </span>${coins}</div>
    </div>
    <div class="bundle-price">${formatUsd(price)}</div>
  `;
  tile.addEventListener('click', () => {
    selectedIsCustom = false;
    selectedCoins = coins;
    updateSelection(tile);
    hideCustomPanel();
    updateButtonState();
  });
  return tile;
}

function updateSelection(activeTile) {
  document.querySelectorAll('.bundle-tile').forEach((t) => t.classList.remove('selected'));
  activeTile.classList.add('selected');
}

function showCustomPanel() {
  customPanel.classList.remove('hidden');
  customAmountInput.focus();
}
function hideCustomPanel() {
  customPanel.classList.add('hidden');
}

function selectCustom() {
  selectedIsCustom = true;
  selectedCoins = null;
  const customTile = grid.lastElementChild; // appended last
  updateSelection(customTile);
  showCustomPanel();
  updateButtonState();
}

function updateButtonState() {
  const coinsValid = Number.isFinite(selectedCoins) && selectedCoins > 0;
  topUpButton.disabled = !coinsValid;

  if (coinsValid) {
    const price = priceForCoins(selectedCoins);
    topUpButton.textContent = `Dobít – ${formatUsd(price)}`;
  } else {
    topUpButton.textContent = 'Dobít';
  }
}

function applyCustom() {
  const value = parseInt(customAmountInput.value, 10);
  if (!Number.isFinite(value) || value <= 0) {
    customAmountInput.focus();
    return;
  }
  selectedCoins = value;
  updateButtonState();
}

function startCountdown(durationSeconds = 300) {
  let remaining = durationSeconds;
  updateCountdownText(remaining);
  countdownTimer && clearInterval(countdownTimer);
  countdownTimer = setInterval(() => {
    remaining -= 1;
    if (remaining <= 0) {
      clearInterval(countdownTimer);
      remaining = 0;
    }
    updateCountdownText(remaining);
  }, 1000);
}

function updateCountdownText(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = Math.floor(seconds % 60).toString().padStart(2, '0');
  countdownText.textContent = `${m}:${s}`;
}

function openResultModal() {
  modal.classList.remove('hidden');
  startCountdown(300);
}

function closeResultModal() {
  modal.classList.add('hidden');
}

// Event listeners
applyCustomButton.addEventListener('click', applyCustom);
customAmountInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    applyCustom();
  }
});

topUpButton.addEventListener('click', () => {
  // In a real app, trigger payment flow here.
  openResultModal();
});

closeModalButton.addEventListener('click', () => {
  closeResultModal();
});

// Accessibility helper
const srStyle = document.createElement('style');
srStyle.innerHTML = `.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}`;
document.head.appendChild(srStyle);

// Initial render
renderGrid();

// Preselect first bundle
const firstTile = grid.querySelector('.bundle-tile');
if (firstTile) {
  firstTile.click();
}
