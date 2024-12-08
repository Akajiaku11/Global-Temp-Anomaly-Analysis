const temperatureData = {
    labels: [
        1880, 1885, 1890, 1895, 1900, 1905, 1910, 1915, 1920, 1925,
        1930, 1935, 1940, 1945, 1950, 1955, 1960, 1965, 1970, 1975,
        1980, 1985, 1990, 1995, 2000, 2005, 2010, 2015, 2020, 2023
    ],
    data: [
        -0.12, -0.08, -0.04, 0.01, 0.05, 0.09, 0.12, 0.16, 0.21, 0.26,
        0.31, 0.34, 0.39, 0.42, 0.46, 0.49, 0.53, 0.58, 0.62, 0.68,
        0.74, 0.79, 0.83, 0.87, 0.91, 0.94, 1.00, 1.06, 1.11, 1.15
    ]
};

const detectAnomalies = (data) => {
    const avg = data.reduce((sum, value) => sum + value, 0) / data.length;
    const threshold = avg + 0.5;
    return data.map((value, index) => value >= threshold ? index : null).filter(index => index !== null);
};

const anomalies = detectAnomalies(temperatureData.data);

const ctx = document.getElementById('temperatureChart').getContext('2d');

const temperatureChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: temperatureData.labels,
        datasets: [{
            label: 'Global Temperature Anomaly (°C)',
            data: temperatureData.data,
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderWidth: 2,
            fill: true,
            pointBackgroundColor: (context) => {
                const index = context.dataIndex;
                return anomalies.includes(index) ? 'red' : 'rgba(75, 192, 192, 1)';
            },
            pointRadius: (context) => {
                const index = context.dataIndex;
                return anomalies.includes(index) ? 5 : 3;
            }
        }]
    },
    options: {
        responsive: true,
        scales: {
            x: {
                type: 'linear',
                position: 'bottom',
                title: { display: true, text: 'Year' }
            },
            y: {
                title: { display: true, text: 'Temperature Anomaly (°C)' }
            }
        },
        plugins: {
            tooltip: {
                callbacks: {
                    label: function(tooltipItem) {
                        const year = tooltipItem.label;
                        const value = tooltipItem.raw;
                        const anomalyText = anomalies.includes(tooltipItem.dataIndex) ? ' (Anomaly)' : '';
                        return `Year: ${year}, Temp: ${value.toFixed(2)}°C${anomalyText}`;
                    }
                }
            }
        }
    }
});

document.getElementById('yearRange').addEventListener('input', function(event) {
    const selectedYear = event.target.value;
    document.getElementById('yearValue').textContent = selectedYear;

    const filteredLabels = temperatureData.labels.filter(year => year <= selectedYear);
    const filteredData = temperatureData.data.slice(0, filteredLabels.length);
    const filteredAnomalies = anomalies.filter(index => temperatureData.labels[index] <= selectedYear);

    temperatureChart.data.labels = filteredLabels;
    temperatureChart.data.datasets[0].data = filteredData;
    temperatureChart.data.datasets[0].pointBackgroundColor = (context) => {
        const index = context.dataIndex;
        return filteredAnomalies.includes(index) ? 'red' : 'rgba(75, 192, 192, 1)';
    };
    temperatureChart.data.datasets[0].pointRadius = (context) => {
        const index = context.dataIndex;
        return filteredAnomalies.includes(index) ? 5 : 3;
    };

    temperatureChart.update();
});
