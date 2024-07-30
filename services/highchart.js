class HighChart {
    async generateHighChartHtml(labels, data, backgroundColors) {
        return `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <title>Dynamic Chart</title>
                <script src="https://code.highcharts.com/highcharts.js"></script>
                <script src="https://code.highcharts.com/modules/exporting.js"></script>
            </head>
            <body>
                <div id="container" style="width:100%; height:400px;"></div>
                <script>
                    Highcharts.chart('container', {
                        chart: {
                            type: 'pie'
                        },
                        title: {
                            text: 'Pie Chart Example'
                        },
                        plotOptions: {
                            series: {
                                // general options for all series
                            },
                            pie: {
                                // shared options for all pie series
                                allowPointSelect: true,
                                cursor: 'pointer',
                                dataLabels: {
                                    enabled: true,
                                    format: '<b>{point.name}</b>: {point.percentage:.1f} %'
                                }
                            }
                        },
                        series: [{
                            name: 'Share',
                            data: ${JSON.stringify(labels.map((label, index) => ({ name: label, y: data[index], color: backgroundColors[index] })))}
                        }]
                    });
                </script>
            </body>
            </html>
        `;

    }
}
module.exports = HighChart;
