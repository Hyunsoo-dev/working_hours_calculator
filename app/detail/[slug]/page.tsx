'use client';
import { useState, useEffect } from 'react';
import { useWorkerListStore } from "@/app/store/workerListStore/useWorkerListStore";
import { WorkerList, WorkerListStore, InfoEn } from "@/app/lib/definitions";
import{ getPositiveTimesAfterSubtracting2Hours, convertToSeconds } from "../../lib/utils";

const Page = ({ params }: { params: { slug: string }}) => {
    console.log('params:', decodeURIComponent(params.slug));
    const [workInfo, setWorkInfo] = useState<WorkerList>({
        userName: '',
        totalOverTime: '',
        totalUnderWorkTime: '',
        totalTime: '',
        vacation: '',
        workRecord: []
    });
    const getWorkerList = useWorkerListStore((state:WorkerListStore) => state.getWorkerList);

    useEffect(() => {

        const userName = decodeURIComponent(params.slug)
        const tempWorkerList = getWorkerList(userName) as WorkerList[];
        const workInfo = tempWorkerList[0];
        // setWorkRecord(...workInfo);
        setWorkInfo(workInfo);
    }, [params.slug, getWorkerList])

    return (
        <main className={'md:container xl:mx-auto mx-2 h-full flex flex-col justify-center items-center py-10'}>
            <div className={'h-12 w-full xl:text-xl text-sm flex gap-5'}>
                <div>{workInfo.userName}</div>
                <div>차감 근무: {workInfo.totalUnderWorkTime}</div>
                <div>초과 근무: {workInfo.totalOverTime}</div>
            </div>
            <div className={'h-12 w-full xl:text-xl text-sm flex gap-5'}>
                <div>실 초과 근무 합계: {workInfo.totalTime}</div>
                <div>{workInfo.vacation}</div>
            </div>
            <table className="w-full table-auto border border-indigo-600 xl:text-xl text-sm">
                <thead>
                <tr className={'bg-indigo-600 h-12'}>
                    <th className={'hidden xl:table-cell'}>부서</th>
                    <th>성함</th>
                    <th className={'hidden xl:table-cell'}>근무 일자</th>
                    <th>출근 시간</th>
                    <th>퇴근 시간</th>
                    <th>초과 근무</th>
                    <th>휴가 대상</th>
                </tr>
                </thead>
                <tbody>
                {workInfo.workRecord.map((record:InfoEn, idx) => {
                    return (
                        <tr key={idx} className={'border border-indigo-500 h-8 hover:bg-indigo-500 cursor-pointer'}>
                            <td className="text-center align-middle hidden xl:table-cell">{record.department ? record.department : '--'}</td>
                            <td className="text-center align-middle">{record.name ? record.name : '--'}</td>
                            <td className="text-center align-middle hidden xl:table-cell">{record.date ? record.date : '--'}</td>
                            <td className="text-center align-middle">{record.workingTime ? record.workingTime : '--'}</td>
                            <td className="text-center align-middle">{record.leaveTime ? record.leaveTime : '--'}</td>
                            <td className="text-center align-middle">{record.overTime ? record.overTime : '--'}</td>
                            <td className="text-center align-middle">{record.overTime ? getPositiveTimesAfterSubtracting2Hours(record.overTime) : '--'}</td>
                        </tr>
                    )
                })}

                </tbody>
            </table>

            <div className={'h-12 w-full xl:text-xl text-sm flex items-center gap-5 mt-5'}>
                <div>휴가 대상 목록</div>
            </div>
            <table className="w-full table-auto border border-indigo-600 xl:text-xl text-sm">
                <thead>
                <tr className={'bg-indigo-600 h-12'}>
                    <th className={'hidden xl:table-cell'}>부서</th>
                    <th>성함</th>
                    <th className={'hidden xl:table-cell'}>근무 일자</th>
                    <th>출근 시간</th>
                    <th>퇴근 시간</th>
                    <th>초과 근무</th>
                    <th>휴가 대상</th>
                </tr>
                </thead>
                <tbody>
                {workInfo.workRecord.filter((record:InfoEn) => convertToSeconds(getPositiveTimesAfterSubtracting2Hours(record.overTime)) > 0).map((record:InfoEn, idx) => {
                    return (
                        <tr key={idx} className={'border border-indigo-500 h-8 hover:bg-indigo-500 cursor-pointer'}>
                            <td className="text-center align-middle hidden xl:table-cell">{record.department ? record.department : '--'}</td>
                            <td className="text-center align-middle">{record.name ? record.name : '--'}</td>
                            <td className="text-center align-middle hidden xl:table-cell">{record.date ? record.date : '--'}</td>
                            <td className="text-center align-middle">{record.workingTime ? record.workingTime : '--'}</td>
                            <td className="text-center align-middle">{record.leaveTime ? record.leaveTime : '--'}</td>
                            <td className="text-center align-middle">{record.overTime ? record.overTime : '--'}</td>
                            <td className="text-center align-middle">{record.overTime ? getPositiveTimesAfterSubtracting2Hours(record.overTime) : '--'}</td>
                        </tr>
                    )
                })}

                </tbody>
            </table>
        </main>
    )
}

export default Page;