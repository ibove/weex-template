<template>
  <div ref="node">
    <weex-dialog :visible.sync="visible" title="弹窗" @dialog-ok="toast"></weex-dialog>
    <weex-date-picker
      class="date-2"
      v-model="date"
      type="time"
      @change-date="changeDate"
      :picker-options="pickerOption"
    ></weex-date-picker>
    <div>
      <checkbox v-model="checked">复选框</checkbox>
    </div>
    <div>
      <div>复选按钮组&times;</div>
      <div>
        <checkbox-group class="check-group" v-model="checkList">
          <checkbox label="A">复选A</checkbox>
          <checkbox label="B">复选B</checkbox>
          <checkbox label="C">复选C</checkbox>
        </checkbox-group>
      </div>
    </div>
    <div class="btn" @click="pick">
      <text class="text">picker</text>
    </div>
    <div class="btn" @click="table">
      <text class="text">列表</text>
    </div>
    <div class="btn" @click="scan">
      <text class="text">二维码</text>
    </div>

    <div class="list">
      <div class="group center">
        <div class="panel">
          <text class="text">{{state}}</text>
        </div>
      </div>
      <div class="group">
        <div class="panel">
          <text class="text" @click="setItem">set</text>
        </div>
        <div class="panel">
          <text class="text" @click="getItem">get</text>
        </div>
        <div class="panel">
          <text class="text" @click="removeItem">弹窗</text>
        </div>
        <div class="panel">
          <text class="text" @click="getAll">选中复选B</text>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// const scan = weex.requireModule("zfjg-scan");
// import Checkbox from "@/components/Checkbox/Checkbox";
// import CheckboxGroup from "@/components/Checkbox/CheckboxGroup";
import { setStore, getStore, removeStore, getAllKey } from "@/utils/store";
import { loginByUsername } from "@/api/login";
const modal = weex.requireModule("modal");
const domModule = weex.requireModule("dom");

export default {
  // components: { Checkbox, CheckboxGroup },
  data() {
    return {
      date: "",
      checked: true,
      checkList: ["A"],
      visible: false,
      keys: "[]",
      length: 0,
      state: "----",
      pickerOption: {
        //#F5F7FA
      }
    };
  },
  watch: {
    date(val) {
     // console.log(val);
    },
    checked(val) {
      console.log(val);
      this.state = "单个复选：" + val;
    },
    checkList: {
      handler(val) {
        this.state = "选中:" + JSON.stringify(val);
        console.log(val, val.length);
      },
      deep: true
    }
  },
  mounted() {
    //console.log(typeof new Date());
  },
  methods: {
    changeDate(time) {
      console.log(time);
    },
    pick() {
      const picker = weex.requireModule("picker");
      picker.pick(
        {
          items: ["Apple", "Banana", "Orange"],
          height: "500px"
        },
        event => {
          console.log(event);
        }
      );
    },
    scan() {
      try {
        const scan = weex.requireModule("zfjg-scan");
        scan.scanCode(res => {
          this.state = res.data;
        });
      } catch (err) {
        modal.toast({
          message: JSON.stringify(err)
        });
      }
    },
    table() {
      this.$router.push({
        path: "/table"
      });
    },
    show() {
      this.visible = true;
    },
    toast() {
      modal.toast({
        message: "test",
        duration: 0.3
      });
    },
    setItem() {
      setStore({
        name: "name",
        content: "test"
      });
      this.state = "set success";
    },
    async getItem() {
      let v = await getStore({
        name: "name"
      });

      this.state = "value: " + v;
    },
    removeItem() {
      this.visible = true;
      // loginByUsername('pos_test','+Flq/bUbEYWdkCPlFirBLA==').then((res)=>{
      //   console.log(res)
      // })
    },
    async getAll() {
      let checkList = [...this.checkList];
      checkList.push("B");
      this.checkList = checkList;
    }
  }
};
</script>
<style  scoped>
.check-group {
  flex-direction: row;
}
.test {
  background-color: #41b883;
  width: 500px;
  height: 100px;
}
.btn {
  text-align: center;
  margin: 20px auto;
  width: 200px;
  padding: 20px 0px;
  border-width: 2px;
  border-style: solid;
  border-color: rgb(162, 217, 192);
  background-color: rgba(162, 217, 192, 0.2);
}
.btn .text {
  font-size: 15px;
}
.p {
  position: absolute;
  top: 100px;
}
.panel {
  height: 100px;
  flex-direction: column;
  justify-content: center;
  border-width: 2px;
  border-style: solid;
  border-color: rgb(162, 217, 192);
  background-color: rgba(162, 217, 192, 0.2);
}
.group {
  flex-direction: row;
  justify-content: space-between;
  width: 650px;
  margin-left: 50px;
  margin-top: 50px;
  margin-bottom: 50px;
}
.center {
  justify-content: center;
}
.text {
  font-size: 50px;
  text-align: center;
  padding-left: 25px;
  padding-right: 25px;
  color: #41b883;
}
.small {
  font-size: 32px;
  padding-left: 35px;
  padding-right: 35px;
  color: #41b883;
}
.date-2 {
  width: 200px;
  height: 40px;
  margin: 0 auto;
}
</style>
