const startBtn = document.querySelector('.start') as HTMLButtonElement
const stopBtn = document.querySelector('.stop') as HTMLButtonElement
const resetBtn = document.querySelector('.reset') as HTMLButtonElement
const rapBtn = document.querySelector('.rap') as HTMLButtonElement
const rapTimeElementWrap = document.querySelector('.rap_time') as HTMLDivElement

const hourDisplay = document.querySelector('.hour') as HTMLSpanElement
const minuteDisplay = document.querySelector('.minute') as HTMLSpanElement
const secondDisplay = document.querySelector('.second') as HTMLSpanElement
const msecondDisplay = document.querySelector('.msecond') as HTMLSpanElement

const MSEC_SEC = 1000
const MSEC_MINUTE = MSEC_SEC * 60
const MSEC_HOUR = MSEC_MINUTE * 60

let startTime: number
let rapStartTime: number
let timeoutId: number
let previousRapTime: number
let timeToStop = 0
let isStart = false
let isRap = false

if (!isStart) {
    rapBtn.disabled = true
}

function countUp() {
    timeoutId = window.setTimeout(() => {
        const nowTime = Date.now()

        const difTime: number = nowTime - startTime + timeToStop
        const minute_num: number = Math.floor(difTime / MSEC_MINUTE)
        const second_num: number = Math.floor(
            (difTime % MSEC_MINUTE) / MSEC_SEC
        )
        const msecond_num: number = Math.floor(difTime % 1000)

        const minute: string = ('0' + String(minute_num)).slice(-2)
        const second: string = ('0' + String(second_num)).slice(-2)
        const msecond: string = ('00' + String(msecond_num)).slice(-3)

        minuteDisplay.textContent = String(minute)
        secondDisplay.textContent = String(second)
        msecondDisplay.textContent = String(msecond)

        countUp()
    }, 10)
}

function reset() {
    if (isStart) return

    timeToStop = 0
    minuteDisplay.textContent = '00'
    secondDisplay.textContent = '00'
    msecondDisplay.textContent = '000'
}

function start() {
    if (isStart) return

    isStart = true

    startTime = Date.now()
    countUp()

    startBtn.style.display = 'none'
    stopBtn.style.display = 'block'
    rapBtn.disabled = false
    resetBtn.disabled = true
}

function stop() {
    if (!isStart) return

    isStart = false

    clearTimeout(timeoutId)
    timeToStop += Date.now() - startTime

    startBtn.style.display = 'block'
    stopBtn.style.display = 'none'
    rapBtn.disabled = true
    resetBtn.disabled = false
}

function rap() {
    rapStartTime = Date.now()

    if (!isRap) {
        let para = document.createElement('p')
        let content = document.createTextNode(String(rapStartTime - startTime))
        para.appendChild(content)
        rapTimeElementWrap.appendChild(para)
    } else {
        let para = document.createElement('p')
        let content = document.createTextNode(String(rapStartTime - previousRapTime))
        para.appendChild(content)
        rapTimeElementWrap.appendChild(para)
    }

    isRap = true
    previousRapTime = rapStartTime
}

startBtn.addEventListener('click', start)
stopBtn.addEventListener('click', stop)
rapBtn.addEventListener('click', rap)
resetBtn.addEventListener('click', reset)

