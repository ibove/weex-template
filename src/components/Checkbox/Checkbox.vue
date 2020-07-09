<template>
  <div @click="toggle" class="wx-chk" :key="model">
    <text
      class="iconfont chk"
      :class="[disabled?'disabled':'']"
    >{{check?'\ue651':indeterminate?'\ue650':'\ue63c'}}</text>
    <text class="wx-font" :class="[disabled?'disabled':'']" v-if="$slots.default || label">
      <slot></slot>
      <template v-if="!$slots.default">{{label}}</template>
    </text>
  </div>
</template>
<script>
export default {
  props: {
    value: [String, Number, Boolean],
    disabled: Boolean,
    label: [String, Number],
    indeterminate: false,
    checked: Boolean
  },
  computed: {
    model() {
      if (this.isGroup) {
        let values = this.checkboxGroup.value;
        let check = values.findIndex(v => v == this.label) >= 0;
        this.$set(this, "check", check);
      }
      return "";
    },
    isGroup() {
      let parent = this.$parent;
      let that = this;
      while (parent) {
        if (parent.$options.componentName !== "ElCheckboxGroup") {
          parent = parent.$parent;
        } else {
          that.checkboxGroup = parent;
          return true;
        }
      }
      return false;
    }
  },

  data() {
    return {
      check: typeof this.value === "boolean" ? this.value : this.checked,
      checkboxGroup: undefined
    };
  },
  created() {
    if (this.isGroup) {
      let values = this.checkboxGroup.value;
      this.check = values.findIndex(v => v == this.label) >= 0;
    }
  },
  methods: {
    dispatch(componentName, eventName, params) {
      var parent = this.$parent || this.$root;
      var name = parent.$options.componentName;

      while (parent && (!name || name !== componentName)) {
        parent = parent.$parent;

        if (parent) {
          name = parent.$options.componentName;
        }
      }
     
      if (parent) {
        parent.$emit.apply(parent, [eventName].concat([params]));
      }
    },
    toggle() {
      if (this.disabled) {
        return;
      }
      this.check = !this.check;
      this.$emit("input", this.check);
      this.$emit("change", this.check);
      if (this.isGroup) {
        let values = [...this.checkboxGroup.value];
  
        if (this.check) {
          values.push(this.label);
        } else {
          values = values.filter(l => l != this.label);
        }
       
        this.dispatch("ElCheckboxGroup", "input", values);
        this.dispatch("ElCheckboxGroup", "change", values);
      }
    }
  }
};
</script>

<style scoped>
.iconfont {
  font-family: iconfont5;
  font-size: 18px;
  text-align: center;
}
.wx-chk {
  flex-direction: row;
  align-items: center;
}
.chk {
  font-size: 20px;
  color: #333;
}
.wx-font {
  font-size: 12px;
}
.disabled {
  color: #dcdfe6;
}
</style>