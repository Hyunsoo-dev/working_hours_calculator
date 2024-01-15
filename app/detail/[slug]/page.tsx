"use client";
import { useState, useEffect } from "react";
import { useWorkerListStore } from "@/app/store/workerListStore/useWorkerListStore";
import { WorkerList, WorkerListStore, InfoEn } from "@/app/lib/definitions";
import {
  getPositiveTimesAfterSubtracting2Hours,
  convertToSeconds,
} from "../../lib/utils";
import Button from '../../ui/detail/button';

const Page = ({ params }: { params: { slug: string } }) => {
  console.log("params:", decodeURIComponent(params.slug));
  const [workInfo, setWorkInfo] = useState<WorkerList>({
    userName: "",
    totalOverTime: "",
    totalUnderWorkTime: "",
    totalTime: "",
    vacation: "",
    averageWorkingTime: "",
    workRecord: [],
  });
  const [workRecordLength, setWorkRecordLength] = useState(0);
  const [overWorkRecordLength, setOverWorkRecordLength] = useState(0);
  const [overWorkHolidayRecordLength, setOverWorkHolidayRecordLength] = useState(0);

  const [isOpenWorkRecord, setIsOpenWorkRecord] = useState(true);
  const [isOpenOverWorkRecord, setIsOpenOverWorkRecord] = useState(true);
  const [isOpenOverWorkHolidayRecord, setIsOpenOverWorkHolidayRecord] = useState(true);

  const getWorkerList = useWorkerListStore(
    (state: WorkerListStore) => state.getWorkerList
  );

  useEffect(() => {
    const userName = decodeURIComponent(params.slug);
    const tempWorkerList = getWorkerList(userName) as WorkerList[];
    const workInfo = tempWorkerList[0];

    const tempWorkRecordLength = workInfo.workRecord.length;
    const tmpOverWorkRecordLength = workInfo.workRecord
        .filter((record: InfoEn) => convertToSeconds(getPositiveTimesAfterSubtracting2Hours(record.overTime)) > 0)
        .filter((record) => record.state !== "공휴일").length;
    const tmpOverWorkHolidayRecordLength = workInfo.workRecord
        .filter((record: InfoEn) => convertToSeconds(getPositiveTimesAfterSubtracting2Hours(record.overTime)) > 0)
        .filter((record) => record.state === "공휴일").length;
    setWorkRecordLength(tempWorkRecordLength);
    setOverWorkRecordLength(tmpOverWorkRecordLength);
    setOverWorkHolidayRecordLength(tmpOverWorkHolidayRecordLength);
    // setWorkRecord(...workInfo);
    setWorkInfo(workInfo);
  }, [params.slug, getWorkerList]);
  console.log("workInfo", workInfo.userName, workInfo.workRecord);
  return (
    <main
      className={
        "md:container xl:mx-auto mx-2 h-full flex flex-col justify-center items-center py-10"
      }
    >
      <div
        className={"h-12 w-full xl:text-xl text-sm flex gap-5 justify-center"}
      >
        <div>{workInfo.userName}</div>
        <div>차감 근무: {workInfo.totalUnderWorkTime}</div>
        <div>초과 근무: {workInfo.totalOverTime}</div>
      </div>
      <div
        className={"h-12 w-full xl:text-xl text-sm flex gap-5 justify-center"}
      >
        <div>실 초과 근무 합계: {workInfo.totalTime}</div>
        <div>평균 근무 시간: {workInfo.averageWorkingTime}</div>
      </div>
      <div
        className={"h-12 w-full xl:text-xl text-sm flex gap-5 justify-center"}
      >
        <div>{workInfo.vacation}</div>
      </div>
      <div className={"h-12 w-full xl:text-xl text-sm flex gap-5 mt-5 items-center"}>
        <div className={'flex items-center'}>근무 기록  {workRecordLength} 건 </div>
        <Button isOpen={isOpenWorkRecord} setIsOpen={setIsOpenWorkRecord}/>
      </div>
      <table className={`w-full table-auto border border-indigo-600 xl:text-xl text-sm ${!isOpenWorkRecord && 'hidden'}`}>
        <thead>
          <tr className={"bg-indigo-600 h-12"}>
            <th className={"hidden xl:table-cell"}>No</th>
            <th className={"hidden xl:table-cell"}>부서</th>
            <th>성함</th>
            <th className={"hidden xl:table-cell"}>근무 일자</th>
            <th className={"hidden xl:table-cell"}>상태</th>
            <th>출근 시간</th>
            <th>퇴근 시간</th>
            <th>초과 근무</th>
            <th>휴가 대상</th>
          </tr>
        </thead>
        <tbody>
          {workInfo.workRecord.map((record: InfoEn, idx) => {
            return (
              <tr
                key={idx}
                className={
                  "border border-indigo-500 h-8 hover:bg-indigo-500 cursor-pointer"
                }
              >
                <td className="text-center align-middle hidden xl:table-cell">
                  {idx + 1}
                </td>
                <td className="text-center align-middle hidden xl:table-cell">
                  {record.department ? record.department : "--"}
                </td>
                <td className="text-center align-middle">
                  {record.name ? record.name : "--"}
                </td>
                <td className="text-center align-middle hidden xl:table-cell">
                  {record.date ? record.date : "--"}
                </td>
                <td className="text-center align-middle hidden xl:table-cell">
                  {record.state ? record.state : "--"}
                </td>
                <td className="text-center align-middle">
                  {record.workingTime ? record.workingTime : "--"}
                </td>
                <td className="text-center align-middle">
                  {record.leaveTime ? record.leaveTime : "--"}
                </td>
                <td className="text-center align-middle">
                  {record.overTime ? record.overTime : "--"}
                </td>
                <td className="text-center align-middle">
                  {record.overTime
                    ? getPositiveTimesAfterSubtracting2Hours(record.overTime)
                    : "--"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div
        className={
          "h-12 w-full xl:text-xl text-sm flex items-center gap-5 mt-5"
        }
      >
        <div className={'flex items-center'}>휴가 대상 목록 (공휴일 제외) {overWorkRecordLength}건</div>
        <Button isOpen={isOpenOverWorkRecord} setIsOpen={setIsOpenOverWorkRecord}/>
      </div>
      <table className={`w-full table-auto border border-indigo-600 xl:text-xl text-sm ${!isOpenOverWorkRecord && 'hidden'}`}>
        <thead>
          <tr className={"bg-indigo-600 h-12"}>
            <th className={"hidden xl:table-cell"}>No</th>
            <th className={"hidden xl:table-cell"}>부서</th>
            <th>성함</th>
            <th className={"hidden xl:table-cell"}>근무 일자</th>
            <th className={"hidden xl:table-cell"}>상태</th>
            <th>출근 시간</th>
            <th>퇴근 시간</th>
            <th>초과 근무</th>
            <th>휴가 대상</th>
          </tr>
        </thead>
        <tbody>
          {workInfo.workRecord
            .filter(
              (record: InfoEn) =>
                convertToSeconds(
                  getPositiveTimesAfterSubtracting2Hours(record.overTime)
                ) > 0
            )
            .filter((record) => record.state !== "공휴일")
            .map((record: InfoEn, idx) => {
              return (
                <tr
                  key={idx}
                  className={
                    "border border-indigo-500 h-8 hover:bg-indigo-500 cursor-pointer"
                  }
                >
                  <td className="text-center align-middle hidden xl:table-cell">
                    {idx + 1}
                  </td>
                  <td className="text-center align-middle hidden xl:table-cell">
                    {record.department ? record.department : "--"}
                  </td>
                  <td className="text-center align-middle">
                    {record.name ? record.name : "--"}
                  </td>
                  <td className="text-center align-middle hidden xl:table-cell">
                    {record.date ? record.date : "--"}
                  </td>
                  <td className="text-center align-middle hidden xl:table-cell">
                    {record.state ? record.state : "--"}
                  </td>
                  <td className="text-center align-middle">
                    {record.workingTime ? record.workingTime : "--"}
                  </td>
                  <td className="text-center align-middle">
                    {record.leaveTime ? record.leaveTime : "--"}
                  </td>
                  <td className="text-center align-middle">
                    {record.overTime ? record.overTime : "--"}
                  </td>
                  <td className="text-center align-middle">
                    {record.overTime
                      ? getPositiveTimesAfterSubtracting2Hours(record.overTime)
                      : "--"}
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
      <div
        className={
          "h-12 w-full xl:text-xl text-sm flex items-center gap-5 mt-5"
        }
      >
        <div>휴가 대상 목록 (공휴일) {overWorkHolidayRecordLength} 건</div>
        <Button isOpen={isOpenOverWorkHolidayRecord} setIsOpen={setIsOpenOverWorkHolidayRecord}/>
      </div>
      <table className={`w-full table-auto border border-indigo-600 xl:text-xl text-sm ${!isOpenOverWorkHolidayRecord && 'hidden'}`}>
        <thead>
          <tr className={"bg-indigo-600 h-12"}>
            <th className={"hidden xl:table-cell"}>No</th>
            <th className={"hidden xl:table-cell"}>부서</th>
            <th>성함</th>
            <th className={"hidden xl:table-cell"}>근무 일자</th>
            <th className={"hidden xl:table-cell"}>상태</th>
            <th>출근 시간</th>
            <th>퇴근 시간</th>
            <th>초과 근무</th>
            <th>휴가 대상</th>
          </tr>
        </thead>
        <tbody>
          {workInfo.workRecord
            .filter(
              (record: InfoEn) =>
                convertToSeconds(
                  getPositiveTimesAfterSubtracting2Hours(record.overTime)
                ) > 0
            )
            .filter((record) => record.state === "공휴일")
            .map((record: InfoEn, idx) => {
              return (
                <tr
                  key={idx}
                  className={
                    "border border-indigo-500 h-8 hover:bg-indigo-500 cursor-pointer"
                  }
                >
                  <td className="text-center align-middle hidden xl:table-cell">
                    {idx + 1}
                  </td>
                  <td className="text-center align-middle hidden xl:table-cell">
                    {record.department ? record.department : "--"}
                  </td>
                  <td className="text-center align-middle">
                    {record.name ? record.name : "--"}
                  </td>
                  <td className="text-center align-middle hidden xl:table-cell">
                    {record.date ? record.date : "--"}
                  </td>
                  <td className="text-center align-middle hidden xl:table-cell">
                    {record.state ? record.state : "--"}
                  </td>
                  <td className="text-center align-middle">
                    {record.workingTime ? record.workingTime : "--"}
                  </td>
                  <td className="text-center align-middle">
                    {record.leaveTime ? record.leaveTime : "--"}
                  </td>
                  <td className="text-center align-middle">
                    {record.overTime ? record.overTime : "--"}
                  </td>
                  <td className="text-center align-middle">
                    {record.overTime
                      ? record.overTime
                      : "--"}
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </main>
  );
};

export default Page;
