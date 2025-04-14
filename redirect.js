document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const targetUrl = urlParams.get('target') || '';
  const siteName = urlParams.get('name') || 'this site';
  const waitTime = parseInt(urlParams.get('waitTime'), 10) || 30;

  document.getElementById('site-name').textContent = siteName;

  const timerElement = document.getElementById('timer');
  const continueBtn = document.getElementById('continue-btn');
  let secondsRemaining = waitTime;

  function updateTimerDisplay(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  updateTimerDisplay(secondsRemaining);
  
  const timerInterval = setInterval(() => {
    secondsRemaining--;
    
    updateTimerDisplay(secondsRemaining);
    
    if (secondsRemaining <= 0) {
      clearInterval(timerInterval);
      continueBtn.disabled = false;
      continueBtn.style.display = 'block';
    }
  }, 1000);

  continueBtn.addEventListener('click', () => {
    if (targetUrl) {
      window.location.href = targetUrl;
    }
  });
  continueBtn.style.display = 'block';
});