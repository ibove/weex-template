/* global Vue */

/* weex initialized here, please do not move this line */

import WeexTable from "@/components/Table/Table";
import WeexDialog from "@/components/Dialog/WeexDialog";
import Checkbox from "@/components/Checkbox/Checkbox";
import CheckboxGroup from "@/components/Checkbox/CheckboxGroup";
import WeexDatePicker from "@/components/DatePicker/DatePicker";

Vue.component("WeexTable", WeexTable);
Vue.component("WeexDialog", WeexDialog);
Vue.component("CheckboxGroup", CheckboxGroup);
Vue.component("Checkbox", Checkbox);
Vue.component("WeexDatePicker", WeexDatePicker);

const { router } = require('./router')
const App = require('@/index.vue')
const meta = weex.requireModule('meta');

let $emit = Vue.prototype.$emit;
const platform = weex.config.env.platform.toLowerCase();
Vue.prototype.$emit = function () {
  let eventName = arguments[0];

  if (platform !== 'web') {
    eventName = eventName.replace(/^\-/, '').replace(/\-(\w)(\w+)/g, function (a, b, c) {
      return b.toUpperCase() + c.toLowerCase();
    });
  }
  let args = [];
  args.push(eventName);
  for (let i = 1; i < arguments.length; i++) {
    args.push(arguments[i]);
  }
  $emit.apply(this, args);

}


// 配置 viewport 的宽度为 640px
meta.setViewport({
  width: 1024,
  // height: 768,
  roundOffDeviation: false
});

if (platform === 'web') {
  var bundle = document.createElement('script')
  bundle.src = "../../../node_modules/@weex-project/weex-picker/js/build/index.js";
  document.body.appendChild(bundle)
}

/* eslint-disable no-new */
new Vue(Vue.util.extend({ el: '#root', router }, App))
router.push('/')
