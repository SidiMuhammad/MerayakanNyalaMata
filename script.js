var width, height, rows, columns, grid, gridSize, bigGridCount;
var canvas = document.querySelector('.canvas');
var paletteHex = ['#3C3C3C', '#B40000', '#E65A00', '#F0BE00'];
var shape = ['ellipse(50% 50% at 50% 50%)', 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)'];

document.addEventListener("DOMContentLoaded", responsive);
window.addEventListener("resize", responsive);

function responsive() {
    canvas.replaceChildren();
    width = window.innerWidth;
    height = window.innerHeight;
    if (width > height) {
        rows = 5;
        gridSize = Math.floor(height/rows);
        columns = Math.floor(width/gridSize);
    } else {
        columns = 5;
        gridSize = Math.floor(width/columns);
        rows = Math.floor(height/gridSize);
    }
    bigGridCount = Math.ceil(rows*columns/10);
    canvas.style.width = String(columns*gridSize)+'px';
    canvas.style.height = String(rows*gridSize)+'px';
    sketch();
    animate();
}

function sketch() {
    grid = [];
    for (var x = 1; x <= rows; x++) {
        for (var y = 1; y <= columns; y++) {
            var colorPalette = [0, 1, 2, 3];
            var color = anime.random(0, 3);
            colorPalette.splice(color, 1);
            var shapeColor = colorPalette[anime.random(0, 2)];
            grid.push({
                'x': x,
                'y': y,
                'size': 1,
                'eye': anime.random(0, 3),
                'color': color,
                'shape': anime.random(0, 1),
                'shapeColor': shapeColor
            });
        }
    }
    while (bigGridCount > 0) {
        var x = anime.random(1, rows-1);
        var y = anime.random(1, columns-1);
        var bigGridIndex = grid.findIndex(i => i.x == x && i.y == y);
        if (grid[bigGridIndex].size == 1 && grid[bigGridIndex+1].size == 1 && grid[bigGridIndex+columns].size == 1 && grid[bigGridIndex+columns+1].size == 1) {
            grid[bigGridIndex].size = 2;
            grid[bigGridIndex+1].size = 0;
            grid[bigGridIndex+columns].size = 0;
            grid[bigGridIndex+columns+1].size = 0;
            bigGridCount--;
        }
    }
    grid =  grid.filter(i => i.size > 0);
    for (var i = 0; i < grid.length; i++) {
        var gridArea;
        var eye = 'eye-'+String(grid[i].eye);
        if (grid[i].size == 1) {
            gridArea = String(grid[i].x)+'/'+String(grid[i].y);
        } else if (grid[i].size == 2) {
            gridArea = String(grid[i].x)+'/'+String(grid[i].y)+'/span 2/span 2';
        }
        draw(gridArea, eye, paletteHex[grid[i].color], shape[grid[i].shape], paletteHex[grid[i].shapeColor]);
    }
    console.log(grid.length);
}

function draw(gridArea, eye, color, gridShape, shapeColor) {
    var square = document.createElement('div');
    square.classList.add('grid', eye);
    square.style.gridArea = gridArea;
    square.style.backgroundColor = color;
    var form = document.createElement('div');
    form.style.backgroundColor = shapeColor;
    form.style.clipPath = gridShape;
    form.classList.add('shape');
    square.appendChild(form);
    canvas.appendChild(square);
}

function animate() {
    var random = anime.random(0, grid.length-1);
    var gridRandom = canvas.childNodes[random];
    var shapeRandom = gridRandom.firstChild;
    grid[random].color = (grid[random].color+1)%4;
    grid[random].shapeColor = (grid[random].shapeColor+1)%4;
    var clip;
    var clip2 = shape[grid[random].shape];
    if (grid[random].shape == 0) {
        clip = 'ellipse(50% 10% at 50% 50%)';
    } else {
        clip = 'polygon(50% 40%, 100% 50%, 50% 60%, 0% 50%)';
    }
    anime.timeline({
        easing: 'linear',
        delay: 2000,
        duration: 400,
        complete: function () {
            animate();
        } 
    })
    .add({targets: shapeRandom, keyframes: [{clipPath: clip}, {clipPath: clip2}]}, 0)
    .add({targets: gridRandom, backgroundColor: paletteHex[grid[random].color]}, 0)
    .add({targets: shapeRandom, backgroundColor: paletteHex[grid[random].shapeColor]}, 0);
}