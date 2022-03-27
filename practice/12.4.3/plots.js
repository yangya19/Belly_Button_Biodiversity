function init() {
    var selector = d3.select("#selDataset");
  
    d3.json("samples.json").then((data) => {
      console.log(data);
      var sampleNames = data.names;
      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });
  })}
  
  init();

function optionChanged(newSample) {
    buildMetadata(newSample);
}

function buildMetadata(sample) {
    d3.json("samples.json").then((data) => {
      var metadata = data.metadata;
      var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
      var result = resultArray[0];
      console.log(resultArray);
      var PANEL = d3.select("#sample-metadata");
  
      PANEL.html("");
      //PANEL.append("h6").text(Object.entries(result));
      
      for (const [key, value] of Object.entries(result)) {
        PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
      }
    });
  }
