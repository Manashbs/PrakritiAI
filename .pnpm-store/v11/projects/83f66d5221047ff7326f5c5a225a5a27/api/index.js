const mainModule = require('../dist/src/main.js');
const handler = mainModule.default || mainModule;

module.exports = async (req, res) => {
  try {
    return await handler(req, res);
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error?.message });
  }
};
