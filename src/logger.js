
import {level} from './main.js';

let theString = '';
export class logger {
    constructor() {
        this.echoAmmountTotal = 0;
        this.echoAmmountPerLevel = [0,0,0,0,0,0];
        this.timeSpentPerLevel = [0,0,0,0,0,0];
        this.startTime = 0;
        this.lvl1 = [];
        this.lvl2 = [];
        this.lvl3 = [];
        this.lvl4 = [];
        this.lvl5 = [];
        this.lvl6 = [];

    }
    startTimer() {
        this.startTime = performance.now();
    }

    stopTimer() {
        let currentTime = performance.now();
        let lvl = level.getLevelNumber();
        //record time spent on level in seconds
        if (lvl == 1) {
            this.timeSpentPerLevel[0] += (currentTime - this.startTime) / 1000;
        }
        if (lvl == 2) {
            this.timeSpentPerLevel[1] += (currentTime - this.startTime) / 1000;
        }
        if (lvl == 3) {
            this.timeSpentPerLevel[2] += (currentTime - this.startTime) / 1000;
        }
        if (lvl == 4) {
            this.timeSpentPerLevel[3] += (currentTime - this.startTime) / 1000;
        }
        if (lvl == 5) {
            this.timeSpentPerLevel[4] += (currentTime - this.startTime) / 1000;
        }
        if (lvl == 6) {
            this.timeSpentPerLevel[5] += (currentTime - this.startTime) / 1000;
        }
    }

    echo() {
        let lvl = level.getLevelNumber();
        this.echoAmmountTotal++;
        if (lvl == 1) {
            this.echoAmmountPerLevel[0]++;
        }
        if (lvl == 2) {
            this.echoAmmountPerLevel[1]++;
        }
        if (lvl == 3) {
            this.echoAmmountPerLevel[2]++;
        }
        if (lvl == 4) {
            this.echoAmmountPerLevel[3]++;
        }
        if (lvl == 5) {
            this.echoAmmountPerLevel[4]++;
        }
        if (lvl == 6) {
            this.echoAmmountPerLevel[5]++;
        }

    }

    logLvl1(x, z) {
        this.lvl1.push([x, z]);
    }

    logLvl2(x, z) {
        this.lvl2.push([x, z]);
    }

    logLvl3(x, z) {
        this.lvl3.push([x, z]);
    }

    logLvl4(x, z) {
        this.lvl4.push([x, z]);
    }

    logLvl5(x, z) {
        this.lvl5.push([x, z]);
    }

    logLvl6(x, z) {
        this.lvl6.push([x, z]);
    }

    getTotalTimeSpent() {
        let totalTimeSpent = 0;
        this.timeSpentPerLevel.forEach(time => {
            totalTimeSpent += time;
        });
        return totalTimeSpent;
    }

    copyContent = async () => {
        try {
        await navigator.clipboard.writeText(theString);
        console.log('Content copied to clipboard');
        } catch (err) {
        console.error('Failed to copy: ', err);
        }
    }

    generateLogs() {
        let totalTimeSpent = this.getTotalTimeSpent();

        let lvl1String = JSON.stringify(this.lvl1);
        let lvl2String = JSON.stringify(this.lvl2);
        let lvl3String = JSON.stringify(this.lvl3);
        let lvl4String = JSON.stringify(this.lvl4);
        let lvl5String = JSON.stringify(this.lvl5);
        let lvl6String = JSON.stringify(this.lvl6);
        let echoString = JSON.stringify(this.echoAmmountTotal);
        let echoPerLevelString = JSON.stringify(this.echoAmmountPerLevel);
        let totalTimeSpentString = JSON.stringify(totalTimeSpent);
        let timeSpentPerLevelString = JSON.stringify(this.timeSpentPerLevel);
        theString = lvl1String + '|'
                      + lvl2String + '|' 
                      + lvl3String + '|' 
                      + lvl4String + '|' 
                      + lvl5String + '|' 
                      + lvl6String + '|' 
                      + echoString + ']|'
                      + echoPerLevelString + ']|'
                      + totalTimeSpentString + ']|'
                      + timeSpentPerLevelString;
        this.copyContent();
    }

    getLogs() {
        this.copyContent();
    }

}