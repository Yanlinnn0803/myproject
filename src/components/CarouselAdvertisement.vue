<template>
    <div class="carousel">
        <div class="carousel-inner">
            <div v-for="(slide, index) in slides" :key="slide.AdImage"
                :class="['carousel-slide', { active: index === activeIndex }]">
                <img :src="slide.AdImage" class="carousel-image" />
            </div>
        </div>
        <a class="carousel-control-prev" @click="prevSlide">
            &lsaquo;
        </a>
        <a class="carousel-control-next" @click="nextSlide">
            &rsaquo;
        </a>
    </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { db } from "../config/firebaseConfig";

export default {
    name: "CarouselAdvertisement",

    setup() {
        const activeIndex = ref(0);
        const slides = ref([]);
        let intervalId;

        const prevSlide = () => {
            activeIndex.value = (activeIndex.value - 1 + slides.value.length) % slides.value.length;
        };

        const nextSlide = () => {
            activeIndex.value = (activeIndex.value + 1) % slides.value.length;
        };

        const startAutoPlay = () => {
            intervalId = setInterval(nextSlide, 3000); // 每5秒切換到下一AD
        };

        const stopAutoPlay = () => {
            clearInterval(intervalId);
        };

        onMounted(() => {
            db.collection("CarouselAd")
                .get()
                .then((querySnapshot) => {
                    const slidesData = [];
                    querySnapshot.forEach((doc) => {
                        slidesData.push({
                            AdImage: doc.data().AdImage,
                        });
                    });
                    slides.value = slidesData;
                    startAutoPlay(); // 開始自動播放
                });
        });

        onBeforeUnmount(() => {
            stopAutoPlay();
        });

        return {
            activeIndex,
            slides,
            prevSlide,
            nextSlide,
        };
    },
};
</script>


<style scoped>
.carousel {
    position: relative;
    width: 90%;
    height: 200px;
    margin: 100px auto;
}

.carousel-inner {
    position: relative;
    width: 100%;
    height: 100%;
}

.carousel-slide {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
}

.carousel-slide.active {
    opacity: 1;
}

.carousel-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

/*.carousel-caption {
    position: absolute;
    bottom: 20px;
    left: 20px;
    color: #fff;
}*/

.carousel-control-prev,
.carousel-control-next {
    position: absolute;
    top: 50%;
    z-index: 1;
    font-size: 24px;
    color: #fff;
    text-decoration: none;
    transform: translateY(-50%);
}

.carousel-control-prev {
    left: 20px;
}

.carousel-control-next {
    right: 20px;
}
</style>