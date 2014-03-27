<a name="0.5.1-beta.2"></a>
### 0.5.1-beta.2 (2014-03-27)


#### Bug Fixes

* **a11y:**
  * ensure most important roles are applied first ([fec78ae4](http://github.com/excellenteasy/bradypodion/commit/fec78ae4477ecf44afdc0acaa2d69911478e24e9))
  * add link role to sref and tap ([932261bb](http://github.com/excellenteasy/bradypodion/commit/932261bbbafdd977950c23f0641e38ab658d865f))
  * not overwriting existing attributes ([f8a141d4](http://github.com/excellenteasy/bradypodion/commit/f8a141d42bc2622e3af9a11d3212b95e7b791a68))
* **bpSref:** remove bpSref, replace w/ uiSref ([72d38e1d](http://github.com/excellenteasy/bradypodion/commit/72d38e1dc773ee5e4a3f3bbf1cb21e4647d58cc6))
* **bpTap:** remove bpTap, replace w/ ngClick ([08ff320a](http://github.com/excellenteasy/bradypodion/commit/08ff320a4dc5cc17e1d4301c7ead10d27ab7cb4a))
* **navbar:** on ios put single action on the left ([98cc68b4](http://github.com/excellenteasy/bradypodion/commit/98cc68b4f1ef576b780f7dcc138798596b09da76))


#### Features

* **uiSref:** make it work w/o touch delay ([0eb87130](http://github.com/excellenteasy/bradypodion/commit/0eb871303dcf067c97314e9511a1082a86c14063))


#### Breaking Changes

* bpSref is now named uiSref

before:
```html
<bp-action bp-sref="somestate"></bp-action>
```

after:
```html
<bp-action ui-sref="somestate"></bp-action>
```

This should be a search and replace migration.
 ([72d38e1d](http://github.com/excellenteasy/bradypodion/commit/72d38e1dc773ee5e4a3f3bbf1cb21e4647d58cc6))
* bpTap is now named ngClick

before:
```html
<bp-action bp-tap="doSomething()"></bp-action>
```

after:
```html
<bp-action ng-click="doSomething()"></bp-action>
```

This should be a search and replace migration.
 ([08ff320a](http://github.com/excellenteasy/bradypodion/commit/08ff320a4dc5cc17e1d4301c7ead10d27ab7cb4a))


<a name="0.5.1-beta.1"></a>
### 0.5.1-beta.1 (2014-03-21)


#### Bug Fixes

* **navbar:**
  * log error when param in state url ([21ba62b8](http://github.com/excellenteasy/bradypodion/commit/21ba62b83e707b249c109787a77d06e6621b9a17))
  * only compile up button if up state is found ([3c16bc18](http://github.com/excellenteasy/bradypodion/commit/3c16bc18ad25d65c0dbae2f2d566c1f8f95f2a50))
* **sref:** evaluate on tap, rather than on load ([d507a2fb](http://github.com/excellenteasy/bradypodion/commit/d507a2fb04305caba403bba9a9f0df51f9d92e08))


<a name="0.5.0"></a>
## 0.5.0 (2014-03-15)


#### Bug Fixes

* **navbar:** correct height on any platform/orientation ([ad20c91f](http://github.com/excellenteasy/bradypodion/commit/ad20c91f27eb0427eda25e354d092001424c2f7d))
* **tabbar:** bigger icons ([5dc9a212](http://github.com/excellenteasy/bradypodion/commit/5dc9a21278b315308464aea28929e0dddda28875))


<a name="0.5.0-beta.3"></a>
### 0.5.0-beta.3 (2014-03-12)


#### Bug Fixes

* prevent digest at end of timeouts for perf ([daa9da73](http://github.com/excellenteasy/bradypodion/commit/daa9da734fbeda75a015d547d3bd049953578813))
* **app:** move transition logic to directive closes #76 ([5a2311b2](http://github.com/excellenteasy/bradypodion/commit/5a2311b28e9b502f9c62df48f93d9c136f7a40e6))
* **iscroll:**
  * put the provider in the bp.iscroll module ([478a6609](http://github.com/excellenteasy/bradypodion/commit/478a660957c86fb0599942b4597ca27c3786e5c3))
  * make options configurable via provider ([05a31f6a](http://github.com/excellenteasy/bradypodion/commit/05a31f6a9618595f13ce377a3632716f25966133))
* **navbar:** hide wrapper if no navbar present ([c79c7b32](http://github.com/excellenteasy/bradypodion/commit/c79c7b328f44ffdc2b05d0aced3b875d34017216))
* **navigation:** no animation w/o direction ([f4b1570e](http://github.com/excellenteasy/bradypodion/commit/f4b1570e9d81aa45e70d694bb85b99fa7b6388f1))
* **tab:** enable state params for tab state ([1e7beda7](http://github.com/excellenteasy/bradypodion/commit/1e7beda7b863f557002ed3948acd285824c175d7))
* **view:** merge sref into view closes #77 ([78dfa517](http://github.com/excellenteasy/bradypodion/commit/78dfa51776fc55cae7f9f04690aeefdb50d7adad))


#### Features

* **navbar:** read up state from url ([7a258fa4](http://github.com/excellenteasy/bradypodion/commit/7a258fa490e282595cd161aad4f6651f866dbf8f))


<a name="0.5.0-beta.2"></a>
### 0.5.0-beta.2 (2014-02-28)


#### Bug Fixes

* use controllers instead of scope ([95578fa0](http://github.com/excellenteasy/bradypodion/commit/95578fa0c9916559d94e4fa44a7932c5db44ff9a))
* **navbar:** do not expose private helpers to scope, no isolate ([fb166e14](http://github.com/excellenteasy/bradypodion/commit/fb166e14945e3b6106a9252111c820bf839fb0c6))
* **navigation:**
  * only animate on slide ([5f84f60f](http://github.com/excellenteasy/bradypodion/commit/5f84f60f7695b8b5e1f1d677ecfb344322d7794b))
  * do not leak memory w/ configs ([86289cc5](http://github.com/excellenteasy/bradypodion/commit/86289cc560e821a1538e6cc0a6d841f8ffd74a13))
  * do not expose configs to scope ([1604d9bb](http://github.com/excellenteasy/bradypodion/commit/1604d9bb06ea0cdccac14f3bf7632ff4024af116))
  * compile injected navbar against view scope ([8429e967](http://github.com/excellenteasy/bradypodion/commit/8429e9677718e08c3bcca1fe158f33a2e4a35814))
* **scale:** look more like android ([ebd9ea5b](http://github.com/excellenteasy/bradypodion/commit/ebd9ea5bb4fdae88b5a03cc2f613ba78f55aa3a5))
* **scroll:** fix scroll w/table ([59b5630b](http://github.com/excellenteasy/bradypodion/commit/59b5630bcfc5d86dcf0b5b39d0477516db2d400a))
* **table:** prevent margin collapse in grouped ([3f825b40](http://github.com/excellenteasy/bradypodion/commit/3f825b40e27dca941cbeb2a8e4592b05c5c176eb))


#### Features

* **navbar:** support state params for up button ([65e08083](http://github.com/excellenteasy/bradypodion/commit/65e0808379f9def82c4a70d4bc91df22d0af06a2))
* **sref:**
  * extract parseSref in service ([d19ed574](http://github.com/excellenteasy/bradypodion/commit/d19ed574a3e5affd05f8c6a1c1c8f999c890ed9d))
  * allow ui-router style param definition ([1106fd9c](http://github.com/excellenteasy/bradypodion/commit/1106fd9c3cfc62f12a4e31162e0bd99dc8faf3ac))
* **view:** platform specific transition defaults ([27e879cc](http://github.com/excellenteasy/bradypodion/commit/27e879cc93700072c511e13b2bf9af3f48cc8da5))


<a name="0.5.0-beta.1"></a>
### 0.5.0-beta.1 (2014-02-25)


#### Bug Fixes

* **action-overflow:** unbind events on destroy ([b51aa80d](http://github.com/excellenteasy/bradypodion/commit/b51aa80df13eefe490f1ddba71c0134062ee14c5))
* **navbar:** should remove spawned toolbar on destroy ([cbdf30d1](http://github.com/excellenteasy/bradypodion/commit/cbdf30d1dbb34e90d1a3c26826c7ae5cdc0c0440))
* **view:** getDirection should return null if segments do not match ([18327616](http://github.com/excellenteasy/bradypodion/commit/1832761678a06ec888abcc26ce5669d631649413))


#### Features

* **action-overflow:** initial ([9c4c9e2b](http://github.com/excellenteasy/bradypodion/commit/9c4c9e2bae2b83fd1d783e6b16e103053684821a))
* **navbar:**
  * animate on ios enter/leave ([1e98fc84](http://github.com/excellenteasy/bradypodion/commit/1e98fc844c0d60ef82e4019eeb62a984662a02e7))
  * spawn toolbar ([436c1137](http://github.com/excellenteasy/bradypodion/commit/436c1137fe85b9355734c918f599ac7d4354ae71))
  * allow icons in ios navbar ([3d1dd209](http://github.com/excellenteasy/bradypodion/commit/3d1dd20988220394cd2378a6423050795a892e15))
* **navbar-config:** allows to configure injected navbars ([3017651b](http://github.com/excellenteasy/bradypodion/commit/3017651bf48b4ad57086400b7dbbcea928791e14))
* **navigation:** navigation directive that injects navbars ([d8679a2c](http://github.com/excellenteasy/bradypodion/commit/d8679a2c714d066ec7f94fe2a9b6797e861b7596))
* **toolbar:** initial ([950726f5](http://github.com/excellenteasy/bradypodion/commit/950726f5c5c84f48e2efc0391c0c7003933cbeee))
* **view:**
  * introduce view wrapper ([b72f45a8](http://github.com/excellenteasy/bradypodion/commit/b72f45a80a78f70b58ba8cc965ef0abdc64f09b9))
  * use data from state to detect direction ([a71fcbb0](http://github.com/excellenteasy/bradypodion/commit/a71fcbb022db59ba379d2b796add0c88e0426374))


#### Breaking Changes

* getDirection method is now more strict about detecting the direction from URL segments.
It requires the URLs to be the same in but the one segment that they defer from one
another. Examples below illustrate URL changes and the returned value of getDirection
if fed with the respective URL segments.

Before:
/home -> /home/second returned 'normal'
/home/second -> /home returned 'reverse'
/home/second/third -> /home returned null
/home -> /home/second/third returned 'normal'
/home/second -> /crazy/bar/baz returned 'normal'

After:
/home -> /home/second returns 'normal'
/home/second -> /home returns 'reverse'
/home/second/third -> /home returns null
/home -> /home/second/third returns null
/home/second -> /crazy/bar/baz returns null
 ([18327616](http://github.com/excellenteasy/bradypodion/commit/1832761678a06ec888abcc26ce5669d631649413))


<a name="v0.5.0-alpha.3"></a>
### v0.5.0-alpha.3 (2014-02-17)


#### Bug Fixes

* remove whitespace from templates ([27e95a4c](http://github.com/excellenteasy/bradypodion/commit/27e95a4c3e44b4c58f1163b45b384c891fca38c7))
* **action:** remove buggy back label magic ([4bd0ccac](http://github.com/excellenteasy/bradypodion/commit/4bd0ccac75a897f3267a9b801527f7fffb34125e))
* **back-button:** deprecate old styles ([1a52aa50](http://github.com/excellenteasy/bradypodion/commit/1a52aa5066baccde6e7d43bfde8474bb87f115e9))
* **button:** no icon artifact for ios buttons ([7aff1ab4](http://github.com/excellenteasy/bradypodion/commit/7aff1ab4dc8b2b38fe5e6467950cf853e0379d9c))
* **controllers:** remove artifacts from remove viewCtrl ([8e15e295](http://github.com/excellenteasy/bradypodion/commit/8e15e295f1663b2dcb77a2924d4fec7f9e3c8af3))
* **cover:** now with css animation ([0eeea6a0](http://github.com/excellenteasy/bradypodion/commit/0eeea6a00a68c25968f3cac95cdfbfdc6fb94f0b))
* **icon:** reduce embedded icons and make them optional ([68ea8f09](http://github.com/excellenteasy/bradypodion/commit/68ea8f09e2ffad6c70871d7c6d81a0c33d0dfad0))
* **iscroll:** don't destroy iscroll until transition ends ([68ebf22f](http://github.com/excellenteasy/bradypodion/commit/68ebf22fe3c48f1e69fca1278754755348978772))
* **navbar:**
  * adapt css selectors to new names ([51103481](http://github.com/excellenteasy/bradypodion/commit/5110348174c39159b64357f2f0958c38920f265e))
  * new navbar concept ([bb0ae110](http://github.com/excellenteasy/bradypodion/commit/bb0ae110f325bddf19228c876a412f77927a63f0))
* **search:**
  * android ([4c4b39fb](http://github.com/excellenteasy/bradypodion/commit/4c4b39fbdbd4f415f0c45a5d482dedce8f254985))
  * new ios implementation and styles ([46254e2d](http://github.com/excellenteasy/bradypodion/commit/46254e2d74bd6f8b2be680aadaa7d9c7599e29eb))
* **sref:** fix nestedTap ([fb4dcb3c](http://github.com/excellenteasy/bradypodion/commit/fb4dcb3c2d3637056bdd09c977f6d19c3524c29e))
* **tabbar:** fix styles ([6f31b81e](http://github.com/excellenteasy/bradypodion/commit/6f31b81e6e3f58616c51dd9ae9486e084e43fa05))
* **tap:**
  * encapsulation for element ([ba16497e](http://github.com/excellenteasy/bradypodion/commit/ba16497ef974c544c778b24799a9b762859ccc90))
  * better fallback for getCoordinates ([d9f84764](http://github.com/excellenteasy/bradypodion/commit/d9f84764e0804b91d8bcc2d63a8952052f8bb431))
* **up:** consistent renaming ([24db5e16](http://github.com/excellenteasy/bradypodion/commit/24db5e168ac11009741b3a61a1de9f001af1bd45))
* **view:**
  * store transition type in data object ([6a1bed0a](http://github.com/excellenteasy/bradypodion/commit/6a1bed0ad66e86594a8695a3303b1ba9e3022b0c))
  * deprecate global `to` method. use sref instead ([fe74633b](http://github.com/excellenteasy/bradypodion/commit/fe74633bd0726bc918fccf3984c8bf3456337f9b))


#### Features

* **bpSref:** similiar to ui-sref, but tap enabled ([0e8ad880](http://github.com/excellenteasy/bradypodion/commit/0e8ad880d0617db458cd3daee8cab4faf0950524))
* **button:**
  * new android up button ([9abb0da4](http://github.com/excellenteasy/bradypodion/commit/9abb0da4dc82a5a4118ee6b6467d369b5371fc3c))
  * new ios up button ([b63a0c4a](http://github.com/excellenteasy/bradypodion/commit/b63a0c4ae75ac2e4500c9c45e03633321dd5c34e))
* **config:** configurable on runtime ([7667ac7c](http://github.com/excellenteasy/bradypodion/commit/7667ac7c470f72d170fd3f0f752bb03256149174))
* **navbar:** inject up button from state ([ba46277f](http://github.com/excellenteasy/bradypodion/commit/ba46277ff140b4e39c2918de5cd59a9bcda53691))
* **tabbar:** now based on bp-sref ([316ef554](http://github.com/excellenteasy/bradypodion/commit/316ef554063fac9067337cea89799eeb3deb14c2))


#### Breaking Changes

* bpNavbar attributes `no-center` and `no-button-split` deprecated.
`bp-button` and `bp-icon` renamed to `bp-action.bp-button` and `bp-action.bp-icon`.
 ([bb0ae110](http://github.com/excellenteasy/bradypodion/commit/bb0ae110f325bddf19228c876a412f77927a63f0))
* You have to add a `bp-app` element or attribute. Body alone won't suffice.
There is no more viewController.
 ([dd3d2cc2](http://github.com/excellenteasy/bradypodion/commit/dd3d2cc2ecb1f84a3f4fafd82f982bb1adda6853))

<a name="v0.5.0-alpha.2"></a>
### v0.5.0-alpha.2 (2014-01-18)

<a name="v0.5.0-alpha.1"></a>
### v0.5.0-alpha.1 (2013-12-17)


#### Bug Fixes

* **slide:** tweak easing function ([3a26fb77](http://github.com/excellenteasy/bradypodion/commit/3a26fb7798a94581a1e627ed7ce03e97a227a637))

<a name="v0.4.0"></a>
## v0.4.0 (2013-11-23)

<a name="v0.4.0-rc3"></a>
### v0.4.0-rc3 (2013-11-16)


#### Bug Fixes

* **scroll:** address ios7 scroll bug ([44f7b22a](http://github.com/excellenteasy/bradypodion/commit/44f7b22a8980812a48c3310167740c5d4a45e725))
* **search:** give explicit order after navbar ([85b696a2](http://github.com/excellenteasy/bradypodion/commit/85b696a275992b5b1ddb2f84b44f989099e6228e))
* **tap:** unbind handlers on destroy ([e70800bd](http://github.com/excellenteasy/bradypodion/commit/e70800bddb00fa637efe7281f227468c3f7c370d))

<a name="v0.4.0-rc2"></a>
### v0.4.0-rc2 (2013-11-13)


#### Bug Fixes

* **search:** give explicit order after navbar ([efac8f77](http://github.com/excellenteasy/bradypodion/commit/efac8f77960d8ac190b656e0f7949d8a6094e0df))

<a name="v0.4.0-rc1"></a>
### v0.4.0-rc1 (2013-11-13)


#### Bug Fixes

* correct viewport for android ([504333ec](http://github.com/excellenteasy/bradypodion/commit/504333ec9b42249094035c940292b8ff4ec7927a))
* **animaions:** adapt to ng1.2.0 animations ([0db84a22](http://github.com/excellenteasy/bradypodion/commit/0db84a225cf97bfea999ce03ea63af576d58939e))
* **animate:** ng-animate directive is deprecated w/ ng-1.2 ([98705ea3](http://github.com/excellenteasy/bradypodion/commit/98705ea3e902203e9fe521f160a309530ea12d4e))
* **animations:** bring back animations ([d5a777a6](http://github.com/excellenteasy/bradypodion/commit/d5a777a6a64a8a72307408fd47c21a0dae3e1e5d))
* **config:** adapt config to ng-1.2.0 ([af3a0a04](http://github.com/excellenteasy/bradypodion/commit/af3a0a044bd41b47a4c3361c2c48e072311a50e0))
* **flip:** deprecate till fixed ([ac3fb1f5](http://github.com/excellenteasy/bradypodion/commit/ac3fb1f54b1ef138f71fc90f44213adb48bea49e))
* **grunt:** only build android and ios ([411f4518](http://github.com/excellenteasy/bradypodion/commit/411f4518db1a8a7cb2e7adf4c41f6ffa805cedf3))
* **platforms:**
  * make iOS7 the standard iOS build ([146bcad0](http://github.com/excellenteasy/bradypodion/commit/146bcad040a4db2c3e58db1847f95943ad1a41ce))
  * remove old iOS styles ([c0f05e7b](http://github.com/excellenteasy/bradypodion/commit/c0f05e7b7a00542cb2c5be566b682321d5fce37f))
* **screen:** fix view and screen hierachy for ng-1.2 ([91d343b8](http://github.com/excellenteasy/bradypodion/commit/91d343b8570ce410f58db1e49b83c55417fc7410))
* **typo:** readable base font size ([30ef626e](http://github.com/excellenteasy/bradypodion/commit/30ef626e10faf5c30e014aa8b747be74a9100a08))


#### Features

* **a11y:** label back buttons with "Back to XYZ" ([3df5a9f6](http://github.com/excellenteasy/bradypodion/commit/3df5a9f620d1e8a61a19eaf47bbb17146d1c74ca))
* **iscroll:** style scrollbar for iOS7 ([fe2cc066](http://github.com/excellenteasy/bradypodion/commit/fe2cc066dff9d460b291a7b66c8b6a5320588d02))
* **loading-bar:** add angular-loading-bar and custom styles ([8ad3b072](http://github.com/excellenteasy/bradypodion/commit/8ad3b072c80bf2694878b56cca487e8db69ca28e))
* **scroll:** inital css only scroll directive ([0e6700b6](http://github.com/excellenteasy/bradypodion/commit/0e6700b6906f4696f1a1cf4f99dcd38eb909d5f1))
* **slide:** update slide animation for iOS and ng-1.2 ([e8707289](http://github.com/excellenteasy/bradypodion/commit/e87072898dc2aff331f84a68429ed8736656da23))
* **view:** update and refactor for ng-1.2 compat ([bb4859ec](http://github.com/excellenteasy/bradypodion/commit/bb4859ec8409025872c410c050a751363b25b5c2))

<a name="v0.3.0"></a>
## v0.3.0 (2013-11-05)


#### Bug Fixes

* **encoding:** remove unsafe "EN DASH" from source ([080cd73a](http://github.com/excellenteasy/bradypodion/commit/080cd73ab7c71823e1031553ace261de00367a10))
* **navbar:** give navbar explicit box-ordinal-group ([51faf577](http://github.com/excellenteasy/bradypodion/commit/51faf5773a389b965adce75b973e739fe1775c68))
* **tabbar:**
  * make selected tab accesible ([f30d44de](http://github.com/excellenteasy/bradypodion/commit/f30d44deae6f0f7f517d79e53b91c69a93d4694d))
  * custom tap behavior ([debdc900](http://github.com/excellenteasy/bradypodion/commit/debdc900886fae64b407006b63b17ca5cc377731))
* **table:** apply role "group" to subtables ([36a3824c](http://github.com/excellenteasy/bradypodion/commit/36a3824cc8a44e5e9ee95b254e5210fc878192f1))
* **tap:** support nesting ([96e3b72d](http://github.com/excellenteasy/bradypodion/commit/96e3b72d36404748743c35bb75265eb50e5602f3))


#### Features

* **detailDisclosure:** initial ([a629a61e](http://github.com/excellenteasy/bradypodion/commit/a629a61e5eef3eaccb3cf1ca1c21ed166342b311))
* **tabbar:** initial ([c0392383](http://github.com/excellenteasy/bradypodion/commit/c0392383d2b84806bb1a0df8dd95b21f455eb3ec))
* **typography:** ios7 dynamic type support ([82849638](http://github.com/excellenteasy/bradypodion/commit/8284963831a42c1bbf1cc89db3274c96f97e8dd1))
* **view:**
  * introduce content wrapper that takes remaining space ([8843f39e](http://github.com/excellenteasy/bradypodion/commit/8843f39e44b7b486035b741f5d8bef5a295d17a7))
  * introduce content wrapper that takes remaining space ([904258f9](http://github.com/excellenteasy/bradypodion/commit/904258f9e6f5ef596f7f97b0a437059e59d1f150))

<a name="v0.2.5"></a>
### v0.2.5 (2013-09-23)


#### Bug Fixes

* **iscroll:** use official form support ([5971c6ee](http://github.com/excellenteasy/bradypodion/commit/5971c6eebf45ec74381c5b7b8c3aab0ffec372eb))

<a name="v0.2.4"></a>
### v0.2.4 (2013-09-13)


#### Bug Fixes

* https reference lesshat dependency ([e2cff5a2](http://github.com/excellenteasy/bradypodion/commit/e2cff5a27cf7b2f166431b888f02b95c07dd600e))
* **iscroll:** form support ([dae5c3a2](http://github.com/excellenteasy/bradypodion/commit/dae5c3a25853578dfd33fe4ef8dfebf8f2e19466))

<a name="v0.2.3"></a>
### v0.2.3 (2013-08-05)


#### Bug Fixes

* **iscroll:** evented refresh and delay detection ([ad888219](http://github.com/excellenteasy/bradypodion/commit/ad8882198165a90734f6b5bfacbcd75b1cd16d5c))
* **search:** $emit event on scope when text begin and ends editing ([7c311c4d](http://github.com/excellenteasy/bradypodion/commit/7c311c4dcfc6b585b57de09b5bb06bcd40bee53b))
* **tap:** back button detection in child states ([b6bc2258](http://github.com/excellenteasy/bradypodion/commit/b6bc2258acd4b31dc4042ec3ceb8e53856c541bd))
* **viewService:** direction detection for paramatarized URLs ([4771df66](http://github.com/excellenteasy/bradypodion/commit/4771df66ed7c0373dc194234c18421a8ee78d5b1))

<a name="v0.2.2"></a>
### v0.2.2 (2013-07-31)


#### Bug Fixes

* **view:** fix slide animation w/ consistent backgrounds ([18828a34](http://github.com/excellenteasy/bradypodion/commit/18828a34b69281b39c2c127569562357901f3a9f))
* **viewService:** detect direction for URL with trailing slash ([9e5f7855](http://github.com/excellenteasy/bradypodion/commit/9e5f78556e11a8620f4b24451d9f5a12da017d60))

<a name="v0.2.1"></a>
### v0.2.1 (2013-07-29)


#### Bug Fixes

* **body:** add class from scope config ([1f7d3079](http://github.com/excellenteasy/bradypodion/commit/1f7d3079d5e917dbbf34585301868ffbd18756a9))
* **config:** use provider instead of factories ([963bccf6](http://github.com/excellenteasy/bradypodion/commit/963bccf6db65b530fd08734edd2abd7fb423ce68))
* **viewService:** correct transition and direction detection ([97352e61](http://github.com/excellenteasy/bradypodion/commit/97352e616086f3dcfcfa81400e9e17dbfca73890))


#### Features

* **body:** add ng-cloak CSS ([a6e9e658](http://github.com/excellenteasy/bradypodion/commit/a6e9e65847c536bd6a7db27e52d047573ea51b4d))

<a name="v0.2.0"></a>
## v0.2.0 (2013-07-28)


#### Bug Fixes

* **iscroll:** detect when instantiation delay is needed ([fedaedee](http://github.com/excellenteasy/bradypodion/commit/fedaedeee635b9cf0425ba28b2fbcac9d8a18fff))
* **navbar:** compile text, so one can bind vars to the title ([082bdf12](http://github.com/excellenteasy/bradypodion/commit/082bdf128fb8ca666f420b33c397e86cf786e81c))
* **screen:** consistent screen backgrounds ([9b352cfe](http://github.com/excellenteasy/bradypodion/commit/9b352cfe525f0e6c298cccd4182247d4b4b8d313))
* **viewService:** enable stateParams in `to` function ([c9a4e6a3](http://github.com/excellenteasy/bradypodion/commit/c9a4e6a3c6c1be712c851c72248156f8a65026ab))


#### Features

* **tap:** automatically style buttons that direct back ([de2ec2f2](http://github.com/excellenteasy/bradypodion/commit/de2ec2f2d983137aa1df43792220d9af444ed6cf))
* **viewService:** detect transition direction ([5fd4ca49](http://github.com/excellenteasy/bradypodion/commit/5fd4ca490d23d9b2dedbad53d926966ba3582c34))

