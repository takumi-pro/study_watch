import Highcharts from 'highcharts'
import ex from 'highcharts/modules/exporting'
import data from 'highcharts/modules/data.js'

ex(Highcharts)
data(Highcharts)

// html要素の取得
const startBtn = document.querySelector('.start') as HTMLButtonElement
const stopBtn = document.querySelector('.stop') as HTMLButtonElement
const resetBtn = document.querySelector('.reset') as HTMLButtonElement
const recordBtn = document.querySelector('.record') as HTMLButtonElement

const inputArea = document.querySelector('.subject_name') as HTMLInputElement
const chartArea = document.querySelector('.chart_area') as HTMLDivElement
const timer = document.querySelector('.timer') as HTMLDivElement

let isStart = false
let startTime: number
let intervalId: number
let graphIntervalId: number
let timeToStop = 0
let count = 0
let chart: any

// グラフ描画
// 空のデータを入れる
chart = new (Highcharts as any).chart({
    chart: {
        renderTo: 'chart_area',
        type: 'column',
    },
    xAxis: {
        categories: ['ネットワーク'],
    },
    yAxis: {
        softMax: 110,
        title: {
            text: 'number',
        },
    },
    series: [{ type: 'column', name: '科目1', data: [0] }],
})

//全ボタンを無効化
// buttonDisabled(true)

function countUp(difTime: number) {
    const hour = difTime / 3600000
    const min = difTime / 60000
    const sec = (difTime % 60000) / 1000
    const msec = difTime % 1000

    const hh = Math.floor(hour)
    const mm = Math.floor(min)
    const ss = Math.floor(sec)
    const ms = Math.floor(msec)

    //時間、分、秒は2桁でm秒は3桁に修正
    const formatedHH = hh.toString().padStart(2, '0')
    const formatedMM = mm.toString().padStart(2, '0')
    const formatedSS = ss.toString().padStart(2, '0')
    const formatedMS = ms.toString().padStart(3, '0')

    return `${formatedHH}:${formatedMM}:${formatedSS}:${formatedMS}`
}

function showButton(showBtn: string) {
    const buttonToShow = showBtn === 'START' ? startBtn : stopBtn
    const buttonToHide = showBtn === 'START' ? stopBtn : startBtn
    isStart = showBtn === 'STOP' ? true : false
    buttonToShow.style.display = 'block'
    buttonToHide.style.display = 'none'
}

function print(txt: string) {
    timer.innerHTML = txt
}

function drawInit() {
    count = 0
    chart.series[0].update({ data: [0] }, false)
    chart.redraw()
}

function graphUpdate(difTime: number) {
    const sec = Math.floor(difTime / 1000)

    chart.series[0].update(
        {
            data: [sec * 5],
        },
        false
    )
    chart.redraw()
}

function start() {
    showButton('STOP')

    inputArea.disabled = true

    startTime = Date.now()
    intervalId = window.setInterval(() => {
        const difTime = Date.now() - startTime + timeToStop
        print(countUp(difTime))
    }, 10)

    graphIntervalId = window.setInterval(() => {
        const difTime = Date.now() - startTime + timeToStop
        graphUpdate(difTime)
    }, 10000)
}

function stop() {
    showButton('START')
    timeToStop += Date.now() - startTime
    clearInterval(intervalId)
    clearInterval(graphIntervalId)
}

function reset() {
    if (!isStart) {
        inputArea.disabled = false
        inputArea.value = ''
        buttonDisabled(false)
        drawInit()
    }
    timeToStop = 0
    print('00:00:00:000')
}

function buttonDisabled(isDisabled: boolean) {
    startBtn.disabled = isDisabled
    stopBtn.disabled = isDisabled
    recordBtn.disabled = isDisabled
    resetBtn.disabled = isDisabled
}

function input(e: Event) {
    if (!(e.target instanceof HTMLInputElement)) return

    if (e.target.value) {
        buttonDisabled(false)
    } else {
        buttonDisabled(true)
    }
}

inputArea.addEventListener('input', input)
startBtn.addEventListener('click', start)
stopBtn.addEventListener('click', stop)
resetBtn.addEventListener('click', reset)
