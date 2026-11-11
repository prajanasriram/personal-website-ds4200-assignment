
d3.csv("included_participant_counts_by_month.csv").then(function(data) {

    data.forEach(d => {
        d.Month = d.Month.trim();
        d.Participants = +d.Participants;
    });

    const width = 750;
    const height = 450;
    const margin = {
        top: 60,
        right: 30,
        bottom: 70,
        left: 70
    };

    const svg = d3.select("#chart")
        .append("svg")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .style("width", "100%");

    const x = d3.scaleBand()
        .domain(data.map(d => d.Month))
        .range([margin.left, width - margin.right])
        .padding(0.25);

    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.Participants)])
        .nice()
        .range([height - margin.bottom, margin.top]);

    svg.selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d.Month))
        .attr("y", d => y(d.Participants))
        .attr("width", x.bandwidth())
        .attr("height", d =>
            height - margin.bottom - y(d.Participants)
        )
        .attr("fill", "mediumpurple")
        .on("mouseover", function() {
            d3.select(this).attr("fill", "rebeccapurple");
        })
        .on("mouseout", function() {
            d3.select(this).attr("fill", "mediumpurple");
        })
        .append("title")
        .text(d => `${d.Month}: ${d.Participants} participants`);

    svg.append("g")
        .attr("transform",
            `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x));

    svg.append("g")
        .attr("transform",
            `translate(${margin.left},0)`)
        .call(d3.axisLeft(y).ticks(9).tickFormat(d3.format("d")));

    svg.append("text")
        .attr("x", width / 2)
        .attr("y", 30)
        .attr("text-anchor", "middle")
        .attr("font-size", "20px")
        .attr("font-weight", "bold")
        .text("Participants Included Per Month");

    svg.selectAll(".label")
        .data(data)
        .enter()
        .append("text")
        .attr("x", d => x(d.Month) + x.bandwidth() / 2)
        .attr("y", d => y(d.Participants) - 8)
        .attr("text-anchor", "middle")
        .text(d => d.Participants);

}).catch(function(error) {
    console.error("Error loading CSV:", error);
});
