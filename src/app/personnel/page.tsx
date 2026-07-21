
import { api } from "@/server/api"

import { headers as nextHeaders} from "next/headers"
import PersonnelClient from "./perssonnel-client"

export default async function Personnel(){

    const categories = (await api.categories.get()).data
    const specializations = (await api.specialization.get()).data

    const personnel = (await api.personnel["all"].get()).data


    const favorite = (await api.favoritePersonnel.get({headers: await nextHeaders()})).data
    // console.log(favorite)

    const myProjects = (await api.projects["my-projects"].get()).data

    return(
       <PersonnelClient categories={categories??[]} specializations={specializations??[]} personnel={personnel ?? []} favorite={favorite ?? []} MyProjects={myProjects ?? []}/>
    )
}