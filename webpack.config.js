const path = require('path');

module.exports = {
    mode: "production",
    entry: {
        app: "./src/dragAndDropOption.js"
    },
    output: {
        filename: "[name].bundle.js",
        path: path.resolve(__dirname, "dist")
    }
};