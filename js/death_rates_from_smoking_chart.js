(function() {

var barChart = d3.select("#overview_svg"),
      margin = {top: 20, right: 20, bottom: 120, left: 40},
      chartWidth = +barChart.attr("width") - margin.left - margin.right,
      chartHeight = +barChart.attr("height") - margin.top - margin.bottom;


var width = 650;//document.getElementById('vis').clientWidth;
var height = 450;//document.getElementById('vis')
    //.clientHeight;

var margin = {
    top: 10,
    bottom: 70,
    left: 70,
    right: 20
}
var axes_list = ["70+ years old ","50-69 years old ","All ages ","15-49 years old ","Under-5s ","5-14 years old "]


var g = barChart.append("g")
.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var tooltip = d3.select("#first_vis")
.append("div").attr("class","tooltip");


width = width - margin.left - margin.right;
height = height - margin.top - margin.bottom;

var data = {};


var x_scale = d3.scaleBand()
    .rangeRound([0, width])
    .padding(0.1);

var y_scale = d3.scaleLinear()
    .range([height, 0]);


/*
// Make x scale
var x_scale = d3.scaleBand()
.domain(axes_list)
.range([0, width]);

// Make y scale, the domain will be defined on bar update
var y_scale= d3.scaleLinear()
.range([height, 0]);
*/

var colour_scale = d3.scaleQuantile()
    .range(["#ffffe5", "#fff7bc", "#fee391", "#fec44f", "#fe9929", "#ec7014", "#cc4c02", "#993404", "#662506"]);

var y_axis = d3.axisLeft(y_scale);
var x_axis = d3.axisBottom(x_scale);

g.append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0,' + height + ')');

g.append('g')
    .attr('class', 'y axis');

function draw(year) {

    //var csv_data = data[year];
    //var current_year_data = data.filter(function(d){ return d.Year == year })
    var current_year_data = data[year];
    var t = d3.transition()
        .duration(2000);
    //console.log(current_year_data);
    //var axes_list = ["70+ years old ","Under-5s ","All ages ","5-14 years old ","50-69 years old ","15-49 years old "]
    
    x_scale.domain(axes_list)
    //console.log(axes_list)

    var max_value = d3.max(current_year_data)
    max_value= 1.1 * max_value;
  ;
  //var max_value = 2000 ;

  y_scale.domain([0, max_value]);
  colour_scale.domain([0, max_value]);
  //console.log(max_value)
  //console.log(height)
  //console.log(current_year_data[0]);

var bars = g.selectAll(".bar").data(current_year_data);
bars.enter()
                      .append("rect")
                      .on("mouseover",showTooltip)
                      .on("mousemove",moveTooltip)
                      .on("mouseout",hideTooltip)
                        .attr("class", "bar")
                        .attr("x", function(d,i) { 
                          //console.log(x_scale( axes_list[i]))
                          return x_scale( axes_list[i] ); })
                        .attr("width", 80)
                        .attr("y", function(d,i) { 
                          
                          //console.log(y_scale(axes_list[i]));

                          return y_scale(d); })
                        .attr("height", function(d,i) { return height - y_scale(d); });
                    // Update old ones, already have x / width from before
                    bars
                        .transition().duration(2000)
                        .attr("y", function(d,i) { return y_scale(d); })
                        .attr('fill', function(d) {
                          return colour_scale(+d);
                      })
                        .attr("height", function(d,i) { return height - y_scale(d); });

                    // Remove old ones
                    //bars.exit().remove();

// text label for the x axis
g.append("text")             
.attr("transform",
      "translate(" + (width/2) + " ," + 
                     (height + margin.top + 30) + ")")
.style("text-anchor", "middle").style("font-size","12px")
.text("Year Interval");

g.select('.x.axis')
  .call(x_axis);


  

g.select('.y.axis')
  .transition(t)
  .call(y_axis);

g.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 0 - margin.left)
  .attr("x",0 - (height / 2))
  .attr("dy", "1em")
  .style("text-anchor", "middle").style("font-size","12px")
  .text("Deaths per 100.000 people");      



    /*
    var months = csv_data.map(function(d) {
        return d.month;
    });
    x_scale.domain(months);

    var max_value = d3.max(csv_data, function(d) {
        return +d.value;
    });

    y_scale.domain([0, max_value]);
    colour_scale.domain([0, max_value]);

    var bars = svg.selectAll('.bar')
        .data(csv_data)

    bars
        .exit()
        .remove();

    var new_bars = bars
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('x', function(d) {
            return x_scale(d.month);
        })
        .attr('width', x_scale.bandwidth())
        .attr('y', height)
        .attr('height', 0)

    new_bars.merge(bars)
        .transition(t)
        .attr('y', function(d) {
            return y_scale(+d.value);
        })
        .attr('height', function(d) {
            return height - y_scale(+d.value)
        })
        .attr('fill', function(d) {
            return colour_scale(+d.value);
        })

    svg.select('.x.axis')
        .call(x_axis);

    svg.select('.y.axis')
        .transition(t)
        .call(y_axis);
*/
}

d3.queue()
    .defer(d3.csv, 'data/smoking-deaths-in-world-by-age.csv')
    .await(function(error, my_data){
      my_data.forEach(function(d) {
        d.Year = +d.Year;
        d["5-14 years old "] = +d["5-14 years old "];
        d["Under-5s "] = +d["Under-5s "];
        d["50-69 years old "] = +d["50-69 years old "];
        d["15-49 years old "] = +d["15-49 years old "];
        d["70+ years old "] = +d["70+ years old "];
        d["All ages "] = +d["All ages "];
        
        
      });
      //var axes_list = ["70+ years old ","Under-5s ","All ages ","5-14 years old ","50-69 years old ","15-49 years old "]

      var cerealMap = {};
      my_data.forEach(function(d) {
          var cereal = d.Year;
          cerealMap[cereal] = [];

          // { cerealName: [ bar1Val, bar2Val, ... ] }
          axes_list.forEach(function(field) {
              cerealMap[cereal].push( +d[field] );
          });
      });
      //filtered = my_data.filter(function(d){ return d.Year == "1994" })

      //console.log(filtered);
      //console.log(cerealMap);
      //console.log(cerealMap[2000])
      data = cerealMap;
      //data = my_data ;
      
      /*data['2009'] = d2009;
        data['2010'] = d2010;
        data['2011'] = d2011;
        data['2012'] = d2012;
        data['2013'] = d2013;
        data['2014'] = d2014;
        draw('2014');*/
        //console.log(my_data);
        draw(2017);
    }) ;

//console.log(my_data);
var tooltipOffset = {x: 5, y: -35};

    function showTooltip(d,i) {
        
        //console.log(i)


        if (i==1){



        }

    
      moveTooltip();
      
      tooltip.style("display","block")
        .append("text")
          .html("Mortality Count: " + Math.floor(d));
    }

    function moveTooltip() {
      tooltip.style("top",(d3.event.pageY+tooltipOffset.y)+"px")
          .style("left",(d3.event.pageX+tooltipOffset.x)+"px");
    }

    function hideTooltip() {
      tooltip.style("display","none");
      tooltip.selectAll("text").remove();
    }

var slider = d3.select('#year');
slider.on('change', function() {
    draw(this.value);
});

})();
