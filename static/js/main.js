(function () {
    "use strict";
    var frames;
    var currentFrameIndex = 0;
    var position = 0;
    var scrollToPageTimeout;
    var scrollingToPage = false;

    function scrollToPage(page) {
        scrollingToPage = true;
        var startPosition = position;
        var endPosition;
        if (page !== undefined) {
            endPosition = Math.round(page);
        } else {
            endPosition = Math.round(position);
        }
        endPosition = Math.min(frames.length - 1, endPosition);
        endPosition = Math.max(0, endPosition);

        var startTime = window.performance.now();
        var endTime = startTime + 500;
        function runAnimation(curTime) {
            if (curTime > endTime) {
                position = endPosition;
                doScroll();
                scrollingToPage = false;
                return;
            }
            var ratio = (curTime - startTime) / (endTime - startTime);
            position = startPosition + (endPosition - startPosition) * ratio;
            doScroll();
            requestAnimationFrame(runAnimation);
        }
        requestAnimationFrame(runAnimation);
    }

    function doScroll() {
        position = Math.max(0, position);
        position = Math.min(frames.length - 1, position);

        var targetFrameIndex = Math.floor(position);

        while (currentFrameIndex < targetFrameIndex) {
            frames[currentFrameIndex].style.height = "0px";
            frames[currentFrameIndex].style.display = "none;";
            currentFrameIndex++;
        }
        while (currentFrameIndex > targetFrameIndex) {
            frames[currentFrameIndex].style.height = "";
            frames[currentFrameIndex].style.display = "";
            currentFrameIndex--;
        }
        var currentFrame = frames[currentFrameIndex];
        currentFrame.style.height = (window.innerHeight - (position % 1) * window.innerHeight) + "px";
    }

    function scroll(event) {
        event.preventDefault();
        if (scrollingToPage) {
            return;
        }
        position += event.deltaY / window.innerHeight;
        requestAnimationFrame(doScroll);
    }

    function keyDown(event) {
        if (event.which === 38) {
            scrollToPage(position - 1);
        } else if (event.which === 40) {
            scrollToPage(position + 1);
        }
    }

    document.addEventListener("DOMContentLoaded", function () {
        document.body.classList.add("loaded");
        document.body.addEventListener("wheel", scroll);
        document.body.addEventListener("keydown", keyDown);
        frames = Array.prototype.slice.call(document.body.querySelectorAll("#main > section"));
        frames.forEach(function (frame, index) {
            frame.style.zIndex = frames.length - index - 1;
        });
    });
})();