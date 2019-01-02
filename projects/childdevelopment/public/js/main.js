Promise.all([
    d3.csv("public/data/finalData/word_data_merged.csv"),
    d3.json("public/data/finalData/paneDict.json"),
    d3.csv("public/data/finalData/word_data_no_repeats.csv")

]).then(function (data) {
    new WordsByAge(data);
    new AgeBreakdownChart(data);
    new SearchChart(data);
    new DownloadChart(data);

});
