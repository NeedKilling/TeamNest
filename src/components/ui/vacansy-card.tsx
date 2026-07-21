import { Vacancy } from "@/lib/types/vacancy"
import { X } from "lucide-react"

// export default function VacancyCard({item,index,removeVacancy}:{item:vacancy, index: number, removeVacancy :(index:number) => void}){
export default function VacancyCard({vac,isSelected, onSelect}:{vac:Vacancy,isSelected: boolean,onSelect: () => void;}){
    return(
        <div  onClick = {onSelect} className={`w-fit p-4 border bg-gray-component flex flex-col gap-4 rounded-[16px] min-w-[286px]
            ${isSelected ? " border-[#0B76FA]" : "border-gray-border"}`}>
            <div className="flex flex-col">
                <div className="text-base text-tBlack-main">{vac.name}</div>
                <div className="text-base text-tGray-sub">{vac.city}</div>
            </div>
            <div className="text-base text-tGray-sub">{vac.description}</div>
        </div>
    )
}