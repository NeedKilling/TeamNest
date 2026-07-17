import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db";
import * as authSchema from "../db/auth-schema"
import { personnel } from "../db/schema";
import {user as userTable}  from "../db/auth-schema"
import { eq } from "drizzle-orm";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
        schema: authSchema
    }) ,
    emailAndPassword:{
        enabled: true,
    },
    user:{
        additionalFields:{
            role:{
                type: "string",
                input: false,
                defaultValue: "user",
                
            },
            lastName: {                        
                type: "string",
                fieldName: "lastName",         
                input: true,                     
                required: true,
                returned: true,                              
            },
            personnelId: {                        
                type: "string",
                fieldName: "personnelId",         
                input: false,                     
                returned: true                             
            },
        }
    },

    databaseHooks:{
        user:{
            create:{
                before: async (user)=>({
                    data:{
                        ...user,
                        role:  user.email === process.env.MAIN_ADMIN_EMAIL ? "admin" : "user",
                    },
                }),
                after: async (user)=>{
                    const [newPersonnel] = await db.insert(personnel).values({userId: user.id}).returning({id:personnel.id})


                    await db.update(userTable).set({personnelId: newPersonnel.id}).where(eq(userTable.id, user.id))
                }
            }   
        }
    },

   


});

