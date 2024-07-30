const NeuralSeek = require('./services/neuralseek');
const ElasticSearch = require('./services/elastic_search');
const ChartJs = require('./services/chartjs');
const HighChart = require('./services/highchart');

if (require.main === module) {
    (async () => {
        const ns = new NeuralSeek();
        const es = new ElasticSearch();
        const ch = new ChartJs();
        const hch = new HighChart();

        const sections = [
            {
                step: 1,
                type: "study case header",
                query: `We are creating a Case Study Summary based on a JSON knowledge base structure. 
                        It will have the document name, page and paragraphs content in the JSON below. 
                        Now we are at the section number $1 for a Case Study Summary which is the $2 to introduce and show the case.
                        The output is just a HTML string with no indications. Further indications are useless.
                        Use Lato font to make content look modern and simple. Use the font CDN.

                        Create the title and description for the Case  Study Summary.`
            },
            {
                step: 2,
                type: "key notes design",
                query: `We are creating a Case Study Summary based on a JSON knowledge base structure. 
                        It will have the document name, page and paragraphs content in the JSON below. 
                        Now we are at the section number $1 for a Case Study Summary which is the $2 section to highligh key inclusion and exclusion criteria.
                        The output is just a HTML string with no indications. Further indications are useless.
                        Use Lato font to make content look modern and simple. Use the font CDN.

                        Create two modern, simple and centered cards to list key inclusion and key exclusion criteria for the Case Study Summary. List it with bullets`
            },
            {
                step: 3,
                type: "endpoints",
                query: `We are creating a Case Study Summary based on a JSON knowledge base structure. 
                        It will have the document name, page and paragraphs content in the JSON below. 
                        Now we are at the section number $1 for a Case Study Summary which is the $2 section to highligh the endpoints of the Case Summary.
                        The output is just a HTML string with no indications. Further indications are useless.
                        Use Lato font to make content look modern and simple. Use the font CDN.

                        Create a modern section list some endpoints for the Case Study Summary.`
            },
            {
                step: 4,
                type: "results",
                query: `We are creating a Case Study Summary based on a JSON knowledge base structure. 
                        It will have the document name, page and paragraphs content in the JSON below. 
                        Now we are at the section number $1 for a Case Study Summary which is the $2 section to highligh some results in a tabular format of the Case Summary.
                        Center the content of the results inside a div. Add the Results title to the section.
                        The output is just a HTML string with no indications. Further indications are useless.
                        Use Lato font to make content look modern and simple. Use the font CDN.

                        Create a modern table to show some percentajes and concluding mesuares of the Case Study Summary.`
            },
            {
                step: 5,
                type: "pie chart",
                query: `We are creating a Case Study Summary based on a JSON knowledge base structure.
                        It will have the document name, page and paragraphs content in the JSON below.
                        Now we are at the section number $1 for a Case Study Summary which is a $2 to show some highlighted numeric data the text.
                        Add the generate values for the $1 to a JSON structure.
                        The output is just a JSON object with no indications. Further indications are useless.

                        Collect numeric data to create the params for a pie chart using chartjs.
                        The params are
                            - labels: List of string labels ["label1", "label2"] 
                            - data: List of int data [1, 2] 
                            - backgroundColors: List of string background colors ["#hex1", "#hex2"]
                            - borderColors: List of string border colors ["#hex1", "#hex2"]`
            },
            {
                step: 6,
                type: "data table",
                query: `We are creating a Case Study Summary based on a JSON knowledge base structure.
                        It will have the document name, page and paragraphs content in the JSON below.
                        Now we are at the section number $1 for a Case Study Summary which is a $2 to show some tabular data from the text.
                        The output is just a HTML string with no indications. Further indications are useless
                        Use Lato font to make content look modern and simple. Use the font CDN.

                        Collect tabular data for creating coherent and text based HTML table with highlighted title and columns.
                        Add further styles to the table to better eye looking. Also me show to provide the full table. Limit the table rows to three and use all closing tags needed.
                        Try to orientate data in the correct order when table data is truncated. Center the content of the table inside a div.
                        Make sure to provide a table referenced from the text and the complete HTML structure and closing tags. `
            },
            {
                step: 7,
                type: "conclusions",
                query: `We are creating a Case Study Summary based on a JSON knowledge base structure.
                        It will have the document name, page and paragraphs content in the JSON below.
                        Now we are at the section number $1 for a Case Study Summary which is a $2 section to conclude the text.
                        The output is just a HTML string with no indications. Further indications are useless
                        Use Lato font to make content look modern and simple. Use the font CDN.
                        
                        Create a HTML Conclusions section based on the content. It should be a left aligned text.
                        Make sure to provide a Conclusions title and be in a separate section and left align the list text`
            },
            {
                step: 8,
                type: "reference list",
                query: `We are creating a Case Study Summary based on a JSON knowledge base structure.
                        It will have the document name, page and paragraphs content in the JSON below.
                        Now we are at the section number $1 for a Case Study Summary which is a $2 to list the references from the text.
                        The output is just a HTML string with no indications. Further indications are useless.
                        Use Lato font to make content look modern and simple. Use the font CDN. It should be a section apart from the table
                        
                        Create a HTML formated list to show the name, link and page format and keep it. 
                        Avoid repeating references and make different general references.
                        Make sure to provide a References title and be in a separate section and left align the list text`
            },
        ];

        try {
            const fileName = 'Kirkwood Nature Med 2023.pdf';
            const pages = [4];

            const queryLlmTemplate = "query_llm_with_data";
            const elasticResponse = await es.getAllDocuments(fileName, pages);
            const elasticResponseJson = JSON.stringify(elasticResponse);

            // Iterate sections to generate HTML
            let htmlString = '';
            for (const section of sections) {
                let currentQuery = section.query.replace("$1", section.step.toString()).replace("$2", section.type);

                if (section.type === "pie chart") {
                    let chart_values = await ns.runMaistroTemplateStreamSection(queryLlmTemplate, currentQuery, sections, elasticResponseJson, true);

                    if (chart_values) {
                        const { labels, data, backgroundColors, borderColors } = JSON.parse(chart_values);
                        const htmlChart = await hch.generateHighChartHtml(labels, data, backgroundColors, borderColors);
                        htmlString += htmlChart;
                    }
                } 
                
                else {
                    let result = await ns.runMaistroTemplateStreamSection(queryLlmTemplate, currentQuery, sections, elasticResponseJson, true);
                    htmlString += result + '<br>';
                }
            }
            console.log(htmlString);
        } catch (e) {
            console.error(`An error occurred: ${e.message}`);
        }
    })();
}