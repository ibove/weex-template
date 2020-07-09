import deepClone from "../utils/deepClone";
export default {
    data() {
        return {
            allCheck: false,
            indeterminate: false,
            checkeds: {},
            list: []
        }
    },
    watch: {
        list: {
            handler(val) {
                let checkeds = deepClone(this.checkeds);
                let rowKey = this.rowKey;
                if (val && val.length) {
                    val.forEach(item => {
                        checkeds[item[rowKey]] = true;
                    });
                }

                Object.keys(checkeds).forEach(key => {
                    if (val.findIndex(v => v[rowKey] == key) >= 0) {
                        checkeds[key] = true;
                    } else {
                        checkeds[key] = false;
                    }
                });

                this.$set(this, "checkeds", checkeds);
            },
            deep: true
        }
    },
    methods: {
        toggleSelection(rows) {
            // 对外开放的多选方法
            let list = deepClone(this.list);
            let rowKey = this.rowKey;
            if (rows && rows.length) {
                rows.forEach(row => {
                    let currData = this.data.find(d => d[rowKey] == row[rowKey]);
                    if (currData) {
                        let index = list.findIndex(item => item[rowKey] == row[rowKey]);
                        if (index >= 0) {
                            list.splice(index, 1);
                        } else {
                            list.push(deepClone(currData));
                        }
                        this.$set(this, "list", list);
                    }
                });
            } else {
                this.$set(this, "list", []);
            }

            let list2 = list.filter(
                item => this.data.findIndex(d => d[rowKey] == item[rowKey]) >= 0
            );
            let allCheck = list2.length && this.data.length && list2.length == this.data.length;
            this.allCheck = allCheck;
            this.indeterminate = !allCheck && list2.length;
            
            this.$emit("selection-change", list);
        },
        selectRow(row) {
            let list = deepClone(this.list);
            let rowKey = this.rowKey;
            let checked = !this.checkeds[row[rowKey]];
            if (checked) {
                list.push(deepClone(row));
            } else {
                list = list.filter(item => item[rowKey] != row[rowKey]);
            }

            let list2 = list.filter(
                item => this.data.findIndex(d => d[rowKey] == item[rowKey]) >= 0
            );
            let allCheck = list2.length && this.data.length && list2.length == this.data.length;
            this.allCheck = allCheck;
            this.indeterminate = !allCheck && list2.length;
            this.$set(this, "list", list);
            this.$emit("selection-change", list);
        },
        changeAllCheck() {
            let allCheck = !this.allCheck;
            this.allCheck = allCheck;

            let list = [];
            if (allCheck) {
                list = deepClone(this.data);
            }

            this.$set(this, "list", list);
            this.indeterminate = false;
            this.$emit("selection-change", list);

        }
    }
}