
import { api } from "@/server/api";

import { headers as nextHeaders} from "next/headers"
import ProjectsClient from "./projects-client";




export default async function Projects() {
    

    const projects = (await api.projects.get()).data; 


    const industries = (await api.industries.get()).data
    
    const favorite = (await api.favoriteProjects.get({headers: await nextHeaders()})).data
    console.log(favorite)

    return(
        <ProjectsClient  projects={projects!} favorite={favorite ?? []} industries={industries!}/>
    )
}