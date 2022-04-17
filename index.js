const ingestor = new Ingestor();

/**
 * @type {Environment}
 */
const env = new Environment();

// Empty command update to populate arrays
env.update("");

let tokenArr = [
    '#ffffff', '#ffffff', '#ffffff',
    '#ffffff', '#ffffff', '#ffffff',
    '#ffffff', '#ffffff', '#ffffff',
    '#ffffff', '#ffffff', '#ffffff',
    '#ffffff', '#ffffff', '#ffffff'
]

let input = document.getElementById('input');
let palette = document.getElementById('palette');
let currColor = "#ffffff";

tokenArr.forEach((v, i) => {
    let div = document.createElement('div');
    div.classList.add('input-cell');
    div.onclick = () => {
        div.style.backgroundColor = currColor;
        tokenArr[i] = currColor;
    }
    input.append(div)
})

function resetTokens() {
    tokenArr = [
        '#ffffff', '#ffffff', '#ffffff',
        '#ffffff', '#ffffff', '#ffffff',
        '#ffffff', '#ffffff', '#ffffff',
        '#ffffff', '#ffffff', '#ffffff',
        '#ffffff', '#ffffff', '#ffffff'
    ]
    Array.from(input.children).forEach((v, i) => {
        v.style.removeProperty('background-color');
    })
}

let colors = [
    '#000000',
    '#ffffff',
    '#d3d3d3', 
    '#a3a3a3',
    '#ffaec9',
    '#d60270',
    '#ff0000',
    '#ff8c00',
    '#fcf434',
    '#ffff00', 
    '#b8f483',
    '#008026',
    '#80d9ff',
    '#0000ff',
    '#0038a8',
    '#9b4f96',
    '#800080',
    '#9c59d1' 
]

colors.forEach(v => {
    let color = document.createElement('div');
    color.style.backgroundColor = v
    color.onclick = () => {
        currColor = v;
    }
    palette.append(color);
});

function execute() {
    let t = new Token(tokenArr);
    let cmd = ingestor.ingest(t);
    env.update(cmd);
    resetTokens();
}

function print() {
    let text = document.getElementById('output');
    output.value = env.print();
}