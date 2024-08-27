document.addEventListener('DOMContentLoaded', () => {
    const renderCharts = (topN, chartType) => {
        d3.csv("./data/covid_data.csv").then(data => {
            chartType === "bar" ? renderBarChart(data.slice(0, topN)) : renderPieChart(data.slice(0, topN));
        });
    };

    const addEventListeners = (buttons, chartType) => {
        buttons.forEach(btn => {
            const topN = btn.id.match(/\d+/)[0];
            btn.addEventListener('click', () => renderCharts(parseInt(topN), chartType));
        });
    };

    const barButtons = document.querySelectorAll('[id^="top"][id$="btn-bar"]');
    const pieButtons = document.querySelectorAll('[id^="top"][id$="btn-pie"]');

    if (barButtons.length) addEventListeners(barButtons, "bar");
    if (pieButtons.length) addEventListeners(pieButtons, "pie");
});
