var width = 800,
    height = 500,
    centered,
    mapLayer,
    labelLayer,
    effectLayer,
    bigText,
    path,
    g,
    geojson,
    projection ;

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
        .classed("centered", function (d) {
            return centered && d === centered;
        });

    // Zoom
    g.transition()
        .duration(750)
        .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')scale(' + k + ')translate(' + -x + ',' + -y + ')');
}

function mouseover(d) {
    // Highlight hovered province
    d3.select(this).classed('mouseover', true);
}

function mouseout(d) {
    // Reset province color
    mapLayer.selectAll('path')
        .classed('mouseover', function (d) {
            return centered && d === centered;
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
        .classed('background', true)
        .attr('width', width)
        .attr('width', width)
        .attr('height', height)
        .on('click', clicked);

    g = svg.append('g');

    effectLayer = g.append('g')
        .classed('effect-layer', true);

    mapLayer = g.append('g')
        .classed('map-layer', true);

    labelLayer = g.append('g')
        .classed('label-layer', true);

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

function initBerlin(){
    d3.json('/geojson/berlin.json', function (error, mapData) {
        geojson = mapData;
        d3.select("#geojson").node().value = JSON.stringify(geojson, null, 2);
        updateMap();
    });
}

function initColumbia(){
    d3.json('/geojson/columbia.json', function (error, mapData) {
        geojson = mapData;
        d3.select("#geojson").node().value = JSON.stringify(geojson, null, 2);
        updateMap();
    });
}

function updateMap(){
    console.log("updateMap()", JSON.parse(d3.select("#geojson").node().value).features);

    projection = getSelectedProjection().fitSize([width, height], geojson);
    path = d3.geoPath().projection(projection);

    // drop each province as a path
    mapLayer.selectAll('path').remove();

    // draw each province as a path
    mapLayer.selectAll('path')
        .data(geojson.features)
        .enter().append('path')
        .attr('d', path)
        .attr('vector-effect', 'non-scaling-stroke')
        .on('mouseover', mouseover)
        .on('mouseout', mouseout)
        .on('click', clicked);
}

function getSelectedProjection(){
    var targetProjection = d3.select('#targetProjection').node();
    var selectedProjection = targetProjection.options[targetProjection.selectedIndex].value;
    switch(selectedProjection){
        case "conicEqualArea":
            return d3.geoConicEqualArea();
        case "albers":
            return d3.geoAlbers();
        case "latlon":
        default:
            return d3.geoMercator();
    }

}


/**
 * LABELS
 */
function updateLabels(){

    var labelPattern = d3.select("#labelPattern").node().value;

    var centroids = [];
    geojson.features.forEach(function (f) {
        console.log("f", f);
        var c = path.centroid(f);
        centroids.push(
            {
                center: c,
                label: f.properties[labelPattern]
            });
    });

    labelLayer.selectAll("text").remove();
    labelLayer.selectAll("text")
        .data(centroids)
        .enter()
        .append('text')
        .attr("dx", function(d) {
            return d.center[0];
        })
        .attr("dy", function(d) {
            return d.center[1];
        })
        .attr("text-anchor", "middle")
        .text(function(d){
           return d.label;
        });


    labelLayer.selectAll("circle").remove();
    labelLayer.selectAll("circle")
        .data(centroids)
        .enter()
        .append('circle')
        .attr("cx", function(d) {
            return d.center[0];
        })
        .attr("cy", function(d) {
            return d.center[1];
        })
        .attr("fill", "green")
        .attr("r", 5);

}