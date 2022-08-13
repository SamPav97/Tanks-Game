export async function createRenderer() {
    const images = {};
    const imgList = [
        'tank-body.png',
        'tracks0.png',
        'tracks1.png'
    ];
//    Go throug the list and for each file create an image resource in the object above.
    for (let img of imgList) {
        // Fetch will return response and blob also returns resp. Then I wil lget the images.
        images[img] = await createImageBitmap(await (await fetch(`/assets/${img}`)).blob());
    }


    const canvas = document.querySelector('canvas');
    /** @type {CanvasRenderingContext2D} */
    const ctx = canvas.getContext('2d');

    // Make sure pix are not stretched.
    ctx.font = '20px Consolas, sans-serif';
    ctx.imageSmoothingEnabled = false;
    //With step size we get spped in sec not mssec.
    const engine = {
        STEP_SIZE: 1000 /50,
        STEP_SIZE_S: 1/50,
        WIDTH: canvas.width,
        HEIGHT: canvas.height,
        clear,
        drawGrid,
        drawImage,
        drawCircle,
        drawText,
        onKey() {},
        registerMain(render, tick) {
            let last = performance.now();
            let delta = 0;

            main(last);
            //At start delta will incrase by one and animation will start. THIS IS MY MAIN GAME LOOP.
            function main(time) {
                delta += time - last;
                last = time;
                // To prevent the browser from blocking we always keep the delta low
                if(delta > 1000) {
                    delta = engine.STEP_SIZE;
                }
                while(delta >= engine.STEP_SIZE) {
                    delta -= engine.STEP_SIZE;
                    tick();
                }
                render();
                // requ will be called when browser is ready to render next frame.
                requestAnimationFrame(main);
            }
        }
    };

    // I dont just listen for key down event. Instead, I say start at key down until key is released. Its a duration event. 
    document.addEventListener('keydown', event => {
        engine.onKey(event.code, true);
    });

    document.addEventListener('keyup', event => {
        engine.onKey(event.code, false);
    });

    return engine

    function clear() {
        ctx.clearRect(0, 0, engine.WIDTH, engine.HEIGHT);
    }

    function drawGrid() {
        // X-Axis
        for (let x = 50; x < engine.WIDTH; x += 50) {
            ctx.beginPath();

            // Draw the grid
            ctx.moveTo(x, 0);
            ctx.lineTo(x, engine.HEIGHT);

            // Every 4th square is thicker

            if(x % 200 == 0) {
                ctx.strokeStyle = 'rgba(128, 128, 128, 0.5)';
            } else {
                ctx.strokeStyle = 'rgba(128, 128, 128, 0.25)';
            }
            ctx.stroke();

            ctx.closePath();
        }

        for (let y = 50; y < engine.HEIGHT; y += 50) {
            // Y-Axis
            ctx.beginPath();

            // Draw the grid
            ctx.moveTo(0, y);
            ctx.lineTo(engine.WIDTH, y);

            // Every 4th square is thicker

            if(y % 200 == 0) {
                ctx.strokeStyle = 'rgba(128, 128, 128, 0.5)';
            } else {
                ctx.strokeStyle = 'rgba(128, 128, 128, 0.25)';
            }
            ctx.stroke();

            ctx.closePath();
        }
    }

    function drawImage(imgName, x, y, scale, rotation) {
        //I rotate and move the canvas not the image.
        // .save saves the current location.
        ctx.save();

        //Rotate
        // Move to new coordinates.
        ctx.translate(x, y);
        ctx.rotate(rotation);
        const img = images[imgName];
        const w = img.width * scale;
        const h = img.height * scale;
        // I dont want it stretched but in original size so I multply it by scale.
        ctx.drawImage(img, -(w / 2), -(h / 2), w, h);
 

        ctx.restore();
    }

    function drawCircle(x, y, radius, color = 'red') {
        ctx.beginPath()
        ctx.fillStyle = color
        ctx.moveTo(x, y);
        //make circle
        ctx.ellipse(x, y, radius, radius, 0, 0, Math.PI * 2);
        ctx.fill()

        ctx.closePath();
    }

    function drawText(text, x, y, color = 'black') {
        ctx.fillStyle = color;
        ctx.fillText(text, x, y); 
    }
}

