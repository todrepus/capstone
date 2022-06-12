const URL = "../../models/";


export const DISEASES = [
    '모낭사이홍반',
    '모낭홍반농포',
    '미세각질',
    '비듬',
    '탈모',
    '피지과다'
];

let webcam, labelContainer;
let models = [];

let use_webcam = true;
const maxPredictions = 4;
export const MODEL_COUNT = 5;

// Load the image model and setup the webcam

async function model_init(ROOT_URL) {
    let model;
    const modelURL = ROOT_URL + "model.json";
    //const metadataURL = ROOT_URL + "metadata.json";
    
    // load the model and metadata
    // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
    // or files from your local hard drive
    // Note: the pose library adds "tmImage" object to your window (window.tmImage)

    model = await tf.loadLayersModel(modelURL);
    console.log(modelURL);
    //maxPredictions = model.getTotalClasses();

    return model;
}
// run the webcam image through the image model

const Model = {
    predict : async function() {
        // predict can take in an image, video or canvas html element

        const webcam2 = await tf.data.webcam(webcam, {
            resizeWidth: 224,
            resizeHeight: 224,
        });
        let img = await webcam2.capture();
        const xx = [img];

        let predicts = [];
        
        for (let m = 0; m < MODEL_COUNT; m++){
            const prediction = await models[m].predict(tf.stack(xx));
            let tensor = await prediction.data();
            let max_idx = 0;
            for (let i = 0; i < maxPredictions; i++) {
                const classPrediction =
                    `Model ${DISEASES[m]} / ` + `prob : ${tensor[i]}`;
                console.log(classPrediction);
                if (tensor[i] > tensor[max_idx]){
                    max_idx = i;
                }
            }
            predicts.push({model_idx : m, predict : max_idx});
            console.log(`Model ${DISEASES[m]} predicted to class ${max_idx}`);
            console.log('=========================');
        }

        // 세션스토리지에 저장.
        sessionStorage.setItem('predicts', JSON.stringify(predicts));
        location.href = 'result.html';
    },

    init : async function(){
        webcam = document.getElementById('webcam-container');
        for (let i=0; i<MODEL_COUNT; i++){
            const new_URL = URL + `head_model0${i+1}/`;
            models.push(await model_init(new_URL));
        }

        var handleSuccess = function (stream) {
            webcam.srcObject = stream;
        };
        await navigator.permissions.query({ name: 'camera'/*and 'microphone'*/ })
        navigator.mediaDevices.getUserMedia({ video: true }).then(handleSuccess);
    },

    
}


window.Model = Model;
