export async function createRenderer() {
    const canvas = document.querySelector('canvas');
    /** @type {CanvasRenderingContext2D} */
    const ctx = canvas.getContext('2d');

    const engine = {
        WIDTH: canvas.width,
        HEIGHT: canvas.height,
        clear,
        drawGrid
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
}