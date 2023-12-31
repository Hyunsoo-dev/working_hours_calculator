import { useRouter } from 'next/navigation';
import {WorkerList} from "@/app/lib/definitions";

const Card = ({worker}: {worker: WorkerList}) => {
    const router = useRouter();
    const onClickCard = () => {
        // router.push(`/detail/${worker.userName}`)
        console.log('worker.userName :', worker.userName);
        router.push(`/detail/${encodeURIComponent(worker.userName)}`);
    }
    //shadow-md shadow-indigo-400
    return <main onClick={onClickCard} className={'scroll-p-0 rounded bg-indigo-600 w-1/2 max-w-[300px] min-h-[100px] hover:bg-indigo-500 px-2 py-3 cursor-pointer'}>
        <div>{worker.userName}</div>
        <div className={'text-right'}>Under Work Time: {worker.totalUnderWorkTime}</div>
        <div className={'text-right'}>Over Time: {worker.totalOverTime}</div>

    </main>
}

export default Card;
