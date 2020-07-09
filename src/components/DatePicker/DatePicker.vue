<template>
  <div class="date-picker">
    <input
      type="text"
      @click="show"
      readonly
      :disabled="disabled"
      class="date-input"
      :value="showDate"
    />
    <div @click="dateClear" class="date-clear">
      <text class="clear-txt">&times;</text>
    </div>
    <div ref="filter" @click="close" v-if="visible" class="filter">
      <div @click="closeTimer" class="picker-content">
        <!-- 日期和时间的输入框 -->
        <div class="date-box" :class="[type=='time'?'date-box1':'date-box2']">
          <input
            v-if="type!='time'"
            type="text"
            readonly
            :disabled="disabled"
            class="date-txt"
            :value="date1"
            placeholder="选择日期"
          />
          <input
            v-if="type!='date'"
            readonly
            :disabled="disabled"
            ref="timer"
            type="text"
            @click="showTimePicker"
            class="date-txt"
            :class="[type!='date'?'ml10':'']"
            :value="date2"
            placeholder="选择时间"
          />
        </div>

        <!-- 日期头部左右方向键和年月展示start -->
        <div v-if="type!='time'" class="date-header">
          <div class="operator-txt">
            <!-- 选年份时候向左箭头 -->
            <div v-if="currentTab=='year'">
              <text class="txt" @click="addYears($event,-1)">&lt;&lt;</text>
            </div>
            <div v-if="currentTab=='yearMonth'||currentTab=='month'">
              <text class="txt" @click="addYear($event,-1)">&lt;&lt;</text>
            </div>
            <div v-if="currentTab=='yearMonth'">
              <text class="txt" @click="addMonth($event,-1)">&lt;</text>
            </div>
          </div>
          <div class="date-header-body">
            <text v-if="currentTab=='year'" class="year-month">{{years[0]}}年-{{years[9]}}年</text>
            <text
              @click="selectYear"
              v-if="currentTab=='yearMonth'||currentTab=='month'"
              class="year-month"
            >{{year}}年</text>
            <text @click="selectMonth" v-if="currentTab=='yearMonth'" class="year-month">{{month}}月</text>
          </div>
          <div class="operator-txt">
            <div v-if="currentTab=='yearMonth'">
              <text class="txt" @click="addMonth($event,1)">&gt;</text>
            </div>
            <div v-if="currentTab=='yearMonth'||currentTab=='month'">
              <text class="txt" @click="addYear($event,1)">&gt;&gt;</text>
            </div>

            <!-- 选年份时候的向右箭头 -->
            <div v-if="currentTab=='year'">
              <text class="txt" @click="addYears($event,1)">&gt;&gt;</text>
            </div>
          </div>
        </div>
        <!-- 日期头部左右方向键和年月展示end -->
        <div v-if="currentTab=='yearMonth'&&type!='time'">
          <div class="days">
            <text class="day" v-for="(item, index) in weekArray" :key="index">{{item}}</text>
          </div>
          <div class="day-list">
            <div
              @click="chkDay($event,item)"
              class="day-item"
              :class="[item.disabled?'disabled-day':'']"
              v-for="(item, index) in dayList"
              :key="index"
            >
              <text
                class="num"
                :class="[index<firstIndex||index>=lastIndex?'num-op':'',isChecked(index)?'day-checked':'']"
              >{{item.value.getDate()}}</text>
            </div>
          </div>
        </div>

        <!-- 月份选择项 -->
        <div v-if="currentTab=='month'">
          <div class="month-list">
            <div
              @click="clickMonth($event,index)"
              class="month-item"
              v-for="(item, index) in monthList"
              :key="index"
            >
              <text class="month-txt">{{item}}</text>
            </div>
          </div>
        </div>

        <!-- 年份选择项 -->
        <div v-if="currentTab=='year'">
          <div class="month-list">
            <div
              @click="clickYear($event,item)"
              class="month-item"
              v-for="(item, index) in years"
              :key="index"
            >
              <text class="month-txt">{{item}}</text>
            </div>
          </div>
        </div>

        <!-- 底部按钮 -->
        <div v-if="currentTab=='yearMonth'&&type!='time'" class="bottom-date">
          <text @click="checkNow" class="now">此刻</text>
          <text @click="onSure" class="date-sure">确定</text>
        </div>
        <div
          :class="[timerVisible||type=='time'?'time-show':'time-hidden',type=='time'?'time-priveat':'time-absolute']"
          class="time-picker"
          @click="event=>event.stopPropagation()"
        >
          <div class="time-bar"></div>
          <div class="time-list">
            <div
              class="time-col"
              @touchstart="panHourStart"
              @touchmove="panHourMove"
              @touchend="panHourEnd"
            >
              <div
                class="time-scroll"
                :style="[{transform:'translateY('+hourInfo.distanceY+'px)'}]"
              >
                <div
                  @click="clickHour(item)"
                  class="time-cell"
                  v-for="(item, index) in hours"
                  :key="index"
                >
                  <text class="time-span">{{item.toString().length==1?'0':''}}{{item}}</text>
                </div>
              </div>
            </div>
            <div
              class="time-col"
              @touchstart="panMinuteStart"
              @touchmove="panMinuteMove"
              @touchend="panMinuteEnd"
            >
              <div
                class="time-scroll"
                :style="[{transform:'translateY('+(minuteInfo.distanceY)+'px)'}]"
              >
                <div
                  @click="clickMinute(item)"
                  class="time-cell"
                  v-for="(item, index) in minutes"
                  :key="index"
                >
                  <text class="time-span">{{item.toString().length==1?'0':''}}{{item}}</text>
                </div>
              </div>
            </div>
            <div
              class="time-col"
              @touchstart="panSecondStart"
              @touchmove="panSecondMove"
              @touchend="panSecondEnd"
            >
              <div
                class="time-scroll"
                :style="[{transform:'translateY('+secondInfo.distanceY+'px)'}]"
              >
                <div
                  @click="clickSecond(item)"
                  class="time-cell"
                  v-for="(item, index) in minutes"
                  :key="index"
                >
                  <text class="time-span">{{item.toString().length==1?'0':''}}{{item}}</text>
                </div>
              </div>
            </div>
          </div>
          <div class="time-bottom">
            <text @click="cancelTime" class="time-can">取消</text>
            <text @click="closeTimer" class="time-sure">确定</text>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { formatDate, isEmpty } from "./utils/dateUtil";
import hourMixins from "./mixins/HourMixins";
import minuteMixins from "./mixins/MinutesMixins";
import secondMixins from "./mixins/SecondMixins";

export default {
  mixins: [hourMixins, minuteMixins, secondMixins],
  props: {
    value: {
      type: [Date, String],
      default() {
        return undefined;
      }
    },
    type: {
      type: String,
      default() {
        return "datetime";
      }
    },
    pickerOptions: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  watch: {
    value(val) {
      let date = this.setDate(val);

      this.date = new Date(date);

      if (!isEmpty(val)) {
        this.showDate = formatDate(new Date(date), this.dateType);
        this.initTimerPicker(new Date(date));
      } else {
        this.showDate = "";
      }

      this.$nextTick(() => {
        this.initDate();
      });
    }
  },

  computed: {
    dateType() {
      if (this.type == "datetime") {
        return "yyyy-MM-dd hh:mm:ss";
      } else if (this.type == "date") {
        return "yyyy-MM-dd";
      } else if (this.type == "time") {
        return "hh:mm:ss";
      }
      return "yyyy-MM-dd hh:mm:ss";
    },
    date1() {
      if (!isEmpty(this.showDate)) {
        return formatDate(
          new Date(this.showDate.replace(/-/g, "/")),
          "yyyy-MM-dd"
        );
      }
      return "";
    },
    date2() {
      if (!isEmpty(this.showDate)) {
        if (this.type == "time") {
          return this.showDate;
        } else {
          return formatDate(
            new Date(this.showDate.replace(/-/g, "/")),
            "hh:mm:ss"
          );
        }
      }
      return "";
    }
  },

  data() {
    // console.log(formatDate(this.value, "yyyy-MM-dd hh:mm:ss"));
    let date = this.setDate(this.value);

    const platform = weex.config.env.platform.toLowerCase();
    let hours = [];
    for (let h = 0; h < 24; h++) {
      hours.push(h);
    }
    let minutes = [];
    for (let m = 0; m < 60; m++) {
      minutes.push(m);
    }

    let monthList = [
      "一月",
      "二月",
      "三月",
      "四月",
      "五月",
      "六月",
      "七月",
      "八月",
      "九月",
      "十月",
      "十一月",
      "十二月"
    ];
    return {
      scrollType: "",
      showDate: "",
      disabled: platform !== "web",
      date,
      originDate: "",
      weekArray: ["日", "一", "二", "三", "四", "五", "六"],
      dayList: [], // 用于展示日期的列表
      visible: false,
      timerVisible: false,
      year: undefined,
      month: undefined,
      years: [],
      day: undefined,
      firstIndex: undefined,
      lastIndex: undefined,
      hours,
      minutes,
      currentTab: "yearMonth",
      monthList
    };
  },
  created() {
    this.initDate();
    let showDate;
    if (!isEmpty(this.value)) {
      let dateStr = this.value;
      if (typeof dateStr === "string") {
        dateStr = dateStr.replace(/-/g, "/");
      }
      if (this.type == "time") {
        showDate = dateStr;
      } else {
        showDate = formatDate(new Date(dateStr), this.dateType);
      }
    } else {
      showDate = "";
    }
    this.initTimerPicker(this.date);
    this.originDate = showDate;
    this.showDate = showDate;
  },
  methods: {
    setDate(value) {
      let date;
      if (isEmpty(value)) {
        date = new Date();
      } else {
        if (typeof value === "string") {
          if (this.type == "time") {
            let times = value.split(":");
            date = new Date();
            date.setHours(parseInt(times[0], 10));
            date.setMinutes(parseInt(times[1], 10));
            date.setSeconds(parseInt(times[2], 10));
          } else {
            date = new Date(value.replace(/-/g, "/"));
          }
        } else {
          date = new Date(value);
        }
      }
      return date;
    },
    initTimerPicker(date) {
      let hour = this.date.getHours();
      let minute = this.date.getMinutes();
      let second = this.date.getSeconds();

      this.hourInfo.distanceY = -hour * 32;
      this.hourInfo.startTop = -hour * 32;
      this.hourInfo.hour = hour;

      this.minuteInfo.distanceY = -minute * 32;
      this.minuteInfo.startTop = -minute * 32;
      this.minuteInfo.minute = minute;

      this.secondInfo.distanceY = -second * 32;
      this.secondInfo.startTop = -second * 32;
      this.secondInfo.second = second;
    },
    isDate(date) {
      return date instanceof Date;
    },
    isChecked(index) {
      if (
        index >= this.firstIndex &&
        index < this.lastIndex &&
        !isEmpty(this.value)
      ) {
        let dateStr = this.value;
        if (typeof dateStr === "string") {
          dateStr = dateStr.replace(/-/g, "/");
        }
        let r =
          formatDate(this.dayList[index].value, "yyyy-MM-dd") ==
          formatDate(new Date(dateStr), "yyyy-MM-dd");

        return r;
      }
      return false;
    },
    initDate() {
      if (this.type == "time") {
        return;
      }
      let date = this.date;

      this.year = formatDate(date, "yyyy");
      this.month = formatDate(date, "M");
      this.day = formatDate(date, "dd");
      this.initDateList(date);
    },
    initDateList(date) {
      var currentMonth = date.getMonth();
      var firstDay = new Date(date.getFullYear(), currentMonth, 1);
      var lastDay = new Date(firstDay.getFullYear(), currentMonth + 1, 0);
      let firstIndex = firstDay.getDay();
      let lastIndex = lastDay.getDay();
      let dayList = [];

      let length1 = 7;
      if (firstIndex > 0) {
        length1 = firstIndex;
      }

      for (let i = length1; i >= 1; i--) {
        let item = new Date(date.getFullYear(), currentMonth, 1);
        item = new Date(item.setDate(item.getDate() - i));
        let disabled = false;
        if (typeof this.pickerOptions.disabledDate === "function") {
          disabled = this.pickerOptions.disabledDate(item);
        }
        dayList.push({ value: item, disabled });
      }

      for (let i = 0; i < lastDay.getDate(); i++) {
        let item = new Date(date.getFullYear(), currentMonth, 1);
        item = new Date(item.setDate(item.getDate() + i));
        let disabled = false;
        if (typeof this.pickerOptions.disabledDate === "function") {
          disabled = this.pickerOptions.disabledDate(item);
        }
        dayList.push({ value: item, disabled });
      }
      let length = 6 * 7 - dayList.length;

      for (let i = 1; i <= length; i++) {
        let item = new Date(firstDay.getFullYear(), currentMonth + 1, 0);
        item = new Date(item.setDate(item.getDate() + i));
        let disabled = false;
        if (typeof this.pickerOptions.disabledDate === "function") {
          disabled = this.pickerOptions.disabledDate(item);
        }
        dayList.push({ value: item, disabled });
      }
      this.firstIndex = length1;
      this.lastIndex = dayList.length - length;
      this.$set(this, "dayList", dayList);
    },
    addMonth(event, month) {
      let date = new Date(this.date);
      date.setMonth(date.getMonth() + month);
      this.date = date;
      this.closeTimer();
      this.$nextTick(() => {
        this.initDate();
      });
    },
    addYear(event, year) {
      let date = new Date(this.date);
      date.setFullYear(date.getFullYear() + year);
      this.date = date;
      this.closeTimer();
      this.$nextTick(() => {
        this.initDate();
      });
    },
    checkNow() {
      let date = new Date();
      this.$emit("change-date", formatDate(date, this.dateType));
      this.$emit("input", formatDate(date, this.dateType));
      this.close();
    },
    chkDay(event, item) {
      event.stopPropagation();
      if (item.disabled) {
        return;
      }
      let date1 = formatDate(item.value, "yyyy-MM-dd");
      let time1 = formatDate(new Date(this.date), "hh:mm:ss");
      let date = new Date((date1 + " " + time1).replace(/-/g, "/"));
      date = formatDate(date, this.dateType);

      this.$emit("input", date);
      this.closeTimer();
    },
    showTimePicker(event) {
      event.stopPropagation();

      if (isEmpty(this.showDate)) {
        let date = new Date();
        this.date = date;

        this.showDate = formatDate(date, this.dateType);
        this.currentTab = "yearMonth";
        this.initTimerPicker(date);
        this.$nextTick(() => {
          this.initDate();
          if (this.type != "time") {
            this.timerVisible = true;
          }
        });
      } else {
        if (this.type != "time") {
          this.timerVisible = true;
        }
      }
    },
    onSure() {
      this.close();
      this.$emit("change-date", this.showDate);
    },
    cancelTime(event) {
      event.stopPropagation();
      if (this.type != "time") {
        this.timerVisible = false;
      } else {
        this.visible = false;
      }

      this.showDate = this.originDate;
      this.$emit("input", this.originDate);
    },

    show(event) {
      event.stopPropagation();
      this.visible = true;
      this.originDate = this.showDate;
      this.$nextTick(() => {
        document.body.appendChild(this.$refs.filter);
      });
    },
    closeTimer(event) {
      if (event) {
        event.stopPropagation();
      }
      this.timerVisible = false;
      if (this.type == "time") {
        if (isEmpty(this.showDate)) {
          let hour = this.hourInfo.hour;
          let minute = this.minuteInfo.minute;
          let second = this.secondInfo.second;
          let date = new Date();
          date.setHours(hour);
          date.setMinutes(minute);
          date.setSeconds(second);
          this.$emit("input", formatDate(date, this.dateType));
          this.$emit("change-date", formatDate(date, this.dateType));
        } else {
          this.$emit("change-date", this.showDate);
        }
        this.visible = false;
      }
    },
    close(event) {
      if (event) {
        event.stopPropagation();
      }
      this.currentTab = "yearMonth";
      this.timerVisible = false;
      this.visible = false;
    },
    dateClear(event) {
      event.stopPropagation();
      this.showDate = "";
      this.date = "";
      this.$emit("input", "");
    },
    selectMonth(event) {
      event.stopPropagation();
      this.currentTab = "month";
    },
    clickMonth(event, index) {
      event.stopPropagation();
      let date = this.date;
      date.setMonth(index);
      date.setDate(1);
      this.initDateList(date);
      this.month = index + 1;
      this.currentTab = "yearMonth";
    },
    selectYear(event) {
      event.stopPropagation();
      this.currentTab = "year";
      let year = parseInt(this.year / 10, 10, 10) * 10;
      let years = [];
      for (let i = 0; i <= 9; i++) {
        years.push(year + i);
      }
      this.$set(this, "years", years);
    },
    clickYear(event, year) {
      event.stopPropagation();
      let date = this.date;
      date.setFullYear(year);
      date.setDate(1);

      this.initDateList(date);
      this.year = year;
      this.currentTab = "month";
    },
    addYears(event, year) {
      event.stopPropagation();

      let years = this.years.map(item => {
        return item + year * 10;
      });
      this.$set(this, "years", years);
    }
  }
};
</script>
<style scoped>
.date-picker {
  border: solid 1px #dedede;
  position: relative;
}
.date-input {
  flex: 1;
  padding: 0 5px;
  box-sizing: border-box;
}

.filter {
  background-color: rgba(0, 0, 0, 0.2);
  align-items: center;
  justify-content: center;
  position: fixed;
  left: 0px;
  top: 0px;
  right: 0px;
  bottom: 0px;
}

.date-box {
  flex-direction: row;
  justify-content: space-between;
}
.date-box1 {
  width: 152px;
}
.date-box2 {
  width: 304px;
}
.date-txt {
  height: 32px;
  font-size: 14px;
  line-height: 32px;
  box-sizing: border-box;
  padding: 0 5px;
  border-style: solid;
  border-width: 1px;
  border-color: #dedede;
  border-radius: 2px;
  flex: 1;
}
.date-width {
  flex: 1;
}
.date-flex {
  flex: 1;
}
.ml10 {
  margin-left: 10px;
}
.picker-content {
  background-color: #ffffff;
  border-radius: 5px;
  padding: 10px;
}
.operator-txt {
  color: #999999;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}
.txt {
  font-size: 14px;
  padding: 5px;
  color: #303133;
}
.date-header {
  flex-direction: row;
  padding: 10px 0px 5px;
}
.date-header-body {
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}
.year-month {
  font-size: 14px;
  padding: 5px;
  color: #606266;
}
.days {
  flex-direction: row;
  border-style: solid;
  border-color: #dedede;
  border-bottom-width: 1px;
  padding: 10px 0;
  width: 310px;
  box-sizing: border-box;
  overflow: hidden;
}
.day {
  font-size: 14px;
  width: 44px;
  text-align: center;
}
.day-list {
  flex-direction: row;
  flex-wrap: wrap;
  width: 310px;
}
.day-item {
  width: 44px;
  height: 32px;
  margin: 5px 0;
  align-items: center;
  justify-content: center;
}
.disabled-day {
  background-color: #f5f7fa;
}
.num {
  width: 32px;
  height: 32px;
  font-size: 14px;
  text-align: center;
  line-height: 32px;
  color: #606266;
}
.day-checked {
  background-color: #409eff;
  border-radius: 32px;
  color: #fff;
}
.num-op {
  color: #dddddd;
}
.bottom-date {
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  border-style: solid;
  border-color: #dedede;
  border-top-width: 1px;
  padding: 10px 0 5px;
}
.now {
  font-size: 12px;
  color: #409eff;
  padding: 6px 11px;
  margin-right: 10px;
}

.time-can {
  font-size: 12px;
  padding: 6px 11px;
  margin-right: 10px;
}
.time-sure {
  font-size: 12px;
  color: #409eff;
  padding: 6px 11px;
}
.date-sure {
  font-size: 12px;
  border-style: solid;
  border-color: #dedede;
  border-width: 1px;
  padding: 6px 11px;
  border-radius: 2px;
}
.time-picker {
  background-color: #fff;
  border-radius: 2px;
  border-style: solid;
  border-width: 1px;
  border-color: #dedede;
  box-sizing: border-box;
  padding: 0 10px;
}
.time-priveat {
  position: relative;
  margin-top: 10px;
  border-width: 0;
}
.time-absolute {
  position: absolute;
  top: 52px;
  right: 10px;
}
.time-bar {
  height: 32px;

  position: absolute;
  top: 80px;
  left: 10px;
  border-style: solid;
  border-color: #dedede;
  border-top-width: 1px;
  border-bottom-width: 1px;
  right: 10px;
}
.time-scroll {
  padding-top: 80px;
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  transition-property: transform;
  transition-duration: 0.4s;
  transition-delay: 0s;
  transition-timing-function: cubic-bezier(0.25, 0.1, 0.25, 1);
}
.time-list {
  position: absolute;
  left: 10px;
  top: 0px;
  right: 10px;
  display: flex;
  flex-direction: row;
  overflow: hidden;
  height: 192px;
}
.time-col {
  flex: 1;
  position: relative;
}
.time-span {
  font-size: 14px;
}
.time-cell {
  height: 32px;
  align-items: center;
  justify-content: center;
}
.time-bottom {
  position: absolute;
  height: 40px;
  bottom: 0px;
  left: 0px;
  right: 0px;
  border-style: solid;
  border-color: #dedede;
  border-top-width: 1px;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
}
.date-clear {
  position: absolute;
  right: 0px;
  top: 0;
  bottom: 0;
  padding: 0 10px 0 5px;
  align-items: center;
  justify-content: center;
}
.clear-txt {
  font-size: 24px;
  color: #999999;
}
.month-list {
  flex-direction: row;
  flex-wrap: wrap;
  width: 310px;
  border-style: solid;
  border-color: #dedede;
  border-top-width: 1px;
  padding-top: 5px;
}
.month-item {
  width: 77px;
  padding: 15px 0;
  align-items: center;
  justify-content: center;
}
.month-txt {
  font-size: 14px;
}
.time-show {
  width: 166px;
  height: 232px;
  background-color: #fff;
}
.time-hidden {
  height: 0px;
  width: 0px;
  overflow: hidden;
  border-width: 0px;
}
</style>