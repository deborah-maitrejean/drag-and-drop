const path = require('path');

module.exports = {
    mode: "production",
    entry: {
        app: "./src/dragAndDropOption.js",
        move: "./src/MoveOption.js",
    },
    output: {
        filename: "[name].bundle.js",
        path: path.resolve(__dirname, "dist")
    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: "babel-loader"
        }]
    }
};