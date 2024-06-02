const stateElements = document.querySelectorAll('.state');
const ImagePreviewUpload = document.getElementById('ImagePreview');
const fileInput = document.getElementById('file-upload'); // Assuming fileInput is the input element for uploading images
const mssgUpload = document.getElementById('mssgUpload');
const upload = document.getElementById('uploadMe');
const link = document.getElementById('link');
const draw = document.getElementById('draw');
const reset = document.getElementById('reset');
/*
0 --> upload
1 --> link
2 --> draw
*/
let InsertState = 0; // Setting the default state to upload state
let isImagePresent = false; // Initially, no image is present
ImagePreviewUpload.textContent = "No Image is Present";

stateElements.forEach(function (stateElement) {
    stateElement.addEventListener("click", handleState);
});



link.style.display = "none"
draw.style.display = "none"

fileInput.addEventListener('change', checkImagePresent);
console.log(fileInput)

reset.addEventListener('click', function () {
    fileInput.value = ""; // Clear the file input
    ImagePreviewUpload.style.backgroundImage = 'none'; // Clear the image preview
    ImagePreviewUpload.textContent = "No Image is Present";
    mssgUpload.textContent = ""; // Clear any messages
    console.log("reset");
});
function handleState(event) {
    InsertState = parseInt(event.target.id);
    if (InsertState === 0) {
        console.log("Uploading State!");
        isImagePresent = false
        link.style.display = "none"
        draw.style.display = "none"
        upload.style.display = ""
    } else if (InsertState === 1) {
        console.log("Link State!");
        isImagePresent = false
        upload.style.display = "none"
        draw.style.display = "none"
        link.style.display = ""
    } else if (InsertState === 2) {
        console.log("Draw State!");
        isImagePresent = false
        upload.style.display = "none"
        link.style.display = "none"
        draw.style.display = ""
    }


}
function checkImagePresent() {
    console.log("File input value changed");

    if (fileInput.files.length > 0) {
        ImagePreviewUpload.textContent = ""; // Clear the "No Image is Present" message
        const file = fileInput.files[0];
        if (validateImageType(file)) {
            const imageUrl = URL.createObjectURL(file);
            ImagePreviewUpload.style.backgroundImage = `url("${imageUrl}")`;
            mssgUpload.textContent = "Uploaded Successfully!"
            mssgUpload.style.color = "green"
            isImagePresent = true;
        } else {
            mssgUpload.textContent = "Invalid File type please select Image"
            mssgUpload.style.color = "red"
            isImagePresent = false;
            ImagePreviewUpload.style.backgroundImage = 'none';
            ImagePreviewUpload.textContent = "No Image is Present";
            mssgUpload.textContent = "Invalid! Please Select Image"
        }

    } else {
        isImagePresent = false;
        ImagePreviewUpload.style.backgroundImage = 'none';
        ImagePreviewUpload.textContent = "No Image is Present";
        mssgUpload.textContent = ""
    }
    console.log(fileInput.files)
}


function validateImageType(file) {
    // Define valid image MIME types
    var validImageTypes = ['image/jpeg', 'image/jpg', 'image/png'];

    // Check if the file's type is included in the valid image types
    return validImageTypes.includes(file.type);
}



// Model Prediction

async function loadModel() {
    const model = await tf.loadLayersModel('model.json');
    console.log("Done")
    return model;
}

// Make predictions
async function predict(model, inputData) {
    const prediction = model.predict(inputData);
    return prediction;
}

loadModel()