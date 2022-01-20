const Highcharts = require('highcharts')
require('highcharts/modules/exporting')(Highcharts)
require('highcharts/modules/data.js')(Highcharts)

// html要素の取得
const startBtn = document.querySelector('.start') as HTMLButtonElement
const stopBtn = document.querySelector('.stop') as HTMLButtonElement
const resetBtn = document.querySelector('.reset') as HTMLButtonElement
const recordBtn = document.querySelector('.record') as HTMLButtonElement

const inputArea = document.querySelector('.subject_name') as HTMLInputElement
const chartArea = document.querySelector('.chart_area') as HTMLDivElement
const timer = document.querySelector('.timer') as HTMLDivElement

let isStart: boolean = false
let startTime: number
let intervalId: number
let timeToStop: number = 0
let chart: any

buttonDisabled(true)

chart = new Highcharts.chart({
    chart: {
        renderTo: "chart_area",
        type: "column",
    },
    xAxis: {
        categories: [1,2,3,4,5]
    },
    yAxis: {
        title: {
            text: 'number'
        }
    },
    series: [
        { type:'column', data: [5, 4, 1, 2, 10] },
    ],
});

function countUp(difTime: number) {
    let hour = difTime / 3600000
    let min = difTime / 60000
    let sec = difTime % 60000 / 1000
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
    isStart = (showBtn === 'STOP') ? true : false
    buttonToShow.style.display = 'block'
    buttonToHide.style.display = 'none'
}

function print(txt: string) {
    timer.innerHTML = txt
}

function start() {
    showButton('STOP')
    // drawChart()

    inputArea.disabled = true

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
    if (!isStart) {
        inputArea.disabled = false
        inputArea.value = ''
        buttonDisabled(true)
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

function drawChart() {
    chart = new Highcharts.chart({
        chart: {
            renderTo: "chart_area",
            type: "column",
            event: {
                load: function (series: any) {
                    series.data
                }
            }
        },
        series: [
            { type:'column', data: [5, 4, 1, 2] },
        ],
    });
}
const btn = document.querySelector('.btn') as HTMLButtonElement
btn.addEventListener('click', () => {
    console.log('click')
    let random1 = Math.floor(Math.random() * 100 + 1)
    let random2 = Math.floor(Math.random() * 100 + 1)
    let random3 = Math.floor(Math.random() * 100 + 1)
    let random4 = Math.floor(Math.random() * 100 + 1)
    chart.series[0].update({
        data: [random1, random2, random3, random4]
    }, false);
    chart.addSeries({
        data: [5, 4, 1, 2, 10]
    })
    chart.redraw()
})




inputArea.addEventListener('input', input)
startBtn.addEventListener('click', start)
stopBtn.addEventListener('click', stop)
resetBtn.addEventListener('click', reset)