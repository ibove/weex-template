import deepClone from "../utils/deepClone";
export default {
  methods: {
    setColumns(columnArray) {
      let column = deepClone(columnArray);

      if (this.option.index) {
        column.unshift({
          __key: "index",
          label: this.option.indexLabel ? this.option.indexLabel : "#",
          fixed:
            typeof this.option.indexFixed === "boolean"
              ? this.option.indexFixed
              : false,
          width: this.option.indexWidth ? this.option.indexWidth : 50
        });
      }

      if (this.option.selection) {
        column.unshift({
          __key: "selection",
          fixed:
            typeof this.option.selectionFixed === "boolean"
              ? this.option.selectionFixed
              : false,
          width: this.option.selectionWidth ? this.option.selectionWidth : 50
        });
      }
      // TODO:先关闭行展开功能
      // if (this.option.expand) {
      //   column.unshift({
      //     __key: "expand",
      //     fixed:
      //       typeof this.option.expandFixed === "boolean"
      //         ? this.option.expandFixed
      //         : true,
      //     width: this.option.expandWidth ? this.option.expandWidth : 50
      //   });
      // }

      if (this.option.menu !== false) {
        // 操作栏
        column.push({
          __key: "menu",
          label: "操作",
          avtMenuCol: true,
          prop: "menu",
          slot: true,
          fixed: this.option.menuFixed === true ? "right" : false,
          width: this.option.menuWidth ? this.option.menuWidth : 80
        });
      }
      column.forEach(item => {
        if (!isNaN(item.width)) {
          item.width = parseInt(item.width, 10);
        }

        if (isNaN(item.width) && isNaN(item.minWidth)) {
          item.computedWidth = true;
          item.width = 80;
        }
      });

      this.$set(this, "originColumn", deepClone(column));
      this.resetColumn(column);
    },
    resetColumn(column) {
      const dom = weex.requireModule("dom");
      dom.getComponentRect(this.$refs.wxTable, result => {
        let clientWidth = this.width ? this.width : result.size.width;
        let cellWidth = 80;
        let width = 0;

        column.forEach(item => {
          if (!isNaN(item.width) && !item.computedWidth) {
            item.width = parseInt(item.width, 10);
            width += item.width;
          }
        });

        let length = column.filter(item => item.computedWidth).length;
        let width2 = length * cellWidth;
        column
          .filter(item => isNaN(item.width) && !isNaN(item.minWidth))
          .forEach(item => {
            width2 += parseInt(item.minWidth, 10);
          });
        if (width2 + width >= clientWidth) {
          clientWidth = width2 + width;
          column.forEach(item => {
            if (isNaN(item.width) && !isNaN(item.minWidth)) {
              item.width = parseInt(item.minWidth, 10);
            }
          });
        } else {
          let width3 = clientWidth - width;
          column.forEach(item => {
            if (item.computedWidth) {
              item.width = parseInt(
                (clientWidth - width) * (cellWidth / width2),
                10
              );
              if (width3 < item.width) {
                item.width = width3;
              }
              width3 = width3 - item.width;
            } else if (isNaN(item.width) && !isNaN(item.minWidth)) {
              item.width = parseInt(
                (clientWidth - width) * (parseInt(item.minWidth) / width2),
                10
              );

              if (width3 < item.width) {
                item.width = width3;
              }
              width3 = width3 - item.width;
            }
          });
          if (width3) {
            let col = column.find(item => item.computedWidth);
            if (col) {
              col.width = col.width + width3;
            }
          }
        
        }




        this.$set(this, "clientWidth", clientWidth);
        this.$set(this, "columns", column);
      });
    }
  }
}