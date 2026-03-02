exports.handler = async (event) => {
  try {
    const wordCount = event.queryStringParameters.wordCount || 8;
    const response = await fetch(`https://puzzle.mead.io/wordcount={wordCount}`);
    
    // If the API itself fails, tell us why
    if (!response.ok) {
        return { 
            statusCode: response.status, 
            body: JSON.stringify({ error: `Mead API said: ${response.statusText}` }) 
        };
    }

    const data = await response.json();
    return { statusCode: 200, body: JSON.stringify(data) };

  } catch (error) {
    // This sends the actual JS error (like "fetch is not defined") to the browser
    return { 
        statusCode: 500, 
        body: JSON.stringify({ error: error.message, stack: error.stack }) 
    };
  }
};