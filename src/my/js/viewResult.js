const ResultView = {
    predicts : [],
    init : function () {
        const results = sessionStorage.getItem('predicts');
        if (!results){
            location.href = 'index.html';
        }

        this.predicts = JSON.parse(results);
    }    
}

window.ResultView = ResultView;