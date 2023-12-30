'use client';
import { useState, useEffect } from 'react';
import { useWorkerListStore } from "@/app/store/workerListStore/useWorkerListStore";
import { WorkerList } from "@/app/lib/definitions";

const Page = ({ params }: { params: { slug: string }}) => {
    console.log('params:', decodeURIComponent(params.slug));
    const [workInfo, setWorkInfo] = useState<WorkerList>({
        userName: '',
        totalOverTime: '',
        totalUnderWorkTime: '',
        workRecord: []
    });
    const getWorkerList = useWorkerListStore(state => state.getWorkerList);

    useEffect(() => {
        const userName = decodeURIComponent(params.slug)
        const workInfo = getWorkerList(userName)[0];
        // setWorkRecord(...workInfo);
        setWorkInfo(workInfo);
    }, [])

    return (
        <main className={'md:container mx-auto h-full flex flex-col justify-center items-center py-10'}>
            <div className={'h-12 w-full text-xl flex gap-5'}>
                <div>{workInfo.userName}</div>
                <div>차감 근무: {workInfo.totalUnderWorkTime}</div>
                <div>초과 근무: {workInfo.totalOverTime}</div>
            </div>
            <table className="w-full table-auto border border-indigo-600">
                <thead>
                <tr className={'bg-indigo-600 h-12'}>
                    <th>Department</th>
                    <th>Name</th>
                    <th>Date</th>
                    <th>Working Time</th>
                    <th>Leave Time</th>
                    <th>Over Time</th>
                </tr>
                </thead>
                <tbody>
                {workInfo.workRecord.map((record:any[], idx) => {
                    return (
                        <tr key={idx} className={'border border-indigo-500 h-8 hover:bg-indigo-500 cursor-pointer'}>
                            <td className="text-center align-middle">{record.department ? record.department : '--'}</td>
                            <td className="text-center align-middle">{record.name ? record.name : '--'}</td>
                            <td className="text-center align-middle">{record.date ? record.date : '--'}</td>
                            <td className="text-center align-middle">{record.workingTime ? record.workingTime : '--'}</td>
                            <td className="text-center align-middle">{record.leaveTime ? record.leaveTime : '--'}</td>
                            <td className="text-center align-middle">{record.overTime ? record.overTime : '--'}</td>
                        </tr>

                    )
                })}

                </tbody>
            </table>

        </main>
    )
}

export default Page;