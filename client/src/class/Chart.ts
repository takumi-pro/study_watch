export class Chart {
    private chart: any
    private lastSeriesIndex: number

    constructor(chart: any) {
        this.chart = chart
        this.lastSeriesIndex = 0
    }

    seriesIndex() {
        if (this.chart.series.length > 0) {
            this.lastSeriesIndex = this.chart.series.length - 1
        }
        return this.lastSeriesIndex
    }

    draw() {
        return this.chart
    }

    addSeries(name: string, data: number) {
        this.chart.addSeries({
            name: name,
            data: [data],
        })
    }

    removeSeries(index: number) {
        this.chart.series[index].remove()
        console.log(this.chart.series)
    }

    update(index: number, name: string, data: number) {
        this.chart.series[index].update(
            {
                name: name,
                data: [data],
            },
            false
        )
    }

    redraw() {
        this.chart.redraw()
    }
}
