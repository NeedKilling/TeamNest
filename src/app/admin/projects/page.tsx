import { ProjectsForm } from "./projects-form";
import { ProjectsList } from "./projects-list";

export default function ProjectsPage(){
    return(
        <div className="container h-[100vh] mx-auto bg-gray-300 flex flex-col align-center items-center gap-5">
            <h1>Projects</h1>
            <div className="flex gap-20">
                 <ProjectsList/>
                 <ProjectsForm/>
            </div>
           
        </div>
    )
}