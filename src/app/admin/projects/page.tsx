import { api } from "@/server/api"
import { ProjectsTable } from "./projects-table"

export default async function AdminprojectsPage(){

    const projects = (await api.projects.get()).data 
    console.log(projects)
    return(
            <ProjectsTable initialData = {projects!}/>
    )
}