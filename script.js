(function(){
  const pricePerCoinUSD = 1/70; // ≈0.0142857 USD/coin

  const predefinedPackages = [20, 70, 350, 700, 1400, 3500, 7000, 17500];

  const gridEl = document.getElementById('packagesGrid');
  const topupBtn = document.getElementById('topupBtn');
  const recipientInput = document.getElementById('recipientInput');
  const modalEl = document.getElementById('modal');
  const countdownEl = document.getElementById('countdown');
  const modalRecipientEl = document.getElementById('modalRecipient');
  const closeModalBtn = document.getElementById('closeModalBtn');

  let selectedCoins = 0;
  let countdownInterval = null;

  function formatUsd(amount){
    return `$${amount.toFixed(2)}`;
  }

  function calcPriceUSD(coins){
    // Round to cents; simulate minor tier rounding similar to screenshot
    const raw = coins * pricePerCoinUSD;
    return Math.round(raw * 100) / 100;
  }

  function renderTile(amount){
    const tile = document.createElement('button');
    tile.type = 'button';
    tile.className = 'tile';
    tile.setAttribute('data-coins', String(amount));

    tile.innerHTML = `
      <div class="coins"><span class="coin">🪙</span> ${amount.toLocaleString('cs-CZ')}</div>
      <div class="price">${formatUsd(calcPriceUSD(amount))}</div>
    `;

    tile.addEventListener('click', () => selectCoins(amount, tile));
    return tile;
  }

  function renderCustomTile(){
    const tile = document.createElement('div');
    tile.className = 'tile custom';

    tile.innerHTML = `
      <div class="custom-title">Custom</div>
      <div class="custom-sub">Podporována větší množství</div>
      <input class="custom-input" type="number" min="1" step="1" placeholder="Zadej mince"/>
      <div class="price" data-custom-price></div>
    `;

    const input = tile.querySelector('input');
    const priceEl = tile.querySelector('[data-custom-price]');

    input.addEventListener('input', () => {
      const val = parseInt(input.value, 10);
      if(Number.isFinite(val) && val > 0){
        priceEl.textContent = formatUsd(calcPriceUSD(val));
        selectCoins(val, tile);
      } else {
        priceEl.textContent = '';
        selectedCoins = 0;
        updateSelection(tile);
      }
    });

    tile.addEventListener('click', (e) => {
      // Avoid double select on input changes
      if(e.target === input) return;
      input.focus();
    });

    tile.setAttribute('data-custom', 'true');
    return tile;
  }

  function updateSelection(activeTile){
    const all = gridEl.querySelectorAll('.tile');
    all.forEach(t => t.classList.remove('selected'));
    if(activeTile) activeTile.classList.add('selected');
    topupBtn.disabled = selectedCoins <= 0;
  }

  function selectCoins(amount, tile){
    selectedCoins = amount;
    updateSelection(tile);
  }

  function buildGrid(){
    gridEl.innerHTML = '';
    // First row: 20, 70, 350
    predefinedPackages.forEach(amount => gridEl.appendChild(renderTile(amount)));
    gridEl.appendChild(renderCustomTile());
  }

  function openModal(){
    const price = calcPriceUSD(selectedCoins);
    const recipient = (recipientInput.value || '').trim();
    if(recipient){
      modalRecipientEl.textContent = `Příjemce: ${recipient} • ${selectedCoins.toLocaleString('cs-CZ')} 🪙 • ${formatUsd(price)}`;
    } else {
      modalRecipientEl.textContent = `Pro vás • ${selectedCoins.toLocaleString('cs-CZ')} 🪙 • ${formatUsd(price)}`;
    }

    modalEl.classList.remove('hidden');
    startCountdown(5*60);
  }

  function closeModal(){
    stopCountdown();
    modalEl.classList.add('hidden');
  }

  function startCountdown(seconds){
    let remaining = seconds;
    updateCountdownText(remaining);
    countdownInterval = setInterval(() => {
      remaining -= 1;
      if(remaining <= 0){
        remaining = 0;
        updateCountdownText(remaining);
        stopCountdown();
      } else {
        updateCountdownText(remaining);
      }
    }, 1000);
  }

  function stopCountdown(){
    if(countdownInterval){
      clearInterval(countdownInterval);
      countdownInterval = null;
    }
  }

  function updateCountdownText(totalSeconds){
    const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const s = Math.floor(totalSeconds % 60).toString().padStart(2, '0');
    countdownEl.textContent = `${m}:${s}`;
  }

  // Event wiring
  topupBtn.addEventListener('click', () => {
    if(selectedCoins > 0){
      openModal();
    }
  });
  closeModalBtn.addEventListener('click', closeModal);

  // Init
  buildGrid();
})();
