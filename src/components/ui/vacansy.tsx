import { X } from "lucide-react"

type vacancy ={
  name: string,
  city: string,
  description: string
} 
export default function Vacancy({item,index,removeVacancy}:{item:vacancy, index: number, removeVacancy :(index:number) => void}){
    return(
        <div  className="w-full flex py-2 justify-between gap-3 items-center pl-4 rounded-4xl bg-gray-border shrink-0 relative pr-8">
        <div>{item.name}</div>
        <div>{item.city}</div>
            <button type="button" className="flex justify-center items-center shrink-0 absolute right-2" onClick={() => removeVacancy(index)}>
                <X className="text-tGray-sub" width={18} height={18} />
            </button>
        </div>
    )
}

