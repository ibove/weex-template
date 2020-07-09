import { formatDate } from "../utils/dateUtil";
export default {
    data() {
        return {
            hourInfo: {
                startY: 0,
                startTop: 0,
                distanceY: 0,
                hour: 0
            }
        }
    },
    methods: {
        panHourStart(event) {
            event.stopPropagation();
            if (this.scrollType != '') {
                return;
            }
            this.hourInfo.startY = event.changedTouches[0].pageY;
            this.scrollType = "hour";
        },
        panHourMove(event) {
            event.stopPropagation();
            if (this.scrollType != "hour") {
                return;
            }          
            let distanceY = event.changedTouches[0].pageY - this.hourInfo.startY;

            distanceY = this.hourInfo.startTop + distanceY;
            if (distanceY > 0) {
                distanceY = 0;
            }
            if (distanceY < -(848 - 112)) {
                distanceY = -(848 - 112);
            }
            this.hourInfo.distanceY = distanceY;
        },
        panHourEnd(event) {           
            event.stopPropagation();
            if (this.scrollType != "hour") {
                return;
            }
            this.scrollType = "";
            let distanceY = Math.abs(this.hourInfo.distanceY);
            let index = Math.round(distanceY / 32);
            distanceY = -32 * index;          
            this.hourInfo.distanceY = distanceY;
            this.hourInfo.startTop = distanceY;
            this.hourInfo.hour = index;
            let date = new Date(this.date);
            date.setHours(index);
            this.$emit("input", formatDate(date, this.dateType));

        },
        clickHour(hour) {
            let date = new Date(this.date);
            this.hourInfo.hour = hour;
            date.setHours(hour);
            this.$emit("input", formatDate(date, this.dateType));
        }
    },
}