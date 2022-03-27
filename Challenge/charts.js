function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });
  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samples = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
    // G1. Create a variable that filters the metadata array for the object with the desired sample number.
    var metadata = data.metadata;
    var metadataArray = metadata.filter(sampleObj => sampleObj.id == sample);
    //  5. Create a variable that holds the first sample in the array.
    var firstSample = resultArray[0];
    // G2. Create a variable that holds the first sample in the metadata array.
    var firstMetadata = metadataArray[0];

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuIds = firstSample.otu_ids;
    var otuLabels = firstSample.otu_labels;
    var sampleValues = firstSample.sample_values;
    // G3. Create a variable that holds the washing frequency.
    var washingfreq = parseFloat(firstMetadata.wfreq);
    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    var completeArray = otuIds.map((data, index) => {
      return {
        otu_ids: data,
        otu_labels: otuLabels[index],
        sample_values: sampleValues[index]
      }
    });

  var bacteriasSort = completeArray.sort(
    function(a,b) {
      return (a.sample_values - b.sample_values)
      });
  
  var toptenbacteria = bacteriasSort.reverse().slice(0,10);

  var yaxis = toptenbacteria.map(data => `OTU ${data.otu_ids}`);
  var samplevalueData = toptenbacteria.map(data => data.sample_values);
  var text = toptenbacteria.map(data => data.otu_labels);

// 8. Create the trace for the bar chart. 
  var barData = {
    x: samplevalueData,
    y: yaxis,
    type: "bar",
    orientation: "h",
    text: text
  };

// 9. Create the layout for the bar chart. 
  var barLayout = {
    yaxis:{
      autorange: 'reversed'
    },
    title: "Top 10 bacteria Cultures Found"
    };
// 10. Use Plotly to plot the data with the layout. 
  Plotly.newPlot("bar", [barData], barLayout)
// Bubble Chart
// 1. Create the trace for the bubble chart.
var idsBubble = bacteriasSort.map(data => data.otu_ids);
var valuesBubble = bacteriasSort.map(data => data.sample_values);
var bubbleData = {
  x: idsBubble,
  y: valuesBubble,
  text: text,
  mode: 'markers',
  marker: {
    size:valuesBubble,
    color:idsBubble,
    colorscale: 'Earth'
  }
};
// 2. Create the layout for the bubble chart.
var bubbleLayout = {
  title: 'Bacteria Cultures Per Sample',
  xaxis: {title:{text: 'OTU ID'}},
};

var data = [bubbleData];

// 3. Use Plotly to plot the data with the layout.
Plotly.newPlot("bubble", data, bubbleLayout); 

// Gauge Chart
// G4. Create the trace for the gauge chart.
var data = [
  {
  value: washingfreq,
  title: { text:"<b>Belly Button Washing Frequency</b><br>Scrubs per Week" },
  type: "indicator",
  mode: "gauge+number",
  gauge: {
    axis: { range: [null, 10]},
    bar: {color: "black"},
    steps: [
      { range: [0,2], color: "red"},
      { range: [2,4], color: "orange"},
      { range: [4,6], color: "yellow"},
      { range: [6,8], color: "lightgreen"},
      { range: [8,10], color: "green"}
    ]
  }
}
];

// G5. Create the layout for the gauge chart.
var layout = {width: 600, height: 500, margin: {t: 0, b: 0}};
// G6. Use Plotly to plot the gauge data and layout.
Plotly.newPlot('gauge', data, layout);
});
}