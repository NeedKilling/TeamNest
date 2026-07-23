import { api } from "@/server/api"
import { headers as nextHeaders} from "next/headers"
import ProjectList from "./projects-list"
export const dynamic = 'force-dynamic'

export default async function MyProjects(){

    const projects = (await api.projects["my-projects"].get({headers: await nextHeaders()})).data
    const favorite = (await api.favoriteProjects.get({headers: await nextHeaders()})).data

    return(
        <main className="flex-1 flex flex-col gap-5 ">
            <div className="border rounded-xl  p-5 bg-gray-component flex-1 flex justify-center">

                <ProjectList initialData={projects ?? []} favorite = {favorite ?? []}/>
            </div>
        </main>
    )
}