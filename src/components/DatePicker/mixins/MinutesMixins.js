import { formatDate } from "../utils/dateUtil";
export default {
    data() {
        return {
            minuteInfo: {
                startY: 0,
                startTop: 0,
                distanceY: 0,
                minute: 0
            }
        }
    },
    methods: {
        panMinuteStart(event) {
            event.stopPropagation();
            if (this.scrollType != '') {
                return;
            }
            this.minuteInfo.startY = event.changedTouches[0].pageY;
            this.scrollType = "minute"
        },
        panMinuteMove(event) {
            event.stopPropagation();
            if (this.scrollType != "minute") {
                return;
            }
            let distanceY = event.changedTouches[0].pageY - this.minuteInfo.startY;

            distanceY = this.minuteInfo.startTop + distanceY;
            if (distanceY > 0) {
                distanceY = 0;
            }
            if (distanceY < -(2000 - 112)) {
                distanceY = -(2000 - 112);
            }
            this.minuteInfo.distanceY = distanceY;
        },
        panMinuteEnd(event) {
            event.stopPropagation();
            if (this.scrollType != "minute") {
                return;
            }

            this.scrollType = "";
            let distanceY = Math.abs(this.minuteInfo.distanceY);
            let index = Math.round(distanceY / 32);
            distanceY = -32 * index;
            this.minuteInfo.distanceY = distanceY;
            this.minuteInfo.startTop = distanceY;
            this.minuteInfo.minute = index;
            let date = new Date(this.date);        
            date.setMinutes(index);          
            this.$emit("input", formatDate(date, this.dateType));


        },
        clickMinute(minute) {
            let date = new Date(this.date);
            this.minuteInfo.minute = minute;
            date.setMinutes(minute);
            this.$emit("input", formatDate(date, this.dateType));
        }
    },
}