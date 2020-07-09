<template>
  <div v-if="visible" class="filter" @click="stop">
    <div @click="event=>event.stopPropagation()" class="weex-modal" :style="[{width:width+'px'}]">
      <div class="weex-header">
        <div>
          <text
            class="weex-head-title"
            v-if="getSlots().findIndex(key=>key=='header')==-1"
          >{{title}}</text>

          <div v-else>
            <slot name="header"></slot>
          </div>
        </div>
        <text @click="stop" class="iconfont">&#xe81e;</text>
      </div>
      <div class="weex-body">
        <slot></slot>
      </div>
      <div class="weex-footer">
        <div v-if="getSlots().findIndex(key=>key=='footer')==-1" class="weex-btns">
          <text @click="onCancel" class="btn-cancel">取消</text>
          <text @click="onOk" class="btn-sure">确定</text>
        </div>
        <slot v-else name="footer"></slot>
      </div>
    </div>
  </div>
</template>
<script>
import docuemnt from "@/utils/document";
const modal = weex.requireModule("modal");
export default {
  props: {
    title: String,
    visible: Boolean,
    width: {
      type: Number,
      default() {
        return 600;
      }
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.$emit("open");
        document.body.appendChild(this.$el);
      } else {
        this.$emit("close");
      }
    }
  },
  mounted() {
    document.body.appendChild(this.$el);
    if (this.visible) {
      this.$emit("open");
    }
  },
  methods: {
    stop(event) {
      event.stopPropagation();
      this.$emit("update:visible", false);
    },
    getSlots() {
      let k1 = Object.keys(this.$slots);
      let k2 = Object.keys(this.$scopedSlots);
      let slotKeys = k1.concat(k2);
      return slotKeys;
    },
    onCancel() {
      this.$emit("dialog-cancel");
    },
    onOk() {
      this.$emit("dialog-ok");
    }
  }
};
</script>
<style src="@/css/common.css"></style>

</style>
<style scoped>
.filter {
  background-color: rgba(0, 0, 0, 0.4);
  position: fixed;
  left: 0px;
  top: 0px;
  right: 0px;
  bottom: 0px;
  align-items: center;
  justify-content: center;
}
.weex-modal {
  background-color: #353c6c;
}
.weex-body{
  padding:10px;
}
.weex-header {
  flex-direction: row;
  justify-content: space-between;
  padding: 0px 10px;
  align-items: center;
  background-color: #404774;
  color: #ffffff;
  font-size: 14px;
}
.weex-head-title {
  font-size: 14px;
  padding: 13px 0px;
  color: #ffffff;
}
.weex-btns {
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  padding: 8px 10px;
}
.btn-cancel {
  border-color: #dcdfe6;
  border-style: solid;
  border-width: 1px;
  color: #ffffff;
  font-size: 14px;
  text-align: center;
  padding: 8px 12px;
  margin-left: 10px;
  border-radius: 5px;
}
.btn-sure {
  background-color: #5963b5;
  text-align: center;
  font-size: 14px;
  color: #fff;
  padding: 8px 12px;
  margin-left: 10px;
  border-radius: 5px;
}
.weex-footer {
  margin-top: 10px;
}
</style>