import { formatDate } from "../utils/dateUtil";
export default {
    data() {
        return {
            secondInfo: {
                startY: 0,
                startTop: 0,
                distanceY: 0,
                second: 0
            }
        }
    },
    methods: {
        panSecondStart(event) {
            event.stopPropagation();
            if (this.scrollType != '') {
                return;
            }
            this.secondInfo.startY = event.changedTouches[0].pageY;
            this.scrollType = "second";
        },
        panSecondMove(event) {
            event.stopPropagation();
            if (this.scrollType != "second") {
                return;
            }
            let distanceY = event.changedTouches[0].pageY - this.secondInfo.startY;

            distanceY = this.secondInfo.startTop + distanceY;
            if (distanceY > 0) {
                distanceY = 0;
            }
            if (distanceY < -(2000 - 112)) {
                distanceY = -(2000 - 112);
            }
            this.secondInfo.distanceY = distanceY;
        },
        panSecondEnd(event) {
            event.stopPropagation();
            if (this.scrollType != "second") {
                return;
            }


            this.scrollType = "";
            let distanceY = Math.abs(this.secondInfo.distanceY);
            let index = Math.round(distanceY / 32);
            distanceY = -32 * index;
            this.secondInfo.distanceY = distanceY;
            this.secondInfo.startTop = distanceY;
            this.secondInfo.second = index;
            let date = new Date(this.date);
            date.setSeconds(index);
            this.$emit("input", formatDate(date, this.dateType));


        },
        clickSecond(second) {
            let date = new Date(this.date);
            this.secondInfo.second = second;
            date.setSeconds(second);
            this.$emit("input", formatDate(date, this.dateType));
        }
    },
}