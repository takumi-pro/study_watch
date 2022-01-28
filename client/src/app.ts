import { Client } from '@notionhq/client'
import axios from 'axios'

import { timerCountType, studyData } from './type/type'
import { chart } from './chart/chart'
import { Chart } from './class/Chart'

// 要素の取得
const startBtn = document.querySelector('.start') as HTMLButtonElement
const stopBtn = document.querySelector('.stop') as HTMLButtonElement
const resetBtn = document.querySelector('.reset') as HTMLButtonElement
const recordBtn = document.querySelector('.record') as HTMLButtonElement
const inputArea = document.querySelector('.subject_name') as HTMLInputElement
const recordArea = document.querySelector('.record_area') as HTMLUListElement
const chartArea = document.querySelector('.chart_area') as HTMLDivElement
const timer = document.querySelector('.timer') as HTMLDivElement

const columnChart = new Chart(chart)

let isStart = false
let startTime: number
let intervalId: number
let graphIntervalId: number
let timeToStop = 0
let inputText = ''
const timerCount: timerCountType = {
    hh: 0,
    mm: 0,
    ss: 0,
    ms: 0,
}
const totalMinute = 0

window.addEventListener('load', () => {
    const studyDataListJson = localStorage.getItem('study_data')
    if (!studyDataListJson) return

    recordArea.innerHTML = ''

    const studyDataList = JSON.parse(studyDataListJson)
    chart.series = []
    studyDataList.map((studyData: studyData, index: number) => {
        createRecordHtmlElement(studyData)
        columnChart.addSeries(studyData.subject, studyData.studyTime * 5)
        columnChart.redraw()
    })
})

function createRecordHtmlElement(studyData: studyData) {
    const list = document.createElement('li')
    const p = document.createElement('p')
    const button = document.createElement('button')

    button.classList.add('remove_button')
    p.textContent = `${studyData.id} : ${studyData.subject} : ${studyData.studyTime}`
    button.textContent = '削除'
    list.appendChild(p)
    list.appendChild(button)
    recordArea.appendChild(list)
}

function seriesIndex() {
    let seriesIndex = 0
    if (chart.series.length > 0) {
        seriesIndex = chart.series.length - 1
    }
    return seriesIndex
}

//localStorage削除
const clearData = document.querySelector('.clear') as HTMLButtonElement
clearData.addEventListener('click', () => {
    localStorage.clear()
    location.reload()
})

//全ボタンを無効化
// buttonDisabled(true)

function countUp(difTime: number) {
    const hour = difTime / 3600000
    const min = difTime / 60000
    const sec = (difTime % 60000) / 1000
    const msec = difTime % 1000

    // timerCountでカウントをグローバルに管理
    timerCount.hh = Math.floor(hour)
    timerCount.mm = Math.floor(min)
    timerCount.ss = Math.floor(sec)
    timerCount.ms = Math.floor(msec)

    //時間、分、秒は2桁でm秒は3桁に修正
    const formatedHH = timerCount.hh.toString().padStart(2, '0')
    const formatedMM = timerCount.mm.toString().padStart(2, '0')
    const formatedSS = timerCount.ss.toString().padStart(2, '0')
    const formatedMS = timerCount.ms.toString().padStart(3, '0')

    return `${formatedHH}:${formatedMM}:${formatedSS}:${formatedMS}`
}

function timerInit() {
    timerCount.hh = 0
    timerCount.mm = 0
    timerCount.ss = 0
    timerCount.ms = 0
}

function inputInit() {
    inputArea.disabled = false
    inputArea.value = ''
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

function buttonDisabled(isDisabled: boolean): void {
    startBtn.disabled = isDisabled
    stopBtn.disabled = isDisabled
    recordBtn.disabled = isDisabled
    resetBtn.disabled = isDisabled
}

function judgeRecordPush(): boolean {
    const studyDataListJson = localStorage.getItem('study_data') as string
    if (!studyDataListJson) return false

    const studyDataList = JSON.parse(studyDataListJson)
    const studyDataListLength = studyDataList.length
    const chartSeriesLength = chart.series.length
    if (studyDataListLength === chartSeriesLength) {
        return true
    }
    return false
}

function start(): void {
    showButton('STOP')

    if (judgeRecordPush()) {
        columnChart.addSeries(inputText, 0)
        columnChart.redraw()
    }

    inputArea.disabled = true
    resetBtn.disabled = false

    startTime = Date.now()
    intervalId = window.setInterval(() => {
        const difTime = Date.now() - startTime + timeToStop
        print(countUp(difTime))
    }, 10)

    graphIntervalId = window.setInterval(() => {
        columnChart.update(seriesIndex(), inputText, timerCount.ss * 5)
        columnChart.redraw()
    }, 1000)
}

function stop() {
    showButton('START')
    timeToStop += Date.now() - startTime
    clearInterval(intervalId)
    clearInterval(graphIntervalId)
}

// resetはstartされていない時に実行できる
// recordを押下した後はresetできないようにする
function reset() {
    if (!isStart) {
        buttonDisabled(false)
        inputInit()
        timerInit()
        columnChart.update(seriesIndex(), '', 0)
        columnChart.redraw()
    }
    timeToStop = 0
    print('00:00:00:000')
}

function input(e: Event) {
    if (!(e.target instanceof HTMLInputElement)) return

    inputText = e.target.value
    if (inputText === '') {
        buttonDisabled(true)
    } else {
        buttonDisabled(false)
    }
}

function updateRecord() {
    const studyDataList = localStorage.getItem('study_data')
    console.log(studyDataList)
    if (!studyDataList) return

    recordArea.innerHTML = ''
    JSON.parse(studyDataList).map((studyData: studyData, index: number) => {
        createRecordHtmlElement(studyData)
        columnChart.update(index, studyData.subject, studyData.studyTime * 5)
        columnChart.redraw()
    })
}

function determinId() {
    const studyDataListJson = localStorage.getItem('study_data')
    if (!studyDataListJson) {
        return 1
    }

    const studyDataList = JSON.parse(studyDataListJson)
    return studyDataList.slice(-1)[0].id + 1
}

function record() {
    const { mm, ss } = timerCount
    const data = {
        id: determinId(),
        subject: inputText,
        studyTime: mm * 60 + ss,
    }
    if (isStart) {
        return
    }
    if (judgeRecordPush()) {
        alert('既に登録済みです')
        return
    }
    if (data.studyTime === 0) {
        alert('時間が0です')
        return
    }

    if (!localStorage.getItem('study_data')) {
        localStorage.setItem('study_data', JSON.stringify([data]))
    } else {
        const dataListJson = localStorage.getItem('study_data')
        if (!dataListJson) return

        const dataList = JSON.parse(dataListJson)
        dataList.push(data)
        localStorage.setItem('study_data', JSON.stringify(dataList))
    }
    timeToStop = 0
    updateRecord()
    timerInit()
    inputInit()
    print('00:00:00:000')
}

inputArea.addEventListener('input', input)
startBtn.addEventListener('click', start)
stopBtn.addEventListener('click', stop)
resetBtn.addEventListener('click', reset)
recordBtn.addEventListener('click', record)

// notion post
const post = document.querySelector('.post') as HTMLButtonElement
const key = 'secret_PF5H0dtfr1Z03DnlE0HNVntp7uXkcI3jMyBKDjvyXdh'
const databaseId = '8bb6dbf8b88a40bebb04d2b1d7740cd4'
const notion = new Client({ auth: key })

post.addEventListener('click', async () => {
    const response = await axios.post('http://localhost:8080/api/post')
    try {
        console.log(response.data)
    } catch (error: any) {
        console.log(error)
    }
    console.log()
})
