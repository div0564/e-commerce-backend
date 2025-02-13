require('dotenv').config()
const Database = require('./data-source');
const app = require('./app');

const PORT = process.env.PORT || 8000;


(
    async () => {
        try {
            await Database.connect();
            app.listen(PORT, () => {
                console.log(`Server started on ${PORT}.`);
            })
        }
        catch (err) {
            console.error(err);
        }
    }
)();