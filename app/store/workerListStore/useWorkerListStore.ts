import { create } from 'zustand';
import {WorkerListStore, InfoEn, WorkerList} from '../../lib/definitions';


const initialState = {
    userName: '',
    totalOverTime: '',
    totalUnderWorkTime: '',
    workRecord: [],
}

export const useWorkerListStore = create<WorkerListStore>((set, get) => ({
    workerList: [],
    setWorkerList: (newState: WorkerList[]) => {
        console.log('newState :', newState);
        set(() => ({ workerList: newState }))
    },
    getWorkerList: (searchValue: string | null) => {
        console.log('searchValue: ', searchValue);
        if (!searchValue) return get().workerList;
        if (searchValue) {
            const workerList = get().workerList;
            return workerList.filter(worker => worker.userName === searchValue);
        }

    }
}));
