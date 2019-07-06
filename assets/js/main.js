/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./assets/src/js/main.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./assets/src/js/main.js":
/*!*******************************!*\
  !*** ./assets/src/js/main.js ***!
  \*******************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _storage__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./storage */ \"./assets/src/js/storage.js\");\n\r\n\r\nconst windowsLoad = () => new Promise((resolve) => // ждем загрузки страницы\r\n    window.addEventListener('load', () => resolve('load')));\r\nconst findDomElems = () => new Promise((resolve, reject) => { // находим нужные элементы на странице\r\n    Object.keys(_storage__WEBPACK_IMPORTED_MODULE_0__[\"default\"].sl.dom).forEach(el => {\r\n        _storage__WEBPACK_IMPORTED_MODULE_0__[\"default\"].dom[el] = document.querySelector(_storage__WEBPACK_IMPORTED_MODULE_0__[\"default\"].sl.dom[el]);\r\n        if (!_storage__WEBPACK_IMPORTED_MODULE_0__[\"default\"].dom[el]) reject(`'${_storage__WEBPACK_IMPORTED_MODULE_0__[\"default\"].sl.dom[el]}' в dom не найден`);\r\n    });\r\n    resolve();\r\n});\r\n\r\nconst putOnPage = (arr, name) => {\r\n    if (!arr.length) return;\r\n    _storage__WEBPACK_IMPORTED_MODULE_0__[\"default\"].dom[`${name}Container`].textContent = '';\r\n    arr.forEach(data => {\r\n        const el = _storage__WEBPACK_IMPORTED_MODULE_0__[\"default\"].templates[name](data);\r\n        _storage__WEBPACK_IMPORTED_MODULE_0__[\"default\"].dom[`${name}Container`].appendChild(el);\r\n    });\r\n};\r\n\r\nconst webSockerConnect = () => new Promise((resolve, reject) => {\r\n    const ws = new WebSocket('ws://127.0.0.1:81');\r\n    ws.onerror = (error) => {\r\n        // console.log('WebSocket connection error');\r\n        reject(error);\r\n    };\r\n    ws.onopen = () => {\r\n        console.log('WebSocket connection established');\r\n        _storage__WEBPACK_IMPORTED_MODULE_0__[\"default\"].dom.preloader.classList.add(_storage__WEBPACK_IMPORTED_MODULE_0__[\"default\"].sl.cl.uikit.hidden);\r\n    };\r\n    ws.onclose = (event) => {\r\n        if (event.wasClean) {\r\n            console.log('Соединение закрыто чисто');\r\n        } else {\r\n            console.log('Обрыв соединения'); // например, \"убит\" процесс сервера\r\n        }\r\n        console.log('Код: ' + event.code + ' причина: ' + event.reason);\r\n        console.log(event);\r\n        _storage__WEBPACK_IMPORTED_MODULE_0__[\"default\"].errors(_storage__WEBPACK_IMPORTED_MODULE_0__[\"default\"].ms.lostConnection);\r\n    };\r\n    ws.onmessage = (event) => {\r\n        const jsonData = JSON.parse(event.data);\r\n        console.log(jsonData);\r\n        const { psychics = [], guesses = [], state = '' } = jsonData;\r\n        putOnPage(psychics, 'psychics');\r\n        putOnPage(guesses, 'guesses');\r\n        _storage__WEBPACK_IMPORTED_MODULE_0__[\"default\"].state[state] && _storage__WEBPACK_IMPORTED_MODULE_0__[\"default\"].state[state]();\r\n    };\r\n    _storage__WEBPACK_IMPORTED_MODULE_0__[\"default\"].dom.startButton.addEventListener('click', () => {\r\n        // ws.send('storage.ms.toGuess');\r\n        ws.send(_storage__WEBPACK_IMPORTED_MODULE_0__[\"default\"].ms.toGuess);\r\n    });\r\n    _storage__WEBPACK_IMPORTED_MODULE_0__[\"default\"].dom.form.addEventListener('submit', (event) => {\r\n        event.preventDefault();\r\n        ws.send(_storage__WEBPACK_IMPORTED_MODULE_0__[\"default\"].ms.toAnswer(form.elements.number.value));\r\n        //     const textInput = document.getElementById('chat-message');\r\n        //     const chatText = textInput.value;\r\n        //     textInput.value = '';\r\n        //     console.log(chatText);\r\n        //     ws.send(chatText);\r\n    });\r\n});\r\n\r\nwindowsLoad()\r\n    .then(findDomElems)\r\n    .then(webSockerConnect)\r\n    .catch(err => {\r\n        console.log(err);\r\n    });\n\n//# sourceURL=webpack:///./assets/src/js/main.js?");

/***/ }),

/***/ "./assets/src/js/storage.js":
/*!**********************************!*\
  !*** ./assets/src/js/storage.js ***!
  \**********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\nconst storage = { // сюда сохранятся всякие объекты\r\n    sl: { // селекторы\r\n        dom: { // элементы, которые надо найти на странице\r\n            errors: '.errors',\r\n            psychicsContainer: '.psychicsContainer',\r\n            guessesContainer: '.guessesContainer',\r\n            preloader: '.preloader',\r\n            startButton: '.start',\r\n            form: '#form',\r\n            // test: '.test',\r\n        },\r\n        cl: { // классы\r\n            uikit: {\r\n                hidden: 'uk-hidden',\r\n            },\r\n            psychic: 'psychic',\r\n            guess: 'guess',\r\n        }\r\n    },\r\n    dom: {}, // элементы, которые надо найти на странице\r\n    errors: (er) => {\r\n        console.log(er);\r\n        if (!storage.dom.errors) return;\r\n        const erElem = document.createElement('div');\r\n        storage.dom.errors.appendChild(erElem);\r\n    },\r\n    // чет внятной обработки ошибок не придумал.\r\n    // errors: new Proxy([], {\r\n    //     set(target, property, value) {\r\n    //         if (property === 'length') return true;\r\n    //         target[property] = value;\r\n    //         if (storage.dom.errors) {\r\n    //             storage.dom.errors.textContent = '';\r\n    //             storage.dom.errors.classList.add(storage.sl.cl.uikit.hidden);\r\n    //             storage.errors.forEach(er => {\r\n    //                 storage.dom.errors.classList.remove(storage.sl.cl.uikit.hidden);\r\n    //                 const err = document.createElement('div');\r\n    //                 err.textContent = er;\r\n    //                 storage.dom.errors.appendChild(err);\r\n    //             });\r\n    //         }\r\n    //         // console.error(value);\r\n    //         return true;\r\n    //     },\r\n    //     deleteProperty(target, prop) {\r\n    //         if (prop in target) {\r\n    //             delete target[prop];\r\n    //             console.log(`property removed: ${prop}`);\r\n    //             // expected output: \"property removed: texture\"\r\n    //         }\r\n    //     }\r\n    // }),\r\n    templates: { // шаблоны\r\n        psychics: (data) => {\r\n            const el = document.createElement('div');\r\n            el.classList.add(storage.sl.cl.psychic);\r\n            el.insertAdjacentHTML('afterBegin', [\r\n                `<div class=\"uk-card uk-card-default uk-card-body\">`,\r\n                `    <div class=\"uk-card-media-top\">`,\r\n                `        <img src=\"${data.photoPath}\" ${data.photoPath ? '' : storage.sl.cl.uikit.hidden}>`,\r\n                `    </div>`,\r\n                `    <div class=\"uk-card-body\">`,\r\n                `        <h3 class=\"uk-card-title\">${data.name}</h3>`,\r\n                `        <p>Рейтинг: ${data.rating}</p>`,\r\n                `    </div>`,\r\n                `</div>`,\r\n            ].join(''));\r\n            return el;\r\n        },\r\n        guesses: (data) => {\r\n            const el = document.createElement('div');\r\n            el.classList.add(storage.sl.cl.guess);\r\n            el.insertAdjacentHTML('afterBegin', [\r\n                `<div class=\"uk-card uk-card-default uk-card-body\">`,\r\n                `<h3 class=\"uk-card-title\">${data}</h3>`,\r\n                `</div>`,\r\n            ].join(''));\r\n            return el;\r\n        },\r\n    },\r\n    state: { // состояния\r\n        'begin': () => {\r\n            storage.dom.startButton.classList.remove(storage.sl.cl.uikit.hidden);\r\n            storage.dom.form.classList.add(storage.sl.cl.uikit.hidden);\r\n            storage.dom.guessesContainer.classList.add(storage.sl.cl.uikit.hidden);\r\n            storage.dom.form.elements.number.value = '';\r\n        },\r\n        'guess': () => {\r\n            storage.dom.startButton.classList.add(storage.sl.cl.uikit.hidden);\r\n            storage.dom.form.classList.remove(storage.sl.cl.uikit.hidden);\r\n            storage.dom.guessesContainer.classList.remove(storage.sl.cl.uikit.hidden);\r\n        },\r\n    },\r\n    ms: { // сообщения\r\n        toGuess: JSON.stringify({ step: 'toGuess' }),\r\n        toAnswer: (number) => JSON.stringify({ step: 'toAnswer', answer: number }),\r\n        lostConnection: 'потеряно соединение, перезагрузите страницу',\r\n    }\r\n};\r\n\r\n/* harmony default export */ __webpack_exports__[\"default\"] = (storage);\n\n//# sourceURL=webpack:///./assets/src/js/storage.js?");

/***/ })

/******/ });