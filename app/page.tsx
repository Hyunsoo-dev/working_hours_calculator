"use client";
import { InfoEn, InfoKr, WorkerListStore } from "@/app/lib/definitions";
import React, { useState, useRef } from "react";
import * as XLSX from "xlsx";
import Search from "@/app/ui/main/search";
import {
  parseKeyName,
  parseByName,
  readExel,
  sumNegativeTimes,
  sumPositiveTimesAfterSubtracting2Hours,
  convertToSeconds,
  convertSecondsToTime,
  calculateVacation,
  adjustLeaveTime,
} from "./lib/utils";
import { useWorkerListStore } from "@/app/store/workerListStore/useWorkerListStore";
import { log } from "console";

export default function Home() {
  const [isSelectedFile, setIsSelectedFile] = useState<boolean>(false);
  const inputElementRef = useRef<HTMLInputElement | null>(null);
  const setWorkerList = useWorkerListStore(
    (state: WorkerListStore) => state.setWorkerList
  );

  const onClickInputElement = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    console.log("onClickInputElement");
    const files = event.target.files as FileList;

    const file = Array.from(files)[0];
    const jsonData = (await readExel(file)) as InfoKr[];
    const resultOfParseKeyName = parseKeyName(jsonData);
    // console.log('resultOfParseKeyName :', resultOfParseKeyName);
    const resultOfParseByName = parseByName(resultOfParseKeyName);
    // console.log("resultOfParseByName :", resultOfParseByName);
    let tempWorkerList = [];
    for (const userName in resultOfParseByName) {
      const workRecordArray = resultOfParseByName[userName];
      const workingDay = workRecordArray
        .filter(
          (workRecord: InfoEn) =>
            workRecord.state === "출근" || workRecord.state === "지각"
        )
        .filter(
          (workRecord: InfoEn) => workRecord.leaveTime && workRecord.workingTime
        );

      const countOfWorkingDay: number = workingDay.length;
      const adjustedWorkingDay = workingDay.map((work: InfoEn) => {
        return {
          ...work,
          leaveTime: adjustLeaveTime(work.leaveTime),
        };
      });

      const totalWoringSeconds = adjustedWorkingDay
        .map(
          (work: InfoEn) =>
            convertToSeconds(work.leaveTime) -
            convertToSeconds(work.workingTime)
        )
        .reduce((acc: number, cur: number) => acc + cur, 0);
      const averageWorkingSeconds = Math.floor(
        totalWoringSeconds / countOfWorkingDay
      );
      const averageWorkingTime = averageWorkingSeconds
        ? convertSecondsToTime(averageWorkingSeconds)
        : "--";

      const notNullWorkRecordArray = workRecordArray
          .filter((workRecord: InfoEn) => workRecord.state !== '공휴일')
        .filter((workRecord: InfoEn) => workRecord.overTime)
        .map((workRecord: InfoEn) => workRecord.overTime);

      const totalUnderWorkTime = sumNegativeTimes(notNullWorkRecordArray);
      const totalOverTime = sumPositiveTimesAfterSubtracting2Hours(
        notNullWorkRecordArray
      );
      const secondsOfUnderWorkTime = convertToSeconds(totalUnderWorkTime);
      const secondsOfOverTime = convertToSeconds(totalOverTime);
      const secondsOfTotalTime = secondsOfOverTime - secondsOfUnderWorkTime;
      const totalTime = convertSecondsToTime(secondsOfTotalTime);
      const vacation = calculateVacation(secondsOfTotalTime);
      tempWorkerList.push({
        userName,
        totalUnderWorkTime,
        totalOverTime,
        totalTime,
        vacation,
        averageWorkingTime,
        workRecord: workRecordArray,
      });
    }
    setWorkerList(tempWorkerList);
    setIsSelectedFile(true);
  };

  const onChangeDropBox = () => {
    inputElementRef.current && inputElementRef.current?.click();
  };
  return (
    <main
      className={
        "md:container xl:mx-auto mx-2 h-screen flex flex-col justify-center items-center"
      }
    >
      {/*<button onClick={() => setIsSelectedFile(!isSelectedFile)}>Button</button>*/}
      <input
        ref={inputElementRef}
        className={"hidden"}
        type="file"
        onChange={onClickInputElement}
      />
      <section
        className={
          "flex justify-center items-center xl:w-1/2 w-full h-1/4 bg-indigo-600 cursor-cell hover:bg-indigo-500"
        }
        onClick={onChangeDropBox}
      >
        DropBox
      </section>
      {isSelectedFile && <Search />}
    </main>
  );
}
