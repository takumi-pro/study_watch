import 'remixicon/fonts/remixicon.css'

import { timerCountType, studyData, studyDatasType } from './type/type'
import { chart } from './chart/chart'
import { Chart } from './class/Chart'
import studyRecordLocalStorage from './storage/localStorage'

const columnChart = new Chart(chart)
columnChart.draw()

const studyDatas = []
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

// DOM生成後のイベントの登録
const registerEvent = () => {
    const deleteBtnList = document.querySelectorAll('.delete') as NodeList
    const editBtnList = document.querySelectorAll('.edit') as NodeList

    deleteBtnList.forEach((deleteBtn) => {
        deleteBtn.addEventListener('click', deleteStudyRecord)
    })
    editBtnList.forEach((editBtn) => {
        editBtn.addEventListener('click', editStudyRecord)
    })
}

window.addEventListener('load', () => {
    const localStudyDatas = studyRecordLocalStorage.getRecord()
    if (!localStudyDatas) return

    recordArea.innerHTML = ''

    chart.series = []
    localStudyDatas.map((studyData: studyData, index: number) => {
        createRecordHtmlElement(studyData, index)
        columnChart.addSeries(studyData.subject, studyData.studyTime * 5)
    })
    columnChart.redraw()
    registerEvent()
})

// 要素の取得
const startBtn = document.querySelector('.start') as HTMLButtonElement
const stopBtn = document.querySelector('.stop') as HTMLButtonElement
const resetBtn = document.querySelector('.reset') as HTMLButtonElement
const recordBtn = document.querySelector('.record') as HTMLButtonElement
const inputArea = document.querySelector('.subject_name') as HTMLInputElement
const authBtn = document.querySelector('.auth') as HTMLButtonElement
const editBtnList = document.querySelectorAll('.edit') as NodeList
const deleteBtnList = document.querySelectorAll('.delete') as NodeList
const recordArea = document.querySelector(
    '.card__table-lists'
) as HTMLUListElement
const timer = document.querySelector('.timer') as HTMLDivElement
const modal = document.querySelector('.modal') as HTMLButtonElement
const modalOverlay = document.querySelector('.modal-overlay') as HTMLDivElement
const modalBtn = document.querySelector('.modal_button') as HTMLButtonElement

// modal
const openModal = (ele: HTMLElement | HTMLDivElement) => {
    ele.classList.add('open')
}
const closeModal = (ele: HTMLElement | HTMLDListElement) => {
    ele.classList.remove('open')
}

const openLoginModal = () => {
    openModal(modal)
}
const closeLoginModal = () => {
    console.log('overlay')
    closeModal(modal)
}
const openEditModal = (ele: HTMLDivElement) => {
    openModal(ele)
}

function createRecordHtmlElement(studyData: studyData, index: number) {
    ;`<div class="modal">
        <div class="modal-overlay"></div>
        <div class="modal-card">
            <div class="modal-body">
                <div class="modal-content">Content</div>
            </div>
        </div>
    </div>`
    // 要素生成
    const list = document.createElement('li')
    const numberDiv = document.createElement('div')
    const subjectDiv = document.createElement('div')
    const studyTimeDiv = document.createElement('div')
    const buttonsDiv = document.createElement('div')
    const editButton = document.createElement('button')
    const deleteButton = document.createElement('button')
    const modal = document.createElement('div')
    const modalOverlay = document.createElement('div')
    const modalCard = document.createElement('div')
    const modalContent = document.createElement('div')
    const modalBody = document.createElement('div')
    const modalInput = document.createElement('input')
    const modalBtn = document.createElement('button')

    // クラス追加
    list.dataset.index = studyData.id.toString()
    list.classList.add('card__table-list')
    numberDiv.classList.add('table__cell', 'number')
    subjectDiv.classList.add('table__cell', 'subject')
    studyTimeDiv.classList.add('table__cell', 'study-time')
    buttonsDiv.classList.add('table__cell', 'buttons')
    editButton.classList.add('edit', 'button')
    deleteButton.classList.add('delete', 'button')
    modal.classList.add('modal', 'edit-modal')
    modalOverlay.classList.add('modal-overlay', 'edit-overlay')
    modalCard.classList.add('modal-card', 'edit-card')
    modalContent.classList.add('modal-content', 'edit-content')
    modalBody.classList.add('modal-body', 'edit-body')
    modalInput.classList.add('modal-input')
    modalBtn.classList.add('modal-button')
    modalContent.append(modalInput)
    modalBody.append(modalContent)
    modalCard.append(modalBody)
    modal.append(modalOverlay, modalCard)

    editButton.textContent = '編集'
    deleteButton.textContent = '削除'
    buttonsDiv.appendChild(editButton)
    buttonsDiv.appendChild(deleteButton)

    numberDiv.textContent = `#${index + 1}`
    subjectDiv.textContent = studyData.subject
    studyTimeDiv.textContent = studyData.studyTime.toString()

    list.appendChild(numberDiv)
    list.appendChild(subjectDiv)
    list.appendChild(studyTimeDiv)
    list.appendChild(buttonsDiv)
    list.appendChild(modal)
    recordArea.appendChild(list)
}

function seriesIndex() {
    let seriesIndex = 0
    if (chart.series.length > 0) {
        seriesIndex = chart.series.length - 1
    }
    return seriesIndex
}

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
    const localStudyDatas = studyRecordLocalStorage.getRecord()
    if (!localStudyDatas) return false

    const localStudyDatasLength = localStudyDatas.length
    const chartSeriesLength = chart.series.length
    if (localStudyDatasLength === chartSeriesLength) {
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
    const localStudyDatas = studyRecordLocalStorage.getRecord()
    if (!localStudyDatas) return
    console.log('update')

    recordArea.innerHTML = ''
    localStudyDatas.map((studyData: studyData, index: number) => {
        createRecordHtmlElement(studyData, index)
        columnChart.update(index, studyData.subject, studyData.studyTime * 5)
        columnChart.redraw()
    })
    const deleteBtnList = document.querySelectorAll('.delete') as NodeList
    deleteBtnList.forEach((deleteBtn) => {
        deleteBtn.addEventListener('click', deleteStudyRecord)
    })
}

function determinId() {
    const localStudyDatas: studyDatasType = studyRecordLocalStorage.getRecord()
    if (localStudyDatas && localStudyDatas.length > 0) {
        return localStudyDatas.slice(-1)[0].id + 1
    }
    return 1
}

function record() {
    const { mm, ss } = timerCount
    const data = {
        id: determinId(),
        subject: inputText,
        studyTime: mm * 60 + ss,
        isDelete: false,
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

    // 保存処理
    studyDatas.push(data)
    studyRecordLocalStorage.storeRecord([data])
    timeToStop = 0
    const localStudyDatas = studyRecordLocalStorage.getRecord()
    if (!localStudyDatas) return

    recordArea.innerHTML = ''
    localStudyDatas.map((studyData: studyData, index: number) => {
        createRecordHtmlElement(studyData, index)
        console.log('studyData: ', studyData)
        console.log('index :', index)
    })
    columnChart.update(
        localStudyDatas.length - 1,
        data.subject,
        data.studyTime * 5
    )
    columnChart.redraw()
    registerEvent()
    timerInit()
    inputInit()
    print('00:00:00:000')
}

// function notionAuth() {
//     const url =
//         'https://api.notion.com/v1/oauth/authorize?owner=user&client_id=4f1f6973-b66f-47e6-9d04-db94afeebeb4&response_type=code'
//     window.location.href = url
// }

function editStudyRecord(e: Event) {
    if (!(e.target instanceof HTMLButtonElement)) return

    const list = e.target.closest('.card__table-list') as HTMLDivElement
    if (!list) return
    if (!list.lastChild) return

    const editModal = list.lastChild as HTMLDivElement
    const editModalOverlay = editModal.firstChild as HTMLDivElement
    openEditModal(editModal)
    editModalOverlay.addEventListener('click', () => {
        closeModal(editModal)
    })
}

function deleteStudyRecord(e: Event) {
    if (!(e.target instanceof HTMLButtonElement)) return

    const isDelete = confirm('本当に削除しますか？')
    if (isDelete) {
        console.log('delete')
        const cardTableLists = e.target.closest(
            '.card__table-list'
        ) as HTMLLIElement
        const deleteId = Number(cardTableLists?.dataset.index)
        const hashNumber = Number(
            cardTableLists?.firstChild?.textContent?.slice(1)
        )
        studyRecordLocalStorage.deleteRecord(deleteId)

        const localStudyDatas = studyRecordLocalStorage.getRecord()
        if (!localStudyDatas) return

        recordArea.innerHTML = ''
        localStudyDatas.map((studyData: studyData, index: number) => {
            createRecordHtmlElement(studyData, index)
        })
        columnChart.removeSeries(hashNumber - 1)
        columnChart.redraw()
        registerEvent()
    }
}

inputArea.addEventListener('input', input)
startBtn.addEventListener('click', start)
stopBtn.addEventListener('click', stop)
resetBtn.addEventListener('click', reset)
recordBtn.addEventListener('click', record)
authBtn.addEventListener('click', openLoginModal)
modalOverlay.addEventListener('click', closeLoginModal)
editBtnList.forEach((editBtn) => {
    editBtn.addEventListener('click', editStudyRecord)
})
deleteBtnList.forEach((deleteBtn) => {
    deleteBtn.addEventListener('click', deleteStudyRecord)
})
