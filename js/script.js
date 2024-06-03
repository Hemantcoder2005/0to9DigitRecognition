const stateElements = document.querySelectorAll('.state');
const ImagePreviewUpload = document.getElementById('ImagePreview');
const fileInput = document.getElementById('file-upload'); // Assuming fileInput is the input element for uploading images
const mssgUpload = document.getElementById('mssgUpload');
const upload = document.getElementById('uploadMe');
const link = document.getElementById('link');
const draw = document.getElementById('draw');
const reset = document.getElementById('reset');
var imageMatrix = []
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

reset.addEventListener('click', function () {
    fileInput.value = ""; // Clear the file input
    ImagePreviewUpload.style.backgroundImage = 'none'; // Clear the image preview
    ImagePreviewUpload.textContent = "No Image is Present";
    mssgUpload.textContent = ""; // Clear any messages
    imageMatrix = []
});
function handleState(event) {
    InsertState = parseInt(event.target.id);
    if (InsertState === 0) {
        isImagePresent = false
        link.style.display = "none"
        draw.style.display = "none"
        upload.style.display = ""
    } else if (InsertState === 1) {
        isImagePresent = false
        upload.style.display = "none"
        draw.style.display = "none"
        link.style.display = ""
    } else if (InsertState === 2) {
        isImagePresent = false
        upload.style.display = "none"
        link.style.display = "none"
        draw.style.display = ""
    }


}
function checkImagePresent() {

    if (fileInput.files.length > 0) {
        ImagePreviewUpload.textContent = ""; // Clear the "No Image is Present" message
        const file = fileInput.files[0];
        if (validateImageType(file)) {
            const imageUrl = URL.createObjectURL(file);
            ImagePreviewUpload.style.backgroundImage = `url("${imageUrl}")`;
            mssgUpload.textContent = "Uploaded Successfully!"
            mssgUpload.style.color = "green"
            isImagePresent = true;
            const imgElement = document.createElement('img');
            imgElement.onload = function () {
                preprocessedImage(imgElement)
            }
            imgElement.src = imageUrl
        } else {
            mssgUpload.textContent = "Invalid File type please select Image"
            mssgUpload.style.color = "red"
            isImagePresent = false;
            ImagePreviewUpload.style.backgroundImage = 'none';
            ImagePreviewUpload.textContent = "No Image is Present";
            mssgUpload.textContent = "Invalid! Please Select Image"
            imageMatrix = []
        }

    } else {
        isImagePresent = false;
        ImagePreviewUpload.style.backgroundImage = 'none';
        ImagePreviewUpload.textContent = "No Image is Present";
        mssgUpload.textContent = ""
        imageMatrix = []
    }
}


function validateImageType(file) {
    // Define valid image MIME types
    var validImageTypes = ['image/jpeg', 'image/jpg', 'image/png'];

    // Check if the file's type is included in the valid image types
    return validImageTypes.includes(file.type);
}


// Preprocessing Stage
function preprocessedImage(image) {
    const canvas = document.getElementById('canvasOutput');
    const ctx = canvas.getContext('2d');
    canvas.width = image.width;
    canvas.height = image.height;
    ctx.drawImage(image, 0, 0, image.width, image.height);

    // Read the image data from the canvas into an OpenCV Mat
    let src = cv.imread(canvas);
    cv.cvtColor(src, src, cv.COLOR_RGBA2GRAY);
    let ksize = new cv.Size(5, 5);
    cv.GaussianBlur(src, src, ksize, 0, 0, cv.BORDER_DEFAULT);
    cv.bitwise_not(src, src);

    let dst = new cv.Mat();
    cv.threshold(src, dst, 0, 255, cv.THRESH_BINARY | cv.THRESH_OTSU);

    let dsize = new cv.Size(28, 28);
    cv.resize(dst, dst, dsize, 0, 0, cv.INTER_AREA);

    // Flatten the image
    let flattened = [];
    for (let i = 0; i < dst.rows; i++) {
        for (let j = 0; j < dst.cols; j++) {
            flattened.push(dst.ucharPtr(i, j)[0]);
        }
    }
    imageMatrix = flattened
}
