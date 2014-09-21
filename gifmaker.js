(function () {
    var dropzone = document.querySelector('#dropzone');
    var generateButton = document.querySelector('#generateButton');
    var resetButton = document.querySelector('#resetButton');
    var output = document.querySelector('output');
    var dropzoneText = document.querySelector('#dropzone p');
    var imagesBox = document.querySelector('#images');
    var images = [];

    function init() {
        dropzone.addEventListener('drop', getFiles, false);
        dropzone.addEventListener('dragover', preventEvent, false);
        generateButton.addEventListener('click', generateGIF, false);
        resetButton.addEventListener('click', reset, false);
    }

    function getFiles(ev) {
        ev.stopPropagation();
        dropzoneText.setAttribute('hidden', 'hidden');
        var files = ev.dataTransfer.files;
        if (files.length > 0) {
            var i = files.length;
            while (i--) {
                var file = files[i];
                if (file.type.indexOf('image') === -1) {
                    continue;
                }
                var path = URL.createObjectURL(file);
                var imageNode = document.createElement('img');
                imageNode.src = path;
                imageNode.addEventListener('load', function(ev) {
                    var newSize = calcResize(imageNode.height, imageNode.width, 150);
                    imageNode.height = newSize.height;
                })
                imagesBox.appendChild(imageNode);
                // TODO: find out a way to use gif.js without having a duplicate node
                // TODO: since gif.js uses the default width and height from the DOMElement..
                var processImageNode = document.createElement('img');
                processImageNode.src = path;
                images.push(processImageNode);
            }
            resetButton.removeAttribute('hidden');
        }
        ev.preventDefault();
    }

    function calcResize(imgHeight, imgWidth, containerWidth) {
        var maxRatio = Math.max(imgHeight/containerWidth, imgWidth/containerWidth);
        var height = imgHeight / maxRatio;
        var width = imgWidth / maxRatio;
        return { height: height, width: width};
    }

    function generateGIF(ev) {
        var gif = new GIF({ workers: 2, quality: 10 });
        images.forEach(function(image) {
            gif.addFrame(image);
        });
        gif.on('finished', function(blob) {
            var imageNode = document.createElement('img');
            imageNode.src = URL.createObjectURL(blob);
            output.appendChild(imageNode);
            output.removeAttribute('hidden');
        });
        gif.render();
    }

    function preventEvent(ev) {
        ev.preventDefault();
    }

    function reset() {
        images = [];
        output.innerHTML = '';
        imagesBox.innerHTML = '';
        dropzoneText.removeAttribute('hidden');
        resetButton.setAttribute('hidden', 'hidden');
        output.setAttribute('hidden', 'hidden');
    }

    init();
})();