function Spreadsheet(spreadsheetID, data) {

    this.update = update;
    //detect page layout
    const w = document.getElementById(spreadsheetID).offsetWidth;

    let element = document.getElementById(spreadsheetID);

    let setting = {
        data: data,
        stretchH: 'all',
        width: w,
        height: w * 1.4,
        colHeaders: Object.keys(data[0]),
        fixedColumnsLeft: 2
    };

    let table = new Handsontable(element, setting);

    function update(updatedData) {
        table.loadData(updatedData)
    }
}