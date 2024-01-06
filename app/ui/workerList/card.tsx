import { useRouter } from "next/navigation";
import { WorkerList } from "@/app/lib/definitions";

const Card = ({ worker }: { worker: WorkerList }) => {
  const router = useRouter();

  const onClickCard = () => {
    // router.push(`/detail/${worker.userName}`)
    console.log("worker.userName :", worker.userName);
    router.push(`/detail/${encodeURIComponent(worker.userName)}`);
  };
  //shadow-md shadow-indigo-400
  return (
    <main
      onClick={onClickCard}
      className={
        "scroll-p-0 rounded bg-indigo-600 xl:w-1/2 w-full mx-2 max-w-[300px] min-h-[100px] hover:bg-indigo-500 px-2 py-3 cursor-pointer"
      }
    >
      <div>{worker.userName}</div>
      <div className={"w-full grid grid-cols-3"}>
        <div className={"text-right col-span-2"}>차감 근무:</div>
        <div className={"text-right col-span-1"}>
          {worker.totalUnderWorkTime}
        </div>
        <div className={"text-right col-span-2"}>초과 근무:</div>
        <div className={"text-right col-span-1"}>{worker.totalOverTime}</div>
        <div className={"text-right col-span-2"}>실 초과 근무 합계:</div>
        <div className={"text-right col-span-1"}>{worker.totalTime}</div>
        <div className={"text-right col-span-2"}>평균 근무 시간:</div>
        <div className={"text-right col-span-1"}>
          {worker.averageWorkingTime}
        </div>
        <div className={"mt-2 w-full grid grid-cols-subgrid col-span-3"}>
          <div className={"w-full text-right"}>{worker.vacation}</div>
        </div>
      </div>
    </main>
  );
};

export default Card;
