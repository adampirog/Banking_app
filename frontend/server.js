const express = require('express')
const app = express()

const port = process.env.PORT || 4200

app.use(express.static(`./dist/ibd-bank-page`));

app.get(`/*`, function (req, res) {
    res.sendFile(`index.html`, { root: `dist/ibd-bank-page/` }
    );
});

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`)
})