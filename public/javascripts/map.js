var width = 800,
    height = 500,
    centered,
    mapLayer,
    effectLayer,
    bigText,
    path,
    g;

// Define color scale
var color = d3.scaleLinear()
    .domain([1, 20])
    .clamp(true)
    .range(['#fff', '#409A99']);

var projection = d3.geoMercator()
    .scale(1500)
    // Center the Map in Colombia
    .center([-74, 4.5])
    .translate([width / 2, height / 2]);

// When clicked, zoom in
function clicked(d) {
    var x, y, k;

    // Compute centroid of the selected path
    if (d && centered !== d) {
        var centroid = path.centroid(d);
        x = centroid[0];
        y = centroid[1];
        k = 4;
        centered = d;
    } else {
        x = width / 2;
        y = height / 2;
        k = 1;
        centered = null;
    }

    // Highlight the clicked province
    mapLayer.selectAll('path')
        .style('fill', function (d) {
            return centered && d === centered ? '#D5708B' : "white";
        });

    // Zoom
    g.transition()
        .duration(750)
        .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')scale(' + k + ')translate(' + -x + ',' + -y + ')');
}

function mouseover(d) {
    // Highlight hovered province
    d3.select(this).style('fill', 'orange');
}

function mouseout(d) {
    // Reset province color
    mapLayer.selectAll('path')
        .style('fill', function (d) {
            return centered && d === centered ? '#D5708B' : "white";
        });

    // Remove effect text
    effectLayer.selectAll('text').transition()
        .style('opacity', 0)
        .remove();

    // Clear province name
    bigText.text('');
}

function initMap() {

    // Set svg width & height
    var svg = d3.select('svg')
        .attr('width', width)
        .attr('height', height);

    console.log("svg", svg.node());

    // Add background
    svg.append('rect')
        .attr('class', 'background')
        .attr('width', width)
        .attr('height', height)
        .on('click', clicked);

    g = svg.append('g');

    effectLayer = g.append('g')
        .classed('effect-layer', true);

    mapLayer = g.append('g')
        .classed('map-layer', true);

    var dummyText = g.append('text')
        .classed('dummy-text', true)
        .attr('x', 10)
        .attr('y', 30)
        .style('opacity', 0);

    bigText = g.append('text')
        .classed('big-text', true)
        .attr('x', 20)
        .attr('y', 45);
}

function initGeoJSON(){
    d3.json('/geojson/berlin.json', function (error, mapData) {
        d3.select("#geojson").node().value = JSON.stringify(mapData, null, 2);
    });
}

function updateMap(){
    console.log("updateMap()", JSON.parse(d3.select("#geojson").node().value).features);

    var geojson = JSON.parse(d3.select("#geojson").node().value);

    var center = d3.geoCentroid(geojson)
    var scale  = 1;
    var offset = [width/2, height/2];
    var projection = d3.geoMercator().scale(scale).center(center)
        .translate(offset);

    // create the path
    path = d3.geoPath().projection(projection);

    // using the path determine the bounds of the current map and use
    // these to determine better values for the scale and translation
    var bounds  = d3.geoBounds(geojson);
    var hscale = width / (bounds[1][0] - bounds[0][0]);
    var vscale = height / (bounds[1][1] - bounds[0][1]);
    var scale   = (hscale > vscale) ? hscale : vscale;
    var offset  = [width - (bounds[0][0] + bounds[1][0])/2, height - (bounds[0][1] + bounds[1][1])/2];

    // new projection
    projection.center(center)
        .scale(scale).translate(offset);

    // drop each province as a path
    mapLayer.selectAll('path').remove();

    // draw each province as a path
    mapLayer.selectAll('path')
        .data(geojson.features)
        .enter().append('path')
        .attr('d', path)
        .attr('vector-effect', 'non-scaling-stroke')
        .style('fill', "white")
        .on('mouseover', mouseover)
        .on('mouseout', mouseout)
        .on('click', clicked);
}