"use server"

import { db } from "@/database/drizzle"
import { books } from "@/database/schema"
import { config } from "dotenv"

// console.log("database url", config.env.databaseUrl)


export const createBook = async (params: BookParams)=> {
    try {
        const newBook = await db.insert(books).values({...params, availableCopies: params.totalCopies}).returning()

        return {
            success: true,
            data: JSON.parse(JSON.stringify(newBook))
        }

    } catch (error) {
        console.log(error, "book creating error")

        return {
            success: false,
            message: "An error occured while creating the book"
        }
    }
}