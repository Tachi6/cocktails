const BASE_URL = 'https://www.thecocktaildb.com/api/json/v2';
// Obtain API_KEY from Netlify
const API_KEY = process.env.API_KEY;

exports.handler = async (event) => {
  try {
    const { endpoint, query } = event.queryStringParameters;

    // Final part of url
    const urlFinal = query ? `${endpoint}?${query}` : `${endpoint}`;

    console.log(`${BASE_URL}/${API_KEY}/${urlFinal}`);

    const resp = await fetch(`${BASE_URL}/${API_KEY}/${urlFinal}`);

    // theCocktailDB error
    if (!resp.ok) {
      return {
        statusCode: resp.status,
        body: JSON.stringify({ error: 'Error en la base de datos de cocktails' }),
      };
    }

    const data = await resp.json();

    // Netlify correct return
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', // Previene errores de CORS en local
      },
      body: JSON.stringify(data), // El body SIEMPRE debe ser un string
    };
  } catch (error) {
    // Netlify error
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
