export type InfoKr = {
  IP: string;
  No: string;
  날짜: string;
  메모: string;
  부서: string;
  상태: string;
  이름: string;
  출근시간: string;
  "퇴근-출근시간": string;
  퇴근시간: string;
  [key: string]: string;
};

export type InfoEn = {
  ip: string;
  no: string;
  date: string;
  memo: string;
  department: string;
  state: string;
  name: string;
  workingTime: string;
  overTime: string;
  leaveTime: string;
};

export type WorkerList = {
  userName: string;
  totalOverTime: string;
  totalUnderWorkTime: string;
  totalTime: string;
  vacation: string;
  averageWorkingTime: string;
  workRecord: InfoEn[];
};

export interface WorkerListStore {
  workerList: WorkerList[];
  setWorkerList: (newState: WorkerList[]) => void;
  getWorkerList: (searchValue: string | null) => WorkerList[] | undefined;
}

export type Info = {};
