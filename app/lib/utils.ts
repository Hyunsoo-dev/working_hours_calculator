import { InfoKr, InfoEn } from "@/app/lib/definitions";
import * as XLSX from 'xlsx';


const KEY_NAME = {
    'IP': 'ip',
    'No': 'no',
    '날짜': 'date',
    '메모': 'memo',
    '부서': 'department',
    '상태': 'state',
    '이름': 'name',
    '출근시간': 'workingTime',
    '퇴근-출근시간': 'overTime',
    '퇴근시간': 'leaveTime'
}

export const readExel = async (file) => {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const data = e.target.result;
            const workbook = XLSX.read(data, { type: 'binary' });
            // Process workbook here
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);
            resolve(jsonData);
        };
        reader.readAsBinaryString(file);
    })
}

export const parseKeyName = (infos: InfoKr[]) => {
    console.log('infos :', infos);
    let parsedInfo = [] as any;

    infos.map((info: InfoKr, idx: number) => {
        let parsedObj = {}  as any;
        const infoKeys = Object.keys(info);
        infoKeys.map((infoKey: string, idx: number) => {
          if (KEY_NAME[infoKey]) {
              parsedObj[KEY_NAME[infoKey]] = info[infoKey];
          }
          if (!KEY_NAME[infoKey]) {
          }
        })
        parsedInfo.push(parsedObj);
    })

    return parsedInfo;
}

export const parseByName = (infos: InfoEn[]) => {
    let parsedObj = {} as any;
    infos.map((info: InfoEn, idx: number) => {
        const name = info['name'];
        if (parsedObj[name]) {
            parsedObj[name].push(info);
        }
        if (!parsedObj[name]) {
            parsedObj[name] = [];
        }
    })
    return parsedObj;
    // console.log('parsedObj: ', parsedObj);
}

export const getFromOverTimeString = (timeString: string) => {
    if (!timeString) return null;
    const [hours, minutes, seconds] = timeString.split(':').map(Number);

    const currentTime = new Date();
    currentTime.setHours(hours);
    currentTime.setMinutes(minutes);
    currentTime.setSeconds(seconds);

    // console.log(currentTime);
    return currentTime;
}

export const subtractHoursFromOverTimeString = (timeString: string) => {
    const hoursToSubtract = 2;
    // Split the time string into hours, minutes, and seconds
    const [hours, minutes, seconds] = timeString.split(':').map(Number);

    // Create a new Date object with the current date and time
    const currentTime = new Date();

    // Set the hours, minutes, and seconds of the Date object
    currentTime.setHours(hours);
    currentTime.setMinutes(minutes);
    currentTime.setSeconds(seconds);

    // Subtract the specified number of hours
    currentTime.setHours(currentTime.getHours() - hoursToSubtract);

    return currentTime;
}

export const isDateType = (date: any) => {
    return date instanceof Date;
}

export const formatTime = (date: Date) => {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${hours}:${minutes}:${seconds}`;
}

export const sumTimeDurations = (dateArray: Date[]): string => {
    let totalMilliseconds = 0;

    for (const date of dateArray) {
        totalMilliseconds += date.getTime();
    }

    const totalSeconds = Math.floor(totalMilliseconds / 1000);
    const seconds = totalSeconds % 60;
    const totalMinutes = Math.floor(totalSeconds / 60);
    const minutes = totalMinutes % 60;
    const hours = Math.floor(totalMinutes / 60);

    return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export const sumNegativeTimes = (timeArray: string[]): string => {
    let totalHours = 0;
    let totalMinutes = 0;
    let totalSeconds = 0;
    for (const time of timeArray) {
        if (time.startsWith("-")) {
            // console.log('time: ', time);
            // let str = '-00:45:21';
            let [hoursStr, minutesStr, secondsStr] = time.split(":").map((str) => parseInt(str, 10));

            // [-00, 45, 21]
            if (hoursStr === 0 && minutesStr === 0) {
                // -00:00:13
                secondsStr = parseInt(`-${secondsStr}`, 10);
            } else if (hoursStr === 0) {
                // -00:01:00 or -00:01:12
                minutesStr = parseInt(`-${minutesStr}`, 10);
            } else {

            }

            totalHours += hoursStr;
            totalMinutes += minutesStr;
            totalSeconds += secondsStr;
        }
    }
    // Handle carry-over from seconds to minutes and from minutes to hours

    if (totalMinutes < 0) {
        totalHours += Math.ceil(totalMinutes / 60);
        totalMinutes %= 60;
    } else {
        totalHours += Math.floor(totalSeconds / 60);
        totalMinutes %= 60;
    }

    if (totalSeconds < 0) {
        totalMinutes += Math.ceil(totalSeconds / 60);
        totalSeconds %= 60;
    } else {
        totalMinutes += Math.floor(totalSeconds / 60);
        totalSeconds %= 60;
    }

    return `${totalHours < 0 || totalMinutes < 0 || totalSeconds < 0? "-" : ""}${Math.abs(totalHours).toString().padStart(2, '0')}:${Math.abs(totalMinutes).toString().padStart(2, '0')}:${Math.abs(totalSeconds).toString().padStart(2, '0')}`;
}


export const sumPositiveTimesAfterSubtracting2Hours = (timeArray: string[]): string => {
    const positiveTimes = timeArray
        .filter((time) => !time.startsWith("-"))
        .map((time) => {
            const [hoursStr, minutesStr, secondsStr] = time.split(":").map((str) => parseInt(str, 10));
            let totalHours = hoursStr;
            let totalMinutes = minutesStr;
            let totalSeconds = secondsStr;


            let sumOfSeconds = totalHours * 60 * 60 + totalMinutes * 60 + totalSeconds;

            sumOfSeconds = sumOfSeconds - 2 * 60 * 60;
            if (sumOfSeconds <= 0) {
                return {
                    hours: 0,
                    minutes: 0,
                    seconds: 0,
                };
            }
            const hours = Math.floor(sumOfSeconds / 3600);
            const minutes = Math.floor((sumOfSeconds % 3600) / 60);
            const remainingSeconds = sumOfSeconds % 60;



            return {
                hours: hours,
                minutes: minutes,
                seconds: remainingSeconds,
            };
        });

    // Calculate the total hours, minutes, and seconds
    let totalHours = 0;
    let totalMinutes = 0;
    let totalSeconds = 0;
    // console.log('positiveTimes :', positiveTimes);
    for (const time of positiveTimes) {
        totalHours += time.hours;
        totalMinutes += time.minutes;
        totalSeconds += time.seconds;
    }

    // Handle carry-over from seconds to minutes and from minutes to hours
    totalMinutes += Math.floor(totalSeconds / 60);
    totalSeconds %= 60;
    totalHours += Math.floor(totalMinutes / 60);
    totalMinutes %= 60;

    return `${totalHours.toString().padStart(2, '0')}:${totalMinutes.toString().padStart(2, '0')}:${totalSeconds.toString().padStart(2, '0')}`;
}

