const puppeteer = require('puppeteer');

class ChartJs {
    async generateChartHtml(labels, data, backgroundColors, borderColors) {
        return `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <title>Dynamic Chart</title>
                <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
                <script src="https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels"></script>
                <style>
                    body {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                        margin: 0;
                    }
                    .chart-container {
                        width: 300px;
                        height: 300px;
                    }
                </style>
            </head>
            <body>
                <div class="chart-container">
                    <canvas id="myChart"></canvas>
                </div>
                <script>
                    async function renderChart() {
                        const ctx = document.getElementById('myChart').getContext('2d');
                        const myChart = new Chart(ctx, {
                            type: 'pie',
                            data: {
                                labels: ${JSON.stringify(labels)},
                                datasets: [{
                                    label: 'Patients',
                                    data: ${JSON.stringify(data)},
                                    backgroundColor: ${JSON.stringify(backgroundColors)},
                                    borderColor: ${JSON.stringify(borderColors)},
                                    borderWidth: 1
                                }]
                            },
                            options: {
                                responsive: false,
                                maintainAspectRatio: true,
                                plugins: {
                                    title: {
                                        display: true,
                                        text: 'Generated Chart'
                                    },
                                    datalabels: {
                                        color: '#ffffff',
                                        formatter: (value, context) => value
                                    }
                                }
                            },
                            plugins: [ChartDataLabels]
                        });

                        // Wait until the chart is fully rendered
                        await new Promise(resolve => {
                            setTimeout(() => {
                                resolve();
                            }, 1000); // Increase or adjust the delay if needed
                        });

                        return myChart.toBase64Image();
                    }

                    renderChart().then(base64Image => {
                        document.body.innerHTML = '<img id="chartImage" src="' + base64Image + '">';
                    }).catch(error => {
                        console.error('Error rendering chart:', error);
                    });
                </script>
            </body>
            </html>
        `;
    }

    async generateBase64ChartImage(labels, data, backgroundColors, borderColors) {
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();

        const chartHtml = await this.generateChartHtml(labels, data, backgroundColors, borderColors);
        await page.setContent(chartHtml);

        // Wait for the image to be added to the DOM
        await page.waitForSelector('#chartImage');
        const base64Image = await page.evaluate(() => {
            const chartImage = document.querySelector('#chartImage');
            if (chartImage) {
                return chartImage.src;
            }
            throw new Error('Image not found');
        });

        await browser.close();
        return base64Image;
    }
}

module.exports = ChartJs;
