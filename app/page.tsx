'use client';
import {InfoEn, InfoKr, WorkerListStore} from "@/app/lib/definitions";
import React, { useState, useRef } from "react";
import * as XLSX from 'xlsx';
import Search from "@/app/ui/main/search";
import {
  parseKeyName,
  parseByName,
  readExel,
  sumNegativeTimes,
  sumPositiveTimesAfterSubtracting2Hours
} from './lib/utils';
import { useWorkerListStore } from "@/app/store/workerListStore/useWorkerListStore";

export default function Home() {
  const [isSelectedFile, setIsSelectedFile] = useState<boolean>(false);
  const inputElementRef = useRef<HTMLInputElement | null>(null);
  const setWorkerList = useWorkerListStore((state: WorkerListStore) => state.setWorkerList);

  const onClickInputElement = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files as FileList;

    const file = Array.from(files)[0];
    const jsonData = await readExel(file) as InfoKr[];
    const resultOfParseKeyName = parseKeyName(jsonData);
    console.log('resultOfParseKeyName :', resultOfParseKeyName);
    const resultOfParseByName = parseByName(resultOfParseKeyName);
    console.log('resultOfParseByName :', resultOfParseByName);
    let tempWorkerList = [];
    for (const userName in resultOfParseByName) {
      const workRecordArray = resultOfParseByName[userName];
      const notNullWorkRecordArray = workRecordArray.filter((workRecord: InfoEn) => workRecord.overTime).map((workRecord: InfoEn) => workRecord.overTime);
      const totalUnderWorkTime = sumNegativeTimes(notNullWorkRecordArray);
      const totalOverTime = sumPositiveTimesAfterSubtracting2Hours(notNullWorkRecordArray);
      console.log(userName, 'totalUnderWorkTime :', totalUnderWorkTime, 'totalOverTime: ', totalOverTime);
      tempWorkerList.push({userName, totalUnderWorkTime, totalOverTime, workRecord: workRecordArray});

    }
    setWorkerList(tempWorkerList);
    setIsSelectedFile(true);
  }

  const onChangeDropBox = () => {
        inputElementRef.current && inputElementRef.current?.click();

  }
  return (
      <main className={'md:container mx-auto h-screen flex flex-col justify-center items-center'}>
        {/*<button onClick={() => setIsSelectedFile(!isSelectedFile)}>Button</button>*/}
        <input ref={inputElementRef} className={'hidden'} type='file' onChange={onClickInputElement}/>
        <section className={'flex justify-center items-center w-1/2 h-1/4 bg-indigo-600 cursor-cell'} onClick={onChangeDropBox}>DropBox</section>
        {isSelectedFile && <Search />}
      </main>
  )
}
