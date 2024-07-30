class NeuralSeek {

    constructor() {
        this.baseUrl = 'https://stagingapi.neuralseek.com/v1/Demo_01_Workbooks_Esteban';
        this.apiKey = 'e329b5d4-2b587cef-d6a63c39-d824d703';
        this.maistroEndpoint = '/maistro';
        this.maistroStreamEndpoint = '/maistro_stream';
        this.seekStreamEndpoint = '/seek';
    }

    // async runMaistroTemplate(llm = "gpt-4o", params = {}, stream = true) {
    //     const { templateName, query, docStructure, jsonData } = params;
    // }

    async runMaistroTemplateStreamSection(templateName, query, docStructure, jsonData, stream = true) {
        const url = this.baseUrl + this.maistroStreamEndpoint;
        const headers = {
            'accept': stream ? 'text/event-stream' : 'application/json',
            'apikey': this.apiKey,
            'Content-Type': 'application/json'
        };
        const payload = {
            "ntl": "string",
            "templateName": templateName,
            "params": [
                {
                    "name": "userQuery",
                    "value": query
                },
                {
                    "name": "jsonData",
                    "value": jsonData
                },
                {
                    "name": "docStructure",
                    "value": docStructure
                }
            ],
            "options": {
                "llm": "claude3-haiku",
                // "llm": "claude3-opus",
                /// "llm": "gpt-4o",
                // "llm": llm,
                "user_id": "string",
                "temperatureMod": 1,
                "toppMod": 1,
                "freqpenaltyMod": 1,
                "minTokens": 0,
                "maxTokens": 1,
                "returnVariables": false,
                "returnVariablesExpanded": false,
                "returnRender": false,
                "returnSource": false,
                "maxRecursion": 10
            }
        };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                if (stream) {
                    const reader = response.body.getReader();
                    const decoder = new TextDecoder('utf-8');
                    let completeResponse = '';

                    while (true) {
                        const { done, value } = await reader.read();
                        if (done) break;
                        const chunk = decoder.decode(value);
                        const lines = chunk.split('\n');
                        for (const line of lines) {
                            if (line.startsWith('data: ')) {
                                const chunkData = line.substring(6);
                                try {
                                    const chunkJson = JSON.parse(chunkData);
                                    if ('chunk' in chunkJson) {
                                        completeResponse += chunkJson['chunk'];
                                    } else if ('answer' in chunkJson) {
                                        // completeResponse += chunkJson['answer'];
                                        completeResponse = chunkJson['answer'];
                                    }
                                } catch (error) {
                                    console.error(`Error decoding JSON: ${chunkData}`);
                                }
                            }
                        }
                    }

                    return completeResponse;
                } else {
                    return response.json();
                }
            } else {
                throw new Error(`Request failed with status code: ${response.status}`);
            }
        } catch (error) {
            console.error('Request failed', error);
            throw error;
        }
    }

    async runMaistroTemplateStreamHtml(templateName, html_input, stream = true) {
        const url = this.baseUrl + this.maistroStreamEndpoint;
        const headers = {
            'accept': stream ? 'text/event-stream' : 'application/json',
            'apikey': this.apiKey,
            'Content-Type': 'application/json'
        };
        const payload = {
            "ntl": "string",
            "templateName": templateName,
            "params": [
                {
                    "name": "htmlInput",
                    "value": html_input
                }
            ],
            "options": {
                // "llm": "claude3-haiku",
                // "llm": "claude3-opus",
                "llm": "gpt-4o",
                "user_id": "string",
                "temperatureMod": 1,
                "toppMod": 1,
                "freqpenaltyMod": 1,
                "minTokens": 0,
                "maxTokens": 1,
                "returnVariables": false,
                "returnVariablesExpanded": false,
                "returnRender": false,
                "returnSource": false,
                "maxRecursion": 10
            }
        };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                if (stream) {
                    const reader = response.body.getReader();
                    const decoder = new TextDecoder('utf-8');
                    let completeResponse = '';

                    while (true) {
                        const { done, value } = await reader.read();
                        if (done) break;
                        const chunk = decoder.decode(value);
                        const lines = chunk.split('\n');
                        for (const line of lines) {
                            if (line.startsWith('data: ')) {
                                const chunkData = line.substring(6);
                                try {
                                    const chunkJson = JSON.parse(chunkData);
                                    if ('chunk' in chunkJson) {
                                        completeResponse += chunkJson['chunk'];
                                    } else if ('answer' in chunkJson) {
                                        // completeResponse += chunkJson['answer'];
                                        completeResponse = chunkJson['answer'];
                                    }
                                } catch (error) {
                                    console.error(`Error decoding JSON: ${chunkData}`);
                                }
                            }
                        }
                    }

                    return completeResponse;
                } else {
                    return response.json();
                }
            } else {
                throw new Error(`Request failed with status code: ${response.status}`);
            }
        } catch (error) {
            console.error('Request failed', error);
            throw error;
        }
    }

    async querySeek(query, stream = false) {
        const url = this.baseUrl + this.seekStreamEndpoint;
        const headers = {
            'accept': stream ? 'text/event-stream' : 'application/json',
            'apikey': this.apiKey,
            'Content-Type': 'application/json'
        };
        const payload = {
            "question": query,
            "options": {
                "language": "en",
                "streaming": true,
                "proposalID": "",
                "personalize": {
                    "preferredName": "",
                    "products": [],
                    "additionalDetails": ""
                },
                "filter": ""
            },
            "user_session": {
                "metadata": {
                    "user_id": ""
                },
                "system": {
                    "session_id": "MC44-Nzc0-Mjk2"
                }
            }
        };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                const reader = response.body.getReader();
                const decoder = new TextDecoder('utf-8');
                let completeResponse = '';

                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    const chunk = decoder.decode(value);
                    const lines = chunk.split('\n');
                    for (const line of lines) {
                        if (line.startsWith('data: ')) {
                            const chunkData = line.substring(6);
                            try {
                                const chunkJson = JSON.parse(chunkData);
                                if ('answer' in chunkJson) {
                                    completeResponse += chunkJson['answer'];
                                } else if ('chunk' in chunkJson) {
                                    completeResponse += chunkJson['chunk'];
                                }
                            } catch (error) {
                                console.error(`Error decoding JSON: ${chunkData}`);
                            }
                        }
                    }
                }

                return completeResponse;
            } else {
                throw new Error(`Request failed with status code: ${response.status}`);
            }
        } catch (error) {
            console.error('Request failed', error);
            throw error;
        }
    }
}
module.exports = NeuralSeek;