import Highcharts from 'highcharts'
import ex from 'highcharts/modules/exporting'
import data from 'highcharts/modules/data.js'
ex(Highcharts)
data(Highcharts)

const date = new Date()

export const chart = new (Highcharts as any).chart({
    chart: {
        renderTo: 'chart__area',
        type: 'column',
    },
    xAxis: {
        categories: [`${date.getMonth() + 1}月${date.getDate()}日`],
    },
    yAxis: {
        softMax: 25,
        title: {
            text: '学習時間(分)',
        },
    },
    series: [{ name: '', data: [0] }],
})
