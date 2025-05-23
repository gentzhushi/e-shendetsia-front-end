const fs = require('fs');
const yaml = require('js-yaml');
const path = require('path');

try {
    const configPath = path.resolve(__dirname, 'config.yml');
    const fileContents = fs.readFileSync(configPath, 'utf8');
    const config = yaml.load(fileContents);

    // URL E BOJM SET SI ENVIRONMENT VARIABLE:
    process.env.REACT_APP_API_BASE_URL = config.api.base_url;
    console.log('API_BASE_URL set to:', process.env.REACT_APP_API_BASE_URL);

    // Set endpoint paths as environment variables
    for (const [key, value] of Object.entries(config.api.endpoints)) {
        const envKey = `REACT_APP_API_ENDPOINT_${key.toUpperCase()}`;
        process.env[envKey] = value;
        console.log(`${envKey} set to: ${value}`);
    }
} catch (e) {
    console.error('Error loading config.yml:', e);
}

console.log('API_BASE_URL:', process.env.REACT_APP_API_BASE_URL);