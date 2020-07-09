<template>
  <div ref="wxTable" class="weex-table" :style="[{width:clientWidth?clientWidth+'px':''}]">
    <div class="wx-th-head" :class="[tableType=='rowMargin'?'wx-row-mb':'']">
      <div
        v-for="(item, index) in columns"
        :key="index"
        class="wx-th-cell wx-cell wx-border-top"
        :style="[{width:item.width+'px'}]"
        :class="[index+1==columns.length&&border?'wx-border-right':'',border?'wx-border':'']"
      >
        <text
          v-if="item.__key==='selection'"
          class="iconfont"
          @click="changeAllCheck"
        >{{allCheck?'\ue651':indeterminate?'\ue650':'\ue63c'}}</text>
        <text
          v-else
          class="wx-th-content"
          :style="[{textAlign: item.align?item.align:option.align}]"
        >{{item.label}}</text>
      </div>
    </div>
    <div v-if="!data.length">
      <div v-if="!(getSlots().findIndex(key=>key=='empty')>=0)" class="wx-empty" @click="refresh">
        <image class="wx-empty-icon" src="data:image/png;base64,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"></image> 
        <text class="wx-empty-text">{{option.emptyText?option.emptyText:'暂无数据，点击刷新'}}</text>
      </div>
      <slot name="empty"></slot>
    </div>

    <div class="wx-t-body" v-else>
      <div
        class="wx-tr"
        v-for="(item, index) in data"
        :key="index"
        :class="[tableType=='rowMargin'?'wx-row-mb':'']"
        :style="[option.rowStyle]"
      >
        <div
          class="wx-cell wx-td"
          v-for="(col, cIndex) in columns"
          @click="cellClick(item,$event,index)"
          :key="cIndex"
          :style="[{width:col.width+'px'},getRowStyle(item,index)]"
          :class="[cIndex+1==columns.length&&border?'wx-border-right':'',
          border?'wx-border':'',tableType=='rowMargin'?'wx-tr-2':'']"
        >
          <div class="avt-cell" v-if="col.__key==='menu'">
            <slot :name="col.prop" :row="item" :index="index"></slot>
          </div>
          <text
            class="iconfont"
            @click="selectRow(item,$event)"
            v-else-if="col.__key==='selection'"
          >{{checkeds[item[rowKey]]?'\ue651':'\ue63c'}}</text>
          <div class="wx-cell-content" v-else-if="col.slot">
            <slot :name="col.prop" :row="item" :index="index" :dicData="dicData[col.prop]"></slot>
          </div>
          <text
            v-else
            class="wx-cell-content"
            :style="[{textAlign: col.align?col.align:option.align}]"
          >{{getColumnValue(item,col,index)}}</text>
        </div>
      </div>
    </div>

    <div v-if="page" class="pagination">
      <text
        @click="changePage(-1,$event)"
        class="iconfont page-btn"
        :class="[pager.currentPage==1?'page-disable':'']"
      >&#xe643;</text>
      <text
        v-if="!pageSmall"
        @click="currentChange(1,$event)"
        class="page-number"
        :class="[pager.currentPage==1?'current':'']"
      >1</text>
      <text v-if="isShowPrev()" class="iconfont page-number">&#xe701;</text>
      <template v-if="!pageSmall">
        <text
          @click="currentChange(index,$event)"
          class="page-number"
          :class="[pager.currentPage==index?'current':'']"
          v-for="index in getRenderPageCount()"
          :key="index"
        >{{index}}</text>
      </template>

      <text v-if="isShowNext()&&!pageSmall" class="iconfont page-number">&#xe701;</text>
      <text
        v-if="!pageSmall"
        @click="currentChange(pageCount,$event)"
        class="page-number"
        :class="[pager.currentPage==pageCount?'current':'']"
      >{{pageCount}}</text>
      <text
        @click="changePage(1,$event)"
        class="iconfont page-btn"
        style="margin-left:8px;"
        :class="[pager.currentPage==pageCount?'page-disable':'']"
      >&#xe642;</text>
    </div>
  </div>
</template>
<script>
import deepClone from "./utils/deepClone";
import ColmunMixins from "./mixins/ColumnMixins";
import CheckboxMixins from "./mixins/CheckboxMixins";
import PagerMixins from "./mixins/PagerMixins";
import { request } from "@/utils/request";
export default {
  mixins: [ColmunMixins, CheckboxMixins, PagerMixins],
  computed: {
    rowKey() {
      return this.option.rowKey;
    },
    border() {
      if (this.option.type === "rowMargin") {
        return false;
      }
      return this.option.border;
    },
    tableType() {
      return this.option.type;
    },
    pageSmall() {
      let small = false;
      if (this.page && this.page.small) {
        small = this.page.small;
      }
      return small;
    }
  },
  data() {
    return {
      originColumn: [],
      columns: [],
      clientWidth: 0,
      fixedWidth: 0,
      fixedRightWidth: 0,
      dicData: {}
    };
  },
  props: {
    rowStyle: Function,
    width: Number,
    page: {
      type: [Object, Boolean],
      default() {
        return false;
      }
    },
    data: {
      type: Array,
      default() {
        return [];
      }
    },
    option: {
      type: Object,
      default() {
        return {
          tip: false,
          size: "small",
          selection: true,
          highlightCurrentRow: true,
          page: false,
          columnBtn: false,
          editBtn: false,
          delBtn: false,
          refreshBtn: false,
          filterBtn: false,
          stripe: true,
          menuAlign: "center",
          align: "left",
          menuWidth: 60,
          column: []
        };
      }
    }
  },
  watch: {
    option: {
      handler(val, oldVal) {
        if (val.column && val.column.length) {
          this.getDicData();
        }
        this.$nextTick(() => {
          this.setColumns(val);
        });
      },
      deep: true
    }
  },
  created() {
    this.getDicData();
  },
  mounted() {
    this.$nextTick(() => {
      this.setColumns(this.option.column);
    });
  },
  methods: {
    cellClick(row, event, index) {
      this.$emit("row-click", row, index, event);
    },
    getRowStyle(row, index) {
      if (typeof this.rowStyle === "function") {
        return this.rowStyle(row, index);
      } else {
        return {};
      }
    },
    refresh() {
      this.$emit("refresh-change", this.page.pageNumber);
    },
    async getDicData() {
      if (!(this.option.column && this.option.column.length)) {
        return;
      }

      this.option.column
        .filter(col => col.dicUrl && typeof col.dicUrl === "string")
        .forEach(async col => {
          await this.fetchDic(col);
        });
    },
    async fetchDic(col) {
      let opt = {
        url: col.dicUrl,
        method: col.dicMethod ? col.dicMethod : "get"
      };
      let filter = objToFilter(col.dicQuery ? col.dicQuery : {});
      if (opt.method.toLower == "get") {
        opt.params = { filter };
      } else {
        opt.data = { filter };
      }
      let res = await request(opt);

      let res2 = res.data;

      if (res2 && res2.data instanceof Array) {
        let dicData = deepClone(this.dicData);
        dicData[col.prop] = deepClone(res2.data);
        await this.$set(this, "dicData", dicData);
      }
    },

    getSlots() {
      let list = [];
      let k1 = Object.keys(this.$slots);
      let k2 = Object.keys(this.$scopedSlots);
      let slotKeys = k1.concat(k2);
      if (slotKeys && slotKeys.length) {
        list = slotKeys.filter(key => {
          let r =
            this.columns.findIndex(
              item => item.slot === true && item.prop == key
            ) >= 0;
          let r2 =
            this.columns.findIndex(
              item => item.overHidden && "over_hidden_" + item.prop == key
            ) >= 0;
          let r3 = key == "expand" && this.option.expand == true;
          let r4 = key == "empty";
          return r || r2 || r3 || r4;
        });
      }

      return list;
    },
    getColumnValue(item, col, index) {
      if (col.__key === "index") {
        let list = this.data.filter(row => !row.avt__expand);
        let rowKey = this.rowKey;
        let rowIndex = list.findIndex(row => row[rowKey] == item[rowKey]);
        rowIndex = this.pageSize * (this.pageNumber - 1) + rowIndex + 1;
        return rowIndex;
      }
      let value = item[col.prop];
      if (typeof col.formatter === "function") {
        let dic;
        if (col.dicData) {
          dic = col.dicData;
        } else if (
          col.dicUrl &&
          this.dicData &&
          col.props &&
          Object.keys(this.dicData).length
        ) {
          dic = this.dicData[col.prop].find(d => d[col.props.value] == value);
        }
        let text = col.formatter(value, deepClone(item), deepClone(col), dic);
        return text;
      }

      if (col.dicData && col.props) {
        let dic = col.dicData.find(d => d[col.props.value] == value);
        if (dic) {
          return dic[col.props.label];
        }
      }
      if (
        col.dicUrl &&
        this.dicData &&
        col.props &&
        Object.keys(this.dicData).length
      ) {
        let dic = this.dicData[col.prop].find(d => d[col.props.value] == value);
        if (dic) {
          return dic[col.props.label];
        }
      }
      return value;
    }
  }
};
</script>
<style scoped>
.iconfont {
  font-family: iconfont5;
  color: #ffffff;
  font-size: 18px;
  text-align: center;
}
.wx-cell {
  padding: 8px 5px;
  box-sizing: border-box;
  justify-content: center;
}
.wx-th-head {
  flex-direction: row;
}
.wx-tr {
  flex-direction: row;
}

.wx-td {
  background-color: #353c6c;
}
.wx-tr-2 {
  padding: 13px 0px;
}
.wx-row-mb {
  margin-bottom: 5px;
}
.wx-th-cell {
  background-color: #3f4883;
  justify-content: center;
  border-style: solid;
  border-color: #4a5391;
  border-bottom-width: 1px;
}
.wx-th-content {
  font-size: 12px;
  color: #ffffff;
}

.wx-border {
  border-style: solid;
  border-color: #4a5391;
  border-left-width: 1px;
  border-bottom-width: 1px;
}
.wx-border-right {
  border-right-width: 1px;
}
.wx-border-top {
  border-top-width: 1px;
}
.wx-empty {
  align-items: center;
  padding: 10px 0;
}
.wx-empty-icon {
  width: 120px;
  height: 88px;
  margin-bottom: 10px;
}
.wx-empty-text {
  color: #fff;
  font-size: 12px;
}
.wx-cell-content {
  color: #ffffff;
  font-size: 12px;
}
.pagination {
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  margin-top: 10px;
}
.page-btn {
  font-size: 14px;
  width: 30px;
  padding: 5px 0;
  height: 28px;
  align-items: center;
  justify-content: center;
  text-align: center;
  border-style: solid;
  border-width: 1px;
  border-color: #ffffff;
  border-radius: 2px;
  color: #ffffff;
  
}
.page-disable {
  opacity: 0.45;
  border-color: #ffffff;
  
}
.page-number {
  font-size: 14px;
  color: #fff;
  width: 30px;
  padding: 5px 0;
  align-items: center;
  justify-content: center;
  text-align: center;
  border-style: solid;
  border-width: 1px;
  border-color: #fff;
  margin-left: 8px;
  border-radius: 2px;
}
.current {
  background-color: #5862aa;
  border-color: #5862aa;
}
</style>