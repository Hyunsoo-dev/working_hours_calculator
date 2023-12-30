'use client';
import { useState, useEffect } from 'react';
import Card from "@/app/ui/workerList/card";
import { useWorkerListStore } from "@/app/store/workerListStore/useWorkerListStore";

import { useSearchParams} from "next/navigation";

const CardWrapper = () => {

    const [workerList, setWorkerList] = useState([]);
    const getWorkerList = useWorkerListStore(state => state.getWorkerList);
    const searchParams = useSearchParams();

    useEffect(() => {

        const userName = searchParams.get('userName');
        const workerList = getWorkerList(userName);
        setWorkerList(prevState => [...prevState, ...workerList]);
    }, []);

    return (
        <main className={'flex flex-col justify-center items-center w-full h-full py-10 gap-y-8 overflow-y-auto'}>
            {workerList.map((worker, idx) => <Card key={idx} worker={worker}/>)}
        </main>)
}

export default CardWrapper;