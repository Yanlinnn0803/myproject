<template>
    <div class="category-carousel">
        <div class="carousel-container" ref="carousel" @touchstart="handleTouchStart" @touchmove="handleTouchMove"
            @touchend="handleTouchEnd">
            <transition-group name="slide" tag="div" class="category-list">
                <div v-for="(category, index) in uniqueCategories" :key="index" class="category-item">
                    <router-link :to="'/storecategorypage/' + category.name">
                        <div class="thumbnail" :style="getCategoryStyle(category.name)">
                            <!-- Add a picture or for this category -->
                        </div>
                    </router-link>
                    <div class="category-name">{{ category.name }}</div>
                </div>
            </transition-group>
        </div>
    </div>
</template>

<script>
import { db } from "../config/firebaseConfig";

export default {
    data() {
        return {
            categories: [],
            isDragging: false,
            startX: 0,
            currentX: 0,
        };
    },
    methods: {
        getCategoryStyle(categoryName) {
            let imageURL = "";

            if (categoryName === "美式料理") {
                imageURL = require("../assets/America.png");
            } else if (categoryName === "日式料理") {
                imageURL = require("../assets/JAPAN.png");
            } else if (categoryName === "泰式料理") {
                imageURL = require("../assets/TAI.png");
            } else if (categoryName === "韓式料理") {
                imageURL = require("../assets/KOREA.png");
            } else if (categoryName === "小吃") {
                imageURL = require("../assets/tapas.png");
            } else if (categoryName === "飲料") {
                imageURL = require("../assets/drinks.png");
            } else if (categoryName === "炸物") {
                imageURL = require("../assets/fries.png");
            } else if (categoryName === "甜點") {
                imageURL = require("../assets/cake2.png");
            }

            return {
                'background-image': `url(${imageURL})`,
                'background-size': 'cover',
                'background-position': 'center',
                'background-repeat': 'no-repeat',
            };
        },
        handleTouchStart(event) {
            this.isDragging = true;
            this.startX = event.touches[0].clientX;
        },
        handleTouchMove(event) {
            if (!this.isDragging) return;
            const x = event.touches[0].clientX;
            const delta = this.currentX - x;
            this.currentX = x;
            this.$refs.carousel.scrollLeft += delta;
        },
        handleTouchEnd() {
            this.isDragging = false;
        },
    },
    mounted() {
        // 使用 Firebase 查询 storestest 集合中的商店分类
        db.collection('shops')
            .get()
            .then((querySnapshot) => {
                const categories = [];
                querySnapshot.forEach((doc) => {
                    const category = doc.data().category;
                    if (category) {
                        categories.push({ name: category });
                    }
                });
                this.categories = categories;
            });
    },
    computed: {
        uniqueCategories() {
            const uniqueCategories = [];
            const seenCategories = new Set();
            this.categories.forEach((category) => {
                if (!seenCategories.has(category.name) && category.name !== "") {
                    uniqueCategories.push(category);
                    seenCategories.add(category.name);
                }
            });
            return uniqueCategories;
        },
    },
};
</script>

<style>
.category-carousel {
    width: 100%;
    overflow-x: auto;
    white-space: nowrap;
}

.category-carousel::-webkit-scrollbar {
    width: 0.5rem;
    height: 0.5rem;
}

.category-carousel::-webkit-scrollbar-track {
    background: transparent;
}

.carousel-container {
    display: flex;
}

.category-list {
    display: flex;
    align-items: center;
    padding: 10px;
}

.category-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-right: 20px;
}

.thumbnail {
    width: 60px;
    height: 60px;
    background-color: #f7ebce;
    border-radius: 10px;
}

.thumbnail img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.category-name {
    font-size: 14px;
    margin-top: 10px;
    text-align: center;
}
</style>
