const renderPieChart = (data) => {
    const svg = d3.select("#pie-chart").html("").append("svg").attr("width", 800).attr("height", 500);
    const width = +svg.attr("width");
    const height = +svg.attr("height");
    const radius = Math.min(width, height) / 2;
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const g = svg.append("g").attr("transform", `translate(${width / 2},${height / 2})`);

    const pie = d3.pie().value(d => d.Deaths);
    const arc = d3.arc().outerRadius(radius - 10).innerRadius(0);

    const dataReady = pie(data);

    g.selectAll(".arc")
        .data(dataReady)
        .enter().append("g")
        .attr("class", "arc")
        .append("path")
        .attr("d", arc)
        .attr("fill", d => color(d.data.Country));

    const legend = svg.append("g")
        .attr("transform", `translate(${width - 120}, 20)`); 

    data.forEach((d, i) => {
        const legendRow = legend.append("g")
            .attr("transform", `translate(0, ${i * 20})`);

        legendRow.append("rect")
            .attr("width", 18)
            .attr("height", 18)
            .attr("fill", color(d.Country));

        legendRow.append("text")
            .attr("x", 24)
            .attr("y", 9)
            .attr("dy", ".35em")
            .text(d.Country);
    });
};
