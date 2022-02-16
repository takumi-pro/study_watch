import { studyDatasType } from '../type/type'

const studyRecordLocalStorage = (() => {
    const getRecord = (): studyDatasType => {
        return JSON.parse(localStorage.getItem('study_data') as string)
    }

    const validate = (): boolean => {
        return Array.isArray(getRecord()) ? true : false
    }

    const storeRecord = (studyDatas: studyDatasType) => {
        let objArr: any = []
        const localStudyDatas: studyDatasType = getRecord()

        if (!localStudyDatas || (localStudyDatas.length === 0 && validate)) {
            localStorage.setItem('study_data', JSON.stringify(studyDatas))
            return
        }

        if (localStudyDatas.length >= 1 && validate()) {
            objArr = [...localStudyDatas.concat(studyDatas)]
        }

        localStorage.setItem('study_data', JSON.stringify(objArr))
    }

    const deleteRecord = (id: number) => {
        const localStudyDatas: studyDatasType = getRecord()
        const newData = localStudyDatas.filter((localStudyData) => {
            if (localStudyData.id !== id) return true
            return false
        })

        localStorage.setItem('study_data', JSON.stringify(newData))
    }

    return {
        getRecord,
        storeRecord,
        deleteRecord,
    }
})()

export default studyRecordLocalStorage
