(function() {
var svg = d3.select("#crime_over_time_svg"),
    margin = {top: 20, right: 120, bottom: 60, left: 70},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    



    var x = d3.scaleLinear()
    .range([0, width]);

  var y = d3.scaleLinear()
    .range([height, 0]);

var color = d3.scaleOrdinal(d3.schemeCategory10);
    
var y_axis = d3.axisLeft(y);
var x_axis = d3.axisBottom(x);

var line = d3.line().x(function(d) {
  return x(d.Year);
})
.y(function(d) {
  return y(d.temperature);
});

    // var data = d3.csv("data/number-of-deaths-by-risk-factor.csv");
    
d3.queue()
.defer(d3.csv, 'data/number-of-deaths-by-risk-factor.csv', d3.autoType)
.await(function(error, my_data){
  my_data.forEach(function(d) {
    d.Year = +d.Year;
    
  });
  //var axes_list = ["70+ years old ","Under-5s ","All ages ","5-14 years old ","50-69 years old ","15-49 years old "]


  data = my_data;

  // taken inside starting from here



  color.domain(d3.keys(data[0]).filter(function(key) {
    return key !== "Year";
  }));
  data.forEach(function(d) {
    d.Year = +d.Year;
  });


  var cities = color.domain().map(function(name) {
    

    return {

      name: name,
      values: data.map(function(d) {
        return {
          Year: +d.Year,
          temperature: +d[name]
        };
      })
    };
  });
 
  
  x.domain(d3.extent(data, function(d) {
    return d.Year;
  }));

  y.domain([
    d3.min(cities, function(c) {
      return d3.min(c.values, function(v) {
        return v.temperature;
      });
    }),
    d3.max(cities, function(c) {
      return d3.max(c.values, function(v) {
        return v.temperature;
      });
    })
  ]);


  

  g.append("text")             
  .attr("transform",
        "translate(" + (width/2) + " ," + 
                       (height + margin.top + 10) + ")")
  .style("text-anchor", "middle").style("font-size","12px")
  .text("Years");
  
  
  g.append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(0," + height + ")")
  .call(x_axis);





  g.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 0 - margin.left)
  .attr("x",0 - (height / 2))
  .attr("dy", "1em")
  .style("text-anchor", "middle").style("font-size","12px")
  .text("Number of premature deaths");


g.append("g")
  .attr("class", "y axis")
  .call(y_axis)
  .append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 6)
  .attr("dy", ".71em")
  .style("text-anchor", "end")
  .text("Temperature (ºF)");



  var city = g.selectAll(".city")
  .data(cities)
  .enter().append("g")
  .attr("class", "city");

city.append("path")
  .attr("class", "line")
  .attr("d", function(d) {
    return line(d.values);
  })
  .style("stroke", function(d) {
    return color(d.name);
  });

city.append("text")
  .datum(function(d) {
    return {
      name: d.name,
      value: d.values[d.values.length - 1]
    };
  })
  .attr("transform", function(d) {
    return "translate(" + x(d.value.Year) + "," + y(d.value.temperature) + ")";
  })
  .attr("x", -5)
  .attr("dy", 5)
  .attr("class","secondchartlabels")
  .text(function(d) {
    return d.name;
  });



  var mouseG = g.append("g")
  .attr("class", "mouse-over-effects");

mouseG.append("path") // this is the black vertical line to follow mouse
  .attr("class", "mouse-line")
  .style("stroke", "black")
  .style("stroke-width", "1px")
  .style("opacity", "0");
  


  var lines = document.getElementsByClassName('line');
  
  var mousePerLine = mouseG.selectAll('.mouse-per-line')
    .data(cities)
    .enter()
    .append("g")
    .attr("class", "mouse-per-line");



    mousePerLine.append("circle")
    .attr("r", 7)
    .style("stroke", function(d) {
      return color(d.name);
    })
    .style("fill", "none")
    .style("stroke-width", "1px")
    .style("opacity", "0");

  mousePerLine.append("text")
    .attr("transform", "translate(10,3)");

  
    mouseG.append('svg:rect') // append a rect to catch mouse movements on canvas
    .attr('width', width) // can't catch mouse events on a g element
    .attr('height', height)
    .attr('fill', 'none')
    .attr('pointer-events', 'all')
    .on('mouseout', function() { // on mouse out hide line, circles and text
      d3.select(".mouse-line")
        .style("opacity", "0");
      d3.selectAll(".mouse-per-line circle")
        .style("opacity", "0");
      d3.selectAll(".mouse-per-line text")
        .style("opacity", "0");
    })
    .on('mouseover', function() { // on mouse in show line, circles and text
      d3.select(".mouse-line")
        .style("opacity", "1");
      d3.selectAll(".mouse-per-line circle")
        .style("opacity", "1");
      d3.selectAll(".mouse-per-line text")
        .style("opacity", "1");
    })
    .on('mousemove', function() { // mouse moving over canvas
      var mouse = d3.mouse(this);
      d3.select(".mouse-line")
        .attr("d", function() {
          var d = "M" + mouse[0] + "," + height;
          d += " " + mouse[0] + "," + 0;
          return d;
        });
        

        
d3.selectAll(".mouse-per-line")
.attr("transform", function(d, i) {
  //console.log(width/mouse[0])
  //var mouse = d3.mouse(this)
  var xDate = x.invert(mouse[0]),
      bisect = d3.bisector(function(d) { return d.date; }).right;
      idx = bisect(d.values, xDate);
  
  var beginning = 0,
      end = lines[i].getTotalLength(),
      target = null;

  while (true){
    target = Math.floor((beginning + end) / 2);
    pos = lines[i].getPointAtLength(target);
    if ((target === end || target === beginning) && pos.x !== mouse[0]) {
        break;
    }
    if (pos.x > mouse[0])      end = target;
    else if (pos.x < mouse[0]) beginning = target;
    else break; //position found
  }
  
  d3.select(this).select('text').attr("class","slidertext_chart2")
    .text(y.invert(pos.y).toFixed());
    
  return "translate(" + mouse[0] + "," + pos.y +")";
});
}) ;
// d3.csv('data/number-of-deaths-by-risk-factor.csv')(function (data) {
//    console.log(data)
//  });
   
        });

      })();

