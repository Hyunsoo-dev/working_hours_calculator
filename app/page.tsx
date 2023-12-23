'use client';
import{ InfoKr } from "@/app/lib/definitions";
import React, { useState } from "react";
import * as XLSX from 'xlsx';
import {
  parseKeyName,
  parseByName,
  readExel,
  sumNegativeTimes,
  sumPositiveTimesAfterSubtracting2Hours
} from './lib/utils';


export default function Home() {
  const onChangeInputElement = async (event: React.ChangeEvent<HTMLInputElement>) => {

    const file = [...event.target.files][0];
    const jsonData = await readExel(file) as InfoKr[];
    const resultOfParseKeyName = parseKeyName(jsonData);
    const resultOfParseByName = parseByName(resultOfParseKeyName);

    for (const userName in resultOfParseByName) {
      const workRecordArray = resultOfParseByName[userName];
      const notNullWorkRecordArray = workRecordArray.filter(workRecord => workRecord.overTime).map(workRecord => workRecord.overTime);
      const totalUnderWorkTime = sumNegativeTimes(notNullWorkRecordArray);
      const totalOverTime = sumPositiveTimesAfterSubtracting2Hours(notNullWorkRecordArray);


      console.log(userName, 'totalUnderWorkTime :', totalUnderWorkTime, 'totalOverTime: ', totalOverTime);


    }
  }

  return (
    <h1><input type='file' onChange={onChangeInputElement}/></h1>
  )
}
