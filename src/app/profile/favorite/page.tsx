import { api } from "@/server/api"
import { headers as nextHeaders} from "next/headers"
import FavoriteProjectList from "./favorite-projects-list"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import FavoritePersonneList from "./favorite-personnel-list"


export default async function Favorite(){
    const favoriteProjects = (await api.favoriteProjects.get({headers: await nextHeaders()})).data
    const projects = favoriteProjects?.map((item)=>item.project)

    const favoritePersonnel = (await api.favoritePersonnel.get({headers: await nextHeaders()})).data
    const personnels = favoritePersonnel?.map((item)=>item.personnel)

     const myProjects = (await api.projects["my-projects"].get()).data
    return(
        <div className="flex-1 flex flex-col gap-5 ">
            <div className="border rounded-xl  p-5 bg-gray-component flex-1 flex justify-center">
                <Tabs defaultValue="projects" className="w-full gap-5">
                    <TabsList className="!h-[50px] shadow-custom3">
                        <TabsTrigger className="p-5 h-full text-base" value="projects">Проекты</TabsTrigger>
                        <TabsTrigger className="p-5 h-full text-base" value="personnel">Кадры</TabsTrigger>
                    </TabsList>

                    <TabsContent value="projects" className="flex justify-center">
                        <FavoriteProjectList initialData={projects ?? []} favorite = {favoriteProjects ?? []}/>
                    </TabsContent>
                    <TabsContent value="personnel" className="flex justify-center">
                        <FavoritePersonneList initialData={personnels ?? []} favorite = {favoritePersonnel ?? []} MyProjects={myProjects ?? []}/>
                    </TabsContent>
                </Tabs>
                
            </div>  
        </div>
        
    )
}