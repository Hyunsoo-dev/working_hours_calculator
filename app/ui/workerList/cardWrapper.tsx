'use client';
import { useState, useEffect } from 'react';
import Card from "@/app/ui/workerList/card";
import { useWorkerListStore } from "@/app/store/workerListStore/useWorkerListStore";

import { useSearchParams} from "next/navigation";
import {WorkerList} from "@/app/lib/definitions";

const CardWrapper = () => {

    const [workerList, setWorkerList] = useState<WorkerList[]>([]);
    const getWorkerList = useWorkerListStore(state => state.getWorkerList);
    const searchParams = useSearchParams();

    useEffect(() => {

        const userName = searchParams.get('userName');
        const workerList = getWorkerList(userName) as WorkerList[];
        setWorkerList((prevState) => [...prevState, ...workerList]);
    }, []);

    return (
        <main className={'flex flex-col justify-center items-center w-full h-full py-10 gap-y-8 overflow-y-auto'}>
            {workerList.map((worker: WorkerList, idx) => <Card key={idx} worker={worker}/>)}
        </main>)
}

export default CardWrapper;