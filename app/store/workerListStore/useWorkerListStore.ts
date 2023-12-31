import { create } from 'zustand';
import { persist } from "zustand/middleware";
import {WorkerListStore, InfoEn, WorkerList} from '../../lib/definitions';


export const useWorkerListStore = create(persist<WorkerListStore>(
    (set, get) => ({
    workerList: [],
    setWorkerList: (newState: WorkerList[]) => {
        console.log('newState :', newState);
        set(() => ({ workerList: newState }))
    },
    getWorkerList: (searchValue: string | null) => {
        console.log('searchValue: ', searchValue, get().workerList);
        if (!searchValue) return get().workerList;
        if (searchValue) {
            const workerList = get().workerList;
            return workerList.filter(worker => worker.userName === searchValue);
        }

    }}),
    {
        name: "userIdStorage",
    })
);
