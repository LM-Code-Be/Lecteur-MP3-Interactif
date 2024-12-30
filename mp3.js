// script.js
document.addEventListener("DOMContentLoaded", function() {
    var audio = document.getElementById("audio");
    var fileInput = document.getElementById("file-input");
    var playButton = document.getElementById("play");
    var pauseButton = document.getElementById("pause");
    var stopButton = document.getElementById("stop");
    var progressBar = document.getElementById("progress-bar");
    var volumeControl = document.getElementById("volume");
    var canvas = document.getElementById("visualizer");
    var canvasCtx = canvas.getContext("2d");

    var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    var analyser = audioCtx.createAnalyser();
    var source;
    var dataArray;
    var bufferLength;

    fileInput.addEventListener("change", function(event) {
        var file = event.target.files[0];
        if (file) {
            var objectURL = URL.createObjectURL(file);
            audio.src = objectURL;
            audio.classList.remove("d-none");

            audio.addEventListener('play', function() {
                if (!source) {
                    source = audioCtx.createMediaElementSource(audio);
                    source.connect(analyser);
                    analyser.connect(audioCtx.destination);
                    analyser.fftSize = 256;
                    bufferLength = analyser.frequencyBinCount;
                    dataArray = new Uint8Array(bufferLength);
                }
                drawVisualizer();
            });
        }
    });

    function drawVisualizer() {
        requestAnimationFrame(drawVisualizer);

        analyser.getByteFrequencyData(dataArray);

        canvasCtx.fillStyle = 'rgba(240, 240, 240, 1)';
        canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

        var barWidth = (canvas.width / bufferLength) * 2.5;
        var barHeight;
        var x = 0;

        for (var i = 0; i < bufferLength; i++) {
            barHeight = dataArray[i];

            canvasCtx.fillStyle = 'rgba(0, 123, 255, ' + (barHeight / 256) + ')';
            canvasCtx.fillRect(x, canvas.height - barHeight / 2, barWidth, barHeight / 2);

            x += barWidth + 1;
        }
    }

    playButton.addEventListener("click", function() {
        audio.play();
    });

    pauseButton.addEventListener("click", function() {
        audio.pause();
    });

    stopButton.addEventListener("click", function() {
        audio.pause();
        audio.currentTime = 0;
    });

    audio.addEventListener("timeupdate", function() {
        var percentage = (audio.currentTime / audio.duration) * 100;
        progressBar.style.width = percentage + "%";
    });

    volumeControl.addEventListener("input", function() {
        audio.volume = volumeControl.value;
    });
});