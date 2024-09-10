// Scroll to top
const scrollElement = document.getElementById('scroll-to-top-btn');
const scrollTopBtn = document.getElementById('scroll-to-top');

// Mobile Menu
let mobileMenuBtn = document.getElementById('mobile-menu-btn');
let mobileMenuDrawer = document.getElementById('mobile-menu');

// Pagination
const perPageSelect = document.getElementById('per-page-select');

// Search
var searchKey = document.getElementById('search-input');

// Track My Package
let tracking_number = document.getElementById('tracking-number-input');
let track_button = document.getElementById('track-button');

// MAIN JS
let App = (function() {
    return {
        // data manipulation
        data: {

        },
        // Validation functions
        validation: {
            validateForm(containerEl) {
                for (let index = 0; index < containerEl.querySelectorAll('[validate]').length; index++) {
                    let field = containerEl.querySelectorAll('[validate]')[index];
                    let type = field.tagName.toLowerCase();
                    switch (type) {
                        case 'div':
                            this.validateRadio(field);
                            break;
                        case 'ins-input-file':
                            this.validateFile(field);
                            break;
                        case 'ins-textarea':
                            this.validateInput(field.querySelector('textarea'));
                            break
                        case 'ins-input':
                        default:
                            field.field === 'email' 
                                ? this.validateEmail(field)
                                : this.validateInput(field)
                            break;
                    }
                }
                return this.checkInvalidFields(containerEl);
            },
            checkRecaptcha() {
                let isValid = formEl.querySelector('#g-recaptcha-response').value.trim() !== ''
                    ? true : false;
                isValid
                    ? document.getElementById('recaptcha-v2-wrapper').removeAttribute('has-error')
                    : document.getElementById('recaptcha-v2-wrapper').setAttribute('has-error', true);
                return isValid;
            },
            checkInvalidFields(containerEl) {
                return new Promise(resolve => {
                    setTimeout(() => {
                        resolve(!containerEl.querySelectorAll('.is-invalid').length);
                    }, 200)
                });
            },
            validateTabs(tabEl) {
                for (let i = 0; i < tabEl.querySelectorAll('ins-tab-item').length; i++) {
                    let fields = tabEl.querySfieldelectorAll('ins-tab-item')[i];
                        fields.hasError = fields.querySelectorAll('.is-invalid').length ?
                            true :
                            false;
                }
                return !tabEl.querySelectorAll('.is-invalid').length;
            },
            validateFile(field) {
                field.getFilesList().length <= 0 ?
                    field.setAttribute('has-error', true) :
                    field.removeAttribute('has-error')
            },
            validateRadio(wrapper) {
                wrapper.querySelectorAll('ins-radio input:checked').length ?
                    wrapper.classList.remove('is-invalid') :
                    wrapper.classList.add('is-invalid');
            },
            validateEmail(field) {
                let isEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                if(field.value) {
                    if (isEmail.test(String(field.value).toLowerCase()) === true) {
                        InsitesUtil.validFieldNotif(field);
                        return true;
                    } else {
                        InsitesUtil.invalidFieldNotif(field);
                        return false;
                    }
                }
                InsitesUtil.invalidFieldNotif(field);
                return false;
            },
            validateInput(field) {
                field = field.target ? field.target : field;
                if (!field.value) {
                    InsitesUtil.invalidFieldNotif(field);
                    return true;
                } else {
                    InsitesUtil.validFieldNotif(field);
                    return false;
                }
            },
            async validateSubscriptionForm(event) {
                event.preventDefault();
                let form = document.getElementById('subscribe-form');
                let submitBtn = document.getElementById('subscribe-button');
                submitBtn.loading = true;
                
                if(await App.validation.validateForm(form)) {
                    form.submit();
                    return true;
                } else {
                    submitBtn.loading = false;
                    return false;
                }
            },
            checkIfEmpty(searchString){
                if(searchKey.value == ""){
                    searchKey.setAttribute("has-error", "");
                    return true;
                }else{
                    searchKey.removeAttribute("has-error");
                    return false;
                }
            },
            validateTrackingInput (){
                if (tracking_number.value) {
                    tracking_number.hasError = false;
                    window.location.href = "http://example.com?tracking=" + tracking_number.value;
                } else tracking_number.hasError = true;
            }

        },
        // Events 
        events: {
            // Scroll to top show / hide buton
            initWindowOnScroll() {
                let vh = window.innerHeight + 100;
                window.onscroll = ()=> {
                    if(window.pageYOffset > vh) {
                        scrollElement.classList.add('visible');
                    } else {
                        scrollElement.classList.remove('visible');
                    }
                };
            },
            perPage(per_page, category) {
                let path = window.location.pathname;
                let params =  new URLSearchParams(window.location.search);
                params.set('page', 1);
                params.set('per_page', per_page);
                if (category) params.set('category', category);

                window.location.assign(`${path}${"?"+params.toString()}`);
            },
            toggleDrawerMenu() {
                let state = !mobileMenuDrawer.isOpen ? true : false;
                mobileMenuDrawer.setDrawerState(state);
                this.toggleMobileMenuBtnIcon(state);
            },
            toggleMobileMenuBtnIcon(state) {
                let setIcon = !state
                    ? 'icon-menu-1'
                    : 'icon-close-1';
                mobileMenuBtn.removeAttribute('class');
                mobileMenuBtn.classList.add(setIcon);
            },
            goToSearch (){
                var empty = App.validation.checkIfEmpty(searchKey.value);
                if (!empty){
                    window.location.href = "/search?keyword=" + searchKey.value;
                }
            }
            
        },
        // Initialize elements & event listeners
        init: {
            // Scroll to top event
            initScrollToTopBtn() {
                if (scrollTopBtn) {
                    App.events.initWindowOnScroll();

                    scrollTopBtn.addEventListener('click', () => {
                        window.scrollTo({
                            top: 0,
                            behavior: 'smooth'
                        });
                    });
                }
            },
            // Mobile Menu
            initMobileMenu() {
                mobileMenuBtn = document.getElementById('mobile-menu-btn');
                mobileMenuDrawer = document.getElementById('mobile-menu');
                if (mobileMenuBtn && mobileMenuDrawer) {
                    mobileMenuBtn.addEventListener('click', () => {
                        App.events.toggleDrawerMenu();
                    });
                    mobileMenuDrawer.addEventListener('toggleDrawer', () => {
                        App.events.toggleMobileMenuBtnIcon();
                    });
                }
            },
            // Pagination
            initPerPage() {
                if (perPageSelect) {
                    perPageSelect.addEventListener('change', (event) => {
                        App.events.perPage(event.target.value, event.target.dataset.category);
                    });
                }
            },
            // Search
            initSearch(){
                if (searchKey) {
                    searchKey.addEventListener('insIconClick', App.events.goToSearch);
                    searchKey.addEventListener('insInput', e => {
                        if (e.detail.keyCode === 13) App.events.goToSearch();
                    });
                    searchKey.addEventListener('insValueChange', e => {
                        App.validation.checkIfEmpty(searchKey.value);
                    });
                }
                
            },
            // Track My Package
            initTrackMyPackage(){
                tracking_number = document.getElementById('tracking-number-input');
                track_button = document.getElementById('track-button');
                if(tracking_number && track_button){
                    track_button.addEventListener('click', App.validation.validateTrackingInput);
                    tracking_number.addEventListener('insInput', e => {
                        if (e.detail.keyCode === 13) App.validation.validateTrackingInput();
                    });
                }
            },
            //
            initTimelineFilter() {
                const insFilterEl = document.getElementById('timelineFilter');
                if (!insFilterEl) return;
                
                insFilterEl.addEventListener('insFilterApply', event => {

                    let date = event.detail["Date Period"];
                    let range = date === "All" ? "All" : `${date.from},${date.to}`;
                    let period = date === "All" ? "All" 
                        : date.currentFilter.includes("Custom")
                            ? "Custom" : date.currentFilter;

                    let url =  "/timeline"
                        + `?page=1&per_page=10`
                        + `&category=${event.detail["Category"]}`
                        + `&tag=${event.detail["Tag"]}`
                        + `&period=${period}`
                        + `&range=${range}`;

                    window.location.assign(url);
                });
            },
        }
    }
})();


// Initialize javascript on load
window.App = App;

// Set timeout, make sure HTML components has been loaded
setTimeout(() => {
    App.init.initScrollToTopBtn();
    App.init.initMobileMenu();
    App.init.initPerPage();
    App.init.initSearch();
    App.init.initTrackMyPackage();
    App.init.initTimelineFilter();
}, 500);