// Load the model
async function loadModel() {
    const model = await tf.loadLayersModel('model.h5');
    return model;
}

// Make predictions
async function predict(model, inputData) {
    const prediction = model.predict(inputData);
    return prediction;
}

// // Example usage
// (async () => {
//     const model = await loadModel();
//     const inputData = tf.tensor2d([[1, 2], [3, 4]]);
//     const prediction = await predict(model, inputData);
//     prediction.print();
// })();
