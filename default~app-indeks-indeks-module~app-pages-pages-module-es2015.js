(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["default~app-indeks-indeks-module~app-pages-pages-module"],{

/***/ "./node_modules/ngx-uploader/fesm2015/ngx-uploader.js":
/*!************************************************************!*\
  !*** ./node_modules/ngx-uploader/fesm2015/ngx-uploader.js ***!
  \************************************************************/
/*! exports provided: UploadStatus, NgFileDropDirective, NgFileSelectDirective, humanizeBytes, NgUploaderService, NgxUploaderModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UploadStatus", function() { return UploadStatus; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NgFileDropDirective", function() { return NgFileDropDirective; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NgFileSelectDirective", function() { return NgFileSelectDirective; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "humanizeBytes", function() { return humanizeBytes; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NgUploaderService", function() { return NgUploaderService; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NgxUploaderModule", function() { return NgxUploaderModule; });
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm2015/index.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm2015/operators/index.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");




/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @enum {number} */
const UploadStatus = {
    Queue: 0,
    Uploading: 1,
    Done: 2,
    Cancelled: 3,
};
UploadStatus[UploadStatus.Queue] = 'Queue';
UploadStatus[UploadStatus.Uploading] = 'Uploading';
UploadStatus[UploadStatus.Done] = 'Done';
UploadStatus[UploadStatus.Cancelled] = 'Cancelled';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @param {?} bytes
 * @return {?}
 */
function humanizeBytes(bytes) {
    if (bytes === 0) {
        return '0 Byte';
    }
    /** @type {?} */
    const k = 1024;
    /** @type {?} */
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
    /** @type {?} */
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
class NgUploaderService {
    /**
     * @param {?=} concurrency
     * @param {?=} contentTypes
     * @param {?=} maxUploads
     */
    constructor(concurrency = Number.POSITIVE_INFINITY, contentTypes = ['*'], maxUploads = Number.POSITIVE_INFINITY) {
        this.queue = [];
        this.serviceEvents = new _angular_core__WEBPACK_IMPORTED_MODULE_2__["EventEmitter"]();
        this.uploadScheduler = new rxjs__WEBPACK_IMPORTED_MODULE_0__["Subject"]();
        this.subs = [];
        this.contentTypes = contentTypes;
        this.maxUploads = maxUploads;
        this.uploadScheduler
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["mergeMap"])(upload => this.startUpload(upload), concurrency))
            .subscribe(uploadOutput => this.serviceEvents.emit(uploadOutput));
    }
    /**
     * @param {?} incomingFiles
     * @return {?}
     */
    handleFiles(incomingFiles) {
        /** @type {?} */
        const allowedIncomingFiles = [].reduce.call(incomingFiles, (acc, checkFile, i) => {
            /** @type {?} */
            const futureQueueLength = acc.length + this.queue.length + 1;
            if (this.isContentTypeAllowed(checkFile.type) && futureQueueLength <= this.maxUploads) {
                acc = acc.concat(checkFile);
            }
            else {
                /** @type {?} */
                const rejectedFile = this.makeUploadFile(checkFile, i);
                this.serviceEvents.emit({ type: 'rejected', file: rejectedFile });
            }
            return acc;
        }, []);
        this.queue.push(...[].map.call(allowedIncomingFiles, (file, i) => {
            /** @type {?} */
            const uploadFile = this.makeUploadFile(file, i);
            this.serviceEvents.emit({ type: 'addedToQueue', file: uploadFile });
            return uploadFile;
        }));
        this.serviceEvents.emit({ type: 'allAddedToQueue' });
    }
    /**
     * @param {?} input
     * @return {?}
     */
    initInputEvents(input) {
        return input.subscribe((event) => {
            switch (event.type) {
                case 'uploadFile':
                    /** @type {?} */
                    const uploadFileIndex = this.queue.findIndex(file => file === event.file);
                    if (uploadFileIndex !== -1 && event.file) {
                        this.uploadScheduler.next({ file: this.queue[uploadFileIndex], event: event });
                    }
                    break;
                case 'uploadAll':
                    /** @type {?} */
                    const files = this.queue.filter(file => file.progress.status === UploadStatus.Queue);
                    files.forEach(file => this.uploadScheduler.next({ file: file, event: event }));
                    break;
                case 'cancel':
                    /** @type {?} */
                    const id = event.id || null;
                    if (!id) {
                        return;
                    }
                    /** @type {?} */
                    const subs = this.subs.filter(sub => sub.id === id);
                    subs.forEach(sub => {
                        if (sub.sub) {
                            sub.sub.unsubscribe();
                            /** @type {?} */
                            const fileIndex = this.queue.findIndex(file => file.id === id);
                            if (fileIndex !== -1) {
                                this.queue[fileIndex].progress.status = UploadStatus.Cancelled;
                                this.serviceEvents.emit({ type: 'cancelled', file: this.queue[fileIndex] });
                            }
                        }
                    });
                    break;
                case 'cancelAll':
                    this.subs.forEach(sub => {
                        if (sub.sub) {
                            sub.sub.unsubscribe();
                        }
                        /** @type {?} */
                        const file = this.queue.find(uploadFile => uploadFile.id === sub.id);
                        if (file) {
                            file.progress.status = UploadStatus.Cancelled;
                            this.serviceEvents.emit({ type: 'cancelled', file: file });
                        }
                    });
                    break;
                case 'remove':
                    if (!event.id) {
                        return;
                    }
                    /** @type {?} */
                    const i = this.queue.findIndex(file => file.id === event.id);
                    if (i !== -1) {
                        /** @type {?} */
                        const file = this.queue[i];
                        this.queue.splice(i, 1);
                        this.serviceEvents.emit({ type: 'removed', file: file });
                    }
                    break;
                case 'removeAll':
                    if (this.queue.length) {
                        this.queue = [];
                        this.serviceEvents.emit({ type: 'removedAll' });
                    }
                    break;
            }
        });
    }
    /**
     * @param {?} upload
     * @return {?}
     */
    startUpload(upload) {
        return new rxjs__WEBPACK_IMPORTED_MODULE_0__["Observable"](observer => {
            /** @type {?} */
            const sub = this.uploadFile(upload.file, upload.event)
                .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["finalize"])(() => {
                if (!observer.closed) {
                    observer.complete();
                }
            }))
                .subscribe(output => {
                observer.next(output);
            }, err => {
                observer.error(err);
                observer.complete();
            }, () => {
                observer.complete();
            });
            this.subs.push({ id: upload.file.id, sub: sub });
        });
    }
    /**
     * @param {?} file
     * @param {?} event
     * @return {?}
     */
    uploadFile(file, event) {
        return new rxjs__WEBPACK_IMPORTED_MODULE_0__["Observable"](observer => {
            /** @type {?} */
            const url = event.url || '';
            /** @type {?} */
            const method = event.method || 'POST';
            /** @type {?} */
            const data = event.data || {};
            /** @type {?} */
            const headers = event.headers || {};
            /** @type {?} */
            const xhr = new XMLHttpRequest();
            /** @type {?} */
            const time = new Date().getTime();
            /** @type {?} */
            let progressStartTime = (file.progress.data && file.progress.data.startTime) || time;
            /** @type {?} */
            let speed = 0;
            /** @type {?} */
            let eta = null;
            xhr.upload.addEventListener('progress', (e) => {
                if (e.lengthComputable) {
                    /** @type {?} */
                    const percentage = Math.round((e.loaded * 100) / e.total);
                    /** @type {?} */
                    const diff = new Date().getTime() - time;
                    speed = Math.round(e.loaded / diff * 1000);
                    progressStartTime = (file.progress.data && file.progress.data.startTime) || new Date().getTime();
                    eta = Math.ceil((e.total - e.loaded) / speed);
                    file.progress = {
                        status: UploadStatus.Uploading,
                        data: {
                            percentage: percentage,
                            speed: speed,
                            speedHuman: `${humanizeBytes(speed)}/s`,
                            startTime: progressStartTime,
                            endTime: null,
                            eta: eta,
                            etaHuman: this.secondsToHuman(eta)
                        }
                    };
                    observer.next({ type: 'uploading', file: file });
                }
            }, false);
            xhr.upload.addEventListener('error', (e) => {
                observer.error(e);
                observer.complete();
            });
            xhr.onreadystatechange = () => {
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    /** @type {?} */
                    const speedAverage = Math.round(file.size / (new Date().getTime() - progressStartTime) * 1000);
                    file.progress = {
                        status: UploadStatus.Done,
                        data: {
                            percentage: 100,
                            speed: speedAverage,
                            speedHuman: `${humanizeBytes(speedAverage)}/s`,
                            startTime: progressStartTime,
                            endTime: new Date().getTime(),
                            eta: eta,
                            etaHuman: this.secondsToHuman(eta || 0)
                        }
                    };
                    file.responseStatus = xhr.status;
                    try {
                        file.response = JSON.parse(xhr.response);
                    }
                    catch (e) {
                        file.response = xhr.response;
                    }
                    file.responseHeaders = this.parseResponseHeaders(xhr.getAllResponseHeaders());
                    observer.next({ type: 'done', file: file });
                    observer.complete();
                }
            };
            xhr.open(method, url, true);
            xhr.withCredentials = event.withCredentials ? true : false;
            try {
                /** @type {?} */
                const uploadFile = (/** @type {?} */ (file.nativeFile));
                /** @type {?} */
                const uploadIndex = this.queue.findIndex(outFile => outFile.nativeFile === uploadFile);
                if (this.queue[uploadIndex].progress.status === UploadStatus.Cancelled) {
                    observer.complete();
                }
                Object.keys(headers).forEach(key => xhr.setRequestHeader(key, headers[key]));
                /** @type {?} */
                let bodyToSend;
                if (event.includeWebKitFormBoundary !== false) {
                    Object.keys(data).forEach(key => file.form.append(key, data[key]));
                    file.form.append(event.fieldName || 'file', uploadFile, uploadFile.name);
                    bodyToSend = file.form;
                }
                else {
                    bodyToSend = uploadFile;
                }
                this.serviceEvents.emit({ type: 'start', file: file });
                xhr.send(bodyToSend);
            }
            catch (e) {
                observer.complete();
            }
            return () => {
                xhr.abort();
            };
        });
    }
    /**
     * @param {?} sec
     * @return {?}
     */
    secondsToHuman(sec) {
        return new Date(sec * 1000).toISOString().substr(11, 8);
    }
    /**
     * @return {?}
     */
    generateId() {
        return Math.random().toString(36).substring(7);
    }
    /**
     * @param {?} contentTypes
     * @return {?}
     */
    setContentTypes(contentTypes) {
        if (typeof contentTypes !== 'undefined' && contentTypes instanceof Array) {
            if (contentTypes.find((type) => type === '*') !== undefined) {
                this.contentTypes = ['*'];
            }
            else {
                this.contentTypes = contentTypes;
            }
            return;
        }
        this.contentTypes = ['*'];
    }
    /**
     * @return {?}
     */
    allContentTypesAllowed() {
        return this.contentTypes.find((type) => type === '*') !== undefined;
    }
    /**
     * @param {?} mimetype
     * @return {?}
     */
    isContentTypeAllowed(mimetype) {
        if (this.allContentTypesAllowed()) {
            return true;
        }
        return this.contentTypes.find((type) => type === mimetype) !== undefined;
    }
    /**
     * @param {?} file
     * @param {?} index
     * @return {?}
     */
    makeUploadFile(file, index) {
        return {
            fileIndex: index,
            id: this.generateId(),
            name: file.name,
            size: file.size,
            type: file.type,
            form: new FormData(),
            progress: {
                status: UploadStatus.Queue,
                data: {
                    percentage: 0,
                    speed: 0,
                    speedHuman: `${humanizeBytes(0)}/s`,
                    startTime: null,
                    endTime: null,
                    eta: null,
                    etaHuman: null
                }
            },
            lastModifiedDate: new Date(file.lastModified),
            sub: undefined,
            nativeFile: file
        };
    }
    /**
     * @private
     * @param {?} httpHeaders
     * @return {?}
     */
    parseResponseHeaders(httpHeaders) {
        if (!httpHeaders) {
            return;
        }
        return httpHeaders.split('\n')
            .map((x) => x.split(/: */, 2))
            .filter((x) => x[0])
            .reduce((acc, x) => {
            acc[x[0]] = x[1];
            return acc;
        }, {});
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class NgFileDropDirective {
    /**
     * @param {?} elementRef
     */
    constructor(elementRef) {
        this.elementRef = elementRef;
        this.stopEvent = (e) => {
            e.stopPropagation();
            e.preventDefault();
        };
        this.uploadOutput = new _angular_core__WEBPACK_IMPORTED_MODULE_2__["EventEmitter"]();
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this._sub = [];
        /** @type {?} */
        const concurrency = this.options && this.options.concurrency || Number.POSITIVE_INFINITY;
        /** @type {?} */
        const allowedContentTypes = this.options && this.options.allowedContentTypes || ['*'];
        /** @type {?} */
        const maxUploads = this.options && this.options.maxUploads || Number.POSITIVE_INFINITY;
        this.upload = new NgUploaderService(concurrency, allowedContentTypes, maxUploads);
        this.el = this.elementRef.nativeElement;
        this._sub.push(this.upload.serviceEvents.subscribe((event) => {
            this.uploadOutput.emit(event);
        }));
        if (this.uploadInput instanceof _angular_core__WEBPACK_IMPORTED_MODULE_2__["EventEmitter"]) {
            this._sub.push(this.upload.initInputEvents(this.uploadInput));
        }
        this.el.addEventListener('drop', this.stopEvent, false);
        this.el.addEventListener('dragenter', this.stopEvent, false);
        this.el.addEventListener('dragover', this.stopEvent, false);
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this._sub.forEach(sub => sub.unsubscribe());
    }
    /**
     * @param {?} e
     * @return {?}
     */
    onDrop(e) {
        e.stopPropagation();
        e.preventDefault();
        /** @type {?} */
        const event = { type: 'drop' };
        this.uploadOutput.emit(event);
        this.upload.handleFiles(e.dataTransfer.files);
    }
    /**
     * @param {?} e
     * @return {?}
     */
    onDragOver(e) {
        if (!e) {
            return;
        }
        /** @type {?} */
        const event = { type: 'dragOver' };
        this.uploadOutput.emit(event);
    }
    /**
     * @param {?} e
     * @return {?}
     */
    onDragLeave(e) {
        if (!e) {
            return;
        }
        /** @type {?} */
        const event = { type: 'dragOut' };
        this.uploadOutput.emit(event);
    }
}
NgFileDropDirective.decorators = [
    { type: _angular_core__WEBPACK_IMPORTED_MODULE_2__["Directive"], args: [{
                selector: '[ngFileDrop]'
            },] }
];
/** @nocollapse */
NgFileDropDirective.ctorParameters = () => [
    { type: _angular_core__WEBPACK_IMPORTED_MODULE_2__["ElementRef"] }
];
NgFileDropDirective.propDecorators = {
    options: [{ type: _angular_core__WEBPACK_IMPORTED_MODULE_2__["Input"] }],
    uploadInput: [{ type: _angular_core__WEBPACK_IMPORTED_MODULE_2__["Input"] }],
    uploadOutput: [{ type: _angular_core__WEBPACK_IMPORTED_MODULE_2__["Output"] }],
    onDrop: [{ type: _angular_core__WEBPACK_IMPORTED_MODULE_2__["HostListener"], args: ['drop', ['$event'],] }],
    onDragOver: [{ type: _angular_core__WEBPACK_IMPORTED_MODULE_2__["HostListener"], args: ['dragover', ['$event'],] }],
    onDragLeave: [{ type: _angular_core__WEBPACK_IMPORTED_MODULE_2__["HostListener"], args: ['dragleave', ['$event'],] }]
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class NgFileSelectDirective {
    /**
     * @param {?} elementRef
     */
    constructor(elementRef) {
        this.elementRef = elementRef;
        this.fileListener = () => {
            if (this.el.files) {
                this.upload.handleFiles(this.el.files);
            }
        };
        this.uploadOutput = new _angular_core__WEBPACK_IMPORTED_MODULE_2__["EventEmitter"]();
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this._sub = [];
        /** @type {?} */
        const concurrency = this.options && this.options.concurrency || Number.POSITIVE_INFINITY;
        /** @type {?} */
        const allowedContentTypes = this.options && this.options.allowedContentTypes || ['*'];
        /** @type {?} */
        const maxUploads = this.options && this.options.maxUploads || Number.POSITIVE_INFINITY;
        this.upload = new NgUploaderService(concurrency, allowedContentTypes, maxUploads);
        this.el = this.elementRef.nativeElement;
        this.el.addEventListener('change', this.fileListener, false);
        this._sub.push(this.upload.serviceEvents.subscribe((event) => {
            this.uploadOutput.emit(event);
        }));
        if (this.uploadInput instanceof _angular_core__WEBPACK_IMPORTED_MODULE_2__["EventEmitter"]) {
            this._sub.push(this.upload.initInputEvents(this.uploadInput));
        }
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        if (this.el) {
            this.el.removeEventListener('change', this.fileListener, false);
            this._sub.forEach(sub => sub.unsubscribe());
        }
    }
}
NgFileSelectDirective.decorators = [
    { type: _angular_core__WEBPACK_IMPORTED_MODULE_2__["Directive"], args: [{
                selector: '[ngFileSelect]'
            },] }
];
/** @nocollapse */
NgFileSelectDirective.ctorParameters = () => [
    { type: _angular_core__WEBPACK_IMPORTED_MODULE_2__["ElementRef"] }
];
NgFileSelectDirective.propDecorators = {
    options: [{ type: _angular_core__WEBPACK_IMPORTED_MODULE_2__["Input"] }],
    uploadInput: [{ type: _angular_core__WEBPACK_IMPORTED_MODULE_2__["Input"] }],
    uploadOutput: [{ type: _angular_core__WEBPACK_IMPORTED_MODULE_2__["Output"] }]
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class NgxUploaderModule {
}
NgxUploaderModule.decorators = [
    { type: _angular_core__WEBPACK_IMPORTED_MODULE_2__["NgModule"], args: [{
                declarations: [NgFileDropDirective, NgFileSelectDirective],
                exports: [NgFileDropDirective, NgFileSelectDirective]
            },] }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */



//# sourceMappingURL=ngx-uploader.js.map

/***/ }),

/***/ "./node_modules/raw-loader/index.js!./src/app/pages/miscellaneous/not-found/not-found.component.html":
/*!**************************************************************************************************!*\
  !*** ./node_modules/raw-loader!./src/app/pages/miscellaneous/not-found/not-found.component.html ***!
  \**************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"row\">\r\n  <div class=\"col-md-12\">\r\n    <nb-card>\r\n      <nb-card-body>\r\n        <div class=\"flex-centered col-xl-4 col-lg-6 col-md-8 col-sm-12\">\r\n          <h2 class=\"title\">404 Page Not Found</h2>\r\n          <small class=\"sub-title\">The page you were looking for doesn't exist</small>\r\n          <button nbButton fullWidth (click)=\"goToHome()\" type=\"button\" class=\"home-button\">\r\n            Take me home\r\n          </button>\r\n        </div>\r\n      </nb-card-body>\r\n    </nb-card>\r\n  </div>\r\n</div>\r\n"

/***/ }),

/***/ "./src/app/guard/auth.guard.ts":
/*!*************************************!*\
  !*** ./src/app/guard/auth.guard.ts ***!
  \*************************************/
/*! exports provided: AuthGuard */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AuthGuard", function() { return AuthGuard; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm2015/router.js");



let AuthGuard = class AuthGuard {
    constructor(router) {
        this.router = router;
    }
    canActivate(route, state) {
        let userRole = JSON.parse(localStorage.getItem("currentUser.role"));
        if (localStorage.getItem("currentUser")) {
            if (userRole && userRole.indexOf(state.url) === -1) {
                this.router.navigate(["/access-denied"]);
                return false;
            }
            return true;
        }
        else if (sessionStorage.getItem("currentUser")) {
            if (userRole && userRole.indexOf(state.url) === -1) {
                this.router.navigate(["/access-denied"]);
                return false;
            }
            return true;
        }
        // not logged in so redirect to login page with the return url
        this.router.navigate(["public/login"]);
        return false;
    }
};
AuthGuard = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])({
        providedIn: "root"
    }),
    tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"]])
], AuthGuard);



/***/ }),

/***/ "./src/app/guard/config.ts":
/*!*********************************!*\
  !*** ./src/app/guard/config.ts ***!
  \*********************************/
/*! exports provided: Config */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Config", function() { return Config; });
class Config {
    static get() {
        return {
            apiBackend: "/api/",
            page: 1,
            rows: 10
        };
    }
}


/***/ }),

/***/ "./src/app/guard/index.ts":
/*!********************************!*\
  !*** ./src/app/guard/index.ts ***!
  \********************************/
/*! exports provided: AuthGuard, LoginGuard, Config */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _auth_guard__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./auth.guard */ "./src/app/guard/auth.guard.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "AuthGuard", function() { return _auth_guard__WEBPACK_IMPORTED_MODULE_0__["AuthGuard"]; });

/* harmony import */ var _login_guard__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./login.guard */ "./src/app/guard/login.guard.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "LoginGuard", function() { return _login_guard__WEBPACK_IMPORTED_MODULE_1__["LoginGuard"]; });

/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./config */ "./src/app/guard/config.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Config", function() { return _config__WEBPACK_IMPORTED_MODULE_2__["Config"]; });






/***/ }),

/***/ "./src/app/guard/login.guard.ts":
/*!**************************************!*\
  !*** ./src/app/guard/login.guard.ts ***!
  \**************************************/
/*! exports provided: LoginGuard */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LoginGuard", function() { return LoginGuard; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm2015/router.js");



let LoginGuard = class LoginGuard {
    constructor(router) {
        this.router = router;
    }
    canActivate(route, state) {
        if (localStorage.getItem("currentUser")) {
            // this.messageService.clear();
            // this.messageService.add({key: 't-logout', sticky: true, severity:'warn', summary:this.translate.getTranslate().konfirmLogout, detail:''});
            return false;
        }
        else if (sessionStorage.getItem("currentUser")) {
            // this.messageService.clear();
            // this.messageService.add({key: 't-logout', sticky: true, severity:'warn', summary:this.translate.getTranslate().konfirmLogout, detail:''});
            return false;
        }
        return true;
    }
};
LoginGuard = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])({
        providedIn: "root"
    }),
    tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"]])
], LoginGuard);



/***/ }),

/***/ "./src/app/pages/miscellaneous/miscellaneous-routing.module.ts":
/*!*********************************************************************!*\
  !*** ./src/app/pages/miscellaneous/miscellaneous-routing.module.ts ***!
  \*********************************************************************/
/*! exports provided: MiscellaneousRoutingModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MiscellaneousRoutingModule", function() { return MiscellaneousRoutingModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm2015/router.js");
/* harmony import */ var _miscellaneous_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./miscellaneous.component */ "./src/app/pages/miscellaneous/miscellaneous.component.ts");
/* harmony import */ var _not_found_not_found_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./not-found/not-found.component */ "./src/app/pages/miscellaneous/not-found/not-found.component.ts");





const routes = [
    {
        path: '',
        component: _miscellaneous_component__WEBPACK_IMPORTED_MODULE_3__["MiscellaneousComponent"],
        children: [
            {
                path: '404',
                component: _not_found_not_found_component__WEBPACK_IMPORTED_MODULE_4__["NotFoundComponent"],
            },
        ],
    },
];
let MiscellaneousRoutingModule = class MiscellaneousRoutingModule {
};
MiscellaneousRoutingModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
        imports: [_angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterModule"].forChild(routes)],
        exports: [_angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterModule"]],
    })
], MiscellaneousRoutingModule);



/***/ }),

/***/ "./src/app/pages/miscellaneous/miscellaneous.component.ts":
/*!****************************************************************!*\
  !*** ./src/app/pages/miscellaneous/miscellaneous.component.ts ***!
  \****************************************************************/
/*! exports provided: MiscellaneousComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MiscellaneousComponent", function() { return MiscellaneousComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");


let MiscellaneousComponent = class MiscellaneousComponent {
};
MiscellaneousComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
        selector: 'ngx-miscellaneous',
        template: `
    <router-outlet></router-outlet>
  `,
    })
], MiscellaneousComponent);



/***/ }),

/***/ "./src/app/pages/miscellaneous/miscellaneous.module.ts":
/*!*************************************************************!*\
  !*** ./src/app/pages/miscellaneous/miscellaneous.module.ts ***!
  \*************************************************************/
/*! exports provided: MiscellaneousModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MiscellaneousModule", function() { return MiscellaneousModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var _nebular_theme__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @nebular/theme */ "./node_modules/@nebular/theme/fesm2015/index.js");
/* harmony import */ var _theme_theme_module__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../@theme/theme.module */ "./src/app/@theme/theme.module.ts");
/* harmony import */ var _miscellaneous_routing_module__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./miscellaneous-routing.module */ "./src/app/pages/miscellaneous/miscellaneous-routing.module.ts");
/* harmony import */ var _miscellaneous_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./miscellaneous.component */ "./src/app/pages/miscellaneous/miscellaneous.component.ts");
/* harmony import */ var _not_found_not_found_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./not-found/not-found.component */ "./src/app/pages/miscellaneous/not-found/not-found.component.ts");







let MiscellaneousModule = class MiscellaneousModule {
};
MiscellaneousModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
        imports: [
            _theme_theme_module__WEBPACK_IMPORTED_MODULE_3__["ThemeModule"],
            _nebular_theme__WEBPACK_IMPORTED_MODULE_2__["NbCardModule"],
            _nebular_theme__WEBPACK_IMPORTED_MODULE_2__["NbButtonModule"],
            _miscellaneous_routing_module__WEBPACK_IMPORTED_MODULE_4__["MiscellaneousRoutingModule"],
        ],
        declarations: [
            _miscellaneous_component__WEBPACK_IMPORTED_MODULE_5__["MiscellaneousComponent"],
            _not_found_not_found_component__WEBPACK_IMPORTED_MODULE_6__["NotFoundComponent"],
        ],
    })
], MiscellaneousModule);



/***/ }),

/***/ "./src/app/pages/miscellaneous/not-found/not-found.component.scss":
/*!************************************************************************!*\
  !*** ./src/app/pages/miscellaneous/not-found/not-found.component.scss ***!
  \************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".flex-centered {\n  margin: auto; }\n\nnb-card-body {\n  display: flex; }\n\n.title {\n  text-align: center; }\n\n.sub-title {\n  text-align: center;\n  display: block;\n  margin-bottom: 3rem; }\n\n.home-button {\n  margin-bottom: 2rem; }\n\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvcGFnZXMvbWlzY2VsbGFuZW91cy9ub3QtZm91bmQvRTpcXDIwMTlcXGFuZ3VsYXJcXG5neC1hZG1pbi9zcmNcXGFwcFxccGFnZXNcXG1pc2NlbGxhbmVvdXNcXG5vdC1mb3VuZFxcbm90LWZvdW5kLmNvbXBvbmVudC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0UsWUFBWSxFQUFBOztBQUVkO0VBQ0UsYUFBYSxFQUFBOztBQUdmO0VBQ0Usa0JBQWtCLEVBQUE7O0FBR3BCO0VBQ0Usa0JBQWtCO0VBQ2xCLGNBQWM7RUFDZCxtQkFBbUIsRUFBQTs7QUFHckI7RUFDRSxtQkFBbUIsRUFBQSIsImZpbGUiOiJzcmMvYXBwL3BhZ2VzL21pc2NlbGxhbmVvdXMvbm90LWZvdW5kL25vdC1mb3VuZC5jb21wb25lbnQuc2NzcyIsInNvdXJjZXNDb250ZW50IjpbIi5mbGV4LWNlbnRlcmVkIHtcclxuICBtYXJnaW46IGF1dG87XHJcbn1cclxubmItY2FyZC1ib2R5IHtcclxuICBkaXNwbGF5OiBmbGV4O1xyXG59XHJcblxyXG4udGl0bGUge1xyXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcclxufVxyXG5cclxuLnN1Yi10aXRsZSB7XHJcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xyXG4gIGRpc3BsYXk6IGJsb2NrO1xyXG4gIG1hcmdpbi1ib3R0b206IDNyZW07XHJcbn1cclxuXHJcbi5ob21lLWJ1dHRvbiB7XHJcbiAgbWFyZ2luLWJvdHRvbTogMnJlbTtcclxufVxyXG4iXX0= */"

/***/ }),

/***/ "./src/app/pages/miscellaneous/not-found/not-found.component.ts":
/*!**********************************************************************!*\
  !*** ./src/app/pages/miscellaneous/not-found/not-found.component.ts ***!
  \**********************************************************************/
/*! exports provided: NotFoundComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NotFoundComponent", function() { return NotFoundComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _nebular_theme__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @nebular/theme */ "./node_modules/@nebular/theme/fesm2015/index.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");



let NotFoundComponent = class NotFoundComponent {
    constructor(menuService) {
        this.menuService = menuService;
    }
    goToHome() {
        this.menuService.navigateHome();
    }
};
NotFoundComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["Component"])({
        selector: 'ngx-not-found',
        template: __webpack_require__(/*! raw-loader!./not-found.component.html */ "./node_modules/raw-loader/index.js!./src/app/pages/miscellaneous/not-found/not-found.component.html"),
        styles: [__webpack_require__(/*! ./not-found.component.scss */ "./src/app/pages/miscellaneous/not-found/not-found.component.scss")]
    }),
    tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_nebular_theme__WEBPACK_IMPORTED_MODULE_1__["NbMenuService"]])
], NotFoundComponent);



/***/ })

}]);
//# sourceMappingURL=default~app-indeks-indeks-module~app-pages-pages-module-es2015.js.map