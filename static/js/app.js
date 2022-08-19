d3.json("data/samples.json").then((data)=> {
    data.names.forEach(function(data) {
    dropdown.append("option").text(data).property("value")
    });

    getPlots(data.names[0]);
    getData(data.names[0]);
});

let dropdown = d3.select("#selDataset");

function getData(id) {
    d3.json("data/samples.json").then((data)=> {
        let metadata = data.metadata;
        let result = metadata.filter(meta => meta.id.toString() === id)[0];
        let demographicInfo = d3.select("#sample-metadata");
        demographicInfo.html("");

        Object.entries(result).forEach((key) => {   
                demographicInfo.append("h4").text(key[0].toUpperCase() + ": " + key[1] + "\n");    
        });
    });
}

function getPlots(id) {

    d3.json("data/samples.json").then((data)=> {
        let metadata = data.metadata;
        let result = metadata.filter(meta => meta.id.toString() === id)[0];
        let wfreq = result.wfreq;
        let samples = data.samples.filter(sample => sample.id.toString() === id)[0];
        let samplevalues = samples.sample_values.slice(0, 10).reverse();
        let OTU_top = (samples.otu_ids.slice(0, 10)).reverse();
        let OTU_id = OTU_top.map(d => "OTU " + d)
        let labels = samples.otu_labels.slice(0, 10);
        let trace = {
            x: samplevalues,
            y: OTU_id,
            text: labels,
            marker: {
            color: 'rgb(68,114,196)'},
            type:"bar",
            orientation: "h",
        };

        let bar_data = [trace];

        let bar_layout = {
            title: "Top 10 OTU",
            yaxis:{
                tickmode:"linear",
            },
            margin: {
                l: 125,
                r: 5,
                t: 75,
                b: 0

            }
        };

        Plotly.newPlot("bar", bar_data, bar_layout);

        let trace1 = {
            x: samples.otu_ids,
            y: samples.sample_values,
            mode: "markers",
            marker: {
                size: samples.sample_values,
                color: samples.otu_ids
            },
            text: samples.otu_labels

        };


        let bubble_layout = {
            xaxis:{title: "OTU ID"},
            yaxis:{title: "Germ Count in Sample"},
            title:{text:"Germ Types & Volumes Found"},
            height: 800,
            width: 1300
        };

        let bubble_data = [trace1];

        Plotly.newPlot("bubble", bubble_data, bubble_layout); 

        let gauge_data = [
        {
        domain: { x: [0, 1], y: [0, 1] },
        value: parseFloat(wfreq),
        title: { text: `Legal Department Maturity` },
        type: "indicator",
        
        mode: "gauge+number",
        gauge: { axis: { range: [null, 10] },
                steps: [
                    { range: [0, 2], color: 'rgb(217,226,243)'},
                    { range: [2, 4], color: 'rgb(191,207,235)' },
                    { range: [4, 6], color: 'rgb(156,180,224)' },
                    { range: [6, 8], color: 'rgb(112,147,210)' },
                    { range: [8, 10], color: 'rgb(68,114,196)' },
                ]}
            
        }
        ];
        
        let gauge_layout = { 
            width: 550, 
            height: 600, 
            margin: { t: 20, b: 0, l:0, r:170 } 
        };
        Plotly.newPlot("gauge", gauge_data, gauge_layout);
    });
} 

function optionChanged(id) {
    getPlots(id);
    getData(id);
}