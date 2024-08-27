const width = 960,
  size = 600;
const margin = { top: 20, right: 20, bottom: 50, left: 100 };

d3.csv("../data/covid_data.csv").then((data) => {
  const columns = ["Confirmed", "Deaths", "Recovered", "New cases"];

  const x = d3.scaleLinear().range([0, size - margin.left - margin.right]);
  const y = d3.scaleLinear().range([size - margin.top - margin.bottom, 0]);

  const svg = d3
    .select("#chart")
    .append("svg")
    .attr("width", size + margin.left + margin.right)
    .attr("height", size + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const tooltip = d3.select("body").append("div").attr("class", "tooltip");

  function plot(xColumn, yColumn) {
    x.domain(d3.extent(data, (d) => +d[xColumn])).nice();
    y.domain(d3.extent(data, (d) => +d[yColumn])).nice();

    svg.selectAll("*").remove();

    svg
      .append("g")
      .attr("class", "x axis")
      .attr("transform", `translate(0,${size - margin.bottom})`)
      .call(d3.axisBottom(x).tickPadding(10))
      .append("text")
      .attr("class", "x label")
      .attr("x", (size - margin.left - margin.right) / 2)
      .attr("y", margin.bottom - 10)
      .attr("text-anchor", "middle")
      .text(xColumn);

    svg
      .append("g")
      .attr("class", "y axis")
      .call(d3.axisLeft(y).tickPadding(10))
      .append("text")
      .attr("class", "y label")
      .attr("x", -(size - margin.top - margin.bottom) / 2)
      .attr("y", -margin.left + 10)
      .attr("text-anchor", "middle")
      .attr("transform", "rotate(-90)")
      .text(yColumn);

    svg
      .selectAll(".point")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "point")
      .attr("cx", (d) => x(d[xColumn]))
      .attr("cy", (d) => y(d[yColumn]))
      .attr("r", 3)
      .attr("fill", "steelblue")
      .on("mouseover", function (event, d) {
        d3.select(this).attr("r", 7).attr("fill", "red");
        tooltip.transition().duration(200).style("opacity", 1);
        tooltip
          .html(
            `Country: ${d["Country/Region"]}<br>${xColumn}: ${d[xColumn]}<br>${yColumn}: ${d[yColumn]}`
          )
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY - 28 + "px");
      })
      .on("mouseout", function () {
        d3.select(this).attr("r", 3).attr("fill", "steelblue");
        tooltip.transition().duration(500).style("opacity", 0);
      });

    svg
      .selectAll(".separator")
      .data([0, size])
      .enter()
      .append("line")
      .attr("class", "separator")
      .attr("x1", (d) => d)
      .attr("x2", (d) => d)
      .attr("y1", 0)
      .attr("y2", size - margin.top - margin.bottom)
      .attr("stroke", "black")
      .attr("stroke-width", 1);

    svg
      .selectAll(".separator")
      .data([0, size])
      .enter()
      .append("line")
      .attr("class", "separator")
      .attr("x1", 0)
      .attr("x2", size - margin.left - margin.right)
      .attr("y1", (d) => d)
      .attr("y2", (d) => d)
      .attr("stroke", "black")
      .attr("stroke-width", 1);
  }

  plot("Confirmed", "Deaths");

  d3.select("#x-select").on("change", function () {
    const xColumn = this.value;
    const yColumn = d3.select("#y-select").property("value");
    plot(xColumn, yColumn);
  });

  d3.select("#y-select").on("change", function () {
    const xColumn = d3.select("#x-select").property("value");
    const yColumn = this.value;
    plot(xColumn, yColumn);
  });
});
