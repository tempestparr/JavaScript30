const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

let filter = '';

// get the video to pipe it into the video element
function getVideo() {
    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then(localMediaStream => {
            video.srcObject = localMediaStream;
            video.play();
        })
        .catch(error => { // handle the case where the user denies webcam access
            console.error(`Allow webcam access to try this!`, err);
        });
}

// take a frame from the live stream video and paint it onto the canvas
function paintToCanvas() {
    const width = video.videoWidth;
    const height = video.videoHeight;
    // set the canvas to be the same size as the webcam video
    canvas.width = width;
    canvas.height = height;

    // every 16ms, take an image from the webcam and put it in the canvas
    return setInterval(() => {
        // pass drawImage an image to paint at the top left hand corner of the canvas
        ctx.drawImage(video, 0, 0, width, height);

        // take the pixels out
        let pixels = ctx.getImageData(0, 0, width, height);
        // add an effect to them
        if (filter == 'red') {
            pixels = redEffect(pixels);
        } else if (filter == 'sunny') {
            pixels = sunnyEffect(pixels);
        } else if (filter == 'purple') {
            pixels = purpleEffect(pixels);
        } else if (filter == 'rgb') {
            pixels = rgbSplit(pixels);
        } else if (filter == 'none') {
            pixels = pixels;
        }
        
        // put the pixels back
        ctx.putImageData(pixels, 0, 0);

    }, 15);
}

function takePhoto() {
    // play the camera shutter sound
    snap.currentTime = 0;
    snap.play();

    // take the data out of the canvas
    const data = canvas.toDataURL('image/jpeg');

    // create a link to put in the photo strip
    const link = document.createElement('a');
    link.href = data;
    link.setAttribute('download', 'photo');
    link.innerHTML = `<img src="${data}" alt="video photo" />`;
    // add the most recent photo to the front of the strip
    strip.insertBefore(link, strip.firstChild);
}

function redEffect(pixels) {
    for (let i = 0; i < pixels.data.length; i += 4) {
        pixels.data[i + 0] = pixels.data[i + 0] + 100; // red
        pixels.data[i + 1] = pixels.data[i + 1] - 80; // green
        pixels.data[i + 2] = pixels.data[i + 2] - 100; // blue
    }
    return pixels;
}

function sunnyEffect(pixels) {
    for (let i = 0; i < pixels.data.length; i += 4) {
        pixels.data[i + 0] = pixels.data[i + 0] + 80; // red
        pixels.data[i + 1] = pixels.data[i + 1] + 50; // green
        pixels.data[i + 2] = pixels.data[i + 2] - 10; // blue
        pixels.data[i + 3] = pixels.data[i + 3] * 0.8; // alpha
    }
    return pixels;
}

function purpleEffect(pixels) {
    for (let i = 0; i < pixels.data.length; i += 4) {
        pixels.data[i + 0] = pixels.data[i + 0] + 100; // red
        pixels.data[i + 1] = pixels.data[i + 1] - 100; // green
        pixels.data[i + 2] = pixels.data[i + 2] + 250; // blue
    }
    return pixels;
}

function rgbSplit(pixels) {
    for (let i = 0; i < pixels.data.length; i += 4) {
        pixels.data[i - 200] = pixels.data[i + 0]; // red
        pixels.data[i + 350] = pixels.data[i + 1]; // green
        pixels.data[i - 500] = pixels.data[i + 2]; // blue
    }
    return pixels;
}

function addFilter(currfilter) {
    filter = currfilter;
    return filter;
}

getVideo();

// listen for the 'canplay' event emitted when the video is played
video.addEventListener('canplay', paintToCanvas); 
