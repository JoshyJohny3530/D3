document.addEventListener("DOMContentLoaded", function () {
    const navbarHTML = `
        <nav>
            <ul>
                <li><a href="map.html">World Map</a></li>
                <li><a href="barrace.html">Variable Bar Chart</a></li>
                <li><a href="linechart.html">Line Chart</a></li>
                <li><a href="stackedbar.html">Stacked Bar Chart</a></li>
                <li><a href="area.html">Area Chart</a></li>
                <li><a href="bar-chart.html">Bar Chart</a></li>
                <li><a href="pie-chart.html">Pie Chart</a></li>
                <li><a href="scatterplot.html">Scatter Plot</a></li>
                <li><a href="radial-stacked.html">Radial Stacked</a></li>
            </ul>
        </nav>
    `;

    document.getElementById('navbar-container').innerHTML = navbarHTML;
});
