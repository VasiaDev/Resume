class ModernCarousel {
    constructor(container) {
        this.container = container;
        this.slides = container.querySelectorAll('.carousel-slide');
        this.dots = container.querySelectorAll('.dot');
        this.prevBtn = container.querySelector('.prev-btn');
        this.nextBtn = container.querySelector('.next-btn');
        this.currentIndex = 1;
        this.totalSlides = this.slides.length;
        this.isAnimating = false;

        this.init();
    }

    init() {
        this.prevBtn.addEventListener('click', () => this.prev());
        this.nextBtn.addEventListener('click', () => this.next());

        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.goToSlide(index));
        });

        this.startAutoPlay();

        this.container.addEventListener('mouseenter', () => this.stopAutoPlay());
        this.container.addEventListener('mouseleave', () => this.startAutoPlay());
    }

    updateSlides() {
        if (this.isAnimating) return;
        this.isAnimating = true;

        this.slides.forEach((slide, index) => {
            slide.classList.remove('active', 'prev', 'next', 'hidden');

            if (index === this.currentIndex) {
                slide.classList.add('active');
            } else if (index === this.getPrevIndex()) {
                slide.classList.add('prev');
            } else if (index === this.getNextIndex()) {
                slide.classList.add('next');
            } else {
                slide.classList.add('hidden');
            }
        });

        this.updateDots();

        setTimeout(() => {
            this.isAnimating = false;
        }, 800);
    }

    updateDots() {
        this.dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentIndex);
        });
    }

    prev() {
        this.currentIndex = this.currentIndex === 0 ? this.totalSlides - 1 : this.currentIndex - 1;
        this.updateSlides();
    }

    next() {
        this.currentIndex = this.currentIndex === this.totalSlides - 1 ? 0 : this.currentIndex + 1;
        this.updateSlides();
    }

    goToSlide(index) {
        if (index !== this.currentIndex) {
            this.currentIndex = index;
            this.updateSlides();
        }
    }

    getPrevIndex() {
        return this.currentIndex === 0 ? this.totalSlides - 1 : this.currentIndex - 1;
    }

    getNextIndex() {
        return this.currentIndex === this.totalSlides - 1 ? 0 : this.currentIndex + 1;
    }

    startAutoPlay() {
        this.autoPlayInterval = setInterval(() => {
            this.next();
        }, 3000);
    }

    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
        }
    }
}