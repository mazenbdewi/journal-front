// plugins/main.client.js
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('app:mounted', () => {
    console.log('Client-side plugin initialized');
    
    // تهيئة AOS
    if (typeof AOS !== 'undefined') {
      AOS.init({
        duration: 1000,
        easing: 'ease-in-out',
        once: true,
        mirror: false
      });
    }

    // تهيئة dropdown menus بعد تأخير بسيط لضمان تحميل DOM
    setTimeout(() => {
      initDropdownMenus();
      // initMobileNav();
    }, 100);
   initScrollTop();
  });

// function initMobileNav() {
//   const toggle = document.querySelector('.mobile-nav-toggle');
//   const nav = document.querySelector('#navmenu');

//   if (!toggle || !nav) return;

//   toggle.addEventListener('click', function (e) {
//     e.preventDefault();
//     nav.classList.toggle('navmenu-active');
//     this.classList.toggle('bi-list');
//     this.classList.toggle('bi-x');
//   });
// }


  function initScrollTop() {
      const scrollTop = document.querySelector('.scroll-top');
      if (scrollTop) {
        const toggleScrollTop = function() {
          if (window.scrollY > 100) {
            scrollTop.classList.add('active');
          } else {
            scrollTop.classList.remove('active');
          }
        };
        
        window.addEventListener('load', toggleScrollTop);
        document.addEventListener('scroll', toggleScrollTop);
        
        scrollTop.addEventListener('click', function(e) {
          e.preventDefault();
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
        });
      }
    }
  // دالة لتهيئة dropdown menus
  function initDropdownMenus() {
    const dropdownToggles = document.querySelectorAll('.toggle-dropdown');
    
    dropdownToggles.forEach(toggle => {
      // إزالة أي event listeners موجودة مسبقاً
      toggle.replaceWith(toggle.cloneNode(true));
      
      // إضافة event listener جديدة
      const newToggle = document.querySelector(`[data-id="${toggle.dataset.id}"]`) || toggle;
      newToggle.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const parent = this.parentElement;
        const dropdown = parent.querySelector('ul');
        
        if (dropdown) {
          dropdown.classList.toggle('show');
          parent.classList.toggle('active');
          
          // إغلاق dropdowns الأخرى عند فتح واحدة جديدة
          if (dropdown.classList.contains('show')) {
            document.querySelectorAll('.navmenu ul.show').forEach(otherDropdown => {
              if (otherDropdown !== dropdown) {
                otherDropdown.classList.remove('show');
                otherDropdown.parentElement.classList.remove('active');
              }
            });
          }
        }
      });
    });

    // إغلاق dropdowns عند النقر خارجها
    document.addEventListener('click', function(e) {
      if (!e.target.closest('.dropdown')) {
        document.querySelectorAll('.navmenu ul.show').forEach(dropdown => {
          dropdown.classList.remove('show');
          dropdown.parentElement.classList.remove('active');
        });
      }
    });
  }

  // دالة لتهيئة mobile navigation
  function initMobileNav() {
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const navmenu = document.querySelector('#navmenu');
    
    if (mobileNavToggle && navmenu) {
      // إزالة أي event listeners موجودة مسبقاً
      mobileNavToggle.replaceWith(mobileNavToggle.cloneNode(true));
      const newToggle = document.querySelector('.mobile-nav-toggle');
      
      newToggle.addEventListener('click', function(e) {
        e.preventDefault();
        navmenu.classList.toggle('navmenu-active');
        this.classList.toggle('bi-list');
        this.classList.toggle('bi-x');
      });
    }
  }
});