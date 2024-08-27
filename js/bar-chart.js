


const renderBarChart = (data) => {
    const svg = d3.select("#bar-chart").html("").append("svg").attr("width", 800).attr("height", 600);
    const margin = { top: 20, right: 30, bottom: 150, left: 60 };
    const width = +svg.attr("width") - margin.left - margin.right;
    const height = +svg.attr("height") - margin.top - margin.bottom;
    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand()
        .domain(data.map(d => d.Country))
        .range([0, width])
        .padding(0.2); 

    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.Deaths)])
        .nice()
        .range([height, 0]);

    const bars = g.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d.Country))
        .attr("y", d => y(d.Deaths))
        .attr("width", x.bandwidth())
        .attr("height", d => height - y(d.Deaths))
        .attr("fill", "steelblue");

    const xAxis = g.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x).tickSize(0).tickPadding(10));

    xAxis.selectAll("text")
        .style("font-size", "12px")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end")
        .attr("dy", "1em");

    g.append("g")
        .attr("class", "y-axis")
        .call(d3.axisLeft(y));

    svg.append("text")
        .attr("transform", `translate(${margin.left + width / 2},${margin.top + height + 40})`)
        .style("text-anchor", "middle")

    svg.append("text")
        .attr("transform", `translate(${margin.left - 50},${margin.top + height / 2}) rotate(-90)`)
        .style("text-anchor", "middle")
        .text("Deaths");

    const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("background-color", "#fff")
        .style("border", "1px solid #ccc")
        .style("padding", "5px")
        .style("border-radius", "5px")
        .style("opacity", 0);
   
    bars
        .on("mouseover", function(event, d) {
            tooltip.transition().duration(200).style("opacity", .9);
            tooltip.html(d.Country)
                .style("left", (event.pageX + 5) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", function() {
            tooltip.transition().duration(500).style("opacity", 0);
        });
};
