import Highcharts from 'highcharts'
import ex from 'highcharts/modules/exporting'
import data from 'highcharts/modules/data.js'
ex(Highcharts)
data(Highcharts)

let date = new Date()

export const chart = new (Highcharts as any).chart({
    chart: {
        renderTo: 'chart_area',
        type: 'column',
    },
    xAxis: {
        categories: [`${date.getMonth()+1}月${date.getDate()}日`],
    },
    yAxis: {
        softMax: 110,
        title: {
            text: 'number',
        },
    },
    series: [
        { name: '', data: [0] }
    ],
})