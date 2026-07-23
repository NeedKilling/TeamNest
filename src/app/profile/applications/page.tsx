import { api } from "@/server/api"
import {headers as nextHeaders} from "next/headers"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import MyApplicationsList from "./my-applications-list"
import MyInvitationsList from "./my-invitations-list"
import IncomingApplicationsList from "./incoming-applications-list"
import SentInvitationsList from "./sent-invitations-list"


export default  async function Applications(){

    const applications = (await api.applications.my.get({headers: await nextHeaders()})).data
    const invite = (await api.applications.invite.get({headers: await nextHeaders()})).data
    const myProjects = (await api.projects["my-projects"].get({headers: await nextHeaders()})).data
    return(
         <div className="flex-1 flex flex-col gap-5 ">
            <div className="border rounded-xl  p-5 bg-gray-component flex-1 flex justify-center">
                <Tabs defaultValue="myApplications" className="w-full gap-20"  >

                    <TabsList className="!h-[50px] md:shadow-custom3 flex-wrap !bg-gray-component !gap-5 md:!gap-0">
                        <TabsTrigger className="p-5 h-full w-1/2 md:w-full md:text-base " value="myApplications">Мои отклики</TabsTrigger>
                        <TabsTrigger className="p-5 h-full w-1/2  md:w-full md:text-base" value="invitations">Приглашения</TabsTrigger>
                        {myProjects&&myProjects.length > 0 && (
                            <>
                                <TabsTrigger className="p-5 w-1/2  md:w-full h-full md:text-base" value="incomingApplications">Откликнувшиейся</TabsTrigger>
                                <TabsTrigger className="p-5 w-1/2  md:w-full  h-full md:text-base" value="sentInvitations">Приглашенные</TabsTrigger>
                            </>
                        )}
                    </TabsList>
                    
    

                    <TabsContent value="myApplications">
                       <MyApplicationsList initialData={applications??[]}/>
                    </TabsContent>
                    <TabsContent value="invitations">
                       <MyInvitationsList initialData={applications??[]}/>
                    </TabsContent>
                    <TabsContent value="incomingApplications">
                        <IncomingApplicationsList initialData={invite??[]}/>
                    </TabsContent>
                    <TabsContent value="sentInvitations">
                        <SentInvitationsList initialData={invite??[]}/>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}