import { useRouter } from 'next/navigation';
import {WorkerList} from "@/app/lib/definitions";

const Card = ({worker}: {worker: WorkerList}) => {
    const router = useRouter();
    console.log('worker: ', worker);
    const onClickCard = () => {
        // router.push(`/detail/${worker.userName}`)
        console.log('worker.userName :', worker.userName);
        router.push(`/detail/${encodeURIComponent(worker.userName)}`);
    }
    //shadow-md shadow-indigo-400
    return <main onClick={onClickCard} className={'scroll-p-0 rounded bg-indigo-600 xl:w-1/2 w-full mx-2 max-w-[300px] min-h-[100px] hover:bg-indigo-500 px-2 py-3 cursor-pointer'}>
        <div>{worker.userName}</div>
        <div className={'text-right'}>차감 근무: {worker.totalUnderWorkTime}</div>
        <div className={'text-right'}>초과 근무: {worker.totalOverTime}</div>
        <div className={'text-right'}>근무 합계: {worker.totalTime}</div>
        <div className={'text-right'}>{worker.vacation}</div>
    </main>
}

export default Card;
