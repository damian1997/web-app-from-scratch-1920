!function(t){var n={};function e(r){if(n[r])return n[r].exports;var a=n[r]={i:r,l:!1,exports:{}};return t[r].call(a.exports,a,a.exports,e),a.l=!0,a.exports}e.m=t,e.c=n,e.d=function(t,n,r){e.o(t,n)||Object.defineProperty(t,n,{enumerable:!0,get:r})},e.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},e.t=function(t,n){if(1&n&&(t=e(t)),8&n)return t;if(4&n&&"object"==typeof t&&t&&t.__esModule)return t;var r=Object.create(null);if(e.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:t}),2&n&&"string"!=typeof t)for(var a in t)e.d(r,a,function(n){return t[n]}.bind(null,a));return r},e.n=function(t){var n=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(n,"a",n),n},e.o=function(t,n){return Object.prototype.hasOwnProperty.call(t,n)},e.p="",e(e.s=3)}([function(module,exports,__webpack_require__){eval("/*!\n * routie - a tiny hash router\n * v0.3.2\n * http://projects.jga.me/routie\n * copyright Greg Allen 2016\n * MIT License\n*/\nvar Routie = function(w, isModule) {\n\n  var routes = [];\n  var map = {};\n  var reference = \"routie\";\n  var oldReference = w[reference];\n\n  var Route = function(path, name) {\n    this.name = name;\n    this.path = path;\n    this.keys = [];\n    this.fns = [];\n    this.params = {};\n    this.regex = pathToRegexp(this.path, this.keys, false, false);\n\n  };\n\n  Route.prototype.addHandler = function(fn) {\n    this.fns.push(fn);\n  };\n\n  Route.prototype.removeHandler = function(fn) {\n    for (var i = 0, c = this.fns.length; i < c; i++) {\n      var f = this.fns[i];\n      if (fn == f) {\n        this.fns.splice(i, 1);\n        return;\n      }\n   }\n  };\n\n  Route.prototype.run = function(params) {\n    for (var i = 0, c = this.fns.length; i < c; i++) {\n      this.fns[i].apply(this, params);\n    }\n  };\n\n  Route.prototype.match = function(path, params){\n    var m = this.regex.exec(path);\n\n    if (!m) return false;\n\n\n    for (var i = 1, len = m.length; i < len; ++i) {\n      var key = this.keys[i - 1];\n\n      var val = ('string' == typeof m[i]) ? decodeURIComponent(m[i]) : m[i];\n\n      if (key) {\n        this.params[key.name] = val;\n      }\n      params.push(val);\n    }\n\n    return true;\n  };\n\n  Route.prototype.toURL = function(params) {\n    var path = this.path;\n    for (var param in params) {\n      path = path.replace('/:'+param, '/'+params[param]);\n    }\n    path = path.replace(/\\/:.*\\?/g, '/').replace(/\\?/g, '');\n    if (path.indexOf(':') != -1) {\n      throw new Error('missing parameters for url: '+path);\n    }\n    return path;\n  };\n\n  var pathToRegexp = function(path, keys, sensitive, strict) {\n    if (path instanceof RegExp) return path;\n    if (path instanceof Array) path = '(' + path.join('|') + ')';\n    path = path\n      .concat(strict ? '' : '/?')\n      .replace(/\\/\\(/g, '(?:/')\n      .replace(/\\+/g, '__plus__')\n      .replace(/(\\/)?(\\.)?:(\\w+)(?:(\\(.*?\\)))?(\\?)?/g, function(_, slash, format, key, capture, optional){\n        keys.push({ name: key, optional: !! optional });\n        slash = slash || '';\n        return '' + (optional ? '' : slash) + '(?:' + (optional ? slash : '') + (format || '') + (capture || (format && '([^/.]+?)' || '([^/]+?)')) + ')' + (optional || '');\n      })\n      .replace(/([\\/.])/g, '\\\\$1')\n      .replace(/__plus__/g, '(.+)')\n      .replace(/\\*/g, '(.*)');\n    return new RegExp('^' + path + '$', sensitive ? '' : 'i');\n  };\n\n  var addHandler = function(path, fn) {\n    var s = path.split(' ');\n    var name = (s.length == 2) ? s[0] : null;\n    path = (s.length == 2) ? s[1] : s[0];\n\n    if (!map[path]) {\n      map[path] = new Route(path, name);\n      routes.push(map[path]);\n    }\n    map[path].addHandler(fn);\n  };\n\n  var routie = function(path, fn) {\n    if (typeof fn == 'function') {\n      addHandler(path, fn);\n      routie.reload();\n    } else if (typeof path == 'object') {\n      for (var p in path) {\n        addHandler(p, path[p]);\n      }\n      routie.reload();\n    } else if (typeof fn === 'undefined') {\n      routie.navigate(path);\n    }\n  };\n\n  routie.lookup = function(name, obj) {\n    for (var i = 0, c = routes.length; i < c; i++) {\n      var route = routes[i];\n      if (route.name == name) {\n        return route.toURL(obj);\n      }\n    }\n  };\n\n  routie.remove = function(path, fn) {\n    var route = map[path];\n    if (!route)\n      return;\n    route.removeHandler(fn);\n  };\n\n  routie.removeAll = function() {\n    map = {};\n    routes = [];\n  };\n\n  routie.navigate = function(path, options) {\n    options = options || {};\n    var silent = options.silent || false;\n\n    if (silent) {\n      removeListener();\n    }\n    setTimeout(function() {\n      window.location.hash = path;\n\n      if (silent) {\n        setTimeout(function() { \n          addListener();\n        }, 1);\n      }\n\n    }, 1);\n  };\n\n  routie.noConflict = function() {\n    w[reference] = oldReference;\n    return routie;\n  };\n\n  var getHash = function() {\n    return window.location.hash.substring(1);\n  };\n\n  var checkRoute = function(hash, route) {\n    var params = [];\n    if (route.match(hash, params)) {\n      route.run(params);\n      return true;\n    }\n    return false;\n  };\n\n  var hashChanged = routie.reload = function() {\n    var hash = getHash();\n    for (var i = 0, c = routes.length; i < c; i++) {\n      var route = routes[i];\n      if (checkRoute(hash, route)) {\n        return;\n      }\n    }\n  };\n\n  var addListener = function() {\n    if (w.addEventListener) {\n      w.addEventListener('hashchange', hashChanged, false);\n    } else {\n      w.attachEvent('onhashchange', hashChanged);\n    }\n  };\n\n  var removeListener = function() {\n    if (w.removeEventListener) {\n      w.removeEventListener('hashchange', hashChanged);\n    } else {\n      w.detachEvent('onhashchange', hashChanged);\n    }\n  };\n  addListener();\n\n  if (isModule){\n    return routie;\n  } else {\n    w[reference] = routie;\n  }\n   \n};\n\nif (false){} else {\n  module.exports = Routie(window,true);\n} \n\n\n//# sourceURL=webpack:///./src/js/libraries/routie.js?")},function(module,exports,__webpack_require__){eval("// extracted by mini-css-extract-plugin\n\n//# sourceURL=webpack:///./src/scss/main.scss?")},,function(module,__webpack_exports__,__webpack_require__){"use strict";eval("__webpack_require__.r(__webpack_exports__);\n\n// EXTERNAL MODULE: ./src/scss/main.scss\nvar main = __webpack_require__(1);\n\n// EXTERNAL MODULE: ./src/js/libraries/routie.js\nvar routie = __webpack_require__(0);\n\n// CONCATENATED MODULE: ./src/js/virtualdom/virtualdom.mjs\n/* THIS CODE HAS BEEN WRITTEN BY FOLLOWING THESE 3 GUIDES:\n * https://dev.to/ycmjason/building-a-simple-virtual-dom-from-scratch-3d05\n * https://medium.com/@aibolkussain/create-your-own-virtual-dom-to-understand-it-part-1-47b9b6fc6dfb\n * https://medium.com/@aibolkussain/create-your-own-virtual-dom-to-understand-it-part-2-c85c4ffd15f0\n *\n * Special thanks to Thijs for comming up with the sollution of handling events, check him out here:\n * https://github.com/iSirThijs\n\t* */\n\nfunction createVirtualElement( tagName, { attributes = {}, children = [], events = {} } = {} ) {\n\tconst virtualElement = Object.create(null)\n\tObject.assign(virtualElement, {\n\t\ttagName,\n\t\tattributes,\n\t\tchildren,\n\t\tevents\n\t})\n\treturn virtualElement\n}\n\nfunction renderElementToHTML(virtualElement) {\n\t// The virtual element is a string: return a text node\n\tif (typeof virtualElement === 'string')\treturn document.createTextNode(virtualElement);\n\t\n\tlet {tagName, attributes, children, events} = virtualElement;\n\tlet $element;\n\tif (typeof tagName === 'string') {\n\t\t// The tagname is a 'valid' HTML so using it to render\n\t\t$element = document.createElement(tagName);\n\t\t\n\t\t// set it's attribute\n\t\tfor (const [key, value] of Object.entries(attributes)) {\n\t\t\t$element.setAttribute(key, value);\n\t\t}\n\n\t\tfor (const [event, callback] of Object.entries(events)) {\n\t\t\t$element.addEventListener(event, callback);\n\t\t}\n\n\t} else if(typeof tagName === 'function') {\n\t\tconst component = new tagName();\n\t\tconst renderedComponent = component.createVirtualComponent(component.props, component.state);\n\t\t$element = renderElementToHTML(renderedComponent);\n\t\t\n\t\tcomponent.base = $element;\n\t\tcomponent.virtualElement = renderedComponent;\n\t}\n\n\t(children || []).forEach(child =>$element.appendChild(renderElementToHTML(child)));\n\treturn $element;\n}\n\nfunction renderComponent({ createVirtualComponent, base, props = {}, state = {} }, parent) {\n\tconst oldBase = base\n\tbase= renderElementToHTML(\n\t\tcreateVirtualComponent(props, state)\n\t)\n\tif(parent) {\n\t\tparent.appendChild(base)\n\t} else {\n\t\toldBase.parentNode.replaceChild(base, oldBase)\n\t}\n}\n\nfunction updateComponent(component) {\n\tlet virtualComponent = component.createVirtualComponent(component.props, component.state)\n\tcomponent.base = diff(component.base, component.virtualElement, virtualComponent)\n}\n\nfunction diff($element, virtualOldElement, virtualNewElement, parent) {\n\tif($element) {\n\t\t// There are no new elements so they can be removed\t\n\t\tif(virtualNewElement === undefined) {\n\t\t\t$element.remove()\n\t\t\treturn undefined\n\t\t}\n\n\t\tif(typeof virtualNewElement === 'string' || typeof virtualOldElement === 'string') {\n\t\t\t// Check if the string is same as old string\n\t\t\tif(virtualOldElement !== virtualNewElement) {\n\t\t\t\tlet $newNode = renderElementToHTML(virtualNewElement)\n\t\t\t\t$element.replaceWith($newNode)\n\t\t\t\treturn $newNode\n\t\t\t} else return $element\n\t\t}\n\n\t\t// Both elements are of a different type\n\t\tif(virtualOldElement.tagName !== virtualNewElement.tagName) {\n\t\t\t\n\t\t\t// element is a component\n\t\t\tif(typeof virtualNewElement.tagName === 'function') {\n\t\t\t\tconst component = new virtualNewElement.tagName(virtualNewElement.props)\n\t\t\t\tconst virtualComponent = component.createVirtualComponent(component.props, component.state)\n\t\t\t\tlet $newNode = renderElementToHTML(virtualComponent)\n\n\t\t\t\tcomponent.base = $newNode\n\t\t\t\tcomponent.virtualOldElement = virtualComponent\n\t\t\t\t$element.replaceWith($newNode)\n\t\t\t\treturn $newNode\n\t\t\t}\n\t\t\t\n\t\t\t// Replace old element with new element\n\t\t\tlet $newNode = renderElementToHTML(virtualNewElement);\n\t\t\t$element.replaceWith($newNode);\n\t\t\treturn $newNode;\n\n\t\t}\n\t\t\t\n\t\t// Check if attributes or children are different and patch them\n\t\tconst patchAttributes = diffAttrs(virtualOldElement.attributes, virtualNewElement.attributes)\n\t\tconst patchChildren = diffChildren(virtualOldElement.children, virtualNewElement.children)\n\t\tpatchAttributes($element)\n\t\tpatchChildren($element)\n\n\t\tvirtualOldElement.children = virtualNewElement.children\n\t\tvirtualOldElement.attributes = virtualNewElement.attributes\n\n\t\treturn $element\n\t} else {\n\t\t// This is run when there is no DOM yet, this wil append the virtual dom to the parent\n\t\tconst newDom = renderElementToHTML(virtualNewElement)\n\t\tparent.appendChild(newDom)\n\t\treturn newDom \n\t}\n}\n\nfunction zip(xs, ys) {\n  const zipped = []\n  for (let i = 0; i < Math.min(xs.length, ys.length); i++) {\n    zipped.push([xs[i], ys[i]])\n  }\n  return zipped\n}\n\nfunction diffAttrs(oldAttrs, newAttrs) {\n\tconst patches = [];\n\n\tfor(const [key, value] of Object.entries(newAttrs)) {\n\t\tpatches.push($node => {\n\t\t\t$node.setAttribute(key, value);\n\t\t\treturn $node;\n\t\t});\n\t}\n\n\tfor (const key in oldAttrs){\n\t\tif(!(key in newAttrs)) {\n\t\t\tpatches.push($node => {\n\t\t\t\t$node.removeAttribute(key);\n\t\t\t\treturn $node;\n\t\t\t});\n\t\t}\n\t}\n\n\treturn $node => {\n\t\tfor(const patch of patches){\n\t\t\tpatch($node);\n\t\t}\n\t\treturn $node;\n\t};\n}\n\nfunction diffChildren(oldVirtualChildren, newVirtualChildren) {\n\t\n\tconst childPatches = [];\n\toldVirtualChildren.forEach((oldVirtualChild, i) => {\n\t\tchildPatches.push(($node) => diff($node, oldVirtualChild, newVirtualChildren[i]));\n\t});\n\n\tconst additionalPatches = [];\n\tfor (const additionalVirtualChild of newVirtualChildren.slice(oldVirtualChildren.length)) {\n\t\tadditionalPatches.push($node => {\n\t\t\t$node.appendChild(renderElementToHTML(additionalVirtualChild));\n\t\t\treturn $node;\n\t\t});\n\t}\n\treturn $parent => {\n\t\tfor (const patch of additionalPatches){\n\t\t\tpatch($parent);\n\t\t}\n\n\t\tfor (const [patch, $child] of zip(childPatches, $parent.childNodes)) {\n\t\t\tpatch($child);\n\t\t}\n\n\t\treturn $parent;\n\t};\n}\n\n// CONCATENATED MODULE: ./src/js/components/baseComponent.mjs\n\n\nclass baseComponent_BaseComponent {\n\tconstructor(props) {\n\t\tthis.props = props\n\t\tthis.state = {}\n\t}\n\n\tsetState(state) {\n\t\tthis.state = Object.assign({}, state)\n\t\tupdateComponent(this)\n\t}\n}\n\n// CONCATENATED MODULE: ./src/js/components/api.js\nasync function getForkers(baseUrl,forkedRepoOwner,forkedRepo) {\n\tconst data = await fetch(`${baseUrl}/${forkedRepoOwner}/${forkedRepo}/forks`)\n\t\t.then(res => {\n\t\t\treturn res.json()\n\t\t})\n\t\t.then(jsonData => {\n\t\t\tconst constructedEntries = jsonData.map(entry => {\n\t\t\t\treturn constructForkerObject(entry)\n\t\t\t})\n\t\t\treturn constructedEntries\n\t\t})\n\t\t.catch(err => {\n\t\t\tconsole.log('Error ', err)\n\t\t})\n\tconst promisedData = await Promise.all(data)\n\treturn promisedData\n}\n\nasync function getCommits(baseUrl,users) {\n\tconst usersWithCommits = users.map(user => {\n\t\tconst { gitusername, repository } = user\n\t\tconst userWithCommits = fetch(`${baseUrl}/${gitusername}/${repository}/commits?author=${gitusername}`)\n\t\t\t.then(res => {\n\t\t\t\treturn res.json()\n\t\t\t})\n\t\t\t.then(jsonData => {\n\t\t\t\tuser.commits = jsonData\n\t\t\t\treturn user\n\t\t\t})\n\t\t\t.catch(err => {\n\t\t\t\tconsole.log('Error ', err)\n\t\t\t})\n\t\treturn userWithCommits\n\t})\n\tconst promisedData = Promise.all(usersWithCommits)\n\treturn promisedData\n}\n\nasync function getIssues(baseUrl, users) {\n\tconst usersWithIssues = users.map(user=> {\n\t\tconst { gitusername, repository } = user\n\t\tconst userWithIssues = fetch(`${baseUrl}/${gitusername}/${repository}/issues`)\n\t\t\t.then(res => {\n\t\t\t\treturn res.json()\n\t\t\t})\n\t\t\t.then(jsonData => {\n\t\t\t\tuser.issues = jsonData\n\t\t\t\treturn user\n\t\t\t})\n\t\t\t.catch(err => {\n\t\t\t\tconsole.log('Error ', err)\n\t\t\t})\n\t\treturn userWithIssues\n\t})\n\tconst promisedData = Promise.all(usersWithIssues)\n\treturn promisedData\n}\n\nasync function constructForkerObject(entry) {\n\tconst forker = new Object()\n\tforker.gitusername = entry.owner.login\n\tforker.repository = entry.name\n\treturn forker\n}\n\n// CONCATENATED MODULE: ./src/js/components/data.js\nasync function cleanGithubData(forkersData) {\n\tconst cleanedForkers = forkersData.map(async forker => {\n\t\tconst cleanedForker = {}\n\t\tcleanedForker.gitusername = forker.gitusername\n\t\tcleanedForker.repository = forker.repository\n\t\tcleanedForker.commits = await cleanCommits(forker)\n\t\t//cleanedForker.issues = await cleanIssues(forker)\n\t\treturn cleanedForker\t\n\t})\n\tconst promisedData = Promise.all(cleanedForkers)\n\treturn promisedData\n}\n\nasync function cleanCommits(forker) {\n\tconst cleanedCommits = forker.commits.map(commitentry => {\n\t\tconst { commit: { message, committer}, sha, html_url } = commitentry\n\t\tconst splitDate = committer.date.split('T')\n\t\tconst cleanedCommit = {}\n\t\tcleanedCommit.commit = message\n\t\tcleanedCommit.sha = sha\n\t\tcleanedCommit.url = html_url\n\t\tcleanedCommit.pushdate = splitDate[0]\n\t\tcleanedCommit.pushtime = splitDate[1].slice(0,-1)\n\t\treturn cleanedCommit\n\t})\n\treturn cleanedCommits\n}\n\nasync function cleanIssues(forker) {\n\tconst cleanedIssues = forker.issues.map(issueentry => {\n\t\tconst { html_url, created_at, labels, title } = issueentry\n\t\tconst cleanedIssue = {}\n\t\tcleanedIssue.url = html_url\n\t\tcleanedIssue.created_at = created_at\n\t\tcleanedIssue.labels = labels\n\t\tcleanedIssue.title = title\n\t\treturn cleanedIssue\n\t})\n\treturn  cleanedIssues\n}\n\nasync function sortCommits(forkers) {\n\tconst forkersWithSortedCommits = forkers.map(forker => {\n\t\tconst dates = [...new Set(forker.commits.map(commit => {\n\t\t\treturn commit.pushdate\n\t\t}))]\n\t\tconst sortedCommits = dates.map(date => {\n\t\t\tconst dateObj = {}\n\t\t\tdateObj.date = date\n\t\t\tdateObj.commits = []\n\t\t\tforker.commits.forEach(commit => {\n\t\t\t\tif(date == commit.pushdate) {\n\t\t\t\t\tdateObj.commits.push(commit)\n\t\t\t\t}\n\t\t\t})\n\t\t\treturn dateObj\n\t\t})\n\t\tforker.commits = sortedCommits\n\t\treturn forker\n\t})\n\tconst promisedData = Promise.all(forkersWithSortedCommits)\n\treturn promisedData\n}\n\n// CONCATENATED MODULE: ./src/js/components/header.mjs\n/* THIS CODE HAS BEEN WRITTEN BY FOLLOWING THESE 2 GUIDES:\n * https://medium.com/@aibolkussain/create-your-own-virtual-dom-to-understand-it-part-1-47b9b6fc6dfb\n * https://medium.com/@aibolkussain/create-your-own-virtual-dom-to-understand-it-part-2-c85c4ffd15f0\n *  */\n\n\n\n\nclass header_Header extends baseComponent_BaseComponent {\n\tconstructor(props) {\n\t\tsuper(props)\n\t\tthis.submitSearchForm = this.submitSearchForm.bind(this)\n\t}\n\n\tsubmitSearchForm(event) {\n\t\tevent.preventDefault();\n\t\tif(event.target[0].value != '') {\n\t\t\tthis.props.getResults({search: event.target[0].value})\n\t\t} else {\n\t\t\tconsole.log('FILL IN A QUERY');\n\t\t}\n\t}\n\n\tcreateVirtualComponent(props,state) {\n\t\treturn createVirtualElement('header', {\n\t\t\tchildren: [\n\t\t\t\tcreateVirtualElement('div', {\n\t\t\t\t\tchildren: [\n\t\t\t\t\t\tcreateVirtualElement('section', {\n\t\t\t\t\t\t\tchildren: [\n\t\t\t\t\t\t\t\tcreateVirtualElement('h1', {children:['Has anyone been working on my forked repo recently?']}),\n\t\t\t\t\t\t\t\tcreateVirtualElement('form', {\n\t\t\t\t\t\t\t\t\tevents: { submit: this.submitSearchForm },\n\t\t\t\t\t\t\t\t\tchildren: [\n\t\t\t\t\t\t\t\t\t\tcreateVirtualElement('input', {\n\t\t\t\t\t\t\t\t\t\t\tattributes: {type: 'search', placeholder: 'repository'}\n\t\t\t\t\t\t\t\t\t\t}),\n\t\t\t\t\t\t\t\t\t\tcreateVirtualElement('button', {\n\t\t\t\t\t\t\t\t\t\t\tattributes: {type: 'submit'},\n\t\t\t\t\t\t\t\t\t\t\tchildren: ['Search repository']\n\t\t\t\t\t\t\t\t\t\t})\n\t\t\t\t\t\t\t\t\t]\n\t\t\t\t\t\t\t\t})\n\t\t\t\t\t\t\t]\n\t\t\t\t\t\t})\n\n\t\t\t\t\t]\n\t\t\t\t})\n\t\t\t]\n\t\t})\n\t}\n}\n\n// CONCATENATED MODULE: ./src/js/components/overviewcard.mjs\n\n\n\nclass overviewcard_overviewCard extends baseComponent_BaseComponent {\n\tconstructor(props) {\n\t\tsuper(props)\n\t\tthis.state = {}\n\t\tthis.toggleOverviewCards = this.toggleOverviewCards\n\t}\n\n\ttoggleOverviewCards(event) {\n\t\tconst commitsContainer = this.nextSibling\n\t\tif(commitsContainer.classList.contains('hide')) {\n\t\t\tcommitsContainer.classList.add('show')\n\t\t\tcommitsContainer.classList.remove('hide')\n\t\t} else {\n\t\t\tcommitsContainer.classList.add('hide')\n\t\t\tcommitsContainer.classList.remove('show')\n\t\t}\n\t}\n\n\tcreateVirtualComponent(props,state) {\n\t\treturn createVirtualElement('section', {\n\t\t\tattributes: { class: 'forker-overview--card' },\n\t\t\tchildren: [\n\t\t\t\tcreateVirtualElement('header', {\n\t\t\t\t\tevents: { click: this.toggleOverviewCards },\n\t\t\t\t\tchildren: [\n\t\t\t\t\t\tcreateVirtualElement('h2', {\n\t\t\t\t\t\t\tchildren: [props.gitusername]\n\t\t\t\t\t\t}),\n\t\t\t\t\t\tcreateVirtualElement('div', {\n\t\t\t\t\t\t\tchildren: [\n\t\t\t\t\t\t\t\tcreateVirtualElement('span', {\n\t\t\t\t\t\t\t\t\tchildren: [props.commits.length.toString()]\n\t\t\t\t\t\t\t\t}),\n\t\t\t\t\t\t\t\tcreateVirtualElement('span', {\n\t\t\t\t\t\t\t\t\tattributes: { class: 'icon-down-dir' }\n\t\t\t\t\t\t\t\t})\n\t\t\t\t\t\t\t]\n\t\t\t\t\t\t})\n\t\t\t\t\t]\n\t\t\t\t}),\n\t\t\t\tcreateVirtualElement('div', {\n\t\t\t\t\tattributes: { class: 'forker-overview--card--commits-container hide' },\n\t\t\t\t\tchildren: [\n\t\t\t\t\t\t...props.commits.map((commitbydate) => {\n\t\t\t\t\t\t\treturn createVirtualElement('section', {\n\t\t\t\t\t\t\t\tchildren: [\n\t\t\t\t\t\t\t\t\tcreateVirtualElement('h3', {\n\t\t\t\t\t\t\t\t\t\tchildren: [\n\t\t\t\t\t\t\t\t\t\t\tcommitbydate.date.toString(),\n\t\t\t\t\t\t\t\t\t\t]\n\t\t\t\t\t\t\t\t\t}),\n\t\t\t\t\t\t\t\t\t...commitbydate.commits.map((commit) => {\n\t\t\t\t\t\t\t\t\t\treturn createVirtualElement('div', {\n\t\t\t\t\t\t\t\t\t\t\tchildren: [\n\t\t\t\t\t\t\t\t\t\t\t\tcreateVirtualElement('a', {\n\t\t\t\t\t\t\t\t\t\t\t\t\tevents: { click: this.detailState },\n\t\t\t\t\t\t\t\t\t\t\t\t\tattributes: {href: `#commit/${props.gitusername.toString()}&${props.repository.toString()}&${commit.sha.toString()}`},\n\t\t\t\t\t\t\t\t\t\t\t\t\tchildren: [\n\t\t\t\t\t\t\t\t\t\t\t\t\t\tcommit.commit.toString()\n\t\t\t\t\t\t\t\t\t\t\t\t\t]\n\t\t\t\t\t\t\t\t\t\t\t\t})\n\t\t\t\t\t\t\t\t\t\t\t]\n\t\t\t\t\t\t\t\t\t\t})\n\t\t\t\t\t\t\t\t\t})\n\t\t\t\t\t\t\t\t]\n\t\t\t\t\t\t\t})\n\t\t\t\t\t\t})\n\t\t\t\t\t]\n\t\t\t\t}),\n\t\t\t]\n\t\t})\n\t}\n}\n\n// CONCATENATED MODULE: ./src/js/components/overview.mjs\n/* THIS CODE HAS BEEN WRITTEN BY FOLLOWING THESE 2 GUIDES:\n * https://medium.com/@aibolkussain/create-your-own-virtual-dom-to-understand-it-part-1-47b9b6fc6dfb\n * https://medium.com/@aibolkussain/create-your-own-virtual-dom-to-understand-it-part-2-c85c4ffd15f0\n *  */\n\n//import UniversalRouter from 'universal-router'\n\n\n\n\n\nclass overview_Overview extends baseComponent_BaseComponent {\n\tconstructor(props) {\n\t\tsuper(props)\n\t\tthis.state.results = []\n\t\tthis.overviewCard = new overviewcard_overviewCard()\n\t\tthis.virtualElement = this.createVirtualComponent(this.props, this.state)\n\t\tthis.base = renderElementToHTML(this.virtualElement)\n\t}\n\n\tcreateVirtualComponent(props,state) {\n\t\tif(state.results.length) {\n\t\t\treturn createVirtualElement('section', {\n\t\t\t\tattributes: {\n\t\t\t\t\tclass: 'forker-overview'\n\t\t\t\t},\n\t\t\t\tchildren: [\n\t\t\t\t\t...state.results.map((item) => {\n\t\t\t\t\t\treturn this.overviewCard.createVirtualComponent(item, this.state)\n\t\t\t\t\t})\n\t\t\t\t]\n\t\t\t})\n\t\t} else {\n\t\t\treturn createVirtualElement('section', {\n\t\t\t\tattributes: {\n\t\t\t\t\tclass: 'forker-overview'\n\t\t\t\t},\n\t\t\t\tchildren: [\n\t\t\t\t\tcreateVirtualElement('h2', {\n\t\t\t\t\t\tchildren: ['Search to find results']\n\t\t\t\t\t})\n\t\t\t\t]\n\t\t\t})\n\t\t}\n\t}\n}\n\n// CONCATENATED MODULE: ./src/js/components/detail.mjs\n\n\n\nclass detail_Detail extends baseComponent_BaseComponent {\n\tconstructor(props) {\n\t\tsuper(props)\n\t\tthis.toggleCard = this.toggleCard\n\t}\n\n\ttoggleCard(event) {\n\t\tconst codeContainer = this.nextSibling\n\t\tif(codeContainer.classList.contains('hide')) {\n\t\t\tcodeContainer.classList.add('show')\n\t\t\tcodeContainer.classList.remove('hide')\n\t\t} else {\n\t\t\tcodeContainer.classList.add('hide')\n\t\t\tcodeContainer.classList.remove('show')\n\t\t}\n\t}\n\n\tcreateVirtualComponent(props, state) {\n\t\tif(state.detailresults.length) {\n\t\t\treturn createVirtualElement('section', {\n\t\t\t\tattributes: { class: 'detail' },\n\t\t\t\tchildren: [\n\t\t\t\t\t...state.detailresults[0].map((item) => {\n\t\t\t\t\t\tif(item.imagePath) {\n\t\t\t\t\t\t\treturn createVirtualElement('section', {\n\t\t\t\t\t\t\t\tattributes: { class: 'detail--imagesection' },\n\t\t\t\t\t\t\t\tchildren: [\n\t\t\t\t\t\t\t\t\tcreateVirtualElement('header', {\n\t\t\t\t\t\t\t\t\t\tevents: { click: this.toggleCard },\n\t\t\t\t\t\t\t\t\t\tchildren: [\n\t\t\t\t\t\t\t\t\t\t\tcreateVirtualElement('h3', {\n\t\t\t\t\t\t\t\t\t\t\t\tchildren: [ item.filename.toString() ]\n\t\t\t\t\t\t\t\t\t\t\t})\n\t\t\t\t\t\t\t\t\t\t]\n\t\t\t\t\t\t\t\t\t}),\n\t\t\t\t\t\t\t\t\tcreateVirtualElement('div', {\n\t\t\t\t\t\t\t\t\t\tattributes: { class: 'image-container hide' },\n\t\t\t\t\t\t\t\t\t\tchildren: [\n\t\t\t\t\t\t\t\t\t\t\tcreateVirtualElement('img', {\n\t\t\t\t\t\t\t\t\t\t\t\tattributes: { src: `${item.imagePath.toString()}` }\n\t\t\t\t\t\t\t\t\t\t\t})\n\t\t\t\t\t\t\t\t\t\t]\n\t\t\t\t\t\t\t\t\t})\n\t\t\t\t\t\t\t\t]\n\t\t\t\t\t\t\t})\n\t\t\t\t\t\t} else {\n\t\t\t\t\t\t\treturn createVirtualElement('section', {\n\t\t\t\t\t\t\t\tattributes: { class: 'detail--codesection' },\n\t\t\t\t\t\t\t\tchildren: [\n\t\t\t\t\t\t\t\t\tcreateVirtualElement('header', {\n\t\t\t\t\t\t\t\t\t\tevents: { click: this.toggleCard },\n\t\t\t\t\t\t\t\t\t\tchildren: [\n\t\t\t\t\t\t\t\t\t\t\tcreateVirtualElement('h3', {\n\t\t\t\t\t\t\t\t\t\t\t\tchildren: [ item.filename.toString() ]\n\t\t\t\t\t\t\t\t\t\t\t})\n\t\t\t\t\t\t\t\t\t\t]\n\t\t\t\t\t\t\t\t\t}),\n\t\t\t\t\t\t\t\t\tcreateVirtualElement('table', {\n\t\t\t\t\t\t\t\t\t\tattributes: { class: 'hide' },\n\t\t\t\t\t\t\t\t\t\tchildren: [\n\t\t\t\t\t\t\t\t\t\t\tcreateVirtualElement('tbody', {\n\t\t\t\t\t\t\t\t\t\t\t\tchildren: [\n\t\t\t\t\t\t\t\t\t\t\t\t\t...item.filecontents.map((codeline) => {\n\t\t\t\t\t\t\t\t\t\t\t\t\t\treturn createVirtualElement('tr', {\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tchildren: [\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tcreateVirtualElement('td', {\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tchildren: [\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tcreateVirtualElement('span', {\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tchildren: [codeline.toString()]\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t})\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t]\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t})\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t]\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t})\n\t\t\t\t\t\t\t\t\t\t\t\t\t})\n\t\t\t\t\t\t\t\t\t\t\t\t]\n\t\t\t\t\t\t\t\t\t\t\t})\n\t\t\t\t\t\t\t\t\t\t]\n\t\t\t\t\t\t\t\t\t})\n\t\t\t\t\t\t\t\t]\n\t\t\t\t\t\t\t})\n\t\t\t\t\t\t}\n\t\t\t\t\t})\n\t\t\t\t]\n\t\t\t})\n\n\t\t} else {\n\t\t\treturn createVirtualElement('section', {\n\t\t\t\tchildren: [\n\t\t\t\t\t'Loading'\n\t\t\t\t]\n\t\t\t})\n\t\t}\n\t}\n}\n\n// CONCATENATED MODULE: ./src/js/app.mjs\n\n\n\n\n\n\n\n\n\n\nclass app_App extends baseComponent_BaseComponent {\n\tconstructor(props) {\n\t\tsuper(props)\n\t\tthis.state.page = (props && props.page) ? new props.page() : new overview_Overview()\n\t\tthis.getResults = this.getResults.bind(this)\n\t\tthis.scraper = this.scraper.bind(this)\n\t\tthis.header = new header_Header({ getResults: this.getResults.bind() })\n\t\tthis.state.results = []\n\n\t\tthis.virtualElement = this.createVirtualComponent(this.props, this.state)\n\t\tthis.base = renderElementToHTML(this.virtualElement)\n\t}\n\n\tasync getResults({search}) {\n    const loading = document.getElementById('loading')\n    loading.classList.add('show')\n    loading.classList.remove('hide')\n\n\t\tconst apiBaseUrl = 'https://api.github.com/repos'\n\t\tconst split_string = search.split('https://github.com/')\t\n\t\tconst finalstring = split_string[1].split('/')\n\t\tconst fetchUrl = `${apiBaseUrl}/${finalstring[0]}/${finalstring[1]}`\n\n\t\tconst forkers = await getForkers(apiBaseUrl,finalstring[0],finalstring[1])\n\t\t\t.then(async (entrys) => {\n\t\t\t\treturn await getCommits(apiBaseUrl,entrys)\n\t\t\t})\n\n\t\tconst cleanedForkers = await cleanGithubData(forkers)\n\t\t\t.then(async (entrys) => {\n\t\t\t\treturn await sortCommits(entrys)\n\t\t\t})\n\n\t\tthis.setState({results: cleanedForkers, page: this.state.page})\n\t}\n\n\tasync scraper(id) {\n\t\tconst splitstr = id.split('&')\n\t\tconst res = await fetch('https://us-central1-web-app-from-scratch-f6a7f.cloudfunctions.net/scraper', { \n\t\t\tmethod: 'POST', \n\t\t\tbody: JSON.stringify(`https://api.github.com/repos/${splitstr[0]}/${splitstr[1]}/commits/${splitstr[2]}`) \n\t\t})\n    .catch((err) => {\n      console.log('Something when wrong when fetching firebase function ', err)\n    })\n\n\t\tconst data = await res.json()\n\n\t\tthis.setState({detailresults: data, page: this.state.page, results: this.state.results})\n\t}\n\n\tchangePage(page, id = undefined) {\n\t\tthis.state.page = new page()\n\t\tif(id) {\n\t\t\tthis.scraper(id)\n\t\t}\n\t\tupdateComponent(this)\n\t}\n\n\tcreateVirtualComponent(props,state) {\n\t\treturn createVirtualElement('div', {\n\t\t\tattributes: {\n\t\t\t\tclass: 'app'\n\t\t\t},\n\t\t\tchildren: [\n\t\t\t\tthis.header.createVirtualComponent(this.header.props,this.header.state),\n\t\t\t\tcreateVirtualElement('main', {\n\t\t\t\t\tchildren: [\n            createVirtualElement('div', {\n              attributes: { id: 'loading', class: 'loading-container hide' },\n            }),\n\t\t\t\t\t\tstate.page.createVirtualComponent(state.page.props, this.state)\n\t\t\t\t\t]\n\t\t\t\t})\n\t\t\t]\n\t\t})\n\t}\n}\n\n\n// CONCATENATED MODULE: ./src/js/components/router.mjs\n\n\n\n\n\n\n\nconst render = ($element, parent) => {\n\tparent.appendChild($element)\n}\n\nconst app = new app_App()\n\nrender(app.base, document.body)\n\nroutie({\n\t'': () => app.changePage(overview_Overview),\n\t'commit/:id': (id) => app.changePage(detail_Detail, id)\n})\n\n// CONCATENATED MODULE: ./src/index.js\n// Import custom js files here\n\n\n\n\n\n//# sourceURL=webpack:///./src/index.js_+_10_modules?")}]);