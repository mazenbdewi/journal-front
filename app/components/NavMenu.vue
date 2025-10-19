<template>
  <nav :class="['nav-menu', { open: mobileNavOpen }]">
    <ul class="menu-list">
      <li v-for="item in menuItems" :key="item.id" class="nav-item">
        <div class="nav-link" @click="toggleDropdown(item.id)">
          <a :href="item.link">{{ item.name }}</a>
          <span v-if="item.children" class="arrow">▾</span>
        </div>

        <!-- Dropdown -->
        <ul
          v-if="item.children"
          :class="['dropdown', { open: isDropdownOpen(item.id) }]"
        >
          <li v-for="child in item.children" :key="child.id" class="nav-item">
            <div class="nav-link" @click="toggleDropdown(child.id)">
              <a :href="child.link">{{ child.name }}</a>
              <span v-if="child.children" class="arrow">▸</span>
            </div>

            <!-- Sub Dropdown -->
            <ul
              v-if="child.children"
              :class="['sub-dropdown', { open: isDropdownOpen(child.id) }]"
            >
              <li
                v-for="subchild in child.children"
                :key="subchild.id"
                class="nav-item"
              >
                <a :href="subchild.link" class="sub-dropdown-link">{{
                  subchild.name
                }}</a>
              </li>
            </ul>
          </li>
        </ul>
      </li>

      <!-- اللغة في الموبايل -->
      <li class="nav-item mobile-only language-switcher-mobile">
        <div class="language-buttons">
          <button
            @click="switchLanguage('ar')"
            :class="{ active: currentLocale === 'ar' }"
            class="lang-btn"
          >
            العربية
          </button>
          <button
            @click="switchLanguage('en')"
            :class="{ active: currentLocale === 'en' }"
            class="lang-btn"
          >
            English
          </button>
        </div>
      </li>

      <!-- Login للموبايل -->
      <li class="nav-item mobile-only">
        <a class="btn-getstarted mobile-login-btn" href="courses.html">Login</a>
      </li>
    </ul>
  </nav>
</template>

<script setup>
import { ref } from "vue";

defineProps({
  mobileNavOpen: Boolean,
  currentLocale: String,
  switchLanguage: Function,
});

const menuItems = ref([
  { id: 1, name: "Home", link: "#home" },
  {
    id: 2,
    name: "About",
    link: "#about",
    children: [
      { id: 21, name: "Team", link: "#team" },
      {
        id: 22,
        name: "History",
        link: "#history",
        children: [
          { id: 221, name: "2010", link: "#2010" },
          { id: 222, name: "2020", link: "#2020" },
        ],
      },
    ],
  },
  { id: 3, name: "Services", link: "#services" },
  { id: 4, name: "Contact", link: "#contact" },
]);

const openDropdowns = ref([]);

function toggleDropdown(id) {
  if (openDropdowns.value.includes(id)) {
    openDropdowns.value = openDropdowns.value.filter((x) => x !== id);
  } else {
    openDropdowns.value.push(id);
  }
}

function isDropdownOpen(id) {
  return openDropdowns.value.includes(id);
}
</script>
