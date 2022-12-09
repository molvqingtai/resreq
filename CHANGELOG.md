# [1.3.0](https://github.com/molvqingtai/resreq/compare/v1.2.1...v1.3.0) (2022-12-09)


### Features

* expose `mergeHeaders` ([f5d5b09](https://github.com/molvqingtai/resreq/commit/f5d5b0929a77e4eb4a5de3400d7acfa99ac01926))

## [1.2.1](https://github.com/molvqingtai/resreq/compare/v1.2.0...v1.2.1) (2022-12-09)


### Bug Fixes

* `Response.headers` should not be synchronized with `Request.headers` ([69c5a42](https://github.com/molvqingtai/resreq/commit/69c5a42cf71e4aa26ccf3536ec32cccb2479cc65))

# [1.2.0](https://github.com/molvqingtai/resreq/compare/v1.1.4...v1.2.0) (2022-12-07)


### Features

* refactoring `Res` and `Req`, refining the `compose` type definition ([4499be8](https://github.com/molvqingtai/resreq/commit/4499be8c7875ed62b527bd82698d06703f28ef66))


### Performance Improvements

* `isJsonBody` security boundary ([647e305](https://github.com/molvqingtai/resreq/commit/647e305a4969ed566c8eec7e512364d5bc884bd9))
* change ON_GLOBAL_RESPONSE_PROGRESS -> ON_GLOBAL_DOWNLOAD_PROGRESS ([0d925ae](https://github.com/molvqingtai/resreq/commit/0d925aea88c1a8e24b3498529445eda8513ee496))
* onResponseProgress -> onDownloadProgress ([e127f3c](https://github.com/molvqingtai/resreq/commit/e127f3c06cc1ff0bbed04bb8b424e0c3485e430c))

## [1.1.4](https://github.com/molvqingtai/resreq/compare/v1.1.3...v1.1.4) (2022-08-25)


### Bug Fixes

* new Res() Parameter type fix ([1ab627b](https://github.com/molvqingtai/resreq/commit/1ab627bde2c408d636ecfda3973423f809195cbb))

## [1.1.3](https://github.com/molvqingtai/resreq/compare/v1.1.2...v1.1.3) (2022-08-24)


### Bug Fixes

* remove the incorrect deno entry microsoft/TypeScript[#37582](https://github.com/molvqingtai/resreq/issues/37582) ([b69bfec](https://github.com/molvqingtai/resreq/commit/b69bfec15231bed817f308029024add4ae788290))

## [1.1.2](https://github.com/molvqingtai/resreq/compare/v1.1.1...v1.1.2) (2022-08-24)


### Performance Improvements

* use the standard export for deno ([c96463a](https://github.com/molvqingtai/resreq/commit/c96463a2519cd62bf5d5d34e668aa78802b1359f))

## [1.1.1](https://github.com/molvqingtai/resreq/compare/v1.1.0...v1.1.1) (2022-08-22)


### Performance Improvements

* add mod.ts for deno ([4a6f88b](https://github.com/molvqingtai/resreq/commit/4a6f88bcb293e0293bb7d90b7b1966b54b752c1e))

# [1.1.0](https://github.com/molvqingtai/resreq/compare/v1.0.3...v1.1.0) (2022-08-13)


### Bug Fixes

* refine Res type ([c333393](https://github.com/molvqingtai/resreq/commit/c333393ab413b5ca93a42d82c656d688fb4af035))


### Features

* add the responseType option ([54e38e1](https://github.com/molvqingtai/resreq/commit/54e38e184b1f6a7a8ecba2d2b02123887a407957))

## [1.0.3](https://github.com/molvqingtai/resreq/compare/v1.0.2...v1.0.3) (2022-07-05)


### Bug Fixes

* fix local onResponseProgress not working and clean up onRequestProgress ([2c7f08f](https://github.com/molvqingtai/resreq/commit/2c7f08f7a48e5308742d6eb61de3eb8105eb3d83))

## [1.0.2](https://github.com/molvqingtai/resreq/compare/v1.0.1...v1.0.2) (2022-06-21)


### Bug Fixes

* output file contains the ProgressCallback type ([37383dc](https://github.com/molvqingtai/resreq/commit/37383dc170bd09573e6848ebad658e5af0d23c3c))

## [1.0.1](https://github.com/molvqingtai/resreq/compare/v1.0.0...v1.0.1) (2022-03-22)


### Performance Improvements

* add a thanks to the readme ([457cad1](https://github.com/molvqingtai/resreq/commit/457cad1b02d83cecde519524fe743d3f4d0caff7))

# 1.0.0 (2022-03-22)


### Features

* add onDownloadProgress ([04629fb](https://github.com/molvqingtai/resreq/commit/04629fb402d7c2ef49f051f9fcbebad765d27c8e))
* first push ([920c99a](https://github.com/molvqingtai/resreq/commit/920c99a08a911c2640ebf4e0f72bff6eaab9f50a))
* merge request headers ([31b4c08](https://github.com/molvqingtai/resreq/commit/31b4c08d3b267900be7f452d71754fbc373f13f2))
* onResponseProgress ([bd28250](https://github.com/molvqingtai/resreq/commit/bd28250a05dbbbd22d5cefe4f0e66e629cb524dc))
* Progress ratio ([607fcad](https://github.com/molvqingtai/resreq/commit/607fcad9c145543cf0f3ef51214dfbdfa4b33157))


### Performance Improvements

* add content-length comment ([aa2806d](https://github.com/molvqingtai/resreq/commit/aa2806ddcd4e70d640dfef500fea0c480cbf5af8))
* align the default timeout with XMLHttpRequest ([189e2e3](https://github.com/molvqingtai/resreq/commit/189e2e34bb6b73ebd0b01cec819cc1d5266c32d0))
* create request in middleware ([a81c5ac](https://github.com/molvqingtai/resreq/commit/a81c5acc02edec4d5a06b197d484049851789707))
* global progress use Symbol ([4a6c9ff](https://github.com/molvqingtai/resreq/commit/4a6c9ff8387cb00c832e3540e86642f25932daf4))
* judging Body type boundary ([61bc0f9](https://github.com/molvqingtai/resreq/commit/61bc0f9c6f8ed251a01b3f2f6d15bfa63771654c))
* move stream processing to middleware ([5d87a72](https://github.com/molvqingtai/resreq/commit/5d87a7220ea1e7aca0e96c85ca68ea961f8b22b4))
* optimize extended fields ([52edc51](https://github.com/molvqingtai/resreq/commit/52edc512edc3f821f004d15503e2a113af48e389))
* use mergeObject ([353994c](https://github.com/molvqingtai/resreq/commit/353994ca980c15a6ac545d5be91762be427863ce))
* use Request API ([531252c](https://github.com/molvqingtai/resreq/commit/531252c3edfcc7fc1c9febf17d6bfff641654762))
