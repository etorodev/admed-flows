class ElasticSearch {
    constructor() {
        this.baseUrl = 'https://neuralseek.es.us-west-2.aws.found.io/admed-docs/_search';
        this.apiKey = 'ApiKey QWhZTWVwQUJPeVZsZ1VZUVNEa0k6VFFGLU1yMXpRQmU1WWdLUEhlUGlVdw==';
    }

    async getAllDocuments(fileName, pages) {
        const url = this.baseUrl;
        const headers = {
            'Authorization': this.apiKey,
            'Content-Type': 'application/json'
        };
        const payload = {
            "size": 10,
            "query": {
                "bool": {
                    "must": [
                        {
                            "match": {
                                "file_name": fileName
                            }
                        },
                        {
                            "terms": {
                                "page_number": pages
                            }
                        }
                    ]
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
                const data = await response.json();
                console.log("Request successful!");
                return data.hits.hits;
            } else {
                console.error(`Request failed with status code: ${response.status}`);
                return response.statusText;
            }
        } catch (error) {
            console.error('Request failed', error);
            return error.message;
        }
    }
}

module.exports = ElasticSearch;