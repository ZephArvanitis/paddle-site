const path = require("path");


module.exports = {
    devtool: 'source-map',
    mode: "development",
    entry: {
        "First": "./source/ts/First.ts",
        "Third": "./source/ts/Third.ts",
        "Step1": "./source/ts/Pages/Step1.ts",
    },
    output: {
        path: path.resolve(__dirname, "wwwroot", "ts-out"),
        filename: "[name].js",
        publicPath: "/"
    },
    resolve: {
        extensions: [".js", ".ts"],
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: ["source-map-loader"],
                enforce: "pre"
            },
            {
                test: /\.ts$/,
                use: "ts-loader"
            },
        ]
    },
};