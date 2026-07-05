import { api } from "@/server/api"
import { SpecializationTable } from "./specialization-table"

export default async function AdminspecializationPage(){

    const specialization = (await api.specialization.get()).data 
    return(
            <SpecializationTable initialData = {specialization!}/>
    )
}
