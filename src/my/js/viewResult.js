import {DISEASES, MODEL_COUNT} from './model.js';

function readTextFile(file)
{
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                var allText = rawFile.responseText;
                alert(allText);
            }
        }
    }
    rawFile.send(null);
}



const Slider = {
    slideIndex : 1,
    // Next/previous controls
    plusSlides : function (i, n) {
        this.showSlides(i, this.slideIndex += n);
    },

    // Thumbnail image controls
    currentSlide : function(i, n) {  
        this.showSlides(i, this.slideIndex = n);
    },

    showSlides : function (disease_idx, n) {
        let i;
        const result_div = document.getElementById('result' + (disease_idx+1));
        let slides = result_div.querySelectorAll(".mySlides");
        let dots = result_div.querySelectorAll(".dot");
        if (n > slides.length) {this.slideIndex = 1}
        if (n < 1) {this.slideIndex = slides.length}
        for (i = 0; i < slides.length; i++) {
            slides[i].style.display = "none";
        }
        for (i = 0; i < dots.length; i++) {
            dots[i].className = dots[i].className.replace(" active", "");
        }

        let s_explain = result_div.querySelector('#shampoo_explain' + (disease_idx+1));
        
        s_explain.innerHTML = SHAMPOO_EXPLAIN[disease_idx][this.slideIndex-1];

        slides[this.slideIndex-1].style.display = "block";
        dots[this.slideIndex-1].className += " active";
    }
}


const ResultView = {
    predicts : [],
    disease_idx : 0,
    init : function () {
        const results = sessionStorage.getItem('predicts');
        if (!results){
            location.href = 'index.html';
        }

        this.predicts = JSON.parse(results);
    },

    update : function(){
        for (const predict of this.predicts) {
            const m = predict.m;
            const predicted = predict.max_idx;
            const disease = DISEASES[m];
        }
    },

    init : function(){
        for (let i=1; i<=MODEL_COUNT; i++){
            const result_div = document.getElementById('result' + i);
            let slides = result_div.querySelectorAll(".mySlides");
            for (let j = 0; j<slides.length; j++){
                const slide = slides[j];
                const img_tag = slide.querySelector('img');
                img_tag.setAttribute('src', `../../shampoo/${i}/${SHAMPOO_IMAGES[i-1][j]}`);
            }
            //disease_explain1
            let d_explain = result_div.querySelector('#disease_explain' + (this.disease_idx+1));
            d_explain.innerHTML = DISEASE_EXPLAIN[i-1];
        }

        document.getElementById('disease_name').innerHTML = DISEASES[this.disease_idx];
        Slider.showSlides(this.disease_idx, Slider.slideIndex);
    }

}

window.ResultView = ResultView;
window.Slider = Slider;

window.addEventListener ('DOMContentLoaded', async function () {
    await ResultView.init();
  });
console.log(SHAMPOO_EXPLAIN);
console.log(SHAMPOO_IMAGES);
console.log(DISEASE_EXPLAIN);