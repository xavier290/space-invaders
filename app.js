document.addEventListener('DOMContentLoaded', () => {

    const grid = document.querySelector('.grid');
    const resultsDisplay = document.querySelector('#result');

    let currentShooterIndex = 202;
    let width = 15;
    let direction = 1;
    let invadersID;
    let aliensRemoved = [];
    let results = 0;

    for(let i=0; i < 225; i++) {
        const square = document.createElement('div');
        grid.appendChild(square);
    }

    const squares = Array.from(document.querySelectorAll('.grid div'));
    const alienInvaders = [
        0,1,2,3,4,5,6,7,8,9,
        15,16,17,18,19,20,21,22,23,24,
        30,31,32,33,34,35,36,37,38,39
    ]

    function addingAliens() {
        for (let i = 0; i < alienInvaders.length; i++) {
          if(!aliensRemoved.includes(i)) {
            squares[alienInvaders[i]].classList.add('invader')
          }
        }
      }
      
      addingAliens();

    function removingAliens() {
        for(let i=0; i<alienInvaders.length; i++) {
            squares[alienInvaders[i]].classList.remove('invader');
        }
    }

    squares[currentShooterIndex].classList.add('shooter');

    function moverShooter(e) {
        squares[currentShooterIndex].classList.remove('shooter');

        switch(e.keyCode) {
            case 37:
                if(currentShooterIndex % width !==0) currentShooterIndex -=1;
                break;
            case 39:
                if(currentShooterIndex % width < width -1) currentShooterIndex +=1;
                break;    
        }
        squares[currentShooterIndex].classList.add('shooter');
    }

    document.addEventListener('keydown', moverShooter);

    function gameFinished() {

        if (squares[currentShooterIndex].classList.contains('invader', 'shooter')) {

            resultsDisplay.textContent = ' Game Over';
            squares[currentShooterIndex].classList.add('boom');
            clearInterval(invadersID);
        }

        if(results === 150) {
            
            resultsDisplay.textContent = ' You Win!';
            clearInterval(invadersID);
        }

        for(let i=0; i <= alienInvaders.length -1; i++) {

            if(alienInvaders[i] > (squares.lenght - (width -1))) {

                resultsDisplay.textContent = ' Game Over';
                clearInterval(invadersID);
            }
        }

    }

    function moveInvaders() {
        const leftEdge = alienInvaders[0] % width === 0;
        const rightEdge = alienInvaders[alienInvaders.length -1] % width === width -1;

        if((leftEdge && direction === -1) || (rightEdge && direction === 1)) {
            direction = width 
        } else if(direction === width) {
            if(leftEdge) {
                direction = 1;
            } else {
                direction = -1;
            }
        }

        removingAliens();

        for(let i= 0; i<= alienInvaders.length -1; i++) {
            alienInvaders[i] += direction;
        }

        for(let i= 0; i<= alienInvaders.length -1; i++) {
            if (!aliensRemoved.includes(i)) {
                squares[alienInvaders[i]].classList.add('invader');
            }
        }

        gameFinished();
    }

    invadersID = setInterval(() => {
        moveInvaders();
    }, 500);

    function shooting(e) {

        let laserID;
        let currentLaserIndex = currentShooterIndex;

        function moveLaser() {

            squares[currentLaserIndex].classList.remove('laser');
            currentLaserIndex -= width;
            squares[currentLaserIndex].classList.add('laser');

            if(squares[currentLaserIndex].classList.contains('invader')) {

                squares[currentLaserIndex].classList.remove('laser');
                squares[currentLaserIndex].classList.remove('invader');
                squares[currentLaserIndex].classList.add('boom');

                setTimeout(() => {
                    squares[currentLaserIndex].classList.remove('boom');
                }, 250);

                clearInterval(laserID);

                const alienTakenDown = alienInvaders.indexOf(currentLaserIndex);
                aliensRemoved.push(alienTakenDown);

                results = results + 5;
                resultsDisplay.textContent = results;
            }

            if(currentLaserIndex < width) {
                clearInterval(laserID)
                setTimeout(() => {
                    squares[currentLaserIndex].classList.remove('laser');
                }, 100);
            }
        }
        switch(e.keyCode) {
            case 32:
                laserID = setInterval(moveLaser, 100);
                break;
        }
    }

    document.addEventListener('keyup', shooting);

})