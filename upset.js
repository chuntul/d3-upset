

// takes two arrays of values and returns an array of intersecting values
function findIntersection(set1, set2) {
  //see which set is shorter
  var temp;
  if (set2.length > set1.length) {
      temp = set2, set2 = set1, set1 = temp;
  }

  return set1
    .filter(function(e) { //puts in the intersecting names
      return set2.indexOf(e) > -1;
    })
    .filter(function(e,i,c) { // gets rid of duplicates
      return c.indexOf(e) === i;
    })
}

//for the difference of arrays - particularly in the intersections and middles
//does not mutate any of the arrays
Array.prototype.diff = function(a) {
    return this.filter(function(i) {return a.indexOf(i) < 0;});
};

//for calculating solo datasets
function subtractUpset(i, inds, names) {
  var result = names[i].slice(0)
  for (var ind = 0; ind < inds.length; ind++) {
    // set1 vs set2 -> names[i] vs names[ind]
    for (var j = 0; j < names[inds[ind]].length; j++) { // for each element in set2
      if (result.includes(names[inds[ind]][j])) { 
        // if result has the element, remove the element
        // else, ignore
        var index = result.indexOf(names[inds[ind]][j])
        if (index > -1) {
          result.splice(index, 1)
        }
      }
    }
  }
  return result
}

//recursively gets the intersection for each dataset
function helperUpset(start, end, numSets, names, data) {
  if (end == numSets) {
    return data
  }
  else {
    var intSet = {
      "set": data[data.length-1].set + end.toString(),
      "names": findIntersection(data[data.length-1].names, names[end])
    }
    data.push(intSet)
    return helperUpset(start, end+1, numSets, names, data)
  }
}

function makeUpset(sets, names) { // names: [[],[]]
  //number of circles to make
  var numCircles = sets.length
  var numSets = sets.length

  //position and dimensions
  var margin = {
    top: 80,
    right: 100,
    bottom: 100,
    left: 100
  };
  var width = 600;
  var height=500;
  

  // make the canvas
  var svg = d3.select("#venn") 
      .append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
      .attr("xmlns", "http://www.w3.org/2000/svg")
      .attr("xmlns:xlink", "http://www.w3.org/1999/xlink")
      .append("g")
          .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")")
      .attr("fill", "white");

  // graph title
  var graphTitle = svg.append("text")
    .attr("text-anchor", "middle")
    .attr("fill","black")
    .style("font-size", "20px")
    .attr("transform", "translate("+ (width/2) +","+ -20 +")")
    .text("An UpSet plot");

     // make a group for the upset circle intersection things
  var upsetCircles = svg.append("g")
  .attr("id", "upsetCircles")
  .attr("transform", "translate(20," + (height-60) + ")")
  
  
  var rad = 13,
  height = 400;

  // computes intersections
  var data2 = []
    
  for (var i = 0; i < numSets; i++) {
    var intSet = {
      "set": i.toString(),
      "names": names[i]
    }
    data2.push(intSet)

    for (var j = i + 1; j < numSets; j++) {
      var intSet2 = {
        "set": i.toString() + j.toString(),
        "names": findIntersection(names[i], names[j])
      }
      data2.push(intSet2)
      helperUpset(i, j+1, numSets, names, data2)
    }
  }

  //removing all solo datasets and replacing with data just in those datasets (cannot intersect with others)
  var tempData = []
  for (var i = 0; i < data2.length; i++) {
    if (data2[i].set.length != 1) { // solo dataset
      tempData.push(data2[i])
    }
  }
  data2 = tempData

  for (var i = 0; i < numSets; i++) {
    var inds = Array.apply(null, {length: numSets}).map(Function.call, Number)
    var index = inds.indexOf(i)
    if (index > -1) {
      inds.splice(index, 1);
    }
    var result = subtractUpset(i, inds, names)
    data2.push({
      "set": i.toString(),
      "names": result
    })
  }

  // makes sure data is unique
  var unique = []
  var newData = []
  for (var i = 0; i < data2.length; i++) {
    if (unique.indexOf(data2[i].set) == -1) {
      unique.push(data2[i].set)
      newData.push(data2[i])
    }
  }

  var data = newData


  // making dataset labels
  for (var i = 0; i < numSets; i++) {

    upsetCircles.append("text")
      .attr("dx", -20)
      .attr("dy", 5 + i * (rad*2.7))
      .attr("text-anchor", "end")
      .attr("fill", "black")
      .style("font-size", 13)
      .text(sets[i])
  }

  // sort data decreasing
  data.sort(function(a, b) {
    return parseFloat(b.names.length) - parseFloat(a.names.length);
  });

  // make the bars
  var upsetBars = svg.append("g")
    .attr("id", "upsetBars")
    
    
    var nums = []
    for (var i = 0; i < data.length; i++) {
      nums.push(data[i].names.length)
    }

    var names = []
    for (var i = 0; i < data.length; i++) {
      names.push(data[i].names)
    }

  //set range for data by domain, and scale by range
  var xrange = d3.scale.linear()
    .domain([0, nums.length])
    .range([0, width]);


  var yrange = d3.scale.linear()
    .domain([0, nums[0]])
    .range([height, 0]);


  //set axes for graph
  var xAxis = d3.svg.axis()
    .scale(xrange)
    .orient("bottom")
    .tickPadding(2)
    .tickFormat(function(d,i) { return data[i].set})
    .tickValues(d3.range(data.length));

  var yAxis = d3.svg.axis()
    .scale(yrange)
    .orient("left")
    .tickSize(5)

  //add X axis
  upsetBars.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," +  height + ")")
      .attr("fill", "none")
      .attr("stroke", "black")
      .attr("stroke-width", 1)
      .call(xAxis)
      .selectAll(".tick")
      .remove()


  // Add the Y Axis
  upsetBars.append("g")
      .attr("class", "y axis")
      .attr("fill", "none")
      .attr("stroke", "black")
      .attr("stroke-width", 1)
      .call(yAxis)
      .selectAll("text")
      .attr("fill", "black")
      .attr("stroke", "none");

    

  var chart = upsetBars.append('g')
          .attr("transform", "translate(1,0)")
          .attr('id','chart')

  // adding each bar
  chart.selectAll('.bar')
          .data(data)
          .enter()
      .append('rect')
        .attr("class", "bar")
        .attr('width', 15)
        .attr({
          'x':function(d,i){ return (rad-1) + i * (rad*2.7)},
          'y':function(d){ return yrange(d.names.length)}
        })
            .style('fill', "darkslategrey")
            .attr('height',function(d){ return height - yrange(d.names.length); })

  //circles
  for (var i = 0; i < data.length; i++) {
    for (var j = 0; j < numSets; j++) {
      upsetCircles.append("circle")
        .attr("cx", i * (rad*2.7))
        .attr("cy", j * (rad*2.7))
        .attr("r", rad)
        .attr("id", "set" + i)
        .style("opacity", 1)
        .attr("fill", function() {
          if (data[i].set.indexOf(j.toString()) != -1) {
            return "darkslategrey"
          } else {
            return "silver"
          }
        })
      
    }

    if (data[i].set.length != 1) {
      upsetCircles.append("line")
        .attr("id",  "setline" + i)
        .attr("x1", i * (rad*2.7))
        .attr("y1", data[i].set.substring(0, 1) * (rad*2.7))
        .attr("x2", i * (rad*2.7))
        .attr("y2", data[i].set.substring(data[i].set.length - 1, data[i].set.length) * (rad*2.7))
        .style("stroke", "darkslategrey")
        .attr("stroke-width", 4)
      
    }
  }
}
