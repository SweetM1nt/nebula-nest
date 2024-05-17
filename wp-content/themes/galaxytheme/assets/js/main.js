$(document).ready(function() {

    // Scroll animations
    var lastScrollTop = 0;
    $(window).scroll(function() {
        var currentScrollTop = $(this).scrollTop();        
        var socialMediaBar = $('#social-media-bar');
        var header = $('#header');
        if (currentScrollTop > lastScrollTop) {
            // scrolling down
            socialMediaBar.css('opacity', '0');
        } else {
            // scrolling up
            socialMediaBar.css('opacity', '1');
        }
        lastScrollTop = currentScrollTop;
    });

    // AOS
    AOS.init();

    // What we do image effect
    if (document.getElementById('whatwedo-image')) {
        document.addEventListener('mousemove', function(e) {
            var image = document.getElementById('whatwedo-image');
            if (!image) {
                return;
            }
            var mouseX = e.clientX;
            var mouseY = e.clientY;
            var imageX = image.offsetLeft + image.offsetWidth / 2;
            var imageY = image.offsetTop + image.offsetHeight / 2;
    
            var dx = (imageX - mouseX) / 300; // Adjust the division factor to make the movement less dramatic
            var dy = (imageY - mouseY) / 300; // Adjust the division factor to make the movement less dramatic
    
            image.style.transform = 'translate(' + dx + 'px,' + dy + 'px)';
        });
    }



    // PIXI.js
    let app = new PIXI.Application({ 
        width: window.innerWidth, 
        height: window.innerHeight,
        transparent: false,
        background: '#04090c'
    });

    document.getElementById('pixi-canvas').appendChild(app.view);

    let amountOfStars = 80;
    let minStarSize = 1;
    let maxStarSize = 3;
    let stars = [];

    const colorWhite = { r: 1, g: 1, b: 1 };
    const colorPurple = { r: 158 / 255, g: 105 / 255, b: 255 / 255 };

    for (let i = 0; i < amountOfStars; i++) {
        let star = new PIXI.Graphics();
        let minSize = Math.random() * (maxStarSize - minStarSize) + minStarSize;
        let maxSize = Math.random() * (maxStarSize - minSize) + minSize;
        let size = Math.random() * (maxSize - minSize) + minSize;
        let x = Math.random() * window.innerWidth;
        let y = Math.random() * window.innerHeight;

        star.beginFill(0xFFFFFF);
        star.drawCircle(x, y, size);
        star.endFill();

        let deathTime = Math.random() * 8 + 2;

        stars.push({
            star: star,
            x: x,
            y: y,
            size: size,
            deathTime: deathTime
        });

        app.stage.addChild(star);

        // Store the original size of the star
        stars[i].minSize = minSize;
        stars[i].maxSize = maxSize;
        // Set a random speed for the star's growth/shrink animation
        stars[i].speed = Math.random() * 0.05 + 0.01;
        // Set a random direction for the star's growth/shrink animation
        stars[i].direction = Math.random() > 0.5 ? 1 : -1;
    }

    let mousePosition = { x: 0, y: 0 };

    window.addEventListener('mousemove', (event) => {
        let rect = app.view.getBoundingClientRect();
        mousePosition.x = event.clientX - rect.left;
        mousePosition.y = event.clientY - rect.top;
    });

    app.ticker.add(() => {
        for (let i = 0; i < amountOfStars; i++) {
            let star = stars[i].star;

            if (stars[i].deathTime <= 0) {
                stars[i].size -= stars[i].speed;
                if (stars[i].size < 0) {
                    stars[i].size = 0.1;

                    stars[i].deathTime = Math.random() * 12 + 3;
                    stars[i].x = Math.random() * window.innerWidth;
                    stars[i].y = Math.random() * window.innerHeight;
                }
            } else {
                stars[i].deathTime -= app.ticker.deltaMS / 1000;
                stars[i].size += stars[i].speed * stars[i].direction;
                // If the star has grown too large or shrunk too small, reverse its direction
                if (stars[i].size > stars[i].maxSize) {
                    stars[i].direction = -1;
                } else if (stars[i].size < stars[i].minSize) {
                    stars[i].direction = 1;
                }
            }

            // Clear the previous graphics
            star.clear();

            // Draw the star with the new size
            star.beginFill(0xFFFFFF);
            star.drawCircle(stars[i].x, stars[i].y, stars[i].size);
            star.endFill();

            // Calculate the distance between the star and the mouse
            let dx = stars[i].x - mousePosition.x;
            let dy = stars[i].y - mousePosition.y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            // If the distance is within a certain range, draw a line between the star and the mouse
            let range = 200; // Adjust this value to change the range
            if (distance < range) {
                let lineThickness = Math.min(((range / distance) * stars[i].size * 0.2), 1) // The line becomes thicker as the mouse gets closer
                star.lineStyle(lineThickness, 0xFFFFFF, 1);
                star.moveTo(stars[i].x, stars[i].y);
                star.lineTo(mousePosition.x, mousePosition.y);
            }
        }
    });

    let gasContainer = new PIXI.Container();
    app.stage.addChild(gasContainer);

    // Create an array to store the gas particles
    let gasParticles = [];

    // Define the position for the particles to float around
    let floatX = window.innerWidth / 2;
    let floatY = (window.innerHeight / 2) - 50;

    // Define the radius for the particles to spawn and move within
    let radius = 100;

    // Create a planet-like object
    let planet = new PIXI.Graphics();
    planet.beginFill(0xFFA500);
    planet.drawCircle(0, 0, 50); // Radius of 50
    planet.endFill();
    planet.x = floatX;
    planet.y = floatY;
    app.stage.addChild(planet);

    // Create the gas particles
    for (let i = 0; i < 100; i++) {
        let gasParticle = new PIXI.Graphics();
        gasParticle.beginFill(0x800080, 0.1);
        let size = Math.random() * 20 + 10;
        gasParticle.drawCircle(0, 0, size);
        gasParticle.endFill();
        gasParticle.x = floatX + (Math.random() - 0.5) * radius;
        gasParticle.y = floatY + (Math.random() - 0.5) * radius;
        gasParticle.vx = 0; // Add a velocity property in the x direction
        gasParticle.vy = 0; // Add a velocity property in the y direction
        gasParticle.speed = 1/size; // Set the speed inversely proportional to the size

        // Half the particles should be behind the planet
        if (i < 50) {
            gasContainer.addChild(gasParticle);
        } else {
            app.stage.addChild(gasParticle);
        }

        gasParticles.push(gasParticle);
    }

    let maxGasVelocity = 2;

    // Update the gas particles in the game loop
    app.ticker.add(() => {
        // Calculate the average position of all particles
        let averageX = 0;
        let averageY = 0;
        for (let i = 0; i < gasParticles.length; i++) {
            averageX += gasParticles[i].x;
            averageY += gasParticles[i].y;
        }
        averageX /= gasParticles.length;
        averageY /= gasParticles.length;
    
        for (let i = 0; i < gasParticles.length; i++) {
            // Calculate the distance to the mouse
            let distanceToMouse = Math.sqrt(Math.pow(gasParticles[i].x - mousePosition.x, 2) + Math.pow(gasParticles[i].y - mousePosition.y, 2));
    
            // If the mouse is close, repel the gas particle
            if (distanceToMouse < 50) {
                let angleToMouse = Math.atan2(gasParticles[i].y - mousePosition.y, gasParticles[i].x - mousePosition.x);
                gasParticles[i].vx += Math.cos(angleToMouse) * 0.1;
                gasParticles[i].vy += Math.sin(angleToMouse) * 0.1;
            }
            else {
                // Move the gas particle slowly in a random direction
                gasParticles[i].vx += gasParticles[i].speed * (Math.random() - 0.5) * 0.05;
                gasParticles[i].vy += gasParticles[i].speed * (Math.random() - 0.5) * 0.05;
            }
    
            // Add repulsion from the average position of all particles
            let distanceToAverage = Math.sqrt(Math.pow(gasParticles[i].x - averageX, 2) + Math.pow(gasParticles[i].y - averageY, 2));
            if (distanceToAverage < 10) {
                let angleToAverage = Math.atan2(gasParticles[i].y - averageY, gasParticles[i].x - averageX);
                gasParticles[i].vx += Math.cos(angleToAverage) * 0.001;
                gasParticles[i].vy += Math.sin(angleToAverage) * 0.001;
            }
    
            // Limit the velocity to the maximum velocity
            let speed = Math.sqrt(gasParticles[i].vx * gasParticles[i].vx + gasParticles[i].vy * gasParticles[i].vy);
            if (speed > maxGasVelocity) {
                gasParticles[i].vx = (gasParticles[i].vx / speed) * maxGasVelocity;
                gasParticles[i].vy = (gasParticles[i].vy / speed) * maxGasVelocity;
            }
    
            // Update the position based on the velocity
            gasParticles[i].x += gasParticles[i].vx;
            gasParticles[i].y += gasParticles[i].vy;
    
            // If the gas particle has moved outside the radius and the mouse is not close, move it back
            let distanceFromCenter = Math.sqrt(Math.pow(gasParticles[i].x - floatX, 2) + Math.pow(gasParticles[i].y - floatY, 2));
            if (distanceFromCenter > radius && distanceToMouse > 50) {
                let angle = Math.atan2(gasParticles[i].y - floatY, gasParticles[i].x - floatX);
                gasParticles[i].vx -= Math.cos(angle) * 0.01;
                gasParticles[i].vy -= Math.sin(angle) * 0.01;
            }
    
            // Add a damping factor when the particle is close to the center
            if (distanceFromCenter < 50) {
                let speed = Math.sqrt(gasParticles[i].vx * gasParticles[i].vx + gasParticles[i].vy * gasParticles[i].vy);
                let dampingFactor = 0.9;
                let minSpeed = 0.1; // Set the minimum speed
    
                // Apply the damping factor
                gasParticles[i].vx *= dampingFactor;
                gasParticles[i].vy *= dampingFactor;
    
                // If the speed falls below the minimum speed, set it to the minimum speed
                if (speed < minSpeed) {
                    gasParticles[i].vx = (gasParticles[i].vx / speed) * minSpeed;
                    gasParticles[i].vy = (gasParticles[i].vy / speed) * minSpeed;
                }
            }
        }
    });
});