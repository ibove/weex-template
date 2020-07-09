import deepClone from "../utils/deepClone";
export default {
    data() {
        let pageCount = parseInt(this.page.total / this.page.pageSize, 10);
        if (this.page.total % this.page.pageSize) {
            pageCount += 1;
        }
        return {
            pageCount,
            pagerCount: 7,
            pager: this.page
        }
    },
    computed: {
        reserveSelection() {
            return typeof this.option.reserveSelection === "boolean"
                ? this.option.reserveSelection
                : true;
        }
    },
    watch: {
        page: {
            handler(val) {
                let pageCount = parseInt(val.total / val.pageSize, 10);
                if (val.total % val.pageSize) {
                    pageCount += 1;
                }
                this.$set(this, "pageCount", pageCount);
                this.$set(this, "pager", deepClone(val));
            },
            deep: true
        }
    },
    methods: {
        isShowPrev() {
            let pagerCount = this.pagerCount;
            let half = parseInt(pagerCount / 2, 10) + 1;
            return this.pager.currentPage > half && this.pageCount > this.pagerCount;
        },
        isShowNext() {
            let pagerCount = this.pagerCount;
            let half = parseInt(pagerCount / 2, 10);
            return this.pager.currentPage < this.pageCount - half && this.pageCount > pagerCount;
        },
        getRenderPageCount() {
            let currentPage = this.pager.currentPage;
            let pagerCount = this.pagerCount;
            let half = parseInt(pagerCount / 2, 10) + 1;
            let size = pagerCount - 2;
            let r = [];
            if (currentPage > half) {

                let count = parseInt(size / 2, 10);
                let prev;
                if (currentPage + count >= this.pageCount) {
                    prev = count + 1 + (currentPage + count - this.pageCount);
                } else {
                    prev = count;
                }

                for (let i = prev; i > 0; i--) {
                    r.push(currentPage - i);
                }



                if (currentPage != this.pageCount) {
                    r.push(currentPage);
                }

                for (let i = 1; i <= count; i++) {
                    let pageNumber = currentPage + i;
                    if (pageNumber < this.pageCount) {
                        r.push(currentPage + i);
                    } else {
                        break;
                    }

                }

                return r;

            } else {
                for (let i = 1; i <= size; i++) {
                    let pageNumber = i + 1;
                    if (pageNumber < this.pageCount) {
                        r.push(pageNumber);
                    } else {
                        break;
                    }
                }

            }
            return r;

        },
        currentChange(pageNumber) {
            if (pageNumber == this.pager.currentPage) {
                return;
            }
            if (!this.reserveSelection) {
                this.$set(this, "list", []);
            }

            this.pager.currentPage = pageNumber;
            this.$emit("current-change", pageNumber);
        },
        changePage(count) {
            let pageNumber = this.pager.currentPage + count;
            if (pageNumber < 1) {
                pageNumber = 1;
            } else if (pageNumber > this.pageCount) {
                pageNumber = this.pageCount;
            }

            if (!this.reserveSelection) {
                this.$set(this, "list", []);
            }

            this.pager.currentPage = pageNumber;
            this.$emit("current-change", pageNumber);
        }

    }
}