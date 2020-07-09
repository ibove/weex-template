<template>
  <div class="bg">
    <div class="header">
      <div class="header-left">
        <text class="header-logo">万利达</text>
      </div>
      <div>
        <text @click="back" class="btn">返回</text>
      </div>
    </div>
    <div style="padding:5px;">
      <weex-table
        ref="table"
        :option="tableOption"
        :data="tableData"
        :width="1014"
        :page="page"
        :row-style="rowStyle"
        @row-click="rowClick"
      >
        <template slot="menu" slot-scope="scope">
          <div @click="click(scope,$event)">
            <text style="font-size:12px;">测试按钮</text>
          </div>
        </template>
        <template slot="productTotal" slot-scope="scope">
          <text style="font-size:12px;">产品：{{scope.row.productTotal}}</text>
        </template>
      </weex-table>
    </div>
  </div>
</template>
<script>
import { tableOption } from "./tableOpt";
const modal = weex.requireModule("modal");
export default {
  data() {
    return {
      tableOption,
      page: {
        total: 76,
        currentPage: 1,
        pageSize: 10
      },
      tableData: [
        {
          id: 1,
          name: "cj001",
          time: "2019-10-22",
          productTotal: 100,
          count: 95,
          badCount: 5,
          status: "10",
          createTime: "2019-10-22"
        },
        {
          id: 2,
          name: "cj002",
          time: "2019-10-23",
          productTotal: 100,
          count: 95,
          badCount: 5,
          status: "10",
          createTime: "2019-10-23"
        },
        {
          id: 3,
          name: "cj003",
          time: "2019-10-24",
          productTotal: 100,
          count: 95,
          badCount: 5,
          status: "10",
          createTime: "2019-10-24"
        }
      ]
    };
  },
  mounted() {
    setTimeout(() => {
      this.$refs.table.toggleSelection([
        {
          id: 1,
          name: "cj001",
          time: "2019-10-22",
          productTotal: 100,
          count: 95,
          badCount: 5,
          status: "10",
          createTime: "2019-10-22"
        }
      ]);
    }, 3000);
  },
  methods: {
    click(scope, event) {
      console.log(scope, event);
    },
    back() {
      this.$router.back();
    },
    rowStyle(row, index) {
      if (index == 1) {
        return {
          backgroundColor: "red"
        };
      }
    },
    rowClick(row, index, event) {
      modal.toast({
        message: index
      });
    },
    imgPath(imgName) {
      const platform = weex.config.env.platform;
      let imgPath = "";
      if (platform === "Web") {
        imgPath = `/src/assets/images/${imgName}`;
      } else if (platform === "android") {
        imgName = imgName.substr(0, imgName.lastIndexOf("."));
        imgPath = `local:///ic_action_scan`;
      } else {
        imgPath = `/src/assets/images/${imgName}`;
      }
      return imgPath;
    }
  }
};
</script>

<style scoped>
.rowHeight {
  height: 50px;
}
.bg {
  background-color: #242a52;
  flex: 1;
}
.header {
  flex-direction: row;
  background-color: #2c345c;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;
  height: 68px;
}

.header-logo {
  font-size: 30px;
  font-weight: bold;
  color: #fff;
}
.btn {
  font-size: 18px;
  color: #fff;
  border-style: solid;
  border-width: 1px;
  border-color: #fff;
  border-radius: 4px;
  padding: 5px 10px;
}
</style>