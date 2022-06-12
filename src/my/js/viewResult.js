import {DISEASES, MODEL_COUNT} from './model.js';
import {SHAMPOO_IMAGES, SHAMPOO_EXPLAIN, DISEASE_EXPLAIN} from './explain.js';

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


function createSliderDots(){
    const div = document.getElementById('content_slider');
    for (let i=0; i<MODEL_COUNT; i++){
        let tagstr = `<span class="content_dot dot" onclick="Slider.currentSlide(${i},1)"></span>`
        div.innerHTML += tagstr + "\n";
    }
}

function createContentDivs(){
    // start model 1
    let div = document.getElementById('inner_content_view');
    for (let i=1; i<=MODEL_COUNT; i++){
        let img_tagstr = '';
        let dot_tagstr = '';
        for (let j = 0; j<SHAMPOO_IMAGES[i-1].length; j++){
            img_tagstr += 
            `
            <div class="mySlides myfade">
            <div class="numbertext">${j+1} / ${SHAMPOO_IMAGES[i-1].length}</div>
            <img src="shampoo/${i}/${SHAMPOO_IMAGES[i-1][j]}" style="width:100%">
            <div class="text">${SHAMPOO_EXPLAIN[i-1][j].title}</div>
            </div>
            `

            dot_tagstr += 
            `
            <span class="dot" onclick="Slider.currentSlide(${i-1},${j+1})"></span>
            `

        }
        let tagstr = `
            <div class='contents_view'>
                <div class="disease_name" style="text-align: center;">
                    <p style="font-family: 'GmarketSansBold'; font-size: 7rem;"
                        id='disease_name${i}'></p>
                </div>
                <div class="slideshow-container">
                    <div id='disease_explain${i}'
                        style="font-size: 20px; margin: 0 25px; font-family: BMDOHYEON">
                        ${DISEASE_EXPLAIN[i-1]}
                    </div>
                </div>
                <div class="recommended" style="margin-top: 80px;" id='result${i}'>
                    <div class="slideshow-container">

                        <!-- Full-width images with number and caption text -->
                        ${img_tagstr}
                        <!-- Next and previous buttons -->
                        <a class="prev"
                            onclick="Slider.plusSlides(${i-1}, -1)">&#10094;</a>
                        <a class="next"
                            onclick="Slider.plusSlides(${i-1}, 1)">&#10095;</a>
                    </div>
                    <br>
                    <!-- The dots/circles -->
                    <div style="text-align:center">
                        ${dot_tagstr}
                    </div>

                    <br>

                    <div id='shampoo_explain${i}'
                        style="font-size: 20px; margin: 0 25px; font-family: BMDOHYEON">
                        샴푸에대한 설명과 용도와 등등등...
                        샴푸에대한 설명과 용도와 등등등...
                        샴푸에대한 설명과 용도와 등등등...
                        샴푸에대한 설명과 용도와 등등등...
                        샴푸에대한 설명과 용도와 등등등...

                    </div>
                </div>
            </div>
        `

        div.innerHTML += tagstr;


    }
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
        let content_dots = document.querySelectorAll(".content_dot");
        let contents = document.querySelectorAll(".contents_view")

        if (n > slides.length) {this.slideIndex = 1}
        if (n < 1) {this.slideIndex = slides.length}
        for (i = 0; i < slides.length; i++) {
            slides[i].style.display = "none";
        }
        for (i = 0; i < dots.length; i++) {
            dots[i].className = dots[i].className.replace(" active_dot", "");
        }


        for (i = 0; i < MODEL_COUNT; i++) {
            content_dots[i].className = content_dots[i].className.replace(" active_dot", "");
            contents[i].style.display = "none";
        }

        let s_explain = result_div.querySelector('#shampoo_explain' + (disease_idx+1));
        
        s_explain.innerHTML = SHAMPOO_EXPLAIN[disease_idx][this.slideIndex-1].content;

        contents[disease_idx].style.display = "block";
        slides[this.slideIndex-1].style.display = "block";
        dots[this.slideIndex-1].className += " active_dot";
        content_dots[disease_idx].className += " active_dot";
    }
}


const ResultView = {
    predicts : [],
    disease_idx : 0,
    update : function(){
        for (const predict of this.predicts) {
            const m = predict.m;
            const predicted = predict.max_idx;
            const disease = DISEASES[m];
        }
    },



    init : function(){
        createSliderDots();
        createContentDivs();
        const results = sessionStorage.getItem('predicts');
        if (!results){
            location.href = 'index.html';
        }

        this.predicts = JSON.parse(results);

        for (let i=1; i<=MODEL_COUNT; i++){
            const result_div = document.getElementById('result' + i);
            let slides = result_div.querySelectorAll(".mySlides");
            for (let j = 0; j<slides.length; j++){
                const slide = slides[j];
                const img_tag = slide.querySelector('img');
                img_tag.setAttribute('src', `shampoo/${i}/${SHAMPOO_IMAGES[i-1][j]}`);
            }
            //disease_explain1
            let d_explain = document.querySelector('#disease_explain' + (this.disease_idx+1));
            d_explain.innerHTML = DISEASE_EXPLAIN[i-1];
            document.getElementById('disease_name' + i).innerHTML = `${DISEASES[i-1]} / 증상: ${this.predicts[i-1].predict}단계`;
        }

        console.log(this.predicts);
        
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