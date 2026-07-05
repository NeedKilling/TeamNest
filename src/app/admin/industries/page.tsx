import { api } from "@/server/api"
import { IndustriesTable } from "./industries-table"

export default async function AdminIndustriesPage(){

    const industries = (await api.industries.get()).data 
    
    return(
            <IndustriesTable initialData = {industries!}/>
    )
}
