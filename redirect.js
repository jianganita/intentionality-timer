document.addEventListener('DOMContentLoaded', () => {
  loadStarArt();

  const largeStars = [
    document.getElementById('large-star-1'),
    document.getElementById('large-star-2'),
    document.getElementById('large-star-3'),
    document.getElementById('large-star-4'),
    document.getElementById('large-star-5'),
    document.getElementById('large-star-6')
  ];

  randomizeStarPositions(largeStars);

  function randomizeStarPositions(stars) {
    const positions = [];
    const minDistance = 25;
    
    stars.forEach(star => {
      let validPosition = false;
      let attempts = 0;
      let randomX, randomY;

      while (!validPosition && attempts < 50) {
        attempts++;
        const horizontalThird = Math.floor(Math.random() * 3);

        randomX = horizontalThird === 0 ? 5 + Math.random() * 20 : // left third
                 horizontalThird === 1 ? 35 + Math.random() * 20 : // middle third
                                         70 + Math.random() * 20;  // right third

        randomY = 5 + Math.random() * 80;

        validPosition = true;
        for (const pos of positions) {
          const distance = Math.sqrt(
            Math.pow(randomX - pos.x, 2) + 
            Math.pow(randomY - pos.y, 2)
          );
          
          if (distance < minDistance) {
            validPosition = false;
            break;
          }
        }
      }

      positions.push({ x: randomX, y: randomY });

      star.style.position = 'absolute';
      star.style.left = `${randomX}%`;
      star.style.top = `${randomY}%`;
    });
  }

  async function loadStarArt() {
    try {
      const starArt1 = await fetchStarArt('assets/star1.txt');
      const starArt2 = await fetchStarArt('assets/star2.txt');
      const starArt3 = await fetchStarArt('assets/star3.txt');
      const starArt4 = await fetchStarArt('assets/star4.txt');

      largeStars.forEach(star => {
        star.innerHTML = '';
      });

      // star 1
      const pre1 = document.createElement('pre');
      pre1.style.margin = '0';
      pre1.style.padding = '0';
      pre1.style.fontFamily = 'monospace';
      pre1.style.textAlign = 'left';
      pre1.innerHTML = starArt1.replace(/\n/g, '<br>').replace(/ /g, '&nbsp;');
      largeStars[0].appendChild(pre1);
      
      // star 2
      const pre2 = document.createElement('pre');
      pre2.style.margin = '0';
      pre2.style.padding = '0';
      pre2.style.fontFamily = 'monospace';
      pre2.style.textAlign = 'left';
      pre2.innerHTML = starArt2.replace(/\n/g, '<br>').replace(/ /g, '&nbsp;');
      largeStars[1].appendChild(pre2);
      
      // star 3
      const pre3 = document.createElement('pre');
      pre3.style.margin = '0';
      pre3.style.padding = '0';
      pre3.style.fontFamily = 'monospace';
      pre3.style.textAlign = 'left';
      pre3.innerHTML = starArt3.replace(/\n/g, '<br>').replace(/ /g, '&nbsp;');
      largeStars[2].appendChild(pre3);
      
      // star 4
      const pre4 = document.createElement('pre');
      pre4.style.margin = '0';
      pre4.style.padding = '0';
      pre4.style.fontFamily = 'monospace';
      pre4.style.textAlign = 'left';
      pre4.innerHTML = starArt4.replace(/\n/g, '<br>').replace(/ /g, '&nbsp;');
      largeStars[3].appendChild(pre4);
      
      // star 5
      const pre5 = document.createElement('pre');
      pre5.style.margin = '0';
      pre5.style.padding = '0';
      pre5.style.fontFamily = 'monospace';
      pre5.style.textAlign = 'left';
      pre5.innerHTML = starArt2.replace(/\n/g, '<br>').replace(/ /g, '&nbsp;');
      largeStars[4].appendChild(pre5);
      
      // star 6
      const pre6 = document.createElement('pre');
      pre6.style.margin = '0';
      pre6.style.padding = '0';
      pre6.style.fontFamily = 'monospace';
      pre6.style.textAlign = 'left';
      let star6Text = starArt3;
      const lines = star6Text.split('\n');
      if (lines.length > 0) {
        lines[0] = lines[0] + ' "';
        star6Text = lines.join('\n');
      }
      
      pre6.innerHTML = star6Text.replace(/\n/g, '<br>').replace(/ /g, '&nbsp;');
      largeStars[5].appendChild(pre6);
      
    } catch (error) {
      console.error('Error loading star art:', error);
      console.warn('Star art files could not be loaded. Please check that assets/star1.txt through assets/star4.txt are present.');
    }
  }

  async function fetchStarArt(fileName) {
    try {
      const response = await fetch(fileName);
      if (!response.ok) {
        throw new Error(`Failed to load ${fileName}: ${response.status}`);
      }
      return await response.text();
    } catch (error) {
      throw error;
    }
  }

  const urlParams = new URLSearchParams(window.location.search);
  const targetUrl = urlParams.get('target') || '';
  const siteName = urlParams.get('name') || 'this site';
  const waitTime = parseInt(urlParams.get('waitTime'), 10) || 30;

  document.getElementById('site-name').textContent = siteName;

  const timerElement = document.getElementById('timer');
  const continueBtn = document.getElementById('continue-btn');
  let secondsRemaining = waitTime;
  let animationFrameId = null;
  let startTime = Date.now();

  const starContainer = document.body;
  const starCharacters = ['*', '.', '+', 'o'];
  const starElements = [];
  const numStars = 70;

  for (let i = 0; i < numStars; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    star.textContent = starCharacters[Math.floor(Math.random() * starCharacters.length)];
    star.style.left = `${Math.random() * 100}vw`;
    star.style.top = `${Math.random() * 100}vh`;
    star.style.fontSize = `${8 + Math.random() * 12}px`;
    star.style.opacity = `${0.3 + Math.random() * 0.7}`;
    starContainer.appendChild(star);
    starElements.push({
      element: star,
      x: parseFloat(star.style.left),
      y: parseFloat(star.style.top),
      speed: 0.03 + Math.random() * 0.1
    });
  }

  let mouseX = 0;
  let mouseY = 0;
  
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animateStars() {
    starElements.forEach(star => {
      const rect = star.element.getBoundingClientRect();
      const currentX = rect.left;
      const currentY = rect.top;

      const deltaX = mouseX - currentX;
      const deltaY = mouseY - currentY;

      star.element.style.transform = `translate(${deltaX * star.speed * 0.5}px, ${deltaY * star.speed * 0.5}px)`;
    });
    
    requestAnimationFrame(animateStars);
  }
  
  animateStars();

  function animateThemeTransition() {
    const currentTime = Date.now();
    const elapsedTime = (currentTime - startTime) / 1000; // in seconds
    const remainingTime = Math.max(0, waitTime - elapsedTime);

    if (Math.floor(remainingTime) !== secondsRemaining) {
      secondsRemaining = Math.floor(remainingTime);
      updateTimerDisplay(secondsRemaining);
    }

    updateThemeBasedOnProgress(remainingTime, waitTime);

    if (remainingTime > 0) {
      animationFrameId = requestAnimationFrame(animateThemeTransition);
    } else {
      continueBtn.disabled = false;
      continueBtn.style.display = 'block';
      continueBtn.style.cursor = 'pointer';
    }
  }

  function updateTimerDisplay(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  function interpolateValue(value1, value2, factor) {
    return value1 * (1 - factor) + value2 * factor;
  }

  function updateThemeBasedOnProgress(secondsRemaining, totalSeconds) {
    // calculate progress (0 to 1, where 0 is start and 1 is end)
    const progress = 1 - (secondsRemaining / totalSeconds);

    if (progress >= 0.95) {
      document.body.className = 'dark-theme';

      document.body.style.backgroundColor = '#0d1117';
      document.body.style.color = '#c9d1d9';
      
      // update site name color
      const siteNameElements = document.querySelectorAll('.site-name');
      siteNameElements.forEach(el => {
        el.style.color = '#dddddd';
      });
      
      // update timer color
      const timer = document.getElementById('timer');
      if (timer) timer.style.color = '#c9d1d9';
      
      // update headings
      const headings = document.querySelectorAll('h1');
      headings.forEach(el => {
        el.style.color = '#c9d1d9';
      });
      
      // update messages
      const messages = document.querySelectorAll('.message');
      messages.forEach(el => {
        el.style.color = '#c9d1d9';
      });
      
      // update button
      const continueButton = document.getElementById('continue-btn');
      if (continueButton) {
        continueButton.style.backgroundColor = '#333333';
        continueButton.style.color = 'white';
      }
      
      // update stars
      const largeStarElements = document.querySelectorAll('.large-star');
      largeStarElements.forEach(el => {
        el.style.color = 'rgba(255, 255, 255, 0.2)';
      });
      
      const smallStarElements = document.querySelectorAll('.star');
      smallStarElements.forEach(el => {
        el.style.color = 'white';
      });
    } else {
      // darkening
      document.body.className = '';

      let backgroundColor, textColor;
      
      if (progress < 0.4) {
        // day phase: light background, dark text
        backgroundColor = interpolateColor('#fcfcf7', '#b8c2cc', progress / 0.4);
        textColor = interpolateColor('#333333', '#222222', progress / 0.4);
      } else {
        // night phase: transition to dark blue then black
        const nightProgress = (progress - 0.4) / 0.6;
        backgroundColor = interpolateColor('#b8c2cc', '#0d1117', nightProgress);
        textColor = interpolateColor('#222222', '#c9d1d9', nightProgress);
      }

      let starColorOpacity, largeStarColor;
      if (progress < 0.3) {
        // day
        starColorOpacity = interpolateValue(0.15, 0.4, progress / 0.3);
        const earlyWhiteFactor = Math.pow(progress / 0.3, 2) * 0.3;
        if (progress < 0.15) {
          largeStarColor = `rgba(0, 0, 0, ${starColorOpacity})`;
        } else {
          largeStarColor = `rgba(${Math.round(255 * earlyWhiteFactor)}, ${Math.round(255 * earlyWhiteFactor)}, ${Math.round(255 * earlyWhiteFactor)}, ${starColorOpacity})`;
        }
      } else {
        // night
        const nightProgress = (progress - 0.3) / 0.7;
        starColorOpacity = interpolateValue(0.4, 0.8, nightProgress);

        const whiteFactor = Math.min(1, nightProgress * 3);
        largeStarColor = `rgba(${Math.round(255 * whiteFactor)}, ${Math.round(255 * whiteFactor)}, ${Math.round(255 * whiteFactor)}, ${starColorOpacity * 0.5})`;
      }

      let buttonColor;
      if (progress < 0.5) {
        buttonColor = interpolateColor('#555555', '#444444', progress / 0.5);
      } else {
        buttonColor = interpolateColor('#444444', '#333333', (progress - 0.5) / 0.5);
      }

      let smallStarColor;
      if (progress < 0.1) {
        smallStarColor = '#888888';
      } else if (progress < 0.7) {
        const starProgress = (progress - 0.1) / 0.6;
        smallStarColor = interpolateColor('#888888', 'white', starProgress);
      } else {
        smallStarColor = 'white';
      }

      document.body.style.backgroundColor = backgroundColor;
      document.body.style.color = textColor;

      const siteNameElements = document.querySelectorAll('.site-name');
      let siteNameColor;
      if (progress < 0.35) {
        siteNameColor = '#555555';
      } else if (progress < 0.6) {
        siteNameColor = interpolateColor('#555555', '#ffffff', (progress - 0.35) / 0.25);
      } else {
        siteNameColor = interpolateColor('#ffffff', '#dddddd', (progress - 0.6) / 0.4);
      }
      
      siteNameElements.forEach(el => {
        el.style.color = siteNameColor;
      });

      const timer = document.getElementById('timer');
      if (timer) timer.style.color = textColor;

      const headings = document.querySelectorAll('h1');
      headings.forEach(el => {
        el.style.color = textColor;
      });

      const messages = document.querySelectorAll('.message');
      messages.forEach(el => {
        el.style.color = textColor;
      });

      const continueButton = document.getElementById('continue-btn');
      if (continueButton) {
        continueButton.style.backgroundColor = buttonColor;
        continueButton.style.color = 'white'; // Button text stays white
      }

      const largeStarElements = document.querySelectorAll('.large-star');
      largeStarElements.forEach(el => {
        el.style.color = largeStarColor;
      });

      const smallStarElements = document.querySelectorAll('.star');
      smallStarElements.forEach(el => {
        el.style.color = smallStarColor;
      });
    }
  }

  function interpolateColor(color1, color2, factor) {
    if (color1.startsWith('rgba') && color2.startsWith('rgba')) {
      const rgba1 = color1.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/);
      const rgba2 = color2.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/);
      
      if (rgba1 && rgba2) {
        const r = Math.round(parseInt(rgba1[1]) * (1 - factor) + parseInt(rgba2[1]) * factor);
        const g = Math.round(parseInt(rgba1[2]) * (1 - factor) + parseInt(rgba2[2]) * factor);
        const b = Math.round(parseInt(rgba1[3]) * (1 - factor) + parseInt(rgba2[3]) * factor);
        const a = parseFloat(rgba1[4]) * (1 - factor) + parseFloat(rgba2[4]) * factor;
        
        return `rgba(${r}, ${g}, ${b}, ${a.toFixed(2)})`;
      }
    }

    function hexToRgb(hex) {
      const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
      hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
      
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : null;
    }
    
    const color1Rgb = hexToRgb(color1) || { r: 0, g: 0, b: 0 };
    const color2Rgb = hexToRgb(color2) || { r: 0, g: 0, b: 0 };
    
    const r = Math.round(color1Rgb.r * (1 - factor) + color2Rgb.r * factor);
    const g = Math.round(color1Rgb.g * (1 - factor) + color2Rgb.g * factor);
    const b = Math.round(color1Rgb.b * (1 - factor) + color2Rgb.b * factor);
    
    return `rgb(${r}, ${g}, ${b})`;
  }
  
  startTime = Date.now();
  animateThemeTransition();

  continueBtn.addEventListener('click', () => {
    if (!continueBtn.disabled && targetUrl) {
      window.location.href = targetUrl;
    }
  });

  continueBtn.style.display = 'block';

  window.addEventListener('beforeunload', () => {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }
  });
});