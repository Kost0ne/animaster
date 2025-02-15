addListeners();

let a = 0;
let f = 0;
let g = 0;
let h = 0;
function addListeners() {
    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            f = animaster().fadeIn(block, 5000);
        });

    document.getElementById('fadeInReset')
        .addEventListener('click', function () {
            animaster().resetFadeIn(f);
        });

    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            animaster().addMove(500, {x: 20, y:20}).play(block);
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            animaster().addScale(1000, 1.25).play(block);
        });

    document.getElementById('fadeOutPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            g = animaster().fadeOut(block, 1000);
        });

    document.getElementById('fadeOutReset')
        .addEventListener('click', function () {
            animaster().resetFadeOut(g);
        });

    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            h = animaster().moveAndHide(block, 1000, {x: 100, y: 20});
        });

    document.getElementById('moveAndHideReset')
        .addEventListener('click', function () {
            animaster().resetMoveAndHide(h);
        });

    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            animaster().showAndHide(block, 1000);
        });
    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            a = animaster().heartBeating(block);
        });
    document.getElementById('heartBeatingStop')
        .addEventListener('click', function () {
            a.stop();
        });
}


function animaster(){

    return {
        fadeIn: function(element, duration){
            element.style.transitionDuration =  `${duration}ms`;
            element.classList.remove('hide');
            element.classList.add('show');

            return element;
        },
        resetFadeIn: function (element) {
            element.style.transitionDuration = null;
            element.classList.remove('show');
            element.classList.add('hide');
        },
        move: function(element, duration, translation){
            element.style.transitionDuration = `${duration}ms`;
            element.style.transform = this.getTransform(translation, null);
        },
        scale: function(element, duration, ratio){
            element.style.transitionDuration =  `${duration}ms`;
            element.style.transform = this.getTransform(null, ratio);
        },
        getTransform: function(translation, ratio){
            const result = [];
            if (translation) {
                result.push(`translate(${translation.x}px,${translation.y}px)`);
            }
            if (ratio) {
                result.push(`scale(${ratio})`);
            }
            return result.join(' ');
        },
        fadeOut: function(element, duration){
            element.style.transitionDuration =  `${duration}ms`;
            element.classList.remove('show');
            element.classList.add('hide');
            return element;
        },
        resetFadeOut: function (element){
            element.style.transitionDuration = null;
            element.classList.add('show');
            element.classList.remove('hide');
        },
        moveAndHide: function(element, duration, translation){
            this.move(element, duration * 2/5, translation)
            this.fadeOut(element, duration * 3/5, translation)
            return element;
        },
        resetMoveAndHide: function (element) {
            element.style.animationDuration = null;
            element.classList.remove('hide');
            element.classList.add('show');
            element.style.transform = null;
        },
        showAndHide: function (element, duration){
            this.fadeIn(element, duration * 1/3)
            setTimeout(() => this.fadeOut(element, duration * 1/3),
                duration * 1/3);
        },
        heartBeating: function (element){
            let beating = () => {
                this.scale(element, 500, 1.4)
                setTimeout(this.scale.bind(this, element, 500, 1 / 1.4), 500);
            }

            const a = setInterval(beating, 1000);

            return {
                stop: function () {
                    clearInterval(a);
            }}
        },
        addMove: function (...args) {
            this._steps.push({action: this.move, args: args})
            return this
        },
        play: function(elem) {
            for (let step of this._steps){
                step.action.bind(this)(elem, ...step.args)
            }
        },
        addScale: function (...args) {
            this._steps.push({action: this.scale, args: args})
            return this
        },
        addFadeIn: function (...args) {
            this._steps.push({action: this.fadeIn, args: args})
            return this
        },
        addFadeOut: function (...args) {
            this._steps.push({action: this.fadeOut, args: args})
            return this
        },
        _steps: []
    }
}
