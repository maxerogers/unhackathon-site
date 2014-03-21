(function () {
    "use strict";
    var frames;
    var currentFrameIndex = 0;
    var position = 0;
    var scrollToPageTimeout;
    var scrollingToPage = false;

    function scrollToPage(page) {
        clearScrollToPageTimeout();
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
        var endTime = startTime + 300;
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

    function clearScrollToPageTimeout() {
        if (scrollToPageTimeout) {
            clearTimeout(scrollToPageTimeout);
            scrollToPageTimeout = null;
        }
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

        clearScrollToPageTimeout();
        scrollToPageTimeout = setTimeout(function () {
            scrollToPage(Math.round(position));
        }, 200)
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
        var startPage = Math.floor(position);
        if (event.which === 38) {
            var newPos = position > startPage + .01 ? startPage : startPage - 1;
            scrollToPage(newPos);
        } else if (event.which === 40) {
            scrollToPage(startPage + 1);
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

        /*$('#first .content').blurjs({
            source: '#first',
            radius: 5,
            overlay: 'rgba(255,255,255,0.4)'
        });*/
    });
})();