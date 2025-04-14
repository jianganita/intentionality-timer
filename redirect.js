document.addEventListener('DOMContentLoaded', () => {
  // Load ASCII art stars from text files
  loadStarArt();
  
  // Get references to the star elements
  const largeStars = [
    document.getElementById('large-star-1'),
    document.getElementById('large-star-2'),
    document.getElementById('large-star-3'),
    document.getElementById('large-star-4'),
    document.getElementById('large-star-5'),
    document.getElementById('large-star-6')
  ];
  
  // Randomize positions of large stars
  randomizeStarPositions(largeStars);
  
  // Function to randomly position the large stars
  function randomizeStarPositions(stars) {
    // Create a grid system to ensure better distribution and no overlaps
    const positions = [];
    const minDistance = 25; // Minimum distance between stars (percentage of viewport)
    
    stars.forEach(star => {
      let validPosition = false;
      let attempts = 0;
      let randomX, randomY;
      
      // Try to find a valid position that doesn't overlap with existing stars
      while (!validPosition && attempts < 50) {
        attempts++;
        
        // Ensure stars are distributed across all horizontal thirds
        // Determine which third this star will go in (0, 1, 2)
        const horizontalThird = Math.floor(Math.random() * 3);
        
        // Calculate position within that third (5-25%, 35-55%, or 70-90%)
        randomX = horizontalThird === 0 ? 5 + Math.random() * 20 : // Left third
                 horizontalThird === 1 ? 35 + Math.random() * 20 : // Middle third
                                         70 + Math.random() * 20;  // Right third
        
        // Get vertical position (5-85% to avoid edge clipping)
        randomY = 5 + Math.random() * 80;
        
        // Check distance from all existing stars to prevent overlap
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
      
      // Save this position
      positions.push({ x: randomX, y: randomY });
      
      // Apply the position to the star
      star.style.position = 'absolute';
      star.style.left = `${randomX}%`;
      star.style.top = `${randomY}%`;
    });
  }
  
  // Function to load star art from text files
  async function loadStarArt() {
    try {
      // Load star art from text files in the assets folder
      const starArt1 = await fetchStarArt('assets/star1.txt');
      const starArt2 = await fetchStarArt('assets/star2.txt');
      const starArt3 = await fetchStarArt('assets/star3.txt');
      const starArt4 = await fetchStarArt('assets/star4.txt');
      
      // Clear any existing content in all stars
      largeStars.forEach(star => {
        star.innerHTML = '';
      });
      
      // Create a code element for each star to properly preserve ASCII art
      // Star 1
      const pre1 = document.createElement('pre');
      pre1.style.margin = '0';
      pre1.style.padding = '0';
      pre1.style.fontFamily = 'monospace';
      pre1.style.textAlign = 'left';
      pre1.innerHTML = starArt1.replace(/\n/g, '<br>').replace(/ /g, '&nbsp;');
      largeStars[0].appendChild(pre1);
      
      // Star 2
      const pre2 = document.createElement('pre');
      pre2.style.margin = '0';
      pre2.style.padding = '0';
      pre2.style.fontFamily = 'monospace';
      pre2.style.textAlign = 'left';
      pre2.innerHTML = starArt2.replace(/\n/g, '<br>').replace(/ /g, '&nbsp;');
      largeStars[1].appendChild(pre2);
      
      // Star 3
      const pre3 = document.createElement('pre');
      pre3.style.margin = '0';
      pre3.style.padding = '0';
      pre3.style.fontFamily = 'monospace';
      pre3.style.textAlign = 'left';
      pre3.innerHTML = starArt3.replace(/\n/g, '<br>').replace(/ /g, '&nbsp;');
      largeStars[2].appendChild(pre3);
      
      // Star 4
      const pre4 = document.createElement('pre');
      pre4.style.margin = '0';
      pre4.style.padding = '0';
      pre4.style.fontFamily = 'monospace';
      pre4.style.textAlign = 'left';
      pre4.innerHTML = starArt4.replace(/\n/g, '<br>').replace(/ /g, '&nbsp;');
      largeStars[3].appendChild(pre4);
      
      // Star 5 (reuse star2 design)
      const pre5 = document.createElement('pre');
      pre5.style.margin = '0';
      pre5.style.padding = '0';
      pre5.style.fontFamily = 'monospace';
      pre5.style.textAlign = 'left';
      pre5.innerHTML = starArt2.replace(/\n/g, '<br>').replace(/ /g, '&nbsp;');
      largeStars[4].appendChild(pre5);
      
      // Star 6 (modified star3)
      const pre6 = document.createElement('pre');
      pre6.style.margin = '0';
      pre6.style.padding = '0';
      pre6.style.fontFamily = 'monospace';
      pre6.style.textAlign = 'left';
      
      // Modify star 6 text (add quote mark)
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
      // Just display empty stars if loading fails
      console.warn('Star art files could not be loaded. Please check that assets/star1.txt through assets/star4.txt are present.');
    }
  }
  
  // Fetch star art from text file
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
  
  // Parse URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const targetUrl = urlParams.get('target') || '';
  const siteName = urlParams.get('name') || 'this site';
  const waitTime = parseInt(urlParams.get('waitTime'), 10) || 30;
  
  // Set the site name in the page
  document.getElementById('site-name').textContent = siteName;
  
  // Set up timer
  const timerElement = document.getElementById('timer');
  const continueBtn = document.getElementById('continue-btn');
  let secondsRemaining = waitTime;
  
  // Create ASCII stars that follow cursor
  const starContainer = document.body;
  const starCharacters = ['*', '.', '+', 'o'];
  const starElements = [];
  const numStars = 70;
  
  // Create stars
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
  
  // Handle mouse movement for stars
  let mouseX = 0;
  let mouseY = 0;
  
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });
  
  // Animate stars to follow cursor slightly
  function animateStars() {
    starElements.forEach(star => {
      const rect = star.element.getBoundingClientRect();
      const currentX = rect.left;
      const currentY = rect.top;
      
      // Calculate direction to mouse
      const deltaX = mouseX - currentX;
      const deltaY = mouseY - currentY;
      
      // Apply transformation with slight movement toward cursor
      star.element.style.transform = `translate(${deltaX * star.speed * 0.5}px, ${deltaY * star.speed * 0.5}px)`;
    });
    
    requestAnimationFrame(animateStars);
  }
  
  animateStars();
  
  // Update timer display
  function updateTimerDisplay(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
  
  // Start the timer
  updateTimerDisplay(secondsRemaining);
  
  const timerInterval = setInterval(() => {
    secondsRemaining--;
    
    updateTimerDisplay(secondsRemaining);
    
    if (secondsRemaining <= 0) {
      clearInterval(timerInterval);
      continueBtn.disabled = false;
      continueBtn.style.display = 'block';
      continueBtn.style.cursor = 'pointer';
    }
  }, 1000);
  
  // Set up continue button
  continueBtn.addEventListener('click', () => {
    if (!continueBtn.disabled && targetUrl) {
      window.location.href = targetUrl;
    }
  });
  
  // Show the continue button (but keep it disabled until timer finishes)
  continueBtn.style.display = 'block';
});