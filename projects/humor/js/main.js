(function () {
    let instance = null;

    function init() {
        d3.csv("data/lexicon_analysis_result.csv").then(function (data) {
            let sensitivityParallelCoordinate = new ParallelCoordinate("sentiment-parallel-coordinate", "sentiment-spreadsheet", data);
        });
        // d3.csv("data/top50eng.csv").then(function (data) {
        //     let firstBabbleGraph = new heatBabbleGraph("first-heat-babble-graph", data.slice(1, 20));
        // });
        // d3.json("data/word_child_chart.json").then(function (data) {
        //     let wordListFanChart = new fanChart("fan-chart", data);
        // })
    }

    function Main() {
        if (instance !== null) {
            throw new Error("Cannot instantiate more than one Class");
        }
    }

    Main.getInstance = function () {
        let self = this;
        if (self.instance == null) {
            self.instance = new Main();

            //called only once when the class is initialized
            init();
        }
        return instance;
    };

    Main.getInstance();

})();