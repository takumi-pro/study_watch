const startBtn = document.querySelector('.start') as HTMLButtonElement
const stopBtn = document.querySelector('.stop') as HTMLButtonElement
const resetBtn = document.querySelector('.reset') as HTMLButtonElement

const hourDisplay = document.querySelector('.hour') as HTMLSpanElement
const minuteDisplay = document.querySelector('.minute') as HTMLSpanElement
const secondDisplay = document.querySelector('.second') as HTMLSpanElement
const msecondDisplay = document.querySelector('.msecond') as HTMLSpanElement

const MSEC_SEC = 1000
const MSEC_MINUTE = MSEC_SEC * 60
const MSEC_HOUR = MSEC_MINUTE * 60

let startTime: number
let timeoutId: number
let timeToStop: number = 0

function countUp() {
    timeoutId = window.setTimeout(() => {
        const nowTime = Date.now()

        const difTime: number = nowTime - startTime
        const minute_num: number = Math.floor(difTime / MSEC_MINUTE)
        const second_num: number = Math.floor(difTime % MSEC_MINUTE / MSEC_SEC)
        const msecond_num: number = Math.floor(difTime % 1000)
        
        const minute: string = ('0'+String(minute_num)).slice(-2)
        const second: string = ('0'+String(second_num)).slice(-2)
        const msecond: string = ('0'+String(msecond_num)).slice(-3)

        minuteDisplay.textContent = String(minute)
        secondDisplay.textContent = String(second)
        msecondDisplay.textContent = String(msecond)

        countUp()
    }, 10)
}

function start() {
    startTime = Date.now()
    countUp()
}

function stop() {
    clearTimeout(timeoutId)
}

startBtn.addEventListener('click', start)
stopBtn.addEventListener('click', stop)