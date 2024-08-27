document.addEventListener("DOMContentLoaded", async () => {
  const width = 800;
  const height = 850;
  const innerRadius = 100;
  const outerRadius = Math.min(width, height) * 0.5;

  try {
    const data = await d3.csv("../data/covid_data.csv", (d) => ({
      country: d["Country"],
      confirmed: +d["Confirmed"],
      deaths: +d["Deaths"],
    }));

    if (!Array.isArray(data) || data.length === 0) {
      throw new Error("Data is not loaded correctly or is empty.");
    }

    const topCountries = data
      .sort((a, b) => b.confirmed - a.confirmed)
      .slice(0, 30);
    const countries = Array.from(new Set(topCountries.map((d) => d.country)));

    const x = d3
      .scaleBand()
      .domain(countries)
      .range([0, 2 * Math.PI])
      .align(0);

    const radialTicks = [
      100000, 500000, 1000000, 1500000, 2000000, 3000000, 5000000,
    ];
    const y = d3
      .scaleRadial()
      .domain([0, d3.max(radialTicks)])
      .range([innerRadius, outerRadius]);

    const color = d3
      .scaleOrdinal()
      .domain(countries)
      .range(d3.schemeSpectral[countries.length] || d3.schemeCategory10);

    const arc = d3
      .arc()
      .innerRadius((d) => y(d[0]))
      .outerRadius((d) => y(d[1]))
      .startAngle((d) => x(d.data.country))
      .endAngle((d) => x(d.data.country) + x.bandwidth())
      .padAngle(0.05)
      .padRadius(innerRadius);

    const svg = d3
      .select("#chart")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [-width / 2, -height / 2, width, height])
      .attr("style", "width: 100%; height: auto; font: 10px sans-serif;");

    const arcs = svg
      .append("g")
      .selectAll()
      .data(topCountries)
      .join("g")
      .attr("class", "arc-group");

    arcs
      .append("path")
      .attr("d", (d) => {
        const confirmed = d.confirmed;
        return arc({
          0: 0,
          1: confirmed,
          data: { country: d.country },
        });
      })
      .attr("fill", (d) => color(d.country))
      .attr("class", "confirmed-arc");

    arcs
      .append("path")
      .attr("d", (d) => {
        const confirmed = d.confirmed;
        const deaths = d.deaths;
        return arc({
          0: confirmed - deaths,
          1: confirmed,
          data: { country: d.country },
        });
      })
      .attr("fill", "black")
      .attr("class", "deaths-arc")
      .style("opacity", 0);

    svg
      .selectAll(".arc-group")
      .on("mouseover", function (event, d) {
        d3.select(this)
          .selectAll(".deaths-arc")
          .transition()
          .duration(500)
          .style("opacity", 1);

        d3.select("#tooltip")
          .style("opacity", 1)
          .html(
            `Country: ${d.country}<br>Confirmed: ${d.confirmed}<br>Deaths: ${d.deaths}`
          )
          .style("left", event.pageX + 5 + "px")
          .style("top", event.pageY - 28 + "px");
      })
      .on("mouseout", function (d) {
        d3.select(this)
          .selectAll(".deaths-arc")
          .transition()
          .duration(500)
          .style("opacity", 0);

        d3.select("#tooltip").style("opacity", 0);
      });

    svg
      .append("g")
      .attr("text-anchor", "end")
      .call((g) =>
        g
          .selectAll("g")
          .data(radialTicks)
          .join("g")
          .attr("fill", "none")
          .call((g) =>
            g
              .append("circle")
              .attr("stroke", "#000")
              .attr("stroke-opacity", 0.5)
              .attr("r", (d) => y(d))
          )
          .append("text")
          .attr("x", -6)
          .attr("y", (d) => -y(d))
          .attr("dy", "0.35em")
          .attr("paint-order", "stroke")
          .attr("stroke", "#fff")
          .attr("fill", "#000")
          .attr("stroke-width", 5)
          .text((d) => d3.format(",")(d))
      );

    const legend = d3.select("#legend");
    legend
      .selectAll(".legend-item")
      .data(countries)
      .join("li")
      .attr("class", "legend-item")
      .html(
        (d) =>
          `<div class="legend-color" style="background-color: ${color(
            d
          )}"></div>${d}`
      );

    d3.select("body")
      .append("div")
      .attr("id", "tooltip")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("background", "#fff")
      .style("padding", "5px")
      .style("border", "1px solid #ccc")
      .style("border-radius", "3px")
      .style("opacity", 0);
  } catch (error) {
    console.error("Error loading or processing data:", error);
  }
});
