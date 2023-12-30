import { create } from 'zustand';
import { WorkerListStore, InfoEn } from '../../lib/definitions';


const initialState = {
    userName: '',
    totalOverTime: '',
    totalUnderWorkTime: '',
    workRecord: [],
}

export const useWorkerListStore = create<WorkerListStore>((set) => ({
    workerList: [],
    setWorkerList: newState => {
        console.log('newState :', newState);
        set((prevState) => ({ workerList: newState }))
    },
    getWorkerList: searchValue => {
        console.log('searchValue: ', searchValue);
        if (!searchValue) return useWorkerListStore.getState().workerList;
        if (searchValue) {
            const workerList = useWorkerListStore.getState().workerList;
            return workerList.filter(worker => worker.userName === searchValue);
        }

    }
}));
