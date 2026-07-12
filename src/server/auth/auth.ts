import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db";
import * as authSchema from "../db/auth-schema"


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
                fieldName: "last_name",         
                input: true,                     
                required: true,
                returned: true,                              
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
                })
            }
        }
    },

   


});

type Session = typeof auth.$Infer.Session