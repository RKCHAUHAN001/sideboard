/** 1. CSS STYLES SECTION **/
const STYLES = `
<style>
    body { background-color: #1e1e1e; color: white; margin: 0; padding: 0; font-family: sans-serif; overflow: hidden; }
    
    #toolbar { 
        background: #252526; 
        padding: 6px 10px; 
        border-bottom: 1px solid #3c3c3c; 
        display: flex; 
        flex-wrap: wrap; 
        gap: 8px; 
        align-items: center; 
        z-index: 100;
        position: relative;
    }

    .control-group { 
        display: flex; 
        align-items: center; 
        gap: 6px; 
        padding: 2px 6px;
        background: #2d2d2d;
        border-radius: 4px;
        border: 1px solid #3c3c3c;
    }

    .label { font-size: 10px; color: #aaa; text-transform: uppercase; font-weight: bold; user-select: none; }
    #canvas-container { width: 100vw; height: 100vh; overflow: auto; background: #1e1e1e; }
    
    canvas { 
        cursor: none; 
        background-image: radial-gradient(#333 1px, transparent 1px); 
        background-size: 20px 20px; 
        transform-origin: 0 0; 
    }
    
    #cursor-preview {
        position: fixed; border: 1px solid #569cd6; border-radius: 50%;
        pointer-events: none; z-index: 1000; transform: translate(-50%, -50%); display: none;
    }
    
    button, select, input { 
        background: #3c3c3c; color: #cccccc; border: 1px solid #454545; 
        padding: 4px 6px; border-radius: 3px; font-size: 12px; outline: none;
    }

    button:hover, select:hover { background: #454545; color: white; border-color: #007acc; }
    input[type=range] { width: 60px; height: 4px; cursor: pointer; accent-color: #007acc; }
    #zoomText { font-size: 11px; color: #007acc; font-weight: bold; min-width: 32px; text-align: center; }

    @media (max-width: 400px) { .label { display: none; } }
</style>
`;

/** 2. HTML STRUCTURE SECTION (Clear All Removed) **/
const HTML_BODY = `
<div id="cursor-preview"></div>
<div id="toolbar">
    <div class="control-group">
        <span class="label">Shapes</span>
        <select id="toolSelect">
            <option value="draw">✏️ Pen</option>
            <option value="rect">🟦 Rect</option>
            <option value="square">🟧 Square</option>
            <option value="circle">⚪ Circle</option>
            <option value="triangle">🔺 Triangle</option>
        </select>
    </div>

    <div class="control-group">
        <span class="label">Erasers</span>
        <select id="eraserSelect">
            <option value="none">---</option>
            <option value="stroke">🧹 Stroke</option>
            <option value="object">🎯 Object</option>
        </select>
    </div>

    <div class="control-group">
        <span class="label">Size</span>
        <input type="range" id="sizeSlider" min="2" max="100" value="5">
        <span id="sizeVal" style="font-size:11px; min-width:25px">5px</span>
    </div>

    <div class="control-group">
        <button onclick="changeZoom(-0.1)">➖</button>
        <span id="zoomText">100%</span>
        <button onclick="changeZoom(0.1)">➕</button>
    </div>
</div>
<div id="canvas-container"><canvas id="canvas"></canvas></div>
`;

/** 3. JAVASCRIPT ENGINE SECTION **/
const SCRIPTS = `
<script>
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const toolSelect = document.getElementById('toolSelect');
    const eraserSelect = document.getElementById('eraserSelect');
    const sizeSlider = document.getElementById('sizeSlider');
    const sizeVal = document.getElementById('sizeVal');
    const cursorPreview = document.getElementById('cursor-preview');

    let scale = 1.0;
    let drawing = false;
    let startX, startY;
    let shapes = [];
    let currentPath = [];

    function init() {
        canvas.width = 4000; canvas.height = 4000;
        redraw();
    }

    function getMousePos(e) {
        const rect = canvas.getBoundingClientRect();
        return { x: (e.clientX - rect.left) / scale, y: (e.clientY - rect.top) / scale };
    }

    function changeZoom(amount) {
        scale = Math.min(Math.max(0.2, scale + amount), 3);
        canvas.style.transform = 'scale(' + scale + ')';
        document.getElementById('zoomText').innerText = Math.round(scale * 100) + '%';
    }

    window.addEventListener('mousemove', (e) => {
        cursorPreview.style.display = 'block';
        cursorPreview.style.left = e.clientX + 'px';
        cursorPreview.style.top = e.clientY + 'px';
        const baseSize = eraserSelect.value === 'object' ? 10 : sizeSlider.value;
        const displaySize = baseSize * scale;
        cursorPreview.style.width = displaySize + 'px';
        cursorPreview.style.height = displaySize + 'px';
        cursorPreview.style.borderColor = eraserSelect.value !== 'none' ? '#ff5555' : '#569cd6';
    });

    sizeSlider.oninput = () => { sizeVal.innerText = sizeSlider.value + 'px'; };
    toolSelect.onchange = () => { if(toolSelect.value !== 'draw') eraserSelect.value = 'none'; };
    eraserSelect.onchange = () => { if(eraserSelect.value !== 'none') toolSelect.value = 'draw'; };

    canvas.addEventListener('mousedown', (e) => {
        const pos = getMousePos(e);
        if (eraserSelect.value === 'object') {
            deleteObjectAt(pos.x, pos.y);
            drawing = false; 
            return;
        }
        drawing = true;
        startX = pos.x; startY = pos.y;
        currentPath = [{x: pos.x, y: pos.y}];
    });

    canvas.addEventListener('mousemove', (e) => {
        if (!drawing) return;
        const pos = getMousePos(e);
        if (toolSelect.value === 'draw' || eraserSelect.value === 'stroke') {
            currentPath.push({x: pos.x, y: pos.y});
        }
        redraw(pos);
    });

    canvas.addEventListener('mouseup', (e) => {
        if (!drawing || eraserSelect.value === 'object') {
            drawing = false;
            return;
        }
        const pos = getMousePos(e);
        const type = eraserSelect.value === 'stroke' ? 'eraser' : toolSelect.value;
        shapes.push({
            type: type, x: startX, y: startY, ex: pos.x, ey: pos.y,
            path: [...currentPath], size: parseInt(sizeSlider.value)
        });
        drawing = false;
        currentPath = [];
        redraw();
    });

    function deleteObjectAt(x, y) {
        let foundIndex = -1;
        // Logic fix: Search backwards but SKIP 'eraser' type objects
        for (let i = shapes.length - 1; i >= 0; i--) {
            const s = shapes[i];
            if (s.type !== 'eraser' && isPointInShape(x, y, s)) {
                foundIndex = i;
                break;
            }
        }
        if (foundIndex > -1) {
            shapes.splice(foundIndex, 1);
            redraw();
        }
    }

    function isPointInShape(x, y, s) {
        const minX = Math.min(s.x, s.ex);
        const maxX = Math.max(s.x, s.ex);
        const minY = Math.min(s.y, s.ey);
        const maxY = Math.max(s.y, s.ey);
        
        if (s.type === 'draw') {
            // Check if click is near any point in the pen path
            return s.path.some(p => Math.abs(p.x - x) < (s.size + 5) && Math.abs(p.y - y) < (s.size + 5));
        }
        // Square, Rect, Circle, Triangle detection
        return (x >= minX && x <= maxX && y >= minY && y <= maxY);
    }

    function redraw(mousePos) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        shapes.forEach(s => render(s));
        if (drawing && eraserSelect.value !== 'object') {
            const type = eraserSelect.value === 'stroke' ? 'eraser' : toolSelect.value;
            render({ type, x: startX, y: startY, ex: mousePos.x, ey: mousePos.y, path: currentPath, size: sizeSlider.value }, true);
        }
    }

    function render(s, isPreview = false) {
        ctx.beginPath();
        ctx.globalCompositeOperation = s.type === 'eraser' ? 'destination-out' : 'source-over';
        ctx.strokeStyle = s.type === 'eraser' ? 'rgba(0,0,0,1)' : '#569cd6';
        ctx.lineWidth = s.size;
        ctx.lineCap = 'round'; ctx.lineJoin = 'round';

        if (s.type === 'draw' || s.type === 'eraser') {
            if (s.path.length < 2) return;
            ctx.moveTo(s.path[0].x, s.path[0].y);
            s.path.forEach(p => ctx.lineTo(p.x, p.y));
            ctx.stroke();
        } else {
            ctx.fillStyle = isPreview ? 'rgba(86, 156, 214, 0.1)' : 'rgba(86, 156, 214, 0.2)';
            if (s.type === 'rect') {
                ctx.fillRect(s.x, s.y, s.ex - s.x, s.ey - s.y);
                ctx.strokeRect(s.x, s.y, s.ex - s.x, s.ey - s.y);
            } 
            else if (s.type === 'square') {
                const side = Math.max(Math.abs(s.ex - s.x), Math.abs(s.ey - s.y));
                const sX = s.ex < s.x ? s.x - side : s.x;
                const sY = s.ey < s.y ? s.y - side : s.y;
                ctx.fillRect(sX, sY, side, side);
                ctx.strokeRect(sX, sY, side, side);
            }
            else if (s.type === 'circle') {
                const r = Math.sqrt(Math.pow(s.ex - s.x, 2) + Math.pow(s.ey - s.y, 2));
                ctx.arc(s.x, s.y, r, 0, Math.PI * 2);
                ctx.fill(); ctx.stroke();
            }
            else if (s.type === 'triangle') {
                ctx.moveTo(s.x + (s.ex - s.x) / 2, s.y);
                ctx.lineTo(s.ex, s.ey);
                ctx.lineTo(s.x, s.ey);
                ctx.closePath();
                ctx.fill(); ctx.stroke();
            }
        }
    }

    init();
</script>
`;

function getWebviewContent() {
  return `<!DOCTYPE html><html><head>${STYLES}</head><body>${HTML_BODY}${SCRIPTS}</body></html>`;
}

module.exports = { getWebviewContent };
