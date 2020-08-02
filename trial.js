(function() {

  function filterJSON(json, key, value) {
      var result = [];
      json.forEach(function(val,idx,arr){
        if(val[key] == value){
        
          result.push(val)
        }
      })
      return result;
    }
  
    // Set the dimensions of the canvas / graph
    var margin = {top: 50, right: 20, bottom: 30, left: 60},
        width = 600 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;
    
    // Parse the date / time
    
    
    // Set the ranges
    var x = d3.scale.linear().range([0, width]);
    var y = d3.scale.linear().range([height, 0]);
    
    // Define the line
    var stateline = d3.svg.line()
            .interpolate("cardinal")
        .x(function(d) { return x(d.year); })
        .y(function(d) { return y(d.value); });
  
    // Adds the svg canvas
    var svg = d3.select("#third_chart_svg")
        .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform",
                  "translate(" + margin.left + "," + margin.top + ")");
    // var data;

    // Define the axes
    var xAxis = d3.svg.axis().scale(x)
        .orient("bottom")
        
    
    var yAxis = d3.svg.axis().scale(y)
        .orient("left");
    
    // Get the data
    d3.json("my_data.json", function(error, json) {
      //console.log(json)
     
      json.forEach(function(d) {
            d.value = +d.value;
      });
    // generate initial graph
    
        d3.select('#inds')
                .on("change", function () {
                    var sect = document.getElementById("inds");
                    var section = sect.options[sect.selectedIndex].value;
    
                    data = filterJSON(json, 'produce', section);
    
          
              //debugger
              
                data.forEach(function(d) {
                    d.value = +d.value;
                    //d.year = parseDate(String(d.year));
                    d.active = true;
                });
            
                
                //debugger
                clearAll();
                    updateGraph(data);
  
                    jQuery('h1.page-header').html(section);
                });
    
                data = filterJSON(json, 'produce', 'Australia');
                updateGraph(data);
                    
                //jQuery('h1.page-header').html(section);
 
    });
    
    var color = d3.scale.ordinal().range(["#48A36D",  "#0096ff", "#ff007e"]);
    
  
    var bisect = d3.bisector(function(d) { 
      
      return d.year; }).left;
    var focus = svg
      .append('g')
      .append('circle')
        .style("fill", "none")
        .attr("stroke", "black")
        .attr('r', 8.5)
        .style("opacity", 0)
  
  // Create the text that travels along the curve of chart
  var focusText = svg
  .append('g')
  .append('text')
    .style("opacity", 0)
    .attr("text-anchor", "left")
    .attr("alignment-baseline", "middle")
  
  
  
        svg
        .append('rect')
        .style("fill", "none")
        .style("pointer-events", "all")
        .attr('width', width)
        .attr('height', height)
        .on('mouseover', mouseover)
        .on('mousemove', mousemove)
        .on('mouseout', mouseout);
  
  
        // What happens when the mouse move -> show the annotations at the right positions.
    function mouseover() {
      focus.style("opacity", 1)
      focusText.style("opacity",1)
    }
  
    function mousemove() {
      // recover coordinate we need
      var x0 = x.invert(d3.mouse(this)[0]);
      var i = bisect(data, x0, 1);
      console.log(data,i)
      selectedData = data[i]
      focus
        .attr("cx", x(selectedData.year))
        .attr("cy", y(selectedData.value))
      focusText
        .html("Year :" + selectedData.year + "  -  " + "Value:" + selectedData.value)
        .attr("x", x(selectedData.year)+15)
        .attr("y", y(selectedData.value))
      }
    function mouseout() {
      focus.style("opacity", 0)
      focusText.style("opacity", 0)
    }
  
    function updateGraph(data) {
        

        // Scale the range of the data
        x.domain(d3.extent(data, function(d) { return d.year; }));
        y.domain([d3.min(data, function(d) { return d.value; }), d3.max(data, function(d) { return d.value; })]);
    
       // svg.selectAll(".line").data(result, function(d){return d.key}).exit().remove()
        // Nest the entries by state
        dataNest = d3.nest()
            .key(function(d) {return d.state;})
            .entries(data);
    

             var result = dataNest.filter(function(val,idx, arr){
                      return $("." + val.key).attr("fill") != "#ccc" 
                      // matching the data with selector status
                    })
                    
              console.log(result)
             var state = svg.selectAll(".line")
          .data(result, function(d){return d.key});

          state.enter().append("path")
                .attr("class", "line");
    
            state.transition()
                .style("stroke", function(d,i) { return d.color = color(d.key); })
                .attr("id", function(d){ return 'tag'+d.key.replace(/\s+/g, '');}) // assign ID
                .attr("d", function(d){
            
                    return stateline(d.values)
                });
    
            state.exit().remove();
    
            var legend = d3.select("#legend")
                .selectAll("text")
                .data(dataNest, function(d){return  d.key});
    
            //checkboxes
            legend.enter().append("rect")
              .attr("width", 10)
              .attr("height", 10)
              .attr("x", 0)
              .attr("y", function (d, i) { return 0 +i*15; })  // spacing
              .attr("fill",function(d) { 
                return color(d.key);
                
              })
              .attr("class", function(d,i){return "legendcheckbox " + d.key})
                .on("click", function(d){
                  d.active = !d.active;
                  
                  /*
                  d3.select(this).attr("fill", function(d){
                    if(d3.select(this).attr("fill")  == "#ccc"){
                      return color(d.key);
                    }else {
                      return "#ccc";
                    }
                  })*/
                  
                  
                 var result = dataNest.filter(function(val,idx, arr){
             return $("." + val.key).attr("fill") != "#ccc" 
           // matching the data with selector status
          })


           // Hide or show the lines based on the ID
           svg.selectAll(".line").data(result, function(d){return d.key})
             .enter()
             .append("path")
             .attr("class", "line")
             .style("stroke", function(d,i) { return d.color = color(d.key); })
            .attr("d", function(d){
                    return stateline(d.values);
             });
  
             /*
      svg.selectAll(".line").data(result,function(d){
          console.log(d)
          return d.key})
     .enter().append("text").attr("transform", function(d) {
         console.log(d)
      return "translate(" + x(d.value.Year) + "," + y(d.value.temperature) + ")";
    }).attr("x", -5)
    .attr("dy", 10)
    .text(function(d) {
      return d.name;
    });
          */
     
     svg.selectAll(".line").data(result, function(d){return d.key}).exit().remove()  
                        
                })
    /*  
    
    var city = g.selectAll(".city")
    .data(cities)
    .enter().append("g")
    .attr("class", "city");
      
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
  .attr("dy", 10)
  .text(function(d) {
    return d.name;
  });
  */
        // Add the Legend text
        legend.enter().append("text")
          .attr("x", 10)
          .attr("y", function(d,i){return 10 +i*15;})
          .attr("class", "legend");
    
            legend.transition()
          .style("fill", "#777" )
          .text(function(d){
            if (d.key == "sales")
              return "Sales Of Cigarattes per adult per day";
            else
              return "Lung Cancer death rates per 10.000 people";
            
            ;});
    
            legend.exit().remove();
    
            svg.selectAll(".axis").remove();
            //svg.selectAll(".line").exit().remove();
      console.log(height)
        // Add the X Axis
        
        // text label for the x axis
svg.append("text")             
.attr("transform",
      "translate(" + (width/2) + " ," + 
                     (height + margin.top-20) + ")")
.style("text-anchor", "middle").style("font-size","12px")
.text("Years");
        
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));
    



  
svg.append("text")
.attr("transform", "rotate(-90)")
.attr("y", 0 - margin.left+10)
.attr("x",0 - (height / 2))
.attr("dy", "1em")
.style("text-anchor", "middle").style("font-size","12px")
.text("Sales of smokes & Lung Cancer Deaths");      


        // Add the Y Axis
        svg.append("g")
            .attr("class", "y axis")
            .call(d3.axisLeft(y));
  
  
  
  
            // add the cursor
  
    var bisect = d3.bisector(function(d) { 
      
      return d.year; }).left;
    var focus = svg
      .append('g')
      .append('circle')
        .style("fill", "none")
        .attr("stroke", "black")
        .attr('r', 8.5)
        .style("opacity", 0)
  
  // Create the text that travels along the curve of chart
  var focusText = svg
  .append('g')
  .append('text')
    .style("opacity", 0)
    .attr("text-anchor", "left")
    .attr("alignment-baseline", "middle")
  
  
  
        svg
        .append('rect')
        .style("fill", "none")
        .style("pointer-events", "all")
        .attr('width', width)
        .attr('height', height)
        .on('mouseover', mouseover)
        .on('mousemove', mousemove)
        .on('mouseout', mouseout);
  
  
        // What happens when the mouse move -> show the annotations at the right positions.
    function mouseover() {
      focus.style("opacity", 1)
      focusText.style("opacity",1)
    }
  
    function mousemove() {
      // recover coordinate we need
      var x0 = x.invert(d3.mouse(this)[0]);
      var i = bisect(data, x0, 1);
      selectedData = data[i]
      focus
        .attr("cx", x(selectedData.year))
        .attr("cy", y(selectedData.value))
      focusText
        .html("Year :" + selectedData.year + "  \n " + "Count:" + selectedData.value.toFixed(1))
        .attr("x", x(selectedData.year)+15)
        .attr("y", y(selectedData.value))
      }
    function mouseout() {
      focus.style("opacity", 0)
      focusText.style("opacity", 0)
    }
        // add the black cursor 
  

        var mouseG = svg.append("g")
        .attr("class", "mouse-over-effects");
      
      mouseG.append("path") // this is the black vertical line to follow mouse
        .attr("class", "mouse-line")
        .style("stroke", "red")
        .style("stroke-width", "1px")
        .style("opacity", "0");
        
      
      // Put more floating point precision !!!!!




        var lines = document.getElementsByClassName('line');
        
        var mousePerLine = mouseG.selectAll('.mouse-per-line')
          .data(result)
          .enter()
          .append("g")
          .attr("class", "mouse-per-line");
      
      
          mousePerLine.append("circle")
          .attr("r", 7)
          .style("stroke", "#E53A40")
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
          .text(y.invert(pos.y).toFixed(2));
          
        return "translate(" + mouse[0] + "," + pos.y +")";
      });
      }) ;
  
    };
    
    function clearAll(){
      d3.selectAll(".line")
        .transition().duration(100)
                .attr("d", function(d){
            return null;
          });

          d3.selectAll(".mouse-per-line circle")
          .remove();
          d3.selectAll(".mouse-per-line text").remove()
          d3.selectAll(".mouse-line").remove();
          // d3.selectAll(".mouse-over-effects").remove()
      /*
      d3.select("#legend").selectAll("rect")
      .transition().duration(100)
          .attr("fill", "#ccc");*/

    };
    
    function showAll(){
      d3.selectAll(".line")
        .transition().duration(100)
                .attr("d", function(d){
            return stateline(d.values);
          });
      d3.select("#legend").selectAll("rect")
      .attr("fill",function(d) {
        if (d.active == true){
           return color(d.key);
         }
       })
    };
  })();
  