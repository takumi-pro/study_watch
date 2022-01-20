// html要素の取得
const startBtn = document.querySelector('.start') as HTMLButtonElement
const stopBtn = document.querySelector('.stop') as HTMLButtonElement
const resetBtn = document.querySelector('.reset') as HTMLButtonElement
const rapBtn = document.querySelector('.rap') as HTMLButtonElement
const recordBtn = document.querySelector('.record') as HTMLButtonElement
const timer = document.querySelector('.timer') as HTMLDivElement

let startTime: number
let intervalId: number
let timeToStop: number = 0

function countUp(difTime: number) {
    let hour = difTime / 360000
    let min = (difTime % 360000) / 60000
    let sec = difTime / 1000
    let msec = difTime % 1000

    let hh = Math.floor(hour)
    let mm = Math.floor(min)
    let ss = Math.floor(sec)
    let ms = Math.floor(msec)

    let formatedHH = hh.toString().padStart(2, '0')
    let formatedMM = mm.toString().padStart(2, '0')
    let formatedSS = ss.toString().padStart(2, '0')
    let formatedMS = ms.toString().padStart(3, '0')

    return `${formatedHH}:${formatedMM}:${formatedSS}:${formatedMS}`
}

function showButton(showBtn: string) {
    let buttonToShow = (showBtn === 'START') ? startBtn : stopBtn
    let buttonToHide = (showBtn === 'START') ? stopBtn : startBtn
    buttonToShow.style.display = 'block'
    buttonToHide.style.display = 'none'
}

function print(txt: string) {
    timer.innerHTML = txt
}

function start() {
    showButton('STOP')
    startTime = Date.now()
    intervalId = window.setInterval(() => {
        let difTime = Date.now() - startTime + timeToStop
        print(countUp(difTime))
    }, 10)
}

function stop() {
    showButton('START')
    timeToStop += Date.now() - startTime
    clearInterval(intervalId)
}

function reset() {
    timeToStop = 0
    print('00:00:00:000')
}

startBtn.addEventListener('click', start)
stopBtn.addEventListener('click', stop)
resetBtn.addEventListener('click', reset)

