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

    const engine = {
        WIDTH: canvas.width,
        HEIGHT: canvas.height,
        clear,
        drawGrid,
        drawImage
    };

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

        // Move to new cords.
        ctx.translate(x, y);
        const img = images[imgName];
        // I dont want it stretched but in original size so I multply it by scale.
        ctx.drawImage(img, 0, 0, img.width * scale, img.height * scale);


        ctx.restore();
    }
}